import type { PaperStudySpec } from './FoundationalPaperStudy';
import TidaStoReferenceLab from './viz/TidaStoReferenceLab';

const raw = String.raw;

export const tida01599StoSpec: PaperStudySpec = {
  documentKind: '회사 reference design·독립 concept assessment',
  shortTitle: 'TI TIDA-01599 + TÜV TF97657T',
  citation: 'Texas Instruments, TIDA-01599 TUEV-Assessed Safe Torque Off Reference Design for Industrial Drives, Design Guide TIDUDS9B; TÜV SÜD Technical Report TF97657T Rev. 1.1',
  yearVenue: '2022 · TI Design Guide Rev. B + TÜV SÜD concept report',
  sourceUrl: 'https://www.ti.com/lit/ug/tiduds9/tiduds9.pdf',
  appendixUrl: 'https://www.ti.com/tool/TIDA-01599',
  appendixLabel: 'TI TIDA-01599 공식 자료 허브',
  appendixNote: 'Design guide, schematic, BOM, FMEA와 revision artifact를 연결하는 제품 자료 페이지다.',
  additionalSources: [
    { label: 'TÜV SÜD Assessment Report TF97657T Rev. 1.1', href: 'https://www.ti.com/lit/pdf/TIDUF02', note: 'Concept assessment의 검토 대상, 제외 범위와 최종 사용자 책임을 직접 확인한다.' },
  ],
  before: 'A controller can command zero torque or PWM disable, but the same MCU, supply, logic and gate path may fail in a way that preserves torque-producing energy. Simply duplicating an input wire does not create an independent safety function. Drive designers needed a concrete dual-channel, de-energize-to-trip subsystem with documented assumptions, fault behavior, diagnostics and assessor review.',
  authorIntent: 'TI built TIDA-01599 as a reusable STO subsystem concept for three-phase inverters using isolated CMOS-input gate drivers. The guide exposes a 1oo2/HFT1 architecture, separate primary and secondary gate-power removal paths, feedback and diagnostic interfaces, test-pulse behavior and measured response examples. TÜV SÜD separately reviewed the concept architecture and block FMEA to judge whether it could support the intended applications under stated assumptions.',
  thesis: 'A reference STO architecture can be generally suitable for demanding SIL/PL applications only as a bounded subsystem concept. The final claim remains conditional on protected supplies, rail-decay and pulse assumptions, preserved channel independence, quantitative analysis, implemented diagnostics, exact hardware revision, machine integration and a functional-safety lifecycle. “Capable of supporting” must never be rendered as “this robot is certified.”',
  readerBridge: [
    { term: 'STO', plain: 'Safe Torque Off. 모터를 원하는 위치에 세우는 기능이 아니라, 인버터가 토크를 새로 만들어 낼 능력을 차단하는 안전 기능이다.', role: '정지 명령, 기계 브레이크, 전원 방전과 서로 다른 끝점을 구분한다.' },
    { term: '1oo2', plain: '두 경로 중 하나만 정지 요구를 받아도 안전 상태로 가는 구조다.', role: '입력 두 개라는 외형보다 실제 gate-power 제거 경로가 독립인지 보게 한다.' },
    { term: 'HFT 1', plain: '한 개의 위험한 hardware fault가 생겨도 안전 기능을 잃지 않도록 견딘다는 구조적 목표다.', role: '두 번째 fault와 공통 원인 고장은 여전히 경계 밖이라는 사실을 붙잡는다.' },
    { term: '진단 시험 간격', latex: raw`DTI`, plain: '숨어 있는 fault를 다음 위험 요구 전에 찾아내야 하는 최대 시간이다.', role: 'feedback 선 하나가 있다는 사실과 실제로 fault를 검출·조치하는 능력을 분리한다.' },
  ],
  reconstruction: [
    { label: 'Demand', value: 'STO_1 · STO_2', note: 'Two active-low 24 V inputs receive a de-energize-to-trip demand.' },
    { label: 'Independent paths', value: 'VCC · P24', note: 'One channel removes primary logic power; the other removes isolated secondary gate power.' },
    { label: 'Physical endpoint', value: 'Gate power off', note: 'The declared subsystem endpoint is loss of torque-producing gate capability, not zero motion.' },
    { label: 'Evidence boundary', value: 'assume · test · assess', note: 'External assumptions, board measurements and concept-assessor conclusions stay separate.' },
  ],
  mechanism: [
    'Design guide p. 1 defines the subsystem as dual-channel 1oo2 with HFT1 and de-energize trip. Both STO inputs active-low remove primary and secondary gate-driver supplies through load switches.',
    'P. 4 separates the paths. STO_1 controls the primary-side VCC/logic supply. STO_2 removes P24 feeding the isolated DC/DC and secondary-side gate-driver rails. A diagnostic MCU is connected but explicitly outside the safety path.',
    'Pp. 5-6 list generic and design-specific assumptions. Protected 3.3 V/24 V supplies, secondary-rail decay below the required state, an external temperature sensor/shutdown and constrained input pulse behavior are necessary inputs rather than properties proven by the board alone.',
    'The same boundary excludes quantitative PFH/MTTFd analysis, PCB-level common-cause work, diagnostic firmware/software and some voltage-protection behavior from the concept study. Headline targets must be read together with these exclusions.',
    'Pp. 10-12 use a truth table to distinguish normal, STO, channel mismatch and dangerous combinations. One channel fault can be tolerated or diagnosed, while two dangerous faults or a common-cause path exceed HFT1.',
    'The pulse contract accepts a valid low input longer than 2 ms and supports rejection of pulses shorter than 1 ms. The intermediate range cannot be left semantically ambiguous in a final system interface.',
    'Pp. 27-32 show board observations: about 2.7 ms from STO_1 to RDY, 7.4 ms from STO_2 to RDY and 1.52 ms from trip-zone event to PWM shutdown, plus short-pulse experiments. These observations identify specific test points and do not measure robot motion-safe time.',
    'The test section states that shown measurements use PCB Rev. E1.0, while the public design is E2.1. Pp. 25-26 list major changes including separated isolators/logic for HFT1, safe-fail switching, feedback and power-rail changes. Evidence cannot silently move between revisions.',
    'TÜV report TF97657T reviews concept/system structure and block FMEA. It describes the architecture as generally suitable/capable of supporting intended use, not as a certificate for every derivative implementation.',
    'The report leaves functional-safety management, self-test implementation, final diagnostic effectiveness, DTI, integration and verification to the user. Its ISO 13849 reference is the historical 2015 edition, which must be distinguished from current ISO 13849-1:2023 work.',
    'A robot integration must add motion-risk allocation. STO removes torque-producing power; controlled deceleration, vertical-axis holding, coast distance, DC-link discharge, EMC and insulation coordination remain separate functions and evidence sets.',
  ],
  equations: [
    {
      latex: raw`\underbrace{S_{STO}}_{\text{토크 차단 상태}}=
        \underbrace{S_A\cup S_B}_{\text{어느 한 채널의 안전 요구로 진입}}`,
      meaning: '1oo2의 functional intuition을 set relation으로 나타낸다. Channel A 또는 B 중 하나가 valid STO demand를 인식하면 subsystem이 declared safe-output state로 가야 한다. 실제 logic polarity, discrepancy handling and reset rules는 truth table과 회로에서 검증해야 하며 이 식은 reliability probability가 아니다.',
      symbols: [[raw`S_A,S_B`, 'Channel A/B가 valid trip demand를 인식한 event/state'], [raw`S_{STO}`, 'Declared gate-power torque-off output state']],
    },
    {
      latex: raw`\underbrace{D_{system}}_{\text{시스템 위험 고장 집합}}=
        \underbrace{(D_A\cap D_B)}_{\text{두 경로가 함께 실패}}\cup
        \underbrace{D_{CCF}}_{\text{공통 원인 실패}}`,
      meaning: 'HFT1의 경계를 숨기지 않기 위한 conceptual failure set이다. Independent dangerous failures가 둘 다 존재하거나 common-cause event가 양쪽을 함께 무너뜨리면 system function이 상실될 수 있다. Channel failure probabilities를 곱하려면 independence와 quantitative source data가 별도로 필요하다.',
      symbols: [[raw`D_A,D_B`, 'STO removal channel A/B의 dangerous-failure event'], [raw`D_{CCF}`, 'Shared supply, connector, layout, environment or design cause가 두 path를 함께 망가뜨리는 event']],
    },
    {
      latex: raw`\underbrace{DC}_{\text{위험 고장 진단 비율}}=
        \frac{\underbrace{\lambda_{DD}}_{\text{발견되는 위험 고장률}}}{
        \underbrace{\lambda_{DD}+\lambda_{DU}}_{\text{전체 위험 고장률}}}`,
      meaning: 'Diagnostic interface가 있다는 사실과 claimed diagnostic coverage를 분리한다. Each dangerous failure mode가 stimulus/feedback에서 observable하고 monitor가 DTI 안에 판정해야 λDD로 분류할 수 있다. TIDA concept의 MCU connector가 final firmware coverage를 대신 입증하지 않는다.',
      symbols: [[raw`\lambda_{DD}`, 'Dangerous detected failure rate [1/time]'], [raw`\lambda_{DU}`, 'Dangerous undetected failure rate [1/time]'], [raw`DC`, 'Declared population의 diagnostic coverage ratio']],
    },
    {
      latex: raw`\begin{aligned}
        \underbrace{t_{STO}}_{\text{전자 경로의 응답 시간}}
        &=\underbrace{t_{input}+t_{filter}}_{\text{입력·펄스 판정}}\\[3pt]
        &\quad+\underbrace{t_{logic}+t_{switch}}_{\text{채널·전원 차단}}\\[3pt]
        &\quad+\underbrace{t_{rail}+t_{gate}}_{\text{절연 전원·게이트 감쇠}}
        \end{aligned}`,
      meaning: 'Board measurement를 reusable timing budget으로 바꾼 식이다. STO_1과 STO_2는 path가 달라 각 maximum term과 test point를 별도로 측정한다. Published 2.7/7.4 ms examples는 Rev. E1.0의 observations이며 coast, holding-brake engagement and DC-link discharge가 포함되지 않는다.',
      symbols: [[raw`t_{input},t_{filter}`, '24 V input recognition and pulse-filter delays [s]'], [raw`t_{logic},t_{switch}`, 'Logic decision and load-switch delays [s]'], [raw`t_{rail},t_{gate}`, 'Isolated supply decay and gate-disabled delays [s]']],
    },
    {
      latex: raw`\underbrace{P_{class}(w)}_{\text{입력 펄스 분류}}=
        \begin{cases}
        \text{진단 펄스로 무시}, & w<1\,\mathrm{ms}\\
        \text{유효한 정지 요구}, & w>2\,\mathrm{ms}\\
        \text{시스템 계약에서 별도 규정}, & \text{그 사이}
        \end{cases}`,
      latexCompact: raw`\begin{aligned}
        w<1\,\mathrm{ms}&:\ \text{진단 펄스}\\
        1\!\le\!w\!\le\!2\,\mathrm{ms}&:\ \text{별도 계약}\\
        w>2\,\mathrm{ms}&:\ \text{정지 요구}
        \end{aligned}`,
      meaning: 'Guide의 short-pulse support와 valid-input assumption을 interface contract로 읽는다. 1~2 ms band를 “아마 괜찮다”고 두지 않고 upstream OSSD, filter tolerance and final logic에서 금지하거나 deterministic response를 정의한다. Boundary values와 maximum repetition은 pinned guide/current component data로 확인한다.',
      symbols: [[raw`w`, 'STO input low pulse width [s]'], [raw`P_{class}`, 'Pulse width에 대한 declared final-system classification']],
    },
    {
      latex: raw`\begin{aligned}
        \underbrace{C_{final}}_{\text{최종 구현의 주장}}
        &=\underbrace{C_{concept}\cap C_{assume}\cap C_{diag}}_{\text{개념·가정·진단 증거}}\\[3pt]
        &\quad\cap\underbrace{C_{revision}\cap C_{machine}}_{\text{개정·기계 증거}}
        \end{aligned}`,
      meaning: 'TIDA/TÜV evidence transfer rule이다. Final claim은 concept badge의 확장이 아니라 architecture, assumptions, diagnostics, exact revision and machine tests가 모두 겹치는 범위다. 한 set이 비어 있거나 stale하면 final claim도 줄어들며 assessor report의 문구가 gap을 채우지 않는다.',
      symbols: [[raw`C_{concept}`, 'TÜV concept review와 reference architecture가 직접 지지한 claim set'], [raw`C_{assume},C_{diag}`, 'Final system이 증명한 external assumptions and diagnostics sets'], [raw`C_{revision},C_{machine}`, 'Exact tested artifact and machine-integration evidence sets']],
    },
  ],
  mechanismViz: TidaStoReferenceLab,
  evidence: [
    {
      label: 'Architecture',
      question: '두 STO channel은 실제로 어떤 torque-producing path를 제거하는가?',
      intervention: 'Guide p. 4 block diagram에서 STO_1 primary VCC path, STO_2 P24/isolated secondary path and MCU diagnostic branch를 분리한다.',
      observation: 'The channels remove different gate-driver power domains and the MCU sits outside the declared safety path.',
      supports: 'A de-energize-to-trip 1oo2/HFT1 functional architecture can be built with separate removal paths.',
      limit: 'It does not prove target PCB independence, complete supply safety, gate discharge, motor stop or whole-machine certification.',
    },
    {
      label: 'Assumptions',
      question: 'Headline target가 성립하려면 final designer가 어떤 external condition을 보장해야 하는가?',
      intervention: 'Guide pp. 3, 5-6의 target values, protected-supply assumptions, rail decay, temperature monitor, pulse contract and excluded analyses를 one ledger로 읽는다.',
      observation: 'Multiple safety-relevant properties are assumed or assigned to the system integrator rather than measured by the concept board.',
      supports: 'The guide exposes a useful assumption boundary for derivative design.',
      limit: 'Nominal/maximum response, PFH, DC/SFF and mission targets are not completed quantitative proof for a target robot.',
    },
    {
      label: 'Truth table',
      question: 'HFT1은 어떤 fault까지 견디고 어디에서 끝나는가?',
      intervention: 'Guide p. 11 channel input/feedback combinations을 single dangerous fault, mismatch, dual fault and diagnostic action으로 재분류한다.',
      observation: 'One fault can be contained/detected while simultaneous dangerous faults can preserve normal state.',
      supports: 'The architecture boundary is HFT1 and requires discrepancy monitoring.',
      limit: 'Truth-table structure alone does not establish final diagnostic coverage, CCF score, MTTFd or software integrity.',
    },
    {
      label: 'Timing',
      question: 'Published response examples support exactly which endpoint?',
      intervention: 'Pp. 27-32의 scope captions, test points, pulse widths and board revision을 2.7 ms, 7.4 ms and 1.52 ms observations와 함께 보존한다.',
      observation: 'Primary, isolated-supply and trip-zone paths have different measured delays on the shown assembly.',
      supports: 'Path-specific electronics response can be measured and short diagnostic pulses can be filtered in the stated setup.',
      limit: 'The data does not establish E2.1 maximum timing, motor coast, brake engagement, DC discharge or machine safe time.',
    },
    {
      label: 'Revision',
      question: '왜 E1.0 waveform을 E2.1 board claim으로 자동 승계하면 안 되는가?',
      intervention: 'Pp. 25-26 revision list와 test-section assembly statement를 architecture/timing evidence graph로 연결한다.',
      observation: 'Major changes touch channel separation, switches, feedback, power rails and PCB layers.',
      supports: 'Revision provenance is safety evidence, not release-note trivia.',
      limit: 'A newer design artifact does not prove every earlier measurement still holds without impact analysis and retest.',
    },
    {
      label: 'TÜV scope',
      question: 'Independent report가 실제로 review한 것과 final user에게 남긴 것은 무엇인가?',
      intervention: 'TF97657T pp. 5-8의 basis, reviewed documents, architecture/FMEA results, exclusions and summary language를 분리한다.',
      observation: 'The concept architecture is generally capable of supporting intended use, while FSM, self-tests, final diagnostics/DTI and integration remain outside or require re-evaluation.',
      supports: 'Independent concept review adds bounded confidence in the architecture and qualitative analysis.',
      limit: 'It is not a certificate for a derivative PCB, firmware, robot machine, current standards compliance or lifecycle.',
    },
  ],
  workedTransfer: {
    title: 'STO 입력 두 개가 있으면 한 채널 고장 뒤에도 안전하다고 말할 수 있을까?',
    setup: '수직축 로봇에서 STO_1은 primary gate logic 전원을, STO_2는 isolated secondary gate supply를 끊는다고 하자. 정기 test pulse 중 STO_1 load switch가 short되어 전원을 계속 공급하는 fault가 생겼다. 사용자는 보호문을 열기 전 정지 버튼을 누른다.',
    steps: [
      {
        label: '기능 끝점',
        reasoning: '먼저 “정지 버튼을 눌렀다”가 아니라 두 gate path의 출력 전압이 토크 생성 불가능 상태로 내려가는지를 본다. STO_1은 stuck-on이지만 STO_2가 secondary rail을 제거하면 1oo2 경로는 torque-off endpoint에 도달할 수 있다.',
        result: '한 fault를 견딜 가능성은 있지만, 축이 멈췄거나 아래로 떨어지지 않는다는 뜻은 아니다.',
      },
      {
        label: '독립성 확인',
        reasoning: '두 채널이 같은 24 V 보호회로, connector, PCB 오염 경로 또는 하나의 logic device를 공유하면 그 shared cause가 둘을 함께 살릴 수 있다. HFT1 표시는 common-cause 분석을 생략할 면허가 아니다.',
        result: '두 label이 아니라 실제 energy-removal path와 공유 자원을 회로·layout·wiring 수준에서 추적한다.',
      },
      {
        label: '진단과 시간',
        reasoning: 'STO_1 fault가 STO_FB 또는 rail measurement에서 보이고 DTI 안에 latch되는지 fault injection으로 확인한다. 공개된 2.7 ms·7.4 ms 파형은 특정 E1.0 test point의 관찰값이므로 production revision 최대 시간으로 쓰지 않는다.',
        result: 'Fault 발견, 재기동 금지와 exact board의 최대 gate-off 시간을 별도 증거로 남긴다.',
      },
      {
        label: '기계 안전',
        reasoning: 'STO가 토크 생성을 끊어도 수직축은 중력으로 움직일 수 있다. Controlled deceleration, holding-brake handover, coast distance, access interlock와 DC-link 방전은 각각 별도 safety function과 timing budget을 가져야 한다.',
        result: '“Torque off”와 “사람이 접근해도 안전” 사이의 gap을 machine integration에서 닫는다.',
      },
    ],
    decision: '이 scenario는 단일 stuck-on fault 뒤에도 다른 removal path가 동작하고 fault가 제때 검출되는지 검증하는 데 TIDA concept를 쓸 수 있다. 그러나 derivative PCB와 robot 전체에 SIL 3/PL e 문구를 바로 붙이지 않는다.',
    boundary: 'Reference design과 TÜV concept report가 제공하는 것은 조건부 architecture evidence다. 최종 정량 PFH/MTTFd, diagnostic coverage, CCF, 최신 표준 적용, production revision timing과 수직축 위험 감소는 시스템 소유자가 다시 증명해야 한다.',
  },
  implementation: [
    'Pin exact artifacts: TIDUDS9B Rev. B (Nov. 2022), schematic/PCB/BOM revision, and TF97657T Rev. 1.1 (9 Feb. 2022). Never merge evidence by product name alone.',
    'Define the machine hazard, STO input event, torque-off electronic endpoint and separate motion/holding/access endpoints before adapting the circuit.',
    'Reconstruct STO_1 and STO_2 from input receiver through filter/logic/load switch to primary/secondary gate-driver power and identify every shared supply, connector, clock, route and component family.',
    'Convert every guide assumption and exclusion into an owned requirement, verification method and release gate. Missing owner means no transferred claim.',
    'Build a fault table for stuck high/low, channel cross-short, common supply, load-switch short/open, isolated-rail non-decay, gate-driver fault, feedback fault and MCU/clock loss.',
    'Implement diagnostics outside the torque-producing path where intended, then prove stimulus, observation independence, coverage and maximum DTI with fault injection.',
    'Measure valid/test/intermediate pulse widths across component tolerance, supply, temperature and input noise. Do not leave the 1-2 ms band unclassified.',
    'Measure STO_1 and STO_2 timing from external demand through gate/rail endpoint on the exact production revision. Add coast/fall/brake engagement for machine motion-safe time.',
    'Re-run insulation, EMC immunity/emission and transient tests with actual cable, enclosure, grounding and gate edge rate; concept assessment does not close those interfaces.',
    'Perform quantitative analysis using target component reliability data, architecture, diagnostics, CCF, mission and current applicable standards with competent review.',
    'Attach every released claim to exact hardware, firmware, configuration, test reports and lifecycle/change-control records.',
  ],
  assumptions: [
    'Source statements are read from the pinned TIDUDS9B guide and complete TF97657T report, not from a marketing summary alone.',
    'The selected gate-driver and isolated-supply topology still matches the functional architecture and safe-failure direction being claimed.',
    'Protected supply, rail-decay, temperature and pulse assumptions are converted into target requirements and tests.',
    'Channel independence and common-cause exposure are evaluated at PCB, wiring, environment, software and maintenance levels.',
    'MCU diagnostics are not counted as safety evidence until their implementation, integrity, coverage and timing are verified.',
    'Current IEC/ISO editions and the target jurisdiction are checked separately from the historical basis in the 2022 report.',
  ],
  failures: [
    'Rendering “generally suitable for SIL3 / PL e Cat.3” as “our robot is certified” erases the report’s object, assumptions and final-user duties.',
    'Using two input pins through one shared MCU/supply/switch path creates two labels but not HFT1 independence.',
    'Counting READY or STO_FB generated by correlated logic as independent proof overstates diagnostic effectiveness.',
    'Treating the 2.7/7.4 ms examples as maximum machine stop time ignores revision, test point, coast, gravity and brake engagement.',
    'Ignoring the unclassified pulse-width band can make one upstream test pulse become a delayed or inconsistent STO demand.',
    'Copying E1.0 measurements to E2.1 after architecture and PCB changes breaks evidence provenance.',
    'Assuming STO removes DC-link voltage exposes service personnel to stored electrical energy.',
    'Skipping final EMC/transient testing can let common-mode events corrupt both channels or diagnostic feedback together.',
  ],
  legacy: 'TIDA-01599 is valuable not because it grants a portable safety badge, but because it makes a safety-subsystem argument inspectable. The guide connects two 24 V demands to two physical power-removal paths, names external assumptions, exposes fault truth and shows timing experiments. The TÜV report adds an independent but carefully bounded concept review. Read together, they teach a durable company-research method: identify the exact target of evaluation, preserve every assumption and exclusion, keep tested revision attached to observations, and make the final integrator own diagnostics, machine behavior and lifecycle evidence.',
  nextReading: 'Return to Robot Drive Isolation, EMC & Functional Safety and apply the bounded evidence method to the actual machine: coordinate insulation inputs, common-mode current and EMC configuration with dual-channel STO, motion/holding timing and change control. The next implementation milestone should add animation only after these static causal states and the wider curriculum are content-complete and responsive.',
  capabilities: [
    'TIDA-01599의 exact guide/report identity와 author intent를 설명한다.',
    'STO_1 primary path와 STO_2 isolated-secondary path를 physical gate-power removal로 추적한다.',
    'MCU diagnostic interface와 declared safety path를 분리한다.',
    'Guide의 protected-supply, rail-decay, temperature, pulse and scope assumptions를 final requirements로 바꾼다.',
    '1oo2/HFT1 truth table에서 single, dual and common-cause failure boundary를 찾는다.',
    'Published timing을 board revision/test-point evidence로만 사용하고 motion-safe time과 분리한다.',
    'Rev. E1.0 test evidence와 E2.1 released design을 provenance상 분리한다.',
    'TÜV concept review의 supports, exclusions, historical standards basis와 end-user work를 정확히 설명한다.',
    'Reference headline에서 target robot certification을 잘못 추론하지 않는다.',
  ],
};
