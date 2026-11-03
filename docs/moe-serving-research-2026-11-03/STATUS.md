# 상태: PCIe·MLA·에이전트 서빙 블로그 보강 (2026-11-03)

- **브랜치와 기준**: 브랜치 `moe-serving-pcie-mla`, 기준 커밋 `64850e64`. 이 커밋은 아직 푸시되지 않은 로컬 main 커밋이다.
- **작업 위치**: 노트북 worktree `~/code/projects/blog-moe-serving`.
- **계획서**: [`05-blog-gap-analysis.md`](05-blog-gap-analysis.md).
- **근거**: [`00-SYNTHESIS.md`](00-SYNTHESIS.md)부터 `04`까지.
- **작업 방식**: 작업자 7명이 병렬로 썼고, 오케스트레이터가 공용 파일 반영, 감사, 빌드, 렌더 확인을 맡았다.

## 1. 반영한 것

### 사실 오류 수정과 기존 글 보강

| 항목 | 글 (절) | 내용 |
|---|---|---|
| C3·A1 | `ai/model-vram-budgeting` (MoeVramServingTradeoff) | "MoE는 고른 expert만 읽는다"는 batch 1에서만 맞는다고 고쳤다. batch에 따라 읽는 expert 합집합 E·(1−(1−k/E)^B)를 추가했다(K2.5: B=16·64·128에서 29·74·93%). 토큰당 바이트 ÷ TP ÷ 대역폭 상한(약 400 tok/s, 추정)을 실측 65~101과 대조했다. 새 Viz `ExpertUnionReadViz` |
| A2·A3·A8 | `ai/tensor-and-pipeline-parallel-inference` (#decode-impact, #pipeline-parallel, #sequence-context-parallel) | 토큰당 동기화 122회와 PCIe 지연. P2P on/off 65 대 44 tok/s, 고동시성에서는 결과가 뒤집힘. PP 경계 14 KiB/token(0.23 Gbps)이고, PP는 용량을 늘릴 뿐 속도는 올리지 않는다. MLX 결과는 batch 1임을 명시. DCP 이름을 붙이고 N2로 연결 |
| C2·A4·A5 | `ai/parallelism-strategy-and-placement` (#procedure, #fabric-tiers) | "NVLink 없으면 TP를 줄이고 PP"라는 규칙을 실측 비교 후보로 바꿨다. 의사코드에 PCIe 분기와 MLA·GQA 랭크별 KV를 넣었다. PCIe Gen5·RoCE 400G 행 추가 |
| C6·A6 | `ai/expert-parallelism-moe-systems` (#all2all-backends, #limits) | all2all 백엔드 표: DeepEP normal은 NVLink 필수(#216·#584), pplx 제거, allgather_reducescatter 대체, llm-d wide-EP 검증 조건. EP는 큰 batch에서만 이득 |
| A7·A8 | `ai/kv-cache-fundamentals` (#parallel-budget) | GQA는 TP로 나뉘고(KV head 수보다 TP가 크면 복제), MLA는 KV head 1개라 rank마다 복제된다. 토큰당 70,272 B, DCP와 rtx6kpro 실측. 새 Viz `TpKvPlacementViz`. vLLM 코드 발췌(`codebase/vllm/`) |
| C4·A9 | `ai/hybrid-attention-serving/KVFundamentals.tsx` | MLA absorption 설명을 바로잡았다. **단, 이 파일은 어느 공개 글에도 import되지 않는다**(§3 참고) |
| A18 | `ai/kimi-k3-architecture` (#serving 신설) | KV는 MLA 24층에만 쌓인다(27,648 B/token, 계산). KDA state, 1,561 GB, 16장 TP16·DCP16 현장 사례. 카탈로그 절 추가 |
| A19 | `ai/qwen36-hybrid-runtime` (#tp-split 신설) | vLLM 코드로 확인했다. DeltaNet state와 conv state는 head 축으로 TP만큼 나뉘고, full-attention KV는 KV head 수를 넘는 TP에서 복제된다. 카탈로그 하위절 추가 |
| A10·C5 | `ai/serving-latency-metrics-and-slo` | 900 tok/s(동시 100)는 요청당 6~9 tok/s다. "P99 ITL 80 ms"(12.5 tok/s)는 에이전트 Tier 1에 못 미친다는 각주 |
| A11·C5 | `ai/serving-benchmark-methodology` | 에이전트 벤치 방식(AA-AgentPerf) 소개와 각주 |
| A12 | `ai/prefix-caching-radix-attention` (#eviction) | 캐시 적중률 붕괴 98.85% → 16.78%(arXiv 2605.26297), Copilot 턴 경계 55% |
| A13 | `ai/serving-memory-admission-and-preemption` (#long-context-isolation) | 호스트 DRAM KV 계층(LMCache)과 용량 계산 |
| A14 | `ai/own-vs-rent-inference-capacity` (#unit-mismatch) | 에이전트 부하의 API 비용식, 손익분기 최대 capex 역산. 가격은 파라미터로 둔다. 새 Viz `BreakEvenCapexViz` |
| A15 | `ai/inference-cost-and-capacity-planning` (#capacity) | 용량의 분모는 SLO를 지키는 처리량이어야 한다 |

### 새 글 4편

| 글 | 위치 | 핵심 |
|---|---|---|
| N2 `ai/mla-kv-replication-and-decode-context-parallel` "MLA KV는 GPU를 늘려도 줄지 않습니다" | ai-llm-serving, parallelism-strategy-and-placement 뒤 | 13절, Viz 4개, vLLM v0.33.0 발췌. 19만 → 362만 토큰, LSE 병합, DCP 비용 |
| N1 `ai/serving-architecture-matrix` "모델 구조가 서빙 장비와 병렬화를 정합니다" | N2 뒤 | 7절, Viz 5개. 모델 7개의 HF config를 직접 확인했다. dense, MoE+GQA, MoE+MLA, KDA·DeltaNet 하이브리드, SWA × 다섯 질문, 8×PRO 6000 대입 |
| N3 `ai/agent-serving-slo-and-capacity` "에이전트 서빙 용량은 SLO를 지키는 동시 에이전트 수로 잽니다" | serving-benchmark-methodology 뒤 | 10절, Viz 2개. AgentPerf 방법·티어·결과, KV 상주와 캐시 붕괴, 측정 절차, 경제성 연결 |
| N4 `gpu/pcie-blackwell-moe-node-build` "NVLink 없는 Blackwell 8장으로 1T MoE 노드 짜기" | hw-ai-cluster, ai-cluster-software-compatibility 뒤 | 12절, Viz 4개. 토폴로지, 토큰 시간 예산, 네트워크 필요량, RDMA 검증, 4090 제외 이유. 가격은 넣지 않았다 |

### 공용 파일 (오케스트레이터)

- **카탈로그**:
  - `articlesVLLM.ts`: N1 항목, qwen36 `tp-split` 하위절.
  - `articlesLLM.ts`: kimi-k3 `serving` 절.
  - N2·N3·N4 항목은 각 등록 모듈을 병합해서 들어갔다.
- **커리큘럼**: `article-reading-curricula.ts`에 4편을 넣었다.
- **topology**: N3 판정(keep)을 추가했다. 지문은 새 글 4편을 추가하고 기존 글 5편을 갱신했다. 기존 글은 절 구조 변경 없이 줄 수만 바뀌었다.
- **teach-coverage 장부**: `post-checkpoint-routes.json`에 4편을 `pending-full-review` 상태로 넣었다. `current-coverage.json`과 `architecture-flow-current.json`은 `--write`로 재생성했다.

## 2. 검증

- **`tsc -b`**: exit 0.
- **CI 감사 17개** (`.github/workflows/deploy-pages.yml`과 같은 플래그): 전부 exit 0.
  - lint, learning, graph, formula, calculations, pseudocode, articles, topology, reading, order, prose, korean, terms, term-pairs, architecture-flow, teach-coverage, runtime.
  - prose는 한 번 걸렸다(tensor-and-pipeline score 6). 오케스트레이터가 덧붙인 DCP 문장 때문이었고, 문단을 나눠 해결했다.
- **`npm run build`** (힙 8GB): exit 0. 정적 route 2,128개를 생성했다.
- **프로덕션 렌더**: `vite preview`로 바뀐 경로 17개를 390×844와 1440×900에서 열었다. 콘솔·페이지 오류 0, 가로 스크롤 0, KaTeX 오류 0. 오케스트레이터가 새 글 첫 화면과 핵심 Viz 장면 일부를 눈으로 확인했다.
- **Viz**: 작업자들이 새 Viz 전 장면을 두 폭에서 캡처해 확인했다. `series_shift` 결과 frameΔ·ctrlΔ는 0이다.
- **`series_shift` 기존 결함**: `model-vram-budgeting`의 기존 Viz 2개는 390에서 조작부가 40·403px 흔들린다. 이번 변경과 무관하다.

## 3. 남은 일과 보류

1. **보류(다른 세션 미커밋 작업과 충돌)**: 메인 저장소에 미커밋 변경이 있는 파일이라 이번에는 건드리지 않았다.
   - **C1** `hw/modded-rtx4090-moe-serving/ReleaseGate.tsx:24`: 출시 게이트 맨 앞에 라이선스 단계를 둔다. GeForce EULA §2.8은 데이터센터 배포를, §2.7은 상업 호스팅을 금지한다. 4090은 상용 1T 서빙에서 제외하고 N4 `#sources`로 링크한다.
   - **A16** 같은 글: 라이선스 단계 반영과 N4 링크.
   - **A17** `hw/network/*`(rdma-roce, gpu-collective-network): PRO 6000의 GPUDirect RDMA는 NVIDIA 공식 명시가 없으니 노드별로 `ib_write_bw --use_cuda`로 확인하라는 내용과, PCIe 시스템에서 `NCCL_NET_GDR_READ=1`을 명시해야 한다는 내용. N4 `#network`로 링크한다.
2. **말투 정리 완료(후속 회차)**: humanize-korean heavy 경로로 처리했고, 게이트 exit 0과 왕복 대조 어긋남 0을 확인했다. ko-natural은 오류 0이다. 상세는 `docs/rewrite-status.md` 2026-11-03 항목에 있다.
3. **`KVFundamentals.tsx` 처리 결정(유지)**: `ai/hybrid-attention-serving`은 폐기된 route다(`scripts/audit-learning-routes.test.mjs`가 phantom route로 명시). 같은 폴더의 `Overview.tsx`·`Deployment.tsx`와 함께 import되지 않는 레거시 파일이다. AGENTS.md가 레거시 보존을 허용하므로 지우지 않는다. MLA 설명 오류는 이미 고쳐 두었으므로, 나중에 다시 쓰더라도 틀린 설명이 되살아나지 않는다.
4. **개념 중복 점검**: N1의 `kv-shard-replication-factor`(일반식)와 N2의 `mla-kv-tp-replication`(MLA 특수 경우)이 겹친다. 연결은 돼 있고 alias 충돌은 없다.
5. **새로 확인된 사실, 근거 문서 반영 필요**: vLLM PR #34795(FP8 KV + DCP for MLA)는 **병합되지 않고 stale로 닫혔다**(2026-07-05). 이 PR이 제거하던 assert는 v0.33.0에 없다. 00 문서, 벤치 README, N4의 "체리픽 필요" 표현은 "v0.33.0 이상에서는 불필요할 수 있음, 실측 확인"으로 고쳐야 한다. #46721도 stale로 닫혔다.
6. **장부 상태**: 4편은 `reviewed-local`이다(DoD 확인과 no-script 등록을 마쳤다). 배포 뒤 공개 URL을 다시 확인하면 `reviewed-production`으로 올린다.

## 4. (미확인)·(추정)으로 남긴 주장 (작업자 보고 종합)

- **추정치**: K2.5 토큰당 약 30 GB 읽기와 단일 스트림 상한 약 400 tok/s. P2P를 끌 때 동기화 1회당 약 +60 μs라는 값은 차이를 모두 통신 탓으로 본 상한이다.
- **SLO 처리량**: 8×PRO 6000이 SLO를 지키며 내는 처리량(250~650 tok/s, X_SLO=400)은 추정이다. 측정된 곳이 없다.
- **LMCache**:
  - 적중률 붕괴를 얼마나 막는지 측정되지 않았다.
  - TP rank별로 사본을 따로 둘 경우 호스트 용량은 8분의 1이 된다.
  - DCP로 나뉜 KV를 어떻게 오프로드하는지 확인되지 않았다.
- **SM120 업스트림**: 패치 없는 업스트림 이미지에서 FP8 KV와 DCP8이 함께 동작하는지 확인되지 않았다.
- **Kimi K3**:
  - `mla_use_nope=true`일 때 실제 캐시 폭은 미확인이다.
  - 1,561 GB는 디스크 크기다. ÷16 = 97.6 GB로 카드 용량보다 크다는 산수 문제가 남아 장당 적재 계산을 하지 않았다.
- **gpt-oss**: 창 밖 block을 엔진이 실제로 회수하는지 미확인이다.
- **Qwen3.6**: state dtype(FP32/BF16)은 설정에 따라 다르다. 본문은 FP32로 셌다.
- **장비 구성**:
  - SYS-522GA-NRT의 스위치별 카드 배치는 가정이다. `nvidia-smi topo -m`으로 확인해야 한다.
  - SYS-422GL-FNR2와 Gigabyte XL44는 검색 요약으로만 확인했다.
- **Copilot 55%**: MSR 소개 페이지만 확인했다.

## 5. 메인 저장소 병합 때 예상 충돌

메인 `~/code/projects/blog`에는 2026-11-01부터 다른 세션의 미커밋 변경 약 860개 파일이 있다. 그 작업이 커밋된 뒤 이 브랜치를 병합한다.

- **충돌 후보 공용 파일**:
  - `src/content/{knowledge-graph,article-learning,article-evidence,editorial-ownership,article-topology-decisions,article-reading-curricula}.ts`
  - `src/content/ai/articlesVLLM.ts`, `src/content/ai/articlesLLM.ts`, `src/content/gpu/articlesHw.ts`
  - `docs/teach-system-audit/*.json`
- **생성 파일**: `current-coverage.json`과 `architecture-flow-current.json`은 손으로 병합하지 않는다. 병합 뒤 `--write`로 다시 만든다.
- **topology 지문**: 병합 뒤 전부 다시 계산하고 `audit:topology --strict`를 다시 돌린다.
- **등록 모듈**: `src/content/registrations/`는 gitignore 대상이다. 병합할 때는 정본 파일의 변경이 기준이다.
