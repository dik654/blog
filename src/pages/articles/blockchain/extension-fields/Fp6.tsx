import ExplainedFormula from "@/components/ui/explained-formula";
import CodePanel from "@/components/ui/code-panel";
import FieldTowerViz from "./viz/FieldTowerViz";

const layoutCode = `type Fq2 = QuadExtField<Fq2Config>;
type Fq6 = CubicExtField<Fq6Config>;

// c0 + c1*v + c2*v², each ci is Fq2
struct CubicExtField<C> { c0: C::Base, c1: C::Base, c2: C::Base }

// v³ = ξ: high powers return through a profile-specific non-residue multiply.
fn mul_by_nonresidue(x: Fq2) -> Fq2 { /* pinned config */ }`;

export default function Fp6() {
  return (
    <section id="fp6" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Fp⁶: Fp² coefficient 세 개를 cubic relation으로 접는다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Fp⁶ 원소는 <code>c₀+c₁v+c₂v²</code>이며 각 coefficient가 Fp²
          원소입니다. 곱을 전개하면 v³,v⁴ 항이 나오고 profile이 정한
          <code>v³=ξ</code>로 낮춥니다. 이때 ξ가 cubic non-residue라는 사실과
          concrete 값은 tower 선택의 일부이지 “Fp⁶”이라는 이름에서 자동으로
          나오지 않습니다.
        </p>
      </div>
      <FieldTowerViz />
      <ExplainedFormula
        question="Fp² 위 3차 표현이 왜 Fp 위 6차원일까요?"
        idea="상위 basis 1,v,v²마다 Fp² coefficient 하나가 있고, 각 Fp² coefficient는 다시 Fp 좌표 두 개를 가집니다. 차원은 tower 단계의 곱으로 셉니다."
        formula={String.raw`[\mathbb F_{p^6}:\mathbb F_p]=[\mathbb F_{p^6}:\mathbb F_{p^2}]\,[\mathbb F_{p^2}:\mathbb F_p]=3\cdot2=6`}
        annotatedFormula={String.raw`[\mathbb F_{p^6}:\mathbb F_p]=\underbrace{[\mathbb F_{p^6}:\mathbb F_{p^2}]\,[\mathbb F_{p^2}:\mathbb F_p]=3\cdot2=6}_{\text{오른쪽 항으로 결과 계산}}`}
        operations={[
          { expression: String.raw`[\mathbb F_{p^6}:\mathbb F_{p^2}]\,[\mathbb F_{p^2}:\mathbb F_p]=3\cdot2=6`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","상위 basis 1,v,v²마다"] },
        ]}
        terms={[
          { symbol: "[K:F]", name: "extension degree", description: "K를 F-vector space로 볼 때 필요한 basis 원소 수입니다." },
          { symbol: "1,v,v²", name: "cubic basis", description: "Fp² 위 coefficient를 놓는 세 자리입니다." },
          { symbol: "ξ", name: "tower non-residue", description: "v³을 Fp² 원소로 줄이는 pinned parameter입니다." },
        ]}
        assumptions={[
          "각 defining polynomial이 해당 base field에서 irreducible합니다.",
          "차원 6은 원소 개수 6을 뜻하지 않으며 전체 원소 수는 p⁶입니다.",
        ]}
        interpretation="Fp² coefficient가 (a,b) 두 값이고 그런 coefficient가 세 개이므로 serialize 전 논리 좌표는 Fp 값 여섯 개입니다. Polynomial이 reducible하면 같은 6좌표 layout을 가져도 field inverse 계약은 깨집니다."
      />
      <CodePanel title="Versioned tower layout" code={layoutCode} defaultOpen annotations={[
        { lines: [1, 2], color: "sky", note: "하위 field를 type parameter로 재사용" },
        { lines: [4, 5], color: "emerald", note: "세 Fq2 coefficient" },
        { lines: [7, 8], color: "amber", note: "profile-specific reduction" },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>연산 장부는 subfield multiplication만 세면 안 된다</h3>
        <p>
          Schoolbook 전개는 Fp² multiplication 9개를 만들고 Karatsuba 계열
          schedule은 일부 교차항을 공유할 수 있습니다. 그러나 실제 비용에는
          addition, subtraction, ξ multiplication, temporary와 memory traffic이
          포함됩니다. 따라서 “9→6” 같은 symbolic count는 같은 backend 안의
          후보 비교축일 뿐 end-to-end speedup 수치가 아닙니다.
        </p>
      </div>
    </section>
  );
}
