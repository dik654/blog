import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  BondDelaminationLab,
  BuildingBlockEvidenceLab,
  CompositeMiniMap,
  CouplingPlyRecoveryLab,
  FibreMatrixAxesLab,
  HoleJointLoadLab,
  HygrothermalStateLab,
  ImpactCaiLab,
  LaminaTransformLab,
  LaminateAbdLab,
  ManufacturingNdeLab,
  PlyFailureEnvelopeLab,
  ProgressiveDamageLab,
} from './robot-composite-structures-joints-damage/viz/CompositeStructureLabs';

const raw=String.raw;

function FormulaBlock({latex,latexCompact,meaning,symbols}:{latex:string;latexCompact?:string;meaning:string;symbols:Array<[string,string]>}){
  return <div className="mb-8"><div className="not-prose min-w-0 rounded-md border border-border p-3 sm:p-4">{latexCompact?<><MathFormula display className="my-0 text-xs lg:hidden">{latexCompact}</MathFormula><MathFormula display className="my-0 hidden text-base lg:block">{latex}</MathFormula></>:<MathFormula display className="my-0 text-xs sm:text-base">{latex}</MathFormula>}</div><FormulaNote meaning={meaning} symbols={symbols}/></div>;
}

function DecisionLedger({rows}:{rows:Array<{label:string;decision:string;kept:string}>}){
  return <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">{rows.map((row,index)=><div key={row.label} className="min-w-0 bg-background p-4"><div className="flex items-start gap-2"><span className="font-mono text-xs font-black text-blue-700/55 dark:text-blue-300/55">{String(index+1).padStart(2,'0')}</span><p className="text-sm font-black leading-snug">{row.label}</p></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">판단:</strong> {row.decision}</p><p className="mt-2 text-xs leading-relaxed"><strong>남길 상태:</strong> {row.kept}</p></div>)}</div>;
}

