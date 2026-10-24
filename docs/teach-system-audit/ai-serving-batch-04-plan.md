# AI 서빙 묶음 04 · 실행 가능한 replica

작성일: 2026-10-24
범위: `ai/model-vram-budgeting`, `ai/inference-runtime-anatomy`, `ai/llm-serving-capacity`, `ai/multimodal-serving-pipeline`, `ai/sglang-runtime-anatomy`, `ai/llama-cpp-local-inference`

## 묶음의 직속 부모

앞 묶음은 이미 실행 중인 요청을 고르고 KV 공간을 배정·회수·재사용하는 과정을 설명했습니다. 이번 묶음은 한 replica가 그 결정을 수행할 수 있기 전에 무엇을 준비하고, 준비된 공간을 실제 요청 수로 어떻게 바꾸는지 확대합니다.

공통 원리의 순서는 다음과 같습니다.

1. 예산: 가중치·요청 상태·실행 공간·안전 여유를 같은 byte 장부에 올립니다.
2. 기동: 프로세스와 shard를 나누고 적재·profile·warmup을 마칩니다.
3. 수용: 확정된 KV pool을 요청 길이와 지연 조건에 맞는 admission 상한으로 바꿉니다.
4. 확장: 사진 입력이 encoder 계산, 문장 자리, KV, cache key에 추가하는 비용을 셉니다.

SGLang과 llama.cpp는 다섯째·여섯째 처리 단계가 아닙니다. 위 원리가 실제 구현에서 어떻게 달라지는지 확인하는 별도 참고 가지입니다.

## 글 분류

| 글 | 트랙 | 이 글이 답할 질문 |
|---|---|---|
| Model VRAM budgeting | concept | 모델 파일과 요청 상태, 실행 중 임시 공간을 더하면 GPU에 실제로 들어가는가? |
| Inference runtime anatomy | concept | 첫 요청 전에 process·weight·KV pool·graph는 어떤 순서로 준비되는가? |
| LLM serving capacity | concept | 확보한 KV 공간은 실제로 몇 요청을 받을 수 있다는 뜻인가? |
| Multimodal serving pipeline | concept | 사진 한 장은 encoder 계산과 token 자리, KV, cache key를 어떻게 바꾸는가? |
| SGLang runtime anatomy | reference | 수용 비율·token 단위 KV·retract·overlap이 고정 소스에서 어떻게 이어지는가? |
| llama.cpp local inference | reference | 한 기기에서 KV cell·블록 양자화·CPU/GPU layer 배치는 어떻게 이어지는가? |

제품을 어느 환경에 채택할지는 이 묶음의 질문이 아닙니다. 구현 참고 글은 고정한 버전의 코드 동작을 확인하며, 성능 우위와 운영 적합성은 별도 실무 비교와 동일 조건 측정에서 결정합니다.

## 보존할 근거와 경계

- Model VRAM 글의 dtype별 weight byte, KV·recurrent state, runtime headroom, MoE와 multi-GPU 장부를 유지합니다.
- Runtime 글의 shard load 경로, 공유·로컬 대역폭 하한, profile, KV pool, warmup과 backend 경계를 유지합니다.
- Capacity 글은 pool→token→request 단위 변환만 소유합니다. Muse·Gemma 배포 판단은 개념 글에서 분리합니다.
- Multimodal 글은 같은 사진 네 요청을 이용해 image token, encoder budget, KV, cache key를 끝까지 추적합니다.
- SGLang과 llama.cpp의 고정 commit, 코드 줄과 계산 근거를 유지합니다.
- 문서·논문 저자의 측정과 설명용 가정은 대상 환경 측정값으로 승격하지 않습니다.

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
