# AI 기초 batch 01 작성 계획

대상: `ai/perceptron`, `ai/neural-network`, `ai/training-memory-budget`,
`ai/spiking-neural-networks`, `ai/autoencoder`, `ai/linear-autoencoder-pca`

이 문서는 기존 본문을 지우기 전에 독자·주장·수치·질문·배치 위치를 고정하는 작업
원장이다. 여섯 글은 실제 catalog의 읽기 순서대로 한 편씩 작성하고 검증한다.

## 1. Perceptron

### 작성 카드

- 독자: 좌표와 덧셈은 알지만 선형 분류기와 학습 규칙은 처음 보는 독자
- 문서 유형: 작은 수치 사례에서 실제 식과 한계까지 올라가는 설명 글
- 질문: 네 개의 0·1 입력을 어떻게 가르고, 틀렸을 때 그 기준을 어떻게 고치는가?
- 한 문장 답: 입력을 점수 하나로 줄여 0을 기준으로 가르고, 오답이 난 입력 방향으로
  점수표를 옮기면 되지만, 이 방법은 직선 하나로 나뉘는 문제까지만 푼다.
- 읽고 난 뒤의 판단: 데이터가 선형 분리 가능한지, 업데이트가 멈출 조건이 있는지,
  비선형 중간 표현이 필요한지 설명한다.
- 이 글에서 다루지 않는 것: 일반 신경망의 역전파·확률 보정·현대 최적화 구현은
  각각의 정본 글로 넘긴다.

### 같은 사례

두 입력이 모두 1일 때만 문이 열리는 AND 장면을 사용한다. 직접 만든 교육용 수치는
모두 `(가정)`으로 표시한다.

1. 네 입력: `(0,0)`, `(1,0)`, `(0,1)`, `(1,1)`
2. 첫 판정표: `w=(0.5,0.5)`, `b=-0.7`
3. 계산: 앞의 세 입력은 `-0.7,-0.2,-0.2`, 마지막 입력은 `0.3`
4. 학습 추적의 시작: `w=(0.5,0.5)`, `b=-1.1`, `η=0.1`
5. `(1,1), y=1`에서 첫 점수 `-0.1`, 예측 `0`, 오차 `1`
6. 한 번 고친 뒤 `w=(0.6,0.6)`, `b=-1.0`
7. 네 입력 점수는 `-1.0,-0.4,-0.4,0.2`가 되어 AND를 모두 맞힌다.

### 사실 원장

| ID | 내용 | 근거 | 배치 |
|---|---|---|---|
| P1 | Rosenblatt 논문은 1958년 *Psychological Review* 65(6), 386–408에 실렸다. | DOI `10.1037/h0042519`, PubMed PMID 13602029 | 원문 절 |
| P2 | 고전적 업데이트는 오분류일 때 정답 부호와 입력 방향으로 weight를 고친다. | Rosenblatt 원문과 Novikoff 수렴 증명 | 한 요청 추적 |
| P3 | `||x_i||≤R`, unit separator margin `γ>0`이면 mistake bound는 `(R/γ)^2`이다. | Novikoff 1962, *On Convergence Proofs for Perceptrons* | 수렴 절 |
| P4 | XOR 네 점은 직선 하나로 분리되지 않는다. | 본문의 네 부등식 모순으로 직접 확인 | 한계 절 |
| P5 | scikit-learn의 `Perceptron`은 `SGDClassifier(loss="perceptron", learning_rate="constant")`를 고정한 구현이다. | scikit-learn 공식 source `_perceptron.py` | 구현 경계 |
| P6 | 단일 은닉층 근사 정리는 해의 존재를 말하며 optimizer·표본 효율을 보장하지 않는다. | Cybenko 1989 | 확장 절 |

### 질문과 답 위치

| 질문 | 제기 | 답 |
|---|---|---|
| 왜 네 상태를 숫자 하나로 줄이는가? | 1절 | 2·3절 |
| 이름을 붙이면 각 숫자는 무엇인가? | 2절 | 3절 |
| 틀린 판정을 어떤 순서로 고치는가? | 3절 | 4절 |
| 업데이트가 언젠가 끝나는가? | 4절 | 6절 |
| XOR에서는 왜 끝나지 않는가? | 6절 | 7절 |
| 층을 더하면 무엇이 달라져야 하는가? | 7절 | 8절 |

### 본문 순서

1. S: 두 센서가 모두 켜져야 문이 열리는 사건과 한 문장 답
2. B·0: 네 입력과 네 점수를 한 화면에서 세기
3. 1·2·3: 합산·기준 이동·이진 판정의 필요를 본 뒤 표준 이름 붙이기
4. 4: 같은 `(1,1)` 오답을 의사코드 한 줄씩 고쳐 네 상태를 다시 검사
5. 5: Rosenblatt 원문이 실제로 말한 범위와 현대 구현 경계
6. 5·6: margin 두 길이에서 수렴 상한 유도
7. 7: XOR 부등식 모순
8. 7: 비선형 중간 표현으로 바뀌는 경로와 다음 `neural-network` 글
9. 복습: 세 예측 질문과 답 절

### 보존 배치표

