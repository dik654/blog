import type { PaperStudySpec } from './FoundationalPaperStudy';
import BlaschkeFieldOrientationLab from './viz/BlaschkeFieldOrientationLab';

const raw = String.raw;

export const blaschkeFieldOrientation1973Spec: PaperStudySpec = {
  shortTitle: 'Field Orientation',
  citation: 'Felix Blaschke - Das Verfahren der Feldorientierung zur Regelung der Drehfeldmaschine',
  yearVenue: '1973 · Technische Universität Braunschweig doctoral thesis',
  sourceUrl: 'https://pure.tue.nl/ws/portalfiles/portal/132793355/167727.pdf',
  before: '회전기 control은 stator와 rotor의 여러 winding, magnetic storage, mechanical motion이 서로 결합된 nonlinear system을 다뤄야 했다. DC machine에서는 commutator와 직교 winding 때문에 field-producing current와 torque-producing current가 물리적으로 드러나지만, induction/synchronous rotating-field machine에서는 같은 성분이 회전 좌표와 machine dynamics 뒤에 숨어 직접 command하기 어려웠다.',
  authorIntent: 'Blaschke는 특정 gain 하나를 제안한 것이 아니라 machine 표현 자체를 바꾸려 했다. Magnetic field를 기준축으로 current vector를 평행·수직 성분으로 나누고, 실제 field를 측정하거나 machine model로 field를 재구성한 뒤 inverse coordinate operation으로 input을 선제 변환하면, 복잡한 rotating-field machine을 DC machine처럼 단순한 field/torque channel로 다룰 수 있는지 체계화했다. 동시에 구현 effort, control quality와 parameter tolerance가 서로 trade-off임을 비교했다.',
  thesis: 'Rotating-field machine을 field-oriented coordinates로 나타내고 field angle과 coordinate conversion의 되먹임을 inverse input conversion으로 상쇄하면 field-parallel current와 torque-producing perpendicular current에 직접 접근할 수 있다. Actual field를 쓰는 방식은 parameter 변화에 강하지만 measurement가 어렵고, model field를 쓰는 방식은 구현이 단순한 대신 machine-model detuning이 두 channel을 다시 결합한다.',
  readerBridge: [
    { term: 'Measured field · Model field', plain: 'Measured field는 sensor가 실제 magnetic field의 방향을 읽은 값이고, model field는 current·rotor state와 machine parameter로 그 방향을 계산한 추정값이다.', role: 'Sensor를 줄이면 구현은 단순해지지만 temperature나 parameter 오차가 angle 오차로 돌아오는 이유를 구분한다.' },
    { term: 'Polar · Cartesian', plain: 'Polar 표현은 vector를 크기와 각도로 쓰고, Cartesian 표현은 서로 직교하는 두 축의 성분으로 쓴다.', role: 'Field angle을 빼는 일과 두 current channel로 나누는 일이 같은 좌표 변환의 두 단계임을 보여 준다.' },
    { term: 'Slip', latex: raw`\omega_{slip}`, plain: '유도기에서 magnetic field가 rotor보다 더 빠르게 도는 상대 전기 각속도다.', role: 'Rotor angle만 알아서는 field angle을 얻을 수 없고 current와 machine model이 더 필요한 이유다.' },
    { term: 'TRANSVEKTOR', plain: '회전, 좌표 변환과 vector 생성을 당시 전자 회로 block으로 구현한 Blaschke의 장치 체계다.', role: '논문의 수학이 그림 장식이 아니라 converter를 움직이는 실제 signal path였음을 연결한다.' },
  ],
  reconstruction: [
    { label: '결합된 machine', value: 'field · current · motion', note: '자연 좌표에서는 storage와 angle feedback가 transient coupling을 만든다.' },
    { label: 'Field coordinates', value: 'parallel / perpendicular', note: 'Field를 기준으로 current를 field와 torque channel로 분해한다.' },
    { label: 'Orientation source', value: 'measured / model field', note: '정확성·measurement effort와 단순성·parameter sensitivity를 교환한다.' },
    { label: 'Physical realization', value: 'TRANSVEKTOR + converter', note: 'Coordinate operations를 실제 electronic block과 current/voltage converter로 닫는다.' },
  ],
  mechanism: [
    'PDF pp. 5-12의 introduction은 이상화한 DC machine에서 시작한다. 서로 직교하는 field/current axis와 commutator 때문에 magnetizing component와 torque-producing component가 winding current로 직접 드러난다는 baseline을 세운다.',
    '같은 관점으로 induction machine을 보면 rotor current는 induction으로 생기고 field/current vector가 회전하며, stator에서 보이는 input current와 field-oriented internal components 사이에 machine dynamics와 parameter-dependent transient가 놓인다.',
    '저자는 이 자연 transient를 그대로 tuning하는 대신 field vector를 기준으로 좌표를 다시 선택한다. Current vector의 field-parallel component와 perpendicular component를 분리하면 어느 부분이 field를 만들고 어느 부분이 torque에 기여하는지 직접 읽을 수 있다.',
    'PDF pp. 26-39는 polar input angle에서 field angle을 빼 field-relative angle을 만들고, 이를 Cartesian field coordinates로 바꾸는 연결을 구성한다. Coordinate transform은 diagram decoration이 아니라 machine input과 internal operating variable 사이의 실행 block이다.',
    'PDF pp. 42-46의 measured-field 방식은 machine에서 얻은 field angle을 input angle에 반대 부호로 선제 적용하고, polar/Cartesian conversion도 inverse block으로 보상해 field-coordinate setpoint가 internal component로 직접 전달되게 한다.',
    '이 decoupling의 핵심은 field angle이 더 이상 원치 않는 feedback path로 input component를 섞지 않게 하는 것이다. Field 자체의 physical dynamics가 사라지는 것이 아니라 controller가 원하는 operating variables와 machine input 사이의 coordinate coupling을 상쇄한다.',
    'PDF pp. 47-55는 field magnitude, torque와 rotor/stator magnetization 같은 operating variables를 어떤 field-coordinate current 조합으로 command할지 선택한다. 자유도가 부족한 실제 machine에서는 모든 원하는 변수를 독립 지정할 수 없다는 제약이 남는다.',
    'PDF pp. 56-73의 model-field 방식은 actual magnetic field measurement를 machine model로 대체한다. Model과 machine parameter가 맞으면 original-field 방식과 같은 coordinate behavior를 얻지만, heating 등으로 time constant가 변하면 model angle이 actual field와 어긋난다.',
    'Field-angle error는 단일 scalar bias로 끝나지 않는다. 잘못 회전한 좌표에서는 parallel과 perpendicular current가 서로 섞여 한 channel command가 다른 channel response를 만든다. Thesis는 ease of realization, quality와 tolerance security의 trade를 명시한다.',
    'PDF pp. 86-96은 general structure를 ideal synchronous machine과 induction machine에 specialization한다. Synchronous case의 model orientation은 rotor relation을 이용한 electronic commutator처럼 해석할 수 있고, induction case는 rotor speed와 다른 field speed를 위해 slip/model dynamics가 필요하다.',
    'PDF pp. 96-109는 model field를 original field에 따라가게 하는 tracking variants와 stability를 다룬다. Model을 넣는다고 자동으로 robust해지는 것이 아니며 error loop의 operating-point-dependent stability와 limited range를 분석해야 한다.',
    'PDF pp. 112-153은 real synchronous machine의 missing degrees of freedom, leakage, air-gap/rotor field choice와 voltage-controlled input으로 범위를 확장한다. 초기의 이상적 decoupling을 general machine에 그대로 복사하지 않고 남는 coupling과 compensation을 다시 계산한다.',
    'PDF pp. 154-173은 coordinate transformation, coordinate conversion, vector generation/filtering을 TRANSVEKTOR blocks로 구현하고 current-controlled/voltage-controlled converter에 연결한다. Theory가 physical electronics를 요구한다는 점이 thesis 구조 안에 포함된다.',
    '현대 FOC는 이 field-coordinate principle을 encoder/observer, digital Clarke/Park, d-q PI, SVPWM과 inverter protection으로 구현한다. 그러나 modern PMSM torque equation, vector anti-windup, Vdc/sqrt(3) limit와 current-shunt timing은 별도 contemporary source에서 검증해야 한다.',
  ],
  equations: [
    {
      latex: raw`\begin{aligned}
        \underbrace{i_{\parallel}}_{\text{field와 나란한 current}}&=\underbrace{|\mathbf i_s|\cos(\varepsilon_s-\psi_s)}_{\text{current를 field axis에 투영}}\\
        \underbrace{i_{\perp}}_{\text{field에 수직인 current}}&=\underbrace{|\mathbf i_s|\sin(\varepsilon_s-\psi_s)}_{\text{torque axis에 투영}}
      \end{aligned}`,
      meaning: 'Thesis의 field-oriented current-coordinate idea를 현대적인 두 축 notation으로 옮긴 식이다. Current magnitude만 command하는 대신 field angle psi_s에 대한 상대각으로 parallel/perpendicular components를 드러낸다. 정확한 thesis notation은 general stator/rotor current와 여러 field variables를 포함하므로 이 식은 원문 구조의 교육용 transcription이다.',
      symbols: [[raw`\mathbf i_s`, 'Stator current vector'], [raw`\varepsilon_s`, 'Stationary coordinates에서 stator-current vector angle'], [raw`\psi_s`, 'Orientation 기준으로 선택한 magnetic-field angle'], [raw`i_{\parallel},i_{\perp}`, 'Field-parallel과 field-perpendicular current coordinates']],
    },
    {
      latex: raw`\begin{aligned}
        i_{\parallel}&=\underbrace{i_x\cos\psi_s+i_y\sin\psi_s}_{\text{정지 벡터를 field축에 투영}}\\
        i_{\perp}&=\underbrace{-i_x\sin\psi_s+i_y\cos\psi_s}_{\text{수직 torque축에 투영}}
      \end{aligned}`,
      meaning: '원문이 polar-coordinate subtraction과 polar/Cartesian conversion blocks로 구성한 관계를 rotation matrix로 다시 쓴다. 중요한 것은 matrix 이름이 아니라 field angle을 빼서 field가 멈춘 좌표에서 current components를 읽는 operation이다.',
      symbols: [[raw`i_x,i_y`, 'Stationary orthogonal coordinates의 current vector components'], [raw`\psi_s`, 'Actual 또는 model field의 orientation angle'], [raw`R(-\psi_s)`, 'Coordinates를 field와 함께 회전시키는 inverse rotation']],
    },
    {
      latex: raw`\begin{aligned}
        i_x^*&=\underbrace{i_{\parallel}^*\cos\hat\psi_s-i_{\perp}^*\sin\hat\psi_s}_{\text{field command를 x축으로 복원}}\\
        i_y^*&=\underbrace{i_{\parallel}^*\sin\hat\psi_s+i_{\perp}^*\cos\hat\psi_s}_{\text{field command를 y축으로 복원}}
      \end{aligned}`,
      meaning: 'Measured/model field angle을 사용한 inverse input conversion이 decoupling의 actuation side다. Controller가 원하는 field-oriented components를 다시 physical winding/input coordinates로 변환해 machine의 natural angle feedback를 counteracts한다. Hat은 actual measured field일 수도 있고 model estimate일 수도 있다.',
      symbols: [[raw`i_{\parallel}^*,i_{\perp}^*`, 'Desired field-building/torque-producing components'], [raw`\hat\psi_s`, 'Control system이 orientation에 사용하는 measured 또는 model field angle'], [raw`i_x^*,i_y^*`, 'Converter/machine input coordinates로 돌아온 command']],
    },
    {
      latex: raw`\begin{aligned}
        \tilde i_{\parallel}&=\underbrace{i_{\parallel}\cos\delta}_{\text{평행 성분의 잔류}}+\underbrace{i_{\perp}\sin\delta}_{\text{수직 채널의 누설}}\\
        \tilde i_{\perp}&=\underbrace{-i_{\parallel}\sin\delta}_{\text{평행 채널의 누설}}+\underbrace{i_{\perp}\cos\delta}_{\text{수직 성분의 잔류}}
      \end{aligned}`,
      meaning: 'Model-field angle error delta가 생기면 parallel과 perpendicular channels가 다시 섞인다. Thesis introduction이 heating에 따른 machine time-constant change와 model mismatch를 강조한 이유다. Model이 계산을 쉽게 만들지만 parameter tolerance를 따로 분석해야 한다.',
      symbols: [[raw`\delta=\hat\psi_s-\psi_s`, 'Model/measured orientation과 actual field angle의 차이'], [raw`\tilde i_{\parallel},\tilde i_{\perp}`, 'Detuned model frame에서 controller가 보는 components']],
    },
    {
      latex: raw`\begin{aligned}
        \underbrace{\omega_{field}}_{\text{magnetic field speed}}&=\underbrace{\omega_{rotor}}_{\text{synchronous relation}}&&\text{synchronous case}\\
        \underbrace{\omega_{field}}_{\text{rotor와 다른 field speed}}&=\underbrace{\omega_{rotor}+\omega_{slip}}_{\text{model이 slip dynamics를 더함}}&&\text{induction case}
      \end{aligned}`,
      latexCompact: raw`\begin{gathered}
\underbrace{\omega_{field}=\omega_{rotor}}_{\text{동기기}}\\[4pt]
\underbrace{\omega_{field}=\omega_{rotor}+\omega_{slip}}_{\text{유도기}}
\end{gathered}`,
      meaning: 'Synchronous specialization에서는 rotor relation이 field orientation을 단순화한다. Induction machine에서는 field가 rotor보다 slip frequency만큼 다르게 회전하므로 rotor angle만으로 orientation을 끝낼 수 없고 current/model/field evidence가 필요하다. 이는 modern PMSM과 induction FOC를 같은 angle source로 처리하면 안 되는 이유다.',
      symbols: [[raw`\omega_{field}`, 'Chosen magnetic-field vector의 angular speed'], [raw`\omega_{rotor}`, 'Mechanical rotor의 electrical-coordinate speed'], [raw`\omega_{slip}`, 'Induction machine에서 field와 rotor 사이의 relative electrical speed']],
    },
    {
      latex: raw`\underbrace{M_{el}}_{\text{electromagnetic torque}}\propto
        \underbrace{|\boldsymbol\Phi|}_{\text{magnetic field magnitude}}
        \underbrace{i_{\perp}}_{\text{field에 수직인 torque current}}`,
      meaning: 'DC-machine analogy와 field-oriented decomposition의 핵심 intuition을 간단히 쓴 비례식이다. Exact constant와 general-machine torque expression은 pole pairs, winding convention, stator/rotor fields와 thesis의 machine equations에 의존한다. 현대 PMSM의 3/2 p torque 식을 이 1973 비례식에 소급해 귀속하지 않는다.',
      symbols: [[raw`M_{el}`, 'Machine이 만드는 electromagnetic torque'], [raw`\boldsymbol\Phi`, 'Orientation 기준이 되는 magnetic-field/flux vector'], [raw`i_{\perp}`, 'Field와 orthogonal한 current component']],
    },
  ],
  mechanismViz: BlaschkeFieldOrientationLab,
  evidence: [
    {
      label: '문제·DC analogy',
      question: '왜 rotating-field machine의 natural coordinates를 그대로 control하지 않고 표현부터 바꿔야 하는가?',
      intervention: 'PDF pp. 5-12는 orthogonal winding과 commutator가 있는 idealized DC machine을 induction machine의 rotating field/current structure와 비교한다.',
      observation: 'DC machine에서는 field-building과 torque-producing current components가 winding current로 직접 접근되지만, induction machine에서는 stator input과 field-oriented internal components 사이에 dynamic storage, slip과 parameter-dependent transient가 놓인다.',
      supports: 'Field orientation의 출발점이 단순 coordinate fashion이 아니라 inaccessible coupled operating variables를 직접 command하려는 문제 재정의임을 지지한다.',
      limit: 'Idealized analogy가 real synchronous/induction machine의 leakage, saturation, voltage limit와 converter nonideality를 자동으로 해결하지 않는다.',
    },
    {
      label: 'Field coordinates',
      question: 'Field를 기준으로 current를 다시 쓰면 어떤 구조가 새로 보이는가?',
      intervention: 'PDF pp. 26-39는 current magnitude/angle에서 field angle을 빼고 polar-to-Cartesian conversion으로 field-oriented current coordinates를 만든다.',
      observation: 'Field-parallel과 perpendicular current components가 분리되고 torque 및 operating variables와 더 직접적인 관계로 표현된다. Input coordinates와 field coordinates의 연결도 explicit transform block으로 나타난다.',
      supports: 'Coordinate choice가 coupled physical system의 controllable channel structure를 드러낼 수 있다는 thesis의 핵심 명제를 지지한다.',
      limit: '표현이 단순해졌다고 sensor, converter, parameter와 remaining machine dynamics가 사라지는 것은 아니다.',
    },
    {
      label: 'Measured decoupling',
      question: 'Actual field angle을 알고 있다면 field-coordinate command를 machine input에 직접 연결할 수 있는가?',
      intervention: 'PDF pp. 42-46은 actual field angle을 opposite-sign input precontrol에 쓰고 coordinate-conversion block을 inverse block으로 보상한다.',
      observation: 'Field angle의 unwanted feedback influence가 counteracted되고 field-oriented current components와 torque에 direct access하는 structure가 얻어진다.',
      supports: 'Measured-field orientation이 machine input과 desired operating components 사이의 angle coupling을 구조적으로 decouple한다는 주장을 지지한다.',
      limit: 'Actual field measurement accuracy, sensor bandwidth, general-machine leakage와 voltage-controlled converter dynamics는 별도 문제로 남는다.',
    },
    {
      label: 'Model-field trade',
      question: 'Field sensor를 model로 바꾸면 동일한 decoupling을 유지할 수 있는가?',
      intervention: 'PDF pp. 56-73은 model-generated field angle을 orientation에 사용하고 model/machine agreement와 detuning case를 비교한다.',
      observation: 'Model과 machine이 맞으면 original-field variant와 같은 behavior를 얻지만 heating 등으로 parameter가 달라지면 model field와 original field가 어긋나 channel mutual influence가 다시 나타난다.',
      supports: 'Model-field 방식의 simplicity와 parameter-tolerance cost를 동시에 지지한다.',
      limit: '한 model의 mismatch example이 모든 observer/sensorless estimator의 robustness를 정량화하지 않으며 modern online identification을 평가하지 않는다.',
    },
    {
      label: 'Machine cases',
      question: 'General field-orientation principle이 synchronous와 induction machine에 같은 방식으로 적용되는가?',
      intervention: 'PDF pp. 86-96은 original/model-field structures를 ideal synchronous machine과 induction machine에 specialization한다.',
      observation: 'Synchronous model-field case는 electronic commutator relation으로 단순화되고 field measurement 없이 구현하기 쉬운 반면, induction model case는 slip/current model과 parameter relation을 더 강하게 요구한다.',
      supports: '하나의 vector principle 아래에서도 machine physics가 angle source와 model sensitivity를 바꾼다는 점을 지지한다.',
      limit: 'Ideal synchronous specialization은 modern saliency, saturation, field weakening과 arbitrary PMSM geometry를 모두 포함하지 않는다.',
    },
    {
      label: 'Stability·general case',
      question: 'Model tracking과 additional compensation을 넣으면 모든 operating point에서 decoupling이 보장되는가?',
      intervention: 'PDF pp. 96-153은 model-tracking regulation, stability, missing degrees of freedom, leakage, alternate field choice와 voltage control을 분석한다.',
      observation: '일부 simplified structure는 limited operating range에서만 stable하고 real machine constraints에 따라 remaining coupling, extra regulation 또는 different field variable가 필요하다.',
      supports: 'Field orientation이 universal plug-in block이 아니라 machine structure, available degrees of freedom와 operating point에 따라 재검증해야 하는 method임을 지지한다.',
      limit: 'Period analog analysis는 sampled-data delay, quantization, PWM/sensor timing과 modern robust-control proof를 포함하지 않는다.',
    },
    {
      label: 'Physical realization',
      question: 'Field orientation은 paper coordinate change에 그치지 않고 당시 electronics로 구현되었는가?',
      intervention: 'PDF pp. 154-173은 coordinate transform/conversion, rotating unit vector와 filtering을 TRANSVEKTOR modules로 만들고 current/voltage-controlled induction-machine converters에 연결한다.',
      observation: 'Theory의 vector operations가 explicit hardware block과 converter signal flow로 내려가며 voltage-controlled case에는 pulse-width modulation을 사용하는 converter example도 포함된다.',
      supports: 'Field orientation을 실제 control apparatus로 구현하려는 system contribution이 thesis 안에 포함됨을 지지한다.',
      limit: '그 hardware가 modern digital FOC의 MCU execution, SVPWM linear limit, MOSFET gate timing, current-shunt observability나 robot safety certification을 입증하지 않는다.',
    },
  ],
  implementation: [
    '원문 PDF page와 thesis printed page를 분리해 citation ledger를 만든다. Summary, introduction, field-coordinate derivation, measured/model variants, machine cases, stability/generalization과 realization의 page anchors를 먼저 고정한다.',
    '원문 symbol을 즉시 modern d-q로 덮어쓰지 않는다. Stator/rotor current, field angle, polar/Cartesian converter와 operating-variable notation을 원문 문맥에서 먼저 inventory한다.',
    'DC-machine analogy를 vector geometry로 재구성한다. Field-parallel current와 perpendicular current를 독립 slider로 만들고 torque relation이 angle에 따라 어떻게 바뀌는지 확인한다.',
    'Measured-field structure를 구현한다. Actual field angle을 coordinate conversion과 inverse input conversion 양쪽에 동일하게 사용했을 때 channel command가 섞이지 않는지 검증한다.',
    'Model-field structure를 별도 mode로 구현한다. Rotor/machine input에서 model field angle을 만들고 parameter/time-constant detuning을 주입해 parallel/perpendicular leakage를 측정한다.',
    'Synchronous와 induction specialization을 분리한다. Synchronous case는 rotor-field relation, induction case는 slip/model dependence를 explicit state로 남긴다.',
    'Tracking/stability section에서 original/model field difference를 feedback하는 loop의 operating range와 sign/gain condition을 별도 실험으로 기록한다. 단일 nominal point만으로 robust라고 결론내리지 않는다.',
    'TRANSVEKTOR block을 modern software function으로 치환하기 전에 원 physical operation을 보존한다: rotation, polar/Cartesian conversion, vector generation/filtering, current/voltage converter interface.',
    '현대 PMSM FOC와 비교할 때 새 출처 ledger를 연다. Clarke/Park scaling, 3/2 p torque, digital PI, anti-windup, SVPWM, current sensing, dead time과 protection은 thesis claim으로 합치지 않는다.',
    '재현 결과에는 decoupling error, field-angle error, channel cross response와 parameter sweep를 남긴다. Motor가 회전했다는 binary demo만으로 direct-access claim을 검증하지 않는다.',
  ],
  assumptions: [
    'Orientation에 사용할 magnetic-field vector가 측정되거나 machine model로 추정 가능하다.',
    'Coordinate transformations와 inverse precontrol의 sign, angle origin과 vector convention이 일관된다.',
    'Measured-field path는 필요한 accuracy/bandwidth를 가지며 model-field path는 declared parameter range에서 충분히 맞는다.',
    '사용 가능한 winding/input degrees of freedom가 원하는 field and torque operating variables를 command할 수 있다.',
    'Ideal specialization에서 무시한 leakage, saturation, converter delay와 voltage/current limits는 generalization 또는 modern implementation에서 다시 모델링한다.',
    'Thesis의 analog/vector hardware timing과 현대 sampled digital control timing은 동일하지 않다.',
  ],
  failures: [
    'Field orientation을 Park matrix 한 개의 이름으로 축소하면 왜 field axis가 필요한지, angle source가 틀릴 때 무엇이 재결합되는지 놓친다.',
    'Model field를 sensorless magic으로 소개하면 rotor resistance/temperature, saturation와 operating-point sensitivity가 사라진다.',
    'Ideal synchronous-machine result를 모든 PMSM에 복사하면 saliency, limited rotor degrees of freedom, field weakening과 voltage constraints를 놓친다.',
    'Coordinate transform output이 일정해 보인다는 이유만으로 actual torque/current decoupling을 입증하면 sensor scale과 power-stage behavior를 확인하지 못한다.',
    'TRANSVEKTOR realization을 modern SVPWM implementation과 동일시하면 원문이 다루지 않은 digital sampling, bus normalization, dead time과 protection을 잘못 귀속한다.',
    '원문 scan의 OCR 수식만 사용하면 symbol, superscript와 diagram connection을 잘못 읽을 수 있으므로 rendered page와 text extraction을 교차 확인해야 한다.',
    'Park 1929 full primary text 없이 secondary summary만으로 Park paper의 exact derivation/intent를 재구성하면 foundational spine의 provenance가 깨진다.',
  ],
  legacy: 'Blaschke thesis가 남긴 가장 큰 유산은 d-q라는 두 글자가 아니라 representation-as-control-design이라는 방법이다. Coupled rotating machine을 자연 좌표에서 억지로 tuning하지 않고, physically meaningful field axis를 선택해 operating variables가 직접 보이는 coordinates와 inverse actuation을 함께 설계했다. 동시에 actual field measurement와 model reconstruction의 accuracy/effort/tolerance tradeoff, machine specialization, stability와 physical realization을 한 thesis 안에서 다뤘다. 현대 vector control은 digital Clarke/Park, current PI, observers, SVPWM과 power electronics로 계산 수단을 바꿨지만 angle identity와 model mismatch가 channel coupling으로 돌아온다는 경계는 그대로 남아 있다.',
  nextReading: '다음에는 Robot Motor Drive & FOC 글에서 이 principle을 modern PMSM d-q voltage/torque equation, discrete current PI, vector saturation, SVPWM, current sensing, MTPA/field weakening과 protection으로 내린다. Historical coordinate lineage는 Park 1929 원문을 확보했을 때 별도 primary-source reconstruction으로 추가하고, induction-machine observer/rotor-flux orientation은 별도 track으로 확장한다.',
  nextLinks: [
    { slug: 'robot-motor-drive-foc', label: 'Robot Motor Drive & FOC로 돌아가기', reason: 'Measured/model field의 원리를 modern d-q current loop, SVPWM, sensing, voltage limit와 protection에 연결한다.' },
  ],
  capabilities: [
    'Field orientation을 단순 matrix name이 아니라 coupled operating-variable access problem으로 설명한다.',
    'DC-machine analogy가 무엇을 드러내고 real rotating-field machine에서 무엇을 숨기는지 구분한다.',
    'Field-parallel과 perpendicular current components를 vector projection으로 계산한다.',
    'Measured-field와 model-field variants의 implementation effort, quality와 parameter tolerance tradeoff를 설명한다.',
    'Field-angle error가 두 control channels를 rotation matrix로 재결합하는 이유를 계산한다.',
    'Synchronous와 induction specialization에서 field-speed/angle source가 다른 이유를 구분한다.',
    'Thesis의 measured/model evidence, stability/general-case analysis와 TRANSVEKTOR realization을 각각 다른 증거 종류로 평가한다.',
    '1973 contribution과 modern PMSM FOC equations, digital runtime, inverter and safety claims의 provenance를 분리한다.',
  ],
};
