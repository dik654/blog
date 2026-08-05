import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  CommonModeCurrentLab,
  DualChannelDiagnosticLab,
  EmcCouplingLab,
  EmcEvidenceLab,
  InsulationCoordinationLab,
  IsolationBarrierTransientLab,
  SafetyCaseCommissioningLab,
  SafetyContractBoundaryLab,
  SafetyFunctionAllocationLab,
  StoTimingLab,
} from './robot-drive-isolation-emc-functional-safety/viz/IsolationSafetyLabs';

const raw = String.raw;

function EvidenceBoundary({ items }: { items: Array<{ claim: string; evidence: string; doesNotProve: string }> }) {
  return <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">{items.map((item, index) => <div key={item.claim} className="min-w-0 bg-background p-4"><div className="flex items-center gap-2"><span className="font-mono text-xs font-black text-blue-700/55 dark:text-blue-300/55">{String(index + 1).padStart(2, '0')}</span><p className="text-sm font-black">{item.claim}</p></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">필요한 증거:</strong> {item.evidence}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">아직 증명하지 못함:</strong> {item.doesNotProve}</p></div>)}</div>;
}

function CausalSteps({ items }: { items: Array<{ label: string; state: string; gate: string }> }) {
  return <ol className="not-prose my-6 grid gap-2">{items.map((item, index) => <li key={item.label} className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-border py-3"><span className="font-mono text-lg font-black text-blue-700/40 dark:text-blue-300/40">{String(index + 1).padStart(2, '0')}</span><div><p className="text-sm font-black">{item.label}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.state}</p><p className="mt-2 text-xs font-semibold leading-relaxed">Evidence gate · {item.gate}</p></div></li>)}</ol>;
}

export default function RobotDriveIsolationEmcFunctionalSafety() {
  return <>
    <NlpSection id="contract-boundary" marker="01" tone="blue" question="절연, EMC, STO와 brake는 모두 '안전'이라는 한 기능일까?" title="Hazard를 먼저 선언해야 서로 다른 안전 계약을 섞지 않는다">
      <QuestionLead question="두꺼운 isolation barrier와 STO input이 있으면 robot은 멈추고, 들고 있던 payload를 유지하며, 내부를 만져도 안전할까?" answer="아닙니다. 절연은 선언한 전위 경계를 제어하고, EMC는 disturbance 속에서도 기능을 보존하며, STO는 torque-producing power를 차단합니다. 실제 감속, 수직축 유지, DC-link 방전과 safe access는 각각 별도 기능과 증거가 필요합니다." />
      <p>안전 설계를 부품 목록에서 시작하면 `isolated`, `dual channel`, `SIL3 capable` 같은 단어가 위험을 대신 설명하게 됩니다. 먼저 누가 어떤 에너지에 노출되는지, 어떤 상태가 되면 위험이 끝나는지, 그 상태를 무엇으로 관측할지를 정합니다. 같은 robot에서도 감전, false gate switching, uncommanded torque, 관성 운동, 중력 낙하와 충전된 DC link는 서로 다른 종료 조건을 가집니다.</p>
      <p>48 V라는 이유만으로 모든 signal을 galvanically isolate할 필요는 없습니다. 반대로 48 V라는 이유만으로 isolation coordination이 사라지지도 않습니다. 다른 supply domain, charger, external equipment, encoder cable, chassis와 사용자가 닿는 interface가 만드는 실제 potential difference와 transient를 봐야 합니다. Isolation을 추가하면 ground loop를 끊을 수 있지만 barrier capacitance, propagation delay와 isolated supply라는 새 failure surface도 생깁니다.</p>
      <ConceptPrimer items={[
        { term: 'Protective isolation', meaning: '사람이나 accessible circuit으로 위험 전위가 전달되지 않도록 하는 절연 경계.', why: '감전·에너지 hazard claim은 정격 한 부품이 아니라 전체 경계와 설치 환경으로 검증해야 합니다.' },
        { term: 'Functional isolation', meaning: '기능 동작에 필요한 level shift나 서로 다른 reference domain 분리.', why: '기능 목적과 사람 보호 목적을 혼동하면 필요한 evidence와 등급을 잘못 고릅니다.' },
        { term: 'EMC integrity', meaning: '전자기 disturbance를 내보내는 정도와 disturbance 속에서도 의도한 기능을 유지하는 성질.', why: 'Isolation barrier가 있어도 고주파 current와 transient coupling은 남습니다.' },
        { term: 'STO', meaning: 'Safety Torque Off. Motor에 torque-producing power가 전달되지 않도록 하는 drive safety function.', why: 'Torque removal과 motion stop·holding·zero voltage를 명확히 분리합니다.' },
      ]} />
      <MathFormula display>{raw`\underbrace{V_{work}}_{\text{실제 동작 전압}}=
        \max_t\underbrace{\left|V_P(t)-V_S(t)\right|}_{\text{절연 장벽 양단의 전위 차}}`}</MathFormula>
      <FormulaNote meaning="Isolation device의 한쪽을 primary P, 다른 쪽을 secondary S로 정한 뒤 정상·반복 동작 중 barrier 양단의 최대 potential difference를 구합니다. Board supply label끼리 빼는 것이 아니라 각 reference가 transient와 ground shift를 포함해 실제로 보는 waveform을 사용합니다. Working voltage는 impulse/surge 조건을 대신하지 않습니다." symbols={[[raw`V_P,V_S`, 'Barrier 양쪽 reference에 대한 시간별 potential [V]'], [raw`V_{work}`, 'Declared normal/repetitive condition의 maximum barrier voltage [V]']]} />
      <SafetyContractBoundaryLab />
      <Misconception>STO는 emergency stop 전체와 동의어가 아닙니다. STO는 보통 torque-producing power를 제거하는 uncontrolled coast 계열의 기능이며, 움직임을 능동 감속하거나 수직축을 유지하고 DC link를 방전하는 기능까지 자동으로 제공하지 않습니다.</Misconception>
    </NlpSection>

    <NlpSection id="insulation-coordination" marker="02" tone="amber" question="Isolator datasheet의 reinforced 표기만으로 PCB spacing을 정할 수 있을까?" title="Creepage와 clearance는 voltage보다 먼저 환경과 전체 경계를 요구한다">
      <p>Clearance는 두 conductive part 사이의 가장 짧은 공기 경로입니다. Creepage는 절연 표면을 따라가는 가장 짧은 경로입니다. Solid insulation은 재료 내부의 dielectric barrier입니다. 세 경로는 같은 선을 다른 이름으로 부르는 것이 아니며, transient, altitude, pollution, material과 제조 상태에 서로 다르게 반응합니다.</p>
      <p>따라서 이 글은 보편적인 mm 표를 만들지 않습니다. Working/repetitive peak voltage, 예상 impulse/transient, overvoltage category, pollution degree, material group, altitude, coating의 qualified process와 실제 geometry를 모은 뒤 current IEC 61800-5-1과 적용 규격의 normative table을 사용해야 합니다. Connector, isolated DC/DC transformer, opto/digital isolator, PCB slot과 test point를 하나의 boundary로 추적합니다. 가장 좋은 IC package가 가장 짧은 connector path를 보상하지 못합니다.</p>
      <EvidenceBoundary items={[
        { claim: 'Clearance path', evidence: 'Transient/impulse classification, altitude, actual 3D air path and manufacturing tolerance', doesNotProve: 'Creepage, solid insulation 또는 EMC immunity' },
        { claim: 'Creepage path', evidence: 'Working voltage, pollution, material group, surface geometry and qualified coating state', doesNotProve: 'Impulse withstand 또는 coating 아래 모든 contamination 제거' },
        { claim: 'Solid insulation', evidence: 'Material construction, dielectric test, aging, temperature and production control', doesNotProve: 'Connector와 PCB를 포함한 전체 boundary' },
        { claim: 'System isolation', evidence: '모든 series/parallel barrier element와 installation interface의 weakest-path audit', doesNotProve: 'STO, EMC compliance 또는 touch-safe discharge' },
      ]} />
      <InsulationCoordinationLab />
      <Takeaway>Spacing 숫자는 첫 입력이 아니라 마지막 결과입니다. 먼저 boundary와 환경 변수를 완성하고 current normative source에서 값을 결정한 뒤, 실제 PCB·connector·power module 전체의 shortest path로 다시 검증합니다.</Takeaway>
    </NlpSection>

    <NlpSection id="barrier-transient" marker="03" tone="violet" question="Galvanic connection을 끊었는데 switch-node edge가 왜 반대편 gate와 encoder를 흔들까?" title="Isolation barrier는 DC path를 끊지만 C·dv/dt와 timing을 없애지 않는다">
      <p>실제 isolator와 transformer에는 작은 parasitic capacitance가 있습니다. Common-mode voltage가 빠르게 바뀌면 그 capacitance를 통해 displacement current가 흐릅니다. 수 pF는 작아 보이지만 수십 kV/µs의 edge와 곱하면 receiver reference, shield와 chassis에 무시할 수 없는 pulse를 만듭니다. 이 current가 gate-source loop나 logic threshold에 들어오면 false transition, Miller turn-on 또는 spurious fault가 생길 수 있습니다.</p>
      <MathFormula display>{raw`\underbrace{i_{barrier}}_{\text{장벽을 건너는 변위 전류}}=
        \underbrace{C_{barrier}}_{\text{기생 결합}}\,
        \underbrace{\frac{dv_{cm}}{dt}}_{\text{공통 모드 전압 변화율}}`}</MathFormula>
      <FormulaNote meaning="Galvanic conductor가 없어도 changing electric field가 barrier capacitance를 충·방전하며 current pulse를 만듭니다. Cbarrier에는 isolator만이 아니라 isolated DC/DC, heat sink와 board-to-chassis coupling이 포함될 수 있습니다. Current의 실제 피해는 return impedance와 receiver/gate loop에 따라 달라집니다." symbols={[[raw`C_{barrier}`, '관심 boundary의 effective parasitic capacitance [F]'], [raw`dv_{cm}/dt`, 'Barrier 양단 common-mode voltage의 slew rate [V/s]'], [raw`i_{barrier}`, 'Declared sign direction의 displacement current [A]']]} />
      <MathFormula display>{raw`\underbrace{M_{CMTI}}_{\text{과도 내성 검토 비율}}=
        \frac{\underbrace{CMTI_{min}}_{\text{자료가 보장한 최소 한계}}}{
        \underbrace{\left|dv_{cm}/dt\right|_{max}}_{\text{시스템 예상 최대값}}}`}</MathFormula>
      <FormulaNote meaning="Datasheet의 minimum common-mode transient immunity와 target system의 worst-case slew rate를 비교하는 screening ratio입니다. 값이 1보다 크다고 모든 waveform, temperature, supply, pulse width와 layout에서 안전하다는 뜻은 아닙니다. CMTI test condition과 failure criterion을 읽고 bench waveform으로 확인해야 하며 이 비율은 표준 안전 metric이 아닙니다." symbols={[[raw`CMTI_{min}`, 'Declared datasheet condition에서의 minimum tolerated slew rate [V/s]'], [raw`|dv_{cm}/dt|_{max}`, 'Measurement와 margin을 포함한 expected maximum slew rate [V/s]']]} />
      <MathFormula display>{raw`\underbrace{\Delta t_{skew}}_{\text{채널 도착 시간 차}}=
        \underbrace{\max_k t_{pd,k}}_{\text{가장 느린 경로}}-
        \underbrace{\min_k t_{pd,k}}_{\text{가장 빠른 경로}}`}</MathFormula>
      <FormulaNote meaning="여러 PWM 또는 safety channel의 propagation delay가 다르면 동시에 바뀌어야 할 state 사이에 transient interval이 생깁니다. Typical delay 두 개를 빼지 말고 supply, temperature, device variation과 filter를 포함한 bounded delay range를 사용합니다. Gate-driver UVLO와 isolated-rail decay도 separate timing state입니다." symbols={[[raw`t_{pd,k}`, 'Channel k의 input event에서 declared output event까지 propagation delay [s]'], [raw`\Delta t_{skew}`, '고려한 channel 집합의 worst-case delay spread [s]']]} />
      <IsolationBarrierTransientLab />
    </NlpSection>

    <NlpSection id="common-mode" marker="04" tone="blue" question="Motor cable의 common-mode current는 어디에서 시작해 어디로 돌아갈까?" title="EMC noise는 source에서 끝나지 않고 반드시 닫힌 current loop를 만든다">
      <p>Three-phase current의 합이 이상적으로 0이어도 PWM switch node의 common-mode voltage는 cable과 motor frame을 계속 충·방전합니다. Current는 cable capacitance, stator-to-frame capacitance, bearing, enclosure, shield, PE, chassis와 DC-link parasitics를 따라 source로 돌아갑니다. 의도한 wide shield termination을 끊으면 current가 사라지는 대신 encoder, communication ground나 oscilloscope earth 같은 더 나쁜 경로로 이동할 수 있습니다.</p>
      <MathFormula display>{raw`\underbrace{i_{cm}}_{\text{전체 공통 모드 전류}}\approx
        \underbrace{C_{eq}}_{\text{기계 전체 귀환 결합}}\,
        \underbrace{\frac{dv_{sw}}{dt}}_{\text{스위칭 자극}}`}</MathFormula>
      <FormulaNote meaning="Switching node에서 frame/chassis/return까지 보이는 equivalent capacitance와 edge rate를 곱한 first-order pulse estimate입니다. 실제 path는 여러 distributed capacitance와 inductance를 포함하므로 oscilloscope/probe fixture와 cable configuration을 고정해 측정합니다. Edge를 늦추면 current가 줄 수 있지만 switching loss는 늘어납니다." symbols={[[raw`C_{eq}`, 'Cable, motor, heat sink, barrier와 chassis를 합친 effective return capacitance [F]'], [raw`dv_{sw}/dt`, 'Switch-node voltage edge rate [V/s]'], [raw`i_{cm}`, 'Source로 되돌아가는 aggregate common-mode current [A]']]} />
      <MathFormula display>{raw`\underbrace{|I_{cm}(f)|}_{\text{주파수별 공통 모드 전류}}=
        \underbrace{2\pi f C_{eq}}_{\text{주파수에 따라 커지는 결합}}\,
        \underbrace{|V_{cm}(f)|}_{\text{공통 모드 전압 성분}}`}</MathFormula>
      <FormulaNote meaning="Ideal capacitor 관계를 frequency domain에서 쓴 식입니다. 높은 harmonic일수록 같은 voltage component가 더 큰 current를 만들 수 있어 작은 physical parasitic가 EMC를 지배합니다. Cable resonance, impedance discontinuity와 loss가 있으면 이 단순 비례에서 벗어나므로 spectrum과 time waveform을 함께 봅니다." symbols={[[raw`f`, '분석하는 frequency [Hz]'], [raw`V_{cm}(f)`, '해당 frequency의 common-mode voltage magnitude [V]'], [raw`I_{cm}(f)`, '해당 frequency의 common-mode current magnitude [A]']]} />
      <MathFormula display>{raw`\begin{aligned}
        \underbrace{i_{cm}}_{\text{같은 방향 성분}}&=\frac{\underbrace{i_1+i_2}_{\text{두 전류의 합}}}{2}\\
        \underbrace{i_{dm}}_{\text{반대 방향 성분}}&=\frac{\underbrace{i_1-i_2}_{\text{두 전류의 차}}}{2}
        \end{aligned}`}</MathFormula>
      <FormulaNote meaning="두 conductor current를 같은 positive direction으로 정의했을 때 common component와 differential component로 분해합니다. Clamp probe에 두 선을 어떤 방향으로 통과시키는지에 따라 부호가 달라지므로 fixture convention을 기록합니다. Three-phase/PE system은 conductor 수와 modal basis를 확장해야 합니다." symbols={[[raw`i_1,i_2`, '같은 reference direction으로 측정한 conductor currents [A]'], [raw`i_{cm}`, '두 conductor가 함께 움직이는 current component [A]'], [raw`i_{dm}`, '두 conductor가 반대로 움직이는 current component [A]']]} />
      <CommonModeCurrentLab />
    </NlpSection>

    <NlpSection id="emc-coupling" marker="05" tone="violet" question="Ferrite를 붙여 증상이 사라졌다면 원인을 이해한 것일까?" title="Source·coupling path·victim을 분리해야 mitigation의 위치와 부작용이 보인다">
      <p>Electric coupling은 voltage edge와 mutual/parasitic capacitance가 지배합니다. Magnetic coupling은 high `di/dt` current와 loop area, orientation과 distance가 지배합니다. Conducted coupling은 shared impedance와 CM/DM mode가 지배합니다. 같은 encoder reset도 세 mechanism에서 생길 수 있으므로 source를 끄거나 path geometry를 바꾸고 victim threshold를 관측하는 controlled experiment가 필요합니다.</p>
      <MathFormula display>{raw`\underbrace{m_{loop}}_{\text{자기 결합의 1차 지표}}=
        \underbrace{I}_{\text{루프 전류}}\,
        \underbrace{A}_{\text{루프 면적}}`}</MathFormula>
      <FormulaNote meaning="Small-loop approximation에서 magnetic dipole moment는 current와 loop area에 비례합니다. 같은 current라면 forward/return path를 가깝게 두어 area를 줄이는 것이 주변 flux를 줄이는 직접적인 layout lever입니다. 실제 radiated field는 frequency, distance, geometry와 nearby conductor에 의존하므로 이 식은 ranking intuition이지 full-wave prediction이 아닙니다." symbols={[[raw`I`, '관심 switching loop current [A]'], [raw`A`, 'Forward-return path가 감싸는 effective area [m²]'], [raw`m_{loop}`, 'Small-loop magnetic moment magnitude [A·m²]']]} />
      <MathFormula display>{raw`\underbrace{f_0}_{\text{이상적 필터 공진 주파수}}=
        \frac{1}{2\pi\sqrt{\underbrace{LC}_{\text{저장 소자의 곱}}}}`}</MathFormula>
      <FormulaNote meaning="Ideal LC가 energy를 교환하는 natural frequency입니다. Noise frequency 아래에 f0를 두는 것만으로 filter가 완성되지 않습니다. Source/load impedance, ESR/ESL, damping, common-mode choke saturation, leakage current와 controller bandwidth가 resonance amplitude와 안정성을 결정합니다." symbols={[[raw`L`, 'Filter의 effective inductance [H]'], [raw`C`, 'Filter의 effective capacitance [F]'], [raw`f_0`, 'Ideal undamped resonance frequency [Hz]']]} />
      <EmcCouplingLab />
      <Misconception>“Single-point ground”는 모든 frequency에 통하는 배선 주문이 아닙니다. Low-frequency reference와 high-frequency return은 다르게 보입니다. Chassis, protective earth와 functional ground의 역할을 선언하고 실제 current가 가장 작은 impedance로 돌아가는 geometry를 설계합니다.</Misconception>
    </NlpSection>

    <NlpSection id="emc-evidence" marker="06" tone="teal" question="Limit 아래의 spectrum 한 장이 production EMC를 증명하지 못하는 이유는 무엇일까?" title="EMC evidence는 trace보다 test configuration과 uncertainty를 더 많이 포함한다">
      <p>Measured maximum만 남기면 cable 길이, load current, PWM mode, enclosure, grounding, probe, LISN, resolution bandwidth, detector와 ambient가 바뀌었을 때 비교할 수 없습니다. Emission은 system이 밖으로 내보내는 disturbance를 보고, immunity는 외부 disturbance가 들어올 때 declared function이 유지되는지를 봅니다. 둘은 같은 graph의 앞뒤가 아닙니다.</p>
      <p>Pre-compliance 측정은 source와 frequency를 빨리 찾는 데 유용합니다. Formal compliance evidence는 applicable standard, configuration과 calibrated measurement chain 아래의 bounded claim입니다. Immunity test는 단순히 reset이 없었는지보다 torque command, fault output, sensor error와 safe response 같은 acceptance criteria를 사전에 선언해야 합니다.</p>
      <MathFormula display>{raw`\underbrace{M_{dB}}_{\text{보수적 적합 여유}}=
        \underbrace{L_{limit}}_{\text{적용 한계}}-
        \underbrace{L_{meas}}_{\text{측정 최대}}-
        \underbrace{U}_{\text{측정 불확도}}`}</MathFormula>
      <FormulaNote meaning="Applicable detector/bandwidth에서 측정한 maximum을 limit에서 빼고 measurement uncertainty를 보수적으로 차감한 margin입니다. 기관과 적용 규칙에 따라 uncertainty 처리 방식은 달라질 수 있으므로 이 식을 universal conformity rule로 쓰지 않습니다. 핵심은 raw delta와 uncertainty-aware decision을 분리해 기록하는 것입니다." symbols={[[raw`L_{limit}`, '적용 표준과 configuration의 emission limit [dB unit]'], [raw`L_{meas}`, '같은 detector/bandwidth의 measured maximum [dB unit]'], [raw`U`, 'Declared measurement uncertainty contribution [dB]']]} />
      <EmcEvidenceLab />
      <EvidenceBoundary items={[
        { claim: 'Pre-compliance observation', evidence: 'Repeatable near-field/current-probe setup와 before/after mechanism test', doesNotProve: 'Installed machine의 formal compliance' },
        { claim: 'Conducted/radiated emission', evidence: 'Applicable limit, calibrated setup, detector/bandwidth, cable/load/enclosure와 uncertainty', doesNotProve: 'Immunity 또는 untested operating mode' },
        { claim: 'Immunity behavior', evidence: 'Applied severity, coupling method와 predeclared functional/safety acceptance criteria', doesNotProve: 'Emission 또는 다른 ports/frequencies' },
        { claim: 'Production deployment', evidence: 'Worst configurations, manufacturing control, change impact와 surveillance plan', doesNotProve: 'Future unassessed cable/component/revision' },
      ]} />
    </NlpSection>

    <NlpSection id="function-allocation" marker="07" tone="amber" question="STO가 5 ms 안에 동작해도 vertical payload가 떨어질 수 있는 이유는 무엇일까?" title="Torque off와 motion safe 사이에는 mechanics와 holding function이 남는다">
      <p>Controlled stop은 motor torque를 사용해 원하는 deceleration profile로 energy를 줄입니다. STO는 torque-producing power를 제거합니다. 이때 관성이 있는 horizontal axis는 coast하고, 중력축은 내려갈 수 있습니다. Spring-applied brake는 전원이 사라질 때 engage할 수 있지만 rated holding torque, wear, release/engage timing과 feedback이 검증돼야 합니다. Service access라면 contactor isolation과 downstream DC voltage proof도 추가됩니다.</p>
      <p>따라서 stop request의 sequence는 risk에 맞게 조합합니다. 예를 들어 정상 controlled deceleration 뒤 STO를 적용하고, vertical axis는 brake torque가 형성된 뒤 motor torque를 제거할 수 있습니다. Fault에서 controlled stop을 완성할 시간이 없다면 STO/coast와 mechanical restraint가 최종 hazard를 어떻게 제한하는지 별도로 평가합니다. Category 이름 하나로 모든 sequence를 결정할 수 없습니다.</p>
      <SafetyFunctionAllocationLab />
      <CausalSteps items={[
        { label: 'Hazard endpoint 선언', state: 'Safe speed, zero motion, holding 또는 safe access 중 실제 필요한 상태를 정합니다.', gate: 'Risk assessment가 measurable endpoint와 maximum time을 가져야 합니다.' },
        { label: 'Operational energy removal', state: '가능하면 controlled torque로 kinetic/gravity energy를 declared sink에 보냅니다.', gate: 'Drive Energy 글의 bus·sink contract가 유효해야 합니다.' },
        { label: 'Torque-producing path removal', state: 'Independent STO channels가 gate-power/drive path를 safe state로 전환합니다.', gate: 'Single faults와 timing under assumptions를 검증합니다.' },
        { label: 'Mechanical state containment', state: 'Coast distance 또는 holding-brake engagement와 torque를 actual load에서 측정합니다.', gate: 'Motion-safe sensor/feedback와 risk endpoint가 일치해야 합니다.' },
        { label: 'Stored electrical energy', state: 'Service이면 source isolation과 downstream discharge를 별도 확인합니다.', gate: 'Elapsed time이 아니라 measured voltage가 threshold 아래여야 합니다.' },
      ]} />
    </NlpSection>

    <NlpSection id="dual-channel" marker="08" tone="blue" question="입력 선이 두 개면 왜 single fault에 강하다고 말할 수 없을까?" title="Redundancy는 channel 수가 아니라 독립 경로·진단·공통 원인의 구조다">
      <p>1oo2 구조에서는 두 channel 중 하나가 trip을 요구해도 safe state로 갑니다. Hardware fault tolerance 1은 의도한 fault model에서 한 fault가 생겨도 safety function을 유지하는 구조적 성질입니다. 하지만 connector short, shared supply, shared logic, common clock, 같은 PCB contamination과 같은 design error가 두 channel을 함께 망가뜨리면 숫자 2는 독립성을 만들지 못합니다.</p>
      <p>Diagnostic은 fault를 발견하는 능력과 발견까지 허용한 시간으로 구성됩니다. OSSD가 넣는 짧은 test pulse를 무시하려고 filter를 길게 하면 valid stop response도 늦어집니다. `1 ms 이하는 무시`, `2 ms 이상은 valid`라면 1~2 ms 구간의 입력을 system contract에서 금지하거나 명확히 분류해야 합니다. Last diagnostic pass가 오래됐다면 current coverage로 취급할 수 없습니다.</p>
      <MathFormula display>{raw`\underbrace{D_{system}}_{\text{시스템 위험 고장 집합}}=
        \underbrace{(D_A\cap D_B)}_{\text{두 독립 경로가 함께 위험}}\cup
        \underbrace{D_{CCF}}_{\text{공통 원인으로 함께 위험}}`}</MathFormula>
      <FormulaNote meaning="Idealized set relation으로, 두 independent channel이 모두 dangerous state일 때와 common-cause failure가 두 경로를 함께 무너뜨릴 때를 분리합니다. 확률 곱셈식이 아니며 independence를 가정해 수치를 만들지 않습니다. 실제 PL/SIL 계산은 component data, architecture, CCF, diagnostics와 mission profile이 필요합니다." symbols={[[raw`D_A,D_B`, 'Channel A/B가 safety function을 수행하지 못하는 dangerous-failure event'], [raw`D_{CCF}`, '한 원인이 둘 이상의 channel을 함께 손상시키는 event'], [raw`D_{system}`, 'Declared architecture가 hazard-control function을 잃는 event set']]} />
      <MathFormula display>{raw`\underbrace{DC}_{\text{위험 고장 진단 비율}}=
        \frac{\underbrace{\lambda_{DD}}_{\text{발견되는 위험 고장률}}}{
        \underbrace{\lambda_{DD}+\lambda_{DU}}_{\text{전체 위험 고장률}}}`}</MathFormula>
      <FormulaNote meaning="Dangerous detected와 dangerous undetected failure rate를 이용한 diagnostic-coverage 정의입니다. Diagnostic pulse를 자주 보낸다는 사실만으로 DC가 높아지지 않습니다. 각 failure mode가 stimulus에서 observable response를 내는지, monitor가 독립적인지, DTI 안에 발견되는지를 FMEA와 fault injection으로 입증해야 합니다." symbols={[[raw`\lambda_{DD}`, 'Detected dangerous failure rate [1/time]'], [raw`\lambda_{DU}`, 'Undetected dangerous failure rate [1/time]'], [raw`DC`, 'Declared failure population에서 detected dangerous fraction']]} />
      <MathFormula display>{raw`\underbrace{t_{detect}}_{\text{고장 발견 최악 시간}}\le
        \underbrace{T_{DTI}}_{\text{진단 시험 간격}}+
        \underbrace{t_{monitor}}_{\text{판정·반응 시간}}`}</MathFormula>
      <FormulaNote meaning="Periodic diagnostic에서 fault가 test 직후 생기는 worst case를 생각하면 다음 diagnostic까지 DTI가 걸리고 monitor/reaction 시간이 추가됩니다. Continuous diagnostic나 다른 architecture에서는 더 적절한 timing model을 사용해야 합니다. 이 bound가 process safety time과 fault-accumulation assumption 안에 있어야 합니다." symbols={[[raw`T_{DTI}`, 'Diagnostic test가 반복되는 maximum interval [s]'], [raw`t_{monitor}`, 'Stimulus부터 fault declaration/safe reaction까지 bounded monitor time [s]'], [raw`t_{detect}`, 'Worst-case fault occurrence에서 detection/reaction까지 time [s]']]} />
      <DualChannelDiagnosticLab />
    </NlpSection>

    <NlpSection id="sto-timing" marker="09" tone="violet" question="READY가 low가 된 7 ms를 robot stop time이라고 불러도 될까?" title="STO electronics clock와 hazard가 끝나는 machine clock을 따로 측정한다">
      <p>STO input이 바뀐 뒤 input recognition, test-pulse filter, channel logic, load switch, isolated rail decay, driver UVLO와 gate discharge가 이어집니다. Board READY feedback은 이 chain의 특정 internal node를 관측할 뿐입니다. Motor의 stored mechanical energy, gravity, brake engagement와 coast distance는 그 뒤에도 남습니다.</p>
      <MathFormula display>{raw`\begin{aligned}
        t_{front}&=\underbrace{t_{input}+t_{filter}+t_{logic}}_{\text{입력·채널 판정}}\\
        t_{off}&=\underbrace{t_{switch}+t_{rail}+t_{gate}}_{\text{전원·게이트 차단}}\\
        \underbrace{t_{STO}}_{\text{전자 토크 차단 응답}}&=t_{front}+t_{off}
        \end{aligned}`}</MathFormula>
      <FormulaNote meaning="Declared STO input event에서 torque-producing gate path가 disabled 상태에 도달할 때까지의 electronics timing budget입니다. Mobile에서도 읽히도록 입력·판정 구간 tfront와 power·gate-off 구간 toff로 묶었습니다. 각 항의 maximum, variation, supply state와 fault path를 사용하며 TIDA-01599의 몇 ms measurement는 특정 board/revision/test point의 observation이지 universal 값이 아닙니다." symbols={[[raw`t_{front}`, 'Input recognition, pulse filter and channel-logic delay의 합 [s]'], [raw`t_{off}`, 'Power switch, isolated-rail decay and gate-disabled delay의 합 [s]'], [raw`t_{STO}`, 'Declared electronic endpoint까지 total response [s]']]} />
      <MathFormula display>{raw`\underbrace{t_{\mathrm{motion-safe}}}_{\text{위험 운동이 끝난 시간}}=
        \underbrace{t_{STO}}_{\text{전자 응답}}+
        \underbrace{t_{coast\;or\;hold}}_{\text{관성 감쇠 또는 제동기 결합}}`}</MathFormula>
      <FormulaNote meaning="Electronics torque-off 뒤 actual mechanics가 risk-defined safe motion 또는 proven holding state에 도달하는 시간을 더합니다. Vertical load에서는 brake engagement 전 낙하량과 torque handover를 봐야 합니다. Controlled stop이 STO 전에 실행되면 timeline을 실제 sequence로 다시 구성합니다." symbols={[[raw`t_{coast\;or\;hold}`, 'Gate off 뒤 safe speed/hold endpoint까지 mechanical interval [s]'], [raw`t_{\mathrm{motion-safe}}`, 'Risk assessment가 요구한 physical motion endpoint까지 total time [s]']]} />
      <StoTimingLab />
      <Misconception>STO active는 zero voltage indication이 아닙니다. DC bus, input connector와 motor cable에는 electrical energy가 남을 수 있습니다. Service procedure는 isolation/contactors, discharge path, measurement independence와 safe-access threshold를 별도로 검증해야 합니다.</Misconception>
    </NlpSection>

    <NlpSection id="safety-case" marker="10" tone="teal" question="Reference design과 TÜV report가 있어도 최종 robot이 다시 해야 할 일은 무엇일까?" title="Deployable safety claim은 requirements부터 lifecycle까지 evidence의 교집합이다">
      <p>Reference design은 좋은 architecture와 failure assumptions를 빠르게 배울 수 있게 합니다. 그러나 target machine의 risk, PCB revision, component lot, supply, diagnostics, cable, enclosure, software, mission time와 maintenance가 달라지면 claim 범위도 달라집니다. TIDA-01599는 dual-channel STO concept를 제공하지만 quantitative analysis, MCU/software, PCB common cause와 final diagnostic effectiveness 등 여러 항목을 외부 가정 또는 end-user work로 남깁니다.</p>
      <p>TÜV report도 무엇을 review했는지 읽어야 합니다. Concept architecture와 block FMEA가 intended use를 지원할 수 있다는 평가는 최종 machine certification과 같지 않습니다. Final implementation의 architecture, diagnostic effectiveness, diagnostic-test interval, integration, functional-safety management와 lifecycle evidence는 다시 닫아야 합니다. 또한 report가 참조한 historical ISO 13849 edition과 현재 edition을 구분합니다.</p>
      <MathFormula display>{raw`\underbrace{C_{deploy}}_{\text{배포 가능한 주장}}=
        \underbrace{C_{req}\cap C_{arch}\cap C_{diag}}_{\text{요구·구조·진단 증거}}\cap
        \underbrace{C_{test}\cap C_{life}}_{\text{시험·수명주기 증거}}`}</MathFormula>
      <FormulaNote meaning="Safety claim을 badge의 합이 아니라 모두 current인 evidence set의 intersection으로 표현한 conceptual 식입니다. 한 layer가 stale하거나 target configuration을 다루지 않으면 deployable claim도 그만큼 줄어듭니다. 수학적 probability 식이나 certification algorithm이 아니라 claim-control invariant입니다." symbols={[[raw`C_{req}`, 'Risk assessment와 measurable safety requirements의 current evidence set'], [raw`C_{arch},C_{diag}`, 'Architecture/FMEA와 diagnostics/timing evidence sets'], [raw`C_{test},C_{life}`, 'Integration/physical test와 production/change-control evidence sets'], [raw`C_{deploy}`, '모든 required evidence가 겹치는 bounded deployment claim']]} />
      <SafetyCaseCommissioningLab />
      <CausalSteps items={[
        { label: 'Requirements와 endpoint', state: 'Hazard, safe state, maximum response, mission/environment와 target integrity를 기록합니다.', gate: 'Component 선택 전에 machine risk와 measurable function이 승인됩니다.' },
        { label: 'Architecture와 FMEA', state: 'Channel independence, safe-failure direction, CCF와 interface assumptions를 failure mode별로 추적합니다.', gate: 'Single fault, accumulated fault와 external assumption의 owner가 명확합니다.' },
        { label: 'Diagnostic와 timing', state: 'Stimulus, observable response, DTI, stale state와 reaction chain을 계산합니다.', gate: 'Fault injection이 claimed coverage와 maximum time을 재현합니다.' },
        { label: 'Physical integrity', state: 'Insulation, transient immunity, EMC, gate/rail decay, brake/stop와 source-loss condition을 test합니다.', gate: 'Actual production-like configuration과 measurement uncertainty가 보존됩니다.' },
        { label: 'Production과 lifecycle', state: 'Component substitution, PCB/firmware/cable change와 periodic proof test가 evidence를 invalidate하는지 관리합니다.', gate: 'Release artifact가 exact revision과 current evidence IDs를 가리킵니다.' },
      ]} />
      <CapabilityCheck title="이 글만 읽고 풀 수 있어야 하는 transfer 판단" items={[
        'Protective, functional and noise isolation을 hazard와 evidence contract로 구분한다.',
        'Working voltage·transient·pollution·material·altitude·전체 path가 없으면 spacing 결정을 보류한다.',
        'Barrier capacitance와 dv/dt로 transient current를 계산하고 CMTI 조건과 channel skew를 함께 검토한다.',
        'Motor cable·frame·shield·chassis·DC link를 잇는 closed common-mode return path를 그린다.',
        'CM/DM mode와 source-path-victim mechanism에 맞는 mitigation 및 부작용을 선택한다.',
        'EMC trace에 configuration, detector/bandwidth, limit, uncertainty와 acceptance criteria를 붙인다.',
        'Controlled stop, STO, mechanical holding, discharge와 safe access를 서로 대체하지 않는다.',
        'Dual-channel 구조에서 shared cause, diagnostic effectiveness, DTI와 stale feedback을 찾는다.',
        'Electronics STO response와 actual coast/fall/brake engagement를 별도 timing endpoint로 측정한다.',
        'TIDA/TÜV의 concept evidence를 final robot certification으로 과대 transfer하지 않는다.',
      ]} />
      <SourceNotes sources={[
        { label: 'IEC 61800-5-1:2022 · Power drive system safety requirements', href: 'https://webstore.iec.ch/en/publication/62103', note: 'Electrical, thermal, fire, mechanical and energy hazards. Normative spacing/design work requires the current standard and target conditions.' },
        { label: 'IEC 61800-3:2022 · EMC requirements and test methods', href: 'https://webstore.iec.ch/en/publication/65056', note: 'Power-drive-system emission and immunity scope; installation and test configuration remain part of the claim.' },
        { label: 'IEC 61800-5-2:2016 · Functional safety requirements', href: 'https://webstore.iec.ch/en/publication/24556', note: 'Safety-related power-drive-system functions in the IEC 61508 framework; it does not replace machine risk assessment.' },
        { label: 'ISO 13849-1:2023 · Safety-related parts of control systems', href: 'https://www.iso.org/standard/73481.html', note: 'Current methodology context for safety-related control-system design and integration.' },
        { label: 'TI TIDA-01599 · Safe torque off reference design', href: 'https://www.ti.com/tool/TIDA-01599', note: 'Dual-channel de-energize-to-trip STO concept, assumptions, measured examples and downloadable TÜV concept report.' },
        { label: 'TI SLVA959B · Best Practices for Board Layout of Motor Drivers', href: 'https://www.ti.com/lit/an/slva959b/slva959b.pdf', note: 'CM/DM noise and high-current return-loop geometry; layout guidance is not a final EMC certificate.' },
        { label: 'TI · Isolated gate drivers overview', href: 'https://www.ti.com/product-category/power-management/gate-drivers/isolated/overview.html', note: 'Gate-driver isolation architecture and device-specific transient parameters that must be checked in current datasheets.' },
      ]} />
      <div className="not-prose my-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link to={articlePath('ai', 'robot-drive-energy-braking-safety')} className="group rounded-md border border-border p-4 transition-colors hover:border-blue-600/35 hover:bg-blue-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">바로 위 기반 · Drive Energy & Braking</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">Controlled stop이 버스와 resistor에 실제 energy destination을 갖는지 먼저 복습합니다.</span></Link>
        <Link to={articlePath('ai', 'reference-ti-tida-01599-sto-2022')} className="group rounded-md border border-border p-4 transition-colors hover:border-violet-600/35 hover:bg-violet-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">Company evidence reconstruction · TI TIDA-01599/TÜV</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">Architecture, assumptions, diagnostics, measured timing, PCB revision과 assessor scope를 분리해 읽습니다.</span></Link>
        <Link to={articlePath('ai', 'robot-actuator-mechanics-transmission-holding-brake')} className="group rounded-md border border-border p-4 transition-colors hover:border-amber-600/35 hover:bg-amber-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">다음 기계 기반 · Actuator Mechanics</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">STO 뒤의 실제 link motion, reducer compliance, bearing load와 vertical-axis brake handover를 계산합니다.</span></Link>
      </div>
      <Takeaway>Isolation, EMC와 functional safety는 label을 더하는 작업이 아닙니다. Hazard에서 시작해 physical current path, independent removal path, timing endpoint와 evidence lifecycle을 연결하고, 최종 claim을 가장 약한 evidence boundary 안에 유지하는 시스템 설계입니다.</Takeaway>
    </NlpSection>
  </>;
}