- 생물학적 뉴런 비유와 그 한계 → 용어를 붙인 뒤 원문 절의 역사적 맥락
- 두 주요 수식과 모든 기호·전제 → 4절과 6절
- AND·OR·NAND 파라미터와 “해는 유일하지 않음” → 5절
- `R`, `γ`, Cauchy–Schwarz 연결과 XOR·label noise 반례 → 6절
- Minsky·Papert와 AI 겨울을 단일 원인으로 보지 않는 경계 → 7절 보충 문단
- activation 없는 affine 합성, universal approximation, 현대 MLP 역할 → 8절

## 2. 나머지 다섯 글의 고정 질문

| route | 한 문장으로 남길 답 | 이어질 꼬리 질문 |
|---|---|---|
| `ai/neural-network` | 신경망은 입력을 여러 번 다시 표현해 원래 좌표에서 직선으로 가르지 못한 문제를 마지막 좌표에서는 가를 수 있게 만든다. | 중간 변환을 여러 번 쌓기만 하면 되는가? |
| `ai/training-memory-budget` | 학습 메모리는 가중치 크기가 아니라 가중치·기울기·최적화 상태·역전파용 중간값의 합으로 센다. | 어떤 항을 버렸다가 다시 계산할 수 있는가? |
| `ai/spiking-neural-networks` | SNN은 값을 매번 바로 내보내지 않고 막전위 상태를 쌓아 문턱을 넘은 순간만 사건으로 보내는 시간 모델이다. | 끊긴 0·1 문턱을 어떻게 학습하는가? |
| `ai/autoencoder` | 오토인코더는 정답 라벨 대신 입력 자체를 복원하게 하되, 복사하지 못하도록 정보 경로를 제한해 중간 표현을 배운다. | 복원을 잘하면 표현도 반드시 유용한가? |
| `ai/linear-autoencoder-pca` | 중심화·선형 변환·rank-k·제곱 오차를 모두 고정했을 때만 최적 복원 부분공간이 PCA와 같다. | 좌표까지 같은가, 부분공간만 같은가? |

각 글은 앞 글의 답에서 생긴 질문으로 시작하며, 실제 수정 전에 같은 형식의 수치 원장과
보존 배치표를 이 문서에 덧붙인다.

## 3. Autoencoder family

### 분류와 부모 관계

| route | track · form | 직속 부모 | 이 글이 닫을 질문 |
|---|---|---|---|
| `ai/autoencoder` | concept · explanation | `ai/deep-learning-overview`의 representation 영역 | 정답 label 없이 input 자체를 target으로 쓸 때 무엇을 제한해야 단순 복사와 다른 중간 표현을 배울 수 있는가? |
| `ai/linear-autoencoder-pca` | concept · explanation | `ai/autoencoder`의 bottleneck 영역 | 어떤 전제를 모두 만족할 때 linear autoencoder의 최적 복원 부분공간이 PCA와 같아지는가? |
| `ai/denoising-masked-autoencoders` | concept · explanation | `ai/autoencoder`의 input·target 영역 | input 일부를 손상하거나 숨기면 encoder가 보는 값과 loss가 비교하는 값은 어떻게 달라지는가? |
| `ai/reconstruction-anomaly-detection` | practice · decision | `ai/autoencoder`의 reconstruction score | 한 sample의 복원 오차를 실제 경보로 바꾸려면 threshold·검증 자료·drift·rollback을 누가 소유해야 하는가? |

Concept 세 글은 제품 선택이나 운영 체크리스트를 본문에 섞지 않는다. Anomaly detection 글은
autoencoder 전체를 다시 설명하지 않고 `reconstruction objective`와 `identity failure` anchor에서
출발한다.

### 같은 수치 사례

첫 세 글은 네 자리 자료 `x=[1.0, 0.0, 0.8, 0.2]`를 공통 출발점으로 삼는다. 교육용 encoder는
첫째·셋째 자리와 둘째·넷째 자리를 각각 평균내어 `z=[0.9, 0.1]`을 만든다고 가정한다. Decoder가
두 값을 원래 묶음에 되돌리면 `x̂=[0.9, 0.1, 0.9, 0.1]`이고, 네 자리의 제곱 오차는 모두 `0.01`,
MSE는 `0.01`이다. 이 숫자는 실제 학습 결과가 아니라 계산 경로를 보여 주는 `(가정)`이다.

Linear PCA 글에서는 같은 네 자리를 2차원 sample 두 개 `[(1.0,0.0),(0.8,0.2)]`로 다시 묶어
평균을 빼고 rank-1 복원을 비교한다. Denoising 글에서는 값의 변화가 보이도록 셋째 자리 0.8을 숨긴 input과 clean target을
구분한다. Anomaly practice 글은 별도의 운영 fixture `정상 score 100개 + labeled anomaly 20개`를
사용하며, 측정하지 않은 threshold나 성능은 결과처럼 쓰지 않는다.

### 시각화 순서

1. 글의 질문과 숫자를 한두 문장으로 제시한다.
2. 독자가 값을 직접 셀 수 있는 정적 또는 단계 선택형 그림을 긴 설명보다 먼저 둔다.
3. 그림 아래에서 표준 이름을 붙이고 같은 숫자를 수식에 대입한다.
4. 개념 글은 실패 경계와 부모 지도 반환으로 끝낸다.
5. 실무 글은 state owner, baseline, validation, recovery, rollback, 결정을 뒤집는 조건까지 이어간다.

