# 02. 에이전트 추론 서비스 수준(SLO) 표준 — 원문 검증 보고서

- 작성일: 2026-11-03
- 목적: ~1T급 MoE(Kimi K2.5 / DeepSeek V3·R1·V4 계열) 자체 서빙 클러스터의 SLO 목표치를 정하기 위해, ChatGPT가 제시한 "업계 표준" 주장들을 **원문 페이지를 직접 열어** 대조했다.
- 방법: WebFetch 요약에만 기대지 않고, 핵심 페이지는 `curl`로 원본 HTML을 받아 텍스트·임베디드 JSON을 직접 grep했다. 원본 텍스트 사본은 `raw/02-agent-slo/`에 있다. WebFetch 요약과 원문이 다를 때는 원문을 따랐다.

## 0. 요약표

| # | 주장 (ChatGPT) | 판정 | 원문 근거 (핵심 수치) |
|---|---|---|---|
| 1a | MLPerf DeepSeek-R1 Server: TTFT p99 ≤ 2s, TPOT ≈ 80ms | **VERIFIED** | v5.1(2025-09-09) 도입. "99th percentile TTFT threshold to two seconds", "99th percentile TPOT threshold to 80 ms". 규칙 원문: `Server: TTFT/TPOT: 2000 ms/80 ms` |
| 1b | MLPerf DeepSeek-R1 Interactive: TTFT p99 ≤ 1.5s, TPOT 15ms | **VERIFIED** (버전 = **v6.0**) | MLCommons v6.0 글: "99th percentile TTFT <= 1.5s; TPOT <= 15ms". 투기적 디코딩(공식 MTP head, EAGLE, num-steps=3) 의무 |
| 1c | RTX PRO 6000 등 PCIe GPU의 DeepSeek-R1 MLPerf 결과 | **NOT FOUND** | v5.1·v6.0·v6.1 closed 전 결과에 RTX PRO 6000 DeepSeek-R1 제출 없음. 같은 GPU로는 gpt-oss-120b Server 8장 14,258.9~14,817.4 tok/s(장당 ~1.8K) 등만 있음 |
| 2a | AA-AgentPerf 2026년 6월 공개 + NVIDIA 기술 블로그 | **VERIFIED** | 둘 다 2026-06-12 |
| 2b | 티어: T1 p25≥20 & TTFT p95≤10s / T2 ≥60 & ≤5s / T3 ≥180 & ≤3s | **VERIFIED** (AA 원문 기준), 단 **NVIDIA 블로그는 30/100/300으로 다르게 표기 (내부 모순)** | AA 기사 표와 임베디드 결과 데이터(`sloSpeedMin` 20, 60)는 20/60/180. NVIDIA 블로그 Table 1은 30/100/300인데 같은 글 Figure 4 캡션은 "20 and 60 tokens per second" |
| 2c | 대상 모델 DeepSeek V4 Pro | **VERIFIED** | "DeepSeek V4 Pro (Reasoning, Max Effort)". 이후 방법론 페이지에는 V4 Pro 0813, V4.1 Flash, Kimi K3, GLM-5.2/5.3도 나옴 |
| 2d | 하드웨어별 결과 | **VERIFIED (원본 데이터 추출)** | Tier1: GB300 NVL72 1,840 agents/32 GPU(57.5/GPU), B300×8 144(18/GPU), MI355X×8 17(2.125/GPU), H200×8 11(1.375/GPU). Tier2: 768/40 GPU(19.2), 36(4.5), 1(0.125), 7(0.875). Tier3 결과는 런칭 데이터에 없음 |
| 3a | vLLM "AgentX" 블로그 2026년 9월 | **VERIFIED** (2026-09-08). 단 AgentX는 **SemiAnalysis의 벤치마크**이고 vLLM 글은 그 결과 보고 | "vLLM x AgentX: Optimizing for Real-World Agentic Serving" |
| 3b | 중앙값 입력 142K, 출력 444, prefix-cache 적중률 > 96% | **VERIFIED** | "Median input 142K tokens, median output 444 tokens." "Prefix-cache hit rate above 96%." (AgentX 방법론: 142,016 / 444) |
| 3c | p90 interactivity: V4 Pro 58.3, MiniMax M3 74.2, Kimi K3 62.7; 기준 p90 ≥ 50 | **VERIFIED** | "maintains P90 interactivity above 50 tokens per second per user, a common and demanding latency SLO" |
| 3d | 하드웨어·동시성 | **VERIFIED** | V4 Pro: 12 GB300 / 동시 256 / 83K TPGS. M3: 2 B300 / 24 / 70K. K3: 16 GB300 / 48 / 11.8K |
| 4 | 시장 기준선 (API 제공사 속도·TTFT·가격) | **VERIFIED (AA 원 데이터 2026-11-03 시점 추출)** | 아래 §4 표. OpenRouter 공개 API는 가격만 주고 latency/throughput 필드가 `null` → 속도 통계 **NOT FOUND** |
| 5 | 에이전트 워크로드 형태 | **VERIFIED (다수 1차 출처)** | 입력:출력 = 131:1(Codex), ~100:1(Manus), 53.9~559.8(학술); 캐시 적중 94.2%~99%; LLM 추론이 실행시간의 71~98%; 툴 지연 중앙값 ~1s(AA) / 턴 간 지연 중앙값 5.2s(Codex) |

### 권고 SLO (요약, 근거는 §6)

