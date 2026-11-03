#!/usr/bin/env python3
"""SLO-constrained re-run of tco_model.py (stdlib only). 2026-11-03.

tco_model.py used 900 tok/s @100 concurrency = ~9 tok/s per request, which fails every
agent SLO found in 02-agent-slo-standards.md (AA-AgentPerf Tier1: per-request P25 >= 20 tok/s).
Here decode_tps is the aggregate output at the concurrency where each request still meets the SLO.

SLO-compliant aggregate for 8x PRO6000 Kimi K2.5/K2.6 is NOT measured anywhere [EST]. Bounds
from 01-benchmark-claims.md: single stream 65-101 tok/s; 32K ctx x64 conc -> 8-12 tok/s/req
(538-742 agg); 0K x128 -> 10-17/req. Agent traces average ~27K input. So at >=20 tok/s/req a
plausible range is ~12-32 concurrent -> ~250-650 tok/s aggregate. Varied below.
Workload: input/output 30 and 100 (02 report: 100-131 measured), cache hit 0.90/0.95.
"""
import tco_model as m

base = dict(m.CONFIGS["i) 8x PRO6000 (1 srv)"])
api_ref = m.API_REFERENCE
api_cheap = "DS V4-Pro official offpk"
print("8x PRO6000 single server, Kimi K2.5. Max system capex (USD) to match API, 3y, util grid")
print(f"{'agg tok/s @SLO':>14} {'in/out':>6} {'hit':>5} | "
      + " ".join(f"{'K25 u'+str(int(u*100)):>10}" for u in (0.3,0.5,0.7))
      + " | " + " ".join(f"{'V4off u'+str(int(u*100)):>10}" for u in (0.5,0.7)))
for tps in (250, 400, 650, 900):
    for ipo, hit in ((30, 0.90), (100, 0.95)):
        c = dict(base, decode_tps=tps)
        # simple closed form mirroring tco_model.selfhost_cost_per_1m
        def maxcap2(u, price):
            secs = 1e6 / c["decode_tps"] + 1e6 * ipo * (1 - hit) / c["prefill_tps"]
            units = m.YEARS * m.SEC_PER_YEAR * u / secs
            elec = c["kw_it"] * m.PUE * 8760 * m.ELEC_KRW_PER_KWH / m.FX_KRW_PER_USD * m.YEARS
            # cost = capex*(1+maint*Y) + elec ; must equal price*units
            return (price * units - elec) / (1 + m.MAINT_PCT_CAPEX_PER_YEAR * m.YEARS)
        pk = m.api_cost_per_1m_out(api_ref, ipo=ipo, hit=hit)
        pv = m.api_cost_per_1m_out(api_cheap, ipo=ipo, hit=hit)
        row = [maxcap2(u, pk) for u in (0.3,0.5,0.7)] + [maxcap2(u, pv) for u in (0.5,0.7)]
        print(f"{tps:>14} {ipo:>6} {hit:>5.2f} | " + " ".join(f"{x/1e3:>9.0f}k" for x in row[:3])
              + " | " + " ".join(f"{x/1e3:>9.0f}k" for x in row[3:]))
print(f"\nAPI $/1M out (ref K2.5 / V4-Pro offpeak): ipo30 hit.90 -> "
      f"{m.api_cost_per_1m_out(api_ref,30,0.9):.2f} / {m.api_cost_per_1m_out(api_cheap,30,0.9):.2f}; "
      f"ipo100 hit.95 -> {m.api_cost_per_1m_out(api_ref,100,0.95):.2f} / {m.api_cost_per_1m_out(api_cheap,100,0.95):.2f}")
print("Compare: placeholder system capex = 8 x GPU + ~$45k base/net (e.g. $151k at $13.25k/GPU, $229k at $23k/GPU)")
