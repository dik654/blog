# NPU 시리즈 · 가치 포착 시리즈 status

이 문서는 2026-08-30 HyperAccel 이진원 CTO 대담(오디오 요약) 을 계기로 시작한 두 시리즈의
진행 상황을 기록한다. 형식은 `docs/rewrite-status.md`, 절차는 `docs/coverage-batch-playbook.md`
를 따른다. 대화가 끊겨도 이 문서와 `git log --oneline feat/npu-gemmini-series` 로 이어서
진행할 수 있다.

## 시리즈 A — NPU를 밑바닥부터: Gemmini 시스톨릭 어레이 추적

새 subcategory `gpu/accelerator-design` 아래, UC Berkeley Gemmini(github.com/ucb-bar/gemmini,
DAC 2021) 실제 Chisel 소스를 scratch부터 추적하는 code-grounded 시리즈. "직접 만들어보고 싶다"는
요청에 맞춰 매 편이 실제로 돌려볼 수 있는 명령(`sbt test`, Verilator, Spike)으로 끝난다.

| 편 | slug | 다루는 실제 소스 | 상태 |
|---|---|---|---|
| 1 | `gemmini-pe-mac-dataflow` | `PE.scala`(MacUnit·PE) | **완료** — 깊은 텍스트+Viz+registration 병합+`check-article.sh --full` 통과 |
| 2 | (미정, 가칭 `gemmini-mesh-systolic-array`) | `Mesh.scala`·`Tile.scala` — PE를 16×16 격자로 엮는 배선, activation/weight의 방향별 파이프라인 | 착수 전 |
| 3 | (가칭 `gemmini-scratchpad-arithmetic-intensity`) | `Scratchpad.scala`·`AccumulatorMem.scala` — 온칩 SRAM이 weight를 얼마나 오래 들고 있는지가 실제 DDR 트래픽을 정함. `/gpu/gpu-memory-hierarchy-and-roofline`과 직접 연결 | 착수 전 |
| 4 | (가칭 `gemmini-rocc-controller-isa`) | `Controller.scala`·`ReservationStation.scala`·`GemminiISA.scala` — RoCC로 RISC-V 코어에 가속기를 붙이는 명령어 인터페이스 | 착수 전 |
| 5 | (가칭 `gemmini-fpga-bringup`) | Chipyard `fpga-shells`, FireSim — 실제 FPGA 보드에 올려 cycle-accurate로 돌리는 절차 | 착수 전 |
| 6 (stretch) | (가칭 `gemmini-openroad-tapeout-taste`) | Yosys+OpenROAD+SkyWater130 오픈소스 PDK로 테이프아웃 맛보기 | 범위만 존재, 착수 여부 미정 |

**1편에서 확정한 패턴(2~6편이 재사용):**
- `node scripts/scaffold-article.mjs --category gpu --slug <slug> --subcategory accelerator-design --catalog src/content/gpu/index.ts --after <이전 편 slug> --title "..."`
- `Lang` 타입에 `"scala"`를 추가하고 `src/components/code/highlighters/ScalaLine.tsx`를 새로 만들어야 했음(기존 하이라이터가 rust/go/python/typescript/c만 지원) — 이미 병합됐으므로 2편부터는 그대로 재사용.
- 실제 소스는 `git clone --depth 1 https://github.com/ucb-bar/gemmini` 로 로컬에 받아 해당 `.scala` 파일만 `codebase/gemmini/`에 옮기고 헤더에 "본문 대응:" 주석 + inline `article의 ...` 주석을 단다.
- 저장소에 없는 사실(성능 수치, 존재하지 않는 테스트 파일 등)은 절대 사실로 승격하지 않는다 — 1편에서 `PETester.scala`가 실제로는 없다는 걸 확인하고 "독자가 직접 채우는 실습"으로 정직하게 틀을 바꿨다.

## 시리즈 B — AI 인프라로 이동하는 가치 포착 (원 팟캐스트의 macro 서사)

