// mixr probe <files...>            -> "peak_dBFS LUFS dur path" per file (resampled to 48 kHz stereo)
// mixr mix <clips.json> <total_s> [stem,stem...] [out.wav]
//   clips.json: [{"file":..,"start":s,"in":s,"dur":s,"stem":"vo|music|sfx|amb","gains":[[t,dB],...]}]  (t = seconds from clip start)
//   prints integrated LUFS, sample peak, max short-term, and a per-minute short-term summary
import Foundation
import AVFoundation

let SR = 48000.0
func load(_ path: String) -> [[Float]] {
  let f = try! AVAudioFile(forReading: URL(fileURLWithPath: path))
  let inF = f.processingFormat
  let n = AVAudioFrameCount(f.length)
  let ib = AVAudioPCMBuffer(pcmFormat: inF, frameCapacity: n)!
  try! f.read(into: ib)
  var chans: [[Float]] = []
  let ch = Int(inF.channelCount)
  for c in 0..<min(ch, 2) { chans.append(Array(UnsafeBufferPointer(start: ib.floatChannelData![c], count: Int(ib.frameLength)))) }
  if chans.count == 1 { chans.append(chans[0]) }
  if inF.sampleRate == SR { return chans }
  // resample with AVAudioConverter
  let src = AVAudioFormat(standardFormatWithSampleRate: inF.sampleRate, channels: 2)!
  let dst = AVAudioFormat(standardFormatWithSampleRate: SR, channels: 2)!
  let sb = AVAudioPCMBuffer(pcmFormat: src, frameCapacity: AVAudioFrameCount(chans[0].count))!
  sb.frameLength = AVAudioFrameCount(chans[0].count)
  for c in 0..<2 { chans[c].withUnsafeBufferPointer { sb.floatChannelData![c].update(from: $0.baseAddress!, count: chans[c].count) } }
  let conv = AVAudioConverter(from: src, to: dst)!
  let outCap = AVAudioFrameCount(Double(chans[0].count) * SR / inF.sampleRate + 1024)
  let ob = AVAudioPCMBuffer(pcmFormat: dst, frameCapacity: outCap)!
  var done = false
  var err: NSError?
  conv.convert(to: ob, error: &err) { _, st in if done { st.pointee = .endOfStream; return nil }; done = true; st.pointee = .haveData; return sb }
  return (0..<2).map { Array(UnsafeBufferPointer(start: ob.floatChannelData![$0], count: Int(ob.frameLength))) }
}
struct BQ { var b0, b1, b2, a1, a2: Double; var z1 = 0.0, z2 = 0.0
  mutating func run(_ x: Double) -> Double { let y = b0*x + z1; z1 = b1*x - a1*y + z2; z2 = b2*x - a2*y; return y } }
