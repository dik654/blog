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
