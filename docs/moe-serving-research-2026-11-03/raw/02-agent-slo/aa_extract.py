import re,json,sys
for f in sys.argv[1:]:
    u=open(f,errors='ignore').read().replace('\\"','"')
    seen=set(); print('=====',f)
    for m in re.finditer(r'\{"id":"[0-9a-f-]{36}","label":"([^"]*)","hostApiId":"[^"]*","footnotes":[^,]*,"host":\{"name":"([^"]*)"',u):
        seg=u[m.start():m.start()+6000]; nx=seg.find("{\"id\":\"",10); seg=seg[:nx] if nx>0 else seg
        def g(k):
            mm=re.search('"'+k+r'":([0-9.eE-]+|null)',seg); return mm.group(1) if mm else None
        key=(m.group(1),m.group(2))
        if key in seen: continue
        seen.add(key)
        def r(x,n=1):
            try: return round(float(x),n)
            except: return x
        print(f"{m.group(2)} [{m.group(1)}] | in ${g('price1mInputTokens')} out ${g('price1mOutputTokens')} cache ${g('cacheHitPrice')} | tok/s med {r(g('medianOutputTokensPerSecond'))} p25 {r(g('quartile25OutputTokensPerSecond'))} p5 {r(g('percentile05OutputTokensPerSecond'))} | TTFT med {r(g('medianTimeToFirstTokenSeconds'),2)} p95 {r(g('percentile95TimeToFirstTokenSeconds'),2)} | TTFAnswer med {r(g('medianTimeToFirstAnswerTokenSeconds'),1)}")
