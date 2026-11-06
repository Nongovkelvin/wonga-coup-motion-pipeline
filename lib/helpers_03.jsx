function findIn(folderName, name) {
  var f = KIT.findAny(folderName, FolderItem);
  function rec(fo) { for (var i = 1; i <= fo.numItems; i++) { var it = fo.item(i); if (it.name === name && it instanceof CompItem) return it; if (it instanceof FolderItem) { var r = rec(it); if (r) return r; } } return null; }
  return rec(f);
}
function imp(path) { var it = KIT.imp(path); it.parentFolder = MEDIA; return it; }
// first file in broll/ whose name starts with "<prefix>_<nn>"; otherwise the fallback (logged as a placeholder)
function pick(prefix, n, fallback) {
  var fs = new Folder(BR).getFiles(function (f) { return f instanceof File && decodeURI(f.name).indexOf(prefix + "_") === 0 && /\.(mov|mp4|m4v|jpg|jpeg|png)$/i.test(f.name); });
  fs.sort(function (a, b) { return decodeURI(a.name) < decodeURI(b.name) ? -1 : 1; });
  var f = fs[(n || 1) - 1];
  if (f) return imp(f.fsName);
  log("PLACEHOLDER " + prefix + " #" + (n || 1) + " -> " + fallback.name); return fallback;
}
function cover(layer, w, h) { var s = layer.source; var k = Math.max(w / s.width, h / s.height) * 100; xf(layer).property("ADBE Scale").setValue([k, k]); xf(layer).property("ADBE Position").setValue([w / 2, h / 2]); }
function archival(l, strength) {   // same grade as KIT.stockShot
  l.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION").property(4).setValue(strength || -70);
  var tint = l.property("ADBE Effect Parade").addProperty("ADBE Tint"); tint.property(2).setValue([0.96, 0.9, 0.78]); tint.property(3).setValue(30);
  l.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2").property(2).setValue(22);
}
function isVideo(item) { return item instanceof FootageItem && item.mainSource && !item.mainSource.isStill; }
function loopIfVideo(l, outT) { if (!isVideo(l.source)) return; l.timeRemapEnabled = true; l.property("ADBE Time Remapping").expression = "loopOut('cycle')"; l.outPoint = outT; }

