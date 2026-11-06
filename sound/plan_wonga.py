# plan_wonga.py: WONGA SOUND v1 (Nongov Kelvin, 6-7 Nov 2026). Adapted from _HOUSE STYLE/sound_tools/plan6.py (Viktor v3.3).
# Premiere Pro sync: V1 = the first cut (untouched, 50 % scale), V2 = the ten AE masters butted end to end, then one stereo track per lane:
# VO (first cut, 0 dB) / music A/B (by story beat, EQ-baked copies) / transitions x2 / card risers / card hits / subs / reveals x2 / foley / ambience x2 / room tone.
# Writes AE EXPORT/WONGA AE SYNC v1.xml, Sound/SOUND v1 CUE SHEET.csv, Sound/analysis/clips_v1.json.
import csv, json, os, re, shutil, subprocess, sys, urllib.parse
W = os.environ.get('FILM_ROOT', os.path.expanduser('~/Films/Jude Bela/Wonga coup'))
SND = W + '/Sound'; TOOLS = SND + '/tools'; AN = os.environ.get('AN', SND + '/analysis')
VA = os.environ.get('MUSIC_LIB', os.path.expanduser('~/Films/Jude Bela/Viktor Most wanted/Sound/audiio'))
BAKE = SND + '/music_baked'; SFXDIR = SND + '/sfx/used'
EXP = W + '/AE EXPORT/Latest review export'
FC = W + '/Talking head footage/Wonga Coup.mp4'; FCWAV = SND + '/vo/firstcut_48k.wav'
FPS = 24000 / 1001
fr = lambda t: int(round(t * FPS))
os.makedirs(BAKE, exist_ok=True); os.makedirs(SFXDIR, exist_ok=True)

# ---------- masters: frame counts from the decoded renders, butted from 0; first-cut positions checked with thcheck ----------
MASTERS = ['00 COLD OPEN 0.00-2.37', '01 THE PRIZE 2.37-6.41', '02 THE LONDON MONEY 6.41-10.38', '03 THE ARMY 10.38-14.58',
           '04 THE WORST KEPT SECRET 14.58-20.01', '05 SUNDAY 7 MARCH 2004 20.01-24.26', '06 THE PRICE 24.26-28.39',
           '07 A LARGE SPLODGE OF WONGA 28.39-33.13', '08 BLACK BEACH 33.13-36.52', '09 NOTHING HAS CHANGED 36.52-39.36']
