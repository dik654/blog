# 선형대수와 Tensor Shape 콘텐츠 사양

## 독자에게 약속하는 한 문장

벡터와 행렬을 숫자 표로 외우지 않고, **같은 대상을 어떤 축으로 기록했는지**, **어느
축을 곱해 없애고 어느 축을 남기는지**, **그 계산이 메모리에서 어떤 byte와 stride를
갖는지**까지 한 흐름으로 읽게 한다.

이 글은 여덟 개 이상의 상위 경로가 함께 쓰는 바닥이다. 따라서 “행렬곱 shape 맞히기”
한 문제에서 멈추지 않는다.

- Robot AI: world vector와 coordinate vector, basis/frame change
- LLM architecture·interpretability: projection, batch·head·token·feature axis
- image·video·vision: batch·frame·channel·height·width·object axis
- efficient inference·serving: element 수, dtype byte, KV-cache 예산
- neural-network implementation: `nn.Linear`, broadcasting, layout와 copy

## 이 글이 답할 독립 질문

1. 같은 물리적 화살표를 다른 basis로 쓰면 숫자는 왜 달라져도 대상은 그대로인가?
2. dot product, cosine similarity와 projection은 같은 식에서 어떻게 갈라지는가?
3. matrix product의 안쪽 축은 왜 사라지고 바깥 축만 남는가?
4. PyTorch `Linear`의 weight는 왜 수학 교재에서 쓰던 행렬과 뒤집혀 보이는가?
5. attention의 `[B,H,T,D_h] @ [B,H,D_h,T]`를 원소 하나까지 풀면 무엇을 더하는가?
6. broadcasting은 shape error를 막아 주면서도 왜 더 위험한 silent bug를 만들 수 있는가?
7. `reshape`, `permute`, `view`, `contiguous`는 shape가 같아도 왜 서로 다른 실행 비용을
   만들 수 있는가?
8. shape와 dtype만 보고 activation·KV-cache memory의 1차 예산을 어떻게 계산하는가?

## 비공개 최고 난도 전이 문제

아래 수치와 정답은 본문 teaching example에 복사하지 않는다. 구현 뒤 독립 감사자가
현재 본문만 읽고 풀 수 있어야 한다.

### A. 대상과 좌표

표준 basis에서 world vector가 \(v=(5,1)\)이다. 새 orthonormal basis를

\[
e'_1=\frac{1}{\sqrt2}(1,1),\qquad
e'_2=\frac{1}{\sqrt2}(-1,1)
\]

로 바꾼다.

