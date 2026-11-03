#!/usr/bin/env python3
"""~1T MoE self-host vs API — first-pass TCO / break-even model (stdlib only).

Run:  python3 tco_model.py
All hardware prices are INPUT PARAMETERS. GPU/server prices move daily (2026-11), so the
primary outputs are THRESHOLDS: the maximum system / per-GPU capex at which self-hosting
matches the API baseline, for a given throughput, utilization, power and life.

Labels:  [SRC]  = taken from a source cited in 03-hardware-economics.md (with date)
         [SNAP] = dated price snapshot, only a placeholder default — overwrite it
         [EST]  = analyst estimate / assumption — vary it
"""

# ----------------------------------------------------------------------------------
# 1. GLOBAL INPUTS
# ----------------------------------------------------------------------------------
YEARS = 3                       # [EST] depreciation life
FX_KRW_PER_USD = 1400.0         # [EST] not sourced; plug in the day's rate
ELEC_KRW_PER_KWH = 200.0        # [EST] 산업용(을) 2024-10 avg 182.7 [SRC] + 연료비조정 5 [SRC] + 기후환경·기금 ≈ 12 [EST]
PUE = 1.4                       # [EST] small air-cooled DC; use 1.2-1.6
FACILITY_KRW_PER_KW_MONTH = 0   # [EST] own facility = 0 (space/cooling capex sunk). Colo case: ~200k-400k KRW/kW-mo
MAINT_PCT_CAPEX_PER_YEAR = 0.05 # [EST] spares, RMA logistics, support contracts (staff excluded)
STAFF_USD_PER_YEAR = 0          # [EST] add an SRE share if you want it charged to this cluster

# Agent workload shape (per 1M OUTPUT tokens).  Agent loops are input-heavy.
INPUT_PER_OUTPUT = 30.0         # [EST] input tokens per output token (agent loops: 10-100)
CACHE_HIT = 0.90                # [EST] fraction of input tokens served from prefix cache

# ----------------------------------------------------------------------------------
# 2. API BASELINES  (USD per 1M tokens: input-miss, cached-input, output)
#    OpenRouter /api/v1/models/<id>/endpoints fetched 2026-11-02 16:47 UTC [SRC]
#    DeepSeek official api-docs.deepseek.com/quick_start/pricing fetched 2026-11-03 [SRC]
# ----------------------------------------------------------------------------------
APIS = {
    "K2.5 OR AtlasCloud int4":   (0.49, 0.20, 2.50),
    "K2.5 OR SiliconFlow int4":  (0.50, 0.15, 2.50),
    "K2.5 OR Novita":            (0.57, 0.095, 2.85),
    "K2.5 OR Bedrock":           (0.60, 0.60, 3.00),   # cache_read not listed -> treated as full input price
    "K2.6 Moonshot (via OR)":    (0.95, 0.16, 4.00),
    "DSV3.2 OR DeepInfra fp4":   (0.26, 0.13, 0.38),
    "DSR1-0528 OR DeepInfra":    (0.50, 0.35, 2.15),
    "DS V4-Pro official peak":   (1.32, 0.044, 3.96),
    "DS V4-Pro official offpk":  (0.66, 0.022, 1.98),
}
API_REFERENCE = "K2.5 OR SiliconFlow int4"   # baseline used for break-even