// ===== (folders + undo group in the main file) =====
// ---------- helpers copied from chapter 02 (build_02_lome_1.jsx) ----------
function labelStrip(txt, x, y, size, a, b, col) {
  var C = KIT.C, w = txt.length * size * 0.64 + 70, h = size * 1.7;
  var st = C.layers.addSolid([0.93, 0.91, 0.85], "STRIP " + txt, Math.round(w), Math.round(h), 1, C.duration);
  st.startTime = 0; st.inPoint = KIT.tc(a); st.outPoint = KIT.tc(b);
  xf(st).property("ADBE Anchor Point").setValue([0, h / 2]); xf(st).property("ADBE Position").setValue([x - 35, y - size * 0.32]);
  var sc = xf(st).property("ADBE Scale"); sc.setValueAtTime(KIT.tc(a), [0, 100]); sc.setValueAtTime(KIT.tc(a) + 0.22, [100, 100]);
  xf(st).property("ADBE Rotate Z").setValue(-1.2);
  var ds = st.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow"); try { ds.property(2).setValue(140); ds.property(4).setValue(8); ds.property(5).setValue(18); } catch (e) {}
  var t = KIT.typewriter(txt, x, y, size, col, a + 0.12, b); xf(t).property("ADBE Rotate Z").setValue(-1.2);
  fadeOut(st, b); fadeOut(t, b); return t;
}
function fadeOut(l, b) { var o = xf(l).property("ADBE Opacity"); o.setValueAtTime(KIT.tc(b) - 0.25, o.valueAtTime(KIT.tc(b) - 0.25, false)); o.setValueAtTime(KIT.tc(b), 0); }
function dropIn(l, a) {   // photo card falls onto the paper: scale 115% -> 100% with a quick settle
  var sc = xf(l).property("ADBE Scale");
  if (sc.numKeys) { var k1 = sc.keyValue(1); sc.setValueAtTime(KIT.tc(a), [k1[0] * 1.15, k1[1] * 1.15]); sc.setValueAtTime(KIT.tc(a) + 0.18, k1); }
  var o = xf(l).property("ADBE Opacity"); o.setValueAtTime(KIT.tc(a), 0); o.setValueAtTime(KIT.tc(a) + 0.08, 100);
}
function card(item, cx, cy, h, rot, a, b) { var l = KIT.photoCard(item, cx, cy, h, rot, a, b); dropIn(l, a); loopCard(l, b); return l; }
function stockComp(name, a, b, shots, labels) {   // shots: [item, from, to]; labels: [txt, x, y, size, at, until]
  var c = KIT.paperComp(name, PAPERS, a, b);
  for (var i = 0; i < shots.length; i++) shot(shots[i][0], shots[i][1], shots[i][2]);
  if (labels) for (var j = 0; j < labels.length; j++) { var L = labels[j]; labelStrip(L[0], L[1], L[2], L[3], L[4], L[5] || b - OV, L[6]); }
  vignetteOnly(); return c;
}
function vignetteOnly(op) {
  var C = KIT.C, vg = C.layers.addSolid([0, 0, 0], "VIGNETTE", 1920, 1080, 1, C.duration);
  var m = vg.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"); m.inverted = true;
  var es = new Shape(); es.vertices = [[960, 40], [1840, 540], [960, 1040], [80, 540]];
  es.inTangents = [[-480, 0], [0, -280], [480, 0], [0, 280]]; es.outTangents = [[480, 0], [0, 280], [-480, 0], [0, -280]]; es.closed = true;
  m.property("ADBE Mask Shape").setValue(es); m.property("ADBE Mask Feather").setValue([300, 300]); xf(vg).property("ADBE Opacity").setValue(op || 40);
}
function loopCard(l, outT) { if (isVideo(l.source)) { l.timeRemapEnabled = true; l.property("ADBE Time Remapping").expression = "loopOut('cycle')"; l.outPoint = KIT.tc(outT); } }
// a time-offset, cropped copy of a long archive clip: zoom fills the frame, dy lifts the top edge (logo) out of shot
function archClip(item, srcIn, name, pillar, zoom, dy) {
  var c = PARTS.items.addComp("CLIP " + name, 1920, 1080, 1, 30, KIT.FPS), l = c.layers.add(item);
  l.startTime = -srcIn; l.inPoint = 0; l.outPoint = 30; l.audioEnabled = false;
  var k = (pillar ? 1920 / 1440 : 1920 / item.width) * 100 * (zoom || 1);
  xf(l).property("ADBE Scale").setValue([k, k]); xf(l).property("ADBE Position").setValue([960, 540 + (dy || 0)]); return c;
}
function shot(item, a, b) {   // KIT.stockShot, but also for precomps
  if (!(item instanceof CompItem)) return KIT.stockShot(item, a, b);
  var C = KIT.C, l = C.layers.add(item); l.startTime = KIT.tc(a); l.inPoint = KIT.tc(a); l.outPoint = KIT.tc(b); l.name = "STOCK " + item.name;
  xf(l).property("ADBE Scale").setValueAtTime(KIT.tc(a), [100, 100]); xf(l).property("ADBE Scale").setValueAtTime(KIT.tc(b), [106, 106]); archival(l); return l;
}
function desat(l, v) { l.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION").property(4).setValue(v); }

// ---------- map helpers (same as part 2) ----------
function docScale(doc, t) { return xf(doc).property("ADBE Scale").valueAtTime(KIT.tc(t), false)[0] / 100; }
function pinType(doc, txt, p, size, a, b, col) {
  var ps = docScale(doc, a), t = KIT.typewriter(txt, 0, 0, size / ps, col || [0.07, 0.07, 0.07], a, b);
  t.parent = doc; xf(t).property("ADBE Position").setValue(p); xf(t).property("ADBE Scale").setValue([100, 100]); xf(t).property("ADBE Rotate Z").setValue(0);
  var tb = t.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow"); try { tb.property(2).setValue(255); tb.property(1).setValue([0.95, 0.93, 0.86]); tb.property(4).setValue(0); tb.property(5).setValue(10 / ps); } catch (e) {}
  return t;
}
function route(doc, p1, p2, a, dur, bend) {
  var C = KIT.C, ps = docScale(doc, a), sh = C.layers.addShape(); sh.name = "ROUTE"; sh.parent = doc; sh.startTime = 0; sh.inPoint = KIT.tc(a); sh.outPoint = doc.outPoint;
  var g = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  var pa = g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group"), s = new Shape();
  var mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2, dx = p2[0] - p1[0], dy = p2[1] - p1[1], b = (bend === undefined ? 0.18 : bend);
  var c = [mx - dy * b, my + dx * b];
  s.vertices = [p1, c, p2]; s.inTangents = [[0, 0], [-dx * 0.25, -dy * 0.25], [0, 0]]; s.outTangents = [[0, 0], [dx * 0.25, dy * 0.25], [0, 0]]; s.closed = false;
  pa.property("ADBE Vector Shape").setValue(s);
  var st = g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
  st.property("ADBE Vector Stroke Color").setValue([0.82, 0.08, 0.08]); st.property("ADBE Vector Stroke Width").setValue(6 / ps);
  try { var ds = st.property("ADBE Vector Stroke Dashes"); ds.addProperty("ADBE Vector Stroke Dash 1").setValue(18 / ps); ds.addProperty("ADBE Vector Stroke Gap 1").setValue(12 / ps); } catch (e) { log("dash: " + e); }
  var tr = g.property("ADBE Vectors Group").addProperty("ADBE Vector Filter - Trim");
  tr.property("ADBE Vector Trim End").setValueAtTime(KIT.tc(a), 0); tr.property("ADBE Vector Trim End").setValueAtTime(KIT.tc(a) + dur, 100);
  xf(sh).property("ADBE Anchor Point").setValue([0, 0]); xf(sh).property("ADBE Position").setValue([0, 0]); xf(sh).property("ADBE Scale").setValue([100, 100]); xf(sh).property("ADBE Rotate Z").setValue(0);
  sh.moveBefore(doc); return sh;
}
// solid red arrow (map "advance" arrows): route + arrow head at p2
function arrow(doc, p1, p2, a, dur, bend) {
  var r = route(doc, p1, p2, a, dur, bend), ps = docScale(doc, a);
  var st = r.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property("ADBE Vector Graphic - Stroke");
  st.property("ADBE Vector Stroke Width").setValue(14 / ps); try { st.property("ADBE Vector Stroke Dashes").property(1).setValue(4000 / ps); } catch (e) {}
  var C = KIT.C, hd = C.layers.addShape(); hd.name = "ARROW HEAD"; hd.parent = doc; hd.startTime = 0; hd.inPoint = KIT.tc(a + dur); hd.outPoint = doc.outPoint;
  var g = hd.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"), pth = g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group"), s = new Shape();
  var L = 46 / ps; s.vertices = [[0, -L], [L * 0.8, L * 0.5], [-L * 0.8, L * 0.5]]; s.closed = true; pth.property("ADBE Vector Shape").setValue(s);
  g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([0.82, 0.08, 0.08]);
  xf(hd).property("ADBE Anchor Point").setValue([0, 0]); xf(hd).property("ADBE Position").setValue(p2); xf(hd).property("ADBE Scale").setValue([100, 100]);
  xf(hd).property("ADBE Rotate Z").setValue(Math.atan2(p2[0] - p1[0], -(p2[1] - p1[1])) * 180 / Math.PI);
  hd.moveBefore(doc); return r;
}
function dot(doc, p, a, r) {
  var C = KIT.C, ps = docScale(doc, a), sh = C.layers.addShape(); sh.name = "DOT"; sh.parent = doc; sh.startTime = 0; sh.inPoint = KIT.tc(a); sh.outPoint = doc.outPoint;
  var g = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([(r || 22) / ps, (r || 22) / ps]);
  g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([0.82, 0.08, 0.08]);
  xf(sh).property("ADBE Anchor Point").setValue([0, 0]); xf(sh).property("ADBE Position").setValue(p); xf(sh).property("ADBE Rotate Z").setValue(0);
  var sc = xf(sh).property("ADBE Scale"); sc.setValueAtTime(KIT.tc(a), [0, 0]); sc.setValueAtTime(KIT.tc(a) + 0.15, [140, 140]); sc.setValueAtTime(KIT.tc(a) + 0.3, [100, 100]);
  sh.moveBefore(doc); return sh;
}
function rectShape(name, w, h, col, x, y, a, b) {
  var C = KIT.C, sh = C.layers.addShape(); sh.name = name; sh.startTime = 0; sh.inPoint = KIT.tc(a); sh.outPoint = KIT.tc(b);
  var g = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  var r = g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect"); r.property("ADBE Vector Rect Size").setValue([w, h]); r.property("ADBE Vector Rect Position").setValue([w / 2, 0]);
  g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(col);
  xf(sh).property("ADBE Anchor Point").setValue([0, 0]); xf(sh).property("ADBE Position").setValue([x, y]); return sh;
}
function grow(l, a, dur) { var sc = xf(l).property("ADBE Scale"); sc.setValueAtTime(KIT.tc(a), [0, 100]); sc.setValueAtTime(KIT.tc(a) + dur, [100, 100]); }
function rough(l, amt) { var r = l.property("ADBE Effect Parade").addProperty("ADBE Roughen Edges"); try { r.property(2).setValue(amt); r.property(5).setValue(amt * 0.4 + 1); } catch (e) {} }
function strike(t, full, a, b) {
  var td = t.property("ADBE Text Properties").property("ADBE Text Document").valueAtTime(KIT.tc(b) - 0.1, false);
  var w = full.length * td.fontSize * 0.62, pos = xf(t).property("ADBE Position").value;
  var s = rectShape("STRIKE " + full, w + 30, td.fontSize * 0.12, [0.82, 0.08, 0.08], pos[0] - 15, pos[1] - td.fontSize * 0.3, a, b);
  xf(s).property("ADBE Rotate Z").setValue(-2); grow(s, a, 0.25); rough(s, 3); return s;
}
// rubber stamp: red Courier word in a red box, slams in at a (scale 160 -> 100)
function stamp(txt, x, y, size, a, b, rot) {
  var t = KIT.typewriter(txt, x, y, size, [0.75, 0.07, 0.07], a, b); var sp = t.property("ADBE Text Properties").property("ADBE Text Document"); sp.expression = "";
  var w = txt.length * size * 0.64 + 50, h = size * 1.25, C = KIT.C, bx = C.layers.addShape(); bx.name = "STAMP box " + txt; bx.startTime = 0; bx.inPoint = KIT.tc(a); bx.outPoint = KIT.tc(b);
  var g = bx.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"), r = g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
  r.property("ADBE Vector Rect Size").setValue([w, h]);
  var st = g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke"); st.property("ADBE Vector Stroke Color").setValue([0.75, 0.07, 0.07]); st.property("ADBE Vector Stroke Width").setValue(size * 0.09);
  xf(bx).property("ADBE Position").setValue([x + w / 2 - 25, y - size * 0.33]); rough(bx, 4); rough(t, 2);
  t.parent = bx; xf(t).property("ADBE Scale").setValue([100, 100]);
  xf(bx).property("ADBE Rotate Z").setValue(rot || -6);
  var sc = xf(bx).property("ADBE Scale"); sc.setValueAtTime(KIT.tc(a), [160, 160]); sc.setValueAtTime(KIT.tc(a) + 0.12, [96, 96]); sc.setValueAtTime(KIT.tc(a) + 0.2, [100, 100]);
  bx.blendingMode = BlendingMode.MULTIPLY; return bx;
}

