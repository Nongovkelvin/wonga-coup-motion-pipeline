// grids <video> <out.bin> : 64x36 luma grid (UInt8) per frame, sequential
import AVFoundation
let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let track = asset.tracks(withMediaType: .video).first!
let reader = try! AVAssetReader(asset: asset)
let out = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
out.alwaysCopiesSampleData = false; reader.add(out); reader.startReading()
var d = Data(); var n = 0
while let sb = out.copyNextSampleBuffer() {
  guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
  CVPixelBufferLockBaseAddress(pb, .readOnly)
  let w = CVPixelBufferGetWidthOfPlane(pb, 0), h = CVPixelBufferGetHeightOfPlane(pb, 0), bpr = CVPixelBufferGetBytesPerRowOfPlane(pb, 0)
  let base = CVPixelBufferGetBaseAddressOfPlane(pb, 0)!.assumingMemoryBound(to: UInt8.self)
  var g = [UInt8](repeating: 0, count: 2304)
  for gy in 0..<36 { for gx in 0..<64 {   // 4x4 box average around each grid point
    var s = 0; let cy = gy * h / 36 + h / 72, cx = gx * w / 64 + w / 128
    for dy in -2..<2 { for dx in -2..<2 { s += Int(base[(cy + dy * h / 1080) * bpr + cx + dx * w / 1920]) } }
    g[gy*64+gx] = UInt8(s / 16) } }
  CVPixelBufferUnlockBaseAddress(pb, .readOnly); d.append(contentsOf: g); n += 1
}
try! d.write(to: URL(fileURLWithPath: a[2])); print(a[2], n)