# ----------------------------------------------------------------------------------
# 3. CONFIGURATIONS (hardware prices are placeholders: [SNAP]/[EST])
#    decode_tps  = aggregate OUTPUT tok/s of the whole config at serving concurrency
#    prefill_tps = aggregate UNCACHED prompt tok/s (prefill) of the whole config
#    kw_it       = average IT power at load (kW), all servers + share of network
# ----------------------------------------------------------------------------------
CONFIGS = {
    "i) 8x PRO6000 (1 srv)": dict(
        n_gpu=8, gpu_usd=13250,          # [SNAP] NVIDIA price per Tom's HW 2026-06; eBay low-avg Oct-2026 $22,945 (gpupoet)
        base_usd=40000,                  # [EST] 2S Xeon6/EPYC, 1TB RAM, NVMe, PCIe-switch chassis, 1x 400G NIC
        net_usd=5000,                    # [EST] port share + optics
        decode_tps=900,                  # [community-reported, user input] Kimi K2.5 @100 concurrency
        prefill_tps=8000,                # [EST] uncached prefill; vary 3k-15k
        kw_it=8*0.6*0.85 + 1.2,          # [EST] 600W TBP [SRC Lenovo LP2263] x85% + 1.2kW host
    ),
    "ii) 16x PRO6000 (2 srv, 2 replicas)": dict(
        n_gpu=16, gpu_usd=13250, base_usd=80000, net_usd=15000,
        decode_tps=1800, prefill_tps=16000,   # [EST] = 2 independent TP8 replicas, no cross-node traffic
        kw_it=2*(8*0.6*0.85 + 1.2) + 0.3,
    ),
    "iii-a) 32x 4090-48G (4 srv, 2 repl)": dict(
        n_gpu=32, gpu_usd=4000,          # [SNAP] modded 48GB: eBay sold $4,500 (2026-06), CN $2.9-3.4k
        base_usd=4*15000,                # [EST] 4U 8-GPU Gen4 chassis w/ 2S EPYC, 512GB
        net_usd=4*4000 + 8000,           # [EST] 100G NIC/server + small switch (PP across nodes)
        decode_tps=2*900*0.6,            # [EST] replica = 16 cards (TP8xPP2) ~0.6x of a PRO6000 replica; vary 0.3-0.9
        prefill_tps=2*8000*0.5,          # [EST] no FP4, no official P2P, PCIe Gen4
        kw_it=4*(8*0.45*0.85 + 1.0) + 0.3,  # [EST] 450W TGP
    ),
    "iii-b) 48x 4090-48G (6 srv, 3 repl)": dict(
        n_gpu=48, gpu_usd=4000, base_usd=6*15000, net_usd=6*4000 + 12000,
        decode_tps=3*900*0.6, prefill_tps=3*8000*0.5,
        kw_it=6*(8*0.45*0.85 + 1.0) + 0.4,
    ),
    "iv) 1x HGX 8xH200": dict(
        n_gpu=8, gpu_usd=0,              # priced as a whole system below
        base_usd=340000,                 # [SNAP] AMCompute new HGX H200 node, Oct-2026 (secondary source)
        net_usd=10000,
        decode_tps=3500,                 # [EST] ~3-5x PRO6000 node at higher concurrency (NVLink, 4.8TB/s HBM); vary 2000-6000
        prefill_tps=40000,               # [EST]
        kw_it=10.2*0.8,                  # [EST] DGX H200 10.2kW max x 80%
    ),
}

UTIL_GRID = [0.10, 0.20, 0.30, 0.50, 0.70, 0.90]
SEC_PER_YEAR = 365 * 24 * 3600

# ----------------------------------------------------------------------------------
# 4. MODEL
# ----------------------------------------------------------------------------------
def api_cost_per_1m_out(api, ipo=INPUT_PER_OUTPUT, hit=CACHE_HIT):
    pin, pcache, pout = APIS[api]
    return pout + ipo * (hit * pcache + (1 - hit) * pin)


def seconds_per_1m_out(c, ipo=INPUT_PER_OUTPUT, hit=CACHE_HIT):
    """Serialized (conservative) time to emit 1M output tokens plus their uncached prefill.
    Cached-prefix tokens are treated as ~free (prefix-cache hit)."""
    return 1e6 / c["decode_tps"] + 1e6 * ipo * (1 - hit) / c["prefill_tps"]


def capex(c):
    return c["n_gpu"] * c["gpu_usd"] + c["base_usd"] + c["net_usd"]


def opex_per_year(c, cap=None):
    cap = capex(c) if cap is None else cap
    kw_fac = c["kw_it"] * PUE
    elec = kw_fac * 8760 * ELEC_KRW_PER_KWH / FX_KRW_PER_USD
    fac = c["kw_it"] * FACILITY_KRW_PER_KW_MONTH * 12 / FX_KRW_PER_USD
    return elec + fac + MAINT_PCT_CAPEX_PER_YEAR * cap + STAFF_USD_PER_YEAR


