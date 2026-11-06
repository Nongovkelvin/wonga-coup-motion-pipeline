# waits for each rendered master, then: grids (64x36 luma), vcuts (cut detection), thcheck vs the first cut at the butted start frame
import os, subprocess, time
SND = os.environ.get('FILM_ROOT', os.path.expanduser('~/Films/Jude Bela/Wonga coup')) + '/Sound'; EXP = SND + '/../AE EXPORT/Latest review export'
M = ['00 COLD OPEN 0.00-2.37', '01 THE PRIZE 2.37-6.41', '02 THE LONDON MONEY 6.41-10.38', '03 THE ARMY 10.38-14.58',
     '04 THE WORST KEPT SECRET 14.58-20.01', '05 SUNDAY 7 MARCH 2004 20.01-24.26', '06 THE PRICE 24.26-28.39',
     '07 A LARGE SPLODGE OF WONGA 28.39-33.13', '08 BLACK BEACH 33.13-36.52', '09 NOTHING HAS CHANGED 36.52-39.36']
start = 0; log = open(SND + '/analysis/watch.log', 'a')
for i, n in enumerate(M):
    p = f'{EXP}/{n}.mp4'; g = f'{SND}/analysis/grids/{i:02d}.bin'
    while not os.path.exists(p): time.sleep(30)
    time.sleep(20)
    if not os.path.exists(g) or i > 0:
        subprocess.run([SND + '/tools/grids', p, g], capture_output=True)
        open(f'{SND}/analysis/cuts/{i:02d}.txt', 'w').write(subprocess.run([SND + '/tools/vcuts', p], capture_output=True, text=True).stdout)
    nf = os.path.getsize(g) // 2304
    th = subprocess.run([SND + '/tools/thcheck', SND + '/analysis/firstcut.bin', g, str(start)], capture_output=True, text=True).stdout
    open(f'{SND}/analysis/th/{i:02d}.txt', 'w').write(th)
    log.write(f'{time.strftime("%H:%M")} {n}: {nf} frames ({nf*1001/24000:.3f} s), start frame {start}\n{th}\n'); log.flush()
    start += nf
log.write('ALL DONE\n')