// ---------- talking head (new 27 Oct): the first cut's picture, lightly graded, nothing over his face ----------
function talkingHead(name, a, b, labels) {
  var c = KIT.paperComp(name, PAPERS, a, b), l = c.layers.add(M.firstcut);
  l.name = "TALKING HEAD (first cut picture)"; l.startTime = -a; l.inPoint = 0; l.outPoint = b - a; l.audioEnabled = false;
  var k = 1920 / M.firstcut.width * 100;
  xf(l).property("ADBE Scale").setValueAtTime(0, [k * 1.0, k * 1.0]); xf(l).property("ADBE Scale").setValueAtTime(b - a, [k * 1.035, k * 1.035]);
  l.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION").property(4).setValue(-22);
  var tint = l.property("ADBE Effect Parade").addProperty("ADBE Tint"); tint.property(2).setValue([0.96, 0.9, 0.78]); tint.property(3).setValue(10);
  l.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2").property(2).setValue(6);
  vignetteOnly(28);
  if (labels) for (var j = 0; j < labels.length; j++) { var L = labels[j]; labelStrip(L[0], L[1], L[2], L[3], L[4], L[5] || b - OV, L[6]); }
  return c;
}

// ---------- Detective: deep duplicate (scene + its Image / Image Precomp / Text comps), so used scenes stay untouched ----------
function dupDetective(sceneName, tag) {
  var src = findIn("Detective Agency", sceneName), DF = folder("Detective " + sceneName + " " + tag, PARTS), map = {}, byName = {};
  function dupOf(it) {
    if (map[it.id]) return map[it.id];
    var d = it.duplicate(); d.name = it.name + " " + tag; d.parentFolder = DF; map[it.id] = d; byName[it.name] = d;
    for (var j = 1; j <= d.numLayers; j++) { var l = d.layer(j); if (l.source instanceof CompItem && /^(Image|Image Precomp|Text) \d+$/.test(l.source.name)) l.replaceSource(dupOf(l.source), false); }
    return d;
  }
  var c = src.duplicate(); c.name = sceneName + " " + tag; c.parentFolder = DF;
  for (var i = 1; i <= c.numLayers; i++) { var l = c.layer(i); if (l.source instanceof CompItem && /^(Image|Image Precomp|Text) \d+$/.test(l.source.name)) l.replaceSource(dupOf(l.source), false); }
  log("dupDetective " + sceneName + ": " + c.numLayers + " layers");
  return { scene: c, get: function (n) { return byName[n]; } };
}
function fillSlot(c, item) {
  if (!c) { log("MISSING slot"); return; }
  for (var j = c.numLayers; j >= 1; j--) if (c.layer(j).name.indexOf("CLAUDE") === 0) c.layer(j).remove();
  var l = c.layers.add(item); l.name = "CLAUDE media " + item.name; cover(l, c.width, c.height); archival(l, -55); loopIfVideo(l, c.duration);
  xf(l).property("ADBE Scale").setValueAtTime(0, xf(l).property("ADBE Scale").value); xf(l).property("ADBE Scale").setValueAtTime(c.duration, [xf(l).property("ADBE Scale").value[0] * 1.08, xf(l).property("ADBE Scale").value[1] * 1.08]);
}
function hideLoadingIn(c, slot) {
  if (!c) return; var had = false;
  for (var i = 1; i <= c.numLayers; i++) { var n = c.layer(i).name; if (n === "Loading Text" || n === "Loading Bar") { c.layer(i).enabled = false; had = true; } }
  if (!had) return;
  for (var j = 1; j <= c.numLayers; j++) { var l = c.layer(j); if (!l.source || l.source !== slot) continue;
    if (xf(l).property("ADBE Opacity").numKeys > 0) l.enabled = false; else { l.startTime = 0; l.inPoint = 0; } }
  log(c.name + ": hid loading");
}
function setCardComp(c, head, para) {
  if (!c) { log("MISSING text card"); return; }
  var texts = []; for (var j = 1; j <= c.numLayers; j++) if (c.layer(j) instanceof TextLayer) texts.push(c.layer(j));
  if (texts.length > 0) setText(texts[0], head); if (texts.length > 1) setText(texts[1], para);
}
function setText(l, s) { var p = l.property("ADBE Text Properties").property("ADBE Text Document"); if (p.expressionEnabled) p.expression = ""; var td = p.value; td.text = s; p.setValue(td); }
function histScene(srcName, newName, fillMedia, texts, useDur) {
  var src = findIn("History 4K", srcName); if (!src) { log("MISSING " + srcName); return null; }
  var c = src.duplicate(); c.name = newName; c.parentFolder = PARTS;
  var holderL = null; for (var i = 1; i <= c.numLayers; i++) { var ly = c.layer(i); if (ly.source && ly.source.name.indexOf("MEDIA HOLDER") === 0) holderL = ly; }
  var h = holderL.source.duplicate(); h.name = newName + " MEDIA"; h.parentFolder = PARTS; holderL.replaceSource(h, false);
  for (var j = 1; j <= h.numLayers; j++) h.layer(j).enabled = false;
  fillMedia(h);
  var tl = []; for (var t = 1; t <= c.numLayers; t++) if (c.layer(t) instanceof TextLayer) tl.push(c.layer(t));
  tl.sort(function (x, y) { return y.property("ADBE Text Properties").property("ADBE Text Document").value.fontSize - x.property("ADBE Text Properties").property("ADBE Text Document").value.fontSize; });
  var plan = [texts.big, texts.small];
  for (var u = 0; u < tl.length && u < 2; u++) {
    var L2 = tl[u]; setText(L2, plan[u][0]);
    if (plan[u][2]) { var td2 = L2.property("ADBE Text Properties").property("ADBE Text Document"), v2 = td2.value; v2.fontSize = v2.fontSize * plan[u][2] / 100; td2.setValue(v2); }
    var shift = plan[u][1] - L2.inPoint; L2.startTime = L2.startTime + shift;
    var fx = L2.property("ADBE Effect Parade").addProperty("ADBE Geometry2"); fx.name = "CLAUDE fade out";
    var op = null; for (var k = 1; k <= fx.numProperties; k++) if (fx.property(k).name === "Opacity") op = fx.property(k);
    op.setValueAtTime(useDur - OV - 0.35, 100); op.setValueAtTime(useDur - OV, 0);
    L2.outPoint = useDur;
  }
  log(newName + ": " + tl.length + " text layers, holder " + h.width + "x" + h.height);
  return c;
}
function fillWith(item, strength) { return function (C) { var l = C.layers.add(item); cover(l, C.width, C.height); archival(l, strength); loopIfVideo(l, C.duration); }; }
function silhouetteComp() {
  var old = child(PARTS, "SILHOUETTE card 3", CompItem); if (old) return old;
  var c = PARTS.items.addComp("SILHOUETTE card 3", 800, 1000, 1, 30, KIT.FPS);
  c.layers.addSolid([0.42, 0.41, 0.39], "card", 800, 1000, 1, 30);
  var head = c.layers.addShape(); head.name = "silhouette";
  var g = head.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([300, 370]);
  var g2 = head.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  var r = g2.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse"); r.property("ADBE Vector Ellipse Size").setValue([640, 520]); r.property("ADBE Vector Ellipse Position").setValue([0, 520]);
  head.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([0.16, 0.15, 0.14]);
  xf(head).property("ADBE Position").setValue([400, 400]);
  return c;
}

