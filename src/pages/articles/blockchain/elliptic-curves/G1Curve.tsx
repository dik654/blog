import ExplainedFormula from "@/components/ui/explained-formula";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function G1Curve() {
  return (
    <section id="g1-curve" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">G1 구현: point law, subgroup, 좌표 표현을 분리한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          서로 다른 affine points P=(x₁,y₁), Q=(x₂,y₂)를 잇는 직선은 curve와 세 번째 점에서 만나며 그 y 좌표를 반전한 점을 P+Q로 정의합니다. P=Q일 때는 tangent slope를 쓰고, Q=−P이면 결과는 O입니다. 구현은 이 예외를 branch·complete formula·coordinate convention 중 하나로 정확히 다뤄야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Affine point addition은 두 점에서 결과 좌표를 어떻게 계산할까요?"
        idea="두 점을 지나는 line slope λ를 계산하고 cubic의 세 intersection x 좌표 합 관계를 사용합니다. Field division은 denominator inverse이므로 P=Q·P=−Q 예외를 먼저 분리합니다."
        formula={String.raw`\lambda=(y_2-y_1)(x_2-x_1)^{-1},\qquad x_3=\lambda^2-x_1-x_2,\qquad y_3=\lambda(x_1-x_3)-y_1`}
        terms={[
          { symbol: "\lambda", name: "line slope", description: "두 affine points를 잇는 field-valued 기울기입니다." },
          { symbol: "(x_3,y_3)", name: "sum point", description: "P+Q의 canonical affine coordinates입니다." },
          { symbol: "(x_2-x_1)^{-1}", name: "field inverse", description: "서로 다른 x 좌표일 때만 정의되는 비싼 연산입니다." },
        ]}
        assumptions={["P,Q가 같은 nonsingular curve 위에 있고 P≠Q, Q≠−P입니다.", "Doubling은 λ=(3x₁²+a)(2y₁)⁻¹ 공식을 쓰며 y₁=0이면 O를 반환합니다."]}
        interpretation="작은 F17 curve y²=x³+2x+2에서 P=(5,1), Q=(6,3)이면 λ=2, x₃=10, y₃=6이므로 P+Q=(10,6)입니다. 정수 나눗셈으로 계산하면 잘못된 결과가 납니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          예외 matrix도 formula의 일부입니다. O+P=P이고, P=Q이면 tangent 식을 사용하며, P=−Q이면 vertical line이므로 O를 반환합니다. Doubling 대상의 y=0도 tangent가 수직이라 2P=O입니다. 두 입력이 같은 curve instance에 속하는지 확인하지 않은 채 좌표만 넣으면 denominator 분기와 결과가 아무 의미가 없으므로, 완전 덧셈 공식(complete formula)을 쓰거나 이 모든 branch를 reference vector로 고정합니다.
        </p>
      </div>
      <CryptoFoundationsViz mode="jacobian-affine" />
      <ExplainedFormula
        question="Jacobian coordinates는 왜 반복 scalar multiplication의 inversion을 줄일까요?"
        idea="여러 (X,Y,Z)가 같은 affine point를 나타내도록 denominator power를 Z에 미룹니다. Add/double에서는 multiplication과 square만 수행하고 최종 serialization에서 inverse 한 번으로 affine에 돌아옵니다."
        formula={String.raw`x=XZ^{-2},\qquad y=YZ^{-3},\qquad (X,Y,Z)\sim(\mu^2X,\mu^3Y,\mu Z)`}
        terms={[
          { symbol: "X,Y,Z", name: "Jacobian coordinates", description: "반복 group operation에 사용하는 projective representation입니다." },
          { symbol: "Z^{-1}", name: "deferred inverse", description: "최종 affine conversion에서 한 번 계산합니다." },
          { symbol: "\mu", name: "projective scale", description: "0이 아닌 field element로, 같은 affine point의 여러 표현을 만듭니다." },
        ]}
        assumptions={["Z≠0은 finite affine point를 나타내며 Z=0 identity convention을 구현에 고정합니다.", "Equality는 raw tuple 비교가 아니라 cross multiplication 또는 normalization으로 검사합니다."]}
        interpretation="(X,Y,Z)=(20,40,2)와 (5,5,1)이 같은지 raw integer로 비교할 수 없습니다. Mod p에서 X/Z²와 Y/Z³를 비교해야 하며, batch normalization은 여러 Z inverse를 한 번의 inversion과 여러 multiplication으로 줄일 수 있습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Scalar multiplication과 subgroup check</h3>
        <p>
          Double-and-add는 scalar bit마다 doubling, 1-bit마다 addition을 수행하지만 secret bit에 따른 branch와 table access는 side channel이 될 수 있습니다. Constant-time window method는 precomputation memory와 addition 수를 맞바꾸며, 공개 scalar인 subgroup check와 secret scalar multiplication은 같은 최적화 정책을 쓰지 않아도 됩니다.
        </p>
        <p>
          Untrusted point는 canonical decode, field range, curve equation, identity policy와 subgroup membership을 순서대로 확인합니다. Cofactor h=1인 G1에서는 on-curve point가 prime-order subgroup에 바로 들어갈 수 있지만 이를 다른 curve나 G2에 일반화하면 안 됩니다. 일반 판정은 [q]P=O이며, protocol에 따라 cofactor clearing으로 subgroup point를 만들지 invalid input을 reject할지 구분합니다.
        </p>
      </div>
    </section>
  );
}
