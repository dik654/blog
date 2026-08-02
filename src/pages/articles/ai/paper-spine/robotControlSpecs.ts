import type { PaperStudySpec } from './FoundationalPaperStudy';

export const kalmanOptimalControl1960Spec: PaperStudySpec = {
  shortTitle: 'Controllability, Observability & Optimal Regulator',
  citation: 'R. E. Kalman - Contributions to the Theory of Optimal Control',
  yearVenue: '1960 · Boletín de la Sociedad Matemática Mexicana 5',
  sourceUrl: 'https://www.boletin.math.org.mx/pdf/2/5/BSMM%282%29.5.102-119.pdf',
  appendixUrl: 'https://www.ee.iitb.ac.in/~belur/ee640/optimal-classic-paper.pdf',
  before: 'Quadratic error를 줄이는 linear feedback 설계는 Wiener·Hall 이후 알려져 있었지만, Fourier·Laplace 중심 설명은 general time-varying plant의 존재 조건과 안정성 명제를 명확히 닫지 못했다. 어떤 initial state를 실제 input으로 origin에 보낼 수 있는지, output이 어떤 state direction을 드러내는지, 그리고 finite-horizon optimum이 언제 infinite-horizon stabilizer가 되는지를 한 언어로 묶을 필요가 있었다.',
  authorIntent: 'Kalman은 ordinary differential equations, Hamilton-Jacobi equation과 Lyapunov stability를 사용해 가장 단순한 regulator problem의 엄밀한 이론을 세우려 했다. 원문 서론이 직접 꼽은 principal contribution은 controllability와 observability의 도입·활용이며, 이를 통해 quadratic regulator의 existence, stability와 matrix Riccati equation의 성질을 증명하는 것이다.',
  thesis: '정확한 state가 주어진 noise-free linear plant에서 먼저 controllability·observability라는 구조 조건을 판별하고, terminal penalty와 output-error·input-energy quadratic cost를 Hamilton-Jacobi equation에 넣으면 Riccati differential equation과 linear state feedback가 나온다. 다만 finite-horizon optimality, infinite-horizon limit와 closed-loop stability는 서로 다른 정리이며 가정도 다르다.',
  readerBridge: [
    { term: 'State', latex: String.raw`x(t)`, plain: '현재 이후의 motion을 예측하는 데 필요한 plant의 내부 요약이다. Sensor output 그 자체나 estimator가 만든 추정치와 같다고 가정할 수는 없다.', role: '이 논문이 추정된 state가 아니라 정확히 알려진 state를 feedback에 넣는 Problem (B)만 푼다는 경계를 고정한다.' },
    { term: 'Control과 output', latex: String.raw`u(t),\ y(t)`, plain: 'u는 actuator를 통해 state derivative를 바꾸는 선택이고, y는 sensor가 state에서 드러내는 값이다. 하나는 작용 channel, 다른 하나는 정보 channel이다.', role: 'G와 H를 같은 행렬 역할로 읽지 않고 controllability와 observability의 두 구조 질문을 분리한다.' },
    { term: 'Structural test', latex: String.raw`W_c\succ0,\ W_o\succ0`, plain: 'Gain 숫자를 고르기 전에 모든 state direction에 actuator가 닿는지, free motion이 output history에 흔적을 남기는지 묻는 검사다.', role: 'Q·R tuning이나 큰 feedback gain으로 닿지 않는 mode를 복구할 수 없음을 먼저 판정한다.' },
    { term: 'Cost-to-go matrix', latex: String.raw`P(t,t_1)`, plain: '현재 state에서 terminal time까지 남은 최소 quadratic cost를 방향별 가격으로 압축한 symmetric matrix다.', role: 'Riccati equation을 gain 공식 암기가 아니라 terminal condition에서 future cost를 뒤로 운반하는 계산으로 읽게 한다.' },
  ],
  reconstruction: [
    { label: 'Plant와 measurement', latex: String.raw`\dot x=Fx+Gu,\quad y=Hx`, note: '작용 channel G와 정보 channel H를 분리한다' },
    { label: 'Physical realization A', latex: String.raw`y_{\le t}\longmapsto\widehat x(t)`, note: 'State estimation 단계이며 이 논문의 해법 범위 밖이다' },
    { label: 'Regulator B', latex: String.raw`x(t)\longmapsto u(t)`, note: '정확한 full state를 가정한 논문의 실제 문제다' },
    { label: 'Structural gate', latex: String.raw`W_c,\ W_o`, note: 'Riccati gain 전에 controllability·observability를 검사한다' },
    { label: 'Quadratic future cost', latex: String.raw`V^0=\tfrac12x^\top Px`, note: 'Terminal penalty와 running loss를 현재 state 가격으로 압축한다' },
    { label: 'Riccati feedback', latex: String.raw`u^0=-R^{-1}G^\top Px`, note: 'Unconstrained optimal input을 current state에 선형 적용한다' },
  ],
  mechanism: [
    'Continuous time-varying plant를 x_dot=Fx+Gu, y=Hx로 쓰고 transition matrix로 arbitrary initial state와 input history가 만드는 motion을 전개한다.',
    'Feedback의 physical realization을 output history에서 best state approximation을 만드는 Problem (A)와, 그 state에서 control을 계산하는 Problem (B)로 나눈다. 원문은 B만 다루며 x(t)가 정확히 알려졌다고 가정한다.',
    'State x를 finite interval 안에 origin으로 보낼 수 있는지를 controllability로 정의하고, 원문 orientation의 Gramian positive definiteness와 constant-plant rank test를 동치로 증명한다.',
    'Observability는 time-reversed dual plant의 controllability로 정의한다. 이 output 구조는 뒤의 stability theorem에 들어가지만 estimator recursion이나 noise covariance update를 제공하지 않는다.',
    'Terminal state에는 A, running output error Hx에는 Q, control effort에는 R을 둔 quadratic regulator problem을 세운다. H가 singular일 수 있어 state penalty H^TQH도 semidefinite일 수 있다.',
    'Hamilton-Jacobi value를 quadratic form으로 놓고 strict input convexity R>0로 u를 소거하면 terminal condition P(t_1)=A에서 backward로 푸는 Riccati differential equation과 unique state-feedback law가 나온다.',
    'Finite horizon existence, zero-terminal-cost horizon을 늘린 infinite-horizon Riccati limit, 그리고 uniform asymptotic stability를 각각 별도 theorem과 별도 가정으로 증명한다.',
    '현대 구현에서는 sampled discrete Riccati recursion, stabilizability·detectability relaxation, Kalman estimator, saturation·delay·model error를 추가한다. 이들은 1960 control paper의 직접 증거가 아니라 후대 handoff다.',
  ],
  equations: [{
    latex: String.raw`\begin{gathered}
\underbrace{\dot x(t)=F(t)x(t)+G(t)u(t)}_{\text{state가 변하는 plant}}\\[3pt]
\underbrace{y(t)=H(t)x(t)}_{\text{sensor가 드러내는 output}},\qquad
\underbrace{u(t)=k(x(t),t)}_{\text{정확한 state를 쓰는 feedback}}
\end{gathered}`,
    meaning: '원문 §§2-3의 계약이다. G를 통해 input이 state motion에 작용하고 H를 통해 state가 output으로 드러난다. 그러나 논문이 실제로 푸는 control law는 output history가 아니라 정확히 알려진 x(t)를 받는다. y에서 x를 만드는 Problem (A)는 분리되어 있다.',
    symbols: [[String.raw`x(t)`, 'Time t 이후의 motion을 결정하는 n-dimensional state'], [String.raw`u(t)`, 'Controller가 선택하는 m-dimensional input'], [String.raw`y(t)`, 'Sensor 쪽 p-dimensional output'], [String.raw`F,G,H`, '각각 free dynamics, actuation map, output map'], [String.raw`k`, '현재 state와 time을 input으로 받는 feedback law']],
  }, {
    latex: String.raw`\begin{gathered}
\underbrace{B_c(\tau)=\Phi(t_0,\tau)G(\tau)}_{\text{input direction을 }t_0\text{ 좌표로 운반}}\\[3pt]
\underbrace{W_c(t_0,t_1)}_{\text{origin transfer의 controllability Gramian}}
\;=\underbrace{\int_{t_0}^{t_1}B_c(\tau)B_c(\tau)^\top d\tau}_{\text{interval의 control energy direction을 합산}}\\[4pt]
\underbrace{W_c(t_0,t_1)\succ0\ \text{ for some }t_1>t_0}_{\text{모든 nonzero state를 유한 시간에 0으로 전송}}
\Longleftrightarrow\underbrace{\text{complete controllability at }t_0}_{\text{Proposition 5.2}}\\[3pt]
\underbrace{\operatorname{rank}[G,FG,\ldots,F^{n-1}G]=n}_{\text{constant plant의 동치 판정}}
\end{gathered}`,
    latexCompact: String.raw`\begin{gathered}
\underbrace{B_c(\tau)=\Phi(t_0,\tau)G(\tau)}_{\text{input 방향을 }t_0\text{로 운반}}\\[3pt]
\underbrace{W_c(t_0,t_1)}_{\text{controllability Gramian}}\\[-1pt]
\underbrace{{}=\int_{t_0}^{t_1}B_c(\tau)B_c(\tau)^\top d\tau}_{\text{control energy를 적분}}\\[3pt]
\underbrace{\exists t_1>t_0:\ W_c\succ0}_{\text{모든 state 방향을 0으로 전송}}\\[3pt]
\underbrace{\operatorname{rank}[G,\ldots,F^{n-1}G]=n}_{\text{constant plant 판정}}
\end{gathered}`,
    meaning: '원문 식 (5.3)은 final-state reachability Gramian을 쓰는 현대 교재와 달리 transition을 t_0 방향으로 놓고 x를 origin으로 보내는 energy를 측정한다. 두 orientation은 nonsingular transition matrix의 congruence로 같은 controllability를 판정한다. Constant plant에서는 Corollary 5.5의 rank test가 된다.',
    symbols: [[String.raw`B_c(\tau)`, 'Tau의 input direction을 time t_0 state coordinates로 옮긴 matrix'], [String.raw`W_c(t_0,t_1)`, 'Time t_0의 state를 zero로 보내는 데 필요한 direction별 control authority'], [String.raw`\Phi(t_0,\tau)`, 'Tau의 vector를 t_0 coordinate로 옮기는 state-transition matrix'], [String.raw`\succ0`, '모든 nonzero vector에서 positive quadratic energy를 갖는 positive definiteness'], [String.raw`[G,FG,\ldots,F^{n-1}G]`, 'Constant F,G에서 input directions와 반복 dynamics가 span하는 controllability matrix']],
  }, {
    latex: String.raw`\begin{gathered}
\underbrace{B_o(\tau)=H(\tau)\Phi(\tau,t_0)}_{\text{initial state를 output까지 운반}}\\[3pt]
\underbrace{W_o(t_0,t_1)}_{\text{free motion이 남기는 output energy}}
\;=\underbrace{\int_{t_0}^{t_1}B_o(\tau)^\top B_o(\tau)\,d\tau}_{\text{interval의 output signature를 합산}}\\[4pt]
\underbrace{\mathcal P\ \text{uniformly completely observable}}_{\text{원문의 output 구조 조건}}
\Longleftrightarrow\underbrace{\mathcal P^\ast\ \text{uniformly completely controllable}}_{\text{time-reversed dual로 정의}}
\end{gathered}`,
    latexCompact: String.raw`\begin{gathered}
\underbrace{B_o(\tau)=H(\tau)\Phi(\tau,t_0)}_{\text{state를 output까지 운반}}\\[3pt]
\underbrace{W_o(t_0,t_1)}_{\text{output-energy Gramian}}\\[-1pt]
\underbrace{{}=\int_{t_0}^{t_1}B_o(\tau)^\top B_o(\tau)\,d\tau}_{\text{output signature를 적분}}\\[3pt]
\underbrace{\mathcal P:\mathrm{UCO}\Longleftrightarrow\mathcal P^\ast:\mathrm{UCC}}_{\text{time-reversed dual로 정의}}
\end{gathered}`,
    meaning: '원문 식 (5.24)와 Definition 5.23의 현대 표기다. W_o는 free state direction이 interval의 output에 남기는 squared signature를 합친다. 하지만 이 논문은 W_o로 state estimate를 계산하지 않는다. Observability는 regulator stability theorem의 구조 가정이며, estimator algorithm은 별도 문제다.',
    symbols: [[String.raw`B_o(\tau)`, 'Initial state direction이 tau의 output에 미치는 map'], [String.raw`W_o`, 'Observability 또는 output-energy Gramian'], [String.raw`\mathcal P`, 'Plant (F,G,H)'], [String.raw`\mathcal P^\ast`, 'Time reversal과 transpose로 만든 원문의 dual plant']],
  }, {
    latex: String.raw`\begin{gathered}
\underbrace{\ell_x(t)=\tfrac12(H(t)x(t))^\top Q(t)(H(t)x(t))}_{\text{output error의 running cost}}\\[3pt]
\underbrace{\ell_u(t)=\tfrac12u(t)^\top R(t)u(t)}_{\text{control effort의 running cost}}\\[3pt]
\underbrace{\ell(x,u,t)=\ell_x(t)+\ell_u(t)}_{\text{한 시점의 quadratic loss}}\\[4pt]
\underbrace{J(u)=\tfrac12x(t_1)^\top A x(t_1)+\int_{t_0}^{t_1}\ell(x,u,t)\,dt}_{\text{terminal penalty와 running loss를 합산}}\\[4pt]
\underbrace{A\succeq0}_{\text{terminal weight}},\qquad
\underbrace{Q(t)\succ0,\ R(t)\succ0}_{\text{Assumption A1의 weights}}
\end{gathered}`,
    meaning: '원문 Assumption (A1)을 matrix notation으로 풀어 쓴 식이다. 흔한 현대식 x^TQx가 아니라 Hx의 weighted norm을 쓴다. 따라서 H가 숨기는 direction의 instantaneous state cost는 0일 수 있다. Optimal이라는 말은 이 F,G,H,A,Q,R와 horizon, exact-state information contract 안에서만 성립한다.',
    symbols: [[String.raw`\ell_x,\ell_u`, '각각 output error와 input effort의 running-loss component'], [String.raw`\ell(x,u,t)`, '두 component를 더한 한 시점의 running loss'], [String.raw`A`, 'Symmetric positive-semidefinite terminal weight이며 P(t_1,t_1)의 boundary value'], [String.raw`Q(t)`, 'Output error Hx의 symmetric positive-definite weight'], [String.raw`R(t)`, 'Input의 symmetric positive-definite weight이자 strict convexity 조건'], [String.raw`t_0,t_1`, 'Initial time과 terminal time']],
  }, {
    latex: String.raw`\begin{gathered}
\underbrace{V^0(x,t,t_1)=\tfrac12x^\top P(t,t_1)x}_{\text{남은 최소 cost를 current state에 압축}}\\[3pt]
\underbrace{P(t_1,t_1)=A}_{\text{terminal에서 주는 boundary}}\\[4pt]
\underbrace{-\dot P=F^\top P+PF+H^\top QH}_{\text{free dynamics와 현재 loss를 뒤로 운반}}
-\underbrace{PGR^{-1}G^\top P}_{\text{optimal input으로 줄이는 future cost}}
\end{gathered}`,
    latexCompact: String.raw`\begin{gathered}
\underbrace{V^0=\tfrac12x^\top Px}_{\text{minimum future cost}},\qquad
\underbrace{P(t_1,t_1)=A}_{\text{terminal boundary}}\\[4pt]
\underbrace{-\dot P=F^\top P+PF}_{\text{free dynamics를 뒤로 운반}}\\[3pt]
\underbrace{{}+H^\top QH}_{\text{running loss를 더함}}
-\underbrace{PGR^{-1}G^\top P}_{\text{control로 cost를 줄임}}
\end{gathered}`,
    meaning: 'Quadratic value ansatz를 Hamilton-Jacobi equation에 대입하고 optimal u를 소거하면 원문 식 (6.3)이 나온다. P는 terminal A에서 earlier time으로 계산한다. 같은 식을 arbitrary initial P와 함께 forward로 적분하는 것은 finite-horizon boundary-value problem을 푸는 절차가 아니다.',
    symbols: [[String.raw`V^0`, '현재 state와 남은 horizon에서 가능한 minimum performance index'], [String.raw`P(t,t_1)`, 'Symmetric cost-to-go matrix'], [String.raw`H^\top QH`, 'Output penalty를 state coordinate로 끌어온 running cost'], [String.raw`PGR^{-1}G^\top P`, 'Input 최적화로 줄어드는 future-cost term'], [String.raw`A`, 'Terminal time에서 주어진 boundary matrix']],
  }, {
    latex: String.raw`\begin{gathered}
\underbrace{K(t)=R(t)^{-1}G(t)^\top P(t,t_1)}_{\text{state cost gradient를 input gain으로 변환}}\\[4pt]
\underbrace{u^0(t)=-K(t)x(t)}_{\text{정확한 current state에 unconstrained feedback를 적용}}
\end{gathered}`,
    meaning: 'Theorem 6.4의 finite-horizon optimal control law다. R>0이므로 input minimizer가 unique하고 current state에 linear하다. 이 식에는 estimator, covariance, input clipping이나 actuator dynamics가 없으며, x 대신 x-hat을 넣는 구현은 원문이 직접 푼 문제가 아니다.',
    symbols: [[String.raw`K(t)`, 'R^{-1}G^TP로 계산한 time-varying state-feedback gain'], [String.raw`u^0(t)`, '선언된 finite-horizon regulator problem의 unique optimal input'], [String.raw`R^{-1}`, 'Input effort weight의 inverse'], [String.raw`G^\top P`, 'State cost gradient를 actuation coordinates로 보내는 feedback gain의 핵심'], [String.raw`x(t)`, 'Problem (B)가 정확히 알고 있다고 가정한 full state']],
  }, {
    latex: String.raw`\begin{gathered}
\underbrace{P_\infty(t)=\lim_{t_1\to\infty}\Pi(t;0,t_1)}_{\text{zero terminal penalty로 horizon을 연장}}
\quad\text{if}\\[3pt]
\underbrace{\text{the plant is completely controllable}}_{\text{Proposition 6.6의 존재 조건}}\\[4pt]
\underbrace{K_\infty(t)=R(t)^{-1}G(t)^\top P_\infty(t)}_{\text{limit value를 feedback gain으로 변환}}\\[3pt]
\underbrace{u_\infty^0(t)=-K_\infty(t)x(t)}_{\text{infinite-horizon regulator feedback}}
\end{gathered}`,
    meaning: '원문은 terminal matrix 0에서 시작한 finite-horizon Riccati solution Π를 horizon과 함께 monotone하게 늘려 P_infinity를 만든다. Complete controllability는 이 limit의 bounded existence에 쓰인다. 이 existence statement만으로 uniform closed-loop stability까지 자동 결론 내릴 수는 없다.',
    symbols: [[String.raw`\Pi(t;0,t_1)`, 'Terminal condition P(t_1)=0인 finite-horizon Riccati solution'], [String.raw`P_\infty(t)`, 'Horizon limit에서 얻는 time-varying infinite-horizon value matrix'], [String.raw`t_1\to\infty`, 'Terminal time을 뒤로 보내는 limiting operation'], [String.raw`K_\infty(t)`, 'Infinite-horizon value matrix에서 얻는 time-varying feedback gain'], [String.raw`u_\infty^0`, 'Infinite-horizon performance index를 최소화하는 state feedback']],
  }, {
    latex: String.raw`\begin{gathered}
\underbrace{\mathrm{UCC}+\mathrm{UCO}}_{\text{uniform한 actuation·output 구조}}\\[3pt]
\underbrace{0<q_-I\preceq Q(t)\preceq q_+I}_{\text{output weight의 uniform bounds}}\\[3pt]
\underbrace{0<r_-I\preceq R(t)\preceq r_+I}_{\text{input weight의 uniform bounds}}\\[4pt]
\Longrightarrow
\underbrace{\lVert\Phi_{\mathrm{cl}}(t,t_0)\rVert\le a e^{-b(t-t_0)}}_{\text{uniform asymptotic stability와 동치인 exponential bound}}
\end{gathered}`,
    meaning: 'Theorem 6.10의 sufficient conditions를 현대 기호로 묶었다. 논문은 optimal control이면 반드시 stable하다는 당시의 tacit assumption을 명시적으로 틀렸다고 지적한 뒤 이 조건 아래에서 value function을 Lyapunov function으로 사용한다. Modern stabilizability·detectability는 더 약한 후대 조건이지 이 theorem의 문구가 아니다.',
    symbols: [[String.raw`\mathrm{UCC}`, 'Uniform complete controllability'], [String.raw`\mathrm{UCO}`, 'Uniform complete observability'], [String.raw`q_-,q_+,r_-,r_+`, 'Time과 무관한 positive lower·upper weight bounds'], [String.raw`\Phi_{\mathrm{cl}}`, 'Optimal feedback를 적용한 linear closed-loop transition matrix'], [String.raw`a,b`, 'Initial time과 무관한 positive stability constants']],
  }],
  evidence: [
    { label: 'Problem B boundary', question: 'Output history에서 실제 actuator command까지 가는 전체 feedback realization을 이 논문이 푸는가?', intervention: '원문 §3은 y history에서 best state approximation을 만드는 (A)와 그 state에서 u를 계산하는 (B)를 분리하고, 이후에는 x(t)가 exactly known이라고 가정한다.', observation: 'Riccati feedback derivation의 input은 y나 covariance가 아니라 full state x다. Observability가 등장해도 estimator recursion은 제시되지 않는다.', supports: '1960 control paper가 deterministic full-state regulator와 그 구조·안정성 정리를 다룬다는 범위를 지지한다.', limit: 'Problem (A)의 optimal filter, noise model, covariance Riccati recursion, output-feedback separation을 이 본문이 증명하거나 구현하지 않는다. 원문은 별도 논문과 duality result를 가리킨다.' },
    { label: 'Structural theorems', question: 'Controller cost를 정하기 전에 plant가 arbitrary state direction을 움직이고 드러낼 수 있는지 어떻게 판정하는가?', intervention: 'Proposition 5.2는 controllability와 W_c positive definiteness를 동치로 증명하고 Corollary 5.5는 constant plant의 full-rank condition을 준다. Definition 5.23은 uniform complete observability를 dual controllability로 둔다.', observation: 'Gain이나 coordinate representation과 분리된 structural gate가 regulator existence·stability theorem의 전제가 된다.', supports: 'Uncontrollable mode는 Q·R tuning으로 만들 수 없고, unobservable output direction은 H-based running cost와 stability condition을 약화할 수 있다는 진단을 지지한다.', limit: 'Rank 또는 positive definiteness는 minimum actuator energy, numerical conditioning, saturation margin, sensor noise floor나 nonlinear operating envelope를 보장하지 않는다.' },
    { label: 'Finite regulator', question: 'General time-varying linear plant의 finite-horizon quadratic regulator가 실제 feedback law로 존재하는가?', intervention: 'Assumption A1의 A>=0, Q>0, R>0 아래에서 Hamilton-Jacobi value를 quadratic form으로 두고 Riccati equation의 global backward existence와 unique minimizing feedback를 Theorem 6.4로 보인다.', observation: 'Trajectory 전체의 variational problem이 P(t,t_1)와 current full-state feedback u^0(t)로 압축된다.', supports: '선언된 linear, quadratic, unconstrained, exact-state finite-horizon contract에서 Riccati feedback가 optimal이라는 명제를 지지한다.', limit: '증거는 theorem과 proof다. Numerical benchmark, sampled implementation, nonlinear plant, nonquadratic loss, input/state hard constraints 또는 hardware timing을 평가한 실험이 아니다.' },
    { label: 'Infinite-horizon stability', question: 'Horizon을 무한히 늘린 optimal law가 언제 closed loop를 안정화하는가?', intervention: 'Proposition 6.6과 Theorem 6.7은 complete controllability로 zero-terminal-cost Riccati limit와 infinite-horizon optimum을 만들고, Theorem 6.10은 UCC·UCO와 Q,R uniform bounds를 추가해 Lyapunov argument를 적용한다.', observation: 'Value function은 stated conditions 아래 closed loop의 Lyapunov function이 되고 uniform asymptotic stability가 따른다.', supports: 'Optimality, Riccati limit existence와 stability를 하나의 무조건적 결론으로 합치지 말아야 한다는 점을 지지한다.', limit: 'Model uncertainty, neglected modes, delay, quantization, saturation, disturbance rejection margin과 robust stability는 이 theorem의 증거 범위 밖이다.' },
  ],
  implementation: [
    'Hard transfer 1: F=diag(1,-1), G=[0,1]^T로 unstable first mode에 input channel이 없게 만든다. Q와 R을 여러 order로 바꿔도 controllability rank와 eigenvalue +1이 closed loop에 남는지 확인한다.',
    'Hard transfer 2: Nonsingular coordinate change z=Tx 전후의 controllability matrix rank, Gramian congruence와 minimum transfer energy를 비교한다. Matrix entries는 달라도 structural verdict가 같아야 한다.',
    'Hard transfer 3: H가 한 mode를 숨기는 2-state plant를 만든다. Exact x를 직접 feedback하면 control law는 계산되지만 y history만 주어졌을 때 controller input이 정의되지 않는 지점을 표시한다.',
    'Hard transfer 4: Finite terminal A에서 continuous Riccati equation을 backward로 적분한다. 같은 A를 t_0의 initial value로 오해해 forward 적분한 P와 total cost를 비교해 boundary direction 오류를 잡는다.',
    'Hard transfer 5: Control Riccati와 별도 Kalman filter covariance Riccati를 나란히 적고 data flow, noise matrices, initial·terminal condition과 time direction을 비교한다. 둘 다 Riccati라는 이유로 P를 공유하지 않는다.',
    'Hard transfer 6: Nominal feedback에 input clipping과 one-sample delay를 각각 추가한다. Unconstrained cost optimum과 실제 constraint satisfaction·stability margin이 어느 순간 분리되는지 기록한다.',
  ],
  assumptions: [
    'F(t), G(t), H(t)는 continuous인 real linear time-varying plant이며 admissible control 아래 state motion이 존재하고 unique하다.',
    '논문은 output history에서 state를 추정하는 Problem (A)가 아니라 x(t)를 exactly known으로 두는 deterministic full-state Problem (B)를 푼다.',
    'Finite regulator에서 A는 symmetric positive semidefinite이고 Q(t), R(t)는 class C2의 symmetric positive definite matrices이며 R^{-1}이 존재한다. Input과 state에 hard bound는 없다.',
    'Infinite-horizon Riccati limit의 존재에는 complete controllability가, 원문 Theorem 6.10의 uniform stability에는 UCC·UCO와 Q,R의 time-uniform positive upper·lower bounds가 추가로 필요하다.',
  ],
  failures: [
    'H를 noisy sensor model과 estimator로 곧바로 읽으면 원문의 Hx running penalty·dual observability와 별도 filtering problem을 섞게 된다.',
    'Controllability rank가 full이어도 Gramian의 작은 eigenvalue는 huge transfer energy를 뜻할 수 있으므로 practical actuator authority가 충분하다고 결론 내릴 수 없다.',
    'Finite-horizon P(t,t_1), infinite-horizon time-varying P_infinity(t)와 stationary algebraic Riccati solution을 같은 object로 취급하면 boundary condition과 존재 정리를 잃는다.',
    'State·input units를 normalize하지 않고 Q·R 숫자만 비교하면 cost의 물리 의미와 feedback aggressiveness가 왜곡된다.',
    'Actuator saturation, delay, unmodeled flexible mode와 sampled numerical error가 들어가면 원문의 unconstrained continuous-time optimality·stability contract와 다른 closed loop가 된다.',
  ],
  legacy: '직접 유산은 controllability·observability를 regulator의 구조 조건으로 만들고, Hamilton-Jacobi equation에서 Riccati state feedback와 그 existence·stability theory를 연결한 것이다. 오늘날 LQR이라는 이름, algebraic Riccati solver, stabilizability·detectability 조건과 sampled implementation은 이 구조의 후대 표준화다. 같은 1960년의 별도 Kalman filtering paper는 Problem (A)의 stochastic state estimation을 covariance recursion으로 다루며, filter와 regulator의 duality가 두 Riccati 식을 잇지만 하나의 algorithm으로 합치지는 않는다.',
  nextReading: '먼저 별도 Kalman filtering paper에서 output history와 noise covariance가 state estimate를 만드는 정보 경로를 읽으면 full-state regulator와 estimator를 분리할 수 있다. 현대 feedback article은 이를 sampled LQR과 estimator-controller loop로 조립하고, Mayne et al.은 원문의 unconstrained input을 hard state·input constraints가 있는 receding-horizon controller로 확장한다.',
  nextLinks: [
    { slug: 'paper-kalman-filter-1960', label: 'Kalman Filtering 1960', reason: '이 논문이 제외한 Problem (A)를 별도 state estimate·covariance recursion으로 읽는다.' },
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Dynamics & Feedback Control', reason: '원문의 continuous full-state regulator를 sampled LQR, estimator-controller와 actuator boundary로 옮긴다.' },
    { slug: 'paper-mayne-mpc-2000', label: 'Mayne Constrained MPC 2000', reason: 'Unconstrained Riccati feedback 다음에 hard constraints와 recursive feasibility를 붙인다.' },
  ],
  capabilities: [
    'Uncontrollable unstable mode에 Q·R을 키워도 feedback로 옮길 수 없는 이유를 rank와 state direction으로 설명한다.',
    '원문 orientation의 controllability Gramian과 현대 reachability Gramian이 coordinate change 아래 같은 structural verdict를 주는 이유를 설명한다.',
    'Observability가 등장해도 이 논문은 exact-state Problem (B)만 푼다는 점과 별도 Kalman filter의 data flow를 구분한다.',
    'P(t_1)=A인 finite Riccati, P_infinity(t) limit와 stationary algebraic LQR을 각각 다른 boundary·assumption 층으로 설명한다.',
    'Theorem 6.10의 UCC·UCO와 weight bounds를 말하지 않고 optimal feedback의 stability를 주장하지 않는다.',
    'Nominal continuous-time theorem과 sampled solver, saturation·delay·model uncertainty가 있는 modern implementation의 보장 범위를 분리한다.',
  ],
};