비용 최적화형 에이전트 플랫폼 **기본 티어**:
- **요청 단위 출력 속도 P25 ≥ 30 tok/s** (참고 하한: AA-AgentPerf Tier 1 = P25 ≥ 20 tok/s)
- **TTFT P95 ≤ 10 s** (AA-AgentPerf Tier 1과 동일; 캐시 적중 턴은 내부 목표 P95 ≤ 3~5 s)
- 프리미엄 티어: **P25 ≥ 60 tok/s, TTFT P95 ≤ 5 s** (AA-AgentPerf Tier 2, 그리고 vLLM/AgentX의 "P90 ≥ 50 tok/s"와 같은 수준)
- MLPerf Server(TPOT 80 ms = 12.5 tok/s)는 에이전트 SLO로 쓰기엔 너무 느슨하다. 시장 최저가 공급자보다 낮다. MLPerf Interactive(15 ms = 66.7 tok/s)는 프리미엄 티어 수준이다.

---

## 1. MLPerf Inference — DeepSeek-R1 및 다른 LLM 지연 제약

### 1.1 출처
- MLCommons, "DeepSeek Reasoning for MLPerf Inference v5.1", 2025-09-09 — https://mlcommons.org/2025/09/deepseek-inference-5-1/
- MLCommons, v6.0 GPT-OSS / DeepSeek-R1 interactive 글 — https://mlcommons.org/2026/03/mlperf-inference-gpt-oss/
- MLPerf 규칙 원문(master, 마지막 커밋 2026-08-20) — https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc (사본: `raw/02-agent-slo/mlperf-inference_rules.adoc`)
- 결과 요약 JSON: https://github.com/mlcommons/inference_results_v5.1 , `_v6.0`(마지막 커밋 2026-04-03), `_v6.1`(마지막 커밋 2026-09-29)

### 1.2 DeepSeek-R1
- **Server (v5.1 도입)**: v5.1 글 원문 "we set the 99th percentile TTFT threshold to two seconds" / "the 99th percentile TPOT threshold to 80 ms". → **VERIFIED**. 80 ms TPOT를 tok/s로 바꾸면 12.5 tok/s다. 이 환산은 원문에 없고 내가 계산했다.
- 데이터셋 (v5.1 글): 평균 입력 800 토큰, 평균 출력 3,880 토큰, 최대 출력 20K. 짧은 입력에 긴 추론 출력이 붙는 형태라 에이전트 워크로드(입력 수만~십수만, 출력 수백)와는 **정반대**다.
- **Interactive (v6.0 도입)**: v6.0 글 원문 "New Interactive Scenario (Poisson arrival): 99th percentile TTFT <= 1.5s; TPOT <= 15ms." 기존 Server는 "99th percentile TTFT <= 2s, TPOT <= 80ms". → **VERIFIED**, 버전은 **v6.0**. 15 ms는 66.7 tok/s다.
  - 투기적 디코딩 규정: "Implementations must use the official DeepSeek-R1 MTP (Multi-Token Prediction) Head with EAGLE-style decoding", `speculative-num-steps=3, speculative-eagle-topk=1.0`, "Implementations cannot artificially manipulate acceptance rates."
- 규칙 원문 표(`inference_rules.adoc` 270행): `DeepSeek-r1 | ... | Server: TTFT/TPOT: 2000 ms/80 ms. Interactive: TTFT/TPOT: 1500 ms/15 ms.` 각주: "time per output token (TPOT) which measures the average interval between all the tokens generated."

### 1.3 비교: 다른 LLM 제약 (규칙 원문 master 기준)
| 모델 | Server(Conversational) TTFT / TPOT | Interactive TTFT / TPOT |
|---|---|---|
| Llama3.1-405B | 6000 ms / 175 ms | 4500 ms / 80 ms |
| Llama2-70B | 2000 ms / 200 ms | 450 ms / 40 ms |
| Llama3.1-8B | 2000 ms / 100 ms | 500 ms / 30 ms |
| Mixtral-8x7B | 2000 ms / 200 ms | — |
| GPT-OSS-120B | 3000 ms / 80 ms | 2000 ms / **20 ms** (규칙 원문) |
| DeepSeek-R1 | 2000 ms / 80 ms | 1500 ms / 15 ms |

- 불일치 하나: MLCommons v6.0 블로그는 GPT-OSS Interactive를 "TPOT <= 15ms"라고 썼지만, 현재 규칙 원문(master)은 `2000 ms/20 ms`다. 개정됐을 수도 있다. DeepSeek-R1 수치에는 이런 불일치가 없다.
- 규칙 원문에는 **Qwen3.6-27B "Edge-Agentic" (Agentic Function Calling, BFCL v4)** 워크로드도 새로 생겼다. 다만 single-stream/정확도 위주라 데이터센터 에이전트 SLO와는 성격이 다르다.

### 1.4 하드웨어별 DeepSeek-R1 결과 (closed division, 요약 JSON에서 직접 추출)
장당 수치는 시스템명에 적힌 GPU 수로 내가 나눈 값이다.

