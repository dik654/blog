import ExplainedFormula from "@/components/ui/explained-formula";
import ModernV3Viz from "./viz/ModernV3Viz";

export default function TickMath() {
  return (
    <section id="tick-math" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Tick은 가격 index이고 sqrtPriceX96은 계산 상태다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>정수 tick i는 P=1.0001ⁱ을 가리킵니다. Pool은 P 자체 대신 √P·2⁹⁶을 <code>uint160</code>에 저장해 token amount 식에서 제곱근을 반복 계산하지 않습니다. Position boundary는 tick spacing의 배수여야 하지만 swap 중 현재 tick은 그 사이를 지날 수 있습니다.</p>
      </div>
      <ModernV3Viz mode="tick" />
      <ExplainedFormula
        question="가격·tick·sqrtPriceX96은 어떻게 같은 상태를 표현할까요?"
        idea="로그 눈금이 곱셈 가격 변화를 정수 덧셈으로 바꾸고, 제곱근 fixed point가 amount 계산의 곱셈·나눗셈을 정수화합니다."
        formula={String.raw`P(i)=1.0001^i,\qquad \texttt{sqrtPriceX96}=\left\lfloor\sqrt P\,2^{96}\right\rfloor`}
        annotatedFormula={String.raw`P(i)=\underbrace{1.0001^i}_{\text{tick당 1bp씩 곱함}},\qquad \texttt{sqrtPriceX96}=\Bigl\lfloor\underbrace{\sqrt P}_{\text{가격 제곱근}}\,\underbrace{2^{96}}_{\text{Q64.96 배율}}\Bigr\rfloor`}
        operations={[
          { expression: String.raw`1.0001^i`, annotation: ["정수 tick 하나가 가격을 1.0001배 바꿔","곱셈 가격 변화를 tick 덧셈으로 바꿈","i=0이면 P=1, i≈6,932면 P≈2"] },
          { expression: String.raw`\left\lfloor\sqrt P\,2^{96}\right\rfloor`, annotation: ["√P에 2⁹⁶을 곱하고 내림해 uint160에 저장","amount 식에서 제곱근을 반복 계산 안 함","P=1이면 sqrtPriceX96=2⁹⁶"] },
        ]}
        terms={[
          { symbol: "i", name: "tick", description: "허용 범위 안의 signed integer price index입니다." },
          { symbol: "P", name: "token1/token0 price", description: "Raw token units 기준이며 decimals 보정 전일 수 있습니다." },
          { symbol: "2^96", name: "Q64.96 scale", description: "96 fractional bits를 주는 fixed-point 배율입니다." },
        ]}
        assumptions={["Token order와 raw decimal scale을 먼저 고정합니다.", "Core TickMath의 boundary와 rounding direction을 그대로 사용합니다."]}
        interpretation="i=0이면 P=1, √P=1이고 sqrtPriceX96=2⁹⁶입니다. i≈6,932면 P≈2입니다. UI가 token decimals를 뒤집거나 nearest tick으로 반올림하면 core가 반환하는 floor-like boundary와 한 tick 어긋날 수 있으므로 exact source vector로 검증합니다."
      />
      <ExplainedFormula
        question="현재 가격이 범위 안일 때 position의 두 token 양은 어떻게 계산할까요?"
        idea="Token0은 upper sqrt price까지 남은 역수 거리, token1은 lower에서 현재까지의 sqrt 거리와 비례합니다."
        formula={String.raw`x=L\frac{\sqrt{p_b}-\sqrt P}{\sqrt P\sqrt{p_b}},\qquad y=L(\sqrt P-\sqrt{p_a})`}
        annotatedFormula={String.raw`x=\underbrace{L\frac{\sqrt{p_b}-\sqrt P}{\sqrt P\sqrt{p_b}}}_{\text{upper까지 남은 token0}},\qquad y=\underbrace{L(\sqrt P-\sqrt{p_a})}_{\text{lower부터 쌓인 token1}}`}
        operations={[
          { expression: String.raw`L\frac{\sqrt{p_b}-\sqrt P}{\sqrt P\sqrt{p_b}}`, annotation: ["1/√P에서 1/√pᵦ까지 남은 역수 거리 × L","가격이 upper에 닿으면 0이 됨","L=60, √P=2, √pᵦ=3 → 60·1/6 = 10"] },
          { expression: String.raw`L(\sqrt P-\sqrt{p_a})`, annotation: ["lower에서 현재까지 sqrt 거리 × L","가격이 lower로 내려가면 0이 됨","60·(2−1) = 60"] },
        ]}
        terms={[
          { symbol: "x", name: "token0 amount", description: "가격이 upper로 갈수록 0에 접근합니다." },
          { symbol: "y", name: "token1 amount", description: "가격이 lower에서 멀어질수록 증가합니다." },
          { symbol: "L", name: "liquidity", description: "해당 position이 범위에 제공한 유동성입니다." },
        ]}
        assumptions={["pₐ<P<pᵦ인 범위 안 식입니다.", "Mint는 token을 덜 받지 않도록 round up, payout은 더 주지 않도록 round down하는 source semantics를 확인합니다."]}
        interpretation="L=60, √pₐ=1, √P=2, √pᵦ=3이면 x=10,y=60입니다. 같은 식을 P≤pₐ에 그대로 대입하면 y가 음수가 될 수 있으므로 범위 밖은 one-sided 별도 분기를 사용합니다."
      />
    </section>
  );
}