func kBlocks(_ L: [Float], _ R: [Float]) -> [Double] { // energy per 100 ms
  let hop = 4800; let nh = L.count / hop; var e = [Double](repeating: 0, count: nh)
  for chn in [L, R] {
    var s1 = BQ(b0: 1.53512485958697, b1: -2.69169618940638, b2: 1.19839281085285, a1: -1.69065929318241, a2: 0.73248077421585)
    var s2 = BQ(b0: 1.0, b1: -2.0, b2: 1.0, a1: -1.99004745483398, a2: 0.99007225036621)
    for h in 0..<nh { var acc = 0.0; for i in (h*hop)..<((h+1)*hop) { let y = s2.run(s1.run(Double(chn[i]))); acc += y*y }; e[h] += acc } }
  return e
}
func lufs(_ e: Double, _ n: Int) -> Double { -0.691 + 10 * log10(max(e / Double(n), 1e-12)) }
func integrated(_ e: [Double]) -> Double {
  var bl: [Double] = []; var h = 0; while h + 4 <= e.count { bl.append(e[h..<(h+4)].reduce(0, +)); h += 1 }
  let L = bl.map { lufs($0, 4*4800) }
  let a = zip(bl, L).filter { $0.1 > -70 }; if a.isEmpty { return -99 }
  let rel = lufs(a.map { $0.0 }.reduce(0, +) / Double(a.count), 4*4800) - 10
  let g = zip(bl, L).filter { $0.1 > rel }
  return lufs(g.map { $0.0 }.reduce(0, +) / Double(max(g.count, 1)), 4*4800)
}
let a = CommandLine.arguments
if a[1] == "probe" {
  for p in a.dropFirst(2) { let c = load(p); let pk = max(c[0].map { abs($0) }.max() ?? 0, c[1].map { abs($0) }.max() ?? 0)
    print(String(format: "%.1f %.1f %.2f %@", 20*log10(max(Double(pk), 1e-9)), integrated(kBlocks(c[0], c[1])), Double(c[0].count)/SR, p)) }
  exit(0)
}
struct Clip: Decodable { let file: String; let start: Double; let `in`: Double; let dur: Double; let stem: String; let gains: [[Double]] }
let clips = try! JSONDecoder().decode([Clip].self, from: Data(contentsOf: URL(fileURLWithPath: a[2])))
let total = Int(Double(a[3])! * SR)
let stems = a.count > 4 && a[4] != "all" ? Set(a[4].split(separator: ",").map(String.init)) : nil
var L = [Float](repeating: 0, count: total), R = L
var cache: [String: [[Float]]] = [:]
for c in clips where stems == nil || stems!.contains(c.stem) {
  if cache[c.file] == nil { if cache.count > 6 { cache.removeAll() }; cache[c.file] = load(c.file) }
  let s = cache[c.file]!; let i0 = Int(c.in * SR), o0 = Int(c.start * SR), n = Int(c.dur * SR)
  let g = c.gains.isEmpty ? [[0.0, 0.0]] : c.gains
  var k = 0
  for i in 0..<n {
    let si = i0 + i, oi = o0 + i; if si >= s[0].count || oi >= total || oi < 0 { continue }
    let t = Double(i) / SR
    while k + 1 < g.count && g[k+1][0] <= t { k += 1 }
    var db = g[k][1]; if k + 1 < g.count && t > g[k][0] { let f = (t - g[k][0]) / (g[k+1][0] - g[k][0]); db = g[k][1] + f * (g[k+1][1] - g[k][1]) }
    let lin = Float(pow(10, db / 20)); L[oi] += s[0][si] * lin; R[oi] += s[1][si] * lin
  }
}
if let lim = ProcessInfo.processInfo.environment["LIMIT_DB"].flatMap(Double.init) {
  let ceil = Float(pow(10, lim / 20)); let la = 240; var g: Float = 1; let rel = Float(exp(-1.0 / (0.1 * SR)))
  var red = 0
  for i in 0..<total {
    var pk: Float = 0; let j1 = min(total, i + la)
    if i % 48 == 0 { for j in i..<j1 { pk = max(pk, abs(L[j]), abs(R[j])) }; let want = pk > ceil ? ceil / pk : 1; if want < g { g = want; red += 1 } }
    L[i] *= g; R[i] *= g; g = 1 - (1 - g) * rel
    if abs(L[i]) > ceil { L[i] = L[i] > 0 ? ceil : -ceil }; if abs(R[i]) > ceil { R[i] = R[i] > 0 ? ceil : -ceil }
  }
  print("limiter engaged blocks:", red)
}
if ProcessInfo.processInfo.environment["PHONE"] != nil {
  func hp(_ f: Double) -> BQ { let w = 2 * Double.pi * f / SR, al = sin(w) / (2*0.7071), c = cos(w), a0 = 1 + al
    return BQ(b0: (1+c)/2/a0, b1: -(1+c)/a0, b2: (1+c)/2/a0, a1: -2*c/a0, a2: (1-al)/a0) }
  func lp(_ f: Double) -> BQ { let w = 2 * Double.pi * f / SR, al = sin(w) / (2*0.7071), c = cos(w), a0 = 1 + al
    return BQ(b0: (1-c)/2/a0, b1: (1-c)/a0, b2: (1-c)/2/a0, a1: -2*c/a0, a2: (1-al)/a0) }
  for k in 0..<2 { var f = [hp(300), hp(300), lp(5000), lp(5000)]
    for i in 0..<total { var x = Double(k == 0 ? L[i] : R[i]); for j in 0..<4 { x = f[j].run(x) }; if k == 0 { L[i] = Float(x) } else { R[i] = Float(x) } } }
  print("phone-speaker band 300 Hz-5 kHz")
}
let e = kBlocks(L, R)
let pk = max(L.map { abs($0) }.max()!, R.map { abs($0) }.max()!)
var st: [Double] = []; var h = 0; while h + 30 <= e.count { st.append(lufs(e[h..<(h+30)].reduce(0, +), 30*4800)); h += 5 }
print(String(format: "integrated %.1f LUFS  sample peak %.1f dBFS  max short-term %.1f", integrated(e), 20*log10(Double(pk)), st.max() ?? -99))
var line = ""; for m in stride(from: 0, to: st.count, by: 120) { let w = st[m..<min(m+120, st.count)].sorted(); line += String(format: "%d:%.0f ", m/120, w[w.count/2]) }; print("median short-term per minute:", line)
if a.count > 5 {
  let fmt = AVAudioFormat(commonFormat: .pcmFormatInt16, sampleRate: SR, channels: 2, interleaved: true)!
  let of = try! AVAudioFile(forWriting: URL(fileURLWithPath: a[5]), settings: fmt.settings, commonFormat: .pcmFormatFloat32, interleaved: false)
  let b = AVAudioPCMBuffer(pcmFormat: of.processingFormat, frameCapacity: AVAudioFrameCount(total))!; b.frameLength = AVAudioFrameCount(total)
  L.withUnsafeBufferPointer { b.floatChannelData![0].update(from: $0.baseAddress!, count: total) }
  R.withUnsafeBufferPointer { b.floatChannelData![1].update(from: $0.baseAddress!, count: total) }
  try! of.write(from: b)
}
