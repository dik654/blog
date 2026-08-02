# 확률·정보 이론 재작성 명세

## 이 글의 역할

- 상위 목표: LLM, 생성 모델, RL, World Model, Knowledge System, Robot AI 글에서 나오는 score, probability, likelihood, loss, uncertainty를 같은 숫자로 오해하지 않게 한다.
- 시작 질문: 모델이 세 token에 `2.0, 1.0, -1.0`을 출력했을 때 무엇을 더 정의해야 확률이라고 부를 수 있는가?
- 최소 바닥: 표본공간, 확률변수, 분포, 조건부 확률, 기대값, 분산, log만 사용한다. 측도론과 확률 공리의 증명 계보는 열지 않는다.
- 종료 능력: 독자가 raw score에서 확률, 관측 likelihood, NLL, cross-entropy, KL로 이어지는 계산을 직접 추적하고 각 숫자가 보장하지 않는 것도 말할 수 있다.

## 숨은 전이 문제

공개 본문에 문제를 그대로 싣지 않는다. 작성자 검증 fixture로 사용한다.

세 class `A, B, C`에 대한 모델의 logits가 `(3.2, -0.4, 1.7)`이고 정답은 `C`다. 학습 표본 전체의 실제 label 비율은 `P=(0.15, 0.25, 0.60)`이다. 배포 뒤 `B`의 base rate가 세 배가 됐다. 별도로 동전을 열일곱 번 던져 앞면 열한 번을 관측했다. 이 수치는 본문의 teaching example과 겹치지 않는 검증 전용 입력이다.

본문만 읽은 독자는 다음을 풀 수 있어야 한다.

1. logit, softmax probability, sample, support를 구분한다.
2. joint에서 marginal과 conditional을 만들고 prior와 likelihood로 posterior를 계산한다.
3. `HHHT...`처럼 순서가 고정된 관측과 `앞면 8회`라는 count 사건의 확률에서 조합계수 유무를 구분한다.
4. 조합계수는 likelihood의 절대값을 바꾸지만 Bernoulli MLE `11/17`은 바꾸지 않는 이유를 설명한다.
5. softmax shift invariance를 확인하고 정답 `C`의 NLL을 계산한다.
6. empirical cross-entropy가 sample NLL의 평균이며 `H(P,Q)=H(P)+KL(P||Q)`인 이유를 연결한다.
7. `P(x)>0, Q(x)=0`이면 P가 부여한 self-information `-log P(x)`은 유한하지만, 같은 사건을 Q code로 읽는 `-log Q(x)` 항과 그 항을 포함한 cross-entropy·forward KL은 무한대로 가는 support failure를 찾는다.
8. 낮은 NLL이나 softmax 0.9만으로 calibration, epistemic uncertainty, causal validity, shifted deployment validity를 보장할 수 없음을 말한다.
9. log base 2의 bit와 자연로그의 nat를 구분한다.

각 섹션은 위 항목 중 적어도 하나를 직접 해결해야 한다. 마지막 CapabilityCheck는 문제 문장을 복사하지 않고 같은 능력을 점검한다.

## 근거와 주장 경계

### 표준 정의

- Deep Learning Book, Chapter 3:
  - random variable, PMF/PDF, joint/marginal/conditional probability
  - 이 글에서 쓰는 sample space와 support는 일반 확률론 관용어다. 해당 교재 추출본은 가능한 상태 집합을 PMF/PDF의 `domain`으로 표현하므로 직접 인용과 글의 연결 용어를 구분한다.
  - probability density는 1보다 클 수 있으며 구간 적분이 probability다.
  - Bayes rule, expectation, variance
  - self-information, entropy, KL divergence, cross-entropy
  - <https://www.deeplearningbook.org/contents/prob.html>
- Deep Learning Book, Chapter 5:
  - maximum likelihood는 고정된 관측 아래 parameter를 고른다.
  - 독립 sample product에 log를 취해 sum으로 바꾼다.
  - empirical distribution의 기대값으로 conditional log-likelihood를 읽을 수 있다.
  - <https://www.deeplearningbook.org/contents/ml.html>
- Shannon, *A Mathematical Theory of Communication*:
  - Section 6의 choice, uncertainty and entropy에서 `H=-K sum p_i log p_i`를 정의하는 역사적 1차 원문이다.
  - 현대 neural loss의 runtime 정의는 이 원문에 귀속하지 않고 Deep Learning Book과 PyTorch 문서로 검증한다.
  - <https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf>

### 구현 계약

