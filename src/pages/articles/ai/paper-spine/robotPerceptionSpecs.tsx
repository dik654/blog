import type { PaperStudySpec } from './FoundationalPaperStudy';
import OctoMapEvidenceLab from './viz/OctoMapEvidenceLab';

const raw = String.raw;

export const octoMap2013Spec: PaperStudySpec = {
  shortTitle: 'OctoMap',
  citation: 'A. Hornung, K. M. Wurm, M. Bennewitz, C. Stachniss, W. Burgard - OctoMap: An Efficient Probabilistic 3D Mapping Framework Based on Octrees',
  yearVenue: '2013 · Autonomous Robots 34, 189-206',
  sourceUrl: 'https://doi.org/10.1007/s10514-012-9321-0',
  appendixUrl: 'https://octomap.github.io/',
  before: 'Point clouds는 sensor endpoints를 직접 저장하지만 free space와 아직 보지 않은 unknown을 구분하지 못하고 측정 수에 따라 memory가 계속 늘었다. Dense 3D grids는 확률 상태를 직접 질의하기 쉽지만 map bounding volume 전체를 fine voxels로 초기화해 large outdoor scene에서 memory가 폭발했다. Elevation·2.5D maps는 효율적이지만 overhang과 general 3D geometry를 표현하지 못했다.',
  authorIntent: '저자들은 flying robot, mobile manipulation, navigation과 exploration이 공통으로 요구하는 probabilistic occupancy, 명시적 free/occupied/unknown, 반복 update, multi-resolution query와 bounded memory를 재사용 가능한 open-source 3D mapping framework 하나로 제공하려 했다.',
  thesis: 'Range endpoint를 occupied로, sensor와 endpoint 사이 ray를 free evidence로 해석하고 이를 bounded log odds로 octree leaves에 누적하면 noisy measurements를 probabilistically fuse하면서 change에 적응할 수 있다. Stable한 같은-state siblings를 prune하고 inner node를 max-child occupancy로 유지하면 compact storage와 conservative multi-resolution collision query를 함께 얻는다.',
  reconstruction: [
    { label: 'Measure ray', value: 'origin → endpoint', note: '통과 volume은 free, reflection endpoint는 occupied' },
    { label: 'Fuse evidence', value: 'L_t = clamp(L_{t-1}+ℓ)', note: '반복 noise는 누적하되 confidence는 bounded' },
    { label: 'Maintain tree', value: '8 children ↔ parent', note: 'Contradiction에는 expand, stable equality에는 prune' },
    { label: 'Query map', value: 'leaf or coarse depth', note: 'Max-child aggregation으로 conservative navigation' },
  ],
  mechanism: [
    'Map volume 전체를 dense하게 만들지 않고 range measurement가 실제로 닿은 octree branches만 필요할 때 생성한다.',
    'Uninitialized volume은 unknown으로 남기고, sensor origin에서 valid endpoint까지 3D ray traversal을 수행한다.',
    '한 point-cloud update 안에서는 traversed cells를 free 후보로, endpoints를 occupied 후보로 모은다.',
    'Shallow-angle discretization에서 endpoint가 다른 ray의 free update로 지워지지 않도록 같은 scan의 occupied endpoint를 우선한다.',
    'Uniform prior P(n)=0.5에서 leaf별 occupancy belief를 log odds로 저장해 inverse sensor model evidence를 덧셈으로 누적한다.',
    '누적값을 lmin과 lmax로 clamp해 confidence를 bounded하게 유지하고 유한한 contradictory measurements로 state가 바뀌게 한다.',
    'Leaf가 바뀔 때 ancestors를 갱신하고 navigation query에는 여덟 children 중 maximum occupancy를 parent value로 사용한다.',
    '여덟 children이 모두 stable하고 같은 discrete occupancy state면 parent 하나로 prune한다.',
    '나중에 parent와 모순되는 observation이 오면 children을 다시 생성해 해당 fine cells를 갱신한다.',
    'Query depth를 제한하면 같은 tree에서 voxel edge length가 큰 coarse map을 얻고 traversal cost를 줄인다.',
  ],
  equations: [{
    latex: raw`\underbrace{L(n)}_{\text{확률을 덧셈 축으로 옮긴 값}}=\log\!\frac{\underbrace{P(n)}_{\text{점유일 확률}}}{\underbrace{1-P(n)}_{\text{비점유일 확률}}}`,
    meaning: 'Odds는 occupied와 not-occupied의 상대 가능성이고 logarithm은 곱셈 형태의 Bayes update를 덧셈으로 바꾼다. P=0.5 uniform prior는 L=0이며 positive는 occupied, negative는 free 쪽 evidence다.',
    symbols: [[raw`P(n)`, 'Voxel node n이 occupied일 probability'], [raw`1-P(n)`, 'Voxel가 occupied가 아닐 probability'], [raw`L(n)`, '저장하고 누적할 log-odds occupancy'], ['0', 'Unknown prior에 쓰는 50:50 log odds']],
  }, {
    latex: raw`\underbrace{L(n\mid z_{1:t})}_{\text{지금까지 누적한 점유 믿음}}=\underbrace{L(n\mid z_{1:t-1})}_{\text{이전 측정까지의 믿음}}+\underbrace{L(n\mid z_t)}_{\text{현재 range의 역센서 증거}}`,
    meaning: 'Precomputed inverse sensor model이면 update loop에서 logarithm이나 multiplication 없이 hit/miss constants를 더할 수 있다. 식은 measurements가 map state에 대해 조건부 독립이라는 occupancy-grid 근사를 사용한다.',
    symbols: [[raw`z_{1:t}`, '시간 t까지의 range measurements'], [raw`L(n\mid z_{1:t-1})`, 'Update 이전 leaf state'], [raw`L(n\mid z_t)`, '현재 beam이 주는 hit 또는 miss evidence'], ['+', 'Log-odds가 Bayes product를 바꾼 additive fusion']],
  }, {
    latex: raw`\begin{aligned}\underbrace{\widetilde L_t(n)}_{\text{clamp 전 임시 믿음}}&=\underbrace{L_{t-1}(n)}_{\text{이전 믿음}}+\underbrace{L(n\mid z_t)}_{\text{현재 range 증거}}\\[5pt]\underbrace{L_t(n)}_{\text{저장할 bounded belief}}&=\max\!\left(\underbrace{l_{min}}_{\text{free 하한}},\min\!\left(\widetilde L_t(n),\underbrace{l_{max}}_{\text{occupied 상한}}\right)\right)\end{aligned}`,
    latexCompact: raw`\begin{gathered}
\underbrace{\widetilde L_t=L_{t-1}+L(n\mid z_t)}_{\text{새 증거 누적}}\\[4pt]
\underbrace{L_t=\operatorname{clip}(\widetilde L_t,l_{min},l_{max})}_{\text{신뢰도 범위 제한}}
\end{gathered}`,
    meaning: 'Clamping은 확률 0이나 1에 끝없이 가까워지는 것을 막아 map이 occasional changes에 적응하게 한다. Stable bounds에 같은-state siblings가 모이면 prune할 수 있지만 bounds 밖 probability detail은 잃는다.',
    symbols: [[raw`l_{min},l_{max}`, 'Use case와 sensor model에 맞춘 log-odds bounds'], [raw`L_{t-1}+L(n\mid z_t)`, 'Clamp 전 temporary belief'], [raw`L_t(n)`, 'Tree에 기록할 current leaf value'], ['max/min', '상하한으로 confidence를 자르는 operators']],
  }, {
    latex: raw`\underbrace{L(n\mid z_t)}_{\text{beam 하나의 voxel evidence}}=\begin{cases}\underbrace{l_{occ}}_{\text{반사 endpoint}}&\text{beam ends in }n\\[2pt]\underbrace{l_{free}}_{\text{beam이 통과}}&\text{beam traverses }n\end{cases}`,
    latexCompact: raw`\begin{gathered}
\underbrace{L(n\mid z_t)}_{\text{beam 증거}}=\\[-1pt]
\begin{cases}
\underbrace{l_{occ}}_{\text{끝점}}&n\text{에서 반사}\\[2pt]
\underbrace{l_{free}}_{\text{통과}}&n\text{을 지나감}
\end{cases}
\end{gathered}`,
    meaning: '논문의 laser experiments는 locc=0.85(P=0.7), lfree=-0.4(P=0.4), lmin=-2(P=0.12), lmax=3.5(P=0.97)를 사용했다. 저자들은 mostly static laser mapping과 occasional change에 맞춘 empirical setting이라고 명시했으므로 RGB-D와 dynamic manipulation에 그대로 복사할 수 없다.',
    symbols: [[raw`l_{occ}`, 'Valid range endpoint의 positive evidence'], [raw`l_{free}`, 'Line of sight가 통과한 volume의 negative evidence'], ['endpoint', 'Surface reflection이라고 가정한 beam 마지막 voxel'], ['traversed', 'Sensor에서 endpoint 전까지 관측한 volume']],
  }, {
    latex: raw`\underbrace{\widehat L(n)}_{\text{coarse parent의 보수적 점유값}}=\underbrace{\max_{i\in\{1,\ldots,8\}}L(n_i)}_{\text{여덟 child 중 가장 occupied인 값}}`,
    meaning: 'Parent volume의 일부라도 occupied child를 가지면 전체 parent를 occupied로 취급해 coarse navigation query에서 obstacle을 놓치지 않는다. 평균 aggregation보다 conservative하지만 obstacle을 coarse voxel 크기만큼 크게 보이게 할 수 있다.',
    symbols: [[raw`n_i`, 'Parent n이 덮는 eight child volumes'], [raw`L(n_i)`, '각 child leaf 또는 inner node의 occupancy log odds'], [raw`\widehat L(n)`, 'Limited-depth traversal에서 질의할 parent value'], ['max', 'False-free보다 false-occupied를 선호하는 aggregation']],
  }],
  mechanismViz: OctoMapEvidenceLab,
  evidence: [
    {
      label: 'Map accuracy',
      question: '누적한 probabilistic map이 사용한 scans와 미사용 scans의 ray states를 일관되게 예측하는가?',
      intervention: 'FR-079 corridor 5 cm, Freiburg campus 10 cm, New College 10 cm maps에서 endpoints는 occupied, ray cells는 free라는 maximum-likelihood state agreement를 측정했다. Cross-validation은 매 5번째 scan을 map building에서 빼고 평가에 사용했다.',
      observation: 'Training-data accuracy는 97.27%, 97.89%, 98.79%였고 cross-validation은 96.00%, 95.80%, 98.46%였다.',
      supports: '해당 laser datasets와 estimated trajectories에서 probabilistic sensor fusion이 observed ray states를 일관되게 보존하고 held-out scans에도 비슷한 state agreement를 보였다는 주장을 지지한다.',
      limit: 'Metric surface error, collision recall, semantic object accuracy, dynamic-scene tracking 또는 independent ground-truth occupancy를 측정한 실험은 아니다. Scan alignment error가 result에 포함된다.',
    },
    {
      label: 'Memory',
      question: 'Sparse octree와 pruning이 dense 3D grid보다 실제로 memory를 줄이는가?',
      intervention: '여러 indoor/outdoor datasets와 resolutions에서 32-bit architecture의 dense grid, uncompressed octree, equal-child pruning, maximum-likelihood pruning과 serialized files를 비교했다.',
      observation: 'Freiburg campus 10 cm는 dense grid 5162.90 MB, uncompressed octree 1257.57 MB, pruned 990.66 MB, maximum-likelihood 504.76 MB였고 lossy file은 13.82 MB였다. 논문은 clamp+pruning이 실험에서 최대 44% 추가 개선을 냈다고 보고했다.',
      supports: 'Unknown volume을 할당하지 않고 coherent free/occupied regions를 hierarchy로 합치면 large sparse environments의 storage를 크게 줄일 수 있음을 지지한다.',
      limit: '32-bit node layout과 2013 implementation 수치이며 serialization의 lossy map과 full probabilistic in-memory map을 같은 fidelity로 비교해서는 안 된다. Confined volume에서는 uncompressed octree가 aligned grid보다 클 수도 있다.',
    },
    {
      label: 'Runtime & scale',
      question: 'Tree lookup overhead에도 real sensor point clouds를 update하고 query할 수 있는가?',
      intervention: 'Single-core Intel i7-2600 3.4 GHz에서 datasets와 resolutions별 beam insertion, full/coarse traversal을 측정했다. Scans는 대체로 90k-250k valid measurements를 포함했다.',
      observation: 'Typical scan integration은 1초 미만이었고, 약 108만 occupied plus 338만 free leaves를 가진 Freiburg campus full map traversal은 51 ms였다. Query cutoff 한 level마다 minimum voxel edge는 두 배가 되고 traversal은 대략 두 배 빨라졌다.',
      supports: '해당 hardware와 datasets에서 sparse hierarchy가 practical offline/near-online update와 multi-resolution traversal을 제공한다는 주장을 지지한다.',
      limit: 'Modern high-rate RGB-D pipeline의 end-to-end deadline, multi-thread contention, GPU perception, PlanningScene synchronization과 worst-case latency는 입증하지 않는다.',
    },
    {
      label: 'Clamp trade-off',
      question: 'Bounded confidence가 compression과 probabilistic fidelity를 어떻게 바꾸는가?',
      intervention: 'Occupancy bounds를 [0,1] no-clamp에서 [0.4,0.6] strong-clamp까지 바꾸고 full map과의 summed KLD 및 memory를 세 datasets에서 비교했다.',
      observation: 'Bounds가 좁아질수록 nodes가 stable state에 빨리 도달해 pruning과 memory가 개선됐지만 KLD가 증가했다. Default [0.12,0.97]는 laser-based mostly-static mapping과 occasional changes에 맞춰 선택됐다.',
      supports: 'Clamping이 단순 numerical trick이 아니라 adaptability와 pruning을 가능하게 하며, 그 대가로 extreme probability information을 잃는다는 주장을 지지한다.',
      limit: 'Default range가 safety optimum이라는 증거가 아니며 dynamic-object decay, correlated RGB-D frames와 task-specific collision costs를 최적화하지 않았다.',
    },
  ],
  implementation: [
    'Known sensor origin, frame, acquisition stamp와 valid range endpoints를 map frame으로 변환하고 invalid/max-range policy를 분리한다.',
    'Leaf resolution, maximum range와 map bounds를 정한 뒤 empty tree에서 uninitialized nodes를 unknown으로 해석한다.',
    'Point cloud 하나마다 endpoints와 traversed voxel keys를 먼저 모아 중복 update를 제거하고 same-scan endpoint-occupied precedence를 적용한다.',
    'Sensor-specific locc, lfree를 validation sequences에서 정하고 uniform prior L=0부터 additive update를 구현한다.',
    'lmin, lmax clamp를 적용하고 occupied threshold 주변의 flip count와 dynamic clearing delay를 unit test한다.',
    'Leaf update 뒤 parent에 maximum child value를 propagate해 depth-limited conservative queries를 구현한다.',
    'Eight stable same-state children의 prune와 contradictory measurement에서 expansion이 probability/state를 보존하는지 property test한다.',
    'Synthetic wall, grazing beam, duplicate point, glass/no-return, moved obstacle와 sensor pose error fixtures로 ray policy를 검증한다.',
    'Dense grid baseline과 accuracy agreement, memory, insert latency, full/coarse traversal, collision false-free/false-block rates를 함께 측정한다.',
    'Static octomap과 semantic dynamic tracks를 별도 layers로 유지하고 atomic PlanningScene version에서 provenance와 freshness를 결합한다.',
  ],
  assumptions: [
    'Sensor origin과 each endpoint가 같은 map frame과 acquisition time에 정확히 변환된다.',
    'Valid endpoint는 obstacle surface reflection이고 origin-to-endpoint line of sight는 free라는 inverse sensor model이 대체로 성립한다.',
    'Measurement updates를 occupancy state에 대해 조건부 독립으로 근사하고 correlated scans의 overconfidence를 별도 제한한다.',
    'Chosen voxel resolution이 task geometry와 pose uncertainty를 표현하기에 충분하다.',
    'Mostly static environment에서는 repeated evidence가 true occupancy에 수렴하고 occasional contradiction은 change를 뜻할 수 있다.',
    'Maximum-child parent value가 target planner의 false-free 비용에 맞는 conservative aggregation이다.',
  ],
  failures: [
    'Wrong sensor pose나 time alignment는 한 surface를 여러 위치에 누적해 두꺼운 벽과 false occupied corridor를 만든다.',
    'Glass, specular, multi-path와 missing depth는 endpoint-is-surface, line-of-sight-is-free 가정을 깬다.',
    '한 scan의 중복 free/occupied updates와 shallow-angle discretization은 얇은 surface에 holes를 만들 수 있다.',
    'Highly correlated frames를 독립 hits처럼 누적하면 clamp에 너무 빨리 도달해 confidence와 compression이 과장된다.',
    'Dynamic objects를 static tree에 장기 누적하면 ghost obstacles가 남고 detector miss만으로 clearing하면 실제 obstacle이 사라진다.',
    'Coarse max-child query는 safe하지만 narrow passages를 false occupied로 막을 수 있다.',
    'OctoMap cell probability를 downstream collision library가 실제로 어떻게 threshold하는지 확인하지 않으면 probabilistic nuance가 사라질 수 있다.',
  ],
  legacy: 'OctoMap은 3D occupancy를 재사용 가능한 open-source data structure와 update pipeline으로 만들었고 ROS/MoveIt ecosystem의 volumetric world representation에 널리 남았다. Durable contribution은 octree 이름 하나가 아니라 explicit unknown, ray-based free evidence, bounded probabilistic fusion, reversible pruning과 multi-resolution conservative query의 결합이다. 이후 systems는 TSDF/ESDF, GPU voxel maps, semantic layers와 learned occupancy를 더하지만 sensor model과 evidence boundary는 여전히 별도로 정의해야 한다.',
  nextReading: 'OctoMap은 static geometry belief의 한 층을 만든다. 다음 글에서는 이 occupancy를 mask·depth·persistent track과 결합해 versioned PlanningScene을 만들고, 그 snapshot을 motion planner가 어떻게 소비하는지 이어서 읽는다.',
  nextLinks: [
    { slug: 'robot-perception-scene-construction', label: 'Robot Perception & Scene Construction', reason: 'Static occupancy를 dynamic track, uncertainty, clearing policy와 원자적 PlanningScene으로 결합한다.' },
    { slug: 'robot-motion-planning', label: 'Robot Motion Planning', reason: '현재 scene version에서 state와 edge를 재검증하고 collision-free path를 찾는 다음 실행 단계로 간다.' },
  ],
  capabilities: [
    'Point cloud·dense grid·octree가 free/occupied/unknown과 memory를 다르게 보존하는 이유를 설명한다.',
    'Range endpoint와 traversed ray에서 inverse sensor evidence를 구성하고 log-odds update를 계산한다.',
    'Clamping이 adaptability와 pruning을 얻는 대신 probability information을 잃는 trade-off를 진단한다.',
    'Max-child multi-resolution query와 stable-sibling pruning/contradiction expansion을 구현 순서로 복원한다.',
    '논문의 accuracy·memory·runtime evidence를 semantic tracking이나 modern safety guarantee로 과장하지 않는다.',
  ],
};
