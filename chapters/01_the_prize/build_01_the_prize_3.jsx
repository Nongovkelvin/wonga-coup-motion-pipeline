// BUILD 3 (b-roll upgrade, overnight 6 Nov 2026, Nongov Kelvin): build 2 with ILLUSTRATIVE Envato shots swapped for real EG footage (01-B1..B7; SOURCES.csv; build/BROLL UPGRADE 01.md).
// WONGA COUP - CHAPTER 01 THE PRIZE: Equatorial Guinea 1968-2003 - first cut 2:37.0-6:40.6 (157.0-400.6 s) - BUILD 2 (template scenes + Clash Grotesk)
// Build 2 (4 Nov 2026, after the hub's notes): 9 template scenes (Top Secret card, History 4K x4, Confidential Files, Documentary History Timeline, Detective x2);
// all information text in Clash Grotesk (Semibold display / Regular support), Baskerville for quotes. The card starts at 157.0 (the film title card is 154.7-157.0 in 00).
// Written by chapter session wonga-01 (Nongov Kelvin), 4 Nov 2026. Built on the 00 script (same helpers, same master build).
// Run in AE 2025 only with "ae Wonga.aep" open, under the AE lock, AFTER import_topsecret_01.jsx (the chapter card needs the template):
//   osascript -e "with timeout of 3600 seconds" -e 'tell application "Adobe After Effects 2025" to DoScriptFile "<this file>"' -e "end timeout"
// Re-running replaces only what this script made (its "01a ..." folders + its master). Nothing is saved.
// Missing files fall back to stand-ins (logged as PLACEHOLDER). Shot plan: build/SHOT PLAN 01.md. Log: build_01_the_prize_2.log.
// Opens on the chapter card in the 154.7-159.2 hole (the cold open's hit); ends on Jude at 400.6 ("He is watching."), before the card-02 hole.
#target aftereffects
var HERE = File($.fileName).parent.fsName;
var LOG = [];
function log(s) { LOG.push(s); try { writeLog(); } catch (e) {} }
function writeLog() { var f = new File(HERE + "/build_01_the_prize_3.log"); f.encoding = "UTF-8"; f.open("w"); f.write(LOG.join("\n")); f.close(); }
var GO = false;
try {
  var pf = app.project.file;
  var PN = pf ? decodeURI(pf.name).toLowerCase() : "";
  if (PN !== "ae wonga.aep" && PN !== "ae wonga coup.aep") log("STOP: open project is " + (pf ? decodeURI(pf.fsName) : "unsaved/none") + " - not the Wonga project. Nothing built.");
  else { $.global.KIT_BUILD_FOLDER = "WONGA BUILD"; $.evalFile(new File(HERE + "/../../../../_HOUSE STYLE/look_kit/kit.jsx")); GO = true; }
} catch (e0) { log("SETUP ERROR " + e0.toString() + " line " + e0.line); }
if (GO) {
var P = app.project;
var FILM = new Folder(HERE + "/../../..").fsName + "/", AS = FILM + "Assets/", CH = AS + "01_the_prize/";
var BR = CH + "broll/", PH = CH + "photos/", PX = PH + "parallax/", DOC = CH + "docs/";
var SPECIAL = AS + "_special/01_the_prize/", YT = AS + "Youtube downloads/";
var TR = FILM + "../Viktor Most wanted/Assets/01_sharjah/transitions/";   // Envato ink/brush packs (read-only, shared with the Viktor film)
var T0 = 157.0, T1 = 400.6;
var xf = KIT.xf, child = KIT.child, folder = KIT.folder;
var RED = [0.6, 0.06, 0.06], CREAM = [0.97, 0.94, 0.86], INK = [0.07, 0.07, 0.07];

var VB = KIT.build(), CF = folder("01 The prize", VB);
var MN = "01 THE PRIZE 2:37-6:41";
for (var i = CF.numItems; i >= 1; i--) { var it0 = CF.item(i); if (/^01 THE PRIZE 2:3[57]-6:41$/.test(it0.name) || /^01a (parts|paper \+ stock inserts) 2:3[57]-6:41$/.test(it0.name)) it0.remove(); }   // build 1 goes too
var PARTS = folder("01a parts 2:37-6:41", CF), PAPERS = folder("01a paper + stock inserts 2:37-6:41", CF), MEDIA = folder("media 01 the prize", VB);
var master = null;

app.beginUndoGroup("Build 01 The prize 2:37-6:41 (build 3)");
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
// pk(code): first importable file whose name starts with code + (space | _ | .) in photos/, broll/, docs/, then _special/01_the_prize/ and Youtube downloads/.
function listFiles(dir, depth) { var out = [], fo = new Folder(dir); if (!fo.exists) return out; var fs = fo.getFiles();
  for (var q = 0; q < fs.length; q++) { if (fs[q] instanceof File) out.push(fs[q]); else if (depth > 0) out = out.concat(listFiles(fs[q].fsName, depth - 1)); } return out; }
function pk(code, fb) {
  var dirs = [[PH, 0], [BR, 0], [DOC, 0], [SPECIAL, 1], [YT, 2]];
  for (var d = 0; d < dirs.length; d++) { var fs = listFiles(dirs[d][0], dirs[d][1]), hits = [];
    for (var q = 0; q < fs.length; q++) { var n = decodeURI(fs[q].name), c = n.charAt(code.length);
      if (n.indexOf(code) === 0 && (c === " " || c === "_" || c === ".") && /\.(mov|mp4|m4v|jpg|jpeg|png|tif|tiff|psd)$/i.test(n)) hits.push(fs[q]); }
    hits.sort(function (a, b) { return decodeURI(a.name) < decodeURI(b.name) ? -1 : 1; });
    for (var h = 0; h < hits.length; h++) { try { return imp(hits[h].fsName); } catch (e) { log("BAD FILE (not importable) " + decodeURI(hits[h].name) + ": " + e); } } }
  log("PLACEHOLDER " + code + " -> " + (fb ? fb.name : "none")); return fb;
}
function ex(p) { return new File(p).exists; }
function fp(path, fb) { if (ex(path)) { try { return imp(path); } catch (e) { log("BAD FILE " + path + ": " + e); } } log("PLACEHOLDER " + path + " -> " + (fb ? fb.name : "none")); return fb; }   // exact path
function vid(code) { var f = new File(BR + code + ".mp4"); if (f.exists) return imp(f.fsName); log("MISSING clip " + code); return null; }
var M = {
  firstcut: KIT.findAny("Wonga Coup.mp4", FootageItem) || imp(FILM + "Talking head footage/Wonga Coup.mp4"),
  // archive clips (user finds, copied into broll/ under their codes)
  y1: vid("S01-Y1"),                     // Reuters/Screenocean, independence 12 Oct 1968 (B&W)
  y3: vid("S01-Y3"),                     // TVE archive 1979: Macias' fall
  y6: vid("S01-Y6"),                     // Obiang interviewed, Aug 1979
  y7: vid("S01-Y7"),                     // BBC Three 2005 doc: Malabo, oil
  trial: vid("S01-04"),                  // AP, trial of Macias, Sep 1979
  nodo: fp(AS + "00_cold_open/broll/S00-Y6.mp4", null),   // NO-DO "Fernando Poo hoy", 1968 (colour)
  // stills
  macias: pk("S01-03a", null),           // Macias 1968, Anefo / Nationaal Archief, CC0
  obiang82: pk("S01-09a", null),         // Obiang 1982, Pool Moncloa
  obiang00: fp(PH + "S01-05 President_Obiang.jpg", pk("S01-09b", null)),   // Obiang 2000s (user find; fallback White House 2014, PD)
  bb: fp(PH + "S01-06 BLACK BEACH .jpg", null),            // Black Beach prison by the sea (user find)
  zafiro: fp(PH + "S01-08 Image-1_Zafiro-field-Equatorial-Guinea.png", pk("S01-08", null)),   // FPSO "ZAFIRO PRODUCER" (user find)
  zafAir: fp(PH + "S01-08.png", null), fpso: fp(PH + "S01-08 DR.jpeg", null),                // rigs from above / FPSO aerial (user finds)
  map: pk("S01-11", null),               // CIA 1992 map of Equatorial Guinea, Library of Congress, public domain
  hrw12: fp(DOC + "S01-10_HRW_p12.png", null), hrw13: fp(DOC + "S01-10_HRW_p13.png", null), hrw22: fp(DOC + "S01-10_HRW_p22.png", null),
  hrw26: fp(DOC + "S01-10_HRW_p26.png", null), hrw54: fp(DOC + "S01-10_HRW_p54.png", null)
};
if (!M.firstcut) throw new Error("first cut not found");
var E = {   // Envato (licensed 4 Nov 2026, broll/ENVATO_E01.txt)
  forest: pk("E01_01", null), cash: pk("E01_02", null), pen: pk("E01_03", null), rig: pk("E01_04", null), coast: pk("E01_05", null)
};
// BUILD 3: real footage (YouTube via JDownloader, 6 Nov 2026)
function bv(n) { return fp(BR + n, null); }
var R = { noble: bv("01-B1 Noble Energy EG operations.mp4"), bioko: bv("01-B2 Bioko overflight 2008.mp4"), muni: bv("01-B3 Rio Muni 1968.mp4"),
  sign: bv("01-B4 Obiang Lula signing Malabo 2010.mp4"), aje: bv("01-B5 AJE oil boom eludes EG 2009.mp4"), m60: bv("01-B7 60 Minutes Australia Dirty Deeds.mp4") };
var BX60 = [300, 80, 1740, 890], BX60_43 = [280, 40, 1620, 1040];   // 60 Minutes: crop the "60" bug (bottom-left); 4:3 inner picture
log("media imported");
// ---------- fonts (user, 4 Nov 2026): Clash Grotesk for information text (copied from the 00 build 2) ----------
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

// ---------- helpers copied from the 00 script (and Viktor build_07_08_1.jsx) ----------
function rawTH(name, a, b) { var c = PAPERS.items.addComp("LABELS " + name, 1920, 1080, 1, b - a, KIT.FPS); c.displayStartTime = a; KIT.C = c; KIT.t0 = a; return c; }
function fixedType(txt, x, y, size, col, a, b) { var t = staticType(txt, x, y, size, col, a, b); t.name = "SRC fixed " + txt; return t; }
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
  var tr = g.property("ADBE Vectors Group").addProperty("ADBE Vector Filter - Trim");
  tr.property("ADBE Vector Trim End").setValueAtTime(KIT.tc(a), 0); tr.property("ADBE Vector Trim End").setValueAtTime(KIT.tc(a) + 0.6, 100);
  xf(sh).property("ADBE Anchor Point").setValue([0, 0]); xf(sh).property("ADBE Position").setValue(p); xf(sh).property("ADBE Rotate Z").setValue(-3);
  var sc = xf(sh).property("ADBE Scale"); sc.setValueAtTime(KIT.tc(a), [s0, s0]); sc.setValueAtTime(KIT.tc(b), [s1, s1]);
  sh.moveBefore(doc); return sh;
}
function portrait(name, a, b, item, x, h, label, src, keys) {
  paperPage(name, a, b);
  var bgL = KIT.C.layers.add(item); bgL.name = "STOCK blur " + item.name; span(bgL, a, b); cover(bgL, 1920, 1080);
  bgL.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2").property(1).setValue(60); archival(bgL, -70); xf(bgL).property("ADBE Opacity").setValue(45);
  var c = card(item, x, 520, h, x < 960 ? -1.5 : 1.5, a + 0.05, b); depthKeep(c, -240);
  if (label) nameTag(label, a + 0.4, b, x < 960 ? 1000 : 120, 900, 38);
  if (src) SRC(src, a + 0.4, b, x < 960 ? 1000 : 120, 1040, 18);
  return endPaper3D(a, tk(), keys || [C0(a, 1.0), [b, x, 500, 1.12]]);
}
// ---------- template helpers (copied from the 00 build 2) ----------
function textLayers(c) { var out = []; for (var i = 1; i <= c.numLayers; i++) if (c.layer(i) instanceof TextLayer) out.push(c.layer(i)); return out; }
function fontByRank(c, roles) {   // biggest text gets roles[0], the rest roles[1]
  var t = textLayers(c); t.sort(function (p, q) { return q.property("ADBE Text Properties").property("ADBE Text Document").value.fontSize - p.property("ADBE Text Properties").property("ADBE Text Document").value.fontSize; });
  for (var i = 0; i < t.length; i++) { var r = i === 0 ? roles[0] : roles[1]; setFont(t[i], r[0], r[1], r[2]); } }
