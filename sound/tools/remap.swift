// remap <old.bin> <new.bin> : reads old local frame numbers (one per line) on stdin.
// For each, finds where the 6 frames after it (A) and the 6 frames before it (B) sit in the new master.
// Prints: k  jA sA  jB sB  cutA  amb   (s = mean abs luma diff per grid cell; cutA = diff new[jA-1] vs new[jA];
// amb = how many distinct places (>1 s apart) score within 1.0 of the best A score)
import Foundation
let a = CommandLine.arguments
let O = [UInt8](try! Data(contentsOf: URL(fileURLWithPath: a[1]))), N = [UInt8](try! Data(contentsOf: URL(fileURLWithPath: a[2])))
let G = 2304, no = O.count / G, nn = N.count / G
// subsample: every other cell
func d(_ x: [UInt8], _ i: Int, _ y: [UInt8], _ j: Int) -> Double {
  if i < 0 || j < 0 || i >= x.count / G || j >= y.count / G { return 255 }
  var s = 0; var k = 0; let bi = i * G, bj = j * G
  while k < G { s += abs(Int(x[bi + k]) - Int(y[bj + k])); k += 2 }
  return Double(s) / Double(G / 2)
}
let ratio = Double(nn) / Double(no)
while let line = readLine() {
  guard let k = Int(line.trimmingCharacters(in: .whitespaces)) else { continue }
  let exp = Int(Double(k) * ratio)
  func search(_ offs: [Int]) -> (Int, Double, Int) {
    var sc = [Double](repeating: 1e9, count: nn)
    for j in 0..<nn {
      var s = 0.0
      for o in offs { s += d(O, k + o, N, j + o); if s > 40 * Double(offs.count) { break } }
      sc[j] = s / Double(offs.count)
    }
    let best = sc.min()!
    // among near-best, prefer nearest the expected position
    var bj = -1; var bd = Int.max
    for j in 0..<nn where sc[j] <= best + 0.5 { let dd = abs(j - exp); if dd < bd { bd = dd; bj = j } }
    // ambiguity: distinct clusters within 1.0 of best
    var amb = 0; var last = -100
    for j in 0..<nn where sc[j] <= best + 1.0 { if j - last > 24 { amb += 1 }; last = j }
    return (bj, sc[bj], amb)
  }
  let (ja, sa, amb) = search([0, 1, 2, 3, 4, 5])
  let (jb, sb, _) = search([-6, -5, -4, -3, -2, -1])
  let cut = ja > 0 ? d(N, ja - 1, N, ja) : 0
  print(String(format: "%d %d %.2f %d %.2f %.2f %d", k, ja, sa, jb, sb, cut, amb))
}
