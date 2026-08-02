# Seq2Seq 재구성 명세

## 소유 질문

서로 다른 길이의 source와 target을 하나의 조건부 확률 모델로 연결할 때, encoder state 전달·teacher-forced loss·autoregressive search와 고정 길이 병목이 어디에서 생기는가?

## 경로 계약

- 이전 입력: LSTM의 `h_t`, `c_t`, layer·direction별 state shape와 장기 보존 한계.
- 이 글의 출력: encoder-decoder bridge, shifted target NLL, train/inference prefix 차이, prefix search, source-memory 병목.
- 다음 글: target step마다 encoder memory를 다시 읽는 Attention.
- 최소 역사선: Sutskever et al. 2014의 두 LSTM과 source reversal. 통계적 기계 번역의 phrase table 계보는 기본 경로 밖에 둔다.

## 비공개 전이 문제

Batch `B=32`, source length `m=12`, target prediction length `n=8`, layer `L=2`, hidden `h=256`인 단방향 LSTM encoder-decoder가 있다. Teacher forcing ratio는 0.75다. Decoding tree의 첫 확률은 `P(I)=.58`, `P(We)=.42`이고 다음 확률은 `P(am|I)=.51`, `P(stay|I)=.49`, `P(stay|We)=.92`, `P(are|We)=.08`이다.

본문을 읽은 독자는 다음 논리를 스스로 구성할 수 있어야 한다.

1. Encoder의 `h_n,c_n`과 decoder initial state가 각각 `[L,B,h]`임을 계산하고, 두 tensor가 source 길이와 무관한 이유를 설명한다.
2. Decoder input `[BOS,y_1,...,y_{n-1}]`와 target `[y_1,...,EOS]`를 만들고 masked NLL을 구성한다.
3. BOS를 제외한 feedback slot이 `n-1`개이므로 ratio .75에서 기대 gold/self input 수를 구분한다.
4. Greedy가 `I -> am`을 선택해도 beam 2가 `We -> stay`의 더 큰 joint probability를 발견하는 과정을 prefix별로 계산한다.
5. Raw log probability가 길수록 작아지는 이유와 length normalization이 model probability 자체를 바꾸지 않는다는 점을 설명한다.
6. Source reversal이 첫 target과 대응하는 source token 사이 recurrent path를 짧게 했던 최적화 장치임을 설명한다.
7. Attention이 encoder를 제거한 것이 아니라 마지막 state 하나만 전달하던 memory interface를 바꾼 것임을 지목한다.

## 출처와 저자 의도

| 근거 | 복원할 의도 | 범위 |
|---|---|---|
| Sutskever, Vinyals, Le 2014 | 두 multilayer LSTM으로 가변 길이 transduction을 end-to-end 학습하고 source reversal로 aligned dependency를 짧게 만든다. | 고정 vector와 autoregressive decoder의 출발점 |
| Bahdanau, Cho, Bengio 2015 | 고정 길이 vector를 성능 병목으로 지목하고 target step별 soft search로 바꾼다. | 다음 Attention 글의 문제 정의 |
| Bengio et al. 2015 | 학습의 gold previous token과 추론의 generated token 불일치를 curriculum으로 줄이려 한다. | Scheduled sampling은 역사적 대응이며 보편 해법으로 단정하지 않는다. |
| CS224N NMT assignment | Encoder masking, decoder projection, target shift와 loss shape를 구현 계약으로 확인한다. | 교육용 tensor 검산 |

## 전체 범위 지도

| 항목 | 깊이 | 이 글의 책임 | 실패 위험 |
|---|---|---|---|
| Conditional sequence factorization | 깊게 | product와 summed NLL 연결 | token loss와 sequence probability 단절 |
| Encoder-decoder state bridge | 깊게 | `h_n,c_n [L,B,h]` | context를 scalar vector 하나로 오해 |
| Source reversal | 짧고 정확하게 | dependency path 단축 | 역사 trivia로 소비 |
| Teacher forcing | 깊게 | BOS, shifted inputs, feedback slots | ratio와 timestep 수 계산 오류 |
| Exposure bias | 깊게 | 관찰되는 prefix 분포 차이 | 단일 heuristic을 완전 해법으로 과장 |
| Greedy/beam search | 깊게 | 실제 expansion과 pruning | 완성 문장 표를 beam search로 오해 |
| Length normalization | 깊게 | search score와 model probability 분리 | decoding이 model을 개선한다고 오해 |
| Attention handoff | 깊게 | fixed bridge에서 external memory로 전환 | Attention을 decoder 장식으로 오해 |
| BLEU·modern decoding | defer | 평가·추론 전용 글의 책임 | 이 글의 핵심 search 계산을 흐림 |

## 섹션과 Viz

### 1. 조건부 sequence 생성

- Concept: source를 읽고 BOS부터 EOS까지 target을 생성한다.
- 핵심 식: `P(y|x)=prod_t P(y_t|y_<t,x)`.
- Viz: source → encoder → bridge → decoder의 네 실행 단계.
- Edge case: EOS가 없으면 maximum length나 stopping contract가 필요하다.

### 2. 고정 길이 bridge와 source reversal

- Concept: 모든 source state를 계산해도 attention 이전 decoder에는 final `h_n,c_n`만 전달한다.
- Key shape: 각 state `[L,B,h]`, 전달 scalar 수 `2LBh`.
- Viz 1: source length와 layer·hidden을 바꾸면 encoder steps는 늘지만 bridge shape의 source 축은 늘지 않는다.
- Viz 2: normal/reversed source에서 첫 target까지의 recurrent edge 수를 비교한다.
- Failure mode: bidirectional encoder와 decoder의 layer/width가 다르면 concat·projection mapping이 필요하다.

### 3. Teacher-forced target shift

- Concept: BOS는 고정 시작 입력이고 이후 `n-1`개 feedback slot만 gold/model 선택의 대상이다.
- Execution: decoder input shift → logits → target-aligned NLL → PAD mask.
- Viz: ratio와 target length를 조작해 gold/self feedback 수와 `0.92^n` 설명용 누적 성공률을 분리한다.
- Failure mode: inference metric을 teacher-forced token accuracy로 대체하면 error cascade를 숨긴다.

### 4. Prefix search

- Concept: greedy local maximum과 joint sequence maximum은 다르다.
- Execution: current beam expand → joint probability/log probability 계산 → top-k prune → EOS 처리.
- Viz: stage 1~3과 beam width 1~3을 조작해 살아남은 prefix와 잘린 prefix를 같은 높이 행으로 표시한다.
- Failure mode: 큰 beam은 model calibration과 length bias를 더 정확히 최적화해 task metric을 악화시킬 수 있다.

### 5. Attention bridge

- Concept: encoder state 전체를 보관하고 decoder step별 `c_t`를 새로 만든다.
- 핵심 식: `alpha_t=softmax(e_t)`, `c_t=sum_i alpha_ti h_i`.
- Viz: decoder step을 바꾸면 source weight와 context가 함께 바뀐다.
- Handoff: 다음 글에서 score·mask·stable softmax·value sum을 완전히 분해한다.

## 검증

- 390·1440px에서 formula scale 0.8 이상, inner scroll·clipping 없음.
- Source length·layer·hidden, source order, teacher forcing·length, beam width·stage, decoder attention step을 실제로 전환한다.
- Beam explorer는 prefix 확장 전 확률과 누적 확률을 같은 데이터에서 계산한다.
- Raw LaTeX와 비한글 FormulaNote가 없다.
