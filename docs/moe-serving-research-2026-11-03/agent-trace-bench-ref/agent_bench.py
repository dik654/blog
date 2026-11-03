#!/usr/bin/env python3
"""에이전트 트레이스 리플레이 벤치마크 (stdlib only).

질문 하나에 답한다: "요청별 출력 속도 P25 >= S tok/s, TTFT P95 <= T s 를 지키면서
이 서버가 동시에 돌릴 수 있는 에이전트는 몇 개이고, 그때 총 출력 tok/s는 얼마인가?"

측정 정의는 AA-AgentPerf를 따른다(evidence/.../02-agent-slo-standards.md §2.4).
  - 동시성 = 살아 있는 에이전트 세션 수(닫힌 루프: 응답 -> 툴 지연 -> 다음 요청)
  - 요청별 출력 속도 = (output_tokens - 1) / (마지막 토큰 시각 - 첫 토큰 시각)
  - TTFT = 첫 토큰(content 또는 reasoning) 시각 - 요청 시각
  - 정상상태 구간: warmup 이후 시작해 측정창 안에서 끝난 요청만 집계
  - 단계(동시성 레벨)마다 세션 접두에 고유 salt를 넣어 단계 간 prefix cache 재사용을 막는다

세션 컨텍스트는 실제로 누적된다: 매 턴 [이전 대화 + 모델의 실제 응답 + append_tokens 크기의 툴 결과].
따라서 서버의 prefix cache·KV 용량 한계가 결과에 그대로 드러난다.

한계(결과 표기 시 같이 적을 것):
  - 툴 결과 텍스트는 의미 없는 단어열이다. 투기적 디코딩(EAGLE3·MTP) 수용률은 실제 내용보다 낮게 나올 수 있다.
  - ignore_eos로 출력 길이를 트레이스에 강제한다(모델이 일찍 끝내지 못함).

사용 예:
  python3 agent_bench.py --base-url http://HOST:8000 --model kimi-k25 \
     --trace traces/claude-code.jsonl --search --slo-speed 20 --slo-ttft 10 --out results/run1
  python3 agent_bench.py ... --concurrency 4,8,16 --warmup 60 --measure 300
"""
import argparse
import http.client
import json
import math
import os
import random
import re
import sys
import threading
import time
import urllib.parse

WORDS = ("time year people way day man thing woman life child world school state family student group "
         "country problem hand part place case week company system program question work government number "
         "night point home water room mother area money story fact month lot right study book eye job word "
         "business issue side kind head house service friend father power hour game line end member law car "
         "city community name president team minute idea kid body information back parent face others level "
         "office door health person art war history party result change morning reason research girl guy "
         "moment air teacher force education foot boy age policy process music market sense nation plan "
         "college interest death experience effect use class control care field development role effort rate "
         "heart drug show leader light voice wife police mind price report decision son view relationship town "
         "road arm difference value building action model season society tax director position player record "
         "paper space ground form event official matter center couple site project activity star table need "
         "court oil situation cost industry figure street image phone data picture practice piece land product "
         "doctor wall patient worker news test movie north love support technology step baby computer type "
         "attention film tree source organization hair window evidence population site file function error "
         "server request client buffer stack queue cache token layer kernel thread module branch commit").split()


