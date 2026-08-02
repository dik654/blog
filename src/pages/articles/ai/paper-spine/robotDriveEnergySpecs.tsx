import type { PaperStudySpec } from './FoundationalPaperStudy';
import AbbBrakingReferenceLab from './viz/AbbBrakingReferenceLab';

const raw = String.raw;

export const abbElectricalBrakingSpec: PaperStudySpec = {
  documentKind: '회사 기술 가이드',
  shortTitle: 'ABB Technical Guide No. 8',
  citation: 'ABB Drives - Technical guide No. 8: Electrical braking, 3AFE64362534 REV C EN',
  yearVenue: '2018 · ABB Drives technical guide · Rev. C',
  sourceUrl: 'https://library.e.abb.com/public/20be376000f34dd6b9c513580cf56423/Technical_guide_No_8_3AFE64362534_RevC.pdf',
  appendixUrl: 'https://www.abb.com/global/en/areas/motion/drives',
  appendixLabel: 'ABB Drives 공식 제품·기술 자료',
  appendixNote: '원문 mirror가 아니라 현재 제품군과 후속 기술 자료를 확인하는 공식 진입점이다.',
  before: 'Drive를 감속시키는 기능은 흔했지만 “negative torque를 만들 수 있다”와 “returned energy를 system이 처리할 수 있다”가 자주 같은 문장으로 압축되었다. Motor nameplate나 continuous resistor wattage에서 시작하면 actual load inertia, speed, stop time, capacitor headroom, duty cycle와 energy destination이 빠진다.',
  authorIntent: 'ABB는 특정 brake resistor를 광고하기보다 mechanical system의 stored energy를 줄이거나 electrical energy로 되돌리는 practical selection method를 제공하려 했다. Cranes, elevators, centrifuges, downhill conveyors and test benches처럼 braking duty가 큰 application을 예로 들고, mechanics에서 power와 energy를 계산한 뒤 flux braking, chopper/resistor, regenerative front end와 common DC를 비교한다.',
  thesis: 'Electrical braking architecture는 motor nominal power가 아니라 torque-speed trajectory, released energy, required stop time and repetition에서 시작해야 한다. DC capacitor는 짧은 headroom만 제공하고, motor loss, resistor, regenerative supply와 common DC는 서로 다른 destination and duty contract를 가지므로 application condition에 맞춰 선택해야 한다.',
  readerBridge: [
    { term: '회생', plain: '모터가 전기를 받아 회전하는 대신, 움직임을 줄이며 발전기처럼 전기를 되돌리는 상태다.', role: '감속 명령이 성공해도 되돌아온 에너지가 갈 곳이 없으면 DC 전압이 오른다는 원인을 설명한다.' },
    { term: 'DC link', plain: '인버터의 여러 스위치 앞에서 전기에너지를 잠시 모아 두는 직류 전압 레일과 축전기다.', role: '몇 줄의 PWM 제어보다 먼저 과전압 한계와 에너지 수용 시간을 계산하게 한다.' },
    { term: '초퍼와 제동 저항', plain: 'DC 전압이 문턱을 넘으면 스위치가 저항을 연결해 남는 전기에너지를 열로 바꾸는 장치다.', role: '전력 peak, 한 번의 joule, 반복 duty와 enclosure 열을 서로 다른 검사로 나눈다.' },
    { term: '공통 DC', plain: '여러 축이 같은 직류 레일을 공유해 감속하는 축의 에너지를 가속하는 축이 바로 쓰게 하는 구조다.', role: '에너지 재사용은 가능하지만 모든 축이 함께 멈출 때 남는 전력을 별도 sink가 받아야 함을 보여 준다.' },
  ],
  reconstruction: [
    { label: 'Mechanics', value: 'T · ω · J · t', note: 'Load와 requested stop에서 peak power and joules를 먼저 계산한다.' },
    { label: 'DC headroom', value: '½C(V₂²−V₁²)', note: 'Capacitor가 얼마의 energy와 몇 ms를 제공하는지 구한다.' },
    { label: 'Destination', value: 'motor · R · grid', note: 'Heat로 버릴지 electrical source로 되돌릴지 topology를 선택한다.' },
    { label: 'System reuse', value: 'ΣP on common DC', note: '여러 drive의 simultaneous signed power를 합쳐 residual을 처리한다.' },
  ],
  mechanism: [
    'Guide pp. 4-5는 practical guideline의 질문을 “stored energy를 줄이거나 electrical energy로 되돌리는 방법”으로 둔다. 이 framing은 braking을 mode name이 아니라 energy transformation으로 정의한다.',
    'P. 6은 mechanical braking power를 torque and angular speed로 계산한다. High speed에서 같은 torque가 더 큰 power를 만들므로 braking device current and cost가 motion operating point에 묶인다.',
    'Pp. 7-11은 constant-torque and quadratic-torque load를 분리한다. Fan example은 natural braking이 speed에 따라 달라지고, active brake를 nominal motor power로 과대 선정하지 않으려면 load curve and requested time을 함께 봐야 함을 보여 준다.',
    'P. 10은 60 kg·m² fan inertia and 1000 rpm에서 kinetic energy를 계산하고 20 s stop의 first average power estimate를 만든다. Natural deceleration을 반영해 500 rpm 이후 10 s에 필요한 active braking power를 약 8.2 kW로 다시 계산한다.',
    'Pp. 12-13의 flux braking은 returned energy 일부를 motor losses로 바꾼다. Extra component가 적지만 repeated braking은 motor thermal stress를 높이고 capability가 motor resistance and size에 의존한다.',
    'P. 13은 diode front end가 reverse power를 source로 반환하지 못하면 DC capacitor voltage가 상승한다고 설명한다. Overvoltage control이 torque를 제한해 bus를 지킬 수 있지만 user-requested speed ramp가 그대로 유지되지는 않는다.',
    'P. 14의 worked example은 5 mF bus가 565 V에서 735 V로 오를 때 90 kW를 약 6 ms만 받는다고 계산한다. 이 숫자는 large-drive condition의 evidence이고, transferable한 것은 squared-voltage energy and time method다.',
    'Pp. 14-15의 chopper는 threshold에서 resistor를 DC bus에 연결한다. Simple and supply-loss capable하다는 장점과 heat, space, cycle rating, fire environment and motor-insulation stress라는 비용을 함께 적는다.',
    'Pp. 16-22는 thyristor and IGBT regenerative alternatives를 continuous braking, energy return, harmonics, power factor, complexity and cost로 비교한다. “Regeneration이 더 좋다”가 아니라 duty and system boundary에 따라 선택한다.',
    'Pp. 23-25의 common DC는 braking motor의 energy를 motoring motor가 사용하게 한다. 하지만 instantaneous total braking이 motoring보다 크면 chopper/resistor or regenerative supply가 residual을 처리해야 한다.',
    'Pp. 26-29의 economics and comparison은 named industrial assumptions 아래에서만 성립한다. P. 29는 90 kW hoisting application, 50% braking cycle and selected equipment를 명시하고 results vary with dimensioning이라고 경계를 둔다.',
    'Robot으로 옮길 때는 ABB의 calculation order and alternative map을 보존하고 voltage, load, battery/BMS, contactors, chopper, enclosure and stop requirement는 target evidence로 전부 교체한다.',
  ],
  equations: [
    {
      latex: raw`\underbrace{P_{mech}}_{\text{축의 제동 전력}}=
        \underbrace{T\omega}_{\text{토크와 속도로 운전점을 고정}}`,
      meaning: 'Guide p. 6의 출발식이다. Braking device를 motor nominal current로 고르지 않고 actual braking torque and speed에서 power를 계산한다. Torque와 speed의 sign convention을 선언하면 motoring and generating quadrant도 함께 결정된다.',
      symbols: [[raw`T`, 'Shaft/load boundary의 signed torque [N·m]'], [raw`\omega`, '같은 boundary의 angular speed [rad/s]'], [raw`P_{mech}`, 'Signed mechanical power [W]']],
    },
    {
      latex: raw`\underbrace{W_{kin}}_{\text{저장된 회전 에너지}}=
        \underbrace{\frac{1}{2}J\omega^2}_{\text{관성과 속도 제곱으로 계산}}`,
      meaning: 'Guide pp. 8-10의 braking-energy calculation이다. 같은 inertia라도 speed가 두 배면 energy는 네 배다. Robot adaptation에서는 reflected inertia boundary, payload potential and elastic energy를 따로 검산한다.',
      symbols: [[raw`J`, '선택한 coordinate의 equivalent inertia [kg·m²]'], [raw`W_{kin}`, '그 coordinate에 저장된 rotational kinetic energy [J]']],
    },
    {
      latex: raw`\underbrace{P_{avg}}_{\text{감속 시간의 첫 평균 추정}}=
        \underbrace{\frac{\Delta W}{\Delta t}}_{\text{방출 에너지를 요청 시간으로 나눔}}`,
      meaning: 'Guide p. 10이 kinetic energy를 stop time으로 나누는 first conservative estimate다. Natural load torque, efficiency and time-varying profile을 추가하면 peak and average가 달라진다. Average power는 chopper peak current나 resistor pulse curve를 대체하지 않는다.',
      symbols: [[raw`\Delta W`, 'Braking interval에 release/absorb해야 하는 energy [J]'], [raw`\Delta t`, 'Requested braking interval [s]']],
    },
    {
      latex: raw`\underbrace{\Delta E_C}_{\text{축전기에 남은 에너지 여유}}=
        \underbrace{\frac{1}{2}C\left(V_2^2-V_1^2\right)}_{\text{두 전압 상태의 에너지 차이}}`,
      meaning: 'Guide pp. 13-14의 DC-link energy relation을 source condition과 분리해 쓴다. 565→735 V industrial example의 값은 복사하지 않고, target robot의 current bus, action threshold and maximum boundary를 넣는다.',
      symbols: [[raw`C`, 'Operating condition의 effective DC-link capacitance [F]'], [raw`V_1,V_2`, 'Initial and upper DC-link voltage [V]']],
    },
    {
      latex: raw`\underbrace{t_{cap}}_{\text{과전압까지 남은 첫 시간}}=
        \underbrace{\frac{\Delta E_C}{P_{reverse}}}_{\text{남은 에너지를 역방향 전력으로 나눔}}`,
      meaning: 'Guide p. 14의 about-6-ms result를 재구성하는 식이다. Constant reverse power and no other sink를 가정한다. 이 time은 capacitor가 whole stop을 처리한다는 rating이 아니라 overvoltage control, chopper or regenerative path가 반응할 deadline이다.',
      symbols: [[raw`P_{reverse}`, 'DC link로 유입되며 아직 다른 sink가 받지 않은 power [W]'], [raw`t_{cap}`, 'Upper voltage에 도달하기 전 first-order time [s]']],
    },
    {
      latex: raw`\underbrace{P_R}_{\text{초퍼가 켜진 순간의 발열}}=
        \underbrace{\frac{V_{dc}^2}{R_b}}_{\text{버스 전압 제곱을 저항으로 나눔}}`,
      meaning: 'Guide의 threshold-connected resistor mechanism을 first-order power로 표현한다. Selection에는 switch current, resistor pulse energy, repetition, thermal switch, enclosure and open/short failure가 추가되어야 한다.',
      symbols: [[raw`V_{dc}`, 'Chopper on interval의 bus voltage [V]'], [raw`R_b`, 'Brake resistor path resistance [Ω]']],
    },
    {
      latex: raw`\underbrace{P_{common}}_{\text{공통 직류의 잔여 전력}}=
        \underbrace{\sum_{i=1}^{N}P_{dc,i}}_{\text{동시에 측정한 구동기 전력 합}}`,
      meaning: 'Guide pp. 23-25의 common-DC principle이다. Motoring drive가 braking energy를 직접 reuse하지만 net result가 regeneration이면 source or resistor가 residual을 처리한다. Future demand는 current sink로 세지 않는다.',
      symbols: [[raw`P_{dc,i}`, 'Drive i의 synchronized signed DC power [W]'], [raw`P_{common}`, 'Common bus가 source/dump에 넘기는 residual power [W]']],
    },
    {
      latex: raw`\underbrace{C_{robot}}_{\text{로봇에서 지지 가능한 주장}}=
        \underbrace{C_{method}\cap C_{target\ evidence}}_{\text{원문 방법과 대상 측정의 교집합}}`,
      meaning: 'Company guide를 robot으로 transfer하는 provenance gate다. Mechanics-first method and topology comparison은 재사용할 수 있지만 ABB industrial values and economics는 target battery, load, timing, thermal and fault evidence가 없으면 robot claim이 되지 않는다.',
      symbols: [[raw`C_{method}`, '원문이 명시적으로 제시한 calculation order and mechanism'], [raw`C_{target\ evidence}`, 'Target robot에서 직접 구현하고 측정한 condition/observation']],
    },
  ],
  mechanismViz: AbbBrakingReferenceLab,
  evidence: [
    {
      label: 'Mechanics',
      question: 'Guide는 왜 motor size보다 torque, speed and stop time에서 시작하는가?',
      intervention: 'Pp. 6-11의 formulas and fan load curve를 constant/quadratic load, kinetic energy, average/peak braking power로 분리한다.',
      observation: 'Natural deceleration and required active braking vary over speed. The worked fan is not sized directly from 90 kW nameplate.',
      supports: 'Braking solution must be dimensioned from the mechanical trajectory and load model.',
      limit: 'Fan natural load does not establish robot gearbox friction, payload gravity, elasticity or required safe-stop time.',
    },
    {
      label: 'Headroom',
      question: 'DC capacitor alone can absorb reverse power for how long?',
      intervention: 'P. 14의 C=5 mF, 565→735 V and P=90 kW values를 squared-voltage energy equation에 넣는다.',
      observation: 'The published example yields approximately 6 ms.',
      supports: 'Overvoltage control, chopper or regenerative path must react on a fast energy timescale.',
      limit: 'The voltage, capacitance and power values do not transfer to a 48 V robot; a separate adaptation can be much shorter or longer.',
    },
    {
      label: 'Chopper',
      question: 'Resistor braking은 어떤 requirement를 해결하고 무엇을 새로 소유하는가?',
      intervention: 'Pp. 14-15의 topology, benefits, drawbacks and application conditions를 claim/condition matrix로 읽는다.',
      observation: 'A local resistor can dissipate energy even during supply loss, but creates heat, space, cycle, fire and insulation-stress constraints.',
      supports: 'Resistor braking is a valid occasional-duty local sink when fully dimensioned.',
      limit: 'No target resistance, transistor, fuse, thermal switch or enclosure rating is provided for the reader.',
    },
    {
      label: 'Alternatives',
      question: '왜 flux, resistor and regenerative front end를 한 “braking mode”로 합치면 안 되는가?',
      intervention: 'Pp. 12-22에서 each topology의 actual energy destination, continuous capability and dependency를 비교한다.',
      observation: 'Motor losses, external heat and electrical network return have different thermal, efficiency, harmonic and complexity tradeoffs.',
      supports: 'Topology choice follows energy destination and duty cycle.',
      limit: 'ABB mains-drive economics do not rank battery-robot options without target BMS and system costs.',
    },
    {
      label: 'Common DC',
      question: 'Peer drive reuse는 chopper를 없앨 수 있는가?',
      intervention: 'Pp. 23-25의 common bus topology and residual braking explanation을 signed power sum으로 reconstruct한다.',
      observation: 'Motoring drives can consume braking energy directly; chopper or regenerative supply remains when instantaneous net braking is positive toward the bus.',
      supports: 'Multi-axis energy reuse reduces conversion loss and may reduce dump size.',
      limit: 'All-axes braking, stale forecasts, bus faults and source disconnect still require local residual handling.',
    },
    {
      label: 'Comparison',
      question: 'Pp. 26-29의 cost/footprint table은 universal ranking인가?',
      intervention: 'Table footnotes, 90 kW hoisting condition, 50% braking cycle and named equipment assumptions를 결과와 함께 보존한다.',
      observation: 'The guide explicitly states that results vary with equipment and dimensioning.',
      supports: 'A bounded industrial comparison can illustrate selection dimensions.',
      limit: 'Footprint percentages, efficiency, harmonic and cost results cannot be copied to a low-voltage robot.',
    },
  ],
  workedTransfer: {
    title: '48 V 로봇 관절이 100 J를 돌려보낼 때 DC capacitor만 믿을 수 있을까?',
    setup: '예시 관절의 등가 관성은 0.08 kg·m², 감속 시작 속도는 50 rad/s다. DC link는 4 mF이고 현재 52 V, 허용 상한은 60 V라고 하자. 배터리는 저온 상태라 충전 전력을 받지 않는다고 가정한다. 이 숫자는 제품 권고가 아니라 ABB의 계산 순서를 저전압 로봇에 옮기는 교육용 입력이다.',
    steps: [
      {
        label: '기계 에너지',
        reasoning: '회전 운동에너지는 1/2×0.08×50²=100 J다. 중력으로 내려오는 축이라면 위치에너지와 스프링 에너지를 더하고, 마찰과 모터 손실이 실제로 소비할 양은 별도 모델로 뺀다.',
        result: '처리해야 할 대상은 모터 정격 kW가 아니라 이번 정지에서 방출되는 joule과 시간 profile이다.',
      },
      {
        label: '축전기 여유',
        reasoning: '전압 52→60 V 사이 축전기 여유는 1/2×0.004×(60²-52²)=1.792 J다. 1.2 kW가 순유입되면 약 1.49 ms 만에 이 여유를 채운다.',
        result: '축전기는 100 J 정지의 목적지가 아니라 보호 경로가 반응할 짧은 시간만 벌어 준다.',
      },
      {
        label: '목적지 선택',
        reasoning: '배터리 BMS가 지금 충전을 거부하므로 “평소에는 battery가 받는다”는 경로는 unavailable이다. 다른 축도 감속 중이면 common DC 재사용량도 0에 가깝다. 남은 에너지는 검증된 resistor/chopper 또는 별도 regenerative source가 받아야 한다.',
        result: '가용성은 topology 이름이 아니라 매 순간의 BMS·접촉기·peer-axis 상태까지 포함한 runtime contract다.',
      },
      {
        label: '부품 검증',
        reasoning: '예를 들어 58 V에서 2 Ω 경로라면 순간 전력은 약 1.68 kW다. 그러나 이 한 숫자로 선정은 끝나지 않는다. Switch current와 SOA, 한 pulse의 100 J, 반복 간격, 저항 온도, 단선·단락, fuse와 enclosure 화재 경계를 함께 닫아야 한다.',
        result: 'Peak watt, pulse joule과 반복 평균 watt를 같은 정격 한 칸으로 합치지 않는다.',
      },
    ],
    decision: '이 조건에서는 capacitor-only 정지를 거절하고, 배터리 수용 불가와 동시 전축 감속을 포함해도 남는 에너지를 처리하는 local sink를 설계·시험한다. 제어 ramp 성공과 DC 과전압 방지는 별도 acceptance 항목이다.',
    boundary: 'ABB의 565→735 V, 90 kW 예시나 경제성 표를 48 V 로봇에 복사하지 않는다. 재사용하는 것은 mechanics에서 joule을 구하고 destination을 고른 뒤 pulse·반복·fault evidence로 닫는 순서뿐이다.',
  },
  implementation: [
    'Pin the exact document identifier, revision and date: 3AFE64362534 REV C EN, 31 May 2018. Do not silently mix later product manuals with the guide evidence.',
    'Declare a signed power convention and one mechanics boundary. Normalize rpm to rad/s, torque to N·m, inertia to kg·m², energy to J and power to W.',
    'Reproduce P=Tω, kinetic energy and energy/time calculations from the source example before adapting any robot numbers.',
    'Separate ABB published values, calculated results and explanatory robot adaptation in the IR and UI.',
    'For the robot adaptation, inventory reflected rotational, translational, gravitational and elastic terms, then produce peak, pulse and repeated-average power.',
    'Calculate target capacitor headroom and deadline from measured initial/action/max bus values. Keep harness overshoot and hardware response margin outside the compact source example.',
    'Build an energy-destination matrix for battery/BMS, source, motor loss, common bus, resistor and regenerative front end. Availability is a runtime state.',
    'Dimension a chopper using resistance current/power interval, switch SOA, pulse energy, repetition and enclosure thermal evidence. The source guide alone cannot close these fields.',
    'Build common-bus arbitration from synchronized measured axis powers and preserve simultaneous-all-braking and source-disconnect tests.',
    'Reproduce precharge, contactor, discharge and fault states from current target documents, not from this ABB guide, and label those additions as modern target engineering.',
    'Commission from limited energy and close a measured ledger: mechanical integral, DC integral, sink current, capacitor voltage, resistor temperature and final motion.',
  ],
  assumptions: [
    'ABB page numbering, formulas and example conditions are read from the pinned Rev. C PDF.',
    'The selected mechanics boundary does not double count reflected inertia or energy terms.',
    'Power and energy values compared in one ledger use synchronized time windows and one sign convention.',
    'Natural load or friction is subtracted only when a target coast-down/model uncertainty is available.',
    'Battery, source and peer-axis absorption are runtime conditions, not assumed from connection or forecast.',
    'Safety stop, mechanical holding, insulation and EMC requirements remain separate from this braking-selection guide.',
  ],
  failures: [
    'Copying the ABB 6 ms example as a generic capacitor response time hides the squared dependence on target voltage and capacitance.',
    'Sizing a robot brake path from motor nameplate power ignores payload, gear, gravity, stop time and repeated duty.',
    'Treating common-bus peer demand as guaranteed future absorption causes overvoltage when all axes brake together.',
    'Choosing a resistor from continuous watts ignores switch current, pulse joules, repetition and enclosure fire/thermal behavior.',
    'Calling overvoltage torque control a guaranteed stop preserves the bus by lengthening or changing the requested trajectory.',
    'Inferring battery/BMS acceptance, contactor diagnosis, holding brake or certified STO from the guide exceeds its evidence.',
    'Presenting ABB industrial cost/THD/footprint table as a robot product ranking erases its named application and equipment assumptions.',
  ],
  legacy: 'The guide remains useful because it imposes a durable order on a cross-domain problem: mechanics defines released power and energy; DC capacitance exposes response time; topology selects the destination; duty and system context decide thermal, efficiency and cost. Modern robot drives add batteries, BMS, distributed axes, fast electronics and safety analysis, but they do not remove that order. The correct reuse is the decision method and evidence discipline, not the industrial values.',
  nextReading: 'Apply the guide’s method in Robot Drive Energy & Braking Safety, where battery acceptance, common-bus allocation, resistor feasibility, contactor/precharge/discharge and torque supervisor are reconstructed for a 48 V class robot. Then continue to isolation, EMC and functional safety; electrical braking alone does not provide holding or certified STO.',
  capabilities: [
    'ABB guide의 author question and source revision을 설명한다.',
    'Mechanical torque-speed trajectory에서 braking power, energy and stop-time estimate를 재구성한다.',
    'Published fan and 6 ms capacitor examples의 conditions and supported claims를 분리한다.',
    'Flux, resistor, regenerative front-end and common-DC energy destinations를 비교한다.',
    'Common bus reuse가 residual sink requirement를 없애지 않는 이유를 signed power로 계산한다.',
    'ABB industrial values and robot adaptation values를 provenance상 분리한다.',
    'Guide가 BMS, contactor diagnostics, holding brake and certified safety stop을 입증하지 않음을 판정한다.',
    '새 company research 글을 claim, condition, observation, transfer and limit IR로 정규화한다.',
  ],
};