| 버전 | 시스템 | 시나리오 | 시스템 tok/s | 장당 ≈ |
|---|---|---|---|---|
| v5.1 | NVIDIA DGX B200 (8×B200) | Server | 18,592.2 | 2,324 |
| v6.0 | NVIDIA DGX B300 (8×B300) | Server | 42,721.4 | 5,340 |
| v6.1 | NVIDIA DGX B300 (8×B300) | Server | 59,867.8 | 7,483 |
| v6.1 | Cisco C880A M8 (8×B300) | Server | 66,171.6 | 8,271 |
| v6.1 | Nebius B200 n1 (8×B200) | Server | 55,869.0 | 6,984 |
| v6.1 | NVIDIA GB300 NVL72 (72) | Server | 596,944 | 8,291 |
| v6.1 | NVIDIA GB300 NVL72 (72) | **Interactive** | 253,506 | 3,521 |
| v6.0 | NVIDIA GB200 NVL72 (72) | Interactive | 240,318 | 3,338 |
| v6.1 | NVIDIA Vera Rubin NVL72 (72, preview) | Interactive | 652,750 | 9,066 |
| v5.1 (open) | HPE Cray XD670 (8×H200) | Offline only | 8,904.83 | ~1,113 |

- 같은 GB300 NVL72에서 Server(80 ms)에서 Interactive(15 ms)로 가면 장당 처리량이 약 8.3K에서 3.5K로 **약 2.4배 줄어든다**. 속도 SLO를 조이는 만큼 처리량을 내준다는 점을 보여주는 공식 데이터다.
- **RTX PRO 6000 / PCIe GPU의 DeepSeek-R1 결과: NOT FOUND** (v5.1, v6.0, v6.1 모두 확인). DeepSeek-R1 제출은 B200/B300/GB200/GB300/VR/MI355X(v6.1 Crusoe)뿐이다.
- 참고용 PCIe 결과 (RTX PRO 6000 Blackwell Server Edition 96GB, closed):
  - gpt-oss-120b Server (TTFT 3 s / TPOT 80 ms): v6.1 Nebius 8장 14,784.3, Cisco C845A 8장 14,817.4, HPE DL380a 8장 14,581.7 tok/s → 장당 약 1.8K
  - Llama2-70B-99.9 Server: v6.1 Cisco C845A 8장 29,316.4, MiTAC 8장 29,203.3 → 장당 약 3.66K
  - 따라서 1T급 MoE를 PCIe(NVLink 없음)로 돌린 공식 MLPerf 데이터는 **없다**. RTX PRO 6000 클러스터 용량은 자체 측정해야 한다.

---

## 2. Artificial Analysis AA-AgentPerf

### 2.1 출처
- AA 기사 "First results from AA-AgentPerf: the hardware benchmark for the agent era", 2026-06-12 — https://artificialanalysis.ai/articles/aa-agentperf (사본 `raw/02-agent-slo/aa-agentperf-article.txt`, 임베디드 결과 `aa-agentperf-embedded-results.txt`)
- AA 방법론 — https://artificialanalysis.ai/methodology/agentperf (사본 `aa-agentperf-methodology.txt`)
- NVIDIA 기술 블로그 "NVIDIA Achieves Leading Agentic Coding Performance on First Agentic AI Benchmark", 2026-06-12, Eduardo Alvarez 외 — https://developer.nvidia.com/blog/nvidia-achieves-leading-agentic-coding-performance-on-first-agentic-ai-benchmark/ (사본 `nvidia-agentperf-blog.txt`)

### 2.2 무엇을 재는가
- AA 원문: "it replays real coding-agent trajectories and measures how many concurrent agents a system can serve while meeting production service-level targets. Its lead metric is Agents per Megawatt"
- 타깃(launch): "DeepSeek V4 Pro (Reasoning, Max Effort)". gpt-oss-120b (high)는 "Coming soon".
- 허용 최적화: "KV cache reuse, speculative decoding, and disaggregated prefill/decode". 정확도 검증 포함.
- SLO 출처: "Performance targets are derived from Artificial Analysis serverless API benchmarking data — the tiers of service that actually exist in the market today." 즉 **이 티어 자체가 실제 API 시장 분포에서 나온 값**이다. 그래서 자체 서비스 SLO의 근거로 쓰기에 가장 적합하다.

### 2.3 트레이스 특성 (원문 인용)
- 생성 방식 (방법론): "We generated the trajectories in the OpenCode agentic harness by prompting three top open-source models with reasoning enabled (DeepSeek V3.2, GLM 4.7, and Kimi K2.5) to resolve issues in real public code repositories."
- 턴/길이: "Sessions run up to 200 turns and reach sequence lengths beyond 100K tokens"
- 입력: "Input lengths range from ~5K to ~131K tokens per request, with a mean of roughly 27K"
- 출력: 일러스트 캡션에 "outputs median ~150 tokens, P95 ~2K". 방법론 본문에는 "Output lengths vary widely across turns"라고만 있다.
- 프리픽스 재사용: "Prior turns served from KV cache — only new tokens prefilled". 단계 간에는 "dynamically generated prefixes added at the start of each trajectory in each phase to break prefix caching between phases" (단계 내 재사용은 허용, 단계 간은 차단).
- 툴 지연: "Delays range from under 0.1s up to 5s, with a median of approximately 1 second." (NVIDIA 블로그: "a one-second median delay time")
- 튜닝 세트: "500 unique trajectories (18,997 prompts)". 본 테스트 세트는 비공개.
- 실행: 단계마다 "at least 30 trajectories have completed, every simulated agent has completed at least 3 trajectories, and at least 10 minutes of steady-state measurement time". max_tokens 16K.

