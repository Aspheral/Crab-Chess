#!/usr/bin/env python3
import argparse, json, math, re
from pathlib import Path

p=argparse.ArgumentParser()
p.add_argument('pgn')
p.add_argument('--engine', required=True)
p.add_argument('--opponent', required=True)
p.add_argument('--json', required=True)
a=p.parse_args()
text=Path(a.pgn).read_text(errors='replace')
blocks=re.split(r'\n\s*\n(?=\[Event )', text.strip())
w=d=l=0
for b in blocks:
    wm=re.search(r'^\[White "([^"]+)"\]$', b, re.M)
    bm=re.search(r'^\[Black "([^"]+)"\]$', b, re.M)
    rm=re.search(r'^\[Result "(1-0|0-1|1/2-1/2)"\]$', b, re.M)
    if not (wm and bm and rm):
        continue
    white, black, r=wm.group(1), bm.group(1), rm.group(1)
    if a.engine not in (white, black):
        continue
    if r=='1/2-1/2': d+=1
    elif (r=='1-0' and white==a.engine) or (r=='0-1' and black==a.engine): w+=1
    else: l+=1
n=w+d+l
if n==0: raise SystemExit('no completed games for engine')
score=(w+0.5*d)/n
# Draw-aware score variance using per-game scores {1,.5,0}.
mean=score
var=((w*(1-mean)**2)+(d*(0.5-mean)**2)+(l*(0-mean)**2))/max(1,n-1)
se=math.sqrt(var/n)
lo=max(1e-9, score-1.96*se); hi=min(1-1e-9, score+1.96*se)
def elo(s): return -400*math.log10(1/s-1)
out={'engine':a.engine,'opponent':a.opponent,'games':n,'wins':w,'draws':d,'losses':l,'score':score,'elo':elo(score),'elo95_low':elo(lo),'elo95_high':elo(hi),'method':'draw-aware normal 95% CI; screening estimate, not SPRT'}
Path(a.json).write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