export default function RobotCompositeStructuresJointsDamageArticle(){
  return <>
    <BeginnerOpening
      title="한 방향으로 강한 재료를 여러 방향으로 쌓는 이유"
      description="탄소섬유 한 가닥은 길이 방향으로 매우 강하지만 옆으로 미는 힘에는 같은 방식으로 버티지 않습니다. 그래서 얇은 층의 방향과 순서를 설계해 로봇 링크가 받을 굽힘, 비틀림과 충격을 나눠 듭니다."
      familiarScene={<>여러 장의 종이를 그냥 포개면 쉽게 미끄러지지만, 풀로 붙이고 방향을 달리해 겹치면 훨씬 단단한 판이 됩니다. 어느 장을 어느 방향으로, 가운데에서 얼마나 멀리 놓았는지가 판 전체의 휘어짐과 파손을 바꿉니다.</>}
      steps={[
        { label: '한 장의 방향을 읽는다', detail: '섬유 방향과 그에 수직인 방향에서 강성과 강도가 왜 다른지 구분합니다.' },
        { label: '쌓은 순서를 계산한다', detail: '각 층의 방향과 높이를 모아 전체 판의 늘어남, 휨과 비틀림을 구합니다.' },
        { label: '구멍과 충격까지 확인한다', detail: '볼트 구멍, 접착부, 층간 박리와 보이지 않는 충격 손상을 시험과 검사로 닫습니다.' },
      ]}
    />
    <QuestionLead question="탄소섬유 복합재를 단지 '가벼운 금속'처럼 한 개의 강도와 탄성값으로 계산하면 가장 먼저 무엇을 잃을까?" answer="힘을 받는 방향과 층의 순서를 잃습니다. 섬유, 섬유 사이 재료, 두 재료의 경계가 서로 다른 일을 하고, 얇은 층을 돌려 쌓는 순간 전체 판의 휨과 손상 경로가 달라집니다. 따라서 한 장의 방향에서 시작해 적층, 연결부와 손상 증거까지 차례로 올라갑니다."/>

    <NlpSection id="material-hierarchy" marker="01" tone="teal" question="왜 carbon fibre의 강도를 link 전체의 강도로 바로 사용할 수 없는가?" title="Fibre·matrix·interface와 material axes부터 선언한다">
      <CompositeMiniMap/>
      <p>Unidirectional lamina의 `1`축은 fibre 방향이고 `2`축은 ply plane의 transverse 방향입니다. Global `x-y`는 link geometry and applied load의 좌표입니다. Analysis input에 ply angle sign, stacking order, thickness origin and engineering shear convention을 함께 남기지 않으면 같은 layup 표기가 다른 tensor를 만들 수 있습니다.</p>
      <ConceptPrimer items={[
        {term:'Composite는 설계된 material system',meaning:'Fibre, matrix, interface, ply angle, stack order and process가 함께 property를 만든다.',why:'Catalog의 carbon/epoxy 이름만으로 link stiffness or strength를 정하지 않기 위해 필요하다.'},
        {term:'Ply state와 laminate state',meaning:'Laminate resultants A/B/D와 각 ply top/bottom material-axis stress는 서로 다른 상태다.',why:'평균이 낮아도 weak ply surface가 먼저 실패하는 경로를 보존하기 위해 필요하다.'},
        {term:'Damage-tolerant evidence',meaning:'Analysis, NDE and coupon-to-component tests가 damage type and part configuration에 연결된 상태다.',why:'하나의 FEA plot or static test가 impact, delamination and lifecycle claims까지 대신하지 않게 한다.'},
      ]}/>
      <FormulaBlock latex={raw`\underbrace{\begin{bmatrix}\varepsilon_1\\\varepsilon_2\\\gamma_{12}\end{bmatrix}}_{\text{재료축 변형률}}=\underbrace{\begin{bmatrix}1/E_1&-\nu_{12}/E_1&0\\-\nu_{21}/E_2&1/E_2&0\\0&0&1/G_{12}\end{bmatrix}}_{\text{직교이방성 유연도}}\underbrace{\begin{bmatrix}\sigma_1\\\sigma_2\\\tau_{12}\end{bmatrix}}_{\text{재료축 응력}}`} latexCompact={raw`\begin{aligned}\underbrace{\varepsilon_1}_{\text{섬유축 변형}}&=\frac{\sigma_1-\nu_{12}\sigma_2}{E_1}\\[2pt]\underbrace{\varepsilon_2}_{\text{횡축 변형}}&=\frac{\sigma_2-\nu_{21}\sigma_1}{E_2}\\[2pt]\underbrace{\gamma_{12}}_{\text{전단 변형}}&=\frac{\tau_{12}}{G_{12}}\end{aligned}`} meaning="Plane-stress orthotropic lamina에서 fibre and transverse normal response와 in-plane shear response를 분리한다. Matrix의 대칭성을 지키려면 두 Poisson ratio를 독립값처럼 넣을 수 없다." symbols={[[raw`E_1,E_2`,'Fibre and transverse Young moduli'],[raw`G_{12}`,'In-plane shear modulus'],[raw`\nu_{12},\nu_{21}`,'Major and minor Poisson ratios'],[raw`\gamma_{12}`,'Engineering shear strain']]}/>
      <FormulaBlock latex={raw`\underbrace{\frac{\nu_{12}}{E_1}=\frac{\nu_{21}}{E_2}}_{\text{상호성 조건}},\qquad \underbrace{\boldsymbol\sigma^{(1,2)}=\mathbf T_\sigma(\theta)\boldsymbol\sigma^{(x,y)}}_{\text{전역 응력을 재료축으로 회전}}`} meaning="Strain energy가 coordinate exchange에 대해 일관되도록 reciprocity를 강제하고, failure data가 정의된 material axes로 global stress를 옮긴다. Stress and engineering-strain transformations는 shear convention 때문에 같은 행렬이 아니다." symbols={[[raw`\mathbf T_\sigma`,'Stress transformation matrix'],[raw`\theta`,'Declared global-to-material ply angle'],[raw`\boldsymbol\sigma^{(x,y)}`,'Global axes stress vector']]}/>
      <FibreMatrixAxesLab/>
      <Misconception>`E1=135 GPa`를 laminate Young modulus로 쓰는 것은 fibre-aligned single-ply response를 구조 property로 승격하는 오류입니다. Fibre volume, angle, stack, damage and boundary conditions가 추가돼야 합니다.</Misconception>
    </NlpSection>

    <NlpSection id="off-axis-lamina" marker="02" tone="blue" question="같은 global tension이 0°, 45°, 90° ply에서 왜 전혀 다른 failure input이 되는가?" title="한 장의 lamina를 회전해 Q̄와 material-axis stress를 만든다">
      <p>먼저 material axes에서 reduced stiffness `Q`를 만들고, ply angle로 변환한 `Qbar`를 global laminate 계산에 씁니다. 반대로 failure evaluation에서는 global ply stress를 다시 material axes로 돌립니다. 이 양방향 transform의 angle and shear convention이 일치해야 합니다.</p>
      <FormulaBlock latex={raw`\underbrace{\begin{bmatrix}\sigma_1\\\sigma_2\\\tau_{12}\end{bmatrix}}_{\text{회전 뒤 재료축 응력}}=\underbrace{\begin{bmatrix}m^2&n^2&2mn\\n^2&m^2&-2mn\\-mn&mn&m^2-n^2\end{bmatrix}}_{\text{응력 변환}}\underbrace{\begin{bmatrix}\sigma_x\\\sigma_y\\\tau_{xy}\end{bmatrix}}_{\text{전역 하중 상태}}`} latexCompact={raw`\begin{aligned}\underbrace{\sigma_1}_{\text{섬유축 응력}}&=m^2\sigma_x+n^2\sigma_y+2mn\tau_{xy}\\[2pt]\underbrace{\sigma_2}_{\text{횡축 응력}}&=n^2\sigma_x+m^2\sigma_y-2mn\tau_{xy}\\[2pt]\underbrace{\tau_{12}}_{\text{재료축 전단}}&=-mn\sigma_x+mn\sigma_y+(m^2-n^2)\tau_{xy}\end{aligned}`} meaning="Global normal stress도 off-axis material frame에서는 longitudinal, transverse and shear components로 나뉜다. 45-degree ply가 axial load 아래 큰 tau12를 보는 이유가 이 좌표 변환이다." symbols={[[raw`m,n`,'cos(theta), sin(theta)'],[raw`\sigma_1,\sigma_2`,'Material-axis normal stresses'],[raw`\tau_{12}`,'Material-axis shear stress']]}/>
      <FormulaBlock latex={raw`\underbrace{\bar{\mathbf Q}(\theta)}_{\text{전역축 ply 강성}}=\underbrace{\mathbf T_\sigma^{-1}(\theta)}_{\text{응력축 복원}}\underbrace{\mathbf Q}_{\text{재료축 reduced stiffness}}\underbrace{\mathbf T_\varepsilon(\theta)}_{\text{변형률축 회전}}`} meaning="Constitutive relation의 입력과 출력을 서로 맞는 tensor transformation으로 회전한다. Engineering shear 때문에 T_sigma and T_epsilon를 무심코 같게 두면 Qbar coupling terms가 틀어진다." symbols={[[raw`\mathbf Q`,'Plane-stress material-axis reduced stiffness'],[raw`\bar{\mathbf Q}`,'Global axes transformed reduced stiffness'],[raw`\mathbf T_\varepsilon`,'Engineering-strain transformation']]}/>
      <LaminaTransformLab/>
      <Takeaway>Off-axis ply는 약해진 0-degree ply가 아닙니다. Global load를 다른 normal/shear mixture로 바꾸는 새로운 constitutive component입니다.</Takeaway>
    </NlpSection>

    <NlpSection id="laminate-abd" marker="03" tone="violet" question="같은 ply inventory를 순서만 바꾸면 왜 link가 휘거나 비틀리는가?" title="Ply z-order를 적분해 A·B·D를 만든다">
      <p>Laminate mid-plane에서 각 ply boundary `z_k`를 아래에서 위로 선언합니다. `A`는 membrane stiffness, `D`는 bending stiffness, `B`는 membrane-bending coupling입니다. Symmetric layup이면 `B=0`이지만 balanced라는 말만으로 B가 사라지지는 않습니다. Quasi-isotropic도 in-plane effective symmetry에 관한 별도 조건입니다.</p>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{\mathbf A}_{\text{면내 강성}}&=\underbrace{\sum_{k=1}^{N}\bar{\mathbf Q}^{(k)}(z_k-z_{k-1})}_{\text{ply 두께 적분}}\\[2pt]\underbrace{\mathbf B}_{\text{면내-굽힘 결합}}&=\underbrace{\frac12\sum_{k=1}^{N}\bar{\mathbf Q}^{(k)}(z_k^2-z_{k-1}^2)}_{\text{중립면 부호를 가진 적분}}\\[2pt]\underbrace{\mathbf D}_{\text{굽힘 강성}}&=\underbrace{\frac13\sum_{k=1}^{N}\bar{\mathbf Q}^{(k)}(z_k^3-z_{k-1}^3)}_{\text{바깥 ply를 크게 가중}}
\end{aligned}`} meaning="같은 ply라도 mid-plane에서 멀수록 bending stiffness contribution이 빠르게 커진다. B의 signed z integration은 mirrored stack에서 상쇄되고 unsymmetric stack에서 남는다." symbols={[[raw`z_k`,'Ply k upper boundary from the declared mid-plane'],[raw`N`,'Number of plies'],[raw`\bar{\mathbf Q}^{(k)}`,'Ply k transformed stiffness']]}/>
      <FormulaBlock latex={raw`\underbrace{\begin{bmatrix}\mathbf N\\\mathbf M\end{bmatrix}}_{\text{면내력과 모멘트}}=\underbrace{\begin{bmatrix}\mathbf A&\mathbf B\\\mathbf B&\mathbf D\end{bmatrix}}_{\text{적층판 강성}}\underbrace{\begin{bmatrix}\boldsymbol\varepsilon^0\\\boldsymbol\kappa\end{bmatrix}}_{\text{중립면 변형률과 곡률}}`} meaning="Applied membrane and moment resultants를 mid-plane strain and curvature에 연결한다. Nonzero B이면 pure membrane load에서도 curvature가, pure moment에서도 mid-plane strain이 생길 수 있다." symbols={[[raw`\mathbf N,\mathbf M`,'Force and moment resultants per unit width'],[raw`\boldsymbol\varepsilon^0`,'Mid-plane engineering strain vector'],[raw`\boldsymbol\kappa`,'Curvature/twist vector']]}/>
      <LaminateAbdLab/>
      <Misconception>“[0/45/-45/90]이 있으니 quasi-isotropic”은 ply percentage, symmetry, repeats and constitutive terms를 확인하지 않은 이름 붙이기입니다. Symmetric, balanced and quasi-isotropic은 서로 대체어가 아닙니다.</Misconception>
    </NlpSection>

    <NlpSection id="coupling-ply-recovery" marker="04" tone="amber" question="Laminate average stress가 낮아도 어느 ply의 어느 면이 먼저 위험해지는가?" title="중립면 solution을 ply top/bottom state로 되돌린다">
      <p>ABD solution은 구조 resultants를 설명하지만 strength data는 보통 ply material axes에 있습니다. 각 `z`에서 total strain을 구하고 thermal/moisture free strain을 빼며, Qbar로 global stress를 만든 뒤 material axes로 회전합니다. Ply interface에서 strain은 연속일 수 있어도 stress는 stiffness가 바뀌므로 점프합니다.</p>
      <FormulaBlock latex={raw`\underbrace{\boldsymbol\varepsilon^{(k)}(z)}_{\text{ply k의 전체 변형률}}=\underbrace{\boldsymbol\varepsilon^0}_{\text{중립면 변형률}}+\underbrace{z\boldsymbol\kappa}_{\text{두께 위치의 굽힘 기여}}`} meaning="Classical laminate kinematics는 in-plane strain이 thickness에서 선형으로 변한다고 둔다. 그래서 같은 ply도 top and bottom faces에서 다른 stress와 failure index를 가질 수 있다." symbols={[[raw`z`,'Signed distance from laminate mid-plane'],[raw`\boldsymbol\kappa`,'Bending and twisting curvature'],[raw`k`,'Ply identity and material orientation']]}/>
      <FormulaBlock latex={raw`\underbrace{\boldsymbol\sigma_{xy}^{(k)}(z)}_{\text{전역축 ply 응력}}=\underbrace{\bar{\mathbf Q}^{(k)}}_{\text{회전된 ply 강성}}\left[\underbrace{\boldsymbol\varepsilon^0+z\boldsymbol\kappa}_{\text{구속된 전체 변형}}-\underbrace{\boldsymbol\varepsilon_{T,M}^{(k)}}_{\text{열·수분 자유 변형}}\right]`} meaning="Mechanical stress는 total constrained strain에서 ply가 자유롭게 늘고 싶어 하는 thermal/moisture strain을 뺀 결과다. Failure criterion 전에는 이 stress를 material 1-2 axes로 다시 회전한다." symbols={[[raw`\boldsymbol\varepsilon_{T,M}^{(k)}`,'Ply thermal plus moisture free strain'],[raw`\boldsymbol\sigma_{xy}^{(k)}`,'Global ply stress at a named z face'],[raw`\bar{\mathbf Q}^{(k)}`,'Ply-specific Qbar']]}/>
      <CouplingPlyRecoveryLab/>
      <Takeaway>Composite result는 `max ply stress` 한 줄이 아니라 ply ID, top/bottom, axes, load case, environment and layup revision을 가진 state입니다.</Takeaway>
    </NlpSection>

    <NlpSection id="hygrothermal" marker="05" tone="teal" question="외력이 0인데 cure 뒤 link가 휘고 ply stress가 남는 이유는 무엇인가?" title="온도·수분을 free strain과 property state로 넣는다">
      <p>각 ply는 fibre and transverse 방향의 thermal and moisture expansion이 다릅니다. Bonded stack은 서로 자유롭게 변형하지 못하므로 effective thermal forces/moments and residual stress가 생깁니다. 동시에 moisture and temperature는 matrix-dominated stiffness, strength and interface toughness 자체를 낮출 수 있습니다.</p>
      <FormulaBlock latex={raw`\underbrace{\boldsymbol\varepsilon_{T,M}^{(k)}}_{\text{ply 자유 변형}}=\underbrace{\bar{\boldsymbol\alpha}^{(k)}\Delta T}_{\text{온도 변화 기여}}+\underbrace{\bar{\boldsymbol\beta}^{(k)}\Delta C}_{\text{수분 변화 기여}}`} meaning="Ply angle로 회전한 thermal expansion alpha and moisture expansion beta가 service change에 만드는 stress-free strain이다. Bonding constraint가 이 free strain의 차이를 stress로 바꾼다." symbols={[[raw`\Delta T`,'Service temperature minus stress-free/cure reference'],[raw`\Delta C`,'Moisture concentration change'],[raw`\bar{\boldsymbol\alpha},\bar{\boldsymbol\beta}`,'Global axes expansion vectors']]}/>
      <FormulaBlock latex={raw`\underbrace{\begin{bmatrix}\mathbf N^{T,M}\\\mathbf M^{T,M}\end{bmatrix}}_{\text{열·수분 등가 하중}}=\underbrace{\sum_{k=1}^{N}\int_{z_{k-1}}^{z_k}\begin{bmatrix}1\\z\end{bmatrix}\bar{\mathbf Q}^{(k)}\boldsymbol\varepsilon_{T,M}^{(k)}\,dz}_{\text{ply 자유 변형을 두께 방향 적분}}`} meaning="Stacking sequence and z-position이 thermal/moisture mismatch를 in-plane resultant and warping moment로 바꾼다. Symmetric material/layup이면 일부 moment가 상쇄될 수 있지만 property knockdown은 별도다." symbols={[[raw`\mathbf N^{T,M}`,'Equivalent in-plane thermal/moisture resultant'],[raw`\mathbf M^{T,M}`,'Equivalent thermal/moisture moment'],[raw`z`,'Thickness coordinate retaining stack order']]}/>
      <HygrothermalStateLab/>
      <Misconception>Room-temperature dry coupon가 충분하다는 판단은 environment를 단순 load factor로 보는 오류입니다. Environment는 free strain, material properties, damage growth and inspection response를 서로 다르게 바꿉니다.</Misconception>
    </NlpSection>

    <NlpSection id="ply-failure" marker="06" tone="blue" question="여러 stress component가 함께 있을 때 first-ply failure를 어떻게 screen할까?" title="Failure criterion의 계산과 모드 정보를 분리한다">
      <p>Maximum stress는 각 component를 개별 allowable와 비교해 해석이 쉽지만 interaction을 보지 않습니다. Tsai-Hill/Tsai-Wu 같은 quadratic surface는 multiaxial interaction을 표현하지만 scalar failure index만으로 fibre break, matrix crack or shear mode를 식별하지 못합니다. Criterion choice는 available test data and decision need에 맞아야 합니다.</p>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{FI_{TW}}_{\text{상호작용 파손 지수}}&=\underbrace{F_1\sigma_1+F_2\sigma_2}_{\text{인장·압축 비대칭}}\\[-1pt]&\quad+\underbrace{F_{11}\sigma_1^2+F_{22}\sigma_2^2+F_{66}\tau_{12}^2}_{\text{성분별 이차 기여}}\\[-1pt]&\quad+\underbrace{2F_{12}\sigma_1\sigma_2}_{\text{이축 상호작용}}\end{aligned}`} meaning="Tsai-Wu tensor-polynomial surface의 plane-stress form이다. Linear terms distinguish tension/compression strength, quadratic terms bound the surface, and F12 needs biaxial interaction evidence or an explicit assumption." symbols={[[raw`F_i,F_{ij}`,'Strength-tensor coefficients derived from tests/assumptions'],[raw`FI_{TW}`,'Criterion onset index; one is the declared surface'],[raw`F_{12}`,'Normal-stress interaction coefficient']]}/>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{F_1}_{\text{1축 비대칭}}&=\underbrace{\frac1{X_T}-\frac1{X_C}}_{\text{인장·압축 강도 차이}},&\underbrace{F_{11}}_{\text{1축 곡률}}&=\underbrace{\frac1{X_TX_C}}_{\text{양쪽 경계 고정}}\\[2pt]\underbrace{F_2}_{\text{2축 비대칭}}&=\underbrace{\frac1{Y_T}-\frac1{Y_C}}_{\text{횡방향 강도 차이}},&\underbrace{F_{66}}_{\text{전단 경계}}&=\underbrace{\frac1{S^2}}_{\text{순수 전단 강도}}
