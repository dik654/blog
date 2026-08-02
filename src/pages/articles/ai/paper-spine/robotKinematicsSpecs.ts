import type { PaperStudySpec } from './FoundationalPaperStudy';

const raw = String.raw;

export const denavitHartenberg1955Spec: PaperStudySpec = {
  shortTitle: 'Denavit-Hartenberg Kinematic Notation',
  citation: 'J. Denavit, R. S. Hartenberg - A Kinematic Notation for Lower-Pair Mechanisms Based on Matrices',
  yearVenue: '1955 · Journal of Applied Mechanics 22',
  sourceUrl: 'https://doi.org/10.1115/1.4011045',
  appendixUrl: 'https://hdl.handle.net/1813/58640',
  before: 'Reuleaux의 contracted formula는 pair의 종류와 연결 순서를 간결하게 적었지만 spatial mechanism을 방정식으로 재구성하는 데 필요한 축 사이 거리·각도와 pair variable을 모두 담지 못했다. Perspective drawing만으로는 공간 chain의 geometry와 closure를 모호함 없이 전달하기도 어려웠다.',
  authorIntent: 'Denavit와 Hartenberg는 rigid lower-pair mechanism의 연속 pair axes 사이 geometry와 relative motion을 하나의 quantitative symbolic notation에 넣고, closed chain을 matrix equation으로 바꾸려 했다. 역사적 범위의 lower pair에는 revolute·prismatic·screw뿐 아니라 2-DOF cylindrical과 3-DOF spheric·planar pair도 포함되며, 후자는 여러 pair variable 또는 one-DOF primitive의 결합으로 읽어야 한다.',
  thesis: 'Successive pair axes와 그 common perpendicular가 frame을 구속하면 adjacent coordinate change에는 여섯 값이 아니라 네 독립 parameter만 남는다. 각 local matrix를 chain 순서로 곱하면 원 논문의 closed-loop closure equation을 얻고, 이 구조가 훗날 open-chain robot forward kinematics로 옮겨졌다.',
  readerBridge: [
    { term: 'Kinematic pair', latex: raw`R,\ P,\ S_L,\ C,\ G,\ F`, plain: '두 rigid link 사이에 허용된 상대 motion의 종류다. Joint의 물리적 외형이 아니라 motion constraint를 분류한다.', role: '원문의 all lower-pair 범위와 현대 robot에서 주로 쓰는 one-DOF R·P subset을 구분한다.' },
    { term: 'Pair axis', latex: raw`z_i`, plain: '회전하거나 미끄러지는 screw motion의 기준선이다. Consecutive pair axes의 위치와 방향이 link geometry를 정한다.', role: '각 z-axis를 단순 frame 장식이 아니라 pair motion의 물리 기준으로 읽게 한다.' },
    { term: 'Common perpendicular', latex: raw`x_{i+1}`, plain: 'Consecutive axes에 모두 직교하는 선이며 두 축 사이의 signed distance와 twist를 측정한다.', role: '왜 special frame에는 네 parameter만 남는지와 parallel-axis 비유일성을 함께 설명한다.' },
    { term: 'Closure equation', latex: raw`M_1M_2\cdots M_n=I`, plain: 'Closed chain을 한 바퀴 따라 coordinate change를 합성하면 출발 frame으로 돌아와야 한다.', role: '1955년 원문의 중심 산출물과 현대 open-chain endpoint transform을 혼동하지 않게 한다.' },
  ],
  reconstruction: [
    { label: 'Pair sequence', value: 'R · P · S_L · C · G · F', note: 'Pair 종류·순서에 quantitative geometry를 더한다' },
    { label: 'Pair axes', latex: raw`z_i,\ z_{i+1}`, note: 'Consecutive lower-pair axes를 먼저 고정한다' },
    { label: 'Link geometry', latex: raw`x_{i+1},\ a_i,\ \alpha_i`, note: 'Common perpendicular가 distance와 twist를 운반한다' },
    { label: 'Loop equation', latex: raw`M_1M_2\cdots M_n=I`, note: 'Local coordinate changes를 closure constraint로 합성한다' },
  ],
  mechanism: [
    'Closed kinematic chain의 links와 pairs를 순서화하고 각 revolute·prismatic·screw pair의 motion axis를 z_i로 둔다.',
    'Consecutive axes z_i와 z_(i+1)을 잇는 common perpendicular를 x_(i+1)로 잡고, 각 축과 common perpendicular의 교점으로 frame origins를 정한다.',
    'a_i는 x_(i+1)을 따른 두 pair axes 사이 signed distance이고 alpha_i는 x_(i+1) 주위에서 z_i에서 z_(i+1)로 가는 twist다.',
    's_i는 z_i를 따른 successive common perpendicular 사이 offset이고 theta_i는 z_i 주위에서 x_i에서 x_(i+1)로 가는 angle이다.',
    'Revolute에서는 theta_i, prismatic에서는 s_i가 변한다. Screw에서는 두 값이 lead로 결합하고 cylindrical·spheric·planar pair에는 각각 2·3·3개의 pair variable이 필요하다.',
    '1955년 표기는 z_i screw와 x_(i+1) screw를 local matrix M_(i+1)로 만들며 alpha의 부호는 암묵적 left-handed convention을 썼다.',
    'Local matrices를 closed chain 한 바퀴 순서대로 곱해 identity가 되는 constraint를 세운다. Base-to-tool open-chain product는 이 closure 구조의 후대 robot-kinematics handoff다.',
  ],
  equations: [{
    latex: raw`\underbrace{M_1M_2\cdots M_n}_{\text{closed chain 한 바퀴의 coordinate change}}=\underbrace{I}_{\text{출발 frame으로 복귀}}`,
    provenance: 'Denavit & Hartenberg 1955 · closed-chain closure 식',
    meaning: '1955년 논문의 중심 계산 계약은 open-chain tool pose가 아니라 closed lower-pair chain의 closure다. Matrix order는 chain traversal order이며, identity에서 얻은 scalar equations가 pair variables 사이의 displacement constraints가 된다.',
    symbols: [[raw`M_i`, 'Successive link coordinate systems 사이의 4x4 change-of-coordinates matrix'], [raw`I`, '한 바퀴 뒤 같은 coordinate system으로 돌아왔음을 나타내는 identity'], [raw`n`, 'Closed chain에서 순회한 pair 또는 local transform 수']],
  }, {
    latex: raw`\underbrace{H_i\in z_i\cap x_{i+1},\qquad z_i\perp x_{i+1}}_{\text{adjacent frame에 건 두 geometric constraints}}\Longrightarrow\underbrace{6-2=4}_{\text{남는 독립 parameter}}`,
    provenance: 'Denavit & Hartenberg 1955 · four-parameter frame construction을 설명용으로 재구성',
    meaning: 'Arbitrary relative frame pose에는 여섯 값이 필요하지만 D-H frame은 z_i와 x_(i+1)이 만나고 직교하도록 제한된다. 네 parameter는 물리적 자유도를 버린 결과가 아니라 두 frame-choice freedoms를 geometry에 고정한 결과다.',
    symbols: [[raw`H_i`, 'Pair axis z_i와 다음 common perpendicular의 교점'], [raw`z_i`, 'Pair motion axis'], [raw`x_{i+1}`, 'z_i와 z_(i+1)의 common perpendicular'], [raw`6-2`, 'General frame pose의 여섯 값에서 두 frame constraints를 뺀 수']],
  }, {
    latex: raw`\underbrace{M_{i+1}^{(1955)}}_{\text{homogeneous coordinate가 첫 성분}}=\underbrace{Z_i(\theta_i,s_i)}_{\text{pair-axis screw}}\underbrace{X_{i+1}(a_i,\alpha_i^{\mathrm{LH}})}_{\text{common-normal screw}}`,
    provenance: 'Denavit & Hartenberg 1955 · original matrix convention을 factorization으로 재표기',
    meaning: '원 논문은 [1,x,y,z]^T 배열의 coordinate-change matrix와 암묵적 left-handed alpha 부호를 썼다. 따라서 현대 column-vector SE(3) matrix의 last row 검사나 right-handed alpha를 원문 인쇄식에 그대로 대입하면 안 된다.',
    symbols: [[raw`Z_i`, 'z_i 주위 theta_i rotation과 z_i 방향 s_i translation'], [raw`X_{i+1}`, 'x_(i+1) 방향 a_i translation과 그 축 주위 alpha_i twist'], [raw`\alpha_i^{\mathrm{LH}}`, '1955년 도해와 matrix가 사용한 left-handed twist measurement']],
  }, {
    latex: raw`\begin{gathered}
\underbrace{{}^{i}T_{i+1}}_{\text{1964 우수 좌표 변환}}
=\underbrace{R_z(\theta_i)D_z(s_i)}_{\text{z}_i\text{ 위의 pair motion}}\\[4pt]
\phantom{{}^{i}T_{i+1}=}\;
\underbrace{D_x(a_i)R_x(\alpha_i^{\mathrm{RH}})}_{\text{x}_{i+1}\text{ 위의 link geometry}}\\[3pt]
\underbrace{\text{homogeneous 좌표가 마지막 성분}}_{\text{현대 배열로 재표현}}
\end{gathered}`,
    provenance: 'Hartenberg & Denavit 1964 · right-handed standard form을 modern column-vector layout으로 재표기',
    meaning: '저자들의 1964년 저서는 homogeneous coordinate를 첫 성분에 둔 채 alpha를 right-handed로 정리했다. 위 식은 그 right-handed Z-then-X factorization만 현대 [x,y,z,1]^T 배열로 옮긴 것이다. X-then-Z와 shifted indices를 쓰는 proximal/modified D-H는 동등한 물리를 다른 frame convention으로 적은 후대 variant이지 이 원식이 아니다.',
    symbols: [[raw`{}^{i}T_{i+1}`, 'Frame i+1 좌표를 frame i로 옮기는 현대 homogeneous transform'], [raw`s_i`, '현대 robot 문헌에서 흔히 d로 쓰는 pair-axis offset'], [raw`a_i,\alpha_i^{\mathrm{RH}}`, 'Common-normal length와 right-handed link twist']],
  }, {
    latex: raw`\begin{gathered}
\underbrace{q_i=\theta_i}_{\text{회전 pair }R},
\qquad
\underbrace{q_i=s_i}_{\text{직선 pair }P}\\[5pt]
\underbrace{\dfrac{\Delta\theta_i}{2\pi}
=\dfrac{\Delta s_i}{L_i}}_{\text{screw pair }S_{L_i}}\\[5pt]
\underbrace{C,\ G,\ F}_{\text{각각 2·3·3개의 pair 변수}}
\end{gathered}`,
    provenance: 'Denavit & Hartenberg 1955 · lower-pair variable 분류를 설명용으로 재구성',
    meaning: '네 geometric parameters가 모두 independent motion variables인 것은 아니다. One-DOF R·P·screw와 multi-DOF cylindrical·spheric·planar pair를 구분해야 “all lower-pair mechanisms”라는 역사적 범위를 “모든 joint가 one-DOF”로 잘못 축소하지 않는다.',
    symbols: [[raw`q_i`, 'One-DOF primitive의 runtime generalized coordinate'], [raw`L_i`, 'Screw pair의 한 회전당 advance인 lead'], [raw`C,G,F`, 'Cylindrical, spheric, planar lower pairs']],
  }, {
    latex: raw`\underbrace{{}^{0}T_n(q)}_{\text{modern open-chain tool pose}}=\underbrace{{}^{0}T_1(q_1)\,{}^{1}T_2(q_2)\cdots{}^{n-1}T_n(q_n)}_{\text{base부터 tool까지 ordered product}}`,
    provenance: '현대 serial-robot kinematics handoff · 1955 원문의 직접 claim 아님',
    meaning: 'Open serial robot에서는 closure identity 대신 endpoint transform을 남긴다. 이는 D-H algebra의 중요한 현대적 유산이지만 원 논문의 두 space-mechanism examples가 직접 입증한 open-chain robot benchmark로 서술해서는 안 된다.',
    symbols: [[raw`{}^{0}T_n`, 'Tool frame n의 좌표를 base frame 0으로 옮기는 transform'], [raw`q_i`, 'Revolute angle 또는 prismatic displacement'], [raw`n`, 'Open chain의 one-DOF joint 수']],
  }],
  evidence: [
    {
      label: 'Complete notation',
      question: 'Reuleaux식 pair-name sequence에 무엇을 더해야 spatial lower-pair mechanism을 equations로 완전 기술할 수 있는가?',
      intervention: 'Successive pair axes에 common perpendicular frames를 붙이고 a, alpha, s, theta를 symbolic pair term과 4x4 matrix에 결합한다.',
      observation: 'Pair 종류·순서뿐 아니라 axes 사이 fixed geometry와 live pair variables가 한 closure equation에 함께 나타난다.',
      supports: 'Quantitative symbolic notation이 spatial mechanism description을 manipulative matrix-algebra problem으로 바꾼다는 중심 주장을 지지한다.',
      limit: 'Complete는 rigid lower-pair kinematics를 방정식으로 적는다는 뜻이지 canonical table, minimal calibration coordinates, dynamics 또는 safety까지 보장한다는 뜻이 아니다.',
    },
    {
      label: 'Four-parameter sufficiency',
      question: 'General relative pose는 여섯 값이 필요한데 successive link relation에는 왜 네 값만 남는가?',
      intervention: 'z_i를 pair axis로, x_(i+1)을 z_i와 z_(i+1)의 common perpendicular로 제한한다.',
      observation: '두 axes가 만나고 직교한다는 두 conditions 뒤에 두 rotation과 두 translation만 독립적으로 남는다.',
      supports: 'Parameter 감소가 mechanism freedom 손실이 아니라 constrained coordinate-frame construction의 결과임을 지지한다.',
      limit: 'Parallel·intersecting axes에서는 common perpendicular 또는 axis sign 선택이 유일하지 않으며 서로 다른 valid tables가 같은 mechanism을 나타낼 수 있다.',
    },
    {
      label: 'Spatial closure examples',
      question: 'Notation이 qualitative 이름표를 넘어 spatial closed mechanisms의 calculable equations를 만드는가?',
      intervention: '원 논문은 두 space-mechanism examples에서 successive matrices를 구성하고 loop closure를 적용한다.',
      observation: '같은 four-parameter matrix vocabulary에서 spatial displacement constraints를 추출할 수 있다.',
      supports: 'Matrix notation이 planar sketch에 머물지 않고 spatial lower-pair analysis에 적용 가능함을 보인다.',
      limit: '증거는 worked examples이지 open-chain robot 실험, randomized benchmark, floating-point conditioning, calibration noise 또는 soft·branched mechanism 평가가 아니다.',
    },
  ],
  implementation: [
    'Planar 4R closed chain을 그리고 z_i, x_(i+1), origins, signed a_i·alpha_i·s_i·theta_i를 모두 표시한다.',
    '1955 [1,x,y,z]^T·left-handed alpha matrix를 같은 배열의 1964 right-handed form으로 바꾼 뒤, 다시 modern [x,y,z,1]^T layout으로 permutation해 세 표현이 같은 coordinate change인지 검산한다.',
    '각 local matrix를 chain 순서로 곱하고 valid configuration에서 closure residual norm이 0에 가까운지 확인한다.',
    '같은 physical open chain에 standard Z-then-X table과 modified X-then-Z table을 각각 다시 구성하고, 같은 tuple을 재사용하지 않은 채 random q에서 endpoint pose를 비교한다.',
    'Parallel과 nearly parallel axes를 perturb해 valid table의 비유일성과 작은 geometry error에 대한 parameter jump를 기록한다.',
    '같은 nominal robot을 PoE screw axes와 zero pose로 표현해 fixed base·tool transforms를 포함한 FK가 일치하는지 확인한다.',
  ],
  assumptions: [
    'Links는 rigid하고 connections는 ideal lower pairs이며 deformation, clearance와 backlash를 무시한다.',
    'Original quantitative construction은 pair axes가 정의되는 screw·revolute·prismatic primitives를 사용하고, multi-DOF lower pair는 필요한 pair variables 또는 primitives로 전개한다.',
    'Frame origins, axis signs, alpha handedness, homogeneous-coordinate 위치와 transform direction을 한 convention 안에서 일관되게 유지한다.',
    'Nominal axes와 distances가 알려져 있으며 matrix equations는 geometric kinematics만 기술한다.',
  ],
  failures: [
    '1955 left-handed alpha, 1964 right-handed standard form과 modern modified D-H의 indices를 섞으면 dimension은 맞아도 다른 pose가 나온다.',
    '원문 [1,x,y,z]^T matrix에 modern last-row [0,0,0,1] 검사를 바로 적용하면 valid original matrix를 오류로 판정한다.',
    'Parallel axes에서는 common perpendicular가 비유일하고 nearly parallel axes에서는 작은 manufacturing perturbation이 D-H parameters를 크게 바꿀 수 있다.',
    'Closure 또는 FK가 맞아도 table의 uniqueness, calibration identifiability, collision, joint limits, elasticity와 controller dynamics는 보장되지 않는다.',
  ],
  legacy: '1955년의 직접 유산은 lower-pair closed chain을 quantitative symbols와 matrix closure로 바꾼 것이다. 저자들은 1964년에 right-handed alpha로 정리했고, 이후 distal·proximal/modified variants와 open-loop serial-robot use가 확산됐다. 현대 PoE는 physical screw axes와 arbitrary base·tool frames를 더 직접 기록하지만, 두 표현은 다른 물리 법칙이 아니라 같은 nominal kinematics의 서로 다른 coordinate parameterization이다.',
  nextReading: '현대 open-chain handoff에서 D-H product를 q에 대해 미분하면 joint rates와 hand rate를 잇는 Jacobian이 나온다. Whitney는 이 local map을 operator가 보는 hand-coordinate commands에서 simultaneous joint rates로 거꾸로 사용하고, exact inverse가 실패하는 singularity와 redundancy를 별도 문제로 드러낸다.',
  nextLinks: [
    { slug: 'robot-kinematics-coordinate-frames', label: 'Robot Kinematics & Coordinate Frames', reason: '현대 homogeneous transform 방향, open-chain FK와 PoE 비교를 먼저 고정한다.' },
    { slug: 'paper-whitney-coordinated-control-1972', label: 'Whitney Coordinated Control 1972', reason: 'D-H로 계산한 pose와 joint axes를 hand-coordinate Jacobian과 resolved rates로 연결한다.' },
  ],
  additionalSources: [
    { label: 'Hartenberg & Denavit · Kinematic Synthesis of Linkages (1964)', href: 'https://ecommons.cornell.edu/items/d0ec9495-2d37-4a17-888c-43fd7f8a8010', note: 'Right-handed alpha로 정리된 후속 저서와 1955 원문 표기를 구분하기 위한 Cornell 원문 서지.' },
  ],
  capabilities: [
    '1955 closed-loop claim, 1964 right-handed 정리와 modern open-chain use를 서로 다른 역사적 층으로 설명한다.',
    'z_i와 x_(i+1)의 frame constraints에서 네 independent parameters가 남는 이유를 유도한다.',
    'R·P·screw의 one-DOF variables와 C·G·F multi-DOF lower pairs를 구분한다.',
    'Original, standard와 modified D-H 식에 같은 parameter row를 재사용하면 안 되는 이유를 계산으로 보인다.',
    'Worked-example evidence와 uniqueness·conditioning·calibration·deployment guarantee 사이의 경계를 지킨다.',
  ],
};

