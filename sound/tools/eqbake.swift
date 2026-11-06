// eqbake <in.wav> <out.wav> <in_s> <dur_s> <film_start_s> <vo_mask.txt>
// Writes the clip region as 48 kHz stereo 24-bit with a 60 Hz high-pass (12 dB/oct, applied twice = 24 dB/oct)
// and a peaking dip of -4 dB at 2.5 kHz (Q 0.7, covers ~1.5-4 kHz) that fades in while the VO speaks.
// vo_mask.txt: one 0/1 per 0.1 s of film time (1 = voice active).
import Foundation
import AVFoundation
let SR = 48000.0
let a = CommandLine.arguments
func load(_ path: String) -> [[Float]] {
  let f = try! AVAudioFile(forReading: URL(fileURLWithPath: path))
  let inF = f.processingFormat
  let ib = AVAudioPCMBuffer(pcmFormat: inF, frameCapacity: AVAudioFrameCount(f.length))!
  try! f.read(into: ib)
  var ch: [[Float]] = []
  for c in 0..<min(Int(inF.channelCount), 2) { ch.append(Array(UnsafeBufferPointer(start: ib.floatChannelData![c], count: Int(ib.frameLength)))) }
  if ch.count == 1 { ch.append(ch[0]) }
  if inF.sampleRate == SR { return ch }
  let src = AVAudioFormat(standardFormatWithSampleRate: inF.sampleRate, channels: 2)!
  let dst = AVAudioFormat(standardFormatWithSampleRate: SR, channels: 2)!
  let sb = AVAudioPCMBuffer(pcmFormat: src, frameCapacity: AVAudioFrameCount(ch[0].count))!; sb.frameLength = AVAudioFrameCount(ch[0].count)
  for c in 0..<2 { ch[c].withUnsafeBufferPointer { sb.floatChannelData![c].update(from: $0.baseAddress!, count: ch[c].count) } }
  let conv = AVAudioConverter(from: src, to: dst)!
  let ob = AVAudioPCMBuffer(pcmFormat: dst, frameCapacity: AVAudioFrameCount(Double(ch[0].count) * SR / inF.sampleRate + 1024))!
  var done = false; var err: NSError?
  conv.convert(to: ob, error: &err) { _, st in if done { st.pointee = .endOfStream; return nil }; done = true; st.pointee = .haveData; return sb }
  return (0..<2).map { Array(UnsafeBufferPointer(start: ob.floatChannelData![$0], count: Int(ob.frameLength))) }
}
struct BQ { var b0, b1, b2, a1, a2: Double; var z1 = 0.0, z2 = 0.0
  mutating func run(_ x: Double) -> Double { let y = b0*x + z1; z1 = b1*x - a1*y + z2; z2 = b2*x - a2*y; return y } }
func hp(_ f: Double, _ q: Double) -> BQ { let w = 2 * Double.pi * f / SR, al = sin(w) / (2*q), c = cos(w), a0 = 1 + al
  return BQ(b0: (1+c)/2/a0, b1: -(1+c)/a0, b2: (1+c)/2/a0, a1: -2*c/a0, a2: (1-al)/a0) }
func peak(_ f: Double, _ q: Double, _ db: Double) -> BQ { let A = pow(10, db/40), w = 2 * Double.pi * f / SR, al = sin(w)/(2*q), c = cos(w), a0 = 1 + al/A
  return BQ(b0: (1+al*A)/a0, b1: -2*c/a0, b2: (1-al*A)/a0, a1: -2*c/a0, a2: (1-al/A)/a0) }
let src = load(a[1])
let i0 = Int(Double(a[3])! * SR), n = Int(Double(a[4])! * SR), film0 = Double(a[5])!
let mask = try! String(contentsOfFile: a[6]).split(separator: "\n").map { Double($0)! }
var out = [[Float]](repeating: [Float](repeating: 0, count: n), count: 2)
let att = exp(-1.0 / (0.15 * SR)), rel = exp(-1.0 / (0.35 * SR))
for c in 0..<2 {
  var h1 = hp(60, 0.7071), h2 = hp(60, 0.7071); var pk = peak(2500, 0.7, -4)
  var env = 0.0
  for i in 0..<n {
    let si = i0 + i; let x = si < src[c].count ? Double(src[c][si]) : 0
    let y0 = h2.run(h1.run(x))
    let yd = pk.run(y0)
    let mi = Int((film0 + Double(i) / SR) * 10); let target = (mi >= 0 && mi < mask.count) ? mask[mi] : 0
    env = target > env ? target + (env - target) * att : target + (env - target) * rel
    out[c][i] = Float(y0 + env * (yd - y0))
  }
}
let fmt = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: SR, channels: 2, interleaved: false)!
let settings: [String: Any] = [AVFormatIDKey: kAudioFormatLinearPCM, AVSampleRateKey: SR, AVNumberOfChannelsKey: 2, AVLinearPCMBitDepthKey: 24, AVLinearPCMIsFloatKey: false, AVLinearPCMIsBigEndianKey: false]
func writeOut() {
let of = try! AVAudioFile(forWriting: URL(fileURLWithPath: a[2]), settings: settings, commonFormat: .pcmFormatFloat32, interleaved: false)
let b = AVAudioPCMBuffer(pcmFormat: fmt, frameCapacity: AVAudioFrameCount(n))!; b.frameLength = AVAudioFrameCount(n)
for c in 0..<2 { out[c].withUnsafeBufferPointer { b.floatChannelData![c].update(from: $0.baseAddress!, count: n) } }
try! of.write(from: b)
}
writeOut()
