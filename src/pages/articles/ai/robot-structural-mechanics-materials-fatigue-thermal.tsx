import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  BoltedJointLab,
  CombinedStressLab,
  CorrelationLab,
  FatigueSpectrumLab,
  FeaEvidenceLab,
  LoadPathLab,
  ModalLab,
  SectionGeometryLab,
  StabilityLab,
  StressStrainLab,
  ThermalLab,
} from './robot-structural-mechanics-materials-fatigue-thermal/viz/StructuralMechanicsLabs';

const raw = String.raw;

function GateLedger({ rows }: { rows: Array<{ gate: string; asks: string; evidence: string }> }) {
  return <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">{rows.map((row, index) => <div key={row.gate} className="min-w-0 bg-background p-4"><div className="flex items-start gap-2"><span className="font-mono text-xs font-black text-blue-700/55 dark:text-blue-300/55">{String(index + 1).padStart(2, '0')}</span><p className="text-sm font-black leading-snug">{row.gate}</p></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">질문:</strong> {row.asks}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">닫는 증거:</strong> {row.evidence}</p></div>)}</div>;
}

export default function RobotStructuralMechanicsMaterialsFatigueThermal() {
  return <>
    <BeginnerOpening
      title="로봇 팔은 어디에서 휘고, 어디에서 먼저 지칠까?"
      description="같은 무게라도 팔을 몸 가까이 들 때와 멀리 뻗을 때 부담이 다릅니다. 로봇 구조도 재료 이름만 보고 고를 수 없습니다. 힘이 들어오는 위치, 지나가는 길, 단면 모양, 반복 횟수와 온도를 함께 봐야 합니다."
      familiarScene={<>자를 책상 밖으로 조금 내밀고 누르면 잘 버티지만 길게 내밀면 쉽게 휩니다. 같은 자와 같은 손힘인데도 길이와 고정 위치가 달라졌기 때문입니다. 구조 해석은 먼저 이 '힘이 지나가는 길'을 그리는 일입니다.</>}
      steps={[
        { label: '힘의 길을 그린다', detail: '무게와 충격이 링크, 베어링, 나사와 몸체를 거쳐 바닥으로 가는 경로를 찾습니다.' },
        { label: '휘어짐과 파손을 나눈다', detail: '버티는 힘, 위치 오차, 좌굴과 반복 피로를 서로 다른 기준으로 계산합니다.' },
        { label: '계산을 실물과 맞춘다', detail: '변형, 진동, 온도와 체결력을 측정해 모델이 실제 구조를 설명하는지 확인합니다.' },
      ]}
    />
    <QuestionLead question="수평으로 뻗은 로봇 팔이 가만히 물건을 들 때와, 급가속하거나 부딪히거나 비상 정지할 때 가장 위험한 위치는 항상 같을까?" answer="아닙니다. 힘의 방향, 크기, 작용 위치와 지속 시간이 달라지므로 굽힘, 비틀림, 나사 미끄럼, 좌굴과 피로가 각각 다른 위치와 순간을 고를 수 있습니다. 먼저 모든 힘이 지나가는 길을 그린 뒤 파손 방식마다 다시 판단해야 합니다." />
    <NlpSection id="load-path" marker="01" tone="blue" question="Actuator가 300 N·m를 낼 수 있으면 link와 housing도 300 N·m만 견디면 될까?" title="구조 설계는 재료표가 아니라 하중이 들어오고 빠져나가는 경로에서 시작한다">
      <p><Link className="font-semibold underline underline-offset-4" to={articlePath('ai', 'robot-actuator-mechanics-transmission-holding-brake')}>Actuator Mechanics</Link>에서는 housing과 link의 강성을 등가 숫자로 넣었습니다. 이제 그 숫자를 실제 geometry와 material로 되돌립니다. 첫 단계는 finite element mesh가 아니라 <strong>system boundary, coordinate, reference plane and load-case ledger</strong>입니다.</p>
      <p>자유물체도(free-body diagram, FBD)는 잘라낸 물체에 작용하는 외력과 반력을 모두 표시한 그림입니다. Payload force를 bearing plane으로 옮기면 같은 force와 함께 moment가 생깁니다. 다른 cut으로 이동할 때는 그 cut의 내부 resultant가 새로 나타나지만 같은 reaction을 두 번 더하지 않습니다.</p>
      <p>Point load가 아니라 길이·면적에 퍼진 load나 traction에서 이 resultant를 만드는 과정이 막히면 <InternalLink slug="integrals-fields-conservation">적분·장·보존법칙</InternalLink>의 density × measure, 합력과 first moment를 먼저 읽습니다.</p>
      <MathFormula display>{raw`\underbrace{\sum \mathbf F}_{\text{모든 외력과 반력의 합}}=\mathbf 0,\qquad \underbrace{\sum \mathbf M_O}_{\text{기준점 O에 대한 모멘트 합}}=\mathbf 0`}</MathFormula>
      <FormulaNote meaning="Static equilibrium의 두 조건입니다. Dynamic case에서는 inertia force/moment를 포함한 D'Alembert form 또는 full equations of motion을 씁니다. 힘의 합만 맞으면 offset load가 만드는 moment를 놓치므로 기준점 O와 좌표 방향을 함께 고정합니다." symbols={[[raw`\mathbf F`, '선언한 좌표계의 force vector [N]'], [raw`\mathbf M_O`, '기준점 O에 대한 moment vector [N·m]'], [raw`O`, 'Bearing face, link root 또는 fastener-group centroid처럼 명시한 reference point']]} />
      <MathFormula display>{raw`\underbrace{\mathbf M_O}_{\text{기준점 모멘트}}=\underbrace{\mathbf r_{OP}}_{\text{위치 벡터}}\times\underbrace{\mathbf F_P}_{\text{작용 힘}}+\underbrace{\mathbf M_P}_{\text{기존 짝힘}}`}</MathFormula>
      <FormulaNote meaning="Force를 point P에서 O로 옮길 때 equivalent wrench를 보존하는 식입니다. Cross product를 쓰는 이유는 lever arm과 force의 수직 성분만 moment를 만들고 방향은 right-hand rule로 결정되기 때문입니다. Force만 복사하고 r×F를 빼면 bearing와 bolt group load를 과소평가합니다." symbols={[[raw`\mathbf r_{OP}`, 'O에서 P로 향하는 position vector [m]'], [raw`\mathbf F_P`, 'P에서 작용하는 force [N]'], [raw`\mathbf M_P`, 'P에 이미 작용하는 free moment [N·m]']]} />
      <ConceptPrimer items={[
        { term: 'Load case', meaning: 'Pose, payload, acceleration, contact, braking, temperature와 fault를 한 상태로 묶은 계산 단위.', why: 'Yield, fatigue, buckling와 slip의 critical case가 서로 다를 수 있습니다.' },
        { term: 'Load path', meaning: 'Force and moment가 payload에서 link, bearing, housing, fastener and base로 전달되는 연속 경로.', why: '경로가 끊기거나 shortcut되면 계산한 stress가 실제 부품을 가리키지 않습니다.' },
        { term: 'Section cut', meaning: '구조를 가상으로 잘라 내부 axial force, shear, bending and torsion resultants를 드러내는 연산.', why: '외부 wrench를 local section stress와 연결합니다.' },
        { term: 'Reference plane', meaning: 'Bearing load, moment arm and displacement를 보고하는 고정된 기하 기준.', why: 'Vendor rating plane과 robot CAD plane의 offset을 숨기지 않습니다.' },
      ]} />
      <LoadPathLab />
      <Takeaway>모든 뒤 수식은 FBD에서 얻은 resultant를 입력으로 받습니다. 잘못된 load path에 정교한 material model과 fine mesh를 얹어도 답은 정교하게 틀립니다.</Takeaway>
    </NlpSection>

    <NlpSection id="stress-strain" marker="02" tone="teal" question="Force, stress, strain과 displacement는 왜 서로 다른 물리량일까?" title="하중을 단면에 나누고 재료 법칙을 거쳐 측정 가능한 변형으로 내려간다">
      <p>Force는 부품 전체에 작용하는 resultant입니다. Stress는 한 점의 가상 면에 전달되는 force density이며, strain은 길이 변화의 비율입니다. 같은 40 kN이라도 net area가 작으면 stress가 커지고, 같은 stress라도 Young's modulus `E`가 낮으면 strain이 커집니다.</p>
      <MathFormula display>{raw`\underbrace{\sigma_{avg}}_{\text{단면 평균 수직 응력}}=\frac{\underbrace{N}_{\text{축방향 내부력}}}{\underbrace{A}_{\text{순단면적}}}`}</MathFormula>
      <FormulaNote meaning="Axial resultant를 section area에 평균한 nominal normal stress입니다. 나누는 이유는 같은 force가 더 넓은 load-carrying area에 분산될수록 단위 면적당 traction이 작아지기 때문입니다. Hole, fillet, contact와 load introduction 주변의 local distribution은 이 값과 다릅니다." symbols={[[raw`\sigma_{avg}`, '평균 normal stress [Pa 또는 MPa]'], [raw`N`, 'Section normal 방향의 axial force [N]'], [raw`A`, 'Hole 등을 제외한 declared net area [m² 또는 mm²]']]} />
      <MathFormula display>{raw`\underbrace{\varepsilon}_{\text{축방향 변형률}}=\frac{\underbrace{\Delta L}_{\text{길이 변화}}}{\underbrace{L_0}_{\text{초기 게이지 길이}}}`}</MathFormula>
      <FormulaNote meaning="Engineering strain의 정의입니다. Length로 나누는 이유는 크기가 다른 specimen의 deformation을 dimensionless local response로 비교하기 위해서입니다. Large deformation, logarithmic strain or direction-changing motion에서는 strain measure를 다시 선언합니다." symbols={[[raw`\varepsilon`, 'Dimensionless engineering strain [m/m, 흔히 µε]'], [raw`\Delta L`, 'Gauge length change [m 또는 mm]'], [raw`L_0`, 'Unloaded reference length [같은 길이 단위]']]} />
      <MathFormula display>{raw`\underbrace{\sigma}_{\text{선형 탄성 응력}}=\underbrace{E}_{\text{영률}}\underbrace{\varepsilon}_{\text{탄성 변형률}}`}</MathFormula>
      <FormulaNote meaning="Uniaxial linear-elastic Hooke law입니다. E를 곱하는 이유는 material이 같은 strain을 만들기 위해 요구하는 stress slope이기 때문입니다. Yield 이후, viscoelastic polymer, anisotropic composite and temperature-dependent material에는 이 scalar relation을 그대로 쓰지 않습니다." symbols={[[raw`E`, 'Young modulus [Pa 또는 GPa]'], [raw`\sigma`, 'Uniaxial stress [Pa]'], [raw`\varepsilon`, 'Elastic strain']]} />
      <MathFormula display>{raw`\underbrace{\Delta L}_{\text{축방향 변위}}=\frac{\underbrace{NL}_{\text{하중과 길이의 누적 효과}}}{\underbrace{EA}_{\text{축강성 분모}}}`}</MathFormula>
      <FormulaNote meaning="Uniform prismatic bar의 axial displacement입니다. N/(EA)가 strain이고 길이 L을 적분해 displacement를 얻습니다. Variable area/material에서는 ∫N(x)/(E(x)A(x))dx로 확장하며 joint/contact compliance를 별도로 더합니다." symbols={[[raw`L`, 'Uniform segment length [m]'], [raw`EA/L`, 'Segment axial stiffness [N/m]'], [raw`\Delta L`, 'End-to-end elastic displacement [m]']]} />
      <StressStrainLab />
      <Misconception>강한 재료와 단단한 재료는 같은 말이 아닙니다. Yield strength는 permanent deformation 시작을, `E`는 elastic slope를 말합니다. Aluminum과 steel의 yield grade가 달라도 E 차이는 훨씬 작게 변합니다.</Misconception>
    </NlpSection>

    <NlpSection id="section-mechanics" marker="03" tone="violet" question="왜 link 높이를 조금 키우면 굽힘 변위가 크게 줄어들까?" title="Bending에서는 재료의 양보다 neutral axis에서 얼마나 멀리 배치했는지가 중요하다">
      <p>Beam을 굽히면 neutral axis 한쪽은 늘어나고 반대쪽은 줄어듭니다. 축에서 먼 fiber일수록 strain이 크므로 section geometry는 단순 area가 아니라 second moment of area `I`로 들어갑니다. `I`는 mass moment of inertia가 아니며 단위도 `m⁴`입니다.</p>
      <MathFormula display>{raw`\underbrace{\sigma_x(y)}_{\text{높이 y의 굽힘 응력}}=-\frac{\underbrace{M_z}_{\text{단면 굽힘 모멘트}}\underbrace{y}_{\text{중립축에서의 거리}}}{\underbrace{I_z}_{\text{단면 2차 모멘트}}}`}</MathFormula>
      <FormulaNote meaning="Euler-Bernoulli beam의 linear bending stress입니다. y가 곱해지는 이유는 neutral axis에서 멀수록 longitudinal strain이 선형으로 커지기 때문입니다. I로 나누는 이유는 단면 재료가 축에서 멀리 분포할수록 같은 moment를 더 작은 curvature and stress로 나누기 때문입니다." symbols={[[raw`M_z`, 'Section z-axis bending moment [N·m]'], [raw`y`, 'Neutral axis에서 평가 fiber까지 signed distance [m]'], [raw`I_z`, 'z-axis에 대한 area second moment [m⁴]']]} />
      <MathFormula display>{raw`\underbrace{I_z}_{\text{단면의 굽힘 기하}}=\int_A\underbrace{y^2}_{\text{축에서 먼 재료를 더 크게 가중}}\,dA`}</MathFormula>
      <FormulaNote meaning="Area second moment의 정의입니다. y를 제곱해 가중하는 이유는 neutral axis에서 멀리 옮긴 같은 area가 bending resistance에 훨씬 크게 기여하기 때문입니다. Hollow section이 mass 대비 효율적인 이유이지만 local wall buckling과 joint bearing은 별도 gate입니다." symbols={[[raw`dA`, 'Infinitesimal section area [m²]'], [raw`y`, 'Neutral axis distance [m]'], [raw`I_z`, 'Bending geometry integral [m⁴]']]} />
      <MathFormula display>{raw`\underbrace{\delta_{tip}}_{\text{끝단 굽힘 변위}}=\frac{\underbrace{FL^3}_{\text{하중과 길이 세제곱}}}{\underbrace{3EI}_{\text{재료와 단면의 굽힘 강성}}}`}</MathFormula>
      <FormulaNote meaning="끝단 point load를 받는 ideal cantilever의 Euler-Bernoulli result입니다. L³ 때문에 긴 reach가 pose error를 빠르게 키웁니다. Support, distributed load, shear deformation, joint rotation and changing section이 다르면 해당 boundary problem을 다시 적분하거나 energy method/FEA로 확장합니다." symbols={[[raw`F`, 'Cantilever tip transverse force [N]'], [raw`L`, 'Fixed root에서 load point까지 length [m]'], [raw`EI`, 'Flexural rigidity [N·m²]'], [raw`\delta_{tip}`, 'Declared load direction의 tip displacement [m]']]} />
      <SectionGeometryLab />
      <p>Strength gate는 `Mc/I`가 allowable 아래인지 묻습니다. Stiffness gate는 tool-point error, alignment, bearing contact와 controller model에 충분히 작은 deformation인지 묻습니다. 둘은 같은 `I`를 공유하지만 acceptance threshold가 다릅니다.</p>
    </NlpSection>

    <NlpSection id="combined-loading" marker="04" tone="amber" question="Link root가 동시에 굽고 비틀릴 때 어느 stress를 material yield와 비교할까?" title="Torsion과 bending을 같은 점의 stress state로 모은 뒤 failure mechanism에 맞는 기준을 선택한다">
      <MathFormula display>{raw`\underbrace{\tau(\rho)}_{\text{반지름 위치의 비틀림 전단 응력}}=\frac{\underbrace{T}_{\text{비틀림 모멘트}}\underbrace{\rho}_{\text{축에서의 거리}}}{\underbrace{J}_{\text{극단면 2차 모멘트}}}`}</MathFormula>
      <FormulaNote meaning="Circular shaft의 Saint-Venant torsion relation입니다. Radius가 클수록 shear가 커지고 polar moment J가 torque를 분산합니다. Noncircular open section은 warping과 torsional constant가 달라지므로 area polar moment를 그대로 쓰지 않습니다." symbols={[[raw`T`, 'Section torsional moment [N·m]'], [raw`\rho`, 'Shaft center에서 평가점까지 radius [m]'], [raw`J`, 'Circular-section polar second moment [m⁴]'], [raw`\tau`, 'Torsional shear stress [Pa]']]} />
      <MathFormula display>{raw`\underbrace{\sigma_{vm}}_{\text{연성 재료의 등가 응력}}=\sqrt{\underbrace{\sigma^2}_{\text{수직 응력 기여}}+\underbrace{3\tau^2}_{\text{전단 왜곡 에너지 기여}}}`}</MathFormula>
      <FormulaNote meaning="하나의 normal stress와 shear가 있는 plane-stress special case의 von Mises equivalent stress입니다. 제곱하고 합치는 이유는 sign보다 distortional energy magnitude로 isotropic ductile yielding을 비교하기 위해서이며 shear에는 energy-equivalent factor 3이 붙습니다. Brittle, composite, weld fatigue and contact에는 별도 criterion을 사용합니다." symbols={[[raw`\sigma`, '같은 material point의 normal stress [Pa]'], [raw`\tau`, '같은 point의 shear stress [Pa]'], [raw`\sigma_{vm}`, 'Yield strength와 비교하는 von Mises scalar [Pa]']]} />
      <CombinedStressLab />
      <GateLedger rows={[
        { gate: 'Ductile yielding', asks: 'Multiaxial elastic stress가 permanent distortion을 시작하는가?', evidence: 'Temperature/process-adjusted yield allowable + von Mises field' },
        { gate: 'Brittle / maximum principal', asks: 'Tensile crack opening direction이 material limit를 넘는가?', evidence: 'Principal stress와 flaw/environment-specific allowable' },
        { gate: 'Bearing / contact', asks: 'Pin, bolt hole, bearing seat의 local pressure와 subsurface shear가 허용되는가?', evidence: 'Contact geometry, material pair, fit and physical inspection' },
        { gate: 'Fatigue', asks: '반복 stress range and mean이 local detail의 life를 소모하는가?', evidence: 'Surface/notch/process-matched S-N or strain-life data + spectrum' },
      ]} />
    </NlpSection>

    <NlpSection id="local-stability" marker="05" tone="blue" question="FEA maximum stress와 material yield만 통과하면 구조는 안전할까?" title="Local concentration, allowable와 global buckling은 서로 다른 failure gate다">
      <p>Hole과 fillet은 nominal load path를 꺾어 local elastic stress를 키웁니다. Stress concentration factor `K_t`는 geometry and loading에 묶인 elastic ratio입니다. Fatigue notch factor `K_f`, plastic notch response and mesh peak와 같은 숫자가 아닙니다.</p>
      <MathFormula display>{raw`\underbrace{\sigma_{local}}_{\text{탄성 국부 응력}}=\underbrace{K_t}_{\text{형상 응력 집중 계수}}\underbrace{\sigma_{nom}}_{\text{명목 응력}}`}</MathFormula>
      <FormulaNote meaning="Declared notch geometry의 elastic local stress estimate입니다. Kt를 곱하는 이유는 nominal section model이 지운 load-flow curvature를 handbook/solution ratio로 복원하기 위해서입니다. FEA에 notch geometry가 이미 explicit하면 Kt를 다시 곱해 이중 계산하지 않습니다." symbols={[[raw`K_t`, 'Elastic theoretical stress concentration factor'], [raw`\sigma_{nom}`, 'Reference section nominal stress [Pa]'], [raw`\sigma_{local}`, 'Notch-root elastic stress estimate [Pa]']]} />
      <MathFormula display>{raw`\underbrace{MS}_{\text{여유율}}=\frac{\underbrace{S_{allow}}_{\text{조건이 맞는 허용값}}}{\underbrace{FOS\,S_{calc}}_{\text{계수 적용 계산 응답}}}-1`}</MathFormula>
      <FormulaNote meaning="한 가지 aerospace-style margin 표현입니다. Allowable을 계산 응답으로 나누는 이유는 capacity와 demand를 같은 units/state로 비교하기 위해서입니다. FOS 배치와 정의는 governing standard를 따르며 yield, ultimate, buckling and fatigue마다 같은 allowable/FOS를 재사용하지 않습니다." symbols={[[raw`S_{allow}`, 'Material/process/environment/statistics가 맞는 allowable'], [raw`S_{calc}`, '같은 failure mode의 calculated response'], [raw`FOS`, '해당 requirement가 지정한 factor of safety'], [raw`MS`, '0 이상이면 screen pass인 dimensionless margin']]} />
      <MathFormula display>{raw`\underbrace{P_{cr}}_{\text{이상 기둥의 좌굴 하중}}=\frac{\underbrace{\pi^2EI}_{\text{굽힘 강성}}}{\underbrace{(K L)^2}_{\text{유효 길이의 제곱}}}`}</MathFormula>
      <FormulaNote meaning="Straight, slender, elastic column의 Euler bifurcation load입니다. Effective length KL을 제곱으로 나누는 이유는 longer unsupported length가 작은 lateral curvature로 instability를 만들기 때문입니다. Initial crookedness, residual stress, local plate buckling, inelasticity and joint flexibility는 lower real capacity를 만들 수 있습니다." symbols={[[raw`E I`, 'Weak-axis flexural rigidity [N·m²]'], [raw`L`, 'Physical unsupported length [m]'], [raw`K`, 'End restraint를 idealize한 effective-length factor'], [raw`P_{cr}`, 'Ideal elastic critical compression load [N]']]} />
      <StabilityLab />
      <Misconception>가장 큰 FEA stress가 항상 가장 중요한 값은 아닙니다. Sharp re-entrant corner, point constraint and contact edge는 mathematical singularity를 만들 수 있습니다. 실제 failure question에 맞는 distance, path, structural stress, force or fracture parameter를 선택해야 합니다.</Misconception>
    </NlpSection>

    <NlpSection id="bolted-joints" marker="06" tone="teal" question="Bolt는 external load를 전부 직접 받는 막대일까?" title="Preload가 만든 압축 접촉과 여러 stiffness path가 bolt load, slip and separation을 나눈다">
      <p>조립 torque는 bolt를 늘려 preload를 만들고 members를 압축합니다. External tension이 들어오면 일부는 bolt tension을 늘리고 나머지는 member compression을 풀어줍니다. Interface가 붙어 있는 동안에는 bolt and joint stiffness, load introduction position and prying이 이 비율을 결정합니다.</p>
      <MathFormula display>{raw`\underbrace{C}_{\text{단순 강성 분담률}}=\frac{\underbrace{K_b}_{\text{볼트 인장 강성}}}{\underbrace{K_b+K_j}_{\text{볼트와 체결부 강성의 합}}}`}</MathFormula>
      <FormulaNote meaning="Classical two-spring baseline의 external tensile-load fraction입니다. 병렬 compatibility에서 더 부드러운 bolt와 더 단단한 joint가 같은 opening displacement를 공유하므로 stiffness ratio가 load increment를 나눕니다. Actual load-introduction plane, washer/head flexibility, contact and prying은 NASA 2025의 확장처럼 별도 모델이 필요합니다." symbols={[[raw`K_b`, 'Bolt tensile stiffness [N/m]'], [raw`K_j`, 'Clamped-member effective stiffness [N/m]'], [raw`C`, 'Bolt load-increment fraction in the baseline model']]} />
      <MathFormula display>{raw`\underbrace{\Delta F_b}_{\text{볼트 하중 증가}}=\underbrace{n}_{\text{하중 도입 계수}}\underbrace{C}_{\text{강성 분담률}}\underbrace{P}_{\text{외부 인장 하중}}`}</MathFormula>
      <FormulaNote meaning="Load introduction factor n을 명시한 screening form입니다. 곱하는 이유는 external load 전체가 동일한 relieving/clamping path로 들어오지 않기 때문입니다. NASA/TM-20250005284에서는 stiffness-based LIF와 stiffness factor가 독립이 아니며 approximated stiffness가 틀리면 unconservative할 수 있음을 보입니다." symbols={[[raw`P`, 'Joint에 작용하는 external tensile component [N]'], [raw`n`, 'Declared load-introduction factor'], [raw`C`, 'Compatible stiffness load share'], [raw`\Delta F_b`, 'Preload above bolt tensile increment [N]']]} />
      <MathFormula display>{raw`\underbrace{F_{clamp,rem}}_{\text{남은 체결 압축력}}=\underbrace{F_i}_{\text{설치 프리로드}}-\underbrace{(1-nC)P}_{\text{외력이 풀어낸 압축력}}`}</MathFormula>
      <FormulaNote meaning="Linear attached-state screen의 remaining clamp force입니다. 외력 중 bolt로 간 nC 부분을 제외한 만큼 member compression path가 unload된다고 봅니다. 값이 0에 닿으면 interface gapping and nonlinear load-path change가 시작되므로 같은 linear slope를 이후까지 연장하지 않습니다." symbols={[[raw`F_i`, 'Measured or bounded installed preload [N]'], [raw`F_{clamp,rem}`, 'External load 아래 남은 interface compression [N]'], [raw`P`, 'External tensile load [N]']]} />
      <MathFormula display>{raw`\underbrace{V_{slip}}_{\text{마찰로 전달 가능한 전단}}\le\underbrace{\mu}_{\text{접촉 마찰 계수}}\underbrace{F_{clamp,rem}}_{\text{남은 압축력}}`}</MathFormula>
      <FormulaNote meaning="단일 effective interface의 Coulomb friction slip screen입니다. Clamp force를 곱하는 이유는 normal compression이 가능한 tangential friction bound를 만들기 때문입니다. Multiple interfaces, coatings, embedment, vibration, moment and safety standard는 exact slip model/test를 요구합니다." symbols={[[raw`V_{slip}`, 'Interface가 slip 없이 전달해야 하는 shear [N]'], [raw`\mu`, 'Condition-specific interface friction coefficient'], [raw`F_{clamp,rem}`, '해당 interface의 remaining normal clamp [N]']]} />
      <BoltedJointLab />
      <p>NASA Fastener Design Manual은 torque-to-preload가 thread and under-head friction, coating, lubricant, installation method에 민감하다고 강조합니다. `T=KFd` 같은 nut-factor 식은 commissioning estimate이지 preload sensor가 아닙니다. Critical joint는 bolt elongation, ultrasonic tension, load washer or validated process capability로 분포를 확인합니다.</p>
    </NlpSection>

    <NlpSection id="fatigue-spectrum" marker="07" tone="violet" question="Yield 아래 stress가 왜 수만 번 반복되면 균열을 만들까?" title="Peak 하나를 mean·amplitude cycle과 mission spectrum으로 바꿔 life consumption을 계산한다">
      <p>Fatigue는 반복 stress/strain이 local crack initiation and growth를 만드는 과정입니다. 한 cycle은 maximum과 minimum, mean, amplitude and stress ratio를 가집니다. S-N curve는 이 조건과 specimen surface, size, process, environment and survival probability에 묶입니다.</p>
      <MathFormula display>{raw`\begin{aligned}\underbrace{\sigma_m}_{\text{평균 응력}}&=\frac{\underbrace{\sigma_{max}+\sigma_{min}}_{\text{주기 상하한의 합}}}{2}\\[0.6em]\underbrace{\sigma_a}_{\text{교번 응력 진폭}}&=\frac{\underbrace{\sigma_{max}-\sigma_{min}}_{\text{응력 범위}}}{2}\end{aligned}`}</MathFormula>
      <FormulaNote meaning="한 closed cycle을 mean and alternating amplitude로 분해합니다. 2로 나누는 이유는 upper/lower bound의 midpoint와 half-range를 얻기 위해서입니다. 같은 amplitude라도 tensile mean이 크면 crack opening and life가 달라질 수 있어 mean-stress condition을 S-N data와 맞춥니다." symbols={[[raw`\sigma_{max},\sigma_{min}`, 'Local cycle extrema [Pa]'], [raw`\sigma_m`, 'Cycle midpoint/mean stress [Pa]'], [raw`\sigma_a`, 'Half-range alternating stress [Pa]']]} />
      <MathFormula display>{raw`\underbrace{R}_{\text{응력비}}=\frac{\underbrace{\sigma_{min}}_{\text{주기 최솟값}}}{\underbrace{\sigma_{max}}_{\text{주기 최댓값}}}`}</MathFormula>
      <FormulaNote meaning="S-N data의 mean-stress condition을 압축해 표시하는 stress ratio입니다. 나누는 이유는 cycle shape를 scale-independent하게 비교하기 위해서지만 sigma_max가 0에 가까운 cycle에는 부적합합니다. R이 다른 curve를 correction 없이 섞지 않습니다." symbols={[[raw`R`, 'Dimensionless stress ratio'], [raw`\sigma_{min},\sigma_{max}`, 'Same signed local stress component의 extrema']]} />
      <MathFormula display>{raw`\underbrace{D}_{\text{선형 누적 손상}}=\sum_i\frac{\underbrace{n_i}_{\text{실제 적용 횟수}}}{\underbrace{N_i}_{\text{그 조건의 파단 수명}}}`}</MathFormula>
      <FormulaNote meaning="Palmgren-Miner linear damage screen입니다. 각 cycle count를 constant-amplitude life로 나누는 이유는 서로 다른 stress bin을 사용 수명 fraction으로 바꾸어 합하기 위해서입니다. 합은 load order, overload retardation/acceleration, residual stress and crack stage를 지우므로 D=1은 universal failure law가 아닙니다." symbols={[[raw`n_i`, 'Mission에서 bin i가 발생한 counted cycles'], [raw`N_i`, 'Matched S-N condition에서 bin i 단독 적용 시 cycles to criterion'], [raw`D`, 'Order-independent linear life-fraction sum']]} />
      <MathFormula display>{raw`\underbrace{\{n_i,\sigma_{a,i},\sigma_{m,i}\}}_{\text{피로 계산용 주기 목록}}=\underbrace{\operatorname{rainflow}\!\left(\sigma(t)\right)}_{\text{중첩된 반전을 닫힌 주기로 계수}}`}</MathFormula>
      <FormulaNote meaning="Variable-amplitude stress history를 closed reversals and half cycles로 세는 rainflow operation을 개념적으로 표시했습니다. 단순 peak histogram 대신 hysteresis-like nested excursions를 cycle로 보존하기 위해 사용합니다. Sampling, filtering, tensor-to-scalar choice and residual half-cycle handling을 기록해야 재현할 수 있습니다." symbols={[[raw`\sigma(t)`, 'Declared location/component의 time-synchronized stress history'], [raw`n_i`, 'Counted occurrence count'], [raw`\sigma_{a,i},\sigma_{m,i}`, '각 counted cycle의 amplitude and mean']]} />
      <FatigueSpectrumLab />
      <p>Manson, Freche and Ensign(1967)은 conventional linear sum이 high→low and low→high order effect를 표현하지 못한다는 문제에서 시작합니다. 그들의 double-linear rule도 smooth 1/4-inch specimens와 limited two-level tests에 묶입니다. 이 역사적 결과가 주는 교훈은 더 복잡한 식을 맹신하라는 것이 아니라 <strong>load spectrum and model boundary를 evidence로 남기라</strong>는 것입니다.</p>
    </NlpSection>

    <NlpSection id="structural-dynamics" marker="08" tone="amber" question="Static deflection이 작아도 왜 robot arm이 특정 속도에서 크게 흔들릴까?" title="Stiffness와 mass가 mode를 만들고 excitation·damping·controller가 응답 크기를 결정한다">
      <MathFormula display>{raw`\underbrace{\omega_n}_{\text{한 자유도 고유 각주파수}}\approx\sqrt{\frac{\underbrace{k_{eq}}_{\text{모드 방향 등가 강성}}}{\underbrace{m_{eq}}_{\text{모드 방향 등가 질량}}}}`}</MathFormula>
      <FormulaNote meaning="One-mode screening relation입니다. Square root를 쓰는 이유는 inertia force m x¨와 spring force kx가 balance할 때 omega²=k/m이기 때문입니다. Distributed robot structure에서는 mode shape가 mass and stiffness를 가중하므로 physical mass 전체를 그대로 넣지 않습니다." symbols={[[raw`k_{eq}`, 'Declared generalized coordinate의 effective stiffness [N/m]'], [raw`m_{eq}`, '같은 coordinate의 effective/modal mass [kg]'], [raw`\omega_n`, 'Undamped natural angular frequency [rad/s]']]} />
      <MathFormula display>{raw`\underbrace{\zeta}_{\text{감쇠비}}=\frac{\underbrace{c}_{\text{등가 점성 감쇠}}}{\underbrace{2\sqrt{k_{eq}m_{eq}}}_{\text{임계 감쇠}}}`}</MathFormula>
      <FormulaNote meaning="Equivalent viscous damping ratio입니다. Critical damping으로 나누는 이유는 oscillatory/non-oscillatory boundary에 대한 dimensionless damping scale을 얻기 위해서입니다. Bolted joint friction, cable, bearing and polymer damping은 amplitude/frequency dependent할 수 있어 one-zeta model은 measured local approximation입니다." symbols={[[raw`c`, 'Equivalent viscous damping coefficient [N·s/m]'], [raw`2\sqrt{k_{eq}m_{eq}}`, 'Same one-mode system의 critical damping'], [raw`\zeta`, 'Dimensionless damping ratio']]} />
      <ModalLab />
      <p>Excitation은 motor electrical/order harmonics, reducer mesh/wave-generator event, trajectory acceleration spectrum, control update and floor/base motion에서 옵니다. “첫 mode의 1/3 이하” 같은 separation rule은 screening heuristic이며 damping, loop transfer and exact harmonic crossing을 대신하지 않습니다.</p>
    </NlpSection>

    <NlpSection id="fea-evidence" marker="09" tone="blue" question="FEA contour가 빨갛고 mesh를 줄일수록 maximum이 커지면 설계는 실패한 것일까?" title="FEA는 답 생성기가 아니라 가정이 분포 응답을 만드는 falsifiable model이다">
      <p>Finite element analysis는 geometry를 작은 interpolation domains로 나누고 equilibrium을 풉니다. 하지만 boundary를 완전 고정하고, contact를 bonded로 바꾸고, bolt preload를 빼고, sharp corner를 그대로 두면 해석은 입력한 이상화를 정확히 풉니다. 현실을 자동으로 복원하지 않습니다.</p>
      <MathFormula display>{raw`\underbrace{\mathbf K(\mathbf u,T,\mathcal C)}_{\text{재료·접촉·온도에 따른 강성}}\underbrace{\mathbf u}_{\text{절점 변위}}=\underbrace{\mathbf f}_{\text{외력과 등가 하중}}`}</MathFormula>
      <FormulaNote meaning="Linear form Ku=f를 contact set C, temperature and displacement dependence까지 표시한 equilibrium skeleton입니다. Matrix solve를 쓰는 이유는 element별 strain-energy relation과 compatibility를 global nodal unknowns로 조립하기 위해서입니다. Nonlinear contact/material에서는 K가 state에 따라 바뀌어 incremental iteration이 필요합니다." symbols={[[raw`\mathbf K`, 'Boundary, material, geometry and contact가 만든 assembled tangent stiffness'], [raw`\mathbf u`, 'Nodal displacement degrees of freedom'], [raw`\mathbf f`, 'Applied, inertial, thermal and constraint-equivalent loads'], [raw`\mathcal C`, 'Active contact/preload state']]} />
      <MathFormula display>{raw`\underbrace{\varepsilon_R}_{\text{반력 평형 오차}}=\frac{\left\lVert\underbrace{\sum\mathbf R+\sum\mathbf F}_{\text{반력과 외력의 잔차}}\right\rVert}{\underbrace{\sum\lVert\mathbf F\rVert}_{\text{하중 크기 기준}}}`}</MathFormula>
      <FormulaNote meaning="Global force-balance diagnostic입니다. Vector residual norm을 total applied magnitude로 나누는 이유는 model scale과 무관한 relative equilibrium error를 보기 위해서입니다. 작은 epsilon_R은 solver equilibrium만 지지하며 boundary, load path and material truth를 증명하지 않습니다." symbols={[[raw`\mathbf R`, 'Constraint/contact reactions [N]'], [raw`\mathbf F`, 'Applied external force vectors [N]'], [raw`\lVert\cdot\rVert`, 'Vector residual magnitude'], [raw`\varepsilon_R`, 'Dimensionless reaction-balance metric']]} />
      <FeaEvidenceLab />
      <GateLedger rows={[
        { gate: 'Model setup', asks: 'Load, boundary, contact, preload, material and temperature가 physical test와 같은가?', evidence: 'Versioned input ledger and independent review' },
        { gate: 'Numerical quality', asks: 'Reaction, energy, deformation shape와 quantity of interest가 stable한가?', evidence: 'Balance + mesh/order/time-step study' },
        { gate: 'Analytical bracket', asks: 'Beam/shaft/spring lower-order model과 scale, sign and trend가 맞는가?', evidence: 'Hand calculation and limiting cases' },
        { gate: 'Physical correlation', asks: 'Strain, displacement, mode and thermal field가 uncertainty 안에서 맞는가?', evidence: 'Calibrated synchronized experiment' },
      ]} />
    </NlpSection>

    <NlpSection id="thermal-mechanics" marker="10" tone="teal" question="Housing 최고 온도가 허용치 아래면 구조와 bearing alignment도 안전할까?" title="Temperature field는 dimension, material property, contact and bolt preload를 함께 바꾼다">
      <p>Heat는 motor copper/iron, reducer friction, bearing, brake and electronics에서 생겨 contact, conduction, convection and radiation path로 빠집니다. 한 점의 maximum temperature는 lubricant or component gate에 필요하지만, alignment and stress에는 spatial gradient와 material CTE mismatch가 더 중요할 수 있습니다.</p>
      <MathFormula display>{raw`\underbrace{\dot Q}_{\text{정상 열유량}}=\frac{\underbrace{\Delta T}_{\text{두 지점의 온도 차}}}{\underbrace{R_{th}}_{\text{열저항}}}`}</MathFormula>
      <FormulaNote meaning="Lumped steady thermal-resistance relation입니다. Temperature difference를 resistance로 나누는 이유는 electrical Ohm law와 같은 linear conduction/convection network에서 heat flow를 얻기 위해서입니다. Transient thermal capacitance, radiation nonlinearity and temperature-dependent conductivity는 확장 model이 필요합니다." symbols={[[raw`\dot Q`, 'Heat-transfer rate [W]'], [raw`\Delta T`, 'Path endpoint temperature difference [K]'], [raw`R_{th}`, 'Declared path의 effective thermal resistance [K/W]']]} />
      <MathFormula display>{raw`\underbrace{\Delta L_{free}}_{\text{자유 열팽창}}=\underbrace{\alpha}_{\text{선팽창 계수}}\underbrace{L}_{\text{기준 길이}}\underbrace{\Delta T}_{\text{온도 변화}}`}</MathFormula>
      <FormulaNote meaning="Uniform temperature change를 받는 unconstrained member의 first-order expansion입니다. Alpha를 곱하는 이유는 material별 unit-length, unit-temperature expansion rate를 실제 length and temperature excursion으로 scale하기 위해서입니다. Temperature gradient에서는 ∫alpha(T)dT along the geometry가 필요합니다." symbols={[[raw`\alpha`, 'Coefficient of thermal expansion [1/K]'], [raw`L`, 'Reference dimension [m]'], [raw`\Delta T`, 'Reference state에서의 uniform temperature change [K]'], [raw`\Delta L_{free}`, 'Constraint가 없을 때 dimension change [m]']]} />
      <MathFormula display>{raw`\underbrace{\sigma_{th}}_{\text{완전 구속 열응력}}=\underbrace{E}_{\text{탄성 기울기}}\underbrace{\alpha\Delta T}_{\text{막힌 자유 열변형률}}`}</MathFormula>
      <FormulaNote meaning="Uniaxial, uniform, linear-elastic and fully restrained upper-bound screen입니다. Free thermal strain alpha Delta T를 E로 stress로 바꾸는 이유는 constraint가 그 strain을 0으로 만들기 위해 반대 elastic strain을 요구하기 때문입니다. Partial restraint, yielding, creep, joint slip and gradient에서는 compatibility model이 달라집니다." symbols={[[raw`\sigma_{th}`, 'Full-restraint thermal stress magnitude [Pa]'], [raw`E`, 'Temperature-relevant Young modulus [Pa]'], [raw`\alpha\Delta T`, 'Suppressed free thermal strain']]} />
      <MathFormula display>{raw`\underbrace{\Delta F_{th}}_{\text{온도에 따른 체결력 변화}}\approx\underbrace{K_{eq}}_{\text{볼트-부재 호환 강성}}\underbrace{(\alpha_j-\alpha_b)L\Delta T}_{\text{서로 다른 자유 팽창량}}`}</MathFormula>
      <FormulaNote meaning="Bolt와 clamped member의 differential expansion이 preload를 바꾸는 screening form입니다. Expansion difference에 compatible stiffness를 곱하는 이유는 조립체가 상대 길이 변화를 허용하지 않을 때 internal force로 바꾸기 때문입니다. NASA 2025 Appendix E처럼 actual load paths and stiffness distributions를 쓰면 sign and magnitude가 달라질 수 있습니다." symbols={[[raw`\alpha_j,\alpha_b`, 'Joint member and bolt effective CTE [1/K]'], [raw`K_{eq}`, 'Compatibility path equivalent stiffness [N/m]'], [raw`L`, 'Effective grip/thermal length [m]'], [raw`\Delta F_{th}`, 'Preload change sign convention에 따른 thermal bolt load [N]']]} />
      <ThermalLab />
      <Misconception>온도 허용치와 열변형 허용치는 다릅니다. Bearing seat가 70 °C를 견뎌도 asymmetric gradient가 axis를 기울이고 preload를 바꾸면 accuracy, friction and fatigue가 먼저 실패할 수 있습니다.</Misconception>
    </NlpSection>

    <NlpSection id="evidence-closure" marker="11" tone="green" question="Hand calculation과 FEA가 일치하면 prototype test는 생략해도 될까?" title="각 model layer를 깨뜨릴 수 있는 물리 측정을 붙여 structural claim을 닫는다">
      <p>서로 비슷한 두 model은 같은 잘못된 boundary를 공유할 수 있습니다. Hand calculation은 scale, sign and governing variable을 검산하고 FEA는 distribution and contact를 확장합니다. Physical test는 fixture를 포함한 실제 구조가 그 가정대로 움직이는지 독립적으로 묻습니다.</p>
      <CorrelationLab />
      <GateLedger rows={[
        { gate: 'Load-path evidence', asks: '실제 force and moment가 계산한 interface로 흐르는가?', evidence: 'Load cell/torque sensor, reactions and synchronized actuator log' },
        { gate: 'Static stiffness evidence', asks: '어느 부재와 joint가 total displacement를 만드는가?', evidence: 'Strain rosette + multi-point laser/dial displacement' },
        { gate: 'Dynamic evidence', asks: 'Mode shape, frequency and damping이 model과 맞는가?', evidence: 'Impact/shaker test with multiple accelerometers' },
        { gate: 'Thermal evidence', asks: 'Heat input, path and gradient가 mission에서 재현되는가?', evidence: 'Power balance + embedded thermocouples/IR emissivity control' },
        { gate: 'Joint evidence', asks: 'Installed preload, slip and settling이 cycle/temperature 뒤 유지되는가?', evidence: 'Bolt tension measurement, witness marks and teardown inspection' },
        { gate: 'Life evidence', asks: 'Spectrum, surface and process가 분석 data와 같은가?', evidence: 'Coupon/detail test, proof/durability run and NDE plan' },
      ]} />
      <CapabilityCheck items={[
        'Robot pose and event를 load-case ledger와 FBD로 바꾼다.',
        'Force, stress, strain, displacement와 stiffness를 구분한다.',
        'Section area와 I가 axial/bending response에 다르게 작용하는 이유를 설명한다.',
        'Bending, torsion, notch, yield and buckling gate를 분리한다.',
        'Bolt preload, stiffness share, slip, separation and load introduction을 계산한다.',
        'Mission history를 cycles, S-N condition and cumulative damage로 내리고 Miner 한계를 말한다.',
        'Static stiffness, mode, excitation and controller bandwidth를 연결한다.',
        'FEA singular peak와 converged structural quantity를 구분한다.',
        'Heat flow를 expansion, thermal stress, alignment and preload drift로 연결한다.',
        'Strain, displacement, modal, thermal and preload evidence로 model을 수정한다.',
      ]} />
      <Takeaway>구조 설계의 최종 산출물은 최대 응력 screenshot이 아닙니다. Load case, 계산 model, source-bound allowable, uncertainty, matched test and revision이 이어진 claim-evidence chain입니다.</Takeaway>
      <SourceNotes sources={[
        { label: 'NASA Fastener Design Manual, RP-1228 (1990)', href: 'https://ntrs.nasa.gov/api/citations/19900009424/downloads/19900009424.pdf', note: 'Preload, torque scatter, fatigue loading, combined load and thermal cycling의 primary reference입니다.' },
        { label: 'NASA/TM-20250005284, Ramsey (2025)', href: 'https://ntrs.nasa.gov/citations/20250005284', note: 'Preloaded bolt load introduction, stiffness paths, thermal load, FEA and experiment comparison의 current research source입니다.' },
        { label: 'NASA TN D-3839, Manson et al. (1967)', href: 'https://ntrs.nasa.gov/api/citations/19670013955/downloads/19670013955.pdf', note: 'Linear damage의 order-effect 한계와 double-linear alternative를 검증한 foundational source입니다.' },
        { label: 'NBS Special Publication 702, Fatigue and Fracture', href: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nbsspecialpublication702.pdf', note: 'S-N, fatigue life, mean and alternating stress vocabulary를 확인하는 공공 reference입니다.' },
      ]} />
      <div className="not-prose mt-8 grid gap-3 sm:grid-cols-3"><Link to={articlePath('ai', 'research-nasa-preloaded-bolt-load-introduction-2025')} className="group rounded-md border border-border p-4 hover:bg-muted/25"><p className="text-xs font-black text-muted-foreground">CURRENT RESEARCH</p><p className="mt-2 flex items-center justify-between gap-3 text-sm font-black">NASA 2025 체결부 load path <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></p></Link><Link to={articlePath('ai', 'paper-manson-double-linear-fatigue-1967')} className="group rounded-md border border-border p-4 hover:bg-muted/25"><p className="text-xs font-black text-muted-foreground">FOUNDATIONAL PAPER</p><p className="mt-2 flex items-center justify-between gap-3 text-sm font-black">Manson 누적 피로 손상 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></p></Link><Link to={articlePath('ai', 'robot-fracture-mechanics-damage-tolerance')} className="group rounded-md border border-border p-4 hover:bg-muted/25"><p className="text-xs font-black text-muted-foreground">NEXT PHYSICAL LAYER</p><p className="mt-2 flex items-center justify-between gap-3 text-sm font-black">균열역학·손상허용 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></p></Link></div>
    </NlpSection>
  </>;
}
