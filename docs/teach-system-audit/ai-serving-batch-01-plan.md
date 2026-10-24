# AI 서빙 묶음 01 · KV cache 상태와 표현

작성일: 2026-10-24
범위: `ai/kv-cache-fundamentals`, `ai/kv-cache-quantization`

## 묶음의 직속 부모

Transformer의 autoregressive decode가 현재 위치를 계산할 때 과거 K·V를 다시 읽는다는 사실이 직속 부모입니다. 이 묶음은 그 상태를 다음 네 결정으로 나눕니다.

1. 상태: Q는 현재 조회에 쓰고 K·V는 다음 위치까지 남깁니다.
2. 표현: 같은 K·V를 BF16·FP8 같은 숫자 형식으로 저장합니다.
3. 할당: 가변 길이 상태를 고정 크기 block에 놓습니다.
4. 재사용: 앞부분 조건이 같은 요청만 이미 만든 block을 공유합니다.

이번 배치는 1·2를 닫고, 3·4는 뒤의 `vllm-paged-attention`, `prefix-caching-radix-attention` 글로 연결합니다.

## 글 분류

| 글 | 트랙 | 이 글이 답할 질문 |
|---|---|---|
| KV cache 기초 | concept | 현재 Q와 다음 위치까지 남는 K·V는 수명과 byte가 어떻게 다른가? |
| KV cache 양자화 | concept | 같은 K·V를 작은 숫자로 저장할 때 쓰기·읽기 계약과 오차가 어디에 생기는가? |

제품 선택, 운영 SLO, 배포 절차는 이 두 개념 글의 범위가 아닙니다. vLLM·TensorRT-LLM·llama.cpp는 메커니즘을 확인하는 고정 원문 구현으로만 사용합니다.

## 보존한 근거

- KV 기초의 3→4위치, 48→64byte, Q 16byte, GQA head 매핑, MQA·GQA·MLA 비교와 고정 Transformers·모델 config 근거를 유지했습니다.
- KV 양자화의 token당 128KiB→64KiB, 40GiB pool, FP8 왕복 오차, scale 단위, vLLM 쓰기 kernel, TensorRT-LLM·llama.cpp·KIVI 경계를 유지했습니다.
- 측정하지 않은 처리량·품질 향상을 결과처럼 쓰지 않았습니다.

## 이번 변경

- 두 글이 같은 `KVCacheSeriesLocator`를 사용해 직속 부모와 네 결정을 먼저 보여줍니다.
- 각 글 끝에서 새로 확인한 사실을 같은 지도에 되돌려 놓습니다.
- 핵심 가정 장면은 설명 문단보다 먼저 보이도록 옮겼습니다.
- 두 경로를 JavaScript 비활성 정적 본문 생성 목록에 등록했습니다.

## 검증 상태

- [x] 대상 파일 ESLint
- [x] TypeScript (`NODE_OPTIONS=--max-old-space-size=8192`)
- [x] 390×844 가로 넘침 0
- [x] 핵심 가정 장면이 설명보다 먼저 배치됨
- [x] 부모 지도와 되돌아가기 링크 존재
- [x] 전체 build와 strict audit
- [x] 1440×900 가로 넘침 0
- [x] 키보드·reduced-motion·명시적 재생·뷰포트 이탈 정지
- [x] JavaScript 비활성 정적 본문과 부모 지도
- [x] 공개 경로
