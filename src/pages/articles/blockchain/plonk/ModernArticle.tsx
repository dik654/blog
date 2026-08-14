import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import PLONKPipelineViz from "./viz/PLONKPipelineViz";

export default function ModernPLONKArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">산술 관계를 표로 배치하는 PLONK</p><h2 className="text-3xl font-bold tracking-tight">Gate·copy constraint·polynomial opening을 서로 다른 책임으로 나눈다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">공개 x=3, y=12와 비공개 witness w=4에 대해 x·w=y를 증명한다고 합시다. PLONK는 값을 a·b·c 같은 witness column의 row에 놓고, selector가 그 row에서 어떤 산술식을 적용할지 정합니다. 같은 값이 다른 row에서 다시 쓰인다는 사실은 별도의 permutation argument가 검사합니다.</p>
        <p>이 표를 evaluation domain H 위의 다항식으로 보간하면 모든 row의 gate·copy 조건을 quotient identity로 묶을 수 있습니다. Prover는 먼저 wire·permutation·quotient polynomial에 commit하고, transcript challenge ζ에서 필요한 값을 엽니다. KZG 또는 IPA 같은 polynomial commitment scheme(PCS)은 PLONK의 산술 규칙과 별개의 backend입니다.</p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> “이 row의 산술이 맞다”, “서로 연결된 cell 값이 같다”, “commit한 polynomial이 challenge point에서 이 값을 갖는다”를 gate identity·grand product·PCS opening으로 각각 증명한 뒤 transcript로 한 statement에 결속합니다.</aside>
        <ContentBoundary article="plonk" />
        <PLONKPipelineViz />
      </section>

      <section id="arithmetization" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · PLONKish arithmetization</p><h2 className="mt-2 text-2xl font-bold">Selector를 바꾸면 같은 세 column에서 여러 gate를 표현할 수 있다</h2></header>
        <ExplainedFormula
          question="한 row의 a·b·c 값에 덧셈·곱셈·상수 gate를 어떻게 선택적으로 적용하는가?"
          idea={<>고정 selector q를 coefficient로 사용해 한 공통 gate 식을 만듭니다. Multiplication row에서는 qM=1, qO=−1만 켜면 ab−c=0이 됩니다.</>}
          formula={String.raw`q_Mab+q_La+q_Rb+q_Oc+q_C=0\quad\text{on every row of }H`}
          terms={[
            { symbol: "a,b,c", name: "Witness cells", description: "한 row의 세 advice/wire column 값입니다." },
            { symbol: "q_M", name: "Multiplication selector", description: "a·b 항을 켜고 크기를 정합니다." },
            { symbol: "q_L,q_R,q_O", name: "Linear selectors", description: "각 wire의 선형 coefficient입니다." },
            { symbol: "q_C", name: "Constant selector", description: "Row별 고정 상수 항입니다." },
            { symbol: "H", name: "Evaluation domain", description: "모든 활성 row를 나타내는 roots-of-unity 집합입니다." },
          ]}
          assumptions={["Selector·wire column의 row 수와 domain ordering이 proving/verifying key에 고정됩니다.", "모든 값은 field 원소이며 bit·range·integer overflow 의미는 lookup/range constraint로 따로 강제합니다.", "활성화되지 않은 selector와 padding row가 의도치 않은 자유도를 만들지 않게 boundary/blinding row를 설계합니다."]}
          interpretation="a=3,b=4,c=12와 qM=1,qO=−1이면 3·4−12=0입니다. c=11이면 값이 1이라 실패합니다. 그러나 field에서 p−1은 −1과 같으므로 일반 정수 부호·범위를 원한다면 추가 제약이 필요합니다."
        />
        <p>Custom gate는 더 높은 degree의 관계를 한 row에 담아 row 수를 줄일 수 있지만 quotient degree와 prover/opening 비용을 높일 수 있습니다. 따라서 “constraint 수 감소”만으로 빠르다고 결론내리지 말고 maximum gate degree, column 수, rotation, lookup, quotient split, MSM/FFT를 함께 측정해야 합니다.</p>
      </section>

      <section id="permutation" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Permutation argument</p><h2 className="mt-2 text-2xl font-bold">Copy constraint를 값의 permutation equality로 바꾼다</h2></header>
        <p>예를 들어 첫 row의 c=12를 다음 row의 a로 재사용한다면 두 cell을 같은 wire로 연결해야 합니다. 각 cell에 identity label idᵢ를 붙이고 연결 관계를 permutation σ(i)로 나타냅니다. Random challenge β,γ로 값과 위치를 섞은 product를 비교하면 prover가 같은 multiset을 유지했는지 높은 확률로 검사할 수 있습니다.</p>
        <ExplainedFormula
          question="모든 copy edge의 equality를 왜 하나의 running product로 검사할 수 있는가?"
          idea={<>현재 cell value와 원래 위치 label을 곱한 분자를, 같은 value와 permutation된 label을 곱한 분모와 row마다 누적합니다. 모든 copy가 맞으면 마지막 product가 1로 돌아옵니다.</>}
          formula={String.raw`Z(\omega X)=Z(X)\prod_{j\in\{a,b,c\}}\frac{j(X)+\beta\,\mathrm{id}_j(X)+\gamma}{j(X)+\beta\,\sigma_j(X)+\gamma},\qquad Z(1)=1`}
          terms={[
            { symbol: "Z", name: "Grand-product polynomial", description: "Row를 따라 numerator/denominator ratio를 누적합니다." },
            { symbol: String.raw`\omega`, name: "Domain generator", description: "X에서 다음 row ωX로 이동시킵니다." },
            { symbol: String.raw`\mathrm{id}_j`, name: "Identity labels", description: "각 column·row cell의 원래 위치를 field 원소로 구분합니다." },
            { symbol: String.raw`\sigma_j`, name: "Permutation labels", description: "Copy wiring이 가리키는 대상 위치를 encode합니다." },
            { symbol: String.raw`\beta,\gamma`, name: "Transcript challenges", description: "Prover가 충돌을 미리 맞추기 어렵게 값과 위치를 무작위 선형 결합합니다." },
          ]}
          assumptions={["Wire commitments와 permutation polynomials가 β,γ를 뽑기 전에 transcript에 고정됩니다.", "Denominator zero와 challenge sampling은 protocol이 정한 방식으로 다루며 field가 충분히 큽니다.", "Boundary Z(1)=1과 마지막-row closure, identity-label 충돌 방지가 모두 강제됩니다."]}
          interpretation="두 cell 값이 12와 11인데 같은 copy cycle로 표시되면 random β,γ에서 product가 닫히지 않는 것이 일반적입니다. 그러나 challenge를 prover가 미리 고르거나 boundary를 빼면 조작한 Z를 만들 수 있으므로 recurrence 하나만 검사해서는 안 됩니다."
        />
        <p><strong>작은 product 예:</strong> 값 multiset [3,4,12]를 permutation한 [12,3,4]는 γ=2일 때 (5·6·14)/(14·5·6)=1입니다. [12,3,5]로 하나를 바꾸면 분모가 14·5·7이 되어 1이 아닙니다. 실제 PLONK는 β가 위치 label도 섞어 같은 값의 잘못된 위치 연결을 구분합니다.</p>
      </section>

      <section id="opening-security" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Quotient·PCS·Fiat–Shamir</p><h2 className="mt-2 text-2xl font-bold">모든 항을 commit한 뒤 무작위 점에서 한 identity로 모은다</h2></header>
        <p>Gate·permutation·public-input·boundary constraint에 α의 거듭제곱을 곱해 하나의 numerator N(X)로 합치고, domain vanishing polynomial Z_H(X)=Xⁿ−1로 나눈 quotient T(X)=N(X)/Z_H(X)를 만듭니다. T가 degree limit을 넘으면 여러 조각으로 나눠 commit합니다. Verifier는 domain 밖 challenge ζ에서 N(ζ)=T(ζ)Z_H(ζ)를 확인하고 PCS opening으로 commitment와 evaluation을 결속합니다.</p>
        <ExplainedFormula
          question="PLONK verifier가 여러 constraint를 한 challenge point에서 묶어 확인하는 핵심 등식은 무엇인가?"
          idea={<>서로 다른 constraint family를 α powers로 섞은 N이 domain 전체에서 0이면 ZH로 나누어집니다. Commitment를 먼저 고정한 뒤 ζ에서 quotient identity와 batch opening을 확인합니다.</>}
          formula={String.raw`N(X)=T(X)Z_H(X),\quad Z_H(X)=X^n-1,\qquad N(\zeta)\stackrel{?}{=}T(\zeta)(\zeta^n-1)`}
          terms={[
            { symbol: "N", name: "Combined constraint numerator", description: "Gate·permutation·boundary·public-input 식을 challenge α로 분리해 합칩니다." },
            { symbol: "T", name: "Quotient polynomial", description: "N을 domain vanishing polynomial로 나눈 결과입니다." },
            { symbol: "Z_H", name: "Domain vanishing polynomial", description: "n개 evaluation-domain point에서 모두 0입니다." },
            { symbol: String.raw`\zeta`, name: "Evaluation challenge", description: "Commitments 뒤 transcript에서 얻는 domain 밖 검사점입니다." },
            { symbol: "n", name: "Domain size", description: "보통 roots-of-unity FFT가 가능한 2의 거듭제곱으로 padding합니다." },
          ]}
          assumptions={["Commitment scheme의 binding·degree bound·opening soundness와 setup model을 별도로 충족합니다.", "Transcript는 protocol/version, SRS/key ID, circuit, public inputs, 모든 이전 commitment/evaluation을 canonical하게 흡수합니다.", "ζ가 domain이나 forbidden set에 들어가는 경우와 batch challenge collision을 규격대로 처리합니다."]}
          interpretation="이 식의 성공은 committed polynomials가 challenge에서 일관됨을 뜻합니다. KZG를 썼다면 pairing/DLP 계열과 SRS toxic waste를, IPA를 썼다면 다른 discrete-log와 proof-size 비용을 따릅니다. PLONK라는 이름만으로 PCS 가정이 정해지지 않습니다."
        />
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-6"><strong>Fiat–Shamir 실패 반례:</strong> Prover가 wire commitment를 보내기 전에 β·γ를 알거나, verifier가 public input을 transcript에서 빼면 challenge에 맞는 witness/permutation을 선택하거나 proof를 다른 statement에 재사용할 수 있습니다. Round 순서·domain separator·canonical bytes는 수학식 밖의 보안 입력입니다.</div>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[780px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">축</th><th className="p-3">측정값</th><th className="p-3">해석 경계</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3 font-medium text-foreground">Arithmetization</td><td className="p-3">Rows·columns·degree·rotations·lookups</td><td className="p-3">Row 수만으로 prover latency를 예측하지 않음</td></tr><tr><td className="p-3 font-medium text-foreground">Prover</td><td className="p-3">Witness·FFT·MSM/opening·peak RSS·p50/p95</td><td className="p-3">같은 circuit/input/backend/threads에서 paired 비교</td></tr><tr><td className="p-3 font-medium text-foreground">Verifier</td><td className="p-3">Transcript·field ops·MSM·pairing/IPA·proof bytes</td><td className="p-3">PCS와 batch size·public inputs를 명시</td></tr><tr><td className="p-3 font-medium text-foreground">Security</td><td className="p-3">Wrong input·bad opening·bad subgroup·round reorder·SRS mismatch</td><td className="p-3">모든 negative fixture가 fail closed한 뒤 성능 비교</td></tr></tbody></table></div>
        <div id="paper-plonk"><CitationBlock source="Gabizon·Williamson·Ciobotaru · PLONK (IACR ePrint 2019/953)" citeKey={1} href="https://eprint.iacr.org/2019/953.pdf">
          <p><strong>문제:</strong> 회로마다 새 trusted setup을 하지 않으면서 범용 산술 회로를 succinct하게 증명하고 싶습니다.</p>
          <p><strong>기여:</strong> Lagrange-basis gate arithmetization, permutation grand product와 universal updatable SRS 기반 SNARK construction을 제시합니다.</p>
          <p><strong>전제:</strong> 논문의 polynomial commitment·pairing/knowledge assumptions, random-oracle Fiat–Shamir, 올바른 SRS contribution과 degree bound를 사용합니다.</p>
          <p><strong>근거 범위:</strong> 원 논문의 gate/permutation protocol, proof와 당시 benchmark configuration에 한정합니다.</p>
          <p><strong>말하지 않는 것:</strong> 모든 “PLONKish” 구현이 같은 round·lookup·PCS·proof size·보안 reduction을 가진다는 뜻은 아닙니다.</p>
        </CitationBlock></div>
        <div id="paper-kzg"><CitationBlock source="Kate·Zaverucha·Goldberg · Constant-Size Commitments to Polynomials (ASIACRYPT 2010)" citeKey={2} href="https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf">
          <p><strong>문제:</strong> 큰 polynomial을 짧게 commit하고 특정 point evaluation을 짧게 열고 싶습니다.</p>
          <p><strong>기여:</strong> Pairing 기반 상수 크기 polynomial commitment와 evaluation witness를 정의합니다.</p>
          <p><strong>전제:</strong> Degree-bounded SRS, bilinear group과 논문의 binding/hiding assumptions를 사용합니다.</p>
          <p><strong>근거 범위:</strong> KZG PCS의 commit/open/verify와 원 논문의 applications에 한정합니다.</p>
          <p><strong>말하지 않는 것:</strong> PLONK gate·permutation soundness, transparent setup, post-quantum security나 모든 batching variant를 보장하지 않습니다.</p>
        </CitationBlock></div>
        <p>이 글의 10문항은 witness table, selector gate 계산, integer/field 반례, copy constraint, grand product, boundary, quotient, PCS 분리, transcript 순서, cost/security release gate를 묻습니다. 각 답에 필요한 수치 예·proof idea·가정·실패 예는 위에 있습니다.</p>
      </section>
    </article>
  );
}