# ---------------------------------------------------------------- HTTP
class Client:
    def __init__(self, base_url, api_key=None, timeout=900):
        u = urllib.parse.urlparse(base_url.rstrip("/"))
        self.https = u.scheme == "https"
        self.host = u.hostname
        self.port = u.port or (443 if self.https else 80)
        self.prefix = u.path
        self.timeout = timeout
        self.headers = {"Content-Type": "application/json"}
        if api_key:
            self.headers["Authorization"] = f"Bearer {api_key}"

    def conn(self):
        cls = http.client.HTTPSConnection if self.https else http.client.HTTPConnection
        return cls(self.host, self.port, timeout=self.timeout)

    def get(self, path):
        c = self.conn()
        try:
            c.request("GET", self.prefix + path, headers=self.headers)
            r = c.getresponse()
            return r.status, r.read().decode("utf-8", "replace")
        finally:
            c.close()

    def post_json(self, path, body):
        c = self.conn()
        try:
            c.request("POST", self.prefix + path, body=json.dumps(body), headers=self.headers)
            r = c.getresponse()
            return r.status, r.read().decode("utf-8", "replace")
        finally:
            c.close()

    def stream_chat(self, body):
        """returns dict(t_send, t_first, t_last, text, out_tokens, prompt_tokens, cached_tokens, status, err)"""
        rec = dict(t_send=time.time(), t_first=None, t_last=None, text="", out_tokens=None,
                   prompt_tokens=None, cached_tokens=None, status=None, err=None, chunks=0)
        c = self.conn()
        parts = []
        try:
            c.request("POST", self.prefix + "/v1/chat/completions", body=json.dumps(body), headers=self.headers)
            r = c.getresponse()
            rec["status"] = r.status
            if r.status != 200:
                rec["err"] = r.read()[:300].decode("utf-8", "replace")
                return rec
            while True:
                line = r.readline()
                if not line:
                    break
                line = line.strip()
                if not line.startswith(b"data:"):
                    continue
                data = line[5:].strip()
                if data == b"[DONE]":
                    break
                try:
                    d = json.loads(data)
                except json.JSONDecodeError:
                    continue
                now = time.time()
                for ch in d.get("choices") or []:
                    delta = ch.get("delta") or {}
                    piece = (delta.get("content") or "") + (delta.get("reasoning_content") or "") \
                        + (delta.get("reasoning") or "")
                    if piece:
                        if rec["t_first"] is None:
                            rec["t_first"] = now
                        rec["t_last"] = now
                        rec["chunks"] += 1
                        if delta.get("content"):
                            parts.append(delta["content"])
                        elif not parts:
                            pass
                u = d.get("usage")
                if u:
                    rec["out_tokens"] = u.get("completion_tokens")
                    rec["prompt_tokens"] = u.get("prompt_tokens")
                    det = u.get("prompt_tokens_details") or {}
                    rec["cached_tokens"] = det.get("cached_tokens")
        except Exception as e:  # noqa: BLE001 - 벤치마크는 실패를 기록하고 계속 간다
            rec["err"] = f"{type(e).__name__}: {e}"
        finally:
            c.close()
        rec["text"] = "".join(parts)
        if rec["out_tokens"] is None:
            rec["out_tokens"] = rec["chunks"]
        return rec


# ---------------------------------------------------------------- text sizing
class Sizer:
    """단어 수 <-> 토큰 수 비율을 서버 토크나이저로 보정한다."""

    def __init__(self, client, model):
        self.ratio = 1.0  # tokens per word
        sample = " ".join(random.Random(1).choice(WORDS) for _ in range(2000))
        st, body = client.post_json("/tokenize", {"model": model, "prompt": sample})
        if st == 200:
            try:
                n = json.loads(body).get("count") or len(json.loads(body).get("tokens", []))
                if n:
                    self.ratio = n / 2000
                    self.how = "/tokenize"
                    return
            except (json.JSONDecodeError, AttributeError):
                pass
        rec = client.stream_chat({"model": model, "messages": [{"role": "user", "content": sample}],
                                  "max_tokens": 1, "stream": True,
                                  "stream_options": {"include_usage": True}})
        if rec.get("prompt_tokens"):
            self.ratio = max(0.5, (rec["prompt_tokens"] - 10) / 2000)
            self.how = "usage.prompt_tokens"
        else:
            self.how = "default 1.0"

    def text(self, rng, tokens):
        n = max(1, int(round(tokens / self.ratio)))
        return " ".join(rng.choice(WORDS) for _ in range(n))


# ---------------------------------------------------------------- metrics
def scrape(client):
    try:
        st, body = client.get("/metrics")
    except Exception:  # noqa: BLE001
        return {}
    if st != 200:
        return {}
    agg = {}
    for line in body.splitlines():
        if not line or line.startswith("#"):
            continue
        m = re.match(r"^([a-zA-Z_:][a-zA-Z0-9_:]*)(\{[^}]*\})?\s+([-0-9.eE+naNinf]+)", line)
        if not m:
            continue
        try:
            v = float(m.group(3))
        except ValueError:
            continue
        agg[m.group(1)] = agg.get(m.group(1), 0.0) + v
    return agg


def metric_delta(before, after, needle):
    keys = [k for k in after if needle in k and not k.endswith("_created")]
    return sum(after[k] - before.get(k, 0.0) for k in keys) if keys else None


def metric_last(after, needle):
    keys = [k for k in after if needle in k]
    return max((after[k] for k in keys), default=None)


