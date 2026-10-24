# AI 서빙 묶음 05 · GPU 실행 경로

작성일: 2026-10-24
범위: `ai/launch-overhead-and-cpu-gpu-synchronization`, `ai/cuda-graph-capture`, `ai/flash-attention-io-aware-kernel`, `ai/attention-kernel-anatomy-and-backends`, `ai/tensorrt-llm-kv-cache-and-kernels`, `ai/inference-engine-design-axes`

## 묶음의 직속 부모

앞 묶음은 한 추론 복제본이 메모리를 준비하고 실제 요청을 받을 수 있는 상태가 되는 과정까지 설명했습니다. 이번 묶음은 요청이 GPU 실행으로 내려간 뒤 같은 계산을 더 효율적으로 수행하는 네 경계를 확대합니다.

1. 제출: CPU가 작업을 준비·전달하는 시간과 GPU가 실제 계산하는 시간을 분리합니다.
2. 재생: 같은 순서와 주소를 기록해 반복 제출 비용을 줄입니다.
3. 이동: Attention 중간값을 모두 저장하지 않고 HBM 왕복을 줄입니다.
4. 커널: 입력 모양·mask·작업 분할에 맞는 구현과 설정을 고릅니다.

TensorRT-LLM과 엔진 비교는 다섯째·여섯째 처리 단계가 아닙니다. 위 네 결정을 실제 엔진이 어떻게 조합하는지 확인하는 구현 참고 가지입니다.

## 글 분류

| 글 | 트랙 | 이 글이 답할 질문 |
|---|---|---|
| Launch overhead·CPU–GPU synchronization | concept | 제출한 작업과 끝난 계산을 어느 시간축에서 구분해야 GPU의 빈 구간을 설명할 수 있는가? |
| CUDA Graph capture | concept | 같은 계산의 순서와 주소를 어떻게 기록하고 어떤 조건에서 안전하게 재생하는가? |
| FlashAttention IO-aware kernel | concept | 같은 attention 출력을 유지하면서 중간 행렬의 저장·재읽기를 어떻게 피하는가? |
| Attention kernel·backends | concept | Causal 위치·prefill/decode 모양·분할 결과·dtype에 맞는 kernel을 어떻게 고르는가? |
| TensorRT-LLM KV cache·kernels | reference | KV 예약·pool 배치·보존 정책과 fused attention이 고정 소스에서 어떻게 만나는가? |
| Inference engine design axes | reference | 같은 요청에서 네 엔진의 저장·예약·재사용·겹침·kernel 결정을 어떻게 같은 눈금으로 비교하는가? |

제품을 운영 환경에 채택하는 판단은 이번 묶음의 질문이 아닙니다. 고정 버전의 코드와 논문에서 동작 경계를 확인하며, 성능 우위는 같은 하드웨어·입력·동기화·측정 구간의 별도 실험에서 결정합니다.

## 보존할 근거와 경계

- Launch 글의 세 회 시간표, 첫 완료와 반복 간격, stream·event·sync 범위와 실제 PyTorch 호출 경계를 유지합니다.
- CUDA Graph 글의 값과 시각 분리, 정적 주소, capture·instantiate·replay, padding과 memory pool, 측정 경계를 유지합니다.
- FlashAttention 글의 네 점수 가중평균, online softmax, HBM 왕복 장부, FA4의 조건부 기준 갱신과 측정 범위를 유지합니다.
- Attention kernel 글의 causal 위치 정렬, 분할 KV 합치기, prefill·decode 이동량, backend 지원 판정과 autotune 경계를 유지합니다.
- TensorRT-LLM과 엔진 비교 글의 고정 commit, 요청 200·출력 상한 1,000·실제 300 사례와 다섯 설계 결정을 유지합니다.
- 논문 저자 측정과 설명용 시간표를 대상 환경의 성능 결과로 승격하지 않습니다.

## 검증 상태

- [x] 대상 파일 ESLint
- [x] TypeScript
- [x] 전체 build와 strict audit
- [x] 390×844 가로 넘침과 지도 밀도
- [x] 1440×900 가로 넘침
- [x] 키보드와 중간 장면
- [x] reduced-motion
- [x] JavaScript 비활성 정적 본문과 부모 지도
- [ ] 공개 경로
