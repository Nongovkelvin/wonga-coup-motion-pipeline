// helpers copied from chapter 04 (build_04_moscow_1.jsx lines 88-139): arrow2D, chainCard, panel, dupTS, fillTSMedia, tsComp, detMontage
// ---------- small helpers new in this chapter ----------
function PTd(x, y, w, h) { return PT(x, y, w, h); }
function arrow2D(p1, p2, a, b, dur) {   // a red arrow between two screen points (draws on), for the custom chain
  var C = KIT.C, sh = C.layers.addShape(); sh.name = "ARROW chain"; span(sh, a, b);
  var g = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"), pa = g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group"), s = new Shape();
  s.vertices = [p1, p2]; s.closed = false; pa.property("ADBE Vector Shape").setValue(s);
  var st = g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke"); st.property("ADBE Vector Stroke Color").setValue([0.82, 0.08, 0.08]); st.property("ADBE Vector Stroke Width").setValue(9);
  var tr = g.property("ADBE Vectors Group").addProperty("ADBE Vector Filter - Trim"); tr.property("ADBE Vector Trim End").setValueAtTime(KIT.tc(a), 0); tr.property("ADBE Vector Trim End").setValueAtTime(KIT.tc(a) + (dur || 0.4), 100);
  var hd = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"), hp = hd.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group"), h = new Shape();
  var ang = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]), L = 34;
  h.vertices = [p2, [p2[0] - L * Math.cos(ang - 0.45), p2[1] - L * Math.sin(ang - 0.45)], [p2[0] - L * Math.cos(ang + 0.45), p2[1] - L * Math.sin(ang + 0.45)]]; h.closed = true;
  hp.property("ADBE Vector Shape").setValue(h); hd.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([0.82, 0.08, 0.08]);
  var ho = hd.property("ADBE Vector Transform Group").property("ADBE Vector Group Opacity"); ho.setValueAtTime(KIT.tc(a) + (dur || 0.4) - 0.05, 0); ho.setValueAtTime(KIT.tc(a) + (dur || 0.4), 100);
  xf(sh).property("ADBE Anchor Point").setValue([0, 0]); xf(sh).property("ADBE Position").setValue([0, 0]); rough(sh, 2); return sh;
}
function chainCard(txt, sub, x, y, a, b, z, w) {   // index card with a name (and an optional small line), at depth z
  w = w || (txt.length * 26 + 110); var cb = cardBox("CARD " + txt, x, y, w, sub ? 150 : 112, a, b, (x % 3) - 1);
  var sc = xf(cb).property("ADBE Scale"); sc.setValueAtTime(KIT.tc(a), [118, 118]); sc.setValueAtTime(KIT.tc(a) + 0.16, [100, 100]);
  var ct = staticType(txt, x - w / 2 + 40, y + (sub ? -4 : 14), 40, null, a, b); ct.parent = cb; xf(ct).property("ADBE Scale").setValue([100, 100]);
  var cs = null; if (sub) { cs = staticType(sub, x - w / 2 + 42, y + 44, 24, RED, a, b); cs.parent = cb; xf(cs).property("ADBE Scale").setValue([100, 100]); }
  depthKeep(cb, z || -180); ct.threeDLayer = true; if (cs) cs.threeDLayer = true; return cb;
}
function panel(item, w, h, name) {   // a stock clip graded inside its own frame (split screen half)
  var c = PARTS.items.addComp("PANEL " + name, w, h, 1, 30, KIT.FPS), l = c.layers.add(item); cover(l, w, h); archival(l, -60); loopIfVideo(l, 30);
  if (isVideo(item)) l.audioEnabled = false;
  xf(l).property("ADBE Scale").setValueAtTime(0, xf(l).property("ADBE Scale").value); xf(l).property("ADBE Scale").setValueAtTime(12, [xf(l).property("ADBE Scale").value[0] * 1.1, xf(l).property("ADBE Scale").value[1] * 1.1]);
  return c;
}
function staticCard(item, cx, cy, h, rot, a, b) { var l = card(item, cx, cy, h, rot, a, b); return l; }
// Top Secret: deep-duplicate Scene_04 (its Media and Text / Text 04A / Text 04_0x / Media 03 chain) for another chapter card
function dupTS(tag) {
  var map = {}, DF = folder("Top Secret Scene_04 " + tag, PARTS), RX = /^(Media and Text_04|Text 04A|Text 04_0\d|Media 03AAA|Media 03a0\d|Media 03)$/;
  function d(c) { if (map[c.id]) return map[c.id]; var n = c.duplicate(); n.name = c.name + " " + tag; n.parentFolder = DF; map[c.id] = n;
    for (var j = 1; j <= n.numLayers; j++) { var l = n.layer(j); if (l.source instanceof CompItem && RX.test(l.source.name)) { var on = l.name; l.replaceSource(d(l.source), false); l.name = on; } } return n; }   // keep layer names: template expressions look layers up by name
  var sc = tsComp("Scene_04"), c = sc.duplicate(); c.name = "Scene_04 " + tag; c.parentFolder = DF;
  for (var i = 1; i <= c.numLayers; i++) { var l = c.layer(i); if (l.source instanceof CompItem && RX.test(l.source.name)) { var on = l.name; l.replaceSource(d(l.source), false); l.name = on; } }
  var byName = {}; for (var k in map) byName[map[k].name.replace(" " + tag, "")] = map[k];
  return { scene: c, get: function (n) { return byName[n]; } };
}
function fillTSMedia(mc, item) { for (var q = mc.numLayers; q >= 1; q--) { if (mc.layer(q).name.indexOf("CLAUDE") === 0) mc.layer(q).remove(); else mc.layer(q).enabled = false; }
  var ml = mc.layers.add(item); ml.name = "CLAUDE media " + item.name; cover(ml, mc.width, mc.height); archival(ml, -60); loopIfVideo(ml, mc.duration); if (isVideo(item)) ml.audioEnabled = false; }