\end{aligned}`} meaning="단축 인장·압축과 순수 전단 강도로 대부분의 계수는 정할 수 있지만 F12는 정해지지 않는다. 편의상 넣은 기본 상호작용 항 하나가 다축 파손 경계의 모양을 크게 바꿀 수 있으므로, 이축 시험 근거나 명시적 가정이 필요하다." symbols={[[raw`X_T,X_C`,'Longitudinal tensile and compressive strengths'],[raw`Y_T,Y_C`,'Transverse tensile and compressive strengths'],[raw`S`,'In-plane shear strength']]}/>
      <PlyFailureEnvelopeLab/>
      <Takeaway>`FI=0.82`라는 숫자에는 criterion, coefficient source, ply face, material axes, environment and load case가 붙어야 합니다. 그렇지 않으면 재현 가능한 safety statement가 아닙니다.</Takeaway>
    </NlpSection>

    <NlpSection id="progressive-damage" marker="07" tone="violet" question="한 ply가 실패한 뒤 laminate가 즉시 끝나지 않는다면 다음 상태는 어떻게 계산하는가?" title="First-ply failure와 ultimate collapse 사이의 모델 책임을 드러낸다">
      <p>Initial matrix crack은 load redistribution을 일으키고 adjacent plies, free edges and interfaces의 driving force를 바꿉니다. Progressive damage model은 failed mode에 따라 selected stiffness를 낮추고 equilibrium을 다시 풀지만, degradation magnitude and localization rule은 물리 법칙 하나로 정해지지 않습니다.</p>
      <FormulaBlock latex={raw`\underbrace{\mathbf Q_{d}^{(k)}}_{\text{손상 뒤 ply 강성}}=\underbrace{\mathbf D^{(k)}(d_f,d_m,d_s)}_{\text{모드별 저하 연산자}}\underbrace{\mathbf Q_0^{(k)}}_{\text{손상 전 강성}}`} meaning="Fibre, matrix and shear damage variables가 different stiffness channels를 degrade하도록 만드는 generic state update다. D operator form and parameters require material/model calibration; it is not supplied by FI alone." symbols={[[raw`d_f,d_m,d_s`,'Fibre, matrix and shear damage variables'],[raw`\mathbf Q_0`,'Undamaged ply reduced stiffness'],[raw`\mathbf Q_d`,'Damaged tangent/secant stiffness by the chosen model']]}/>
      <FormulaBlock latex={raw`\underbrace{\mathcal G_f}_{\text{요소당 소산 에너지}}=\underbrace{\int_0^{\delta_f} t(\delta)\,d\delta}_{\text{연화 traction의 면적}},\qquad \underbrace{\mathcal G_f}_{\text{재료 파괴에너지}}\;\not\propto\;\underbrace{h_e}_{\text{요소 크기}}`} meaning="Softening damage가 mesh refinement만으로 더 적은 에너지를 소산하지 않도록 fracture-energy regularization을 확인하는 audit relation이다. Characteristic length and localization formulation을 숨기면 ultimate prediction이 mesh에 따라 이동한다." symbols={[[raw`t(\delta)`,'Traction or stress during softening'],[raw`\delta_f`,'Complete-failure separation/strain measure'],[raw`h_e`,'Element characteristic length']]}/>
      <ProgressiveDamageLab/>
      <Misconception>모델에서 여러 ply가 차례로 빨갛게 바뀌었다는 사실은 progressive failure가 검증됐다는 증거가 아닙니다. Mode sequence, dissipated energy, mesh convergence and representative tests가 함께 맞아야 합니다.</Misconception>
    </NlpSection>

    <NlpSection id="joints-holes" marker="08" tone="amber" question="왜 composite link는 uniform tube보다 hole·insert·ply drop에서 먼저 판단이 깨지는가?" title="Load introduction을 mechanical and bonded joint failure paths로 푼다">
      <p>Open hole and fastener는 fibres를 끊고 bearing contact, bypass tension and through-thickness clamp를 동시에 만듭니다. Metallic insert는 thermal mismatch and galvanic isolation까지 추가합니다. Average section stress 하나는 bearing, net tension, shear-out, pull-through and local delamination 중 어느 것도 충분히 대표하지 못합니다.</p>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{\sigma_{br}}_{\text{구멍 베어링 응력}}&=\underbrace{\frac{P_{br}}{dt}}_{\text{체결 하중을 투영 면적으로 나눔}}\\[2pt]\underbrace{\sigma_{net}}_{\text{순단면 응력}}&=\underbrace{\frac{P_{by}}{(w-d)t}}_{\text{구멍을 뺀 인장 경로}}\end{aligned}`} meaning="Bearing transfer and bypass/net-section load는 서로 다른 paths and allowables를 사용한다. Multi-fastener joint에서는 Pbr/Pby split도 fastener stiffness, clearance, clamp and laminate response에서 구해야 한다." symbols={[[raw`P_{br}`,'Load transferred by bearing at the hole'],[raw`P_{by}`,'Load bypassing the selected hole'],[raw`d,t,w`,'Hole diameter, laminate thickness and width']]}/>
      <FormulaBlock latex={raw`\underbrace{\eta_{joint}}_{\text{다중 모드 joint 화면}}=\max\!\left(\underbrace{\frac{\sigma_{br}}{F_{br}}}_{\text{베어링}},\underbrace{\frac{\sigma_{net}}{F_{nt}}}_{\text{순단면}},\underbrace{\frac{\tau_{so}}{F_{so}}}_{\text{전단 파단}},\underbrace{\frac{q_{pt}}{F_{pt}}}_{\text{관통 인발}}\right)`} meaning="Competing joint failure ratios를 한 ledger에 모으는 screening definition이다. It is not a universal interaction criterion; each mode needs geometry/environment-specific allowable and any interaction must be validated separately." symbols={[[raw`F_{br},F_{nt},F_{so},F_{pt}`,'Mode-specific design allowables'],[raw`\tau_{so}`,'Shear-out path stress'],[raw`q_{pt}`,'Through-thickness pull-through demand']]}/>
      <HoleJointLoadLab/>
      <Takeaway>Joint를 stronger laminate로만 고치면 다른 mode가 지배할 수 있습니다. Load introduction geometry, clamp retention, edge distance, insert taper, isolation and inspectability를 함께 설계해야 합니다.</Takeaway>
    </NlpSection>

    <NlpSection id="delamination" marker="09" tone="green" question="CLT ply stress가 통과했는데 bond edge or free edge가 박리되는 이유는 무엇인가?" title="Through-thickness stress와 mixed-mode delamination을 별도 모델로 넘긴다">
      <p>Classical laminate theory는 plane stress and equivalent single-layer kinematics로 in-plane response를 잘 설명하지만 free edge, ply drop, curved bend and bond end의 transverse normal/shear singularity를 직접 해결하지 않습니다. Existing delamination에는 VCCT로 energy release rate를 구할 수 있고, initiation/progression에는 cohesive-zone model을 쓸 수 있지만 crack path, mesh and interface data가 필요합니다.</p>
      <FormulaBlock latex={raw`\underbrace{G}_{\text{총 박리 구동력}}=\underbrace{G_I}_{\text{열림 모드}}+\underbrace{G_{II}}_{\text{면내 미끄럼}}+\underbrace{G_{III}}_{\text{면외 찢김}}`} meaning="Delamination front의 released energy를 opening, sliding and tearing modes로 분해한다. Interface oscillatory/singularity and element formulation에 따라 individual mode partition은 민감할 수 있어 total G and convergence도 함께 본다." symbols={[[raw`G_I,G_{II},G_{III}`,'Mode-separated strain-energy release rates'],[raw`G`,'Total interface crack driving force']]}/>
      <FormulaBlock latex={raw`\underbrace{\left(\frac{G_I}{G_{Ic}}\right)^p+\left(\frac{G_{II}}{G_{IIc}}\right)^q+\left(\frac{G_{III}}{G_{IIIc}}\right)^r}_{\text{혼합 모드 전파 지수}}\ge\underbrace{1}_{\text{선택한 전파 경계}}`} meaning="각 순수 모드에서 측정한 파괴인성과 적합한 상호작용 지수로 하나의 혼합 모드 전파 경계를 만든다. 표면 처리, 접착제, 섬유 가교, 온도, 균열 성장 저항에 따라 값이 달라질 수 있으므로 부품 구성과 함께 관리해야 한다." symbols={[[raw`G_{Ic},G_{IIc},G_{IIIc}`,'Critical energy release rates by mode'],[raw`p,q,r`,'Mixed-mode fit exponents'],[raw`1`,'Propagation boundary of the selected empirical law']]}/>
      <BondDelaminationLab/>
      <Misconception>CZM contour가 매끄럽다는 사실은 delamination initiation이 정확하다는 뜻이 아닙니다. NASA handbook도 initiation can be mesh-sensitive and recommends extensive experimental validation; progression path and arrest claims도 component context를 요구합니다.</Misconception>
    </NlpSection>

    <NlpSection id="impact-cai" marker="10" tone="blue" question="표면 dent가 거의 보이지 않는데 compression residual strength는 왜 크게 떨어질 수 있는가?" title="Impact threat, hidden delamination and CAI를 분리한다">
      <p>Low-velocity impact는 matrix cracks and interlaminar delaminations를 thickness 여러 곳에 만들 수 있습니다. Surface indentation은 damage의 한 observable일 뿐 내부 projected area, ply interfaces and local fibre instability를 모두 bound하지 않습니다. Compression에서는 delaminated sublaminates가 locally buckle하며 residual strength가 급감할 수 있습니다.</p>
      <FormulaBlock latex={raw`\underbrace{E_{imp}}_{\text{충돌 직전 에너지}}=\underbrace{\frac12mv^2}_{\text{병진 운동}}+\underbrace{mgh}_{\text{낙하 위치에너지}}`} meaning="Impact severity의 first ledger지만 damage state를 단독 결정하지 않는다. Impactor radius, boundary support, location, laminate thickness/layup, contact duration and environment가 같은 energy의 partition을 바꾼다." symbols={[[raw`m,v,h`,'Impactor mass, velocity and drop height'],[raw`g`,'Gravity'],[raw`E_{imp}`,'Available incident energy before contact losses']]}/>
      <FormulaBlock latex={raw`\underbrace{K_{CAI}}_{\text{충격 후 압축 강도 비}}=\underbrace{\frac{\sigma_{CAI}(D,E,S)}{\sigma_{C0}}}_{\text{손상·환경·지지 조건의 잔류 강도}}`} meaning="Undamaged compressive strength sigma_C0와 impact-damaged compression strength를 구분하는 normalized state. Damage descriptor D must include more than dent depth; environment E and support/geometry S remain part of transfer." symbols={[[raw`\sigma_{CAI}`,'Measured/predicted compression-after-impact strength'],[raw`\sigma_{C0}`,'Undamaged conditioned compression baseline'],[raw`D,E,S`,'Damage, environment and structural support states']]}/>
      <ImpactCaiLab/>
      <Takeaway>BVID는 “보이지 않으니 작은 damage”가 아니라 chosen visual procedure의 detection threshold 근처라는 뜻입니다. Damage tolerance는 threat, protection/detection and residual strength를 함께 정합니다.</Takeaway>
    </NlpSection>

    <NlpSection id="manufacturing-nde" marker="11" tone="amber" question="도면 layup과 실제 cured link 사이의 차이를 어떻게 screening and traceability state로 바꾸는가?" title="Manufacturing defects와 NDE access를 residual threat에 연결한다">
      <p>Composite flaw는 crack 하나가 아닙니다. Fibre waviness, wrinkle, porosity, void, foreign object, ply gap/overlap, disbond, cure and surface preparation이 서로 다른 failure mode and NDE response를 가집니다. NASA-STD-5019A는 composites에 metallic 90/95 standard methods가 일반적으로 없는 현실을 인정하고, representative test damage and documented rationale를 요구합니다.</p>
      <FormulaBlock latex={raw`\underbrace{\mathcal D_{res}}_{\text{남은 위협 집합}}=\underbrace{\mathcal D_{credible}}_{\text{수명 중 가능한 결함}}\setminus\underbrace{\left(\mathcal D_{NDE}\cup\mathcal D_{protect}\cup\mathcal D_{accepted}\right)}_{\text{검사·보호·명시적 위험수용으로 닫힌 집합}}`} meaning="Residual Threat Determination을 set ledger로 표현한 article-level contract다. Uninspectable or weakly detectable flaw는 자동 제거되지 않으며 representative damage in analysis/test or redesign으로 남는다." symbols={[[raw`\mathcal D_{credible}`,'Manufacturing, handling and service credible damage states'],[raw`\mathcal D_{NDE}`,'Qualified inspection-screened states'],[raw`\mathcal D_{protect}`,'Credibly prevented/detected impact threats'],[raw`\mathcal D_{accepted}`,'Explicitly documented risk acceptance']]}/>
      <FormulaBlock latex={raw`\underbrace{a_{RTD}(t,o,x)}_{\text{대표 시험 결함}}\;\ge\;\underbrace{a_{remain}(t,o,x)}_{\text{방법·방향·접근 뒤 남는 결함}}`} meaning="대표 시험 결함은 같은 결함 종류 t, 방향 o, 구조 위치와 검사 접근성 x에서 실제로 남을 수 있는 결함 크기를 포괄해야 한다. 평판 쿠폰의 반사체가 곡면 인서트 접착선이나 가려진 가장자리 검사를 자동으로 대표하지는 않는다." symbols={[[raw`t,o,x`,'Flaw type, orientation and location/access state'],[raw`a_{RTD}`,'Induced representative damage dimensions'],[raw`a_{remain}`,'Residual threat after actual process and NDE']]}/>
      <ManufacturingNdeLab/>
      <Misconception>Proof test 통과는 모든 hidden flaw를 screen했다는 뜻이 아닙니다. Shear/compression-dominated delamination may grow, service environment/load path may differ, and proof itself can introduce damage; pre/post NDE and pre-flawed representative evidence가 필요합니다.</Misconception>
    </NlpSection>

    <NlpSection id="building-block" marker="12" tone="teal" question="Green laminate analysis를 production composite link release evidence로 어떻게 바꾸는가?" title="Building Block Approach와 living configuration ledger로 닫는다">
      <p>Coupon은 material/process allowables를, element는 hole/bond/impact detail을, subcomponent는 interacting load paths and environment를, component는 full boundary and function을 검증합니다. 단계가 올라갈수록 lower-level variability가 사라지는 것이 아니라 analysis가 실제 failure modes를 얼마나 잘 예측하는지 다시 교정합니다.</p>
      <DecisionLedger rows={[
        {label:'Material/process',decision:'어느 batch, prepreg out-time, cure, fibre angle and thickness인가?',kept:'Lot/process genealogy and conditioned allowables'},
        {label:'Analysis state',decision:'어느 axes, layup revision, mesh/model and degradation law인가?',kept:'ABD, ply/detail state, model version and sensitivity'},
        {label:'Damage state',decision:'어떤 manufacturing, impact, bond and repair flaw를 가정/관찰했는가?',kept:'DTA, RTD, NDE method/access and part map'},
        {label:'Evidence state',decision:'어느 scale test가 어떤 claim and failure mode를 닫았는가?',kept:'Coupon-to-component correlation and unresolved anomalies'},
      ]}/>
      <FormulaBlock latex={raw`\underbrace{e_q}_{\text{관측량 q의 정규화 차이}}=\underbrace{\frac{q_{model}-q_{test}}{u_{model}+u_{test}}}_{\text{모델·시험 불확실성으로 나눈 잔차}}`} meaning="Stiffness, strain, onset load or damage area의 model-test mismatch를 percent 하나로 숨기지 않는 diagnostic이다. Large residual points to material, geometry, boundary or damage-model revision; universal pass threshold는 아니다." symbols={[[raw`q_{model},q_{test}`,'Same-state prediction and measurement'],[raw`u_{model},u_{test}`,'Declared modeling and measurement uncertainty scales'],[raw`e_q`,'Dimensionless correlation residual']]}/>
      <FormulaBlock latex={raw`\underbrace{\mathcal C_{part}}_{\text{재현 가능한 복합재 부품 상태}}=\underbrace{\{ID,M,P,L,D,I,R,V\}}_{\text{재료·공정·적층·손상·검사·수리·버전}}`} meaning="Release decision을 serial/configuration ID, material, process, layup, damage, inspection, repair and model/evidence version에 묶는 traceability contract다. Repair or supplier/process change creates a new transfer question." symbols={[[raw`M,P,L`,'Material lot, manufacturing process and layup'],[raw`D,I,R`,'Damage, inspection and repair history'],[raw`V`,'Analysis, software, drawing and evidence revision']]}/>
      <BuildingBlockEvidenceLab/>
      <CapabilityCheck items={[
        'Material 1-2 axes, global x-y axes and engineering shear convention을 고정해 Q and Qbar를 계산한다.',
        'Ply z-order에서 A/B/D를 만들고 symmetric, balanced and quasi-isotropic conditions를 구분한다.',
        'Mid-plane strain/curvature에서 ply top/bottom material-axis stress and hygrothermal residual state를 복원한다.',
        'Maximum stress and Tsai-Wu outputs를 first-ply onset, mode evidence and progressive-damage claims와 분리한다.',
        'Hole, fastener, bond edge, insert and ply drop의 competing load/failure paths를 계산 ledger에 둔다.',
        'CLT가 transverse stress/delamination을 보지 못하는 지점과 VCCT/CZM의 data/mesh boundary를 설명한다.',
        'Impact dent, hidden delamination, CAI, NDE access and residual threat를 하나의 damage state로 연결한다.',
        'Coupon, element, subcomponent and component evidence를 part/process/repair configuration에 묶는다.',
      ]}/>
      <div className="not-prose my-8 grid gap-3 sm:grid-cols-2"><Link className="group rounded-md border border-border p-4 transition-colors hover:border-blue-500/50" to={articlePath('ai','paper-tsai-strength-characteristics-composites-1965')}><span className="text-xs font-black text-blue-700 dark:text-blue-300">FOUNDATIONAL SOURCE</span><p className="mt-2 text-sm font-black">Tsai NASA CR-224 (1965) 재구성</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Anisotropic strength, A/B/D thermal interaction and cross/angle-ply evidence를 읽는다.</p><ArrowRight className="mt-4 h-4 w-4 transition-transform group-hover:translate-x-1"/></Link><Link className="group rounded-md border border-border p-4 transition-colors hover:border-teal-500/50" to={articlePath('ai','reference-nasa-composite-fracture-control-handbook-2024')}><span className="text-xs font-black text-teal-700 dark:text-teal-300">CURRENT GUIDANCE</span><p className="mt-2 text-sm font-black">NASA-HDBK-5010 Rev A 재구성</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">BBA, impact, NDE, delamination and test-verified analysis boundaries를 읽는다.</p><ArrowRight className="mt-4 h-4 w-4 transition-transform group-hover:translate-x-1"/></Link></div>
      <SourceNotes sources={[
        {label:'Tsai, Strength Characteristics of Composite Materials, NASA CR-224 (1965)',href:'https://ntrs.nasa.gov/citations/19650012040',note:'Anisotropic/laminate mechanics, thermal interaction, strength method and glass-epoxy experiments의 accessible foundational report.'},
        {label:'Tsai & Wu, A General Theory of Strength for Anisotropic Materials (1971)',href:'https://doi.org/10.1177/002199837100500106',note:'Tensor-polynomial strength surface and interaction lineage. Scalar index의 damage-mode boundary를 함께 표시했다.'},
        {label:'NASA-HDBK-5010 Volume 1 Revision A (2023)',href:'https://standards.nasa.gov/node/7574',note:'Fracture-control implementation guidance, composite BBA, NDE, proof and traceability.'},
        {label:'NASA-HDBK-5010 Volume 2 Revision A (2024)',href:'https://standards.nasa.gov/standard/NASA/NASA-HDBK-5010-VOLUME_2',note:'Composite examples, impact damage, delamination, VCCT/CZM and bonded-joint guidance.'},
        {label:'NASA-STD-5019A w/Change 4',href:'https://standards.nasa.gov/standard/nasa/nasa-std-5019',note:'Revalidated 2025-09-05. Composite BBA, DTA/IDMP/RTD, environment, NDE and configuration requirements의 current boundary.'},
      ]}/>
      <Takeaway>복합재 설계의 핵심은 높은 fibre strength가 아니라 direction, stack, process and damage를 끝까지 잃지 않는 것입니다. `ABD 통과 → FI 통과`는 시작일 뿐이며 joint, delamination, impact, inspection and building-block evidence가 같은 part state에서 닫혀야 합니다.</Takeaway>
    </NlpSection>
  </>;
}