**중요한 발견**: 팟캐스트가 다룬 기술 내용(prefill/decode, roofline·arithmetic intensity, KV
cache·GQA/MQA/MLA, PagedAttention, chunked prefill, speculative decoding, PD disaggregation,
serving 지표)은 이 블로그의 `ai` 카테고리에 이미 압도적으로 깊게 등재돼 있다
(`prefill-decode-phase-dynamics`, `gpu-memory-hierarchy-and-roofline`,
`multi-head-latent-attention-mechanics`, `vllm-paged-attention`, `vllm-scheduler`,
`vllm-spec-decode`, `disaggregated-prefill-decode-serving` 등). 따라서 이 시리즈는 그 내용을
재요약하지 않고, 팟캐스트에만 있고 블로그에는 없는 네 가지 macro/하드웨어 소재로 범위를 좁힌다.

| 편(가칭) | 소재 | 근거가 될 실제 자료 | 상태 |
|---|---|---|---|
| B1 | Compute crunch와 매출-compute 10배 vs 3배 격차, inference 마진 상한 | Sam Altman OpenAI Forum(2026-04), Google I/O 2026 GCP 토큰 사용량, SemiAnalysis InferenceX Pareto 방법론 | 착수 전 — 1차 소스(영상·공식 발표) 링크 확인 필요 |
| B2 | HyperAccel Bertha 칩: LPDDR 기반 NPU, bandwidth utilization 90%+, $5,000 목표가, 192GB/칩 | HyperAccel Hot Chips 2026 데모, 회사 공개 자료 | 착수 전 — 1차 소스 확인 필요(팟캐스트 발언만으로는 evidence 기준 미달) |
| B3 | OpenAI Jalapeño 칩과 NVIDIA Vera Rubin+Groq LPX 이종 결합(attention은 GPU, FFN은 LPU) | Hot Chips 2026 OpenAI 발표, NVIDIA GTC Vera Rubin 자료 | 착수 전 |
| B4 | Agentic AI workload의 KV cache 경제학: session/request/step 통계, human-idle 92%, KV eviction 예측 | Copilot 2026-06 trace 논문, TraceLab | 착수 전 — 논문 원문 재확인 필요 |

시리즈 B는 시리즈 A와 달리 오픈소스 코드 추적이 아니라 `b300-switchless-network`·
`sionic-glm-b300`처럼 1차 소스(공식 발표·논문·공식 문서) 인용형 아티클이다. **팟캐스트 발언 자체를
근거로 쓰지 않는다** — `docs/coverage-batch-playbook.md`의 "미공개 model 이름·체감 수치는 사실로
승격하지 않는다" 원칙에 따라, 각 편을 쓰기 전에 발언이 가리키는 1차 소스(Hot Chips 발표 영상/슬라이드,
회사 공식 자료, 논문)를 먼저 찾아 확인해야 한다. 확인 안 되는 수치(예: Bertha의 정확한 bandwidth
utilization 수치, DAC/Hot Chips 슬라이드 원문)는 "발표자 발언" 으로만 표기하고 벤치마크 사실로
쓰지 않는다.

## 다음 세션에서 이어가는 법

1. `cd /Users/dylan/code/projects/blog && git checkout feat/npu-gemmini-series` (브랜치가 이미 있으면 pull, 없으면 이 문서와 함께 새로 판다)
2. 이 표에서 "착수 전"인 다음 항목을 고른다.
3. 시리즈 A는 `docs/coverage-batch-playbook.md` 4단계(scaffold→소스 확보→깊은 텍스트→Viz 위임→registration→`check-article.sh --full`)를 그대로 반복.
4. 시리즈 B는 먼저 1차 소스를 확인(WebSearch/WebFetch)한 뒤 같은 4단계를 따른다.
5. `main`에 push하면 GitHub Pages가 즉시 재배포되므로, 사용자 확인 전에는 이 feature 브랜치에만 커밋한다.
