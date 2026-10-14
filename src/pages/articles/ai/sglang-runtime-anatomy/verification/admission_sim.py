"""본문 16절 접힌 영역의 장난감 모형. 실행: python3 admission_sim.py
가정: 입력 200, 출력 상한 1000, 실제 출력 300, KV 4096칸, page 1, 요청 24개, step 시간은 batch와 무관.
SGLang 모형은 고정 commit 4560da5의 비율 기본값(0.7, 0.14, 600, 20)과 retract 순서를 흉내 낸다.
"""
# Toy simulation (token-granular, page=1) of three admission policies. Assumptions documented in article.
POOL=4096; P=200; MAXNEW=1000; OUT=300; NREQ=24
def sim_trt(steps=9000):
    waiting=list(range(NREQ)); run={}; done=0; hist=[]; t=0
    reserved=0
    while (waiting or run) and t<steps:
        # admit: reserve P+MAXNEW
        while waiting and reserved+P+MAXNEW<=POOL:
            r=waiting.pop(0); run[r]=0; reserved+=P+MAXNEW
        for r in list(run):
            run[r]+=1
            if run[r]>=OUT: del run[r]; reserved-=P+MAXNEW; done+=1
        hist.append(len(run)); t+=1
    return t,max(hist),hist
def sim_vllm(steps=5000):
    waiting=[(i,0) for i in range(NREQ)]; run=[]; used={}; t=0; pre=0; hist=[]; recomputed=0
    def free(): return POOL-sum(used.values())
    while (waiting or run) and t<steps:
        # running first: each needs 1 slot
        i=0; sched=[]; newly=set()
        while i < len(run):
            r=run[i]
            if free()>=1:
                used[r]+=1; i+=1
            else:
                v=run.pop(); # preempt last
                g=used.pop(v)-P; pre+=1; recomputed+=P+max(g,0)
                waiting.insert(0,(v,g))
        # admit new: prompt + regenerate? (recompute prefill of prompt+generated)
        while waiting and free()>=P+waiting[0][1]:
            v,g=waiting.pop(0); used[v]=P+g; run.append(v); newly.add(v)
        for r in list(run):
            if used[r]-P>=OUT: run.remove(r); used.pop(r)
        hist.append(len(run)); t+=1
    return t,max(hist),pre,recomputed,hist
def sim_sgl(steps=5000):
    init=0.7; mn=init*0.14; dec=(init-mn)/600
    ratio=init
    waiting=[(i,0) for i in range(NREQ)]; run=[]; used={}; t=0; ret=0; hist=[]; ratios=[]; adm_first=None; recomputed=0
    def avail(): return POOL-sum(used.values())
    while (waiting or run) and t<steps:
        # prefill pass
        offset=sum((MAXNEW-(used[r]-P))*ratio for r in run)
        admitted=[]
        while waiting:
            v,g=waiting[0]
            total=(P+g)+(MAXNEW-g)+1
            if total < avail()-offset:
                waiting.pop(0); used[v]=P+g; offset+=P+g+1+(MAXNEW-g); admitted.append(v)
            else: break
        if admitted:
            run+=admitted
            if adm_first is None: adm_first=len(admitted)
        else:
            # decode step
            if avail()<len(run):
                # retract: keep most output; retract fewest output first
                order=sorted(run,key=lambda r:(used[r]-P),reverse=True)
                first=True
                while first or avail()<len(order):
                    first=False
                    if len(order)==1: break
                    v=order.pop(); g=used.pop(v)-P; ret+=1; recomputed+=P+g
                    waiting.insert(0,(v,g))
                run=[r for r in run if r in order]
                ratio=min(1.0,(sum(used[r]-P for r in run)+20*len(run))/(MAXNEW*len(run)+1))
            else:
                ratio=max(ratio-dec,mn)
            for r in run: used[r]+=1
        for r in list(run):
            if used[r]-P>=OUT: run.remove(r); used.pop(r)
        hist.append(len(run)); ratios.append(ratio); t+=1
    return t,max(hist),ret,recomputed,hist,ratios,adm_first
a=sim_trt(); print("TRT steps,maxconc",a[0],a[1])
b=sim_vllm(); print("vLLM steps,maxconc,preempt,recomputed",b[:4])
c=sim_sgl(); print("SGL steps,maxconc,retract,recomputed,first_admit",c[0],c[1],c[2],c[3],c[6])
import json
for name,h in [("trt",a[2]),("vllm",b[4]),("sgl",c[4])]:
    print(name, [h[i] for i in range(0,len(h),50)][:30])
print("ratios",[round(c[5][i],3) for i in range(0,len(c[5]),50)][:30])