export const whitneyCoordinatedControl1972Spec: PaperStudySpec = {
  shortTitle: 'Resolved Motion Rate & Coordinated Control',
  citation: 'D. E. Whitney - The Mathematics of Coordinated Control of Prosthetic Arms and Manipulators',
  yearVenue: '1972 · ASME Journal of Dynamic Systems, Measurement, and Control 94',
  sourceUrl: 'https://citeseerx.ist.psu.edu/document?doi=9e083bd1eaa5b4759218534759a30d76c9cb31f5&repid=rep1&type=pdf',
  appendixUrl: 'https://ntrs.nasa.gov/citations/19730031082',
  before: 'Conventional prosthetic arms와 remote manipulators는 operator가 joint switches를 하나씩 조작하게 했다. 그러나 hand-oriented coordinates의 sweep, reach, lift, tilt, twist, turn 중 한 방향만 명령하려 해도 여러 joints가 configuration-dependent rates로 동시에 움직여야 했다.',
  authorIntent: 'Whitney는 operator가 보거나 의미를 부여할 수 있는 external coordinates에서 hand translation·rotation rates와 final pose를 명령하고, computer가 이를 joint rates와 motor rates로 실시간 resolve하는 unified kinematic formulation을 만들려 했다. Square inverse뿐 아니라 reduced commands, singularities, redundant arms와 motor-joint coupling도 같은 논문 안에서 다뤘다.',
  thesis: 'Current configuration에서 hand twist S와 joint rates를 잇는 local Jacobian J(theta)를 joint-axis geometry로 구성하면 nonsingular square case에는 exact resolved-rate inverse를 쓸 수 있다. Final joint angles 없이도 pose error를 남은 시간의 hand rate로 반복 갱신할 수 있으며, reduced 또는 redundant cases에는 별도의 feasibility condition과 selection criterion이 필요하다.',
  readerBridge: [
    { term: 'Hand-oriented command', latex: raw`S=[V^T,\Omega^T]^T`, plain: 'Joint 이름이 아니라 hand에 붙은 translation 세 축과 rotation 세 축에서 요청한 instantaneous rate다.', role: '명령 순서 [sweep, reach, lift, tilt, twist, turn]과 좌표 frame을 고정한다.' },
    { term: 'Jacobian column', latex: raw`J_{:j}`, plain: '다른 joints를 멈추고 joint j만 unit rate로 움직였을 때 hand에 생기는 velocity와 rotation-rate contribution이다.', role: 'J를 black-box derivative가 아니라 joint-axis cross product로 재구성한다.' },
    { term: 'Attainable direction', latex: raw`S\in\operatorname{col}J`, plain: '현재 posture에서 어떤 joint-rate combination으로 실제 만들 수 있는 hand-rate direction이다.', role: 'Singularity를 inverse routine 오류가 아니라 잃어버린 physical motion direction으로 읽는다.' },
    { term: 'Motor-joint map', latex: raw`\dot\phi=M_2\dot\theta`, plain: 'Mechanism joint rates와 actuator shaft rates 사이의 gear ratio·linkage conversion이다.', role: 'Kinematic solution을 motor command로 바로 복사하지 않고 actuator handoff를 분리한다.' },
  ],
  reconstruction: [
    { label: 'Task command', latex: raw`S=[V^T,\Omega^T]^T`, note: 'sweep·reach·lift·tilt·twist·turn 순서' },
    { label: 'Column geometry', latex: raw`u_j\times b_{j7},\ u_j`, note: 'Unit joint rate가 만드는 linear·angular contribution' },
    { label: 'Resolve rates', latex: raw`\dot\theta=J(\theta)^{-1}S`, note: 'Square·nonsingular일 때만 exact inverse' },
    { label: 'Drive motors', latex: raw`\dot\phi=M_2\dot\theta`, note: 'Gear ratio와 coupled linkage를 actuator rates로 변환' },
  ],
  mechanism: [
    'Hand frame의 translational commands를 sweep, reach, lift로, 같은 축 주위 rotational commands를 tilt, twist, turn으로 배열해 S=[V^T,Omega^T]^T를 만든다.',
    'D-H products로 shoulder frame에서 각 joint axis unit vector u_j, joint origin O_j와 hand origin O_7을 구하고 b_(j7)=O_jO_7을 구성한다.',
    'Revolute joint j의 unit rate는 shoulder frame에서 hand linear velocity u_j cross b_(j7)와 angular velocity u_j를 만든다. 두 벡터를 current hand frame으로 회전해 J의 j-th column에 넣는다.',
    'Prismatic joint는 slide-axis 방향 linear velocity u_j와 zero angular velocity를 만들며, 같은 frame conversion 뒤 J column이 된다.',
    'J가 square·nonsingular이면 exact inverse로 S를 simultaneous joint rates로 resolve한다. 당시 계산 비용을 줄이기 위해 selected configurations의 J inverse를 precompute해 interpolation하는 방법도 시험했다.',
    'Motor와 joint가 one-to-one이 아니면 M2를 적용해 joint rates를 motor shaft rates로 바꾼다.',
    'Position control에서는 desired position·orientation과 current pose의 남은 차이를 remaining time T의 V와 Omega로 만들고, trajectory 중 current pose와 T를 다시 계산하는 closed-loop rate procedure를 사용한다.',
    '일부 task commands와 joint motions만 남길 때는 J를 partition하거나 unattainable rows와 무관한 columns를 제거한 reduced square system이 invertible한지 다시 확인한다.',
    'J가 6 by n, n>6이고 full row rank이면 positive-definite A가 정한 weighted instantaneous joint-rate cost를 최소화해 extra joints를 선택한다.',
    '원문의 exact inverse와 weighted inverse는 near-singularity regularization이 아니다. Modern DLS는 task residual을 허용해 rate gain을 제한하는 후대 경계로 따로 비교한다.',
  ],
  equations: [{
    latex: raw`\begin{aligned}\underbrace{S}_{\text{hand-coordinate rate}}&=\underbrace{\begin{bmatrix}V\\\Omega\end{bmatrix}}_{\text{translation과 rotation rate}}\\[4pt]&=\underbrace{\begin{bmatrix}S_{\rm sweep}\\S_{\rm reach}\\S_{\rm lift}\\S_{\rm tilt}\\S_{\rm twist}\\S_{\rm turn}\end{bmatrix}}_{\text{E-2 hand frame의 정확한 command 순서}}\\[4pt]&=\underbrace{J(\theta)\dot\theta}_{\text{simultaneous joint contributions}}\end{aligned}`,
    meaning: 'Whitney의 S는 current hand frame에서 표현한 세 translational rates와 세 rotational rates를 쌓은 six-vector다. Command order는 sweep, reach, lift, tilt, twist, turn이며, 순서를 바꾸면 J rows와 operator command 의미가 어긋난다.',
    symbols: [[raw`V`, 'Hand-frame origin의 translational velocity'], [raw`\Omega`, 'Hand frame의 rotational-rate vector'], [raw`J(\theta)`, 'Current joint configuration에서의 6 by n kinematic map'], [raw`\dot\theta`, 'Turn 또는 sliding joints의 simultaneous rates']],
  }, {
    latex: raw`\begin{gathered}
\underbrace{\mathcal R_{7\leftarrow1}}_{\text{shoulder twist를 hand 좌표로}}
=\operatorname{diag}\!\left({}^{1}C_7^{T},{}^{1}C_7^{T}\right)\\[6pt]
\underbrace{J_{:j}}_{\text{joint }j\text{의 단위속도 열}}
=\begin{cases}
\mathcal R_{7\leftarrow1}
\begin{bmatrix}u_j\times b_{j7}\\u_j\end{bmatrix},
&\underbrace{\text{회전 관절}}_{\text{lever arm·축 회전}}\\[9pt]
\mathcal R_{7\leftarrow1}
\begin{bmatrix}u_j\\0\end{bmatrix},
&\underbrace{\text{직선 관절}}_{\text{축 이동·회전 없음}}
\end{cases}
\end{gathered}`,
    latexCompact: raw`\begin{gathered}
\underbrace{\mathcal R_{7\leftarrow1}}_{\text{어깨 좌표를 손 좌표로}}
=\operatorname{diag}({}^{1}C_7^T,{}^{1}C_7^T)\\[5pt]
\underbrace{J_{:j}}_{\text{관절 }j\text{의 기여}}
=\begin{cases}
\mathcal R_{7\leftarrow1}\begin{bmatrix}u_j\!\times\! b_{j7}\\u_j\end{bmatrix},
&\underbrace{\text{회전}}_{\text{팔 길이와 축}}\\[8pt]
\mathcal R_{7\leftarrow1}\begin{bmatrix}u_j\\0\end{bmatrix},
&\underbrace{\text{직선}}_{\text{축 방향 이동}}
\end{cases}
\end{gathered}`,
    meaning: 'Revolute column은 joint axis가 hand origin에 만드는 moment-arm velocity와 axis rotation rate를 결합한다. Prismatic column은 slide direction의 translation만 갖는다. 원문은 이 vector cross-product construction으로 J를 real time에 계산했다.',
    symbols: [[raw`u_j`, 'Shoulder frame에서 표현한 joint j의 unit axis'], [raw`b_{j7}`, 'Joint origin O_j에서 hand-frame origin O_7로 가는 vector'], [raw`{}^{1}C_7^T`, 'Shoulder-frame vector를 current hand-frame components로 바꾸는 rotation'], [raw`\mathcal R_{7\leftarrow1}`, 'Linear·angular blocks에 같은 rotation을 적용하는 6D frame conversion']],
  }, {
    latex: raw`\begin{gathered}
\underbrace{\dot\theta}_{\text{함께 움직일 관절 속도}}
=\underbrace{J(\theta)^{-1}}_{\text{정사각 Jacobian의 정확한 역}}
\underbrace{S}_{\text{요청한 손끝 속도}}\\[5pt]
\underbrace{\det J(\theta)\ne0}_{\text{현재 자세에서 역행렬이 존재할 조건}}
\end{gathered}`,
    meaning: 'Equation (4)의 exact inverse는 six commands와 six independent joints가 있고 J가 nonsingular한 경우에만 성립한다. Near singularity에서 inverse가 계산된다는 사실은 actuator-feasible rate나 robust tracking을 보장하지 않는다.',
    symbols: [[raw`J^{-1}`, 'Task rate를 joint rates로 되돌리는 exact local inverse'], [raw`\det J\ne0`, 'Square matrix가 모든 six task directions을 locally span하는 조건'], [raw`S`, 'Operator 또는 pose loop가 요청한 hand-coordinate rate']],
  }, {
    latex: raw`\underbrace{\dot\phi}_{\text{motor shaft rates}}=\underbrace{M_2}_{\text{gear ratio와 coupled linkage}}\underbrace{\dot\theta}_{\text{joint rates}}=\underbrace{M_2J^{-1}S}_{\text{stick command에서 actuator까지}}`,
    meaning: 'Whitney의 equations (23)·(24)는 kinematic joints와 physical motors를 분리한다. Several joints가 한 motor motion에 coupling되거나 gear ratios가 다르면 J inverse 결과를 actuator command로 그대로 보낼 수 없다.',
    symbols: [[raw`\dot\phi`, 'Motor shaft rate vector'], [raw`M_2`, 'Joint-rate to motor-rate conversion matrix'], [raw`\dot\theta`, 'Mechanism generalized-coordinate rates']],
  }, {
    latex: raw`\begin{gathered}
\underbrace{V}_{\text{남은 평행이동 속도}}
=\underbrace{{}^{1}C_7^{T}(\theta)}_{\text{현재 hand frame으로 회전}}
\dfrac{\underbrace{b_{17}(\theta_f)-b_{17}(\theta)}_{\text{남은 위치 오차}}}
{\underbrace{T}_{\text{남은 시간}}}\\[7pt]
\underbrace{C_{if}}_{\text{남은 상대 회전}}
={}^{1}C_7^{T}(\theta)\,{}^{1}C_7(\theta_f)\\[5pt]
\underbrace{C_{if}\hat\Omega=\hat\Omega}_{\text{회전축 찾기}},
\qquad
\underbrace{\Omega=\dfrac{\alpha}{T}\hat\Omega}_{\text{남은 회전 속도}}
\end{gathered}`,
    meaning: 'Final joint angles theta_f를 먼저 푸는 대신 desired hand pose가 주는 final position과 orientation을 사용한다. Relative rotation의 unit-eigenvalue axis Omega-hat과 angle alpha를 remaining time으로 나누고, current pose와 T를 주기적으로 갱신해 differential pose loop를 닫는다.',
    symbols: [[raw`b_{17}(\theta_f)`, 'Joint solution을 몰라도 external source가 지정한 desired hand position'], [raw`C_{if}`, 'Current hand frame에서 본 desired relative orientation'], [raw`\hat\Omega,\alpha`, 'Relative rotation의 unit axis와 remaining angle'], [raw`T`, 'Recomputation 시점마다 줄어드는 remaining move time']],
  }, {
    latex: raw`\begin{gathered}
\underbrace{\begin{bmatrix}S_a\\0\end{bmatrix}}_{\text{움직일 출력·고정할 출력}}
=\begin{bmatrix}J_1&J_2\\J_3&J_4\end{bmatrix}
\begin{bmatrix}\dot\theta_a\\\dot\theta_b\end{bmatrix}\\[7pt]
\underbrace{\dot\theta_b=-J_4^{-1}J_3\dot\theta_a}_{\text{고정 조건을 지킬 나머지 관절}}\\[6pt]
\underbrace{S_a=(J_1-J_2J_4^{-1}J_3)\dot\theta_a}_{\text{실제로 얻는 손끝 속도}}
\end{gathered}`,
    meaning: '일부 joint histories가 이미 정해지고 tilt·twist 같은 일부 hand rates를 zero로 유지할 때의 partitioned relation이다. J4 또는 resulting bracket가 singular하면 trajectory criterion과 coordination constraint를 동시에 만족시킬 수 없다.',
    symbols: [[raw`\dot\theta_a`, '외부 trajectory criterion으로 이미 정한 joint rates'], [raw`\dot\theta_b`, 'Hand constraints를 지키도록 resolve할 remaining joint rates'], [raw`S_a`, 'Constraint를 만족한 뒤 생기는 unconstrained hand rates'], [raw`J_1,\ldots,J_4`, 'Known·unknown rates와 commands에 맞춰 partition한 Jacobian blocks']],
  }, {
    latex: raw`\underbrace{J_{\rm red}\dot\theta_{\rm red}}_{\text{남겨 둔 joint-rate columns}}=\underbrace{S_{\rm red}}_{\text{attainable command rows}},\qquad\underbrace{\dot\theta_{\rm red}=J_{\rm red}^{-1}S_{\rm red}}_{\text{reduced square inverse}}`,
    meaning: 'E-2의 특정 alignment에서는 sweep·turn rows와 그 밖의 네 commands에 기여하지 않는 joint columns를 제거해 4 by 4 inverse를 사용한다. 이는 잃은 directions을 복구하는 방법이 아니라 요청하지 않기로 한 commands와 unused joints를 명시적으로 줄이는 방법이다.',
    symbols: [[raw`J_{\rm red}`, '선택한 attainable commands와 relevant joints로 만든 square submatrix'], [raw`S_{\rm red}`, '원문 예에서는 reach, lift, tilt, twist'], [raw`\dot\theta_{\rm red}`, 'Reduced task에 남긴 four joint rates']],
  }, {
    latex: raw`\begin{gathered}
\underbrace{\dot\theta^*}_{\text{가중 최소 관절속도 해}}
=\underbrace{A^{-1}J^T(JA^{-1}J^T)^{-1}}_{\text{Whitney의 가중 right inverse}}
\underbrace{S}_{\text{정확히 지킬 task 속도}}\\[7pt]
\underbrace{J\in\mathbb R^{6\times n},\quad n>6}_{\text{관절이 task보다 많음}}\\[4pt]
\underbrace{\operatorname{rank}J=6,\quad A\succ0}_{\text{full row rank·양의 정부호 조건}}
\end{gathered}`,
    latexCompact: raw`\begin{gathered}
\underbrace{\dot\theta^*}_{\text{가중 최소 관절속도}}
=A^{-1}J^T(JA^{-1}J^T)^{-1}S\\[6pt]
\underbrace{n>6}_{\text{관절이 더 많음}},\quad
\underbrace{\operatorname{rank}J=6}_{\text{모든 task 방향 유지}}\\[4pt]
\underbrace{A\succ0}_{\text{양의 관절 선호 비용}}
\end{gathered}`,
    meaning: 'Redundant full-row-rank arm에서 equation (42)는 J dot-theta=S를 정확히 만족하는 해 중 one-half dot-theta-transpose A dot-theta를 최소화한다. A는 instantaneous joint-rate preference이며 future joint limits, collision 또는 global posture를 예측하지 않는다.',
    symbols: [[raw`A`, 'Symmetric positive-definite joint-rate weight'], [raw`\operatorname{rank}J=6`, '모든 six hand-rate directions이 attainable한 full-row-rank 조건'], [raw`n>6`, 'Task dimension보다 많은 joint degrees of freedom'], [raw`(JA^{-1}J^T)^{-1}`, 'Weighted task metric의 exact inverse']],
  }, {
    latex: raw`\underbrace{\dot\theta_{\rm DLS}=J^T(JJ^T+\lambda^2I)^{-1}S}_{\text{modern damped least squares, 1972 원문 밖}}\ne\underbrace{J^{-1}S}_{\text{Whitney의 square exact inverse}}`,
    latexCompact: raw`\begin{gathered}
\underbrace{\dot\theta_{\rm DLS}}_{\text{후대의 감쇠 해}}
=J^T(JJ^T+\lambda^2I)^{-1}S\\[6pt]
\underbrace{\dot\theta_{\rm DLS}\ne J^{-1}S}_{\text{1972 정확 역행렬과 목적·출처가 다름}}
\end{gathered}`,
    meaning: 'DLS는 Whitney가 이 논문에서 제시한 식이 아니다. Lambda가 small singular directions의 inverse gain을 제한하는 대신 task residual을 허용하는 후대 regularization이며, weighted full-row-rank inverse의 exact-task guarantee와도 목적이 다르다.',
    symbols: [[raw`\lambda`, 'Task accuracy와 joint-rate gain을 교환하는 modern damping'], [raw`JJ^T+\lambda^2I`, 'Small task-space eigenvalues를 regularize한 matrix'], [raw`\ne`, '역사적 출처와 optimization contract가 다름을 강조']],
  }],
  evidence: [
    {
      label: 'Coordinate control',
      question: 'Operator가 joint switches가 아니라 hand-oriented axes의 한 command를 요청하고 unrequested motion을 억제할 수 있는가?',
      intervention: 'S를 [sweep, reach, lift, tilt, twist, turn]으로 정하고 current J inverse로 simultaneous joint rates를 계산한다.',
      observation: '논문은 E-2 arm의 reach와 tilt CRT position sequences를 제시하고 관련 hardware development·demonstration reports를 연결한다.',
      supports: 'Task-coordinate commands를 configuration-dependent joint coordination으로 바꾸는 engineering formulation과 illustrative behavior를 지지한다.',
      limit: '논문 자체에는 modern hardware benchmark, latency distribution, tracking-error table, user study 또는 broad manipulator comparison이 없다.',
    },
    {
      label: 'Position loop',
      question: 'Corresponding final joint angles을 먼저 알지 못해도 externally specified final hand pose로 명령할 수 있는가?',
      intervention: 'Position difference와 relative-rotation axis·angle을 remaining time의 V·Omega로 만들고 current pose에서 주기적으로 다시 계산한다.',
      observation: 'Analytic arm-specific IK 대신 local resolved rates를 반복하는 closed-loop position procedure가 수식으로 제시된다.',
      supports: 'Final pose command를 differential IK와 receding error correction으로 연결하는 구조를 지지한다.',
      limit: '일반 convergence basin, discrete integration error, velocity saturation, joint-limit feasibility와 collision-free path는 유도하거나 실험으로 보장하지 않는다.',
    },
    {
      label: 'Reduced singular case',
      question: 'J inverse가 사라졌을 때 remaining attainable commands만 계속 사용할 수 있는가?',
      intervention: 'E-2 alignment에서 unattainable sweep·turn rows와 remaining commands에 무관한 theta_2·theta_4 columns를 제거해 4 by 4 system을 만든다.',
      observation: 'Reach, lift, tilt와 twist에는 reduced inverse를 사용할 수 있지만 lost sweep·turn directions 자체는 복구되지 않는다.',
      supports: 'Singularity가 모든 computation의 동일한 failure가 아니라 posture별 lost task directions과 command selection 문제임을 보인다.',
      limit: 'Arbitrary singularity를 자동 분류하는 SVD, smooth mode transition, DLS 또는 bounded constrained solver는 제공하지 않는다.',
    },
    {
      label: 'Redundant selection',
      question: 'J가 6 by n이고 n이 6보다 클 때 infinitely many joint rates 중 하나를 어떻게 고르는가?',
      intervention: 'Exact task equality에 symmetric positive-definite A의 instantaneous weighted joint-rate cost를 붙여 equation (42)를 유도한다.',
      observation: 'Full-row-rank 조건에서 weighted right inverse가 extra joint motions을 결정한다.',
      supports: 'Redundancy에는 kinematics 외의 explicit selection criterion이 필요하다는 점과 그 한 closed-form choice를 지지한다.',
      limit: 'Near rank loss regularization, joint bounds, null-space collision avoidance, future singularity avoidance와 long-horizon optimality는 입증하지 않는다.',
    },
  ],
  implementation: [
    '2R 또는 3R arm에서 each revolute column의 u_j cross b_(jE)와 u_j를 구성하고 finite-difference FK derivative와 비교한다.',
    'Hand frame row order를 [sweep, reach, lift, tilt, twist, turn]으로 고정하고 six unit commands를 넣어 achieved S의 off-axis components를 검사한다.',
    'Square J에서 exact inverse가 성립하는 posture와 determinant·smallest singular value가 줄어드는 posture를 분리해 joint-rate norm을 기록한다.',
    'Nonidentity M2를 사용해 requested joint rates, motor commands와 saturation 뒤 actually applied joint rates를 별도 log로 남긴다.',
    'Desired pose의 translation과 relative axis-angle를 remaining time rate로 만들고 매 step pose·T를 갱신하되 residual, step size와 termination을 기록한다.',
    'E-2식 reduced row·column selection과 modern DLS를 같은 singular case에 적용해 보존한 commands, 포기한 commands와 task residual을 비교한다.',
    '7-DOF full-row-rank example에서 two positive-definite A choices가 같은 S를 만들면서 다른 joint-rate solution을 고르는지 검증한다.',
  ],
  assumptions: [
    'Rigid manipulator의 instantaneous kinematics, current joint state와 D-H geometry가 충분히 정확하다.',
    'S, Jacobian columns와 pose error가 같은 external 또는 hand coordinate convention과 exact row order를 사용한다.',
    'Square exact inverse에서는 J가 nonsingular하고, weighted redundant formula에서는 J가 full row rank이며 A가 symmetric positive definite다.',
    'Low-level joint·motor servos가 generated rate history를 충분히 추적하고 unmodeled dynamics와 flexibility가 kinematic layer를 압도하지 않는다.',
  ],
  failures: [
    'Sweep·reach·lift·tilt·twist·turn row order나 hand/shoulder frame conversion을 바꾸면 correct-looking matrix가 다른 physical command를 실행한다.',
    'Near singularity에서 exact inverse 또는 undamped weighted inverse는 joint rates를 motor limits 이상으로 키울 수 있다.',
    'Precomputed inverse interpolation은 sampled configuration range 밖에서 accuracy와 nonsingularity를 보장하지 않는다.',
    'Pose loop는 local integration procedure이므로 joint limits, collision, path homotopy, sampling delay와 global convergence를 보장하지 않는다.',
    'Instantaneous weighted minimum rate는 future posture, obstacle clearance와 long-horizon effort minimum을 보장하지 않는다.',
    'Modern DLS를 equation (42)의 원문 결과로 돌려 쓰면 exact-task weighted inverse와 residual-accepting regularization의 증거 경계가 사라진다.',
  ],
  legacy: 'Whitney는 meaningful external hand coordinates, cross-product Jacobian columns, exact resolved-rate inverse, motor linkage map과 final joint angles 없는 pose loop를 한 kinematic architecture로 연결했다. Reduced commands와 weighted redundant inverse는 singularity와 extra joints에 별도 feasibility·selection policy가 필요함을 드러냈다. Modern SVD, DLS, null-space objectives와 constrained IK는 이 문제를 확장하지만 1972년 논문의 직접 결과로 소급하면 안 된다.',
  nextReading: 'Whitney의 exact inverse는 current posture에서 attainable hand rate를 joint rates로 바꾸지만 near-singularity rate gain, joint bounds와 collision-free global motion을 해결하지 않는다. 현대 Robot Kinematics 글에서 SVD·DLS의 residual trade-off를 확인한 뒤, Motion Planning에서 locally valid rate와 obstacle-free path를 분리한다.',
  nextLinks: [
    { slug: 'robot-kinematics-coordinate-frames', label: 'Robot Kinematics & Coordinate Frames', reason: 'Jacobian SVD, pseudoinverse와 modern DLS를 원문 exact inverse의 경계 밖에서 비교한다.' },
    { slug: 'robot-motion-planning', label: 'Robot Motion Planning', reason: 'Locally attainable hand motion을 collision-free global configuration path 문제로 넘긴다.' },
    { slug: 'robot-trajectory-generation', label: 'Robot Trajectory Generation', reason: 'Resolved joint-rate history를 velocity·acceleration limits가 있는 executable timing 문제와 연결한다.' },
  ],
  capabilities: [
    'Whitney의 six hand commands를 정확한 row order와 S=[V^T,Omega^T]^T 구조로 재구성한다.',
    'Revolute와 prismatic Jacobian columns를 joint axis, moment arm과 frame rotation으로 계산한다.',
    'Square exact inverse, motor map, pose loop와 reduced command inverse의 서로 다른 contracts를 설명한다.',
    'Weighted redundant formula의 full-row-rank·positive-definite 조건과 instantaneous criterion의 한계를 확인한다.',
  ],
};
