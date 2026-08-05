import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  BrakeChopperFeasibilityLab,
  BrakingCommissioningLab,
  BrakingEnergyContractLab,
  BrakingSupervisorLab,
  BusHeadroomLab,
  CommonBusArbitrationLab,
  EnergySinkAllocatorLab,
  FourQuadrantBrakingLab,
  MechanicalEnergyInventoryLab,
  PowerContactorStateLab,
} from './robot-drive-energy-braking-safety/viz/BrakingEnergyLabs';

const raw = String.raw;

function EnergyLedger({ items }: { items: Array<{ label: string; question: string; evidence: string; failure: string }> }) {
  return <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">{items.map((item, index) => <div key={item.label} className="min-w-0 bg-background p-4"><div className="flex items-center gap-2"><span className="font-mono text-xs font-black text-blue-700/60 dark:text-blue-300/60">{String(index + 1).padStart(2, '0')}</span><p className="text-xs font-black">{item.label}</p></div><p className="mt-3 text-sm font-semibold leading-relaxed">{item.question}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">증거:</strong> {item.evidence}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">놓치면:</strong> {item.failure}</p></div>)}</div>;
}

function EvidenceStages({ items }: { items: Array<{ stage: string; observe: string; gate: string }> }) {
  return <ol className="not-prose my-6 grid gap-2">{items.map((item, index) => <li key={item.stage} className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-border py-3"><span className="font-mono text-lg font-black text-blue-700/45 dark:text-blue-300/45">{String(index + 1).padStart(2, '0')}</span><div><p className="text-sm font-bold">{item.stage}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.observe}</p><p className="mt-2 text-xs font-semibold leading-relaxed">다음 단계 gate · {item.gate}</p></div></li>)}</ol>;
}

export default function RobotDriveEnergyBrakingSafety() {
  return (
    <>
      <BeginnerOpening
        title="움직이던 로봇을 멈추면 에너지는 어디로 갈까?"
        description="정지는 속도 숫자를 0으로 바꾸는 일이 아닙니다. 이미 움직이는 무게에는 에너지가 남아 있습니다. 안전하게 멈추려면 그 에너지를 배터리로 돌려보내거나, 다른 축이 쓰게 하거나, 저항과 마찰에서 열로 바꿔야 합니다."
        familiarScene={<>내리막을 달리던 자전거에서 페달을 멈춰도 자전거는 바로 서지 않습니다. 브레이크 패드가 바퀴의 움직임을 열로 바꾸기 때문에 멈춥니다. 로봇은 더 큰 에너지를 전기와 기계 장치 여러 곳에 나눠 처리합니다.</>}
        steps={[
          { label: '남은 에너지를 센다', detail: '무게, 속도, 높이와 스프링 변형에서 멈출 때 빠져나올 에너지를 계산합니다.' },
          { label: '받아 줄 곳을 고른다', detail: '배터리, 다른 축, 커패시터와 제동 저항이 지금 실제로 받을 수 있는 양을 확인합니다.' },
          { label: '끝 상태를 증명한다', detail: '속도뿐 아니라 버스 전압, 열, 고정 장치까지 안전한 범위에 들어왔는지 측정합니다.' },
        ]}
      />
      <QuestionLead question="모터에 주던 신호를 끄거나 목표 힘을 0으로 만들면, 로봇이 안전하게 멈췄다고 말할 수 있을까?" answer="아닙니다. 신호를 끄면 관성으로 계속 움직일 수 있고, 목표 힘 0은 감속시키는 힘이 아닙니다. 움직임과 높이, 탄성에 저장된 에너지가 실제로 어디로 이동했는지까지 확인해야 합니다." />
      <NlpSection id="energy-contract" marker="01" tone="blue" question="Stop 명령을 보냈다면 robot의 energy는 어디로 사라질까?" title="정지는 speed command가 아니라 energy destination에 대한 계약이다">
        <p>앞 글은 FOC가 negative torque를 만들고 inverter가 power를 DC link 쪽으로 돌려보낼 수 있음을 설명했습니다. 하지만 역방향 current가 흐른다는 사실은 목적지가 있다는 뜻이 아닙니다. 일반 bench supply는 reverse current를 받지 못할 수 있고, battery BMS는 full state of charge, 낮은 온도 또는 fault에서 charging contactor를 열 수 있습니다. 이 순간 capacitor만 남으면 bus voltage는 수 ms 안에 action limit에 도달할 수 있습니다.</p>
        <p>따라서 `stop requested`, `negative torque applied`, `mechanical energy decreased`, `DC energy accepted`, `hazardous motion ended`를 각각 기록합니다. 이 구분이 있어야 control, power electronics, BMS, brake resistor와 mechanical holding brake의 책임을 섞지 않습니다.</p>
        <ConceptPrimer items={[
          { term: 'Coast', meaning: 'Inverter가 적극적으로 감속 torque를 만들지 않고 자연 손실로 speed가 줄어드는 상태.', why: 'PWM off와 hazard motion 종료가 같은 사건이 아님을 분리합니다.' },
          { term: 'Dynamic braking', meaning: 'Phase short나 flux/current 제어로 energy를 motor·inverter loss에서 열로 바꾸는 방식.', why: 'Source로 반환하지 않는 대신 motor와 switch가 thermal sink가 됩니다.' },
          { term: 'Regeneration', meaning: 'Mechanical power를 DC link로 되돌려 battery, source 또는 peer axis가 흡수하게 하는 방식.', why: 'Negative torque 뒤에 runtime-valid electrical destination이 필요합니다.' },
          { term: 'Resistor braking', meaning: 'Chopper가 bus threshold에서 resistor를 연결해 returned energy를 외부 열로 버리는 방식.', why: 'Source가 energy를 못 받을 때도 local sink를 제공하지만 pulse와 fire/thermal limit을 소유합니다.' },
        ]} />
        <MathFormula display>{raw`\underbrace{P_{mech}(t)}_{\text{축의 순간 전력}}=
          \underbrace{T_m(t)\omega(t)}_{\text{토크와 속도의 부호로 흐름 판정}}`}</MathFormula>
        <FormulaNote meaning="Torque와 angular speed의 부호가 같으면 motor가 mechanics에 power를 주고, 반대면 mechanics가 motor를 통해 power를 되돌립니다. Negative current 하나만 보면 rotor가 역회전할 때 quadrant를 틀릴 수 있으므로 torque와 speed convention을 함께 기록합니다." symbols={[[raw`T_m`, 'Declared positive direction의 motor/shaft torque [N·m]'], [raw`\omega`, '같은 positive direction의 angular speed [rad/s]'], [raw`P_{mech}`, 'Motor boundary에서의 signed mechanical power [W]']]} />
        <MathFormula display>{raw`\underbrace{E_{brake}}_{\text{감속이 방출한 에너지}}=
          \underbrace{-\int_{P_{mech}<0}P_{mech}(t)\,dt}_{\text{발전 구간의 전력만 누적}}`}</MathFormula>
        <FormulaNote meaning="정한 convention에서 generator quadrant의 negative mechanical power를 양의 released energy로 누적합니다. 이 joule이 자연 손실, capacitor, battery, resistor 등 어디로 갔는지 같은 boundary와 time interval에서 맞춰야 energy ledger가 닫힙니다." symbols={[[raw`E_{brake}`, 'Braking interval에 mechanics에서 빠져나온 energy [J]'], [raw`P_{mech}<0`, 'Torque와 speed가 반대라 generator로 동작하는 sample 조건']]} />
        <EnergyLedger items={[
          { label: 'Motion request', question: '얼마나 빨리 어떤 payload를 멈추려 하는가?', evidence: 'Trajectory, torque, speed, payload and stop-time request', failure: 'Stop이라는 단어만 있고 peak power와 joule이 없습니다.' },
          { label: 'Conversion', question: '어느 quadrant에서 inverter가 energy를 DC link로 보낼 수 있는가?', evidence: 'Torque/speed sign, phase/DC current and bus voltage', failure: 'Negative iq를 모든 방향에서 regeneration으로 오해합니다.' },
          { label: 'Destination', question: '현재 순간에 누가 W와 J를 받아낼 수 있는가?', evidence: 'BMS/source sink allowance, peer-axis load, chopper state and temperature', failure: '연결돼 있다는 이유로 battery나 supply를 bidirectional이라고 가정합니다.' },
          { label: 'Final state', question: 'Motion과 stored electrical energy가 모두 bounded state에 도달했는가?', evidence: 'Final speed/position, holding state, downstream Vdc and discharge proof', failure: 'Motor가 느려졌지만 bus나 vertical load가 위험 상태로 남습니다.' },
        ]} />
        <BrakingEnergyContractLab />
      </NlpSection>

      <NlpSection id="mechanical-inventory" marker="02" tone="amber" question="Brake resistor를 고르기 전에 왜 payload와 gearbox부터 다시 봐야 할까?" title="Electronics가 받을 energy는 mechanics가 먼저 결정한다">
        <p>Braking component는 motor nominal power가 아니라 실제 motion이 방출하는 peak power, pulse energy와 반복 평균 power로 정합니다. Motor rotor, gearbox, link와 payload inertia를 한 coordinate로 환산하되 같은 inertia를 motor-side equivalent와 load-side term에 두 번 넣지 않습니다. Vertical axis는 speed가 일정해도 내려오는 동안 gravitational potential energy를 계속 방출합니다. Spring이나 compliant transmission은 shaft speed가 0에 가까워진 뒤에도 energy를 내놓을 수 있습니다.</p>
        <MathFormula display>{raw`\underbrace{\Delta E_{rot}}_{\text{회전 에너지 감소}}=
          \underbrace{\frac{1}{2}J_{eq}\left(\omega_0^2-\omega_1^2\right)}_{\text{한 경계로 환산한 관성}}`}</MathFormula>
        <FormulaNote meaning="Initial과 final angular speed 사이의 rotational kinetic-energy 감소입니다. Jeq는 선택한 motor 또는 joint coordinate로 환산한 전체 inertia이며, gear ratio와 efficiency convention을 명시합니다. 이미 reflected된 payload inertia를 별도 항으로 다시 더하지 않습니다." symbols={[[raw`J_{eq}`, '선택한 coordinate에 반영된 equivalent inertia [kg·m²]'], [raw`\omega_0,\omega_1`, 'Braking 전후 angular speed [rad/s]']]} />
        <MathFormula display>{raw`\underbrace{\Delta E_{trans}}_{\text{병진 에너지 감소}}=
          \underbrace{\frac{1}{2}m\left(v_0^2-v_1^2\right)}_{\text{이동 질량의 운동 에너지 감소}}`}</MathFormula>
        <FormulaNote meaning="Mobile base나 linear axis의 translational kinetic-energy 감소입니다. Wheel/motor rotation을 별도 rotational term으로 더할 때 mass-equivalent 모델과 중복되지 않는지 확인합니다." symbols={[[raw`m`, '선택한 translation boundary에서 움직이는 effective mass [kg]'], [raw`v_0,v_1`, 'Braking 전후 linear speed [m/s]']]} />
        <MathFormula display>{raw`\underbrace{\Delta E_g}_{\text{중력 에너지 감소}}=
          \underbrace{mg(h_0-h_1)}_{\text{내려간 높이만큼 위치 에너지 감소}}`}</MathFormula>
        <FormulaNote meaning="Payload가 내려가면 h0-h1이 양수가 되어 drive가 흡수하거나 dissipate해야 할 energy가 늘어납니다. 위로 드는 motion에서는 이 항이 반대 방향 power를 요구합니다. Counterweight, spring과 mechanical loss가 있으면 같은 boundary의 work로 따로 기록합니다." symbols={[[raw`m`, 'Gravity를 받는 payload/effective mass [kg]'], [raw`g`, 'Gravitational acceleration [m/s²]'], [raw`h_0-h_1`, 'Braking interval의 downward height change [m]']]} />
        <MathFormula display>{raw`\underbrace{\Delta E_s}_{\text{탄성 에너지 감소}}=
          \underbrace{\frac{1}{2}k\left(x_0^2-x_1^2\right)}_{\text{스프링 변형 에너지 감소}}`}</MathFormula>
        <FormulaNote meaning="Spring, series-elastic actuator, belt와 compliant structure에 저장된 energy 감소입니다. Linear stiffness 근사와 deformation reference를 선언해야 하며, hysteresis와 nonlinear spring은 measured force-displacement integral로 교정합니다." symbols={[[raw`k`, 'Linearized stiffness [N/m]'], [raw`x_0,x_1`, 'Reference에서 측정한 initial/final deformation [m]']]} />
        <MechanicalEnergyInventoryLab />
        <Takeaway>먼저 joule을 셉니다. 그다음 그 joule이 몇 초에 나오는지 계산해 watt를 얻습니다. Motor label이나 continuous resistor wattage에서 거꾸로 stop capability를 상상하면 peak, pulse와 반복 열상태를 놓칩니다.</Takeaway>
      </NlpSection>

      <NlpSection id="quadrants-trajectory" marker="03" tone="violet" question="같은 200 J stop이라도 왜 chopper current는 전혀 다를 수 있을까?" title="Total energy가 같아도 trajectory가 peak braking power를 바꾼다">
        <p>Four-quadrant map은 방향을 알려 주고 trajectory는 시간 분포를 알려 줍니다. `+speed, -torque`와 `-speed, +torque`가 generator quadrants입니다. 그러나 resistor와 source가 보는 stress는 power waveform에 따라 달라집니다. 200 J를 2 s에 보내면 평균 100 W이지만 100 ms의 front-loaded pulse로 보내면 kW급 peak가 생깁니다.</p>
        <p>Natural load도 speed에 따라 달라집니다. Fan처럼 load torque가 speed 제곱에 비례하면 고속에서 자연 감속이 크고 저속에서 급격히 약해집니다. Constant-gravity load는 다른 모양을 가집니다. 자연 손실을 빼고 sink를 줄이려면 그 model과 uncertainty를 실제 coast-down evidence로 확인해야 합니다.</p>
        <MathFormula display>{raw`\underbrace{P_{peak}}_{\text{소자 전류를 정하는 최대값}}=
          \underbrace{\max_t P_{regen}(t)}_{\text{시간축에서 가장 큰 회생 전력}}`}</MathFormula>
        <FormulaNote meaning="Chopper switch, resistor instantaneous current, battery charge-current limit과 bus rise rate는 peak 또는 short-window power에 민감합니다. Average power가 낮아도 first sample의 peak가 hardware limit을 넘을 수 있습니다." symbols={[[raw`P_{regen}(t)`, 'Mechanics/inverter loss를 반영해 DC boundary로 실제 돌아오는 nonnegative power [W]'], [raw`P_{peak}`, 'Declared braking interval의 maximum returned power [W]']]} />
        <MathFormula display>{raw`\underbrace{P_{cycle,avg}}_{\text{반복 발열을 정하는 평균값}}=
          \underbrace{\frac{E_{cycle}}{T_{cycle}}}_{\text{한 주기 에너지를 반복 시간으로 나눔}}`}</MathFormula>
        <FormulaNote meaning="Repeated pick-and-place나 gait cycle에서 resistor/enclosure가 장기적으로 버려야 하는 average power입니다. Peak rating, single-pulse joule curve와 continuous thermal rating은 서로 대체할 수 없으며 세 조건을 모두 통과해야 합니다." symbols={[[raw`E_{cycle}`, '한 complete operation cycle에 sink가 흡수하는 energy [J]'], [raw`T_{cycle}`, '같은 operating cycle의 repetition period [s]']]} />
        <FourQuadrantBrakingLab />
      </NlpSection>

      <NlpSection id="bus-headroom" marker="04" tone="amber" question="2.2 mF capacitor는 5 kW regeneration을 몇 초나 받아낼까?" title="DC-link capacitor는 energy destination이 아니라 반응 시간을 사는 buffer다">
        <p>Capacitor가 받을 수 있는 energy는 voltage difference가 아니라 squared-voltage difference로 정해집니다. Action threshold는 supervisor나 chopper가 개입할 시점이고 hardware maximum은 capacitor, MOSFET, driver와 transient margin을 반영한 마지막 경계입니다. 둘을 같게 두면 sensing delay, computation, chopper turn-on과 wiring overshoot를 위한 공간이 없습니다.</p>
        <MathFormula display>{raw`\underbrace{\Delta E_C}_{\text{제어 개입 전 남은 에너지}}=
          \underbrace{\frac{1}{2}C\left(V_{action}^2-V_0^2\right)}_{\text{두 버스 전압 상태의 에너지 차이}}`}</MathFormula>
        <FormulaNote meaning="현재 measured bus V0에서 software action threshold까지 capacitor가 추가로 저장할 수 있는 joule입니다. Capacitance tolerance, DC bias, temperature와 ESR loss를 반영하고 action threshold 위에도 hardware maximum까지 필요한 response margin을 따로 둡니다." symbols={[[raw`C`, 'Operating condition의 effective DC-link capacitance [F]'], [raw`V_0`, 'Regeneration 직전 downstream bus voltage [V]'], [raw`V_{action}`, 'Torque limit/chopper가 개입해야 하는 measured threshold [V]']]} />
        <MathFormula display>{raw`\underbrace{t_{head}}_{\text{개입까지 남은 시간 근사}}\approx
          \underbrace{\frac{\Delta E_C}{P_{excess}}}_{\text{남은 에너지를 미흡수 전력으로 나눔}}`}</MathFormula>
        <FormulaNote meaning="Unabsorbed regenerative power가 짧은 interval에 거의 일정하다는 first-order deadline입니다. Source나 chopper가 일부를 받으면 Pexcess가 줄고, current/power waveform이 변하면 energy integral로 다시 계산합니다. 이 값은 capacitor가 stop 전체를 처리한다는 뜻이 아니라 controller가 반응할 시간입니다." symbols={[[raw`P_{excess}`, '현재 valid sinks가 받지 못해 capacitor로 들어가는 positive power [W]'], [raw`t_{head}`, 'Vaction에 도달하기 전 first-order available time [s]']]} />
        <BusHeadroomLab />
        <Misconception>Capacitance를 늘리면 headroom은 늘지만 inrush, precharge time, discharge time, fault energy, size와 ripple-current stress도 커집니다. Capacitor는 braking topology를 대체하지 않습니다.</Misconception>
      </NlpSection>

      <NlpSection id="sink-selection" marker="05" tone="teal" question="Battery가 연결돼 있는데도 왜 regenerative sink가 0 W일 수 있을까?" title="Energy sink는 현재 voltage·current·temperature·state에서 검증된 capacity다">
        <p>Battery는 보통 bidirectional이지만 모든 순간에 같은 charging power를 받지 않습니다. BMS는 cell voltage, state of charge, temperature, balancing과 fault state로 허용 charge current를 줄이거나 contactor를 열 수 있습니다. Mains-fed bench supply와 diode input rectifier는 대개 power를 돌려받지 못합니다. Common bus의 peer axis도 지금 실제로 motoring할 때만 sink입니다.</p>
        <p>Sink selection은 효율 순위 하나가 아닙니다. Motor-loss braking은 별도 부품이 없지만 motor thermal capacity에 묶입니다. Battery return은 energy를 재사용하지만 BMS에 의존합니다. Common bus는 conversion loss가 작지만 모든 축 동시 braking을 해결하지 못합니다. Resistor는 local하고 source loss에도 동작할 수 있지만 heat, fire, space와 repetition을 소유합니다. Active regenerative front end는 continuous return이 가능하지만 system complexity와 EMC boundary가 커집니다.</p>
        <MathFormula display>{raw`\underbrace{P_{assigned}}_{\text{실제로 흡수 가능한 합}}=
          \underbrace{\sum_{s\in\mathcal{S}_{valid}}P_s}_{\text{현재 유효한 흡수원만 합산}}`}</MathFormula>
        <FormulaNote meaning="유효 집합에는 nameplate가 아니라 현재 voltage, current, temperature, contactor, communication freshness와 fault state 안에서 guaranteed된 nonnegative absorption power만 들어갑니다. Forecast peer demand나 BMS nominal charge power를 measured capacity처럼 더하지 않습니다." symbols={[[raw`\mathcal{S}_{valid}`, '현재 검증된 battery, bidirectional source, measured peer와 dump sink의 집합'], [raw`P_s`, '집합 안 흡수원 s가 지금 보장하는 power [W]'], [raw`P_{assigned}`, '같은 instant에 실제로 배정 가능한 total sink power [W]']]} />
        <MathFormula display>{raw`\underbrace{P_{excess}}_{\text{궤적이 줄여야 할 초과 전력}}=
          \underbrace{\max\left(0,P_{regen}-P_{assigned}\right)}_{\text{회생 전력에서 유효 흡수 전력을 뺌}}`}</MathFormula>
        <FormulaNote meaning="Positive excess는 capacitor voltage를 올립니다. Headroom deadline 안에 local sink를 켜거나 regenerative torque/deceleration을 줄여야 합니다. Hardware overvoltage trip이 매 stop마다 이 항을 처리한다면 정상 control architecture가 아닙니다." symbols={[[raw`P_{regen}`, 'DC bus로 돌아오는 predicted/measured positive power [W]'], [raw`P_{assigned}`, '같은 instant에 guaranteed된 total sink capacity [W]']]} />
        <EnergySinkAllocatorLab />
      </NlpSection>

      <NlpSection id="brake-chopper" marker="06" tone="violet" question="Resistor wattage가 충분한데도 chopper가 즉시 파괴될 수 있는 이유는 무엇일까?" title="Brake chopper는 resistance·current·power·pulse thermal의 교집합이다">
        <p>Chopper는 bus가 `V_on`을 넘으면 resistor를 연결하고 `V_off` 아래에서 끕니다. Resistor가 너무 작으면 current와 switch stress가 커집니다. 너무 크면 required braking power를 못 버려 bus가 계속 상승합니다. 따라서 first-order design부터 lower와 upper resistance bound가 동시에 존재합니다.</p>
        <MathFormula display>{raw`\underbrace{I_R}_{\text{초퍼가 흘리는 전류}}=
          \underbrace{\frac{V_{dc}}{R_b}}_{\text{버스 전압을 제동 저항으로 나눔}}`}</MathFormula>
        <FormulaNote meaning="Chopper on interval의 ideal current입니다. Switch, wiring, resistor tolerance와 temperature coefficient, bus ripple를 반영해 worst-case current를 계산합니다. Resistor short fault와 current measurement/protection path는 별도입니다." symbols={[[raw`R_b`, 'Brake resistor와 series path의 effective resistance [Ω]'], [raw`V_{dc}`, 'Chopper on 순간 resistor path에 실제 걸리는 voltage [V]']]} />
        <MathFormula display>{raw`\underbrace{P_R}_{\text{켜진 순간의 저항 발열}}=
          \underbrace{\frac{V_{dc}^2}{R_b}}_{\text{버스 전압 제곱을 저항으로 나눔}}`}</MathFormula>
        <FormulaNote meaning="Resistor가 on인 순간 dissipate하는 power입니다. Average required power보다 클 수 있고 chopper duty가 평균을 조절합니다. Voltage tolerance는 제곱으로 들어가므로 maximum bus에서 switch current와 resistor pulse를 함께 확인합니다." symbols={[[raw`P_R`, 'Chopper on interval의 instantaneous resistor power [W]'], [raw`R_b`, 'Operating temperature와 tolerance를 반영한 resistance [Ω]']]} />
        <MathFormula display>{raw`\underbrace{\frac{V_{on}}{I_{sw,max}}}_{\text{허용 전류가 정한 }R_{min}}\le
          \underbrace{R_b}_{\text{선택한 제동 저항}}`}</MathFormula>
        <FormulaNote meaning="Selected resistance가 너무 작아 switch, connector 또는 resistor pulse-current limit을 넘지 않게 하는 lower bound입니다. I_switch,max는 datasheet headline이 아니라 voltage, pulse duration, temperature, SOA와 protection margin을 반영한 allowed current입니다." symbols={[[raw`V_{on}`, 'Worst-case chopper turn-on bus voltage [V]'], [raw`I_{sw,max}`, 'Declared condition에서 chopper path가 허용하는 current [A]']]} />
        <MathFormula display>{raw`\underbrace{R_b}_{\text{선택한 제동 저항}}\le
          \underbrace{\frac{V_{on}^2}{P_{required}}}_{\text{필요 제동 전력이 정한 }R_{max}}`}</MathFormula>
        <FormulaNote meaning="Selected resistance가 너무 커 required power를 dissipate하지 못하는 것을 막는 upper bound입니다. Lower bound가 upper bound보다 크면 부품을 조정하거나 stop profile을 완화해야 하며 계산으로 존재하지 않는 resistor를 만들 수 없습니다." symbols={[[raw`P_{required}`, 'Other valid sinks를 뺀 뒤 chopper가 맡아야 하는 required power [W]'], [raw`R_{max}`, 'Ideal continuous-on first-order power를 만족하는 maximum resistance [Ω]']]} />
        <MathFormula display>{raw`\underbrace{E_{R,pulse}}_{\text{한 번 감속의 저항 에너지}}=
          \underbrace{\int i_R^2(t)R_b\,dt}_{\text{실제 펄스 발열을 시간 누적}}`}</MathFormula>
        <FormulaNote meaning="Resistor는 continuous wattage 외에 pulse duration별 허용 joule과 peak voltage/current를 가집니다. Chopper hysteresis나 PWM으로 current가 끊기면 waveform을 적분하고, repeated pulse의 initial temperature를 제조사 thermal/pulse curve와 대조합니다." symbols={[[raw`i_R(t)`, 'Chopper state와 bus voltage에 따라 변하는 resistor current [A]'], [raw`E_{R,pulse}`, '한 braking event에서 resistor가 흡수한 heat energy [J]']]} />
        <BrakeChopperFeasibilityLab />
        <EnergyLedger items={[
          { label: 'Open resistor', question: 'Chopper command가 있어도 current가 0인가?', evidence: 'Vdc, gate/switch state and resistor current', failure: 'Bus가 action threshold를 지나 hardware max로 갑니다.' },
          { label: 'Short resistor', question: 'On command 즉시 current limit을 넘는가?', evidence: 'Switch current, fuse/OCP and Vdc collapse', failure: 'Chopper switch와 wiring이 fault energy를 받습니다.' },
          { label: 'Overtemperature', question: '한 pulse는 통과하지만 반복 initial temperature가 올라가는가?', evidence: 'Resistor body/hotspot, thermal switch and cycle log', failure: 'Continuous wattage 아래에서도 pulse accumulation으로 fire risk가 생깁니다.' },
          { label: 'Threshold chain', question: 'Measured Vdc, comparator, switch delay와 overshoot가 margin 안인가?', evidence: 'V_on/V_off, tolerance, delay and maximum waveform', failure: 'Nominal threshold는 맞지만 실제 bus가 device limit을 넘습니다.' },
        ]} />
      </NlpSection>

      <NlpSection id="common-bus" marker="07" tone="teal" question="한 축이 4 kW를 회생하고 다른 축이 3 kW를 쓰면 resistor는 1 kW만 필요할까?" title="Common DC는 energy를 재사용하지만 worst case를 없애지 않는다">
        <p>같은 DC bus에서 한 axis의 regenerative current는 다른 axis inverter의 motoring current로 바로 이동할 수 있습니다. Battery round trip이나 resistor loss를 줄이는 좋은 구조입니다. 그러나 3 kW peer demand가 현재 측정된 값인지 future trajectory의 예상인지 구분해야 합니다. Scheduler가 다음 10 ms에 motoring할 것이라는 기대는 현재 capacitor가 받아야 할 4 kW를 흡수하지 않습니다.</p>
        <p>Bus supervisor는 axis별 signed DC power, measurement age와 local limits를 합칩니다. 모든 축이 동시에 emergency deceleration에 들어가는 case, communication이 끊긴 case와 pack contactor가 열린 case를 별도로 평가합니다. Reuse가 높아도 local chopper나 trajectory derating은 worst-case residual을 담당합니다.</p>
        <MathFormula display>{raw`\underbrace{P_{bus}}_{\text{공통 버스의 잔여 전력}}=
          \underbrace{\sum_{i=1}^{N}P_{dc,i}}_{\text{같은 시각의 축별 전력을 합산}}`}</MathFormula>
        <FormulaNote meaning="모든 axis가 같은 sign convention과 synchronized time window를 써야 합니다. 이 글의 Viz에서는 positive를 bus consumption, negative를 bus regeneration으로 둡니다. Stale sample과 forecast는 별도 uncertainty이며 guaranteed sink 합에 넣지 않습니다." symbols={[[raw`P_{dc,i}`, 'Axis i의 measured/predicted signed DC power [W]'], [raw`P_{bus}`, 'Source, battery 또는 dump가 최종적으로 처리할 net common-bus power [W]']]} />
        <CommonBusArbitrationLab />
      </NlpSection>

      <NlpSection id="power-lifecycle" marker="08" tone="blue" question="Precharge timer가 끝났는데 왜 main contactor를 닫으면 안 될 수 있을까?" title="Precharge·run·isolate·discharge는 measured voltage trajectory로 증명한다">
        <p>Contactor coil을 명령한 사실과 contact가 실제로 붙은 사실은 다릅니다. Downstream bus voltage가 너무 느리게 오르면 active load, soft short, open resistor 또는 undersized path일 수 있습니다. 즉시 source voltage로 뛰면 bypass/main contact가 welded됐거나 sequence가 이미 깨졌을 수 있습니다. 정상 curve의 upper/lower envelope와 auxiliary feedback이 timer보다 많은 fault를 드러냅니다.</p>
        <MathFormula display>{raw`\underbrace{V_C(t)}_{\text{사전 충전 전압 궤적}}=
          \underbrace{V_S\left(1-e^{-t/(R_{pre}C)}\right)}_{\text{전원 전압을 향해 지수 상승}}`}</MathFormula>
        <FormulaNote meaning="Ideal source, series resistor와 initially discharged capacitor의 expected curve입니다. Actual Vsource, initial Vdc, leakage/downstream load와 resistance tolerance로 upper/lower envelope를 만듭니다. Timer는 curve를 sample할 시점을 정할 뿐 완료 증거가 아닙니다." symbols={[[raw`R_{pre}`, 'Precharge path의 effective resistance [Ω]'], [raw`C`, 'Downstream DC-link effective capacitance [F]'], [raw`V_S`, 'Precharge 중 measured source-side voltage [V]']]} />
        <MathFormula display>{raw`\underbrace{I_{pre}(0)}_{\text{초기 돌입 전류 근사}}=
          \underbrace{\frac{V_S-V_C(0)}{R_{pre}}}_{\text{초기 전압 차를 사전 충전 저항으로 나눔}}`}</MathFormula>
        <FormulaNote meaning="Zero-volt capacitor를 가정하지 않고 source와 downstream의 initial voltage difference를 사용합니다. Contactor make current, resistor pulse, connector/fuse와 SSR SOA를 이 peak와 actual decay로 검증합니다." symbols={[[raw`V_C(0)`, 'Precharge command 직전 downstream bus voltage [V]'], [raw`I_{pre}(0)`, 'Precharge path의 first-order initial current [A]']]} />
        <MathFormula display>{raw`\underbrace{E_{pre,R}}_{\text{완전 방전 충전의 저항 발열}}\approx
          \underbrace{\frac{1}{2}CV_S^2}_{\text{최종 축전기 저장 에너지와 같은 크기}}`}</MathFormula>
        <FormulaNote meaning="Ideal passive resistor가 capacitor를 0 V에서 ideal source voltage까지 한 번 충전할 때 resistor에서 dissipate되는 energy입니다. Initial bus가 남아 있거나 source/path resistance가 분산되면 각 element의 heat가 달라집니다. 반복 startup rate와 resistor cooling을 별도로 봅니다." symbols={[[raw`E_{pre,R}`, '한 ideal passive precharge에서 resistor가 흡수하는 energy [J]'], [raw`C,V_S`, 'DC-link capacitance [F]와 source voltage [V]']]} />
        <MathFormula display>{raw`\underbrace{t_{safe}}_{\text{discharge 확인 시간}}=
          \underbrace{R_{dis}C\ln\left(\frac{V_0}{V_{safe}}\right)}_{\text{안전 전압까지 지수 감쇠}}`}</MathFormula>
        <FormulaNote meaning="Bleed resistor와 otherwise unloaded capacitor의 first-order discharge time입니다. 실제 enable은 elapsed time이 아니라 downstream measurement가 Vsafe 아래이고 measurement path가 self-tested됐다는 증거입니다. Resistor open, load disconnect와 multiple capacitor domains를 별도 확인합니다." symbols={[[raw`R_{dis}`, 'Downstream bus discharge/bleed resistance [Ω]'], [raw`V_0`, 'Isolation 직전 bus voltage [V]'], [raw`V_{safe}`, 'Risk assessment와 service procedure가 선언한 verification threshold [V]']]} />
        <PowerContactorStateLab />
        <Misconception>Battery contactor를 먼저 여는 것이 항상 안전하지는 않습니다. Regeneration 중 source sink를 갑자기 제거하면 local capacitor가 energy를 받아 bus가 더 빨리 오릅니다. Torque reduction, local dump, contactor current/arc capability와 final isolation order를 하나의 state machine으로 설계합니다.</Misconception>
      </NlpSection>

      <NlpSection id="braking-supervisor" marker="09" tone="amber" question="Sink가 줄었을 때 stop 요청을 어떤 물리량으로 완화해야 할까?" title="Available sink power를 regenerative torque와 stop time으로 되돌린다">
        <p>Supervisor는 battery charge allowance, measured peer demand, chopper thermal derating과 capacitor action headroom을 합쳐 현재 available sink power를 만듭니다. 고속에서는 같은 torque가 큰 power를 만들므로 power limit이 지배적입니다. 저속에서는 `P/omega`가 발산하므로 current/torque limit과 omega floor가 지배합니다.</p>
        <p>목표는 overvoltage comparator가 작동하기 전에 trajectory를 reshape하는 것입니다. Stop time이 늘어날 수 있고, application risk assessment가 그 연장을 허용하지 않으면 더 큰 local sink나 별도 mechanical/safety stop architecture가 필요합니다. Control equation만으로 hazard requirement를 지울 수 없습니다.</p>
        <MathFormula display>{raw`\underbrace{P_{sink,avail}}_{\text{현재 보장된 흡수 전력}}=
          \underbrace{P_{source}+P_{peer}+P_{dump}+P_{head}}_{\text{검증된 흡수원과 짧은 버스 여유}}`}</MathFormula>
        <FormulaNote meaning="Source/BMS, measured peer load, thermally available dump와 short capacitor-headroom allowance를 합친 supervisor input입니다. 각 항의 age, fault state와 duration을 함께 보존하고 headroom을 continuous sink처럼 반복 사용하지 않습니다." symbols={[[raw`P_{dump}`, 'Current/temperature state에서 chopper가 처리 가능한 power [W]'], [raw`P_{head}`, 'Vaction 전까지 짧은 interval에만 허용한 capacitor power budget [W]']]} />
        <MathFormula display>{raw`\underbrace{T_{power,max}}_{\text{흡수 전력이 허용한 토크}}=
          \underbrace{\frac{P_{sink,avail}}{\max(|\omega|,\omega_f)}}_{\text{전력을 유효 속도로 나눠 토크로 변환}}`}</MathFormula>
        <FormulaNote meaning="High speed에서는 available sink power를 speed로 나눈 값이 regenerative torque를 제한합니다. Omega floor는 zero-speed division만 regularize하며, low speed의 physical torque capability는 다음 식의 current/thermal limit이 소유합니다." symbols={[[raw`T_{power,max}`, '현재 sink power가 허용하는 regenerative torque magnitude [N·m]'], [raw`\omega_f`, 'Power-to-torque 변환의 declared low-speed floor [rad/s]']]} />
        <MathFormula display>{raw`\underbrace{|T_{regen,max}|}_{\text{최종 허용 회생 토크}}=
          \underbrace{\min\left(T_{current,max},T_{power,max}\right)}_{\text{전류 제한과 흡수 전력 제한의 교집합}}`}</MathFormula>
        <FormulaNote meaning="전력으로 계산한 토크와 motor/inverter current·thermal envelope가 허용하는 토크 중 작은 값을 사용합니다. Sign, acceleration continuity, gravity torque와 minimum safe deceleration은 상위 trajectory/risk layer가 별도로 처리합니다." symbols={[[raw`T_{current,max}`, 'Motor/inverter current and thermal envelope가 허용하는 regenerative torque [N·m]'], [raw`T_{power,max}`, '현재 sink power와 speed가 허용하는 regenerative torque [N·m]']]} />
        <BrakingSupervisorLab />
      </NlpSection>

      <NlpSection id="commissioning" marker="10" tone="teal" question="한 번 잘 멈춘 robot이 전체 braking envelope를 증명하지 못하는 이유는 무엇일까?" title="Commissioning은 mechanical joule과 electrical joule을 같은 시간축에서 닫는다">
        <p>첫 regenerative test부터 full payload와 production battery를 쓰지 않습니다. Passive continuity와 discharge를 확인하고, current-limited precharge에서 expected curve를 검증한 뒤, reverse current를 받을 수 있는 source나 bounded dump path로 low-energy regeneration을 엽니다. 그 다음 chopper pulse, BMS-open/source-loss injection, repeated cycle, simultaneous-axis와 ambient/SOC matrix로 확장합니다.</p>
        <EvidenceStages items={[
          { stage: 'Passive state와 downstream voltage', observe: 'Resistance, polarity, capacitor voltage, contact auxiliary와 bleed path를 확인합니다.', gate: 'Unknown short, welded state 또는 stored voltage가 없어야 합니다.' },
          { stage: 'Measured precharge trajectory', observe: 'Source/downstream Vdc와 current가 tolerance envelope를 따르는지 봅니다.', gate: 'Timer가 아니라 curve와 contact feedback이 일치해야 합니다.' },
          { stage: 'Limited-energy regeneration', observe: 'Torque×speed integral과 Vdc×Idc integral, source reverse current를 비교합니다.', gate: 'Loss와 uncertainty 안에서 signed energy ledger가 닫혀야 합니다.' },
          { stage: 'Chopper pulse and fault paths', observe: 'V_on/V_off, switch current, resistor joule/temperature, open/short/overtemp response를 capture합니다.', gate: 'Hardware containment과 cause identity가 둘 다 있어야 합니다.' },
          { stage: 'Source/BMS disconnect injection', observe: 'Sink가 0으로 바뀔 때 torque derating 또는 local dump가 bus max 전에 동작하는지 봅니다.', gate: 'Contactor opening이 local overvoltage를 만들지 않아야 합니다.' },
          { stage: 'Repeated full envelope', observe: 'Payload, speed, SOC, battery temperature, ambient, repetition과 axis concurrency를 sweep합니다.', gate: 'Measured matrix 밖을 production capability로 주장하지 않습니다.' },
        ]} />
        <BrakingCommissioningLab />
        <CapabilityCheck title="이 글의 본문만으로 판정할 수 있어야 하는 것" items={[
          'Torque와 speed sign으로 motoring/generating quadrant를 판정하고 released mechanical energy를 적분한다.',
          'Rotational, translational, gravitational and elastic energy를 같은 boundary에서 중복 없이 합산한다.',
          'Peak power, pulse energy와 repeated average power가 서로 다른 component limits를 소유함을 구분한다.',
          'DC-link squared-voltage headroom을 controller/chopper response deadline으로 바꾼다.',
          'Battery, bench supply, peer axis와 resistor를 runtime-valid sink capacity로만 합산한다.',
          'Brake resistor의 current lower bound, power upper bound, pulse joule와 repeated thermal state를 함께 검증한다.',
          'Common bus reuse와 all-axes braking worst case를 동시에 유지한다.',
          'Precharge·main·isolate·discharge transition을 coil command가 아니라 downstream voltage trajectory와 feedback으로 입증한다.',
          'Available sink power를 regenerative torque/deceleration limit으로 되돌려 hardware overvoltage 전에 trajectory를 완화한다.',
          'Electrical braking, controlled stop, mechanical holding과 certified safety stop을 서로 대체하지 않는다.',
        ]} />
        <SourceNotes sources={[
          { label: 'ABB Technical guide No. 8 · Electrical braking · Rev. C', href: 'https://library.e.abb.com/public/20be376000f34dd6b9c513580cf56423/Technical_guide_No_8_3AFE64362534_RevC.pdf', note: 'Mechanics-first braking power, kinetic energy, capacitor headroom, flux/resistor/regenerative/common-DC alternatives and declared industrial example boundaries.' },
          { label: 'TI DC-Link Capacitor Pre-Charge Designs · SDAA145A Rev. A · 2026', href: 'https://www.ti.com/lit/an/sdaa145a/sdaa145a.pdf', note: 'Current conventional RC equations and relay, solid-state and converter alternatives; automotive values are not copied as robot requirements.' },
          { label: 'TI Why Pre-Charge Circuits are Necessary · SLVAFB0', href: 'https://www.ti.com/lit/an/slvafb0/slvafb0.pdf', note: 'Initial, precharge and steady contactor states and contact arcing/welding mechanism.' },
          { label: 'Sensata · How to Design a Precharge Circuit', href: 'https://www.sensata.com/sites/default/files/a/sensata-how-to-design-precharge-circuits-evs-whitepaper.pdf', note: 'Voltage-rise envelope, auxiliary feedback and open/welded/downstream-load diagnostic pattern; vendor percentages remain examples.' },
          { label: 'TI · Stages of motor control', href: 'https://www.ti.com/video/6269668413001', note: 'Coast, anti-voltage surge, regeneration and resistor braking paths with explicit source/battery voltage-current monitoring.' },
          { label: 'TI · Integrated Protection Against Back EMF Overvoltage · SLLA527', href: 'https://www.ti.com/document-viewer/lit/html/slla527', note: 'Generated voltage can exceed connected absolute maximum when no valid energy path exists.' },
          { label: 'TI TIDA-010956 48 V servo inverter', href: 'https://www.ti.com/tool/TIDA-010956', note: 'The preceding physical board context; it does not establish this robot system’s braking sink, BMS or stop certification.' },
        ]} />
        <div className="not-prose my-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link to={articlePath('ai', 'robot-power-electronics-motor-driver')} className="group rounded-md border border-border p-4 transition-colors hover:border-blue-600/35 hover:bg-blue-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">바로 위 hardware 기반 · Power Electronics</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">DC-link, commutation, gate, sensing, protection과 PCB evidence가 braking energy를 실제로 전달하는 경로를 복습합니다.</span></Link>
          <Link to={articlePath('ai', 'reference-abb-electrical-braking-2018')} className="group rounded-md border border-border p-4 transition-colors hover:border-violet-600/35 hover:bg-violet-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">Company research reconstruction · ABB Guide No. 8</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">산업용 guide의 mechanics-first 선택 논리, 6 ms capacitor example, chopper와 common DC를 robot boundary로 다시 검증합니다.</span></Link>
          <Link to={articlePath('ai', 'robot-drive-isolation-emc-functional-safety')} className="group rounded-md border border-border p-4 transition-colors hover:border-teal-600/35 hover:bg-teal-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">다음 system boundary · Isolation, EMC & STO</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">Operational braking과 별도로 insulation, transient integrity, independent torque removal, mechanical holding과 safety evidence를 닫습니다.</span></Link>
        </div>
        <Takeaway>Braking은 negative torque를 만드는 알고리즘이 아니라 released mechanical energy에 대해 power, joule, availability, temperature와 fault state가 모두 유효한 destination을 지정하는 시스템 계약입니다. Destination이 줄면 bus trip을 기다리지 말고 motion request가 먼저 줄어야 합니다.</Takeaway>
      </NlpSection>
    </>
  );
}
