import ExplainedFormula from "@/components/ui/explained-formula";
import CodePanel from "@/components/ui/code-panel";
import FieldTowerViz from "./viz/FieldTowerViz";
import TowerFlowViz from "./viz/TowerFlowViz";

const fp2Code = `// u² = β인 quadratic extension의 구조적 의사코드
v0 = a0 * b0
v1 = a1 * b1
c0 = v0 + beta * v1
c1 = (a0 + a1) * (b0 + b1) - v0 - v1

// inverse는 norm-like denominator를 base field로 내린다.
den = a0.square() - beta * a1.square()
return (a0 * den.inverse(), -a1 * den.inverse())`;

export default function Fp2() {
  return (
    <section id="fp2" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Fp²: 두 coefficient와 하나의 reduction 관계
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          원소는 <code>a₀+a₁u</code>이고 <code>u²=β</code>로 줄입니다. β는
          target Fp에서 quadratic non-residue여야 합니다. “복소수처럼 보인다”는
          전개 직관은 유용하지만, 실제 β와 sign, coefficient order는 curve
          profile이 정합니다. 특히 EIP wire order와 Rust struct field order가
          같다고 추측하지 않습니다.
        </p>
      </div>
      <FieldTowerViz />
      <TowerFlowViz />
      <ExplainedFormula
        question="Fp² 곱셈의 base-field 곱셈을 네 번에서 세 번으로 어떻게 줄일까요?"
        idea="상수항과 u²항에 필요한 두 곱 v₀,v₁을 먼저 계산하고, 합의 곱 한 번에서 이미 계산한 두 항을 빼 교차항을 얻습니다."
        formula={String.raw`\begin{aligned}v_0&=a_0b_0,&v_1&=a_1b_1\\c_0&=v_0+\beta v_1,&c_1&=(a_0+a_1)(b_0+b_1)-v_0-v_1\end{aligned}`}
        terms={[
          { symbol: "a_i,b_i", name: "Fp coefficients", description: "두 Fp² input을 base-field 두 좌표로 펼친 값입니다." },
          { symbol: "β", name: "quadratic non-residue", description: "u²을 낮은 차수로 줄이는 profile 상수입니다." },
          { symbol: "c_0+c_1u", name: "product", description: "같은 Fp² layout으로 돌아온 결과입니다." },
        ]}
        assumptions={[
          "x²−β가 Fp에서 irreducible하도록 β를 고릅니다.",
          "곱셈 3회라는 장부는 addition과 β multiplication, reduction 비용을 포함하지 않습니다.",
        ]}
        interpretation="작은 F3 예에서 β=−1=2, (1+u)(2+u)는 v₀=2,v₁=1,c₀=1,c₁=0이므로 1입니다. F5에서 같은 u²=−1을 쓰면 2²=−1이라 polynomial이 reducible해 field가 되지 않는 반례입니다."
      />
      <CodePanel title="Fp² 곱셈·inverse 의사코드" code={fp2Code} defaultOpen annotations={[
        { lines: [2, 5], color: "sky", note: "세 base-field product로 곱셈" },
        { lines: [7, 9], color: "emerald", note: "denominator를 Fp로 내려 inverse" },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Inverse의 반례는 denominator 0이다</h3>
        <p>
          <code>(a₀+a₁u)⁻¹=(a₀−a₁u)/(a₀²−βa₁²)</code>입니다. Irreducible
          quotient라면 nonzero 원소의 denominator는 0이 아니지만, reducible
          polynomial을 택하면 nonzero zero divisor가 생겨 inverse 경로가
          실패합니다. 그래서 parameter 생성 때 irreducibility를, runtime에서는
          zero inverse의 typed failure를 각각 확인합니다.
        </p>
      </div>
    </section>
  );
}
