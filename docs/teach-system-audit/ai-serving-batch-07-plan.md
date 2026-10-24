# AI 서빙 묶음 07 · 요청별 GPU 상태

작성일: 2026-10-24
범위: `ai/multi-adapter-serving`, `ai/hybrid-kv-cache-allocation`, `ai/sliding-window-kv-and-attention-sinks`

## 묶음의 직속 부모

앞 묶음은 큰 모델의 순차 실행 횟수를 줄이는 방법을 설명했습니다. 이번 묶음은 한 추론 replica가 요청마다 달라지는 상태를 GPU 메모리에 어떻게 두고 회수하는지 두 갈래로 나눕니다.

1. 요청이 선택하는 상태: base 가중치는 공유하되 고객별 adapter와 soft prompt를 적재하고 구분합니다.
2. 요청이 실행되며 생기는 상태: 층별 attention 범위에 맞춰 KV block을 보관하고 창 밖 block을 반환합니다.

Adapter와 KV는 같은 GPU 메모리를 쓰지만 수명과 소유자가 다릅니다. Adapter는 요청이 고르고 cache가 적재하며, KV는 token 생성과 함께 늘고 allocator가 회수합니다. 따라서 하나의 선형 처리 단계처럼 합치지 않고 상위 지도에서 두 갈래로 보여 줍니다.

## 글 분류

| 글 | 트랙 | 이 글이 답할 질문 |
|---|---|---|
| 여러 adapter 서빙 | concept | 같은 base를 공유하면서 요청별 adapter가 batch·GPU cache·KV 재사용에서 섞이지 않게 하려면 무엇을 구분해야 하는가? |
| Hybrid KV cache | concept | Local layer가 최근 token만 읽는다는 사실이 실제 KV block 회수로 이어지려면 allocator가 무엇을 해야 하는가? |
| Sliding window KV와 attention sink | concept | 창 밖 block을 언제 반환할 수 있으며 처음 token을 남겨야 하는 모델은 무엇이 다른가? |

제품 채택이나 특정 서비스의 adapter 수·KV 용량 정책은 이번 묶음의 범위가 아닙니다. 기존 고정 소스와 설명용 수치 사례로 메커니즘을 확인하고, 실제 수용량과 지연은 별도 실무 글의 대상 환경에서 측정합니다.

## 보존할 근거와 경계

- Adapter 글의 8B base·rank 16·26 MiB 사례, SGMV 구간, GPU·CPU 두 층 cache, adapter를 포함한 prefix key를 유지합니다.
- Hybrid KV 글의 global 2층·local 6층·T=4,096·W=1,024 사례와 visibility·allocation 구분을 유지합니다.
- Sliding window 글의 W=8·block 4 사례, gpt-oss 32K 장부, vLLM·TensorRT-LLM의 block 반환 차이와 StreamingLLM 경계를 유지합니다.
- 논문 저자 측정과 설명용 계산을 대상 환경의 실측 결과로 바꾸지 않습니다.
- 시각 자료를 긴 설명과 수식보다 먼저 두되, 각 그림에서 실제로 세는 값과 이후 설명의 값이 일치해야 합니다.

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
