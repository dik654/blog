# Claude-Codex current bridge gaps reconstruction report

사용자가 제공한 최신 개념 inventory를 기존 글과 대조한 결과, 대부분은 이미 Reasoning, tokenizer, LLM architecture, SSM, video, control과 CUDA 기반 글에 소유자가 있었다. 실제로 학습 흐름이 끊긴 세 곳만 새 current-first bridge로 만들었다.

## 1. 추가한 세 경로

1. `FlashAttention · Triton`: Transformer 수학에서 HBM traffic, online softmax, tile residency와 kernel diagnosis로 내려간다.
2. `Deformable DETR`: ViT 분류에서 set prediction, dense DETR 병목, sparse multi-scale sampling과 AP_small 진단으로 이어진다.
3. `HTML Table Reconstruction`: OCR/VLM 출력에서 rowspan·colspan occupancy grid, invariant, conservative backfill과 semantic RAG 검증으로 이어진다.

각 글은 GPU ML kernel, Vision Detection, OCR Table learning path에 배치했다. 연구 지도에서 FlashAttention은 AI 효율화 경로가 GPU category 글을 cross-link하도록 category-aware link를 추가했다.

## 2. 비공개 전이 문제

- FlashAttention이 1.1배만 빠를 때 attention runtime share, sequence/head shape, actual traffic, compute, occupancy, framework dispatch와 hardware fallback을 순서대로 진단한다.
- Q=300, M=8, L=4, K=4에서 decoder layer당 38,400 sample을 계산하고 sparse efficiency와 AP_small 보장을 구분한다.
- 손상된 HTML에서 이전 rowspan이 예약한 slot, 진짜 missing cell, wrong colspan, overlap과 C 밖 overflow를 분리하고 불확실한 slot은 값 생성 없이 review로 남긴다.

## 3. Claude 반례 검토와 수정

- Flash 진단에 Amdahl 상한과 dispatch/hardware row를 추가했다.
- Deformable 수식에 head 축 M과 head projection을 넣어 `Q*M*L*K`가 식에서 직접 나오게 했다. Feature pyramid 표시는 P3-P6, stride 1/8-1/64로 고쳤다.
- Table Viz가 overflow를 overlap이라고 부르고 malformed row에서 C를 다시 계산하던 오류를 고쳤다. Schema C=3을 고정하고 active rowspan, unresolved missing과 overflow를 별도 색·문장으로 표시했다.
- 모바일에서 길던 Deformable 식과 Flash tile budget을 여러 display line으로 나눴다.
- ScaleLogic의 출처를 Wang et al., 공개일을 2026-05로 공식 arXiv와 일치시켰다.

## 4. 출처와 주장 경계

- FlashAttention/FlashAttention-2 논문과 공식 repository: exact IO-aware algorithm과 지원 shape. 보편 speedup은 주장하지 않는다.
- Triton 공식 tutorial: fused softmax의 on-chip residency. Triton 사용 자체가 최적 schedule을 보장하지 않는다.
- DETR/Deformable DETR 원 논문: set prediction과 sparse multi-scale sampling. Sparse read가 작은 객체 정확도를 자동 보장하지 않는다.
- PubTabNet/TEDS와 PaddleOCR-VL 문서: structured HTML 평가와 현재 parser output. TEDS가 header lineage나 business invariant를 대체하지 않는다.

## 5. 검증 결과

- 변경 파일 ESLint 통과, production build 통과
- 세 글 desktop/mobile 6회 검사: runtime error 0, document/article overflow 0, KaTeX error 0
- 수정 후 모바일 최소 수식 scale: Flash 0.89, Deformable 0.89, Table 0.91
- 모든 interactive control과 계산 결과 전환 확인
- GPU parent/leaf, Vision, OCR category와 AI 효율화 cross-category link 확인
- 통합 Viz/narrative audit desktop/tablet/mobile errors 0, warnings 0

## 6. 4B·9B 재현 규칙

먼저 inventory를 existing owner에 매핑한다. 새 글은 계산 계약, 데이터 구조 또는 실패 진단을 새로 소유할 때만 만든다. 4B 모델에는 한 bridge와 한 private test를 주고 JSON IR을 먼저 출력시킨다. 9B 모델에는 세 bridge의 dependency와 stop rule, source boundary, mobile acceptance를 묶어 준다. 최종 critic은 반드시 잘못된 용어 분류와 UI가 가르치는 수치가 본문과 일치하는지를 본다.

## 7. Production acceptance

- `cm-blog.service`를 2026-07-21 12:30:59 KST에 재시작하고 active 상태를 확인했다.
- 외부 도메인의 10개 경로를 desktop/mobile에서 20회 검사했다. HTTP·runtime·overflow·KaTeX·수식 가독성 실패는 0건이었다.
- 외부에서 Flash mode, DETR sample 계산, table overflow, graph fidelity와 FROST offline 문장을 직접 확인했다.
- GPU, Vision, OCR와 Wallet current leaf의 링크를 외부 주소에서 확인했다.
- 전체 learning-flow audit: registered 567, release blockers 0, formula gaps 0. 기존 enrichment/prerequisite backlog는 별도 지속 작업으로 남긴다.
