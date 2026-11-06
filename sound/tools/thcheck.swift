// thcheck <firstcut.bin> <master.bin> <start_frame> : finds stretches where the master shows the first cut picture
// and reports, per stretch, film times, mean diff at offset 0 and the best offset in frames (-4..4)
import Foundation
let a = CommandLine.arguments
let F = try! Data(contentsOf: URL(fileURLWithPath: a[1])), M = try! Data(contentsOf: URL(fileURLWithPath: a[2]))
let s0 = Int(a[3])!, G = 2304, nf = F.count / G, nm = M.count / G, fps = 24000.0 / 1001
func diff(_ i: Int, _ j: Int) -> Double { if j < 0 || j >= nf { return 255 }
  var s = 0; F.withUnsafeBytes { fb in M.withUnsafeBytes { mb in let f = fb.bindMemory(to: UInt8.self), m = mb.bindMemory(to: UInt8.self)
    for k in 0..<G { s += abs(Int(f[j*G+k]) - Int(m[i*G+k])) } } }; return Double(s) / Double(G) }
var d0 = [Double](repeating: 0, count: nm); for i in 0..<nm { d0[i] = diff(i, s0 + i) }
let TH = 6.0
var i = 0
while i < nm {
  if d0[i] < TH { var j = i; while j + 1 < nm && d0[j + 1] < TH { j += 1 }
    if j - i >= 12 {   // at least half a second
      var tot = [Double](repeating: 0, count: 9); var cnt = 0
      for k in stride(from: i, through: j, by: 2) { for o in -4...4 { tot[o + 4] += diff(k, s0 + k + o) }; cnt += 1 }
      let best = tot.enumerated().min(by: { $0.1 < $1.1 })!
      let mean0 = d0[i...j].reduce(0, +) / Double(j - i + 1)
      print(String(format: "film %7.2f-%7.2f (%5.2f s)  master %6.2f  diff@0 %.2f  best offset %+d fr (%.2f)", Double(s0 + i) / fps, Double(s0 + j + 1) / fps, Double(j - i + 1) / fps, Double(i) / fps, mean0, best.0 - 4, best.1 / Double(cnt)))
    }
    i = j + 1 } else { i += 1 }
}
