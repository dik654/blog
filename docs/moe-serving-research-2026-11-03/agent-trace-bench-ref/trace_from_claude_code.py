#!/usr/bin/env python3
"""Claude Code 세션 기록(~/.claude/projects/**/*.jsonl)에서 '토큰 수 모양'만 뽑아 리플레이 트레이스를 만든다.

내용(프롬프트·코드·툴 결과 텍스트)은 읽어도 출력하지 않는다. 출력 트레이스에는 숫자만 남는다.

한 LLM 호출(assistant message id 하나)마다:
  context_tokens = input_tokens + cache_creation_input_tokens + cache_read_input_tokens
  output_tokens
  gap_s          = 직전 호출이 끝난 뒤 이 호출이 시작될 때까지(툴 실행 + 사람 대기)

리플레이용 turn 값:
  append_tokens  = context_t - context_{t-1} - output_{t-1}   (직전 출력 다음에 새로 붙은 입력: 툴 결과 등)
  음수면 컨텍스트 압축/초기화로 보고 새 세션을 시작한다.

출력 JSONL 한 줄 = 세션 하나:
  {"session_id": "...", "source": "claude-code", "turns": [
      {"append_tokens": int, "output_tokens": int, "gap_s": float}, ...]}
  첫 turn의 append_tokens는 초기 컨텍스트(시스템 프롬프트 포함) 전체다.

사용:
  python3 trace_from_claude_code.py --root ~/.claude/projects --out traces/claude-code.jsonl \
      [--max-gap-s 120] [--min-turns 3]
"""
import argparse
import glob
import json
import os
import sys
from datetime import datetime


def ts(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")).timestamp()


def calls_from_file(path):
    """file -> {chain_key: [call,...]} ; call = dict(start, end, ctx, out)."""
    chains = {}
    last_user_ts = {}
    seen = {}
    with open(path, errors="replace") as f:
        for line in f:
            try:
                d = json.loads(line)
            except json.JSONDecodeError:
                continue
            key = (d.get("isSidechain", False), d.get("agentId") or "")
            t = d.get("timestamp")
            if not t:
                continue
            if d.get("type") == "user":
                last_user_ts[key] = ts(t)
                continue
            if d.get("type") != "assistant":
                continue
            m = d.get("message") or {}
            u = m.get("usage") or {}
            mid = m.get("id")
            if not mid or "output_tokens" not in u:
                continue
            ctx = (u.get("input_tokens") or 0) + (u.get("cache_creation_input_tokens") or 0) \
                + (u.get("cache_read_input_tokens") or 0)
            if mid in seen:  # 같은 message의 후속 블록: 종료 시각만 갱신
                seen[mid]["end"] = ts(t)
                continue
            start = last_user_ts.get(key, ts(t))
            call = dict(start=start, end=ts(t), ctx=ctx, out=u.get("output_tokens") or 0)
            seen[mid] = call
            chains.setdefault(key, []).append(call)
    return chains


def to_sessions(chains, path, max_gap, min_turns):
    out = []
    base = os.path.basename(path).split(".")[0][:8]
    for ci, (key, calls) in enumerate(chains.items()):
        cur, prev, idx = [], None, 0
        def flush():
            nonlocal cur, idx
            if len(cur) >= min_turns:
                out.append({"session_id": f"{base}-{ci}-{idx}", "source": "claude-code", "turns": cur})
            idx += 1
            cur = []
        for c in calls:
            if prev is None:
                cur.append({"append_tokens": c["ctx"], "output_tokens": c["out"], "gap_s": 0.0})
            else:
                app = c["ctx"] - prev["ctx"] - prev["out"]
                gap = max(0.0, c["start"] - prev["end"])
                if app < 0 or gap > max_gap:
                    flush()
                    cur.append({"append_tokens": c["ctx"], "output_tokens": c["out"], "gap_s": 0.0})
                else:
                    cur.append({"append_tokens": app, "output_tokens": c["out"], "gap_s": round(gap, 3)})
            prev = c
        flush()
    return out


def pct(xs, p):
    if not xs:
        return 0
    xs = sorted(xs)
    return xs[min(len(xs) - 1, int(p / 100 * len(xs)))]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=os.path.expanduser("~/.claude/projects"))
    ap.add_argument("--out", required=True)
    ap.add_argument("--max-gap-s", type=float, default=120.0,
                    help="이보다 긴 대기(사람 부재)는 세션을 끊는다")
    ap.add_argument("--min-turns", type=int, default=3)
    a = ap.parse_args()
    files = glob.glob(os.path.join(a.root, "**", "*.jsonl"), recursive=True)
    sessions = []
    for p in files:
        try:
            sessions += to_sessions(calls_from_file(p), p, a.max_gap_s, a.min_turns)
        except OSError:
            continue
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    with open(a.out, "w") as f:
        for s in sessions:
            f.write(json.dumps(s) + "\n")
    turns = [t for s in sessions for t in s["turns"]]
    ctx, run = [], 0
    for s in sessions:
        run = 0
        for t in s["turns"]:
            run += t["append_tokens"]
            ctx.append(run)
            run += t["output_tokens"]
    outs = [t["output_tokens"] for t in turns]
    apps = [t["append_tokens"] for t in turns[1:]] if turns else []
    gaps = [t["gap_s"] for t in turns if t["gap_s"] > 0]
    tot_in, tot_out = sum(ctx), sum(outs)
    print(f"files={len(files)} sessions={len(sessions)} calls={len(turns)}", file=sys.stderr)
    print(f"context tokens  p50={pct(ctx,50)} mean={tot_in//max(1,len(ctx))} p95={pct(ctx,95)} max={max(ctx or [0])}", file=sys.stderr)
    print(f"output tokens   p50={pct(outs,50)} p95={pct(outs,95)}", file=sys.stderr)
    print(f"append tokens   p50={pct(apps,50)} p95={pct(apps,95)}", file=sys.stderr)
    print(f"gap s           p50={pct(gaps,50)} p95={pct(gaps,95)}", file=sys.stderr)
    print(f"input:output    {tot_in/max(1,tot_out):.1f}:1   turns/session p50={pct([len(s['turns']) for s in sessions],50)}", file=sys.stderr)


if __name__ == "__main__":
    main()
