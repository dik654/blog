# Editorial observation ledger

이 문서는 아티클에 바로 넣기에는 근거가 부족하지만 다시 검증할 가치가 있는 현장 관찰과
pre-release 정보를 보존하는 staging ledger다. 여기에 있다는 사실은 블로그의 canonical fact나
추천을 뜻하지 않는다.

## Lifecycle

- 상태는 `pending`, `measured`, `promoted`, `rejected`, `superseded` 중 하나다.
- `pending` 관찰은 `review-by`에 공식 artifact와 독립 확인을 다시 찾는다.
- 성능 주장은 model·revision, runtime·version, hardware·topology, quantization, input/output length,
  batch·concurrency, KV dtype, sampling, 측정 방법, 반복 횟수와 허용 오차를 채워야 `measured`가 된다.
- 공식 artifact 또는 독립 확인과 재현 가능한 measurement receipt가 함께 있을 때만 아티클로
  `promoted`한다.
- 공식 정보와 충돌하면 `rejected`, 새 artifact가 대체하면 `superseded`로 바꾸고 이유를 남긴다.
- Review-by를 30일 넘겨도 확인할 수 없는 pre-release 수치는 삭제하지 않고 `rejected`로 닫는다.

## 2026-08-26 · Local MoE inference conversation

### 확인된 기준선

| 항목 | 상태 | 근거 |
| --- | --- | --- |
| Qwen3.8의 현재 공식 대형 MoE 공개 artifact는 2.4T total / 95B activated로 표시된다. | verified | [Qwen3.8-2.4T-A95B model card](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B) |
| RTX PRO 6000 Blackwell Workstation Edition은 96GB GDDR7 ECC와 1,792GB/s memory bandwidth를 명시한다. | verified | [NVIDIA product brief](https://www.nvidia.com/content/dam/en-zz/Solutions/data-center/rtx-pro-6000-blackwell-workstation-edition/workstation-blackwell-rtx-pro-6000-workstation-edition-nvidia-us-3519208-web.pdf) |
| DGX Spark는 128GB unified system memory와 273GB/s memory bandwidth를 명시한다. | verified | [NVIDIA DGX Spark](https://www.nvidia.com/en-us/products/workstations/dgx-spark/) |
| NVFP4는 Blackwell 계열의 E2M1 value와 16-value E4M3 block scale·tensor-level FP32 scale을 사용하는 4-bit floating-point format이다. | verified | [NVIDIA Transformer Engine NVFP4](https://docs.nvidia.com/deeplearning/transformer-engine-releases/release-2.15/user-guide/features/low_precision_training/nvfp4/nvfp4.html) |

첫 행의 공식 Qwen3.8 artifact는 아래 LMI-001의 `Flash-Next` 이름이나 176B/6B 수치를 확인하지 않는다.
같은 family prefix를 공유하더라도 별도 model card·config가 없으면 서로 다른 artifact로 취급한다.

### 검증 대기 관찰

| ID | 주장 | 분류 | 상태 | fingerprint 누락 | review-by | 승격 또는 종료 조건 |
| --- | --- | --- | --- | --- | --- | --- |
| LMI-001 | `Qwen3.8-Flash-Next`라는 176B total / 6B active MoE가 존재한다. | community rumor | pending | 안정된 공식 model card·config·checkpoint revision | 2026-09-02 | 공식 Qwen artifact로 확인하면 supersede된 정확한 명칭·수치로 승격, 없으면 2026-09-25에 rejected |
| LMI-002 | Active parameter가 15B 이하인 MoE에서는 decode bandwidth 병목 체감이 크게 줄어든다. | field experience | pending | model·runtime·GPU·expert placement·batch·quantization·profiler trace | 2026-09-09 | 여러 active sizes의 같은-device stage timing과 memory counters가 병목 이동을 보일 때 측정 결과로 승격 |
| LMI-003 | 6B active급에서는 decode보다 long-prompt prefill 비중이 더 눈에 띈다. | field experience | pending | exact model·context sweep·batch·TTFT/ITL·attention backend | 2026-09-09 | 동일 실행 조건에서 prefill/decode stage breakdown을 반복 측정 |
| LMI-004 | Base decode가 충분히 빠른 small-active MoE에서는 MTP의 추가 이득이 작거나 음수가 될 수 있다. | field experience + theory-consistent hypothesis | pending | proposer·verify cost, acceptance length, target-only baseline, runtime version | 2026-09-09 | 같은 output의 target-only/MTP paired run에서 committed-token cost와 confidence interval 측정 |
| LMI-005 | 특정 Mac Studio 설정에서 64K 이상 context prefill이 짧은 context 대비 약 1/10까지 떨어졌다. | field experience | pending | chip·memory·model·runtime·prompt sweep·token/s 정의·thermal state | 2026-09-09 | 원 measurement receipt를 확보하거나 같은 환경에서 재실행, 없으면 숫자는 승격하지 않음 |
| LMI-006 | Dual RTX PRO 6000 + NVFP4가 176B/6B active급 local MoE의 sweet spot이다. | estimate | pending | 실제 checkpoint·NVFP4 availability·interconnect·TP plan·quality·latency·power·cost | 2026-09-09 | 공식 artifact와 end-to-end comparison이 생겨도 보편 추천이 아니라 해당 profile의 결과로만 승격 |
| LMI-007 | DGX Spark는 이 model-size 분포에서 performance/memory 비율이 애매하다. | field opinion | pending | workload·runtime·power/cost basis·비교 hardware | 2026-09-09 | 같은 quality/SLO workload의 cost·latency·energy 비교 없이는 의견으로 유지 |
| LMI-008 | Local LLM 시장은 300B+, 100B대 MoE, 30B 이하 dense의 세 구간으로 나뉜다. | market hypothesis | pending | 판매·사용량 data, region, period, price bands | 2026-09-25 | 시장 자료가 없으면 기술 article의 사실로 승격하지 않음 |

### 현재 해석

이 관찰들이 공통으로 가리키는 방향은 유용하지만 아직 임계값은 아니다. 모델이 메모리에 들어가는지는
전체 저장 weight와 request/runtime state가 결정하고, 토큰당 expert compute는 active path가 크게
좌우한다. Prefill·decode·MTP의 실제 병목은 같은 model이라도 runtime, batch, context와 hardware가
바뀌면 이동한다. 따라서 아티클에는 이 분해법과 측정 절차만 정본으로 두고, 위 숫자는 원장에서
재현 조건이 채워질 때까지 기다린다.