- PyTorch `Softmax`: 입력 원소를 `[0,1]` 범위로 재조정하고 지정 차원의 합을 1로 만든다.
  - <https://docs.pytorch.org/docs/stable/generated/torch.nn.Softmax.html>
- PyTorch `CrossEntropyLoss`: 입력은 normalized probability가 아니라 unnormalized logits이며, class-index target일 때 log-softmax와 NLL의 결합으로 읽을 수 있다.
  - class-probability target을 쓸 때는 input과 같은 shape, 각 값 `[0,1]`, class 축 합 1이 필요하다. PyTorch가 이 제약을 강제 검증하지 않으므로 arbitrary target을 넣으면 오해를 부르는 loss 값과 불안정한 gradient가 나올 수 있다.
  - <https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html>

### 경험적 경계

- Guo et al., 2017:
  - 원문은 현대 neural network가 과거 세대와 달리 poorly calibrated였음을 여러 vision/NLP 실험에서 보고한다(본문 PDF pp.1-2). 이는 모든 모델·분포에 대한 보장이 아니라 해당 실험 범위를 가진 경험적 결과다.
  - perfect calibration을 `P(\hat Y=Y\mid\hat P=p)=p`로 정의하고, 같은 confidence 집단의 정확도와 confidence를 비교한다(본문 PDF p.2). 따라서 calibration은 개별 예측 하나가 반드시 맞는다는 보장이 아니다. 이 마지막 문장은 집단 조건부 정의에서 도출한 교육적 경계다.
  - temperature scaling은 validation NLL로 한 scalar `T>0`를 맞추며 class argmax와 accuracy는 바꾸지 않는다(본문 PDF p.6). vision task에서 비교 방법보다 좋았고 NLP에서는 대체로 비슷했지만 Reuters 예외와 측정 한계를 원문이 함께 보고한다(p.7).
  - <https://proceedings.mlr.press/v70/guo17a.html>
- Kendall & Gal, 2017:
  - aleatoric uncertainty는 관측 자체의 noise, epistemic uncertainty는 model parameter에서 오는 불확실성으로 구분한다. 이 taxonomy는 Guo의 calibration 근거와 섞지 않는다.
  - <https://papers.neurips.cc/paper/7141-what-uncertainties-do-we-need-in-bayesian-deep-learning-for-computer-vision>

## 서사와 섹션

### 01 · Score에서 분포까지

- raw score는 확률이 아니다.
- sample space → random variable → support → distribution → observed sample 순서.
- discrete PMF와 continuous density의 차이. density height를 probability로 읽지 않는다.
- 기대값과 분산은 이산 합과 연속 적분을 나란히 연결하고, 기대값의 선형성 `E[aX+b]=aE[X]+b`를 후속 평균 계산의 기본 성질로 둔다.
- Viz `DistributionMomentLab`: 세 결과의 질량을 직접 조절하고 normalize, expectation, variance, entropy 변화를 같은 화면에서 본다.

### 02 · 함께, 따로, 알고 난 뒤

- joint table에서 row/column sum으로 marginal을 만든다.
- 한 조건의 slice를 다시 normalize해 conditional을 만든다.
- `p(x|y)=p(x,y)/p(y)`는 `p(y)>0`일 때만 정의된다. 일어나지 않는 조건으로 나누면 분모가 0이라 conditional 자체가 정의되지 않는다.
- Bayes는 conditional 방향을 뒤집는 주문이 아니라 prior × likelihood를 evidence로 normalize하는 계산이다.
- Viz `BayesEvidenceLab`: 10,000 natural counts, prevalence, sensitivity, false-positive rate, TP/FP와 posterior를 함께 보여 준다.

### 03 · Probability와 likelihood

- probability: parameter를 고정하고 가능한 data를 비교.
- likelihood: observed data를 고정하고 parameter 후보를 비교.
- ordered Bernoulli sequence와 unordered count 사건을 분리한다.
- `C(10,8)`은 theta에 상수라 MLE argmax는 같지만 event probability와 likelihood scale은 달라진다.
- 위 문장은 ordered Bernoulli likelihood와 binomial count probability를 나란히 전개해 얻는 본문의 직접 유도다. Deep Learning Book의 MLE 원칙이 조합계수 사례를 그대로 다룬다고 과장하지 않는다.
- product → log sum → MLE.

### 04 · Logit에서 학습 loss까지

- logits → stabilized softmax → true-label probability → NLL.
- 모든 logits에 같은 상수를 더해도 probability가 같은 shift invariance.
- one-hot target의 sample NLL, soft target의 cross-entropy, empirical mean 관계.
- Viz `ScoreToLossLab`: logits, temperature, true class를 조절하고 Q, NLL, CE, KL을 인과적으로 갱신한다.