// ---------- chapter 02 helpers ----------
function PT(x, y, w, h) { var k = 300 / 72; return [x * k, y * k, w * k, h * k]; }      // pdftool points -> 300 dpi px
function W(lon, lat) { return [3624 + 20.27 * lon, 2224 - 24.1 * lat]; }                 // world map (AF_World_political_map_2013_PD) lon/lat -> px
function place(l, p) { var po = xf(l).property("ADBE Position"); for (var k = 1; k <= po.numKeys; k++) { var v = po.keyValue(k); po.setValueAtKey(k, [p[0] + v[0] - 960, p[1] + v[1] - 545]); } }   // move a docShot (keeps its drift)
function still(t) { var C = KIT.C; for (var i = 1; i <= C.numLayers; i++) if (C.layer(i).name === "CAMERA drift (adjustment)") C.layer(i).enabled = false; }   // stillness beats: no drift
function staticType(txt, x, y, size, col, a, b) { var t = KIT.typewriter(txt, x, y, size, col, a, b); t.property("ADBE Text Properties").property("ADBE Text Document").expression = ""; return t; }
function fadeIn(l, a, d) { var o = xf(l).property("ADBE Opacity"); o.setValueAtTime(KIT.tc(a), 0); o.setValueAtTime(KIT.tc(a) + (d || 0.6), 100); }
function paperPage(name, a, b) { return KIT.paperComp(name, PAPERS, a, b); }
function endPaper(a, kind) { KIT.paperGrade(); seg(KIT.C, a, kind); }
function cardBox(name, x, y, w, h, a, b, rot, col) {   // index card / form: cream solid with shadow, centre x,y
  var C = KIT.C, s = C.layers.addSolid(col || [0.95, 0.93, 0.86], name, w, h, 1, C.duration); s.startTime = 0; s.inPoint = KIT.tc(a); s.outPoint = KIT.tc(b);
  xf(s).property("ADBE Position").setValue([x, y]); xf(s).property("ADBE Rotate Z").setValue(rot || 0);
  var ds = s.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow"); try { ds.property(2).setValue(150); ds.property(4).setValue(12); ds.property(5).setValue(30); } catch (e) {}
  rough(s, 2); return s;
}
// the three tricks: three index cards; `active` 0..2 (or -1 = introduce all three on their times)
var TRICKS = ["THE PAPER", "THE PLANES", "THE DISTANCE"];
function spine(name, a, b, active, times, head) {
  paperPage(name, a, b);
  if (head) KIT.typewriter(head[0], 140, 150, 44, null, head[1], b);
  for (var i = 0; i < 3; i++) {
    var x = 220 + i * 540, t = times[i], on = (active === -1 || active === i);
    var cb = cardBox("CARD " + TRICKS[i], x + 200, 560, 470, 320, t, b, (i - 1) * 1.6);
    var sc = xf(cb).property("ADBE Scale"); sc.setValueAtTime(KIT.tc(t), [118, 118]); sc.setValueAtTime(KIT.tc(t) + 0.16, [on && active !== -1 ? 108 : 100, on && active !== -1 ? 108 : 100]);
    var n = KIT.typewriter("TRICK " + (i + 1), x + 0, 470, 34, RED, t + 0.05, b);
    var w = KIT.serifLine(TRICKS[i].replace("THE ", "the "), x + 0, 600, 60, t + 0.1, b);
    if (!on) { xf(cb).property("ADBE Opacity").setValue(45); xf(n).property("ADBE Opacity").setValue(35); xf(w).property("ADBE Opacity").setValue(35); }
    if (active === i) KIT.highlightText(w, times[3] || t + 0.3, 0.45);
  }
  KIT.paperGrade(); return KIT.C;
}
// end-user certificate explainer (an illustration, labelled as one); f = field times
function eucForm(name, a, b, f) {
  paperPage(name, a, b);
  var T = function (k) { return Math.max(a, f[k] === undefined ? 1e9 : f[k]); }, on = function (k) { return f[k] !== undefined; };
  var form = cardBox("FORM end-user certificate", 900, 545, 1180, 940, a, b, -0.8, [0.96, 0.95, 0.9]);
  function line(txt, y, size, col, k) { if (!on(k)) return null; var t = (f[k] <= a + 0.05 ? staticType : KIT.typewriter)(txt, 380, y, size, col, T(k), b); return t; }
  line("END-USER CERTIFICATE", 180, 58, null, "title");
  line("CERTIFICAT D'UTILISATEUR FINAL", 235, 24, [0.35, 0.33, 0.3], "title");
  line("BUYER / END USER:", 420, 28, [0.35, 0.33, 0.3], "buyer");
  if (on("unita")) { var u = (f.unita <= a + 0.05 ? staticType : KIT.typewriter)("UNITA", 760, 420, 40, null, T("unita"), b); if (on("strike")) strike(u, "UNITA", T("strike"), b); }
  if (on("togo")) { var tg = KIT.typewriter("GOVERNMENT OF TOGO", 960, 420, 40, RED, T("togo"), b); if (f.togo <= a + 0.05) tg.property("ADBE Text Properties").property("ADBE Text Document").expression = ""; }
  line("THE WEAPONS ARE FOR ITS OWN FORCES", 540, 34, null, "own");
  line("AND WILL GO NOWHERE ELSE.", 600, 34, null, "nowhere");
  line("SIGNED:", 760, 28, [0.35, 0.33, 0.3], "signed");
  if (on("sig")) { var sg = KIT.serifLine("Signature of a government official", 560, 770, 40, T("sig"), b); xf(sg).property("ADBE Rotate Z").setValue(-3); fadeIn(sg, T("sig"), 0.5); }
  if (on("stamp")) stamp(f.stampTxt || "OFFICIAL", 1060, 900, 54, T("stamp"), b, -8);
  staticType("ILLUSTRATION - NOT A REAL CERTIFICATE", 1340, 1040, 18, RED, a, b);
  return KIT.C;
}
// world-map route graphic: stops = [[lon,lat,label,t,size,col,dx,dy]], legs = [[i,j,t,dur,bend,"dash"|"solid"]]
function worldMap(name, a, b, focus, stops, legs, extra) {
  paperPage(name, a, b);
  var wm = KIT.docShot(M.world, focus, a, b, 1600, -0.4); desat(wm, -55);
  for (var i = 0; i < stops.length; i++) { var s = stops[i], p = W(s[0], s[1]); if (s[3] >= b - 0.05) continue; dot(wm, p, s[3], s[8] || 24);
    if (s[2]) pinType(wm, s[2], [p[0] + (s[6] === undefined ? 20 : s[6]), p[1] + (s[7] === undefined ? -28 : s[7])], s[4] || 30, s[3] + 0.05, b, s[5] || [0.07, 0.07, 0.07]); }
  for (var j = 0; j < legs.length; j++) { var g = legs[j]; if (g[2] >= b - 0.05 || stops[g[0]][3] >= b - 0.05 || stops[g[1]][3] >= b - 0.05) continue; var p1 = W(stops[g[0]][0], stops[g[0]][1]), p2 = W(stops[g[1]][0], stops[g[1]][1]);
    var r = route(wm, p1, p2, g[2], g[3], g[4] === undefined ? 0.15 : g[4]);
    if (g[5] === "solid") { var st = r.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property("ADBE Vector Graphic - Stroke");
      st.property("ADBE Vector Stroke Width").setValue(9 / docScale(wm, g[2])); try { st.property("ADBE Vector Stroke Dashes").property(1).setValue(4000); } catch (e) {} }
    if (g[5] === "grey") { var st2 = r.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property("ADBE Vector Graphic - Stroke"); st2.property("ADBE Vector Stroke Color").setValue([0.25, 0.25, 0.25]); } }
  if (extra) extra(wm);
  return wm;
}
function photoLabel(txt, x, y, a, b) { return KIT.typewriter(txt, x, y, 18, null, a, b); }

