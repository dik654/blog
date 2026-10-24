# AI 서빙 묶음 08 · 두 종류의 기억

작성일: 2026-10-24
범위: `ai/qwen36-hybrid-architecture`, `ai/qwen36-hybrid-runtime`, `ai/qwen38-flash-next-architecture`

## 묶음의 직속 부모

앞 묶음은 한 replica 안에서 adapter와 KV가 서로 다른 수명으로 존재한다는 사실을 확인했습니다. 이번 묶음은 한 모델이 서로 다른 기억을 층마다 만들고, 런타임이 그 기억을 요청 하나의 과거로 유지하는 과정을 따라갑니다.

1. 기억의 모양: Qwen3.6의 3 DeltaNet + 1 Attention 반복에서 고정 recurrent state와 token별 KV가 생깁니다.
2. 요청 상태: KV·Delta matrix·convolution history를 같은 accepted prefix에 맞춰 commit·rollback합니다.
3. 희소 변형: Qwen3.8은 같은 3:1 리듬에서 full attention을 indexer 기반 희소 attention으로 바꾸고 indexer key cache를 더합니다.

구조와 런타임을 한 단계로 합치지 않습니다. 구조는 어떤 상태가 생기는지, 런타임은 그 상태의 생성·소유·확정·회수를 누가 맡는지 답합니다.

## 글 분류

| 글 | 트랙 | 이 글이 답할 질문 |
|---|---|---|
| Qwen3.6 하이브리드 아키텍처 | concept | 64개 층 중 어떤 층이 token별 KV를 남기고 어떤 층이 고정 state를 갱신하는가? |
| Qwen3.6 하이브리드 런타임 | concept | 모양이 다른 cache가 같은 요청의 승인된 과거를 가리키게 하려면 무엇을 함께 확정해야 하는가? |
| Qwen3.8 Flash-Next | reference | 3:1 혼합 원리를 희소 attention·MoE·n-gram 확장에 적용하면 상태와 회계가 어떻게 달라지는가? |

특정 엔진의 채택, 배포 GPU 수, SLO와 수용량 정책은 이번 묶음의 범위가 아닙니다. 고정된 공개 config·reference code·논문을 통해 구조와 상태 수명만 확인합니다.

## 보존할 근거와 경계

- Qwen3.6 글의 48 DeltaNet·16 Attention, BF16 KV token당 64 KiB, FP32 recurrent core 144 MiB 계산을 유지합니다.
- 런타임 글의 길이 비례 KV·요청당 고정 state 분리, prefill·decode·MTP의 prefix transaction을 유지합니다.
- Qwen3.8 글의 36 linear·12 sparse layer, indexer 선택 예산, gated residual, n-gram 표와 parameter class 구분을 유지합니다.
- 논리적 tensor byte를 특정 서빙 엔진의 물리 peak나 대상 환경의 실측값으로 바꾸지 않습니다.
- 각 글의 첫 시각 자료가 뒤의 설명·수식·코드 근거에서 쓰는 숫자와 같은 사례를 보여 주어야 합니다.

## 검증 상태

- [x] 대상 파일 ESLint
- [x] TypeScript
- [x] 전체 build와 strict audit
- [x] 390×844 가로 넘침과 지도 밀도
- [x] 1440×900 가로 넘침
- [x] 키보드와 중간 장면
- [x] reduced-motion
- [x] JavaScript 비활성 정적 본문과 부모 지도
- [x] 공개 경로

GitHub Pages run `40102878051`과 공개 모바일 경로 세 곳을 다시 확인했습니다. 각 경로는 HTTP 200이며 부모 지도·현재 위치·반환 지도가 정확히 한 번씩 나타납니다. 문서와 바깥 시각화의 가로 넘침은 0이고 console warning/error도 없었습니다.
