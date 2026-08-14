import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import CodePanel from "@/components/ui/code-panel";
import FieldTowerViz from "./viz/FieldTowerViz";

const fp12Code = `// w² = v인 quadratic-over-Fq6 layout
v0 = a0 * b0
v1 = a1 * b1
c0 = v0 + mul_by_nonresidue(v1)
c1 = (a0 + a1) * (b0 + b1) - v0 - v1

// Frobenius는 coefficient permutation/sign/table을 사용한다.
frobenius_map_in_place(power % 12)`;

export default function Fp12() {
  return (
    <section id="fp12" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Fp¹²: quadratic top layer와 Frobenius table을 pairing에 연결한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Top layer는 <code>c₀+c₁w</code>, <code>w²=v</code>로 표현합니다.
          곱셈은 Fp²와 같은 quadratic Karatsuba 골격을 재사용하지만 coefficient가
          Fp⁶이고 non-residue multiply의 구현도 다릅니다. 따라서 “3회 곱셈”은
          Fp⁶ multiplication 세 번이라는 뜻이며 Fp multiplication 3회가 아닙니다.
        </p>
      </div>
      <FieldTowerViz />
      <CodePanel title="Fp¹² 곱셈과 Frobenius dispatch" code={fp12Code} defaultOpen annotations={[
        { lines: [2, 5], color: "sky", note: "quadratic Karatsuba 골격" },
        { lines: [7, 8], color: "emerald", note: "12-period profile table" },
      ]} />
      <div id="frobenius-optimization" className="scroll-mt-24">
        <ExplainedFormula
          question="Fp¹²에서 p제곱을 일반 exponentiation보다 싸게 계산할 수 있는 이유는 무엇일까요?"
          idea="Fp coefficient는 p제곱에서 고정되고 extension basis만 permutation·sign·사전 계산 coefficient로 바뀝니다. Concrete tower basis에서 이 선형 작용을 table로 만들면 긴 square-and-multiply를 피할 수 있습니다."
          formula={String.raw`\varphi(x)=x^p,\qquad \varphi^{12}(x)=x^{p^{12}}=x\quad(x\in\mathbb F_{p^{12}})`}
          terms={[
            { symbol: "φ", name: "Frobenius map", description: "Characteristic p field의 p-power automorphism입니다." },
            { symbol: "12", name: "extension degree", description: "Fp¹²에서 Frobenius action이 항등으로 돌아오는 주기입니다." },
            { symbol: "x", name: "tower element", description: "Fp coefficient 열두 개와 선택한 basis로 표현한 원소입니다." },
          ]}
          assumptions={[
            "같은 p와 같은 irreducible tower basis에 대해 만든 coefficient table을 사용합니다.",
            "Frobenius가 곱셈을 보존한다는 사실은 table index·coefficient order의 구현 오류를 막아 주지 않습니다.",
          ]}
          interpretation="Fp²에서 p≡3 mod4이고 u²=−1인 profile은 (a+bu)^p=a−bu가 되어 conjugation처럼 보입니다. 이를 모든 Fp⁶/Fp¹² layer가 단순 부호 반전이라고 일반화하면 틀립니다. 상위 basis에는 profile-specific coefficient가 필요합니다."
        />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Embedding degree와 GT는 구현 타입을 하나 더 요구한다</h3>
        <p>
          BN254 subgroup order r에 대해 r이 p¹²−1을 나누고 더 작은 양의 k에서는
          그렇지 않은 최소 k가 12입니다. 이것이 pairing target을 Fp¹²의
          order-r subgroup에서 찾게 하는 이유입니다. 그러나 임의 Fp¹² 원소가
          자동으로 GT 원소인 것은 아닙니다. Miller loop output을
          <Link to="/crypto/pairing#final-exp"> final exponentiation</Link>으로
          투영하고 zero·subgroup·encoding 경계를 따로 검사합니다.
        </p>
      </div>
      <div id="extension-release-gate" className="scroll-mt-24 prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release gate</h3>
        <p>
          p·r·non-residue·tower polynomial·coefficient order·Frobenius table·crate
          version/SHA를 먼저 고정합니다. 이어 zero/one, basis unit, inverse,
          Frobenius 12-cycle, independent multiplication, G2/pairing official
          vector와 serialization parity를 검사합니다. Wrong coefficient order와
          reducible test polynomial, Fp/Fp² swap을 negative fixture로 넣은 뒤에만
          multiplication·square·Frobenius benchmark를 비교합니다.
        </p>
      </div>
      <div id="paper-eip197-extension" className="scroll-mt-24">
        <CitationBlock source="EIP-197 · alt_bn128 G2/Fp² and pairing contract" href="https://eips.ethereum.org/EIPS/eip-197" citeKey={2}>
          문제: Ethereum precompile에서 G1·G2 입력과 pairing product를 exact
          parameter로 검증합니다. 기여: Fp² G2 coordinate encoding, curve order,
          subgroup check와 product equation을 정의합니다. 전제: EIP-197 curve와
          fork behavior를 고정합니다. 근거 범위: protocol-visible G2와 pairing
          boundary입니다. 비주장: 내부 Fp⁶/Fp¹² tower layout이나 arkworks의
          coefficient table을 표준화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
