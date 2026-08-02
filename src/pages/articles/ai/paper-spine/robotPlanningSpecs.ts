import type { PaperStudySpec } from './FoundationalPaperStudy';

const raw = String.raw;

export const lozanoPerezCspace1983Spec: PaperStudySpec = {
  shortTitle: 'Spatial Planning by Configuration Space',
  citation: 'T. Lozano-Perez - Spatial Planning: A Configuration Space Approach',
  yearVenue: '1983 · IEEE Transactions on Computers 32(2), 108-120',
  sourceUrl: 'https://lis.csail.mit.edu/pubs/tlp/spatial-planning.pdf',
  appendixUrl: 'https://people.csail.mit.edu/tlp/tlp-journals.html',
  before: 'Findspace와 Findpath는 움직이는 polygon 또는 polyhedron의 모든 point를 workspace obstacle과 계속 교차 검사해야 하는 geometric problem이었다. Translation, rotation과 articulated joints가 늘면 object-object intersection과 path search를 같은 표현에서 다루기 어려웠다.',
  authorIntent: 'Lozano-Perez는 rigid object의 모든 degrees of freedom을 configuration이라는 한 점의 좌표로 통합하고, 충돌을 만드는 configuration 전체를 configuration-space obstacle이라는 geometric object로 만들어 placement와 path 문제를 point search와 curve search로 환원하려 했다.',
  thesis: '움직이는 object A의 configuration space 안에 A가 obstacle B와 겹치는 모든 configuration CO_A(B)를 구성하면, exact rigid model 아래에서 workspace collision truth는 point membership으로 보존되고 safe motion은 forbidden set 밖의 연속 curve가 된다. 다만 workspace distance, dynamics와 timing까지 보존되는 것은 아니다.',
  readerBridge: [
    {
      term: 'Configuration',
      latex: raw`x\in\mathcal C_A`,
      plain: '로봇 몸체를 한 점으로 축소하는 것이 아니라, 그 몸체의 모든 point pose를 결정하는 자유도 값을 한 좌표 tuple로 묶는다. 이 글은 원 논문에 맞춰 x를 쓰고, 현대 로봇 코드와 뒤의 Viz가 쓰는 q도 같은 configuration 변수를 가리킨다.',
      role: 'Workspace의 extended body와 C-space의 point가 같은 physical placement를 가리키게 한다.',
    },
    {
      term: 'Collision preimage',
      latex: raw`\mathrm{CO}_A(B)`,
      plain: 'Workspace에서 A와 B가 겹치는 모든 placement를 configuration 좌표 쪽으로 역상처럼 모은 forbidden set이다.',
      role: '보존되는 것은 collision의 참·거짓이며 obstacle의 모양이나 거리 자체가 아니다.',
    },
    {
      term: 'Free-space path',
      latex: raw`\gamma:[0,1]\to\mathcal C_{\mathrm{free}}`,
      plain: '안전한 두 endpoint가 아니라 그 사이의 모든 configuration이 안전한 연속 curve다. Parameter는 진행 순서이지 아직 시간이 아니다.',
      role: 'Findpath를 workspace body sweep 대신 C-space connectivity 문제로 읽게 한다.',
    },
    {
      term: 'Representation boundary',
      latex: raw`d_{\mathcal C}\not\equiv d_{\mathrm{workspace}}`,
      plain: 'Reference point, coordinate chart와 metric 선택은 C-obstacle의 좌표 표현과 이웃 관계를 바꾸지만 exact collision equivalence는 바꾸지 않아야 한다.',
      role: 'C-space reduction이 clearance, dynamics, tracking accuracy까지 자동 보존한다는 과잉 일반화를 막는다.',
    },
  ],
  reconstruction: [
    { label: 'Object geometry', value: 'A, B_j, R', note: 'Moving body, obstacles, containing region' },
    { label: 'Configuration', value: 'x in Cspace_A', note: '모든 DOF를 한 point로 표현' },
    { label: 'Forbidden set', value: 'CO_A(B_j)', note: 'Object intersection을 point membership으로 환원' },
    { label: 'Findpath', value: 'safe curve s -> g', note: 'Free-space connectivity를 search' },
  ],
  mechanism: [
    '움직이는 object A의 reference vertex와 orientation을 정하고, 모든 point의 pose를 결정하는 독립 parameter를 configuration x로 묶는다.',
    'A의 모든 configuration이 놓이는 d-dimensional Cspace_A를 정의한다. 2D polygon은 translation 두 개와 rotation 하나, 3D polyhedron은 translation 세 개와 rotation 세 개가 필요하다.',
    '각 fixed obstacle B_j에 대해 (A)_x와 B_j가 겹치는 모든 x를 CO_A(B_j)로 정의한다.',
    'Workspace boundary R 안에 A 전체가 들어가는 configuration은 configuration-space interior CI_A(R)로 표현한다.',
    'Findspace는 모든 CO_A(B_j) 밖이면서 CI_A(R) 안인 point를 찾는 문제로 바뀐다.',
    'Findpath는 같은 free region에서 start와 goal을 잇는 connected sequence of configurations를 찾는 문제로 바뀐다.',
    'Fixed-orientation convex polygon case에서는 set sum으로 polygonal C-obstacle을 만들고, 서로 보이는 obstacle vertices와 start·goal을 연결한 visibility graph를 search할 수 있다.',
    'Rotation 또는 spatial motion이 추가된 high-dimensional C-space에서는 orientation slices와 projection/approximation을 사용하고, linked polyhedra로 industrial manipulator까지 확장한다.',
  ],
  equations: [{
    latex: raw`\underbrace{x\in\mathrm{CO}_A(B)}_{\text{C-space 금지점}}\quad\Longleftrightarrow\quad\underbrace{(A)_x\cap B\neq\varnothing}_{\text{workspace 몸체 충돌}}`,
    meaning: 'A를 configuration x에 놓았을 때 B와 겹친다는 collision truth가 C-space point membership으로 정확히 보존되는 중심 정의다. Rigid geometry와 configuration-to-pose map이 정확하다는 가정 아래의 equivalence이며, 두 공간의 distance나 dynamics가 같다는 뜻은 아니다.',
    symbols: [['\\mathrm{CO}_A(B)', 'B와 충돌시키는 A의 모든 configuration 집합'], ['A,B', '움직이는 rigid body와 고정 workspace obstacle'], ['x', 'A의 모든 relevant degrees of freedom을 정하는 configuration'], ['(A)_x', 'Configuration x에 배치된 A의 workspace point set']],
  }, {
    latex: raw`\underbrace{\mathcal C_{\mathrm{free}}}_{\text{안전 configuration 집합}}=\underbrace{\mathrm{CI}_A(R)}_{\text{workspace 안에 포함}}\setminus\underbrace{\bigcup_j\mathrm{CO}_A(B_j)}_{\text{모든 충돌 configuration}}`,
    latexCompact: raw`\begin{gathered}
\underbrace{\mathcal C_{\mathrm{free}}}_{\text{안전한 자세 집합}}\\[3pt]
=\underbrace{\mathrm{CI}_A(R)}_{\text{영역 안의 자세}}\setminus
\underbrace{\bigcup_j\mathrm{CO}_A(B_j)}_{\text{충돌 자세}}
\end{gathered}`,
    meaning: '안전성에는 obstacle 비충돌뿐 아니라 containing region R 안에 A 전체가 들어간다는 조건도 필요하다. 표현은 extended-body containment와 collision을 set difference 하나로 바꾸지만, model uncertainty에 대한 safety margin은 원 식에 포함하지 않는다.',
    symbols: [['\\mathcal C_{\\mathrm{free}}', 'Findspace와 Findpath가 탐색할 허용 configuration set'], ['\\mathrm{CI}_A(R)', 'A 전체가 containing region R 안에 놓이는 configurations'], ['\\bigcup_j\\mathrm{CO}_A(B_j)', '모든 fixed obstacles가 만드는 forbidden set의 합집합'], ['\\setminus', '허용 set에서 forbidden configurations를 제거하는 set difference']],
  }, {
    latex: raw`\underbrace{\gamma:[0,1]\to\mathcal C_{\mathrm{free}}}_{\text{연속 free-space curve}},\qquad\underbrace{\gamma(0)=s,\ \gamma(1)=g}_{\text{start와 goal}}`,
    meaning: 'Safe path는 endpoint 두 개의 validity가 아니라 모든 path parameter에서 C-free에 머무는 연속 curve다. t는 시간 변수가 아니므로 velocity, acceleration, torque 또는 controller tracking은 이 식이 입증하지 않는다.',
    symbols: [['\\gamma', 'Start에서 goal로 이어지는 configuration-space path'], ['[0,1]', '시간이 아닌 path ordering을 위한 parameter interval'], ['s,g', 'Collision-free start와 goal configurations'], ['\\mathcal C_{\\mathrm{free}}', 'Path 전체가 머물러야 하는 free set']],
  }, {
    latex: raw`\underbrace{\mathrm{CO}^{xy}_A(B)}_{\text{translation C-obstacle}}=\underbrace{B\oplus(-A_0)}_{\text{장애물과 반사 body의 set sum}}\qquad\underbrace{\theta=\theta_0}_{\text{orientation 고정}}`,
    meaning: 'Orientation이 고정된 translating body에서는 obstacle에 reference point 기준으로 반사한 A를 Minkowski sum해 forbidden translation region을 구성할 수 있다. Reference point를 바꾸면 이 region의 좌표 위치는 평행 이동하지만 collision equivalence는 보존된다. Rotation과 articulation이 있는 일반식으로 그대로 쓰면 안 된다.',
    symbols: [['\\mathrm{CO}^{xy}_A(B)', '고정 orientation에서 reference point translation의 forbidden region'], ['\\oplus', '두 point set의 모든 vector sum을 모으는 Minkowski sum'], ['-A_0', '선택한 reference point와 고정 orientation에서 반사한 body geometry'], ['\\theta=\\theta_0', '이 constructive formula를 translation-only로 제한하는 가정']],
  }],
  evidence: [
    {
      label: 'Geometric reduction',
      question: 'Robot reference point를 옮겨 C-obstacle 그림이 평행 이동해도 어떤 명제는 반드시 그대로여야 하고, workspace clearance와 shortest-path length도 보존되는가?',
      intervention: '같은 rigid placement를 두 reference-point 좌표로 표현하고 각각 CO_A(B)를 구성한 뒤 workspace intersection truth table, C-space distance와 path length를 따로 비교한다.',
      observation: '각 좌표에서 x in CO_A(B)와 (A)_x intersection B의 참·거짓은 일치하지만 C-obstacle 좌표와 metric-dependent length는 달라질 수 있다.',
      supports: 'Configuration-space obstacle이 보존하는 핵심이 exact collision predicate와 free-space connectivity라는 중심 reduction을 지지한다.',
      limit: '1983 paper는 coordinate choice가 만든 모든 metric distortion, uncertainty-aware clearance 또는 execution robustness를 정리하지 않는다.',
    },
    {
      label: 'Constructive cases',
      question: 'Translation-only Minkowski construction을 rotating body나 articulated arm에 그대로 적용하면 어떤 configuration dimension과 topology가 사라지는가?',
      intervention: 'Paper의 fixed-orientation polygon set-sum construction과 rotating polygon·polyhedron의 orientation slices, linked-polyhedra extension을 나란히 재구성한다.',
      observation: '2D translation에서는 expanded polygonal C-obstacle을 exact하게 만들 수 있지만 rotation과 articulation은 추가 coordinates, slices와 projection/approximation을 요구한다.',
      supports: 'C-space가 단순 비유가 아니라 계산 가능한 geometric construction이라는 점을 지지한다.',
      limit: '원 논문의 증거 ceiling은 polygon/polyhedron constructions와 industrial-robot extension이다. Modern high-DOF implicit collision-query planner의 runtime, uncertainty와 dynamic feasibility는 입증하지 않는다.',
    },
    {
      label: 'Visibility path',
      question: 'Exact 2D visibility shortest path가 obstacle boundary를 스칠 때 attached-object geometry를 epsilon만큼 키우면 feasibility와 optimality 중 무엇이 먼저 무너지는가?',
      intervention: 'Start, goal과 visible C-obstacle vertices로 만든 shortest graph path를 원 geometry와 epsilon-inflated moving body에서 각각 collision 검사한다.',
      observation: '원 exact model의 piecewise-linear shortest path는 C-obstacle vertices를 지나지만 작은 geometry 변화 뒤에는 같은 route가 colliding이 되어 feasibility부터 잃을 수 있다.',
      supports: 'Geometry construction과 graph search를 분리하는 두 단계 architecture를 지지한다.',
      limit: 'Shortest path가 obstacle boundary를 스치므로 model 또는 motion error에 취약하고, 같은 visibility result가 3D optimality로 일반화되지 않는다고 paper가 직접 경고한다.',
    },
  ],
  implementation: [
    'Translating rectangle A와 polygon obstacle B를 정의하고 A의 reference point, configuration chart와 fixed-orientation convention을 기록한다.',
    '두 reference points에서 B와 reflected -A의 Minkowski sum을 계산하고 C-obstacle 좌표가 이동해도 workspace collision truth table은 같은지 검증한다.',
    'Start와 goal, C-obstacle vertices 사이의 visible edges를 collision check해 visibility graph를 만든다.',
    'Dijkstra 또는 A-star로 shortest graph path를 구하고 모든 edge가 C-obstacle interior를 통과하지 않는지 재검증한다.',
    'Obstacle geometry를 작은 epsilon만큼 perturb해 boundary-touching shortest path가 collision로 바뀌는지 확인한다.',
    '2R arm에서는 joint-angle grid와 wrapped topology를 사용해 FK collision callback으로 implicit C-obstacle을 그리고, 같은 physical pose가 chart 경계에서 끊겨 보이는 failure를 재현한다.',
  ],
  assumptions: [
    'Moving objects가 rigid하여 적은 수의 configuration parameter가 모든 point pose를 결정한다.',
    'Objects가 solid하며 overlapping point가 collision이라는 geometric rule을 따른다.',
    'Workspace obstacle geometry와 moving-object geometry를 충분히 정확하게 안다.',
    'Path를 따라 commanded configuration을 충분히 정확하게 실현할 수 있다.',
    'Selected configuration coordinates가 relevant degrees of freedom과 circle/product topology를 올바르게 표현한다.',
  ],
  failures: [
    'Rotation과 articulation이 추가되면 C-space dimension과 obstacle geometry complexity가 크게 증가한다.',
    'Euler-angle coordinate chart와 cut boundary는 physical topology를 왜곡할 수 있다.',
    'Exact shortest visibility path는 clearance가 0이라 작은 model 또는 tracking error에도 collision이 된다.',
    'Geometric free path가 velocity, acceleration, torque, nonholonomic 또는 dynamic constraints를 자동으로 만족하지 않는다.',
    'Unknown·moving obstacles와 perception uncertainty는 static exact C-obstacle만으로 처리되지 않는다.',
  ],
  legacy: '원 논문이 직접 세운 범위는 rigid polygon·polyhedron의 C-obstacle construction, Findspace/Findpath reduction, fixed-orientation visibility planning과 higher-dimensional slice·linked-body extension이다. 이후의 modern practice는 이 collision equivalence를 유지하되 C-obstacle 전체를 explicit polygon/polyhedron으로 materialize하지 않고 StateValid(q), MotionValid(q_a,q_b), topology-aware distance와 local planner callback으로 C_free를 implicit하게 질의한다. PRM, RRT, trajectory optimization, uncertainty margin과 execution revalidation은 이 paper 이후의 층이며 원 결과로 소급하지 않는다.',
  nextReading: 'Lozano-Perez가 무엇을 search해야 하는지 C-space로 정의했다면, Kavraki 등은 high-dimensional C_free를 정확히 전부 구성하지 않고 collision-free samples와 local paths로 reusable graph를 근사했다. 다음 글에서는 그 learning/query 분해와 좁은 통로 실패를 복원한다.',
  nextLinks: [
    { slug: 'paper-kavraki-prm-1996', label: 'Kavraki et al. 1996 · Probabilistic Roadmap', reason: 'Explicit C-obstacle construction을 sampling, local planner와 reusable connectivity graph로 바꾸는 다음 원 논문' },
  ],
  capabilities: [
    'Workspace collision truth와 connectivity는 보존되지만 geometry shape, metric, timing과 dynamics는 자동 보존되지 않음을 구분한다.',
    'Safe endpoint와 safe path의 논리적 차이를 원 논문의 Findspace/Findpath 정의로 설명한다.',
    'Reference point를 바꾸거나 rotation DOF를 추가했을 때 fixed-orientation Minkowski construction을 다시 유도하고 적용 경계를 찾는다.',
    'Visibility shortest path의 optimality와 zero-clearance 취약성을 함께 말한다.',
  ],
};

