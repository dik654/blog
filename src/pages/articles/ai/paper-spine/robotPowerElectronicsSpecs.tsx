import type { PaperStudySpec } from './FoundationalPaperStudy';
import TidaReferenceLab from './viz/TidaReferenceLab';

const raw = String.raw;

export const tida010956Spec: PaperStudySpec = {
  documentKind: '회사 레퍼런스 디자인',
  shortTitle: 'TI TIDA-010956',
  citation: 'Texas Instruments - TIDA-010956: 48-V, 85-A Dual-Axis Servo Drive Reference Design for Industrial Robot With STO, Design Guide TIDUF82B Rev. B',
  yearVenue: '2025 · Texas Instruments reference design · Rev. B',
  sourceUrl: 'https://www.ti.com/lit/ug/tiduf82b/tiduf82b.pdf',
  appendixUrl: 'https://www.ti.com/tool/TIDA-010956',
  before: 'Motor-control algorithm 문서는 duty와 current loop를 설명해도 48 V bus의 stored energy, parallel MOSFET gate loop, inline current sensing, independent shutdown, PCB copper와 thermal evidence를 하나의 reproducible package로 닫지 않는다. 반대로 component datasheet만 모으면 각 부품은 이해해도 실제 board architecture와 measured boundary가 보이지 않는다.',
  authorIntent: 'TI는 단일 MOSFET이나 gate driver를 소개하려 한 것이 아니라 industrial robot servo용 48 V class inverter의 전체 reference path를 제시하려 했다. Input/bias, three-phase bridge, parallel devices, programmable gate drive, inline current measurement, split shutdown paths와 PCB를 하나의 설계로 묶고, power-up·switching·timing·sense settling·thermal capture를 제공해 고객이 자신의 target으로 옮길 출발점을 만들었다.',
  thesis: '24-60 V DC에서 parallel MOSFET half bridges와 DRV8162L, inline current sensing, separated control/shutdown paths를 결합하면 high-current robot servo inverter architecture를 구성할 수 있다. 그러나 published evidence는 각 test condition에서의 mechanism을 지지할 뿐 title의 85 Arms continuous operation이나 certified STO를 자동으로 입증하지 않으므로 claim, implementation, test and extrapolation boundary를 분리해 읽어야 한다.',
  reconstruction: [
    { label: 'Energy', value: '24-60 V · >700 µF', note: 'Source, board capacitance와 optional capacitor board가 bus energy를 만든다.' },
    { label: 'Commutation', value: '3 legs · parallel FETs', note: '각 switch position의 two MOSFETs와 local decoupling이 phase current를 전환한다.' },
    { label: 'Gate / trip', value: 'DRV8162L · split off', note: 'Programmable source/sink, dead time, VDS OCP와 external shutdown paths가 gate energy를 제어한다.' },
    { label: 'Evidence', value: 'VGS · VSW · I · thermal', note: 'Power-up, propagation, current-sense settling와 thermal point를 조건별로 측정한다.' },
  ],
  mechanism: [
    'Design guide pp. 2-4는 24-60 V DC input, C2000 host interface, 3.3 V/12 V supplies, two motor axes, three gate-driver channels per axis, inline current sensing과 external shutdown을 한 block diagram으로 묶는다. Architecture claim의 첫 단위는 board 한 장이 아니라 energy, actuation, observation과 shutdown path다.',
    'Power path는 connector/fuse와 DC bus에서 세 half bridge로 갈라진다. Guide의 power-up section은 board capacitance가 700 microfarads보다 크고 optional 3.6 mF capacitor board가 있음을 밝힌다. 이는 high current에 유리한 energy reservoir인 동시에 inrush, discharge와 fault-energy 책임을 만든다.',
    '각 half bridge position은 two parallel MOSFETs를 사용한다. Guide p. 6의 table은 single/parallel case와 25 C/125 C RDS(on) 변화를 비교하며 VDS threshold를 current로 환산한 값이 device count와 temperature에 따라 크게 움직임을 보여 준다.',
    'DRV8162L은 high/low gate를 source/sink하고 drive strength, dead time와 VDS OCP를 설정한다. Schematic은 bootstrap/local ceramic, gate resistors와 optional snubber footprints를 각 leg 가까이에 둔다. Snubber footprint가 있다는 사실과 target test에서 필요했다는 사실은 다르며 guide는 documented tests에서 snubber가 필요하지 않았다고 적는다.',
    'VDS overcurrent는 MOSFET on-state voltage를 본다. Switching overshoot를 fault로 보지 않게 blanking을 두므로 threshold/RDS 계산은 exact current sensor가 아니다. Comparator tolerance, hot resistance, parallel sharing, Kelvin geometry와 blanking 사이 fault current growth가 남는다.',
    'Current path는 inline shunt와 INA241 A/B 또는 isolated delta-sigma option을 제공한다. Inline location은 phase current를 직접 보지만 switch node의 large common-mode step을 amplifier가 견디고 회복해야 한다. Guide p. 23의 approximately 1 microsecond settling capture는 ADC trigger window를 설계할 근거이지 모든 configuration의 universal constant가 아니다.',
    'Shutdown architecture는 external channels, separate high/low gate-supply load switches와 PWM buffer enable을 조합한다. 이는 MCU PWM path 하나보다 강한 architecture를 만들 수 있지만 target hazard analysis, diagnostic coverage와 certification 없이 reference design을 certified STO라고 부를 수 없다.',
    'Guide p. 16의 power-up flow는 bias와 bus sequencing을 explicit state로 보여 준다. High-energy board에서 rail이 올라왔다는 software flag보다 gate-off default, UVLO, fault state와 measured DC link가 enable precondition이다.',
    'Guide pp. 18-21은 hard/soft switching gate/switch-node capture와 PWM-to-gate propagation을 제시한다. Displayed case에서 turn-on은 약 200 ns, turn-off는 약 70 ns이며 stated configuration의 added dead time은 약 130 ns다. 이는 commanded edge와 physical VGS가 asymmetric latency를 가진다는 직접 증거다.',
    'Thermal section은 48 V, 16 kHz, 26.2 Arms/37 A peak, 28 C ambient, no heatsink/fan 조건을 사용한다. Reported MOSFET surface rise는 45.5 C이며 surface는 약 73.5 C, junction은 125 C 미만으로 추정된다. Higher current/ambient에서는 heatsink 또는 fan이 필요할 수 있다고 guide가 경고한다.',
    '따라서 85 Arms는 architecture/title specification이고 displayed thermal evidence는 26.2 Arms point다. 두 숫자를 한 문장에 넣되 같다고 등치하지 않는 것이 정확한 reconstruction이다. Full 85 Arms continuous thermal proof에는 current distribution, hotspot, enclosure ambient, junction calibration와 duration evidence가 더 필요하다.',
    'Reference design을 옮길 때는 schematic sheet, PCB layer, BOM와 guide plot을 together 읽는다. 동일 IC와 MOSFET을 사용해도 DC-link/gate/shunt geometry, copper weight, connector, cable, motor, switching edge와 cooling을 바꾸면 measured claim도 새로 검증해야 한다.',
  ],
  equations: [
    {
      latex: raw`\underbrace{E_{dc}}_{\text{DC-link 저장 energy}}=
        \underbrace{\frac{1}{2}C_{dc}V_{dc}^{2}}_{\text{capacitance × voltage 제곱}}`,
      meaning: 'TIDA의 700 microfarad 이상 board capacitance와 optional 3.6 mF board를 energy 관점으로 읽는 식이다. Capacitance는 current ripple을 낮출 수 있지만 source connection 때 inrush와 power-off discharge, short-circuit energy도 증가시킨다. Reference의 capacitor value를 복사하기 전에 precharge와 safe-discharge state를 다시 설계해야 한다.',
      symbols: [[raw`C_{dc}`, '실제 bias와 tolerance를 반영한 local DC-link capacitance [F]'], [raw`V_{dc}`, 'Capacitor terminals에서 측정한 DC-link voltage [V]']],
    },
    {
      latex: raw`\underbrace{I_{trip,est}}_{\text{VDS OCP current의 nominal 환산}}\approx
        \underbrace{\frac{V_{DS,th}}{R_{DS(on)}(T_j)/N_{parallel}}}_{\text{threshold ÷ hot parallel resistance}}`,
      meaning: 'Guide의 single/parallel, 25 C/125 C table이 보여 주는 핵심을 일반화한 estimate다. Parallel devices가 완전히 current를 공유한다는 가정, comparator tolerance, PCB drop와 blanking을 생략한다. 이 식의 큰 temperature sensitivity가 오히려 exact current measurement로 쓰면 안 된다는 증거다.',
      symbols: [[raw`V_{DS,th}`, 'DRV8162L VDS overcurrent threshold [V]'], [raw`R_{DS(on)}(T_j)`, '한 MOSFET의 junction-temperature-dependent on resistance [Ω]'], [raw`N_{parallel}`, '한 switch position에서 이상적으로 current를 공유하는 MOSFET 수']],
    },
    {
      latex: raw`\underbrace{\Delta t_{path}}_{\text{gate path의 timing 오차}}=
        \underbrace{t_{off,prop}-t_{on,prop}}_{\text{propagation 비대칭}}+
        \underbrace{\Delta t_{gate}}_{\text{gate network 차이}}`,
      meaning: 'PWM input에서 measured VGS까지의 turn-on/off propagation과 parallel gate-network difference를 먼저 하나의 physical path error로 모은다. Sign은 measurement threshold and high/low edge definition에 맞춰 다시 고정한다.',
      symbols: [[raw`t_{on,prop},t_{off,prop}`, 'PWM input에서 measured VGS transition까지의 propagation'], [raw`\Delta t_{gate}`, 'Parallel device/gate network와 load가 더한 edge 차이']],
    },
    {
      latex: raw`\underbrace{t_{dead,eff}}_{\text{실제 non-overlap}}=
        \underbrace{t_{dead,cmd}}_{\text{설정값}}+
        \underbrace{\Delta t_{path}}_{\text{measured path 오차}}`,
      meaning: 'Guide p. 21의 propagation capture를 register dead time과 physical effective dead time 사이의 contract로 읽는다. 두 VGS threshold crossings를 same timebase에서 측정해 commanded value에 path error를 더한다.',
      symbols: [[raw`t_{dead,cmd}`, 'Driver/register에서 의도한 non-overlap interval'], [raw`t_{dead,eff}`, 'Actual high/low VGS 기준으로 남은 non-overlap interval']],
    },
    {
      latex: raw`\underbrace{t_{valid}}_{\text{sense valid 시각}}=
        \underbrace{t_{edge}+t_{amp\ settle}}_{\text{edge + recovery}}+
        \underbrace{t_{margin}}_{\text{guard}}`,
      meaning: 'Published approximately 1 microsecond settling point를 target sample constraint로 옮기기 전에 edge, amplifier recovery와 tolerance guard를 합쳐 valid-after time을 만든다. Target gain/filter/common-mode condition에서 다시 측정한다.',
      symbols: [[raw`t_{amp\ settle}`, 'Amplifier output가 required error band로 돌아오는 measured time'], [raw`t_{margin}`, 'Leg/temperature/component variation과 ADC acquisition을 위한 guard time']],
    },
    {
      latex: raw`\underbrace{t_{sample}}_{\text{ADC aperture 시작}}>\underbrace{t_{valid}}_{\text{검증한 settle 이후}}`,
      meaning: 'ADC acquisition aperture는 output이 valid하다고 입증된 시각 뒤에 시작해야 한다. Output이 rail 안에 있는 것만으로 settled accuracy가 확보되지는 않는다.',
      symbols: [[raw`t_{sample}`, 'ADC sample-and-hold acquisition이 시작되는 edge-relative time'], [raw`t_{valid}`, 'Amplifier/filter/tolerance가 required error band를 만족하는 earliest time']],
    },
    {
      latex: raw`\underbrace{\Delta T_{JS}(t)}_{\text{junction과 surface의 온도 차}}\approx
        \underbrace{P_{device}}_{\text{device loss}}
        \underbrace{Z_{\theta,JS}(t)}_{\text{내부 transient thermal path}}`,
      latexCompact: raw`\begin{gathered}
\underbrace{\Delta T_{JS}(t)}_{\text{내부 온도차}}\\[-1pt]
\approx\underbrace{P_{device}}_{\text{소자 손실}}\underbrace{Z_{\theta,JS}(t)}_{\text{열 경로}}
\end{gathered}`,
      meaning: 'Measured surface에서 junction으로 올라가기 전에 package 내부 temperature rise를 별도 계산한다. Ztheta의 reference surface, pulse duration과 board condition이 published test와 맞아야 한다. Surface pixel을 junction으로 직접 부르지 않는다.',
      symbols: [[raw`\Delta T_{JS}(t)`, 'Junction과 실제 관찰 surface 사이의 temperature difference'], [raw`Z_{\theta,JS}(t)`, 'Junction-to-observed-surface transient thermal relation']],
    },
    {
      latex: raw`\underbrace{T_{j,est}}_{\text{junction 추정}}=
        \underbrace{T_{surface,meas}}_{\text{IR surface 실측}}+
        \underbrace{\Delta T_{JS}}_{\text{내부 thermal rise}}+
        \underbrace{\Delta T_{unc}}_{\text{측정·model 불확실성}}`,
      meaning: 'Design guide thermal image를 bounded junction estimate로 확장하는 evidence bridge다. 원문은 measured surface와 estimated junction을 구분한다. IR emissivity, loss distribution, sensor location와 model uncertainty를 0으로 두지 않는다.',
      symbols: [[raw`T_{surface,meas}`, 'Published thermal capture가 직접 관찰한 surface temperature'], [raw`\Delta T_{unc}`, 'IR calibration, loss distribution와 thermal-model uncertainty margin']],
    },
    {
      latex: raw`\begin{aligned}
        \underbrace{C_{evidence}}_{\text{시험 evidence}}&=
        \underbrace{C_{tested}\cap C_{observed}}_{\text{시험 조건과 실제 관찰의 교집합}}\\
        \underbrace{C_{supported}}_{\text{지지 가능한 claim}}&=
        \underbrace{C_{implemented}\cap C_{evidence}}_{\text{구현과 evidence의 교집합}}
      \end{aligned}`,
      meaning: '회사 reference design을 읽는 epistemic gate다. Title이나 BOM에 있는 것만으로 measured performance가 되지 않고, 한 test point에서 관찰한 결과가 전체 rating으로 확장되지 않는다. TIDA의 85 Arms와 26.2 Arms thermal evidence를 이 교집합으로 분리한다.',
      symbols: [[raw`C_{implemented}`, 'Schematic, layout와 BOM이 보여 주는 implemented mechanism'], [raw`C_{tested}`, 'Voltage, current, frequency, ambient와 cooling이 명시된 test condition'], [raw`C_{observed}`, 'Scope, current, thermal 또는 fault trace가 직접 보여 준 observation']],
    },
  ],
  mechanismViz: TidaReferenceLab,
  evidence: [
    {
      label: 'Architecture',
      question: '48 V robot servo용 complete power stage라는 claim에 어떤 path가 실제로 포함되는가?',
      intervention: 'Guide pp. 3-4 block diagram, schematic cover와 PCB/BOM package를 energy, three-phase bridge, gate drive, sense, host and shutdown paths로 분해한다.',
      observation: '24-60 V input, separate bias rails, three DRV816x channels, parallel MOSFET half bridges, inline current sensing, C2000 interface와 external shutdown channels가 연결된다.',
      supports: '단일 evaluation IC가 아니라 robot-servo inverter system reference architecture가 구현되었음을 지지한다.',
      limit: 'Block/schematic completeness가 target cable, motor, enclosure, battery와 safety requirement의 suitability를 입증하지 않는다.',
    },
    {
      label: 'Parallel·OCP',
      question: 'Two parallel MOSFETs와 VDS OCP가 85 A class current를 exact하게 보호하는가?',
      intervention: 'Guide p. 6의 single/parallel, 25 C/125 C RDS(on) and trip-current estimates와 schematic Kelvin/driver connection을 읽는다.',
      observation: 'Equivalent resistance가 device count와 temperature에 따라 변하고 nominal trip-current estimate가 크게 이동한다. Driver는 blanking을 사용해 switching transient를 무시한다.',
      supports: 'Parallel devices가 conduction capability를 늘리고 VDS OCP가 fast protection layer를 제공한다는 mechanism을 지지한다.',
      limit: 'Equal dynamic sharing, exact current threshold, all-temperature SOA나 repetitive short-circuit endurance를 입증하지 않는다.',
    },
    {
      label: 'Switching',
      question: 'Selected driver/gate network와 PCB가 real gate and switch-node transitions를 만드는가?',
      intervention: 'Guide pp. 17-21의 hard/soft switching setup and captures를 gate command, VGS, VSW and current context로 읽는다.',
      observation: 'Hard/soft commutation and turn-on/off waveforms are displayed; optional snubber footprints were reserved but were not required in the documented tests.',
      supports: 'Reference board에서 selected gate-drive path가 functioning switching behavior를 냈다는 것을 지지한다.',
      limit: 'Worst cable inductance, all current/temperature corners, every phase/device와 EMC compliance를 입증하지 않는다.',
    },
    {
      label: 'Propagation',
      question: 'PWM logic edge와 physical gate edge 사이 latency and dead time은 측정되었는가?',
      intervention: 'Guide p. 21의 PWM-to-gate timing trace를 same threshold convention으로 읽는다.',
      observation: 'Displayed case shows roughly 200 ns turn-on, 70 ns turn-off and about 130 ns additional dead time for the stated setup.',
      supports: 'Physical timing이 commanded register와 다르고 asymmetric하므로 control/sampling contract에 measured propagation이 필요함을 지지한다.',
      limit: 'Datasheet full tolerance, temperature drift, every leg mismatch와 target probe threshold를 한 capture로 입증하지 않는다.',
    },
    {
      label: 'Current sense',
      question: 'Inline sense output는 PWM common-mode transition 뒤 언제 valid해지는가?',
      intervention: 'Guide pp. 22-23의 current and amplifier trace에서 edge와 settled interval을 분리한다.',
      observation: 'Published worst-case display reports approximately 1 microsecond settling in the documented configuration.',
      supports: 'Current control sample은 edge 직후가 아니라 measured recovery 뒤에 놓여야 한다는 design constraint를 지지한다.',
      limit: '모든 INA241 variant, gain/filter, output load, temperature, phase voltage와 ADC aperture의 universal 1 microsecond spec을 입증하지 않는다.',
    },
    {
      label: 'Thermal',
      question: 'Published thermal figure는 85 Arms continuous performance를 직접 검증하는가?',
      intervention: 'Guide p. 24의 test condition, thermal image, temperature rise and junction estimate를 title current와 분리한다.',
      observation: 'At 48 V, 16 kHz, 26.2 Arms/37 A peak and 28 C ambient without heatsink/fan, surface rise is reported as 45.5 C to about 73.5 C and junction is estimated below 125 C.',
      supports: '해당 operating point에서 board-level cooling baseline과 a bounded thermal observation을 지지한다.',
      limit: '85 Arms steady thermal operation, hotter enclosure, long-duration lifetime, all-device hotspot와 certified safe temperature를 입증하지 않는다.',
    },
    {
      label: 'Shutdown',
      question: 'Split high/low drive supplies and external channels mean certified STO인가?',
      intervention: 'Guide pp. 8-9 and schematic의 separate load switches, PWM buffer enables and external shutdown paths를 trace한다.',
      observation: 'More than one path can inhibit PWM/gate energy and high/low supply control is separated.',
      supports: 'Target safety architecture를 만들 때 사용할 수 있는 multichannel hardware mechanism을 지지한다.',
      limit: 'Safety function requirement, independence proof, diagnostic coverage, PFH/PFD, fault exclusion와 certification을 제공하지 않는다.',
    },
  ],
  implementation: [
    'Product page에서 design guide revision/date와 downloadable schematic, PCB layout, BOM and test files를 pin한다. Later revision이 나오면 claim/evidence ledger를 diff한다.',
    'Block diagram을 energy, gate, commutation, sense and shutdown path로 다시 그린다. 한 장에 모든 net을 축소하지 말고 path별 source, sink and observation point를 적는다.',
    'Schematic에서 input/fuse/DC link, one representative half bridge, local decoupling/bootstrap, parallel gates, shunt/Kelvin path와 split shutdown을 net-level로 trace한다.',
    'BOM과 datasheet에서 voltage range, hot RDS(on), gate charge, driver source/sink, OCP threshold/timing, amplifier common-mode and settling limits를 target units로 normalize한다.',
    'PCB plot에서 control, driver, power and sensing zones를 표시하고 DC-link loop, gate loop, switch node and shunt differential return을 overlay한다. Raw layer screenshot의 whitespace를 explanation으로 사용하지 않는다.',
    'Power-up sequence를 executable state machine으로 옮긴다. Source voltage, bias/UVLO, fault, gate-off and contactor/precharge feedback를 transition guard로 둔다.',
    'Switching capture를 같은 probe reference and bandwidth로 reproduce한다. Both VGS, VSW/VDS and current를 same timebase에 두고 propagation, dead time, overshoot and Miller bump를 기록한다.',
    'Current-sense reproduction은 known current/probe, amplifier output and ADC aperture를 correlate한다. Edge 직후 invalid interval과 settled error band를 따로 저장한다.',
    'Thermal reproduction은 48 V, frequency, RMS/peak current, duration, ambient, airflow/heatsink, surface emissivity and sensor location을 metadata로 고정한다. Junction estimate method와 uncertainty를 별도 기록한다.',
    '85 Arms claim을 검증하려면 current-sharing, connector/copper, device hotspot, cooling, junction, bus ripple, fault protection and duration을 incremental envelope test로 확장한다. Published 26.2 Arms point에서 바로 extrapolate하지 않는다.',
    'Shutdown test는 each channel fault, stuck MCU/PWM, rail fault, cause latch and reset을 독립 주입한다. Functional behavior가 보여도 certification claim은 separate hazard/safety evidence track에 둔다.',
  ],
  assumptions: [
    'Published guide, schematic and PCB files의 revision이 서로 일치하며 board assembly가 documented BOM/configuration을 따른다.',
    'Parallel MOSFET paths and thermal environment가 충분히 symmetric하거나 mismatch가 별도로 측정된다.',
    'Gate and current-sense probes use the correct local/Kelvin reference and adequate voltage, common-mode and bandwidth rating.',
    'Reported RMS/peak current, PWM frequency, bus, ambient, duration and cooling condition use the same definitions as the reproduction.',
    'Current-sense sample is taken only after target amplifier/filter/ADC chain reaches the required accuracy.',
    'Split shutdown mechanisms are inputs to a target safety case, not the safety case itself.',
  ],
  failures: [
    'Title의 85 Arms와 p. 24의 26.2 Arms thermal point를 합쳐 “85 Arms continuous thermal proof”라고 쓰면 claim/evidence provenance가 깨진다.',
    'Parallel MOSFET의 cold equivalent RDS(on)만으로 current trip을 정하면 hot resistance, mismatch, blanking and parasitic drop을 놓친다.',
    'Scope screenshot에서 trace가 깨끗하다는 이유만으로 worst-case overshoot, EMI and reliability를 결론내리면 test condition 밖으로 extrapolate한다.',
    'Approximately 1 microsecond settling을 firmware에 hard-code한 universal delay로 쓰면 gain/filter/device/temperature change에서 invalid sample을 받을 수 있다.',
    'Thermal-camera surface pixel을 junction temperature로 부르면 internal/package thermal gradient와 uncertainty를 지운다.',
    'Reference schematic을 same parts로 복사하면서 PCB loop geometry, copper, connector, cable and cooling을 바꾸면 published behavior가 transfer되지 않는다.',
    'STO-oriented split shutdown을 certified STO라고 부르면 system-level safety analysis and certification evidence를 잘못 귀속한다.',
  ],
  legacy: 'TIDA-010956의 학습 가치는 특정 TI 부품 목록보다 complete reference artifact를 읽는 방법에 있다. Block diagram은 path ownership을, schematic은 mechanism을, PCB는 parasitic/thermal geometry를, waveform과 thermal image는 bounded observation을 제공한다. 이 네 층이 교차할 때만 claim을 지지할 수 있다. 특히 title의 85 Arms와 shown 26.2 Arms thermal point를 분리하면 company research를 marketing headline이나 blind copying이 아니라 reproducible engineering evidence로 읽을 수 있다.',
  nextReading: '다음 단계는 이 reference design을 production board로 즉시 복사하는 것이 아니다. 먼저 Robot Power Electronics 글의 precharge, gate-loop, loss, thermal, current-sense and protection contract로 target requirements를 만든다. 이후 isolated bias/creepage, brake chopper and battery interaction, EMC/ESD, functional-safety analysis와 actuator-specific lifetime qualification을 별도 article/research spine으로 확장한다.',
  nextLinks: [
    { slug: 'robot-drive-energy-braking-safety', label: 'Drive Energy & Braking으로 올라가기', reason: 'Negative torque에서 돌아온 energy를 battery, peer axis, capacitor headroom과 brake resistor에 어떻게 배분하는지 system boundary로 확장한다.' },
    { slug: 'robot-drive-isolation-emc-functional-safety', label: 'Isolation · EMC · STO로 이어가기', reason: 'Gate shutdown 회로의 기능을 insulation, disturbance integrity, independent torque removal과 machine-level safety evidence로 확장한다.' },
  ],
  capabilities: [
    'TIDA-010956의 energy, commutation, gate, sense and shutdown paths를 source-to-observation으로 추적한다.',
    'Reference title/spec claim과 schematic implementation, test condition, observed evidence를 별도 ledger로 기록한다.',
    'Parallel MOSFET, hot RDS(on) and VDS OCP 관계를 approximate protection으로 계산하고 error sources를 설명한다.',
    'PWM-to-gate propagation and effective dead time을 physical timing contract로 읽는다.',
    'Published current-sense settling을 target ADC sample-valid window로 변환하되 universal constant로 과장하지 않는다.',
    'Surface thermal capture와 junction estimate, one-point evidence and continuous-current qualification을 구분한다.',
    'Multichannel shutdown architecture와 certified STO safety case를 구분한다.',
    'Schematic/BOM 복사보다 PCB loop, probe, cooling and target operating point의 revalidation이 우선임을 판정한다.',
  ],
};