// =====================================================================
// NEW IN CHAPTER 03: 3D camera, depth layers, punch-ins, 2.5D photo parallax (reusable - copy into later chapters)
// =====================================================================
var D0 = 2666.67;                                                     // AE 50 mm camera zoom for a 1920 comp: z=0 shows 1:1
var Z = { PAPER: 900, STOCK: 150, DOC: 0, CARD: -180, PHOTO: -260, TEXT: -420 };
function span(l, a, b) { l.startTime = 0; l.inPoint = KIT.tc(a); l.outPoint = KIT.tc(b); return l; }
// depth by layer name; null = stays 2D (adjustments, vignette, darken, SRC/name tags that must hold still)
function zOf(l, o) {
  var n = l.name; o = o || {};
  if (l.adjustmentLayer || n === "VIGNETTE" || n === "darken" || n.indexOf("SRC") === 0 || n.indexOf("PLX") === 0 || n.indexOf("CAMERA") === 0) return null;
  if (l instanceof CameraLayer || l instanceof LightLayer) return null;
  if (n === "PAPER") return Z.PAPER;
  if (n.indexOf("DOC ") === 0) return Z.DOC;
  if (n.indexOf("STOCK ") === 0) return Z.STOCK;
  if (n.indexOf("PHOTO ") === 0) return o.photo !== undefined ? o.photo : Z.PHOTO;
  if (l instanceof TextLayer || n.indexOf("STRIP ") === 0 || n.indexOf("STAMP") === 0 || n.indexOf("HIGHLIGHT text") === 0 || n.indexOf("STRIKE") === 0) return o.text !== undefined ? o.text : Z.TEXT;
  if (l.source && l.source.mainSource instanceof SolidSource) return o.card !== undefined ? o.card : Z.CARD;
  return Z.DOC;
}
// make a layer 3D at depth z so that, seen from the rest camera, it looks exactly as designed in 2D
function depthKeep(l, z, extra) {
  var f = (D0 + z) / D0, e = extra || 1; l.threeDLayer = true;
  var po = xf(l).property("ADBE Position"), sc = xf(l).property("ADBE Scale");
  function mp(v) { return [960 + (v[0] - 960) * f, 540 + (v[1] - 540) * f, z]; }
  function ms(v) { return [v[0] * f * e, v[1] * f * e, 100]; }
  if (po.numKeys) { for (var k = 1; k <= po.numKeys; k++) po.setValueAtKey(k, mp(po.keyValue(k))); } else po.setValue(mp(po.value));
  if (sc.numKeys) { for (var k2 = 1; k2 <= sc.numKeys; k2++) sc.setValueAtKey(k2, ms(sc.keyValue(k2))); } else sc.setValue(ms(sc.value));
}
// turn the current paper comp into a 3D scene (paper far back, documents at 0, photos/type in front)
function go3D(o) {
  var C = KIT.C, list = [];
  for (var i = 1; i <= C.numLayers; i++) list.push(C.layer(i));
  for (var j = 0; j < list.length; j++) { var l = list[j];
    if (l instanceof CameraLayer || l instanceof LightLayer || l.threeDLayer || l.adjustmentLayer) continue;   // shape + text layers are not instanceof AVLayer
    if (l.parent) { if (zOf(l.parent, o) !== null || l.parent.threeDLayer) l.threeDLayer = true; continue; }
    var z = zOf(l, o); if (z === null) continue;
    depthKeep(l, z, l.name === "PAPER" ? 1.4 : (l.name.indexOf("STOCK ") === 0 ? 1.12 : 1));
  }
}
function ease(p, inf) {
  for (var k = 1; k <= p.numKeys; k++) { var e = [new KeyframeEase(0, inf || 70)];
    try { p.setSpatialAutoBezierAtKey(k, false); p.setSpatialContinuousAtKey(k, false); p.setSpatialTangentsAtKey(k, [0, 0, 0], [0, 0, 0]); } catch (x) {}
    try { p.setTemporalEaseAtKey(k, e, e); } catch (x2) {} }
}
// real AE camera; keys = [[firstCutTime, x, y, zoomFactor]]: (x, y) of the z=0 plane lands at frame centre, zoom 1 = rest
function cam3D(keys, inf) {
  var C = KIT.C, cam = C.layers.addCamera("CAMERA 3D", [960, 540]);
  cam.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
  var op = cam.property("ADBE Camera Options Group"); op.property("ADBE Camera Zoom").setValue(D0);
  try { op.property("ADBE Camera Depth of Field").setValue(0); } catch (e) {}
  var po = xf(cam).property("ADBE Position"), last = -1;
  for (var i = 0; i < keys.length; i++) { var k = keys[i], t = Math.max(0, Math.min(C.duration - 0.01, KIT.tc(k[0]))); if (t <= last + 0.02) t = last + 0.03; last = t;
    po.setValueAtTime(t, [k[1], k[2], -D0 / k[3]]); }
  ease(po, inf); return cam;
}
function docPt(doc, px, t) {   // screen position of doc pixel px at first-cut time t (rotation ignored, it is < 1 degree)
  var tt = KIT.tc(t), p = xf(doc).property("ADBE Position").valueAtTime(tt, false), s = xf(doc).property("ADBE Scale").valueAtTime(tt, false), an = xf(doc).property("ADBE Anchor Point").valueAtTime(tt, false);
  return [p[0] + (px[0] - an[0]) * s[0] / 100, p[1] + (px[1] - an[1]) * s[1] / 100];
}
// camera aim at the centre of doc box r (doc pixels) at time t; amt < 1 keeps some of the frame centre
function pin(doc, r, t, amt) { var q = docPt(doc, [r[0] + r[2] / 2, r[1] + r[3] / 2], t), m = (amt === undefined ? 0.85 : amt); return [960 + (q[0] - 960) * m, 540 + (q[1] - 540) * m]; }
function K(t, p, k) { return [t, p[0], p[1], k]; }
function C0(t, k) { return [t, 960, 540, k || 1]; }
// punch-in: rest -> rest(t) -> marker box r at t+0.4 (zoom k) -> creep to the end
function punchKeys(doc, a, b, hits) {   // hits = [[t, r, k]] in order
  var keys = [C0(a, 1.0)];
  for (var i = 0; i < hits.length; i++) { var h = hits[i], p = pin(doc, h[1], h[0] + 0.4);
    keys.push(i === 0 ? C0(h[0] - 0.05, 1.03) : K(h[0] - 0.05, pin(doc, hits[i - 1][1], h[0]), hits[i - 1][2] * 1.02));
    keys.push(K(h[0] + 0.4, p, h[2])); }
  var lh = hits[hits.length - 1]; keys.push(K(b, pin(doc, lh[1], b), lh[2] * 1.05)); return keys;
}
// world-map camera by lon/lat: keys [[t, lon, lat, zoom]]
function mapCam(wm, keys) { var out = []; for (var i = 0; i < keys.length; i++) { var k = keys[i], q = docPt(wm, W(k[1], k[2]), k[0]); out.push([k[0], q[0], q[1], k[3]]); } return out; }
function endPaper3D(a, kind, keys, o) { KIT.paperGrade(); go3D(o); if (keys) cam3D(keys); seg(KIT.C, a, kind); return KIT.C; }

