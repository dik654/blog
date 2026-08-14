import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ModernV2Viz from "./viz/ModernV2Viz";

export default function PairContract() {
  return (
    <section id="pair-contract" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Pair는 reserve와 LP share를 별도 회계로 보존한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Factory는 정렬된 token0/token1로 Pair를 하나만 만들고, Pair는 reserve·cumulative price·LP totalSupply를 관리합니다. LP가 토큰을 먼저 전송한 뒤 <code>mint</code>를 호출하면 balance−reserve가 입금량이 됩니다. 초기에는 기하평균에서 <code>MINIMUM_LIQUIDITY</code>를 영구 잠그고, 이후에는 두 reserve 비율 중 작은 share만 발행합니다.</p>
      </div>
      <ModernV2Viz mode="pair" />
      <ExplainedFormula
        question="기존 LP를 희석하지 않으면서 새 LP share를 몇 개 발행해야 할까요?"
        idea="입금이 기존 reserve 비율보다 한쪽으로 치우치면 부족한 쪽이 실제로 더해진 유동성을 제한합니다. 그래서 두 비례 몫의 최솟값을 사용합니다."
        formula={String.raw`S_{mint}=\min\!\left(\frac{\Delta xS}{x},\frac{\Delta yS}{y}\right),\qquad S_{initial}=\sqrt{\Delta x\Delta y}-S_{min}`}
        terms={[
          { symbol: "S", name: "existing total supply", description: "Mint 직전 발행된 LP token 총량입니다." },
          { symbol: "S_min", name: "locked minimum liquidity", description: "초기 가격 조작과 division edge를 줄이려고 zero address에 영구 잠근 양입니다." },
          { symbol: "Δx,Δy", name: "deposited balances", description: "실제 token balances와 이전 reserves의 차이입니다." },
        ]}
        assumptions={["입금 전 reserve와 totalSupply가 같은 Pair snapshot에 속합니다.", "Fee-on-transfer·rebasing token은 balance delta와 사용자 의도가 달라질 수 있어 별도 adapter 검증이 필요합니다."]}
        interpretation="x=1,000,y=2,000,S=100이고 Δx=100,Δy=300이면 두 몫은 10과 15라 10 share만 발행됩니다. 15를 발행하면 기존 LP를 희석합니다. 최초 1,000×4,000 입금은 √4,000,000=2,000에서 S_min을 뺍니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Protocol fee는 swap마다 0.05%를 전송하지 않는다</h3>
        <p>V2 tag v1.0.1에서 <code>feeTo</code>가 켜졌을 때만 mint/burn 시점의 √k 증가분으로 LP token을 feeTo에 mint합니다. 식은 <code>S·(√k−√kLast)/(5√k+√kLast)</code>입니다. 꺼져 있으면 trader의 0.3%가 reserve에 남아 기존 LP에게 귀속되고 <code>kLast</code>가 0으로 정리됩니다. 따라서 “항상 0.25% LP + 0.05% 직접 송금”이라는 구현 설명은 틀립니다.</p>
      </div>
      <div id="paper-uniswap-v2-core-source" className="scroll-mt-24">
        <CitationBlock source="Uniswap v2-core v1.0.1 · UniswapV2Pair.sol" href="https://github.com/Uniswap/v2-core/blob/d2bfbb3649b265559bec74a7dd878dc1cf01c63c/contracts/UniswapV2Pair.sol" citeKey={2}>
          문제: Pair reserve·mint/burn·swap·fee·accumulator를 EVM에서 실행합니다. 기여: balance-delta input, adjusted K check, minimum liquidity와 fee-on LP mint의 정확한 source seam을 제공합니다. 전제: v1.0.1 tag commit d2bfbb3649b2와 Solidity 0.5.16 의미를 고정합니다. 근거 범위: 이 snapshot의 Pair 구현입니다. 비주장: 주변 Router·토큰별 transfer semantics·현재 배포 주소를 자동으로 고정하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
