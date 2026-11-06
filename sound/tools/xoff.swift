// xoff <fc.wav> <master.wav> <expected_start_s> : best lag (ms) overall and per 20 s window, 10 ms envelope correlation
import AVFoundation
func env(_ p: String) -> [Double] {
  let f = try! AVAudioFile(forReading: URL(fileURLWithPath: p)); let b = AVAudioPCMBuffer(pcmFormat: f.processingFormat, frameCapacity: AVAudioFrameCount(f.length))!; try! f.read(into: b)
  let n = Int(b.frameLength), hop = 480; var e: [Double] = []
  let L = b.floatChannelData![0], R = b.floatChannelData![1 % Int(f.processingFormat.channelCount)]
  var i = 0; while i + hop <= n { var s = 0.0; for j in i..<(i+hop) { let x = Double(L[j] + R[j]); s += x*x }; e.append(log10(s / Double(hop) + 1e-9)); i += hop }
  return e }
let a = CommandLine.arguments; let F = env(a[1]), M = env(a[2]); let st = Int((Double(a[3])! * 100).rounded())
func corr(_ m0: Int, _ m1: Int, _ lag: Int) -> Double {
  var sx = 0.0, sy = 0.0, sxx = 0.0, syy = 0.0, sxy = 0.0, n = 0.0
  for k in m0..<m1 { let j = st + k + lag; if j < 0 || j >= F.count { continue }; let x = M[k], y = F[j]; sx += x; sy += y; sxx += x*x; syy += y*y; sxy += x*y; n += 1 }
  let c = (sxy - sx*sy/n) / sqrt(max((sxx - sx*sx/n) * (syy - sy*sy/n), 1e-12)); return c }
func best(_ m0: Int, _ m1: Int) -> (Int, Double) { var bl = 0, bc = -2.0; for lag in -150...150 { let c = corr(m0, m1, lag); if c > bc { bc = c; bl = lag } }; return (bl, bc) }
let (l, c) = best(0, M.count); print(String(format: "overall lag %+d ms corr %.3f", l * 10, c))
var w = 0; var line = ""
while w + 2000 <= M.count { let (l2, c2) = best(w, w + 2000); line += String(format: "%d:%+d(%.2f) ", w / 100, l2 * 10, c2); w += 2000 }
print(line)