var TS = KIT.findAny("Top Secret Records Documentary Intro.aep", FolderItem);
function tsComp(n) { function rec(fo) { for (var i = 1; i <= fo.numItems; i++) { var it = fo.item(i); if (it.name === n && it instanceof CompItem) return it; if (it instanceof FolderItem) { var r = rec(it); if (r) return r; } } return null; } return TS ? rec(TS) : null; }
// Detective deep duplicate filled with a list of items + its text card
function detMontage(sceneName, tag, items, head, para) {
  var D = dupDetective(sceneName, tag), DF = child(PARTS, "Detective " + sceneName + " " + tag, FolderItem), n = 0;
  for (var d = 1; d <= DF.numItems; d++) { var it = DF.item(d), mm = new RegExp("^Image (\\d+) " + tag + "$").exec(it.name);
    if (mm) { fillSlot(it, items[(n++) % items.length]); hideLoadingIn(child(DF, "Image Precomp " + mm[1] + " " + tag, CompItem), it); }
    if (new RegExp("^Text \\d+ " + tag + "$").test(it.name)) setCardComp(it, head, para); }
  log(sceneName + " " + tag + " slots filled: " + n); return D.scene;
}
var FACE_W = [960, 345], FACE_C = [865, 360];

function speedHold(l, start, k) {   // play the clip at 1/k speed from `start`, then hold its last frame
  var D = l.source.duration - 0.05; l.startTime = start; l.timeRemapEnabled = true;
  var tr = l.property("ADBE Time Remapping"); tr.setValueAtTime(start + D * k, D);
  for (var i = tr.numKeys; i >= 1; i--) { var tt = tr.keyTime(i); if (Math.abs(tt - start) > 0.001 && Math.abs(tt - (start + D * k)) > 0.001) tr.removeKey(i); }
}
function overlapOf(kind) { if (kind === "none") return 0; var t = TRN[kind]; return (t[3] - t[2]) * t[1] / 100; }
function addTransition(L, kind, at) {
  var t = TRN[kind], it = imp(TR + t[0]), k = t[1] / 100;
  var m = master.layers.add(it); m.name = "MATTE " + kind + " -> " + L.name; speedHold(m, at - t[2] * k, k);
  m.inPoint = at; m.outPoint = L.outPoint; m.moveBefore(L);
  L.setTrackMatte(m, TrackMatteType.ALPHA);
  var e = master.layers.add(it); e.name = "INK EDGE " + kind; speedHold(e, at - t[2] * k + 0.1, k);
  e.inPoint = at; e.outPoint = at + overlapOf(kind) + 0.25; e.moveAfter(L);
  var fill = e.property("ADBE Effect Parade").addProperty("ADBE Fill"); KIT.setByName(fill, { "Color": [0.07, 0.06, 0.05] });
  xf(e).property("ADBE Opacity").setValue(85);
}
