// grab <video> <out_prefix> <t...> : PNG frames (960 wide) at exact times
import AVFoundation; import CoreGraphics; import ImageIO; import UniformTypeIdentifiers
let a = CommandLine.arguments; let g = AVAssetImageGenerator(asset: AVURLAsset(url: URL(fileURLWithPath: a[1])))
g.requestedTimeToleranceBefore = .zero; g.requestedTimeToleranceAfter = .zero; g.maximumSize = CGSize(width: 960, height: 540)
for t in a.dropFirst(3) { let im = try! g.copyCGImage(at: CMTime(seconds: Double(t)!, preferredTimescale: 24000), actualTime: nil)
  let u = URL(fileURLWithPath: a[2] + "_" + t + ".png"); let d = CGImageDestinationCreateWithURL(u as CFURL, UTType.png.identifier as CFString, 1, nil)!
  CGImageDestinationAddImage(d, im, nil); CGImageDestinationFinalize(d) }