function detScene(sceneName, tag, items, head, para) {
  var sc = detMontage(sceneName, tag, items, head, para), DF = child(PARTS, "Detective " + sceneName + " " + tag, FolderItem);
  for (var d = 1; d <= DF.numItems; d++) { var it = DF.item(d); if (it instanceof CompItem && /^Text \d+ /.test(it.name)) fontByRank(it, [[CLASH.semi, 30, true], [CLASH.reg, 0, false]]); }
  return sc; }
function hist(srcName, newName, item, big, small, useDur) {
  var c = histScene(srcName, newName, fillWith(item, -55), { big: big, small: small }, useDur); if (c) fontByRank(c, [[CLASH.semi, 30, true], [CLASH.reg, 10, false]]); return c; }
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
// Documentary History Timeline (Envato, SKY_motion; new in ch 01): deep-duplicate SCENE_n with its MEDIA_/TEXT_ comps; media = [items], texts = {compName: [strings by layer order]}
function tlScene(n, tag, media, texts, roles) {
  var DT = KIT.findAny("Documentary History Timeline", FolderItem); if (!DT) { log("MISSING Documentary History Timeline"); return null; }
  function find(nm) { function rec(fo) { for (var i = 1; i <= fo.numItems; i++) { var it = fo.item(i); if (it.name === nm && it instanceof CompItem) return it; if (it instanceof FolderItem) { var r = rec(it); if (r) return r; } } return null; } return rec(DT); }
  var DF = folder("Timeline SCENE_" + n + " " + tag, PARTS), map = {}, byName = {}, RX = /^(MEDIA|TEXT)_/;
  function d(c) { if (map[c.id]) return map[c.id]; var x = c.duplicate(); x.name = c.name + " " + tag; x.parentFolder = DF; map[c.id] = x; byName[c.name] = x;
    for (var j = 1; j <= x.numLayers; j++) { var l = x.layer(j); if (l.source instanceof CompItem && RX.test(l.source.name)) { var on = l.name; l.replaceSource(d(l.source), false); l.name = on; } } return x; }
  var st = find("SCENE_" + n); if (!st) { log("MISSING SCENE_" + n); return null; }
  var c = d(st); c.name = "Timeline SCENE_" + n + " " + tag;
  for (var mi = 0; mi < media.length; mi++) { var mc = byName["MEDIA_" + n + "_" + (mi + 1)] || byName["MEDIA_" + n]; if (!mc) { log("no MEDIA_" + n + "_" + (mi + 1)); continue; }
    var ml = mc.layers.add(media[mi]); ml.name = "CLAUDE media " + media[mi].name; cover(ml, mc.width, mc.height); archival(ml, -50); }
  for (var k in texts) { var tc2 = byName[k]; if (!tc2) { log("no " + k); continue; } var tl = textLayers(tc2);
    for (var u = 0; u < tl.length; u++) { setText(tl[u], u < texts[k].length ? texts[k][u] : " "); var r = (roles && roles[k] && roles[k][u]) || [CLASH.reg, 10, false]; setFont(tl[u], r[0], r[1], r[2]); }
    log("  " + k + ": " + tl.length + " text layers"); }
  log("tlScene " + n + " " + tag + ": " + c.numLayers + " layers"); return c;
}
// History 4K zooms ~2x into its holder: fit the picture at k of the holder over a blurred cover copy (faces stay whole). dx/dy shift it (holder px).
function fillFit(item, k, dx, dy) { return function (C) {
  var b = C.layers.add(item); b.name = "CLAUDE blur " + item.name; cover(b, C.width, C.height); archival(b, -60); if (b.hasAudio) b.audioEnabled = false;
  b.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2").property(1).setValue(80); xf(b).property("ADBE Opacity").setValue(70);
  var l = C.layers.add(item); l.name = "CLAUDE fit " + item.name; if (l.hasAudio) l.audioEnabled = false; var s = Math.min(C.width / item.width, C.height / item.height) * 100 * k;
  xf(l).property("ADBE Scale").setValue([s, s]); xf(l).property("ADBE Position").setValue([C.width / 2 + (dx || 0), C.height / 2 + (dy || 0)]); archival(l, -50); }; }