### 2.4 메트릭 정의
- TTFT: "Per-request latency from sending the request to receiving the first output token."
- Output Speed: "Per-request output tokens per second, measured after the first token is received."
- 백분위: "P25 output speed and P95 time to first token, computed across all requests in a test phase." (P25를 쓰는 이유: "Because agentic workloads contain many small-OSL requests")
- 정상상태 필터: "all agents have been active for at least 30 seconds"
- 최대 동시성 탐색: "an exponential ramp followed by a binary search"
- 전력: "measured accelerator power under load (GPU die + HBM) rather than rated TDP"

### 2.5 SLO 티어 — 출처 간 불일치 (중요)
**AA 기사 원문 표 (DeepSeek V4 Pro (max))**:
| Tier | 출력 속도 (P25, per agent) | P95 TTFT |
|---|---|---|
| 1 | 20 tokens/s | ≤ 10 s |
| 2 | 60 tokens/s | ≤ 5 s |
| 3 | 180 tokens/s | ≤ 3 s |

(gpt-oss-120b (high), coming soon: 100/≤5s, 250/≤3s, 500/≤2s, 2,000/≤1s)

**NVIDIA 블로그 Table 1**: "SLO #1 30 10 / SLO #2 100 5 / SLO #3 300 3" (P25 tok/s, P95 TTFT s).
- 그런데 같은 NVIDIA 글의 Figure 4 캡션은 "at both 20 and 60 tokens per second service level objectives"라고 쓴다.
- AA 기사의 인터랙티브 위젯에도 "300 tokens/s Speed-optimized / 100 tokens/s Balanced / 30 tokens/s Capacity-optimized"라는 **예시용(illustrative)** 값이 있다. NVIDIA의 30/100/300은 이 위젯 값과 일치한다.
- **실제 게시 결과 데이터**(AA 페이지 임베디드 JSON)의 `sloSpeedMin`은 **20과 60뿐**이다. NVIDIA Table 2의 "SLO=30 configurations"(57.5 agents/GPU, 61.4K/MW)는 실제로는 `sloSpeedMin: 20` 레코드와 일치한다.
- 판정: ChatGPT의 20/60/180 주장은 **AA 원문 기준으로 VERIFIED**. NVIDIA 블로그의 30/100/300은 위젯 예시값을 옮긴 오기로 보인다(내 추정).
- 추가: 현재 방법론 페이지는 티어 대신 "Pareto frontier of total server throughput against per-request output speed"로 결과를 내는 방식으로 바뀌었다.

### 2.6 공개 결과 (런칭 데이터, AA 페이지 임베디드 JSON에서 직접 추출)
| 시스템 | 제출자 | 구성 | Tier (P25 ≥) | 최대 동시 에이전트 | 사용 GPU | agents/GPU | 측정 전력 kW | agents/MW |
|---|---|---|---|---|---|---|---|---|
| GB300 NVL72 | NVIDIA | TRT-LLM 1.3.0rc15, NVFP4, Disagg 6p1d / gen DEP8 / MTP3 | 20 | **1,840** | 32 | **57.5** | 29.99 | 61,354 |
| GB300 NVL72 | NVIDIA | Disagg 6p1d / gen DEP16 / MTP3 | 60 | **768** | 40 | **19.2** | 33.21 | 23,126 |
| B300 ×8 | NVIDIA | TRT-LLM, Disagg 1p1d / TEP4 / MTP3 | 20 | 144 | 8 | 18 | 6.84 | 21,053 |
| B300 ×8 | NVIDIA | 동일 | 60 | 36 | 8 | 4.5 | 5.18 | 6,950 |
| H200 ×8 | AA | SGLang 0.5.11, NVFP4, TP8 / EAGLE | 20 | 11 | 8 | 1.375 | 4.24 | 2,594 |
| H200 ×8 | AA | 동일 | 60 | 7 | 8 | 0.875 | 3.92 | 1,786 |
| MI355X ×8 | AA | SGLang ROCm 7.2, FP4, TP8, no specdec | 20 | 17 | 8 | 2.125 | 4.79 | 3,551 |
| MI355X ×8 | AA | 동일 | 60 | 1 | 8 | 0.125 | 3.13 | 319 |

- NVIDIA Table 2 (원문): "Concurrent agents per MW 61.4K / 2.6K", "Concurrent agents per GPU 57.5 / 1.4" (GB300 NVL72 / H200). 위 데이터와 일치한다.
- Tier 1 기준 GB300/H200 agents/MW 비율은 약 23.7배, Tier 2는 약 12.9배다(내 계산). NVIDIA의 "up to 20x"는 이 범위 안에 있다.
- **Tier 3 (180 tok/s) 결과는 런칭 데이터에 없다.** NVIDIA 블로그의 AI 생성 요약 문단은 "under SLO tier 3 requirements"라고 쓰지만, 본문 Figure 4와 데이터는 20/60만 보여준다.
- AA 단서: H200·MI355X는 AA가 직접 만든 설정이라 "headroom may be greater". 결과는 "snapshot of a fast-moving frontier"라고 밝힌다.
- 용량 계획 시사점: **8-GPU 단일 노드(B300) 기준 Tier 1에서 장당 18 에이전트, Tier 2에서 장당 4.5 에이전트**. 속도 SLO를 20에서 60 tok/s로 올리면 동시 에이전트 수가 4배 줄어든다. 단일 노드 H200은 Tier 1에서 장당 1.4 에이전트에 불과하다.

---

## 3. vLLM × SemiAnalysis AgentX