export const kavrakiPrm1996Spec: PaperStudySpec = {
  shortTitle: 'Probabilistic Roadmaps for High-Dimensional C-Space',
  citation: 'L. E. Kavraki, P. Svestka, J.-C. Latombe, M. H. Overmars - Probabilistic Roadmaps for Path Planning in High-Dimensional Configuration Spaces',
  yearVenue: '1996 · IEEE Transactions on Robotics and Automation 12(4), 566-580',
  sourceUrl: 'https://www.kavrakilab.org/publications/kavraki-svestka1996probabilistic-roadmaps-for.pdf',
  appendixUrl: 'https://www.kavrakilab.org/publications/kavraki-svestka1996probabilistic-roadmaps-for.html',
  before: 'Exact C-space obstacle construction과 fixed grids는 articulated robot의 dimension이 늘 때 geometry, memory와 search cost가 급증했다. 그러나 static workspace에서는 한 번 비싼 free-space structure를 학습해 여러 start-goal query에 재사용할 수 있었다.',
  authorIntent: 'Kavraki와 공동 저자들은 C_free를 완전히 계산하지 않고 collision-free configurations와 빠른 local planner가 검증한 paths만 sample해, high-dimensional holonomic robot에도 general하고 구현 가능한 reusable roadmap method를 만들려 했다.',
  thesis: 'Learning phase에서 collision-free configurations를 graph nodes로, simple local planner가 검증한 paths를 edges로 저장하면 static scene의 connectivity work를 여러 query에 재사용할 수 있다. 이 1996 paper의 핵심 증거는 algorithm structure와 experiments이며, robust path·sampling support·local connection을 전제로 한 asymptotic failure bound는 later analysis의 조건부 결과다.',
  readerBridge: [
    {
      term: 'Milestone sample',
      latex: raw`q_i\sim\mu,\quad q_i\in\mathcal C_{\mathrm{free}}`,
      plain: 'Free space 전체를 격자로 만들지 않고 sampler가 뽑은 collision-free configuration 일부만 graph vertex로 보관한다.',
      role: 'Roadmap이 C-free 자체가 아니라 sampling policy가 관찰한 유한한 connectivity approximation임을 고정한다.',
    },
    {
      term: 'Local planner',
      latex: raw`L(q_i,q_j)`,
      plain: '가까운 두 samples 사이의 continuous candidate motion을 만들고 전 구간 collision 여부를 판정하는 robot-specific procedure다.',
      role: 'Node validity와 edge validity를 분리하고, metric상 가까움만으로 edge가 생기지 않게 한다.',
    },
    {
      term: 'Learning/query split',
      latex: raw`s\to G\to g`,
      plain: 'Static robot-scene pair의 roadmap은 미리 만들고, 매 query에는 start·goal connector와 graph search를 수행한다.',
      role: 'Offline construction cost, endpoint failure와 repeated-query latency를 서로 다른 계정으로 읽게 한다.',
    },
    {
      term: 'Probabilistic completeness',
      latex: raw`\Pr[\mathrm{failure}_n\mid\gamma_\delta]\to0`,
      plain: 'Positive-clearance path와 그 주변을 실제로 뽑는 sampler, nearby samples를 잇는 local planner 같은 조건 아래 sample 수가 무한히 늘 때 실패확률이 0으로 가는 asymptotic 문장이다.',
      role: 'Finite deadline success, shortest path, dynamics를 보장한다는 오독과 1996 experiments를 later theorem으로 소급하는 오독을 함께 막는다.',
    },
  ],
  reconstruction: [
    { label: 'Sample free C-space', value: 'N = {q_i}', note: 'Collision-free milestones' },
    { label: 'Local connection', value: 'L(q_i,q_j)', note: 'Fast feasible edge test' },
    { label: 'Store roadmap', value: 'G = (N,E)', note: 'Static scene의 reusable graph' },
    { label: 'Answer query', value: 's -> G -> g', note: 'Connect endpoints and search' },
  ],
  mechanism: [
    'Static robot-workspace scene과 configuration-space distance, collision checker, local planner, construction time 같은 parameters를 고정한다.',
    'Configuration space에서 random candidates를 생성하고 collision-free인 candidates만 roadmap milestones로 받아들인다.',
    '새 milestone과 metric상 가까운 기존 milestones 중 useful connection candidates를 선택한다.',
    'Simple local planner가 두 milestones 사이 path를 생성하고 그 path가 collision-free일 때 graph edge를 추가한다.',
    'Roadmap connected components를 추적해 이미 연결된 pairs에 불필요한 local-planner work를 줄이고 free-space connectivity coverage를 넓힌다.',
    'Uniform construction만으로 드물게 방문하는 difficult regions를 보강하기 위해 connection failure가 많은 nodes 주변으로 expansion sampling을 집중한다.',
    'Query start와 goal의 validity를 검사하고 각각 roadmap의 reachable milestones에 local path로 연결한다.',
    'Augmented roadmap에서 graph search를 실행하고 node sequence와 local paths를 하나의 collision-free path로 조립한다.',
  ],
  equations: [{
    latex: raw`\underbrace{G=(N,E)}_{\text{재사용 roadmap}},\qquad\underbrace{N=\{q_i:q_i\sim\mu,\ q_i\in\mathcal C_{\mathrm{free}}\}}_{\text{검증된 free samples}}`,
    meaning: 'Roadmap nodes는 sampler mu가 제안하고 state collision checker가 받아들인 milestones다. G는 C-free 전체가 아니라 finite sampling과 connection policy가 관찰한 connectivity 일부를 저장하므로 sample count와 support를 함께 기록해야 한다.',
    symbols: [['G', '고정 robot-scene pair에서 재사용할 roadmap graph'], ['N,E', 'Collision-free milestones와 검증된 local-path edges'], ['\\mu', 'Configuration candidates를 생성하는 sampling distribution'], ['\\mathcal C_{\\mathrm{free}}', 'Static collision model 아래의 free configurations']],
  }, {
    latex: raw`\underbrace{(q_i,q_j)\in E}_{\text{roadmap edge}}\quad\Longrightarrow\quad\underbrace{\forall u\in[0,1],\ L(q_i,q_j;u)\in\mathcal C_{\mathrm{free}}}_{\text{local path 전체 검증}}`,
    meaning: 'Stored edge는 local planner가 만든 continuous path 전체가 free라는 contract를 가져야 한다. 역은 성립하지 않는다. Feasible connection이어도 neighbor policy가 pair를 후보로 고르지 않으면 E에 들어가지 않을 수 있다.',
    symbols: [['q_i,q_j', 'Roadmap의 두 collision-free milestones'], ['L(q_i,q_j;u)', '두 nodes 사이 local candidate path의 중간 configuration'], ['u', 'Edge interpolation parameter'], ['\\Longrightarrow', 'Stored edge validity만 요구하며 모든 feasible pair 저장을 뜻하지 않음']],
  }, {
    latex: raw`\underbrace{\gamma_{\mathrm{query}}}_{\text{최종 geometric path}}=\underbrace{L(s,n_s)}_{\text{start 연결}}\oplus\underbrace{\operatorname{Search}_G(n_s,n_g)}_{\text{roadmap search}}\oplus\underbrace{L(n_g,g)}_{\text{goal 연결}}`,
    meaning: 'Query answer는 endpoint connectors와 roadmap 내부 graph path를 순서대로 이어 만든다. Start 또는 goal connector가 없으면 내부 graph가 잘 연결되어 있어도 실패하며, 결과에는 아직 timing이나 dynamics가 없다.',
    symbols: [['s,g', '이번 query의 collision-free start와 goal'], ['n_s,n_g', '각 endpoint가 local planner로 연결된 roadmap milestones'], ['\\oplus', 'Validated local path segments의 ordered concatenation'], ['\\operatorname{Search}_G', 'Stored edge costs 위 graph search']],
  }, {
    latex: raw`\underbrace{\Pr[\mathrm{PRM}_n\ \mathrm{fails}\mid\exists\gamma_\delta]}_{\text{조건부 실패확률}}\xrightarrow[n\to\infty]{}0\quad\underbrace{\delta>0,\ \mu(B)>0,\ L\ \mathrm{connects\ nearby\ samples}}_{\text{robust path·sampling·local planner 조건}}`,
    latexCompact: raw`\begin{gathered}
\underbrace{\Pr[\mathrm{PRM}_n\text{ fails}\mid\exists\gamma_\delta]}_{\text{조건부 실패확률}}
\xrightarrow[n\to\infty]{}0\\[4pt]
\underbrace{\delta>0}_{\text{positive-clearance path}},\quad
\underbrace{\mu(B)>0}_{\text{sampler support}}\\[3pt]
\underbrace{L\text{ connects nearby samples}}_{\text{local planner 조건}}
\end{gathered}`,
    meaning: '이 식은 1996 experiments의 직접 결론이 아니라 이후 formal analysis를 요약한 probabilistic-completeness contract다. Positive-clearance path gamma_delta, relevant neighborhoods에 positive probability를 주는 sampler, nearby free samples를 연결하는 local planner와 correct validity tests가 필요하다. 유한 n의 성공, deadline, shortest path 또는 moving-scene validity는 보장하지 않는다.',
    symbols: [['\\mathrm{PRM}_n', 'n개 accepted milestones까지 성장한 roadmap procedure'], ['\\gamma_\\delta', 'C-obstacles에서 최소 positive clearance delta를 가진 feasible path'], ['\\mu(B)>0', 'Path를 덮는 relevant neighborhood B가 sampler support 안에 있다는 조건'], ['L', '충분히 가까운 samples를 free local path로 연결할 수 있는 planner']],
  }],
  evidence: [
    {
      label: 'Learning/query split',
      question: '같은 workspace에서 start·goal만 바뀔 때 construction collision checks와 query connector checks를 따로 계측하면 어느 계산이 실제로 재사용되는가?',
      intervention: 'Collision-free nodes와 feasible local paths를 learning phase에서 roadmap으로 저장하고, 여러 query에는 endpoint connection과 graph search만 수행한다.',
      observation: '원 paper의 planar articulated-robot experiments에서는 수십 초 수준의 learning 뒤 당시 약 150 MIPS workstation에서 query path planning이 1초의 일부에 수행되었다고 보고한다.',
      supports: 'Offline roadmap construction이 repeated-query latency를 낮출 수 있다는 중심 systems claim을 지지한다.',
      limit: 'Absolute runtime은 1996 hardware와 scenes에 묶이며 roadmap reuse는 robot geometry 또는 static workspace가 변하면 무효화될 수 있다.',
    },
    {
      label: 'High-dimensional use',
      question: '같은 physical arm pose가 angle-chart 양끝에 놓일 때 naive Euclidean metric과 wrapped metric은 neighbor set, connector success와 component count를 어떻게 바꾸는가?',
      intervention: 'Explicit C-obstacle construction 대신 robot-specific collision test, topology-aware metric과 simple local planner를 이용해 동일한 samples의 neighbor graph를 두 metric으로 비교한다.',
      observation: '원 paper는 many-degree-of-freedom planar articulated robot scenes에서 roadmap construction과 query를 실험해 callback-based formulation의 practical reach를 보인다.',
      supports: 'Sampling과 local callback 분리가 high-dimensional geometry에 practical route를 제공한다는 주장을 지지한다.',
      limit: '특정 wrapped-metric transfer 결과와 modern benchmark는 재현에서 확인할 사항이다. 원 증거 ceiling은 static known scenes의 holonomic planar articulated-robot experiments이며 nonholonomic·kinodynamic constraints, moving obstacles와 feedback execution은 평가하지 않는다.',
    },
    {
      label: 'Difficult regions',
      question: 'Positive-clearance path가 있어도 sampler가 passage neighborhood에 zero mass를 주거나 local planner range가 cover-ball 간격보다 짧으면 sample 수만 늘려 실패확률이 0으로 가는가?',
      intervention: '동일한 narrow passage에서 sampling support, connection radius와 edge checker를 하나씩 깨뜨리고 uniform construction·expansion 결과를 비교한다.',
      observation: '1996 method의 difficult-region expansion은 connection failure가 잦은 milestones 주변에 computation을 더 배분하지만, original experiments만으로 모든 sampler·connector에 대한 asymptotic theorem을 주지는 않는다.',
      supports: 'Sampling budget과 local connectivity policy를 함께 설계해야 roadmap이 passage connectivity를 포착한다는 algorithmic claim을 지지한다.',
      limit: 'General probabilistic-completeness statement는 robust path의 clearance·length, independent sampling과 local connection을 명시한 1996 conference/1998 journal follow-up analysis의 층이다. Original roadmap paper의 empirical evidence로 finite deadline이나 arbitrary sampler guarantee를 주장할 수 없다.',
    },
  ],
  implementation: [
    'Robot joint bounds, continuous-angle topology, fixed planning-scene version, collision geometry, sampler support와 deterministic random seed를 기록한다.',
    'StateValid(q), configuration metric d와 local planner L을 독립 함수로 구현하고 각각 단위 테스트한다.',
    'N random candidates 중 accepted free nodes, rejected collision nodes와 state-check runtime을 기록한다.',
    '각 새 node의 k-nearest 또는 radius neighbors에 local planner를 적용하고 considered pair, accepted/rejected edge 수와 collision checks를 분리해 기록한다.',
    'Roadmap connected components와 narrow passage coverage를 시각화한 뒤 start/goal connectors를 별도로 검증한다.',
    'Dijkstra/A-star로 query path를 찾고 concatenated local paths 전체를 고해상도로 재검증한다.',
    'Positive-clearance passage를 둔 scene에서 node count, sampler support, neighbor radius, metric scale와 edge resolution을 sweep해 finite-run failure rate가 어떤 조건에서만 감소하는지 비교한다.',
  ],
  assumptions: [
    'Workspace와 robot collision geometry가 roadmap learning과 query 사이에 static하다.',
    'Holonomic geometric planning 문제여서 nearby configurations를 simple local path로 직접 연결할 수 있다.',
    'State collision checker와 local planner가 path feasibility를 올바르게 판정한다.',
    'Probabilistic-completeness 해석에는 relevant path neighborhood가 sampler support 안에 있고 independent samples가 positive probability로 그곳을 방문한다.',
    'Feasible query에는 local planner가 연결할 수 있는 간격으로 덮이는 positive-clearance path와 start·goal connectors가 존재한다.',
    'Configuration metric과 neighbor parameters가 robot topology와 scene scale에 적절하다.',
  ],
  failures: [
    'Narrow passage의 free volume이 작으면 필요한 nodes와 cross-passage edge를 오랫동안 얻지 못한다.',
    'Start 또는 goal을 roadmap에 연결하지 못하면 내부 roadmap path가 있어도 query는 실패한다.',
    'Coarse local collision checking은 실제 colliding edge를 graph에 넣고 false solution을 만든다.',
    '잘못된 angle wrap 또는 DOF scale은 useful neighbors를 배제하고 graph quality를 무너뜨린다.',
    'Scene이나 attached object가 바뀌면 stored edges의 validity를 재검사하거나 roadmap을 다시 만들어야 한다.',
    '기본 PRM의 first feasible path는 shortest 또는 maximum-clearance path를 보장하지 않는다.',
  ],
  legacy: '1996 원 논문이 직접 남긴 것은 static known workspace에서 collision-free milestones, simple local planner, connected components, expansion과 learning/query split을 결합한 general holonomic method 및 planar articulated-robot experiments다. 1996 conference와 1998 journal의 later analysis는 postulated path의 length·obstacle clearance·roadmap node count에 따른 failure-probability bounds를 별도로 전개했다. 그 뒤의 modern practice인 LazyPRM은 candidate solution에 필요한 edge validation을 늦추고, PRM*는 성장하는 connection policy로 asymptotic optimality를 목표로 하며 sparse roadmaps는 graph size를 관리한다. 이들은 원 paper의 실험 결과가 아니며 collision model, topology-aware metric, local planner, scene invalidation과 termination budget은 여전히 application 책임이다.',
  nextReading: 'PRM이 static free space의 reusable graph를 먼저 만든다면, LaValle의 RRT는 한 start에서 random targets 쪽으로 tree를 조금씩 확장해 큰 unexplored region을 빠르게 채운다. Concept 글의 RRT bridge 다음에는 dynamics와 control propagation을 포함한 kinodynamic planning으로 이어진다.',
  nextLinks: [
    { slug: 'robot-motion-planning', label: 'Modern Robot Motion Planning', reason: 'LazyPRM·PRM*·RRT와 collision checking, scene revalidation, time-parameterization 책임을 original evidence와 분리해 연결' },
  ],
  capabilities: [
    'PRM learning phase와 query phase의 계산·재사용 책임을 구분한다.',
    'Node validity, candidate neighbor selection, edge local-planner validity와 endpoint connector를 별도 failure surface로 진단한다.',
    'Sampler support 또는 local connection 조건을 깨뜨린 narrow-passage counterexample으로 sample 수 증가만으로 충분하지 않음을 보인다.',
    '1996 algorithm·experiments, later probabilistic-completeness analysis, LazyPRM·PRM* modern practice를 서로 다른 evidence layer로 설명한다.',
  ],
};
