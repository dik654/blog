# 분포 의미론 재구성 명세

## 소유 질문

Token ID의 주변 관측을 어떻게 word-context 행렬과 저차원 geometry로 바꾸며, 그 geometry가 신뢰할 수 없는 조건은 무엇인가?

## 경로 계약

- 이전 입력: Tokenizer가 고정한 ID sequence와 special-token/normalization 정책.
- 이 글의 출력: context 정의, count matrix, PPMI weighting, rank-k geometry와 평가 경계.
- 다음 글: 거대한 행렬을 명시적으로 만들지 않고 sampled prediction으로 유사한 score를 학습하는 Word2Vec.
- 최소 역사선: 분포 가설과 count/PPMI/SVD. 언어학 전체 계보는 기본 경로 밖에 둔다.

## 비공개 전이 문제

`bank` target 행 합계가 50, `loan` context 열 합계가 40, 공동 cell이 20이고 word-context event는 1000개다. `quasar` 열 합계는 1이며 그 한 event가 모두 `bank` cell에 있다. PPMI matrix singular values가 `[6,3,1]`이고 두 단어 vector가 2차원으로 주어진다.

본문만으로 다음을 판단할 수 있어야 한다.

1. `bank-loan`의 PMI가 `log2(10)=3.322`임을 계산한다.
2. 한 번뿐인 `bank-quasar`가 `log2(20)=4.322`로 더 높아도 더 신뢰할 만한 관계는 아님을 설명한다.
3. Rank 1과 rank 2의 Frobenius reconstruction error가 각각 `sqrt(10)`과 `1`임을 계산한다.
4. Cosine plot의 좌표와 실제 계산 차원이 일치하는지 검산한다.
5. Log base는 geometry scale을 바꾸지만 association ordering은 유지하며, SGNS sigmoid 유도는 자연로그를 쓴다는 차이를 설명한다.
6. Explicit PPMI+SVD와 sampled Word2Vec이 같은 word-context 통계를 다른 계산 경로로 다룬다는 연결을 만든다.

## 섹션과 Viz

### 1. 분포 가설

- Corpus→count→weight→geometry의 ownership을 먼저 보여 준다.

### 2. Context와 count matrix

- Window 조작으로 같은 corpus의 count row가 바뀌는 interactive explorer.
- Row는 target, column은 context이며 tokenizer가 축 자체를 결정한다.

### 3. PPMI와 SVD

- Joint/row/column/total count에서 확률을 만든다.
- Zero pair, frequent function word, reliable positive pair, single-observation rare pair를 비교한다.
- Rare-event PMI 과대값을 최소 빈도·smoothing·held-out stability로 진단한다.
- Rank slider는 retained energy와 exact Frobenius tail error를 함께 표시한다.

### 4. Geometry

- Viz와 cosine 계산을 모두 2차원으로 맞춘다.
- Dot, norm product, cosine의 역할과 회전 비식별성을 설명한다.

### 5. Predictive handoff

- Explicit matrix route와 sampled prediction route를 나란히 실행 흐름으로 연결한다.
- Empirical unigram noise라는 단순 조건에서 `score*=PMI-log k`가 됨을 다음 글의 입력으로 넘긴다.

### 6. Contextual handoff

- Static vector의 다의어 평균과 문장별 contextual state를 분리한다.
- 예시 bar는 실제 attention head의 측정값이 아님을 고정 표시한다.

## 출처 경계

- Levy et al. 2015: count와 predictive hyperparameter 비교.
- Levy & Goldberg 2014: SGNS의 shifted-PMI factorization.
- GloVe: global co-occurrence objective.
- SVD/Eckart-Young 계산은 선형대수 보강 글로 연결한다.

## 검증

- 390·1440px에서 formula scale 0.8 이상, plot label clipping 없음.
- Window, target, PMI pair, rank, cosine pair, contextual meaning을 실제로 전환한다.
- Rare pair가 더 큰 PMI와 동시에 경고 상태를 보여야 한다.
- Raw LaTeX와 비한글 FormulaNote가 없다.
