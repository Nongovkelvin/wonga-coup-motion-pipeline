// JUDE BELA HOUSE STYLE - paper/document style kit (from the Viktor Bout doc) for After Effects 2025 (ExtendScript).
// Load it from a build script with:  $.evalFile(new File(".../Assets/look_kit/kit.jsx"));
// Every time argument is in FIRST-CUT seconds; `T0` on the comp (KIT.t0) converts to comp time.
// Building blocks: paper base, document close-ups multiplied onto paper, timed yellow marker,
// red hand-drawn circle, typewriter label, printed photo cut-out, serif quote, archive-graded
// stock shot, the measured paper grade, camera drift, and the 35mm film-grain finish.
var KIT = (function () {
  // A = the _HOUSE STYLE folder (textures + grain live in A + "look_kit/"). Set $.global.KIT_BUILD_FOLDER = "<FILM> BUILD" before loading to name the AE folder.
  var A = File($.fileName).parent.parent.fsName + "/";
  var FPS = 23.976;
  var p = app.project;
  var K = { A: A, FPS: FPS, C: null, t0: 0 };

  function child(parent, name, type) { for (var i = 1; i <= parent.numItems; i++) { var it = parent.item(i); if (it.name === name && (!type || it instanceof type)) return it; } return null; }
  function folder(name, parent) { parent = parent || p.rootFolder; return child(parent, name, FolderItem) || parent.items.addFolder(name); }
  function findAny(name, type) { for (var i = 1; i <= p.numItems; i++) { var it = p.item(i); if (it.name === name && (!type || it instanceof type)) return it; } return null; }
  function xf(l) { return l.property("ADBE Transform Group"); }
  function tc(t) { return t - K.t0; }
  function setByName(fx, map) {
    for (var k = 1; k <= fx.numProperties; k++) { var pr = fx.property(k);
      if (pr.propertyType === PropertyType.PROPERTY && map.hasOwnProperty(pr.name)) { try { pr.setValue(map[pr.name]); } catch (e) {} }
      else if (pr.numProperties) setByName(pr, map); }
  }
  K.child = child; K.folder = folder; K.findAny = findAny; K.xf = xf; K.tc = tc; K.setByName = setByName;
  K.build = function () { return folder($.global.KIT_BUILD_FOLDER || "FILM BUILD"); };
  K.imp = function (path) {                                   // import once, reuse after
    var f = new File(path), n = decodeURI(f.name), ex = findAny(n, FootageItem); if (ex) return ex;
    var it = p.importFile(new ImportOptions(f)); it.parentFolder = folder("media look", K.build()); return it;
  };

  // ---- paper base (shared comp) ----
  K.paperBase = function () {
    var lookF = folder("LOOK kit", K.build()), pc = child(lookF, "LOOK paper base", CompItem);
    if (pc) return pc;
    pc = lookF.items.addComp("LOOK paper base", 1920, 1080, 1, 600, FPS);
    var light = pc.layers.add(K.imp(A + "look_kit/paper_02_wrinkled.jpg"));
    var s = Math.max(1920 / light.source.width, 1080 / light.source.height) * 100; xf(light).property("ADBE Scale").setValue([s, s]);
    var hs = light.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION"); hs.property(4).setValue(-72); hs.property(5).setValue(34);
    var dirt = pc.layers.add(K.imp(A + "look_kit/paper_01_grey_vignette.jpg"));
    var s2 = Math.max(1920 / dirt.source.width, 1080 / dirt.source.height) * 100; xf(dirt).property("ADBE Scale").setValue([s2, s2]);
    dirt.blendingMode = BlendingMode.MULTIPLY; xf(dirt).property("ADBE Opacity").setValue(30);
    var hs2 = dirt.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION"); hs2.property(4).setValue(-75); hs2.property(5).setValue(30);
    var glow = pc.layers.addSolid([1, 0.97, 0.88], "centre glow", 1920, 1080, 1, 600);
    var gm = glow.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"), ge = new Shape();
    ge.vertices = [[960, 180], [1560, 540], [960, 900], [360, 540]];
    ge.inTangents = [[-330, 0], [0, -200], [330, 0], [0, 200]]; ge.outTangents = [[330, 0], [0, 200], [-330, 0], [0, -200]]; ge.closed = true;
    gm.property("ADBE Mask Shape").setValue(ge); gm.property("ADBE Mask Feather").setValue([420, 420]);
    glow.blendingMode = BlendingMode.SOFT_LIGHT; xf(glow).property("ADBE Opacity").setValue(70);
    return pc;
  };
  // new paper comp covering first-cut seconds a..b; becomes the current comp
  K.paperComp = function (name, parentFolder, a, b) {
    var old = child(parentFolder, name, CompItem); if (old) old.remove();
    var c = parentFolder.items.addComp(name, 1920, 1080, 1, b - a, FPS); c.displayStartTime = a;
    K.C = c; K.t0 = a; c.layers.add(K.paperBase()).name = "PAPER"; return c;
  };
  function span(l, a, b) { l.startTime = 0; l.inPoint = tc(a); l.outPoint = tc(b); return l; }

  K.docShot = function (item, focus, a, b, fitW, rot) {      // document printed on the paper, slow push, macro depth of field
    var C = K.C, l = C.layers.add(item); span(l, a, b);
    var s = Math.min(fitW / focus[2], 900 / focus[3]) * 100;
    xf(l).property("ADBE Anchor Point").setValue([focus[0] + focus[2] / 2, focus[1] + focus[3] / 2]);
    xf(l).property("ADBE Position").setValueAtTime(tc(a), [960, 545]); xf(l).property("ADBE Position").setValueAtTime(tc(b), [948, 538]);
    xf(l).property("ADBE Scale").setValueAtTime(tc(a), [s, s]); xf(l).property("ADBE Scale").setValueAtTime(tc(b), [s * 1.09, s * 1.09]);
    xf(l).property("ADBE Rotate Z").setValue(rot || -0.6);
    l.blendingMode = BlendingMode.MULTIPLY;
    var lv = l.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
    for (var k = 1; k <= lv.numProperties; k++) { var pr = lv.property(k);
      try { if (pr.name === "Input Black") pr.setValue(0.32); else if (pr.name === "Input White") pr.setValue(0.88); else if (pr.name === "Gamma") pr.setValue(0.75); } catch (e) {} }
    l.name = "DOC " + item.name;
    var dof = C.layers.addSolid([0, 0, 0], "DOF blur (adjustment)", 1920, 1080, 1, C.duration); dof.adjustmentLayer = true;
    dof.inPoint = l.inPoint; dof.outPoint = l.outPoint; dof.moveBefore(l);
    dof.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2").property(1).setValue(14);
    function band(y0, y1) { var mk = dof.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"), sh = new Shape();
      sh.vertices = [[-50, y0], [1970, y0], [1970, y1], [-50, y1]]; sh.closed = true; mk.property("ADBE Mask Shape").setValue(sh); mk.property("ADBE Mask Feather").setValue([0, 170]); }
    band(-200, 250); band(830, 1300);
    return l;
  };
  K.highlight = function (doc, r, t, dur) {                    // yellow marker over doc pixels r=[x,y,w,h], swipes in at t
    var C = K.C, sh = C.layers.addShape(); sh.name = "HIGHLIGHT"; sh.parent = doc; sh.startTime = 0; sh.inPoint = tc(t); sh.outPoint = doc.outPoint;
    var g = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    var rc = g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect"), pad = r[3] * 0.18;
    rc.property("ADBE Vector Rect Size").setValue([r[2] + pad * 2, r[3] * 1.15]); rc.property("ADBE Vector Rect Position").setValue([(r[2] + pad * 2) / 2, 0]);
    g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([1.0, 0.9, 0.0]);
    xf(sh).property("ADBE Anchor Point").setValue([0, 0]); xf(sh).property("ADBE Position").setValue([r[0] - pad, r[1] + r[3] / 2]); xf(sh).property("ADBE Rotate Z").setValue(0);
    var sc = xf(sh).property("ADBE Scale"); sc.setValueAtTime(tc(t), [0, 100]); sc.setValueAtTime(tc(t) + (dur || 0.35), [100, 100]);
    var rgh = sh.property("ADBE Effect Parade").addProperty("ADBE Roughen Edges"); try { rgh.property(2).setValue(r[3] * 0.2); rgh.property(5).setValue(r[3] * 0.05 + 1); } catch (e) {}
    sh.blendingMode = BlendingMode.MULTIPLY; sh.moveBefore(doc); return sh;
  };
  K.circle = function (doc, r, t, screenStroke) {              // red hand-drawn ellipse around doc pixels r
    var C = K.C, sh = C.layers.addShape(); sh.name = "RED CIRCLE"; sh.parent = doc; sh.startTime = 0; sh.inPoint = tc(t); sh.outPoint = doc.outPoint;
    var g = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([r[2] * 1.18 + r[3], r[3] * 2.4]);
    var st = g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
    var ps = xf(doc).property("ADBE Scale").valueAtTime(tc(t), false)[0] / 100;
    st.property("ADBE Vector Stroke Color").setValue([0.82, 0.08, 0.08]); st.property("ADBE Vector Stroke Width").setValue((screenStroke || 7) / ps);
    var tr = g.property("ADBE Vectors Group").addProperty("ADBE Vector Filter - Trim");
    tr.property("ADBE Vector Trim End").setValueAtTime(tc(t), 0); tr.property("ADBE Vector Trim End").setValueAtTime(tc(t) + 0.5, 100); tr.property("ADBE Vector Trim Offset").setValue(-40);
    xf(sh).property("ADBE Anchor Point").setValue([0, 0]); xf(sh).property("ADBE Position").setValue([r[0] + r[2] / 2, r[1] + r[3] / 2]);
    xf(sh).property("ADBE Rotate Z").setValue(-4); xf(sh).property("ADBE Scale").setValue([100, 100]);  // parenting compensates scale; reset to doc pixels
    sh.moveBefore(doc); return sh;
  };
  K.typewriter = function (txt, x, y, size, col, a, b) {       // Courier label typed on at 16 characters/second
    var C = K.C, l = C.layers.addText(txt); l.name = "TYPE " + txt; span(l, a, b);
    var sp = l.property("ADBE Text Properties").property("ADBE Text Document"), td = sp.value;
    td.fontSize = size; td.fillColor = col || [0.07, 0.07, 0.07]; td.applyFill = true; td.justification = ParagraphJustification.LEFT_JUSTIFY; td.tracking = 40;
    try { td.font = "CourierNewPS-BoldMT"; } catch (e) {}
    sp.setValue(td); sp.expression = 'var s = text.sourceText.toString(); s.substr(0, Math.max(0, Math.floor((time - inPoint) * 16)));';
    xf(l).property("ADBE Position").setValue([x, y]); return l;
  };
  K.photoCard = function (item, cx, cy, h, rot, a, b) {        // printed photo, white border, shadow, slow drift
    var C = K.C, ph = C.layers.add(item); span(ph, a, b); ph.name = "PHOTO " + item.name;
    var s = h / item.height * 100;
    xf(ph).property("ADBE Position").setValueAtTime(tc(a), [cx, cy]); xf(ph).property("ADBE Position").setValueAtTime(tc(b), [cx + 10, cy - 6]);
    xf(ph).property("ADBE Scale").setValueAtTime(tc(a), [s, s]); xf(ph).property("ADBE Scale").setValueAtTime(tc(b), [s * 1.06, s * 1.06]);
    xf(ph).property("ADBE Rotate Z").setValue(rot || 0);
    ph.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION").property(4).setValue(-35);
    var bw = Math.round(14 / (s / 100)), fr = C.layers.addSolid([0.93, 0.92, 0.88], "PHOTO border", item.width + bw * 2, item.height + bw * 2, 1, C.duration);
    fr.inPoint = ph.inPoint; fr.outPoint = ph.outPoint; fr.parent = ph;
    xf(fr).property("ADBE Position").setValue([item.width / 2, item.height / 2]); xf(fr).property("ADBE Scale").setValue([100, 100]); xf(fr).property("ADBE Rotate Z").setValue(0);
    fr.moveAfter(ph);
    var ds = fr.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
    try { ds.property("ADBE Drop Shadow-0002").setValue(170); ds.property("ADBE Drop Shadow-0004").setValue(18); ds.property("ADBE Drop Shadow-0005").setValue(40); } catch (e) {}
    return ph;
  };
  K.serifLine = function (txt, x, y, size, a, b) {             // Baskerville line for quotes
    var C = K.C, l = C.layers.addText(txt); l.name = "QUOTE " + txt; span(l, a, b);
    var sp = l.property("ADBE Text Properties").property("ADBE Text Document"), td = sp.value;
    td.fontSize = size; td.fillColor = [0.08, 0.08, 0.08]; td.applyFill = true; td.justification = ParagraphJustification.LEFT_JUSTIFY;
    try { td.font = "Baskerville-SemiBold"; } catch (e) {}
    sp.setValue(td); xf(l).property("ADBE Position").setValue([x, y]); return l;
  };
  K.highlightText = function (textLayer, t, dur) {             // marker behind a whole serif line
    var C = K.C, r = textLayer.sourceRectAtTime(tc(t), false), pos = xf(textLayer).property("ADBE Position").value;
    var hq = C.layers.addShape(); hq.name = "HIGHLIGHT text"; hq.startTime = 0; hq.inPoint = tc(t); hq.outPoint = textLayer.outPoint;
    var g = hq.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"), rq = g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
    var w = r.width * 0.95, h = r.height * 0.62;
    rq.property("ADBE Vector Rect Size").setValue([w, h]); rq.property("ADBE Vector Rect Position").setValue([w / 2, 0]);
    g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([1.0, 0.9, 0.0]);
    xf(hq).property("ADBE Anchor Point").setValue([0, 0]); xf(hq).property("ADBE Position").setValue([pos[0] + r.left - 10, pos[1] + r.top + r.height * 0.55]);
    xf(hq).property("ADBE Scale").setValueAtTime(tc(t), [0, 100]); xf(hq).property("ADBE Scale").setValueAtTime(tc(t) + (dur || 0.7), [100, 100]);
    hq.blendingMode = BlendingMode.MULTIPLY; hq.moveAfter(textLayer); return hq;
  };
  K.stockShot = function (item, a, b, archival) {              // full-frame stock with a slow push; archival = faded warm grade
    var C = K.C, l = C.layers.add(item); span(l, a, b); l.name = "STOCK " + item.name;
    var s = Math.max(1920 / item.width, 1080 / item.height) * 100;
    xf(l).property("ADBE Scale").setValueAtTime(tc(a), [s, s]); xf(l).property("ADBE Scale").setValueAtTime(tc(b), [s * 1.06, s * 1.06]);
    if (l.canSetTimeRemapEnabled && !item.mainSource.isStill) { l.timeRemapEnabled = true; l.property("ADBE Time Remapping").expression = "loopOut('cycle')"; l.inPoint = tc(a); l.outPoint = tc(b); }
    if (archival !== false) {
      l.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION").property(4).setValue(-70);
      var tint = l.property("ADBE Effect Parade").addProperty("ADBE Tint"); tint.property(2).setValue([0.96, 0.9, 0.78]); tint.property(3).setValue(30);
      l.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2").property(2).setValue(22);
    }
    return l;
  };
  // grade measured against "How to Sell a War": lifted, faded, warm cream with a slight green-yellow cast
  K.paperGrade = function () {
    var C = K.C;
    var cam = C.layers.addSolid([0, 0, 0], "CAMERA drift (adjustment)", 1920, 1080, 1, C.duration); cam.adjustmentLayer = true;
    var tfx = cam.property("ADBE Effect Parade").addProperty("ADBE Geometry2");
    for (var k = 1; k <= tfx.numProperties; k++) { var tp = tfx.property(k);
      if (tp.name === "Position") tp.expression = "value + [wiggle(0.45, 9)[0] - value[0], wiggle(0.45, 6)[1] - value[1]]";
      else if (tp.name === "Scale") tp.setValue(104); else if (tp.name === "Rotation") tp.expression = "wiggle(0.3, 0.35)"; }
    var gd = C.layers.addSolid([0, 0, 0], "GRADE (adjustment)", 1920, 1080, 1, C.duration); gd.adjustmentLayer = true;
    var lev = gd.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
    for (var k2 = 1; k2 <= lev.numProperties; k2++) { var lp = lev.property(k2);
      try { if (lp.name === "Gamma") lp.setValue(1.16); else if (lp.name === "Output Black") lp.setValue(0.05); else if (lp.name === "Output White") lp.setValue(0.93); } catch (e) {} }
    var pf = gd.property("ADBE Effect Parade").addProperty("ADBE Photo Filter");
    for (var k3 = 1; k3 <= pf.numProperties; k3++) { var fp = pf.property(k3);
      try { if (fp.name === "Filter") fp.setValue(21); else if (fp.name === "Color") fp.setValue([0.84, 0.82, 0.5]); else if (fp.name === "Density") fp.setValue(28); } catch (e) {} }
    gd.property("ADBE Effect Parade").addProperty("ADBE HUE SATURATION").property(4).setValue(-12);
    var vg = C.layers.addSolid([0, 0, 0], "VIGNETTE", 1920, 1080, 1, C.duration);
    var m = vg.property("ADBE Mask Parade").addProperty("ADBE Mask Atom"); m.inverted = true;
    var es = new Shape(); es.vertices = [[960, 40], [1840, 540], [960, 1040], [80, 540]];
    es.inTangents = [[-480, 0], [0, -280], [480, 0], [0, 280]]; es.outTangents = [[480, 0], [0, 280], [-480, 0], [0, -280]]; es.closed = true;
    m.property("ADBE Mask Shape").setValue(es); m.property("ADBE Mask Feather").setValue([300, 300]); xf(vg).property("ADBE Opacity").setValue(44);
  };
  // real 35mm grain (Envato pack) over a whole master comp; also the light dust used everywhere
  K.filmFinish = function (comp, plate, opacity) {
    var g = K.imp(A + "look_kit/film_grain_35mm/Film Grain 35mm " + (plate || "Medium") + ".mp4");
    var l = comp.layers.add(g); l.name = "FILM GRAIN 35mm " + (plate || "Medium") + " (Envato)";
    var s = Math.max(comp.width / g.width, comp.height / g.height) * 100; xf(l).property("ADBE Scale").setValue([s, s]);
    l.timeRemapEnabled = true; l.property("ADBE Time Remapping").expression = "loopOut('cycle')"; l.outPoint = comp.duration;
    l.blendingMode = BlendingMode.OVERLAY; xf(l).property("ADBE Opacity").setValue(opacity || 80); l.audioEnabled = false;
    return l;
  };
  return K;
})();