// 2.5D photo parallax: Vision cut-out (photos/parallax/<key>_fg.png) in front of its filled plate (<key>_bg.png).
// mv = [zoomStart, zoomEnd, dx, dy] camera move over the shot. Without a cut-out the original photo is pushed in 3D.
function plx(name, a, b, key, orig, mv, grade) {
  var c = KIT.paperComp(name, PAPERS, a, b); mv = mv || [1.0, 1.14, 120, -20];
  var fb = new File(PX + key + "_bg.png"), ff = new File(PX + key + "_fg.png");
  var bgI = fb.exists ? imp(fb.fsName) : orig, fgI = ff.exists ? imp(ff.fsName) : null;
  function lay(it, z, nm) { var l = c.layers.add(it); l.name = nm; cover(l, 1920, 1080);
    var s = xf(l).property("ADBE Scale").value; xf(l).property("ADBE Scale").setValue([s[0] * 1.14, s[1] * 1.14]);
    archival(l, grade || -62); depthKeep(l, z); return l; }
  lay(bgI, fgI ? 520 : 200, "PLX bg " + key); if (fgI) lay(fgI, -160, "PLX fg " + key);
  cam3D([[a, 960 - mv[2] / 2, 540 - mv[3] / 2, mv[0]], [b, 960 + mv[2] / 2, 540 + mv[3] / 2, mv[1]]], 35);
  vignetteOnly(); return c;
}
// stock with a stronger camera zoom than KIT.stockShot (optional punch at time p)
function stockZ(name, a, b, item, kEnd, p) {
  paperPage(name, a, b); var l = KIT.stockShot(item, a, b), sc = xf(l).property("ADBE Scale"), v0 = sc.keyValue(1);
  sc.setValueAtKey(2, [v0[0] * (kEnd || 1.14), v0[1] * (kEnd || 1.14)]);
  if (p) { sc.setValueAtTime(KIT.tc(p), sc.valueAtTime(KIT.tc(p), false)); sc.setValueAtTime(KIT.tc(p) + 0.3, [v0[0] * 1.3, v0[1] * 1.3]); sc.setValueAtKey(sc.numKeys, [v0[0] * 1.34, v0[1] * 1.34]); ease(sc, 80); }
  vignetteOnly(); return KIT.C;
}
// talking head with an optional punch-in on the key word; face = where his face is in the frame (wide ~[960,345], close ~[865,360])
function talkingHead2(name, a, b, punch, face, amt) {
  var c = KIT.paperComp(name, PAPERS, a, b), l = c.layers.add(M.firstcut);
  l.name = "TALKING HEAD (first cut picture)"; l.startTime = -a; l.inPoint = 0; l.outPoint = b - a; l.audioEnabled = false;
  var k = 1920 / M.firstcut.width * 100, sc = xf(l).property("ADBE Scale"), po = xf(l).property("ADBE Position");
  sc.setValueAtTime(0, [k, k]); po.setValueAtTime(0, [960, 540]);
  if (punch) { var t = punch - a, f = face || [960, 345], s2 = amt || 1.18;
    var at = function (s) { return [960 + (960 - f[0]) * (s - 1), 540 + (540 - f[1]) * (s - 1)]; };
    sc.setValueAtTime(t, [k * 1.02, k * 1.02]); po.setValueAtTime(t, at(1.02));
    sc.setValueAtTime(t + 0.2, [k * s2, k * s2]); po.setValueAtTime(t + 0.2, at(s2));
    sc.setValueAtTime(b - a, [k * (s2 + 0.03), k * (s2 + 0.03)]); po.setValueAtTime(b - a, at(s2 + 0.03)); ease(sc, 85); ease(po, 85);
  } else { sc.setValueAtTime(b - a, [k * 1.07, k * 1.07]); po.setValueAtTime(b - a, [960, 520]); }
  l.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION").property(4).setValue(-22);
  var tint = l.property("ADBE Effect Parade").addProperty("ADBE Tint"); tint.property(2).setValue([0.96, 0.9, 0.78]); tint.property(3).setValue(10);
  l.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2").property(2).setValue(6);
  vignetteOnly(28); return c;
}
// on-screen text that must hold still while the camera moves (sources, name tags) - stays 2D
function SRC(txt, a, b, x, y, size, col) { var t = KIT.typewriter(txt, x || 120, y || 1040, size || 18, col, a, b); t.name = "SRC " + txt; return t; }
function nameTag(txt, a, b, x, y, size) { labelStrip(txt, x || 120, y || 960, size || 34, a, b); var C = KIT.C; C.layer(1).name = "SRC name " + txt; C.layer(2).name = "SRC strip " + txt;
  C.layer(1).property("ADBE Text Properties").property("ADBE Text Document").expression = ""; fadeIn(C.layer(1), a + 0.15, 0.2); }   // static text: name tags sit on 2-4 s shots
var TK = ["ink4", "brush1", "ink2", "brush3", "ink3", "brush5", "brush2", "ink4", "brush4", "ink2", "brush1", "ink3"], tki = 0;
function tk() { return TK[(tki++) % TK.length]; }


var OV = 1.4;   // every insert runs 1.4 s past its cut so the next reveal has something underneath
var SEG = [];
function photoDoc(l, sat) { l.blendingMode = BlendingMode.NORMAL; l.property("ADBE Effect Parade").property(1).enabled = false; desat(l, sat); }   // a photo through docShot: no paper multiply, no document levels
function seg(comp, a, kind) { SEG.push({ comp: comp, a: a, kind: kind }); }
var GREY = [0.3, 0.29, 0.27];
var FACE_W = [960, 345], FACE_C = [865, 360];   // narrator's face: wide angle / close angle (first cut)