`src/pages/articles/ai/autoencoder/viz/AutoencoderRoundTripViz.tsx`는 다른 작업이 만든 미추적 파일이므로
이 묶음에서 수정·삭제·커밋하지 않는다. 공개 글은 현재 추적 중인 파일만으로 독립적으로 빌드되어야 한다.

## 4. Multimodal generation·retrieval family

### 분류와 부모 관계

| route | track · form | 직속 부모 | 이 글이 닫을 질문 |
|---|---|---|---|
| `ai/vision-language-model-architecture` | concept · explanation | `ai/multimodal-learning-overview`의 model 영역 | image patch가 어떤 배열과 연결 부품을 거쳐 LLM 입력 token이 되는가? |
| `ai/multimodal-retrieval-and-visual-grounding` | concept · explanation | 앞 글의 generation·retrieval 경계 | text query가 후보 이미지를 고르는 일과 선택한 이미지 안의 위치를 찾는 일은 어디서 갈리는가? |

두 글은 모두 concept 글이다. API 선택, 검색 서비스 SLO, vector DB 운영, 모델 배포와 같은 환경별
판단은 넣지 않는다. 첫 글은 생성 경로의 visual token을, 둘째 글은 dual encoder의 similarity와
grounding 출력을 소유한다. 두 출력이 이름만 비슷한 하나의 shared-representation pipeline인 것처럼
이어 붙이지 않는다.

### 같은 사례와 경계

첫 글은 224×224의 빨간 컵 이미지를 patch 14로 나눠 `16×16=256`개 patch를 만든다. LLaVA의
공개 예를 따라 CLIP ViT-L/14의 `256×1024` 표현을 linear projector로 Vicuna-13B 입력 차원인
`256×5120`으로 옮긴다. 이 수치는 모델 전체의 공통 규격이 아니라 특정 논문 설정이다.

둘째 글은 query `빨간 컵`을 `q=(1,0)`, 후보를 `A=(0.8,0.6)`, `B=(0,1)`,
`C=(−0.6,0.8)`로 둔다. 길이가 1인 교육용 벡터이므로 cosine similarity는 내적과 같아
`0.8, 0, −0.6`이 된다. Retrieval은 A를 선택한 순간 끝나며, bounding box·point·mask는
선택한 A를 다시 입력받는 별도의 grounding 단계에서 얻는다.

### 보존·교체 기준

- LLaVA·Flamingo·BLIP-2의 연결 위치와 frozen/trained 범위는 각 원 논문으로 다시 확인해 보존한다.
- CLIP·ColPali·Kosmos-2는 각각 dual-encoder similarity, document screenshot retrieval,
  grounding의 근거로만 사용한다.
- 기존의 “생성형 VLM 뒤에서 retrieval과 grounding이 같은 표현을 이어 쓴다”는 배치는 교체한다.
- 모든 동작 시각화는 자동 시작하지 않고, 한 번 재생한 뒤 멈추며, 키보드와 reduced-motion에서도
  같은 순서와 결론을 제공한다.

## 5. Distributional semantics family

### 분류와 부모 관계

| route | track · form | 직속 부모 | 이 글이 닫을 질문 |
|---|---|---|---|
| `ai/distributional-semantics` | concept · explanation | `ai/tokenizer`에서 만들어진 token sequence | 주변에서 함께 관측된 횟수를 어떻게 비교 가능한 단어 벡터로 바꾸며, 압축 뒤의 cosine은 무엇까지 말할 수 있는가? |

이 글은 제품·vector database·운영 SLO를 고르지 않는다. 문자열에서 count, PPMI, 저차원
vector, 평가 경계까지 하나의 관측 계약을 추적하고 다음 `Word2Vec` 계열 글로 반환한다.

### 같은 수치 사례

행은 `[고양이, 강아지, 행성]`, 열은 `[반려, 먹이, 공전]`이며 count matrix는
`[[4,3,0],[3,4,0],[0,0,5]]`이다. 전체 관측 수는 19이고 행·열 합은 모두
`[7,7,5]`이다. 고양이–반려 pair의 자연로그 PMI는
`ln((4/19)/((7/19)²))=ln(76/49)≈0.439`이다.

PPMI matrix의 singular value는 약 `1.335, 0.590, 0.288`이다. Rank 2에서는 마지막
방향을 버려 squared Frobenius error가 약 `0.083`이 된다. 고양이와 강아지 row의
cosine은 PPMI에서 약 `0.616`, rank-2 근사에서 `1`이 된다. SGNS의 독립 cell 분석에
negative sample `k=5`를 적용한 shifted score는 `0.439−ln5≈−1.170`이다. 모두 계산
흐름을 연결하기 위한 교육용 가정이며 실제 학습 결과가 아니다.

### 본문과 시각화 순서

