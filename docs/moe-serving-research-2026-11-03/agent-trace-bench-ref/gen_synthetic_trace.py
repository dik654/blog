#!/usr/bin/env python3
"""AA-AgentPerf 공개 방법론의 분포를 흉내 낸 합성 트레이스. 실제 트레이스가 없을 때만 쓴다.

근거(evidence/2026-11-03-moe-serving/02-agent-slo-standards.md §2.3):
  - 요청 입력 ~5K~131K, 평균 ~27K / 출력 중앙 ~150, P95 ~2K / 툴 지연 0.1~5s, 중앙 ~1s / 최대 200턴
  - 턴당 컨텍스트 증가 평균 ~2.2K (vLLM×Mooncake)
분포 모양(로그정규)은 위 요약값에 맞춘 추정이다. 원 트레이스가 아니므로 결과 해석 시 표기할 것.
"""
import argparse
import json
import math
import random


def lognorm(rng, median, p95):
    sigma = math.log(p95 / median) / 1.645
    return rng.lognormvariate(math.log(median), sigma)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--sessions", type=int, default=200)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--max-context", type=int, default=131072)
    a = ap.parse_args()
    rng = random.Random(a.seed)
    with open(a.out, "w") as f:
        for i in range(a.sessions):
            ctx = int(min(12000, max(5000, rng.gauss(8000, 2000))))  # 시스템 프롬프트+작업 설명
            turns = [{"append_tokens": ctx, "output_tokens": int(min(16000, lognorm(rng, 150, 2000))), "gap_s": 0.0}]
            ctx += turns[0]["output_tokens"]
            for _ in range(rng.randint(10, 200) - 1):
                app = int(min(30000, lognorm(rng, 1200, 8000)))
                out = int(min(16000, max(1, lognorm(rng, 150, 2000))))
                if ctx + app + out > a.max_context:
                    break
                turns.append({"append_tokens": app, "output_tokens": out,
                              "gap_s": round(min(5.0, max(0.05, lognorm(rng, 1.0, 4.0))), 3)})
                ctx += app + out
            f.write(json.dumps({"session_id": f"syn-{i}", "source": "synthetic-aa-like", "turns": turns}) + "\n")


if __name__ == "__main__":
    main()
