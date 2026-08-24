import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ConstraintPipelineViz from "./viz/ConstraintPipelineViz";

export default function ModernConstraintSystemsArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">공개 입력과 witness에서 시작하는 제약 시스템</p>
          <h2 className="text-3xl font-bold tracking-tight">프로그램을 “모든 제약식을 만족하는 값이 있는가”로 바꾼다</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          Alice가 공개값 <strong>x=3, y=12</strong>를 제시하면서 비공개값 <strong>w=4</strong>를 안다고 증명하고 싶다고 합시다. 검증할 관계는 x·w=y 한 줄입니다. x와 y는 누구나 보는 <strong>public input</strong>, w는 증명자만 아는 <strong>witness</strong>입니다. 제약 시스템은 이 관계를 유한체 위의 반복 가능한 형식으로 번역합니다.
        </p>
        <p>상수 1, 공개 입력, witness를 한 벡터 z=(1,x,y,w)에 넣으면 verifier가 알아야 하는 값과 prover만 넣을 값을 분리하면서도 같은 식에 사용할 수 있습니다. 여기서 “회로가 만족된다”는 말은 올바른 z가 존재해 모든 행의 등식이 동시에 성립한다는 뜻이지, witness가 공개된다는 뜻이 아닙니다.</p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> R1CS는 계산을 여러 개의 “선형식 × 선형식 = 선형식” 행으로 만들고, QAP는 모든 행을 하나의 다항식 나눗셈 조건으로 압축합니다. 증명 시스템은 그 조건을 직접 다 공개하지 않고 cryptographic check로 바꿉니다.</aside>
        <ContentBoundary article="constraint-systems" />
        <ConstraintPipelineViz />
      </section>

      <section id="r1cs" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · R1CS</p><h2 className="mt-2 text-2xl font-bold">한 행은 세 선형식과 한 곱셈을 갖는다</h2></header>
        <p>R1CS(rank-1 constraint system)의 “rank-1”은 각 행의 quadratic part가 두 선형식의 곱 하나라는 뜻입니다. z=(1,3,12,4), A=(0,1,0,0), B=(0,0,0,1), C=(0,0,1,0)로 두면 각 dot product는 3, 4, 12가 되어 3·4=12를 확인합니다.</p>
        <ExplainedFormula
          question="m개의 산술 제약을 witness vector 하나에 대해 어떤 표준형으로 검사하는가?"
          idea={<>각 행 i에서 Aᵢ·z와 Bᵢ·z라는 두 선형 조합을 곱하고 Cᵢ·z와 비교합니다. 같은 z를 모든 행이 공유하기 때문에 중간값의 일관성도 강제할 수 있습니다.</>}
          formula={String.raw`\forall i\in\{1,\ldots,m\}:\quad \langle A_i,z\rangle\,\langle B_i,z\rangle=\langle C_i,z\rangle\quad\text{in }\mathbb F_p`}
          annotatedFormula={String.raw`\forall i\in\{1,\ldots,m\}:\quad \langle A_i,z\rangle\,\langle B_i,z\rangle=\underbrace{\langle C_i,z\rangle\quad\text{in }\mathbb F_p}_{\text{Linear combination 계산}}`}
          operations={[
            { expression: String.raw`\langle C_i,z\rangle\quad\text{in }\mathbb F_p`, annotation: ["Linear combination이(가) 식의 결과에 기여하는","방식을 계산합니다.","각 행 i에서 Aᵢ·z와 Bᵢ·z라는 두 선형 조합을 곱하고","Cᵢ·z와 비교합니다."] },
          ]}
          terms={[
            { symbol: String.raw`\mathbb F_p`, name: "Prime field", description: "모든 덧셈·곱셈이 mod p에서 이루어지는 유한체입니다." },
            { symbol: "z", name: "Assignment vector", description: "상수 1, public input, output과 private witness를 정해진 순서로 담습니다." },
            { symbol: "A_i,B_i,C_i", name: "Constraint row", description: "i번째 제약의 세 coefficient vector입니다." },
            { symbol: String.raw`\langle A_i,z\rangle`, name: "Linear combination", description: "Coefficient와 assignment의 dot product입니다." },
            { symbol: "m", name: "Constraint count", description: "모든 행을 동시에 통과해야 하는 총 제약 수입니다." },
          ]}
          assumptions={["Field modulus p, 변수 순서, public/witness partition이 회로와 key에 동일하게 고정됩니다.", "Integer·bit·range 의미는 field equation만으로 생기지 않으므로 boolean/range gadget을 별도로 넣습니다.", "Witness 생성 성공과 제약 만족을 분리해 검사하며 누락된 제약은 증명 시스템이 복원하지 못합니다."]}
          interpretation="행별 등식이 모두 맞으면 z는 이 R1CS instance를 만족합니다. 그러나 원래 프로그램의 의미를 정확히 번역했는지는 compiler·gadget 검토의 책임이며, field wraparound를 일반 정수 곱셈으로 오해해서는 안 됩니다."
        />
        <h3 className="text-xl font-semibold">중간값과 gadget은 왜 필요한가</h3>
        <p>식 y=(x+1)(x+2)는 v=x+1이라는 witness 변수를 두고 (x+1)·1=v, v·(x+2)=y 두 행으로 나눌 수 있습니다. Boolean b에는 b(b−1)=0을 넣어 b∈&#123;0,1&#125;을 강제합니다. 반대로 이 제약을 빼면 b=2도 field 원소로는 허용되므로 conditional gadget이 의도와 다른 값을 받아들일 수 있습니다.</p>
        <div className="overflow-x-auto rounded-lg border border-border"><table className="min-w-[680px] w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">비용</th><th className="p-3">세는 단위</th><th className="p-3">주의할 경계</th></tr></thead><tbody className="divide-y divide-border text-muted-foreground"><tr><td className="p-3 font-medium text-foreground">Prover</td><td className="p-3">행 수, nonzero coefficient, witness 생성, FFT/MSM</td><td className="p-3">행 수만 같아도 sparsity·backend에 따라 시간은 다름</td></tr><tr><td className="p-3 font-medium text-foreground">Memory</td><td className="p-3">Assignment·matrix·polynomial·MSM bucket</td><td className="p-3">Peak RSS와 serialized key를 분리</td></tr><tr><td className="p-3 font-medium text-foreground">Correctness</td><td className="p-3">Valid·invalid·boundary witness fixture</td><td className="p-3">증명 생성 성공을 semantic completeness로 확대하지 않음</td></tr></tbody></table></div>
      </section>

      <section id="qap" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · QAP</p><h2 className="mt-2 text-2xl font-bold">행마다 맞던 값을 한 다항식 divisibility로 묶는다</h2></header>
        <p>m개 행에 서로 다른 field point r₁,…,rₘ을 붙이고, 각 변수 j의 A·B·C coefficient column을 그 점들에서 갖는 다항식 Aⱼ(X), Bⱼ(X), Cⱼ(X)로 Lagrange 보간합니다. Assignment zⱼ로 이들을 선형 결합하면 각 rᵢ에서 원래 i번째 R1CS 등식이 재현됩니다.</p>
        <ExplainedFormula
          question="모든 R1CS 행의 만족을 왜 target polynomial의 나눗셈 하나로 표현할 수 있는가?"
          idea={<>각 행 point에서 P(X)=A(X)B(X)−C(X)가 0이 되게 만듭니다. 모든 rᵢ를 root로 가지면 그 곱 t(X)가 P(X)를 나누므로 quotient h(X)가 존재합니다.</>}
          formula={String.raw`A(X)=\sum_j z_jA_j(X),\ B(X)=\sum_j z_jB_j(X),\ C(X)=\sum_j z_jC_j(X),\quad A(X)B(X)-C(X)=h(X)t(X),\quad t(X)=\prod_{i=1}^{m}(X-r_i)`}
          annotatedFormula={String.raw`A(X)=\underbrace{\sum_j z_jA_j(X),\ B(X)=\sum_j z_jB_j(X),\ C(X)=\sum_j z_jC_j(X),\quad A(X)B(X)-C(X)=h(X)t(X),\quad t(X)=\prod_{i=1}^{m}(X-r_i)}_{\text{Vanishing polynomial 계산}}`}
          operations={[
            { expression: String.raw`\sum_j z_jA_j(X),\ B(X)=\sum_j z_jB_j(X),\ C(X)=\sum_j z_jC_j(X),\quad A(X)B(X)-C(X)=h(X)t(X),\quad t(X)=\prod_{i=1}^{m}(X-r_i)`, annotation: ["Vanishing polynomial이(가) 식의 결과에","기여하는 방식을 계산합니다.","각 행 point에서 P(X)=A(X)B(X)−C(X)가 0이","되게 만듭니다."] },
          ]}
          terms={[
            { symbol: "A_j,B_j,C_j", name: "Column polynomials", description: "행 point에서 변수 j의 R1CS coefficient를 재현합니다." },
            { symbol: "A,B,C", name: "Assignment polynomials", description: "Witness coefficient zⱼ로 column polynomials를 합친 결과입니다." },
            { symbol: "t(X)", name: "Vanishing polynomial", description: "모든 constraint point rᵢ에서 0인 target polynomial입니다." },
            { symbol: "h(X)", name: "Quotient", description: "모든 제약이 맞을 때 exact polynomial division으로 얻습니다." },
            { symbol: "r_i", name: "Row point", description: "서로 달라야 interpolation이 유일합니다." },
          ]}
          assumptions={["rᵢ들은 field 안에서 서로 다르고 field size가 행 수보다 충분히 큽니다.", "보간·나눗셈은 같은 field와 동일한 row/column ordering을 사용합니다.", "다항식 항등식은 degree bound와 commitment/opening 검사를 함께 가져야 임의 고차항을 막을 수 있습니다."]}
          interpretation="P(rᵢ)=0이 모든 i에서 성립하는 것과 t|P가 동치라는 것이 증명 아이디어입니다. 단, verifier가 임의 한 점에서만 값을 비교한다면 거짓 다항식이 우연히 맞을 확률은 degree/field-size에 의해 제한될 뿐 0은 아닙니다."
        />
        <p><strong>수치 예:</strong> 한 행뿐이면 r₁=1, t(X)=X−1입니다. 위 xw=y assignment에서 A(X)=3, B(X)=4, C(X)=12이므로 P(X)=0이고 h(X)=0입니다. w=5라면 P(X)=3이 되어 X−1로 나누어떨어지지 않습니다. 여러 행에서는 보간한 P가 모든 rᵢ에서 0인지가 같은 원리로 묶입니다.</p>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-6"><strong>실패 반례:</strong> public input ordering이 setup 때 (x,y)였는데 verifier가 (y,x)로 넣으면 같은 proof bytes라도 다른 statement를 검사합니다. 또한 누락된 range constraint는 완벽한 QAP·SNARK로도 고칠 수 없습니다. 먼저 회로 semantic fixture를 통과시키고 그다음 cryptographic proof를 benchmark해야 합니다.</div>
      </section>

      <section id="verification" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 증명으로 넘기는 경계</p><h2 className="mt-2 text-2xl font-bold">QAP는 cryptography가 아니라 검증할 algebraic relation이다</h2></header>
        <p>R1CS/QAP 자체는 witness를 숨기거나 proof를 짧게 만들지 않습니다. Groth16은 relation별 CRS와 pairing으로 QAP를 압축하고, PLONK는 gate·permutation polynomial과 polynomial commitment opening으로 같은 목표를 다른 arithmetization에서 이룹니다. 따라서 constraint count, setup model, commitment assumption, transcript, public-input encoding을 따로 기록해야 합니다.</p>
        <div id="paper-pinocchio-qap"><CitationBlock source="Parno et al. · Pinocchio (IEEE S&amp;P 2013)" citeKey={1} href="https://eprint.iacr.org/2013/279.pdf">
          <p><strong>문제:</strong> 일반 계산의 실행을 원래 계산보다 싸게 공개 검증하고 싶습니다.</p>
          <p><strong>기여:</strong> Arithmetic circuit을 QAP로 바꾸고 pairing 기반 공개 검증·zero-knowledge 변형과 toolchain을 제시합니다.</p>
          <p><strong>전제:</strong> 논문의 pairing·knowledge assumptions, 회로별 key generation, 올바른 circuit compilation을 사용합니다.</p>
          <p><strong>근거 범위:</strong> QAP reduction과 논문에 보고된 일곱 application·당시 구현 조건에 한정합니다.</p>
          <p><strong>말하지 않는 것:</strong> 현재 모든 library의 안전성, 모든 회로의 고정 speedup, 누락된 constraint의 자동 발견을 보장하지 않습니다.</p>
        </CitationBlock></div>
        <p>이 글의 10문항은 public/witness partition, 한 행 계산, 중간 변수, Boolean 반례, constraint 비용, 보간, divisibility 증명, 잘못된 witness, degree/random-point 경계, semantic release gate를 묻습니다. 답에 필요한 식·수치 예·전제·반례를 위 절들에 모두 두었습니다.</p>
      </section>
    </article>
  );
}
