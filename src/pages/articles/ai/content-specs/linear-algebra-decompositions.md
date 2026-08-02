# 부분공간과 행렬 분해 콘텐츠 사양

## 학습 계약

독자는 행렬을 숫자 표나 `inverse를 호출하는 대상`이 아니라 input directions를 output directions로 보내는 map으로 읽는다. 이 글을 마치면 하나의 rank-deficient matrix에서 span, basis, column/row/null/left-null space, rank, projection, least squares와 minimum-norm pseudoinverse를 계산하고, eigenvalue와 singular value가 서로 다른 질문에 답한다는 것을 non-normal example로 검산해야 한다.

최종 산출물은 다음 세 문장이다.

1. `무엇을 만들 수 있는가?`는 column space, `무엇을 읽는가?`는 row space, `무엇을 지우는가?`는 null space로 답한다.
2. `가장 가까운 output`은 projection/least squares, `여러 coefficient 중 어느 것`은 Moore-Penrose minimum norm으로 답한다.
3. `반복 mode`는 eigenvalue, `한 step worst gain·conditioning·low-rank loss`는 singular values로 답한다.

## 초등 독자 bridge

| 용어 | 먼저 잡을 말 | 이 글에서 닫을 operation |
|---|---|---|
| span | 준비한 블록을 몇 배씩 섞어 만들 수 있는 모든 모양 | columns의 모든 linear combinations |
| basis | 같은 모양을 만들되 중복이 없는 최소 재료 | independent spanning set, coordinate change |
| rank | map이 실제로 전달하는 서로 다른 방향 수 | `dim Col(A)=dim Row(A)` |
| null space | input을 바꿨는데 output은 전혀 안 바뀌는 방향 | `Ax=0`, inverse non-uniqueness |
| least squares | exact output이 없을 때 가능한 output 중 가장 가까운 점 | `A^T(b-Ax)=0` |
| pseudoinverse | 가장 가까운 output을 만드는 coefficients 중 가장 짧은 것 | `A^+=VΣ^+U^T`, null projector |
| condition | 작은 input/data error가 solution에서 얼마나 커질 수 있는가 | `κ₂=σ₁/σᵣ`, `||A^+||=1/σᵣ` |

## 공통 worked example

본문 전체에서 다음 matrix를 재사용한다.

```text
A = [[1,0,1],
     [0,1,1],
     [1,0,1],
     [0,1,1]]
b = [1,0,0,0]^T
```

- `a3=a1+a2`, 따라서 `rank(A)=2`.
- `Col(A)=span{a1,a2}`.
- `Null(A)=span{(-1,-1,1)^T}`.
- `b`의 projection은 `(1/2,0,1/2,0)^T`.
- Residual은 `(1/2,0,-1/2,0)^T`이고 `A^T r=0`.
- Minimum-norm coefficients는 `(1/3,-1/6,1/6)^T`.
- 모든 least-squares minimizers는 minimum-norm solution에 null vector의 배수를 더한 것이다.

이 예제가 span에서 pseudoinverse까지 끊기면 안 된다. 새 기호를 도입할 때마다 이 matrix에서 무엇을 뜻하는지 되돌아간다.

## 본문 구조와 증명 의무

### 1. Span, basis와 four subspaces

- Same span / different basis를 분리한다. Basis coordinate는 바뀌지만 subspace와 rank는 invertible coordinate change 아래 보존된다.
- `R^n = Row(A) ⊕ Null(A)`를 input의 visible/erased decomposition으로 읽는다.
- `rank(A)+nullity(A)=n`을 dimension 암기가 아니라 input 자유도 장부로 설명한다.
- Shape, rank와 보존 energy를 서로 다른 수치로 둔다.
- SVD에서 `u_1:r`, `u_r+1:`, `v_1:r`, `v_r+1:`가 네 fundamental subspaces의 orthonormal bases가 됨을 뒤에서 회수한다.

### 2. Projection, least squares와 pseudoinverse