1. Token sequence에서 관측쌍 19개, count matrix, PPMI, rank 2, cosine 변화까지 전체 흐름을 먼저 본다.
2. 같은 matrix의 한 cell을 골라 행·열·관측 규칙의 뜻을 확인한다.
3. `4/19`, `7/19`, `76/49`, `ln`을 한 단계씩 계산해 빈도에서 PPMI로 넘어간다.
4. 세 singular value 중 무엇을 남기고 무엇을 버리는지 본 뒤 수식 이름을 붙인다.
5. Explicit PPMI+SVD와 sampled SGNS가 같은 계산이라는 오해를 경계한다.
6. 높은 cosine을 의미 동일성으로 해석하기 전에 압축·반의어·bias·task 평가 경계를 확인한다.

모션은 사용자가 재생한 뒤 단계마다 실제 수치와 상태가 바뀌고 마지막 장면에서 멈춘다. 장식용
페이드나 자동 재생은 사용하지 않는다. JavaScript가 없어도 같은 수치와 결론은 본문 순서로 남긴다.

## 6. RNN에서 Attention까지

### 분류와 질문의 경계

| route | track · form | 이 글이 소유하는 질문 |
|---|---|---|
| `ai/rnn` | concept · explanation | 현재 입력과 직전 state를 같은 transition으로 반복 갱신하면 과거 정보가 어떻게 다음 시점으로 전달되는가? |
| `ai/rnn-language-model` | concept · explanation | 현재 state를 vocabulary 전체의 다음-token probability와 평가값으로 어떻게 바꾸는가? |
| `ai/bptt` | concept · explanation | 여러 시점에서 공유한 weight의 책임을 어떻게 합치며, 긴 시간 경로에서 gradient가 왜 달라지는가? |
| `ai/lstm` | concept · explanation | 보존·쓰기·공개 경로를 cell과 gate로 어떻게 분리하는가? |
| `ai/gru` | concept · explanation | reset과 update 두 gate로 candidate와 최종 hidden을 어떻게 만드는가? |
| `ai/seq2seq` | concept · explanation | source sequence를 조건으로 길이가 다른 target sequence를 어떻게 생성하는가? |
| `ai/attention-theory` | concept · explanation | 현재 query가 source memory의 필요한 위치를 매 시점 어떻게 다시 읽는가? |

이 묶음은 하나의 긴 RNN 설명으로 합치지 않는다. 각 글은 바로 앞 글에서 생긴 질문만 이어받고,
자신이 소유하지 않는 메커니즘은 정확한 anchor로 넘긴다. 공통 locator는 `상태 → 예측 → 학습 →
보존 → 변환 → 조회`의 위치와 직속 부모를 함께 보여 준다.

### 공통 fixture와 반환 경로

RNN은 `hₜ=tanh(0.8hₜ₋₁+0.5xₜ)`, `h₀=0`, 입력 `1→0→1`을 사용한다. 따라서 state는
약 `0.462→0.354→0.654`가 된다. 언어 모델은 `[BOS, 나, 간다, EOS]`를 세 shifted pair로
나누며, BPTT는 같은 weight의 시점별 contribution `2, −1, 3`을 합쳐 `4`로 만든다.

LSTM은 `Cprev=2, f=.5, i=.75, g=.5, o=.5`에서 `C=1.375`, `h≈.44`를 계산한다.
GRU는 `hprev=(2,−1)`, `r=(0,.5)`에서 filtered history `(0,−.5)`를 만들고,
`hprev=2, candidate=10, z=.25`에서 새 state `4`를 만든다. 모두 메커니즘을 읽기 위한
교육용 가정이며 benchmark나 실제 학습 결과가 아니다.

### 시각화 규칙

기존 시각화는 선택하지 않은 장면도 흐리게 한 화면 아래에 계속 쌓아 모바일에서 1,000px가 넘었다.
이를 현재 장면 하나만 교체하는 방식으로 바꾸고, 다음 상태가 실제로 달라지는 장면만 재생한다.
자동 시작과 무한 반복은 사용하지 않으며 마지막 장면에서 멈춘다. RNN·언어 모델·BPTT·LSTM·GRU
모두 키보드와 reduced-motion을 같은 공통 controller로 처리한다.

첫 모바일 계측에서 내부 캔버스 높이는 언어 모델 `1,575→588px`, BPTT `1,044→474px`,
LSTM `1,458→573px`, GRU `1,308→627px`로 줄었다. 이 값은 390×844 브라우저에서 DOM
bounding box로 확인한 레이아웃 수치이며 모델 성능 지표가 아니다.

## 7. Tokenizer에서 BERT까지

### 분류와 학습 경로

| route | track · form | 직속 부모 | 이 글이 닫을 질문 |
|---|---|---|---|
| `ai/tokenizer` | concept · explanation | `ai/text-unicode-encoding` | 문자열이 어떤 규칙을 거쳐 model input ID가 되며, 그 규칙은 왜 checkpoint와 함께 움직여야 하는가? |
| `ai/transformer-architecture` | concept · explanation | `ai/attention-theory#self-attention` | token 위치의 정보 조회와 각 위치의 feature 변환을 어떤 반복 block으로 구성하는가? |
| `ai/bert` | concept · explanation | `ai/transformer-architecture` | 양방향 encoder visibility가 각 token의 contextual state를 어떻게 만드는가? |
| `ai/bert-input-packing` | concept · explanation | `ai/bert#input-contract` | special token·position·segment·padding을 같은 길이의 네 입력으로 어떻게 맞추는가? |
| `ai/bert-mlm-corruption` | concept · explanation | `ai/bert-input-packing#padding-mask` | 15% target 선택과 80·10·10 입력 오염을 왜 별도 sampling으로 보아야 하는가? |
| `ai/bert-pretraining-objectives` | concept · explanation | `ai/bert-mlm-corruption#objective` | NSP·SOP·RTD가 어느 단위에 어떤 정답을 붙이는가? |
| `ai/bert-task-heads` | concept · explanation | `ai/bert#contextual-state` | 같은 contextual state를 문장·token·span·검색 출력으로 어떻게 바꾸는가? |

