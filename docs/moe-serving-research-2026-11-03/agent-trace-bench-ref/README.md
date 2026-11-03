# agent-trace-bench

이 도구는 구매 전 임대 실측에 쓴다. 답하려는 질문은 하나다. **"에이전트 SLO를 지키면서 이 서버가 동시에 돌릴 수 있는 에이전트는 몇 개이고, 그때 총 출력 tok/s는 얼마인가?"**

이 값을 [`evidence/2026-11-03-moe-serving/slo_scenarios.py`](../../evidence/2026-11-03-moe-serving/slo_scenarios.py)의 손익분기 표에 넣으면 구매 여부가 정해진다. 배경은 [`00-SYNTHESIS.md`](../../evidence/2026-11-03-moe-serving/00-SYNTHESIS.md)에 있다.

## 구성

stdlib만 쓴다.

| 파일 | 역할 |
|---|---|
| `trace_from_claude_code.py` | Claude Code 세션 기록에서 **토큰 수 모양만** 추출한다. 추출 항목은 호출별 컨텍스트, 출력, 새로 붙은 입력, 호출 간 대기다. 내용은 출력하지 않는다 |
| `gen_synthetic_trace.py` | AA-AgentPerf 공개 분포를 흉내 낸 합성 트레이스를 만든다. 실제 트레이스가 없을 때만 쓴다 |
| `agent_bench.py` | 닫힌 루프 리플레이를 돌린다. 세션 컨텍스트가 실제로 누적되므로 prefix cache와 KV 한계가 결과에 드러난다. 동시성을 지수적으로 올린 뒤 이분 탐색으로 SLO 충족 최대 동시 에이전트 수를 찾는다 |
| `mock_vllm.py` | 벤치 자체를 시험하는 가짜 서버다. 성능 의미는 없다 |

`traces/`와 `results/`는 git에 넣지 않는다. 트레이스는 개인 사용 기록에서 나온 숫자다. 결과는 실측이 끝나면 요약만 `evidence/`로 옮긴다.

## 측정 정의

AA-AgentPerf를 따른다.

- **동시성**: 살아 있는 에이전트 세션 수. 세션은 응답, 툴 지연, 다음 요청을 반복한다.
- **요청별 출력 속도**: `(output_tokens-1)/(마지막 토큰 시각 - 첫 토큰 시각)`. SLO는 이 값의 **P25**를 본다.
- **TTFT**: 요청을 보낸 시각부터 첫 content 또는 reasoning 토큰까지. SLO는 **P95**를 본다.
- **집계 구간**: warmup 이후 시작해 측정창 안에서 끝난 요청만 센다. 표본이 `--min-completed`에 못 미치면 측정창을 최대 `--max-extend`배까지 늘린다.
- **prefix cache 차단**: 동시성 단계마다 세션 접두에 고유 salt를 넣어, 앞 단계의 캐시를 재사용하지 못하게 한다.
- **판정**: 오류 0건, P25 ≥ `--slo-speed`, P95 TTFT ≤ `--slo-ttft`를 모두 만족해야 통과다.

## 한계

결과를 적을 때 아래 사항을 함께 표기한다.

- **툴 결과 텍스트는 무의미한 단어열이다.** EAGLE3·MTP 같은 투기적 디코딩의 수용률이 실제보다 낮게 나올 수 있다.
- **`ignore_eos`로 출력 길이를 트레이스에 강제한다.** 끄려면 `--no-ignore-eos`를 쓴다.
- **세션이 `--max-context`를 넘으면 그 시점에 끊는다.** 우리 Claude Code 기록은 컨텍스트 중앙값이 약 205K라서 131K 상한에서 상당 부분이 잘린다. 아래 "우리 트레이스 특성"을 보라.

## 검증 이력

- **2026-11-03 mock**: 단일 80 tok/s, knee 6인 가짜 서버로 탐색 논리를 확인했다. 20 tok/s 기준에서 이론 상한(활성 요청 19개)과 같은 **19**를 찾았다.
  - 이 과정에서 버그 두 개를 고쳤다.
  - (1) 표본 부족을 SLO 실패로 오판했다. 지금은 표본이 모자라면 측정창을 연장한다.
  - (2) 총 처리량을 완료된 요청만으로 세서 고동시성일수록 과소 집계됐다. 지금은 창 안에서 생성된 토큰으로 센다.
- **2026-11-03 실서버**: vLLM 0.27.1, qwen38-27b, RTX 4090 48GB에서 동시 1·2로 스모크 시험을 했다. 결과는 `results/smoke-qwen38-27b/`에 있다. 확인한 것은 다음과 같다.
  - `/tokenize` 보정 정상 동작.
  - `ignore_eos`·`min_tokens`로 출력 길이 정확히 강제(60/60, 78/78).
  - 턴마다 프롬프트가 누적됨(1571 → 1808 …).
  - 서버 `prefix_cache_hits/queries` 집계 정상(0.65).
  - `usage.prompt_tokens_details.cached_tokens`는 서버에 `--enable-prompt-tokens-details`가 없어 null이다. 서버 메트릭 값으로 대신한다.

## 사용