def units_per_life(c, util, **kw):
    """number of '1M output tokens (with their input)' units served over the life."""
    return util * SEC_PER_YEAR * YEARS / seconds_per_1m_out(c, **kw)


def selfhost_cost_per_1m(c, util, cap=None, **kw):
    cap = capex(c) if cap is None else cap
    total = cap + YEARS * opex_per_year(c, cap)
    return total / units_per_life(c, util, **kw)


def max_capex_breakeven(c, util, api_price):
    """Solve cap + Y*(E + m*cap) = api_price * units  ->  cap = (api*units - Y*E)/(1+Y*m)."""
    units = units_per_life(c, util)
    e_fixed = opex_per_year(c, 0.0)  # opex excluding maintenance
    return (api_price * units - YEARS * e_fixed) / (1 + YEARS * MAINT_PCT_CAPEX_PER_YEAR)


def breakeven_util(c, api_price):
    lo, hi = 1e-4, 1.0
    if selfhost_cost_per_1m(c, 1.0) > api_price:
        return None
    for _ in range(60):
        mid = (lo + hi) / 2
        if selfhost_cost_per_1m(c, mid) > api_price:
            lo = mid
        else:
            hi = mid
    return hi


# ----------------------------------------------------------------------------------
# 5. REPORT
# ----------------------------------------------------------------------------------
def line(ch="-", n=118):
    print(ch * n)


