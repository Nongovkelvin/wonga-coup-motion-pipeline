# make_02.py: writes build_02_london_1.jsx from the chapter 01 build 2 (setup, helpers, master pass) + body02.jsxpart (chapter 02 shots). wonga-02, 4 Nov 2026.
import os, re
B = os.path.dirname(os.path.abspath(__file__))
src = open(B + "/../../01_the_prize/build/build_01_the_prize_2.jsx", encoding="utf-8").read().split("\n")
body = open(B + "/body02.jsxpart", encoding="utf-8").read()
head = src[9:232]          # '#target' .. endStill (lines 10-232)
master = src[385:]         # 'log("segments built")' .. end (lines 386-)
H = "\n".join(head)
rep = [
    ("build_01_the_prize_2.log", "build_02_london_1.log"),
    ('CH = AS + "01_the_prize/"', 'CH = AS + "02_london/"'),
    ('SPECIAL = AS + "_special/01_the_prize/"', 'SPECIAL = AS + "_special/02_london/"'),
    ("var T0 = 157.0, T1 = 400.6;", "var T0 = 400.6, T1 = 637.7;"),
    ('CF = folder("01 The prize", VB)', 'CF = folder("02 The London money", VB)'),
    ('var MN = "01 THE PRIZE 2:37-6:41";', 'var MN = "02 THE LONDON MONEY 6:41-10:38";'),
    ('if (/^01 THE PRIZE 2:3[57]-6:41$/.test(it0.name) || /^01a (parts|paper \\+ stock inserts) 2:3[57]-6:41$/.test(it0.name)) it0.remove(); }   // build 1 goes too',
     'if (it0.name === MN || /^02a (parts|paper \\+ stock inserts) 6:41-10:38$/.test(it0.name)) it0.remove(); }'),
    ('folder("01a parts 2:37-6:41", CF)', 'folder("02a parts 6:41-10:38", CF)'),
    ('folder("01a paper + stock inserts 2:37-6:41", CF)', 'folder("02a paper + stock inserts 6:41-10:38", CF)'),
    ('folder("media 01 the prize", VB)', 'folder("media 02 the london money", VB)'),
    ('app.beginUndoGroup("Build 01 The prize 2:37-6:41 (build 2)");', 'app.beginUndoGroup("Build 02 The London money 6:41-10:38 (build 1)");'),
]
for a, b in rep:
    if a not in H: raise SystemExit("not found: " + a)
    H = H.replace(a, b)
