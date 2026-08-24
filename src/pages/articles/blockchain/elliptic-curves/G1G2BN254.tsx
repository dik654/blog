import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function G1G2BN254() {
  return (
    <section id="g1-g2-bn254" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">BN254 G1·G2: 같은 order를 공유하지만 같은 좌표 타입은 아니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Ethereum EIP-197의 alt_bn128/BN254 pairing은 prime order q의 G1과 G2를 입력으로 받습니다. G1은 E(Fp)의 subgroup이고 generator가 (1,2)입니다. G2는 embedding-degree 12의 pairing을 위해 필요한 subgroup을 sextic twist를 통해 Fp² coordinates로 싸게 표현합니다. 두 군이 같은 q를 공유한다는 사실은 scalar를 공통으로 쓸 수 있다는 뜻이지 point bytes나 addition implementation을 무검증 cast할 수 있다는 뜻이 아닙니다.
        </p>
      </div>
      <CryptoFoundationsViz mode="pairing-groups" />
      <ExplainedFormula
        question="Pairing은 두 입력군의 scalar multiplication을 결과군에서 어떻게 보존할까요?"
        idea="Bilinearity는 각 입력의 scalar가 결과 exponent의 곱으로 이동하게 합니다. SNARK verifier는 secret discrete log를 계산하지 않고 여러 pairing 결과의 곱이 identity인지 확인해 선형 관계를 검사합니다."
        formula={String.raw`e([a]P,[b]Q)=e(P,Q)^{ab},\qquad \prod_{i=1}^{k}e(P_i,Q_i)\stackrel?=1_{G_T}`}
        annotatedFormula={String.raw`e([a]P,[b]Q)=\underbrace{e(P,Q)^{ab},\qquad \prod_{i=1}^{k}e(P_i,Q_i)\stackrel?=1_{G_T}}_{\text{target group 계산}}`}
        operations={[
          { expression: String.raw`e(P,Q)^{ab},\qquad \prod_{i=1}^{k}e(P_i,Q_i)\stackrel?=1_{G_T}`, annotation: ["target group이(가) 식의 결과에 기여하는 방식을","계산합니다.","Bilinearity는 각 입력의 scalar가 결과","exponent의 곱으로 이동하게 합니다."] },
        ]}
        terms={[
          { symbol: "G_1,G_2", name: "source groups", description: "같은 prime order q를 가진 서로 다른 additive input groups입니다." },
          { symbol: "G_T", name: "target group", description: "Fp¹²* 안의 order-q multiplicative subgroup입니다." },
          { symbol: "e", name: "non-degenerate bilinear pairing", description: "두 source points를 target element로 보내는 함수입니다." },
          { symbol: "a,b", name: "scalars", description: "Zq에서 계산하는 group multipliers입니다." },
        ]}
        assumptions={["P와 Q는 올바르게 decoded·on-curve·prime-order subgroup에 있고 identity policy를 만족합니다.", "Pairing parameter·twist·Frobenius constants와 final exponentiation이 같은 curve instance에 속합니다."]}
        interpretation="Pairing check는 입력 point 관계를 검사하지만 각 point가 어디서 왔는지, proof statement가 올바른지, trusted setup이 안전한지까지 보장하지 않습니다. Empty pairing input이 identity가 되는 API semantics도 protocol에서 별도로 제한할 수 있습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>G2에서는 on-curve check만으로 부족합니다</h3>
        <p>
          EIP-197은 G1 입력에 대해 coordinate range와 curve equation이 충분한 구체 구조를 사용하지만, G2는 on-twist point가 order-q subgroup에 속하는지 추가 확인해야 한다고 명시합니다. Wrong-subgroup point를 받아들이면 pairing equation이 의도한 scalar relation이 아닌 cofactor component에서도 성립하거나 protocol soundness가 깨질 수 있습니다. Production parser는 exact 32-byte big-endian limbs, p보다 작은 field element, infinity encoding, Fp² coefficient order와 q-order 검사를 함께 고정합니다.
        </p>
        <h3>구현 release gate</h3>
        <p>
          Curve/field modulus p, subgroup order q, twist coefficient, generators, encoding과 library SHA를 receipt에 기록합니다. G1/G2 generator·identity·negative·wrong curve·wrong subgroup·noncanonical limb·truncated input과 [q]P=O를 test하고, EIP vector와 independent implementation 사이 add/double/scalar/pairing 결과를 맞춥니다. Constant-time secret multiplication·bounded allocation·malformed input timing을 확인한 뒤 Jacobian/window/batch 최적화를 비교합니다.
        </p>
      </div>
      <div id="paper-eip197-bn254" className="scroll-mt-24">
        <CitationBlock source="EIP-197 · alt_bn128 pairing precompile" href="https://eips.ethereum.org/EIPS/eip-197" citeKey={2}>
          문제: Ethereum contract가 zkSNARK pairing check를 block gas 안에서 실행하도록 exact groups·encoding·failure behavior를 정합니다. 기여: G1/G2 generators와 order, Fp/Fp² encoding, subgroup requirement와 product pairing equation을 규정합니다. 전제: EIP가 고정한 alt_bn128 parameters와 fork semantics를 사용합니다. 근거 범위: Ethereum precompile contract입니다. 비주장: BN254의 장기 security level·모든 pairing protocol·off-chain library API를 일반화하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-eip196-g1" className="scroll-mt-24">
        <CitationBlock source="EIP-196 · alt_bn128 addition and scalar multiplication" href="https://eips.ethereum.org/EIPS/eip-196" citeKey={3}>
          문제: G1 addition과 scalar multiplication을 EVM precompile로 일관되게 제공합니다. 기여: input encoding, infinity, invalid point와 operation semantics를 규정합니다. 전제: EIP의 curve와 client fork/gas schedule을 고정합니다. 근거 범위: G1 precompile behavior입니다. 비주장: G2 arithmetic·pairing subgroup 검증·secret-scalar side-channel 안전성을 대신하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