# ---------------------------------------------------------------- run one level
def pct(xs, p):
    if not xs:
        return None
    xs = sorted(xs)
    k = (len(xs) - 1) * p / 100
    f, c = math.floor(k), math.ceil(k)
    return xs[f] if f == c else xs[f] + (xs[c] - xs[f]) * (k - f)


def run_level(a, client, sizer, sessions, conc, salt):
    stop = threading.Event()
    lock = threading.Lock()
    records = []
    t0 = time.time()
    warm_end = t0 + a.warmup
    meas_end = warm_end + a.measure

    def worker(wi):
        rng = random.Random(f"{salt}-{wi}")
        si = wi * 7919
        while not stop.is_set():
            s = sessions[si % len(sessions)]
            si += 1
            tag = f"[{salt}:{wi}:{si}]"
            msgs = []
            ctx = 0
            for ti, turn in enumerate(s["turns"]):
                if stop.is_set():
                    return
                if ti > 0 and turn["gap_s"] > 0:
                    if stop.wait(turn["gap_s"] * a.gap_scale):
                        return
                app = turn["append_tokens"]
                out = max(1, int(turn["output_tokens"] * a.output_scale))
                if ctx + app + out > a.max_context:
                    break
                if ti == 0:
                    msgs.append({"role": "system", "content": tag + " " + sizer.text(rng, app * 0.2)})
                    msgs.append({"role": "user", "content": sizer.text(rng, app * 0.8)})
                else:
                    msgs.append({"role": "user", "content": "tool result: " + sizer.text(rng, app)})
                body = {"model": a.model, "messages": msgs, "max_tokens": out, "stream": True,
                        "stream_options": {"include_usage": True}, "temperature": a.temperature}
                if a.ignore_eos:
                    body["ignore_eos"] = True
                    body["min_tokens"] = out
                rec = client.stream_chat(body)
                rec.update(conc=conc, worker=wi, turn=ti, want_out=out, ctx_before=ctx)
                with lock:
                    records.append(rec)
                if rec["err"] or rec["status"] != 200:
                    if stop.wait(1.0):
                        return
                    break
                msgs.append({"role": "assistant", "content": rec["text"] or sizer.text(rng, rec["out_tokens"] or out)})
                ctx = (rec["prompt_tokens"] or ctx + app) + (rec["out_tokens"] or out)

    before = None
    threads = [threading.Thread(target=worker, args=(i,), daemon=True) for i in range(conc)]
    for i, th in enumerate(threads):
        th.start()
        time.sleep(min(0.5, a.warmup / max(1, conc) / 4))  # 동시 시작으로 인한 prefill 폭주 완화
    while time.time() < warm_end:
        time.sleep(0.5)
    before = scrape(client)
    hard_end = warm_end + a.measure * a.max_extend

    def done_in_window():
        with lock:
            return sum(1 for r in records if r["t_send"] >= warm_end and r["t_last"] and r["status"] == 200
                       and not r["err"])

    # 표본이 min_completed에 못 미치면 측정창을 늘린다(최대 measure*max_extend). 표본 부족을 SLO 실패로 오판하지 않기 위함.
    while time.time() < meas_end or (done_in_window() < a.min_completed and time.time() < hard_end):
        time.sleep(0.5)
    meas_end = time.time()
    after = scrape(client)
    stop.set()
    deadline = time.time() + a.drain_timeout
    for th in threads:
        th.join(timeout=max(0.0, deadline - time.time()))

    win = [r for r in records if r["t_send"] >= warm_end and r["t_last"] and r["t_last"] <= meas_end
           and r["status"] == 200 and not r["err"]]
    errs = [r for r in records if r["t_send"] >= warm_end and r["t_send"] <= meas_end
            and (r["err"] or r["status"] != 200)]
    speeds, ttfts = [], []
    for r in win:
        ttfts.append(r["t_first"] - r["t_send"])
        dur = r["t_last"] - r["t_first"]
        if r["out_tokens"] and r["out_tokens"] > 1 and dur > 0:
            speeds.append((r["out_tokens"] - 1) / dur)
    # 총 처리량은 측정창 안에서 실제 생성된 토큰으로 센다(창 경계를 걸친 긴 요청은 겹친 비율만큼).
    # 완료 요청만 세면 출력이 긴 고동시성 단계가 과소 집계된다(mock 자체시험에서 확인).
    out_tok = 0.0
    for r in records:
        if r["t_first"] and r["t_last"] and r["out_tokens"] and r["status"] == 200:
            lo, hi = max(r["t_first"], warm_end), min(r["t_last"], meas_end)
            if hi > lo:
                span = max(1e-6, r["t_last"] - r["t_first"])
                out_tok += r["out_tokens"] * (hi - lo) / span
    in_tok = sum(r["prompt_tokens"] or 0 for r in records if r["t_first"] and warm_end <= r["t_first"] <= meas_end)
    cached = [r["cached_tokens"] for r in win if r["cached_tokens"] is not None]
    hits = metric_delta(before or {}, after, "prefix_cache_hits")
    queries = metric_delta(before or {}, after, "prefix_cache_queries")
    res = dict(
        concurrency=conc, completed=len(win), errors=len(errs),
        err_sample=(errs[0]["err"] if errs else None),
        p25_speed=pct(speeds, 25), p50_speed=pct(speeds, 50),
        p50_ttft=pct(ttfts, 50), p95_ttft=pct(ttfts, 95),
        window_s=meas_end - warm_end,
        agg_out_tps=out_tok / (meas_end - warm_end), agg_in_tps=in_tok / (meas_end - warm_end),
        in_out_ratio=(in_tok / out_tok if out_tok else None),
        usage_cached_frac=(sum(cached) / in_tok if cached and in_tok else None),
        server_prefix_hit=(hits / queries if hits is not None and queries else None),
        kv_usage_last=metric_last(after, "kv_cache_usage_perc") or metric_last(after, "gpu_cache_usage_perc"),
        preemptions=metric_delta(before or {}, after, "num_preemptions"),
    )
    res["low_sample"] = res["completed"] < a.min_completed
    res["slo_pass"] = bool(res["errors"] == 0
                           and res["p25_speed"] is not None and res["p25_speed"] >= a.slo_speed
                           and res["p95_ttft"] is not None and res["p95_ttft"] <= a.slo_ttft)
    return res, records