# media block: replace M = {...} and E = {...}
m0 = H.index("var M = {"); m1 = H.index('log("media imported");')
MEDIA = r'''var P0 = AS + "00_cold_open/", P1 = AS + "01_the_prize/";
var WORLD = FILM + "../Viktor Most wanted/Assets/01_sharjah/docs/AF_World_political_map_2013_PD.png";   // public domain world map (W() is calibrated to it)
var M = {
  firstcut: KIT.findAny("Wonga Coup.mp4", FootageItem) || imp(FILM + "Talking head footage/Wonga Coup.mp4"),
  // archive clips (user downloads; shared files per the Gap report's cross-reference)
  motoTV: fp(BR + "S02-Y1.mp4", null),                 // Severo Moto interview, Uhuru Africa TV
  eo: fp(BR + "S02-05.mp4", null),                     // AP 1996: Executive Outcomes on patrol, Koidu, Sierra Leone (= S02-Y3)
  mann09: fp(BR + "S02-Y4.mp4", null),                 // AP Nov 2009: Mann freed, speaking to the press, Malabo
  ap04: fp(P0 + "broll/S00-Y1.mp4", null),             // AP 25 Aug 2004 WRAP: the Thatcher house, Constantia (= S02-Y5)
  aj: fp(P0 + "broll/S00-Y3.mp4", null),               // Al Jazeera English 2011: Mann interview; Angola 1992 archive (= S02-Y6)
  bbc: fp(P1 + "broll/S01-Y7.mp4", null),              // BBC Three 2005 'Thatcher and the Coup that Failed' (= S02-Y7)
  // stills
  calil: fp(PH + "S02-01 Calil Telegraph.png", null),  // Ely Calil (user find; Telegraph, Julian Simmonds)
  thatcher: fp(PH + "S02-09 Thatcher.png", null),       // Mark Thatcher, 2004 (user find)
  motoVOA: fp(PH + "S02-03a_Moto_Toledo_2008_VOA_PD.jpg", null),   // Severo Moto, Toledo 2008 (VOA, public domain)
  maggie: fp(PH + "S02-11_Margaret_Thatcher_1988_WhiteHouse_PD.jpg", null),   // Margaret Thatcher 1988 (White House, PD)
  mann11: fp(PH + "S02-04 Mann_2011.jpg", null),        // Simon Mann, Chatham House 2011 (CC BY 2.0; user copy of the Commons crop)
  mannRama: fp(P0 + "photos/S00-03a_Simon_Mann_Rama_CCBYSA2fr.jpg", null),
  obiang00: fp(P1 + "photos/S01-05 President_Obiang.jpg", null),
  indHead: fp(DOC + "S02-08_Independent_head.png", null), indBy: fp(DOC + "S02-08_Independent_byline.png", null), indSol: fp(DOC + "S02-08_Independent_solicitor.png", null),
  world: ex(WORLD) ? imp(WORLD) : null
};
if (!M.firstcut) throw new Error("first cut not found");
var E = {   // Envato (licensed 4 Nov 2026, broll/ENVATO_E02.txt); cash from ch 01
  chelsea: pk("E02_01", null), heli: pk("E02_02", null), capeAir: pk("E02_03", null), tableMtn: pk("E02_04", null), tea: pk("E02_05", null),
  pounds: pk("E02_06", null), meeting: pk("E02_07", null), madrid: pk("E02_08", null), cash: fp(P1 + "broll/E01_02_suitcase_cash_IvanBaranov.mp4", null)
};
'''
H = H[:m0] + MEDIA + H[m1:]
H = H.replace("// CHAPTER 01 THE PRIZE", "// CHAPTER 02")
a = 'function stockAt(name, a, b, item, srcIn, kEnd) {'
assert a in H; H = H.replace(a, 'function stockAt(name, a, b, item, srcIn, kEnd, slow) {')
a = 'var l = shot(clipBox(item, srcIn, name, [0, 0, item.width, item.height]), a, b);'
assert a in H; H = H.replace(a, 'var l = shot(clipBox(item, srcIn, name, [0, 0, item.width, item.height], slow), a, b);')
out = "// WONGA COUP - CHAPTER 02 THE LONDON MONEY: Calil, Moto, Mann, Thatcher - first cut 6:40.6-10:37.7 (400.6-637.7 s) - BUILD 1\n"
out += "// Written by chapter session wonga-02 (Nongov Kelvin), 4 Nov 2026. Generated by make_02.py from the ch 01 build 2 (setup, helpers, master) + body02.jsxpart.\n"
out += "// Run in AE 2025 only with 'ae Wonga.aep' open, under the AE lock (build/run_ae.sh). Re-running replaces only its own master and '02a ...' folders. Nothing is saved.\n"
M2 = "\n".join(master)
a = '  if (L.startTime + sg.comp.duration < end + tail - 0.05) {'
assert a in M2
M2 = M2.replace(a, '  if (sg.holdAt) { L.timeRemapEnabled = true; L.property("ADBE Time Remapping").expression = "Math.min(value, " + sg.holdAt + ")"; log("hold at " + sg.holdAt + " " + sg.comp.name); }\n  else if (L.startTime + sg.comp.duration < end + tail - 0.05) {')
out += H + "\n" + body + "\n" + M2
# 01's master loop references nothing chapter-specific except names; check
for bad in ["01 THE PRIZE", "01a ", "157.0"]:
    if bad in out.split("// ---------- new in chapter 02")[1]: print("WARN leftover", bad)
open(B + "/build_02_london_1.jsx", "w", encoding="utf-8").write(out)
print("ok", len(out.split("\n")))
