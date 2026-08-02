import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  ConstraintToughnessLab,
  CrackGrowthLab,
  CrackTipFieldLab,
  EnergyBalanceLab,
  FadLab,
  FlawIdealizationLab,
  FractureEvidenceLab,
  GeometryFactorLab,
  LefmValidityLab,
  NdeInspectionLab,
  ResidualStrengthLab,
  SpectrumHistoryLab,
} from './robot-fracture-mechanics-damage-tolerance/viz/FractureMechanicsLabs';

const raw = String.raw;

function FormulaBlock({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: Array<[string, string]> }) {
  return <div className="mb-8"><div className="not-prose min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-xs sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

function DecisionLedger({ rows }: { rows: Array<{ state: string; question: string; output: string }> }) {
  return <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">{rows.map((row, index) => <div key={row.state} className="min-w-0 bg-background p-4"><div className="flex items-start gap-2"><span className="font-mono text-xs font-black text-blue-700/55 dark:text-blue-300/55">{String(index + 1).padStart(2, '0')}</span><p className="text-sm font-black leading-snug">{row.state}</p></div><p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">판단:</strong> {row.question}</p><p className="mt-2 text-xs leading-relaxed"><strong>남길 상태:</strong> {row.output}</p></div>)}</div>;
}

export default function RobotFractureMechanicsDamageToleranceArticle() {
  return <>
    <BeginnerOpening
      title="작은 흠집은 언제 위험한 균열이 될까?"
      description="겉보기에는 멀쩡한 부품에도 제작 자국이나 아주 작은 손상이 있을 수 있습니다. 중요한 질문은 '흠집이 하나도 없는가'가 아니라, 지금 크기의 흠집이 하중을 견디는지, 반복 사용 중 얼마나 자라는지, 다음 검사 전에 위험해지지 않는지입니다."
      familiarScene={<>종이는 가장자리의 작은 찢어진 곳에서 훨씬 쉽게 계속 찢어집니다. 전체 폭이 거의 그대로여도 끝이 뾰족한 틈 주변에 힘이 몰리기 때문입니다. 금속 부품의 균열도 크기와 방향, 위치에 따라 위험도가 달라집니다.</>}
      steps={[
        { label: '흠집을 모양으로 바꾼다', detail: '검사 화면의 표시를 위치, 깊이, 길이와 방향이 있는 보수적인 균열 모델로 바꿉니다.' },
        { label: '자라게 하는 힘을 센다', detail: '하중과 균열 크기가 끝부분에 얼마나 큰 구동력을 만드는지 계산합니다.' },
        { label: '다음 검사 시점을 정한다', detail: '남은 강도와 성장 속도, 검사 탐지 능력을 연결해 안전한 사용 구간을 정합니다.' },
      ]}
    />
    <QuestionLead question="둥글게 파인 홈과 끝이 매우 날카로운 균열을 같은 '응력이 몰리는 곳'으로 계산해도 될까?" answer="안 됩니다. 둥근 홈은 끝의 반지름이 유한하지만 균열 모델은 매우 날카로운 끝 주변의 장을 다룹니다. 검사 장비가 보여 준 표시도 곧바로 균열 크기는 아닙니다. 위치, 방향, 깊이와 길이를 가진 해석 모양으로 바꾼 뒤에야 남은 강도와 성장 시간을 계산할 수 있습니다." />

    <NlpSection id="flaw-model" marker="01" tone="teal" question="카메라·침투·초음파가 본 indication은 해석 모델에서 무엇이 되는가?" title="먼저 결함을 crack geometry와 state identity로 선언한다">
      <p>손상허용은 “부품에 균열이 없다”에서 시작하지 않습니다. 제조나 운용 중 탐지되지 않을 수 있는 flaw를 <strong>가정하고도</strong> 요구 수명과 residual strength를 갖는지 묻습니다. Detected indication이면 측정 불확실성과 인접 indication interaction까지 포함해 analysis crack으로 바꿉니다.</p>
      <ConceptPrimer items={[
        { term: 'Nominal strength의 경계', meaning: 'Nominal stress가 허용치 아래여도 crack-like flaw가 있는 구조의 residual strength는 별도 질문이다.', why: 'Notch screen과 crack-driving-force analysis를 혼동하지 않기 위해 필요하다.' },
        { term: 'Crack state', meaning: '결함 geometry, K/G driving force, resistance, growth history, NDE capability and part identity를 함께 보존한다.', why: 'Solver output을 실제 검사·부품 configuration과 연결하기 위해 필요하다.' },
        { term: 'Inspection decision', meaning: '계산 수명을 읽는 데서 끝나지 않고 어떤 검사가 어떤 flaw를 언제까지 찾아야 하는지 역으로 설계한다.', why: 'Damage tolerance를 일회성 계산이 아닌 운영 폐쇄 루프로 만들기 위해 필요하다.' },
      ]} />
      <DecisionLedger rows={[
        { state: 'Observation', question: '어떤 방법·방향·접근으로 무엇을 보았는가?', output: 'Indication dimensions, location, method, confidence' },
        { state: 'Idealization', question: 'Surface, corner, embedded, through 중 무엇인가?', output: 'a, c, front coordinate, plane and interaction' },
        { state: 'Driving model', question: '어떤 load component와 SIF solution이 맞는가?', output: 'Stress field, Y/F solution and validity domain' },
        { state: 'Configuration', question: '어느 serial part의 어느 inspection state인가?', output: 'Material/process/repair/history identity' },
      ]} />
      <FormulaBlock latex={raw`\underbrace{\frac{x^2}{c^2}+\frac{y^2}{a^2}=1}_{\text{타원형 균열 전면}}`} meaning="Surface flaw를 semi-ellipse로 이상화할 때 depth a와 surface half-length c가 crack front의 서로 다른 점을 정의한다. 한 숫자로 줄이면 deepest point와 surface point의 driving force 차이를 잃는다." symbols={[["a", "표면에서 가장 깊은 crack depth"],["c", "표면 방향 half-length"],["x,y", "선언한 crack-plane 좌표"]]} />
      <FormulaBlock latex={raw`\underbrace{a_0}_{\text{해석 초기 결함}}\;\ge\;\underbrace{a_{90/95}}_{\text{검사 보증 결함}}`} meaning="분석 초기 flaw는 실제 screening method가 해당 geometry에서 놓칠 수 있는 크기보다 작게 두면 안 된다. 등호는 자동 규칙이 아니라 method, access and orientation을 일치시켰을 때의 연결 조건이다." symbols={[["a_0", "crack-growth analysis가 시작하는 flaw"],["a_{90/95}", "90% POD를 95% confidence로 입증한 flaw capability"]]} />
      <FlawIdealizationLab />
      <Misconception>검사 장비가 표시한 3 mm indication을 곧바로 `a=3 mm`로 입력하는 것은 보수적이지도 정확하지도 않습니다. 표시 길이, crack depth, probe response and interaction은 서로 다른 상태입니다.</Misconception>
    </NlpSection>

    <NlpSection id="energy-balance" marker="02" tone="blue" question="왜 같은 재료와 같은 nominal stress에서도 긴 crack이 더 위험한가?" title="Griffith의 energy ledger에서 size effect를 먼저 이해한다">
      <p>Crack이 조금 자라면 새로운 표면을 만드는 저항 에너지가 필요하지만, 동시에 구조가 저장하던 elastic energy 일부가 방출됩니다. 방출률이 저항보다 작으면 arrest할 수 있고, 같아지는 지점은 equilibrium, 더 커지는 방향이면 unstable extension이 가능해집니다.</p>
      <p>Energy density를 영역에 모으는 적분, path·area의 orientation과 단위가 낯설면 <InternalLink slug="integrals-fields-conservation">적분·장·보존법칙</InternalLink>에서 domain과 balance 장부를 먼저 고정합니다. 그 기반 글은 J-integral 자체를 유도하지 않으며, crack-specific path independence는 이 글의 상위 fracture model에서 다룹니다.</p>
      <FormulaBlock latex={raw`\underbrace{G}_{\text{균열 구동력}}=-\underbrace{\frac{\partial \Pi}{\partial A}}_{\text{균열 면적 증가당 잠재에너지 감소}}`} meaning="구조 전체 potential energy Pi가 crack area A 증가에 따라 얼마나 줄어드는지를 crack driving force로 정의한다. 마이너스 부호는 저장 에너지 감소가 crack에 공급되는 방향임을 표시한다." symbols={[["G", "energy release rate, J/m²"],["\Pi", "load and boundary condition을 포함한 potential energy"],["A", "새로 증가한 crack area"]]} />
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{G_I}_{\text{모드 I 방출률}}&=\underbrace{\frac{\pi\sigma^2 a}{E'}}_{\text{넓은 판의 탄성에너지 방출}}\\[2pt]\underbrace{G_I\ge G_c}_{\text{불안정 성장 조건}}&\Longleftrightarrow\underbrace{\sigma\ge\sqrt{\frac{E'G_c}{\pi a}}}_{\text{균열 길이에 따른 임계응력}}\end{aligned}`} meaning="Declared infinite/wide cracked plate baseline에서 critical stress는 crack size의 inverse square root로 떨어진다. 실제 부품에는 geometry, plastic work and material resistance model이 추가된다." symbols={[["E'", "plane stress이면 E, plane strain이면 E/(1-nu²)"],["G_c", "critical crack resistance"],["a", "half crack length in this baseline"]]} />
      <EnergyBalanceLab />
      <Takeaway>Griffith의 지속되는 기여는 완벽한 고체의 strength가 아니라 flaw가 있는 구조의 energy balance를 묻도록 질문을 바꾼 데 있습니다. 1921 원문의 수치 계수와 분자 배향 가설까지 현대 법칙으로 받아들이면 안 됩니다.</Takeaway>
    </NlpSection>

    <NlpSection id="crack-tip-field" marker="03" tone="violet" question="Crack 근처의 복잡한 stress field를 한 개의 K가 어떻게 대표하는가?" title="Mode·좌표·거리와 함께 crack-tip asymptote를 읽는다">
      <p>Mode I은 crack face가 열리고, Mode II는 면내에서 미끄러지며, Mode III는 면외로 찢어집니다. K는 nominal stress 자체가 아니라 특정 crack geometry and mode가 만든 leading near-tip field의 amplitude입니다.</p>
      <FormulaBlock latex={raw`\underbrace{\sigma_{ij}(r,\theta)}_{\text{균열 끝 국소 응력}}=\underbrace{\frac{K_I}{\sqrt{2\pi r}}}_{\text{거리별 장 크기}}\underbrace{f_{ij}^{(I)}(\theta)}_{\text{모드 I 방향 분포}}+\underbrace{O(\sqrt r)}_{\text{더 먼 항}}`} meaning="K-dominant elastic annulus에서 stress magnitude와 angular shape를 분리한다. r가 process/plastic zone 안으로 들어가면 이 leading elastic term을 실제 peak stress로 해석하지 않는다." symbols={[["r,theta", "crack tip 중심의 polar coordinate"],["K_I", "Mode-I stress intensity, MPa sqrt(m)"],["f_ij", "stress component별 angular function"]]} />
      <FormulaBlock latex={raw`\underbrace{K_I}_{\text{모드 I 장 크기}}=\underbrace{Y(a/W,\,a/c,\,\phi)}_{\text{형상과 전면 보정}}\underbrace{\sigma\sqrt{\pi a}}_{\text{하중과 결함 크기}}`} meaning="Square-root size scaling에 dimensionless geometry solution Y를 곱한다. Y의 arguments와 solution provenance를 남겨야 같은 K가 어느 crack-front position에서 계산됐는지 재현할 수 있다." symbols={[["Y", "finite width, surface, aspect and front-position correction"],["W", "declared section width"],["phi", "semi-elliptical crack-front coordinate"]]} />
      <CrackTipFieldLab />
      <Misconception>FEA의 sharp crack tip maximum stress와 K는 같은 acceptance quantity가 아닙니다. Mesh peak는 발산하고 K는 그 발산장의 amplitude를 정해진 solution/contour로 추출합니다.</Misconception>
    </NlpSection>

    <NlpSection id="geometry-factor" marker="04" tone="amber" question="하나의 Y 값이 실제 shaft hole, surface crack and stress gradient를 모두 대표할까?" title="Geometry solution과 stress decomposition을 숨기지 않는다">
      <p>Robot shaft의 hole edge나 housing weld에는 uniform tension만 있지 않습니다. Membrane, bending and higher-order gradient가 crack front에서 서로 다른 geometry function을 가집니다. Superposition이 유효한 linear-elastic 범위에서도 각 stress component의 reference and fit이 명시돼야 합니다.</p>
      <FormulaBlock latex={raw`\underbrace{K}_{\text{총 균열 구동력}}=\underbrace{\left(S_0F_0+S_1F_1+S_2F_2+S_3F_3\right)}_{\text{응력 분포별 형상 기여}}\underbrace{\sqrt{\pi a}}_{\text{결함 크기 척도}}`} meaning="NASA 2025 NASGRO report의 general form처럼 stress distribution을 polynomial components S_i로 분해하고 각 항에 맞는 geometry function F_i를 적용한다. 한 점 peak를 uniform stress로 넣는 오류를 피한다." symbols={[["S_i", "reference plane에서 fit한 stress polynomial coefficients"],["F_i", "각 stress component의 SIF geometry function"],["a", "선택한 solution의 crack-depth parameter"]]} />
      <FormulaBlock latex={raw`\underbrace{K_{\mathrm{app}}}_{\text{적용 구동력}}=\underbrace{K_{\mathrm{primary}}}_{\text{기계 하중}}+\underbrace{K_{\mathrm{residual}}}_{\text{잔류응력}}+\underbrace{K_{\mathrm{thermal}}}_{\text{열 응력}}`} meaning="Linear-elastic SIF contribution은 합칠 수 있지만 load class는 보존한다. Residual and thermal stress는 FAD의 fracture coordinate에 들어가도 plastic-collapse coordinate에는 primary load와 같은 방식으로 들어가지 않는다." symbols={[["K_primary", "applied mechanical primary load contribution"],["K_residual", "manufacturing/weld residual field contribution"],["K_thermal", "constrained temperature-field contribution"]]} />
      <GeometryFactorLab />
      <Takeaway>Y를 고르는 일은 table lookup이 아니라 부품 geometry, crack state, stress representation and validity domain을 하나의 solution family에 맞추는 model-selection 작업입니다.</Takeaway>
    </NlpSection>

    <NlpSection id="constraint-toughness" marker="05" tone="teal" question="재료 표의 KIc와 얇은 실제 부품의 Kc를 어떻게 구분할까?" title="Crack resistance는 재료 이름 하나가 아니라 constraint-conditioned evidence다">
      <p>두꺼운 specimen 내부는 out-of-plane strain이 억제되어 triaxial constraint가 커지고 더 낮은 plane-strain toughness가 나타날 수 있습니다. 얇은 판의 apparent toughness가 더 높더라도 그 값을 credit하려면 part thickness, crack front, orientation and test validity가 맞아야 합니다.</p>
      <FormulaBlock latex={raw`\underbrace{G}_{\text{에너지 표현}}=\underbrace{\frac{K^2}{E'}}_{\text{응력장 표현과 연결}},\qquad E'=\begin{cases}\underbrace{E}_{\text{평면응력}}\\[2pt]\underbrace{E/(1-\nu^2)}_{\text{평면변형률}}\end{cases}`} meaning="같은 linear-elastic crack state를 energy release rate G와 stress intensity K로 표현하는 bridge다. Constraint state에 따라 effective modulus E'가 달라진다." symbols={[["E", "Young modulus"],["nu", "Poisson ratio"],["E'", "constraint-dependent elastic modulus"]]} />
      <FormulaBlock latex={raw`\underbrace{B,\;a,\;W-a}_{\text{유효 시편 치수}}\;\ge\;\underbrace{2.5\left(\frac{K_{Ic}}{\sigma_{ys}}\right)^2}_{\text{평면변형률 크기 화면}}`} meaning="대표적인 plane-strain toughness validity size screen이다. Formula alone does not validate a test; specimen standard, load-displacement validity and material orientation conditions도 필요하다." symbols={[["B", "specimen or part thickness"],["W-a", "remaining ligament"],["sigma_ys", "relevant yield strength"]]} />
      <ConstraintToughnessLab />
      <Misconception>“얇으니 Kc가 높다”를 설계 bonus로 바로 사용하면 constraint loss, stable tearing and geometry dependence를 material constant로 오인합니다. Lower-bound KIc 사용은 보수적 baseline이고, 더 큰 Kc credit는 별도 evidence claim입니다.</Misconception>
    </NlpSection>

    <NlpSection id="lefm-validity" marker="06" tone="blue" question="K 계산이 가능하다는 사실과 LEFM이 유효하다는 사실은 같은가?" title="Plastic zone와 remaining ligament가 model-class gate를 결정한다">
      <p>Elastic solution은 crack tip에서 yield를 피할 수 없습니다. 핵심은 yielding이 없는가가 아니라 plastic zone가 crack, ligament, thickness and stress-gradient scale에 비해 충분히 작아 외부 K-field가 지배하는가입니다.</p>
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{r_p^{(ps)}}_{\text{평면응력 소성영역}}&\approx\underbrace{\frac{1}{2\pi}\left(\frac{K_I}{\sigma_{ys}}\right)^2}_{\text{낮은 구속의 추정}}\\[2pt]\underbrace{r_p^{(pe)}}_{\text{평면변형률 소성영역}}&\approx\underbrace{\frac{1}{6\pi}\left(\frac{K_I}{\sigma_{ys}}\right)^2}_{\text{높은 구속의 추정}}\end{aligned}`} meaning="Irwin형 1차 근사는 응력확대계수 K와 항복강도가 소성영역의 대표 크기를 어떻게 정하는지 보여 준다. 이는 상세한 소성영역 형상 해석이 아니라 선형탄성 파괴역학의 적용 가능성을 거르는 화면이다." symbols={[["r_p^(ps)", "plane-stress plastic-zone estimate"],["r_p^(pe)", "plane-strain estimate"],["sigma_ys", "temperature/process-relevant yield strength"]]} />
      <FormulaBlock latex={raw`\underbrace{\eta_{LEFM}}_{\text{모델 유효성 비}}=\max\!\left(\underbrace{\frac{r_p}{a}}_{\text{결함 대비}},\underbrace{\frac{r_p}{W-a}}_{\text{인대 대비}},\underbrace{\frac{r_p}{B}}_{\text{두께 대비}}\right)\ll1`} meaning="Article에서 쓰는 explicit dimensionless audit ratio다. Universal acceptance limit이 아니라 어떤 structural scale과 plastic zone가 경쟁하는지 드러내고, approved method로 handoff할 근거를 만든다." symbols={[["r_p", "selected constraint의 plastic-zone estimate"],["a", "crack size"],["W-a", "remaining ligament"],["B", "thickness"]]} />
      <LefmValidityLab />
      <Takeaway>LEFM invalid는 “분석 불가”가 아니라 model class를 elastic-plastic fracture mechanics, validated FAD formulation or representative component test로 바꾸라는 뜻입니다.</Takeaway>
    </NlpSection>

    <NlpSection id="residual-strength" marker="07" tone="violet" question="현재 crack에서 얼마를 더 버틸 수 있고 어느 size에서 instability가 시작되는가?" title="Critical crack and residual strength를 같은 state equation으로 푼다">
      <p>Residual strength curve는 flaw growth와 static failure를 연결합니다. Service load line이 curve와 만나는 곳이 critical crack state입니다. Surface crack은 `a`만 늘지 않고 `a/c`, crack-front position and through transition이 바뀌므로 geometry solution도 state와 함께 갱신합니다.</p>
      <FormulaBlock latex={raw`\underbrace{K(a_c,\,c_c,\,\sigma_{max})}_{\text{임계 균열 상태의 구동력}}=\underbrace{K_{mat}(B,T,\text{방향})}_{\text{조건부 파괴 저항}}`} meaning="Critical crack size는 fixed Y 공식의 숫자가 아니라 current geometry and material condition에서 driving force equals resistance가 되는 implicit state다." symbols={[["a_c,c_c", "critical surface-crack depth and half-length"],["sigma_max", "declared maximum service/proof load"],["K_mat", "constraint, thickness, temperature and orientation-conditioned resistance"]]} />
      <FormulaBlock latex={raw`\underbrace{\sigma_{res}(a)}_{\text{잔류 강도}}=\underbrace{\frac{K_{mat}}{Y(a)\sqrt{\pi a}}}_{\text{현재 결함에서 허용되는 하중}}`} meaning="단순한 모드 I 역산은 균열이 커질수록 잔류 강도가 낮아짐을 보여 준다. 실제 표면균열 경로에서는 매 단계마다 Y(a,c,φ), 국소 응력 분포, 필요하면 FAD 소성 보정을 갱신해야 한다." symbols={[["sigma_res", "current crack state의 residual nominal strength"],["Y(a)", "state-dependent geometry factor"],["K_mat", "selected material resistance"]]} />
      <ResidualStrengthLab />
      <Misconception>“Critical crack size 5 mm”를 영구 상수로 기록하면 안 됩니다. Load case, material condition, crack aspect, transition rule and analysis version이 달라지면 critical state도 달라집니다.</Misconception>
    </NlpSection>

    <NlpSection id="crack-growth" marker="08" tone="amber" question="Yield 아래 반복 하중이 current crack을 어떤 속도로 critical state까지 옮기는가?" title="Threshold부터 instability까지 growth regimes를 분리한다">
      <p>Fatigue crack growth는 stress-life의 새 버전이 아닙니다. 이미 존재한다고 가정한 crack state를 한 cycle씩 업데이트합니다. Driving range `Delta K`, maximum level, load ratio, closure, environment and crack resistance가 growth law의 입력입니다.</p>
      <FormulaBlock latex={raw`\underbrace{\Delta K}_{\text{한 주기의 구동 범위}}=\underbrace{K_{max}-K_{min}}_{\text{끝값 차이}},\qquad\underbrace{R}_{\text{하중 비}}=\underbrace{\frac{K_{min}}{K_{max}}}_{\text{평균 수준의 흔적}}`} meaning="같은 Delta K라도 Kmax and Kmin 조합이 다르면 closure, environment and instability proximity가 달라질 수 있어 R or full cycle endpoints를 함께 보존한다." symbols={[["Kmax", "cycle maximum stress intensity"],["Kmin", "cycle minimum stress intensity"],["R", "stress-intensity load ratio"]]} />
      <FormulaBlock latex={raw`\begin{aligned}\underbrace{\frac{da}{dN}}_{\text{주기당 성장}}&=\underbrace{C\left[\frac{1-f}{1-R}\Delta K\right]^n}_{\text{폐구를 반영한 중간 성장}}\\[-1pt]&\quad\times\underbrace{\frac{(1-\Delta K_{th}/\Delta K)^p}{(1-K_{max}/K_c)^q}}_{\text{문턱과 불안정 접근 보정}}\end{aligned}`} meaning="NASA 2025 report가 설명한 NASGRO full-range equation structure다. Closure f, threshold and near-fracture acceleration을 분리해 Paris-like middle regime를 양 끝으로 무리하게 외삽하지 않는다." symbols={[["C,n,p,q", "material/environment fit parameters"],["f", "crack-opening/closure function"],["Delta Kth", "threshold range"],["Kc", "fracture resistance used by the growth model"]]} />
      <CrackGrowthLab />
      <Takeaway>Database curve를 고르는 일은 alloy name matching이 아닙니다. Lot/process, orientation, R, temperature, environment and measurement regime가 service state를 보수적으로 감싸는지의 evidence decision입니다.</Takeaway>
    </NlpSection>

    <NlpSection id="spectrum-history" marker="09" tone="green" question="같은 peak와 cycle count를 가진 두 mission이 왜 다른 crack trajectory를 만들 수 있는가?" title="Load order·dwell·environment를 stateful integration에 남긴다">
      <p>Overload는 crack-tip plastic wake를 만들어 뒤 cycle growth를 늦출 수도 있지만, geometry transition or environment-assisted growth를 앞당길 수도 있습니다. Retardation을 credit하지 않는 보수적 analysis와 validated sequence model을 구분해야 합니다.</p>
      <FormulaBlock latex={raw`\underbrace{N(a_0\!\rightarrow a_f)}_{\text{균열 이동 주기}}=\underbrace{\int_{a_0}^{a_f}\frac{da}{F(\Delta K(a),R,\mathcal E,\mathcal H)}}_{\text{상태별 성장률의 역수 적분}}`} meaning="Constant-amplitude analytical form. Geometry changes K(a); environment E and history state H may change growth response, so one average Delta K and one Paris slope로 대체하면 state dependence를 잃는다." symbols={[["a0,af", "initial and final crack state"],["F", "validated growth-rate relation"],["mathcal E", "temperature/corrosion/dwell environment"],["mathcal H", "overload/closure history state"]]} />
      <FormulaBlock latex={raw`\underbrace{a_{k+1}}_{\text{다음 결함 상태}}=\underbrace{a_k}_{\text{현재 상태}}+\underbrace{\Delta N_k\,F(\Delta K_k,R_k,\mathcal E_k,\mathcal H_k)}_{\text{순서가 보존된 성장 증분}}`} meaning="하중 스펙트럼 적분은 결함 상태를 다음 상태로 옮기는 과정이다. 다음 블록의 이력 H_k와 형상이 앞선 블록에 의존하므로 하중 순서를 보존해야 한다. 발생 횟수만 모은 히스토그램으로는 이 순서를 복원할 수 없다." symbols={[["Delta Nk", "block k cycle count"],["Delta Kk,Rk", "block endpoints mapped to current crack geometry"],["Hk", "prior overload/closure state"]]} />
      <SpectrumHistoryLab />
      <Misconception>Overload retardation을 무시하면 언제나 보수적이라는 단순 문장도 범위를 갖습니다. Environment-assisted cracking, load interaction model and failure coordinate에 따라 무엇을 무시했는지 명시해야 합니다.</Misconception>
    </NlpSection>

    <NlpSection id="fad" marker="10" tone="blue" question="K가 toughness보다 작아도 ligament가 plastic collapse하면 어떻게 판단할까?" title="FAD에서 fracture and collapse interaction을 하나의 trajectory로 본다">
      <p>Failure Assessment Diagram은 fracture ratio `Kr`와 plastic-collapse ratio `Lr`를 같은 좌표에 놓습니다. Assessment point가 failure assessment line 안쪽이면 선택한 formulation 안에서 non-failure, 바깥이면 failure state입니다. Crack growth는 점을 이동시킵니다.</p>
      <FormulaBlock latex={raw`\underbrace{K_r}_{\text{파괴 좌표}}=\underbrace{\frac{K_{app}}{K_{mat}}}_{\text{구동력 대비 저항}},\qquad\underbrace{L_r}_{\text{붕괴 좌표}}=\underbrace{\frac{P}{P_L}}_{\text{일차 하중 대비 한계하중}}`} meaning="K_r은 파괴에 얼마나 가까운지, L_r은 소성 붕괴에 얼마나 가까운지를 나타낸다. FAL 식, 기준응력, 국소·전역 한계하중 선택은 숨겨진 소프트웨어 기본값이 아니라 결과의 일부로 기록해야 한다." symbols={[["Kapp", "primary plus applicable secondary SIF contributions"],["Kmat", "selected fracture resistance"],["P", "primary mechanical load"],["PL", "declared plastic limit load"]]} />
      <FormulaBlock latex={raw`\underbrace{\sigma_{res}(X)}_{\text{용접 잔류응력 장}}=\underbrace{\sum_{i=0}^{6}C_iX^i}_{\text{두께 좌표의 다항식 표현}}`} meaning="NASA 2025 report의 residual-stress input form. The static residual field contributes to SIF at each growth step but is not spectrum-scaled as if it were primary pressure/load." symbols={[["X", "normalized or declared through-thickness coordinate"],["Ci", "measured/approved residual-stress fit coefficients"],["sigma_res", "self-equilibrating residual stress field"]]} />
      <FadLab />
      <Takeaway>NASGRO와 다른 FFS tool의 Lr가 다르면 어느 쪽이 틀렸다고 바로 결론내리지 않습니다. Local/global reference stress, limit-load definition, crack transition and plasticity correction를 먼저 대조합니다.</Takeaway>
    </NlpSection>

    <NlpSection id="inspection" marker="11" tone="amber" question="Predicted remaining life를 실제 inspection interval로 어떻게 바꾸는가?" title="NDE capability and detectable window를 analysis initial condition에 연결한다">
      <p>NDE는 flaw가 없음을 증명하는 장치가 아니라 특정 geometry에서 특정 크기 이상을 일정 probability and confidence로 찾아내는 process입니다. NASA-STD-5019A Change 4는 metallic fracture-critical part에서 surface and volumetric inspection expectation, analyzed flaw와 screening capability의 연결, 90/95 capability를 명시합니다.</p>
      <FormulaBlock latex={raw`\underbrace{P\!\left(POD(a_{90/95})\ge0.90\right)}_{\text{검출확률 주장에 대한 신뢰}}\ge\underbrace{0.95}_{\text{통계적 신뢰 수준}}`} meaning="90/95를 한 번의 90% 성공률로 오해하지 않게 풀어 쓴 conceptual statement다. Representative flaw set, method, operator, access and orientation이 qualification population과 service inspection에서 일치해야 한다." symbols={[["POD(a)", "flaw size a에서 probability of detection"],["a90/95", "90% POD를 95% confidence로 lower-bound한 flaw size"]]} />
      <FormulaBlock latex={raw`\underbrace{t_{inspect}}_{\text{검사 간격}}\;<\;\underbrace{\frac{t(a_{det}\!\rightarrow a_c)}{F_{life}}}_{\text{검출 가능 상태에서 임계 상태까지의 보수적 창}}`} meaning="검사 간격은 신뢰성 있게 검출 가능한 결함이 임계 결함까지 자라는 시간보다 짧아야 하며, 승인된 수명계수 또는 불확실성 여유로 더 줄인다. 달력 일정, 접근성, 수리 가능성, 반복 검사의 신뢰도는 별도 관문이다." symbols={[["adet", "qualified detectable flaw size"],["ac", "critical crack state"],["Flife", "program-approved uncertainty/life factor"]]} />
      <NdeInspectionLab />
      <Misconception>Proof test도 perfect filter가 아닙니다. Test environment and load path가 service crack을 충분히 drive해야 하며, proof 중 flaw growth and newly introduced damage를 다루기 위해 pre/post NDE and representative test evidence가 필요할 수 있습니다.</Misconception>
    </NlpSection>

    <NlpSection id="evidence-ledger" marker="12" tone="teal" question="Green analysis point를 release 가능한 engineering evidence로 만들려면 무엇이 더 필요한가?" title="Design·analysis·test·NDE·tracking을 하나의 living ledger로 닫는다">
      <p>NASA standard의 가장 중요한 교훈은 특정 factor가 아니라 fracture control이 <strong>design, analysis, test, NDE and tracking</strong>의 결합이라는 점입니다. Robot product에 그 표준을 자동 적용할 수는 없지만, 계산과 실제 part identity 사이의 끊어진 link를 찾는 process model로는 강력합니다.</p>
      <FormulaBlock latex={raw`\underbrace{e_q}_{\text{관측 q의 정규화 잔차}}=\underbrace{\frac{q_{model}-q_{test}}{u_{model}+u_{test}}}_{\text{차이를 결합 불확실성으로 나눔}}`} meaning="Model-test mismatch를 percent 하나로 숨기지 않고 declared uncertainty scale로 normalize하는 audit variable다. Universal hypothesis test가 아니라 어떤 evidence layer를 revise할지 순서를 정하는 diagnostic이다." symbols={[["qmodel,qtest", "같은 reference state에서 비교한 prediction and measurement"],["umodel,utest", "declared modeling and measurement uncertainty scales"]]} />
      <FormulaBlock latex={raw`\underbrace{\mathcal C_{part}}_{\text{재현 가능한 부품 상태}}=\underbrace{\{ID,\,M,\,G,\,L,\,I,\,R,\,V\}}_{\text{재료·형상·하중·검사·수리·버전 기록}}`} meaning="파괴 판정은 일련번호, 재료·공정, 형상·균열, 하중 스펙트럼, 검사, 수리, 모델·소프트웨어 버전이 통제된 부품 상태에 묶여야 한다. 이 집합 표기는 물리 법칙이 아니라 추적성 계약이다." symbols={[["ID", "part serial/configuration identity"],["M,G,L", "material/process, geometry/flaw, load/environment"],["I,R,V", "inspection, repair and analysis/version records"]]} />
      <FractureEvidenceLab />
      <CapabilityCheck items={[
        'Inspection indication을 surface/corner/embedded/through analysis crack으로 이상화하고 interaction boundary를 설명한다.',
        'Griffith G, Irwin K, geometry factor and toughness를 하나의 causal chain으로 연결한다.',
        'Plastic-zone/ligament/constraint를 보고 LEFM 결과를 사용할지 handoff할지 판단한다.',
        'Threshold, Paris-like region, instability, R, sequence and environment가 crack trajectory에 미치는 역할을 구분한다.',
        'FAD에서 primary and secondary stress, fracture and plastic collapse coordinates를 분리한다.',
        'NDE 90/95 capability, assumed initial flaw, detectable window and inspection interval을 서로 연결한다.',
        'Model, solver, coupon, NDE, component test and part configuration을 traceable evidence ledger로 만든다.',
      ]} />
      <div className="not-prose my-8 grid gap-3 sm:grid-cols-3"><Link className="group rounded-md border border-border p-4 transition-colors hover:border-blue-500/50" to={articlePath('ai','paper-griffith-rupture-flow-solids-1921')}><span className="text-xs font-black text-blue-700 dark:text-blue-300">FOUNDATIONAL SOURCE</span><p className="mt-2 text-sm font-black">Griffith 1921 원문 재구성</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Energy balance, glass evidence and final correction note까지 읽는다.</p><ArrowRight className="mt-4 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link><Link className="group rounded-md border border-border p-4 transition-colors hover:border-teal-500/50" to={articlePath('ai','research-nasa-nasgro-fitness-for-service-2025')}><span className="text-xs font-black text-teal-700 dark:text-teal-300">CURRENT SOURCE</span><p className="mt-2 text-sm font-black">NASA NASGRO FFS 2025 재구성</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">FAD, growth, material choices and unresolved solver differences를 읽는다.</p><ArrowRight className="mt-4 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link><Link className="group rounded-md border border-border p-4 transition-colors hover:border-amber-500/50" to={articlePath('ai','robot-composite-structures-joints-damage')}><span className="text-xs font-black text-amber-700 dark:text-amber-300">NEXT PHYSICAL LAYER</span><p className="mt-2 text-sm font-black">Composite Structures</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Ply axes, joints, delamination, BVID and building-block evidence로 확장한다.</p><ArrowRight className="mt-4 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div>
      <SourceNotes sources={[
        { label: 'Griffith, The Phenomena of Rupture and Flow in Solids (1921)', href: 'https://royalsocietypublishing.org/doi/10.1098/rsta.1921.0006', note: 'Energy criterion and glass evidence의 1차 출처. Final author correction note를 함께 반영했다.' },
        { label: 'NASA-TM-103591, Linear Elastic Fracture Mechanics Primer (1992)', href: 'https://ntrs.nasa.gov/citations/19920021173', note: 'Griffith-to-Irwin, modes, plastic zone, toughness, growth and fracture-control bridge.' },
        { label: 'NASA-STD-5019A w/Change 4', href: 'https://standards.nasa.gov/standard/nasa/nasa-std-5019', note: 'Revalidated 2025-09-05. Assumed flaw, loading spectrum, NDE and tracking process boundary.' },
        { label: 'NASA/CR-20250011200, NASGRO Fitness-For-Service (2025)', href: 'https://ntrs.nasa.gov/citations/20250011200', note: 'FAD, full-range growth, residual stress and four notional examples의 current primary report.' },
      ]} />
      <Takeaway>Damage tolerance는 “crack을 계산하는 공식”이 아니라 flaw가 남아 있다는 전제 아래도 언제 발견하고, 얼마나 남았고, 어느 evidence로 계속 운용할지를 추적하는 폐쇄 루프입니다. Composite delamination and barely visible impact damage는 이 metallic K-based framework에 얕게 합치지 않고 다음 별도 기반으로 다룹니다.</Takeaway>
    </NlpSection>
  </>;
}
