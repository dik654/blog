import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ModernV3Viz from "./viz/ModernV3Viz";

export default function PositionNft() {
  return (
    <section id="position-nft" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Position fee는 global counter에서 구간 밖 성장을 뺀 차이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Core position key는 owner·tickLower·tickUpper이고 liquidity와 마지막 feeGrowthInside snapshot을 저장합니다. Periphery의 NFT는 여러 범위 position을 양도 가능한 token으로 포장하지만 core 수수료가 NFT 보유만으로 자동 전송되는 것은 아닙니다. Position을 poke·decrease·collect하는 흐름에서 owed amount가 갱신됩니다.</p>
      </div>
      <ModernV3Viz mode="position" />
      <ExplainedFormula
        question="Position 범위 안에서 발생한 수수료만 어떻게 분리할까요?"
        idea="Global per-liquidity fee growth에서 lower 아래와 upper 위에 해당하는 growth를 현재 tick 방향 규칙으로 계산해 뺍니다. Position은 직전 inside snapshot 이후 증가분만 받습니다."
        formula={String.raw`f_{inside}=f_{global}-f_{below}-f_{above},\qquad fee=L\,(f_{inside}-f_{last})/2^{128}`}
        annotatedFormula={String.raw`f_{inside}=\underbrace{f_{global}-f_{below}-f_{above},\qquad fee=L\,(f_{inside}-f_{last})/2^{128}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`f_{global}-f_{below}-f_{above},\qquad fee=L\,(f_{inside}-f_{last})/2^{128}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Global per-liquidity fee growth에서","lower 아래와 upper 위에 해당하는 growth를 현재","tick 방향 규칙으로 계산해 뺍니다."] },
        ]}
        terms={[
          { symbol: "f_global", name: "global fee growth", description: "Pool 전체에서 token별로 누적한 Q128 per-liquidity counter입니다." },
          { symbol: "f_below,f_above", name: "outside partitions", description: "Boundary tick의 outside 값을 현재 tick 위치에 따라 해석한 양입니다." },
          { symbol: "f_last", name: "position checkpoint", description: "Position을 마지막 갱신했을 때의 inside growth입니다." },
        ]}
        assumptions={["같은 token counter와 Q128 scale을 사용합니다.", "uint counter의 modular arithmetic과 tick crossing outside flip은 pinned core source 의미를 따릅니다."]}
        interpretation="설명용 비스케일 값으로 global=10, below=2, above=3이면 inside=5입니다. last=1,L=100이면 증가분은 400입니다. 현재 tick 방향을 무시하고 outside를 항상 그대로 빼면 boundary를 지난 뒤 fee가 갑자기 음수처럼 보이는 반례가 생깁니다."
      />
      <div id="paper-uniswap-v3-core-source" className="scroll-mt-24">
        <CitationBlock source="Uniswap v3-core v1.0.0 · Pool/Tick/SqrtPriceMath" href="https://github.com/Uniswap/v3-core/tree/ef64f51d0f0dca5346c903484f3e6a771dd69d59/contracts" citeKey={2}>
          문제: Range position·sqrt price·tick crossing·fee growth를 정수 EVM 연산으로 실행합니다. 기여: Pool, TickMath, SqrtPriceMath, SwapMath와 Tick의 exact rounding·state-transition source를 제공합니다. 전제: v1.0.0 tag commit ef64f51d0f0d와 Solidity 0.7.6 semantics를 고정합니다. 근거 범위: 해당 core snapshot입니다. 비주장: NFT periphery·router·deployment별 fee protocol 설정과 UI decimal 처리를 자동 규정하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
