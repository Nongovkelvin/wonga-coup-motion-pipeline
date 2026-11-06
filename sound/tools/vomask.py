# vomask: 0/1 per 0.1 s of film time (1 = Jude speaking), from the first-cut WAV
import sys, numpy as np, soundfile as sf
x, sr = sf.read(sys.argv[1], dtype='float32'); x = x.mean(axis=1) if x.ndim > 1 else x
hop = sr // 10; n = len(x) // hop
e = np.sqrt((x[:n*hop].reshape(n, hop) ** 2).mean(axis=1) + 1e-12); db = 20 * np.log10(e)
on = db > -38
# close gaps < 0.4 s (between words), drop blips < 0.2 s
m = on.copy()
i = 0
while i < n:
    if not m[i]:
        j = i
        while j < n and not m[j]: j += 1
        if j - i < 4 and i > 0 and j < n: m[i:j] = True
        i = j
    else: i += 1
i = 0
while i < n:
    if m[i]:
        j = i
        while j < n and m[j]: j += 1
        if j - i < 2: m[i:j] = False
        i = j
    else: i += 1
np.savetxt(sys.argv[2], m.astype(int), fmt='%d')
print('frames', n, 'speech %', round(100 * m.mean(), 1))
