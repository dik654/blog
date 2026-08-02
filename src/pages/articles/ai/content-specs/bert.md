# BERT 재구성 명세

## 소유 질문

양방향 Transformer encoder가 정답 token을 그대로 복사하지 못하게 하면서 문장 전체 representation을 사전학습하고, 이를 서로 다른 downstream output contract로 어떻게 전이하는가?

## 경로 계약

- 이전 입력: Transformer encoder의 bidirectional self-attention, residual stream과 position/padding mask.
- 이 글의 출력: BERT input packing, MLM selection/corruption/label mask, NSP의 역사적 계약, task별 readout와 encoder 한계.
- 다음 선택: Sentence Embeddings의 pooling·contrastive objective 또는 decoder LLM 경로.
- 최소 역사선: Devlin et al. 2018. ELMo·ULMFiT의 전체 계보는 선택 source로 두고 기본 경로를 더 과거로 늘리지 않는다.

## 비공개 전이 문제

Training token 1,370개와 original BERT corruption policy가 있다. Batch `B=32`, sequence `N=128`, hidden `d=768`, label class `C=9`다.

본문을 읽은 독자는 다음을 스스로 해결할 수 있어야 한다.

1. MLM 선택 기대값 205.5개, `[MASK]` 164.4개, random 20.55개, unchanged 20.55개, direct loss 없음 1,164.5개를 계산하고 실제 batch count는 정수 표본으로 흔들릴 수 있음을 설명한다.
2. Unchanged 기대값 20.55개도 prediction target이며, attention weight나 loss weight 10%가 아님을 설명한다.
3. Causal target과 BERT masked target이 볼 수 있는 좌우 token을 표시한다.
4. Token·segment·position embedding과 padding mask를 다른 object로 구분한다.
5. Original NSP의 actual-next/random-next 50/50 input과 `[CLS]` binary head를 구성한다.
6. RoBERTa의 성능 차이에서 NSP 하나만 원인이라고 단정하지 않고 data·batch·step·masking 변경을 함께 표시한다.
7. Sequence `[B,d]->[B,C]`, token `[B,N,d]->[B,N,C]`, span start/end `[B,N]` head를 설계한다.
8. Original `[CLS]` pooler가 semantic distance에 직접 최적화된 embedding이 아닌 이유를 설명한다.

## 출처와 저자 의도

| 근거 | 복원할 의도 | 범위 |
|---|---|---|
| Devlin et al. 2018 | deep bidirectional pretraining을 작은 task head와 전체 fine-tuning으로 전이 | MLM, NSP, input packing, task contracts |
| Liu et al. 2019 | BERT recipe의 data·batch·step·masking·NSP를 다시 통제해 undertraining 분석 | NSP 단일 원인 과장 방지 |
| Tokenizer/runtime docs | WordPiece split, special token, padding attention mask | 실제 input IDs와 label alignment |
| Sentence-BERT | sentence similarity에 맞는 pooling·contrastive training | raw CLS embedding 오해 방지 |

## 전체 범위 지도

| 항목 | 깊이 | 이 글의 책임 | 경계 |
|---|---|---|---|
| Context direction | 깊게 | causal과 bidirectional visible set | decoder generation은 앞/별도 글 |
| Input packing | 깊게 | CLS·SEP·segment·position·padding | tokenizer 학습은 앞 글 |
| MLM | 깊게 | 선택 집합, corruption, label mask, 기대 count | ELECTRA 등은 후속 objective evidence |
| NSP | 깊게 | 50/50 pair head와 역사적 범위 | 문장 관계 전체 계보는 defer |
| Fine-tuning heads | 깊게 | representation·output shape·loss | task recipe 상세는 실전 글 |
| Sentence embedding | 짧고 정확하게 | raw CLS와 contrastive embedding 분리 | SBERT 글로 연결 |
| Limits | 깊게 | objective·length·efficiency·generation | 최신 long-context encoder는 별도 evidence |

## 섹션과 Viz

### 1. Bidirectional encoder
- Target position과 causal/BERT mode를 조작해 visible set을 표시한다.
- Bidirectional이 두 RNN 방향 concat이 아니라 attention access rule임을 분리한다.

### 2. Input contract
- Single/pair input을 전환해 token, segment, absolute position의 elementwise sum을 표시한다.
- Padding mask는 embedding이 아니라 score 접근 mask다.

### 3. Pretraining
- Token 수와 original/always-mask policy를 조작한다.
- Count는 stochastic sampling의 기대값으로 표시해 80/10/10을 정수 반올림으로 왜곡하지 않는다.
- NSP actual/random pair를 전환해 CLS binary head와 MLM head의 독립 loss를 보여 준다.

### 4. Fine-tuning
- Sequence/token/span/embedding mode에서 읽는 representation, tensor shape, head와 loss를 함께 변경한다.
- Subword token label alignment와 raw CLS semantic-distance 한계를 경고한다.

### 5. Limits
- Observation → consequence → response의 인과 흐름으로 objective, length, efficiency, generation을 전환한다.
- Sentence Embeddings와 decoder LLM의 두 다음 경로를 명시한다.

## 검증

- 390·768·1440px에서 formula scale 0.8 이상, inner scroll·clipping 없음.
- Context target/mode, pair packing, MLM count/policy, NSP pair, task head, limit axis를 전환한다.
- 공개 600-token 기본값에서 90/72/9/9/510이 정확히 보이고, 공개 slider의 최대 1,000-token 범위와 비공개 1,370-token fixture가 겹치지 않는다.
- Raw LaTeX와 비한글 FormulaNote가 없다.
