import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  ContactInventoryLab,
  ContactKinematicsLab,
  FilmRegimeMapLab,
  FrictionThermalLoopLab,
  GreaseStarvationLab,
  HertzContactLab,
  LifeWearDamageLab,
  MinimumFilmLambdaLab,
  RoughnessRunningInLab,
  SealContaminationLab,
  TribologyEvidenceLab,
  TribologyMiniMap,
  ViscosityStateLab,
} from './robot-contact-tribology-lubrication-wear/viz/TribologyLabs';

const raw=String.raw;

function FormulaBlock({latex,meaning,symbols}:{latex:string;meaning:string;symbols:Array<[string,string]>}){
  return <div className="mb-8"><div className="not-prose min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols}/></div>;
}

function DecisionLedger({rows}:{rows:Array<{label:string;decision:string;kept:string}>}){
  return <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">{rows.map((row,index)=><div key={row.label} className="min-w-0 bg-background p-4"><div className="flex items-start gap-2"><span className="font-mono text-xs font-black text-blue-700/55 dark:text-blue-300/55">{String(index+1).padStart(2,'0')}</span><p className="text-sm font-black leading-snug">{row.label}</p></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">판단:</strong> {row.decision}</p><p className="mt-2 text-xs leading-relaxed"><strong>남길 상태:</strong> {row.kept}</p></div>)}</div>;
}