NFR = [os.path.getsize(f'{AN}/grids/{i:02d}.bin') // 2304 for i in range(10)]
OFFS = json.load(open(AN + '/th_offsets.json')) if os.path.exists(AN + '/th_offsets.json') else {}
START = []; s = 0
for i, n in enumerate(NFR):
    START.append(s + int(OFFS.get(str(i), 0))); s += n
END = (START[-1] + NFR[-1]) / FPS
FC_FRAMES = os.path.getsize(AN + '/firstcut.bin') // 2304
print('masters', NFR, 'starts', START, 'film end', round(END, 2))

# ---------- talking heads (thcheck stretches) ----------
TH = []
for i in range(10):
    for line in open(f'{AN}/th/{i:02d}.txt'):
        m = re.match(r'film\s+([\d.]+)-\s*([\d.]+)', line)
        if m: TH.append((float(m.group(1)), float(m.group(2))))
TH.sort()
def th_edge(t, w=0.5): return any(abs(t - a) < w or abs(t - b) < w for a, b in TH)
def on_th(t): return any(a + 0.2 < t < b - 0.2 for a, b in TH)

# ---------- probes ----------
probe = {}
for fn in (AN + '/sfx_probe.txt', AN + '/music_probe.txt', AN + '/new_music_probe.txt'):
    for line in open(fn):
        p = line.split(' ', 3)
        if len(p) == 4:
            try: probe[p[3].strip()] = (float(p[0]), float(p[1]), float(p[2]))
            except ValueError: pass
def P(path):
    if path not in probe:
        o = subprocess.run([TOOLS + '/mixr', 'probe', path], capture_output=True, text=True, check=True).stdout.split(' ', 3)
        probe[path] = (float(o[0]), float(o[1]), float(o[2]))
    return probe[path]

# ---------- the voice ----------
mask = [int(x) for x in open(AN + '/vo_mask.txt').read().split()]
def vo_active(t, w=0.3):
    i0, i1 = max(0, int((t - w) * 10)), min(len(mask), int((t + w) * 10) + 1)
    return any(mask[i0:i1])
gaps = []; i = 0
while i < len(mask):
    if not mask[i]:
        j = i
        while j < len(mask) and not mask[j]: j += 1
        if (j - i) >= 15: gaps.append((i / 10, j / 10 if j < len(mask) else END))
        i = j
    else: i += 1

# ---------- story structure (chapter REPORTs) ----------
CARDS = [154.7, 400.6, 637.7, 898.2, 1200.6, 1466.3, 1719.2, 1992.8, 2211.6]       # 154.7 = the hook's hit into the film title
TYPING = [157.0, 400.6, 637.7, 898.2, 1200.6, 1205.3, 1466.3, 1719.2, 1992.8, 2211.6]
RUNS = [(99.3, 109.5, '00 the arms list'), (139.4, 154.7, '00 two routes converge: a trap'), (239.96, 252.42, '01 the hunt for Macias'),
        (525.12, 568.44, '02 assassination claim to "a pack of lies"'), (784.14, 813.56, '03 the plan and the lure'), (847.06, 863.26, '03 the arsenal'),
        (1116.1, 1141.61, '04 the February abort'), (1310.29, 1336.94, '05 the arrests and the kit'), (1613.04, 1639.68, '06 the Malabo verdicts'),
        (1826.28, 1857.12, '07 the Constantia arrest'), (2117.7, 2142.7, '08 the Malabo trial')]
STILL = [(212.3, 226.0), (364.7, 375.1), (655.1, 692.6), (1306.5, 1310.3), (1476.6, 1494.5), (2274.4, 2299.2)]
QUIET = [(1308.2, 1310.2)]                     # "The guns are bait": the first cut's held silence
CREDIT = (2378.2, END)                         # black + EDITED / MOTION DESIGN BY NONGOV KELVIN
GAP, CARD = -20.0, -18.0
def in_still(t, pad=0.0): return any(a - pad <= t <= b + pad for a, b in STILL)
def env(t, under):
    for a, b in QUIET:
        if a <= t <= b: return -70
    if t >= CREDIT[0] - 2.5: return -24        # the end credit: a soft swell of the last cue's tail, no hit
    for a, b in gaps:
        if b - a >= 1.5 and a + 0.2 <= t <= b - 0.15:
            if in_still(t): return under
            lvl = CARD if (b - a >= 3.5 or any(a - 0.5 <= c <= b for c in CARDS)) else GAP
            return under + (lvl - under) * min(1.0, (t - a - 0.2) / 0.6, (b - 0.15 - t) / 0.6)
    return under

# ---------- music by story beat ----------
EXPL, TENS, BRTH = -32.0, -30.0, -31.0   # 1 dB under the house beds: the Wonga VO is brighter, this keeps the phone-band gap near 17 LU
VO_DB = -1.5   # the Wonga first cut is hot (-12.4 LUFS integrated, 0.0 dBFS peaks): -1.5 dB puts it at about -14 LUFS
NEWM = SND + '/music/new/'; VM = VA + '/music/'
def nm(pre):
    for d in (NEWM, VM):
        for f in sorted(os.listdir(d)):
            if f.startswith(pre): return d + f
    raise SystemExit('no music ' + pre)
MUS = [  # (cue, file prefix, film start, film end, bed LUFS, kind, in-point, fade in, fade out)
    ('00 Hook: the dark runway at Harare, ends on the hit into the title (Dark City)', 'Audiio_Brad-Hill_Dark-City', 0.0, 154.70, TENS, 'tension', 0, 0.3, 0.25),
    ('01 Independence 1968, Macias, the terror (African Secrets)', 'Audiio_Jordi-Dalmau', 154.7, 242.0, EXPL, 'explain', 0, 1.0, 2.5),
    ('01 the hunt for Macias (tension 3:59.96-4:12.42) (Dark Tribes)', 'Audiio_Matthew-L--Fisher_Dark-Tribes', 239.0, 252.9, TENS, 'tension', 30, 1.5, 0.4),
    ('01 Black Beach, the firing squad, "both are true" (breath, Deep Cello Drone)', 'Audiio_MEDIANA_Cello-Melodies_Deep-Cello', 252.4, 292.8, BRTH, 'breath', 0, 1.0, 1.2),
    ('01 1995: Mobil strikes oil, one man signs (Ancestral Drums)', 'Audiio_Onedaneira', 292.7, 364.9, EXPL, 'explain', 0, 0.6, 2.5),
    ('01 child mortality, the ultimate prize, London teaser (breath, Silenced Witness)', 'Audiio_MEDIANA_Cello-Melodies_Silenced', 364.7, 400.6, BRTH, 'breath', 0, 2.5, 0.3),
    ('02 Chelsea, Calil, Moto, enter Simon Mann (minimal neoclassical, The Labyrinth)', 'Audiio_Josh-Alan', 400.6, 526.5, EXPL, 'explain', 0, 1.0, 2.5),
    ('02 the assassination claim to "a pack of lies" (tension 8:45-9:28) (Growing Tension)', 'Audiio_Rapha-l-Reed', 523.1, 568.9, TENS, 'tension', 50, 2.0, 0.4),
    ('02 Mann\'s three reasons (breath, Behold)', 'M03_Audiio_MoreLikeGeorgia', 568.4, 595.6, BRTH, 'breath', 0, 1.0, 1.5),
    ('02 Mark Thatcher, Table Mountain, the money is in place (The Covert Message)', 'M08_Audiio_Morris', 595.3, 637.7, EXPL, 'explain', 0, 1.5, 0.3),
    ('03 Pomfret, South Africa\'s Siberia (drone, Anemoi Winds)', 'M13_Audiio_WilliamHawkinsFinn', 637.7, 700.0, EXPL, 'explain', 0, 1.0, 3.0),
    ('03 the recruits, Pretoria, the advance team in Malabo (Drums in the Night)', 'Audiio_Tyler-Blomstrom', 697.0, 785.0, EXPL, 'explain', 0, 3.0, 2.0),
    ('03 the plan and the lure (tension 13:04-13:33.6) (darksynth, Dark Side)', 'Audiio_CAPE_TheDark', 782.1, 814.0, TENS, 'tension', 60, 2.0, 0.4),
    ('03 the 727 from Kansas (breath, The Travelers)', 'M03_Audiio_Brad-Hill', 813.5, 847.6, BRTH, 'breath', 0, 1.0, 1.2),
    ('03 the arsenal in Harare (tension 14:07-14:23) (Mob Mentality)', 'M04_Audiio_Outland_Loom', 845.1, 863.8, TENS, 'tension', 40, 1.5, 0.4),
    ('03 the cash drops, Mugabe, the first leak (investigative, Venture)', 'M06_Audiio_MatthewFisher', 863.2, 898.2, EXPL, 'explain', 0, 1.0, 0.3),
    ('04 Johann Smith\'s reports, MI6, the Pentagon (dark ambient, June 21)', 'M02_Audiio_CAPE', 898.2, 1026.0, EXPL, 'explain', 0, 1.0, 3.0),
    ('04 the worst kept secret: dinner in Malabo, the emails, Spain (neoclassical, Unbroken)', 'M05_Audiio_Matthew-L--Fisher_Unbroken_Unbroken', 1023.0, 1114.6, EXPL, 'explain', 0, 3.0, 1.5),
    ('04 the February abort (tension 18:36.1-19:01.6) (Short of Breath)', 'M02_Audiio_Yari', 1114.1, 1142.1, TENS, 'tension', 45, 1.5, 0.4),
    ('04 "I will be there for you", the date is set (Under Pressure)', 'M00_Audiio_Oscar-Carmona', 1141.5, 1200.6, EXPL, 'explain', 0, 2.0, 0.3),
    ('05 Wonderboom, take-off, Moto in Mali, Harare at dusk (Black Powder)', 'M01_Audiio_Cemetery-Men', 1200.6, 1306.6, EXPL, 'explain', 0, 1.0, 1.0),
    ('05 the arrests and the kit (tension 21:50.3-22:16.9) (Power Struggle)', 'M00_Audiio_BradHill_Single_PowerStruggle', 1310.29, 1337.4, TENS, 'tension', 30, 0.4, 0.4),
    ('05 Mali, the Canaries, Malabo sweeps, Obiang on TV (dark ambient, Hidden)', 'M12_Audiio_AntarcticWasteLands', 1336.5, 1466.3, EXPL, 'explain', 0, 2.0, 0.3),
    ('06 Merz dies in Black Beach (breath, Nov)', 'M11_Audiio_PhelipeFigueiredo', 1466.3, 1530.0, BRTH, 'breath', 0, 1.0, 3.0),
    ('06 Chikurubi, the Harare trial, the Pomfret families (neoclassical, Awake)', 'M07_Audiio_ForeverSleep', 1527.0, 1613.5, EXPL, 'explain', 0, 3.0, 1.5),
    ('06 the Malabo verdicts (tension 26:53-27:19.7) (Until the End of Time)', 'M09_Audiio_PetteriSainio', 1611.0, 1640.2, TENS, 'tension', 60, 1.5, 0.5),
    ('06 retraction, chains, home, Pomfret\'s end (breath, Green Jay)', 'M08_Audiio_Goldfinch', 1639.5, 1719.2, BRTH, 'breath', 0, 1.5, 0.3),
    ('07 the intercepted letter, Smelly and Scratcher, the Wonga List (minimal, The Blind Watchmaker)', 'M14_Audiio_PetteriSainio', 1719.2, 1826.8, EXPL, 'explain', 0, 1.0, 2.0),
    ('07 the Constantia arrest (tension 30:26.3-30:57.1) (darksynth, Nightrun)', 'M10_Audiio_ColtonDewberry_Vol1', 1824.3, 1857.6, TENS, 'tension', 40, 2.0, 0.5),
    ('07 the plea, London, Jack Straw\'s four words (neoclassical, Apex)', 'M05_Audiio_Matthew-L--Fisher_Unbroken_Apex', 1857.0, 1992.8, EXPL, 'explain', 0, 1.0, 0.3),
    ('08 the night move, Black Beach, "I was the manager" (dark ambient, Neon Reflections)', 'M13_Audiio_Antarctic Wastelands', 1992.8, 2118.2, EXPL, 'explain', 0, 1.0, 2.0),
    ('08 the Malabo trial, 34 years (tension 35:17.7-35:42.7) (Standoff)', 'M06_Audiio_Leo Grand', 2115.7, 2143.2, TENS, 'tension', 50, 1.5, 0.5),
    ('08 the pardon, "It was wrong", the secret deal (breath, Wonder)', 'M12_Audiio_VicoV', 2142.5, 2211.6, BRTH, 'breath', 0, 1.0, 0.3),
    ('09 Riggs Bank, the Senate, Washington (pulse, Cosmogyral)', 'M14_Audiio_Davide Sammarchi', 2211.6, 2276.0, EXPL, 'explain', 0, 1.0, 3.0),
    ('09 the deaths, nothing has changed, Jude\'s close, the end credit (calm, Cello Lacrimosa)', 'Audiio_MEDIANA_Cello-Melodies_Cello-Lacrimosa', 2274.4, END, BRTH, 'breath', 0, 3.0, 3.5),
]
clips = [dict(file=FCWAV, xmlfile=FC, start=0, **{'in': 0}, dur=FC_FRAMES / FPS, stem='vo', track='vo', gains=[[0, VO_DB]], label=f'VO: first cut, {VO_DB} dB')]
for k, (cue, pre, st, en, under, kind, tin, fin, fout) in enumerate(MUS):
    f = nm(pre); pk, lu, du = P(f)
    en = min(en, st + du - tin - 0.05); dur = round(en - st, 3)
    out = BAKE + f'/W1_{k:02d}_' + os.path.basename(f)
    if not os.path.exists(out) or '--rebake' in sys.argv:
        subprocess.run([TOOLS + '/eqbake', f, out, str(tin), str(dur), str(st), AN + '/vo_mask.txt'], check=True, capture_output=True)
    probe.pop(out, None); pk2, lu2, du2 = P(out)     # level the part of the track actually used
    pts = sorted(set([0, fin, dur - fout, dur] + [round(x * 0.25, 2) for x in range(int(dur * 4))]))
    g = []
    for p_ in pts:
        db = env(st + p_, under) - lu2
        if p_ < fin: db -= 40 * (1 - p_ / fin)
        if p_ > dur - fout: db -= 40 * ((p_ - (dur - fout)) / fout)
        g.append([round(p_, 3), round(max(db, -60), 2)])
    gk = [g[0]] + [g[i] for i in range(1, len(g) - 1) if not (abs(g[i][1] - g[i-1][1]) < 0.05 and abs(g[i][1] - g[i+1][1]) < 0.05)] + [g[-1]]
    clips.append(dict(file=out, start=st, **{'in': 0}, dur=dur, stem='music', track='musA' if k % 2 == 0 else 'musB', gains=gk, label=cue,
                      src=os.path.basename(f), kind=kind))

# ---------- SFX ----------
SFXROOTS = [SND + '/sfx/new'] + [VA + '/sfx/' + d for d in ('impacts', 'transitions', 'foley', 'machines', 'people', 'ambience')]
def S_(key):
    for d in SFXROOTS:
        for f in sorted(os.listdir(d)):
            if key in f: return d + '/' + f
    raise SystemExit('no sfx ' + key)
used_sfx = set()
def sfx(path, start, peak, track, label, maxdur=None, fin=0.0, kind='sfx', inp=0.0):
    pk, lu, du = P(path); dur = min(du - inp, maxdur) if maxdur else du - inp; g = peak - pk
    gains = [[0, round(g - (30 if fin else 0), 2)]] + ([[fin, round(g, 2)]] if fin else [])
    if maxdur and du - inp > maxdur: gains += [[round(dur - 0.3, 3), round(g, 2)], [round(dur, 3), round(g - 40, 2)]]
    used_sfx.add(path)
    clips.append(dict(file=path, start=round(start, 3), **{'in': inp}, dur=round(dur, 3), stem='sfx', track=track, gains=gains, label=label, kind=kind))

HITS = ['DSGNBoom_Cinematic_Hit_MWSFX_CF_19', 'DSGNBoom_Heavy_Impact_Cinematic_MWSFX_CF_05', 'DSGNBoom_Heavy_Cinematci_Impact_MWSFX_CF_12',
        'DSGNBoom_Dark_Transition_Hit_MWSFX_CF_01', 'DSGNBoom_Dark_Sci-Fi_Impact_MWSFX_CF_01']
for i, T in enumerate(CARDS):     # chapter cards: riser into a hit and a sub
    sfx(S_('DSGNRise_Low_Riser'), T - 5.0, -14, 'cards', 'riser into the chapter card', kind='card')
    sfx(S_(HITS[i % len(HITS)]), T, -9, 'cards2', 'chapter card hit' if T != 154.7 else 'the hook ends on the hit into the film title', kind='card')
    sfx(S_('Sub_Kick_Clean'), T, -12, 'sub', 'card sub', kind='card')
for T in TYPING:                  # typing on every card title (Top Secret cards type on ~0.6 s after they land)
    sfx(S_('Key-Strokes-05'), T + 0.7, -20, 'foley', 'typing on the card title', maxdur=2.6, kind='card')
hits = [c['start'] for c in clips if c['stem'] == 'sfx' and c['track'] in ('cards2', 'sub')]
for a, b, lab in RUNS:            # each tension run: a low riser landing on the climax, a sub where nothing else hits
    if not any(abs(b - c) < 4.0 for c in CARDS):
        sfx(S_('DSGNRise_Low_Riser'), b - 5.15, -17, 'cards', 'riser into the climax: ' + lab, kind='climax')
    if not any(abs(b - h) < 2.0 for h in hits):
        sfx(S_('Sub_Kick_Clean'), b, -14, 'sub', 'climax sub: ' + lab, kind='climax'); hits.append(b)

# voice-locked story SFX, spotted on the transcript (Assets/words_full.txt) and the masters' cuts: (time, key, peak in a pause, label, maxdur, fade-in)
# under the voice they drop to -22/-24 dB peak (the house rule); none in stillness beats or on a talking-head cut
STORY = [
    (1.0, 'Fighter_Turbine_Steady', -30, 'the 727 touches down at Harare: jet engines', 9.0, 2.0),
    (29.3, 'AirplaneBeforeTakeoff', -32, 'the plane rolls into the shadows of the cargo area', 8.0, 1.5),
    (38.0, 'Cargo_Area_Rumble_Creak', -30, 'inside the dark cabin: hull creak and rumble', 9.0, 1.5),
    (60.55, 'Sub_Kick_Noise_03', -16, 'reveal: 64 men in the dark (hard cut)', None, 0),
    (100.6, 'WEAPONS_BULLET_Handle_Click', -20, 'arms list: rifles', None, 0),
    (102.2, 'Handling_Click_03', -20, 'arms list: machine guns', None, 0),
    (105.0, 'METAL_Lock_Large_Close', -18, 'the crates locked in the cargo hold', None, 0),
    (130.2, 'PROP_PLANE_Synthesized_Flying_03', -30, 'Mali: a small private plane waits on the runway', 6.0, 1.0),
    (242.6, 'Water_Hole_Night', -34, 'hunted down in the forest near Gabon', 9.5, 1.0),
    (255.0, 'OceanWaves', -34, 'Black Beach, right on the edge of the sea', 6.0, 2.0),
    (292.75, 'Sub_Kick_Noise_03', -15, 'reveal: 1995, Mobil strikes oil', None, 0),
    (300.2, 'Antique-Cash-Register', -22, 'the money floods in', None, 0),
    (340.6, 'Stamp1', -18, '"the one who signs is me"', None, 0),
    (352.3, 'RadioStaticInterrupted', -26, 'state radio: "like God in heaven"', 2.5, 0),
    (474.9, 'Sub_Kick_Noise_03', -16, 'reveal: enter Simon Mann', None, 0),
    (532.05, 'Plastic_Stamp', -16, 'REFUSED stamp: the assassination request', None, 0),
    (557.7, 'Antique-Cash-Register', -22, '$15 million for Mann', None, 0),
    (616.0, 'HELICOPTER_Flying_Far_Away_01', -26, '$275,000 to rent a helicopter', 6.0, 1.0),
    (668.5, 'CROWD_March_Huge', -28, '32 Battalion, "the terrible ones"', 7.0, 1.0),
    (753.6, 'TelephoneRingTone', -18, 'waiting in Pretoria for the call', 2.6, 0),
    (784.4, 'WalkieTalkieOn', -22, 'capture the airport', 3.5, 0),
    (807.5, 'Fighter_Turbine_Steady', -26, 'the plane on the apron', 6.0, 1.0),
    (813.7, 'PassengerJetTakeOff1', -17, 'the real 727, N4610', 6.0, 0.3),
    (829.4, 'Stamp1', -20, 'the sale goes through, 1 March 2004', None, 0),
    (861.6, 'Plastic_Stamp', -16, 'COVER STORY stamp on the real arms list', None, 0),
    (867.0, 'METAL_Lock_Large_Close', -22, 'half the cash locked in a safe', None, 0),
    (922.2, 'Typewriter1951Typing1', -24, 'Smith types up a warning report', 3.0, 0),
    (929.0, 'BeachWaves1', -34, 'the fishing trawlers', 6.0, 1.5),
    (942.45, 'Plastic_Stamp', -16, 'PREDICTED: MID-MARCH 2004 stamp', None, 0),
    (971.8, 'WalkieTalkieStatic', -22, 'whatever Kershaw sees, Morgan hears', None, 0),
    (982.0, 'LaserPrinter', -26, '10 intelligence reports', 4.0, 0.5),
    (998.0, 'Male_Crowd_Mumbling', -32, '35 drunk men roaring in Afrikaans, Malabo', 9.0, 1.5),
    (1040.0, 'SCI-FI_Computer_Sound_25', -26, 'the emails: "a profit sharing agreement"', None, 0),
    (1082.5, 'OceanWaves', -34, 'two Spanish Navy ships off the Canaries', 6.0, 1.5),
    (1121.5, 'PROP_PLANE_Synthesized_Flying_Many', -24, 'two old planes full of men take off', 4.5, 0.5),
    (1124.6, 'Dark_Sci-Fi_Impact', -18, 'the bird strike', None, 0),
    (1132.3, 'TickingClock1', -26, 'three hours on the ground at Ndola', 3.5, 0.3),
    (1150.5, 'HandRadioStatic', -26, 'coordinates, radio frequencies, all in code', 2.5, 0),
    (1209.3, 'AirplaneBeforeTakeoff', -30, 'the plane lands at Wonderboom', 8.0, 1.5),
    (1217.0, 'AirplaneHangarDoorOpen', -26, 'a bus pulls up to a hangar', 5.0, 0.5),
    (1234.8, 'PassengerJetTakeOff1', -20, '4 pm: it takes off anyway', 7.0, 0.5),
    (1250.3, 'PropellerPassBy', -24, 'the King Air ZS-NBJ, Moto on board', None, 0.3),
    (1272.0, 'Fighter_Turbine_Steady', -32, 'Harare: the white plane rolls to a stop', 7.0, 2.0),
    (1311.0, 'PolicePassBy', -20, 'about 7 pm: security forces swarm the plane', None, 0),
    (1313.2, 'WalkieTalkieOn', -22, 'police radio', 3.0, 0),
    (1316.6, 'Plastic_Stamp', -15, 'ARRESTED stamp', None, 0),
    (1318.0, 'Chain_Classic_Handling', -22, 'the 64 and the crew in handcuffs', 3.0, 0),
    (1323.0, 'Electronic-Camera-Flash', -22, 'on national television: the kit on display', 3.0, 0),
    (1357.1, 'TelephoneRingTone', -20, 'Steyl calls Mann\'s office for orders', 2.6, 0),
    (1366.0, 'TelephoneSpeakerBusyTone', -28, '"We have problems."', 2.0, 0),
    (1376.0, 'PROP_PLANE_Synthesized_Flying_03', -26, 'lights off, north to the Canaries', 6.0, 1.0),
    (1403.5, 'Police_Cop_Sirenes', -30, 'Malabo: security forces sweep the city', 6.0, 1.5),
    (1412.0, 'Chain_Rugged_Handling', -22, 'du Toit\'s team hunted down and arrested', 3.0, 0),
    (1416.5, 'NewsIntroChime1', -22, 'du Toit on state television', None, 0),
    (1432.0, 'NewsIntroChime3', -24, 'Obiang goes on television', None, 0),
    (1454.0, 'Washing-Machine-Door-Slam', -18, 'the window of opportunity slams shut', None, 0),
    (1508.5, 'Slamming_Cell_Door', -17, 'Chikurubi maximum security prison', None, 0),
    (1517.5, 'SCI_FI_ALARM_Facility_Slow', -34, 'solitary confinement', 5.0, 1.0),
    (1542.3, 'CourtroomHammer1', -18, 'seven years (Harare)', None, 0),
    (1618.9, 'CourtroomHammer1', -17, '34 YEARS: du Toit sentenced in Malabo', None, 0),
    (1656.0, 'Chain_Rugged_Handling', -22, 'handcuffs and heavy chains 24 hours a day', 3.0, 0),
    (1663.5, 'DoorCloseMiniCopper', -24, 'driven to the border', None, 0),
    (1723.0, 'News-Paper-Turn-Page', -22, 'a secret letter appears in the British papers', None, 0),
    (1771.5, 'Electronic-Camera-Flash', -24, 'the British press figures out the nicknames', 3.0, 0),
    (1827.0, 'PolicePassBy', -17, '7 am, 25 August 2004: police at Thatcher\'s house', None, 0),
    (1836.4, 'DoorCloseMiniCopper', -20, 'the Scorpions', None, 0),
    (1841.0, 'Chain_Classic_Handling', -22, 'the walk to the car', 2.5, 0),
    (1845.5, 'Electronic-Camera-Flash', -20, '"credible evidence" to the cameras', 3.0, 0),
    (1880.0, 'CourtroomHammer1', -20, 'R3 million fine, suspended sentence', None, 0),
    (1894.8, 'Electronic-Camera-Flash', -22, '"See you later, guys."', 3.0, 0),
    (1975.3, 'Stamp1', -18, 'THE FCO APOLOGISED', None, 0),
    (1999.0, 'Slamming_Cell_Door', -18, 'dragged out of his cell before dawn', None, 0),
    (2001.0, 'Chain_Rugged_Handling', -22, 'he tries to fight back', 3.0, 0),
    (2007.0, 'PassengerJetTakeOff1', -22, 'put on an airplane to Malabo', 7.0, 1.0),
    (2016.7, 'CourtroomHammer1', -18, 'APPEAL DISMISSED', None, 0),
    (2068.5, 'Electronic-Camera-Flash', -24, 'a British news crew inside Black Beach', 3.0, 0),
    (2072.0, 'Chain_Classic_Handling', -22, 'Mann in shackles', 3.0, 0),
    (2139.7, 'CourtroomHammer1', -16, '34 YEARS', None, 0),
    (2152.7, 'Plastic_Stamp', -16, 'PARDONED', None, 0),
    (2170.2, 'TickingClock1', -26, '24 hours to leave the country', 3.5, 0.3),
    (2225.2, 'METAL_Lock_Large_Close', -20, 'RIGGS BANK: 60 accounts', None, 0),
    (2242.7, 'Antique-Cash-Register', -22, '$13M in cash deposits', None, 0),
    (2259.0, 'Electronic-Camera-Flash', -22, 'Washington, 2006: the photo opportunity', 3.0, 0),
    (2317.0, 'RadioStaticInterrupted', -28, 'the anniversary message: "harmful parasites"', 2.5, 0),
    (2331.7, 'CourtroomHammer1', -20, 'CONVICTED IN FRANCE', None, 0),
]
nstory = 0; skipped = []; lane_end = {'reveal': -1, 'reveal2': -1}
for n_, (t, key, pk_, lab, mx, fin) in enumerate(STORY):
    if in_still(t, 0.3): skipped.append((t, lab, 'stillness')); continue
    if any(abs(t - c) < 1.2 for c in CARDS): skipped.append((t, lab, 'card')); continue
    tt = t
    if th_edge(tt, 0.35):                 # never on a talking-head cut: nudge just past it
        e = min([x for a, b in TH for x in (a, b)], key=lambda x: abs(x - tt)); tt = e + 0.4 if tt >= e else e - 0.6
    peak = pk_ if not vo_active(tt) else min(pk_, -22 if pk_ > -24 else pk_ - 2)
    if on_th(tt): peak -= 3                # over Jude: lower still, felt more than heard
    lane = min(('reveal', 'reveal2'), key=lambda L: (lane_end[L] > tt, lane_end[L]))
    sfx(S_(key), tt, peak, lane, 'story: ' + lab, maxdur=mx, fin=fin, kind='story'); nstory += 1
    lane_end[lane] = clips[-1]['start'] + clips[-1]['dur']
print('story SFX placed', nstory, 'skipped', skipped)
story_t = [c['start'] for c in clips if c.get('kind') == 'story']

# ---------- transition SFX on the masters' real cuts (house rules: whoosh into dark shots, paper into paper inserts, 2 s apart,
# none near a card, none in stillness beats, never on a talking-head cut; -22/-24 dB peak under the voice, -15/-17 in pauses) ----------
det = []
for i in range(10):
    rows = [tuple(map(float, l.split())) for l in open(f'{AN}/cuts/{i:02d}.txt')]
    d = [r[1] for r in rows]; lum = [r[2] for r in rows]; n = len(d); hard = set()
    for j in range(2, n - 2):
        if d[j] > 15 and d[j] > 3 * max(d[j - 2], d[j - 1], d[j + 1], d[j + 2], 1.0):
            hard.add(j); det.append((START[i] / FPS + rows[j][0], lum[min(n - 1, j + 12)], d[j]))
    j = 0
    while j < n:
        if d[j] > 4 and j not in hard:
            k = j
            while k + 1 < n and d[k + 1] > 4 and (k + 1) not in hard: k += 1
            L = k - j + 1
            if 8 <= L <= 40 and sum(d[j:k + 1]) > 150:
                t0, t1 = rows[j][0], rows[k][0]
                det.append((START[i] / FPS + t0 + 0.5 * min(t1 - t0, 1.2), lum[min(n - 1, k + 6)], sum(d[j:k + 1]) / 10))
            j = k + 1
        else: j += 1
WHK = ['SubtleDeepWhoosh', 'WhooshPassBy', 'CINEMATIC_TRANSITION_Push_11', 'Swoosh_Close_03', 'Whoosh,Sound_Design', 'Whoosh_Air_16',
       'Rope_Whoosh_Swirl_09', 'Whoosh1.wav', 'SWSH_Fast-Whoosh-01', 'Multiple-Fast-Whistle-Swish']
PAK = ['Paper_Cloth_Dragging', 'Handling_Paper_04', 'Envelope_Drop', 'PhotoPaperPageFlip1', 'Binders-Book-Page-Turn', 'News-Paper-Turn-Page',
       'Paper_Sheet_Manipulation', 'Notebook-Page-Crackle']
def blocked(t):
    return (any(-2.5 < t - T < 4.0 for T in CARDS) or in_still(t, 0.5) or any(a - 0.5 <= t <= b for a, b in QUIET) or t > CREDIT[0] - 3
            or any(abs(t - h) < 0.8 for h in hits) or any(abs(t - h) < 1.0 for h in story_t) or th_edge(t, 0.6) or on_th(t))
pick = []
for t, l_, strength in sorted(det, key=lambda x: -x[2]):
    if blocked(t) or any(abs(t - p[0]) < 2.0 for p in pick): continue
    pick.append((t, l_))
pick.sort(); wi = pi = 0
for n_, (t, l_) in enumerate(pick):
    under = vo_active(t)
    if l_ >= 115: path = S_(PAK[pi % len(PAK)]); pi += 1; kind = 'paper'; peak = -24 if under else -17; lead = 0.15; mx = 1.6
    else: path = S_(WHK[wi % len(WHK)]); wi += 1; kind = 'whoosh'; peak = -22 if under else -15; mx = 2.2; lead = min(P(path)[2], mx) * 0.45
    sfx(path, max(0, t - lead), peak, 'sfx' if n_ % 2 == 0 else 'sfx2', 'transition: ' + kind, maxdur=mx, kind='trans')
print('cuts detected', len(det), '| transition SFX placed', len(pick), f'({wi} whoosh, {pi} paper)')

# ---------- ambience and room tone ----------
def amb(path, st, en, target, track, label):
    pk, lu, du = P(path); g = target - lu; t = st; first = True
    while t < en - 1:
        dur = min(du - 0.05, en - t)
        gains = [[0, round(g - 40, 2)], [2.0 if first else 1.0, round(g, 2)], [round(max(dur - 2.0, 1.1), 3), round(g, 2)], [round(dur, 3), round(g - 40, 2)]]
        used_sfx.add(path)
        clips.append(dict(file=path, start=round(t, 3), **{'in': 0}, dur=round(dur, 3), stem='amb', track=track, gains=gains, label=label, kind='amb'))
        t += dur - 1.0; first = False      # 1 s overlap between loop passes (on alternating lanes)
        track = 'amb2' if track == 'amb' else 'amb'
ROOM = S_('Room-tone-House_STEREO')
for a_, b_ in [(0.0, 1308.2), (1310.2, CREDIT[0])]:
    pk, lu, du = P(ROOM); g = -50 - lu; t = a_
    while t < b_ - 1:
        dur = min(du - 0.05, b_ - t)
        clips.append(dict(file=ROOM, start=round(t, 3), **{'in': 0}, dur=round(dur, 3), stem='amb', track='room', label='room tone floor',
                          gains=[[0, round(g - 40, 2)], [1.0, round(g, 2)], [round(dur - 1.0, 3), round(g, 2)], [round(dur, 3), round(g - 40, 2)]], kind='room'))
        used_sfx.add(ROOM); t += dur - 0.05
LOC = [  # (key, start, end, target LUFS, label)
    ('AirportParkingLot', 0.0, 75.0, -46, 'Harare airport at dusk'), ('Water_Hole_Night', 75.0, 154.6, -46, 'the quiet runway: African night'),
    ('African_Market', 159.2, 242.0, -49, 'Santa Isabel / Malabo'), ('Water_Hole_Night', 242.0, 252.4, -45, 'the forest near Gabon at night'),
    ('OceanWaves', 252.4, 289.7, -46, 'Black Beach, on the edge of the sea'), ('African_Market', 292.7, 400.5, -49, 'Malabo, the oil boom'),
    ('Ambience-City-Moring-Soft-Rain', 405.4, 508.2, -47, 'London: Chelsea in the rain'), ('Suburb_Church_Bell', 508.2, 637.6, -48, 'Cape Town suburb, Constantia'),
    ('StrongWindGusts2', 642.0, 749.1, -47, 'Pomfret, the edge of the Kalahari'), ('African_Market', 756.3, 847.0, -49, 'Malabo: the advance team'),
    ('Water_Hole_Night', 847.0, 898.1, -48, 'Harare'), ('Roomtone-Office-Lively', 901.2, 1110.4, -49, 'the intelligence reports'),
    ('AirportParkingLot', 1110.4, 1200.5, -48, 'the February abort, the airfields'), ('AirportParkingLot', 1209.05, 1271.6, -46, 'Wonderboom airport'),
    ('Water_Hole_Night', 1271.6, 1306.4, -45, 'Harare airport at night'), ('AirportParkingLot', 1310.3, 1402.9, -48, 'the arrests, Bamako, the Canaries'),
    ('African_Market', 1402.9, 1466.2, -49, 'Malabo sweeps'), ('OceanWaves', 1494.6, 1506.7, -46, 'Black Beach'),
    ('StrongWindGusts2', 1549.0, 1612.8, -48, 'Pomfret families'), ('Crowd,Courthouse', 1612.8, 1639.7, -44, 'the makeshift courtroom in Malabo'),
    ('StrongWindGusts2', 1639.7, 1719.1, -49, 'Pomfret\'s end'), ('Ambience-City-Moring-Soft-Rain', 1722.6, 1826.2, -48, 'London: the letter, the press'),
    ('Suburb_Church_Bell', 1826.2, 1859.6, -46, 'Constantia, 7 am'), ('Ambience-City-Moring-Soft-Rain', 1859.6, 1992.7, -49, 'London, Westminster'),
    ('AirportParkingLot', 1997.8, 2018.9, -47, 'the night move to Malabo'), ('OceanWaves', 2067.8, 2117.3, -47, 'inside Black Beach'),
    ('Crowd,Courthouse', 2117.3, 2142.6, -44, 'Mann\'s trial in Malabo'), ('OceanWaves', 2142.6, 2211.5, -49, 'Malabo, the pardon'),
    ('New_York_Midnight', 2214.2, 2274.3, -48, 'Washington'), ('African_Market', 2299.2, 2349.0, -49, 'Equatorial Guinea today'),
]
for key, a_, b_, tgt, lab in LOC:
    amb(S_(key), a_, b_, tgt, 'amb', 'ambience: ' + lab)

# ---------- copy every SFX used into the Wonga folder (the XML points at Sound/sfx/used, never at Viktor's folders) ----------
remap = {}
for p_ in sorted(used_sfx):
    dst = SFXDIR + '/' + os.path.basename(p_)
    if not os.path.exists(dst): shutil.copy2(p_, dst)
    remap[p_] = dst
for c in clips:
    if c['file'] in remap: probe[remap[c['file']]] = probe[c['file']]; c['file'] = remap[c['file']]
json.dump(clips, open(AN + '/clips_v1.json', 'w'))
ts = lambda s: f"{int(s//60)}:{s%60:05.2f}"
with open(SND + '/SOUND v1 CUE SHEET.csv', 'w', newline='') as fh:
    w = csv.writer(fh); w.writerow(['time', 'end', 'lane', 'file', 'level (dB clip gain, max)', 'why'])
    for c in sorted(clips, key=lambda c: (c['start'], c['track'])):
        if c['stem'] != 'vo':
            w.writerow([ts(c['start']), ts(c['start'] + c['dur']), c['track'], c.get('src', os.path.basename(c['file'])), round(max(g[1] for g in c['gains']), 1), c['label']])

# ---------- FCP7 XML for Premiere ----------
esc = lambda s: s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
RATE = '<rate><timebase>24</timebase><ntsc>TRUE</ntsc></rate>'
url = lambda p: 'file://localhost' + urllib.parse.quote(p)
endf = START[-1] + NFR[-1]
film_file = (f'<file id="film"><name>Wonga Coup.mp4</name><pathurl>{url(FC)}</pathurl>{RATE}<duration>{FC_FRAMES}</duration><media><video><samplecharacteristics>{RATE}'
             '<width>3840</width><height>2160</height></samplecharacteristics></video><audio><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate>'
             '</samplecharacteristics><channelcount>2</channelcount></audio></media></file>')
scale50 = ('<filter><effect><name>Basic Motion</name><effectid>basic</effectid><effectcategory>motion</effectcategory><effecttype>motion</effecttype><mediatype>video</mediatype>'
           '<parameter><parameterid>scale</parameterid><name>Scale</name><valuemin>0</valuemin><valuemax>1000</valuemax><value>50</value></parameter></effect></filter>')
v1 = (f'<track><clipitem id="film-v"><name>Wonga Coup.mp4</name><enabled>TRUE</enabled><duration>{FC_FRAMES}</duration>{RATE}<start>0</start><end>{FC_FRAMES}</end>'
      f'<in>0</in><out>{FC_FRAMES}</out>{film_file}{scale50}</clipitem><enabled>TRUE</enabled><locked>FALSE</locked></track>')
v2 = '<track>'
for i, name in enumerate(MASTERS):
    path = EXP + '/' + name + '.mp4'; assert os.path.exists(path) or os.environ.get('AN'), path
    v2 += (f'<clipitem id="w1m{i}"><name>{esc(name)}</name><enabled>TRUE</enabled><duration>{NFR[i]}</duration>{RATE}<start>{START[i]}</start><end>{START[i] + NFR[i]}</end>'
           f'<in>0</in><out>{NFR[i]}</out><file id="w1mf{i}"><name>{esc(name)}.mp4</name><pathurl>{url(path)}</pathurl>{RATE}<duration>{NFR[i]}</duration>'
           f'<media><video><samplecharacteristics>{RATE}<width>1920</width><height>1080</height></samplecharacteristics></video></media></file></clipitem>')
v2 += '<enabled>TRUE</enabled><locked>FALSE</locked></track>'
fileids = {FC: 'film'}; fid = [0]; probe[FC] = (0, 0, FC_FRAMES / FPS)
def fileel(path):
    if path in fileids: return f'<file id="{fileids[path]}"/>'
    fid[0] += 1; i_ = f'w1f{fid[0]}'; fileids[path] = i_
    return (f'<file id="{i_}"><name>{esc(os.path.basename(path))}</name><pathurl>{url(path)}</pathurl>{RATE}<duration>{fr(probe[path][2])}</duration><media><audio>'
            '<samplecharacteristics><depth>24</depth><samplerate>48000</samplerate></samplecharacteristics><channelcount>2</channelcount></audio></media></file>')
def levels(gains):
    kf = ''.join(f'<keyframe><when>{fr(t)}</when><value>{10 ** (db / 20):.5f}</value></keyframe>' for t, db in gains)
    return ('<filter><effect><name>Audio Levels</name><effectid>audiolevels</effectid><effectcategory>audiolevels</effectcategory><effecttype>audiolevels</effecttype>'
            '<mediatype>audio</mediatype><parameter authoringApp="PremierePro"><parameterid>level</parameterid><name>Level</name><valuemin>0</valuemin>'
            f'<valuemax>3.98109</valuemax><value>{10 ** (gains[0][1] / 20):.5f}</value>{kf if len(gains) > 1 else ""}</parameter></effect></filter>')
cid = [0]; trimmed = []
def track_xml(name):
    items = ''; lastend = -1
    for c in sorted([c for c in clips if c['track'] == name], key=lambda c: c['start']):
        fs = fr(c['start']); fe = fr(c['start'] + c['dur'])
        if fs < lastend: trimmed.append((name, c['label'], round(c['start'], 2))); fs = lastend
        if fe - fs < 2: continue
        o = fs - fr(c['start']) + fr(c['in']); path = c.get('xmlfile', c['file']); cid[0] += 1
        items += (f'<clipitem id="w1c{cid[0]}" premiereChannelType="stereo"><name>{esc(os.path.basename(path))}</name><enabled>TRUE</enabled><duration>{fr(probe[path][2])}</duration>'
                  f'{RATE}<start>{fs}</start><end>{fe}</end><in>{o}</in><out>{o + fe - fs}</out>{fileel(path)}<sourcetrack><mediatype>audio</mediatype><trackindex>1</trackindex>'
                  f'</sourcetrack>{levels(c["gains"])}</clipitem>')
        lastend = fe
    return ('<track PannerIsInverted="true" PannerName="Balance" currentExplodedTrackIndex="0" totalExplodedTrackCount="1" premiereTrackType="Stereo">'
            f'{items}<enabled>TRUE</enabled><locked>FALSE</locked><outputchannelindex>1</outputchannelindex></track>')
ORDER = ['vo', 'musA', 'musB', 'sfx', 'sfx2', 'cards', 'cards2', 'sub', 'reveal', 'reveal2', 'foley', 'amb', 'amb2', 'room']
audio = '<audio><numOutputChannels>2</numOutputChannels>' + ''.join(track_xml(n) for n in ORDER) + '</audio>'
head = ('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE xmeml>\n<xmeml version="4"><sequence id="seqwongasound1"><name>WONGA COUP full + AE exports SOUND v1 SYNC</name>'
        f'<duration>{endf}</duration>{RATE}\n<timecode>{RATE}<string>00:00:00:00</string><frame>0</frame><displayformat>NDF</displayformat></timecode>\n'
        f'<media><video><format><samplecharacteristics>{RATE}<width>1920</width><height>1080</height><pixelaspectratio>square</pixelaspectratio>'
        '<fielddominance>none</fielddominance></samplecharacteristics></format>')
out = os.environ.get('XMLOUT', W + '/AE EXPORT/WONGA AE SYNC v1.xml')
assert not os.path.exists(out) or '--force' in sys.argv, 'exists: ' + out
open(out, 'w').write(head + v1 + v2 + '</video>' + audio + '</media></sequence></xmeml>')
cnt = {}
for c in clips: cnt[c['track']] = cnt.get(c['track'], 0) + 1
print('clips per lane', cnt); print('trimmed overlaps', trimmed); print('wrote', out)
# mixr input (offline check): the same clips, VO from the decoded WAV
json.dump([dict(file=c['file'], start=c['start'], **{'in': c['in']}, dur=c['dur'], stem=c['stem'], gains=c['gains']) for c in clips], open(AN + '/mix_v1.json', 'w'))
print('film end', END)