공통 locator는 `문자 → 순서 → 조회 → 변환 → 이해`에서 현재 위치를 먼저 보여 주고, BERT 묶음에서는
`가시성 → 입력 → 복원 → 비교 → 전이`를 한 단계 더 펼친다. 제품 선택·서빙 SLO·운영 Runbook은 이
개념 묶음에 섞지 않는다.

### 같은 사례와 시각화 순서

Tokenizer는 `Ａ각!`을 NFKC로 `A각!`로 바꾸고 구두점을 분리한 뒤 `A:10 · 각:20 · !:30`을 조회해
`[1,10,20,30,2]`를 만든다. Transformer는 `[BOS, 나는, 밥을]`을 `B=1, N=3, D=4`의 교육용
tensor로 놓고 두 attention head와 `d_ff=8`인 FFN을 지나 마지막 위치의 vocabulary logits까지
추적한다. 이 값들은 메커니즘을 고정해 읽기 위한 가정이며 실제 모델 규격이나 성능 측정값이 아니다.

BERT 시각화는 정의 카드보다 먼저 배치하고, 각 글에서 같은 입력의 상태가 실제로 바뀌는 네 장면만
보여 준다. MLM의 `10,000×15%=1,500` target과 그 안의 `1,200/150/150` 분기는 전체 token과
선택된 target을 섞지 않도록 분리한다. 자동 시작과 무한 반복은 사용하지 않으며 마지막 장면에서
멈춘다. 키보드·reduced-motion·JavaScript 비활성 상태에서도 같은 순서와 결론이 남는다.

### 검증 결과

- 390×844에서 7개 공개 경로의 document overflow는 모두 0이었다.
- 대표 시각화는 4.7~5.1초 동안 첫 장면을 유지했고, 키보드 오른쪽 화살표를 눌렀을 때만 다음 상태로 이동했다.
- reduced-motion에서는 재생 버튼이 비활성화되고 선택한 장면이 유지됐다.
- 정적 빌드는 2,086개 public route와 검토 완료 31편의 no-script 본문을 생성했다.
- JavaScript를 끈 390×844 브라우저에서도 7개 글의 제목·본문·절·부모 지도·지도 반환이 남았고 가로 넘침은 0이었다.

## 8. CNN에서 공간 출력 계약까지

### 분류와 학습 경로

| route | track · form | 직속 부모 | 이 글이 닫을 질문 |
|---|---|---|---|
| `ai/cnn` | concept · explanation | `ai/neural-network` | 작은 patch와 kernel의 한 칸 계산을 어떻게 전체 feature map으로 확장하는가? |
| `ai/cnn-translation-equivariance` | concept · explanation | `ai/cnn#shared-kernel` | 입력을 옮겼을 때 출력 좌표도 같이 옮겨지는 조건과 반례는 무엇인가? |
| `ai/cnn-receptive-fields` | concept · explanation | `ai/cnn#output-geometry` | 위쪽 unit 하나가 원본 입력의 어느 범위와 연결되고 실제로 어느 부분의 영향을 받는가? |
| `ai/depthwise-separable-convolution` | concept · explanation | `ai/cnn#local-operator` | 공간 필터와 채널 혼합을 분리하면 계산량이 어떻게 달라지는가? |
| `ai/resnet` | concept · explanation | `ai/cnn` | 깊은 plain CNN의 학습 오차가 나빠질 때 입력 보존 경로와 residual update는 무엇을 바꾸는가? |
| `ai/vision-task-spatial-contracts` | concept · explanation | `ai/cnn-receptive-fields` | 분류·탐지·분할·복원이 각각 무엇을 하나의 답으로 보고 어떤 좌표를 보존해야 하는가? |

## 9. 시각 의미에서 로봇 행동까지

| 공개 경로 | 분류 | 직속 부모 | 이 글이 답하는 질문 |
|---|---|---|---|
| `ai/sam3-promptable-concept-segmentation` | concept · explanation | `ai/multimodal-retrieval-and-visual-grounding#grounding` | 위치를 찍지 않고 이름만 주었을 때 같은 개념의 모든 개체와 ‘없음’을 어떻게 함께 답하는가? |
| `ai/vla-embodiment-gap` | concept · explanation | `ai/multimodal-retrieval-and-visual-grounding#grounding` | 이미지에서 찾은 컵이 실제 로봇의 안전한 움직임이 되려면 어떤 실행 계약을 더 통과하는가? |
| `ai/robot-action-representations` | concept · explanation | `ai/vla-embodiment-gap#action-interface` | 같은 움직임을 연속값·토큰·행동 묶음 중 무엇으로 표현하는가? |
| `ai/imitation-learning-and-policy-generalization` | concept · explanation | `ai/robot-action-representations` | 시연을 그대로 맞힌 정책이 배포 중 처음 보는 상태로 벗어나는 이유는 무엇인가? |
| `ai/vision-language-navigation` | concept · explanation | `ai/imitation-learning-and-policy-generalization` | 언어 지시를 이동으로 바꿀 때 언제 추론하고 무엇을 기억하는가? |

