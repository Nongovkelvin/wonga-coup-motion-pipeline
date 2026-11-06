// dec <movie> <out.wav> : decode the audio track to 48 kHz stereo 16-bit WAV
import AVFoundation
let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let tr = asset.tracks(withMediaType: .audio).first!
let r = try! AVAssetReader(asset: asset)
let set: [String: Any] = [AVFormatIDKey: kAudioFormatLinearPCM, AVSampleRateKey: 48000, AVNumberOfChannelsKey: 2, AVLinearPCMBitDepthKey: 16, AVLinearPCMIsFloatKey: false, AVLinearPCMIsBigEndianKey: false, AVLinearPCMIsNonInterleaved: false]
let o = AVAssetReaderTrackOutput(track: tr, outputSettings: set); r.add(o); r.startReading()
var data = Data()
while let sb = o.copyNextSampleBuffer() { if let bb = CMSampleBufferGetDataBuffer(sb) { var len = 0; var p: UnsafeMutablePointer<Int8>?; CMBlockBufferGetDataPointer(bb, atOffset: 0, lengthAtOffsetOut: nil, totalLengthOut: &len, dataPointerOut: &p); data.append(UnsafeBufferPointer(start: UnsafeRawPointer(p!).assumingMemoryBound(to: UInt8.self), count: len)) } }
var h = Data(); func u32(_ v: UInt32) { var x = v.littleEndian; h.append(Data(bytes: &x, count: 4)) }; func u16(_ v: UInt16) { var x = v.littleEndian; h.append(Data(bytes: &x, count: 2)) }
h.append("RIFF".data(using: .ascii)!); u32(UInt32(36 + data.count)); h.append("WAVEfmt ".data(using: .ascii)!); u32(16); u16(1); u16(2); u32(48000); u32(192000); u16(4); u16(16)
h.append("data".data(using: .ascii)!); u32(UInt32(data.count))
try! (h + data).write(to: URL(fileURLWithPath: a[2]))
print(a[2], Double(data.count) / 192000.0)