### 3.1 출처
- vLLM 블로그 "vLLM x AgentX: Optimizing for Real-World Agentic Serving", 2026-09-08, vLLM Team and Inferact — https://vllm.ai/blog/2026-09-08-vllm-agentx (사본 `vllm-agentx-blog.txt`)
- SemiAnalysis AgentX 방법론 — https://inferencex.semianalysis.com/agentx/methodology
- SemiAnalysis "A Brief Overview of Agentic Workloads", 2026-08-19 — https://inferencex.semianalysis.com/blog/brief-overview-of-agentic-workloads

### 3.2 워크로드 특성 (vLLM 원문)
- "Median 43 turns per session."
- "Median input 142K tokens, median output 444 tokens."
- "Prefix-cache hit rate above 96%."
- "44% of sessions contain at least one subagent, with a median of four subagent rollouts among those sessions."
- AgentX 방법론 원문: "The v1.0 release contains 393 sessions built on June 21, 2026." "The median request has 142,016 input tokens and 444 output tokens." 256k 캡 변형은 "68,266 requests. Median input length is 88,768 tokens; median output length is 376 tokens."
- 세션 출처: "uses Claude Code 2.1.139 or newer". 즉 **Claude Code 실사용 트레이스**이고, 토큰 수는 재구성한 것이다("median reconstructed/provider token ratio is 1.004").
- 코퍼스 스냅샷(선별 전) 이미지 alt 텍스트: "8,271 sessions, 3.41 million requests, 613.27 billion tokens, 99% cache-hit rate".
- 리플레이: "preserves recorded ordering, branch overlap, and inter-turn delays". 툴 단위 이벤트는 기록하지 않는다. 프로파일링 1시간. 동시성 = "the number of live agent clients".
- "P90 interactivity"의 정확한 정의는 방법론 페이지에 **없다**. 요청별 디코드 tok/s의 P90으로 추정되지만, 높을수록 좋은 지표의 P90이 "90%가 이 이상"인지 "상위 10%"인지는 명시되지 않았다. AA의 P25(하위 25%가 이 이상)와 바로 비교하면 안 된다.

### 3.3 결과 (vLLM 원문 표)
선택 기준: "the highest-throughput vLLM configuration that maintains P90 interactivity above 50 tokens per second per user, a common and demanding latency SLO."

| 모델 | GPU / 동시성 | TPGS (input+output+cached) | P90 interactivity |
|---|---|---|---|
| DeepSeek V4 Pro 1.6T | 12 GB300s / 256 | 83K | 58.3 tok/s |
| MiniMax M3 428B | 2 B300s / 24 | 70K | 74.2 tok/s |
| Kimi K3 2.8T | 16 GB300s / 48 | 11.8K | 62.7 tok/s |

- "A 12-chip GB300 P/D deployment serves 256 concurrent agent sessions while sustaining 58.3 tokens/s/user at P90." → 장당 약 21 세션 @ P90 > 50 tok/s (내 계산)
- 비용: V4 Pro GPU TCO $27.72/h, Opus 5 환산 $2,926/h (106×). M3 $4.52 vs $384 (85×). K3 $36.96 vs $538 (14.6×).
- 스케줄링 팁: "--long-prefill-token-threshold" 512로 "increases total tokens per GPU-second (TPGS) by up to 93% and improves P90 interactivity by roughly 2.3×" (DeepSeek V4 Pro, B300).
- 같은 블로그 사이드바에 후속 글 두 편이 있다: DeepSeek-V4.1-Flash GB300 NVL72에서 "P90 of 196 tokens/s per user", GLM-5.3 16×H200 PCP/DCP 글.
- TL;DR의 "up to 130K TPGS"와 "376 tok/s"는 SLO 표와 다른 운영점이다(최대값).

---

## 4. 시장 기준선 — API 제공사 실측 (Artificial Analysis, 2026-11-03 추출)

### 4.1 출처·주의
- 각 모델의 `https://artificialanalysis.ai/models/<slug>/providers` 페이지 임베디드 JSON (`performance.medianOutputTokensPerSecond`, `quartile25OutputTokensPerSecond`, `medianTimeToFirstTokenSeconds`, `percentile95TimeToFirstTokenSeconds`, `pricing.*`). 추출 스크립트와 전체 결과: `raw/02-agent-slo/aa_extract.py`, `aa-provider-metrics-2026-11-03.txt`.
- AA 기본 워크로드는 **10,000 입력 토큰**이다. Kimi K2.5 페이지 원문: "This model is deprecated. We only continue performance benchmarking for the default 10k input token workload." Kimi K2.6이 후속으로 나왔다.
- 추론 모델의 TTFT는 첫 토큰 기준이다. 추론을 스트리밍하지 않는 API(Claude/GPT)는 TTFT에 사고 시간이 들어가서 수백 초가 나온다. "TTFAnswer"는 첫 답변 토큰까지의 시간이다.
- 가격: USD / 1M 토큰 (입력 / 출력 / 캐시 적중).
- **OpenRouter**: `https://openrouter.ai/api/v1/models/<id>/endpoints`는 가격만 준다. `latency_last_30m`, `throughput_last_30m`이 전부 `null`이라 **속도 통계는 NOT FOUND**. 가격 필드에도 `discount: 0.5027` 같은 할인 표시가 있어 정가인지 불분명하다.