공통 위치 표시는 `EmbodiedVisionLocator`를 사용합니다. 각 글의 첫 시각화는 한 요청을 실제 값으로 끝까지 추적하고, 글의 마지막에는 새로 확인한 계약과 실패를 이 상위 지도에 되돌려 놓습니다. 기존의 세부 시각화는 각 메커니즘을 더 깊게 파는 장면으로 유지하되 자동 재생과 무한 반복은 사용하지 않습니다.

공통 locator는 `지역 계산 → 이동 → 범위 → 분리 → 잔차 → 출력`을 보여 준다. 각 글은 바로 앞의
계산 결과를 직속 부모 anchor에서 이어받고 마지막에 새로 확인한 사실을 같은 지도에 되돌린다.
VLM·grounding·SAM3·VLA는 이 여섯 기초 글 뒤에서 공간 출력 계약을 재사용한다.

### 같은 사례와 시각화 순서

CNN은 3×3 입력에서 `[[1,2],[3,4]]` patch와 `[[1,0],[0,−1]]` kernel을 곱해 첫
출력값 `−3`을 만든다. 이후 같은 kernel을 네 위치에 재사용하고
`H=7,K=3,P=1,S=2,D=1`에서 output 높이 4를 계산한다.

이동 관계는 pattern과 peak의 좌표를 `1→2`로 함께 옮긴 뒤 stride 2가 sampling 위상을
바꾸는 반례를 보여 준다. 수용 영역은 stride-1 3×3 layer 세 개의 한 축 범위를
`3→5→7`로 누적한다. Depthwise 글은 `k=3,Cin=32,Cout=64`에서 dense
`18,432` MAC와 depthwise `288` + pointwise `2,048` = `2,336` MAC를
같은 출력 위치로 비교한다. 마지막 글은 같은 feature를 `B×Ccls`,
`B×K×(Ccls+4)`, `B×Ccls×Ho×Wo`로 바꾸며 답의 단위와 보존할 좌표를 연결한다.

ResNet은 `x=5`, `F(x)=−1`에서 `y=4`를 만드는 forward 계산과 upstream gradient
`2`, `J_F=0.25`에서 input gradient `2.5`를 만드는 backward 계산을 같은 사례로 잇는다.
Stage가 바뀌면 `[1,64,56,56]`을 `[1,128,28,28]`로 맞추는 projection shortcut까지
추적해 순수 identity와 shape 변환 경로를 구분한다.

기존 시각화의 추상 도형은 실제 입력·계산·출력값을 설명하지 못했다. 이를 각 장면에서
세 상태가 나란히 보이는 계산 흐름으로 교체했다. 자동 재생과 무한 반복은 사용하지 않고,
사용자가 재생하거나 장면을 고른 경우에만 5.2초 간격으로 다음 상태로 이동한 뒤 마지막에서
멈춘다. JavaScript가 없을 때는 같은 장면 순서를 정적 목록으로 남긴다.

## 10. LLM 학습 단계에서 강화학습의 credit까지

| 공개 경로 | 분류 | 직속 부모 | 이 글이 답하는 질문 |
|---|---|---|---|
| `ai/llm-training-stages` | concept · explanation | `ai/transformer-architecture` | Pretraining·SFT·RL·harness는 각각 어떤 입력을 받고 어느 상태를 바꾸는가? |
| `ai/llm-dataset-engineering-and-cleaning` | concept · explanation | `ai/llm-training-stages#pretraining` | 원본 문서가 어떤 제거·검사·혼합을 거쳐 pretraining batch가 되는가? |
| `ai/supervised-fine-tuning` | concept · explanation | `ai/llm-training-stages#post-training` | 대화 sequence에서 어떤 response token만 정답으로 채점하는가? |
| `ai/rlhf` | concept · explanation | `ai/supervised-fine-tuning#evaluation` | Response 선호가 reward model과 online policy update로 어떻게 전달되는가? |
| `ai/rl-foundations-for-llm-post-training` | concept · explanation | `ai/rlhf#ppo` | 마지막 reward를 앞선 token 선택들의 gradient로 어떻게 돌려주는가? |

공통 locator는 `단계 → 데이터 → 시연 → 선호 → 강화학습`에서 현재 위치를 먼저 보여 주고,
뒤이어 reward 설계·DPO·Constitutional AI·ORPO·KTO·synthetic data까지 같은 post-training 지도에서
이어 갈 수 있게 한다. 각 글은 직속 부모의 정확한 anchor에서 시작하고, 마지막에는 새로 확인한
state owner와 feedback 경계를 지도에 되돌린다.

