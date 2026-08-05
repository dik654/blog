import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  AccuracyVocabularyLab,
  ActuatorBoundaryLab,
  BackdriveFrictionLab,
  BrakeHandoverLab,
  DualEncoderObservabilityLab,
  DutyLifeLab,
  JointCommissioningLab,
  OutputBearingLoadLab,
  RatioWorkbenchLab,
  ReflectedInertiaLab,
  TorsionalComplianceLab,
  TwoMassResonanceLab,
} from './robot-actuator-mechanics-transmission-holding-brake/viz/ActuatorMechanicsLabs';

const raw = String.raw;

function BoundaryRows({ items }: { items: Array<{ claim: string; proves: string; stillNeeds: string }> }) {
  return <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">{items.map((item, index) => <div key={item.claim} className="min-w-0 bg-background p-4"><div className="flex items-start gap-2"><span className="font-mono text-xs font-black text-blue-700/55 dark:text-blue-300/55">{String(index + 1).padStart(2, '0')}</span><p className="text-sm font-black leading-snug">{item.claim}</p></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">이 증거가 말하는 것:</strong> {item.proves}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">아직 필요한 것:</strong> {item.stillNeeds}</p></div>)}</div>;
}

function DecisionSteps({ items }: { items: Array<{ label: string; action: string; reject: string }> }) {
  return <ol className="not-prose my-6 grid gap-2">{items.map((item, index) => <li key={item.label} className="grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-3 border-b border-border py-3"><span className="font-mono text-lg font-black text-blue-700/40 dark:text-blue-300/40">{String(index + 1).padStart(2, '0')}</span><div><p className="text-sm font-black">{item.label}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.action}</p><p className="mt-2 text-xs font-semibold leading-relaxed">Reject · {item.reject}</p></div></li>)}</ol>;
}