export default function RobotContactTribologyLubricationWearArticle(){
  return <>
    <BeginnerOpening
      title="닿아 움직이는 두 표면 사이에서는 무슨 일이 생길까?"
      description="기어 이빨, 베어링 구슬과 고무 씰은 모두 다른 방식으로 맞닿습니다. 눈에 보이는 면적은 넓어도 실제 힘은 미세한 돌기와 아주 얇은 기름막에 몰립니다. 그래서 마찰과 마모는 재료 하나가 아니라 접촉 모양, 속도, 온도와 윤활 상태가 함께 만드는 결과입니다."
      familiarScene={<>마른 손으로 유리컵을 밀 때와 물이나 기름이 묻은 손으로 밀 때 느낌이 다릅니다. 같은 두 물체라도 표면 사이에 무엇이 있고 얼마나 빠르게 움직이는지에 따라 미끄러움과 열이 달라집니다.</>}
      steps={[
        { label: '무엇이 닿는지 나눈다', detail: '기어, 베어링과 씰마다 맞닿는 물체, 힘, 곡률과 운동을 따로 적습니다.' },
        { label: '압력과 기름막을 계산한다', detail: '작은 접촉부의 압력, 표면 거칠기와 윤활막 두께를 같은 단위로 비교합니다.' },
        { label: '시간에 따른 변화를 추적한다', detail: '열, 점도, 오염, 마모 조각과 틈새 변화가 다음 운전을 어떻게 바꾸는지 확인합니다.' },
      ]}
    />
    <QuestionLead question="로봇 관절의 회전력 하나와 마찰계수 하나만 알면, 기어와 베어링이 얼마나 뜨거워지고 닳을지 계산할 수 있을까?" answer="없습니다. 기어 이빨의 구름과 미끄럼, 베어링의 작은 타원 접촉, 씰의 계속되는 마찰은 서로 다른 힘과 속도를 가집니다. 먼저 접촉 쌍마다 물체, 누르는 힘, 곡률, 표면 속도, 재료와 윤활 상태를 따로 적어야 합니다."/>

    <NlpSection id="contact-inventory" marker="01" tone="teal" question="같은 joint 안에서 실제로 무엇과 무엇이 어떤 운동으로 닿는가?" title="부품 load를 contact-pair ledger로 내린다">
      <TribologyMiniMap/>
      <p>Reducer output torque는 contact normal force가 아닙니다. Gear pressure angle, bearing load distribution, preload, overturning moment, housing compliance and alignment를 거쳐 각 contact load로 바뀝니다. 같은 output bearing 안에서도 loaded rolling elements는 같은 힘을 들지 않으며, edge loading이 생기면 nominal symmetry도 깨집니다.</p>
      <ConceptPrimer items={[
        {term:'Tribology는 표면 시스템의 과학',meaning:'마찰, 윤활, 접촉 변형과 마모를 재료·형상·운동·환경·이력의 결합으로 다룬다.',why:'마찰계수나 grease brand 하나를 부품의 영구 속성처럼 쓰지 않기 위해 필요하다.'},
        {term:'Nominal contact와 real contact',meaning:'Hertz patch는 매끈한 탄성체의 평균 압력 영역이고 실제 하중은 그 안의 rough summit와 lubricant film이 나눠 든다.',why:'GPa-scale pressure, asperity shear and film separation을 component 평균 면적에서 잃지 않기 위해 필요하다.'},
        {term:'Surface life는 feedback state',meaning:'Temperature, viscosity, supply, film, friction, wear debris, clearance and sealing이 서로 다음 상태를 바꾼다.',why:'한 번의 efficiency or L10 계산이 lifecycle 전체를 보증하지 않게 한다.'},
      ]}/>
      <FormulaBlock latex={raw`\underbrace{\frac{1}{E^*}}_{\text{두 물체의 결합 유연도}}=\underbrace{\frac{1-\nu_A^2}{E_A}}_{\text{물체 A의 탄성 기여}}+\underbrace{\frac{1-\nu_B^2}{E_B}}_{\text{물체 B의 탄성 기여}}`} meaning="두 표면이 함께 변형하므로 한 재료의 Young modulus를 그대로 쓰지 않고 normal-contact compliance를 합친다. Poisson constraint가 contact indentation에 미치는 영향도 함께 남긴다." symbols={[[raw`E^*`,'결합 탄성계수'],[raw`E_A,E_B`,'두 물체의 Young modulus'],[raw`\nu_A,\nu_B`,'두 물체의 Poisson ratio']]}/>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{\frac1{R_x}}_{\text{x방향 결합 곡률}}&=\underbrace{\frac1{R_{Ax}}+\frac1{R_{Bx}}}_{\text{두 국소 곡률의 합}}\\[3pt]\underbrace{\frac1{R_y}}_{\text{y방향 결합 곡률}}&=\underbrace{\frac1{R_{Ay}}+\frac1{R_{By}}}_{\text{타원 형상을 정하는 합}}\end{aligned}`} meaning="Contact는 component의 외형 반경이 아니라 접점의 두 principal curvature pair가 정한다. Convex/concave sign convention을 선언해야 point, elliptical and near-line contact를 구분할 수 있다." symbols={[[raw`R_x,R_y`,'두 주방향의 유효 곡률 반경'],[raw`R_{Ai},R_{Bi}`,'각 물체의 signed local radius'],[raw`i=x,y`,'접촉면의 principal directions']]}/>
      <ContactInventoryLab/>
      <Misconception>Catalog의 `friction torque`나 `efficiency`는 joint 안 모든 surface의 독립 원인을 설명하지 않습니다. Product boundary, load, speed, temperature, fill, seal and running-in condition이 바뀌면 같은 숫자를 옮길 수 없습니다.</Misconception>
    </NlpSection>

    <NlpSection id="hertz-contact" marker="02" tone="blue" question="작아 보이는 rolling contact가 왜 GPa 압력을 만들며 load가 늘면 어떻게 변하는가?" title="Hertz patch·maximum pressure·elastic approach를 만든다">
      <p>가장 단순한 sphere-on-flat circular screen에서는 normal load가 커질수록 contact radius는 load의 세제곱근으로, maximum pressure는 더 완만하게 변합니다. Contact area가 0에서 유한하게 생기는 이유는 두 solid가 elastic하게 눌리기 때문입니다.</p>
      <p>Pressure field를 total normal load로 합치거나 뒤의 heat storage·loss 식에서 in/out/source를 구분하는 법이 막히면 <InternalLink slug="integrals-fields-conservation">적분·장·보존법칙</InternalLink>의 area integral과 fixed control-volume ledger를 먼저 읽습니다.</p>
      <FormulaBlock latex={raw`\underbrace{a}_{\text{원형 접촉 반경}}=\underbrace{\left(\frac{3F_NR^*}{4E^*}\right)^{1/3}}_{\text{하중·곡률·탄성의 균형}}`} meaning="Normal load가 키우는 patch와 stiffness/curvature가 제한하는 indentation을 균형시킨 circular Hertz solution이다. Cubic root 때문에 load를 두 배로 해도 radius가 두 배가 되지는 않는다." symbols={[[raw`a`,'원형 Hertz patch radius'],[raw`F_N`,'해당 contact pair의 normal load'],[raw`R^*`,'결합 곡률 반경'],[raw`E^*`,'결합 탄성계수']]}/>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{p_0}_{\text{중앙 최대 압력}}&=\underbrace{\frac{3F_N}{2\pi a^2}}_{\text{압력 분포의 최댓값}}\\[3pt]\underbrace{\delta}_{\text{탄성 접근량}}&=\underbrace{\frac{a^2}{R^*}}_{\text{곡률에 따른 눌림}}\end{aligned}`} meaning="Average component stress가 아니라 local pressure peak and deflection을 얻는다. 이 식은 smooth, elastic, centered and non-conforming baseline이며 edge load, plasticity, coating thickness and residual stress는 별도 model gate다." symbols={[[raw`p_0`,'Hertz pressure maximum'],[raw`\delta`,'두 body center의 elastic approach'],[raw`a`,'앞 식의 contact radius']]}/>
      <HertzContactLab/>
      <Takeaway>Hertz 계산값은 failure verdict가 아니라 contact state의 출발점입니다. Subsurface stress, lubricant pressure, asperity contact, edge stress and material fatigue response가 다음 층에 붙습니다.</Takeaway>
    </NlpSection>

    <NlpSection id="rough-surfaces" marker="03" tone="violet" question="Nominal patch가 생겨도 왜 실제로는 일부 summit만 먼저 하중을 드는가?" title="Roughness·real area·running-in을 상태로 보존한다">
      <p>Ra는 평균 absolute height 하나일 뿐입니다. Film comparison에는 흔히 RMS roughness Rq가 쓰이지만, 같은 Rq도 lay, wavelength, skewness, waviness and filtering cutoff에 따라 접촉은 달라집니다. Gear flank의 grinding lay와 bearing raceway의 circumferential lay는 direction도 보존해야 합니다.</p>
      <FormulaBlock latex={raw`\underbrace{\sigma_c}_{\text{두 표면의 합성 RMS 거칠기}}=\underbrace{\sqrt{R_{q,A}^{,2}+R_{q,B}^{,2}}}_{\text{독립 높이 변동의 제곱합}}`} meaning="Film은 한 표면만 건너는 것이 아니라 두 rough profile 사이를 분리해야 하므로 두 RMS amplitudes를 root-sum-square로 합친다. 같은 측정 bandwidth and direction의 compatible roughness를 써야 한다." symbols={[[raw`\sigma_c`,'Composite RMS roughness'],[raw`R_{q,A},R_{q,B}`,'두 surface의 RMS roughness']]}/>
      <FormulaBlock latex={raw`\underbrace{A_r}_{\text{실제 접촉 면적의 1차 screen}}\approx\underbrace{\frac{F_N}{H_s}}_{\text{하중을 summit hardness로 나눔}}\ll\underbrace{A_n}_{\text{겉보기 접촉 면적}}`} meaning="Plastic asperity screen에서는 real area가 load에 비례하고 softer-surface hardness가 지지 압력을 제한한다. 이것은 full rough-contact solution이 아니라 왜 apparent area가 friction을 직접 정하지 않는지 보여 주는 scale estimate다." symbols={[[raw`A_r`,'Load-bearing asperity area'],[raw`A_n`,'Nominal Hertz/apparent area'],[raw`H_s`,'Softer surface hardness scale']]}/>
      <RoughnessRunningInLab/>
      <Misconception>Running-in을 무조건 beneficial polishing으로 부르면 안 됩니다. Controlled summit adaptation일 수도 있지만 coating removal, debris generation, preload loss or early distress일 수도 있습니다. Before/after roughness, torque and debris evidence가 함께 필요합니다.</Misconception>
    </NlpSection>

    <NlpSection id="contact-kinematics" marker="04" tone="amber" question="Rolling bearing과 gear에서 실제 film 운반과 heat를 만드는 속도는 무엇인가?" title="Entrainment·sliding·SRR·reversal을 분리한다">
      <p>두 surface가 같은 방향으로 비슷한 속도로 움직이면 평균 속도는 lubricant를 inlet에서 contact로 운반하고 차이는 sliding을 만듭니다. Gear tooth는 pitch point 전후 sliding direction이 바뀌며, roller flange and cage guide에는 spin/sliding이 추가됩니다.</p>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{u_e}_{\text{막 운반 속도}}&=\underbrace{\frac{u_A+u_B}{2}}_{\text{두 표면 속도의 평균}}\\[3pt]\underbrace{u_s}_{\text{미끄럼 속도}}&=\underbrace{u_A-u_B}_{\text{두 속도의 차이}}\end{aligned}`} meaning="두 경계면이 함께 윤활유를 접촉부로 끌고 가므로 평균 속도로 막 운반을 나타낸다. 두 표면의 상대 운동은 막을 전단하고 마찰열을 만들므로 속도 차이로 나타낸다. 두 속도의 부호는 반드시 같은 접선 방향 기준을 써야 한다." symbols={[[raw`u_e`,'Entrainment speed'],[raw`u_s`,'Sliding speed'],[raw`u_A,u_B`,'접점에서 두 surface의 signed tangent speed']]}/>
      <FormulaBlock latex={raw`\underbrace{SRR}_{\text{평균 속도에 대한 미끄럼 비}}=\underbrace{\frac{2(u_A-u_B)}{u_A+u_B}}_{\text{미끄럼을 entrainment로 정규화}}`} meaning="Contact scale가 다른 실험을 비교하기 위해 sliding을 mean rolling speed로 normalize한다. Reversal or dwell에서 denominator가 0에 가까우면 SRR만 보고 film state를 해석할 수 없다." symbols={[[raw`SRR`,'Slide-to-roll ratio'],[raw`u_A+u_B`,'Film-transport denominator'],[raw`u_A-u_B`,'Relative sliding numerator']]}/>
      <ContactKinematicsLab/>
      <Takeaway>저속 고토크 robot joint의 위험은 낮은 output rpm 하나로 결정되지 않습니다. Motor-side contacts는 고속이고 output bearing의 일부 zone은 짧은 oscillation만 반복해 lubricant redistribution이 더 어렵습니다.</Takeaway>
    </NlpSection>

    <NlpSection id="viscosity-state" marker="05" tone="teal" question="왜 datasheet의 40°C viscosity 하나로 cold start와 hot soak를 함께 계산할 수 없는가?" title="Viscosity를 temperature·pressure·shear가 붙은 state로 만든다">
      <p>Base-oil viscosity는 온도가 올라가면 크게 감소합니다. Contact pressure는 반대로 local viscosity를 높여 elastic deformation과 함께 EHL film을 가능하게 합니다. Grease는 base oil plus thickener system이므로 low-shear catalog viscosity만으로 high-shear contact and replenishment를 완전히 설명할 수 없습니다.</p>
      <FormulaBlock latex={raw`\underbrace{\log_{10}\!\bigl[\log_{10}(\nu+0.7)\bigr]}_{\text{점도 변화를 직선화}}=\underbrace{A-B\log_{10}T}_{\text{온도에 대한 경험 직선}}`} meaning="Walther-style relation은 두 개 이상 measured kinematic-viscosity points를 temperature curve로 연결한다. Double log is used to linearize a strongly nonlinear viscosity-temperature trend, not to create data outside the validated range." symbols={[[raw`\nu`,'Kinematic viscosity in the equation convention'],[raw`T`,'Absolute temperature'],[raw`A,B`,'해당 lubricant data로 fitted constants']]}/>
      <FormulaBlock latex={raw`\underbrace{\eta(p,T)}_{\text{압력·온도 상태의 점도}}=\underbrace{\eta_0(T)}_{\text{주변압 점도}}\underbrace{\exp(\alpha p)}_{\text{압력에 따른 증가}}`} meaning="Barus형 1차 근사다. 지수항은 압력이 높아질수록 점도가 커져 EHL 압력을 지탱하는 효과를 나타낸다. 압력-점도 계수 α와 함수 형태는 윤활유별 검증 범위가 필요하며, 극고압이나 강한 전단에서는 맞지 않을 수 있다." symbols={[[raw`\eta_0(T)`,'Temperature-conditioned dynamic viscosity'],[raw`\alpha`,'Pressure-viscosity coefficient'],[raw`p`,'Local film pressure']]}/>
      <ViscosityStateLab/>
      <Misconception>높은 viscosity는 언제나 안전하지 않습니다. Film에는 유리하지만 cold-start torque, churning, heat and efficiency에는 불리할 수 있습니다. Hot thin-film case와 cold drag case를 별도 gate로 유지합니다.</Misconception>
    </NlpSection>

    <NlpSection id="film-regimes" marker="06" tone="blue" question="Moving surface와 converging gap이 어떻게 external pump 없이 pressure를 만드는가?" title="Reynolds wedge에서 네 limiting regime까지 간다">
      <p>Converging gap으로 끌려간 viscous fluid는 좁아지는 유로에서 pressure를 만듭니다. Pressure gradient가 만드는 Poiseuille backflow와 moving surfaces가 만드는 Couette transport가 평형을 이루는 것이 hydrodynamic wedge의 핵심입니다.</p>
      <FormulaBlock latex={raw`\underbrace{\frac{d}{dx}\!\left(\frac{h^3}{12\eta}\frac{dp}{dx}\right)}_{\text{압력 구배가 만드는 역류 변화}}=\underbrace{u_e\frac{dh}{dx}}_{\text{이동 면이 wedge로 운반한 유량 변화}}`} meaning="Steady one-dimensional incompressible Reynolds balance의 직관형이다. Cubed gap makes pressure highly sensitive to film geometry; side leakage, squeeze, compressibility, thermal and non-Newtonian effects는 확장항이다." symbols={[[raw`h(x)`,'Local film thickness'],[raw`p(x)`,'Hydrodynamic pressure'],[raw`\eta`,'Dynamic viscosity in the assumed model'],[raw`u_e`,'Entrainment speed']]}/>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{U}_{\text{속도군}}&=\underbrace{\frac{u_e\eta_0}{E^*R_x}}_{\text{운반 대비 탄성}}&\underbrace{W}_{\text{하중군}}&=\underbrace{\frac{F_N}{E^*R_x^2}}_{\text{정규화 하중}}\\[3pt]\underbrace{G}_{\text{재료군}}&=\underbrace{\alpha E^*}_{\text{압력점도 결합}}&&\end{aligned}`} meaning="Hamrock-Dowson 무차원군은 단위 크기를 없애고 속도·점도, 하중, 압력점도·탄성의 영향을 분리한다. 원 논문의 탄성계수 관례와 접촉 형상 정의를 한 묶음으로 유지해야 하며, 각 무차원군을 독립적인 재료 성능 점수로 읽으면 안 된다." symbols={[[raw`U,W,G`,'Dimensionless speed, load and material parameters'],[raw`R_x`,'Rolling-direction effective radius'],[raw`\eta_0,\alpha`,'Ambient-pressure viscosity and pressure-viscosity coefficient']]}/>
      <FilmRegimeMapLab/>
      <Takeaway>Hamrock-Dowson의 네 regime는 `boundary/mixed/EHL`의 everyday wear classification과 축이 다릅니다. 전자는 viscosity and elastic influence의 limiting equations이고, 후자는 film separation and asperity load share에 관한 운전 상태입니다.</Takeaway>
    </NlpSection>

    <NlpSection id="minimum-film" marker="07" tone="violet" question="Fully flooded elliptical contact에서 가장 얇은 film을 어떻게 계산하고 roughness와 비교하는가?" title="Hamrock-Dowson minimum film과 lambda의 책임을 분리한다">
      <p>NASA TP-1342의 viscous-elastic equation은 elliptical contact에서 speed, material, load and ellipticity가 dimensionless minimum film parameter에 미치는 exponents를 제공합니다. Load exponent가 작다는 사실은 load가 중요하지 않다는 뜻이 아닙니다. Load는 contact pressure, subsurface stress and life를 동시에 바꿉니다.</p>
      <FormulaBlock latex={raw`\underbrace{H_{\min}^{VE}}_{\text{점성-탄성 최소 막 변수}}=\underbrace{3.63\,U^{0.68}G^{0.49}W^{-0.073}}_{\text{속도·재료·하중 기여}}\underbrace{\left(1-e^{-0.68k}\right)}_{\text{타원 형상 보정}}`} meaning="Hamrock-Dowson 1978 equation 26의 original H/U/G/W form이다. Reduced equation 30의 coefficient 3.42 and gV/gE exponents와 섞지 않으며, central-film or line-contact equation으로 교체하지 않는다." symbols={[[raw`H_{\min}^{VE}`,'Minimum film parameter for the viscous-elastic regime'],[raw`U,G,W`,'앞 절의 dimensionless groups'],[raw`k=a/b`,'Contact ellipse ellipticity parameter']]}/>
      <FormulaBlock latex={raw`\underbrace{\Lambda}_{\text{막과 거칠기의 비}}=\underbrace{\frac{h_{\min}}{\sqrt{R_{q,A}^{,2}+R_{q,B}^{,2}}}}_{\text{최소 막을 합성 RMS로 나눔}}`} meaning="길이의 절대 크기를 나누어 없애고, 예측 막이 두 표면의 요철보다 충분히 큰지를 묻는다. Λ는 윤활 상태와 위험을 거르는 지표이지 수명이나 마모를 확정하는 보증값이 아니다. 거칠기 파장과 방향, 표면 화학, 윤활유 부족은 별도로 남는다." symbols={[[raw`\Lambda`,'Specific film-thickness ratio'],[raw`h_{\min}`,'Minimum physical film thickness'],[raw`R_{q,A},R_{q,B}`,'Compatible surface RMS roughness values']]}/>
      <MinimumFilmLambdaLab/>
      <Misconception><code>Lambda &gt; 3</code>이라는 한 숫자는 clean, fully flooded, steady, smooth-statistics 조건에서도 모든 distress를 막는 보증서가 아닙니다. Sliding traction, spin, local edge pressure, contamination, transient reversal and material fatigue가 별도입니다.</Misconception>
    </NlpSection>

    <NlpSection id="starvation-grease" marker="08" tone="amber" question="Theoretical fully flooded film이 실제 grease-lubricated oscillating joint에서 왜 그대로 생기지 않는가?" title="Inlet supply·starvation·replenishment·churning을 추가한다">
      <p>Film equation은 contact inlet에 충분한 lubricant가 있다고 가정합니다. Grease에서는 contact가 base oil을 끌어가고 channel을 만들며, thickener network의 bleed and flow가 다시 inlet을 채웁니다. Short stroke or dwell은 같은 zone만 왕복해 fresh lubricant path를 제한할 수 있습니다.</p>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{h_{\mathrm{actual}}}_{\text{실제 공급 막}}&=\underbrace{C_{\mathrm{starve}}(q_{in},u_e,t,\mathcal H)}_{\text{공급·속도·이력 보정}}\underbrace{h_{\mathrm{flood}}}_{\text{완전 공급 막}}\\[3pt]\underbrace{0<C_{\mathrm{starve}}\le1}_{\text{공급 부족은 막을 줄이는 방향}}\end{aligned}`} meaning="윤활유 부족 계수는 완전 공급을 가정한 이론 막과 실제 입구 공급량을 분리한다. 이 계수는 시험과 모델에 따라 정하는 보정값이지 보편 상수가 아니다. 이력 H에는 채널 형성, 운동 반전, 재공급 상태가 남아야 한다." symbols={[[raw`C_{\mathrm{starve}}`,'Starvation reduction factor'],[raw`q_{in}`,'Available inlet supply state'],[raw`\mathcal H`,'Prior sweep, dwell and grease-distribution history']]}/>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{P_{\mathrm{grease}}}_{\text{그리스 관련 손실}}&=\underbrace{P_{\mathrm{shear}}}_{\text{접촉·벌크 전단}}+\underbrace{P_{\mathrm{churn}}(m_f,\omega,T)}_{\text{충전·속도·온도 손실}}\\[3pt]&\quad+\underbrace{P_{\mathrm{seal\ flow}}}_{\text{누설·재분배 손실}}\end{aligned}`} meaning="그리스 양은 접촉부 공급과 기생 손실 전력에 모두 영향을 준다. 이 장부식은 충전량 증가를 윤활 이점으로만 계산하지 못하게 한다. 너무 많으면 교반열이 커지고, 너무 적거나 재공급이 나쁘면 입구가 마른다." symbols={[[raw`m_f`,'Grease fill mass or controlled fill state'],[raw`\omega`,'Rotational/oscillation speed state'],[raw`P_{\mathrm{churn}}`,'Bulk grease displacement loss']]}/>
      <GreaseStarvationLab/>
      <Takeaway>Grease selection은 base-oil viscosity만 고르는 일이 아닙니다. Thickener compatibility, bleed, mechanical stability, additive chemistry, fill, distribution, seal and relubrication path가 함께 configuration을 이룹니다.</Takeaway>
    </NlpSection>

    <NlpSection id="friction-thermal-loop" marker="09" tone="green" question="Friction loss가 temperature를 바꾸고 그 temperature가 다시 friction을 바꾸면 equilibrium은 어디인가?" title="Bearing·gear·seal·churning power를 thermal loop로 닫는다">
      <p>Motor current에서 보이는 loss는 한 표면의 mu가 아닙니다. Bearing rolling/sliding/spin, gear mesh traction, seal lip drag, lubricant churning and windage가 합쳐집니다. Local sliding contact는 flash heat를, housing 전체는 bulk temperature를 만듭니다.</p>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{P_{loss}}_{\text{관절 내부 손실 전력}}&=\underbrace{M_b\omega_b}_{\text{베어링 손실}}+\underbrace{F_tu_s}_{\text{접촉 미끄럼 열}}\\[3pt]&\quad+\underbrace{M_s\omega_s}_{\text{씰 마찰 손실}}+\underbrace{P_{ch}}_{\text{교반 손실}}\end{aligned}`} meaning="토크와 힘을 그대로 섞지 않도록 모든 손실을 먼저 전력으로 바꾼 뒤 더한다. 모터측 베어링, 기어 접촉, 출력 씰은 같은 속도로 움직이지 않으므로 각 각속도와 표면 속도를 따로 보존한다." symbols={[[raw`M_b,M_s`,'Bearing and seal loss torque'],[raw`F_t`,'Tangential traction force'],[raw`u_s`,'Local sliding speed'],[raw`P_{ch}`,'Churning and bulk-fluid loss']]}/>
      <FormulaBlock latex={raw`\underbrace{C_{th}\frac{dT}{dt}}_{\text{저장되는 열}}=\underbrace{P_{loss}(T,h,\Lambda)}_{\text{상태에 따른 발생 열}}-\underbrace{\frac{T-T_{amb}}{R_{th}}}_{\text{환경으로 빠지는 열}}`} meaning="집중 열평형식은 온도 T가 점도, 막, 마찰을 바꾸고 다시 손실전력 P_loss를 바꾸는 되먹임을 드러낸다. 열용량 C_th는 과도 응답 속도를, 열저항 R_th는 평형 온도 상승을 정한다. 접촉부 순간 온도는 더 세밀한 모델이 필요하다." symbols={[[raw`C_{th}`,'Effective thermal capacitance'],[raw`R_{th}`,'Joint-to-ambient thermal resistance'],[raw`T_{amb}`,'Ambient/reference temperature']]}/>
      <p>이 식은 steady temperature 공식이 아니라 현재 temperature에서 다음 rate를 다시 계산하는 ODE입니다. State·rate 단위, equilibrium, step error와 stiff time scale의 구분이 막히면 <InternalLink slug="differential-equations-phase-plane-numerical-integration">미분방정식과 수치 적분</InternalLink>의 01·05절로 내려갑니다.</p>
      <FrictionThermalLoopLab/>
      <Misconception>Housing sensor 하나의 steady value가 contact temperature를 직접 측정하지 않습니다. Sensor location, thermal lag, heat partition and short flash events를 포함한 model-test correlation이 필요합니다.</Misconception>
    </NlpSection>

    <NlpSection id="life-wear-damage" marker="10" tone="blue" question="Catalog L10, pitting, micropitting, scuffing, fretting and abrasive wear는 같은 수명 문제인가?" title="Population rating life와 surface damage modes를 분리한다">
      <p>Basic rating life는 declared equivalent dynamic load and rating 아래 동일 bearing population의 rolling-contact fatigue statistics를 다룹니다. Individual bearing guarantee가 아니며 contamination, lubrication, mounting, edge load and non-fatigue wear는 별도 correction or evidence가 필요합니다.</p>
      <FormulaBlock latex={raw`\underbrace{L_{10}}_{\text{90퍼센트 생존 기본 정격수명}}=\underbrace{\left(\frac{C}{P}\right)^p}_{\text{정격하중 대비 등가하중의 영향}}\underbrace{10^6}_{\text{회전수 기준}}`} meaning="Population의 10%가 rating-fatigue criterion에 도달하는 basic life definition이다. Ball/roller exponent, units, reliability and manufacturer method must match; it does not predict fretting, seal wear or individual time-to-failure." symbols={[[raw`C`,'Basic dynamic load rating'],[raw`P`,'Equivalent dynamic bearing load'],[raw`p`,'Bearing-type life exponent'],[raw`L_{10}`,'Basic rating life in revolutions']]}/>
      <FormulaBlock latex={raw`\underbrace{V}_{\text{마모 체적의 민감도}}=\underbrace{k_w}_{\text{시험·시스템 의존 계수}}\underbrace{\frac{F_Ns}{H_s}}_{\text{하중·미끄럼거리·경도의 비}}`} meaning="Archard형 관계는 하중과 미끄럼 거리가 누적될수록 마모가 늘고, 표면 경도가 높을수록 마모 체적이 줄 수 있음을 보여 준다. 계수 k_w는 재료쌍, 윤활막, 입자, 온도, 윤활 상태에 의존하므로 순수 재료상수처럼 옮기면 안 된다." symbols={[[raw`V`,'Wear volume'],[raw`k_w`,'Dimensionless/system wear coefficient'],[raw`s`,'Accumulated sliding distance'],[raw`H_s`,'Relevant softer-surface hardness']]}/>
      <LifeWearDamageLab/>
      <DecisionLedger rows={[
        {label:'Rolling-contact fatigue',decision:'Subsurface or surface-initiated repeated stress and material cleanliness/lubrication state를 본다.',kept:'contact pressure, stress cycles, material, film, contamination, rating method'},
        {label:'Micropitting / pitting',decision:'Surface-scale repeated distress와 larger spall을 roughness, sliding and film state로 구분한다.',kept:'roughness spectrum, lambda, SRR, pressure, debris progression'},
        {label:'Scuffing',decision:'Film collapse plus high sliding traction/flash heat의 rapid damage로 다룬다.',kept:'sliding speed, load, lubricant chemistry, bulk/flash temperature'},
        {label:'Fretting / abrasion',decision:'Small-amplitude oscillation or hard third-body particles가 만드는 distinct path로 시험한다.',kept:'amplitude, dwell, fit, ingress, debris size/hardness, surface tracks'},
      ]}/>
    </NlpSection>

    <NlpSection id="seals-contamination" marker="11" tone="amber" question="Low-friction seal과 많은 grease가 왜 항상 더 긴 수명을 만들지 않는가?" title="Drag·heat·ingress·debris·grease ageing을 함께 trade한다">
      <p>Seal lip force가 크면 exclusion은 좋아질 수 있지만 drag and lip heat가 증가합니다. 너무 작으면 water/dust ingress가 raceway dents, corrosion and abrasive wear를 만들 수 있습니다. Shaft finish, runout, eccentricity and pressure differential이 seal response의 일부입니다.</p>
      <FormulaBlock latex={raw`\underbrace{P_{seal}}_{\text{씰 마찰 전력}}=\underbrace{M_{seal}(F_{lip},T,\omega,R_a,e)}_{\text{lip·온도·속도·축 상태의 torque}}\underbrace{\omega}_{\text{회전 속도}}`} meaning="씰 토크를 카탈로그의 고정값이 아니라 립 힘, 온도, 속도, 축 표면과 편심에 따른 상태 함수로 본다. 토크에 속도를 곱하면 발생 열이 된다. 립 힘을 줄였다면 마찰 이점과 별도로 누설 및 이물 차단 성능을 확인해야 한다." symbols={[[raw`F_{lip}`,'Seal lip contact force'],[raw`R_a`,'Declared shaft-finish measure'],[raw`e`,'Runout/eccentricity state'],[raw`M_{seal}`,'Measured or validated seal torque model']]}/>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{D_{k+1}-D_k}_{\text{입자·손상의 상태 변화}}&=\underbrace{I_k}_{\text{외부 유입}}+\underbrace{W_k}_{\text{내부 마모 생성}}\\[3pt]&\quad-\underbrace{R_k}_{\text{배출·포집·정비}}\end{aligned}`} meaning="오염은 이력이 남는 상태다. 마모 입자는 손상의 결과이면서 다음 마모와 압흔을 만드는 새로운 입력이 된다. 이 장부식은 수명주기 추적 계약이지 보편 마모 법칙이 아니며, 입자 크기·경도·순환 경로를 함께 기록해야 한다." symbols={[[raw`D_k`,'Debris and surface-damage state'],[raw`I_k`,'Ingress contribution'],[raw`W_k`,'Wear-generated contribution'],[raw`R_k`,'Removal, filtration or maintenance contribution']]}/>
      <SealContaminationLab/>
      <Takeaway>Seal, grease and coating을 각각 최적화한 뒤 조립하는 것이 아니라 contact-system experiment로 함께 확인합니다. Additive/coating interaction, grease compatibility and debris chemistry가 빠지면 mechanical explanation만 남습니다.</Takeaway>
    </NlpSection>

    <NlpSection id="evidence-release" marker="12" tone="teal" question="Cold current·hot loss·backlash·pitting 증상을 어떤 실험으로 좁혀 release evidence로 바꾸는가?" title="Observer·staged rigs·teardown·configuration을 폐쇄 루프로 묶는다">
      <p>Motor current에는 electromagnetic torque constant error, acceleration inertia, gravity/external load, controller compensation and friction이 섞입니다. Known motion and load state를 빼고 residual을 만들되, residual이 곧 bearing friction이라는 과대 해석은 피합니다.</p>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{\hat\tau_{loss}}_{\text{관측 손실 토크 잔차}}&=\underbrace{K_ti_q}_{\text{추정 모터 토크}}-\underbrace{J_{eq}\dot\omega}_{\text{가속 토크}}\\[3pt]&\quad-\underbrace{\tau_{load}}_{\text{중력·외력·명령 부하}}\end{aligned}`} meaning="알고 있는 토크 성분을 빼서 시스템 손실의 대푯값을 남긴다. 그러나 잔차에는 기어, 베어링, 씰, 교반 손실과 모델·제어기 오차가 여전히 섞여 있다. 원인을 나누려면 온도·속도·반전 실험과 분해 검사가 필요하다." symbols={[[raw`K_t`,'Temperature/calibration-conditioned torque constant'],[raw`i_q`,'Torque-producing current'],[raw`J_{eq}`,'Equivalent reflected inertia'],[raw`\tau_{load}`,'Modeled/measured external load torque']]}/>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{e_q}_{\text{관측량의 정규화 잔차}}&=\underbrace{\frac{q_{model}-q_{test}}{u_{model}+u_{test}}}_{\text{차이를 결합 불확실성으로 나눔}}\\[3pt]\underbrace{\mathcal C}_{\text{접촉 상태 식별자}}&=\underbrace{\{G,M,S,L,E,V\}}_{\text{형상·재료·표면·윤활·환경·버전}}\end{aligned}`} meaning="정규화 잔차는 어느 모델 또는 근거 층을 먼저 고칠지 순위를 정한다. 구성 집합은 결과에서 형상, 재료·공정, 표면 상태, 윤활유·씰, 환경, 개정판 식별자가 사라지지 않게 한다. 두 식 모두 보편 합격 판정식은 아니다." symbols={[[raw`q_{model},q_{test}`,'같은 reference state의 prediction and measurement'],[raw`u_{model},u_{test}`,'Declared uncertainty scales'],[raw`\mathcal C`,'Contact-system configuration identity']]}/>
      <TribologyEvidenceLab/>
      <CapabilityCheck items={[
        'Joint 안의 gear, bearing, seal and fit contact pair를 motion·load·curvature·environment와 함께 inventory한다.',
        'Combined modulus와 local curvature에서 Hertz patch, pressure and approach를 계산하고 edge-load validity를 검사한다.',
        'Roughness, entrainment, sliding, viscosity-temperature-pressure and inlet supply를 film equation 앞에 배치한다.',
        'Hamrock-Dowson regime map, minimum/central film, point/line identity and lambda boundary를 구분한다.',
        'Bearing·gear·seal·churning loss와 thermal-viscosity-film feedback을 하나의 state loop로 계산한다.',
        'L10 rating life와 pitting, micropitting, scuffing, fretting, abrasion and seal wear의 evidence를 분리한다.',
        'Motor-current residual, temperature, hysteresis, vibration, debris, staged rigs and teardown을 configuration-controlled release ledger로 묶는다.',
      ]}/>
      <div className="not-prose my-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Link className="group rounded-md border border-border p-4 transition-colors hover:border-blue-500/50" to={articlePath('ai','paper-hamrock-dowson-film-regimes-1978')}><span className="text-xs font-black text-blue-700 dark:text-blue-300">FOUNDATIONAL SOURCE</span><p className="mt-2 text-sm font-black">Hamrock-Dowson 1978</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">네 film regime와 dimensionless map을 원문 수식 순서로 복원한다.</p><ArrowRight className="mt-4 h-4 w-4 transition-transform group-hover:translate-x-1"/></Link><Link className="group rounded-md border border-border p-4 transition-colors hover:border-teal-500/50" to={articlePath('ai','research-skf-bearing-conversion-layers-2023')}><span className="text-xs font-black text-teal-700 dark:text-teal-300">COMPANY RESEARCH</span><p className="mt-2 text-sm font-black">SKF RTD 2023</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Coating placement, running-in, roughness and bearing torque의 evidence chain을 읽는다.</p><ArrowRight className="mt-4 h-4 w-4 transition-transform group-hover:translate-x-1"/></Link><Link className="group rounded-md border border-border p-4 transition-colors hover:border-amber-500/50" to={articlePath('ai','robot-actuator-mechanics-transmission-holding-brake')}><span className="text-xs font-black text-amber-700 dark:text-amber-300">UPSTREAM PLANT</span><p className="mt-2 text-sm font-black">Actuator Mechanics</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Ratio·bearing load·friction·backdrive를 contact-system input으로 되돌린다.</p><ArrowRight className="mt-4 h-4 w-4 transition-transform group-hover:translate-x-1"/></Link><Link className="group rounded-md border border-border p-4 transition-colors hover:border-violet-500/50" to={articlePath('ai','robot-system-verification-validation-qualification')}><span className="text-xs font-black text-violet-700 dark:text-violet-300">SYSTEM RELEASE</span><p className="mt-2 text-sm font-black">Verification & Qualification</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Contact evidence를 ODD, hazards, reliability and configuration-bound release case로 올린다.</p><ArrowRight className="mt-4 h-4 w-4 transition-transform group-hover:translate-x-1"/></Link></div>
      <SourceNotes sources={[
        {label:'Hamrock & Dowson, NASA TP-1342 (1978)',href:'https://ntrs.nasa.gov/citations/19780025504',note:'Four fluid-film regimes, dimensionless groups, minimum-film equations and maps의 1차 출처.'},
        {label:'NASA SP-8063, Lubrication, Friction, and Wear (1971)',href:'https://ntrs.nasa.gov/citations/19710021995',note:'Rough-surface friction, wear modes, lubrication choices, environment and mechanism-test criteria의 1차 설계 자료.'},
        {label:'Zaretsky, NASA TM-102575 (1990)',href:'https://ntrs.nasa.gov/citations/19900012725',note:'Bearing EHD simplification, temperature viscosity, starvation reduction and lambda/life bridge의 historical source.'},
        {label:'Broitman et al., Coatings 13(12):1980 (2023)',href:'https://doi.org/10.3390/coatings13121980',note:'SKF RTD의 rolling/sliding and double-CRB conversion-layer experiment. CC BY 4.0.'},
      ]}/>
      <Takeaway>Tribology는 마지막에 mu를 붙이는 보정 항이 아닙니다. Contact geometry가 pressure를 만들고, kinematics and lubricant state가 film을 만들며, supply and heat가 그 film을 바꾸고, wear/debris/seal이 다음 mission의 initial state를 바꾸는 lifecycle mechanics입니다.</Takeaway>
    </NlpSection>
  </>;
}
