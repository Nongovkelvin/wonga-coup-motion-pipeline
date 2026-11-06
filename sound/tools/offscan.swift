// offscan <firstcut.bin> <master.bin> <start_frame> <film_t...> : for each film time, best first-cut offset in -120..120 frames
import Foundation
let a = CommandLine.arguments
let F = try! Data(contentsOf: URL(fileURLWithPath: a[1])), M = try! Data(contentsOf: URL(fileURLWithPath: a[2]))
let s0 = Int(a[3])!, G = 2304, nf = F.count / G, fps = 24000.0 / 1001
func diff(_ i: Int, _ j: Int) -> Double { if j < 0 || j >= nf { return 255 }
  var s = 0; F.withUnsafeBytes { fb in M.withUnsafeBytes { mb in let f = fb.bindMemory(to: UInt8.self), m = mb.bindMemory(to: UInt8.self)
    for k in 0..<G { s += abs(Int(f[j*G+k]) - Int(m[i*G+k])) } } }; return Double(s) / Double(G) }
for t in a.dropFirst(4) { let i = Int((Double(t)! * fps).rounded()) - s0
  var best = (0, 999.0); for o in -120...120 { var d = 0.0; for k in 0..<5 { d += diff(i + k * 6, s0 + i + k * 6 + o) }; if d / 5 < best.1 { best = (o, d / 5) } }
  print(String(format: "film %.2f  best offset %+d fr  diff %.2f   diff@-1 %.2f", Double(t)!, best.0, best.1, diff(i, s0 + i - 1))) }
