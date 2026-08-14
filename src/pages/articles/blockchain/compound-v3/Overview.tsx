import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ModernCometViz from "./viz/ModernCometViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Comet market은 base asset 한 개와 담보 목록을 서로 다른 회계로 다룬다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">Compound III의 한 Comet instance에서 base asset은 공급하면 이자를 받고 음수 balance가 되면 차입 이자를 냅니다. Collateral assets는 base 차입 한도와 liquidation 판정에 기여하지만 자체 lending interest를 얻지 않습니다. “Compound V3는 항상 USDC market”이 아니라 deployment마다 base·collateral·oracle·risk config가 다릅니다.</p>
        <p><Link to="/blockchain/aave-v3#interest-rate">공통 utilization</Link>과 indexed balance 아이디어는 Aave 글의 정본을 재사용합니다. 이 글은 single-base signed principal, 독립 supply/borrow curve, borrow/liquidation factor 분리와 reserve-funded absorb를 소유합니다.</p>
      </div>
      <ContentBoundary article="compound-v3" />
      <ModernCometViz mode="market" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <thead><tr className="border-b"><th className="p-3 text-left">Asset role</th><th className="p-3 text-left">Positive balance</th><th className="p-3 text-left">Negative/risk role</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-3 font-semibold">Base</td><td className="p-3">Supply principal×supply index</td><td className="p-3">Borrow principal×borrow index</td></tr>
            <tr><td className="p-3 font-semibold">Collateral</td><td className="p-3">Token amount only, lending interest 없음</td><td className="p-3">Borrow capacity·liquidation liquidity sum</td></tr>
          </tbody>
        </table>
      </div>
      <div id="paper-compound-comet-source" className="scroll-mt-24">
        <CitationBlock source="Compound Finance · Comet source snapshot" href="https://github.com/compound-finance/comet/tree/f766f51583c23acc33b2a7824654ef2029a96804" citeKey={1}>
          문제: Single-base money market의 balance·rate·collateral·liquidation을 EVM에서 실행합니다. 기여: CometCore와 CometWithExtendedAssetList의 signed principal, indexes, utilization, factor checks, absorb와 collateral sale source를 제공합니다. 전제: inspected main snapshot f766f51583c2와 선택 deployment artifact를 고정합니다. 근거 범위: 이 snapshot의 Comet core logic입니다. 비주장: moving main·모든 proxy implementation·market parameter가 같다고 일반화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