```bash
# 1. 트레이스
python3 trace_from_claude_code.py --out traces/claude-code.jsonl
python3 gen_synthetic_trace.py --out traces/synthetic-aa-like.jsonl

# 2. 벤치 자체 시험 (로컬)
python3 mock_vllm.py --port 18080 &
python3 agent_bench.py --base-url http://127.0.0.1:18080 --model mock \
  --trace traces/synthetic-aa-like.jsonl --out results/mock-selftest \
  --search --warmup 10 --measure 30 --output-scale 0.3 --min-completed 20

# 3. 임대 서버 실측 (예: 8×RTX PRO 6000, Kimi K2.5 INT4)
python3 agent_bench.py --base-url http://<pod>:8000 --model kimi-k25 \
  --trace traces/claude-code.jsonl --out results/pro6000x8-k25-tp8-tier1 \
  --search --slo-speed 20 --slo-ttft 10 --warmup 120 --measure 600 --max-context 131072
```

## 임대 실측 계획 (8×RTX PRO 6000)

서버 실행 인자는 [`k8s-drafts/10-lws-kimi-k25-1node-tp8.yaml`](../../evidence/2026-11-03-moe-serving/k8s-drafts/10-lws-kimi-k25-1node-tp8.yaml)과 같게 한다.

```
vllm serve moonshotai/Kimi-K2.5 --served-model-name kimi-k25 --trust-remote-code \
  --tensor-parallel-size 8 --language-model-only --max-model-len 131072 \
  --gpu-memory-utilization 0.92 --enable-prefix-caching \
  --decode-context-parallel-size 8 --kv-cache-dtype fp8   # MLA KV 복제 방지(아래 '우리 트레이스 특성')
```

SM120에서 FP8 KV와 DCP를 함께 쓴 커뮤니티 실측은 PR #34597·#34795를 체리픽한 커스텀 이미지였다(01 보고서). #34597은 병합됐고 #34795는 병합되지 않고 stale로 닫혔다(2026-07-05). 다만 #34795가 없애려던 assert는 v0.33.0 코드에 없다. 그래서 v0.33.0 이상의 업스트림 이미지에서는 체리픽 없이 동작할 수 있지만 아직 확인되지 않았다. 실측 첫 단계에서 FP8 KV + DCP8 기동부터 확인할 것.

먼저 확인할 것이 세 가지다.

- GPU가 **Server Edition인지 Max-Q인지**: `nvidia-smi -q`로 본다.
- PCIe 토폴로지: `nvidia-smi topo -m`.
- vLLM 버전.

세 결과는 모두 결과 디렉터리에 저장한다.

| 순서 | 실험 | 비교 대상 |
|---|---|---|
| 1 | 기준선 TP8, 우리 트레이스, Tier 1(20 tok/s / 10 s) | — |
| 2 | 같은 조건, 권장 기본(30 tok/s / 10 s)과 프리미엄(60 tok/s / 5 s) | 같은 서버에서 SLO만 바꿈 |
| 3 | P2P 끔 (`NCCL_P2P_DISABLE=1`) | 1과 비교 |
| 4 | EAGLE3 (`--speculative-config`) | 1과 비교. 합성 텍스트 한계를 표기할 것 |
| 5 | TP4×PP2 | 1과 비교 |
| 6 | 합성 AA 분포 트레이스 | 공개 수치(H200×8 Tier 1 = 11 에이전트)와 비교하는 기준점 |

예산은 RunPod 기준 시간당 약 $20(조사일 2026-11-03)이다. 모델 다운로드(595 GB)와 적재에 1~2시간이 걸린다. 실험 1회는 탐색 단계 6~9개에 각 12분이라 1.5~2시간이다. 전체로 하루 안팎이 든다.

## 우리 트레이스 특성 (2026-11-03 추출)

추출 대상은 `~/.claude/projects` 438개 파일, 887 세션, 18,353 호출이다.

| 지표 | 값 | AA-AgentPerf 공개 분포 |
|---|---|---|
| 호출당 컨텍스트 | 중앙 205K, 평균 292K, P95 831K | 평균 ~27K, 5K~131K |
| 출력 | 중앙 124, P95 2,991 | 중앙 ~150, P95 ~2K |
| 새로 붙은 입력 | 중앙 1,149, P95 28,808 | 턴당 평균 ~2.2K |
| 호출 간 대기 | 중앙 0.69 s, P95 31.6 s | 중앙 ~1 s |
| 입력:출력 | 448:1 | 100~131:1 (Codex·Manus) |

이 기록은 컨텍스트 1M인 프런티어 모델을 쓰며 쌓였다. 1T MoE로 바꾸면 같은 작업도 컨텍스트 상한(Kimi K2.5는 256K) 안에서 돌아야 한다.

이 모양은 **KV 용량이 동시 에이전트 수를 정한다**는 신호다.

MLA 모델은 TP로 KV가 쪼개지지 않고 8장에 복제된다. 그래서 용량은 구성에 따라 크게 달라진다(rtx6kpro 실측, 00-SYNTHESIS §6-1).

| 구성 | KV 용량 | 200K 컨텍스트 에이전트 상주 수 |
|---|---|---|
| BF16 KV, DCP1 | 약 19만 토큰 | 약 1개 |
| FP8 KV, DCP8 | 약 362만 토큰 | 약 18개 |

임대 실측의 기준 구성은 **`--decode-context-parallel-size 8 --kv-cache-dtype fp8`**로 한다. DCP1과의 비교는 별도 실험으로 둔다.