### 4.2 Kimi K2.5 (Reasoning) — deprecated
| 제공사 | 입력 / 출력 / 캐시 $ | 출력 tok/s 중앙 / P25 | TTFT 중앙 / P95 (s) |
|---|---|---|---|
| Microsoft Azure | 0.60 / 3.00 / – | 243.0 / 197.7 | 2.03 / 5.11 |
| Amazon Bedrock | 0.60 / 3.00 / – | 103.8 / 84.3 | 1.26 / 2.66 |
| Novita | 0.60 / 3.00 / 0.10 | 50.3 / 42.6 | 2.51 / 7.68 |
| SiliconFlow (FP8) | 0.45 / 2.25 / 0.07 | 25.9 / 25.3 | 2.17 / 4.07 |
| DeepInfra | 0.45 / 2.25 / 0.07 | 22.4 / 16.6 | 1.12 / 71.57 |

### 4.3 Kimi K2.6 (현행)
| 제공사 | 입력/출력/캐시 $ | tok/s 중앙 / P25 | TTFT 중앙 / P95 |
|---|---|---|---|
| Nebius | 0.95 / 4 / 0.16 | 272.5 / 255.6 | 1.47 / 1.56 |
| Microsoft Azure | 0.95 / 4 / – | 255.2 / 228.0 | 1.46 / 2.44 |
| CoreWeave | 0.65 / 3.41 / 0.15 | 150.3 / 79.8 | 1.2 / 4.4 |
| Parasail | 0.75 / 3.5 / 0.16 | 91.5 / 72.9 | 1.24 / 1.73 |
| Kimi (1st party) | 0.95 / 4 / 0.16 | 40.7 / 36.8 | 2.83 / 11.59 |
| Novita | 0.8 / 3.4 / 0.16 | 38.4 / 36.9 | 4.71 / 14.67 |
| SiliconFlow (FP8) | 0.77 / 3.4 / 0.14 | 26.0 / 24.6 | 1.54 / 3.02 |
| DeepInfra (FP4) | 0.75 / 3.5 / 0.15 | 22.2 / 19.2 | 1.18 / 11.52 |

### 4.4 DeepSeek R1 0528 / V3.2 (non-reasoning)
| 모델 / 제공사 | 입력/출력/캐시 $ | tok/s 중앙 / P25 | TTFT 중앙 / P95 |
|---|---|---|---|
| R1 0528 / DeepInfra | 0.5 / 2.15 / 0.35 | 25.6 / 21.4 | 1.14 / 1.82 |
| R1 0528 / Novita | 0.7 / 2.5 / 0.35 | 25.0 / 22.1 | 1.6 / 2.14 |
| V3.2 / FriendliAI | 0.5 / 1.5 / 0.25 | 196.5 / 175.7 | 0.83 / 1.0 |
| V3.2 / Microsoft Azure | 0.58 / 1.68 / – | 190.1 / 174.2 | 1.66 / 2.53 |
| V3.2 / Amazon Bedrock | 0.62 / 1.85 / – | 59.8 / 57.6 | 1.51 / 2.45 |
| V3.2 / DigitalOcean | 0.5 / 1.6 / 0.15 | 47.2 / 31.2 | 0.86 / 3.68 |
| V3.2 / DeepInfra | 0.26 / 0.38 / 0.13 | 31.0 / 27.9 | 1.01 / 1.41 |
| V3.2 / SiliconFlow (FP8) | 0.27 / 0.42 / 0.135 | 22.4 / 20.2 | 2.1 / 3.94 |
(R1: Together $3/$7, Hyperbolic $3/$3는 가격만 있고 성능 데이터가 없다. V3.2: DeepSeek 1st party $0.28/$0.42, Fireworks $0.56/$1.68, SambaNova $3/$4.5, GMI도 가격만 있다.)

### 4.5 DeepSeek V4 Pro 0813 (max) — AgentPerf 타깃 모델
| 제공사 | 입력/출력/캐시 $ | tok/s 중앙 / P25 | TTFT 중앙 / P95 |
|---|---|---|---|
| Systalyze | 0.5 / 2 / 0.04 | 306.7 / 290.1 | 1.87 / 3.15 |
| Databricks | 1.32 / 3.96 / 0.132 | 237.3 / 234.9 | 1.59 / 1.92 |
| Nebius | 1.32 / 3.96 / 0.04 | 178.2 / 150.2 | 1.6 / 2.49 |
| Baseten | 1.32 / 3.96 / 0.132 | 143.5 / 131.9 | 1.59 / 3.25 |
| DeepSeek (1st party) | 1.32 / 3.96 / 0.044 | 93.5 / 76.5 | 1.79 / 7.08 |
| DeepInfra | 1.3 / 2.6 / 0.1 | 81.8 / 67.4 | 1.13 / 1.97 |
| Novita | 1.32 / 3.96 / 0.044 | 72.3 / 64.8 | 2.12 / 3.65 |
| GMI | 1.056 / 3.168 / 0.0352 | 70.6 / 66.2 | 3.11 / 4.06 |
| SiliconFlow | 1.32 / 3.96 / 0.044 | 64.6 / 63.0 | 2.06 / 2.89 |
| DigitalOcean | 1.32 / 3.96 / 0.044 | 57.7 / 56.4 | 0.84 / 1.3 |