def main():
    global ELEC_KRW_PER_KWH, PUE
    api_ref = api_cost_per_1m_out(API_REFERENCE)
    print(f"Workload: {INPUT_PER_OUTPUT:.0f} input tok per output tok, cache hit {CACHE_HIT:.0%}; "
          f"life {YEARS}y; elec {ELEC_KRW_PER_KWH:.0f} KRW/kWh; PUE {PUE}; FX {FX_KRW_PER_USD:.0f}")
    line("=")
    print("A. API baseline — USD per 1M OUTPUT tokens incl. the input that rides with them")
    print(f"{'API':28s} {'in':>6s} {'cache':>6s} {'out':>6s} | " +
          " ".join(f"r{r:>3d}/h{int(h*100):>2d}" for r, h in [(10, .8), (30, .9), (30, .7), (100, .95)]))
    for k in APIS:
        pin, pc, po = APIS[k]
        vals = [api_cost_per_1m_out(k, r, h) for r, h in [(10, .8), (30, .9), (30, .7), (100, .95)]]
        print(f"{k:28s} {pin:6.3f} {pc:6.3f} {po:6.2f} | " + " ".join(f"{v:9.2f}" for v in vals))
    print(f"-> reference baseline '{API_REFERENCE}' at current workload = ${api_ref:.2f} per 1M output")
    line("=")

    print("B. Configurations (capex uses PLACEHOLDER prices — overwrite)")
    print(f"{'config':38s} {'GPUs':>4s} {'capex$':>9s} {'kW IT':>6s} {'kW fac':>6s} {'opex$/y':>8s} "
          f"{'s/1Mout':>8s} {'eff.out tok/s':>13s}")
    for k, c in CONFIGS.items():
        s = seconds_per_1m_out(c)
        print(f"{k:38s} {c['n_gpu']:4d} {capex(c):9,.0f} {c['kw_it']:6.2f} {c['kw_it']*PUE:6.2f} "
              f"{opex_per_year(c):8,.0f} {s:8.0f} {1e6/s:13.0f}")
    line("=")

    print("C. Self-host cost per 1M output tokens (USD) vs utilization  | API ref = "
          f"${api_ref:.2f}")
    print(f"{'config':38s} " + " ".join(f"{u:>7.0%}" for u in UTIL_GRID) + f" {'BE util':>8s}")
    for k, c in CONFIGS.items():
        be = breakeven_util(c, api_ref)
        print(f"{k:38s} " + " ".join(f"{selfhost_cost_per_1m(c, u):7.2f}" for u in UTIL_GRID)
              + f" {('>100%' if be is None else f'{be:.0%}'):>8s}")
    line("=")

    print("D. INVERTED: maximum total system capex (USD) at which self-host == API ref "
          "(negative = cannot win even with free hardware)")
    print(f"{'config':38s} " + " ".join(f"{u:>10.0%}" for u in UTIL_GRID))
    for k, c in CONFIGS.items():
        print(f"{k:38s} " + " ".join(f"{max_capex_breakeven(c, u, api_ref):10,.0f}" for u in UTIL_GRID))
    print()
    print("   ...same, expressed as MAX PRICE PER GPU after subtracting base+network placeholders")
    for k, c in CONFIGS.items():
        if c["gpu_usd"] == 0:
            continue
        row = [(max_capex_breakeven(c, u, api_ref) - c["base_usd"] - c["net_usd"]) / c["n_gpu"]
               for u in UTIL_GRID]
        print(f"{k:38s} " + " ".join(f"{v:10,.0f}" for v in row))
    line("=")

    print("E. Sensitivity (config i, 8x PRO6000): max system capex at 50% util vs decode tok/s x workload")
    c0 = dict(CONFIGS["i) 8x PRO6000 (1 srv)"])
    shapes = [(10, .8), (30, .9), (30, .7), (100, .95)]
    print(f"{'decode tok/s':>12s} " + " ".join(f"{f'r{r}/h{int(h*100)}':>12s}" for r, h in shapes))
    for d in [400, 600, 900, 1500, 2500]:
        row = []
        for r, h in shapes:
            c = dict(c0, decode_tps=d)
            api = api_cost_per_1m_out(API_REFERENCE, r, h)
            units = 0.5 * SEC_PER_YEAR * YEARS / seconds_per_1m_out(c, r, h)
            e = opex_per_year(c, 0.0)
            row.append((api * units - YEARS * e) / (1 + YEARS * MAINT_PCT_CAPEX_PER_YEAR))
        print(f"{d:12d} " + " ".join(f"{v:12,.0f}" for v in row))
    line("=")

    print("F. Sensitivity (config i): cost per 1M output (USD) at 50% util vs electricity & PUE")
    print(f"{'KRW/kWh':>8s} " + " ".join(f"PUE{p:>4}" for p in [1.2, 1.4, 1.6]))
    e0, p0 = ELEC_KRW_PER_KWH, PUE
    for e in [150, 200, 250]:
        row = []
        for p in [1.2, 1.4, 1.6]:
            ELEC_KRW_PER_KWH, PUE = e, p
            row.append(selfhost_cost_per_1m(CONFIGS["i) 8x PRO6000 (1 srv)"], 0.5))
        print(f"{e:8d} " + " ".join(f"{v:7.2f}" for v in row))
    ELEC_KRW_PER_KWH, PUE = e0, p0
    line("=")

    print("G. GPU count needed per model replica (weights + KV headroom)")
    models = {  # weight GB: [EST] from param count x bits; user-stated K2.5 range 600-700GB
        "Kimi K2.5 INT4 (~1T)": 600,
        "DeepSeek V3/R1 FP8 (671B)": 690,
        "DeepSeek V3/R1 4-bit (671B)": 380,
    }
    gpus = {"PRO6000 96GB": 96, "4090 48GB(mod)": 48, "4090 24GB": 24, "H200 141GB": 141, "B200 180GB": 180}
    KV_FRAC = 0.15  # [EST] VRAM share reserved for KV/activations (MLA KV is compact); vary 0.1-0.3
    print(f"   (smallest power-of-2 GPU count with weights <= {1-KV_FRAC:.0%} of total VRAM; "
          "parentheses = total VRAM, KV headroom GB)")
    print(f"{'model':30s} " + " ".join(f"{g:>17s}" for g in gpus))
    for m, w in models.items():
        row = []
        for g, vram in gpus.items():
            n = 1
            while n * vram * (1 - KV_FRAC) < w:
                n *= 2  # TP/PP friendly powers of 2
            row.append(f"{n:>3d} ({n*vram:>4.0f}/{n*vram-w:>4.0f})")
        print(f"{m:30s} " + " ".join(f"{x:>17s}" for x in row))
    print("   -> plug-in rule: 1 PRO6000 replica (8 cards) ~ 16x 4090-48G ~ 32x 4090-24G (VRAM parity);"
          " compute/comm parity is NOT implied.")


if __name__ == "__main__":
    main()