1. 새 coordinate \([v]_{E'}\)를 dot product로 구한다.
2. \(E'[v]_{E'}=v\)로 같은 world vector가 복원되는지 확인한다.
3. coordinate가 바뀐 사실과 대상 자체가 회전한 사실을 구분한다.

### B. 길이, 방향과 projection

\(u=(2,-1,2)\), \(v=(1,3,-2)\)이다.

1. \(u^\top v\), 두 norm, cosine과 \(v\)를 향한 \(u\)의 scalar/vector projection을
   구한다.
2. \(u\)를 10배 하면 dot, cosine, projection coefficient가 각각 어떻게 바뀌는지
   설명한다.
3. 크기도 신호인 ranking과 방향만 비교하려는 retrieval에서 어느 점수를 골라야 하는지
   판단한다.

### C. affine map과 framework convention

입력 \(X\) shape가 `[2,3,4]`, PyTorch `Linear(4,5)`의 저장 weight가 `[5,4]`,
bias가 `[5]`이다.

1. output shape를 구한다.
2. `Y[1,2,3]`을 `X[1,2,k]`, `weight[3,k]`, `bias[3]`의 합으로 전개한다.
3. 수학식 \(Y=XW+b\)에서 \(W:[4,5]\)와 PyTorch 식 \(Y=XA^\top+b\),
   `weight=A:[5,4]`가 같은 계산임을 보인다.

### D. multi-head contraction

`Q,K,V:[2,2,3,2] = [B,H,T,Dh]`이다.

1. \(QK^\top\)의 output `[2,2,3,3]`에서 한 scalar가 어느 축을 합하는지 쓴다.
2. attention probability와 \(V\)의 곱이 다시 `[2,2,3,2]`가 되는 이유를 쓴다.
3. head와 token 축을 바꾸는 `permute`가 element 값을 섞는 `reshape`와 왜 다른지
   설명한다.

### E. silent broadcasting bug

activation `x:[8,8,32] = [B,T,D]`에 “sample별 offset”이라 생각한
`offset:[8,32]`를 더했다.

1. 왜 operation 자체는 성공하는지 trailing-axis 규칙으로 설명한다.
2. 두 개의 8 중 offset의 첫 축이 `B`가 아니라 `T`에 붙는 것을 찾는다.
3. 의도가 sample별 offset이면 `[8,1,32]`, token별이면 `[1,8,32]`로 명시해야 함을
   설명한다.

### F. layout와 byte

contiguous tensor `x:[2,3,4]`의 stride가 `[12,4,1]`이다.

1. `x.permute(0,2,1)`의 shape `[2,4,3]`와 stride `[12,1,4]`를 구한다.
2. 이 view에 `view(2,12)`가 일반적으로 실패할 수 있고 `reshape`가 copy할 수 있는
   이유를 설명한다.
3. KV cache가 layer 32, KV head 8, head dimension 128, K/V 두 장, fp16일 때
   token당 \(2\cdot32\cdot8\cdot128\cdot2=131{,}072\) byte, 8,192 token에서
   1 GiB임을 계산한다. 이 값은 allocator overhead와 batch를 제외한 1차 하한임을
   표시한다.

## 숨은 문제 판정 기준

정답 숫자만 맞으면 통과시키지 않는다.

- 각 dimension에 `B`, `T`, `H`, `D_h`, `D`, `O` 같은 의미 이름을 붙인다.
- 합으로 사라지는 contraction axis와 결과에 남는 free axis를 구분한다.
- mathematical convention과 framework storage convention을 구분한다.
- broadcastable과 semantically correct를 구분한다.
- view와 copy 가능성을 API 계약 범위 안에서만 말한다.
- memory 산술을 runtime peak-memory 보장으로 과장하지 않는다.

## 최소 역사 중단점

좌표, linear combination, norm, dot product, matrix product를 이 글의 첫 바닥으로
삼는다. Euclid나 행렬식의 역사까지 내려가지 않는다. 이 글을 이해하는 데 필요한 이전
지식은 사칙연산, 제곱근과 2차원 좌표뿐이다.

다음은 별도 글로 미룬다.

- span·column space·null space·rank-nullity
- least squares와 numerical solver
- eigenvalue·spectral behavior
- SVD·PCA·low-rank approximation
- condition number와 singularity

위 주제는 `linear-algebra-decompositions`가 소유한다. 이 글에서는 후속 질문이 생기는
지점만 연결한다.

## 출처·주장·작성 의도 장부

| Source | 이 글에서 채택하는 주장 | 작성 의도 | 넘지 않는 경계 |
|---|---|---|---|
| Goodfellow et al., *Deep Learning* ch. 2 | scalar/vector/matrix/tensor, broadcasting shorthand, matrix-product index, norm, dot/cosine | AI에 실제로 반복되는 최소 기호를 하나의 실행 언어로 묶는다 | chapter의 inverse·eigen·SVD를 이 글로 끌어오지 않는다 |
| MIT 18.06SC | vector를 coordinate와 direction으로 읽고 matrix를 linear map으로 읽는 관점 | 같은 대상과 달라진 좌표를 분리한다 | 추상 vector-space 증명과 분해는 후속 글로 미룬다 |
| PyTorch `nn.Linear` 2.13 | \(y=xA^\top+b\), input `(*,Hin)`, output `(*,Hout)`, stored weight `[Hout,Hin]` | 교재의 \(XW\)와 실제 parameter shape가 충돌해 보이는 지점을 해소한다 | 다른 framework가 같은 storage convention이라고 일반화하지 않는다 |
| PyTorch `matmul` 2.13 | 마지막 두 축은 matrix multiply, 앞 축은 broadcast | rank-N contraction과 attention shape를 검산한다 | 모든 tensor contraction이 `matmul` 하나로 표현된다고 쓰지 않는다 |
| PyTorch broadcasting semantics 2.13 | trailing dimension이 같거나 1이거나 없을 때 broadcast | 성공하지만 의미가 틀린 silent bug를 찾는다 | 개념적 확장이 언제나 materialization 0이라고 일반화하지 않는다 |
| PyTorch Tensor Views·`view` 2.13 | view는 storage 공유, transpose/permute 뒤 non-contiguous 가능, reshape는 view 또는 copy | shape와 layout를 분리하고 성능 비용의 시작점을 만든다 | kernel별 실제 latency나 compiler fusion을 이 글에서 보장하지 않는다 |
| PyTorch Storage 2.13 | storage byte, dtype, shape, stride, offset이 tensor를 구성 | memory 계산을 element count와 byte로 연결한다 | allocator overhead, temporary buffer, fragmentation까지 exact peak로 주장하지 않는다 |

## 7절 서사

### 01. 숫자 목록보다 먼저: 대상, 축, 좌표

- 하나의 온도 scalar, RGB vector, image tensor를 “무엇을 몇 개 축으로 기록했나”로 읽는다.
- vector는 geometric object일 수도 있고 coordinate tuple일 수도 있음을 구분한다.
- axis label을 잃으면 `[8,8,32]`처럼 size가 같을 때 버그가 숨어든다는 문제를 먼저 연다.
- basis를 회전할 때 world vector는 고정되고 coordinate만 바뀌는 인과 Viz를 둔다.

### 02. 여러 방향을 섞어 새 방향을 만든다

- linear combination \(x_1b_1+\cdots+x_nb_n\)에서 coefficient와 basis direction을
  분리한다.
- matrix column 조합과 coordinate reconstruction을 연결한다.
- projection은 “그 방향으로 얼마만큼 가야 하는가”라는 coefficient로 먼저 설명한다.
- span·rank를 깊게 다루지 않고 후속 분해 글로 handoff한다.

### 03. 내적은 곱셈표가 아니라 방향 질문이다

- elementwise multiply-and-sum에서 weighted score를 만든다.
- \(u^\top v=\|u\|\|v\|\cos\theta\)로 길이와 방향을 분해한다.
- scalar projection과 vector projection을 식과 그림으로 연결한다.
- zero vector에서 cosine이 정의되지 않는다는 boundary를 남긴다.

### 04. 행렬은 여러 출력 질문을 한 번에 묻는 map이다

- output scalar 하나를 row/column dot으로 펼친다.
- contraction axis와 free axis를 색과 이름으로 추적한다.
- \(W:[D,O]\) teaching convention과 PyTorch stored `A:[O,D]`를 나란히 보여 준다.
- bias가 affine translation이므로 엄밀히 linear map 자체는 아니라는 용어 경계를 둔다.

### 05. rank-N tensor와 attention을 같은 축 규칙으로 읽는다

- `[B,T,D] @ [D,O] -> [B,T,O]`에서 `D`만 사라진다.
- `[B,H,T,Dh] @ [B,H,Dh,T] -> [B,H,T,T]`의 한 원소를 합으로 펼친다.
- matrix “rank”와 tensor의 axis 개수인 colloquial rank를 혼동하지 않도록 `ndim`을 함께
  쓴다.
- image `[B,C,H,W]`, detection `[B,N,4+C]`, sequence `[B,T,D]`를 나열표가 아니라
  서로 다른 질문으로 짧게 전이한다.

### 06. broadcasting은 성공 여부가 아니라 의미를 검사한다

- trailing-axis 규칙을 오른쪽 정렬로 보인다.
- bias `[O]` 성공, `[B,1,O]` 명시적 성공, same-size collision silent bug를 비교한다.
- `unsqueeze`로 의미 축을 드러내고 assert/named comment로 계약을 고정한다.
- in-place broadcast의 shape 제한은 짧은 runtime boundary로 남긴다.

### 07. shape 다음은 layout와 byte다

- shape, stride, dtype, device/storage를 분리한다.
- `permute`는 축 의미와 stride를 바꾸되 storage를 공유할 수 있다.
- `reshape`는 element 수를 보존하지만 axis meaning을 자동 보존하지 않으며 copy 여부도
  호출자가 가정하지 않는다.
- \(\text{bytes}=\prod_i d_i\times\text{bytesPerElement}\)를 activation과 KV cache에
  적용한다.
- 다음 읽기 경로를 attention, robot frame, quantization/KV serving으로 분기한다.

## Viz 계약

### CoordinateFrameLab

- 고정 world vector와 회전 가능한 basis를 동시에 그린다.
- angle을 바꾸면 coordinate 숫자는 변하고 reconstructed endpoint는 같은 자리에 남는다.
- “basis를 돌림”과 “vector를 돌림” mode를 segmented control로 분리한다.
- projection guide와 coefficient를 직접 연결하되 선은 1~1.5px, label은 12px 이상이다.

### SimilarityProjectionLab

- angle과 vector length를 바꾼다.
- dot, cosine, scalar projection, vector projection을 같은 상태에서 재계산한다.
- length만 바꿨을 때 cosine이 고정되는 인과를 before/after 수치로 드러낸다.
- zero-length 근처는 undefined 상태를 텍스트와 수식에서 같은 방식으로 처리한다.

### ShapeContractionLab

- `Linear`, `batched matmul`, `attention score` 세 mode를 제공한다.
- 선택한 output cell을 누르면 실제로 곱해 더한 input 항만 highlight한다.
- contracted axis는 같은 accent, free axis는 서로 다른 neutral label로 표시한다.
- PyTorch stored transpose toggle은 shape뿐 아니라 index 식도 바꾼다.

### TensorLayoutMemoryLab

- `permute`, `reshape`, `contiguous` action이 shape·stride·copy 가능성에 미치는 영향을
  순서대로 보여 준다.
- dtype과 sequence length를 바꾸면 element·byte·MiB/GiB가 즉시 변한다.
- computed estimate와 runtime-measured peak를 같은 것으로 보이게 만들지 않는다.
- 390px에서 내부 horizontal scroll 없이 핵심 shape·stride·byte가 보여야 한다.

## 수식·한글 해설 계약

긴 식 아래 FormulaNote만 두지 않는다. 식 안에서 연산 목적이 중요한 경우 한국어
`\underbrace{...}_{\text{...}}`를 사용한다.

\[
\underbrace{Y_{bto}}_{\text{출력 한 칸}}
=
\underbrace{\sum_{d=1}^{D}X_{btd}W_{do}}_{\text{입력 특징 축을 합쳐 없앰}}
+
\underbrace{b_o}_{\text{출력 특징마다 같은 이동}}
\]

\[
\underbrace{S_{bhts}}_{\text{토큰 쌍 점수}}
=
\underbrace{\sum_{d=1}^{D_h}Q_{bhtd}K_{bhsd}}_{\text{head 안 특징 축으로 방향 비교}}
\]

모든 display formula는 mobile에서 자동 축소되더라도 최소 scale `0.72`, horizontal
overflow 0을 지킨다. raw `\theta`, `\top`, `\underbrace` 문자열이 DOM text로 남으면
실패다.

## 접근성·반응형 계약

- 모든 interactive control은 최소 44px hit target이다.
- `figure` caption 오른쪽은 fullscreen button과 겹치지 않게 공간을 예약한다.
- SVG text는 색만으로 상태를 구분하지 않고 label·수치·선 형태를 함께 쓴다.
- 390/768/1440에서 document, figure, formula overflow가 0이다.
- 애니메이션은 사용자의 입력에 원인과 결과가 연결될 때만 사용하고, reduced-motion에서
  즉시 상태 전환한다.
- 초기 화면은 완성된 정적 답을 보여 주지 않고 현재 입력의 계산 상태를 보여 준다.

## 완료 기준

- 본문 prose depth가 정의표를 제외하고도 최소 5,000자다.
- 네 causal Viz가 각자 다른 learner decision을 책임진다.
- 비공개 A~F를 현재 본문만으로 풀 수 있다.
- 내부 링크가 최소 네 개이며, 분해 글·attention·robot frame·serving/quantization으로
  다음 질문이 이어진다.
- 8개 top-down track의 foundation reason이 본문 어느 절에서 충족되는지 trace할 수 있다.
- source clock, 원문 범위, inference와 implementation convention을 분리해 기록한다.
- article contract, narrative audit, mastery audit, learning-flow audit, responsive Playwright,
  strict Claude post-edit receipt가 모두 통과한 뒤에만 배포한다.