같은 사례는 한 코딩 요청을 사용한다. 먼저 corpus와 feedback과 runtime 중 어느 상태가 바뀌는지
나누고, 중복·오염된 원문을 filtering과 dedup으로 좁힌다. SFT에서는 chat template의 prompt와
response를 이어 붙이되 response mask만 loss target으로 삼는다. RLHF에서는 같은 prompt의 두
response 비교가 reward model의 scalar score가 되고, PPO가 현재 policy의 새 response를 갱신하는
경로를 본다. 마지막으로 reward `[0, 0, 0, 0, 1]`, `γ=0.9`인 5-step trajectory에서
return을 거꾸로 계산해 long-horizon credit이 작아지는 이유를 확인한다.

시각화는 제목 다음에 먼저 배치해 독자가 긴 설명을 읽기 전에 전체 변환 경로를 볼 수 있게 한다.
자동 시작과 무한 반복은 사용하지 않는다. 사용자가 재생을 선택한 경우 장면당 5.2초를 유지하고
마지막 상태에서 멈춘다. JavaScript가 없을 때에도 같은 장면 순서와 결론을 정적 목록으로 남긴다.

## 11. Reward 설계에서 데이터 flywheel까지

| 공개 경로 | 분류 | 직속 부모 | 이 글이 답하는 질문 |
|---|---|---|---|
| `ai/reward-design-for-verifiable-rl` | concept · explanation | `ai/rl-foundations-for-llm-post-training#credit-assignment` | 마지막 결과와 중간 행동을 채점할 때 학습 신호와 검증 오류는 어떻게 달라지는가? |
| `ai/dpo` | concept · explanation | `ai/reward-design-for-verifiable-rl#names` | Chosen·rejected pair를 별도 reward model 없이 어떻게 policy loss로 바꾸는가? |
| `ai/constitutional-ai` | concept · explanation | `ai/dpo#pair-contract` | 자연어 원칙이 critique·revision·preference label로 어떻게 이어지는가? |
| `ai/orpo` | concept · explanation | `ai/supervised-fine-tuning#objective` | Chosen 모방과 rejected 분리를 한 optimization stage에서 어떻게 합치는가? |
| `ai/kto` | concept · explanation | `ai/dpo#pair-contract` | 서로 짝지어지지 않은 response별 좋아요·싫어요를 어떻게 학습하는가? |
| `ai/synthetic-data-and-data-flywheel` | concept · explanation | `ai/llm-dataset-engineering-and-cleaning#mixture` | 생성·검수·학습 결과를 어떻게 다음 라운드의 seed로 되돌리는가? |

공통 지도는 앞 묶음에서 만든 11단계 경로를 그대로 사용한다. 한 글에서 모든 정렬 방법을 비교하지
않고, 각 글은 입력 feedback의 모양과 실제로 바뀌는 policy·data state 하나를 끝까지 추적한다.
Reward 글은 정답 40개·오답 60개인 응답 100개의 검증 결과를, DPO·ORPO는 같은 prompt의
chosen·rejected pair를, KTO는 response별 binary feedback을 사용한다. Constitutional AI는 원칙
하나가 초안에 적용되는 순서를, synthetic data 글은 seed 175개에서 다음 seed pool까지 한 바퀴를
고정한다.

공통 정렬 파이프라인은 데스크톱에서 네 단계를 한 번에 보여 주고, 모바일에서는 네 단계 위치표와
현재 단계 한 장만 보여 준다. 이 변경으로 390×844 화면에서 그림과 조작부가 561px 안에 들어온다.
Reward와 flywheel 장면은 자동으로 시작하거나 반복하지 않으며, 사용자가 재생한 경우 5.2초마다
다음 장면으로 이동한 뒤 마지막에서 멈춘다. JavaScript가 없을 때는 모든 단계의 제목과 상태 변화를
정적 순서로 남긴다.

## 12. 출력 선택에서 fast weight memory까지

| 공개 경로 | 분류 | 직속 부모 | 이 글이 답하는 질문 |
|---|---|---|---|
| `ai/llm-sampling-strategies` | concept · explanation | `ai/transformer-architecture#output-head` | 같은 logit에서 temperature·top-k·top-p가 실제 후보와 확률을 어떻게 바꾸는가? |
| `ai/yarn-rope-extension` | concept · explanation | `ai/transformer-architecture#position-information` | 학습 길이보다 긴 입력을 받는 것과 실제 긴 문맥 과제를 푸는 것을 어떻게 구분하는가? |
| `ai/multi-head-latent-attention-mechanics` | concept · explanation | `ai/kv-cache-fundamentals#kv-shape` | MLA가 token별 KV를 무엇으로 압축하고 decode 때 무엇을 다시 계산하는가? |
| `ai/linear-attention-and-state-space-models` | concept · explanation | `ai/attention-theory#self-attention` | token별 KV 기록 대신 고정 크기 state를 넘기면 계산과 기억의 계약이 어떻게 달라지는가? |
| `ai/fast-weight-memory-and-chunkwise-recurrence` | concept · explanation | `ai/linear-attention-and-state-space-models#recurrent-state` | 읽기만 하는 recurrent state를 쓰고 지우면서도 chunk 단위로 병렬 계산하려면 무엇이 필요한가? |

