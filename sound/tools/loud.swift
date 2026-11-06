// loud <wav 48k s16 stereo> <out.csv>
// BS.1770 integrated LUFS + true-ish sample peak, plus a per-0.5s CSV:
// t, momentary LUFS (400ms), short-term LUFS (3s), low(<150Hz) dB, mid dB, high(>5k) dB, peak dBFS
import Foundation
import AVFoundation

let args = CommandLine.arguments
let url = URL(fileURLWithPath: args[1])
let f = try! AVAudioFile(forReading: url)
let sr = f.processingFormat.sampleRate
let ch = Int(f.processingFormat.channelCount)
let n = Int(f.length)
let buf = AVAudioPCMBuffer(pcmFormat: f.processingFormat, frameCapacity: AVAudioFrameCount(n))!
try! f.read(into: buf)
let data = buf.floatChannelData!

struct BQ { var b0, b1, b2, a1, a2: Double; var z1 = 0.0, z2 = 0.0
  mutating func run(_ x: Double) -> Double { let y = b0*x + z1; z1 = b1*x - a1*y + z2; z2 = b2*x - a2*y; return y } }
// BS.1770 48 kHz coefficients
func kw() -> (BQ, BQ) {
  (BQ(b0: 1.53512485958697, b1: -2.69169618940638, b2: 1.19839281085285, a1: -1.69065929318241, a2: 0.73248077421585),
   BQ(b0: 1.0, b1: -2.0, b2: 1.0, a1: -1.99004745483398, a2: 0.99007225036621))
}
let hop = Int(sr / 10) // 100 ms
let nh = n / hop
var kE = [Double](repeating: 0, count: nh)   // K-weighted energy sum per hop
var lowE = kE, midE = kE, highE = kE, pk = kE
var peakAll = 0.0
for c in 0..<ch {
  var (s1, s2) = kw()
  var lp = 0.0, lp5 = 0.0
  let aL = exp(-2 * Double.pi * 150 / sr), aH = exp(-2 * Double.pi * 5000 / sr)
  let p = data[c]
  for h in 0..<nh {
    var e = 0.0, el = 0.0, em = 0.0, eh = 0.0, m = 0.0
    for i in (h*hop)..<((h+1)*hop) {
      let x = Double(p[i]); let ax = abs(x); if ax > m { m = ax }
      let y = s2.run(s1.run(x)); e += y*y
      lp = (1-aL)*x + aL*lp; lp5 = (1-aH)*x + aH*lp5
      el += lp*lp; eh += (x-lp5)*(x-lp5); let mm = lp5 - lp; em += mm*mm
    }
    kE[h] += e; lowE[h] += el; midE[h] += em; highE[h] += eh; if m > pk[h] { pk[h] = m }; if m > peakAll { peakAll = m }
  }
}
func lufs(_ e: Double, _ samples: Int) -> Double { -0.691 + 10 * log10(max(e / Double(samples), 1e-12)) }
func db(_ e: Double, _ samples: Int) -> Double { 10 * log10(max(e / Double(samples), 1e-12)) }
// integrated (gated) over 400 ms blocks, 75% overlap
var blocks: [Double] = []
var h = 0
while h + 4 <= nh { var e = 0.0; for k in h..<(h+4) { e += kE[k] }; blocks.append(e); h += 1 }
let bl = blocks.map { lufs($0, 4*hop) }
let abs1 = zip(blocks, bl).filter { $0.1 > -70 }
let rel = lufs(abs1.map{$0.0}.reduce(0,+) / Double(max(abs1.count,1)), 4*hop) - 10
let g = zip(blocks, bl).filter { $0.1 > rel }
let I = lufs(g.map{$0.0}.reduce(0,+) / Double(max(g.count,1)), 4*hop)
print(String(format: "duration %.1f s  integrated %.1f LUFS  sample peak %.1f dBFS", Double(n)/sr, I, 20*log10(peakAll)))
var out = "t,M,S,low,mid,high,peak\n"
var t = 0
while t + 30 <= nh {
  let m = (t..<(t+4)).map{kE[$0]}.reduce(0,+); let s = (t..<(t+30)).map{kE[$0]}.reduce(0,+)
  let l = (t..<(t+5)).map{lowE[$0]}.reduce(0,+), md = (t..<(t+5)).map{midE[$0]}.reduce(0,+), hi = (t..<(t+5)).map{highE[$0]}.reduce(0,+)
  let p = (t..<(t+5)).map{pk[$0]}.max()!
  out += String(format: "%.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f\n", Double(t)/10, lufs(m, 4*hop), lufs(s, 30*hop), db(l,5*hop*ch), db(md,5*hop*ch), db(hi,5*hop*ch), 20*log10(max(p,1e-6)))
  t += 5
}
try! out.write(toFile: args[2], atomically: true, encoding: .utf8)