### 05 · surprisal, entropy, cross-entropy, KL

- surprisal은 한 사건의 비용.
- entropy는 P 아래 자기 surprisal의 평균.
- cross-entropy는 P sample을 Q code로 읽는 평균 비용.
- KL은 추가 비용이며 방향이 있고 distance가 아니다.
- support mismatch를 별도 실패 상태로 보여 준다. `P(x)>0, Q(x)=0`에서 P 기준 self-information은 유한하고 Q code의 `-log Q(x)`만 발산한다는 책임 경계를 문장과 식에 함께 둔다.
- bit/nat은 log base의 단위 차이다.

### 06 · 확률 출력이 보장하지 않는 것

- softmax normalization ≠ calibration.
- calibration ≠ individual certainty. 이는 Guo et al.의 집단 조건부 calibration 정의에서 도출한 경계라고 본문에서 밝힌다.
- data/parameter uncertainty와 causal claim은 별도 증거가 필요하다.
- deployment prior/conditional shift가 생기면 train distribution 숫자를 그대로 이전하지 않는다.
- 내부 연결: `cross-entropy`, `statistics-generalization`, `rl-mdp-bellman`, `generative-theory`.

## 수식 계약

모든 핵심 식은 `MathFormula`와 인접한 `FormulaNote`를 갖는다. 가능한 경우 `\underbrace{...}_{\text{한글 설명}}`로 계산 단계의 역할을 식 안에도 표시한다.

- `sum_x p(x)=1`: 확률 질량 정규화.
- 일반 기대값 `E[f(X)]`를 먼저 두고 `f(x)=x`인 평균과 `f(x)=(x-mu)^2`인 분산을 특수 사례로 연결한다.
- discrete expectation/variance의 합과 continuous expectation/variance의 적분.
- 기대값의 선형성 `E[aX+b]=aE[X]+b`.
- `p(x,y)`, `p(x)=sum_y p(x,y)`, `p(x|y)=p(x,y)/p(y)`와 조건 `p(y)>0`.
- Bayes numerator/evidence denominator.
- ordered sequence와 binomial count.
- log likelihood와 Bernoulli MLE.
- stabilized softmax `exp(z_i-m)/sum_j exp(z_j-m)`.
- NLL, empirical CE.
- surprisal, entropy, cross-entropy, KL decomposition.

긴 식을 한 줄 카드에 억지로 넣지 않는다. 모바일에서는 수식을 의미 단위로 나누고 `MathFormula`의 scale이 0.72 아래로 떨어지면 구성 자체를 다시 쪼갠다. raw `\theta`, `\tau`, `\dot{s}` 문자열을 본문에 두지 않는다.

## Viz 계약

- 색만 바꾸는 정적 카드가 아니라 입력 → 중간 계산 → 결과의 인과를 보여 준다.
- controls는 최소 44px, tab/slider label과 keyboard focus를 갖는다.
- bar/line은 굵기와 간격을 안정적으로 고정하며 값 label이 겹치지 않는다.
- 390/768/1440에서 document와 figure overflow가 1px 이하다.
- animation은 전체 본문 작성과 검증 후 별도 pass에서만 추가한다. 이 단계에서는 state transition과 직접 조작으로 충분히 이해 가능해야 한다.
- black/white만 쓰지 않되 semantic accent는 blue=모델 Q, emerald=관측/정답, amber=경계·위험으로 제한한다.

## 검증

- 정적:
  - article sections와 metadata 일치
  - raw LaTeX 없음
  - FormulaNote 최소 6개
  - figure 최소 3개
  - 내부 학습 링크 최소 4개
  - ordered/count coefficient와 support mismatch 문구 존재
- 상호작용:
  - distribution normalization과 moments 갱신
  - Bayes prior를 낮추면 같은 검사에서 posterior 변화
  - logit 공통 shift 뒤 softmax·loss 불변
  - true class와 temperature 변화가 NLL/CE/KL에 반영
- 시각:
  - 390/768/1440 screenshot
  - formula/container/document overflow
  - text clipping, overlap, 44px controls
- Claude:
  - 작성 전 이 명세와 source snapshot의 누락·과장 감사
  - 작성 후 현재 소스 해시 기반 factual/pedagogy 및 responsive delta 감사
  - strict receipt 조건을 만족하지 못하면 더 작은 패킷으로 재시도하고 최종 판정에 합산하지 않는다.