export const mayneMpc2000Spec: PaperStudySpec = {
  documentKind: 'Survey paper',
  shortTitle: 'Constrained Model Predictive Control',
  citation: 'D. Q. Mayne, J. B. Rawlings, C. V. Rao, P. O. M. Scokaert - Constrained Model Predictive Control: Stability and Optimality',
  yearVenue: '2000 · Automatica 36(6)',
  sourceUrl: 'https://doi.org/10.1016/S0005-1098(99)00214-9',
  appendixUrl: 'https://www.sciencedirect.com/science/article/pii/S0005109899002149',
  before: 'Infinite-horizon optimal control gives attractive feedback and stability properties but online solution is generally difficult. Finite-horizon optimization is computable and can impose hard constraints, yet simply shortening the horizon and repeating an optimizer does not by itself preserve infinite-horizon feasibility, stability, or optimality.',
  authorIntent: '저자들은 새 plant benchmark를 제시한 것이 아니라 constrained linear·nonlinear MPC의 stability와 optimality 문헌을 survey했다. 특히 finite-horizon regulator가 closed loop가 되는 계산, terminal equality와 terminal set·cost·local controller가 보장을 닫는 조건, 당시 robust·tracking·output-feedback·adaptive MPC의 미성숙한 경계를 한 이론 지도에 놓았다.',
  thesis: '현재 state에서 feasible finite-horizon problem을 풀어 첫 input만 적용하는 것만으로는 충분하지 않다. Nominal full-state regulator에서 A1-A3가 shifted tail의 admissibility를 만들고 A4가 candidate cost를 감소시키며, 다음 solve의 optimality와 stage-cost의 positive-definiteness 또는 detectability가 더해질 때에만 X_N 위 recursive feasibility와 asymptotic stability라는 충분조건 결론이 닫힌다.',
  readerBridge: [
    { term: 'Finite-horizon problem', latex: String.raw`\mathcal P_N(x)`, plain: '현재 state를 initial condition으로 고정하고 N개 input, predicted dynamics, stage·terminal cost와 constraints를 함께 푸는 online problem이다.', role: '한 번의 open-loop 최적화가 무엇을 계산하는지 고정한다.' },
    { term: 'Feasible domain', latex: String.raw`\mathcal X_N`, plain: 'N step 안에 constraints를 지키며 terminal set에 도달할 수 있는 initial state의 집합이다. Plant 전체 state space가 아니다.', role: 'Recursive feasibility와 stability claim의 domain of attraction을 제한한다.' },
    { term: 'Terminal ingredients', latex: String.raw`(\mathcal X_f,\kappa_f,F)`, plain: 'Horizon 끝에서 constraints를 계속 지키는 local set·controller와 남은 cost를 상계하는 terminal function이다.', role: '유한 horizon 밖의 admissible tail과 decrease certificate를 압축한다.' },
    { term: 'Receding feedback', latex: String.raw`\kappa_N(x)=u_0^*(x)`, plain: 'Optimal sequence 전체를 고정 실행하지 않고 첫 input만 적용한 뒤 새 state에서 다시 푼다.', role: 'Shift-and-append candidate로 다음 solve와 현재 solve를 연결한다.' },
  ],
  reconstruction: [
    { label: 'Initialize', latex: String.raw`x_{0|t}=x_t`, note: '측정한 full state를 이번 finite-horizon problem의 initial condition으로 둔다.' },
    { label: 'Optimize', latex: String.raw`u_{0:N-1}^*(x_t)\in\mathcal U_N(x_t)`, note: 'Dynamics, X·U constraints와 terminal condition을 만족하는 sequence 중 declared cost를 최소화한다.' },
    { label: 'Close the loop', latex: String.raw`u_t=\kappa_N(x_t)=u_{0|t}^*`, note: '첫 input만 plant에 적용한다. 이것이 open-loop plan을 receding-horizon feedback로 바꾸는 단계다.' },
    { label: 'Certify the next solve', latex: String.raw`\tilde{\mathbf u}^{+}=(u_1^*,\ldots,u_{N-1}^*,\kappa_f(x_N^*))`, note: '기존 tail을 shift하고 local terminal input을 append해 successor state에서 쓸 feasible candidate를 만든다.' },
  ],
  mechanism: [
    'Discrete nominal plant x^+=f(x,u), admissible sets X·U, equilibrium f(0,0)=0, horizon N, stage cost ℓ, terminal set X_f와 terminal cost F를 먼저 선언한다.',
    '현재 x에서 admissible sequence 집합 U_N(x)를 만들고 V_N^0(x)=min V_N(x,u)를 계산한다. 논문이 쓰는 존재 조건은 finite N, continuous f·ℓ·F, compact U와 closed X·X_f이며, 이는 minimum 존재 조건이지 stability theorem이 아니다.',
    '첫 optimal input κ_N(x)=u_0^*(x)만 적용한다. 한 시점의 feasibility는 다음 시점 feasibility를 뜻하지 않으므로 successor proof가 별도로 필요하다.',
    'A1의 X_f⊆X, A2의 κ_f(x)∈U, A3의 terminal positive invariance가 shifted-and-appended sequence를 successor state의 admissible candidate로 만든다. 이 단계가 nominal recursive feasibility를 닫는다.',
    'A4의 terminal decrease가 candidate cost에서 마지막 stage cost를 상쇄하고, 다음 solve의 optimality가 V_N^0(x^+)≤V_N^0(x)-ℓ(x,κ_N(x))를 준다. Positive-definite stage cost 또는 detectable-output 조건과 continuity를 더해야 asymptotic stability가 닫힌다.',
    'Terminal equality X_f={0}, F=0은 간단하지만 보수적이다. Terminal set·cost·local controller는 더 넓은 feasible region을 목표로 하며, nonlinear 또는 unstable constrained linear plant에서는 terminal constraint를 일반적으로 생략할 수 없다.',
    'A1-A4는 추가 regularity 아래 X_N에서 성립하는 충분조건이지 필요조건이 아니다. Recursive feasibility만으로 stability가 나오지 않고, nominal stability만으로 disturbance·estimation error 아래 actual constraint satisfaction이 나오지 않는다.',
  ],
  equations: [{
    latex: String.raw`\underbrace{x_{k+1}=f(x_k,u_k)}_{\text{상태를 한 칸 예측}}\,,\qquad \underbrace{x_k\in\mathcal X,\;u_k\in\mathcal U}_{\text{허용 집합을 검사}}`,
    meaning: '논문의 discrete nonlinear constrained plant contract다. Predicted state transition과 state·input admissibility는 objective와 별개의 hard feasibility 조건이다.',
    symbols: [[String.raw`x_k`, 'Prediction index k의 state'], [String.raw`u_k`, 'Prediction index k의 control input'], [String.raw`f`, 'Continuous한 nominal prediction dynamics'], [String.raw`\mathcal X,\mathcal U`, 'State와 input의 admissible sets']],
  }, {
    latex: String.raw`\underbrace{V_N^0(x)=\min_{\mathbf u\in\mathcal U_N(x)}\left[\sum_{i=0}^{N-1}\ell(x_i,u_i)+F(x_N)\right]}_{\text{제약된 유한 지평 비용을 최소화}}`,
    meaning: '현재 state x에서 admissible sequence만 대상으로 finite-horizon optimal value를 계산한다. F는 horizon 밖의 tail cost를 표현하지만 true infinite-horizon value와 자동으로 같지 않다.',
    symbols: [[String.raw`V_N^0(x)`, '현재 state에서의 optimal finite-horizon value'], [String.raw`\mathcal U_N(x)`, 'Dynamics·constraints·terminal set을 모두 만족하는 input sequences'], [String.raw`\ell`, 'Stage cost'], [String.raw`F`, 'Terminal cost'], [String.raw`N`, 'Prediction horizon']],
  }, {
    latex: String.raw`\underbrace{\mathcal X_N=\{x\in\mathcal X:\mathcal U_N(x)\neq\varnothing\}}_{\text{보장 영역을 유한 지평 가용 상태로 제한}}\,,\qquad \underbrace{\kappa_N(x)=u_0^*(x)}_{\text{첫 입력만 피드백으로 적용}}`,
    latexCompact: String.raw`\begin{gathered}
\underbrace{\mathcal X_N=\{x:\mathcal U_N(x)\ne\varnothing\}}_{\text{N-step feasible states}}\\[4pt]
\underbrace{\kappa_N(x)=u_0^*(x)}_{\text{첫 input만 실행}}
\end{gathered}`,
    meaning: 'X_N은 N step 안에 terminal condition까지 도달 가능한 initial states다. Theorem은 arbitrary state가 아니라 이 feasible domain에서 시작하며, controller는 optimal sequence의 첫 원소다.',
    symbols: [[String.raw`\mathcal X_N`, 'N-step feasible set이자 nominal domain of attraction'], [String.raw`\mathcal U_N(x)\neq\varnothing`, '현재 problem에 admissible sequence가 존재함'], [String.raw`\kappa_N`, 'Receding-horizon state-feedback law'], [String.raw`u_0^*`, '현재 optimal sequence의 첫 input']],
  }, {
    latex: String.raw`\underbrace{\tilde{\mathbf u}^{+}=(u_1^*,\ldots,u_{N-1}^*,\kappa_f(x_N^*))}_{\text{기존 꼬리를 이동하고 종단 입력을 덧붙임}}`,
    meaning: '첫 input 실행 뒤 기존 optimal plan의 나머지를 한 칸 shift하고 terminal local controller를 append한다. A1-A3 아래 이 sequence가 successor x^+=f(x,u_0^*)에서 admissible하므로 recursive feasibility가 귀납적으로 이어진다.',
    symbols: [[String.raw`\tilde{\mathbf u}^{+}`, '다음 solve를 위한 candidate input sequence'], [String.raw`u_1^*,\ldots,u_{N-1}^*`, '현재 feasible plan의 남은 tail'], [String.raw`x_N^*`, '현재 plan의 terminal state'], [String.raw`\kappa_f`, 'Terminal set 안의 local controller']],
  }, {
    latex: String.raw`\begin{aligned}\underbrace{\mathcal X_f\subseteq\mathcal X,\;0\in\mathcal X_f,\;\mathcal X_f\text{ closed}}_{\text{A1: 종단 집합을 허용 상태 안에 둠}}&,\quad \underbrace{\kappa_f(x)\in\mathcal U}_{\text{A2: 종단 입력을 허용}}\\[-2pt]\underbrace{f(x,\kappa_f(x))\in\mathcal X_f}_{\text{A3: 종단 집합을 양의 불변으로 유지}}&,\qquad x\in\mathcal X_f\end{aligned}`,
    meaning: 'A1-A3의 exact admissibility ingredients다. A2는 appended input의 input constraint를, A3는 그 input 뒤 state가 다시 terminal set 안에 남는다는 것을 보장한다. 이 조건들만으로 cost decrease나 stability가 나오지는 않는다.',
    symbols: [[String.raw`\mathcal X_f`, 'Closed terminal set, X의 subset이며 origin을 포함'], [String.raw`\kappa_f(x)`, 'Terminal local feedback'], [String.raw`f(x,\kappa_f(x))\in\mathcal X_f`, 'Local closed-loop positive invariance'], [String.raw`x\in\mathcal X_f`, 'A2-A3가 요구되는 local domain']],
  }, {
    latex: String.raw`\underbrace{F(f(x,\kappa_f(x)))-F(x)+\ell(x,\kappa_f(x))\le 0}_{\text{A4: 종단 꼬리 비용을 한 단계 감소}}\,,\qquad x\in\mathcal X_f`,
    latexCompact: String.raw`\begin{gathered}
\underbrace{F(f(x,\kappa_f(x)))-F(x)}_{\text{terminal value 변화}}\\[3pt]
\underbrace{{}+\ell(x,\kappa_f(x))\le0}_{\text{local stage cost 이상 감소}},
\qquad x\in\mathcal X_f
\end{gathered}`,
    meaning: 'A4는 terminal controller로 한 step 진행할 때 F의 감소가 그 step의 stage cost 이상이 되도록 한다. Terminal set이 F의 level set이면 이 감소가 A3의 invariance도 함의하는 흔한 구성이 있다.',
    symbols: [[String.raw`F`, 'Terminal cost이자 local Lyapunov candidate'], [String.raw`F(f(x,\kappa_f(x)))-F(x)`, 'Local closed-loop에서 terminal value의 변화'], [String.raw`\ell(x,\kappa_f(x))`, 'Appended terminal input의 stage cost'], [String.raw`\le 0`, 'Tail을 붙여도 total candidate cost가 증가하지 않는 조건']],
  }, {
    latex: String.raw`\underbrace{V_N^0(x^+)\le V_N(x^+,\tilde{\mathbf u}^{+})}_{\text{다음 최적값을 후보 비용과 비교}}\le\underbrace{V_N^0(x)-\ell(x,\kappa_N(x))}_{\text{현재 비용에서 한 단계 비용을 차감}}`,
    meaning: '첫 부등식은 next solve의 optimality, 둘째는 shifted candidate와 A4에서 나온다. Stage cost가 state를 positive-definite하게 재거나 detectable output을 벌점화하고 value가 필요한 continuity를 가지면 V_N^0가 Lyapunov function이 되어 X_N에서 asymptotic stability가 성립한다.',
    symbols: [[String.raw`x^+=f(x,\kappa_N(x))`, 'MPC input을 적용한 nominal successor'], [String.raw`V_N(x^+,\tilde{\mathbf u}^{+})`, 'Shifted candidate의 finite-horizon cost'], [String.raw`V_N^0(x^+)`, '다음 state에서 다시 최적화한 value'], [String.raw`\ell(x,\kappa_N(x))`, 'Closed-loop에서 제거되는 positive stage cost']],
  }, {
    latex: String.raw`\underbrace{a\lVert x\rVert^2\le V_N^0(x)\le b\lVert x\rVert^2}_{\text{값 함수를 상태 노름으로 끼움}}\,,\quad \underbrace{\Delta V_N^0(x)\le-c\lVert x\rVert^2}_{\text{매 단계 일정 비율로 감소}}`,
    latexCompact: String.raw`\begin{gathered}
\underbrace{a\lVert x\rVert^2\le V_N^0(x)\le b\lVert x\rVert^2}_{\text{value의 norm bounds}}\\[4pt]
\underbrace{\Delta V_N^0(x)\le-c\lVert x\rVert^2}_{\text{매 step 감소}}
\end{gathered}`,
    meaning: '논문 appendix의 exponential-stability 형태를 요약한 추가 bounds다. A1-A4만 적었다고 exponential stability를 바로 주장할 수 없으며, asymptotic stability보다 강한 이 norm bounds와 decrement가 필요하다.',
    symbols: [[String.raw`a,b,c>0`, 'Local 또는 claim domain에서 유효한 positive constants'], [String.raw`\lVert x\rVert`, 'Equilibrium에서의 state norm'], [String.raw`\Delta V_N^0`, 'Successor와 current optimal value의 차이'], [String.raw`V_N^0`, 'Finite-horizon optimal value']],
  }],
  evidence: [
    { label: 'Problem & existence', question: 'Online finite-horizon minimum은 언제 존재하며, 그 사실이 무엇까지 말하는가?', intervention: 'Finite N, continuous f·ℓ·F, compact U와 closed X·X_f에서 admissible sequence 집합 위 minimum 존재를 정리한다.', observation: 'Feasible x에 대해 optimizer가 달성되는 기본 조건을 얻지만 successor feasibility나 value decrease는 아직 얻지 못한다.', supports: 'Well-posed finite optimization과 closed-loop theorem을 서로 다른 proof obligation으로 분리해야 함을 지지한다.', limit: 'Minimum 존재는 recursive feasibility, uniqueness, deadline 내 계산 또는 stability를 입증하지 않는다.' },
    { label: 'A1-A4 theorem', question: 'Finite-horizon feasibility를 recursive feasibility와 asymptotic stability로 닫는 정확한 사슬은 무엇인가?', intervention: 'A1-A3로 shift-and-append candidate의 admissibility를 보이고, A4로 tail-cost bracket을 nonpositive하게 만든 뒤 next optimal value와 비교한다.', observation: 'X_N에서 nominal recursive feasibility를 얻고, positive-definite 또는 detectable stage cost와 continuity를 더하면 V_N^0의 Lyapunov decrease로 asymptotic stability를 얻는다.', supports: 'Terminal set·controller·cost가 각각 feasibility와 decrease에 맡는 역할, 그리고 충분조건의 논리 방향을 지지한다.', limit: 'A1-A4는 필요조건이 아니며 arbitrary initial state, disturbance, estimated-state feedback 또는 generic exponential stability를 입증하지 않는다.' },
    { label: 'Optimality boundary', question: 'Stable finite-horizon MPC는 원래 infinite-horizon cost에도 자동으로 optimal한가?', intervention: 'Finite-horizon terminal cost와 infinite-horizon tail의 관계, 그리고 A1-A4 아래 modified stage cost에 대한 inverse-optimality 결과를 구분한다.', observation: 'F가 terminal region의 true infinite-horizon value와 맞는 특별한 경우에는 exact equivalence가 가능하지만, 일반 구성은 더 큰 modified stage cost에 대한 optimality로 해석된다.', supports: 'Stable MPC라는 말과 original infinite-horizon problem의 exact optimizer라는 말을 분리해야 함을 지지한다.', limit: 'Arbitrary approximate F나 learned terminal value가 원래 infinite-horizon objective의 global optimality를 보장하지 않는다.' },
    { label: 'Evidence ceiling', question: '이 2000년 논문이 실제로 제시하는 증거의 상한은 어디인가?', intervention: 'Linear·nonlinear constrained regulation의 theorem과 기존 문헌을 survey하고 applications는 범위 밖에 두며 robust·tracking·output-feedback·adaptive MPC의 열린 문제를 명시한다.', observation: 'Nominal state-feedback stability theory는 성숙한 축으로 정리되지만 robustness 진전은 제한적이고 당시 robust feedback MPC는 복잡하며 adaptive constrained MPC에는 stabilizing 해가 없다고 평가한다.', supports: '원문은 이론·문헌 종합의 1차 출처이며 nominal guarantee와 당시 연구 경계를 입증한다.', limit: '단일 plant experiment, solver latency benchmark, RTI-SQP·explicit MPC·code generation·tube/chance constraints·learned-model deployment의 현대 성능을 입증하지 않는다.' },
  ],
  implementation: [
    '공통 theorem harness: 2-state discrete plant, X·U, N, ℓ, X_f·κ_f·F를 선언하고 grid 또는 polytope sample로 A1-A4를 각각 검사한다. X_N의 initial states에서 V_N^0, ℓ, candidate cost와 actual successor feasibility를 step별 저장한다.',
    '선형 MPC route: x^+=Ax+Bu, quadratic cost와 polyhedral constraints를 QP로 구성한다. Convex assumptions 아래 solver가 반환한 global optimum, primal residual, active constraints, solve time과 shifted warm start를 기록한다.',
    '비선형 MPC route: nonlinear f의 OCP를 NLP로 풀고 local solution임을 명시한다. 이전 plan을 shift해 warm-start하고, timeout 시에도 admissibility와 previous feasible sequence 대비 cost decrease를 확인한 경우에만 suboptimal-MPC theorem을 인용한다.',
    'Terminal ablation: X_f={0}, F=0인 terminal equality, X_f·κ_f·F 구성, terminal ingredient 없음의 세 경우에서 feasible region, first infeasible time, V_N^0 decrement와 closed-loop convergence를 비교한다.',
    'Robustness falsification: bounded model error나 disturbance를 주입해 nominal predicted margin과 actual constraint margin을 나란히 기록한다. Violation이 나오면 A1-A4 theorem이 틀린 것이 아니라 nominal plant contract를 벗어났다고 판정한다.',
    'Deployment extension: sample deadline, solver status·iterations·residuals, estimator timestamp, model·constraint version, predicted/actual margins와 backup action을 release log에 남긴다. 이는 필요한 engineering contract지만 Mayne et al.의 experiment evidence는 아니다.',
    '후대 관행 표시: RTI-SQP, explicit MPC, code generation, tube·chance constraints, learned terminal model과 runtime watchdog을 쓰면 각각 2000년 원문 이후의 solver·robustness·deployment extension으로 별도 인용한다.',
  ],
  assumptions: [
    'Core A1-A4 result는 prediction model과 plant가 일치하고 current full state가 알려진 discrete-time nominal regulation problem을 중심으로 한다.',
    'A1은 closed X_f⊆X와 0∈X_f, A2는 κ_f(x)∈U, A3는 f(x,κ_f(x))∈X_f, A4는 terminal decrease를 X_f 전체에서 요구한다.',
    'Minimum existence에는 finite N, continuous f·ℓ·F, compact U와 closed X·X_f가 사용되며, stability에는 value continuity와 positive-definite 또는 detectability 성질이 추가된다.',
    'Initial state는 X_N 안에 있고 매 solve에서 proof가 요구하는 optimal 또는 certificate-bearing feasible solution이 sampling deadline 전에 반환되어 적용된다고 가정한다.',
    'Exponential claim에는 V_N^0의 upper·lower norm bounds와 quadratic decrement가 별도로 필요하다.',
  ],
  failures: [
    'Feasible plan 하나를 찾았다는 사실만으로 successor feasibility를 주장하면 A2-A3의 shifted-tail proof가 빠진다.',
    'A1-A3만 만족하면 recursive feasibility는 가능해도 A4와 stage-cost 조건이 없어 convergence가 증명되지 않을 수 있다.',
    'Nonconvex nonlinear OCP의 local stationary point를 global optimum으로 부르거나 아무 feasible iterate에 optimal-MPC decrease를 적용하면 theorem contract가 깨진다.',
    'Slack penalty로 soft state constraint를 풀어 놓고 hard constraint guarantee라고 보고하면 violation의 의미가 바뀐다. Input constraint는 별도의 hard operational limit로 관리해야 한다.',
    'Estimated state, model mismatch와 disturbance를 nominal state-feedback theorem에 대입하면 predicted feasibility와 actual feasibility가 갈라질 수 있다.',
    'Solver deadline miss, stale estimate와 numerical residual을 숨기면 mathematical controller와 plant에 실제 적용된 controller가 달라진다.',
  ],
  legacy: '이 survey는 constrained MPC의 안정성 논의를 “optimizer를 반복 실행한다”에서 “feasible domain, shift 가능한 terminal tail, value decrease와 추가 regularity를 확인한다”로 닫았다. Linear QP는 convex global solve가 가능한 중요한 special case이고 nonlinear MPC는 nonconvex local solve와 certificate 문제가 남는다. 이후 robust, stochastic, economic, explicit, real-time iteration과 learning-based MPC가 확장됐지만 이 후대 관행은 원문의 theorem evidence와 분리해 인용해야 한다.',
  nextReading: 'Robot AI에서는 estimator가 current state와 uncertainty를 만들고 MPC가 reference·dynamics·constraints를 사용해 action을 낸다. 다음 글에서는 nominal full-state A1-A4 certificate를 실제 sensor delay, model version, actuator limit와 runtime fallback의 운영 계약으로 어떻게 내려보내는지 분리해 확인한다.',
  nextLinks: [
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Dynamics & Feedback Control', reason: 'Mayne의 nominal theorem을 actuator, sampling, solver deadline과 constraint margin이 있는 실제 feedback stack에 배치한다.' },
    { slug: 'rl-pomdp-state-estimation', label: 'POMDP & State Estimation', reason: 'Full-state theorem에서 숨긴 observation history, covariance와 stale-estimate 문제를 별도 information contract로 연다.' },
    { slug: 'rl-safe-constrained-learning', label: 'Safe & Constrained Learning', reason: 'Hard physical MPC constraint와 expected learned-policy constraint, runtime recovery의 책임을 분리한다.' },
  ],
  capabilities: [
    '전이 질문: Feasible optimal sequence와 successor state가 주어졌을 때 shifted candidate를 직접 쓰고, A2와 A3가 각각 어느 constraint를 닫는지 설명할 수 있는가?',
    '전이 질문: A1-A3는 성립하지만 A4가 실패하는 예에서 recursive feasibility와 asymptotic stability 중 무엇까지 남는지 판정할 수 있는가?',
    '전이 질문: Linear quadratic polyhedral problem과 nonlinear nonconvex problem을 받았을 때 QP global optimum claim과 NLP local-solution claim을 구분할 수 있는가?',
    '전이 질문: F가 단지 Lyapunov tail bound인 경우와 true infinite-horizon value인 경우를 나눠 original objective에 대한 exact optimality 여부를 판정할 수 있는가?',
    '전이 질문: Disturbance로 actual state가 predicted X_N 밖에 나간 log에서 theorem 오류, model-contract 위반과 solver 오류를 서로 구분할 수 있는가?',
    '전이 질문: Timeout에서 반환된 feasible iterate가 stability certificate를 유지하려면 previous feasible tail 대비 어떤 admissibility와 decrease 검사가 필요한지 말할 수 있는가?',
  ],
};
