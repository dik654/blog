import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  ClarkeProjectionLab,
  CommissioningEvidenceLab,
  DqCurrentLoopLab,
  MotorDriveEvidenceStrip,
  MotorDriveFailureLegend,
  MotorDriveRuntimeStrip,
  OperatingEnvelopeLab,
  ParkAngleContractLab,
  PmsmTorqueModelLab,
  RotatingFieldLab,
  SensorAlignmentWindowLab,
  SvpwmInverterLab,
  TorqueActuationContractLab,
} from './robot-motor-drive-foc/viz/RobotMotorDriveFocViz';

const raw = String.raw;

function ContractLedger({ items }: { items: Array<{ label: string; contract: string; failure: string }> }) {
  return (
    <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
      {items.map((item, index) => <div key={item.label} className="min-w-0 bg-background p-4"><p className="flex items-center gap-2 text-xs font-black text-muted-foreground"><span className="font-mono">{String(index + 1).padStart(2, '0')}</span>{item.label}</p><p className="mt-2 text-sm font-semibold leading-relaxed">{item.contract}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">깨지면:</strong> {item.failure}</p></div>)}
    </div>
  );
}

function EvidenceSequence({ items }: { items: Array<{ signal: string; meaning: string; response: string }> }) {
  return (
    <ol className="not-prose my-6 grid gap-2">
      {items.map((item, index) => <li key={item.signal} className="grid min-w-0 grid-cols-[2.4rem_minmax(0,1fr)] gap-3 border-b border-border py-3"><span className="font-mono text-lg font-black text-teal-700/55 dark:text-teal-300/55">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><p className="text-sm font-bold">{item.signal}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.meaning}</p><p className="mt-2 text-xs font-semibold leading-relaxed">판정 후 행동 · {item.response}</p></div></li>)}
    </ol>
  );
}

export default function RobotMotorDriveFoc() {
  return (
    <>
      <BeginnerOpening
        title="모터에 원하는 힘을 말하는 것과 전선을 실제로 켜고 끄는 것은 다른 단계다"
        description={<>축을 돌리려는 힘을 <strong>torque(회전력)</strong>라고 한다. 세 가닥 권선에 흐르는 전류가 자기장을 만들고, 전력 변환 장치인 <strong>inverter</strong>가 스위치를 빠르게 켜고 꺼 그 전류를 조절한다. 한 주기 중 켜 두는 시간 비율이 <strong>PWM duty</strong>다.</>}
        familiarScene={<>자동차 운전자가 가속 페달을 30% 밟았다고 엔진이나 모터의 모든 전선에 숫자 30을 그대로 쓰지는 않는다. 현재 속도, 배터리 전압, 온도와 제한을 보고 실제 전류를 만든다. 원하는 효과와 스위치 명령 사이에는 여러 물리 변환과 확인 단계가 있다.</>}
        steps={[
          { label: '원하는 회전력을 전류로 바꾼다', detail: '모터 특성과 한계를 사용해 필요한 자기장 성분을 정한다.' },
          { label: '전류 오차를 전압으로 바꾼다', detail: '회전자 방향에 맞춘 좌표에서 목표 전류를 따라가게 한다.' },
          { label: '전압을 스위치 시간으로 만든다', detail: '배터리 전압 안에서 PWM을 합성하고 실제 전류·열을 확인한다.' },
        ]}
      />
      <QuestionLead label="이제 확인할 질문" question="원하는 회전력을 계산해 PWM 켜짐 비율에 숫자를 넣는 순간 모터 힘이 만들어졌다고 봐도 될까?" answer="아니다. 회전력은 축에서 원하는 기계적 효과이고 PWM은 전력 스위치를 켜는 시간 비율이다. 그 사이에서 필요한 전류, 회전자 방향, 전류 조절기, 배터리 전압과 안전 제한을 거쳐야 한다. 요청한 값, 제한 뒤 값, 실제 적용된 값과 측정한 전류를 나눠야 힘이 어디서 달라졌는지 찾을 수 있다." />

      <NlpSection id="torque-contract" marker="01" tone="teal" question="원하는 회전 힘 하나를 전기 모터의 세 전선에 어떻게 나누어 만들까?" title="원하는 회전 힘과 전력 스위치의 켜짐 시간을 바로 같은 값으로 볼 수 없다">
        <p>상위 제어기는 joint의 위치·속도 오차와 동역학을 보고 torque reference를 만듭니다. Motor drive는 그 torque를 같은 방향의 q-axis current reference로 바꾸고, 실제 current가 따라오도록 d-q voltage를 계산합니다. Inverter는 그 voltage vector를 한 PWM period 동안의 switch sequence로 근사합니다. 마지막으로 phase current와 rotor flux가 상호작용해야 electromagnetic torque가 생깁니다.</p>
        <MotorDriveRuntimeStrip />
        <ConceptPrimer items={[
          { term: 'Requested', meaning: '상위 controller가 원한 torque 또는 current입니다.', why: 'Limit, bus saturation이나 fault 뒤의 실제 출력과 분리해야 합니다.' },
          { term: 'Limited', meaning: 'Motor, inverter, bus, thermal envelope 안으로 제한한 reference입니다.', why: '불가능한 요청을 PI integrator나 PWM이 대신 해결할 수 없습니다.' },
          { term: 'Applied', meaning: 'Target cycle에 PWM latch와 gate driver가 만든 평균 phase voltage입니다.', why: 'Duty register write와 실제 switch output 사이에 trip, dead time과 propagation이 있습니다.' },
          { term: 'Observed', meaning: '동일 cycle identity로 측정한 phase current, bus power, rotor motion과 torque evidence입니다.', why: 'Command echo가 아니라 plant에 전달된 결과로 closed loop를 닫습니다.' },
        ]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{i_q^*}_{\text{토크용 전류 요청}}
          &=\underbrace{\frac{\tau^*}{k_t}}_{\text{토크를 motor constant로 나눔}}\\
          \underbrace{i_{q,lim}^*}_{\text{실행 가능한 전류}}
          &=\underbrace{clip(i_q^*,-I_{max},I_{max})}_{\text{전류·열 한계 안으로 제한}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="이 식은 SPM의 선형 torque-current 구간을 설명하는 첫 계약입니다. IPM의 reluctance torque, field weakening과 parameter variation은 뒤에서 추가합니다. k_t의 단위와 peak/RMS convention이 reference와 같지 않으면 계산은 맞아 보여도 실제 torque가 sqrt(2) 배 어긋납니다." symbols={[[raw`\tau^*`, '상위 controller가 요청한 electromagnetic 또는 shaft torque [N·m]'], [raw`k_t`, '선언한 current convention에서의 torque constant [N·m/A]'], [raw`I_{max}`, 'Motor, inverter와 thermal policy 중 가장 작은 허용 peak current']]} />
        <MathFormula display>{raw`\underbrace{I_{peak}}_{\text{정현파의 꼭대기}}=\underbrace{\sqrt{2}\,I_{rms}}_{\text{같은 열효과 RMS를 peak로 변환}}`}</MathFormula>
        <FormulaNote meaning="Peak와 RMS는 같은 current를 표현하는 서로 다른 숫자입니다. Y 결선의 terminal-to-terminal 저항은 두 phase 경로를 포함할 수 있지만 inductance에는 mutual coupling과 측정 조건이 들어가므로 모든 datasheet 값에 R_line-line=2R_phase 규칙을 기계적으로 복사하지 않습니다. Gain 계산 전 제조사 정의와 실제 terminal 측정을 함께 고정해야 합니다." symbols={[[raw`I_{peak}`, 'Clarke/Park와 current limit에서 사용할 instantaneous sinusoidal peak'], [raw`I_{rms}`, 'Copper heating과 inverter RMS rating에서 자주 쓰는 current']]} />
        <TorqueActuationContractLab />
        <Misconception>BLDC와 PMSM은 항상 서로 다른 rotor hardware를 뜻하지 않습니다. 업계에서는 같은 permanent-magnet synchronous machine을 trapezoidal back-EMF·six-step drive 관점에서 BLDC라고 부르거나 sinusoidal/vector-control 관점에서 PMSM이라고 부르기도 합니다. Motor waveform, saliency, sensor와 control method를 따로 확인해야 합니다.</Misconception>
      </NlpSection>

      <NlpSection id="rotating-field" marker="02" tone="blue" question="서로 다른 세 전류가 어떻게 하나의 일정한 크기 vector로 보일까?" title="세 phase winding의 공간 방향을 더하면 rotating stator field가 된다">
        <p>A, B, C winding은 stator 둘레에서 120 electrical degrees 간격으로 놓입니다. 각 winding current가 시간상 120 degrees 차이의 sinusoid라면 한 phase가 줄어드는 동안 다른 phase가 같은 공간 성분을 채웁니다. 세 scalar를 단순히 한 숫자로 합치는 것이 아니라, 서로 다른 winding axis를 가진 vector로 합치면 일정한 크기로 회전하는 stator current vector가 나타납니다.</p>
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{i_a}_{\text{A phase}}&=\underbrace{I\cos\theta_e}_{\text{현재 electrical phase}}\\
          \underbrace{i_b}_{\text{B phase}}&=\underbrace{I\cos(\theta_e-2\pi/3)}_{\text{120° 늦은 phase}}\\
          \underbrace{i_c}_{\text{C phase}}&=\underbrace{I\cos(\theta_e+2\pi/3)}_{\text{120° 앞선 phase}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="각 phase의 시간 위상차와 winding의 공간축 차이가 함께 rotating field를 만듭니다. 모든 각은 electrical angle입니다. Phase order를 바꾸면 회전 방향이 바뀌므로 A-B-C label은 단순 배열 이름이 아닙니다." symbols={[[raw`I`, '각 phase sinusoidal current의 peak [A]'], [raw`\theta_e`, 'Stator current waveform의 electrical phase [rad]'], [raw`2\pi/3`, '세 phase 사이의 120 electrical degree 간격']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{i_a+i_b+i_c}_{\text{공통 성분 검사}}&=\underbrace{0}_{\text{균형 3-wire}}\\
          \underbrace{\mathbf i_{space}}_{\text{winding 공간축 합성}}&=
          \underbrace{i_a+i_be^{j2\pi/3}+i_ce^{-j2\pi/3}}_{\text{세 phase를 방향까지 더함}}\\
          \underbrace{\mathbf i_s}_{\text{stator current vector}}&=
          \underbrace{\frac{2}{3}\mathbf i_{space}}_{\text{phase peak 크기로 맞춤}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="첫 줄의 zero sum은 중성선이 없는 균형 3-wire model입니다. Common-mode/zero-sequence current, sensor offset 또는 fault가 있으면 2D alpha-beta만으로 전체 current를 재구성할 수 없습니다. 두 번째 줄의 2/3은 이 amplitude-invariant convention에서 phase peak를 vector magnitude로 보존하려는 선택입니다." symbols={[[raw`\mathbf i_s`, 'Stator plane에서 회전하는 complex current space vector'], [raw`e^{\pm j2\pi/3}`, 'B/C winding의 고정 공간축 회전'], [raw`i_a+i_b+i_c`, 'Zero-sequence와 calibration 이상을 드러내는 합']]} />
        <RotatingFieldLab />
        <Takeaway>Torque는 current 크기만의 결과가 아닙니다. Rotor flux와 평행한 current는 주로 field channel, 수직 성분은 주로 torque channel이 됩니다. FOC는 이 기하를 매 sample마다 계산 가능한 좌표로 만드는 방법입니다.</Takeaway>
      </NlpSection>

      <NlpSection id="clarke-transform" marker="03" tone="teal" question="세 phase를 두 축으로 줄여도 정보가 사라지지 않는 조건은 무엇일까?" title="Clarke transform은 균형 3-phase subspace를 고정된 두 축으로 펼친다">
        <p>균형 조건에서는 세 current 중 둘만 독립입니다. Clarke transform은 A winding과 나란한 alpha axis, 그에 수직인 beta axis에 세 winding vector를 투영합니다. Motor physics를 바꾸는 것이 아니라 같은 stator current vector를 stationary orthogonal coordinates로 다시 적습니다.</p>
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{i_\alpha}_{\text{alpha축 current}}&=
          \underbrace{\frac{2}{3}\left(i_a-\frac12i_b-\frac12i_c\right)}_{\text{세 winding을 alpha축에 투영}}\\
          \underbrace{i_\beta}_{\text{beta축 current}}&=
          \underbrace{\frac{2}{3}\left(\frac{\sqrt3}{2}i_b-\frac{\sqrt3}{2}i_c\right)}_{\text{B·C를 beta축에 투영}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="Matrix의 각 열은 해당 winding axis가 alpha와 beta에 기여하는 cosine projection입니다. 2/3을 쓰면 균형 sinusoid의 phase peak와 alpha-beta vector magnitude가 같아집니다. 이 선택에 맞는 inverse와 torque/power constant를 끝까지 사용해야 합니다." symbols={[[raw`i_\alpha`, 'A winding 방향에 놓은 stationary current coordinate'], [raw`i_\beta`, 'Alpha와 직교하는 stationary current coordinate'], [raw`2/3`, 'Amplitude-invariant Clarke scaling coefficient']]} />
        <MathFormula display>{raw`\underbrace{i_0}_{\text{2D 밖의 공통 성분}}=\underbrace{\frac{i_a+i_b+i_c}{3}}_{\text{세 phase 평균으로 zero sequence 분리}}`}</MathFormula>
        <FormulaNote meaning="i0가 무시할 수 없으면 alpha-beta 두 값만으로 원래 세 current를 완전히 되돌릴 수 없습니다. 이는 common-mode path일 수도 있고 offset, polarity, open-phase fault일 수도 있으므로 residual을 계측 신호로 남깁니다." symbols={[[raw`i_0`, 'Zero-sequence coordinate 또는 current-sum residual'], [raw`(i_a+i_b+i_c)/3`, '세 phase에 공통으로 들어간 성분을 추출하는 평균']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{k_C^{amp}}_{\text{peak 보존 scale}}&=\underbrace{\frac23}_{\text{amplitude invariant}}\\
          \underbrace{k_C^{power}}_{\text{power 좌표 scale}}&=\underbrace{\sqrt{\frac23}}_{\text{orthonormal transform}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="둘 중 하나가 참이고 다른 하나가 틀린 것이 아닙니다. 문제는 forward transform은 power-invariant인데 inverse와 torque 식은 amplitude-invariant constant를 사용하는 혼합입니다. 그 경우 d-q current와 torque estimate의 scale이 조용히 어긋납니다." symbols={[[raw`k_C`, 'Clarke matrix 앞에 곱하는 convention coefficient'], [raw`\sqrt{2/3}`, '세 축에서 두 orthonormal 축으로 power inner product를 맞추는 scale']]} />
        <ClarkeProjectionLab />
      </NlpSection>

      <NlpSection id="park-angle" marker="04" tone="violet" question="Stationary current vector를 왜 rotor와 함께 도는 좌표로 다시 바꿀까?" title="Park transform은 flux를 d축에 멈춰 torque와 field를 DC-like channel로 만든다">
        <p>Alpha-beta에서 정상 운전 current vector는 계속 회전하므로 PI controller가 sinusoid를 추적해야 합니다. 좌표축을 rotor flux와 같은 속도로 돌리면 flux와 함께 회전하는 current가 거의 고정된 d, q 값으로 보입니다. Blaschke가 강조한 직접 접근의 현대적 계산 형태입니다. 하지만 좌표가 실제 flux를 따라갈 때만 d와 q가 field와 torque를 뜻합니다.</p>
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{\theta_{rot}}_{\text{회전량 변환}}&=
          \underbrace{s_\theta p\theta_m}_{\text{방향·pole pair 반영}}\\
          \underbrace{\theta_e}_{\text{Park electrical angle}}&=
          \underbrace{\theta_{rot}+\theta_0}_{\text{flux zero까지 정렬}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="14 poles는 7 pole pairs입니다. Mechanical revolution 한 번 동안 electrical field는 p번 회전합니다. Encoder positive direction, phase order와 zero offset은 함께 검증해야 하며 modulo wrap은 차이를 구한 뒤 적용해야 합니다." symbols={[[raw`\theta_m`, 'Encoder가 측정한 mechanical rotor angle'], [raw`p`, 'Pole count가 아니라 pole-pair count'], [raw`s_\theta`, 'Positive mechanical rotation과 electrical phase 진행 방향의 부호'], [raw`\theta_0`, 'Alignment으로 정한 rotor-flux-to-phase reference offset']]} />
        <MathFormula display>{raw`\underbrace{\begin{bmatrix}i_d\\i_q\end{bmatrix}}_{\text{flux와 torque 좌표}}=
          \underbrace{\begin{bmatrix}\cos\theta_e&\sin\theta_e\\-\sin\theta_e&\cos\theta_e\end{bmatrix}}_{\text{stationary vector를 }-\theta_e\text{만큼 회전}}
          \underbrace{\begin{bmatrix}i_\alpha\\i_\beta\end{bmatrix}}_{\text{Clarke output}}`}</MathFormula>
        <FormulaNote meaning="이 식은 d축을 rotor flux와 맞추고 positive q축을 90 degrees 앞에 두는 한 convention입니다. Library마다 q sign, sine 위치와 phase order가 다를 수 있으므로 식, inverse, encoder sign과 PWM mapping을 하나의 계약으로 봅니다." symbols={[[raw`i_d`, 'Rotor flux와 평행한 current component'], [raw`i_q`, '선언한 positive torque 방향의 perpendicular current'], [raw`\theta_e`, '동일 sample instant의 electrical rotor-flux angle']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{\tilde i_d}_{\text{틀린 d축 관측}}&=
          \underbrace{i_d\cos\delta}_{\text{d축 잔류}}+\underbrace{i_q\sin\delta}_{\text{q→d 누설}}\\
          \underbrace{\tilde i_q}_{\text{틀린 q축 관측}}&=
          \underbrace{-i_d\sin\delta}_{\text{d→q 누설}}+\underbrace{i_q\cos\delta}_{\text{q축 잔류}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="Angle error delta는 단순 measurement bias가 아니라 d와 q의 cross leakage입니다. q torque current 일부가 d로 보이고 controller가 이를 없애려 잘못된 voltage를 보내므로 heat, torque ripple와 instability가 함께 나타날 수 있습니다." symbols={[[raw`\delta=\hat\theta_e-\theta_e`, 'Configured electrical angle과 true flux angle의 차이'], [raw`\tilde i_d,\tilde i_q`, '잘못 정렬된 frame에서 controller가 보는 current']]} />
        <ParkAngleContractLab />
        <Misconception>Encoder가 정밀해도 electrical angle이 자동으로 정확해지지 않습니다. Pole-pair 수, index/absolute zero, gear/shaft relation, phase order, positive direction, sampling timestamp와 interpolation이 모두 맞아야 합니다.</Misconception>
      </NlpSection>

      <NlpSection id="pmsm-model" marker="05" tone="amber" question="왜 speed가 올라가면 같은 current를 유지하는 데 더 큰 voltage가 필요할까?" title="PMSM d-q equation은 voltage가 쓰이는 네 물리 원인을 분리한다">
        <p>D-q frame은 current reference를 DC-like 값으로 만들지만 motor dynamics를 없애지는 않습니다. Resistance는 copper drop을 만들고 inductance는 current 변화에 voltage를 요구합니다. Rotating frame에서는 d와 q가 speed에 비례해 서로 결합하며 permanent magnet은 q-axis에 back EMF를 만듭니다. Current controller가 이 항을 보지 못하면 저속에서는 동작해도 고속에서 voltage saturation과 axis error가 커집니다.</p>
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{v_d}_{\text{d축 voltage}}&=
          \underbrace{R_si_d+L_d\frac{di_d}{dt}}_{\text{저항 강하+d current 변화}}-
          \underbrace{\omega_eL_qi_q}_{\text{q→d 회전 결합}}\\
          \underbrace{v_q}_{\text{q축 voltage}}&=
          \underbrace{R_si_q+L_q\frac{di_q}{dt}}_{\text{저항 강하+q current 변화}}+
          \underbrace{\omega_e(L_di_d+\psi_m)}_{\text{d 결합+magnet 역기전력}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="각 항은 volt 단위가 되어야 합니다. omega_e는 mechanical speed가 아니라 electrical rad/s입니다. Rs는 winding temperature에 따라 변하고 Ld/Lq는 current와 magnetic saturation에 따라 변할 수 있으므로 feedforward는 model-based 보조 항이지 측정 feedback의 대체가 아닙니다." symbols={[[raw`R_s`, '한 phase의 stator resistance [Ω]'], [raw`L_d,L_q`, 'd/q differential inductance [H]'], [raw`\omega_e=p\omega_m`, 'Electrical angular speed [rad/s]'], [raw`\psi_m`, 'Permanent-magnet flux linkage [Wb]']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{T_{mag}}_{\text{magnet torque}}&=
          \underbrace{\frac32p\psi_mi_q}_{\text{flux와 q current 결합}}\\
          \underbrace{T_{rel}}_{\text{reluctance torque}}&=
          \underbrace{\frac32p(L_d-L_q)i_di_q}_{\text{saliency와 d·q 결합}}\\
          \underbrace{T_e}_{\text{전체 electromagnetic torque}}&=
          \underbrace{T_{mag}+T_{rel}}_{\text{두 torque 원인을 합함}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="Amplitude-invariant peak-current convention의 common PMSM torque 식입니다. SPM에서는 Ld와 Lq가 비슷해 reluctance term이 작고 id=0가 자연스러운 baseline입니다. IPM은 Ld와 Lq 차이를 이용해 negative id에서도 torque-per-ampere를 높일 수 있으므로 id=0를 universal rule로 쓰지 않습니다." symbols={[[raw`T_e`, 'Motor 내부에서 생성한 electromagnetic torque [N·m]'], [raw`\psi_m i_q`, 'Magnet flux와 perpendicular current가 만드는 torque term'], [raw`(L_d-L_q)i_di_q`, 'Rotor saliency가 만드는 reluctance torque term']]} />
        <ContractLedger items={[
          { label: 'Resistance', contract: 'Phase/line-line 측정 정의와 winding temperature를 기록', failure: 'Ki와 copper loss, voltage drop이 틀립니다.' },
          { label: 'Inductance', contract: 'Ld/Lq, measurement frequency, current operating point와 differential/apparent 정의를 기록', failure: 'PI bandwidth와 decoupling이 operating point마다 달라집니다.' },
          { label: 'Flux linkage', contract: 'Peak/RMS back-EMF convention과 electrical speed 단위를 고정', failure: 'Torque constant와 high-speed voltage가 동시에 어긋납니다.' },
          { label: 'Pole pairs', contract: 'Datasheet pole count를 2로 나누고 physical rotation test로 검증', failure: 'Angle와 speed coupling이 integer 배로 틀립니다.' },
        ]} />
        <PmsmTorqueModelLab />
      </NlpSection>

      <NlpSection id="current-loop" marker="06" tone="teal" question="d와 q에 PI를 하나씩 두면 왜 두 독립 loop라고만 볼 수 없을까?" title="두 current regulator는 하나의 제한된 voltage vector를 함께 사용한다">
        <p>Angle과 transform이 맞고 voltage가 충분한 작은-signal 구간에서는 d와 q current plant를 각각 RL first-order system처럼 볼 수 있습니다. 이때 원하는 crossover angular frequency를 정해 model pole을 상쇄하는 PI starting gain을 만들 수 있습니다. 그러나 두 controller output은 하나의 inverter vector limit 안에 함께 들어가고, sample·compute·PWM delay가 같은 phase margin을 소비합니다.</p>
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{K_{p,d}}_{\text{d loop proportional}}&=\underbrace{L_d\omega_c}_{\text{inductance와 목표 속도를 곱함}}\\
          \underbrace{K_{p,q}}_{\text{q loop proportional}}&=\underbrace{L_q\omega_c}_{\text{q inductance에 맞춘 gain}}\\
          \underbrace{K_i}_{\text{integral gain}}&=\underbrace{R_s\omega_c}_{\text{RL pole을 보상하는 시작값}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="이는 정확한 Rs, L과 이상적인 decoupling을 가정한 continuous-time starting point입니다. omega_c를 switching frequency에 가깝게 올리는 공식이 아닙니다. Zero-order hold, computation/PWM delay, current filter, quantization, saturation과 parameter error를 포함해 discrete closed-loop response를 다시 확인합니다." symbols={[[raw`\omega_c=2\pi f_c`, '설계하려는 current-loop crossover angular frequency'], [raw`K_{p,d},K_{p,q}`, 'Current error [A]를 voltage [V]로 바꾸는 proportional gains'], [raw`K_i`, '누적 current error를 voltage로 바꾸는 continuous-time integral gain']]} />
        <MathFormula display>{raw`\underbrace{\mathbf v_{ff}}_{\text{model coupling 선제 보상}}=
          \underbrace{\begin{bmatrix}-\omega_eL_qi_q\\\omega_eL_di_d+\omega_e\psi_m\end{bmatrix}}_{\text{d/q cross coupling과 back EMF를 미리 더함}}`}</MathFormula>
        <FormulaNote meaning="Feedforward는 measured speed/current와 motor model로 예상되는 voltage를 미리 요청해 PI가 disturbance residual만 보게 합니다. Angle sign이나 parameter가 틀리면 오히려 error를 주입하므로 feedback error와 saturation evidence를 계속 봐야 합니다." symbols={[[raw`\mathbf v_{ff}`, 'd/q PI output에 더하는 modeled voltage vector'], [raw`-\omega_eL_qi_q`, 'q current가 d voltage에 만드는 rotating-frame coupling'], [raw`\omega_e\psi_m`, 'Speed에 비례하는 magnet back EMF']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{\gamma}_{\text{vector 축소율}}&=
          \underbrace{\min\left(1,\frac{V_{max}}{\|\mathbf v_u\|_2}\right)}_{\text{voltage 크기만 제한}}\\
          \underbrace{\mathbf v_s}_{\text{적용 가능한 voltage}}&=
          \underbrace{\gamma\mathbf v_u}_{\text{요청 방향을 보존}}\\
          \underbrace{\Delta\mathbf v}_{\text{못 낸 voltage}}&=
          \underbrace{\mathbf v_s-\mathbf v_u}_{\text{limited-requested 차이}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="d와 q를 각각 clip하면 requested vector 방향이 바뀝니다. 2-norm vector limiter는 우선순위 정책이 없는 기본 경우에 방향을 보존하고, 실제로 내지 못한 voltage를 Delta v로 남깁니다." symbols={[[raw`\|\mathbf v\|_2`, 'd와 q voltage를 하나의 vector magnitude로 묶는 Euclidean norm'], [raw`\gamma`, '요청 vector를 inverter 한계 안으로 줄이는 공통 scale'], [raw`\Delta\mathbf v`, '제어기가 요청했지만 inverter가 적용하지 못한 voltage']]} />
        <MathFormula display>{raw`
          \underbrace{\mathbf x_I[k+1]}_{\text{다음 integral}}=
          \underbrace{\mathbf x_I[k]+T_sK_i\mathbf e[k]}_{\text{error를 sample만큼 누적}}+
          \underbrace{T_sK_{aw}\Delta\mathbf v}_{\text{saturation 누적을 되감음}}
        `}</MathFormula>
        <FormulaNote meaning="Anti-windup은 실제로 적용하지 못한 voltage difference를 integrator에 돌려줘 saturation이 풀린 뒤 오래된 error를 계속 밀지 않게 합니다. Torque-priority나 field-weakening에서는 공통 vector scale 외에 별도의 axis priority 정책이 필요할 수 있습니다." symbols={[[raw`\mathbf x_I[k]`, '현재 discrete integral voltage state'], [raw`T_s`, 'Current-loop sample period [s]'], [raw`K_{aw}`, 'Saturation difference를 integral state로 되돌리는 back-calculation rate']]} />
        <DqCurrentLoopLab />
      </NlpSection>

      <NlpSection id="svpwm-inverter" marker="07" tone="violet" question="Continuous voltage vector를 on/off switch 여섯 개가 어떻게 만들까?" title="SVPWM은 discrete inverter state의 시간 평균으로 원하는 voltage를 합성한다">
        <p>Inverse Park는 d-q voltage를 stationary alpha-beta로 되돌립니다. 하지만 two-level inverter의 각 leg는 DC+ 또는 DC-에만 연결됩니다. 세 leg 조합은 여섯 active vector와 두 zero vector를 만들고, SVPWM은 현재 sector의 인접 active vector 두 개와 zero vector에 머무는 시간을 정해 한 PWM period의 평균을 요청 vector와 맞춥니다.</p>
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{v_\alpha}_{\text{stationary alpha voltage}}&=
          \underbrace{v_d\cos\theta_e-v_q\sin\theta_e}_{\text{d·q를 alpha축에 역투영}}\\
          \underbrace{v_\beta}_{\text{stationary beta voltage}}&=
          \underbrace{v_d\sin\theta_e+v_q\cos\theta_e}_{\text{d·q를 beta축에 역투영}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="Forward Park와 정확히 반대인 rotation이어야 합니다. Angle sample과 sign이 다르거나 transform scale을 섞으면 d-q controller가 요청한 voltage vector가 다른 phase pattern으로 나갑니다." symbols={[[raw`v_\alpha,v_\beta`, 'Stator stationary plane의 voltage reference'], [raw`v_d,v_q`, 'Current regulator와 limiter를 지난 rotating-frame voltage'], [raw`\theta_e`, 'Current measurement와 같은 control cycle의 electrical angle']]} />
        <MathFormula display>{raw`\underbrace{\|\mathbf v_{dq}\|_2}_{\text{요청 voltage 크기}}\le
          \underbrace{V_{max}}_{\text{SVPWM linear circle}}=
          \underbrace{\frac{V_{dc}}{\sqrt3}}_{\text{현재 DC bus로 정규화}}`}</MathFormula>
        <FormulaNote meaning="선언한 phase peak/amplitude-invariant convention에서 쓰는 common SVPWM linear limit입니다. Hexagon의 꼭짓점과 inscribed linear circle, line-line/phase voltage, peak/RMS definition을 구분해야 합니다. Vdc를 nominal constant로 두면 bus droop 때 modulation이 실제보다 작아지고 regeneration 때 overvoltage 판단을 놓칩니다." symbols={[[raw`V_{dc}`, 'ADC로 같은 operating interval에 측정한 DC-link voltage'], [raw`V_{max}`, '선형 modulation에서 방향과 무관하게 보장하는 phase-reference peak limit'], [raw`\|\mathbf v_{dq}\|_2`, 'Rotation 전후 동일한 voltage vector magnitude']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{T_1}_{\text{첫 인접 active vector}}&=\underbrace{\sqrt3T_{pwm}\frac{V^*}{V_{dc}}\sin(\pi/3-\alpha)}_{\text{sector 안 첫 축으로 투영}}\\
          \underbrace{T_2}_{\text{둘째 인접 active vector}}&=\underbrace{\sqrt3T_{pwm}\frac{V^*}{V_{dc}}\sin\alpha}_{\text{sector 안 둘째 축으로 투영}}\\
          \underbrace{T_0}_{\text{남은 zero-vector 시간}}&=\underbrace{T_{pwm}-T_1-T_2}_{\text{한 PWM period를 완성}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="Alpha는 현재 60-degree sector 안의 local angle입니다. Dwell은 transistor가 그 voltage를 연속 출력한다는 뜻이 아니라, discrete state의 period average가 V*에 가까워진다는 뜻입니다. T1/T2가 minimum pulse보다 짧거나 T0가 음수면 같은 sampling/modulation policy를 유지할 수 없습니다." symbols={[[raw`T_{pwm}`, '한 switching period'], [raw`V^*`, 'Stationary reference vector magnitude'], [raw`\alpha\in[0,\pi/3]`, '현재 sector 시작축에서 잰 local vector angle']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{d_{dead}}_{\text{비활성 시간 비율}}&=
          \underbrace{\frac{T_{dead}}{T_{pwm}}}_{\text{dead time을 period로 나눔}}\\
          \underbrace{\Delta v_{dead}}_{\text{평균 voltage 오차}}&\propto
          \underbrace{V_{dc}d_{dead}}_{\text{bus 크기만큼 오차 생성}}
          \underbrace{sign(i_{phase})}_{\text{current가 오차 방향 선택}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="Dead time은 같은 half bridge의 high/low switch가 동시에 켜지는 shoot-through를 막지만, 그동안 phase node는 current와 diode 상태에 의해 결정됩니다. 따라서 commanded duty와 average phase voltage가 달라지고, propagation mismatch와 minimum pulse도 같은 applied-voltage 계약에 들어갑니다. 이 비례식은 직관용이며 실제 보상은 topology와 measured switching behavior를 사용합니다." symbols={[[raw`T_{dead}`, 'High-side와 low-side 전환 사이의 강제 off interval'], [raw`sign(i_{phase})`, 'Dead interval에 어느 device/diode가 current를 이어가는지 정하는 current 방향']]} />
        <SvpwmInverterLab />
      </NlpSection>

      <NlpSection id="sensing-alignment" marker="08" tone="blue" question="Current ADC 숫자가 정상 범위인데도 왜 FOC가 발산할 수 있을까?" title="Sensor scale·phase identity·sample window가 transform의 진실성을 결정한다">
        <p>FOC는 measured phase current와 rotor angle이 같은 physical instant를 나타내고, channel label과 polarity가 PWM phase에 맞으며, switching transient가 가라앉은 뒤의 값을 읽었다고 가정합니다. Offset이 작은 숫자로 보여도 Park에서 DC bias와 rotating harmonic으로 바뀌고, phase order가 틀리면 torque direction과 frame rotation이 뒤집힙니다.</p>
        <ContractLedger items={[
          { label: 'Inline current', contract: 'Phase conductor를 직접 측정해 넓은 conduction observability를 얻음', failure: '높은 common-mode voltage, isolation/amp bandwidth와 비용이 어려워집니다.' },
          { label: 'Three-shunt', contract: '각 inverter leg low side에서 여러 phase를 교대 측정', failure: '해당 low-side switch가 꺼진 구간과 switching transient에서는 읽을 수 없습니다.' },
          { label: 'Two-shunt', contract: '두 current를 읽고 KCL로 세 번째를 재구성', failure: 'High duty에서 한 low-side window가 사라지거나 offset/KCL residual이 커집니다.' },
          { label: 'Single-shunt', contract: 'DC-link current와 switching state로 phase current를 재구성', failure: '두 active-vector dwell이 충분하지 않은 sector boundary/low modulation에서 관측 불가능합니다.' },
        ]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{\Delta code_i}_{\text{offset 제거 code}}&=
          \underbrace{code_i-code_{0,i}}_{\text{phase별 zero를 뺌}}\\
          \underbrace{i_{phase,i}}_{\text{물리 phase current}}&=
          \underbrace{s_i g_i\Delta code_i}_{\text{polarity·ampere scale 적용}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="Offset, gain과 sign은 channel마다 따로 보정합니다. 한 번의 startup average가 온도·common-mode·amplifier saturation 뒤에도 유효하다고 가정하지 않습니다. Current probe와 ADC signal을 제한된 bus/current에서 함께 캡처해 scale과 polarity를 검증합니다." symbols={[[raw`code`, 'ADC가 캡처한 raw sample'], [raw`code_{0,i}`, 'Phase i의 zero-current offset code'], [raw`g_i`, 'ADC/code와 shunt/amplifier gain을 합친 A-per-code scale'], [raw`s_i\in\{-1,+1\}`, 'PWM-to-current positive direction mapping']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{T_{analog}}_{\text{sensor가 안정될 시간}}&=
          \underbrace{T_{rise}+T_{settle}}_{\text{상승 뒤 오차 범위까지 대기}}\\
          \underbrace{T_{capture}}_{\text{획득에 필요한 시간}}&=
          \underbrace{T_{S\&H}+T_{dead}}_{\text{ADC 획득+switch 비중첩}}\\
          \underbrace{T_{active}}_{\text{current 관측 구간}}&>
          \underbrace{T_{analog}+T_{capture}}_{\text{안정과 획득 시간을 모두 확보}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="TI single-shunt 분석의 minimum active-vector idea를 일반적인 timing checklist로 변환한 식입니다. Single-shunt에선 직접 reconstruction 가능성을 정하지만 inline/two/three-shunt의 정확한 window는 서로 다릅니다. Comparator trigger time이 아니라 sample-and-hold aperture가 clean interval 안에 들어가야 합니다." symbols={[[raw`T_{active}`, '해당 topology에서 원하는 current가 shunt/sensor 경로에 실제로 흐르는 시간'], [raw`T_{rise}+T_{settle}`, 'Power switch와 analog front end가 허용 error 안으로 들어오는 시간'], [raw`T_{S\&H}`, 'ADC acquisition capacitor가 값을 획득하는 시간']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{G_{cal}}_{\text{calibration gate}}&=
          \underbrace{G_{map}\land G_{offset}\land G_{angle}}_{\text{mapping·zero·angle 통과}}\\
          \underbrace{G_{run}}_{\text{runtime gate}}&=
          \underbrace{G_{window}\land G_{protection}}_{\text{관측 가능·trip 준비}}\\
          \underbrace{G_{close}}_{\text{current loop enable}}&=
          \underbrace{G_{cal}\land G_{run}}_{\text{두 gate가 모두 true}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="Alignment current를 넣기 전에 PWM phase mapping과 current polarity를 확인하고, q-current loop를 닫기 전에 rotor zero/direction을 확인합니다. Unknown인 gate는 true가 아니라 closed입니다. Open-loop rotation과 bounded alignment는 production torque command가 아니라 commissioning transaction입니다." symbols={[[raw`G_{map}`, 'PWM U/V/W와 ADC phase channel mapping 검증'], [raw`G_{angle}`, 'Pole pairs, zero, sign과 phase order 검증'], [raw`G_{window}`, '현재 PWM state에서 valid current sample 획득'], [raw`G_{protection}`, 'Independent overcurrent/driver trip가 armed됨']]} />
        <SensorAlignmentWindowLab />
      </NlpSection>

      <NlpSection id="operating-envelope" marker="09" tone="amber" question="저속에서 잘 도는 drive가 왜 고속에서는 같은 torque를 낼 수 없을까?" title="MTPA와 field weakening은 current circle과 speed-dependent voltage ellipse 안의 경로다">
        <p>Motor와 inverter는 current magnitude로 제한되고, DC bus는 낼 수 있는 voltage magnitude를 제한합니다. 저속에서는 back EMF가 작아 current limit이 torque를 주로 정합니다. Speed가 올라가면 magnet back EMF와 cross coupling이 voltage budget을 차지해 voltage ellipse가 줄어듭니다. 이때 negative d current로 effective flux를 줄여 speed를 넓히지만 같은 current 중 torque-producing q share가 줄어 torque capacity도 내려갑니다.</p>
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{i_d^2+i_q^2}_{\text{current vector 크기의 제곱}}&\le\underbrace{I_{max}^2}_{\text{motor·inverter·thermal 한계}}\\
          \underbrace{v_d^2+v_q^2}_{\text{voltage vector 크기의 제곱}}&\le\underbrace{V_{max}^2}_{\text{현재 DC bus의 modulation 한계}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="첫 식은 d-q plane의 current circle입니다. 두 번째는 voltage circle이지만 steady-state PMSM equation을 대입하면 current plane에서 speed에 따라 줄고 이동하는 ellipse가 됩니다. 두 제약을 동시에 만족하는 current reference만 실행 가능합니다." symbols={[[raw`I_{max}`, 'Winding, inverter RMS/peak와 temperature derating을 반영한 current limit'], [raw`V_{max}`, 'Measured Vdc와 modulation/minimum-pulse policy가 정한 voltage limit']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{\lambda_d}_{\text{d축 effective flux}}&=
          \underbrace{L_di_d+\psi_m}_{\text{d current와 magnet flux 합성}}\\
          \underbrace{\lambda_q}_{\text{q축 current flux}}&=
          \underbrace{L_qi_q}_{\text{q current를 inductance로 변환}}\\
          \underbrace{\lambda_d^2+\lambda_q^2}_{\text{flux vector 크기}}&\le
          \underbrace{\left(\frac{V_{max}}{\omega_e}\right)^2}_{\text{speed가 높을수록 작은 한계}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="High-speed steady state에서 Rs와 current derivative를 작다고 둔 설명용 voltage ellipse입니다. 실제 operating gate는 Rs, dynamics, delay와 margin을 포함한 full equation을 사용합니다. Omega_e가 커질수록 오른쪽 radius가 작아져 negative id field weakening이 필요해집니다." symbols={[[raw`L_di_d+\psi_m`, 'd-axis current가 magnet flux linkage를 보강하거나 약화한 effective term'], [raw`V_{max}/\omega_e`, '같은 bus voltage가 허용하는 flux-linkage scale'], [raw`\omega_e`, 'Electrical speed; zero speed에서 이 근사 ellipse를 사용하지 않음']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{P_{mech}}_{\text{shaft power}}&=\underbrace{T_e\omega_m}_{\text{torque와 mechanical speed의 부호 포함 곱}}\\
          \underbrace{P_{dc}}_{\text{DC-link power}}&=\underbrace{V_{dc}I_{dc}}_{\text{bus voltage·signed current}}\\
          \underbrace{P_{loss}}_{\text{열로 가는 차이}}&=\underbrace{P_{dc}-P_{mech}}_{\text{motoring convention의 energy balance}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="Torque와 speed 부호가 반대면 mechanical power가 negative이고 energy가 DC bus로 돌아오는 regeneration입니다. 전원이나 battery가 흡수하지 못하면 bus capacitor voltage가 상승하므로 brake resistor, battery charge limit, torque derate 또는 gate-disable policy가 필요합니다. 단순 voltage clipping은 energy destination을 만들지 않습니다." symbols={[[raw`P_{mech}`, 'Motor가 shaft로 전달하거나 shaft에서 흡수하는 signed mechanical power'], [raw`P_{dc}`, 'Inverter가 DC link에서 가져오거나 돌려주는 signed electrical power'], [raw`P_{loss}`, 'Copper, switching, iron, mechanical과 stray losses의 합']]} />
        <OperatingEnvelopeLab />
        <Misconception>MTPA는 항상 negative id를 크게 넣는 규칙이 아니고 field weakening도 speed만 보고 켜는 옵션이 아닙니다. Motor saliency와 parameter map, current/voltage limit, efficiency, torque error, temperature와 bus absorption capability가 함께 정하는 constrained reference policy입니다.</Misconception>
      </NlpSection>

      <NlpSection id="commissioning" marker="10" tone="green" question="FOC code가 compile되고 motor가 돌았다면 무엇이 아직 증명되지 않았을까?" title="Commissioning은 software request부터 copper·heat까지 증거를 한 단계씩 닫는다">
        <p>잘못된 phase mapping과 angle sign도 낮은 voltage에서는 우연히 회전할 수 있습니다. Full torque를 먼저 걸면 어느 layer가 틀렸는지 알기 전에 overcurrent나 mechanical motion이 발생합니다. Production commissioning은 energization envelope를 작게 시작하고, 다음 단계에 필요한 물리 evidence가 통과할 때만 voltage·current·speed·load 범위를 넓힙니다.</p>
        <MotorDriveFailureLegend />
        <EvidenceSequence items={[
          { signal: 'De-energized mapping', meaning: 'Motor를 분리하고 MCU PWM pin과 gate output의 U/V/W, high/low polarity, dead time과 trip input을 scope로 확인합니다.', response: '한 leg라도 mapping이 다르면 power stage를 연결하지 않습니다.' },
          { signal: 'Limited-bus current sensing', meaning: 'Current-limited supply에서 probe와 ADC code를 동시에 캡처해 offset, gain, polarity, common-mode recovery와 saturation을 확인합니다.', response: 'Phase별 calibration과 valid sample window가 없으면 current loop를 닫지 않습니다.' },
          { signal: 'Bounded alignment', meaning: '작은 d-axis current/voltage로 rotor를 known electrical orientation에 두고 encoder zero, pole pairs와 positive direction을 고정합니다.', response: 'Motion이 불명확하거나 current가 예상과 다르면 phase/angle contract를 다시 엽니다.' },
          { signal: 'Open-loop rotation', meaning: '낮은 voltage와 speed로 rotating vector를 진행해 phase order, electrical direction과 back-EMF/encoder consistency를 봅니다.', response: '회전 방향을 software sign 하나로 숨기지 않고 wiring/coordinate convention을 문서화합니다.' },
          { signal: 'Closed current loop', meaning: '작은 id/iq step에서 phase current, d-q response, vector saturation, PWM latch와 gate state를 같은 cycle로 캡처합니다.', response: 'Overshoot, saturation 또는 harmonic가 bound 밖이면 speed/torque loop를 열지 않습니다.' },
          { signal: 'Envelope and fault injection', meaning: 'Speed/load/temperature/DC-bus sweep와 overcurrent, sensor loss, encoder fault, regeneration을 주입해 independent trip와 supervised reset을 확인합니다.', response: '측정하지 않은 operating region은 production 허용 region이 아닙니다.' },
        ]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{G_{coord}}_{\text{좌표·센서 증거}}&=
          \underbrace{G_{map}\land G_{sense}\land G_{angle}}_{\text{phase·current·angle 통과}}\\
          \underbrace{G_{energy}}_{\text{에너지 envelope}}&=
          \underbrace{G_{current}\land G_{bus}\land G_{thermal}}_{\text{전류·bus·온도 통과}}\\
          \underbrace{G_{evidence}}_{\text{보호·관측 증거}}&=
          \underbrace{G_{trip}\land G_{ack}}_{\text{trip armed·state 확인}}\\
          \underbrace{G_{power}}_{\text{gate enable 허용}}&=
          \underbrace{G_{coord}\land G_{energy}\land G_{evidence}}_{\text{모든 층이 true}}
        \end{aligned}`}</MathFormula>
        <FormulaNote meaning="이 AND gate는 software boolean 한 개가 아니라 서로 다른 물리 경로의 evidence를 결합한 permission입니다. Gate-driver overcurrent는 MCU task보다 짧은 hardware path로 PWM을 끄고, firmware는 cause를 latch하며, host는 requested command가 아니라 observed power state를 받습니다. Reset은 fault clear, safe state, identity renewal과 제한된 재정렬을 거치는 supervised transaction입니다." symbols={[[raw`G_{sense}`, 'Current offset/gain/polarity와 PWM-synchronous observability가 valid'], [raw`G_{bus}`, 'DC-link voltage와 regeneration sink가 허용 범위'], [raw`G_{trip}`, 'Overcurrent/short/driver fault가 independent hardware 경로로 armed'], [raw`G_{ack}`, 'Applied sequence, driver power와 fault cause를 host가 관측']]} />
        <ContractLedger items={[
          { label: 'Gate loop', contract: 'Driver-to-MOSFET path를 짧게 하고 slew/dead-time을 measured switching waveform으로 결정', failure: 'Shoot-through, ringing, EMI와 false turn-on이 software 밖에서 발생합니다.' },
          { label: 'Power loop', contract: 'DC-link capacitor, half bridge와 return의 high-di/dt loop area를 최소화', failure: 'Bus overshoot와 ground bounce가 current/logic 기준을 흔듭니다.' },
          { label: 'Shunt Kelvin path', contract: 'Load current copper와 sense input path를 분리하고 amplifier/decoupling을 가깝게 배치', failure: 'Copper voltage와 switching transient를 current로 오인합니다.' },
          { label: 'Thermal/protection', contract: 'Junction-to-case/board/ambient path와 hardware overcurrent/temperature trip을 독립 검증', failure: '평균 current가 rating 안이어도 hotspot과 fault energy가 device를 넘습니다.' },
        ]} />
        <CommissioningEvidenceLab />
        <MotorDriveEvidenceStrip />
        <CapabilityCheck title="이 글을 읽고 직접 판정할 수 있어야 하는 것" items={[
          'Torque reference가 phase duty로 바뀌는 모든 중간 변수와 단위를 분리한다.',
          'Clarke/Park scaling, pole pairs, encoder sign/zero와 phase order를 하나의 frame contract로 검증한다.',
          'PMSM d-q voltage와 torque 식에서 resistance, dynamics, coupling, back EMF와 saliency를 식별한다.',
          'Current PI를 sample time에 맞게 이산화하고 vector saturation, anti-windup, delay와 feedforward를 함께 평가한다.',
          'SVPWM의 linear limit, sector dwell, dead time과 minimum pulse가 applied voltage를 바꾸는 이유를 설명한다.',
          'Sensing topology별 observable window와 current/encoder calibration을 close-loop gate로 만든다.',
          'Current circle과 voltage ellipse 안에서 MTPA, field weakening, regeneration과 thermal derating을 구분한다.',
          'Command echo가 아니라 PWM, gate, current, bus, rotor와 torque evidence로 commissioning을 단계화한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Blaschke field-orientation thesis (1973)', href: 'https://pure.tue.nl/ws/portalfiles/portal/132793355/167727.pdf', note: 'Field-oriented coordinates, measured/model field variants, synchronous/induction applications, stability and TRANSVEKTOR realization의 primary source.' },
          { label: 'TI Single-Axis Motor Control and PFC · SPRABZ5', href: 'https://www.ti.com/lit/pdf/sprabz5', note: 'Clarke, Park, d-q current regulation, inverse Park, SVPWM and rotor-flux position data flow.' },
          { label: 'TI Universal Motor Control Reference Design · TIDUF67', href: 'https://www.ti.com/lit/ug/tiduf67/tiduf67.pdf', note: 'IPMSM voltage/torque equations, current/voltage constraints, MTPA and field weakening.' },
          { label: 'TI Single DC-Link Shunt FOC · SPRACT7', href: 'https://www.ti.com/lit/an/spract7/spract7.pdf', note: 'Current-sensing topology, minimum active-vector duration and unmeasurable PWM regions.' },
          { label: 'Microchip encoder-based PMSM FOC', href: 'https://onlinedocs.microchip.com/oxy/GUID-AC0E172C-9656-4397-A490-08DF807DE2E8-en-US-2/index.html', note: 'Sensored FOC flow, PI loops, anti-windup, alignment and implementation sequence.' },
          { label: 'TI MSPM0 FOC Motor Control User Guide · SLUUDM5', href: 'https://www.ti.com/lit/ug/sluudm5/sluudm5.pdf', note: '2026 commissioning checks, PWM/current mapping, current-loop verification and dead-time behavior.' },
          { label: 'TI 48 V integrated inverter · TIDA-010956', href: 'https://www.ti.com/tool/TIDA-010956', note: 'Robot/factory inverter power stage, sensing, programmable gate drive and multilevel shutdown boundary.' },
        ]} />
        <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
          <Link to={articlePath('ai', 'robot-embedded-realtime-control')} className="group rounded-md border border-border p-4 transition-colors hover:border-teal-600/35 hover:bg-teal-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">바로 아래 runtime 기반 · Embedded Real-Time</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">ADC capture, ISR/DMA, deadline과 PWM latch가 이 electrical loop를 어느 hardware cycle에 실행하는지 연결합니다.</span></Link>
          <Link to={articlePath('ai', 'paper-blaschke-field-orientation-1973')} className="group rounded-md border border-border p-4 transition-colors hover:border-violet-600/35 hover:bg-violet-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">원전 뼈대 · Blaschke Field Orientation</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">왜 rotating-field machine을 field coordinates로 다시 써야 했는지, measured/model field와 parameter tradeoff를 원문 흐름으로 복원합니다.</span></Link>
          <Link to={articlePath('ai', 'robot-power-electronics-motor-driver')} className="group rounded-md border border-border p-4 transition-colors hover:border-amber-600/35 hover:bg-amber-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">다음 physical 기반 · Power Electronics</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">FOC가 계산한 duty가 DC-link, gate driver, MOSFET, current sensing, protection, heat와 PCB copper를 지나 실제 power가 되는 과정을 닫습니다.</span></Link>
        </div>
      </NlpSection>
    </>
  );
}
