import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ModernV3Viz from "./viz/ModernV3Viz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">V3는 V2 곡선을 버린 것이 아니라 position별 가격 구간으로 옮겼다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">LP는 전 가격 범위 대신 [pₐ,pᵦ]를 선택합니다. 현재 가격이 범위 안일 때만 그 position의 liquidity가 swap에 참여하고 fee를 얻습니다. 좁은 범위는 같은 token 양으로 더 큰 active liquidity를 만들지만 가격이 벗어나면 한쪽 token만 남고 fee accrual도 멈춥니다.</p>
        <p><Link to="/blockchain/uniswap-v2#overview">V2 constant-product invariant</Link>와 input fee settlement를 재사용하고, 이 글은 concentrated range·tick/sqrt price·position fee growth·initialized tick crossing을 소유합니다.</p>
      </div>
      <ContentBoundary article="uniswap-v3" />
      <ModernV3Viz mode="range" />
      <ExplainedFormula
        question="구간 유동성은 어떻게 constant-product 곡선의 한 조각을 만들까요?"
        idea="실제 token balances에 구간 끝에서 남을 virtual reserve를 더하면 V2와 같은 곱 L²을 얻습니다. 범위 밖에서는 한 token 양이 0이 됩니다."
        formula={String.raw`\left(x+\frac{L}{\sqrt{p_b}}\right)\left(y+L\sqrt{p_a}\right)=L^2`}
        annotatedFormula={String.raw`\left(x+\frac{L}{\sqrt{p_b}}\right)\left(y+L\sqrt{p_a}\right)=\underbrace{L^2}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`L^2`, annotation: ["position liquidity이(가) 식의 결과에 기여하는","방식을 계산합니다.","실제 token balances에 구간 끝에서 남을","virtual reserve를 더하면 V2와 같은 곱 L²을"] },
        ]}
        terms={[
          { symbol: "p_a,p_b", name: "range prices", description: "token1/token0 기준 lower·upper price이며 pₐ<pᵦ입니다." },
          { symbol: "L", name: "position liquidity", description: "범위 안 swap amount와 price 이동을 잇는 유동성 단위입니다." },
          { symbol: "x,y", name: "real token amounts", description: "현재 price에서 position이 보유한 token0·token1 양입니다." },
        ]}
        assumptions={["가격 방향·token order와 sqrt convention을 고정합니다.", "여러 position의 liquidity는 현재 tick에서 active한 것만 합산합니다."]}
        interpretation="√pₐ=1, √P=2, √pᵦ=3, L=60이면 범위 안에서 x=60(3−2)/(2·3)=10, y=60(2−1)=60입니다. P≤pₐ이면 x=40,y=0이고 P≥pᵦ이면 x=0,y=120입니다. 범위 밖인데 두 token이 계속 fee를 번다고 가정하면 틀립니다."
      />
      <div id="paper-uniswap-v3-whitepaper" className="scroll-mt-24">
        <CitationBlock source="Adams et al. · Uniswap v3 Core whitepaper" href="https://uniswap.org/whitepaper-v3.pdf" citeKey={1}>
          문제: AMM 자본을 LP가 선택한 가격 구간에 집중하고 position별 fee·oracle을 회계합니다. 기여: virtual-reserve range invariant, ticks, liquidity amount와 fee-growth 설계를 제시합니다. 전제: V3의 token order·sqrt price·tick·fixed-point convention입니다. 근거 범위: V3 core의 수학적 설계입니다. 비주장: 좁은 범위가 항상 더 높은 순수익을 내거나 모든 fee tier·risk parameter가 고정이라는 뜻은 아닙니다.
        </CitationBlock>
      </div>
    </section>
  );
}