### 4.6 Kimi K3 (max) — 발췌
Fireworks 113.9 / 111.9 tok/s, TTFT 0.96 / 1.41 s. Nebius 212.0 / 170.9, 1.05 / 11.7. Kimi 1st party 65.9 / 53.1, 6.88 / 20.96. Together 43.2 / 40.7. Inco FAST 481.7 / 460.1 ($6/$30). 표준 가격 $3 / $15 / 캐시 $0.3.

### 4.7 폐쇄형 프런티어 (참고)
| 모델 / 제공사 | 입력/출력/캐시 $ | tok/s 중앙 / P25 | TTFT 중앙 (사고 포함) |
|---|---|---|---|
| Claude Opus 5.5 (max) / Anthropic | 4 / 20 / 0.2 | 95.5 / 93.3 | 728.68 s |
| Claude Sonnet 5 (max) / Anthropic | 2 / 10 / 0.2 | 80.4 / 75.1 | 166.67 s |
| GPT-5.5 (xhigh) / OpenAI | 5 / 30 / 0.5 | 90.8 / 75.2 | 68.13 s |

### 4.8 해석
- 오픈 1T급 MoE 시장은 **두 갈래로 나뉜다**. 저가 공급자(DeepInfra, SiliconFlow, Novita, 1st-party Kimi)는 **P25 약 17~43 tok/s**, 고속 공급자(Azure, Nebius, Databricks, Fireworks)는 **P25 약 110~290 tok/s**다.
- 폐쇄형 프런티어(Claude/GPT)는 **P25 약 75~95 tok/s**다. 사용자가 실제로 비교하는 체감 기준은 이 근처일 가능성이 높다.
- TTFT P95는 대부분의 공급자가 **1~8 s**다(10k 입력 기준). DeepInfra K2.5의 71.6 s, Kimi K3 1st party의 21 s 같은 이상치도 있다.
- 이 분포가 AA-AgentPerf Tier 1(20) / Tier 2(60) / Tier 3(180)의 근거다. Tier 1이 "저가 공급자 수준", Tier 2가 "1st-party·중간 공급자 수준", Tier 3이 "고속 공급자 수준"에 대응한다(내 해석).

---

## 5. 에이전트 워크로드 형태 (용량 계획용 1차 자료)

| 지표 | 값 | 출처 (원문) |
|---|---|---|
| 입력:출력 비 | **131:1** (Codex/SWE-bench Pro 610 traces) | vLLM×Mooncake, 2026-05-06 — https://vllm.ai/blog/mooncake-store : "the average input-to-output token ratio is roughly 131:1" |
| 입력:출력 비 | **~100:1** (Manus) | Manus, 2025-07-18 — https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus : "the average input-to-output token ratio is around 100:1" |
| 입력:출력 비 | 평균 **53.9~559.8**, 그러나 **append:output은 1.5~7.3** | Yuan et al., "Agentic AI Workload Characteristics", arXiv 2605.26297 (IISWC 2026) — https://arxiv.org/html/2605.26297 |
| 입력/출력 중앙값 | 142,016 / 444 (AgentX, Claude Code) | SemiAnalysis AgentX 방법론 |
| 입력/출력 | 입력 평균 ~27K(5K~131K), 출력 중앙 ~150, P95 ~2K | AA-AgentPerf |
| 턴 수 | 중앙 43 (AgentX), 중앙 33 (Codex), 최대 200 (AA), ~50 tool calls/task (Manus) | 각 출처 |
| 턴당 컨텍스트 증가 | 평균 약 2,242 tokens/turn, 중앙 12K에서 80K로 증가 | vLLM×Mooncake |
| 프리픽스 캐시 적중률 | 94.2% (Codex), >96% (AgentX vLLM), 99% (AgentX 코퍼스), 84.6~99.5% (학술) | 각 출처 |
| 실서비스 캐시 적중 | 턴 내 평균 90%, **턴 경계에서는 55%** | Microsoft Research, "Agentic Coding in the Wild: Characterizing GitHub Copilot at Production Scale" (2026-07, 3.2M users / 13M sessions / 761M LLM calls / 95T tokens) — https://www.microsoft.com/en-us/research/publication/agentic-coding-in-the-wild-characterizing-github-copilot-at-production-scale/ |
| 캐시 미적중 시 영향 | 캐시 적중 1.7%에서 92.2%로 오르자 처리량 3.8×, P50 TTFT 46× 단축 (Kimi-2.5 NVFP4, 12 GB200, 1P1D) | vLLM×Mooncake |
| 동시성 과다 시 붕괴 | Qwen3.6-27B/H100: Terminal-Bench 동시 15에서 20으로 늘리자 캐시 적중 98.85%에서 16.78%로 급락, 생성 속도 30.08에서 16.96 tok/s/req로 하락 | arXiv 2605.26297 Table II |
| 시간 분해 (LLM vs 툴) | **LLM 추론이 총 실행시간의 71~98%**, 툴 2~29% (GAIA 최대 28.7%) | arXiv 2605.26297: "LLM inference accounting for 71–98% of total runtime" |
| LLM 시간 내 decode 비중 | **91.0~98.6%** (캐시가 이상적일 때) | arXiv 2605.26297 |
| 툴 지연 | 중앙 ~1 s (0.1~5 s) | AA-AgentPerf 방법론 |
| 턴 간 지연 | **중앙 5.2 s, P99 81.4 s** | vLLM×Mooncake: "Inter-turn delays ranging from 5.2s median to 81.4s P99" |
| 툴 호출 길이 | "many tool calls are short (<1s)", 일부 >10 s | Continuum, arXiv 2511.02230 Fig.3 캡션 |
| CPU 툴 병목 (반례) | 툴 중심 워크로드는 CPU 툴 처리가 E2E 지연의 최대 88% | Raj et al., arXiv 2511.00739v3 (RAG/ChemCrow 등, 코딩 에이전트 아님) |
| 서브에이전트 | 세션의 44%가 서브에이전트 포함, 그룹 지속 중앙 2.27분 | AgentX |