- Inconsistent system에서는 `Ax=b`가 아니라 `min ||Ax-b||²`를 푼다.
- Normal equation은 residual orthogonality condition이며 default numerical implementation recipe가 아님을 명시한다.
- Full-column-rank QR은 `Rx=Q^T b`로 normal matrix를 피한다.
- Rank-deficient SVD는 fitted output, residual, effective rank와 minimum-norm solution을 동시에 드러낸다.
- Penrose 네 equations와 `A^+=VΣ^+U^T`를 연결한다.
- `AA^+`는 column-space projector, `A^+A`는 row-space projector, `I-A^+A`는 null-space projector다.
- `x_LS=A^+b+(I-A^+A)z`로 모든 minimizers와 unique minimum norm을 분리한다.
- 실제 code에서는 explicit `pinv(A) @ b`보다 `lstsq(A,b)`와 solver driver, residual, rank, singular values를 먼저 사용한다.

### 3. Conditioning과 numerical rank

- Full-rank visible subspace에서 `κ₂(A)=σ₁/σᵣ`; exact rank deficient이면 full input space condition은 infinity다.
- `||δx†||≤||A^+||||δb||=||δb||/σᵣ`로 weak direction의 noise amplification을 계산한다.
- `κ₂(A^T A)=κ₂(A)^2`를 normal equation 경고의 정확한 이유로 둔다.
- Numerical rank는 `σ_i>τ`인 directions의 수다. `τ=max(atol,σ₁ rtol)`는 dtype·units·shape·task budget과 함께 기록한다.
- Thresholded pseudoinverse는 variance를 줄이는 대신 signal direction을 버리는 biased estimator다.

### 4. Eigenvalue와 SVD

- `Av=λv -> A^k v=λ^k v`는 eigenvector 위의 repeated fixed-map statement다.
- `ρ(A)<1`은 finite-dimensional fixed linear dynamics의 asymptotic stability를 말하지만 monotone stepwise norm decrease를 뜻하지 않는다.
- `N=[[0.9,4],[0,0.9]]`에서 eigenvalues는 모두 0.9인데 `||Ne2||>4`인 non-normal transient를 계산한다.
- `σ₁=max_{||x||=1}||Ax||`는 one-step worst norm gain이다.
- Defective/complex eigenpair boundary와 rectangular matrix에도 존재하는 real SVD boundary를 구분한다.
- Time-varying Jacobian product, nonlinear saturation와 gradient clipping은 single fixed matrix spectrum 밖의 현대 구현 문제다.

### 5. Low-rank approximation

- `A_k=Σ_{i≤k}σ_i u_i v_i^T`.
- Spectral error `σ_{k+1}`과 Frobenius error `sqrt(Σ_{i>k}σ_i²)`를 모두 계산한다.
- 보존 energy `Σ_{i≤k}σ_i² / Σ_iσ_i²`를 downstream accuracy와 분리한다.
- Eckart-Young의 least-squares 원 결과와 Mirsky의 unitarily invariant norm 확장을 구분한다.
- Eckart-Young-Mirsky의 evidence ceiling은 fixed matrix, rank-at-most-k, declared matrix norm이다.
- `σ_k=σ_{k+1}`이면 optimal subspace가 unique하지 않을 수 있다.
- Factor storage `r(m+n)`이 dense `mn`보다 작을 때만 parameter compression이다.
- Rank explorer의 spectrum `(8.2,3.7,1.25,0.28)`에서 rank 2는 energy 98.0%, spectral error 1.25, Frobenius error 약 1.28, factor/original coefficients 16/16이다.

## 원 출처, 저자 의도와 현대 handoff