def fmt(v, nd=1):
    return "-" if v is None else (f"{v:.{nd}f}" if isinstance(v, float) else str(v))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base-url", required=True)
    ap.add_argument("--model", required=True)
    ap.add_argument("--api-key", default=os.environ.get("OPENAI_API_KEY"))
    ap.add_argument("--trace", required=True)
    ap.add_argument("--out", required=True, help="결과 디렉터리")
    ap.add_argument("--concurrency", default="", help="쉼표 목록, 예: 4,8,16")
    ap.add_argument("--search", action="store_true", help="지수 증가 후 이분 탐색(AA 방식)")
    ap.add_argument("--max-concurrency", type=int, default=256)
    ap.add_argument("--slo-speed", type=float, default=20.0, help="요청별 출력 속도 P25 하한 tok/s")
    ap.add_argument("--slo-ttft", type=float, default=10.0, help="TTFT P95 상한 s")
    ap.add_argument("--warmup", type=float, default=60.0)
    ap.add_argument("--measure", type=float, default=300.0)
    ap.add_argument("--min-completed", type=int, default=30, help="측정창 안 완료 요청 최소 표본")
    ap.add_argument("--max-extend", type=float, default=4.0, help="표본 부족 시 측정창 최대 배율")
    ap.add_argument("--max-context", type=int, default=131072)
    ap.add_argument("--gap-scale", type=float, default=1.0, help="툴/대기 지연 배율")
    ap.add_argument("--output-scale", type=float, default=1.0)
    ap.add_argument("--temperature", type=float, default=0.7)
    ap.add_argument("--no-ignore-eos", dest="ignore_eos", action="store_false")
    ap.add_argument("--drain-timeout", type=float, default=30.0)
    ap.add_argument("--max-turn-gap", type=float, default=30.0, help="트레이스 gap_s 상한(사람 대기 제거)")
    a = ap.parse_args()

    sessions = []
    with open(a.trace) as f:
        for line in f:
            s = json.loads(line)
            for t in s["turns"]:
                t["gap_s"] = min(t.get("gap_s", 0.0), a.max_turn_gap)
            if s["turns"]:
                sessions.append(s)
    random.Random(0).shuffle(sessions)
    client = Client(a.base_url, a.api_key)
    sizer = Sizer(client, a.model)
    os.makedirs(a.out, exist_ok=True)
    meta = dict(base_url=a.base_url, model=a.model, trace=os.path.abspath(a.trace), sessions=len(sessions),
                slo_speed=a.slo_speed, slo_ttft=a.slo_ttft, warmup=a.warmup, measure=a.measure,
                tokens_per_word=sizer.ratio, sizing=sizer.how, ignore_eos=a.ignore_eos,
                started=time.strftime("%Y-%m-%dT%H:%M:%S%z"))
    print(json.dumps(meta, ensure_ascii=False), file=sys.stderr)
    results = {}

    def level(c):
        if c in results:
            return results[c]["slo_pass"]
        salt = f"L{c}-{int(time.time())}"
        res, recs = run_level(a, client, sizer, sessions, c, salt)
        results[c] = res
        with open(os.path.join(a.out, f"requests-c{c}.jsonl"), "w") as f:
            for r in recs:
                r = {k: v for k, v in r.items() if k != "text"}
                f.write(json.dumps(r) + "\n")
        print(f"c={c:>4} pass={res['slo_pass']!s:5} P25 {fmt(res['p25_speed'])} tok/s  "
              f"P95 TTFT {fmt(res['p95_ttft'],2)} s  agg_out {fmt(res['agg_out_tps'])} tok/s  "
              f"done {res['completed']} err {res['errors']}  hit {fmt(res['server_prefix_hit'],3)}",
              file=sys.stderr)
        return res["slo_pass"]

    if a.concurrency:
        for c in [int(x) for x in a.concurrency.split(",") if x]:
            level(c)
    if a.search:
        lo, hi, c = 0, None, 1
        while c <= a.max_concurrency:
            if level(c):
                lo, c = c, c * 2
            else:
                hi = c
                break
        if hi is None:
            hi = a.max_concurrency + 1
        while hi - lo > 1 and lo > 0:
            mid = (lo + hi) // 2
            if level(mid):
                lo = mid
            else:
                hi = mid
        meta["max_slo_concurrency"] = lo
        meta["agg_out_tps_at_max"] = results[lo]["agg_out_tps"] if lo in results else None

    rows = [results[k] for k in sorted(results)]
    with open(os.path.join(a.out, "summary.json"), "w") as f:
        json.dump(dict(meta=meta, levels=rows), f, indent=2, ensure_ascii=False)
    lines = [f"# agent_bench {meta['model']} @ {meta['base_url']}", "",
             f"- trace: `{meta['trace']}` ({meta['sessions']} sessions), sizing {meta['sizing']} "
             f"({meta['tokens_per_word']:.3f} tok/word), ignore_eos={meta['ignore_eos']}",
             f"- SLO: 요청별 출력 P25 ≥ {a.slo_speed} tok/s, TTFT P95 ≤ {a.slo_ttft} s; "
             f"warmup {a.warmup}s, measure {a.measure}s", ""]
    if "max_slo_concurrency" in meta:
        lines += [f"**SLO 충족 최대 동시 에이전트: {meta['max_slo_concurrency']}**, 그때 총 출력 "
                  f"{fmt(meta['agg_out_tps_at_max'])} tok/s", ""]
    lines += ["| 동시 | SLO | P25 tok/s | P50 tok/s | TTFT P50 | TTFT P95 | 총 출력 tok/s | 총 입력 tok/s | 입력:출력 | "
              "prefix hit(서버) | cached(usage) | KV 사용 | 선점 | 완료 | 오류 | 측정창 s |",
              "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"]
    for r in rows:
        lines.append(f"| {r['concurrency']} | {'✓' if r['slo_pass'] else '✗'} | {fmt(r['p25_speed'])} | "
                     f"{fmt(r['p50_speed'])} | {fmt(r['p50_ttft'],2)} | {fmt(r['p95_ttft'],2)} | "
                     f"{fmt(r['agg_out_tps'])} | {fmt(r['agg_in_tps'],0)} | {fmt(r['in_out_ratio'])} | "
                     f"{fmt(r['server_prefix_hit'],3)} | {fmt(r['usage_cached_frac'],3)} | "
                     f"{fmt(r['kv_usage_last'],2)} | {fmt(r['preemptions'],0)} | {r['completed']}{'*' if r['low_sample'] else ''} | {r['errors']} | {fmt(r['window_s'],0)} |")
    lines += ["", "`*` 표본이 --min-completed 미만(측정창을 최대로 늘려도 부족). 해당 행은 신뢰도가 낮다.",
              "SLO 판정은 오류 0건 + P25/P95 기준만 본다."]
    with open(os.path.join(a.out, "summary.md"), "w") as f:
        f.write("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
