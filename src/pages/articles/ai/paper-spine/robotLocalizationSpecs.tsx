import type { PaperStudySpec } from './FoundationalPaperStudy';
import LuMiliosPoseNetworkLab from './viz/LuMiliosPoseNetworkLab';

const raw = String.raw;

export const luMilios1997Spec: PaperStudySpec = {
  shortTitle: 'Lu & Milios Pose Network',
  citation: 'F. Lu and E. Milios - Globally Consistent Range Scan Alignment for Environment Mapping',
  yearVenue: '1997 · Autonomous Robots 4, 333-349',
  sourceUrl: 'https://doi.org/10.1023/A:1008854305733',
  appendixUrl: 'https://web.cs.dal.ca/~eem/cvWeb/pubs/mapping.pdf',
  appendixLabel: '공저자 공개 원문 PDF',
  appendixNote: 'Evangelos Milios의 대학 출판 목록에서 연결한 저자 공개본이다. 출판 기록은 DOI를 기준으로 확인한다.',
  before: '당시 흔한 incremental pipeline은 새 range scan을 이전 scan 또는 cumulative global model에 맞추고 즉시 merge했다. Odometry error가 누적된 뒤 처음 장소를 다시 보게 되면 마지막 pose만 평균내서는 이전 relations가 깨지고, 이미 합쳐버린 local data를 다시 배치하기 어려웠다.',
  authorIntent: '저자들은 object segmentation이나 알려진 landmarks 없이도 모든 local scans를 일관되게 정렬하고 싶었다. 핵심 선택은 scan을 영구적으로 global model에 굽지 않고, 각 scan을 얻은 robot pose와 pairwise spatial relation 및 uncertainty를 보존한 뒤 모든 pose variables를 한꺼번에 추정하는 것이었다.',
  thesis: 'Odometry와 pairwise scan matching에서 얻은 uncertain relative-pose relations를 하나의 network로 보존하고, 한 pose를 reference로 고정한 maximum-likelihood optimization을 풀면 conflicting loops의 correction이 관련된 모든 scan poses에 전파되어 globally consistent registration을 얻을 수 있다.',
  reconstruction: [
    { label: 'Local frames', value: 'scan S_i + pose V_i', note: '한 robot pose에서 얻은 raw range frame을 보존한다.' },
    { label: 'Relations', value: 'weak + strong links', note: '연속 pose의 odometry와 overlap scan matching을 covariance와 함께 기록한다.' },
    { label: 'Global solve', value: 'all pose variables', note: 'Relation을 직접 평균내지 않고 free node locations를 동시에 최적화한다.' },
    { label: 'Re-register', value: 'updated world model', note: 'Solved poses로 모든 local scans를 다시 global frame에 배치한다.' },
  ],
  mechanism: [
    '각 range scan을 한 robot pose에서 얻은 local data frame으로 정의해 object segmentation과 frame identity ambiguity를 피한다.',
    'Robot trajectory의 scan poses를 nodes로 만들고, 인접 poses의 odometry measurements를 weak links로 추가한다.',
    '두 scans의 spatial overlap이 threshold보다 충분할 때 rough odometry initialization으로 pairwise matching을 수행하고 strong link를 추가한다.',
    'Strong link는 대응점 residual을 least squares로 풀어 relative pose measurement와 covariance를 만들고, weak link는 rotation-translation-sensor-turn error model의 Jacobian으로 covariance를 만든다.',
    '각 relation의 predicted value와 observed value 차이를 covariance inverse로 가중한 Mahalanobis energy로 변환한다.',
    'Relative measurements만으로 global reference는 결정되지 않으므로 pose V0를 고정하고 나머지 3n pose coordinates를 free variables로 둔다.',
    'SE(2) pose compounding과 inverse compounding을 사용해 nonlinear relation을 current pose estimates 주변에서 first-order linearize한다.',
    '모든 link contributions를 information matrix G와 vector B에 누적하고 GX=B를 풀어 pose corrections와 covariance G^-1을 얻는다.',
    'Correction을 poses에 적용한 뒤 measurement equations를 다시 linearize하고 solve한다. 논문 구현은 대개 4-5 iterations에 machine-accuracy 한계로 수렴했다고 보고한다.',
    'Updated poses로 local scans를 다시 배치한다. Sequential variant는 새 nodes와 relations를 G/B에 추가하지만 state 크기와 dense inverse cost를 별도로 관리해야 한다.',
  ],
  equations: [
    {
      latex: raw`\begin{aligned}\underbrace{V_a}_{\text{도착 pose}}&=\underbrace{V_b\oplus D}_{\text{시작 pose에 local motion을 합성}}\\[4pt]\underbrace{x_a}_{\text{global x}}&=\underbrace{x_b+x\cos\theta_b-y\sin\theta_b}_{\text{local translation을 시작 heading으로 회전}}\\[4pt]\underbrace{y_a}_{\text{global y}}&=\underbrace{y_b+x\sin\theta_b+y\cos\theta_b}_{\text{회전한 translation을 global 위치에 더함}}\end{aligned}`,
      meaning: '논문의 pose compounding 연산이다. Translation D=(x,y,θ)는 Vb의 local axes에서 표현되므로 먼저 θb로 회전한다. 연산은 associative지만 commutative하지 않으며 angle wrapping과 coordinate convention을 구현에서 고정해야 한다.',
      symbols: [[raw`V_b,V_a`, 'motion 전후의 planar poses'], [raw`D=(x,y,\theta)^T`, 'Vb local frame에서 표현한 relative pose'], [raw`\oplus`, 'SE(2) pose compounding'], [raw`\theta_b`, '시작 pose의 global heading']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{W(X)}_{\text{network total energy}}&=\underbrace{\sum_{(i,j)}\left(D_{ij}(X)-\bar D_{ij}\right)^TC_{ij}^{-1}\left(D_{ij}(X)-\bar D_{ij}\right)}_{\text{모든 relation 오차를 uncertainty로 정규화해 더함}}\\[5pt]\underbrace{X_0=0}_{\text{reference node 고정}}&\Longrightarrow\underbrace{X_1,\ldots,X_n}_{\text{상대 measurements로 풀 free nodes}}\end{aligned}`,
      latexCompact: raw`\begin{gathered}
\underbrace{e_{ij}=D_{ij}(X)-\bar D_{ij}}_{\text{relation 오차}}\\[4pt]
\underbrace{W(X)=\sum_{(i,j)}e_{ij}^{T}C_{ij}^{-1}e_{ij}}_{\text{불확실성으로 정규화한 합}}\\[4pt]
\underbrace{X_0=0}_{\text{reference 고정}}
\end{gathered}`,
      meaning: 'Mutually independent zero-mean Gaussian observation errors를 가정하면 maximum likelihood는 Mahalanobis energy 최소화가 된다. Missing correlation, biased odometry, false scan match와 non-Gaussian tails는 이 objective 밖의 failure다.',
      symbols: [[raw`D_{ij}(X)`, '현재 node poses가 예측하는 relation'], [raw`\bar D_{ij}`, 'odometry 또는 scan matching observation'], [raw`C_{ij}^{-1}`, 'relation information matrix'], [raw`X_0=0`, 'absolute truth가 아니라 gauge를 제거하는 reference choice']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{\bar D}_{\text{observed relations}}&=\underbrace{HX}_{\text{predicted differences}}+\underbrace{\varepsilon}_{\text{measurement error}}\\[4pt]\underbrace{G}_{\text{network information}}&=\underbrace{H^TC^{-1}H}_{\text{edge information 누적}}\\[4pt]\underbrace{B}_{\text{weighted observations}}&=\underbrace{H^TC^{-1}\bar D}_{\text{relation evidence 누적}}\\[4pt]\underbrace{GX^*=B}_{\text{normal equation}}&\Longrightarrow\underbrace{C_X=G^{-1}}_{\text{solved covariance}}\end{aligned}`,
      latexCompact: raw`\begin{gathered}
\underbrace{\bar D=HX+\varepsilon}_{\text{관측 relation}}\\[3pt]
\underbrace{G=H^TC^{-1}H}_{\text{network information}}\\[3pt]
\underbrace{B=H^TC^{-1}\bar D}_{\text{weighted evidence}}\\[3pt]
\underbrace{GX^*=B}_{\text{normal equation}}
\end{gathered}`,
      meaning: '논문 Section 3의 linear special-case closed form이다. 실제 implementation에서는 inverse를 직접 만드는 대신 sparse factorization으로 GX=B를 푸는 편이 안정적이다. Disconnected graph나 anchor 부재는 G를 singular하게 만든다.',
      symbols: [[raw`H`, 'graph incidence/measurement matrix'], [raw`C`, 'stacked relation covariance'], [raw`G=H^TC^{-1}H`, 'anchored pose-network information matrix'], [raw`C_X`, 'linear Gaussian 가정 아래 node estimates covariance']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{\delta z_k}_{\text{k번째 대응 오차}}&=\underbrace{V_a\oplus u_k^a-V_b\oplus u_k^b}_{\text{두 local 점의 global 차이}}\\[4pt]\underbrace{F_{ab}}_{\text{scan alignment cost}}&=\underbrace{\sum_{k=1}^{m}\lVert\delta z_k\rVert^2}_{\text{모든 대응 오차 제곱합}}\\[4pt]\underbrace{s^2}_{\text{residual variance}}&=\underbrace{F_{ab}(\bar D)/(2m-3)}_{\text{관측 수에서 pose 자유도 제외}}\\[4pt]\underbrace{C_D}_{\text{relation covariance}}&=\underbrace{s^2(M^TM)^{-1}}_{\text{residual과 geometry 반영}}\end{aligned}`,
      meaning: 'Corresponding points로 strong link measurement와 covariance를 만드는 논문의 linearized least-squares 단계다. 모든 point errors가 independent, identical isotropic Gaussian이라는 가정은 편의를 위한 것이며 corridor degeneracy와 wrong correspondences를 충분히 모델링하지 못할 수 있다.',
      symbols: [[raw`u_k^a,u_k^b`, '두 local scans에서 같은 physical point의 coordinates'], [raw`m`, 'correspondence pair 수'], [raw`M`, 'linearized alignment Jacobian stack'], [raw`s^2`, 'fit residual에서 추정한 scalar point-error variance']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{X_i}_{\text{linear correction}}&=\underbrace{\bar H_i\Delta V_i}_{\text{pose perturbation 변환}}\\[4pt]\underbrace{V_i^{new}}_{\text{갱신 pose}}&=\underbrace{\bar V_i-\bar H_i^{-1}X_i}_{\text{global correction 적용}}\\[4pt]\underbrace{\text{linearize}\rightarrow\text{solve}\rightarrow\text{update}}_{\text{한 iteration}}&\quad\underbrace{\circlearrowleft}_{\text{수렴까지 반복}}\end{aligned}`,
      meaning: '논문 Eq. 60-61의 좌표 규약을 그대로 따른다. Xi는 SE(2) pose 자체가 아니라 current estimate 주변의 선형화 좌표 Hi ΔVi이므로, 원문은 이를 Hi 역변환한 뒤 현재 pose vector에서 빼 갱신한다. Modern manifold solver의 retract 표기와 조용히 섞으면 안 된다. 논문은 첫 iteration에서 total correctable error의 90% 이상을 고친 경우가 보통이고 4-5회 수렴했다고 보고하지만 global convergence 보장은 아니다.',
      symbols: [[raw`\bar V_i`, '현재 linearization pose'], [raw`\Delta V_i`, 'true pose와 current estimate의 small perturbation'], [raw`\bar H_i`, 'current pose에 의존하는 linearization transform'], [raw`V_i^{new}`, '다음 iteration이 사용할 updated pose']],
    },
  ],
  mechanismViz: LuMiliosPoseNetworkLab,
  evidence: [
    {
      label: '13-pose simulation',
      question: 'Global relation network가 accumulated odometry drift를 local pairwise correction보다 더 잘 제한하는가?',
      intervention: '폭 10 units의 simulated rectangular environment에서 central object를 도는 13 scan poses와 random sensing/odometry errors를 만들고, raw odometry, previous-scan-only local registration, all-links global registration의 pose errors를 비교했다.',
      observation: 'Odometry error는 path를 따라 누적되어 scans가 크게 어긋났다. Local correction은 error를 줄였지만 여전히 unbounded growth 가능성이 남았고, global registration 뒤 positional/orientational errors는 bounded되고 scans가 더 일관되게 정렬됐다.',
      supports: 'Loop와 nonlocal overlapping-scan relations를 모든 poses에 동시에 적용하면 sequential local registration보다 global consistency를 개선할 수 있다는 명제를 지지한다.',
      limit: 'Ground-truth-known 2D simulation이며 noise generation, overlap threshold와 correct correspondences에 의존한다. Modern 3D dynamics, false closures, real-time deadline은 입증하지 않는다.',
    },
    {
      label: '30 real scans',
      question: '실제 laser와 odometry data에서도 relation network가 visually coherent alignment를 만드는가?',
      intervention: 'FAW Ulm cafeteria/corridor에서 약 2 m 간격으로 얻은 30 scans와 odometry를 사용하고, overlapping scan pairs에서 84 strong links를 구성했다.',
      observation: 'Raw odometry coordinates의 scans는 큰 misalignment를 보였고 global registration 뒤 walls와 corridor structure가 훨씬 일관되게 겹쳤다. 논문 Figure 8은 corrected path와 raw odometry path를 함께 보여준다.',
      supports: 'Stop-and-scan 2D laser data와 해당 environment에서 pairwise relations plus global solve가 실제 accumulated pose error를 교정할 수 있음을 지지한다.',
      limit: '정량 ground-truth trajectory error, failure rate, compute latency distribution과 parameter sensitivity는 제공하지 않는다. Visual alignment만으로 safety나 absolute accuracy를 인증할 수 없다.',
    },
    {
      label: 'Iteration behavior',
      question: 'First-order linearization을 반복하면 practical하게 빠르게 수렴했는가?',
      intervention: 'Odometry-compounded initial poses에서 relation equations를 linearize하고 GX=B를 푼 뒤 updated poses로 다시 linearize하는 iterative procedure를 사용했다.',
      observation: '저자들은 보통 첫 iteration이 iteration으로 교정 가능한 total pose error의 90% 이상을 고쳤고, four or five iterations에 machine-accuracy limit로 수렴했다고 보고했다.',
      supports: '해당 initialization과 datasets에서 local first-order approximation을 반복하는 방식이 practical convergence를 보였다는 주장을 지지한다.',
      limit: 'Convergence basin, condition number, adversarial initialization, wrong links 또는 nonlinear global optimum 보장은 아니다. 평균/분포 runtime 수치도 아니다.',
    },
    {
      label: 'Scope boundary',
      question: '논문이 해결했다고 주장하지 않은 것은 무엇인가?',
      intervention: 'Introduction과 Discussion의 explicit scope 및 assumptions를 algorithm/evidence와 대조했다.',
      observation: '논문은 registered sensor data로 high-level model을 만드는 문제를 범위 밖으로 두고, robot이 정지해 complete scan을 얻는다고 가정했다. Continuous scanning은 beam별 pose association과 motion model을 요구한다고 명시했다.',
      supports: '논문의 durable claim을 globally consistent scan-pose registration으로 제한하고 modern mapping, deskew, dynamics와 semantic planning을 별도 system layers로 두어야 함을 지지한다.',
      limit: '범위 선언은 후대 기술이 불가능하다는 증거가 아니다. 3D generalization 가능성을 언급하지만 실험적으로 입증하지 않았다.',
    },
  ],
  implementation: [
    'Planar pose convention, angle wrapping, transform direction과 units를 고정하고 synthetic SE(2) composition/inverse tests를 먼저 만든다.',
    '각 scan을 local coordinates, acquisition interval, sensor extrinsic, pose-node ID와 함께 immutable하게 보존한다.',
    'Consecutive nodes 사이 odometry relative pose와 covariance를 weak links로 추가하고 source lineage를 기록한다.',
    'Spatial/appearance candidate retrieval 뒤 pairwise scan matching을 수행해 correspondences, overlap, residual, relative pose와 information eigenvalues를 얻는다.',
    'Overlap, inlier support, degeneracy와 geometric gate를 통과한 relation만 strong link로 추가한다. Place score만으로 loop factor를 만들지 않는다.',
    '첫 pose에 finite prior를 추가하거나 gauge-aware solver policy를 적용하고 disconnected components를 탐지한다.',
    '각 factor residual을 current poses에서 linearize하고 whitened Jacobian/residual contributions를 sparse G/B에 누적한다.',
    'Sparse Cholesky/QR로 correction을 풀고 SE(2) retract, cost decrease, step norm, condition과 NIS를 검사하며 반복한다.',
    'Raw/local scans 또는 submaps를 optimized poses로 다시 배치하고 old map revision을 immutable하게 폐기한다.',
    'True/false loop, corridor degeneracy, biased covariance, missing anchor, disconnected graph와 poor initialization fixtures로 regression tests를 만든다.',
    'Dense batch inverse 대신 sparse incremental/fixed-lag solver를 선택하더라도 factor provenance, covariance semantics와 relinearization policy를 보존한다.',
    'Map, occupancy, semantic tracks, goals, global path와 PlanningScene을 one revision transaction으로 갱신하고 local odom continuity를 별도 검증한다.',
  ],
  assumptions: [
    'Pairwise scan matching links가 같은 physical geometry를 연결하며 large outliers가 제거되어 있다.',
    'Relative measurement errors를 practical formulation에서 mutually independent zero-mean Gaussian으로 근사할 수 있다.',
    'Initial poses가 first-order SE(2) linearization의 useful basin 안에 있다.',
    'Overlap measure와 correspondence set이 relation covariance를 추정하기에 충분한 geometry를 가진다.',
    'Robot은 각 complete 2D scan 동안 정지하고 sensor extrinsic이 고정되어 있다.',
    '한 anchored pose와 connected relation graph가 나머지 pose variables를 구속한다.',
    'Local scan data와 relation provenance를 global solve 후에도 다시 등록할 수 있게 보존한다.',
  ],
  failures: [
    'Perceptual aliasing의 false strong link는 작은 reported covariance와 함께 graph 전체를 잘못 접을 수 있다.',
    'Parallel corridor나 symmetric geometry는 relative pose의 한 축을 약하게 관측해 MtM을 ill-conditioned하게 만든다.',
    'Correlated scan matches와 shared odometry evidence를 independent links로 더하면 covariance가 과도하게 작아진다.',
    'Poor initialization은 pairwise matching과 global linearization을 모두 잘못된 local minimum으로 보낼 수 있다.',
    'Anchor가 없거나 graph component가 끊기면 normal matrix가 singular하고, 과도하게 강한 prior는 conditioning을 악화시킨다.',
    'Continuous-motion scan을 한 pose에 묶으면 motion distortion이 relation bias로 들어가 global solve가 일관되게 틀린 map을 만든다.',
    '3n by 3n dense inverse와 full covariance 저장은 long trajectory에서 확장되지 않으며 논문의 node-deletion heuristic은 information loss와 suboptimality trade-off가 있다.',
    'Optimized poses만 바꾸고 이미 baked occupancy/semantic scene을 rebase하지 않으면 estimator와 planner가 서로 다른 world revision을 사용한다.',
  ],
  legacy: '이 논문은 오늘날 pose graph SLAM의 중심 사고를 매우 이른 형태로 보여준다. Durable contribution은 특정 scan matcher가 아니라 local frames와 uncertain relative relations를 raw evidence로 보존하고, locations를 variables로 두며, loop conflict를 global optimization으로 모든 poses에 전파한 것이다. Modern systems는 Lie-group factors, sparse Cholesky, iSAM2, fixed-lag smoothing, robust kernels, switchable constraints, submaps와 learned place recognition을 사용하지만 factor provenance, gauge, covariance와 re-registration 책임은 그대로 남는다.',
  nextReading: '다음에는 Smith-Self-Cheeseman의 stochastic map으로 covariance와 correlation의 뿌리를 읽고, factor graph와 iSAM2에서 batch inverse가 sparse incremental relinearization으로 어떻게 바뀌는지 연결한다. 그 뒤 switchable constraints와 GNC를 읽어 false loop closure에 대한 robustness를 별도 축으로 쌓는다.',
  nextLinks: [{ slug: 'robot-localization-slam', label: 'Modern Localization & SLAM으로 올라가기', reason: '이 논문의 batch pose-network 아이디어를 factor graph, incremental relinearization, robust loop closure와 map revision으로 연결한다.' }],
  capabilities: [
    'Incremental scan baking이 loop inconsistency를 왜 repair하기 어려운지 설명한다.',
    'Weak odometry links와 strong scan links를 measurement, covariance와 graph nodes로 구성한다.',
    'Mahalanobis objective, gauge anchor와 linear normal equation의 역할을 유도한다.',
    'SE(2) relation linearization, solve, pose update와 relinearization 순서를 복원한다.',
    '13-pose simulation, 30 real scans/84 links와 convergence 보고가 무엇을 지지하고 무엇을 입증하지 않는지 구분한다.',
    'False association, degeneracy, correlation, initialization, dense scaling과 continuous scanning failure를 진단한다.',
    'Modern factor-graph solver를 쓰더라도 local data provenance와 downstream map revision을 보존한다.',
  ],
};