| 층 | Primary source / authority | 본문에서 가져올 것 | 가져오지 않을 것 |
|---|---|---|---|
| 학습 순서 | MIT 18.06/18.06SC | Four subspaces, projection, eigen, SVD의 연결 | 특정 library tolerance나 AI benchmark |
| Generalized inverse | Penrose (1955) | Any rectangular/singular matrix에 unique generalized inverse를 정하는 네 equations | Modern floating-point cutoff |
| Stable computation | Golub & Kahan (1965) | Bidiagonalization, SVD/pseudoinverse와 least-squares numerical intent | 현재 GPU driver behavior |
| Low-rank optimum | Eckart & Young (1936) | Fixed-rank least-squares/Frobenius matrix approximation의 error optimum | Spectral-norm extension, semantic/task optimum |
| Norm extension | Mirsky (1960) | Spectral norm을 포함한 unitarily invariant norms로의 확장 | Semantic/task optimum |
| LoRA | Hu et al. (2022) | `ΔW=BA`, frozen base weight와 rank budget | `BA`가 full-finetuning update의 truncated SVD라는 주장 |
| Spectral normalization | Miyato et al. (2018) | Largest singular value로 layer weight를 normalize | 전체 residual network의 exact global guarantee |
| 현재 구현 | PyTorch `torch.linalg.lstsq` / `pinv` docs | QR/SVD driver, rcond, returned rank·singular values | Default가 모든 dtype·unit·deployment에 적절하다는 가정 |

## Hard transfer problems

1. 공통 A에서 column-space basis, rank, null-space basis를 구한다.
2. 공통 b의 projection, residual, residual norm과 minimum-norm coefficients를 계산한다.
3. Basis `{a1,a2}`를 `{a1,a1+a2}`로 바꾸고 span·rank·coordinates 중 무엇이 바뀌는지 설명한다.
4. `diag(1,10^-6)`에 `δb=(0,10^-7)`을 넣어 `δx2=0.1`, `κ(A)=10^6`, `κ(A^T A)=10^12`를 얻는다.
5. Non-normal N에서 `ρ(N)=0.9`와 `||Ne2||>4`가 모순이 아닌 이유를 설명한다.
6. 주어진 singular spectrum에서 rank-2 energy, spectral/Frobenius error와 저장량을 계산한다.

본문만으로 여섯 문제의 operation과 failure boundary를 모두 설명할 수 없으면 완료가 아니다.

## Display 수식 계약

- 모든 display formula source는 `String.raw`.
- 모든 display formula에는 실제 operation을 설명하는 한국어 `underbrace`.
- 각 display 바로 뒤에 `FormulaNote`가 있고 meaning과 모든 새 symbols를 설명한다.
- Mobile에서는 긴 equality를 `gathered`의 짧은 행으로 나눈다.
- Formula에 적은 최적성·stability·conditioning statement의 domain과 assumption을 prose에서 회수한다.

## Viz 책임

- `LinearMapGeometryLab`은 같은 row-space component와 다른 null-space component를 가진 두 입력이 같은 output으로 합쳐지는 과정을 보여 준다. 두 slider는 보존 성분과 소거 성분을 독립 조작하며 `x₁-x₂ ∈ Null(A)`, `Ax₁=Ax₂`, minimum-norm pseudoinverse 선택을 함께 표시한다.
- Article TSX 내부 Rank explorer는 singular spectrum, 보존 energy, spectral·Frobenius loss와 factor storage를 담당한다.
- 두 Viz를 합치지 않는다. 첫째는 identifiability와 inverse ambiguity, 둘째는 approximation budget과 task-evidence boundary를 소유한다.

- Singular value의 상대 크기, retained Frobenius energy, spectral/Frobenius error와 factor/original storage를 구분한다.
- Color 외에도 label·numeric value·명도 차이를 쓴다.
- Heatmap은 conceptual reconstruction임을 명시하고 실제 `U_kΣ_kV_k^T` computation 결과처럼 주장하지 않는다.
- Rank slider가 낮아져도 task accuracy나 semantic preservation을 자동 표시하지 않는다.

## 완료 기준

독자가 `SVD를 하면 차원이 줄어든다`에서 멈추지 않고 다음을 말해야 한다.

- 어느 input basis direction이 output의 어느 direction으로 얼마나 scale되는가.
- Zero/near-zero singular direction이 inverse, noise와 numerical rank에 어떤 차이를 만드는가.
- Projection fit과 minimum-norm coefficient 선택이 왜 별도 문제인가.
- Eigenvalue와 singular value가 각각 repeated mode와 one-step worst gain 중 무엇을 답하는가.
- Low-rank matrix error optimum과 AI task quality가 왜 같은 주장이 아닌가.