function histFit(srcName, newName, item, big, small, useDur, k, dx, dy) {
  var c = histScene(srcName, newName, fillFit(item, k, dx, dy), { big: big, small: small }, useDur); if (c) fontByRank(c, [[CLASH.semi, 30, true], [CLASH.reg, 10, false]]); return c; }
// ---------- new in this chapter ----------
// an archive clip cropped to its picture box bx = [x0, y0, x1, y1] (source pixels: drops letterbox, pillarbox and channel bugs); source time srcIn shows at comp time 0
function clipBox(item, srcIn, tag, bx, slow) {
  var bw = bx[2] - bx[0], bh = bx[3] - bx[1], W = Math.round(1080 * bw / bh / 2) * 2;
  var c = PARTS.items.addComp("CLIP " + tag, W, 1080, 1, 30, KIT.FPS), l = c.layers.add(item), k0 = (slow || 100) / 100;
  if (slow) { l.stretch = slow; l.frameBlendingType = FrameBlendingType.FRAME_MIX; c.frameBlending = true; }
  l.startTime = -srcIn * k0; l.inPoint = 0; l.outPoint = 30; l.audioEnabled = false;
  var k = 1080 / bh * 100 * 1.01; xf(l).property("ADBE Anchor Point").setValue([(bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2]);
  xf(l).property("ADBE Scale").setValue([k, k]); xf(l).property("ADBE Position").setValue([W / 2, 540]); return c;
}
// archive clip as a printed card on paper (never full-frame: 240p-720p sources)
function boxCard(name, a, b, item, srcIn, bx, h, src, x, slow) {
  paperPage(name, a, b);
  if (!item) { log("MISSING clip for " + name); return null; }
  var c = card(clipBox(item, srcIn, name, bx, slow), x || 960, 530, h || 800, -0.8, a + 0.02, b);
  if (src) SRC(src, a + 0.3, b);
  return c;
}
// full-frame stock from source time srcIn, archival grade, slow push
function stockAt(name, a, b, item, srcIn, kEnd) {
  paperPage(name, a, b);
  if (!item) { log("MISSING stock for " + name); vignetteOnly(); return KIT.C; }
  var l = shot(clipBox(item, srcIn, name, [0, 0, item.width, item.height]), a, b);
  xf(l).property("ADBE Scale").setValueAtTime(KIT.tc(b), [100 * (kEnd || 1.08), 100 * (kEnd || 1.08)]);
  vignetteOnly(); return KIT.C;
}
// a document page (300 dpi render) printed on paper; marks = [[pdf box in points via PT(), t, dur]]; still = no camera, no drift (stillness beats)
function docPage(name, a, b, item, focus, fitW, marks, still2, hitsK) {
  paperPage(name, a, b);
  if (!item) { log("MISSING doc for " + name); return null; }
  var d = KIT.docShot(item, focus, a, b, fitW || 1500, -0.5);
  if (still2) { var po = xf(d).property("ADBE Position"), sc = xf(d).property("ADBE Scale"); po.setValueAtKey(2, po.keyValue(1)); sc.setValueAtKey(2, sc.keyValue(1)); }
  for (var m = 0; m < marks.length; m++) KIT.highlight(d, marks[m][0], marks[m][1], marks[m][2] || 0.5);
  return d;
}
// stillness beat photo: printed card over its blurred copy, no camera, no drift
function stillPhoto(name, a, b, item, h, kind) {
  paperPage(name, a, b);
  var bgL = KIT.C.layers.add(item); bgL.name = "STOCK blur " + item.name; span(bgL, a, b); cover(bgL, 1920, 1080);
  bgL.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2").property(1).setValue(60); archival(bgL, -70); xf(bgL).property("ADBE Opacity").setValue(45);
  var c = KIT.photoCard(item, 960, 510, h, -0.8, a, b);
  var pp = xf(c).property("ADBE Position"), ss = xf(c).property("ADBE Scale"); pp.setValueAtKey(2, pp.keyValue(1)); ss.setValueAtKey(2, ss.keyValue(1));
  fadeIn(c, a, 0.3);
  return c;
}
function endStill(a, kind) { KIT.paperGrade(); still(); seg(KIT.C, a, kind); return KIT.C; }

// =====================================================================
// CHAPTER 01 THE PRIZE 2:34.7-6:40.6 (shot plan: build/SHOT PLAN 01.md)
// =====================================================================
// 01 CARD 157.00-159.20 [TEMPLATE Top Secret Scene_04]: "CHAPTER 1 - THE PRIZE" / "1968 2003", NO-DO Santa Isabel 1968 in Media 03 (the film title card is 154.7-157.0, in 00)
if (tsComp("Scene_04")) { var T1c = dupTS("C1");
  setText(T1c.get("Text 04_01").layer(1), "CHAPTER 1 - THE PRIZE"); setText(T1c.get("Text 04_02").layer(1), "1968\r2003");
  setFont(T1c.get("Text 04_01").layer(1), CLASH.semi, 40, true); setFont(T1c.get("Text 04_02").layer(1), CLASH.semi, 20, false);
  fillTSMedia(T1c.get("Media 03"), M.nodo ? clipBox(M.nodo, 9.0, "TS card NO-DO", [160, 0, 1120, 720]) : E.coast);
  seg(T1c.scene, 157.0, "none"); SEG[SEG.length - 1].srcIn = 1.0;   // 2.2 s slot: start 1 s into the card, with its text already up
} else log("MISSING Top Secret Scene_04 - run import_topsecret_01.jsx first");
// 02 TH1 159.20-163.76 "It is October 12, 1968, in the island town of Santa Isabel." - Jude opens the chapter (the date is on the next scene)
seg(rawTH("TH1 Santa Isabel 2:39", 159.20, 163.76 + OV), 159.20, "none");
// 03 163.76-172.44 [TEMPLATE History 4K Scene 05] "The green, white and red flag ... goes up ... Equatorial Guinea is born." - Reuters: crowd, the flag rising, the flag flying
if (M.y1) { seg(histFit("Scene 05", "W01 H05 flag", clipBox(M.y1, 148.6, "H05 flag", [0, 37, 960, 668]), ["12 OCTOBER 1968", 0.8], ["Santa Isabel, Fernando Po", 1.6], 8.68 + OV, 0.8), 163.76, tk()); SEG[SEG.length - 1].srcIn = 0; }
// 04 172.44-185.50 "a tiny nation, a tropical island then called Fernando Po. ... a slice of jungle on the African mainland, wedged between Cameroon and Gabon." - CIA 1992 map
paperPage("P04 MAP Bioko + Rio Muni 2:52", 172.44, 185.50 + OV);
var wm = M.map ? KIT.docShot(M.map, [300, 300, 1900, 2000], 172.44, 185.50 + OV, 1500, -0.4) : null;
if (wm) {
  desat(wm, -35);
  ring(wm, [640, 612], 380, 440, 173.6, 185.50 + OV, 96, 100);                 // the island (Bioko)
  KIT.highlight(wm, [405, 513, 182, 34], 175.75, 0.5);                          // "(Fernando Po)" as printed on the map
  ring(wm, [1640, 1545], 1000, 720, 180.5, 185.50 + OV, 96, 100, true);         // Rio Muni, the mainland
  KIT.circle(wm, [1501, 687, 463, 49], 184.10, 7);                              // CAMEROON
  KIT.circle(wm, [1487, 2161, 357, 48], 184.95, 7);                             // GABON
  SRC("MAP: CIA, 1992 - LIBRARY OF CONGRESS (PUBLIC DOMAIN)", 172.7, 185.50 + OV);
  endPaper3D(172.44, tk(), [K(172.44, docPt(wm, [640, 600], 172.44), 1.9), K(176.9, docPt(wm, [650, 590], 176.9), 2.05),
    K(178.4, docPt(wm, [900, 900], 178.4), 1.6), K(180.4, docPt(wm, [1550, 1450], 180.4), 1.35), K(182.9, docPt(wm, [1300, 1400], 182.9), 0.98), K(185.50 + OV, docPt(wm, [1300, 1420], 185.5), 1.02)]);
} else log("MISSING S01-11 map");
// 05 185.50-188.40 "Only a few hundred thousand people live here." - NO-DO 1968: people in the streets of Santa Isabel
boxCard("P05 people 1968 3:06", 185.50, 188.40 + OV, M.nodo, 27.0, [160, 0, 1120, 720], 800, "NO-DO / FILMOTECA ESPAÑOLA, 'FERNANDO POO HOY', 1968");
endPaper3D(185.50, tk(), [C0(185.50, 1.0), [188.40 + OV, 960, 540, 1.07]]);
// 06 188.40-195.70 [TEMPLATE History 4K Scene 03] "...a man named Francisco Macías Nguema wins the country's first and only free election." - Macías 1968 (Anefo, CC0)
if (M.macias) { seg(histFit("Scene 03", "W01 H03 Macias", M.macias, ["FRANCISCO MACÍAS NGUEMA", 1.0], ["First president, 1968", 1.8], 7.30 + OV, 0.55, 300, 0), 188.40, tk()); SEG[SEG.length - 1].srcIn = 0; }
else log("MISSING S01-03 Macias");
// 07 TH2 195.70-205.68 "But the hope does not last long. Within a few short years, he turns into one of the most terrifying dictators in Africa."
seg(rawTH("TH2 the hope 3:16", 195.70, 205.68 + OV), 195.70, "none");
// 08 205.68-212.32 [TEMPLATE Confidential Files Stage5] "...he is finally put on trial, prosecutors name 474 of his victims." - AP: Macías in the dock (the 474 stays off screen: the dossier has 514, OPEN)
seg(confPage(5, "W01a", clipBox(M.trial, 70.0, "Conf trial", [135, 0, 550, 360]), 0, "THE TRIAL OF MACÍAS", "Malabo, September 1979", "TRIBUNAL 1979",
  "MILITARY TRIBUNAL, CINE MARFIL, MALABO. ACCUSED: FRANCISCO MACIAS NGUEMA. SEPTEMBER 1979."), 205.68, tk()); SEG[SEG.length - 1].srcIn = 0;
// 09 212.32-217.32 STILL "The real number is far higher, though. Estimates run into the tens of thousands." - plain figures, the attributed range
paperPage("P09 the range (still) 3:32", 212.32, 217.32 + OV);
staticType("ESTIMATES OF THE DEAD", 330, 400, 34, [0.3, 0.29, 0.27], 212.5, 217.32 + OV);
staticType("5,000 - 80,000", 330, 560, 120, INK, 214.80, 217.32 + OV);
SRC("RANGE OF PUBLISHED ESTIMATES (STRAUS; LINIGER-GOUMAZ; OTHERS)", 212.6, 217.32 + OV);
endStill(212.32, tk());
// 10 217.32-226.04 STILL "Human Rights Watch estimates that up to one-third ... was either killed or forced to run away for their lives." - HRW p12, marker
docPage("D10 HRW one third (still) 3:37", 217.32, 226.04 + OV, M.hrw12, PT(80, 200, 450, 70), 1500,
  [[PT(186, 228, 307, 12), 219.84, 1.3], [PT(89, 243, 27, 13), 223.30, 0.3]], true);
SRC("HUMAN RIGHTS WATCH, 'WELL OILED', JULY 2009, P. 12", 217.6, 226.04 + OV);
endStill(217.32, tk());
// 11 226.04-232.16 [TEMPLATE Documentary History Timeline SCENE_18] "Then comes August 3, 1979. Macías is violently overthrown." - TVE: his portrait pulled down + the motorcade; date
var tl18 = tlScene(18, "W01", [clipBox(M.y3, 118.0, "TL18 portrait", [8, 62, 638, 418]), clipBox(M.y3, 16.0, "TL18 motorcade", [8, 62, 638, 418])],
  { "TEXT_18_1": ["3 August 1979", "THE END\rOF MACÍAS"], "TEXT_18_2": ["aug", "1979"] },
  { "TEXT_18_1": [[CLASH.reg, 10, false], [CLASH.semi, 30, true]], "TEXT_18_2": [[CLASH.reg, 10, false], [CLASH.semi, 20, false]] });
if (tl18) { seg(tl18, 226.04, tk()); SEG[SEG.length - 1].srcIn = 0; }
// 12 232.16-239.96 [TEMPLATE History 4K Scene 04] "The man who takes his place is this guy. His own nephew. A military officer named Teodoro Obiang." - Obiang interviewed, Aug 1979; the name lands on "named"
if (M.y6) { seg(histFit("Scene 04", "W01 H04 Obiang", clipBox(M.y6, 42.0, "H04 Obiang", [100, 110, 760, 630]), ["TEODORO OBIANG NGUEMA MBASOGO", 5.2], ["His nephew - Spanish TV, August 1979", 5.8], 7.80 + OV, 0.58, -420, -40), 232.16, tk()); SEG[SEG.length - 1].srcIn = 0; }
// ---- TENSION RUN 239.96-252.42: the hunt, hard cuts ----
// 13 239.96-242.42 "The old dictator tries to hide." - Macías in his motorcade (TVE)
boxCard("P13 the old dictator 4:00", 239.96, 242.42 + OV, M.y3, 24.0, [8, 62, 638, 418], 800, "TVE ARCHIVE (VIA LA HEMEROTECA DEL BUITRE)");   // Macías in his motorcade, dark glasses
endPaper3D(239.96, tk(), [C0(239.96, 1.05), [242.42 + OV, 960, 520, 1.16]]);
// 14 242.42-246.76 "He is finally hunted down in the forest near the border with Gabon."
if (R.muni) { boxCard("P14 the forest 4:02", 242.42, 246.76 + OV, R.muni, 88.0, [370, 170, 1040, 650], 800, "ARCHIVE: RÍO MUNI, 1968 (RETROCLIPS)");
  endPaper3D(242.42, "none", [C0(242.42, 1.0), [246.76 + OV, 960, 520, 1.12]]); }
else { seg(stockAt("S14 the forest 4:02", 242.42, 246.76 + OV, E.forest, 24.0, 1.16), 242.42, "none"); SRC("ILLUSTRATIVE", 242.6, 246.76); }
// 15 246.76-252.42 "Tired and hungry. His car is packed with suitcases full of money."
if (R.m60) { boxCard("P15 under guard 4:07", 246.76, 252.42 + OV, R.m60, 422.0, BX60_43, 800, "ARCHIVE 1979, VIA 60 MINUTES (NINE), 2004");
  endPaper3D(246.76, "none", [C0(246.76, 1.0), [252.42 + OV, 960, 520, 1.1]]); }
else { seg(stockAt("S15 cash 4:07", 246.76, 252.42 + OV, E.cash, 0.0, 1.12), 246.76, "none"); SRC("ILLUSTRATIVE", 246.9, 252.42); }
// ---- BREATH 252.42-261.48 (stillness: an execution) ----
// 16 252.42-261.48 STILL "A few weeks later, he is put in front of a firing squad at Black Beach. A brutal prison sitting right on the edge of the sea."
if (M.bb) { stillPhoto("X16 Black Beach (still) 4:12", 252.42, 261.48 + OV, M.bb, 640);
  nameTag("BLACK BEACH PRISON, MALABO", 255.9, 261.48, 120, 960, 32); fixedType("29 SEPTEMBER 1979", 140, 190, 50, RED, 253.0, 261.48 + OV);
  endStill(252.42, "none"); } else log("MISSING S01-06 Black Beach");
// 17 TH3 261.48-269.06 "The new government celebrates this as a great rescue story. But critics whisper a different truth."
seg(rawTH("TH3 two stories 4:21", 261.48, 269.06 + OV), 261.48, "none");
// 18 269.06-278.12 "The same family just kept the keys ... swapped the man sitting at the top. In reality, both stories are true." - uncle and nephew, side by side
paperPage("X18 uncle and nephew 4:29", 269.06, 278.12 + OV);
var pm = M.macias ? card(M.macias, 640, 500, 640, -2, 269.10, 278.12 + OV) : null, po2 = M.obiang82 ? card(M.obiang82, 1290, 500, 640, 2, 269.35, 278.12 + OV) : null;
staticType("MACÍAS, 1968", 470, 900, 34, INK, 269.5, 278.12 + OV); staticType("OBIANG, 1982", 1120, 900, 34, INK, 269.7, 278.12 + OV);
staticType("UNCLE", 560, 960, 26, [0.3, 0.29, 0.27], 270.0, 278.12 + OV); staticType("NEPHEW", 1210, 960, 26, [0.3, 0.29, 0.27], 270.2, 278.12 + OV);
if (pm) { var opm = xf(pm).property("ADBE Opacity"); opm.setValueAtTime(KIT.tc(272.3), 100); opm.setValueAtTime(KIT.tc(272.9), 40); }
SRC("PHOTOS: ANEFO / NATIONAAL ARCHIEF, 1968 (CC0); POOL MONCLOA, 1982", 269.3, 278.12 + OV);
endPaper3D(269.06, tk(), [C0(269.06, 1.0), [272.1, 820, 520, 1.1], [273.3, 1180, 520, 1.16], [275.2, 960, 540, 1.02], [278.12 + OV, 960, 540, 1.04]], { card: 120, text: 100 });
// 19 TH4 278.12-289.64 "You see, for a long time after that, Equatorial Guinea stays poor and forgotten ... But then, in 1995, everything changes."
seg(rawTH("TH4 poor and forgotten 4:38", 278.12, 289.64), 278.12, "none");
// 20 289.64-292.66 [black + silent hole] the sea, a rig at first light; 1995 typed
if (R.m60) { paperPage("S20 rigs off Bioko 4:50", 289.64, 292.66 + OV); var l20 = shot(clipBox(R.m60, 99.6, "S20 rigs", BX60), 289.64, 292.66 + OV);
  xf(l20).property("ADBE Scale").setValueAtTime(KIT.tc(292.66 + OV), [106, 106]); vignetteOnly(); seg(KIT.C, 289.64, tk());
  fixedType("1995", 140, 190, 72, RED, 289.90, 292.66 + OV); SRC("OFFSHORE, EQUATORIAL GUINEA - 60 MINUTES (NINE), 2004", 289.8, 292.66); }
else { seg(stockAt("S20 1995 rig 4:50", 289.64, 292.66 + OV, E.rig, 1.0, 1.06), 289.64, tk());
  fixedType("1995", 140, 190, 72, RED, 289.90, 292.66 + OV); SRC("ILLUSTRATIVE", 289.8, 292.66); }
// 21 292.66-299.18 [TEMPLATE History 4K Scene 06] "An American company called Mobil strikes oil deep under the ocean near the island." - the FPSO Zafiro Producer
if (M.zafiro) { seg(histFit("Scene 06", "W01 H06 Zafiro", M.zafiro, ["ZAFIRO FIELD", 1.4], ["Discovered by Mobil, March 1995", 2.1], 6.52 + OV, 0.62, -420, 0), 292.66, tk()); SEG[SEG.length - 1].srcIn = 0; }
// 22 299.18-308.44 "The money starts flooding in ... In 1993, the government only made about $3 million from oil." - HRW p22, marker on "US$3 million in 1993"
var d22 = docPage("D22 HRW 3 million 4:59", 299.18, 308.44 + OV, M.hrw22, PT(80, 320, 450, 70), 1500, [[PT(113, 355, 96, 12), 305.6, 0.6]], false);
SRC("HUMAN RIGHTS WATCH, 'WELL OILED', JULY 2009, P. 22", 299.4, 308.44 + OV);
if (d22) endPaper3D(299.18, tk(), punchKeys(d22, 299.18, 308.44 + OV, [[305.6, PT(113, 355, 96, 12), 1.45]]));
// 23 308.44-320.04 "...by 2004 ... more than 300,000 barrels every single day. Soon ... more than a billion dollars a year." - two index cards, numbers on the words
paperPage("P23 the numbers 5:08", 308.44, 320.04 + OV);
cardBox("CARD barrels", 560, 540, 760, 420, 308.5, 320.04 + OV, -1.2, [0.96, 0.95, 0.9]);
staticType("2004", 230, 420, 30, [0.35, 0.33, 0.3], 308.7, 320.04 + OV);
counter(230, 570, 110, RED, 312.6, 0.8, 300000, "", "+", 308.44, 320.04 + OV);
staticType("BARRELS A DAY", 230, 670, 34, INK, 313.6, 320.04 + OV);
cardBox("CARD revenue", 1360, 540, 760, 420, 315.7, 320.04 + OV, 1.2, [0.96, 0.95, 0.9]);
staticType("2004 BUDGET", 1030, 420, 30, [0.35, 0.33, 0.3], 315.9, 320.04 + OV);
staticType("$1 BILLION", 1030, 570, 96, RED, 317.85, 320.04 + OV);
staticType("OIL REVENUE A YEAR", 1030, 670, 34, INK, 318.4, 320.04 + OV);
SRC("SOURCES: MAIL & GUARDIAN, 13 MARCH 2004; REUTERS, 2004", 308.7, 320.04 + OV);
endPaper3D(308.44, tk(), [C0(308.44, 1.0), [312.4, 640, 540, 1.2], [315.5, 700, 540, 1.24], [316.4, 1280, 540, 1.2], [320.04 + OV, 1300, 540, 1.26]], { card: 120, text: 100 });
// 24 320.04-326.26 [TEMPLATE Detective Scene 6] "That, right there, is life-changing money for a tiny country of just half a million people." - Malabo (BBC Three, presenter-free ranges)
seg(detScene("Scene 6", "W01b", [clipBox(M.y7, 96.0, "D6 Malabo high", [0, 6, 640, 474]), clipBox(M.y7, 170.0, "D6 cathedral street", [0, 6, 640, 474]), clipBox(M.y7, 173.6, "D6 houses", [0, 6, 640, 474]),
  clipBox(M.y7, 99.5, "D6 Malabo palms", [0, 6, 640, 474]), clipBox(M.y7, 186.0, "D6 shore", [0, 6, 430, 350])], "MALABO", "Equatorial Guinea"), 320.04, tk()); SEG[SEG.length - 1].srcIn = 0;
// 25 TH5 326.26-335.30 "But only one man controls this ocean of wealth. In a 2003 interview, President Obiang puts it plainly."
seg(rawTH("TH5 one man 5:26", 326.26, 335.30 + OV), 326.26, "none");
// 26 335.30-343.10 "Quote, I am 100% sure of all the oil revenue. Because the one who signs is me." - HRW p26, the marker follows the quote; Obiang's photo pinned beside it
var d26 = docPage("D26 HRW the one who signs 5:35", 335.30, 343.10 + OV, M.hrw26, PT(60, 430, 470, 75), 1150,
  [[PT(430, 472, 77, 13), 336.0, 0.5], [PT(90, 488, 112, 13), 337.1, 1.2], [PT(205, 488, 162, 13), 339.8, 2.2]], false);
var pc26 = M.obiang00 ? card(M.obiang00, 1730, 470, 440, 3, 335.5, 343.10 + OV) : null;
if (pc26) depthKeep(pc26, -200);
SRC("HUMAN RIGHTS WATCH, 'WELL OILED', JULY 2009, P. 26 - OBIANG TO A BRITISH JOURNALIST, 2003", 335.5, 343.10 + OV);
if (d26) endPaper3D(335.30, tk(), punchKeys(d26, 335.30, 343.10 + OV, [[336.0, PT(430, 472, 77, 13), 1.25], [339.8, PT(205, 488, 162, 13), 1.35]]), { card: 120 });
// 27 343.10-346.26 [hole 343.1-344.1] "At home, no one can challenge him." - a pen signs
if (R.sign) { boxCard("P27 the signature 5:43", 343.10, 346.26 + OV, R.sign, 35.5, [0, 0, 854, 480], 800, "SIGNING CEREMONY, MALABO, 2010 (YOUTUBE)");
  endPaper3D(343.10, tk(), [C0(343.10, 1.0), [346.26 + OV, 960, 520, 1.1]]); }
else { seg(stockAt("S27 the signature 5:43", 343.10, 346.26 + OV, E.pen, 0.5, 1.08), 343.10, tk()); SRC("ILLUSTRATIVE", 343.3, 346.26); }
// 28 346.26-351.78 "He wins elections with an impossible 97 and 98% of the vote." - three result cards, years with figures
paperPage("P28 elections 5:46", 346.26, 351.78 + OV);
var EL = [["1996", "98%", 349.45], ["2002", "98%", 349.65], ["2009", "97%", 348.75]];
for (var ei = 0; ei < EL.length; ei++) { var exx = 420 + ei * 540;
  cardBox("CARD vote " + ei, exx, 520, 440, 340, 346.4 + ei * 0.25, 351.78 + OV, ei === 1 ? 1 : -1, [0.96, 0.95, 0.9]);
  staticType(EL[ei][0], exx - 150, 430, 40, [0.35, 0.33, 0.3], 346.6 + ei * 0.25, 351.78 + OV);
  staticType(EL[ei][1], exx - 150, 590, 120, RED, EL[ei][2], 351.78 + OV); }
staticType("NEVER OFFICIALLY BELOW 93%", 600, 830, 34, INK, 350.6, 351.78 + OV);
SRC("OFFICIAL PRESIDENTIAL ELECTION RESULTS", 346.5, 351.78 + OV);
endPaper3D(346.26, tk(), [C0(346.26, 1.0), [351.78 + OV, 960, 560, 1.1]], { card: 120, text: 100 });
// 29 351.78-356.40 "The government radio even tells the citizens that he is like God in heaven." - HRW p13
var d13 = docPage("D29 HRW God in heaven 5:52", 351.78, 356.40 + OV, M.hrw13, PT(60, 300, 480, 70), 1500, [[PT(485, 323, 28, 12), 354.65, 0.25], [PT(90, 339, 67, 12), 354.95, 0.45]], false);
SRC("HUMAN RIGHTS WATCH, 'WELL OILED', JULY 2009, P. 13 - STATE RADIO, JULY 2003", 352.0, 356.40 + OV);
if (d13) endPaper3D(351.78, tk(), punchKeys(d13, 351.78, 356.40 + OV, [[354.7, PT(90, 330, 200, 22), 1.4]]));
// 30 356.40-360.80 "On paper, this country is suddenly as rich as Spain or Italy." - a village on the shore, a rig on the horizon (BBC Three)
boxCard("P30 rich on paper 5:56", 356.40, 360.80 + OV, M.y7, 185.3, [0, 6, 430, 350], 800, "BBC THREE, 2005", 960, 200);
endPaper3D(356.40, tk(), [C0(356.40, 1.0), [360.80 + OV, 960, 540, 1.08]]);
// 31 360.80-364.74 "But the regular people never get to see the money." - houses in Malabo (BBC Three); hard cut
boxCard("P31 regular people 6:01", 360.80, 364.74 + OV, M.y7, 173.0, [0, 6, 640, 474], 800, "BBC THREE, 2005", 960, 150);
endPaper3D(360.80, "none", [C0(360.80, 1.0), [364.74 + OV, 960, 540, 1.06]]);
// 32 364.74-375.14 STILL "In fact, things get worse. Between 1990 and 2007, the number of young children dying before their fifth birthday actually goes up." - HRW p54
docPage("D32 HRW child deaths (still) 6:05", 364.74, 375.14 + OV, M.hrw54, PT(70, 145, 490, 70), 1500, [[PT(341, 169, 150, 12), 368.6, 1.2], [PT(100, 185, 95, 12), 373.2, 0.5]], true);
SRC("HUMAN RIGHTS WATCH, 'WELL OILED', JULY 2009, P. 54 (UNICEF): UNDER-FIVE MORTALITY PER 1,000", 365.0, 375.14 + OV);
endStill(364.74, tk());
// 33 TH6 375.14-384.68 "This is the ultimate prize. A tiny country, a giant fortune, and just one man's signature controlling all of it."
seg(rawTH("TH6 the ultimate prize 6:15", 375.14, 384.68 + OV), 375.14, "none");
// 34 384.68-390.82 [TEMPLATE Detective Scene 10] "For a certain kind of dangerous man, that looks like a business opportunity." - the prize: rigs, Zafiro, cash, the coast, Obiang's walkabout
var D10 = { rig: R.noble ? clipBox(R.noble, 53.0, "D10 Noble platform", [0, 0, 1920, 1080]) : E.rig, cash: R.aje ? clipBox(R.aje, 136.8, "D10 CFA count", [180, 0, 854, 420]) : E.cash,
  coast: R.bioko ? clipBox(R.bioko, 12.0, "D10 Bioko coast", [0, 0, 640, 480]) : E.coast, pen: R.m60 ? clipBox(R.m60, 618.0, "D10 Riggs", BX60) : E.pen };
seg(detScene("Scene 10", "W01c", [D10.rig, M.zafAir || D10.rig, D10.cash, D10.coast, clipBox(M.y7, 280.5, "D10 platform", [0, 6, 640, 474]), M.fpso || D10.rig, D10.pen, M.zafiro || D10.rig, clipBox(M.y7, 200.0, "D10 walkabout", [0, 6, 640, 474])],
  "THE PRIZE", "Oil, Equatorial Guinea"), 384.68, tk()); SEG[SEG.length - 1].srcIn = 0;
// 35 TH7 390.82-400.60 "And far away on the wealthy streets of London, there is a man who has already made a fortune in African oil. He is watching." (ends on Jude)
seg(rawTH("TH7 London 6:31", 390.82, T1), 390.82, "none");

log("segments built: " + SEG.length);

// =====================================================================
// MASTER (as the 00 build: segments, grain, then Jude's untouched picture on top)
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
