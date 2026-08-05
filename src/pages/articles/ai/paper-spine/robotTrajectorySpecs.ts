import type { PaperStudySpec } from './FoundationalPaperStudy';

const raw = String.raw;

export const shinMcKay1985Spec: PaperStudySpec = {
  shortTitle: 'Minimum-Time Control Along a Geometric Path',
  citation: 'K. G. Shin, N. D. McKay - Minimum-Time Control of Robotic Manipulators with Geometric Path Constraints',
  yearVenue: '1985 · IEEE Transactions on Automatic Control 30(6), 531-541',
  sourceUrl: 'https://rtcl.eecs.umich.edu/rtclweb/assets/publications/1985/shin1985minimumtimecontrol.pdf',
  appendixUrl: 'https://doi.org/10.1109/TAC.1985.1104009',
  before: '충돌을 피하는 길을 찾는 것과 그 길을 빠르게 달리는 것은 다른 문제다. 당시의 단순한 방법은 각 관절에 고정 속도·가속도 한계를 붙이는 식이었다. 그러나 로봇은 자세가 바뀔 때 관성과 중력 부담도 바뀐다. 그래서 같은 속도라도 어떤 자세에서는 모터 토크가 남고, 다른 자세에서는 한계를 넘을 수 있었다.',
  authorIntent: 'Shin과 McKay가 묻는 질문은 “이미 정한 geometric path의 모양은 그대로 두고, 모든 입력 torque·force 한계를 지키면서 얼마나 빨리 통과할 수 있는가?”다. 저자들은 coupled manipulator dynamics를 path position과 path speed의 2차원 phase plane으로 줄이고, 허용 영역의 경계를 따라가는 minimum-time trajectory를 구성하려 했다.',
  thesis: '경로 q=f(λ)를 고정하면 각 관절 입력은 path pseudoacceleration ṗ에 affine한 4항식이 된다. 입력 한계를 관절별 ṗ 구간으로 바꾸고 교차하면 phase plane의 motion cone과 admissible region을 얻는다. 단순한 경우에는 시작 maximum-acceleration 곡선과 종점 minimum-acceleration 곡선의 한 교점에서 전환하지만, 일반 해는 boundary tangent·osculation, 여러 switching point와 friction-induced island를 포함하며 directed graph 탐색과 backtracking으로 가장 높은 feasible trajectory를 고른다.',
  readerBridge: [
    { term: '고정 경로', latex: raw`q=f(\lambda)`, plain: 'λ가 정하면 모든 관절 위치 q가 정해지는 geometric curve다. 아직 몇 초에 어디를 지날지는 정하지 않았다.', role: 'Path의 모양은 고정하고 timing만 최적화한다.' },
    { term: 'Phase-plane state', latex: raw`p=\dot\lambda,\ \dot p=\ddot\lambda`, plain: 'λ는 길 위 위치, p는 그 길을 진행하는 속도, ṗ는 진행 가속도다.', role: 'n개 관절의 시간 문제를 (λ,p)의 2차원 state로 줄인다.' },
    { term: 'Motion cone', latex: raw`\operatorname{GLB}(\lambda,p)\le\dot p\le\operatorname{LUB}(\lambda,p)`, plain: '현재 위치·속도에서 모든 actuator가 함께 허용하는 가속·감속 방향의 부채꼴이다.', role: 'Torque box를 scalar path-acceleration interval로 번역한다.' },
    { term: '허용 경계와 전환', latex: raw`p=g(\lambda)`, plain: 'Forward와 backward 곡선의 단일 교차는 첫 경우일 뿐이다. 일반 문제는 경계 접점, 여러 전환과 분리된 island를 가진다.', role: 'ACOTNI의 단순 해와 island-aware ACOT를 혼동하지 않게 한다.' },
  ],
  reconstruction: [
    { label: '길과 시계 분리', latex: raw`\underbrace{q}_{\text{관절 위치}}=\underbrace{f(\lambda)}_{\text{고정한 경로}},\quad \underbrace{p}_{\text{경로 속도}}=\dot\lambda`, note: 'Collision과 task requirement를 만족하는 경로는 바꾸지 않고 λ의 시간표만 찾는다.' },
    { label: '4항 입력식', latex: raw`\underbrace{u_i}_{\text{관절 입력}}=\underbrace{M_i\dot p}_{\text{진행 가속}}+\underbrace{Q_ip^2}_{\text{속도 제곱}}+\underbrace{R_ip}_{\text{점성 마찰}}+\underbrace{S_i}_{\text{중력}}`, note: '원문은 viscous friction을 포함한다. R_i=0을 명시할 때만 흔한 3항식이 된다.' },
    { label: 'Motion cone', latex: raw`\underbrace{\operatorname{GLB}}_{\text{공통 하한}}\le\underbrace{\dot p}_{\text{고를 가속도}}\le\underbrace{\operatorname{LUB}}_{\text{공통 상한}}`, note: 'M_i의 부호를 반영한 관절별 interval을 교차하며 M_i=0은 division이 아닌 speed-feasibility constraint다.' },
    { label: '허용 영역을 잇는 해', latex: raw`\underbrace{\text{ACOTNI}}_{\text{단순 경계}}\;\longrightarrow\;\underbrace{\text{ACOT graph search}}_{\text{island 포함}}`, note: '한 교차로 끝나지 않으면 boundary tangent·osculation에서 곡선을 더 만들고, island 사이의 feasible trajectory를 backtracking으로 찾는다.' },
  ],
  mechanism: [
    'Collision과 task requirement를 만족하는 joint-space path q=f(λ)를 고정한다. λ=0과 λ=λ_max의 path speed p_0, p_f도 boundary condition으로 둔다.',
    'Chain rule로 q̇=f′p, q̈=f′ṗ+f″p²를 얻어 n-joint motion을 path position λ, pseudo-velocity p와 pseudoacceleration ṗ로 표현한다.',
    '원문의 Lagrange dynamics에 대입하면 u_i=M_i(λ)ṗ+Q_i(λ)p²+R_i(λ)p+S_i(λ)가 된다. R_i p는 원문 Eq. (1)의 viscous friction이므로 설명 없이 버릴 수 없다.',
    'R_i=0이라고 명시한 frictionless model에서만 u_i=M_i ṗ+Q_i p²+S_i의 3항 교육식으로 줄어든다.',
    'M_i>0과 M_i<0에서는 두 torque endpoint를 M_i로 나눈 뒤 min·max로 정렬한다. M_i=0이면 나누지 않고 h_i=Q_i p²+R_i p+S_i가 torque 범위 안인지 검사한다.',
    '관절별 lower bound의 maximum을 GLB, upper bound의 minimum을 LUB로 둔다. GLB>LUB이면 현재 (λ,p)에는 가능한 pseudoacceleration이 없다.',
    'LUB-GLB≥0인 속도를 모으면 admissible region이 된다. 점성마찰이나 speed-dependent torque bound가 있으면 한 λ에서 feasible p가 여러 interval로 갈라지고 inadmissible island가 생길 수 있다.',
    'Island가 없는 ACOTNI의 단순 경우에는 initial maximum-acceleration curve와 final minimum-acceleration curve를 backward integration한 곡선이 만나며, 그 한 교점이 switching point다.',
    '두 곡선이 만나지 않으면 admissible boundary p=g(λ)를 따라 φ(λ)=dp/dλ-dg/dλ의 부호 변화를 찾는다. 그 tangent·osculation point에서 backward deceleration과 forward acceleration을 번갈아 생성하므로 switching point가 여러 개일 수 있다.',
    'Island가 있는 일반 ACOT는 외곽 경계와 모든 island 경계의 sign change에서 switch trajectory를 만들고 모든 교점을 연결한다. 그 directed graph에서 가장 높은 feasible trajectory를 먼저 택하고 dead end에서는 backtracking한다.',
    '선택한 p(λ)에서 T=∫dλ/p를 계산하고 q=f(λ)와 합성해 joint position·velocity·acceleration·input history를 복원한다.',
    '이론적 optimum은 inadmissible boundary를 스칠 수 있다. 원문 권고처럼 실제 계산에는 conservative torque bounds를 써 margin을 만들고, model error·feedback tracking·runtime safety는 별도로 검증한다.',
  ],
  equations: [{
    latex: raw`\underbrace{q}_{\text{관절 위치}}=\underbrace{f(\lambda)}_{\text{지정한 geometric path}},\qquad \underbrace{0\le\lambda\le\lambda_{\max}}_{\text{되짚지 않는 진행 구간}}`,
    meaning: '원문의 λ는 시간이 아니라 fixed path 위의 위치다. Optimization은 f(λ)의 모양이 아니라 λ가 시간에 따라 움직이는 속도를 바꾼다.',
    symbols: [[raw`f(\lambda)`, 'n개 joint coordinate로 이루어진 specified path'], [raw`\lambda`, 'Start에서 goal로 단조 증가하는 scalar path parameter']],
  }, {
    latex: raw`\underbrace{\dot q}_{\text{관절 속도}}=\underbrace{f'(\lambda)p}_{\text{접선}\times\text{경로 속도}},\qquad \underbrace{\ddot q}_{\text{관절 가속도}}=\underbrace{f'(\lambda)\dot p}_{\text{접선 가속}}+\underbrace{f''(\lambda)p^2}_{\text{곡률 가속}},\quad \underbrace{p}_{\text{pseudo-velocity}}=\dot\lambda`,
    meaning: 'Chain rule이 geometric path와 time scaling을 연결한다. f′은 path speed를 joint velocity로 옮기고, f″p²은 같은 path를 빠르게 지날 때 커지는 curvature acceleration이다.',
    symbols: [[raw`f'(\lambda)`, 'Path tangent'], [raw`f''(\lambda)`, 'Path curvature'], [raw`p,\dot p`, 'Path pseudo-velocity와 pseudoacceleration']],
  }, {
    latex: raw`\underbrace{u_i}_{\text{관절 입력}}=\underbrace{\sum_jJ_{ij}\ddot q_j}_{\text{관성}}+\underbrace{\sum_{j,k}C_{ijk}\dot q_j\dot q_k}_{\text{코리올리·원심}}+\underbrace{\sum_jR_{ij}\dot q_j}_{\text{점성 마찰}}+\underbrace{G_i(q)}_{\text{중력}}`,
    meaning: '원문의 component dynamics에는 관성, 코리올리·원심, 점성 마찰, 중력 항이 모두 있다. 따라서 chain rule을 대입한 path 식에도 속도에 선형인 마찰 항이 남는다.',
    symbols: [[raw`J_{ij}`, 'Inertia coefficient'], [raw`C_{ijk}`, 'Joint velocity product coefficient'], [raw`R_{ij}`, 'Viscous friction coefficient'], [raw`G_i`, 'Gravity and position-dependent load']],
  }, {
    latex: raw`\underbrace{M_i}_{\text{접선 관성}}=\sum_jJ_{ij}f'_j,\quad \underbrace{Q_i}_{\text{곡률·속도곱}}=\sum_jJ_{ij}f''_j+\sum_{j,k}C_{ijk}f'_jf'_k,\quad \underbrace{R_i}_{\text{경로 마찰}}=\sum_jR_{ij}f'_j,\quad \underbrace{S_i}_{\text{경로 중력}}=G_i(f(\lambda))`,
    meaning: 'Path derivative를 component dynamics에 대입해 원문의 M_i, Q_i, R_i, S_i를 복원한다. 이 네 coefficient는 path position λ의 함수다.',
    symbols: [[raw`M_i`, 'Path-tangent inertia coefficient'], [raw`Q_i`, 'Path-curvature and Coriolis coefficient'], [raw`R_i`, 'Path-speed proportional viscous friction coefficient'], [raw`S_i`, 'Path-position gravity coefficient']],
  }, {
    latex: raw`\underbrace{u_i}_{\text{관절 입력}}=\underbrace{M_i(\lambda)\dot p}_{\text{pseudoacceleration 항}}+\underbrace{Q_i(\lambda)p^2}_{\text{속도 제곱 항}}+\underbrace{R_i(\lambda)p}_{\text{점성 마찰 항}}+\underbrace{S_i(\lambda)}_{\text{중력 항}}`,
    meaning: 'Specified path를 대입하면 각 joint input은 scalar pseudoacceleration ṗ에 affine해진다. R_i=0을 명시할 때만 3항 frictionless 교육식으로 축약할 수 있다.',
    symbols: [[raw`M_i\dot p`, '진행 가속도에 비례하는 inertia input'], [raw`Q_ip^2`, 'Path curvature와 velocity-product input'], [raw`R_ip`, '원문이 유지한 viscous-friction input'], [raw`S_i`, 'Gravity and position-dependent load']],
  }, {
    latex: raw`\underbrace{h_i(\lambda,p)}_{\text{가속도와 무관한 입력}}=\underbrace{Q_i(\lambda)p^2}_{\text{속도 제곱}}+\underbrace{R_i(\lambda)p}_{\text{점성 마찰}}+\underbrace{S_i(\lambda)}_{\text{중력}},\qquad \underbrace{u_i^{\min}\le M_i\dot p+h_i\le u_i^{\max}}_{\text{입력 한계}}`,
    meaning: '현재 λ와 p가 정해지면 h_i는 이미 사용 중인 input이다. 남은 input margin을 M_i의 부호에 맞게 pseudoacceleration interval로 바꾼다.',
    symbols: [[raw`h_i`, 'Pseudoacceleration과 무관한 input burden'], [raw`u_i^{\min},u_i^{\max}`, 'Joint i의 lower·upper input bounds'], [raw`M_i\dot p`, 'Acceleration으로 조절할 수 있는 input']],
  }, {
    latex: raw`\underbrace{\ell_i}_{\text{관절 하한}}=\min\!\left(\frac{u_i^{\min}-h_i}{M_i},\frac{u_i^{\max}-h_i}{M_i}\right),\qquad \underbrace{v_i}_{\text{관절 상한}}=\max\!\left(\frac{u_i^{\min}-h_i}{M_i},\frac{u_i^{\max}-h_i}{M_i}\right),\quad \underbrace{M_i\ne0}_{\text{부호를 min·max가 흡수}}`,
    latexCompact: raw`\begin{gathered}
a_i^-=(u_i^{\min}-h_i)/M_i,\quad a_i^+=(u_i^{\max}-h_i)/M_i\\[4pt]
\underbrace{\ell_i=\min(a_i^-,a_i^+)}_{\text{관절 하한}}\\[3pt]
\underbrace{v_i=\max(a_i^-,a_i^+)}_{\text{관절 상한}}
\end{gathered}`,
    meaning: 'M_i>0이면 torque endpoint의 순서가 유지되고 M_i<0이면 뒤집힌다. 두 후보를 min·max로 정렬하면 두 경우를 한 식으로 처리할 수 있다.',
    symbols: [[raw`\ell_i,v_i`, 'Joint i가 허용하는 pseudoacceleration lower·upper bounds'], [raw`M_i>0`, 'Inequality 방향 유지'], [raw`M_i<0`, 'Inequality 방향 반전']],
  }, {
    latex: raw`\underbrace{M_i=0}_{\text{가속도로 바꿀 수 없음}}\quad\Longrightarrow\quad\underbrace{u_i^{\min}\le h_i(\lambda,p)\le u_i^{\max}}_{\text{speed-feasibility를 직접 판정}}`,
    meaning: 'Zero-inertia constraint를 작은 수로 나누면 거대한 가짜 acceleration bound가 생긴다. M_i=0에서는 h_i가 input range 안인지 직접 확인하고, 밖이면 현재 state 전체를 infeasible로 판정한다.',
    symbols: [[raw`M_i=0`, 'Joint i의 input이 현재 path acceleration에 반응하지 않는 상태'], [raw`h_i`, 'Acceleration으로 회복할 수 없는 input burden']],
  }, {
    latex: raw`\begin{gathered}
\underbrace{\operatorname{GLB}(\lambda,p)}_{\text{관절 하한 중 최댓값}}
=\max_i\ell_i\\[4pt]
\underbrace{\operatorname{GLB}(\lambda,p)\le\dot p
\le\operatorname{LUB}(\lambda,p)}_{\text{공유 pseudoacceleration 범위}}\\[4pt]
\underbrace{\operatorname{LUB}(\lambda,p)}_{\text{관절 상한 중 최솟값}}
=\min_i v_i,\qquad
\underbrace{\operatorname{GLB}\le\operatorname{LUB}}_{\text{motion cone 존재}}
\end{gathered}`,
    meaning: '모든 joint interval의 교집합이 남아야 하나의 path acceleration이 모든 input constraint를 동시에 만족한다.',
    symbols: [[raw`\operatorname{GLB}`, 'Joint lower bounds 중 가장 큰 값'], [raw`\operatorname{LUB}`, 'Joint upper bounds 중 가장 작은 값'], [raw`(\lambda,p)`, 'Phase-plane state']],
  }, {
    latex: raw`\underbrace{\mathcal A_\lambda}_{\text{고정 }\lambda\text{의 허용 속도}}=\underbrace{\{p\ge0:\operatorname{GLB}(\lambda,p)\le\operatorname{LUB}(\lambda,p)\}}_{\text{가능한 motion cone}}\;=\;\underbrace{\bigcup_{r=1}^{m_\lambda}[\underline p_r,\overline p_r]}_{\text{friction에서 분리될 수 있는 interval}}`,
    latexCompact: raw`\begin{gathered}
\underbrace{\mathcal A_\lambda=\{p\ge0:\mathrm{GLB}\le\mathrm{LUB}\}}_{\text{허용 path speeds}}\\[4pt]
\underbrace{\mathcal A_\lambda=\bigcup_{r=1}^{m_\lambda}[\underline p_r,\overline p_r]}_{\text{분리될 수 있는 구간}}
\end{gathered}`,
    meaning: '원문의 speed-dependent actuator bounds와 viscous friction에서는 admissible velocity set이 하나의 [0, ceiling]일 필요가 없다. Interval 사이의 hole이 phase plane의 inadmissible island가 된다.',
    symbols: [[raw`\mathcal A_\lambda`, 'Path position λ에서 feasible한 모든 nonnegative path speeds'], [raw`m_\lambda`, 'Disconnected feasible components의 수'], [raw`[\underline p_r,\overline p_r]`, 'r번째 feasible speed interval']],
  }, {
    latex: raw`\underbrace{\frac{dp}{d\lambda}}_{\text{trajectory 기울기}}=\underbrace{\frac{\dot p}{p}}_{\text{motion-cone edge}},\qquad \underbrace{\phi(\lambda)}_{\text{경계 접점 판정}}=\underbrace{\frac{dp}{d\lambda}}_{\text{허용 trajectory}}-\underbrace{\frac{dg}{d\lambda}}_{\text{admissible boundary}}`,
    meaning: 'Forward·backward curves가 만나지 않으면 boundary p=g(λ)를 따라 φ의 sign change를 찾는다. 그 tangent·osculation point가 새 switching trajectory를 시작하며 boundary discontinuity의 기울기도 별도 event로 처리한다.',
    symbols: [[raw`p=g(\lambda)`, 'Admissible-region boundary'], [raw`\phi(\lambda)`, 'Trajectory edge와 boundary slope의 차이'], [raw`dp/d\lambda`, 'Phase-plane trajectory slope']],
  }, {
    latex: raw`\underbrace{T}_{\text{총 실행 시간}}=\int_0^{\lambda_{\max}}\underbrace{\frac{1}{p(\lambda)}}_{\text{path 한 단위의 시간}}\,d\lambda`,
    meaning: 'Path speed p가 클수록 traversal time이 짧다. ACOT는 admissible region 안에서 boundary conditions를 잇는 가장 높은 feasible trajectory를 구성한다.',
    symbols: [[raw`T`, 'Specified path의 traversal time'], [raw`p(\lambda)`, 'Path position별 feasible pseudo-velocity'], [raw`d\lambda/p`, '작은 path interval을 통과하는 시간']],
  }],
  evidence: [
    {
      label: 'Dynamic reduction',
      question: 'Coupled n-joint input constraints를 (λ,p)의 2D phase-plane problem으로 줄일 수 있는가?',
      intervention: 'q=f(λ)의 1차·2차 미분을 viscous friction까지 포함한 Lagrange dynamics에 대입하고, 각 input bound를 ṗ interval로 변환한다.',
      observation: '원문 Eq. (4b), (7b), (9b)는 u_i=M_i ṗ+Q_i p²+R_i p+S_i와 GLB≤ṗ≤LUB를 구성한다.',
      supports: 'Fixed path의 coupled dynamics와 actuator constraints를 보존하면서 timing state를 λ와 p로 줄인다는 수학적 환원을 지지한다.',
      limit: 'Geometric path 자체의 optimality는 다루지 않으며, path tangent가 모두 사라지지 않고 rigid dynamics와 actuator bounds를 안다는 가정이 필요하다.',
    },
    {
      label: 'Theorem ceiling',
      question: 'ACOTNI와 island-aware ACOT가 유한 단계에서 끝나고 minimum-time trajectory를 내는가?',
      intervention: 'Finite-piece real-valued piecewise-analytic path와 at-most-quadratic velocity dependence를 둔 actuator-bound class에서 boundary zero와 switching construction을 분석한다.',
      observation: '논문은 ACOTNI의 finite termination과 minimum-time optimality를 증명하고, island가 있는 ACOT의 proof는 같은 논리로 확장된다고 밝힌다.',
      supports: '정확한 model·constraint와 논문의 regularity 조건 안에서 생성한 trajectory가 true minimum-time solution이라는 theorem-level claim을 지지한다.',
      limit: 'General ACOT의 proof는 “virtually identical”하다고 하고 반복하지 않는다. Model uncertainty, feedback tracking, jerk, runtime deadline과 hardware safety까지 증명한 것은 아니다.',
    },
    {
      label: 'Numerical examples',
      question: '유도한 알고리즘과 friction-induced island가 계산 예제로 나타나는가?',
      intervention: 'Hypothetical revolute-prismatic 2-DoF polar robot을 straight path에서 zero/high friction으로 계산하고, fourth-order Runge-Kutta·numerical boundary derivative·bisection을 C/UNIX/VAX에서 실행한다. 별도의 2D Cartesian circular-path sketch로 island를 만든다.',
      observation: 'Fig. 8-10은 polar robot trajectory와 high-friction admissible region을, Fig. 11은 분리된 inadmissible island의 존재를 보여 준다.',
      supports: 'Coupled 2-DoF model에서 ACOT 계산이 가능하고 admissible velocity가 항상 하나의 [0, ceiling]은 아니라는 numerical existence evidence를 제공한다.',
      limit: 'Physical robot experiment, statistical benchmark, uncertainty sweep나 closed-loop tracking 검증은 없다. Cartesian island 예제는 hardware result가 아니라 analytical sketch다.',
    },
  ],
  implementation: [
    '원문의 hypothetical revolute-prismatic 2-DoF polar robot, straight path, Table I parameter와 zero/high-friction cases를 먼저 고정한다.',
    'q=f(λ)를 finite-piece analytic curve로 만들고 f′이 모든 joint에서 동시에 0이 되거나 path가 retrace하지 않는지 검사한다. f′, f″는 finite difference와 교차 검산한다.',
    'M_i, Q_i, R_i, S_i를 독립 계산하고 u_i=M_i ṗ+Q_i p²+R_i p+S_i가 원래 joint dynamics와 일치하는지 random-state residual로 확인한다.',
    '각 (λ,p)에서 M_i>0·M_i<0 endpoint를 min·max로 정렬한다. |M_i|가 threshold보다 작으면 division하지 않고 h_i의 speed-feasibility와 threshold sensitivity를 기록한다.',
    'GLB·LUB뿐 아니라 {p≥0:GLB≤LUB}의 모든 connected component를 찾는다. 첫 gap에서 탐색을 멈추지 말고 high-friction case의 disconnected interval과 island를 보존한다.',
    'ACOTNI의 initial maximum-acceleration curve와 final minimum-acceleration curve를 적분한다. 두 곡선이 만나면 single-switch simple case로만 기록한다.',
    '교차하지 않으면 boundary p=g(λ)의 derivative와 φ sign change를 원문처럼 numerical differentiation과 bisection으로 찾고, tangent·osculation·boundary discontinuity를 event로 처리한다.',
    'Island가 있으면 외곽·island boundary의 switch trajectories와 모든 intersection으로 directed graph를 만들고, highest feasible branch 우선 탐색과 dead-end backtracking을 검증한다.',
    'Fourth-order Runge-Kutta step을 절반으로 줄이며 total time, 모든 switching locations, boundary contact와 peak input의 convergence를 확인한다.',
    'p(λ)를 time history로 복원해 joint position·velocity·acceleration·input을 sample 사이까지 재평가하고 Fig. 8-11의 topology와 switching sequence를 대조한다.',
    'Nominal bounds와 안쪽으로 줄인 conservative bounds를 비교해 boundary clearance를 측정한다. Exact optimum을 그대로 hardware command로 release하지 않는다.',
    '같은 projected dynamics를 modern TOPP-RA의 backward controllable-set·forward greedy pass로도 풀어 duration과 feasibility를 비교하되, 이를 Shin의 numerical-integration algorithm 재현이라고 부르지 않는다.',
  ],
  assumptions: [
    'Geometric joint path q=f(λ)가 미리 주어지고 finite number의 real-valued piecewise-analytic smooth pieces로 구성된다.',
    'Path tangent f′은 모든 joint에서 동시에 0이 되지 않고 λ가 증가할 때 path를 retrace하지 않는다.',
    'Rigid manipulator dynamics, viscous friction, gravity와 payload를 정확히 안다.',
    'Actuator lower·upper bounds가 λ와 p의 함수로 알려져 있다. 논문의 concrete boundary·termination construction은 independent bounds와 at-most-quadratic velocity dependence를 둔다.',
    'Initial·final path speed를 포함한 boundary conditions가 specified되고 optimal trajectory는 p≥0에서 진행한다.',
    'Collision, clearance와 task constraints는 fixed-path planning 단계에서 이미 검증되었다.',
  ],
  failures: [
    'Corner가 있는 C0 path에서는 f″이 정의되지 않는다. Smooth subpath 분할이나 blending 뒤 collision을 다시 검증해야 한다.',
    'Viscous term R_i p를 설명 없이 생략하면 원문 dynamics를 바꾸고 friction-induced island와 input margin을 놓칠 수 있다.',
    'M_i가 0에 가까울 때 그대로 나누면 bound 방향이 불안정해지고 speed-only violation을 거대한 가짜 acceleration interval로 숨긴다.',
    'Admissible speed를 항상 [0, ceiling] 하나로 저장하면 disconnected component와 island를 삭제해 feasible branch 또는 충돌해야 할 boundary를 잃는다.',
    'Single forward/backward intersection만 찾으면 boundary tangent·osculation과 여러 acceleration/deceleration switches를 놓친다.',
    'Coarse integration, numerical boundary derivative와 missed discontinuity는 φ sign change와 switching location을 잘못 찾을 수 있다.',
    'Theoretical optimum은 inadmissible boundary를 just-touch해 minute input·parameter error에도 violation이 날 수 있다. Conservative torque bounds와 closed-loop margin이 필요하다.',
    'Minimum-time hard acceleration switch는 infinite jerk를 만들며 actuator bandwidth, vibration, thermal·regeneration limit을 직접 제한하지 않는다.',
    'Exact rigid model 밖의 elasticity, backlash, payload·friction error와 tracking delay는 theorem의 보장 범위가 아니다.',
    'Input bounds를 만족해도 joint velocity, Cartesian speed, contact force, collision scene과 safety zone 같은 추가 constraint를 위반할 수 있다.',
  ],
  legacy: 'Shin-McKay와 같은 시기 Bobrow·Dubowsky·Gibson의 독립 연구는 fixed-path time-optimal parameterization의 classical numerical-integration foundation을 만들었다. 이후 TOPP-RA는 같은 path-projected dynamics를 x=p²의 discrete reachable·controllable sets와 작은 LP로 푼다. 이는 Shin의 ACOT를 그대로 구현한 것이 아니라 switching-profile construction을 다른 순서와 numerical contract로 푸는 modern branch다. Ruckig 계열의 jerk-limited state-to-state online generation도 fixed-path TOPP와는 다른 문제다.',
  nextReading: '다음에는 trajectory-generation 글의 TOPP-RA식 Lab에서 backward controllable sets와 forward fastest selection을 읽는다. 그 구현은 disconnected set, grid constraint error와 zero-inertia를 별도 numerical contract로 다루지만 Shin theorem을 자동 상속하지 않는다. 이어 feedback-control 글에서 exact-model minimum-time reference와 실제 tracking·safety의 책임 경계를 닫는다.',
  nextLinks: [
    { slug: 'robot-trajectory-generation', label: 'Modern TOPP-RA reachability branch', reason: '같은 projected dynamics를 x=p²의 backward controllable sets와 forward greedy pass로 푸는 현대 solver를 비교한다.' },
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Dynamics & Feedback Control', reason: 'Open-loop minimum-time reference가 model error와 disturbance 속에서 왜 closed-loop tracking을 필요로 하는지 이어 간다.' },
  ],
  capabilities: [
    'Path optimization과 time-optimal path parameterization을 구분한다.',
    'q=f(λ)의 chain rule을 viscous friction이 있는 manipulator dynamics에 대입해 M_i ṗ+Q_i p²+R_i p+S_i를 복원한다.',
    'M_i>0·M_i<0·M_i=0을 구분해 actuator bounds를 GLB≤ṗ≤LUB motion cone으로 바꾼다.',
    'Friction-dependent disconnected admissible intervals와 phase-plane island가 생기는 이유를 설명한다.',
    'ACOTNI single-intersection case와 boundary tangent·osculation·multiple-switch·graph-backtracking ACOT를 구분한다.',
    'Piecewise-analytic theorem 조건, hypothetical numerical examples와 hardware deployment evidence의 경계를 구분한다.',
    'Shin numerical integration과 modern TOPP-RA reachability가 같은 projected dynamics를 푸는 다른 solver임을 설명한다.',
  ],
};