공통 구조 지도는 `출력 선택 → 위치 확장 → KV 압축 → 고정 state → state 쓰기`를 먼저 보여 줍니다.
이 다섯 단계는 한 모델 안에서 반드시 직렬로 구현되는 제품 파이프라인이 아니라, LLM 구조를 바꿀 때
서로 다른 상태와 비용을 판단하는 학습 순서입니다. 각 글은 직속 부모에서 질문 하나를 이어받고,
새로 확인한 상태 소유권과 계산 경계를 마지막에 같은 지도에 반영합니다.

Sampling은 확률 `[0.50, 0.20, 0.15, 0.10, 0.05]`에서 T=0.5·T=2·top-k=2·top-p=0.8을
한 단계씩 적용합니다. YaRN은 32K checkpoint를 128K 입력에 사용하는 사례에서 입력 수용, 위치 일반화,
과제 성능, 서빙 비용을 분리합니다. MLA는 token당 32,768개 KV 원소와 576개 latent·position 원소를
비교합니다. Linear attention과 state space 글은 64K 문맥의 32 MiB KV와 64 KiB 고정 state를 대조하고,
fast weight 글은 같은 2×2 state를 순차 갱신한 결과와 chunkwise 계산의 state handoff가 일치하는 조건을
추적합니다. 모든 수치는 메커니즘을 읽기 위한 가정 또는 명시된 논문 설정이며 모델 성능 측정값이 아닙니다.

첫 시각화는 첫 설명 문단보다 앞에 두었습니다. 자동 시작과 무한 반복은 사용하지 않으며, 사용자가 재생하면
장면당 5.2초 뒤 다음 상태로 이동하고 마지막에서 멈춥니다. 모바일에서는 현재 계산만 펼쳐 한 화면에서
입력·변화·출력을 함께 보게 하고, 데스크톱에서는 전체 상태를 비교합니다. reduced-motion에서는 재생을
비활성화하고, JavaScript가 없을 때는 같은 장면 순서와 결론을 정적 목록으로 제공합니다.

## 13. Attention pattern에서 MoE routing까지

| 공개 경로 | 분류 | 직속 부모 | 이 글이 답하는 질문 |
|---|---|---|---|
| `ai/differential-attention` | concept · explanation | `ai/attention-theory#multiplicative` | 같은 query를 두 번 읽은 뒤 attention map의 차를 내면 어떤 신호가 남는가? |
| `ai/sparse-windowed-attention-patterns` | concept · explanation | `ai/attention-theory#self-attention` | dense mask에서 window·global token·hybrid layer가 각각 어느 연결을 없애거나 되살리는가? |
| `ai/hyper-connections-residual-streams` | concept · explanation | `ai/resnet#skip-connection` | residual stream을 여러 개로 늘렸을 때 깊이에 따른 signal 증폭을 어떻게 제어하는가? |
| `ai/mixture-of-experts` | concept · explanation | `ai/transformer-architecture#ffn` | dense FFN을 여러 expert와 router로 바꾸면 token 하나가 실제로 어떤 경로를 실행하는가? |
| `ai/moe-routing-and-load-balancing` | concept · explanation | `ai/mixture-of-experts#routing` | router 쏠림이 capacity drop으로 이어지고 bias가 배정을 되돌리는 과정을 어떻게 추적하는가? |

공통 구조 지도는 앞 묶음에 이어 `두 map의 차 → sparse pattern → residual mixing → expert 선택 →
load balancing`을 보여 줍니다. 이 역시 한 요청이 반드시 순서대로 지나는 실행 pipeline이 아니라,
attention·depth·width 축에서 모델 구조를 바꿀 때 확인해야 할 서로 다른 상태와 비용의 학습 순서입니다.
각 글은 직속 부모의 정확한 anchor에서 질문 하나를 이어받고, 확인한 메커니즘을 마지막에 같은 지도에
반영합니다.

Differential attention은 같은 query의 A1·A2와 λ=0.8을, sparse attention은 같은 10×10 causal
mask의 55·27·34칸을 추적합니다. Hyper-connection은 두 2×2 mixing 행렬을 1·8·16·32번
곱한 norm을 비교합니다. MoE 개요는 네 token의 dense FFN 경로와 four-expert Top-2 경로를
나란히 보여 줍니다. Routing 글은 expert 8개·token 1,024개·Top-2의 2,048개 slot이 256개씩
나뉘다가 expert 0에 614개가 몰리고, capacity 320을 넘은 294개가 버려진 뒤 bias로 회복되는 과정을
같은 장부로 유지합니다.

첫 시각화는 첫 설명 문단보다 앞에 두었습니다. 장면은 자동으로 시작하거나 반복하지 않습니다. 사용자가
재생하면 5.2초마다 다음 실제 상태로 이동하고 마지막에서 멈춥니다. 모바일에서는 현재 mask·행렬·expert
상태만 펼쳐 가로 스크롤을 없애고, 데스크톱에서는 비교 대상을 함께 보여 줍니다. reduced-motion에서는
재생을 비활성화하며 JavaScript가 없을 때는 동일한 순서와 결론을 정적 목록으로 제공합니다.
