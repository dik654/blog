import { useMemo, useState } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, CapabilityCheck, ConceptPrimer, LearningHandoff, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { ConstrainedOptimumLab } from './foundation-viz/MathGeometryLabs';

const raw = String.raw;

type FormulaSymbols = Array<[string, string]>;

function Equation({ latex, meaning, symbols, tone = 'default' }: { latex: string; meaning: string; symbols: FormulaSymbols; tone?: 'default' | 'orange' }) {
  return (
    <div className="my-7">
      <div className={`not-prose min-w-0 rounded-md border p-3 sm:p-4 ${tone === 'orange' ? 'border-orange-500/35 bg-orange-500/5' : 'border-border'}`}>
        <MathFormula display className="my-0 text-xs sm:text-sm lg:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

function TransferCheck({ title, question, checks }: { title: string; question: string; checks: string[] }) {
  return (
    <aside className="not-prose my-8 border-y border-orange-500/35 bg-orange-500/[0.035] py-5">
      <p className="text-xs font-black text-orange-700 dark:text-orange-300">HARD TRANSFER · {title}</p>
      <p className="mt-2 text-sm font-semibold leading-relaxed">{question}</p>
      <ol className="mt-4 grid gap-2">
        {checks.map((check, index) => (
          <li key={check} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-mono font-black text-foreground">{String(index + 1).padStart(2, '0')}</span>
            <span>{check}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function LandscapeExplorer() {
  const [condition, setCondition] = useState(8);
  const [learningRate, setLearningRate] = useState(0.12);
  const trajectory = useMemo(() => {
    const points = [{ x: 1.65, y: 0.82 }];
    for (let index = 0; index < 14; index += 1) {
      const current = points[points.length - 1];
      points.push({ x: current.x * (1 - learningRate), y: current.y * (1 - learningRate * condition) });
    }
    return points;
  }, [condition, learningRate]);
  const flatMultiplier = 1 - learningRate;
  const steepMultiplier = 1 - learningRate * condition;
  const spectralRadius = globalThis.Math.max(globalThis.Math.abs(flatMultiplier), globalThis.Math.abs(steepMultiplier));
  const stable = spectralRadius < 1;
  const xPx = (x: number) => 260 + x * 118;
  const yPx = (y: number) => 150 - y * 118;
  const visible = trajectory.filter((point) => globalThis.Math.abs(point.x) < 2.2 && globalThis.Math.abs(point.y) < 1.15);

  return (
    <figure data-landscape-explorer className="foundation-viz-explorer not-prose my-8 scroll-mt-28 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-5">
        <span className="text-sm font-bold">H = diag(1, κ)에서 eigen-axis update를 추적한다</span>
        <span className={`rounded-sm px-2 py-1 font-mono text-[11px] font-bold ${stable ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}>{stable ? 'SPECTRAL RADIUS < 1' : 'UNSTABLE AXIS'}</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-orange-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <label htmlFor="condition-number" className="block text-xs font-semibold text-muted-foreground">곡률 비율 κ · {condition}<input id="condition-number" type="range" min="2" max="20" step="1" value={condition} onChange={(event) => setCondition(Number(event.target.value))} className="mt-3 block w-full accent-orange-700" /></label>
        <label htmlFor="optimization-lr" className="block text-xs font-semibold text-muted-foreground">Learning rate η · {learningRate.toFixed(2)}<input id="optimization-lr" type="range" min="0.02" max="0.25" step="0.01" value={learningRate} onChange={(event) => setLearningRate(Number(event.target.value))} className="mt-3 block w-full accent-orange-700" /></label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center lg:p-6">
        <svg viewBox="0 0 520 300" className="h-auto w-full" role="img" aria-label={`condition number ${condition}인 이차 손실에서 gradient descent 경로`}>
          {[1, 0.74, 0.48, 0.24].map((scale) => <ellipse key={scale} cx="260" cy="150" rx={190 * scale} ry={(190 / globalThis.Math.sqrt(condition)) * scale} fill="none" stroke="var(--border)" strokeWidth="1.2" />)}
          <line x1="28" y1="150" x2="492" y2="150" stroke="var(--border)" strokeDasharray="3 6" />
          <line x1="260" y1="22" x2="260" y2="278" stroke="var(--border)" strokeDasharray="3 6" />
          {visible.length > 1 && <polyline points={visible.map((point) => `${xPx(point.x)},${yPx(point.y)}`).join(' ')} fill="none" stroke="#c2410c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />}
          {visible.map((point, index) => <circle key={`${point.x}-${point.y}-${index}`} cx={xPx(point.x)} cy={yPx(point.y)} r={index === 0 ? 5 : 3.5} fill={index === visible.length - 1 ? '#0f766e' : '#c2410c'} stroke="var(--background)" strokeWidth="1.5" />)}
          <circle cx="260" cy="150" r="5" fill="var(--background)" stroke="#0f766e" strokeWidth="2" />
          <text x="272" y="142" fontSize="12" fontWeight="700" fill="var(--foreground)">minimum</text>
        </svg>
        <dl className="grid gap-px overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-background p-3"><dt className="text-[11px] text-muted-foreground">Stable step range</dt><dd className="mt-1 font-mono text-sm font-bold">0 &lt; η &lt; {(2 / condition).toFixed(2)}</dd></div>
          <div className="bg-background p-3"><dt className="text-[11px] text-muted-foreground">완만한 축 배율</dt><dd className="mt-1 font-mono text-sm font-bold">1 - η = {flatMultiplier.toFixed(2)}</dd></div>
          <div className="bg-background p-3"><dt className="text-[11px] text-muted-foreground">가파른 축 배율</dt><dd className="mt-1 font-mono text-sm font-bold">1 - ηκ = {steepMultiplier.toFixed(2)}</dd></div>
          <div className="bg-background p-3"><dt className="text-[11px] text-muted-foreground">Spectral radius</dt><dd className="mt-1 font-mono text-sm font-bold">{spectralRadius.toFixed(2)}</dd></div>
          <div className="bg-background p-3 text-xs leading-relaxed text-muted-foreground">음수 배율은 축을 번갈아 넘는 zig-zag다. 절댓값이 1 이상이면 그 축의 error가 줄지 않는다.</div>
        </dl>
      </div>
    </figure>
  );
}

function Objective() {
  return (
    <section id="objective" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">최적화 문제는 무엇을 바꾸고 무엇을 지킬까?</h2>
      <BeginnerBridge title="가장 싼 여행만 찾으면 바다를 건너야 하거나 도착 시간을 넘길 수 있다">
        Loss 또는 objective는 후보가 얼마나 좋은지 비교하는 점수다. 하지만 알고리즘이 바꿀 값인 variable과 반드시 지킬 규칙인 constraint가 함께 있어야 실제로 허용되는 후보 중 최선을 고를 수 있다.
      </BeginnerBridge>
      <QuestionLead question="Loss 하나를 정하면 문제 정의가 끝날까?" answer="아니다. Solver가 바꿀 variable, 고정 data, candidates를 비교할 objective, 허용할 feasible set이 따로 필요하다. 같은 식도 variable의 단위와 constraint가 달라지면 다른 문제다." />
      <ConceptPrimer items={[
        { term: 'Decision variable', meaning: '알고리즘이 선택할 좌표 x다.', why: '측정값·model parameter 같은 fixed data와 solver 선택을 분리한다.' },
        { term: 'Objective', meaning: 'Feasible candidates를 비교할 scalar 함수다.', why: '서로 다른 성능 항을 weight와 unit이 있는 trade-off로 만든다.' },
        { term: 'Constraint', meaning: '반드시 만족할 등식·부등식이다.', why: 'Actuator limit, dynamics, probability simplex를 선호가 아닌 허용 조건으로 둔다.' },
        { term: 'Feasible set', meaning: '모든 constraint를 동시에 만족하는 후보 집합이다.', why: 'Objective가 좋아도 실행 불가능한 candidate를 거절한다.' },
      ]} />
      <Equation
        latex={raw`\begin{aligned}
          &\underbrace{\underset{x}{\operatorname{minimize}}\quad f(x)}_{\text{feasible 후보의 비용 비교}}\\
          &\underbrace{\mathcal F=\{x\mid g_i(x)\le0,\ h_j(x)=0\}}_{\text{모든 제약의 교집합}}
        \end{aligned}`}
        meaning="먼저 constraints의 교집합 F가 허용할 candidates를 정하고, objective f는 그 안에서만 순위를 매긴다. 이 순서를 분리해야 infeasible과 high-cost를 구분한다. Penalty로 g_i를 objective에 넣으면 hard gate가 trade-off로 바뀌며 큰 penalty weight도 exact feasibility를 자동 보장하지 않는다."
        symbols={[[raw`x`, 'Solver가 선택할 n-dimensional variable; coordinate의 unit과 scale을 기록'], [raw`f(x)`, 'Feasible candidates를 비교하는 scalar objective'], [raw`g_i(x)\le0`, '영역의 한쪽을 허용하는 inequality constraint'], [raw`h_j(x)=0`, 'Dynamics나 conservation처럼 정확한 manifold를 정하는 equality constraint'], [raw`\mathcal F`, '모든 constraints를 동시에 만족하는 feasible set']]}
      />
      <Equation
        latex={raw`\begin{aligned}
          \underbrace{f(x^\star)\le f(x)\quad\forall x\in\mathcal F\cap B_\varepsilon(x^\star)}_{\text{local optimum: 가까운 feasible 후보와 비교}}\\
          \underbrace{f(x^\star)\le f(x)\quad\forall x\in\mathcal F}_{\text{global optimum: 전체 feasible set과 비교}}
        \end{aligned}`}
        meaning="Local과 global의 차이는 gradient 크기가 아니라 비교 범위다. Local optimum은 radius epsilon 안의 feasible neighbors만 이기고, global optimum은 F 전체를 이긴다. Feasible set이 disconnected하거나 objective가 nonconvex면 local statement를 global로 올릴 근거가 없다."
        symbols={[[raw`x^\star`, '검증할 feasible candidate'], [raw`B_\varepsilon(x^\star)`, 'x-star 중심의 local neighborhood'], [raw`\varepsilon`, 'Local comparison 범위를 정하는 positive radius'], [raw`\mathcal F`, '비교 대상이 반드시 머물러야 하는 feasible set']]}
      />
      <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        {[
          ['INFEASIBLE', 'F가 비어 있다', 'Optimizer hyperparameter보다 model과 constraint 충돌을 먼저 조사한다.'],
          ['UNBOUNDED', '비용이 끝없이 감소한다', 'Missing bound, wrong sign 또는 regularization 누락을 조사한다.'],
          ['OPTIMAL', '허용된 비교 범위에서 최소다', 'Local인지 global인지, exact인지 tolerance 이내인지 함께 기록한다.'],
        ].map(([status, condition, action]) => <div key={status} className="bg-background p-4"><p className="text-xs font-black text-orange-700 dark:text-orange-300">{status}</p><p className="mt-2 text-sm font-bold">{condition}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{action}</p></div>)}
      </div>
    </section>
  );
}

function Convexity() {
  return (
    <section id="convexity" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Convex 문제에서는 왜 local minimum을 global로 올릴 수 있을까?</h2>
      <QuestionLead question="Objective만 bowl 모양이면 충분할까?" answer="아니다. Feasible set의 두 점 사이 선분도 허용되어야 한다. Convex feasible set과 convex objective가 함께 있어야 local-to-global 논증이 닫힌다." />
      <Equation
        latex={raw`\begin{aligned}
          &\underbrace{\theta x+(1-\theta)y\in\mathcal F}_{\text{feasible 선분 보존}}\\
          &\underbrace{f(\theta x+(1-\theta)y)}_{\text{선분 위 함수값}}\\
          &\qquad\le\underbrace{\theta f(x)+(1-\theta)f(y)}_{\text{양 끝 함수값의 혼합}}\\
          &0\le\theta\le1
        \end{aligned}`}
        meaning="첫 줄은 domain geometry, 둘째 줄은 objective geometry다. 더 낮은 global point가 local optimum 밖에 있다고 가정하면 두 점 사이의 아주 가까운 convex combination도 더 낮아져 local optimality와 충돌한다. 한 premise라도 빠지면 이 contradiction을 만들 수 없다."
        symbols={[[raw`x,y`, 'Feasible set 안의 두 candidates'], [raw`\theta`, '두 candidates를 섞는 0과 1 사이 비율'], [raw`\theta x+(1-\theta)y`, '두 점 사이 chord 위 candidate'], [raw`\mathcal F`, '선분 전체를 포함해야 하는 convex feasible set']]}
      />
      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-3">
        {[
          ['Convex', 'Local minimum은 global', 'Optimum이 여러 점의 flat set일 수 있다.'],
          ['Strictly convex', 'Optimum이 존재하면 최대 하나', 'Open domain이나 unbounded problem의 existence는 별도다.'],
          ['Strongly convex', 'Uniform positive curvature', 'Step choice, noise와 finite precision까지 자동 해결하지 않는다.'],
        ].map(([kind, conclusion, boundary]) => <div key={kind} className="bg-background p-4"><p className="text-xs font-black text-emerald-700 dark:text-emerald-300">{kind}</p><p className="mt-2 text-sm font-bold">{conclusion}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">경계 · {boundary}</p></div>)}
      </div>
      <Equation
        latex={raw`\underbrace{x^\star\ \text{local optimum}}_{\text{가까운 feasible 후보를 이김}}+\underbrace{\mathcal F\ \text{convex},\ f\ \text{convex}}_{\text{theorem premise}}\quad\Longrightarrow\quad\underbrace{x^\star\ \text{global optimum}}_{\text{전체 feasible set을 이김}}`}
        meaning="Conclusion은 local optimum이 global이라는 한 문장뿐이다. Optimum existence, uniqueness, solver speed와 numerical accuracy는 포함하지 않는다. ML network loss, obstacle avoidance 또는 nonlinear dynamics처럼 nonconvex 요소가 들어오면 이 implication을 그대로 사용할 수 없다."
        symbols={[[raw`x^\star`, '이미 local optimality를 만족한다고 가정한 candidate'], [raw`\mathcal F\ \text{convex}`, 'Candidate 사이 chord를 허용하는 domain premise'], [raw`f\ \text{convex}`, 'Hidden lower basin을 배제하는 objective premise'], [raw`\Longrightarrow`, 'Premises가 모두 있을 때만 conclusion으로 이동하는 논리 방향']]}
      />
      <Misconception>Convex는 빠르다는 뜻이 아니다. Convex quadratic도 condition number가 크면 gradient descent가 긴 valley에서 느리게 zig-zag한다. Geometry theorem과 algorithm rate는 다른 계약이다.</Misconception>
    </section>
  );
}

function Curvature() {
  return (
    <section id="curvature" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Gradient와 Hessian은 update의 무엇을 예측할까?</h2>
      <QuestionLead question="Gradient가 큰데도 작은 step만 허용되거나 loss가 오르는 이유는 무엇일까?" answer="Gradient는 현재 slope만 준다. Hessian은 그 slope가 이동 방향마다 얼마나 빨리 변하는지 준다. 큰 positive curvature는 overshoot를 만들고 negative curvature는 stationary point를 saddle로 바꾼다." />
      <Equation
        latex={raw`\underbrace{f(x+\Delta)}_{\text{실제 이동 뒤 비용}}\approx\underbrace{f(x)}_{\text{현재 비용}}+\underbrace{\nabla f(x)^\top\Delta}_{\text{gradient의 1차 변화}}+\underbrace{\frac12\Delta^\top H(x)\Delta}_{\text{방향별 곡률 보정}}`}
        meaning="Taylor model은 proposed displacement Delta가 cost를 어떻게 바꿀지 local하게 예측한다. Dot product는 이동 방향의 slope를 고르고, quadratic form은 같은 이동이 Hessian eigen-directions에 얼마나 놓였는지 반영한다. 큰 Delta나 rapidly changing Hessian에서는 approximation error가 커진다."
        symbols={[[raw`\Delta`, '현재 x에서 제안한 displacement vector'], [raw`\nabla f(x)`, '각 coordinate의 first-order sensitivity를 모은 gradient'], [raw`H(x)=\nabla^2 f(x)`, 'Slope 변화와 cross-coordinate coupling을 모은 Hessian'], [raw`\Delta^\top H\Delta`, '선택한 이동 방향에서 본 scalar curvature']]}
      />
      <Equation
        latex={raw`\begin{aligned}
          &\underbrace{\nabla f(x^\star)=0}_{\text{정지점}},\quad
          \underbrace{H(x^\star)\succ0}_{\text{모든 방향 양의 곡률}}\\
          &\Longrightarrow\underbrace{x^\star\ \text{strict local minimum}}_{\text{2차 충분조건}}\\[0.45em]
          &\underbrace{\nabla f(x^\star)=0}_{\text{정지점}},\quad
          \underbrace{H(x^\star)\ \text{indefinite}}_{\text{양·음 곡률 공존}}\\
          &\Longrightarrow\underbrace{x^\star\ \text{saddle}}_{\text{내려가는 방향 존재}}
        \end{aligned}`}
        meaning="Zero gradient는 candidate를 만들 뿐 분류하지 않는다. Positive-definite Hessian은 모든 nonzero local direction의 cost가 증가해 strict local minimum을 충분히 보인다. Mixed-sign eigenvalues는 내려가는 방향이 있는 saddle을 보인다. Positive-semidefinite지만 singular한 Hessian은 higher-order terms가 필요해 inconclusive할 수 있다."
        symbols={[[raw`\nabla f(x^\star)=0`, 'Unconstrained interior stationary-point condition'], [raw`H\succ0`, '모든 nonzero direction에서 positive quadratic curvature'], [raw`H\ \text{indefinite}`, 'Positive와 negative eigenvalue가 모두 있는 Hessian'], ['saddle', '일부 방향은 증가하고 다른 방향은 감소하는 stationary point']]}
      />
      <LandscapeExplorer />
      <Equation
        latex={raw`\begin{aligned}
          \underbrace{e_{k+1}=(I-\eta H)e_k}_{\text{quadratic gradient error update}},\qquad
          \underbrace{e_{k+1}^{(i)}=(1-\eta\lambda_i)e_k^{(i)}}_{\text{eigen-axis별 배율}}\\
          \underbrace{0<\eta<\frac{2}{\lambda_{\max}}}_{\text{모든 positive-curvature 축의 안정 범위}}
        \end{aligned}`}
        meaning="SPD quadratic에서는 optimum error를 Hessian eigenvectors로 분해할 수 있다. 각 coordinate는 1-eta lambda_i만큼 독립적으로 줄거나 sign을 바꾼다. 모든 절댓값이 1보다 작아야 convergence한다. 이 constant-step bound는 exact quadratic 또는 global smoothness premise 없이 arbitrary nonconvex loss의 보장이 아니다."
        symbols={[[raw`e_k=x_k-x^\star`, 'Iteration k의 optimum-relative error'], [raw`\eta`, '모든 eigen-directions에 공통으로 적용한 learning rate'], [raw`\lambda_i`, 'Hessian direction i의 positive curvature'], [raw`\lambda_{\max}`, '가장 가파른 축이 허용 step을 제한하는 최대 eigenvalue']]}
      />
      <Equation
        latex={raw`\underbrace{\kappa(H)=\frac{\lambda_{\max}(H)}{\lambda_{\min}(H)}}_{\text{SPD Hessian의 곡률 불균형}}\qquad\underbrace{\lambda_{\min}>0}_{\text{flat·negative 방향 없음}}`}
        meaning="Condition number는 가장 가파른 축과 가장 완만한 축의 scale ratio다. 큰 kappa에서는 steep axis의 stability에 맞춘 eta가 flat axis를 천천히 움직인다. 이 정의는 positive-definite Hessian에 대한 것이다. Zero eigenvalue면 ratio가 infinite이고 indefinite Hessian에는 local minimum convergence number로 그대로 쓰지 않는다."
        symbols={[[raw`\kappa(H)`, 'Coordinate choice에 의존하는 local curvature spread'], [raw`\lambda_{\max}`, '가장 큰 positive curvature'], [raw`\lambda_{\min}`, '가장 작은 strictly positive curvature'], ['scaling/preconditioning', 'Variables를 rescale하거나 update metric을 바꿔 numerical spread를 줄이는 조작']]}
      />
      <Equation
        latex={raw`\begin{aligned}
          &\underbrace{\Delta_{\mathrm{Newton}}=-H(x)^{-1}\nabla f(x)}_{\text{gradient를 곡률로 보정}}\\
          &\underbrace{H\Delta=-\nabla f}_{\text{inverse 대신 linear solve}}
        \end{aligned}`}
        meaning="Newton step은 가파른 eigen-direction을 작게, 완만한 direction을 크게 움직인다. Exact positive-definite quadratic에서는 Taylor model이 실제 objective와 같아 full step 한 번에 minimum에 간다. General loss에서는 Hessian construction/factorization cost, singular·negative curvature와 local-model error 때문에 damping, line search 또는 trust region이 필요하다."
        symbols={[[raw`\Delta_{\mathrm{Newton}}`, 'Second-order local model이 제안한 displacement'], [raw`H^{-1}\nabla f`, 'Curvature scale로 gradient imbalance를 보정한 방향'], [raw`H\Delta=-\nabla f`, 'Explicit inverse를 만들지 않고 푸는 linear system'], ['linear-solve residual', 'Computed Delta가 numerical system을 얼마나 정확히 만족하는지 보는 solver evidence']]}
        tone="orange"
      />
      <TransferCheck
        title="diag(1, 20)"
        question="f(x)=1/2 x^T diag(1,20)x, x0=(1,1)에서 eta=0.09를 쓴다. Formula만으로 15-step path를 먼저 예측하라."
        checks={[
          'Stable 범위가 0 < eta < 0.1임을 lambda-max에서 유도한다.',
          '두 축 multiplier 0.91과 -0.8을 계산해 완만한 축의 느린 감소와 가파른 축의 zig-zag를 구분한다.',
          'Exact Newton one-step conclusion에 exact quadratic, invertible positive-definite H와 full exact solve가 필요한 이유를 말한다.',
          'Variable rescaling은 physical solution을 보존할 수 있지만 coordinate Hessian과 finite-precision solve는 바꾼다는 점을 구분한다.',
        ]}
      />
    </section>
  );
}

function Constraints() {
  return (
    <section id="constraints" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Boundary optimum에서 KKT와 duality는 무엇을 증명할까?</h2>
      <QuestionLead question="Constraint boundary에서 gradient가 0이 아닌데도 왜 최적일 수 있을까?" answer="Objective를 더 줄이는 방향이 feasible set 밖을 향할 수 있다. Active constraint normal이 그 방향을 막으며, Lagrange multiplier는 objective gradient를 상쇄하는 normal의 크기를 기록한다." />
      <Equation
        latex={raw`\underbrace{\mathcal L(x,\lambda,\nu)}_{\text{objective와 제약을 결합}}=\underbrace{f(x)}_{\text{원 비용}}+\underbrace{\sum_i\lambda_i g_i(x)}_{\text{inequality normal의 가중합}}+\underbrace{\sum_j\nu_j h_j(x)}_{\text{equality normal의 가중합}}`}
        meaning="Lagrangian은 constraint를 없애는 penalty trick이 아니라 primal geometry와 multiplier를 한 식에서 분석하는 장치다. Inequality multiplier는 nonnegative여야 lower-bound 방향을 지키고, equality multiplier는 양쪽 위반 방향이 있어 sign 제한이 없다."
        symbols={[[raw`\mathcal L`, 'Primal variables와 dual multipliers를 함께 받는 Lagrangian'], [raw`\lambda_i\ge0`, 'Inequality g_i<=0에 붙는 nonnegative multiplier'], [raw`\nu_j`, 'Equality h_j=0에 붙는 sign-free multiplier'], [raw`\nabla g_i,\nabla h_j`, 'Active boundary가 허용 이동을 막는 local normals']]}
      />
      <Equation
        latex={raw`\begin{aligned}
          &\underbrace{g_i(x^\star)\le0,\ h_j(x^\star)=0}_{\text{primal feasibility}}\\
          &\underbrace{\lambda_i^\star\ge0}_{\text{dual feasibility}},\qquad
          \underbrace{\lambda_i^\star g_i(x^\star)=0}_{\text{complementarity}}\\
          &\underbrace{\nabla f(x^\star)+\sum_i\lambda_i^\star\nabla g_i(x^\star)}_{\text{objective와 부등식 normal}}\\
          &\qquad+\underbrace{\sum_j\nu_j^\star\nabla h_j(x^\star)}_{\text{등식 normal}}=0
        \end{aligned}`}
        meaning="KKT는 feasibility 두 종류, inactive constraint의 multiplier를 제거하는 complementarity, feasible descent direction이 남지 않는 stationarity를 함께 요구한다. Differentiable local optimum에서 necessity를 말하려면 constraint qualification이 필요하다. Convex differentiable problem에서 이 네 조건을 만족하는 candidate는 global optimum이다."
        symbols={[[raw`x^\star`, '검증할 primal candidate'], [raw`\lambda_i^\star,\nu_j^\star`, 'Candidate에서 boundary forces를 나타내는 dual variables'], [raw`\lambda_i^\star g_i(x^\star)=0`, 'Inactive g_i<0이면 lambda_i=0이 되게 하는 product'], [raw`\nabla_x\mathcal L=0`, 'Objective gradient와 active constraint normals의 stationarity balance']]}
      />
      <ConstrainedOptimumLab />
      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-3">
        {[
          ['Necessary', 'Differentiable local optimum + constraint qualification', 'KKT를 만족해야 한다. Global optimum이라는 뜻은 아니다.'],
          ['Sufficient', 'Differentiable convex problem + KKT candidate', 'Candidate는 global optimum이다. Numerical exactness는 별도다.'],
          ['Strong duality', 'Convex problem + Slater 같은 qualification', 'Primal과 dual optimum value가 같다. Deployment guarantee는 아니다.'],
        ].map(([direction, premise, conclusion]) => <div key={direction} className="bg-background p-4"><p className="text-xs font-black text-orange-700 dark:text-orange-300">{direction}</p><p className="mt-2 text-sm font-bold leading-relaxed">{premise}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{conclusion}</p></div>)}
      </div>
      <Equation
        latex={raw`\begin{aligned}
          &\underbrace{d(\lambda,\nu)=\inf_x\mathcal L(x,\lambda,\nu)}_{\text{x를 제거해 lower bound 생성}}\\
          &\underbrace{d(\lambda,\nu)\le p^\star}_{\text{weak duality}}\\
          &\underbrace{\max_{\lambda\ge0,\nu}d(\lambda,\nu)}_{\text{가장 높은 lower bound 선택}}
        \end{aligned}`}
        meaning="Feasible x에서는 lambda>=0 때문에 Lagrangian lower bound가 primal optimum을 넘지 않는다. 이것이 weak duality이며 convexity 없이도 성립한다. Strong duality는 dual maximum이 p-star에 닿는 추가 conclusion이고 convexity와 Slater 같은 premise가 필요하다. Reported duality gap은 model class와 numerical residual을 함께 확인해야 certificate가 된다."
        symbols={[[raw`d(\lambda,\nu)`, 'x를 제거해 dual variables만 남긴 dual function'], [raw`\inf_x`, '주어진 multipliers에서 가능한 가장 낮은 Lagrangian value를 고르는 operation'], [raw`p^\star`, 'Original constrained primal problem의 optimal value'], ['duality gap', 'Primal candidate value와 dual lower bound의 차이; optimality evidence']]}
      />
      <Equation
        latex={raw`\begin{aligned}
          &\underbrace{\min_u\ \frac12(u-2)^2}_{\text{원하는 input 2에 접근}}\quad\text{s.t.}\quad\underbrace{u-1\le0}_{\text{upper bound 1}}\\
          &\underbrace{u^\star=1,\ \lambda^\star=1}_{\text{KKT 네 조건을 만족}},\qquad
          \underbrace{\frac{d p^\star(b)}{db}=-\lambda^\star}_{\text{bound 완화의 local value sensitivity}}
        \end{aligned}`}
        meaning="Unconstrained optimum u=2는 infeasible이라 boundary u=1이 optimum이다. Stationarity u-2+lambda=0에서 lambda=1을 얻는다. u=0은 strictly feasible이므로 이 convex problem은 Slater premise를 만족한다. Upper bound b를 늘리면 feasible set이 넓어져 optimal cost가 줄기 때문에 derivative는 -lambda다."
        symbols={[[raw`u`, '선택할 scalar input'], [raw`u-1\le0`, 'Input을 1 이하로 자르는 hard feasible-set boundary'], [raw`\lambda^\star=1`, 'Bound를 한 unit 완화할 때 optimal value가 local하게 줄어드는 크기'], [raw`p^\star(b)`, 'Upper bound b에 따른 optimal objective value']]}
        tone="orange"
      />
      <TransferCheck
        title="KKT 방향 검산"
        question="같은 scalar 문제에서 upper bound를 3으로 바꾸거나 constraint를 penalty rho max(0,u-1)^2로 옮기면 theorem contract가 어떻게 달라질까?"
        checks={[
          'b=3에서는 unconstrained optimum이 feasible해 constraint가 inactive이고 multiplier가 0임을 보인다.',
          'Penalty formulation은 u<=1 hard feasible set을 제거하므로 finite rho에서 violation trade-off가 가능함을 말한다.',
          'KKT necessity에는 constraint qualification, global sufficiency에는 convexity가 추가로 필요함을 분리한다.',
          'Small primal-dual gap과 small feasibility residual을 모두 확인해야 approximate solver certificate가 된다고 설명한다.',
        ]}
      />
    </section>
  );
}

function Applications() {
  return (
    <section id="deep-learning" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">MPC, trajectory optimization, ML loss는 같은 식에서 어디서 갈라질까?</h2>
      <QuestionLead question="Solver가 success를 반환하면 model theorem과 실제 deployment까지 통과한 것일까?" answer="아니다. Exact mathematical problem, finite transcription, numerical termination, deployed system은 서로 다른 evidence layer다. 각 층의 residual과 failure를 따로 기록해야 한다." />
      <Equation
        latex={raw`\begin{aligned}
          &\underbrace{\min_{\{x_k,u_k\}}\ \ell_N(x_N)+\sum_{k=0}^{N-1}\ell(x_k,u_k)}_{\text{horizon 비용 최소화}}\\
          &\text{s.t.}\quad\underbrace{x_{k+1}=F(x_k,u_k)}_{\text{한 step dynamics}}\\
          &\underbrace{(x_k,u_k)\in\mathcal Z}_{\text{state·input feasible set}}\\
          &\underbrace{x_0=\hat x_t}_{\text{현재 측정 state 고정}}
        \end{aligned}`}
        meaning="MPC와 direct-transcription trajectory optimization은 states와 inputs를 variables로 두고 dynamics를 equality constraints로 쓴다. Linear F, convex Z, positive-semidefinite quadratic state cost와 positive-definite input cost면 convex QP가 된다. Nonlinear dynamics나 obstacle disjunction이 들어오면 일반적으로 nonconvex NLP가 되어 local solver result를 global로 해석할 수 없다."
        symbols={[[raw`x_k,u_k`, 'Horizon knot k의 state와 control decision variables'], [raw`\ell,\ell_N`, 'Stage와 terminal tracking/control objectives'], [raw`F`, 'Continuous model을 discretize한 one-step dynamics map'], [raw`\mathcal Z`, 'Actuator, state와 safety constraints의 feasible set'], [raw`\hat x_t`, 'MPC solve 시점의 measured/estimated current state']]}
      />
      <Equation
        latex={raw`\begin{aligned}
          &\underbrace{x_N=A^N x_0+\sum_{k=0}^{N-1}A^{N-1-k}Bu_k}_{\text{input을 terminal state까지 전개}}\\
          &\underbrace{\frac{\partial x_N}{\partial u_k}=A^{N-1-k}B}_{\text{input 위치별 sensitivity}}
        \end{aligned}`}
        meaning="Direct shooting은 controls만 variables로 두고 dynamics simulation으로 states를 제거한다. Early input은 긴 matrix-power product를 거쳐 terminal state에 영향을 주므로 stable modes에서는 gradient가 사라지고 unstable modes에서는 커질 수 있다. Direct transcription은 각 x_k를 variable로 두고 one-step dynamics defects로 product를 분산하지만 variables와 equality constraints가 늘어난다. Representation은 conditioning을 바꾸지만 실제 system sensitivity를 없애지는 않는다."
        symbols={[[raw`A,B`, 'Linearized/discrete dynamics가 state와 input을 한 step 전달하는 matrices'], [raw`A^{N-1-k}B`, 'Input u_k가 terminal state x_N에 도달하는 sensitivity product'], [raw`N`, 'Prediction 또는 trajectory horizon length'], ['direct transcription', '각 state를 variable로 되살리고 one-step dynamics를 equality constraints로 두는 alternative']]}
      />
      <Equation
        latex={raw`\begin{aligned}
          &\underbrace{g(x)\le s,\quad s\ge0}_{\text{slack만큼 violation 허용}}\\
          &\underbrace{f_\rho(x,s)=f(x)+\rho s}_{\text{violation을 비용으로 이동}}
        \end{aligned}`}
        meaning="Slack은 empty feasible set을 피할 수 있지만 original hard constraint g(x)<=0을 보존하지 않는다. Rho가 violation price를 정하며 finite rho에서는 objective gain과 violation이 교환될 수 있다. Convex g와 linear slack이면 convexity는 유지할 수 있어도 physical safety 의미는 soft해진다. MPC에서는 actuator처럼 물리가 강제하는 limits와 comfort/output constraints를 같은 방식으로 완화하면 안 된다."
        symbols={[[raw`s`, 'Constraint violation을 수치로 드러내는 nonnegative slack variable'], [raw`\rho`, 'Violation 한 unit을 objective에서 얼마나 비싸게 볼지 정하는 penalty weight'], [raw`g(x)\le s`, 'Original hard boundary를 넓힌 relaxed feasible set'], [raw`f_\rho`, 'Performance와 violation을 하나의 scalar trade-off로 합친 modified objective']]}
        tone="orange"
      />
      <div className="not-prose my-8 overflow-hidden border-y border-border">
        {[
          ['MPC', 'Linear dynamics + convex quadratic cost + convex constraints는 QP다.', 'First input만 적용하고 새 state에서 다시 푼다.', 'Optimal QP status가 recursive feasibility, closed-loop stability, model mismatch와 deadline miss를 자동 보장하지 않는다.'],
          ['Trajectory optimization', 'Shooting은 controls를 simulate하고 transcription은 states와 dynamics defects를 함께 푼다.', 'Knot 수, integration/collocation rule과 scaling이 numerical program을 정한다.', 'Knot feasibility가 between-knot dynamics·collision을 보장하지 않으며 nonconvex solve는 local candidate다.'],
          ['ML loss', 'Network parameters가 variables이고 minibatch loss가 noisy empirical objective다.', 'Gradient, curvature와 conditioning vocabulary는 update 진단에 남는다.', 'Loss는 대개 nonconvex이고 low training loss·small gradient가 validation, calibration 또는 deployed safety를 보장하지 않는다.'],
        ].map(([area, model, operation, boundary]) => <div key={area} className="grid gap-2 border-b border-border py-5 last:border-0 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)]"><div><p className="text-sm font-black">{area}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{model}</p></div><p className="text-xs leading-relaxed"><strong className="block text-foreground">실행 operation</strong>{operation}</p><p className="text-xs leading-relaxed text-muted-foreground"><strong className="block text-foreground">증거 ceiling</strong>{boundary}</p></div>)}
      </div>
      <Equation
        latex={raw`\underbrace{\widehat R(\theta)=\frac1m\sum_{r=1}^{m}\ell(F_\theta(z_r),y_r)}_{\text{finite training data의 empirical objective}}\quad\not\Longrightarrow\quad\underbrace{R_{\mathrm{deploy}}(\theta)\ \text{is low}}_{\text{unseen deployment 분포의 성능}}`}
        meaning="Training optimizer는 finite dataset의 empirical risk를 낮춘다. 평균은 sample noise를 모으지만 deployment distribution을 자동 대표하지 않는다. Low training loss, stationary point와 favorable Hessian은 optimization evidence이며 generalization, distribution shift, calibration과 robustness는 held-out/deployment evidence가 필요하다."
        symbols={[[raw`\theta`, 'Neural network가 학습할 parameters'], [raw`m`, 'Empirical objective에 포함한 training examples 수'], [raw`\ell(F_\theta(z_r),y_r)`, 'Example r의 prediction loss'], [raw`\widehat R`, 'Observed training sample average risk'], [raw`R_{\mathrm{deploy}}`, 'Unseen deployment distribution에서 기대하는 별도 quantity']]}
      />
      <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['01 · THEOREM', 'Exact model과 premises', 'Convexity, KKT, duality가 어떤 implication을 주는지 검사한다.'],
          ['02 · TRANSCRIPTION', 'Finite problem fidelity', 'Discretization, knots, model class와 constraint sampling을 검사한다.'],
          ['03 · SOLVER', 'Approximate numerical result', 'Status, primal/dual residual, gap, iterations, scaling과 runtime을 기록한다.'],
          ['04 · DEPLOYMENT', 'Measured system/data behavior', 'Deadline, model error, between-knot violation, validation과 shift를 재검증한다.'],
        ].map(([layer, input, evidence]) => <div key={layer} className="bg-background p-4"><p className="text-xs font-black text-orange-700 dark:text-orange-300">{layer}</p><p className="mt-2 text-sm font-bold">{input}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{evidence}</p></div>)}
      </div>
      <TransferCheck
        title="Control과 ML evidence"
        question="Linear MPC에 nonconvex obstacle, soft state slack, 5 ms deadline을 차례로 추가하고 같은 conditioning 언어를 trajectory shooting과 ML loss에 옮겨라."
        checks={[
          'Obstacle disjunction은 convex QP premise를 깨고, slack은 hard feasible set을 cost trade-off로 바꾼다.',
          'Low solver residual은 discretized program evidence이며 deadline miss와 model mismatch를 판정하지 않는다.',
          'Long-horizon shooting의 sensitivity product와 transcription의 local dynamics defects가 다른 conditioning surface를 만든다.',
          'Small training gradient, low empirical loss와 low validation/deployment risk를 세 종류의 evidence로 분리한다.',
        ]}
      />
      <CapabilityCheck items={[
        'Variable, fixed data, objective, constraints와 feasible set을 분리해 optimization problem을 쓴다.',
        'Local/global optimum과 convexity theorem의 premise, existence와 uniqueness를 구분한다.',
        'Hessian eigenvalue, condition number와 spectral stability로 gradient trajectory를 예측한다.',
        'Newton step의 quadratic one-step premise와 nonconvex·numerical failure boundary를 설명한다.',
        'KKT 네 조건, constraint qualification, weak/strong duality의 논리 방향을 검산한다.',
        'MPC, trajectory optimization, ML에서 theorem·transcription·solver·deployment evidence를 분리한다.',
      ]} />
      <LearningHandoff
        description="이 글의 수식은 optimizer 이름을 고르는 표가 아니다. 문제 geometry와 theorem premise를 먼저 쓰고, solver residual과 deployed behavior를 별도 evidence로 확인하는 공통 감사 절차다."
        items={[
          { label: '막히면', slug: 'calculus-computational-graphs', title: '미분과 계산 그래프', reason: 'Gradient, Jacobian, Hessian이 각각 어떤 local 변화를 측정하는지 계산한다.' },
          { label: '막히면', slug: 'linear-algebra-decompositions', title: '부분공간과 행렬 분해', reason: 'Hessian eigenvalue, condition number, singular direction과 linear solve를 복습한다.' },
          { label: '적용하기', slug: 'robot-trajectory-generation', title: 'Robot Trajectory Generation', reason: 'Dynamics constraints, retiming feasibility와 between-grid numerical evidence를 적용한다.' },
          { label: '적용하기', slug: 'robot-dynamics-feedback-control', title: 'Robot Dynamics & Control', reason: 'Constrained MPC의 online solve와 closed-loop deployment boundary를 연결한다.' },
          { label: '적용하기', slug: 'backprop-optimization', title: '역전파와 최적화', reason: 'Nonconvex neural loss에서 stochastic gradient와 curvature 진단의 유효 범위를 확인한다.' },
        ]}
      />
      <SourceNotes sources={[
        { label: 'Boyd & Vandenberghe · Convex Optimization', href: 'https://web.stanford.edu/~boyd/cvxbook/', note: 'Convex set·function, Lagrangian duality, Slater, KKT와 numerical methods의 theorem 기준.' },
        { label: 'Nocedal & Wright · Numerical Optimization', href: 'https://doi.org/10.1007/978-0-387-40065-5', note: 'Line search, trust region, Newton·quasi-Newton과 constrained numerical termination의 기준.' },
        { label: 'Rawlings, Mayne & Diehl · Model Predictive Control', href: 'https://sites.engineering.ucsb.edu/~jbraw/mpc/', note: 'Horizon optimization, hard·soft constraints, infeasibility와 online control의 1차 출처.' },
        { label: 'MIT Underactuated Robotics · Trajectory Optimization', href: 'https://underactuated.csail.mit.edu/trajopt.html', note: 'Direct shooting·transcription·collocation과 conditioning boundary의 공개 원문.' },
        { label: 'Goodfellow, Bengio & Courville · Deep Learning Ch. 8', href: 'https://www.deeplearningbook.org/contents/optimization.html', note: 'Ill-conditioning, saddle, stochastic optimization과 empirical training evidence의 기준.' },
      ]} />
    </section>
  );
}

export default function OptimizationGeometryArticle() {
  return <><Objective /><Convexity /><Curvature /><Constraints /><Applications /></>;
}