export default function RobotActuatorMechanicsTransmissionHoldingBrake() {
  return <>
    <BeginnerOpening
      title="작은 모터의 회전이 로봇 팔의 힘이 되기까지"
      description="모터는 빠르게 돌지만 힘은 작을 수 있습니다. 감속기는 속도를 낮추고 힘을 키웁니다. 그러나 그 사이에서 마찰로 힘이 줄고, 축이 비틀리고, 베어링이 옆힘을 받으며, 전원이 꺼지면 별도의 브레이크가 팔을 붙잡아야 합니다."
      familiarScene={<>자전거의 낮은 기어는 페달을 더 많이 돌리는 대신 언덕을 쉽게 오르게 합니다. 기어가 힘을 공짜로 만드는 것이 아니라 속도와 힘을 맞바꾸는 것입니다. 로봇 관절도 같은 교환에 강성, 마찰, 센서와 고정 장치가 더 붙습니다.</>}
      steps={[
        { label: '속도와 힘을 바꾼다', detail: '감속비가 모터의 빠른 회전을 느린 관절 회전과 큰 힘으로 바꿉니다.' },
        { label: '휘고 흔들리는 양을 센다', detail: '기어와 축의 탄성, 관성과 마찰이 실제 위치와 공진을 바꿉니다.' },
        { label: '멈춘 뒤도 지킨다', detail: '베어링과 기계 브레이크가 하중을 버티는지 별도의 증거로 확인합니다.' },
      ]}
    />
    <QuestionLead question="모터가 3 N·m의 회전력을 만들고 100:1 감속기를 붙이면, 로봇 팔 끝에서 언제나 정확히 300 N·m를 얻을까?" answer="아닙니다. 감속기는 속도와 힘을 바꾸지만 손실, 허용 하중, 비틀림, 베어링 힘, 센서 위치와 브레이크 동작까지 결정하지는 않습니다. 이 글은 모터 숫자와 실제 관절 사이에서 빠지는 조건을 차례로 복원합니다." />
    <NlpSection id="physical-boundary" marker="01" tone="blue" question="3 N·m motor와 100:1 reducer를 결합하면 정말 300 N·m joint가 될까?" title="관절은 이상적 토크 배수가 아니라 여러 한계가 교차하는 물리 plant다">
      <p>Robot software는 joint를 angle, velocity, torque 세 숫자로 다룹니다. 실제 관절에서는 그 숫자가 motor current에서 시작해 rotor와 coupling을 가속하고, reducer를 비틀고, bearing을 통과해 payload를 움직입니다. 이 사이에는 energy loss, direction reversal, elastic storage, resonance와 시간 지연이 있습니다. 따라서 첫 계산은 torque multiplication이 아니라 <strong>물리 경계와 reference side를 선언하는 일</strong>입니다.</p>
      <p>`Motor side` 값과 `output side` 값을 같은 식에 섞으면 단위가 맞아도 의미가 틀립니다. 예를 들어 motor encoder의 각도를 output torque와 직접 곱하거나, output inertia를 ratio 변환 없이 rotor inertia에 더하면 존재하지 않는 plant를 만듭니다. 모든 symbol에 `m`과 `o`를 붙이고, 감속비 정의까지 적은 뒤에만 변환합니다.</p>
      <ConceptPrimer items={[
        { term: 'Reference side', meaning: 'Torque, speed, inertia와 angle을 motor shaft 또는 reducer output 중 한쪽에 모아 표현하는 기준.', why: 'Ratio가 quantity마다 다른 거듭제곱으로 작용하므로 혼합 계산을 막습니다.' },
        { term: 'Transmission', meaning: 'Motor의 speed·torque를 link에 맞게 바꾸는 reducer, coupling, shaft와 compliance의 집합.', why: 'Gear tooth만이 아니라 실제 load path 전체가 joint behavior를 만듭니다.' },
        { term: 'Output bearing', meaning: 'Reducer output과 link 사이에서 radial·axial force와 tilting moment를 지지하는 bearing.', why: '전달 torque가 허용돼도 offset payload가 bearing을 먼저 제한할 수 있습니다.' },
        { term: 'Holding brake', meaning: '전원이 사라질 때 spring 등으로 체결되어 정지 축을 유지하는 장치.', why: '운전 중 감속, STO, gravity hold를 한 기능으로 오해하지 않게 합니다.' },
      ]} />
      <ActuatorBoundaryLab />
      <Takeaway>Controller의 `u`가 실제 plant에 들어가기 전에 motor, transmission, sensing, bearing와 holding boundary를 닫습니다. 이 글은 <Link className="font-semibold underline underline-offset-4" to={articlePath('ai', 'robot-dynamics-feedback-control')}>Feedback Control</Link>이 가정한 plant를 물리 부품과 측정값으로 내려주는 층입니다.</Takeaway>
    </NlpSection>

    <NlpSection id="ratio-power" marker="02" tone="teal" question="감속비를 높이면 torque만 커지고 나머지는 그대로일까?" title="Ratio는 torque와 speed를 맞바꾸며 효율 손실 뒤에도 power를 만들지 않는다">
      <p>이 글에서 감속비 `i`는 motor speed를 output speed로 나눈 값으로 정의합니다. `i=100`이면 motor가 100 rad 회전할 때 ideal output은 1 rad 회전합니다. 다른 자료가 reciprocal convention을 쓰면 식 전체가 뒤집히므로 숫자보다 정의를 먼저 확인합니다.</p>
      <MathFormula display>{raw`\underbrace{i}_{\text{감속비}}=\frac{\underbrace{\omega_m}_{\text{모터 각속도}}}{\underbrace{\omega_o}_{\text{출력 각속도}}}`}</MathFormula>
      <FormulaNote meaning="Motor shaft와 output shaft의 angular velocity ratio입니다. 같은 sign convention과 steady kinematic relation을 가정합니다. Catalog ratio와 실제 transmission error는 구분하며, 역방향 표기를 쓰는 자료에서는 정의를 변환해야 합니다." symbols={[[raw`i`, 'Dimensionless reduction ratio'], [raw`\omega_m`, 'Motor-side angular velocity [rad/s]'], [raw`\omega_o`, 'Output-side angular velocity [rad/s]']]} />
      <MathFormula display>{raw`\underbrace{\omega_o}_{\text{출력 속도}}=\frac{\underbrace{\omega_m}_{\text{모터 속도}}}{\underbrace{i}_{\text{속도를 나누는 비율}}}`}</MathFormula>
      <FormulaNote meaning="Ratio가 커질수록 같은 motor speed에서 output speed는 낮아집니다. Torque requirement만 보고 ratio를 높이면 cycle time과 motor maximum speed가 새 제한이 됩니다. 순간 acceleration과 compliance는 이 kinematic 식에 별도로 더합니다." symbols={[[raw`\omega_o`, 'Reducer output speed [rad/s]'], [raw`\omega_m`, 'Motor rotor speed [rad/s]'], [raw`i`, 'Declared reduction ratio']]} />
      <p>Ideal lossless reducer에서는 virtual work와 power conservation 때문에 speed를 줄인 만큼 torque가 커집니다. 실제 reducer는 tooth/rolling contact, seal, lubricant와 preload에서 heat를 냅니다. Efficiency는 하나의 badge가 아니라 방향, speed, load와 temperature의 함수입니다.</p>
      <MathFormula display>{raw`\underbrace{\tau_o}_{\text{실제 출력 토크}}=\underbrace{\eta(i,\omega,\tau,T)}_{\text{운전점 효율}}\,\underbrace{i\tau_m}_{\text{이상적 토크 변환}}`}</MathFormula>
      <FormulaNote meaning="Motor-driven 방향의 first-order output torque relation입니다. Eta는 exact reducer와 operating point에서 확인해야 하며 load-driven/backdrive 방향에는 같은 값을 그대로 쓰지 않습니다. 이 식은 reducer와 bearing의 individual torque ratings, acceleration loss와 thermal limit를 대체하지 않습니다." symbols={[[raw`\tau_m`, 'Motor shaft torque [N·m]'], [raw`\tau_o`, 'Reducer output torque [N·m]'], [raw`\eta`, 'Declared direction and operating point의 efficiency, 0 < eta <= 1']]} />
      <MathFormula display>{raw`\underbrace{P_o}_{\text{출력 기계 동력}}=\underbrace{\tau_o\omega_o}_{\text{출력 토크와 속도}}=\underbrace{\eta\tau_m\omega_m}_{\text{입력 동력에서 손실을 제외}}`}</MathFormula>
      <FormulaNote meaning="Rotational mechanical power relation입니다. Ratio가 ideal torque와 speed를 반대로 바꿔 power는 보존하고, eta가 loss를 나타냅니다. Transient stored energy와 sign-changing regenerative flow에서는 instantaneous sign과 energy integral을 함께 봅니다." symbols={[[raw`P_o`, 'Output mechanical power [W]'], [raw`\tau\omega`, 'Declared shaft의 instantaneous rotational power [W]'], [raw`1-\eta`, 'Simplified fractional loss; exact loss map은 별도']]} />
      <RatioWorkbenchLab />
      <Misconception>높은 ratio가 항상 좋은 inertia match를 만드는 것도 아닙니다. Reflected load는 줄지만 motor speed, reducer input speed, friction, compliance와 output speed requirement가 동시에 달라집니다. Ratio는 trade space의 한 축입니다.</Misconception>
    </NlpSection>

    <NlpSection id="reflected-inertia" marker="03" tone="violet" question="Motor가 느끼는 payload inertia는 robot pose와 ratio에 따라 어떻게 달라질까?" title="Inertia를 같은 side로 반사해야 acceleration torque와 controller 난이도가 보인다">
      <p>Output load가 angle `theta_o`만큼 움직일 때 motor는 `i theta_o`만큼 움직입니다. Energy가 같아야 하므로 motor side에서 보이는 load inertia는 ratio의 제곱으로 줄어듭니다. Torque는 ratio 1승, inertia는 2승으로 변환된다는 차이가 중요합니다.</p>
      <MathFormula display>{raw`\underbrace{J_{L\rightarrow m}}_{\text{모터 쪽으로 반사한 부하 관성}}=\frac{\underbrace{J_L}_{\text{출력 부하 관성}}}{\underbrace{i^2}_{\text{감속비의 제곱}}}`}</MathFormula>
      <FormulaNote meaning="Kinetic energy를 motor side로 옮긴 ideal rigid-ratio relation입니다. Load inertia JL은 현재 robot configuration과 output axis에 대한 값이어야 합니다. Reducer compliance, efficiency와 internal moving parts는 이 한 항에 숨기지 말고 별도 모델/식별로 추가합니다." symbols={[[raw`J_L`, 'Output axis에 대한 payload and link inertia [kg·m²]'], [raw`J_{L\rightarrow m}`, 'Motor shaft에 reflected load inertia [kg·m²]'], [raw`i`, 'Motor speed/output speed ratio']]} />
      <MathFormula display>{raw`\begin{aligned}\underbrace{J_{m,base}}_{\text{모터 속도로 도는 관성}}&=\underbrace{J_m}_{\text{회전자}}+\underbrace{J_{coupling}}_{\text{브레이크·커플링}}+\underbrace{J_{gear,in}}_{\text{감속기 입력부}}\\\underbrace{J_{m,tot}}_{\text{모터 쪽 전체 관성}}&=J_{m,base}+\underbrace{\frac{J_L}{i^2}}_{\text{반사 부하}}\end{aligned}`}</MathFormula>
      <FormulaNote meaning="Controller와 motor acceleration이 보는 same-side inertia ledger를 두 단계로 썼습니다. Brake hub, coupling와 reducer input inertia를 빼면 acceleration torque를 과소평가합니다. 실제 reducer distributed inertia는 vendor model 또는 frequency-response identification이 더 적합할 수 있습니다." symbols={[[raw`J_m`, 'Rotor inertia [kg·m²]'], [raw`J_{coupling}`, 'Motor-speed components의 equivalent inertia [kg·m²]'], [raw`J_{gear,in}`, 'Declared motor-side reducer inertia [kg·m²]'], [raw`J_{m,base}`, 'Motor speed로 도는 known base inertia의 합 [kg·m²]']]} />
      <MathFormula display>{raw`\underbrace{\tau_m}_{\text{필요 모터 토크}}=\underbrace{J_{m,tot}\alpha_m}_{\text{가속 토크}}+\underbrace{\frac{\tau_g}{i\eta}}_{\text{출력 중력 부하}}+\underbrace{\tau_f}_{\text{마찰}}+\underbrace{\tau_d}_{\text{외란}}`}</MathFormula>
      <FormulaNote meaning="Declared positive direction에서 motor-side torque demand를 분해한 screening equation입니다. Gravity torque의 sign은 pose와 travel direction에 따라 motoring 또는 regenerative가 되고 efficiency placement도 power-flow direction에 따라 달라집니다. Controller dynamics와 compliance torque는 뒤 section에서 확장합니다." symbols={[[raw`\alpha_m`, 'Motor angular acceleration [rad/s²]'], [raw`\tau_g`, 'Output-axis gravity torque [N·m]'], [raw`\tau_f,\tau_d`, 'Motor-side equivalent friction and disturbance torque [N·m]']]} />
      <ReflectedInertiaLab />
      <p>고정된 `5:1` 같은 inertia-ratio 숫자는 controller bandwidth와 application을 빠르게 검토하는 heuristic일 수 있지만 stability theorem은 아닙니다. 매우 큰 mismatch도 충분한 ratio, stiffness, sensing과 controller로 다룰 수 있고, 작은 mismatch도 flexible mode와 delay가 나쁘면 불안정할 수 있습니다.</p>
    </NlpSection>

    <NlpSection id="duty-life" marker="04" tone="amber" question="Peak torque를 견딘 한 번의 동작이 왜 반복 운전에서는 실패할까?" title="Mission profile을 시간축으로 펼쳐 peak·RMS·speed·life의 서로 다른 clock을 검사한다">
      <p>Robot cycle은 가속, gravity hold, reverse, contact shock와 idle로 구성됩니다. 가장 큰 torque 하나는 shaft의 순간 event를 보여주지만 winding과 reducer의 heat, lubricant와 bearing fatigue에는 각 load가 지속된 시간이 필요합니다. 반대로 RMS가 낮아도 아주 짧은 shock가 momentary limit 또는 static bearing limit를 넘을 수 있습니다.</p>
      <MathFormula display>{raw`\underbrace{\tau_{RMS}}_{\text{주기 전체 등가 토크}}=\sqrt{\frac{\underbrace{\sum_k \tau_k^2t_k}_{\text{토크 제곱을 시간으로 누적}}}{\underbrace{\sum_k t_k}_{\text{전체 주기 시간}}}}`}</MathFormula>
      <FormulaNote meaning="Piecewise-constant cycle의 root-mean-square torque입니다. Torque sign은 heating에서 제곱되어 사라지지만 regenerative energy와 bearing direction에는 sign이 남습니다. Exact manufacturer thermal/life procedure의 torque side, allowed interval과 duty factor를 그대로 따라야 합니다." symbols={[[raw`\tau_k`, 'Segment k의 declared-side torque [N·m]'], [raw`t_k`, 'Segment duration [s]'], [raw`\tau_{RMS}`, 'Same cycle의 RMS torque [N·m]']]} />
      <MathFormula display>{raw`\underbrace{\bar\omega}_{\text{절댓값 평균 속도}}=\frac{\underbrace{\sum_k|\omega_k|t_k}_{\text{회전량 누적}}}{\underbrace{\sum_k t_k}_{\text{전체 주기 시간}}}`}</MathFormula>
      <FormulaNote meaning="방향이 바뀌는 cycle에서 absolute speed를 time-average한 한 가지 vendor-style screen입니다. 어떤 catalog는 다른 weighting이나 bearing-specific input speed를 요구하므로 이 식을 universal life equation으로 쓰지 않습니다. Maximum speed와 resonance crossing은 별도 제한입니다." symbols={[[raw`\omega_k`, 'Segment k angular speed [rad/s]'], [raw`\bar\omega`, 'Declared averaging procedure의 mean absolute speed [rad/s]']]} />
      <DutyLifeLab />
      <BoundaryRows items={[
        { claim: 'Motor continuous / peak', proves: 'Electrical·thermal drive envelope 안에서 motor torque를 낼 수 있는가', stillNeeds: 'Reducer torque category, life, bearing와 brake' },
        { claim: 'Reducer rated / repeated peak / momentary', proves: '각 제조사 정의의 load와 duration category 안인가', stillNeeds: '실제 mission histogram과 exact part/ratio condition' },
        { claim: 'RMS torque / average speed', proves: '반복 cycle의 thermal·life screening input', stillNeeds: 'Temperature, lubrication, mounting와 measured load' },
        { claim: 'Emergency / collision event', proves: 'Short-duration overload와 static shock case', stillNeeds: 'Post-event inspection, brake and safety response' },
      ]} />
    </NlpSection>

    <NlpSection id="accuracy-vocabulary" marker="05" tone="blue" question="Catalog의 'zero backlash'는 output angle error가 0이라는 뜻일까?" title="정밀도 용어는 숫자가 아니라 서로 다른 자극과 측정 절차다">
      <p>Backlash는 tooth flank 사이의 free play를 주로 말합니다. Strain-wave gear가 tooth engagement에서 zero backlash를 달성해도 bearing, flexspline, coupling와 구조물은 작은 torque reversal에서 변형되고 마찰 경로를 따라 돌아옵니다. 이때 측정되는 lost motion이나 hysteresis는 0이 아닐 수 있습니다.</p>
      <p>Repeatability는 같은 접근 조건에서 같은 위치로 돌아오는 분산입니다. Bias가 큰 joint도 repeatable할 수 있습니다. Transmission accuracy는 한 회전 동안 ideal ratio에서 벗어나는 periodic angle error를 봅니다. 따라서 `정밀도 1 arcmin`이라는 문장을 만나면 먼저 <strong>무엇을 어떤 torque·방향·fixture로 측정했는지</strong> 묻습니다.</p>
      <AccuracyVocabularyLab />
      <Misconception>Motor-side encoder가 commanded angle로 정확히 돌아왔다고 link도 돌아온 것은 아닙니다. Sensor 뒤에 있는 reducer deformation과 direction-reversal error는 motor encoder loop 밖에 있습니다.</Misconception>
    </NlpSection>

    <NlpSection id="compliance-energy" marker="06" tone="teal" question="Stiffness가 낮으면 단지 position error만 커질까?" title="Compliance는 angle error와 stored energy를 만들며 shock filtering과 recoil을 함께 낳는다">
      <p>Torsional stiffness `K_t`는 torque를 angle deflection으로 바꾸는 local slope입니다. 높은 stiffness는 같은 torque에서 error를 줄이지만 impact와 gearbox torque ripple을 link로 더 직접 전달할 수 있습니다. 낮은 stiffness는 force sensing과 shock tolerance를 돕지만 bandwidth와 maximum force, position accuracy를 희생합니다.</p>
      <MathFormula display>{raw`\underbrace{\delta}_{\text{비틀림 각도}}=\frac{\underbrace{\tau}_{\text{전달 토크}}}{\underbrace{K_t}_{\text{현재 구간의 비틀림 강성}}}`}</MathFormula>
      <FormulaNote meaning="Linear elastic region의 torque-deflection relation입니다. Delta는 radian으로 계산하고 arcmin/degree로 바꿀 때 단위를 명시합니다. Catalog가 K1/K2/K3처럼 piecewise slopes를 주면 current torque region을 선택하고 preload, hysteresis와 mounting compliance를 별도로 확인합니다." symbols={[[raw`\delta`, 'Relative torsional deflection [rad]'], [raw`\tau`, 'Same reference side의 transmitted torque [N·m]'], [raw`K_t`, 'Local torsional stiffness [N·m/rad]']]} />
      <MathFormula display>{raw`\underbrace{E_s}_{\text{저장된 탄성 에너지}}=\frac12\underbrace{K_t}_{\text{탄성 기울기}}\underbrace{\delta^2}_{\text{변형의 제곱}}`}</MathFormula>
      <FormulaNote meaning="Ideal linear torsional spring에 저장된 energy입니다. Energy는 load가 풀릴 때 motion과 oscillation으로 돌아올 수 있고 damping/friction이 일부를 dissipate합니다. Hysteretic or nonlinear spring에서는 loading path를 적분해야 하므로 이 식은 local conservative approximation입니다." symbols={[[raw`E_s`, 'Stored elastic energy [J]'], [raw`K_t`, 'Local torsional stiffness [N·m/rad]'], [raw`\delta`, 'Elastic twist [rad]']]} />
      <p>Reducer catalog stiffness만으로 joint stiffness를 만들면 housing, output bearing seat와 long link의 deformation을 놓칩니다. 같은 torque가 series 부재를 통과하므로 compliance, 즉 stiffness의 역수가 더해집니다.</p>
      <MathFormula display>{raw`\underbrace{\frac1{K_{eq}}}_{\text{전체 컴플라이언스}}=\underbrace{\frac1{K_g}}_{\text{감속기}}+\underbrace{\frac1{K_h}}_{\text{하우징}}+\underbrace{\frac1{K_l}}_{\text{링크}}`}</MathFormula>
      <FormulaNote meaning="같은 torque가 통과하는 ideal series torsional members의 equivalent stiffness입니다. Joint bearing, fastener와 interface compliance를 필요한 만큼 추가합니다. Parallel load path, geometric nonlinearity와 multi-axis coupling은 scalar relation을 넘어선 모델/FEA와 measurement가 필요합니다." symbols={[[raw`K_g`, 'Reducer torsional stiffness [N·m/rad]'], [raw`K_h`, 'Housing/interface equivalent stiffness [N·m/rad]'], [raw`K_l`, 'Link/load-path equivalent stiffness [N·m/rad]']]} />
      <TorsionalComplianceLab />
    </NlpSection>

    <NlpSection id="two-mass-resonance" marker="07" tone="violet" question="Rigid model의 position gain을 높였는데 output oscillation이 더 커지는 이유는 무엇일까?" title="Compliance가 motor와 load를 분리하면 상대 운동 mode가 control bandwidth를 제한한다">
      <p>Rigid model은 motor와 link가 한 inertia처럼 움직인다고 가정합니다. 실제 flexible joint에서는 motor inertia와 load inertia가 spring 양쪽에서 서로 반대로 움직이는 relative mode가 생깁니다. Motor encoder는 motor 쪽 vibration만 보고 link vibration의 phase와 amplitude를 다르게 볼 수 있습니다.</p>
      <MathFormula display>{raw`\underbrace{\omega_r}_{\text{두 관성의 상대 공진}}=\sqrt{\underbrace{K_{eq}}_{\text{연결 강성}}\left(\underbrace{\frac1{J_{m,o}}}_{\text{출력 쪽 모터 관성}}+\underbrace{\frac1{J_L}}_{\text{부하 관성}}\right)}`}</MathFormula>
      <FormulaNote meaning="두 free inertias가 one torsional spring으로 연결된 undamped relative-mode natural frequency입니다. Jm,o와 JL을 모두 output side에 둡니다. Real joint는 damping, motor control, housing/link modes, gravity, friction와 multiple inertias를 포함하므로 sweep-sine/operational identification로 확인합니다." symbols={[[raw`J_{m,o}`, 'Motor/input inertia를 output side로 reflected한 값 [kg·m²]'], [raw`J_L`, 'Output load inertia [kg·m²]'], [raw`\omega_r`, 'Undamped relative mode [rad/s]']]} />
      <MathFormula display>{raw`\begin{aligned}\underbrace{f_n}_{\text{단순화한 고유 진동수}}&=\frac1{2\pi}\sqrt{\frac{\underbrace{K}_{\text{지배 강성}}}{\underbrace{J}_{\text{지배 부하 관성}}}}\\[-0.1em]&\underbrace{\text{단순화 식}}_{\text{다른 관성·하우징 동역학을 무시}}\end{aligned}`}</MathFormula>
      <FormulaNote meaning="Harmonic Drive catalog가 stiffness selection intuition에 사용하는 one-inertia form과 같은 구조입니다. Housing가 훨씬 stiff하고 declared load inertia가 mode를 지배하는 등 source assumptions가 맞을 때만 screen으로 사용합니다. Full two-inertia relation 또는 measured frequency response와 섞어 동일한 proof로 취급하지 않습니다." symbols={[[raw`K`, 'Selected dominant torsional stiffness [N·m/rad]'], [raw`J`, 'Selected dominant inertia [kg·m²]'], [raw`f_n`, 'Simplified natural frequency [Hz]']]} />
      <TwoMassResonanceLab />
      <Takeaway>Control bandwidth를 mode 아래에 둔다는 숫자 하나가 목표가 아닙니다. Excitation spectrum, damping, sensor side, phase delay와 controller shape가 실제 relative mode를 얼마나 밀어 올리는지 확인해야 합니다.</Takeaway>
    </NlpSection>

    <NlpSection id="dual-encoder" marker="08" tone="blue" question="Motor encoder와 output encoder를 함께 달면 어떤 hidden state가 보일까?" title="두 각도의 차이는 link motion과 transmission deflection을 분리하지만 calibration을 요구한다">
      <p>Motor encoder angle을 ideal ratio로 나눈 값은 reducer가 전혀 비틀리지 않았을 때의 output angle prediction입니다. 실제 output encoder를 빼면 reducer, housing와 link interface에 저장된 relative deformation의 estimate가 됩니다. 이 차이를 calibrated stiffness에 곱하면 transmission torque를 추정할 수 있습니다.</p>
      <MathFormula display>{raw`\underbrace{\hat\delta}_{\text{추정 비틀림}}=\underbrace{\frac{\theta_m}{i}}_{\text{모터 각도의 이상적 출력 환산}}-\underbrace{\theta_o}_{\text{실측 출력 각도}}`}</MathFormula>
      <FormulaNote meaning="Motor/output encoders의 aligned and synchronized angles로 relative deformation을 추정합니다. Sign, zero alignment, ratio/transmission error, timestamp, resolution와 filtering delay가 residual에 들어옵니다. Deflection이 모두 elastic이라는 가정도 별도 calibration으로 검증합니다." symbols={[[raw`\theta_m`, 'Motor encoder angle [rad]'], [raw`\theta_o`, 'Output/link encoder angle [rad]'], [raw`\hat\delta`, 'Estimated motor-to-output relative twist [rad]']]} />
      <MathFormula display>{raw`\underbrace{\hat\tau}_{\text{추정 전달 토크}}=\underbrace{K_{cal}}_{\text{보정한 유효 강성}}\underbrace{\hat\delta}_{\text{두 엔코더의 각도 차}}`}</MathFormula>
      <FormulaNote meaning="Calibrated elastic model로 dual-encoder residual을 torque-like estimate로 바꿉니다. Kcal은 load region, direction, temperature와 assembly에 따라 달라질 수 있습니다. Backlash/lost motion, friction와 sensor error가 큰 영역에서는 simple linear estimator가 biased하므로 force/torque sensor와 ground truth로 검증합니다." symbols={[[raw`K_{cal}`, 'Measured effective torsional stiffness [N·m/rad]'], [raw`\hat\delta`, 'Estimated deflection [rad]'], [raw`\hat\tau`, 'Estimated transmitted torque [N·m]']]} />
      <DualEncoderObservabilityLab />
      <BoundaryRows items={[
        { claim: 'Motor encoder only', proves: 'Rotor/input shaft control과 commutation position', stillNeeds: 'Reducer 뒤의 link angle, lost motion와 compliance' },
        { claim: 'Output encoder only', proves: '실제 link angle', stillNeeds: 'Motor-side high-bandwidth state와 internal deflection' },
        { claim: 'Dual encoder residual', proves: '두 shaft 사이의 relative state', stillNeeds: 'Time alignment, scale, stiffness and nonlinearity calibration' },
        { claim: 'Torque sensor', proves: 'Sensor location의 load path torque', stillNeeds: 'Cross-axis load, bandwidth, bias와 link-side distribution' },
      ]} />
    </NlpSection>

    <NlpSection id="output-bearing" marker="09" tone="amber" question="Reducer output torque가 rating 안이면 wrist joint의 bearing도 안전할까?" title="Offset payload는 radial·axial force와 tilting moment로 output bearing을 제한한다">
      <p>Robot link는 reducer output flange에 순수 torque만 주지 않습니다. Payload weight와 contact force가 bearing reference plane에서 떨어져 작용하면 tilting moment가 생깁니다. 같은 force도 link가 길어지면 moment가 커지고 bearing raceway의 load distribution이 달라집니다.</p>
      <MathFormula display>{raw`\underbrace{M}_{\text{기울임 모멘트}}=\underbrace{F}_{\text{작용 힘}}\,\underbrace{r_{\perp}}_{\text{기준점에서 수직 거리}}`}</MathFormula>
      <FormulaNote meaning="Bearing reference point에 대한 force moment의 scalar magnitude입니다. 실제 joint는 radial/axial vector, multiple loads와 3D cross product를 사용합니다. Reducer torque capacity와 output-bearing moment capacity는 다른 ratings이므로 둘을 각각 검사합니다." symbols={[[raw`F`, 'Applied force magnitude [N]'], [raw`r_{\perp}`, 'Force line까지 perpendicular distance [m]'], [raw`M`, 'Tilting/bending moment magnitude [N·m]']]} />
      <MathFormula display>{raw`\underbrace{L_{10}}_{\text{기본 정격 수명}}=\left(\frac{\underbrace{C}_{\text{기본 동정격}}}{\underbrace{P}_{\text{등가 동하중}}}\right)^{\underbrace{p}_{\text{베어링 형식 지수}}}`}</MathFormula>
      <FormulaNote meaning="ISO 281 계열 basic rating life의 normalized relation입니다. L10은 동일 조건 population의 statistical rating-life concept이며 warranty가 아닙니다. Equivalent load P, exponent, units/revolutions conversion과 modification factors는 exact bearing/vendor procedure를 사용하고 static shock는 별도 C0/P0 screen으로 확인합니다." symbols={[[raw`C`, 'Basic dynamic load rating [N]'], [raw`P`, 'Equivalent dynamic bearing load [N]'], [raw`p`, 'Bearing type-dependent life exponent'], [raw`L_{10}`, 'Basic rating life in declared normalized units/revolutions']]} />
      <OutputBearingLoadLab />
      <Misconception>큰 `L10` 숫자가 contamination, lubrication starvation, mounting preload, misalignment, seal, cage, shock와 housing deformation을 없애지 않습니다. Basic life는 전체 joint reliability의 한 evidence row입니다.</Misconception>
    </NlpSection>

    <NlpSection id="friction-backdrive" marker="10" tone="violet" question="Forward efficiency가 75%라면 load가 반대로 joint를 밀 때도 75%로 돌아갈까?" title="Friction과 backdrivability는 direction·speed·load·temperature에 따라 상태가 바뀐다">
      <p>Motor가 link를 구동할 때는 input torque가 friction을 이기고 output으로 전달됩니다. Load가 motor를 돌리는 방향에서는 contact geometry, preload와 static friction 때문에 다른 breakaway threshold가 생깁니다. 저속에서 멈춰 있던 reducer와 고속으로 회전하는 reducer의 효율을 하나로 묶으면 gravity compensation과 brake sizing이 틀어집니다.</p>
      <p>Backdrivable하지 않아 보이는 bench state를 안전 holding으로 간주해서도 안 됩니다. Lubricant temperature, wear, vibration와 external shock가 breakaway를 바꿀 수 있고 formal gravity restraint에는 rated brake 또는 다른 proven mechanism이 필요합니다. 반대로 너무 낮은 backdrive impedance가 필요한 force-control joint에서는 ratio와 transmission type 자체가 architecture decision이 됩니다.</p>
      <BackdriveFrictionLab />
      <Takeaway>Efficiency map은 energy loss를, friction model은 threshold와 disturbance를, holding device는 de-energized safe state를 설명합니다. 한 숫자가 세 역할을 대신하지 않습니다.</Takeaway>
    </NlpSection>

    <NlpSection id="brake-handover" marker="11" tone="amber" question="STO를 먼저 걸고 잠시 뒤 brake를 닫으면 vertical payload는 안전할까?" title="Motor torque와 holding-brake torque가 겹치는 handover가 중력 낙하를 막는다">
      <p>Spring-applied motor brake는 전원을 제거하면 체결되는 fail-to-hold 구조를 만들 수 있습니다. 하지만 brake coil current가 사라진 순간 friction surfaces가 즉시 full torque를 내는 것은 아닙니다. Mechanical engagement delay가 있고 wear, temperature와 air gap가 torque를 바꿉니다. 그 동안 motor torque까지 먼저 사라지면 payload는 가속합니다.</p>
      <MathFormula display>{raw`\underbrace{\tau_{brake,o}}_{\text{출력 쪽 유지 토크}}=\underbrace{i\eta_{hold}}_{\text{정지 전달 경로}}\underbrace{\tau_{brake,m}}_{\text{모터 축 브레이크 토크}}`}</MathFormula>
      <FormulaNote meaning="Motor-shaft holding brake torque를 output side로 옮기는 screening relation입니다. Eta_hold는 rotating efficiency와 동일하다고 가정하지 않으며 static friction, reducer condition, backlash and load direction을 반영한 proven value가 필요합니다. Brake의 rated holding torque, safety factor와 exact mounting limit가 우선합니다." symbols={[[raw`\tau_{brake,m}`, 'Motor-shaft brake holding torque [N·m]'], [raw`\tau_{brake,o}`, 'Output-side equivalent holding torque [N·m]'], [raw`\eta_{hold}`, 'Declared static load-path transfer factor']]} />
      <MathFormula display>{raw`\underbrace{\Delta\theta_{fall}}_{\text{무지지 구간의 낙하 각도}}\approx\frac12\underbrace{\alpha_g}_{\text{중력에 의한 각가속도}}\underbrace{(\Delta t_{unheld})^2}_{\text{토크가 비는 시간의 제곱}}`}</MathFormula>
      <FormulaNote meaning="Initial velocity가 0이고 constant gravity acceleration이라고 본 short-gap kinematic estimate입니다. Actual fall은 friction, compliance, lost motion, controller and brake torque ramp를 포함합니다. 핵심은 electronics response가 빠르더라도 unheld time의 제곱으로 motion이 생긴다는 점이며 risk assessment에는 measured worst case를 사용합니다." symbols={[[raw`\alpha_g`, 'Net gravity angular acceleration during unheld state [rad/s²]'], [raw`\Delta t_{unheld}`, 'Motor holding torque와 brake holding torque가 모두 부족한 interval [s]'], [raw`\Delta\theta_{fall}`, 'Estimated angular drop [rad]']]} />
      <BrakeHandoverLab />
      <DecisionSteps items={[
        { label: 'Startup', action: 'Drive ready와 sufficient motor holding torque를 physical feedback/declared condition으로 확인한 뒤 brake를 release한다.', reject: 'Brake release command를 torque proof로 취급' },
        { label: 'Controlled stop', action: 'Motor가 motion energy를 계획대로 줄이고 standstill/hold condition을 만든다.', reject: 'Holding brake로 매 cycle의 dynamic energy를 흡수' },
        { label: 'Brake apply', action: 'Brake command 뒤 worst-case engagement와 sufficient holding torque를 확인한다.', reject: 'Timer typical value만으로 full engagement 선언' },
        { label: 'Torque removal / STO', action: 'Risk assessment가 요구한 holding state가 proven된 뒤 torque-producing path를 제거한다.', reject: 'STO electronics delay를 total safe-stop time으로 표기' },
      ]} />
    </NlpSection>

    <NlpSection id="commissioning" marker="12" tone="green" question="Catalog 계산과 bench demo를 production joint claim으로 바꾸려면 무엇을 남겨야 할까?" title="Joint evidence는 motion·duty·precision·mode·bearing·holding의 교집합으로 닫힌다">
      <p>좋은 actuator design은 한 개의 큰 margin이 다른 결손을 덮는 구조가 아닙니다. Torque가 충분해도 resonance가 trajectory 안에 있으면 tracking이 실패하고, tracking이 좋아도 brake handover가 비면 vertical axis가 떨어집니다. 각 claim을 source revision, exact hardware, payload configuration, temperature와 trajectory에 연결합니다.</p>
      <MathFormula display>{raw`\begin{aligned}\underbrace{C_{joint}}_{\text{배포 가능한 관절 주장}}&=\underbrace{C_{motion}\cap C_{duty}\cap C_{precision}}_{\text{운동·수명·정밀도 근거}}\\&\quad\cap\underbrace{C_{mode}\cap C_{bearing}\cap C_{hold}}_{\text{공진·베어링·유지 근거}}\end{aligned}`}</MathFormula>
      <FormulaNote meaning="Joint claim의 논리적 evidence intersection을 표현한 식입니다. 집합 원소는 측정·분석 결과와 그 적용 조건이며 확률을 더하는 reliability formula가 아닙니다. Payload, ratio, mounting, lubricant, sensor, brake or trajectory가 바뀌면 영향을 받은 set evidence를 invalidate하고 다시 닫습니다." symbols={[[raw`C_{motion}`, 'Torque-speed and kinematic envelope evidence'], [raw`C_{duty}`, 'Mission duty, thermal and life evidence'], [raw`C_{precision},C_{mode}`, 'Measured accuracy and dynamic-mode evidence'], [raw`C_{bearing},C_{hold}`, 'Bearing-load and holding-handover evidence']]} />
      <JointCommissioningLab />
      <CapabilityCheck items={[
        'Motor/output side를 섞지 않고 ratio, speed, torque, power와 inertia를 변환한다.',
        'Peak·repeated peak·RMS·average speed·life를 서로 다른 time base로 검사한다.',
        'Backlash, lost motion, hysteresis, repeatability와 transmission error를 측정 절차로 구분한다.',
        'Joint stiffness와 stored energy에서 two-mass resonance와 control risk를 예측한다.',
        'Dual encoder가 관측하는 deformation/torque state와 calibration 한계를 설명한다.',
        'Output bearing force/moment와 basic life의 적용 경계를 구분한다.',
        'Efficiency·friction·backdrive를 방향과 운전점에 따라 해석한다.',
        'Vertical axis의 brake apply/release와 STO를 torque overlap으로 sequence한다.',
      ]} />
      <SourceNotes sources={[
        { label: 'Harmonic Drive Mechatronics, 05/2026', href: 'https://harmonicdrive.de/fileadmin/Downloads/Produkte/Kataloge/Harmonic_Drive_Mechatronics_EN_1053524.pdf', note: 'Selection, RMS duty, torsional stiffness, accuracy terms, output bearing, brake and feedback data를 exact product boundary로 읽습니다.' },
        { label: 'Williamson, Series Elastic Actuators, 1995', href: 'https://hdl.handle.net/1721.1/6776', note: 'Intentional compliance의 force control, output impedance, saturation and measured mismatch를 다룬 MIT thesis/technical report입니다.' },
        { label: 'SKF Rolling Bearings', href: 'https://www.skf.com/binaries/pub12/Images/0901d196802809de-Rolling-bearings---17000_1-EN_tcm_12-121486.pdf', note: 'Basic rating life, equivalent dynamic/static load와 실제 service-life 경계를 확인합니다.' },
        { label: 'Kollmorgen Holding Brake', href: 'https://webhelp.kollmorgen.com/essentials/english/Content/Resources/_MOTORS-Common/EN-English/MOTORS-Standard-Features/MOTORS-Holding-Brake.htm', note: 'Vertical load release sequence와 standstill brake의 반복 operational braking 제한을 확인합니다.' },
      ]} />
      <div className="not-prose mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Link to={articlePath('ai', 'reference-harmonic-drive-mechatronics-2026')} className="group rounded-md border border-border p-4 hover:bg-muted/25"><p className="text-xs font-black text-muted-foreground">COMPANY SOURCE</p><p className="mt-2 flex items-center justify-between gap-3 text-sm font-black">Harmonic Drive 2026 <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" /></p></Link><Link to={articlePath('ai', 'paper-williamson-series-elastic-actuators-1995')} className="group rounded-md border border-border p-4 hover:bg-muted/25"><p className="text-xs font-black text-muted-foreground">FOUNDATIONAL PAPER</p><p className="mt-2 flex items-center justify-between gap-3 text-sm font-black">Williamson SEA <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" /></p></Link><Link to={articlePath('ai', 'robot-structural-mechanics-materials-fatigue-thermal')} className="group rounded-md border border-border p-4 hover:bg-muted/25"><p className="text-xs font-black text-muted-foreground">GLOBAL LOAD PATH</p><p className="mt-2 flex items-center justify-between gap-3 text-sm font-black">Structure·Fatigue·Thermal <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" /></p></Link><Link to={articlePath('ai', 'robot-contact-tribology-lubrication-wear')} className="group rounded-md border border-border p-4 hover:bg-muted/25"><p className="text-xs font-black text-muted-foreground">NEXT LOCAL LAYER</p><p className="mt-2 flex items-center justify-between gap-3 text-sm font-black">Contact·Film·Wear <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" /></p></Link></div>
    </NlpSection>
  </>;
}
