import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  BringupEvidenceLab,
  CurrentSenseIntegrityLab,
  DcLinkEnergyLab,
  GateDriveSlewLab,
  HalfBridgeCommutationLab,
  LossBudgetLab,
  PowerPathContractLab,
  ProtectionLatencyLab,
  RingingLayoutLab,
  ThermalPathLab,
} from './robot-power-electronics-motor-driver/viz/PowerElectronicsLabs';

const raw = String.raw;

function PathLedger({ items }: { items: Array<{ label: string; owner: string; evidence: string; failure: string }> }) {
  return <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">{items.map((item, index) => <div key={item.label} className="min-w-0 bg-background p-4"><p className="flex items-center gap-2 text-xs font-black text-muted-foreground"><span className="font-mono">{String(index + 1).padStart(2, '0')}</span>{item.label}</p><p className="mt-2 text-sm font-semibold leading-relaxed">{item.owner}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">봐야 할 증거:</strong> {item.evidence}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">깨지면:</strong> {item.failure}</p></div>)}</div>;
}

function EvidenceLadder({ items }: { items: Array<{ stage: string; observe: string; gate: string }> }) {
  return <ol className="not-prose my-6 grid gap-2">{items.map((item, index) => <li key={item.stage} className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-border py-3"><span className="font-mono text-lg font-black text-teal-700/55 dark:text-teal-300/55">{String(index + 1).padStart(2, '0')}</span><div><p className="text-sm font-bold">{item.stage}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.observe}</p><p className="mt-2 text-xs font-semibold leading-relaxed">다음 단계 gate · {item.gate}</p></div></li>)}</ol>;
}

export default function RobotPowerElectronicsMotorDriver() {
  return (
    <>
      <BeginnerOpening
        title="화면의 숫자가 실제 모터 힘이 되기까지"
        description="제어기는 스위치를 얼마나 오래 켤지 숫자로 정합니다. 하지만 그 숫자가 곧 전압이나 힘은 아닙니다. 배터리의 에너지가 회로를 지나 모터 전류가 되고, 센서가 그 결과를 다시 확인해야 비로소 '명령이 실행됐다'고 말할 수 있습니다."
        familiarScene={<>전등 스위치를 눌렀다는 사실과 방이 실제로 밝아졌다는 사실은 다릅니다. 전원, 전선, 전구가 모두 이어져야 하고 마지막에는 눈으로 밝기를 확인해야 합니다. 모터 구동 회로도 같은 순서로 읽습니다.</>}
        steps={[
          { label: '에너지가 들어온다', detail: '배터리와 커패시터가 짧은 순간에도 필요한 전력을 내줄 수 있어야 합니다.' },
          { label: '스위치가 나눠 보낸다', detail: '여섯 개의 전력 스위치가 켜지고 꺼지며 세 모터 선의 전압을 만듭니다.' },
          { label: '전류로 확인한다', detail: '센서와 보호 회로가 실제 전류와 위험 상태를 독립적으로 확인합니다.' },
        ]}
      />
      <QuestionLead question="제어기 화면에 '60%로 켜라'가 기록되고 오류 표시도 없다면, 모터에 원하는 전압과 힘이 실제로 생겼다고 봐도 될까?" answer="아닙니다. 그 숫자는 스위치를 켜 두려는 시간 비율일 뿐입니다. 전원에 충분한 에너지가 있는지, 스위치가 실제로 켜졌는지, 전류가 올바른 길로 흘렀는지, 센서가 그 결과를 읽었는지까지 확인해야 합니다. 이 글은 그 네 경로를 하나씩 추적합니다." />
      <NlpSection id="power-contract" marker="01" tone="teal" question="FOC가 legal duty를 계산했는데도 왜 motor에 원하는 power가 전달됐다고 말할 수 없을까?" title="PWM request와 physical power 사이에는 네 개의 서로 다른 경로가 있다">
        <p>FOC 글의 마지막 출력은 measured DC bus 안에서 vector-limited된 duty와 switching sequence입니다. 여기서부터 power PCB는 그 sequence를 전압과 전류로 바꾸지만, 한 개의 signal chain으로만 보면 실패 위치를 찾을 수 없습니다. Bus capacitor는 energy를 저장하고, gate driver는 MOSFET gate에 charge를 넣고 빼며, motor inductance는 switch가 꺼져도 current를 계속 흐르게 합니다. Sense amplifier와 protection comparator는 그 결과를 별도의 analog path에서 판단합니다.</p>
        <ConceptPrimer items={[
          { term: 'Energy path', meaning: 'Battery·connector·precharge·DC link·brake/load가 energy를 공급하거나 흡수한다.', why: 'Duty가 legal해도 source와 sink가 없으면 원하는 power state가 성립하지 않습니다.' },
          { term: 'Commutation path', meaning: 'High/low MOSFET과 diode가 PWM state와 current sign에 따라 phase current를 이어 간다.', why: 'Gate가 꺼진 뒤에도 inductive current가 흐를 실제 경로와 device stress를 추적해야 합니다.' },
          { term: 'Gate path', meaning: 'Driver supply·bypass·gate resistor·source return이 VGS와 switching edge를 만든다.', why: 'Logic command와 MOSFET terminal의 실제 switching event를 분리해 검증합니다.' },
          { term: 'Evidence path', meaning: 'Shunt·amplifier·ADC·comparator·fault latch가 applied state와 위험을 관측한다.', why: 'Command echo가 아니라 current, voltage와 independent trip으로 physical result를 입증합니다.' },
        ]} />
        <MathFormula display>{raw`\underbrace{P_{dc}}_{\text{DC 입력}}=
          \underbrace{P_{out}}_{\text{전달·손실}}+
          \underbrace{\frac{dE_{stored}}{dt}}_{\text{저장 변화}}`}</MathFormula>
        <FormulaNote meaning="먼저 DC-link power를 system 밖으로 전달된 power와 capacitor/inductor에 남은 energy 변화로 분리합니다. Motoring과 regeneration의 부호 convention을 고정해야 stored energy가 늘어나는지 source로 돌아가는지 판단할 수 있습니다." symbols={[[raw`P_{dc}`, 'DC-link 경계에서 측정한 signed electrical power'], [raw`E_{stored}`, 'DC-link capacitor와 motor inductance 등에 저장된 energy']]} />
        <MathFormula display>{raw`\underbrace{P_{out}}_{\text{storage 밖 power}}=
          \underbrace{P_{mech}}_{\text{shaft}}+
          \underbrace{P_{loss}}_{\text{모든 손실}}`}</MathFormula>
        <FormulaNote meaning="두 번째 식은 storage 밖의 power를 useful shaft power와 loss로 분해합니다. Average steady state라면 두 식을 합쳐 familiar power balance를 얻습니다. 급감속이나 switching interval에서는 첫 식의 stored-energy 항을 먼저 닫아야 합니다." symbols={[[raw`P_{mech}`, 'Torque와 shaft speed로 계산한 signed mechanical power'], [raw`P_{copper}+P_{switch}+P_{other}`, 'Winding/channel, switching, magnetic/mechanical and stray losses']]} />
        <PathLedger items={[
          { label: 'Energy', owner: 'Source·precharge·bulk capacitor·regen sink가 voltage와 stored energy를 소유', evidence: 'Vdc, inrush, bus ripple, reverse current와 safe-discharge voltage', failure: 'Hot-plug overshoot, regen overvoltage 또는 charged board가 남습니다.' },
          { label: 'Commutation', owner: 'MOSFET channel·body diode·motor inductance가 phase-current continuity를 소유', evidence: 'VSW, phase current, diode interval, overlap과 device stress', failure: 'Shoot-through, reverse recovery 또는 avalanche가 발생합니다.' },
          { label: 'Gate charge', owner: 'Gate driver·local bypass·resistor·Kelvin source가 VGS edge를 소유', evidence: 'VGS, dead time, Miller bump, source bounce와 UVLO', failure: 'False turn-on, 느린 edge 또는 gate overstress가 생깁니다.' },
          { label: 'Evidence / trip', owner: 'Shunt·amplifier·ADC·comparator·driver fault가 관측과 차단을 소유', evidence: 'Raw sense output, ADC aperture, nFAULT, PWM trip와 gate-off latency', failure: '부드러운 software 숫자가 실제 과전류를 숨깁니다.' },
        ]} />
        <PowerPathContractLab />
      </NlpSection>

      <NlpSection id="dc-link" marker="02" tone="blue" question="48 V battery와 48 V DC link가 왜 같은 전압원이라고 볼 수 없을까?" title="DC link는 inrush와 regeneration을 동시에 받아내는 energy reservoir다">
        <p>Pack의 48 V는 nominal label이고 full-charge voltage, cable drop, connector bounce와 charger state가 실제 source boundary를 만듭니다. PCB의 local DC link는 bulk capacitor로 low-frequency energy를 공급하고 MOSFET 바로 옆의 ceramic capacitor로 high-frequency commutation current를 닫습니다. Bulk가 connector 옆에만 있고 bridge와 멀면 capacitance 값이 충분해도 trace와 cable inductance가 switching loop에 남습니다.</p>
        <MathFormula display>{raw`\underbrace{E_C}_{\text{저장 energy}}=
          \underbrace{\frac{1}{2}CV_{dc}^{2}}_{\text{capacitance × voltage 제곱}}`}</MathFormula>
        <FormulaNote meaning="Capacitor energy는 voltage에 선형이 아니라 제곱으로 증가합니다. 1.5 mF가 48 V일 때 약 1.73 J이고 60 V일 때 2.70 J입니다. Capacitance만 키우면 regen headroom은 늘지만 hot-plug inrush, precharge time, discharge time과 fault energy도 함께 커집니다." symbols={[[raw`C`, '실제 bias·온도·공차를 반영한 DC-link capacitance [F]'], [raw`V_{dc}`, 'Capacitor terminal에서 측정한 instantaneous bus voltage [V]']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{V_C(t)}_{\text{충전 중 capacitor voltage}}&=
          \underbrace{V_S}_{\text{source voltage}}
          \underbrace{\left(1-e^{-t/(R_{pre}C)}\right)}_{\text{RC precharge 진행률}}\\
          \underbrace{I_{pre}(0)}_{\text{연결 직후 peak current}}&=
          \underbrace{\frac{V_S}{R_{pre}}}_{\text{초기 capacitor가 0 V인 근사}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="이 RC 식은 resistor와 ideal capacitor의 첫 sizing model입니다. 실제 enable은 timer가 아니라 source-side와 load-side voltage, contactor/relay feedback, resistor temperature와 fault state를 함께 봐야 합니다. Precharge relay가 붙지 않았거나 capacitor가 short여도 시간이 흘렀다는 사실만으로 완료되지 않습니다." symbols={[[raw`R_{pre}`, 'Inrush를 제한하는 precharge resistance [Ω]'], [raw`R_{pre}C`, 'Voltage가 약 63%까지 오르는 time constant [s]'], [raw`I_{pre}(0)`, 'Resistor와 connector가 견뎌야 하는 초기 current estimate [A]']]} />
        <MathFormula display>{raw`\underbrace{\Delta E_{head}}_{\text{voltage 여유 energy}}=
          \underbrace{\frac{1}{2}C\left(V_{max}^{2}-V_0^{2}\right)}_{\text{현재 bus에서 허용 bus까지}}`}</MathFormula>
        <FormulaNote meaning="감속 energy가 battery나 brake resistor로 빠져나가지 않는 최악의 짧은 구간에 capacitor가 흡수할 수 있는 headroom입니다. Bus overvoltage clamp, battery charge-current limit, brake chopper와 torque derating 중 누가 energy destination을 소유하는지 정의해야 합니다. PWM을 끄는 것만으로 이미 회전 중인 inertia energy가 사라지지 않습니다." symbols={[[raw`V_0`, 'Regeneration 시작 전 measured bus voltage'], [raw`V_{max}`, 'Capacitor·MOSFET·driver margin을 반영한 software action limit']]} />
        <DcLinkEnergyLab />
        <Misconception>Precharge는 bus를 천천히 올리는 기능이고 discharge는 전원을 끈 뒤 stored energy를 안전 전압으로 내리는 기능입니다. Regeneration absorption은 운전 중 역방향 energy를 처리하는 기능입니다. 세 기능은 capacitor를 공유해도 같은 상태나 같은 부품 하나로 자동 해결되지 않습니다.</Misconception>
      </NlpSection>

      <NlpSection id="commutation" marker="03" tone="violet" question="두 gate를 모두 끈 dead time에도 phase current가 흐르는 이유는 무엇일까?" title="Half bridge는 voltage를 선택하지만 motor inductance가 current continuity를 강제한다">
        <p>한 phase leg는 DC+에 연결하는 high-side switch와 DC-에 연결하는 low-side switch로 구성됩니다. High side가 켜지면 phase node가 위 rail 쪽으로, low side가 켜지면 아래 rail 쪽으로 이동합니다. 그러나 motor winding current는 즉시 0이 될 수 없으므로 두 switch가 꺼진 dead time에도 current sign에 맞는 diode 또는 channel을 통해 흐릅니다. 이 interval이 commanded duty와 actual average phase voltage를 다르게 만듭니다.</p>
        <p>Shoot-through는 같은 leg의 high/low switch가 동시에 켜져 DC bus를 직접 short하는 사건입니다. Reverse recovery는 앞선 diode에 저장된 charge가 commutation 때 역방향으로 제거되며 current spike를 만드는 사건입니다. False turn-on은 opposite switch의 rapid drain-voltage change가 Miller capacitance와 shared source inductance를 통해 VGS를 threshold 위로 밀어 올리는 사건입니다. 세 증상은 큰 current라는 점은 같아도 원인과 교정이 다릅니다.</p>
        <HalfBridgeCommutationLab />
        <PathLedger items={[
          { label: 'Voltage rating', owner: 'Maximum steady bus + cable/harness transient + switching overshoot + design margin', evidence: 'Differential VDS capture at worst current, cable and temperature', failure: 'Nominal 48 V에 맞춘 60/80 V device가 repetitive avalanche를 겪을 수 있습니다.' },
          { label: 'Current / SOA', owner: 'Die, package, bond/interconnect, PCB copper와 thermal path의 time-dependent limit', evidence: 'Pulsed/steady waveform, SOA curve, junction estimate and current sharing', failure: 'Datasheet headline pulse current를 continuous phase rating으로 오해합니다.' },
          { label: 'Parallel sharing', owner: 'Symmetric drain/source/gate path와 matched thermal environment', evidence: 'Device별 current/temperature 또는 validated parasitic model', failure: 'Static RDS(on) sharing이 괜찮아도 switching edge를 한 device가 먼저 떠맡습니다.' },
          { label: 'Commutation', owner: 'Dead time, diode/recovery behavior와 gate timing', evidence: 'Both VGS, VSW and phase current on a shared timebase', failure: 'Dead time을 줄여 distortion은 줄었지만 overlap/recovery stress가 커집니다.' },
        ]} />
      </NlpSection>

      <NlpSection id="gate-drive" marker="04" tone="teal" question="Gate driver가 1 A라면 MOSFET은 정확히 몇 ns에 켜질까?" title="Gate driver는 nonlinear capacitance에 charge를 넣고 실제 VGS margin을 만든다">
        <p>MOSFET gate는 DC steady current를 계속 소비하는 logic input이 아니라 switching할 때 charge를 이동시키는 capacitive node입니다. Turn-on 중 drain voltage가 내려가는 Miller plateau에서는 gate current가 drain-gate capacitance를 충전하는 데 쓰이므로 VGS가 잠시 평평해집니다. Datasheet total gate charge를 driver peak current로 나눈 값은 order-of-magnitude 시작점일 뿐, driver output resistance, external resistor, plateau charge, package inductance와 driver supply droop가 실제 edge를 결정합니다.</p>
        <MathFormula display>{raw`\underbrace{t_{edge}}_{\text{edge time 근사}}\approx
          \underbrace{\frac{Q_{switch}}{I_{gate}}}_{\text{전환 charge ÷ gate current}}`}</MathFormula>
        <FormulaNote meaning="Qswitch는 total Qg 전체가 아니라 관심 transition과 Miller plateau에서 이동하는 charge에 가깝게 선택해야 합니다. Driver의 source와 sink current는 다를 수 있고 VGS에 따라 current도 변합니다. 이 근사를 resistor 선택의 시작점으로 사용한 뒤 실제 double-pulse 또는 motor commutation waveform에서 VGS·VDS·ID를 함께 확인합니다." symbols={[[raw`Q_{switch}`, '관심 switching interval의 effective gate charge [C]'], [raw`I_{gate}`, '같은 interval의 average gate source/sink current [A]']]} />
        <MathFormula display>{raw`\underbrace{E_{gate}}_{\text{한 cycle의 gate energy}}\approx
          \underbrace{Q_gV_G}_{\text{charge × gate swing}}`}</MathFormula>
        <FormulaNote meaning="한 gate를 충전하고 방전하는 cycle의 supply-energy scale입니다. Datasheet Qg는 test voltage/current에 의존하고 driver output stage와 gate resistance에서 energy가 소모됩니다." symbols={[[raw`Q_g`, '한 MOSFET의 declared total gate charge [C]'], [raw`V_G`, 'Driver가 gate-source에 가하는 voltage swing [V]']]} />
        <MathFormula display>{raw`\underbrace{P_{gate}}_{\text{전체 gate-drive power}}\approx
          \underbrace{E_{gate}}_{\text{gate 하나의 cycle energy}}
          \underbrace{f_{sw}N_{gate}}_{\text{반복률 × gate 수}}`}</MathFormula>
        <FormulaNote meaning="이 항은 주로 gate-driver supply와 gate resistance에서 소모되는 power budget입니다. MOSFET의 drain-current/voltage overlap switching loss와는 별개입니다. Parallel MOSFET을 늘리면 conduction resistance는 줄 수 있지만 total gate count와 driver demand는 늘어납니다." symbols={[[raw`f_{sw}`, '각 gate의 effective switching frequency [Hz]'], [raw`N_{gate}`, '같은 driver budget에서 충방전하는 MOSFET gate 수']]} />
        <p>High-side N-channel MOSFET의 source는 switch node와 함께 올라가므로 driver supply도 source 위에 떠 있어야 합니다. Bootstrap은 low-side interval에 capacitor를 충전해 그 floating supply를 만들기 때문에 100% high-side duty, startup state와 아주 낮은 switching frequency에서 refresh가 부족할 수 있습니다. Gate-supply UVLO와 power sequence는 logic PWM보다 먼저 안전한 off 상태를 보장해야 합니다.</p>
        <GateDriveSlewLab />
      </NlpSection>

      <NlpSection id="parasitics-layout" marker="05" tone="amber" question="Schematic에 없는 8 nH가 어떻게 10 V 이상의 device stress가 될까?" title="High-di/dt loop의 copper geometry가 overshoot와 ringing을 만든다">
        <p>Commutation 직전 local capacitor에서 high-side MOSFET, phase/low-side MOSFET을 거쳐 capacitor return으로 돌아오는 loop에는 package, via, plane와 capacitor ESL이 모두 포함됩니다. Current가 빠르게 바뀌면 이 loop inductance가 추가 voltage를 만듭니다. 따라서 큰 bulk capacitor를 멀리 놓는 것보다 적절한 high-frequency ceramic을 half bridge에 매우 가깝게 두고 forward/return path를 겹치는 것이 switching stress에 더 직접적일 수 있습니다.</p>
        <MathFormula display>{raw`\underbrace{\Delta V_{overshoot}}_{\text{추가 device stress}}\approx
          \underbrace{L_{loop}\frac{di}{dt}}_{\text{기생 inductance × current slew}}`}</MathFormula>
        <FormulaNote meaning="이 식은 current loop의 모든 stray inductance를 equivalent Lloop로 묶은 first-order relation입니다. Device가 실제로 보는 VDS는 bus voltage, commutation transient와 ringing을 합친 값입니다. 낮은 inductance와 적절한 gate slew가 첫 조치이며 voltage rating만 키워 geometry 원인을 숨기지 않습니다." symbols={[[raw`L_{loop}`, 'DC-link local capacitor부터 switching devices까지 high-di/dt loop의 equivalent inductance [H]'], [raw`di/dt`, 'Commutation current change rate [A/s]']]} />
        <MathFormula display>{raw`\underbrace{f_0}_{\text{첫 ringing frequency 근사}}\approx
          \underbrace{\frac{1}{2\pi\sqrt{L_{loop}C_{eq}}}}_{\text{parasitic LC resonance}}`}</MathFormula>
        <FormulaNote meaning="Ceq에는 MOSFET output capacitance, diode/junction, probe와 nearby copper가 operating voltage에 따라 nonlinear하게 들어갑니다. Ring frequency로 equivalent L/C를 추정할 수 있지만 한 operating point에서 맞춘 snubber를 모든 current, bus, cable과 temperature에 복사하지 않습니다. Snubber는 damping과 추가 loss를 함께 측정해 선택합니다." symbols={[[raw`C_{eq}`, 'Switch node가 해당 operating point에서 보는 equivalent capacitance [F]'], [raw`f_0`, 'Undamped first resonance의 approximate frequency [Hz]']]} />
        <p>Probe도 회로의 일부입니다. 긴 passive-probe ground lead는 측정 loop inductance를 추가해 실제보다 큰 ring을 표시할 수 있습니다. 반대로 bandwidth limit나 먼 ground reference는 중요한 narrow spike를 숨길 수 있습니다. High-side VGS는 driver source/Kelvin source를 기준으로, VDS/VSW는 rated differential probe 또는 매우 짧은 local reference로 capture하고 probe connection을 evidence에 기록합니다.</p>
        <RingingLayoutLab />
      </NlpSection>

      <NlpSection id="loss-budget" marker="06" tone="violet" question="RDS(on)이 가장 낮은 MOSFET이 왜 항상 가장 시원한 inverter를 만들지 않을까?" title="Conduction을 줄이는 선택은 gate charge와 switching loss를 바꿀 수 있다">
        <p>Conduction loss는 phase RMS current, modulation duty와 hot RDS(on)에 민감합니다. Switching loss는 bus voltage, current at each edge, rise/fall time, frequency와 device capacitance/recovery에 민감합니다. 더 큰 die나 여러 parallel device는 resistance를 줄일 수 있지만 gate charge와 output capacitance가 커져 driver와 switching energy를 늘릴 수 있습니다. 따라서 component의 단일 figure of merit가 아니라 target speed/torque/PWM/temperature distribution에서 합계를 비교합니다.</p>
        <MathFormula display>{raw`\underbrace{R_{hot}}_{\text{계산에 쓸 channel resistance}}=
          \underbrace{R_{DS(on)}(T_j)}_{\text{junction 온도를 반영한 저항}}`}</MathFormula>
        <FormulaNote meaning="Conduction loss 계산 전에 room-temperature typical이 아닌 expected junction-temperature resistance를 별도 고정합니다. Datasheet curve와 tolerance를 사용하고 parallel device의 sharing이 완전하다고 자동 가정하지 않습니다." symbols={[[raw`R_{hot}`, 'Target operating point에서 사용할 effective on resistance [Ω]'], [raw`T_j`, 'Loss와 thermal path가 함께 결정하는 junction temperature [°C]']]} />
        <MathFormula display>{raw`\underbrace{P_{cond}}_{\text{channel 도통 손실}}\approx
          \underbrace{I_{rms}^{2}R_{hot}}_{\text{RMS 전류 제곱 × hot 저항}}
          \underbrace{D}_{\text{도통 비율}}`}</MathFormula>
        <FormulaNote meaning="한 switch의 first-order channel loss입니다. Three-phase modulation에서는 device별 RMS current와 duty가 operating point에 따라 달라지므로 단순히 phase current의 절반을 모든 device에 적용하지 않습니다." symbols={[[raw`I_{rms}`, '해당 MOSFET channel을 통과하는 RMS current [A]'], [raw`D`, '관심 시간창에서 해당 channel이 current를 운반하는 fraction']]} />
        <MathFormula display>{raw`\underbrace{E_{edge}}_{\text{edge energy}}\approx
          \underbrace{\frac{1}{2}V_{DS}I_D(t_r+t_f)}_{\text{linear overlap 근사}}`}</MathFormula>
        <FormulaNote meaning="Voltage와 current가 linear하게 겹친다는 crude edge-energy estimate입니다. Coss, reverse recovery, nonlinear waveform, soft switching과 dead-time diode conduction을 생략합니다." symbols={[[raw`V_{DS},I_D`, '해당 edge 직전/중의 drain voltage와 current operating point'], [raw`t_r,t_f`, '측정 convention을 고정한 voltage/current transition interval']]} />
        <MathFormula display>{raw`\underbrace{P_{sw}}_{\text{반복 switching loss}}\approx
          \underbrace{E_{edge}}_{\text{edge당 energy}}
          \underbrace{f_{sw}}_{\text{초당 edge 반복}}`}</MathFormula>
        <FormulaNote meaning="Edge energy를 switching frequency와 곱한 first-order power입니다. 실제 inverter에서는 modulation에 따른 edge count와 device별 current가 다르므로 datasheet Eon/Eoff curve나 target waveform의 v(t)i(t) integral로 교정해야 합니다." symbols={[[raw`E_{edge}`, 'Measured/estimated switching edge energy [J]'], [raw`f_{sw}`, '해당 device가 같은 edge를 반복하는 effective rate [Hz]']]} />
        <LossBudgetLab />
        <Takeaway>Loss spreadsheet의 목적은 정답 소수점을 만드는 것이 아니라 어떤 항이 지배적이고 어느 가정이 결과를 흔드는지 찾는 것입니다. 지배 항과 uncertainty를 알면 double-pulse, thermal soak, motor dyno 중 무엇을 먼저 측정할지 결정할 수 있습니다.</Takeaway>
      </NlpSection>

      <NlpSection id="thermal" marker="07" tone="amber" question="Thermal camera가 74 °C를 보였다면 junction도 74 °C라고 말할 수 있을까?" title="Heat는 junction에서 case·board·interface·ambient로 시간에 따라 이동한다">
        <p>Silicon junction에서 발생한 loss는 package 내부, exposed pad/lead, copper plane와 via, thermal interface, heatsink와 air를 차례로 지나갑니다. Thermal camera는 보통 package나 PCB surface를 보며 emissivity, viewing angle와 sensor spot가 결과를 바꿉니다. Junction은 surface보다 높을 수 있고, 짧은 test에서는 아직 steady state에 도달하지 않았을 수 있습니다.</p>
        <MathFormula display>{raw`\underbrace{T_j}_{\text{junction 추정}}\approx
          \underbrace{T_a}_{\text{local ambient}}+
          \underbrace{P_{loss}\theta_{JA}}_{\text{steady thermal rise}}`}</MathFormula>
        <FormulaNote meaning="한 개의 effective junction-to-ambient path가 steady state에 도달했다는 단순 estimate입니다. Datasheet thetaJA는 특정 JEDEC board와 airflow 조건일 수 있어 실제 heavy-copper robot inverter에 그대로 복사하지 않습니다. Case-to-heatsink path를 따로 쓰면 같은 경로를 중복 합산하지 않도록 thermal network를 명시합니다." symbols={[[raw`T_a`, 'Device 주변의 local ambient/reference temperature [°C]'], [raw`P_{loss}`, '해당 thermal path로 흐르는 average device loss [W]'], [raw`\theta_{JA}`, 'Declared board/air condition의 steady thermal resistance [°C/W]']]} />
        <MathFormula display>{raw`\underbrace{\Delta T_j(t)}_{\text{과도 온도 상승}}\approx
          \underbrace{P_{pulse}Z_{\theta}(t)}_{\text{pulse 손실 × 열 임피던스}}`}</MathFormula>
        <FormulaNote meaning="Motor acceleration, stall pulse와 fault는 steady theta보다 transient thermal impedance가 더 적합합니다. Ztheta curve의 duty/repetition condition, initial temperature와 multi-device heat coupling을 확인해야 합니다. Short pulse가 평균 thermal test를 통과해도 device SOA를 넘을 수 있으므로 electrical stress evidence도 함께 봅니다." symbols={[[raw`P_{pulse}`, '해당 device에 순간적으로 발생하는 loss [W]'], [raw`Z_{\theta}(t)`, 'Pulse duration에서 junction-to-reference temperature rise를 나타내는 transient impedance [°C/W]']]} />
        <ThermalPathLab />
      </NlpSection>

      <NlpSection id="current-sense" marker="08" tone="blue" question="Current amplifier output이 ADC 범위 안인데도 왜 sample을 버려야 할 수 있을까?" title="Current sensing은 microvolt signal을 큰 PWM common-mode step 속에서 복원한다">
        <p>200 micro-ohm shunt에 50 A가 흐르면 differential signal은 10 mV입니다. Inline shunt의 두 terminal은 그 작은 차이를 유지한 채 switch node를 따라 수십 V/ns로 움직일 수 있습니다. Amplifier의 common-mode voltage rating은 살아남을 수 있는 범위이고, PWM rejection/settling은 edge 뒤 얼마 동안 output을 신뢰할 수 있는지에 관한 별도 규격입니다. ADC는 output voltage가 rail 안이라는 이유만으로 switching edge 근처 sample을 채택하면 안 됩니다.</p>
        <MathFormula display>{raw`\underbrace{P_{sh}}_{\text{shunt 자체의 heat}}=
          \underbrace{I_{rms}^{2}}_{\text{phase current의 heating 성분}}
          \underbrace{R_{sh}}_{\text{sense resistance}}`}</MathFormula>
        <FormulaNote meaning="Shunt를 키우면 signal-to-noise가 좋아지지만 dissipation, temperature coefficient와 inverter loss가 증가합니다. Peak pulse와 RMS heating을 분리하고 shunt terminal/PCB copper의 thermal gradient가 gain을 바꾸는지 확인합니다." symbols={[[raw`R_{sh}`, 'Current를 differential voltage로 바꾸는 shunt resistance [Ω]'], [raw`I_{rms}`, 'Thermal interval에서 shunt를 통과하는 RMS current [A]']]} />
        <MathFormula display>{raw`\underbrace{V_{sense}}_{\text{amplifier input 차동값}}=
          \underbrace{I_{phase}R_{sh}}_{\text{원하는 shunt signal}}+
          \underbrace{V_{Kelvin}}_{\text{shared-copper error}}`}</MathFormula>
        <FormulaNote meaning="VKelvin은 load-current copper를 sense lead가 공유할 때 들어오는 unwanted drop을 대표합니다. Kelvin routing은 shunt pad의 두 measurement terminal을 독립적으로 가져와 amplifier가 shunt 자체의 voltage만 보게 합니다." symbols={[[raw`V_{sense}`, 'Amplifier가 두 input terminal 사이에서 실제로 보는 differential voltage'], [raw`V_{Kelvin}`, 'Shared high-current copper가 measurement에 더한 error voltage [V]']]} />
        <MathFormula display>{raw`\underbrace{V_{out}}_{\text{ADC input}}=
          \underbrace{V_{ref}}_{\text{zero-current 기준}}+
          \underbrace{G(V_{sense}+V_{amp})}_{\text{증폭한 signal + error}}`}</MathFormula>
        <FormulaNote meaning="Amplifier는 shunt/copper가 만든 differential input에 offset, gain error와 PWM transient residual을 더해 ADC output을 만듭니다. Common-mode voltage rating은 생존 범위이고 Vamp가 settled accuracy 안에 들어오는 시간은 별도입니다." symbols={[[raw`V_{ref}`, 'Bidirectional current가 0 A일 때의 output reference [V]'], [raw`G`, 'Sense amplifier differential gain [V/V]'], [raw`V_{amp}`, 'Offset, gain error와 PWM transient residual의 input-referred 합']]} />
        <CurrentSenseIntegrityLab />
        <Misconception>Digital low-pass filter는 random noise를 줄일 수 있지만 PWM edge에서 capture한 invalid sample을 valid한 물리 관측으로 바꾸지 못합니다. Raw amplifier output, ADC trigger/aperture와 phase-current probe를 같은 timebase로 확인한 뒤 filter를 설계합니다.</Misconception>
      </NlpSection>

      <NlpSection id="protection" marker="09" tone="green" question="VDS overcurrent threshold를 RDS(on)으로 나누면 정확한 current trip을 얻을 수 있을까?" title="Protection은 threshold 하나가 아니라 detection·blanking·gate-off의 latency와 energy budget이다">
        <p>VDS overcurrent protection은 MOSFET이 on일 때 drain-source voltage가 threshold를 넘는지 봅니다. 정상 switching overshoot를 fault로 오인하지 않도록 blanking/deglitch interval을 두지만, 그 시간에는 실제 short도 보이지 않습니다. 또한 RDS(on)은 junction temperature와 device마다 달라지고 parallel current sharing, source/drain copper와 Kelvin geometry가 comparator가 보는 voltage에 들어갑니다. 따라서 이는 정확한 current sensor가 아니라 빠른 approximate protection입니다.</p>
        <MathFormula display>{raw`\underbrace{I_{trip}}_{\text{VDS 기반 trip 전류 근사}}\approx
          \underbrace{\frac{V_{DS,th}}{R_{DS(on)}(T_j)}}_{\text{threshold ÷ hot channel 저항}}`}</MathFormula>
        <FormulaNote meaning="Comparator threshold tolerance, MOSFET resistance tolerance/temperature, parallel sharing, copper parasitic, Kelvin sense point와 blanking을 생략한 nominal estimate입니다. Cold calculation은 hot RDS(on)에서 더 낮은 current에 trip할 수 있고 asymmetric parallel path는 한 device가 먼저 stress를 받을 수 있습니다." symbols={[[raw`V_{DS,th}`, 'Driver/comparator가 설정한 VDS overcurrent voltage threshold [V]'], [raw`R_{DS(on)}(T_j)`, 'Trip 순간 junction temperature의 effective channel resistance [Ω]']]} />
        <MathFormula display>{raw`\underbrace{t_{sense}}_{\text{fault를 valid로 판정할 때까지}}=
          \underbrace{t_{detect}}_{\text{threshold 도달}}+
          \underbrace{t_{blank}}_{\text{의도한 무시 interval}}`}</MathFormula>
        <FormulaNote meaning="Detection과 blanking은 comparator가 fault를 valid로 선언하기 전의 latency입니다. Fault가 threshold까지 ramp하는 시간과 switching-edge blanking이 겹치면 실제 short도 그만큼 늦게 보입니다. Blanking을 오검출 방지용으로 늘릴 때 device SOA 안에서 허용되는지 함께 계산합니다." symbols={[[raw`t_{detect}`, 'Fault onset부터 sensed quantity가 threshold에 도달하는 시간'], [raw`t_{blank}`, 'Switching transient 오검출을 피하려 의도적으로 감지하지 않는 시간']]} />
        <MathFormula display>{raw`\underbrace{t_{off}}_{\text{실제 gate-off}}=
          \underbrace{t_{sense}}_{\text{감지}}+
          \underbrace{t_{prop}}_{\text{전달}}+
          \underbrace{t_{gate}}_{\text{gate 방전}}`}</MathFormula>
        <FormulaNote meaning="Fault를 판정한 뒤에도 comparator/logic propagation과 gate charge discharge가 남습니다. 각 latency는 같은 worst-case 조건에서 더합니다. MCU interrupt와 task는 cause logging, supervised reset와 system response를 맡을 수 있지만 first gate removal의 유일한 owner가 되면 안 됩니다." symbols={[[raw`t_{prop}`, 'Comparator/driver/PWM trip path의 propagation time'], [raw`t_{gate}`, 'Driver가 gate charge를 제거해 device current가 실제로 줄기까지의 시간']]} />
        <MathFormula display>{raw`\underbrace{E_{fault}}_{\text{차단 전 energy}}=
          \underbrace{\int_{0}^{t_{off}}v_{device}(t)i_{device}(t)\,dt}_{\text{off까지 waveform 적분}}`}</MathFormula>
        <FormulaNote meaning="Constant voltage/current로 단순화한 mJ estimate는 비교용일 뿐입니다. 실제 short에서는 bus inductance, current rise, saturation, device voltage collapse와 protection action이 waveform을 바꿉니다. Device SOA, short-circuit withstand와 repetitive fault policy를 별도로 검증해야 합니다." symbols={[[raw`v_{device}(t)`, 'Fault interval에 MOSFET이 실제로 지지하는 voltage'], [raw`i_{device}(t)`, '같은 MOSFET에 실제로 흐르는 current']]} />
        <ProtectionLatencyLab />
        <PathLedger items={[
          { label: 'VDS / shunt OCP', owner: 'Fast short와 overcurrent energy', evidence: 'Threshold tolerance, blanking, propagation, both VGS and device current', failure: 'False trip 또는 short let-through가 SOA를 넘습니다.' },
          { label: 'UVLO', owner: 'Gate supply가 불충분한 linear-region switching 차단', evidence: 'GVDD rise/fall, hysteresis, default gate state and nFAULT', failure: 'MOSFET이 충분히 켜지지 않아 큰 conduction heat를 냅니다.' },
          { label: 'Bus overvoltage', owner: 'Regeneration/source transient와 absorption path', evidence: 'Vdc waveform, brake/load current and device margin', failure: 'OCP가 phase current를 끊어도 bus energy가 voltage rating을 넘습니다.' },
          { label: 'External shutdown', owner: 'MCU와 분리된 gate-energy removal request', evidence: 'Independent path, diagnostic coverage, reset behavior and safety analysis', failure: 'Reference design의 split shutdown을 인증된 STO라고 과장합니다.' },
        ]} />
      </NlpSection>

      <NlpSection id="pcb-bringup" marker="10" tone="teal" question="Schematic ERC가 통과했다면 어떤 physical proof가 아직 하나도 없는가?" title="PCB zoning과 low-energy bring-up이 command를 physical evidence로 바꾼다">
        <p>PCB에서는 같은 net name도 copper 위치에 따라 다른 voltage가 됩니다. High current가 흐르는 source segment를 gate driver return과 공유하면 package source보다 driver가 보는 ground가 움직입니다. Shunt sense가 load copper에서 갈라지면 shunt voltage와 copper drop이 합쳐집니다. Switch-node plane은 current capability를 위해 필요하지만 너무 넓으면 parasitic capacitance와 EMI coupling area가 늘 수 있습니다. Layout은 보기 좋은 배치가 아니라 어떤 current가 어디로 돌아가는지에 대한 physical model입니다.</p>
        <EvidenceLadder items={[
          { stage: 'Unpowered continuity와 energy state', observe: 'DMM/microscope로 DC+/DC-, phase, gate-source short, polarity, component population과 discharge voltage를 확인합니다.', gate: 'Unknown short와 charged capacitor가 하나라도 있으면 bias를 넣지 않습니다.' },
          { stage: 'Current-limited bias와 UVLO', observe: 'Logic/driver rail sequence, supply current, nFAULT, default gate-off와 shutdown input을 capture합니다.', gate: 'Rail이 unstable하거나 gate가 low로 보장되지 않으면 DC bus를 연결하지 않습니다.' },
          { stage: 'Gate waveform without power transfer', observe: 'Both high/low VGS, dead time, amplitude, rise/fall, Miller bump와 source reference를 봅니다.', gate: 'Overlap, excessive VGS/negative spike 또는 bootstrap refresh failure가 있으면 멈춥니다.' },
          { stage: 'Limited bus commutation', observe: '낮은 energy에서 VSW/VDS overshoot, phase current path, shunt polarity와 amplifier recovery를 같은 timebase로 봅니다.', gate: 'Device margin과 sample-valid window가 없으면 current loop를 닫지 않습니다.' },
          { stage: 'Trip injection', observe: 'Short/overcurrent/UVLO/external shutdown을 제한된 fixture로 주입하고 gate-off latency, cause latch와 reset을 확인합니다.', gate: 'MCU 없이 gate를 제거하지 못하거나 cause identity가 사라지면 load test를 하지 않습니다.' },
          { stage: 'Thermal·regen·envelope expansion', observe: 'Current/frequency/ambient/cable/load sweep에서 loss, bus energy, junction estimate와 repeatability를 측정합니다.', gate: '측정하지 않은 operating region은 production 허용 region으로 등록하지 않습니다.' },
        ]} />
        <BringupEvidenceLab />
        <CapabilityCheck title="이 글의 본문만으로 판정할 수 있어야 하는 것" items={[
          'Energy, commutation, gate-charge와 evidence/protection path를 분리해 schematic과 PCB에서 추적한다.',
          'DC-link stored energy, precharge, discharge와 regeneration headroom을 계산하고 energy destination을 지정한다.',
          'Half-bridge state와 current sign으로 channel/diode path를 그려 shoot-through, recovery와 false turn-on을 구분한다.',
          'Gate charge, bootstrap, Miller coupling, common-source inductance와 dead time을 measured VGS/VSW evidence에 연결한다.',
          'Loop inductance와 current slew로 overshoot를 추정하고 probe-induced ring을 physical ring과 구분한다.',
          'Hot conduction, switching, recovery, gate, shunt와 auxiliary loss를 하나의 budget으로 닫고 uncertainty를 표시한다.',
          'Steady/transient thermal path와 surface/junction temperature의 증거 범위를 구분한다.',
          'Shunt signal, Kelvin error, common-mode recovery와 ADC aperture가 valid current sample을 만드는지 판정한다.',
          'Overcurrent threshold와 fault-off latency를 계산하되 hardware shutdown과 SOA evidence의 경계를 유지한다.',
          'Low-energy bring-up을 evidence gate로 구성해 full-power 이전에 첫 invalid physical layer에서 중단한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'TI TIDA-010956 48 V servo inverter reference design', href: 'https://www.ti.com/tool/TIDA-010956', note: 'Complete architecture, schematic/layout/BOM, switching, propagation, current-sense and thermal evidence. Title claim and demonstrated test point are kept separate.' },
          { label: 'TI High-Power Motor Driver Design · SLVAF66', href: 'https://www.ti.com/lit/an/slvaf66/slvaf66.pdf', note: 'Shoot-through, overcurrent, reverse recovery, parasitic and thermal failure mechanisms.' },
          { label: 'TI Motor Driver PCB Layout · SLVA959B', href: 'https://www.ti.com/lit/an/slva959b/slva959b.pdf', note: 'Bulk/local decoupling, MOSFET/driver placement, switch node, power/gate loop, thermal via, VDS Kelvin and shunt routing.' },
          { label: 'TI DRV8162 gate driver datasheet', href: 'https://www.ti.com/lit/ds/symlink/drv8162.pdf', note: 'Smart gate drive, dead time, dV/dt mitigation, VDS OCP, UVLO, thermal shutdown and split gate-supply behavior.' },
          { label: 'TI INA241 current-sense amplifier datasheet', href: 'https://www.ti.com/lit/ds/symlink/ina241a.pdf', note: 'Wide common-mode inline sensing, enhanced PWM rejection, transient settling/hold and Kelvin layout requirements.' },
          { label: 'TI DC-link Pre-charge Evaluation · SDAA145A', href: 'https://www.ti.com/lit/an/sdaa145a/sdaa145a.pdf', note: 'RC and controlled precharge models, inrush, timing and dissipation tradeoffs.' },
          { label: 'Infineon MOSFET gate-driver PCB layout guideline', href: 'https://www.infineon.com/assets/row/public/documents/24/42/infineon-applicationnote-gatedriver-mosfet-pcb-layout-guidelines-for-mosfet-gatedriver-applicationnotes-en.pdf', note: 'Gate loop, local bypass, ground plane and parasitic-inductance placement guidance.' },
          { label: 'Analog Devices AN-1321 · Current sensing in motor control', href: 'https://www.analog.com/en/resources/app-notes/an-1321.html', note: 'High-side common-mode transients and current-sense amplifier survival/measurement boundary.' },
          { label: 'Analog Devices AN-1308 · PWM common-mode step response', href: 'https://www.analog.com/en/resources/app-notes/an-1308.html', note: 'PWM edge response and current-sense settling as a timed measurement problem.' },
        ]} />
        <div className="not-prose my-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link to={articlePath('ai', 'robot-motor-drive-foc')} className="group rounded-md border border-border p-4 transition-colors hover:border-teal-600/35 hover:bg-teal-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">바로 위 control 기반 · Motor Drive & FOC</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">Torque를 d-q voltage와 legal SVPWM duty로 만드는 coordinate·control contract를 복습합니다.</span></Link>
          <Link to={articlePath('ai', 'reference-ti-tida-010956-2025')} className="group rounded-md border border-border p-4 transition-colors hover:border-violet-600/35 hover:bg-violet-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">Company reference reconstruction · TIDA-010956</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">48 V·85 Arms라는 headline을 schematic, layout, test condition, measured result와 unsupported extrapolation으로 분해합니다.</span></Link>
          <Link to={articlePath('ai', 'robot-drive-energy-braking-safety')} className="group rounded-md border border-border p-4 transition-colors hover:border-amber-600/35 hover:bg-amber-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">다음 physical layer · Drive Energy & Braking</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">Negative torque에서 돌아온 energy가 DC bus를 넘치기 전에 battery·peer axis·brake resistor로 배분되는 조건을 계산합니다.</span></Link>
        </div>
        <Takeaway>좋은 motor-driver hardware는 부품 rating 표가 아니라 energy가 어디에서 오고 어디로 가며, switching current가 어떤 loop를 돌고, fault 때 누가 얼마나 빨리 gate energy를 제거하며, 그 모든 주장을 어떤 physical capture로 반증할 수 있는지를 명시한 시스템입니다.</Takeaway>
      </NlpSection>
    </>
  );
}
