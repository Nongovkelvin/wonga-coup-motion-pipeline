// b-roll overnight (6 Nov 2026): save check frames of one master. Config: broll_frames_cfg.txt next to this file:
// line 1 master comp name, line 2 T0 (first-cut time of the master's 0), line 3 output folder, line 4 first-cut times (comma), line 5 resolution factor (1 = full, 2 = half)
(function () { var HERE = File($.fileName).parent.fsName, out = [];
  try { app.beginSuppressDialogs();
    var cf = new File(HERE + "/broll_frames_cfg.txt"); cf.encoding = "UTF-8"; cf.open("r"); var L = cf.read().split(/\r?\n/); cf.close();
    var name = L[0], T0 = parseFloat(L[1]), od = new Folder(L[2]), T = L[3].split(","), rf = parseInt(L[4] || "2", 10); if (!od.exists) od.create();
    var m = null; for (var i = 1; i <= app.project.numItems; i++) { var it = app.project.item(i); if (it.name === name && it instanceof CompItem) m = it; }
    if (!m) out.push("NO MASTER " + name); else { var r0 = m.resolutionFactor; m.resolutionFactor = [rf, rf];
      for (var k = 0; k < T.length; k++) { var t = parseFloat(T[k]); var n = ("0000000" + Math.round(t * 100)).slice(-7); m.saveFrameToPng(t - T0, new File(od.fsName + "/f" + n + ".png")); }
      m.resolutionFactor = r0; out.push("queued " + T.length); }
  } catch (e) { out.push("ERR " + e + " " + e.line); }
  try { app.endSuppressDialogs(false); } catch (e2) {}
  var f = new File(HERE + "/broll_frames.log"); f.open("w"); f.write(out.join("\n")); f.close(); })();
