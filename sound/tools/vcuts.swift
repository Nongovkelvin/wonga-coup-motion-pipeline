// vcuts <video> : prints "t diff" per frame (mean abs luma diff on a 64x36 grid, 0..255) for every frame
import AVFoundation
let url = URL(fileURLWithPath: CommandLine.arguments[1])
let asset = AVURLAsset(url: url)
let sem = DispatchSemaphore(value: 0)
var track: AVAssetTrack!
Task { track = try! await asset.loadTracks(withMediaType: .video).first!; sem.signal() }
sem.wait()
let reader = try! AVAssetReader(asset: asset)
let out = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
out.alwaysCopiesSampleData = false
reader.add(out); reader.startReading()
var prev = [Double](repeating: -1, count: 64*36)
var s = ""
while let sb = out.copyNextSampleBuffer() {
  guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
  let t = CMSampleBufferGetPresentationTimeStamp(sb).seconds
  CVPixelBufferLockBaseAddress(pb, .readOnly)
  let w = CVPixelBufferGetWidthOfPlane(pb, 0), h = CVPixelBufferGetHeightOfPlane(pb, 0), bpr = CVPixelBufferGetBytesPerRowOfPlane(pb, 0)
  let base = CVPixelBufferGetBaseAddressOfPlane(pb, 0)!.assumingMemoryBound(to: UInt8.self)
  var cur = [Double](repeating: 0, count: 64*36); var d = 0.0; var sum = 0.0
  for gy in 0..<36 { for gx in 0..<64 {
    let v = Double(base[(gy * h / 36 + h / 72) * bpr + gx * w / 64 + w / 128]); cur[gy*64+gx] = v; sum += v
    if prev[0] >= 0 { d += abs(v - prev[gy*64+gx]) } } }
  CVPixelBufferUnlockBaseAddress(pb, .readOnly)
  if prev[0] >= 0 { s += String(format: "%.3f %.2f %.1f\n", t, d / Double(64*36), sum / Double(64*36)) }
  prev = cur
}
print(s, terminator: "")
