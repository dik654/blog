import type { PaperStudySpec } from './FoundationalPaperStudy';
import ZhangConstraintLab from './viz/ZhangConstraintLab';

const raw = String.raw;

export const zhangCameraCalibration2000Spec: PaperStudySpec = {
  shortTitle: 'Flexible Planar Camera Calibration',
  citation: 'Z. Zhang - A Flexible New Technique for Camera Calibration',
  yearVenue: '2000 · IEEE TPAMI 22(11), 1330-1334 · MSR-TR-98-71 full report',
  sourceUrl: 'https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr98-71.pdf',
  appendixUrl: 'https://doi.org/10.1109/34.888718',
  before: 'Metric 3D vision을 위한 camera calibration은 정밀하게 알려진 3D points, 서로 직교한 여러 planes, 또는 정확히 제어한 translation 같은 photogrammetric apparatus에 의존하는 경우가 많았다. Calibration object가 없는 self-calibration은 더 유연하지만 unknowns가 많아 initialization과 robustness가 어려웠다.',
  authorIntent: 'Zhang은 일반 사용자가 비싼 3D rig나 known motion 없이도 인쇄한 평면 pattern을 서로 다른 orientation에서 몇 번 촬영해 camera intrinsics, per-view extrinsics와 radial distortion을 추정하도록 만들려 했다. Photogrammetric calibration의 metric constraint와 self-calibration의 이동 자유도를 절충하는 것이 의도였다.',
  thesis: 'Known 2D pattern plane의 각 image는 plane-to-image homography를 제공한다. Homography가 K로 변형된 rotation columns를 포함한다는 사실과 rotation의 orthogonality/equal-norm을 이용하면 view마다 intrinsics에 대한 두 homogeneous constraints를 얻는다. 여러 orientations의 constraints로 closed-form initialization을 구하고, distortion을 포함한 pixel reprojection likelihood를 nonlinear refinement하면 유연한 camera calibration이 가능하다.',
  reconstruction: [
    { label: 'Observe plane', value: 'M_j ↔ m_ij', note: 'Known 2D target corners와 observed pixels' },
    { label: 'Fit homography', value: 's m = H_i M', note: 'View별 projective mapping과 normalization' },
    { label: 'Recover K', value: 'Vb = 0', note: 'Rotation constraints를 views 전체에 stack' },
    { label: 'Refine model', value: 'min reprojection error', note: 'K, distortion, view poses를 jointly optimize' },
  ],
  mechanism: [
    'Known metric coordinates를 가진 planar pattern을 만들고 camera 또는 pattern을 움직여 orientation이 다른 여러 images를 수집한다.',
    '각 image에서 corresponding target/image corners를 검출한다. DLT(Direct Linear Transform)는 이 대응점들을 homography H_i에 대한 선형 방정식으로 바꾸고, SVD로 잔차가 가장 작은 해를 찾는 초기화 방법이다. 좌표를 먼저 normalize하면 큰 pixel 값 때문에 특정 항이 수치적으로 지배하는 현상을 줄일 수 있다.',
    'Target plane을 Z=0으로 두어 projection을 H_i=K[r_1 r_2 t] 형태로 줄인다.',
    'Rotation columns r_1과 r_2의 dot product가 0이고 두 norm이 같다는 성질을 h_1^T K^{-T}K^{-1}h_2=0과 equal-norm 식으로 바꾼다.',
    'Symmetric matrix B=K^{-T}K^{-1}를 six-vector b로 쓰고 각 homography의 두 linear equations를 Vb=0으로 stack한다.',
    'V의 smallest right singular vector로 b를 구하고 scale을 제거해 focal lengths, principal point와 skew를 복원한다.',
    'K inverse를 각 H_i에 적용해 per-view r_1, r_2, t를 복원하고 noisy rotation을 가장 가까운 valid rotation으로 project한다.',
    'Pinhole initialization에서 ideal points를 계산해 radial k_1, k_2를 linear least squares로 초기화한다.',
    'Intrinsics, distortion과 모든 per-view rotations/translations를 variables로 두고 observed-versus-projected pixel squared error를 Levenberg-Marquardt로 minimize한다.',
    'Parallel-plane/pure-translation pose set, target non-planarity, corner noise와 image coverage를 별도 validation에서 검사한다.',
  ],
  equations: [{
    latex: raw`\underbrace{s\widetilde m}_{\text{영상 관측점}}=\underbrace{K}_{\text{카메라 내부 기하}}\underbrace{[R\mid t]}_{\text{세계에서 카메라로 가는 자세}}\underbrace{\widetilde M}_{\text{3차원 표적점}}`,
    meaning: '일반 pinhole equation이다. Homogeneous scale s 때문에 3D point의 camera-depth scale은 2D projection에서 사라진다. K는 camera 내부의 pixel geometry이고 R,t는 특정 target pose를 camera coordinate로 옮긴다.',
    symbols: [[raw`\widetilde M`, 'World/target frame의 homogeneous 3D point'], [raw`\widetilde m`, 'Observed homogeneous pixel'], ['K', 'Five intrinsic parameters를 담은 upper-triangular matrix'], ['R,t', 'View마다 달라지는 target-to-camera pose']],
  }, {
    latex: raw`\underbrace{H}_{[h_1\ h_2\ h_3]}=\underbrace{K}_{\text{모든 영상이 공유}}\underbrace{[r_1\ r_2\ t]}_{\text{그 영상에서 본 평면 자세}}`,
    meaning: 'Target points가 Z=0에 있으므로 projection에서 r3 column은 곱해지는 coordinate가 항상 0이어서 사라진다. 이 차원 감소가 planar homography를 calibration constraint로 사용할 수 있게 한다.',
    symbols: [['H', 'Target plane coordinate를 image pixel로 보내는 3x3 homography'], [raw`h_1,h_2,h_3`, 'Homography columns'], [raw`r_1,r_2`, 'Rotation matrix의 첫 두 unit columns'], ['t', 'Plane origin의 camera-frame translation']],
  }, {
    latex: raw`\underbrace{h_1^TBh_2}_{\text{두 회전축이 수직이라는 제약}}=0,\qquad \underbrace{h_1^TBh_1-h_2^TBh_2}_{\text{두 회전축 길이가 같다는 제약}}=0,\qquad \underbrace{B}_{\text{내부 기하를 묶은 이차형식}}=K^{-T}K^{-1}`,
    meaning: 'K inverse를 적용한 homography columns는 같은 scale의 r1과 r2다. 따라서 dot product는 0이고 squared norm은 같다. B로 묶으면 unknown intrinsic coefficients에 대해 linear한 두 equations가 된다.',
    symbols: [['B', 'K로부터 만들어지는 symmetric 3x3 matrix'], [raw`h_1^TBh_2`, 'K를 제거한 두 rotation directions의 dot product'], [raw`h_1^TBh_1`, '첫 direction의 squared length'], [raw`h_2^TBh_2`, '둘째 direction의 squared length']],
  }, {
    latex: raw`\underbrace{Vb}_{\text{영상마다 두 개씩 쌓은 동차방정식}}=0,\qquad \underbrace{b^*}_{\text{내부 기하의 초기 방향}}=\underbrace{v_{\min}(V)}_{\text{잔차가 가장 작은 오른쪽 특이벡터}}`,
    meaning: 'n개 views의 두 constraints를 stack하면 2n x 6 matrix V가 된다. b는 homogeneous scale까지밖에 정해지지 않으므로 norm을 고정하고 algebraic residual이 가장 작은 null direction을 SVD로 찾는다.',
    symbols: [['V', '각 homography의 constraint rows를 모은 matrix'], ['b', 'Symmetric B의 six independent entries'], [raw`v_{\min}(V)`, '가장 작은 singular value에 대응하는 right singular vector'], ['n', 'Calibration images의 수']],
  }, {
    latex: raw`\underbrace{\theta^*}_{\text{가능도를 최대로 하는 보정값}}=\operatorname*{argmin}_{\theta}\sum_{i=1}^{n}\sum_{j=1}^{m}\underbrace{\left\lVert m_{ij}-\widehat m(\theta,R_i,t_i,M_j)\right\rVert_2^2}_{\text{영상점 재투영 오차의 제곱합}}`,
    latexCompact: raw`\begin{gathered}
\underbrace{e_{ij}=m_{ij}-\widehat m(\theta,R_i,t_i,M_j)}_{\text{관측점-예측점}}\\[4pt]
\underbrace{\theta^*=\arg\min_\theta\sum_{i,j}\lVert e_{ij}\rVert_2^2}_{\text{재투영 오차 최소화}}
\end{gathered}`,
    meaning: 'Closed-form algebraic solution은 physically meaningful pixel distance를 직접 최소화하지 않는다. 이를 initialization으로 사용하고 K, distortion, per-view pose를 jointly refine하면 independent isotropic Gaussian pixel noise 가정 아래 maximum-likelihood estimate를 얻는다.',
    symbols: [[raw`m_{ij}`, 'Image i에서 관측한 target corner j'], [raw`\widehat m`, 'Current camera model이 예측한 pixel'], [raw`\theta`, 'Intrinsics와 distortion coefficients'], [raw`R_i,t_i`, '각 calibration image의 extrinsic pose']],
  }],
  mechanismViz: ZhangConstraintLab,
  evidence: [
    {
      label: 'Noise & view count',
      question: 'Corner noise와 calibration image 수가 intrinsic recovery에 어떤 영향을 주는가?',
      intervention: '512 x 512 simulated camera, 140 target corners와 known ground truth에서 Gaussian pixel noise를 0.1-1.5 px로 바꾸고, images를 2-16개로 바꾸며 각 setting을 100 trials 평균한다.',
      observation: 'Parameter error는 noise level에 대체로 선형으로 증가했고 image 수가 늘면 감소했으며, 특히 2에서 3 images로 갈 때 큰 개선이 보고되었다. sigma=0.5 px에서 focal errors는 0.3% 미만, principal point errors는 약 1 px였다.',
      supports: '여러 independent views가 noisy homography constraints를 평균하고 closed-form/refined estimate를 안정화한다는 주장을 지지한다.',
      limit: '숫자는 paper의 synthetic camera, target layout, pose distribution과 noise model에 한정되며 modern lens, autofocus, rolling shutter나 robot motion을 포함하지 않는다.',
    },
    {
      label: 'Pose orientation',
      question: 'Target plane orientation diversity가 calibration conditioning에 실제로 중요한가?',
      intervention: '세 planes의 rotation angle을 image plane에 대해 5-75 degrees로 바꾸고 random axes, 0.5 px Gaussian corner noise에서 100 trials를 비교한다.',
      observation: '5-degree setting은 planes가 거의 parallel해 40% trials가 실패했고, 포함된 simulation에서는 약 45 degrees 부근이 가장 좋은 error를 보였다.',
      supports: 'Parallel orientations가 redundant constraints를 만들고 충분한 tilt diversity가 intrinsic observability를 개선한다는 theory를 지지한다.',
      limit: 'Simulation은 large tilt에서 foreshortening으로 corner extraction이 나빠지는 효과를 고려하지 않았으므로 45 degrees를 universal acquisition rule로 해석할 수 없다.',
    },
    {
      label: 'Real data refinement',
      question: 'Closed-form initialization과 distortion-aware nonlinear refinement가 실제 lens image에서 일관된 결과를 내는가?',
      intervention: '640 x 480 CCD camera와 6 mm lens, glass-mounted 8 x 8-square pattern의 five orientations를 사용하고 first 2-5 images 및 all four-image subsets를 비교한다.',
      observation: 'Five-image experiment에서 RMS는 initial 0.881 px에서 final 0.335 px로 줄었고, four-image subsets의 focal, principal point, distortion estimates는 작은 sample deviations를 보였다. Corrected images에서 curved pattern이 straightened됐다.',
      supports: 'Closed-form guess 뒤 joint reprojection refinement와 radial distortion estimation이 실제 dataset에서 fit과 subset stability를 개선한다는 claim을 지지한다.',
      limit: 'Independent metric ground truth가 없고 한 camera/pattern example이므로 low RMS와 straight lines가 absolute 3D robot accuracy를 보장하지 않는다.',
    },
    {
      label: 'Target imprecision',
      question: 'Known planar target라는 가정이 깨지면 어떤 parameters가 민감해지는가?',
      intervention: 'Model points에 random noise를 넣고, spherical/cylindrical systematic non-planarity를 최대 pattern-size 대비 0-10%로 만들어 planar라고 가정한 채 calibration한다.',
      observation: 'Systematic non-planarity가 random point noise보다 더 큰 영향을 보였고 cylindrical bending은 principal point에 특히 큰 bias를 만들었다. 논문 setting에서는 few-percent non-planarity까지 usable하다고 평가했다.',
      supports: 'Target flatness가 단순 제작 detail이 아니라 camera parameter bias의 source라는 점을 지지한다.',
      limit: 'Usable threshold는 task tolerance가 아니라 paper parameter errors에 대한 판단이며, robot grasp accuracy에는 별도 physical validation이 필요하다.',
    },
  ],
  implementation: [
    'Exact metric square size와 target frame corner coordinates를 생성하고 image마다 detected corner order, blur, coverage와 subpixel result를 저장한다.',
    'Target/image coordinates를 normalized한 뒤 each view homography를 DLT/SVD로 추정하고 reprojection residual 및 H condition을 기록한다.',
    'Each H에서 two rows of V를 구성하고 view를 추가할 때 singular spectrum, rank와 null-space gap이 어떻게 변하는지 검사한다.',
    'Smallest right singular vector b에서 K를 복원하고 positive focal lengths, plausible principal point와 zero/skew assumption을 검증한다.',
    'Each H에서 rotation/translation을 복원하고 SVD로 nearest valid rotation을 만든 뒤 det(R)=+1과 target-in-front condition을 확인한다.',
    'Distortion 없는 initialization, linear radial initialization과 full nonlinear refinement를 나눠 각 단계의 per-view/per-region residual vector를 저장한다.',
    'Calibration views 중 하나를 holdout하고 edge-heavy pose, different subsets와 independent known-distance measurements에서 generalization을 검증한다.',
    'Parallel-only poses, bent target, resized image with stale K, changed focus와 edge-missing data를 failure fixtures로 만들어 rejection gate를 테스트한다.',
  ],
  assumptions: [
    'Calibration target의 2D metric point coordinates와 correspondence order를 정확히 안다.',
    'Target가 충분히 planar하고 image capture 동안 target와 camera가 rigid하다.',
    'All views가 같은 intrinsic setting, focus, zoom, resolution geometry와 lens model을 공유한다.',
    'Corner observations의 noise를 independent isotropic Gaussian으로 근사해 squared reprojection error를 likelihood로 사용한다.',
    'Target orientations가 intrinsic parameters를 관측할 만큼 독립적이고 pure translation/parallel-plane degeneracy를 피한다.',
    'Chosen radial/tangential model이 deployment field of view에서 lens mapping을 충분히 표현한다.',
  ],
  failures: [
    'Plane를 translation만 하거나 서로 parallel한 orientations만 수집하면 새로운 intrinsic constraints가 생기지 않는다.',
    'Target의 systematic bending은 low training residual과 함께 biased principal point·distortion을 만들 수 있다.',
    'Image center에 corners가 몰리면 high-order distortion은 edge에서 unconstrained하거나 non-monotonic해질 수 있다.',
    'Autofocus, zoom, temperature, mount stress, resolution·ROI 변경은 기존 K와 distortion contract를 무효화할 수 있다.',
    'Wrong corner indexing, target square-size unit, raw/rectified image mismatch는 plausible matrices와 큰 metric error를 동시에 만들 수 있다.',
    'Aggregate RMS 하나는 edge bias, bad view, parameter instability와 downstream 3D error direction을 숨긴다.',
    'Static global-shutter formulation은 moving rolling-shutter camera의 row-dependent pose와 sensor time offset을 설명하지 않는다.',
  ],
  legacy: 'Zhang method는 inexpensive planar target과 freely moved views를 calibration의 실용 표준으로 만들었고 OpenCV를 포함한 modern toolchains의 기본 절차에 남아 있다. Durable idea는 checkerboard 자체보다 homography-based closed-form initialization과 physically meaningful reprojection refinement의 결합이다. 현대 systems는 richer lens models, fisheye/omnidirectional cameras, robust losses, uncertainty, spatiotemporal calibration과 automated validation을 더하지만 pose diversity와 evidence boundary 문제는 그대로 남는다.',
  nextReading: '이 논문은 한 camera의 pixel을 ray로 되돌릴 내부 기준을 만든다. Camera와 robot hand 사이의 고정 변환, rolling shutter와 clock offset은 상위 Camera Geometry 글에서 먼저 개념과 실패 조건까지 다뤘다. 이제 실제 robot이 움직이면서 여러 시점의 camera ray와 sensor 측정을 합쳐 자기 위치와 map을 함께 고치는 Localization & SLAM으로 올라간다.',
  nextLinks: [{ slug: 'robot-localization-slam', label: 'Localization & SLAM으로 올라가기', reason: '보정된 camera ray를 여러 시점의 motion·sensor evidence와 결합해 현재 pose와 map을 함께 추정하는 다음 단계로 이어간다.' }],
  capabilities: [
    'Planar target에서 H=K[r1 r2 t]가 나오는 차원 감소를 복원한다.',
    'Rotation orthogonality/equal-norm이 view마다 두 intrinsic constraints를 만드는 이유를 설명한다.',
    'Vb=0 closed-form initialization과 reprojection maximum-likelihood refinement의 목적을 구분한다.',
    'Parallel-plane degeneracy, target non-planarity와 edge-coverage failure를 진단한다.',
    'Paper의 simulation·single-camera evidence를 robot deployment accuracy 보장으로 과장하지 않는다.',
  ],
};