용량 계획 시사점 (내 해석):
1. **세션의 대부분 시간은 GPU에서 디코딩 중이다.** 코딩 에이전트 기준 LLM이 71~98%를 차지한다. 그래서 "툴 대기 중에는 GPU가 쉬니 동시 세션을 많이 받을 수 있다"는 가정은 약하다. 다만 Codex 실트레이스의 턴 간 지연 중앙 5.2 s는 AA 시뮬레이션의 툴 지연 중앙 1 s보다 길어서, 실서비스는 AgentPerf보다 세션당 GPU 점유가 낮을 수 있다.
2. **prefill이 아니라 KV 보존이 병목이다.** append:output 비가 1.5~7.3이라서 캐시만 유지되면 신규 prefill은 작다. 대신 세션당 KV가 크다(Kimi-2.5 FP8 100K 토큰 ≈ 3.8 GB, Mooncake 원문). 동시성이 KV 용량을 넘으면 적중률이 98%에서 20% 안팎으로 무너지면서 처리량이 급락한다. 실서비스(Copilot) 턴 경계 적중률이 55%라는 점도 라우팅 친화성과 KV 오프로딩이 핵심이라는 근거다.
3. **TTFT SLO는 캐시 적중 여부에 따라 둘로 나눠 관리해야 한다.** 캐시 미적중 상태의 142K 입력 prefill은 수 초~수십 초가 걸릴 수 있다.

---

## 6. 권고 SLO와 근거

| 티어 | 출력 속도 (요청별, after first token) | TTFT | 근거 |
|---|---|---|---|
| **기본 (비용 최적화)** | **P25 ≥ 30 tok/s** (하한 경보 P25 < 20) | **P95 ≤ 10 s** | AA-AgentPerf Tier 1 (P25 ≥ 20, P95 TTFT ≤ 10 s)이 시장 하단에서 나온 공식 하한이다. 30은 AA 위젯·NVIDIA 블로그의 "Capacity-optimized 30 tokens/s"이고, 저가 공급자 실측 P25(17~43)의 중간값이다 |
| 프리미엄 | P25 ≥ 60 tok/s | P95 ≤ 5 s | AA-AgentPerf Tier 2. vLLM/AgentX "P90 ≥ 50 tok/s"(같은 수준), DeepSeek V4 Pro 1st party P25 76.5, 폐쇄형 프런티어 P25 75~95 |
| 내부 진단 | 캐시 적중 턴 TTFT P95 ≤ 3 s, 프리픽스 적중률 ≥ 90% | | AA Tier 3의 TTFT, Mooncake·Copilot 적중률 데이터 |

- 백분위는 **AA 방식(요청 단위 P25 출력 속도, 요청 단위 P95 TTFT, 정상상태 구간)**으로 정의할 것을 권한다. AgentX의 "P90 interactivity"는 정의가 공개되지 않아 재현이 어렵다.
- MLPerf Server(DeepSeek-R1 TPOT p99 80 ms = 12.5 tok/s)는 시장 최저가 공급자보다도 느리다. 에이전트 SLO로는 부적합하고, MLPerf 결과를 용량 근거로 쓸 때도 이 점을 감안해야 한다.
- 용량 산정 앵커: Tier 1에서 B300×8 단일 노드는 장당 18 에이전트, H200×8은 장당 1.4 에이전트다(AA 데이터). RTX PRO 6000 PCIe 공식 데이터는 없으므로 자체 AgentPerf 방식 측정이 필요하다.

---

## 7. 열지 못했거나 확인하지 못한 것
- **AA 하드웨어 대시보드** (`/hardware-inference-stack/datacenter`): 텍스트가 거의 없는 JS 페이지라 런칭 이후 갱신 결과(신규 제출)는 확인하지 못했다. 위 §2.6은 2026-06-12 기사에 박힌 런칭 데이터다.
- **AgentX 대시보드의 하드웨어별 Pareto 수치**: 페이지에 B200/GB300/MI355X/TPUv7 언급만 있고, 수치는 추출하지 않았다.
- **OpenRouter 속도·지연 통계**: 공개 API에서 `null`이다. 웹 UI는 시도하지 않았다.
- **MLPerf v6.1 공식 발표 글**: 결과 저장소(마지막 커밋 2026-09-29)는 확인했지만 MLCommons 발표 페이지는 열지 않았다.
- themoonlight.io 문헌 리뷰는 HTTP 429. 원 논문 arXiv 2605.26297 전문을 대신 확인했다.
- Microsoft Copilot 논문은 MSR 소개 페이지만 확인했다. 입력:출력 비, 턴 수 등 본문 수치는 미확인이다.
- Anthropic·OpenAI의 공식 서빙 SLO 문서(속도 보장치)는 찾지 못했다. AA 실측치로 대체했다.
- Moonshot/DeepSeek 1st-party의 Kimi K2.5·R1 성능 데이터는 AA에 없다(가격만 있거나 미등재).
