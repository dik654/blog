import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { CapabilityCheck, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import { HarmonicDriveReferenceLab } from './paper-spine/viz/ActuatorSourceLabs';

const raw = String.raw;

function SourceLedger({ rows }: { rows: Array<{ page: string; artifact: string; use: string; boundary: string }> }) {
  return <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">{rows.map((row) => <div key={`${row.page}-${row.artifact}`} className="min-w-0 bg-background p-4"><div className="flex items-start justify-between gap-3"><p className="text-sm font-black leading-snug">{row.artifact}</p><span className="shrink-0 font-mono text-[10px] font-black text-violet-700 dark:text-violet-300">{row.page}</span></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">이 글에서 사용:</strong> {row.use}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">전이 금지:</strong> {row.boundary}</p></div>)}</div>;
}

export default function ReferenceHarmonicDriveMechatronics2026() {
  return <>
    <NlpSection id="artifact" marker="01" tone="teal" question="05/2026 제조사 catalog는 joint design에서 무엇을 증명하고 무엇을 남겨둘까?" title="Harmonic Drive Mechatronics를 부품 목록이 아니라 선택·검증 절차로 읽는다">
      <QuestionLead question="필요 output torque보다 rated torque가 큰 Harmonic Drive actuator를 고르면 selection은 끝나는가?" answer="아닙니다. 이 catalog 자체가 torque sizing 뒤에 stiffness, resonance, wave-generator bearing life, output-bearing load, brake와 feedback을 별도 check로 둡니다. 값은 exact product·ratio·condition에 묶이며 assembled robot의 성능 보증이 아닙니다." />
      <p>이 글의 primary artifact는 Harmonic Drive AG의 <em>Harmonic Drive Mechatronics</em>, issue `1053524 05/2026`입니다. 177 PDF pages 가운데 기술 선택 절차는 PDF pp. 158–175에 집중되어 있습니다. 먼저 artifact identity와 page를 고정한 이유는 catalog가 자주 개정되고 같은 family 안에서도 size와 ratio가 stiffness, accuracy, speed와 load ratings를 바꾸기 때문입니다.</p>
      <p>Manufacturer catalog는 실제 제품을 설계에 연결하는 강한 1차 자료입니다. 동시에 특정 test condition의 평균, selection recommendation와 simplified calculation을 담는 <strong>source-bound artifact</strong>입니다. 따라서 물리 원리와 제조사 rule을 같은 색으로 칠하지 않습니다.</p>
      <HarmonicDriveReferenceLab />
      <SourceLedger rows={[
        { page: 'pp. 158–163', artifact: 'Selection and two bearing-life procedures', use: 'Torque·stiffness·wave-generator bearing·output bearing check가 서로 다른 gate임을 복원', boundary: 'WG torque/speed life 식과 output-bearing radial/axial/moment life 식을 합침' },
        { page: 'pp. 160–161', artifact: 'Stiffness and resonance', use: 'K1/K2/K3와 simplified resonance assumption을 비교', boundary: 'Housing와 motor dynamics가 comparable한 joint에 one-inertia 식을 proof로 사용' },
        { page: 'pp. 166–167', artifact: 'Accuracy definitions', use: 'Zero backlash, hysteresis loss, lost motion, repeatability를 분리', boundary: 'Small-torque test를 full-load robot accuracy로 변환' },
        { page: 'pp. 172–175', artifact: 'Brake, feedback, disclaimer', use: 'Holding brake와 dual feedback option, 시험 기반 값의 산포·비보증 경계를 보존', boundary: 'Brake를 service stop/safety certification으로, 시험 기반 값을 guaranteed minimum으로 해석' },
      ]} />
    </NlpSection>

    <NlpSection id="selection-duty" marker="02" tone="blue" question="같은 peak torque인데 cycle 시간이 달라지면 왜 selection 결과가 바뀔까?" title="Catalog cycle은 peak와 RMS, speed와 bearing life를 서로 다른 제한으로 계산한다">
      <p>Catalog selection flow는 maximum torque 하나로 끝나지 않습니다. Acceleration, constant motion, deceleration, dwell의 torque와 duration으로 RMS torque를 만들고 average speed와 lifetime을 함께 검사합니다. Short peak가 repeated peak/momentary gate를 넘지 않는지와 RMS가 rated/thermal envelope 안인지가 별도 질문입니다.</p>
      <MathFormula display>{raw`\underbrace{T_{RMS}}_{\text{주기 등가 토크}}=\sqrt{\frac{\underbrace{\sum_k T_k^2t_k}_{\text{각 구간 토크 제곱의 시간 누적}}}{\underbrace{\sum_k t_k}_{\text{전체 주기}}}}`}</MathFormula>
      <FormulaNote meaning="Catalog reference cycle을 일반적인 piecewise form으로 옮긴 RMS torque relation입니다. Exact catalog symbol, reducer side, acceleration factor와 permitted category를 selected product row에 맞춥니다. RMS가 통과해도 maximum/repeated/momentary torque는 각각 별도로 통과해야 합니다." symbols={[[raw`T_k`, 'Cycle segment k의 declared output torque [N·m]'], [raw`t_k`, 'Segment duration [s]'], [raw`T_{RMS}`, 'Full-cycle RMS torque [N·m]']]} />
      <div data-formula-pair>
        <MathFormula display>{raw`\begin{aligned}\underbrace{n_{in,av}}_{\text{평균 입력 회전수}}&=\frac{\sum_k|n_{in,k}|t_k}{t_p}\\[-2pt]&\quad\underbrace{t_p:\ \text{idle 포함 전체 cycle}}_{\text{정지 구간은 분모에 포함}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Catalog p. 159의 reference-cycle 평균 입력 속도를 일반 segment 합으로 풀었습니다. tp에는 정지 구간도 포함되고 그 구간의 회전량은 0입니다. Wave-generator는 input side에서 움직이므로 output speed를 ratio 변환 없이 넣지 않습니다." symbols={[[raw`n_{in,k}`, '구간 k의 reducer input-side speed [min⁻¹]'], [raw`t_k`, '구간 k의 duration'], [raw`t_p`, 'Idle/dwell을 포함한 전체 cycle time'], [raw`n_{in,av}`, 'Wave-generator life에 쓰는 cycle-average input speed [min⁻¹]']]} />
      </div>
      <div data-formula-pair>
        <MathFormula display>{raw`\begin{aligned}\underbrace{L_{WG}}_{\text{웨이브 제너레이터 수명}}&=\underbrace{L_N\frac{n_N}{n_{in,av}}}_{\text{기준 수명과 속도 보정}}\\[-2pt]&\quad\times\underbrace{\left(\frac{T_N}{T_{av}}\right)^3}_{\text{평균 토크의 세제곱 영향}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Catalog p. 159의 wave-generator bearing relation입니다. 여기의 TN, nN, LN과 Tav 계산법은 selected actuator family·size·ratio row에서 가져옵니다. Output bearing의 radial/axial/moment equivalent load 식과 섞지 않습니다." symbols={[[raw`L_N`, 'Catalog가 정한 nominal wave-generator bearing life'], [raw`n_N,T_N`, '같은 product row의 nominal input speed와 torque'], [raw`n_{in,av},T_{av}`, 'Reference cycle로 계산한 average input speed와 average torque'], [raw`3`, '이 catalog WG life relation의 torque exponent']]} />
      </div>
      <MathFormula display>{raw`\underbrace{L_{out,rev}}_{\text{출력 베어링 기본 수명}}=\underbrace{\left(\frac{C}{f_wP_c}\right)^p}_{\text{출력측 등가 하중과 동정격의 비}}`}</MathFormula>
      <FormulaNote meaning="Catalog p. 163의 output-bearing workflow를 분리해 표시한 relation입니다. Pc는 radial force, axial force와 tilting moment를 catalog reference plane에서 조합한 equivalent load이고, exponent와 시간 환산은 bearing type과 exact procedure를 따릅니다. WG의 Tav·nin,av 식을 여기에 대입하지 않습니다." symbols={[[raw`C`, 'Selected output bearing의 dynamic load rating'], [raw`P_c`, 'Catalog procedure의 output-side equivalent dynamic load'], [raw`f_w`, 'Catalog application/load factor'], [raw`p`, '해당 output-bearing type의 life exponent']]} />
      <div className="not-prose my-7 border-y border-border py-4">
        <p className="text-xs font-black text-muted-foreground">같은 peak라도 반복 주기가 바뀌는 worked transfer</p>
        <p className="mt-2 text-sm leading-relaxed">40 N·m를 1초 쓰고 9초 쉬면 RMS는 √(40²×1/10)≈12.6 N·m입니다. 같은 1초 pulse 뒤 1초만 쉬면 √(40²×1/2)≈28.3 N·m입니다. Peak는 같지만 반복이 다르므로 thermal·bearing duty가 같지 않습니다. 이 값으로 제품을 고르는 것이 아니라, 선택한 catalog row의 repeated/momentary gate와 exact life procedure에 넣어야 할 cycle 차이를 먼저 드러내는 예입니다.</p>
      </div>
      <Misconception>Catalog의 `K ≤ 3`, `3 &lt; K ≤ 10` 같은 application factor recommendation은 이 제조사의 selection guidance입니다. 물리 법칙이나 모든 robot actuator의 universal acceptance criterion으로 복사하지 않습니다.</Misconception>
    </NlpSection>

    <NlpSection id="stiffness-resonance" marker="03" tone="violet" question="왜 catalog는 torsional stiffness를 한 숫자 대신 K₁·K₂·K₃로 제시할까?" title="Load region이 바뀌면 local slope와 resonance screen도 함께 바뀐다">
      <p>PDF pp. 160–161의 example은 torque–torsion relation을 세 load region으로 나눕니다. 각 K는 global material constant가 아니라 해당 region의 local slope입니다. 60 N·m example에서 약 2.5 arcmin deflection을 계산하는 흐름도 exact series data와 region boundary에 묶여 있습니다.</p>
      <MathFormula display>{raw`\begin{aligned}\varphi&=\underbrace{T/K_1}_{\text{낮은 구간}}&&|T|\le T_1\\\varphi&=\varphi_1+\underbrace{\Delta T_2/K_2}_{\text{중간 구간}}&&T_1<|T|\le T_2\\\varphi&=\varphi_2+\underbrace{\Delta T_3/K_3}_{\text{높은 구간}}&&|T|>T_2\end{aligned}`}</MathFormula>
      <FormulaNote meaning="Catalog의 three-region stiffness idea를 mobile에서도 region별로 읽히도록 재구성했습니다. Delta T2=|T|-T1, Delta T3=|T|-T2이고 phi1, phi2는 이전 region 끝의 continuous angle입니다. 모든 boundary와 K 값은 selected product·ratio row에서 가져오며 loading/unloading hysteresis와 housing/link compliance는 별도로 더합니다." symbols={[[raw`\varphi`, 'Reducer torsional angle [rad or arcmin after explicit conversion]'], [raw`T`, 'Applied output torque [N·m]'], [raw`\Delta T_2,\Delta T_3`, '각 region boundary를 넘은 추가 torque magnitude [N·m]'], [raw`K_1,K_2,K_3`, 'Load-region-specific torsional stiffness [N·m/rad]']]} />
      <MathFormula display>{raw`\begin{aligned}\underbrace{f_n}_{\text{자료의 단순 공진 검토}}&=\frac1{2\pi}\sqrt{\frac{\underbrace{K_1}_{\text{선택한 비틀림 강성}}}{\underbrace{J}_{\text{출력 부하 관성}}}}\\[-0.1em]&\underbrace{\text{적용 조건}}_{\text{하우징이 충분히 더 단단함}}\end{aligned}`}</MathFormula>
      <FormulaNote meaning="PDF p. 160의 simplified load-inertia resonance relation을 boundary와 함께 표시했습니다. Housing stiffness가 reducer보다 충분히 크고 load inertia가 model을 지배한다는 source assumption을 보존합니다. Motor inertia와 두 질량 relative mode, controller delay가 중요한 robot joint에는 full model과 measurement가 필요합니다." symbols={[[raw`K_1`, 'Source-selected torsional stiffness [N·m/rad]'], [raw`J`, 'Output load inertia under source assumption [kg·m²]'], [raw`f_n`, 'Simplified natural frequency [Hz]']]} />
      <p>Catalog는 wave-generator revolution마다 두 번 나타나는 vibration excitation과 resonance speed를 언급하고, 그 speed를 피하거나 빠르게 통과하도록 권고합니다. 이 현상과 motor–load two-mass resonance는 frequency가 겹칠 수 있지만 origin이 같다고 단정하지 않습니다. Trajectory spectrum과 assembled-joint sweep에서 각각 식별합니다.</p>
    </NlpSection>

    <NlpSection id="accuracy" marker="04" tone="amber" question="Zero-backlash tooth engagement와 lost motion 수치는 왜 동시에 존재할까?" title="Catalog가 분리한 accuracy terms를 같은 '정밀도' 한 칸으로 합치지 않는다">
      <p>PDF p. 166은 hysteresis loss와 lost motion을 torque–angle loading/unloading trace로 설명합니다. Lost motion은 rated torque의 작은 비율 부근에서 측정하는 source-specific procedure이며 tooth flank free play만이 아니라 elastic and hysteretic behavior를 포함할 수 있습니다. 따라서 zero backlash statement와 모순이 아닙니다.</p>
      <MathFormula display>{raw`\underbrace{\theta_{LM}}_{\text{로스트 모션}}=\left|\underbrace{\theta_{+}(T_{test})}_{\text{양의 방향 접근 각도}}-\underbrace{\theta_{-}(T_{test})}_{\text{음의 방향 접근 각도}}\right|`}</MathFormula>
      <FormulaNote meaning="같은 small test torque에 opposite loading directions로 접근했을 때 angle separation을 나타내는 conceptual measurement equation입니다. Exact Ttest, fixture, curve definition and reported unit는 catalog procedure를 따릅니다. Full-rated-load accuracy, repeatability and transmission error를 이 값으로 대체하지 않습니다." symbols={[[raw`T_{test}`, 'Catalog가 지정한 small reversal test torque'], [raw`\theta_+,\theta_-`, 'Opposite loading paths에서 measured output angles'], [raw`\theta_{LM}`, 'Declared procedure의 lost motion angle']]} />
      <SourceLedger rows={[
        { page: 'p. 166', artifact: 'Zero backlash', use: 'Tooth engagement geometry claim', boundary: '전체 assembled joint의 direction-reversal error 0으로 해석' },
        { page: 'p. 166', artifact: 'Hysteresis loss / lost motion', use: 'Loading/unloading path separation', boundary: 'Full-load static accuracy 또는 repeatability와 합침' },
        { page: 'p. 167', artifact: 'Repeatability', use: '동일 접근 조건의 position scatter', boundary: 'Absolute accuracy나 transmission accuracy 대신 사용' },
        { page: 'p. 167', artifact: 'Transmission accuracy', use: 'Ideal ratio 대비 position-dependent angular deviation', boundary: 'Reversal/dead-zone test와 같은 measurement로 취급' },
      ]} />
    </NlpSection>

    <NlpSection id="bearing-brake-feedback" marker="05" tone="blue" question="Integrated actuator의 reducer torque 이외에 catalog가 별도 표를 둔 이유는 무엇일까?" title="Output bearing, holding brake와 feedback은 서로 다른 load·state interface다">
      <p>Output bearing은 radial force, axial force와 tilting moment를 받습니다. Wave-generator bearing은 high-speed input motion과 reducer internal load를 받습니다. 두 bearing life check와 reducer tooth torque check는 하나로 합칠 수 없습니다. Robot link의 payload position과 contact force를 catalog reference plane으로 환산해야 합니다.</p>
      <p>PDF p. 172는 brake를 holding/fail-safe application에 배치하며 보통 maximum output torque 이상의 holding torque를 권고합니다. 이 문장은 active braking energy를 반복 흡수하라는 뜻이 아닙니다. Exact brake option, motor-side conversion, engagement delay와 vertical-axis handover는 system owner가 증명합니다.</p>
      <MathFormula display>{raw`\underbrace{T_{brake,hold}}_{\text{브레이크 유지 토크}}\ge\underbrace{T_{load,max}}_{\text{최대 정지 부하}}\underbrace{S_{app}}_{\text{적용 조건·여유}}`}</MathFormula>
      <FormulaNote meaning="Catalog의 holding intent를 system selection inequality로 나타냈습니다. Sapp는 이 글이 정하는 universal number가 아니라 actual risk, wear, temperature, mounting and vendor instruction에서 정합니다. Dynamic stopping energy, personal safety certification와 engagement timing은 별도 evidence입니다." symbols={[[raw`T_{brake,hold}`, 'Declared shaft side의 available holding torque [N·m]'], [raw`T_{load,max}`, 'Worst-case static load torque on same side [N·m]'], [raw`S_{app}`, 'Application-specific margin and derating factor']]} />
      <p>PDF p. 173의 motor/output feedback option은 observability architecture를 보여줍니다. Motor encoder는 commutation과 high-bandwidth input state를, output encoder는 actual link angle을 봅니다. 둘의 차이는 transmission deformation을 드러내지만 timestamp, alignment와 stiffness calibration이 필요합니다.</p>
    </NlpSection>

    <NlpSection id="transfer-boundary" marker="06" tone="green" question="Catalog 수치를 robot production claim으로 옮길 때 마지막에 확인할 것은 무엇일까?" title="Average test value, exact revision과 installed-system evidence를 분리한다">
      <p>PDF p. 175는 catalog 값이 여러 시험과 경험에 기반하며 제품별 산포가 있고, 달리 합의하지 않는 한 보증 특성이 아님을 밝힙니다. 모든 값을 일괄 “평균”이라고 부르지는 않습니다. 평균으로 명시된 항목, 예를 들어 p. 167의 torsional stiffness와 일반 시험 기반·비보증 경계를 구분합니다. 이 disclaimer는 작은 글씨의 면책이 아니라 숫자의 통계적·환경적 meaning입니다.</p>
      <p>따라서 selection record에는 source issue, product family, size, ratio, option, mounting, lubricant와 exact row를 남깁니다. Purchased part의 guaranteed properties가 필요하면 datasheet, drawing, certificate and supplier agreement에서 확인합니다. Assembled robot은 다시 duty, stiffness sweep, accuracy, bearing load와 brake handover를 측정합니다.</p>
      <CapabilityCheck items={[
        'Catalog의 torque selection을 stiffness·bearing·duty와 함께 읽는다.',
        'RMS torque와 average speed를 exact source procedure에 맞춰 계산한다.',
        'Piecewise stiffness와 one-inertia resonance 식의 적용 조건을 말한다.',
        'Zero backlash, lost motion, hysteresis, repeatability와 transmission accuracy를 분리한다.',
        'Output bearing과 wave-generator bearing load를 reducer torque와 별도로 검증한다.',
        'Holding brake와 dual feedback option을 system sequence·observability 문제로 연결한다.',
        'Average value와 guaranteed property, 05/2026 issue와 다른 revision을 섞지 않는다.',
      ]} />
      <Takeaway>제조사 자료를 깊게 읽는다는 것은 숫자를 많이 복사하는 일이 아닙니다. 저자가 만든 selection order, test operation, 가정과 disclaimer를 보존해 system evidence에서 닫아야 할 gap을 정확히 찾는 일입니다.</Takeaway>
      <SourceNotes sources={[{ label: 'Harmonic Drive Mechatronics, issue 1053524 05/2026', href: 'https://harmonicdrive.de/fileadmin/Downloads/Produkte/Kataloge/Harmonic_Drive_Mechatronics_EN_1053524.pdf', note: '이 글의 selection, stiffness, accuracy, bearing, brake, feedback와 disclaimer 1차 출처입니다.' }]} />
      <div className="not-prose mt-8 grid gap-3 sm:grid-cols-2"><Link to={articlePath('ai', 'robot-actuator-mechanics-transmission-holding-brake')} className="group rounded-md border border-border p-4 hover:bg-muted/25"><p className="text-xs font-black text-muted-foreground">CONCEPT FOUNDATION</p><p className="mt-2 flex items-center justify-between gap-3 text-sm font-black">Actuator Mechanics로 돌아가기 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></p></Link><Link to={articlePath('ai', 'paper-williamson-series-elastic-actuators-1995')} className="group rounded-md border border-border p-4 hover:bg-muted/25"><p className="text-xs font-black text-muted-foreground">FOUNDATIONAL PAPER</p><p className="mt-2 flex items-center justify-between gap-3 text-sm font-black">Series Elastic Actuator의 의도 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></p></Link></div>
    </NlpSection>
  </>;
}
