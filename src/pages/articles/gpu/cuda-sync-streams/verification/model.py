# -*- coding: utf-8 -*-
"""Authored CPU model, not CUDA execution or measured GPU performance."""
import json
from pathlib import Path

def schedule(n, slots=2, serial=False):
    resources = [0,0,0]
    released = [0]*slots
    out=[]
    for i in range(n):
        slot=i%slots
        h=max(resources[0],released[slot],out[-1][-1] if serial and out else 0)
        he=h+2
        ks=max(he,resources[1]);ke=ks+5
        ds=max(ke,resources[2]);de=ds+2
        assert ds==ke
        out.append([h,he,ke,de]);resources=[he,ke,de];released[slot]=de
    return out

expected=[[[0,2,7,9],[9,11,16,18]],[[0,2,7,9],[2,4,12,14]],[[0,2,7,9],[2,4,12,14],[9,11,17,19],[14,16,22,24]]]
actual=[schedule(2,serial=True),schedule(2),schedule(4)]
assert actual==expected
for n in range(1,25):
    jobs=schedule(n)
    assert jobs[-1][-1]==9+(n-1)*5
    for i,job in enumerate(jobs):
        if i>=2: assert job[0]>=jobs[i-2][-1]
        if i: assert job[2]-5>=jobs[i-1][2]
# Mirror the official kernel's scalar expression; not compiling/running that kernel.
x=7
for _ in range(5):y=x+1
assert y==8
# Event capture semantics as an explicit model of the documented API.
record=None
wait_before=record
record=1;wait_after=record
record=2
assert wait_before is None and wait_after==1 and record==2
# No empirical timing or GPU correctness claim is derived from this script.
print(json.dumps({'scope':__doc__,'schedules':actual,'kernel_substitution':{'input':x,'iterations':5,'output':y},'event_model':{'unrecorded_wait':wait_before,'existing_wait':wait_after,'latest_record':record},'same_work_multi_gpu_ms':10+12,'checked_N':list(range(1,25))},indent=2))
