// WONGA COUP - CHAPTER 00 COLD OPEN: the dark runway - first cut 0:00.0-2:37.0 (0-157.0 s) - BUILD 3 (b-roll upgrade, overnight 6 Nov 2026)
// Build 3 = build 2 with the generic Envato stand-ins swapped for real footage (00-B1..B5, 00-P2; see SOURCES.csv and build/BROLL UPGRADE 00.md). Timings, templates, fonts, Jude untouched.
// Written by chapter session wonga-00 (Nongov Kelvin), 4 Nov 2026. Build 2 (user notes 4 Nov): Envato/house template scenes carry the beats,
// all information text in Clash Grotesk (Semibold display / Regular support), Baskerville for quotes, Courier only on document props.
// Run in AE 2025 (only with "ae wonga coup.aep" open, under the AE lock):
//   osascript -e "with timeout of 3600 seconds" -e 'tell application "Adobe After Effects 2025" to DoScriptFile "<this file>"' -e "end timeout"
// Re-running replaces only what this script made (its "00a ..." subfolders + its master). Nothing is saved.
// Missing files fall back to stand-ins (logged as PLACEHOLDER): drop a file named with its code (E00_01_..., S00-03 ...) and re-run.
// Jude ends at 154.7 ("...flying right into a trap."), then a hard drop into the film's title card (Top Secret Scene_01) 154.7-157.0.
// Chapter 01's card takes the rest of the hole, 157.0-159.2 (agreed with session wonga-01).
// Log: build_00_cold_open_2.log next to this file.
#target aftereffects
// Top-level on purpose: the copied helpers (_helpers_from_03/04.jsx) read this script's globals (MEDIA, PAPERS, PARTS, BR, PX, master, TRN, TR, log...).
// Everything runs inside one try/catch, so an error is logged and never opens a dialog.
var HERE = File($.fileName).parent.fsName;
var LOG = [];
function log(s) { LOG.push(s); try { writeLog(); } catch (e) {} }
function writeLog() { var f = new File(HERE + "/build_00_cold_open_3.log"); f.encoding = "UTF-8"; f.open("w"); f.write(LOG.join("\n")); f.close(); }
var GO = false;
try {
  // ---------- guard: only ever build into the Wonga project ----------
  var pf = app.project.file;
  var PN = pf ? decodeURI(pf.name).toLowerCase() : "";
  if (PN !== "ae wonga.aep" && PN !== "ae wonga coup.aep") log("STOP: open project is " + (pf ? decodeURI(pf.fsName) : "unsaved/none") + " - not the Wonga project. Nothing built.");
  else { $.global.KIT_BUILD_FOLDER = "WONGA BUILD"; $.evalFile(new File(HERE + "/../../../../_HOUSE STYLE/look_kit/kit.jsx")); GO = true; }
} catch (e0) { log("SETUP ERROR " + e0.toString() + " line " + e0.line); }
if (GO) {
var P = app.project;
var FILM = new Folder(HERE + "/../../..").fsName + "/", AS = FILM + "Assets/", CH = AS + "00_cold_open/";
var BR = CH + "broll/", PH = CH + "photos/", PX = PH + "parallax/", DOC = CH + "docs/";
var SPECIAL = AS + "_special/00_cold_open/", YT = AS + "Youtube downloads/";
var TR = FILM + "../Viktor Most wanted/Assets/01_sharjah/transitions/";   // the Envato ink/brush packs (read-only, shared with the Viktor film)
var WORLD = FILM + "../Viktor Most wanted/Assets/01_sharjah/docs/AF_World_political_map_2013_PD.png";   // public domain world map (W() is calibrated to it)
var T0 = 0, T1 = 157.0, TH_END = 154.7;
var xf = KIT.xf, child = KIT.child, folder = KIT.folder;
var RED = [0.6, 0.06, 0.06], CREAM = [0.97, 0.94, 0.86];

var VB = KIT.build(), CF = folder("00 Cold open", VB);
var MN = "00 COLD OPEN 0:00-2:37", MN_OLD = "00 COLD OPEN 0:00-2:35";
for (var i = CF.numItems; i >= 1; i--) { var it0 = CF.item(i); if (it0.name === MN || it0.name === MN_OLD || it0.name === "00a parts 0:00-2:35" || it0.name === "00a paper + stock inserts 0:00-2:35") it0.remove(); }
var PARTS = folder("00a parts 0:00-2:35", CF), PAPERS = folder("00a paper + stock inserts 0:00-2:35", CF), MEDIA = folder("media 00 cold open", VB);
var master = null;   // the helpers' addTransition() reads this global

app.beginUndoGroup("Build 00 Cold open 3 0:00-2:37");
app.beginSuppressDialogs();
try {
$.evalFile(new File(HERE + "/_helpers_from_03.jsx"));
$.evalFile(new File(HERE + "/_helpers_from_04.jsx"));
var seg0 = seg;
// USER, 6 Nov 2026: "remove the attribution/credits on everything" - on-screen source/credit lines are dropped (logged).
// Kept: ILLUSTRATIVE / STAND-IN labels and claim attributions required by the fact rules. Sources stay in SOURCES.csv.
var SRC_KEEP = /a^/, CREDITS_OFF = 0;   // USER, 6 Nov: "remove them all" - every source/credit/ILLUSTRATIVE/attribution line goes
var ATTR_STRONG = /ACCORDING TO|AS REPORTED|AS ALLEGED|LATER ALLEGED|ALLEGED|CLAIMS|PRODUCED BY THE PROSECUTION|HIS ACCOUNT|'S ACCOUNT|SWORN EVIDENCE|HIS EVIDENCE|TESTIMONY|AS DESCRIBED BY|AS QUOTED/i, ATTR_LABEL = /^\s*(ILLUSTRAT|STAND-IN|SOURCE|PHOTO|FOOTAGE)/i;
var PUBS = "as reported|illustration|illustrative|according to|CNN|Sapa|Sapa-AFP|Mail & Guardian|M&G|Guardian|Observer|Independent|IOL|Al Jazeera|AJE|BBC|AP|AFP|Reuters|Salon|Telegraph|Hansard|News24|Kansas City Star|KC Star|Africa Confidential|VOA|Polity|HRW|Human Rights Watch|Amnesty|Journeyman|SABC|TV5MONDE|euronews|60 Minutes|Channel 4 News|Wapster|Commons";
var PUB_RX = new RegExp("\\s*\\((?:[^)]*\\b(?:" + PUBS + ")\\b[^)]*)\\)", "gi");
function deAttr(s) { if (typeof s !== "string") return s; var r = s.replace(PUB_RX, "").replace(/^As reported:\s*/i, "").replace(/\s*[-,]\s*(as reported|according to|as alleged|as later alleged)[^\r]*/gi, "").replace(/\s*FOOTAGE ILLUSTRATIVE\.?/gi, "").replace(/\s*\(ILLUSTRATION\)/gi, "");
  if (r !== s) CREDITS_OFF++; return r.length ? r : " "; }
function offLine(orig) { var t2 = deAttr(orig); return { txt: t2, hide: ATTR_STRONG.test(String(orig)) || ATTR_LABEL.test(t2) }; }
function hideL(l, why) { try { l.enabled = false; l.name = "CREDIT OFF " + l.name; } catch (e) {} CREDITS_OFF++; log("attribution hidden: " + why); }
var staticType0 = staticType; staticType = function (txt, x, y, size, col, a, b) { var o = offLine(txt), l = staticType0(o.txt, x, y, size, col, a, b); if (o.hide) hideL(l, txt); return l; };
if (typeof stamp === "function") { var stamp0 = stamp; stamp = function (txt, x, y, size, a, b, rot) { var o = offLine(txt), n0 = KIT.C.numLayers, r = stamp0(o.txt, x, y, size, a, b, rot);
  if (o.hide) { for (var q = 1; q <= KIT.C.numLayers - n0; q++) hideL(KIT.C.layer(q), txt); } return r; }; }
var nameTag0 = nameTag; nameTag = function (txt, a, b, x, y, size) { var o = offLine(txt), n0 = KIT.C.numLayers, r = nameTag0(o.txt, a, b, x, y, size);
  if (o.hide) { for (var q = 1; q <= KIT.C.numLayers - n0; q++) hideL(KIT.C.layer(q), txt); } return r; };
var setText0 = setText; setText = function (l, s) { var o = (typeof s === "string") ? offLine(s) : { txt: s, hide: false }; return setText0(l, o.hide ? " " : o.txt); };
if (typeof quote === "function") { var quote0 = quote; quote = function (txt, x, y, size, t, b, who, markDur) { if (who) { CREDITS_OFF++; log("quote credit removed: " + who); } return quote0(txt, x, y, size, t, b, null, markDur); }; }
var SRC0 = SRC; SRC = function (txt) { if (!SRC_KEEP.test(String(txt))) { CREDITS_OFF++; log("credit line removed: " + txt); return null; } return SRC0.apply(null, arguments); }; seg = function (comp, a, kind) { log("built " + (comp ? comp.name : "NULL") + " @" + a); seg0(comp, a, kind); };

// ---------- media ----------
// pk(code): first importable file whose name starts with code + (space | _ | .), looked for in this chapter's photos/ and broll/,
// then the user's _special/00_cold_open/ and Youtube downloads/ (two folder levels deep). Never moves or renames anything.
function listFiles(dir, depth) { var out = [], fo = new Folder(dir); if (!fo.exists) return out; var fs = fo.getFiles();
  for (var q = 0; q < fs.length; q++) { if (fs[q] instanceof File) out.push(fs[q]); else if (depth > 0) out = out.concat(listFiles(fs[q].fsName, depth - 1)); } return out; }
function pk(code, fb) {
  var dirs = [[PH, 0], [BR, 0], [SPECIAL, 1], [YT, 2]];
  for (var d = 0; d < dirs.length; d++) { var fs = listFiles(dirs[d][0], dirs[d][1]), hits = [];
    for (var q = 0; q < fs.length; q++) { var n = decodeURI(fs[q].name), c = n.charAt(code.length);
      if (n.indexOf(code) === 0 && (c === " " || c === "_" || c === ".") && /\.(mov|mp4|m4v|jpg|jpeg|png|tif|tiff|psd)$/i.test(n)) hits.push(fs[q]); }
    hits.sort(function (a, b) { return decodeURI(a.name) < decodeURI(b.name) ? -1 : 1; });
    for (var h = 0; h < hits.length; h++) { try { return imp(hits[h].fsName); } catch (e) { log("BAD FILE (not importable) " + decodeURI(hits[h].name) + ": " + e); } } }
  log("PLACEHOLDER " + code + " -> " + (fb ? fb.name : "none")); return fb;
}
function ex(p) { return new File(p).exists; }
function vid(code) { var f = new File(BR + code + ".mp4"); if (f.exists) return imp(f.fsName); log("MISSING clip " + code); return null; }
var M = {
  firstcut: KIT.findAny("Wonga Coup.mp4", FootageItem) || imp(FILM + "Talking head footage/Wonga Coup.mp4"),
  world: ex(WORLD) ? imp(WORLD) : null,
  // the user's finds (Youtube downloads/, copied/converted into photos/ and broll/)
  harareAir: pk("S00-02 67", null),            // Harare International Airport from the air (user find; it fills S00-06)
  mann04: pk("S00-04 67", null),               // Mann in custody, Harare 2004 (AFP watermark)
  mann04b: pk("S00-04 hu", null),
  kingAir: pk("S00-08 4g", null),              // Beechcraft King Air ZS-NBJ (airliners.net-style photo)
  n4610: pk("S00-Y1_still_N4610_AP_8Mar2004_crop", null),   // AP frame, 8 Mar 2004, pillarbox cropped
  y1: vid("S00-Y1"), y3: vid("S00-Y3"), y4: vid("S00-Y4"),   // the clips themselves (pk would also match the S00-Y1_still png)
  mann03: pk("S00-03", null)                   // CLAUDE item: Wikimedia Commons portrait (not fetched yet)
};
if (!M.firstcut) throw new Error("first cut not found");
// BUILD 3: real footage (YouTube via JDownloader, 6 Nov; sources in SOURCES.csv). Sub-clips start at the checked source second.
function bv(name) { var f = new File(BR + name); if (f.exists) return imp(f.fsName); log("MISSING " + name); return null; }
var R = { b1: bv("00-B1 harare day to night.mp4"), b2: bv("00-B2 727 dusk landing.mp4"), b3: bv("00-B3 727 night apron.mp4"),
  b4: bv("00-B4 727 night cockpit.mp4"), b5: bv("00-B5 harare airport 2012.mp4") };
var P2 = ex(PH + "web/00-P2 N4610 seized Harare Mar 2004 CBS.jpg") ? imp(PH + "web/00-P2 N4610 seized Harare Mar 2004 CBS.jpg") : null;
function s169(item, t, tag) { return item ? clip169(item, t, tag) : null; }
function s43(item, t, tag) { return item ? clip43(item, t, 0, tag) : null; }
var E = {
  dusk: s169(R.b1, 0.0, "B1 Harare dusk") || pk("E00_01", M.harareAir),          // Harare skyline, day into night (timelapse)
  landing: s43(R.b2, 14.5, "B2 727 lands") || pk("E00_02", null),                 // a real Boeing 727 touching down at dusk
  taxi: s169(R.b3, 150.0, "B3 727 dark apron") || pk("E00_03", M.harareAir),      // a 727 on a dark apron at night
  taxi2: s169(R.b3, 112.0, "B3 727 loaders") || pk("E00_03", M.harareAir),        // a 727 under floodlights, loaders
  cockpit: s43(R.b4, 8.0, "B4 cockpit lights") || pk("E00_04", null),             // 727 cockpit at night, instrument lights only
  cockpit2: s43(R.b4, 90.0, "B4 cockpit 2") || pk("E00_04", null),
  tower: s169(R.b5, 291.0, "B5 Harare tower") || pk("E00_05", M.harareAir),       // the real Harare International control tower (2012)
  runway: s43(R.b4, 146.0, "B4 approach lights") || pk("E00_06", M.harareAir),    // approach + runway lights at night (727 cockpit)
  n4610_04: P2 || M.harareAir                                                     // the seized 727 at Harare, March 2004 (news photo)
};
log("media imported");

// ---------- fonts (user, 4 Nov 2026): Clash Grotesk for information text ----------
var CLASH = { semi: "ClashGroteskVariable-Bold_Semibold", reg: "ClashGroteskVariable-Bold_Regular", light: "ClashGroteskVariable-Bold_Light", bold: "ClashGroteskVariable-Bold" };
var FONTLOG = { ok: 0, bad: 0 };
function setFont(l, font, track, caps) {   // set and read back (a missing font falls back silently)
  var sp = l.property("ADBE Text Properties").property("ADBE Text Document"), had = sp.expressionEnabled, ex = sp.expression;
  if (had) sp.expression = "";
  var td = sp.value; td.font = font; if (track !== undefined) td.tracking = track; if (caps) td.text = td.text.toUpperCase(); sp.setValue(td);
  if (sp.value.font === font) FONTLOG.ok++; else { FONTLOG.bad++; log("FONT FALLBACK " + l.name + ": wanted " + font + " got " + sp.value.font); }
  if (had) sp.expression = ex; return l;
}
var tw0 = KIT.typewriter;   // KIT.typewriter hard-codes Courier: information labels get Clash (kit.jsx itself untouched)
KIT.typewriter = function (txt, x, y, size, col, a, b) { var l = tw0(txt, x, y, size, col, a, b); return setFont(l, size >= 40 ? CLASH.semi : CLASH.reg, size >= 40 ? 30 : 10); };
function propType(txt, x, y, size, col, a, b) { return tw0(txt, x, y, size, col, a, b); }   // Courier: only text that is part of a document prop


// ---------- helpers copied from build_07_08_1.jsx (Viktor ch 07-08) ----------
function rawTH(name, a, b) { var c = PAPERS.items.addComp("LABELS " + name, 1920, 1080, 1, b - a, KIT.FPS); c.displayStartTime = a; KIT.C = c; KIT.t0 = a; return c; }
function blackComp(name, a, b) { var c = PAPERS.items.addComp(name, 1920, 1080, 1, b - a, KIT.FPS); c.displayStartTime = a; c.layers.addSolid([0, 0, 0], "BLACK", 1920, 1080, 1, b - a); return c; }
function quoteCard(txt, x, y, size, a, b, at, mk) { var q = KIT.serifLine(txt, x, y, size, a, b); fadeIn(q, a + 0.05, 0.4); if (mk) KIT.highlightText(q, at, 0.5); return q; }
function fixedType(txt, x, y, size, col, a, b) { var t = staticType(txt, x, y, size, col, a, b); t.name = "SRC fixed " + txt; return t; }
function grid(name, x, y, cols, rows, cw, ch, gx, gy, col, a, dur, b) {
  var C = KIT.C, sh = C.layers.addShape(); sh.name = name; span(sh, a, b);
  var g = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"), vg = g.property("ADBE Vectors Group");
  var rc = vg.addProperty("ADBE Vector Shape - Rect"); rc.property("ADBE Vector Rect Size").setValue([cw, ch]); rc.property("ADBE Vector Rect Roundness").setValue(cw / 2);
  vg.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(col);
  var r1 = vg.addProperty("ADBE Vector Filter - Repeater"); r1.property("ADBE Vector Repeater Copies").setValue(cols);
  r1.property("ADBE Vector Repeater Transform").property("ADBE Vector Repeater Position").setValue([gx, 0]);
  var r2 = vg.addProperty("ADBE Vector Filter - Repeater"); r2.property("ADBE Vector Repeater Copies").setValueAtTime(KIT.tc(a), 0); r2.property("ADBE Vector Repeater Copies").setValueAtTime(KIT.tc(a) + dur, rows);
  r2.property("ADBE Vector Repeater Transform").property("ADBE Vector Repeater Position").setValue([0, gy]);
  xf(sh).property("ADBE Anchor Point").setValue([0, 0]); xf(sh).property("ADBE Position").setValue([x, y]); return sh;
}
function counter(x, y, size, col, t, dur, target, prefix, suffix, a, b) {
  var tl = staticType(prefix + "0", x, y, size, col, a, b), sp = tl.property("ADBE Text Properties").property("ADBE Text Document");
  sp.expression = "var p = Math.min(1, Math.max(0, (time - " + KIT.tc(t) + ") / " + dur + ")); p = 1 - Math.pow(1 - p, 3); var n = Math.round(" + target + " * p).toString();" +
    " var s = ''; while (n.length > 3) { s = ',' + n.substr(n.length - 3) + s; n = n.substr(0, n.length - 3); } '" + prefix + "' + n + s + (p >= 1 ? '" + suffix + "' : '');";
  var o = xf(tl).property("ADBE Opacity"); o.setValueAtTime(KIT.tc(t) - 0.05, 0); o.setValueAtTime(KIT.tc(t) + 0.1, 100);
  return tl;
}
function ring(doc, p, w, h, a, b, s0, s1, dash) {
  var C = KIT.C, ps = docScale(doc, a), sh = C.layers.addShape(); sh.name = "RING"; sh.parent = doc;
  sh.inPoint = KIT.tc(a); sh.outPoint = KIT.tc(b);
  var g = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
  g.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([w, h]);
  var st = g.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
  st.property("ADBE Vector Stroke Color").setValue([0.82, 0.08, 0.08]); st.property("ADBE Vector Stroke Width").setValue(7 / ps);
  if (dash) try { var ds = st.property("ADBE Vector Stroke Dashes"); ds.addProperty("ADBE Vector Stroke Dash 1").setValue(26 / ps); ds.addProperty("ADBE Vector Stroke Gap 1").setValue(16 / ps); } catch (e) {}
  xf(sh).property("ADBE Anchor Point").setValue([0, 0]); xf(sh).property("ADBE Position").setValue(p); xf(sh).property("ADBE Rotate Z").setValue(0);
  var sc = xf(sh).property("ADBE Scale"); sc.setValueAtTime(KIT.tc(a), [s0, s0]); sc.setValueAtTime(KIT.tc(b), [s1, s1]); ease(sc, 40);
  var o = xf(sh).property("ADBE Opacity"); o.setValueAtTime(KIT.tc(a), 0); o.setValueAtTime(KIT.tc(a) + 0.3, 100);
  sh.moveBefore(doc); return sh;
}
function ping(doc, p, t, b) {
  dot(doc, p, t, 18);
  var r = ring(doc, p, 80, 80, t, b, 20, 160, false); xf(r).property("ADBE Scale").expression = "var c = (time - inPoint) % 1.2; [20 + c * 120, 20 + c * 120]";
  xf(r).property("ADBE Opacity").expression = "var c = (time - inPoint) % 1.2; 100 - c * 80"; return r;
}
function stopAt(wm, ll, label, t, b, col, dx, dy, size) { var p = W(ll[0], ll[1]); dot(wm, p, t, 24); if (label) pinType(wm, label, [p[0] + (dx === undefined ? 22 : dx), p[1] + (dy === undefined ? -30 : dy)], size || 30, t + 0.05, b, col || [0.07, 0.07, 0.07]); return p; }
function leg(wm, l1, l2, t, dur, bend, solid, col) { var r = route(wm, W(l1[0], l1[1]), W(l2[0], l2[1]), t, dur, bend === undefined ? 0.15 : bend);
  var st = r.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").property("ADBE Vector Graphic - Stroke");
  if (solid) { st.property("ADBE Vector Stroke Width").setValue(9 / docScale(wm, t)); try { st.property("ADBE Vector Stroke Dashes").property(1).setValue(4000); } catch (e) {} }
  if (col) st.property("ADBE Vector Stroke Color").setValue(col);
  return r; }
function mapPage(name, a, b, focus) { paperPage(name, a, b); var wm = KIT.docShot(M.world, focus, a, b, 1600, -0.4); desat(wm, -55); return wm; }
function portrait(name, a, b, item, x, h, label, src, keys) {
  paperPage(name, a, b);
  var bgL = KIT.C.layers.add(item); bgL.name = "STOCK blur " + item.name; span(bgL, a, b); cover(bgL, 1920, 1080);
  bgL.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2").property(1).setValue(60); archival(bgL, -70); xf(bgL).property("ADBE Opacity").setValue(45);
  var c = card(item, x, 520, h, x < 960 ? -1.5 : 1.5, a + 0.05, b); depthKeep(c, -240);
  if (label) nameTag(label, a + 0.4, b, x < 960 ? 1000 : 120, 900, 38);
  if (src) SRC(src, a + 0.4, b, x < 960 ? 1000 : 120, 1040, 18);
  return endPaper3D(a, tk(), keys || [C0(a, 1.0), [b, x, 500, 1.12]]);
}
// ---------- new in this chapter ----------
// a 4:3 window onto an archive clip (AP / SABC uploads are 4:3 pillarboxed inside 16:9): source time srcIn plays at first-cut time a
function clip43(item, srcIn, a, tag, slow) {   // slow = stretch % (250 = 2.5x slower, frame-blended) for a source shot shorter than its slot
  var c = PARTS.items.addComp("CLIP43 " + tag, 1440, 1080, 1, 30, KIT.FPS), l = c.layers.add(item), k0 = (slow || 100) / 100;
  if (slow) { l.stretch = slow; l.frameBlendingType = FrameBlendingType.FRAME_MIX; c.frameBlending = true; }
  l.startTime = -srcIn * k0; l.inPoint = 0; l.outPoint = 30; l.audioEnabled = false;
  var k = 1080 / item.height * 100 * 1.02; xf(l).property("ADBE Scale").setValue([k, k]); xf(l).property("ADBE Position").setValue([720, 540]);
  c.duration = 30; return c;
}
function clip169(item, srcIn, tag) {
  var c = PARTS.items.addComp("CLIP169 " + tag, 1920, 1080, 1, 30, KIT.FPS), l = c.layers.add(item);
  l.startTime = -srcIn; l.inPoint = 0; l.outPoint = 30; l.audioEnabled = false;
  var k = 1920 / item.width * 100 * 1.03; xf(l).property("ADBE Scale").setValue([k, k]); xf(l).property("ADBE Position").setValue([960, 540]); return c;
}
// archive clip as a printed card on paper (never full-frame: these are 240p-480p). The clip comp starts at a, so source srcIn shows at a.
function archCard(name, a, b, item, srcIn, is43, h, src, slow) {
  paperPage(name, a, b);
  if (!item) { log("MISSING clip for " + name); return endPaper3D(a, tk(), [C0(a, 1.0), [b, 960, 540, 1.06]]); }
  var cc = is43 ? clip43(item, srcIn - KIT.tc(a), a, name, slow) : clip169(item, srcIn - KIT.tc(a), name);
  var c = card(cc, 960, 530, h || 820, -0.8, a + 0.02, b);
  if (src) SRC(src, a + 0.3, b);
  return c;
}
function darkPaper(op) { var C = KIT.C, d = C.layers.addSolid([0.05, 0.045, 0.04], "NIGHT (darken paper)", 1920, 1080, 1, C.duration); xf(d).property("ADBE Opacity").setValue(op || 70); return d; }   // call right after paperPage(): sits just above the paper
function nightGrade(l) { var lv = l.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
  for (var k = 1; k <= lv.numProperties; k++) { try { if (lv.property(k).name === "Gamma") lv.property(k).setValue(0.55); if (lv.property(k).name === "Output White") lv.property(k).setValue(0.7); } catch (e) {} }
  var tn = l.property("ADBE Effect Parade").addProperty("ADBE Tint"); tn.property(1).setValue([0.05, 0.07, 0.12]); tn.property(2).setValue([0.9, 0.85, 0.75]); tn.property(3).setValue(35); }

// ---------- template helpers (build 2) ----------
function textLayers(c) { var out = []; for (var i = 1; i <= c.numLayers; i++) if (c.layer(i) instanceof TextLayer) out.push(c.layer(i)); return out; }
function fontByRank(c, roles) {   // biggest text gets roles[0], the rest roles[1]
  var t = textLayers(c); t.sort(function (p, q) { return q.property("ADBE Text Properties").property("ADBE Text Document").value.fontSize - p.property("ADBE Text Properties").property("ADBE Text Document").value.fontSize; });
  for (var i = 0; i < t.length; i++) { var r = i === 0 ? roles[0] : roles[1]; setFont(t[i], r[0], r[1], r[2]); } }
// Detective montage (detMontage from chapter 04) + Clash on its text card (heading Semibold caps, paragraph Regular)
function detScene(sceneName, tag, items, head, para) {
  var sc = detMontage(sceneName, tag, items, head, para), DF = child(PARTS, "Detective " + sceneName + " " + tag, FolderItem);
  for (var d = 1; d <= DF.numItems; d++) { var it = DF.item(d); if (it instanceof CompItem && /^Text \d+ /.test(it.name)) fontByRank(it, [[CLASH.semi, 30, true], [CLASH.reg, 0, false]]); }
  return sc; }
// History 4K scene (histScene from chapter 01) + Clash: big = Semibold caps, small = Regular
function hist(srcName, newName, item, big, small, useDur) {
  var c = histScene(srcName, newName, fillWith(item, -55), { big: big, small: small }, useDur); if (c) fontByRank(c, [[CLASH.semi, 30, true], [CLASH.reg, 10, false]]); return c; }
// Confidential Files (Envato, Flok): deep-duplicate Stage n with its Page / MC / Media / Text / TextSub comps, fill the photo slot and the texts
function dupConf(n, tag) {
  var CFr = KIT.findAny("Confidential Files", FolderItem), DF = folder("Confidential Stage" + n + " " + tag, PARTS), map = {}, byName = {}, RX = /^(Page|MC|Media|Text|TextSub)\d+$/;
  function find(nm) { function rec(fo) { for (var i = 1; i <= fo.numItems; i++) { var it = fo.item(i); if (it.name === nm && it instanceof CompItem) return it; if (it instanceof FolderItem) { var r = rec(it); if (r) return r; } } return null; } return CFr ? rec(CFr) : null; }
  function d(c) { if (map[c.id]) return map[c.id]; var x = c.duplicate(); x.name = c.name + " " + tag; x.parentFolder = DF; map[c.id] = x; byName[c.name] = x;
    for (var j = 1; j <= x.numLayers; j++) { var l = x.layer(j); if (l.source instanceof CompItem && RX.test(l.source.name)) { var on = l.name; l.replaceSource(d(l.source), false); l.name = on; } } return x; }
  var st = find("Stage" + n); if (!st) { log("MISSING Confidential Stage" + n); return null; }
  var c = d(st); c.name = "Confidential Stage" + n + " " + tag; return { scene: c, get: function (nm) { return byName[nm]; } };
}
function confPage(n, tag, item, srcIn, heading, sub, label, propText) {
  var D = dupConf(n, tag); if (!D) return null;
  var md = D.get("Media" + n); if (md) { for (var q = md.numLayers; q >= 1; q--) { if (md.layer(q).name.indexOf("CLAUDE") === 0) md.layer(q).remove(); else md.layer(q).enabled = false; }
    var ml = md.layers.add(item); ml.name = "CLAUDE media " + item.name; ml.audioEnabled = false;
    if (isVideo(item)) { ml.startTime = -(srcIn || 0); ml.inPoint = 0; ml.outPoint = md.duration; }
    cover(ml, md.width, md.height); archival(ml, -45); } else log("no Media" + n + " in Stage" + n);
  var tx = D.get("Text" + n); if (tx) { var t1 = textLayers(tx); for (var i = 0; i < t1.length; i++) { setText(t1[i], i === 0 ? heading : " "); setFont(t1[i], CLASH.semi, 30, true); } }
  var ts = D.get("TextSub" + n); if (ts) { var t2 = textLayers(ts); for (var k = 0; k < t2.length; k++) { setText(t2[k], k === 0 ? sub : " "); setFont(t2[k], CLASH.reg, 10, false); } }
  var pg = D.get("Page" + n); if (pg) { var t3 = textLayers(pg); for (var m = 0; m < t3.length; m++) { var tv = t3[m].property("ADBE Text Properties").property("ADBE Text Document").value.text;
      setText(t3[m], tv.length > 40 ? propText : label); setFont(t3[m], "CourierNewPS-BoldMT"); } }   // the page's own typed lines are document props: Courier
  return D.scene;
}
// Top Secret Scene_01 (title card): deep duplicate with its Text 01A / Text 01_01 / Text 01_02 chain
function titleTS(tag, line1, line2) {
  var sc = tsComp("Scene_01"); if (!sc) { log("MISSING Top Secret Scene_01"); return null; }
  var DF = folder("Top Secret Scene_01 " + tag, PARTS), map = {}, byName = {}, RX = /^(Text 01A|Text 01_0\d)$/;
  function d(c) { if (map[c.id]) return map[c.id]; var n = c.duplicate(); n.name = c.name + " " + tag; n.parentFolder = DF; map[c.id] = n; byName[c.name] = n;
    for (var j = 1; j <= n.numLayers; j++) { var l = n.layer(j); if (l.source instanceof CompItem && RX.test(l.source.name)) { var on = l.name; l.replaceSource(d(l.source), false); l.name = on; } } return n; }
  var c = sc.duplicate(); c.name = "Scene_01 " + tag; c.parentFolder = DF;
  for (var i = 1; i <= c.numLayers; i++) { var l = c.layer(i); if (l.source instanceof CompItem && RX.test(l.source.name)) { var on = l.name; l.replaceSource(d(l.source), false); l.name = on; } }
  var a1 = byName["Text 01_01"], a2 = byName["Text 01_02"];
  if (a1) { setText(a1.layer(1), line1); setFont(a1.layer(1), CLASH.semi, 40, true); } else log("MISSING Text 01_01");
  if (a2) { setText(a2.layer(1), line2); setFont(a2.layer(1), CLASH.semi, 40, true); } else log("MISSING Text 01_02");
  return c;
}
var LL = { HRE: [31.09, -17.93], SSG: [8.71, 3.75], BKO: [-7.95, 12.53] };   // Harare Intl, Malabo (Bioko), Bamako

// =====================================================================
// COLD OPEN 0:00.0-2:34.7 (shot plan: build/SHOT PLAN 00.md)
// =====================================================================
// 01-02 0.00-9.98 TEMPLATE Detective Scene 2 (5 slots): "The last light is fading over Harare ... a plain white Boeing 727 touches down."
seg(detScene("Scene 2", "W00a", [E.dusk, E.landing, E.tower, E.runway, M.harareAir], "HARARE, ZIMBABWE", "Sunday 7 March 2004, at dusk"), 0.00, "none"); SEG[SEG.length - 1].srcIn = 0;
// 03 9.98-14.28 "It is an old plane with a single blue stripe down its side." - the real plane, AP 8 Mar 2004 (side view)
archCard("P03 the 727 side 0:10", 9.98, 14.28 + OV, M.y1, 76.0, true, 860, "AP ARCHIVE - HARARE, 8 MARCH 2004");
endPaper3D(9.98, tk(), [C0(9.98, 1.0), [14.28 + OV, 900, 540, 1.12]]);
// 04 14.28-23.04 "...an American registration number painted on its body. N4610." - the AP frame, red circle on the number
paperPage("P04 N4610 0:14", 14.28, 23.04 + OV);
var n4 = M.n4610 ? card(M.n4610, 960, 520, 760, -1.2, 14.30, 23.04 + OV) : null;
if (n4) { depthKeep(n4, -120); KIT.circle(n4, [88, 140, 300, 95], 21.40, 8); }
SRC("AP ARCHIVE - HARARE, 8 MARCH 2004", 14.6, 23.04 + OV);
endPaper3D(14.28, tk(), [C0(14.28, 0.95), [18.0, 960, 540, 1.05], [21.4, 960, 560, 1.35], [23.04 + OV, 960, 560, 1.42]], { card: 120 });
// 05 TH 23.04-29.22 "Until 2002, it belonged to the United States Air Force. But tonight, it is a ghost flight." (the 2002 date is OPEN: no text on screen)
seg(rawTH("TH1 ghost flight 0:23", 23.04, 29.22 + OV), 23.04, "none");
// 06-07 29.22-42.72 TEMPLATE Detective Scene 4 (9 slots): "...rolls away from the bright terminal ... Only the cockpit lights are on."
seg(detScene("Scene 4", "W00b", [E.taxi, E.cockpit, E.n4610_04, E.taxi2, E.runway, E.cockpit2, E.tower, M.harareAir, E.taxi], "CARGO AREA", "Harare International Airport"), 29.22, tk()); SEG[SEG.length - 1].srcIn = 0;
// 08 TH 42.72-53.00 "According to Zimbabwean officials, written instructions ... keep still, keep silent, and keep the lights off." - attribution label lower-left
seg(rawTH("TH2 instructions 0:43", 42.72, 53.00 + OV), 42.72, "none");
nameTag("ACCORDING TO ZIMBABWEAN OFFICIALS", 43.0, 49.6, 120, 960, 30);
SRC("AS REPORTED BY THE MAIL & GUARDIAN, 12 SEPTEMBER 2004", 43.3, 49.6, 120, 1010, 20, CREAM);
// 09 53.00-60.54 TEMPLATE Confidential Files Stage1 (dossier page): "the captain told the control tower ... three crew and four loaders." (ILLUSTRATION)
seg(confPage(1, "W00c", E.tower || M.harareAir, 0, "3 CREW, 4 LOADERS", "Declared to the tower (illustration, as reported)", "N4610",
  "HARARE TOWER - INBOUND B727 N4610\rPERSONS ON BOARD: 3 CREW, 4 LOADERS\r(ILLUSTRATION)"), 53.00, tk()); SEG[SEG.length - 1].srcIn = 0;
// 10 60.54-64.04 "But there are 64 men sitting in that darkness." - 64 figures fill in on dark paper (hard cut)
paperPage("P10 64 men 1:00", 60.54, 64.04 + OV);
try { grid("GRID 64", 300, 330, 16, 4, 40, 100, 66, 150, [0.16, 0.15, 0.13], 60.60, 1.2, 64.04 + OV); } catch (eg) { log("grid: " + eg); }
counter(1460, 560, 260, [0.85, 0.12, 0.1], 60.90, 0.9, 64, "", "", 60.54, 64.04 + OV);
endPaper3D(60.54, "none", [C0(60.54, 1.0), [64.04 + OV, 960, 560, 1.08]]);
// 11 TH 64.04-75.54 "Most of them are tough, former soldiers. Their story is ... guard mines in the Congo. It is a story they will stick to for months."
seg(rawTH("TH3 the story 1:04", 64.04, 75.54 + OV), 64.04, "none");
// 12 75.54-81.10 "Outside, standing near the quiet runway," [black + silent hole 78.7-81.1: the runway holds]
archCard("S12 quiet runway 1:16", 75.54, 81.10 + OV, R.b4, 150.0, true, 820, "ILLUSTRATIVE: A BOEING 727 ON NIGHT APPROACH (ARCHIVE VIDEO)");
still(); endPaper3D(75.54, tk(), [C0(75.54, 1.0), [81.10 + OV, 960, 540, 1.03]]);
// 13 81.10-86.22 TEMPLATE History 4K Scene 01: "an Englishman is waiting with two of his men." - Mann, Harare 2004 (no name: ch 02 names him)
if (M.mann04) { seg(hist("Scene 01", "W00 H01 Harare 6 March", M.mann04, ["6 MARCH 2004", 0.6], ["Harare", 1.4], 5.12 + OV), 81.10, tk()); SEG[SEG.length - 1].srcIn = 0; }
else log("MISSING S00-04 Mann portrait");
// 14 86.22-92.58 "He used to be an officer in Britain's elite special forces. And he flew into Harare the day before." - Mann walking, Al Jazeera (ZIMBABWE, 2004)
archCard("P14 Mann walking 1:26", 86.22, 92.58 + OV, M.y3, 12.2, false, 760, "AL JAZEERA ENGLISH - ZIMBABWE, 2004");
endPaper3D(86.22, tk(), [C0(86.22, 1.0), [92.58 + OV, 1020, 500, 1.14]]);
// 15 TH 92.58-99.32 "He has already put down cash for the heavy cargo, and he is watching for it to be loaded onto the plane."
seg(rawTH("TH4 the cargo 1:33", 92.58, 99.32 + OV), 92.58, "none");
// ---- TENSION RUN 99.32-109.46: the arms list, hard cuts ----
// 16 99.32-104.89 "Inside those crates are 61 assault rifles, 20 machine guns, 150 grenades," - three numbers on cards as spoken
paperPage("P16 the arms 1:39", 99.32, 104.89 + OV);
var AR = [[61, "ASSAULT RIFLES", 100.63], [20, "MACHINE GUNS", 102.20], [150, "GRENADES", 103.53]];
for (var ai = 0; ai < AR.length; ai++) { var ax = 380 + ai * 580;
  cardBox("CARD arms " + ai, ax, 560, 480, 360, AR[ai][2] - 0.08, 104.89 + OV, ai === 1 ? 1 : -1, [0.96, 0.95, 0.9]);
  counter(ax - 150, 560, 150, RED, AR[ai][2], 0.4, AR[ai][0], "", "", 99.32, 104.89 + OV);
  staticType(AR[ai][1], ax - 160, 680, 30, [0.2, 0.19, 0.17], AR[ai][2] + 0.15, 104.89 + OV); }
SRC("THE ARMS ORDER AS REPORTED (ZIMBABWE DEFENCE INDUSTRIES / THE GUARDIAN)", 99.4, 104.89 + OV);
endPaper3D(99.32, "none", [C0(99.32, 1.0), [100.6, 420, 560, 1.25], [102.2, 960, 560, 1.25], [103.5, 1540, 560, 1.25], [104.89 + OV, 1500, 560, 1.3]], { card: 120, text: 100 });
// 17-18 104.89-109.46 TEMPLATE Confidential Files Stage2: "rocket launchers and mortars, and tens of thousands of rounds" - the seized kit (AP clip) on a dossier page
seg(confPage(2, "W00d", M.y1, 89.0, "THE ARMS ORDER", "As reported: Zimbabwe Defence Industries / The Guardian", "ZDI",
  "61 AK-47 / 20 LMG / 150 GRENADES / RPG-7 / 60MM MORTARS\rAMMUNITION: TENS OF THOUSANDS OF ROUNDS"), 104.89, "none"); SEG[SEG.length - 1].srcIn = 0;
// ---- BREATH 109.46-129.74: the map, then the island (slower, longer holds) ----
// 19 109.46-119.46 "...one final stop. A tiny island in the Gulf of Guinea, more than 3,000 kilometres away." - Harare -> Malabo draws on
var wm19 = M.world ? mapPage("P19 MAP Harare-Malabo 1:49", 109.46, 119.46 + OV, [3600, 2000, 900, 750]) : null;
if (wm19) {
  stopAt(wm19, LL.HRE, "HARARE", 109.6, 119.46 + OV, null, 22, 40);
  leg(wm19, LL.HRE, LL.SSG, 113.3, 2.6, 0.18, true, RED);
  stopAt(wm19, LL.SSG, "MALABO", 115.0, 119.46 + OV, RED, -170, -30);
  fixedType("3,000+ KM", 1240, 300, 64, RED, 117.17, 119.46 + OV);
  SRC("MAP: PUBLIC DOMAIN (WORLD POLITICAL MAP, 2013)", 109.6, 119.46 + OV);
  endPaper3D(109.46, "ink1", mapCam(wm19, [[109.46, 30, -12, 1.0], [113.2, 27, -10, 1.0], [116.0, 18, -6, 1.12], [119.46 + OV, 12, -2, 1.3]]));
} else log("MISSING world map");
// 20 119.46-124.56 "It is scheduled to touch down there at 2.30 in the morning, under the cover of darkness." - Bioko: Pico Basile above the cloud (SABC)
archCard("P20 Bioko 2:00", 119.46, 124.56 + OV, M.y4, 158.85, true, 860, "SABC SPECIAL ASSIGNMENT / JOURNEYMAN PICTURES, 2004", 250);   // the Pico shot is 158.8-161.4 only
fixedType("02:30", 140, 190, 64, RED, 121.28, 124.56 + OV);
endPaper3D(119.46, tk(), [C0(119.46, 1.0), [124.56 + OV, 960, 520, 1.08]]);
// 21 124.56-129.74 "This island is home to the capital of one of Africa's richest new oil nations." - an offshore oil platform, gas flare (SABC)
archCard("P21 oil 2:05", 124.56, 129.74 + OV, M.y4, 166.0, true, 860, "SABC SPECIAL ASSIGNMENT / JOURNEYMAN PICTURES, 2004");
nameTag("BIOKO ISLAND - EQUATORIAL GUINEA", 125.0, 129.74, 120, 960, 30);
endPaper3D(124.56, tk(), [C0(124.56, 1.0), [129.74 + OV, 960, 540, 1.1]]);
// 22-23 129.74-139.36 TEMPLATE History 4K Scene 02: "on a runway in Mali, a different man sits inside a small private plane, waiting for word." - the King Air
if (M.kingAir) { seg(hist("Scene 02", "W00 H02 Bamako", M.kingAir, ["BAMAKO, MALI", 3.4], ["King Air ZS-NBJ", 5.0], 9.62 + OV), 129.74, tk()); SEG[SEG.length - 1].srcIn = 0; }
// 24 139.36-147.56 "...he plans to fly in 30 minutes behind the soldiers and take over as the new president of that oil-rich country." - two routes converge on Malabo
var wm24 = M.world ? mapPage("P24 MAP two routes 2:19", 139.36, 147.56 + OV, [3200, 1750, 1500, 1000]) : null;
if (wm24) {
  stopAt(wm24, LL.HRE, "HARARE", 139.4, 147.56 + OV, null, 22, 40); stopAt(wm24, LL.BKO, "BAMAKO", 139.4, 147.56 + OV, null, -60, -36);
  stopAt(wm24, LL.SSG, "MALABO", 139.4, 147.56 + OV, RED, -170, -30);
  leg(wm24, LL.HRE, LL.SSG, 139.6, 1.6, 0.18, true, RED);
  leg(wm24, LL.BKO, LL.SSG, 141.1, 1.6, -0.15, false, [0.07, 0.07, 0.07]);
  fixedType("+30 MIN", 1220, 300, 60, RED, 141.25, 147.56 + OV);
  endPaper3D(139.36, tk(), mapCam(wm24, [[139.36, 12, 0, 1.0], [142.6, 8, 4, 1.12], [147.56 + OV, 8.7, 3.75, 1.45]]));
}
// 25 TH 147.56-154.70 "Nothing about this flight is secret, though. Unknown to the men in that dark plane, they are flying right into a trap." (ends on Jude; ch 01's card is the hit)
seg(rawTH("TH5 the trap 2:28", 147.56, TH_END), 147.56, "none");
// 26 154.70-157.00 TEMPLATE Top Secret Scene_01: the film's title card, hard drop on the hit (working title from the script folder)
var TT = titleTS("W00t", "THE LONDON MILLIONAIRES", "WHO TRIED TO BUY EQUATORIAL GUINEA"); if (TT) { seg(TT, 154.70, "none"); SEG[SEG.length - 1].srcIn = 0; }


log("segments built: " + SEG.length);

// =====================================================================
// MASTER (the Viktor build: segments, grain, then Jude's untouched picture on top)
// =====================================================================
master = CF.items.addComp(MN, 1920, 1080, 1, T1 - T0, KIT.FPS); master.displayStartTime = T0;
$.global.master = master;
KIT.C = master; KIT.t0 = T0;
var bg = master.layers.add(KIT.paperBase()); bg.name = "BG blurred paper (under everything)"; bg.outPoint = master.duration;
bg.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2").property(1).setValue(40);
var bgl = bg.property("ADBE Effect Parade").addProperty("ADBE Easy Levels2");
for (var q2 = 1; q2 <= bgl.numProperties; q2++) { try { if (bgl.property(q2).name === "Output White") bgl.property(q2).setValue(0.78); if (bgl.property(q2).name === "Gamma") bgl.property(q2).setValue(0.85); } catch (e) {} }
xf(bg).property("ADBE Scale").setValue([108, 108]);
TRN = {
  ink1: ["ink/Inks Transition 1.mov", 55, 1.1, 3.6], ink2: ["ink/Inks Transition 2.mov", 55, 0.7, 3.4], ink3: ["ink/Inks Transition 3.mov", 55, 0.8, 3.2], ink4: ["ink/Inks Transition 4.mov", 60, 0.5, 2.6],
  brush1: ["brush/Paint Full_01.mov", 100, 0.35, 1.15], brush2: ["brush/Paint Full_02.mov", 100, 0.35, 1.25], brush3: ["brush/Paint Full_03.mov", 100, 0.45, 1.2],
  brush4: ["brush/Paint Full_04.mov", 100, 0.35, 1.15], brush5: ["brush/Paint Full_05.mov", 100, 0.45, 1.15]
};
$.global.TRN = TRN;
var haveTR = new File(TR + "ink/Inks Transition 1.mov").exists;
if (!haveTR) log("NO TRANSITIONS at " + TR + " - all cuts are hard cuts");
var THS = [], prevTH = null;
function thOut(Pp, kind, at) {
  var t = TRN[kind], it = imp(TR + t[0]), k = t[1] / 100, m = master.layers.add(it); m.name = "MATTE out " + kind + " <- " + Pp[0].name;
  speedHold(m, at - t[2] * k, k); m.inPoint = at; m.outPoint = Pp[0].outPoint; Pp[0].setTrackMatte(m, TrackMatteType.ALPHA_INVERTED); Pp[2] = m;
}
for (var s = 0; s < SEG.length; s++) {
  var sg = SEG[s], a = sg.a - T0, end = (s + 1 < SEG.length ? SEG[s + 1].a - T0 : master.duration);
  if (!sg.comp) { log("seg " + s + " MISSING comp"); continue; }
  var kind = haveTR ? sg.kind : "none";
  var nk = (s + 1 < SEG.length && haveTR) ? SEG[s + 1].kind : "none";
  var tail = (s + 1 < SEG.length ? overlapOf(nk) + 0.1 : 0);
  if (sg.comp.name.indexOf("LABELS ") === 0) {   // Jude: the first cut, untouched, 50 % centred, not 3D, no effects
    var TL = master.layers.add(M.firstcut); TL.name = "TALKING HEAD (first cut, untouched) " + sg.comp.name.substr(7) + " @" + sg.a;
    TL.audioEnabled = false; TL.startTime = -T0; TL.inPoint = a; TL.outPoint = Math.min(master.duration, end + tail);
    xf(TL).property("ADBE Scale").setValue([50, 50]); xf(TL).property("ADBE Position").setValue([960, 540]); TL.quality = LayerQuality.BEST;
    var LB = master.layers.add(sg.comp); LB.name = sg.comp.name + " @" + sg.a; LB.startTime = sg.comp.displayStartTime - T0; LB.inPoint = a; LB.outPoint = end;
    prevTH = [TL, LB, null]; THS.push(prevTH);
    log("seg " + s + " TALKING HEAD " + sg.comp.name.substr(7) + " in " + (a + T0).toFixed(2) + " out " + (TL.outPoint + T0).toFixed(2) + " via " + kind);
    continue;
  }
  var L = master.layers.add(sg.comp); L.name = sg.comp.name + " @" + sg.a;
  if (sg.comp.displayStartTime && sg.comp.width === 1920) { L.startTime = sg.comp.displayStartTime - T0; } else { L.startTime = a - (sg.srcIn || 0); }
  if (sg.comp.width === 3840) xf(L).property("ADBE Scale").setValue([50, 50]);
  L.inPoint = a;
  if (L.startTime + sg.comp.duration < end + tail - 0.05) {   // template shorter than its slot: hold its last frame (time remap)
    L.timeRemapEnabled = true; L.property("ADBE Time Remapping").expression = "Math.min(value, " + (sg.comp.duration - 0.1).toFixed(3) + ")"; log("hold end " + sg.comp.name); }
  L.outPoint = Math.min(master.duration, end + tail);
  if (kind !== "none") { addTransition(L, kind, a); if (prevTH) thOut(prevTH, kind, a); }
  prevTH = null;
  log("seg " + s + " " + sg.comp.name + " in " + (a + T0).toFixed(2) + " out " + (L.outPoint + T0).toFixed(2) + " via " + kind);
}
KIT.filmFinish(master, "Medium", 80);
for (var h = 0; h < THS.length; h++) { THS[h][0].moveToBeginning(); if (THS[h][2]) THS[h][2].moveToBeginning(); THS[h][1].moveToBeginning(); }   // above grain/grade; only labels over him
log("talking heads above the grade: " + THS.length);
var gd = master.layers.add(M.firstcut); gd.name = "GUIDE first cut - audio only (not rendered)"; gd.startTime = -T0; gd.enabled = false; gd.audioEnabled = true; gd.guideLayer = true;
bg.moveToEnd(); gd.moveToEnd();
master.openInViewer();
log("fonts set: " + FONTLOG.ok + " ok, " + FONTLOG.bad + " fell back");
log("credit lines removed: " + CREDITS_OFF); log("master done: " + master.numLayers + " layers. Project NOT saved.");
} catch (err) { log("ERROR " + err.toString() + " line " + err.line); }
app.endUndoGroup();
app.endSuppressDialogs(false);
}
writeLog();
