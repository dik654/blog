import { useMemo, useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, ConceptPrimer, LearningHandoff, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { LinearMapGeometryLab } from './foundation-viz/MathGeometryLabs';

type FormulaSymbols = Array<[string, string]>;

function FormulaPanel({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: FormulaSymbols }) {
  return (
    <div className="mb-8">
      <div className="not-prose min-w-0 rounded-md border border-border p-3 sm:p-4">
        <MathFormula display className="my-0 text-[13px] sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const singularValues = [8.2, 3.7, 1.25, 0.28];

function RankExplorer() {
  const [rank, setRank] = useState(2);
  const totalEnergy = singularValues.reduce((sum, value) => sum + value ** 2, 0);
  const retainedEnergy = singularValues.slice(0, rank).reduce((sum, value) => sum + value ** 2, 0);
  const relativeEnergy = retainedEnergy / totalEnergy;
  const residual = globalThis.Math.sqrt(globalThis.Math.max(0, totalEnergy - retainedEnergy));
  const originalCoefficients = 4 * 4;
  const factorCoefficients = rank * (4 + 4);
  const matrix = useMemo(() => [
    [0.95, 0.82, 0.28, 0.12],
    [0.86, 0.74, 0.24, 0.09],
    [0.31, 0.27, rank >= 3 ? 0.58 : 0.2, rank >= 4 ? 0.32 : 0.14],
    [0.14, 0.11, rank >= 3 ? 0.46 : 0.16, rank >= 4 ? 0.52 : 0.18],
  ], [rank]);

  return (
    <figure data-rank-explorer className="foundation-viz-explorer not-prose my-8 scroll-mt-28 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
        <span className="text-sm font-bold">Rank를 줄일 때 무엇이 먼저 사라지는가</span>
        <span className="font-mono text-[11px] font-bold text-cyan-700 dark:text-cyan-300">SINGULAR ENERGY</span>
      </figcaption>
      <div className="border-b border-border bg-cyan-500/[0.035] p-4 sm:p-5">
        <label htmlFor="svd-rank-foundation" className="block text-xs font-semibold text-muted-foreground">
          남길 singular direction · rank {rank}
          <input id="svd-rank-foundation" type="range" min="1" max="4" step="1" value={rank} onChange={(event) => setRank(Number(event.target.value))} className="mt-3 block w-full accent-cyan-700" />
        </label>
      </div>
      <div className="grid min-w-0 gap-7 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.75fr)] lg:p-6">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-bold text-muted-foreground">Singular value와 보존 여부</p>
          <div className="space-y-3">
            {singularValues.map((value, index) => (
              <div key={value} className="grid grid-cols-[2.25rem_minmax(0,1fr)_3.5rem] items-center gap-3 text-xs">
                <span className="font-mono font-bold">σ{index + 1}</span>
                <span className="h-3 overflow-hidden rounded-sm bg-muted ring-1 ring-inset ring-border/50">
                  <span className={`block h-full rounded-sm ${index < rank ? 'bg-cyan-700' : 'bg-muted-foreground/20'}`} style={{ width: `${(value / singularValues[0]) * 100}%` }} />
                </span>
                <span className="text-right font-mono font-semibold">{value.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <dl className="mt-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <div className="bg-background p-3"><dt className="text-[11px] text-muted-foreground">보존 Frobenius energy</dt><dd className="mt-1 font-mono text-lg font-bold">{(relativeEnergy * 100).toFixed(1)}%</dd></div>
            <div className="bg-background p-3"><dt className="text-[11px] text-muted-foreground">Frobenius 오차</dt><dd className="mt-1 font-mono text-lg font-bold">{residual.toFixed(2)}</dd></div>
            <div className="bg-background p-3"><dt className="text-[11px] text-muted-foreground">Factor / original</dt><dd className="mt-1 font-mono text-lg font-bold">{factorCoefficients} / {originalCoefficients}</dd></div>
          </dl>
        </div>
        <div className="min-w-0">
          <p className="mb-3 text-xs font-bold text-muted-foreground">Rank-{rank} 구조의 개념적 복원</p>
          <div className="grid aspect-square max-w-sm grid-cols-4 gap-1 rounded-md border border-border bg-muted/30 p-2" role="img" aria-label={`rank ${rank} 근사 행렬의 4 곱하기 4 heatmap`}>
            {matrix.flatMap((row, rowIndex) => row.map((value, columnIndex) => (
              <span key={`${rowIndex}-${columnIndex}`} className="flex items-center justify-center rounded-sm text-[11px] font-bold text-white" style={{ backgroundColor: `color-mix(in srgb, #0e7490 ${globalThis.Math.round(value * 100)}%, #dbeafe)` }}>{value.toFixed(2)}</span>
            )))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">작은 σ를 버리면 matrix energy는 많이 남을 수 있다. 그러나 label, rare feature와 safety direction이 작은 σ에 놓였는지는 이 숫자만으로 알 수 없다.</p>
        </div>
      </div>
    </figure>
  );
}

function Subspaces() {
  return (
    <section id="subspaces" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">행렬은 어떤 방향을 만들고, 어떤 차이를 지울까?</h2>
      <QuestionLead question="숫자 열이 세 개면 서로 다른 정보도 세 방향일까?" answer="아니다. 한 column이 다른 columns의 합이면 새 방향을 추가하지 않는다. Span은 만들 수 있는 모든 출력, basis는 중복 없는 재료, rank는 독립 출력 방향의 수, null space는 서로 다른 입력이 같은 출력으로 합쳐지는 방향을 말한다." />
      <ConceptPrimer items={[
        { term: 'Span', meaning: '주어진 vectors에 숫자를 곱해 더해서 만들 수 있는 모든 점의 집합이다.', why: 'A의 columns가 만들 수 있는 output 범위를 정한다.' },
        { term: 'Basis', meaning: '같은 span을 만들되 어느 vector도 나머지의 조합이 아닌 목록이다.', why: '저장한 좌표 수와 실제 자유도를 구분한다.' },
        { term: 'Column space', meaning: 'Ax가 도달할 수 있는 output 공간이며 column vectors의 span이다.', why: 'Model prediction이나 sensor output이 놓일 수 있는 범위를 제한한다.' },
        { term: 'Row space', meaning: '입력에서 A가 실제로 읽어 내는 directions의 공간이다.', why: 'Null space와 직교하며 구분 가능한 input component를 나타낸다.' },
        { term: 'Rank', meaning: 'Column space와 row space의 공통 dimension이다.', why: '행·열 개수가 아니라 map이 전달하는 독립 방향 수를 센다.' },
        { term: 'Null space', meaning: 'A를 통과하면 zero가 되어 output에서 구분할 수 없는 input directions다.', why: 'Inverse가 유일할 수 없는 이유와 redundancy를 찾는다.' },
      ]} />

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{A=
\begin{bmatrix}
1&0&1\\
0&1&1\\
1&0&1\\
0&1&1
\end{bmatrix}}_{\text{네 observations와 세 input coordinates}}\\[5pt]
\underbrace{a_3=a_1+a_2}_{\text{세 번째 column은 새 방향이 아님}}\\[5pt]
\underbrace{\operatorname{Col}(A)=\operatorname{span}\{a_1,a_2\}}_{\text{도달 가능한 output plane}}\\[5pt]
\underbrace{\operatorname{rank}(A)=2}_{\text{독립 output directions 두 개}}\\[5pt]
\underbrace{A\begin{bmatrix}-1\\-1\\1\end{bmatrix}=0}_{\text{입력 차이 하나가 output에서 사라짐}}
\end{gathered}`}
        meaning="같은 column을 두 번 세거나 기존 columns의 합을 추가해도 span은 넓어지지 않는다. 이 A는 세 입력 좌표를 받지만 output에는 두 독립 조합만 남긴다. Null vector만큼 input을 바꿔도 Ax가 같으므로 ordinary inverse로 원래 x를 하나로 복원할 수 없다."
        symbols={[[String.raw`a_i`, 'A의 i번째 column'], [String.raw`\operatorname{Col}(A)`, 'A가 만들 수 있는 output vectors의 공간'], [String.raw`\operatorname{rank}(A)`, 'Column 또는 row space의 dimension'], [String.raw`[-1,-1,1]^\top`, 'A가 zero로 보내는 null-space basis vector']]}
      />

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        <div className="bg-background p-4"><p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">같은 공간, 다른 basis</p><p className="mt-2 text-sm leading-relaxed"><code>{'{a₁,a₂}'}</code>와 <code>{'{a₁,a₁+a₂}'}</code>는 좌표 숫자는 다르지만 같은 column space를 만든다. Basis는 주소 체계이고 subspace는 실제 장소다.</p></div>
        <div className="bg-background p-4"><p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Rank는 coordinate invariant</p><p className="mt-2 text-sm leading-relaxed">Invertible basis change를 입력과 출력에 적용하면 matrix entries는 달라져도 rank와 잃는 자유도의 수는 바뀌지 않는다.</p></div>
        <div className="bg-background p-4"><p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Zero singular value</p><p className="mt-2 text-sm leading-relaxed">Null direction에는 scale이 0이다. 정확한 rank deficiency와 아주 작은 scale을 floating point에서 구분하려면 tolerance가 필요하다.</p></div>
        <div className="bg-background p-4"><p className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Shape는 rank가 아니다</p><p className="mt-2 text-sm leading-relaxed"><code>4×3</code>은 storage shape이고 rank 2는 실제 독립 map dimension이다. 큰 matrix도 반복 columns면 low rank일 수 있다.</p></div>
      </div>

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{\mathbb R^n=\operatorname{Row}(A)\oplus\operatorname{Null}(A)}_{\text{보이는 성분과 null 성분의 직교 분해}}\\[4pt]
\underbrace{x=x_{\mathrm{row}}+x_{\mathrm{null}}}_{\text{input 두 성분}}\\[4pt]
\underbrace{Ax=Ax_{\mathrm{row}}}_{\text{null 성분은 output에서 사라짐}}\\[4pt]
\underbrace{\operatorname{rank}(A)+\operatorname{nullity}(A)=n}_{\text{input 자유도 장부}}
\end{gathered}`}
        meaning="Input space의 모든 vector는 row-space component와 null-space component로 유일하게 나뉜다. A는 row component만 output으로 보내고 null component는 지운다. Rank-nullity는 input n directions가 보이는 directions와 사라지는 directions 사이에 빠짐없이 배분된다는 dimension 장부다."
        symbols={[[String.raw`\operatorname{Row}(A)`, 'A가 input에서 읽는 directions의 공간'], [String.raw`\operatorname{Null}(A)`, 'A가 zero로 보내는 input directions'], [String.raw`\oplus`, '두 orthogonal subspaces의 direct sum'], [String.raw`\operatorname{nullity}(A)`, 'Null space의 dimension'], [String.raw`n`, 'A의 input column 수']]}
      />
      <LinearMapGeometryLab />
      <Misconception>Rank 2는 “원래 정보의 2/3를 보존한다”는 백분율이 아니다. Dimension 두 개가 남는다는 뜻일 뿐이며, 방향별 scale과 task importance는 singular values와 downstream evidence를 추가로 봐야 한다.</Misconception>
    </section>
  );
}

function LeastSquares() {
  return (
    <section id="least-squares" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">정확한 해가 없거나 너무 많을 때 어느 해를 고를까?</h2>
      <QuestionLead question="Ax=b가 맞지 않으면 실패이고, 해가 여러 개면 아무거나 골라도 될까?" answer="관측 b를 column space에 직각 투영하면 가장 작은 residual을 얻는다. Rank가 부족해 coefficients가 여러 개면 pseudoinverse가 그중 Euclidean norm이 가장 작은 해를 고른다. Fit 기준과 coefficient 선택 기준은 서로 다른 두 단계다." />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>앞의 A가 만드는 output은 <code>(α,β,α,β)</code> 모양뿐이다. 관측 <code>b=(1,0,0,0)</code>은 첫째와 셋째 좌표가 달라 column space 밖에 있다. 가장 가까운 점은 두 값을 평균 낸 <code>(1/2,0,1/2,0)</code>이다.</p>
      </div>

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{b=\begin{bmatrix}1\\0\\0\\0\end{bmatrix}}_{\text{column space 밖의 관측}}\\[6pt]
\underbrace{\widehat b=Ax^\dagger=\begin{bmatrix}\tfrac12\\0\\\tfrac12\\0\end{bmatrix}}_{\text{가장 가까운 column-space projection}}\\[6pt]
\underbrace{r=b-\widehat b=\begin{bmatrix}\tfrac12\\0\\-\tfrac12\\0\end{bmatrix}}_{\text{설명하지 못한 residual}}\\[6pt]
\underbrace{A^\top r=0}_{\text{모든 columns와 직교}}\\[6pt]
\underbrace{x^\dagger=\begin{bmatrix}\tfrac13\\-\tfrac16\\\tfrac16\end{bmatrix}}_{\text{norm이 최소인 coefficients}}\\[6pt]
\underbrace{\lVert r\rVert_2=\tfrac1{\sqrt2}}_{\text{minimum residual length}}
\end{gathered}`}
        meaning="Projection은 output-space 오차를 먼저 최소화한다. 이 A는 null direction이 있어 같은 fitted output을 만드는 coefficient vectors가 무한히 많다. Dagger로 표시한 x는 그 집합에서 origin에 가장 가까운 minimum-norm solution이며, residual은 column space에 직교한다."
        symbols={[[String.raw`b`, '설명하려는 observed output'], [String.raw`\widehat b`, 'Column space 위의 least-squares projection'], [String.raw`r=b-\widehat b`, 'Model columns로 설명되지 않는 residual'], [String.raw`x^\dagger`, 'Minimum-norm least-squares coefficients'], [String.raw`A^\top r=0`, 'Residual과 모든 columns의 dot product가 zero인 최적 조건']]}
      />

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{x^*=\arg\min_x\lVert Ax-b\rVert_2^2}_{\text{residual squared length를 최소화}}\\[4pt]
\underbrace{A^\top(Ax^*-b)=0}_{\text{normal equation: residual을 column space에 직교시킴}}\\[4pt]
\underbrace{A=QR,\qquad Rx^*=Q^\top b}_{\text{full-column-rank이면 orthogonal QR로 직접 solve}}
\end{gathered}`}
        meaning="Normal equation은 optimum의 기하 조건이지 반드시 따라야 할 numerical recipe가 아니다. Full-column-rank A에서는 QR이 column space를 orthonormal basis Q로 만들고 작은 triangular system R을 푼다. Rank deficient하거나 ill-conditioned하면 pivoted QR 또는 SVD가 rank와 solution choice를 더 명시적으로 드러낸다."
        symbols={[[String.raw`x^*`, 'Least-squares minimizer'], [String.raw`A^\top(Ax^*-b)=0`, 'Residual orthogonality condition'], [String.raw`Q`, 'A의 column space를 span하는 orthonormal columns'], [String.raw`R`, 'QR에서 얻는 upper-triangular coefficient map']]}
      />

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{A^+=V\Sigma^+U^\top}_{\text{nonzero }\sigma\text{만 reciprocal}}\\[4pt]
\underbrace{x^\dagger=A^+b}_{\text{minimum-norm least-squares solution}}\\[4pt]
\underbrace{AA^+b}_{\text{b를 column space로 projection}}\\[4pt]
\underbrace{x_{\mathrm{LS}}=A^+b+(I-A^+A)z}_{\text{모든 minimizers: null 성분은 자유}}
\end{gathered}`}
        meaning="SVD 좌표에서 pseudoinverse는 nonzero σ만 reciprocal로 바꾼다. A^+A는 input을 row space로, AA^+는 output을 column space로 직각 투영한다. 따라서 A^+b는 null component가 없는 유일한 minimum-norm solution이고, 나머지 minimizers는 arbitrary null-space vector를 더한 것이다."
        symbols={[[String.raw`A^+`, 'Rectangular 또는 singular A에도 정의되는 Moore-Penrose pseudoinverse'], [String.raw`\Sigma^+`, 'Nonzero singular values를 1/σ로 바꾸고 zero는 zero로 둔 diagonal map'], [String.raw`AA^+`, 'Column-space orthogonal projector'], [String.raw`I-A^+A`, 'Null-space orthogonal projector'], [String.raw`z`, 'Null component를 만드는 arbitrary input vector']]}
      />

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{AA^+A=A,\qquad A^+AA^+=A^+}_{\text{map과 generalized inverse가 서로 일관됨}}\\[4pt]
\underbrace{(AA^+)^\top=AA^+,\qquad(A^+A)^\top=A^+A}_{\text{두 products가 orthogonal projections}}\\[4pt]
\underbrace{A\text{ square and nonsingular}\Longrightarrow A^+=A^{-1}}_{\text{ordinary inverse는 special case}}
\end{gathered}`}
        meaning="Penrose가 1955년에 제시한 네 equations는 어떤 rectangular 또는 singular matrix에도 unique한 generalized inverse를 정한다. 첫 두 식은 inverse-like consistency를, transpose 조건은 oblique projection이 아니라 orthogonal projection을 고른다는 것을 고정한다."
        symbols={[[String.raw`AA^+A=A`, 'A를 pseudoinverse 사이에 넣어도 원래 map을 보존'], [String.raw`A^+AA^+=A^+`, 'Pseudoinverse 쪽의 대응 consistency'], [String.raw`AA^+`, 'Output-space projector'], [String.raw`A^+A`, 'Input row-space projector'], [String.raw`A^{-1}`, 'Square full-rank case의 ordinary inverse']]}
      />

      <Misconception><code>(AᵀA)⁻¹Aᵀb</code>는 정의도 구현도 보편식이 아니다. Rank가 부족하면 inverse가 없고, full rank여도 AᵀA를 만들면 condition number가 제곱된다. 실제 solve에서는 explicit inverse·pseudoinverse product보다 <code>lstsq</code>의 QR/SVD driver와 residual·rank·singular values를 함께 확인한다.</Misconception>
    </section>
  );
}

function Eigen() {
  return (
    <section id="eigen" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">반복 mode와 한 번의 worst-case 증폭은 왜 다른가?</h2>
      <QuestionLead question="모든 eigenvalue가 1보다 작으면 매 step 모든 vector가 줄어들까?" answer="장기적으로는 stable할 수 있지만 매 step norm이 줄어든다는 뜻은 아니다. Eigenvalue는 방향을 유지하는 mode의 반복 배율이고, singular value는 모든 unit input 중 한 번에 가장 많이 늘어나는 방향을 찾는다. Non-normal matrix에서는 두 진단이 크게 갈릴 수 있다." />

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{Av_i=\lambda_i v_i}_{\text{방향을 유지하는 eigen mode}}\\[4pt]
\underbrace{A^kv_i=\lambda_i^k v_i}_{\text{같은 map을 }k\text{번 적용하면 scale도 거듭제곱}}\\[4pt]
\underbrace{\rho(A)=\max_i|\lambda_i|<1}_{\text{fixed finite-dimensional linear dynamics의 asymptotic decay 조건}}
\end{gathered}`}
        meaning="Eigenvector 위에서는 matrix가 방향을 바꾸지 않고 λ만 곱한다. 같은 fixed A를 반복하면 λ의 k제곱이 되며 spectral radius가 1보다 작으면 모든 trajectories가 결국 zero로 간다. 하지만 decay rate의 constant와 중간 transient는 eigenvector geometry와 Jordan structure에 좌우된다."
        symbols={[[String.raw`v_i`, 'A가 방향을 유지하는 eigenvector 또는 mode'], [String.raw`\lambda_i`, '해당 mode의 one-step scale과 sign/phase'], [String.raw`k`, '같은 linear map의 반복 횟수'], [String.raw`\rho(A)`, 'Eigenvalue magnitudes 중 maximum인 spectral radius']]}
      />

      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        <div className="bg-background p-4"><p className="font-mono text-base font-bold">|λ| &lt; 1</p><p className="mt-2 text-sm font-bold text-cyan-700 dark:text-cyan-300">그 eigen mode는 감쇠</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">전체 vector의 stepwise norm 감소와는 다르다.</p></div>
        <div className="bg-background p-4"><p className="font-mono text-base font-bold">|λ| = 1</p><p className="mt-2 text-sm font-bold text-cyan-700 dark:text-cyan-300">그 mode scale은 보존</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Jordan block이면 polynomial growth가 붙을 수 있다.</p></div>
        <div className="bg-background p-4"><p className="font-mono text-base font-bold">|λ| &gt; 1</p><p className="mt-2 text-sm font-bold text-cyan-700 dark:text-cyan-300">그 mode는 증폭</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Initial state에 해당 component가 있으면 장기 발산한다.</p></div>
      </div>

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{N=\begin{bmatrix}0.9&4\\0&0.9\end{bmatrix}}_{\text{non-normal map}}\\[6pt]
\underbrace{\lambda_1=\lambda_2=0.9}_{\text{eigenvalue상 asymptotically stable}}\\[6pt]
\underbrace{\lVert Ne_2\rVert_2=\sqrt{4^2+0.9^2}>4}_{\text{한 step에서는 크게 증폭}}\\[6pt]
\underbrace{N^k=\begin{bmatrix}0.9^k&4k\,0.9^{k-1}\\0&0.9^k\end{bmatrix}}_{\text{coupling이 만든 transient 뒤 decay}}
\end{gathered}`}
        meaning="두 eigenvalues가 모두 0.9여도 e2 방향은 한 step에 4배 이상 커진다. Off-diagonal coupling이 directions를 거의 겹치게 만들어 반복 초기에 큰 transient가 생긴다. 따라서 RNN state나 gradient를 진단할 때 spectral radius만 보고 activation peak와 numerical overflow가 없다고 결론 내릴 수 없다."
        symbols={[[String.raw`N`, 'Upper-triangular non-normal example matrix'], [String.raw`e_2`, '두 번째 coordinate unit vector'], [String.raw`\lambda_1,\lambda_2`, 'N의 repeated eigenvalues'], [String.raw`4k\,0.9^{k-1}`, 'Mode coupling이 만드는 transient term']]}
      />
      <Misconception>Eigen decomposition은 모든 square matrix에 real orthogonal basis를 주지 않는다. Defective matrix는 eigenvectors가 basis를 이루지 못할 수 있고 real matrix도 complex eigenpairs를 가질 수 있다. SVD는 rectangular matrix에도 real orthogonal input·output bases를 주지만 dynamics의 signed phase를 대신 설명하지는 않는다.</Misconception>
    </section>
  );
}

function Svd() {
  return (
    <section id="svd" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">SVD는 보이는 방향, 지워지는 방향과 불안정한 방향을 어떻게 한 번에 보여 줄까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>SVD는 input을 orthogonal directions <code>vᵢ</code>로 다시 읽고, 각 direction을 nonnegative <code>σᵢ</code>만큼 늘인 뒤 output direction <code>uᵢ</code>로 보낸다. Zero σ는 null space이고, 아주 작은 σ는 inverse에서 noise를 크게 확대하는 weak direction이다.</p>
      </div>

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{A=U\Sigma V^\top}_{\text{input 회전 }\to\text{ direction별 scale }\to\text{ output 회전}}\\[4pt]
\underbrace{x=\sum_i\alpha_i v_i\Longrightarrow Ax=\sum_i\sigma_i\alpha_i u_i}_{\text{각 singular direction을 독립적으로 전달}}\\[4pt]
\underbrace{\sigma_1(A)=\max_{\lVert x\rVert_2=1}\lVert Ax\rVert_2}_{\text{한 step의 worst-case norm gain}}
\end{gathered}`}
        meaning="V transpose는 input을 singular basis coefficients α로 바꾸고, Σ는 각 coefficient를 σ만큼 scale하며, U는 output basis로 조립한다. Largest singular value는 unit input 중 가장 크게 늘어나는 방향의 exact gain이다. Eigenvalue와 달리 A가 rectangular여도 정의된다."
        symbols={[[String.raw`V=[v_1,\ldots]`, 'Input-space orthonormal singular vectors'], [String.raw`\Sigma`, 'Descending nonnegative singular values를 담은 diagonal matrix'], [String.raw`U=[u_1,\ldots]`, 'Output-space orthonormal singular vectors'], [String.raw`\alpha_i=v_i^\top x`, 'Input x의 singular-basis coordinate'], [String.raw`\sigma_1(A)`, 'Induced 2-norm 또는 spectral norm']]}
      />

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{\operatorname{Col}(A)=\operatorname{span}\{u_1,\ldots,u_r\}}_{\text{도달 가능한 output directions}}\\[5pt]
\underbrace{\operatorname{Null}(A^\top)=\operatorname{span}\{u_{r+1},\ldots\}}_{\text{설명할 수 없는 output directions}}\\[5pt]
\underbrace{\operatorname{Row}(A)=\operatorname{span}\{v_1,\ldots,v_r\}}_{\text{input에서 읽히는 directions}}\\[5pt]
\underbrace{\operatorname{Null}(A)=\operatorname{span}\{v_{r+1},\ldots\}}_{\text{input에서 지워지는 directions}}
\end{gathered}`}
        meaning="SVD는 네 fundamental subspaces에 orthonormal bases를 동시에 준다. Nonzero σ와 연결된 v는 읽히는 input, u는 도달 가능한 output이다. 나머지 v는 A가 zero로 보내고, 나머지 u는 어떤 Ax로도 만들 수 없는 left-null directions다."
        symbols={[[String.raw`r`, 'Nonzero singular values의 수이자 rank'], [String.raw`u_{1:r}`, 'Column-space orthonormal basis'], [String.raw`u_{r+1:}`, 'Left-null-space orthonormal basis'], [String.raw`v_{1:r}`, 'Row-space orthonormal basis'], [String.raw`v_{r+1:}`, 'Null-space orthonormal basis']]}
      />

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{\kappa_{2,\mathrm{vis}}(A)=\frac{\sigma_1}{\sigma_r}}_{\text{visible directions의 scale 불균형}}\\[5pt]
\underbrace{\operatorname{Null}(A)\ne\{0\}}_{\text{exact zero direction이 존재}}
\Longrightarrow x\text{ 전체는 식별 불가}\\[5pt]
\underbrace{\lVert\delta x^\dagger\rVert_2
\le\lVert A^+\rVert_2\lVert\delta b\rVert_2}_{\text{pseudoinverse의 noise gain}}\\[5pt]
\underbrace{\lVert A^+\rVert_2=\frac1{\sigma_r}}_{\text{weakest visible scale의 reciprocal}}\\[5pt]
\underbrace{A\text{ full column rank}}_{\text{normal-equation 제곱 법칙의 전제}}\\[3pt]
\underbrace{\kappa_2(A^\top A)=\kappa_2(A)^2}_{\text{conditioning이 제곱됨}}
\end{gathered}`}
        meaning="Visible-subspace condition number는 strongest와 weakest nonzero directions의 scale ratio다. Exact null direction이 있으면 full input x는 output만으로 unique하게 식별되지 않는다. A가 고정된 least-squares problem에서 b perturbation은 A^+를 통과하므로 smallest retained singular value의 reciprocal만큼 커질 수 있다. Full-column-rank A에서 A transpose A의 eigenvalues는 σ squared이므로 normal equations는 어려운 비율을 제곱한다."
        symbols={[[String.raw`\kappa_{2,\mathrm{vis}}(A)`, 'Nonzero singular subspace에서 잰 2-norm condition ratio'], [String.raw`\sigma_1,\sigma_r`, 'Largest와 smallest nonzero singular values'], [String.raw`\operatorname{Null}(A)`, 'Output에서 구별할 수 없는 exact input directions'], [String.raw`\delta b`, 'Observation perturbation'], [String.raw`\delta x^\dagger`, 'Minimum-norm solution의 변화'], [String.raw`\lVert A^+\rVert_2`, 'Pseudoinverse의 worst-case noise gain']]}
      />

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{r_\tau=\#\{i:\sigma_i>\tau\}}_{\text{tolerance가 정하는 numerical rank}}\\[4pt]
\underbrace{\Sigma_\tau^+=\operatorname{diag}\!\left(
\begin{cases}
1/\sigma_i,&\sigma_i>\tau\\
0,&\sigma_i\le\tau
\end{cases}\right)}_{\text{weak directions를 inverse하지 않고 잘라 냄}}\\[6pt]
\underbrace{\tau=\max(\mathrm{atol},\,\sigma_1\mathrm{rtol})}_{\text{absolute와 relative scale을 함께 둔 implementation cutoff}}
\end{gathered}`}
        meaning="Floating-point code에서 rank와 pseudoinverse는 exact zero test가 아니라 tolerance contract다. Threshold 아래 σ를 zero로 두면 noise amplification은 줄지만 그 direction의 signal도 버리는 biased solution이 된다. Dtype, units, matrix shape와 task error budget 없이 default tolerance만 복사하면 재현 가능한 rank contract가 아니다."
        symbols={[[String.raw`r_\tau`, 'Threshold tau에서의 effective numerical rank'], [String.raw`\tau`, 'Singular-value cutoff'], [String.raw`\mathrm{atol}`, 'Absolute scale에 대한 tolerance'], [String.raw`\mathrm{rtol}`, 'Largest singular value 대비 relative tolerance'], [String.raw`\Sigma_\tau^+`, 'Thresholded pseudoinverse diagonal']]}
      />

      <RankExplorer />

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{A_k=\sum_{i=1}^k\sigma_i u_iv_i^\top}_{\text{top-}k\text{ singular components 복원}}\\[5pt]
\underbrace{\min_{\operatorname{rank}(B)\le k}\lVert A-B\rVert_2}_{\text{best spectral error}}
=\underbrace{\lVert A-A_k\rVert_2=\sigma_{k+1}}_{\text{남는 worst direction}}\\[5pt]
\underbrace{\min_{\operatorname{rank}(B)\le k}\lVert A-B\rVert_F}_{\text{best Frobenius error}}\\[-1pt]
=\underbrace{\lVert A-A_k\rVert_F
=\sqrt{\sum_{i>k}\sigma_i^2}}_{\text{버린 singular energy의 합}}\\[5pt]
\underbrace{\frac{\sum_{i\le k}\sigma_i^2}{\sum_i\sigma_i^2}}_{\text{보존 matrix energy 비율}}
\neq\underbrace{\text{task accuracy}}_{\text{task 의미는 별도 evidence}}
\end{gathered}`}
        meaning="Eckart-Young의 least-squares 결과와 Mirsky의 unitarily invariant norm 확장은 rank at most k인 모든 matrices 중 truncated SVD가 Frobenius 또는 spectral matrix error를 최소화한다고 말한다. 이는 fixed matrix와 specified norm에 대한 최적성이다. σk와 σ(k+1)이 같으면 best subspace가 unique하지 않을 수 있고, 작은-energy direction이 task에는 중요할 수도 있다."
        symbols={[[String.raw`A_k`, 'Top-k singular components로 만든 rank-at-most-k approximation'], [String.raw`\lVert\cdot\rVert_2`, 'Worst unit-input gain을 재는 spectral norm'], [String.raw`\lVert\cdot\rVert_F`, '모든 entries 또는 singular energies를 합친 Frobenius norm'], [String.raw`\sigma_{k+1}`, 'Truncation 뒤 남는 largest discarded singular value'], [String.raw`\sum_{i>k}\sigma_i^2`, 'Discarded Frobenius energy']]}
      />
    </section>
  );
}

const transferProblems = [
  ['01 · Span과 null', '본문의 4×3 A에서 basis columns, rank와 null-space basis를 찾는다.', 'a₃=a₁+a₂이므로 basis는 {a₁,a₂}, rank=2, Null(A)=span{(-1,-1,1)}다.'],
  ['02 · Projection과 pinv', 'b=(1,0,0,0)의 projection, residual과 minimum-norm coefficients를 계산한다.', 'b-hat=(1/2,0,1/2,0), r=(1/2,0,-1/2,0), x-dagger=(1/3,-1/6,1/6)이며 Aᵀr=0이다.'],
  ['03 · Basis 교체', '{a₁,a₂}를 {a₁,a₁+a₂}로 바꾸면 span·rank·coordinates 중 무엇이 바뀌는가?', 'Span과 rank는 같고 같은 output vector를 적는 coefficient coordinates만 달라진다.'],
  ['04 · Conditioning', 'A=diag(1,10⁻⁶)에서 b₂가 10⁻⁷ 변하면 x₂와 normal-equation condition은 얼마나 변하는가?', 'δx₂=10⁻⁷/10⁻⁶=0.1이고 κ₂(A)=10⁶, κ₂(AᵀA)=10¹²다.'],
  ['05 · Eigen 대 singular', 'N의 eigenvalues가 0.9인데도 e₂가 한 step에 커지는 이유를 설명한다.', 'Non-normal off-diagonal coupling 때문에 ||Ne₂||=sqrt(16.81)>4다. Eigenvalues는 long-run mode, σ₁은 one-step worst gain을 답한다.'],
  ['06 · Rank-2 압축', 'σ=(8.2,3.7,1.25,0.28)에서 rank 2의 energy, 두 norm 오차와 factor 저장량을 계산한다.', 'Energy 98.0%, spectral error 1.25, Frobenius error 약 1.28이다. 4×4에서는 2(4+4)=16이라 원본 16 coefficients보다 작지 않다.'],
];

function AiBridge() {
  return (
    <section id="ai-bridge" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">현재 AI·robot paper에서는 이 도구를 어디까지 주장할 수 있을까?</h2>
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {[
          ['Centered data·PCA', 'SVD', 'Centered sample matrix의 top right-singular directions가 큰 sample variance를 보존한다.', 'Centering을 빼면 mean direction이 지배할 수 있고 variance는 label importance가 아니다.'],
          ['Rank-deficient readout', 'lstsq·pseudoinverse', 'Projection과 minimum-norm coefficient를 분리하고 residual·effective rank를 함께 반환한다.', 'Explicit pinv@b보다 solver driver, dtype와 cutoff가 실제 numerical contract다.'],
          ['RNN·Jacobian product', 'Eigen·singular values', 'Eigen modes는 repeated fixed dynamics, σ₁은 local worst-case gradient/state gain을 진단한다.', 'Time-varying Jacobian product와 nonlinear saturation은 한 matrix spectrum으로 끝나지 않는다.'],
          ['LoRA', 'ΔW=BA', 'Frozen W에 rank-at-most-r trainable update를 넣어 parameter budget을 줄인다.', 'Learned BA는 W나 full-finetuning update의 truncated SVD라고 자동 해석할 수 없다.'],
          ['Spectral normalization', 'σ₁(W)', 'Layer weight를 largest singular value로 나누어 one-layer norm gain을 제어한다.', 'Residual paths, nonlinearities와 layer composition을 포함한 full-network guarantee는 별도다.'],
          ['Robot Jacobian', 'Null·pinv·condition', 'Task velocity projection, redundant joint null motion과 near-singular amplification을 분리한다.', 'Joint limits, damping, units와 actuator bounds가 없으면 raw pinv command는 deployment-safe하지 않다.'],
        ].map(([task, tool, insight, limit]) => (
          <div key={task} className="grid gap-2 border-b border-border p-4 last:border-0 lg:grid-cols-[9rem_10rem_minmax(0,1fr)]">
            <div><p className="text-sm font-bold">{task}</p><p className="mt-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">{tool}</p></div>
            <p className="text-xs leading-relaxed">{insight}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">경계 · {limit}</p>
          </div>
        ))}
      </div>

      <FormulaPanel
        latex={String.raw`\begin{gathered}
\underbrace{\Delta W=BA}_{\text{LoRA의 low-rank weight update}}\\[5pt]
\underbrace{\operatorname{rank}(\Delta W)\le r}_{\text{update subspace budget}}\\[5pt]
\underbrace{r(d_{\mathrm{in}}+d_{\mathrm{out}})}_{\text{factor parameters}}
\quad\text{vs}\quad
\underbrace{d_{\mathrm{in}}d_{\mathrm{out}}}_{\text{dense parameters}}\\[5pt]
\underbrace{\overline W=\frac{W}{\sigma_1(W)}}_{\text{spectral normalization}}\\[5pt]
\underbrace{\lVert\overline W x\rVert_2\le\lVert x\rVert_2}_{\text{한 linear layer의 norm gain bound}}
\end{gathered}`}
        meaning="Original LoRA는 full weight를 SVD로 압축하는 대신 trainable update를 두 thin factors로 parameterize한다. Spectral normalization은 largest singular value로 weight를 rescale한다. 두 현대 사용 모두 SVD 언어를 쓰지만, 전자는 update subspace budget이고 후자는 one-layer gain bound다."
        symbols={[[String.raw`\Delta W`, 'Frozen pretrained weight에 더하는 learned update'], [String.raw`B,A`, 'Output-by-r와 r-by-input trainable factors'], [String.raw`r`, 'LoRA rank budget'], [String.raw`\sigma_1(W)`, 'Weight W의 largest singular value'], [String.raw`\overline W`, 'Spectral norm이 at most one이 되도록 normalized weight']]}
      />

      <div className="not-prose my-10">
        <p className="mb-3 text-xs font-bold text-muted-foreground">Hard transfer problems · 답을 가리지 말고 먼저 계산</p>
        <ol className="divide-y divide-border border-y border-border">
          {transferProblems.map(([label, problem, check]) => (
            <li key={label} className="grid gap-2 py-4 lg:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
              <span className="font-mono text-xs font-black text-cyan-700 dark:text-cyan-300">{label}</span>
              <span className="text-sm font-semibold leading-relaxed">{problem}</span>
              <span className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">검산:</strong> {check}</span>
            </li>
          ))}
        </ol>
      </div>

      <CapabilityCheck items={[
        '같은 span을 만드는 redundant list와 basis를 구분하고 coordinate change 뒤에도 rank가 유지됨을 설명한다.',
        '한 matrix에서 column space, row space, null space와 left-null space의 역할을 구분한다.',
        'Rank-nullity를 input의 visible component와 erased component 장부로 계산한다.',
        'Inconsistent·rank-deficient least squares에서 projection, residual, 모든 minimizers와 minimum-norm solution을 찾는다.',
        'Normal equation의 기하와 QR/SVD numerical solve를 분리하고 condition squaring을 설명한다.',
        'Eigenvalue의 repeated mode와 singular value의 one-step norm gain을 non-normal example로 구분한다.',
        'Truncated SVD의 spectral·Frobenius error와 energy를 계산하고 semantic accuracy claim을 분리한다.',
        'Pseudoinverse cutoff, LoRA rank와 spectral normalization이 각각 버리는 방향·보장하는 범위를 말한다.',
      ]} />
      <LearningHandoff
        description="분해가 만든 핵심 산출물은 어느 input direction이 보존·증폭·소거되는지, solution이 unique한지, 그리고 작은 perturbation이 얼마나 커지는지다. 이 계약을 곡률, 좌표 변환과 실제 rank-loss 진단에 넘긴다."
        items={[
          { label: '막히면', slug: 'linear-algebra-tensors', title: '선형대수와 Tensor Shape', reason: 'Basis, dot product, matrix product와 column space의 좌표 의미를 작은 숫자로 다시 계산한다.' },
          { label: '이어 읽기', slug: 'optimization-geometry', title: '최적화의 기하', reason: 'Hessian eigen-direction과 condition number가 gradient 경로와 step size를 어떻게 바꾸는지 연결한다.' },
          { label: '적용하기', slug: 'robot-kinematics-coordinate-frames', title: '로봇 좌표계와 Kinematics', reason: 'Jacobian singular value와 null space가 손끝 속도, 역기구학과 redundancy를 어떻게 제한하는지 검산한다.' },
        ]}
      />
      <SourceNotes sources={[
        { label: 'MIT OpenCourseWare · Linear Algebra', href: 'https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/', note: '네 fundamental subspaces, projection, eigenvalue와 SVD를 잇는 학습 순서의 기반.' },
        { label: 'Penrose (1955) · A Generalized Inverse for Matrices', href: 'https://doi.org/10.1017/S0305004100030401', note: 'Rectangular·singular matrix에도 unique generalized inverse를 정하는 네 equations의 원 출처.' },
        { label: 'Golub & Kahan (1965) · Singular Values and Pseudo-Inverse', href: 'https://doi.org/10.1137/0702016', note: 'Bidiagonalization 기반 stable SVD computation과 least-squares pseudoinverse의 numerical intent.' },
        { label: 'Eckart & Young (1936) · Lower-Rank Approximation', href: 'https://doi.org/10.1007/BF02288367', note: 'Fixed rank least-squares, 즉 Frobenius matrix error 안에서 low-rank approximation을 푸는 원 출처.' },
        { label: 'Mirsky (1960) · Unitarily Invariant Norms', href: 'https://doi.org/10.1093/qmath/11.1.50', note: 'Eckart-Young 결과를 spectral norm을 포함한 unitarily invariant norms로 확장하는 출처.' },
        { label: 'Hu et al. (2022) · LoRA', href: 'https://openreview.net/forum?id=nZeVKeeFYf9', note: 'Frozen pretrained weights에 trainable low-rank update factors를 넣는 현대 parameterization의 1차 출처.' },
        { label: 'Miyato et al. (2018) · Spectral Normalization', href: 'https://openreview.net/forum?id=B1QRgziT-', note: 'Largest singular value를 GAN discriminator weight normalization에 사용하는 현대 1차 출처.' },
        { label: 'PyTorch · torch.linalg.lstsq', href: 'https://docs.pytorch.org/docs/stable/generated/torch.linalg.lstsq.html', note: 'QR/SVD drivers, numerical rank cutoff와 explicit pseudoinverse를 피하는 현재 implementation boundary.' },
      ]} />
    </section>
  );
}

export default function LinearAlgebraDecompositionsArticle() {
  return <><Subspaces /><LeastSquares /><Eigen /><Svd /><AiBridge /></>;
}
