import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ModernCometViz from "./viz/ModernCometViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">Compound III는 왜 한 시장에서 한 자산만 빌리게 만들었을까요?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg font-semibold leading-8">한 Comet 시장은 공급하거나 빌릴 수 있는 base asset 하나와, 그 차입을 뒷받침하는 담보 목록을 서로 다른 장부로 관리합니다.</p>
        <p>예를 들어 USDC가 base인 시장에서는 USDC를 공급하면 이자를 받고, USDC 잔액이 0 아래로 내려가면 차입 이자를 냅니다. WETH 같은 collateral asset은 USDC 차입 한도와 청산 판정에 기여하지만 그 시장의 공급 이자를 받지 않습니다. Compound V3가 언제나 USDC 시장인 것은 아닙니다. 배포마다 base·담보 목록·oracle·risk 설정이 다릅니다.</p>
        <p><Link to="/cs/blockchain/aave-v3#interest-rate">공통 utilization</Link>과 indexed balance 아이디어는 Aave 글의 정본을 재사용합니다. 이 글은 single-base signed principal, 독립 supply/borrow curve, borrow/liquidation factor 분리와 reserve-funded absorb를 소유합니다.</p>
      </div>
      <ContentBoundary article="compound-v3" />
      <ModernCometViz mode="market" />
      <div className="not-prose grid gap-3 sm:grid-cols-2">
        <div className="border border-border bg-card p-4">
          <p className="text-xs font-bold text-primary">BASE ASSET · 공급과 차입</p>
          <p className="mt-2 text-sm font-semibold">양수 principal × supply index = 현재 공급액</p>
          <p className="mt-2 text-sm font-semibold">음수 principal × borrow index = 현재 부채</p>
        </div>
        <div className="border border-border bg-card p-4">
          <p className="text-xs font-bold text-primary">COLLATERAL · 위험 완충</p>
          <p className="mt-2 text-sm font-semibold">Token 수량은 그대로 저장하며 lending interest가 없습니다.</p>
          <p className="mt-2 text-sm font-semibold">Borrow capacity와 liquidation liquidity에만 더합니다.</p>
        </div>
      </div>
      <div id="paper-compound-comet-source" className="scroll-mt-24">
        <CitationBlock source="Compound Finance · Comet source snapshot" href="https://github.com/compound-finance/comet/tree/f766f51583c23acc33b2a7824654ef2029a96804" citeKey={1}>
          문제: Single-base money market의 balance·rate·collateral·liquidation을 EVM에서 실행합니다. 기여: CometCore와 CometWithExtendedAssetList의 signed principal, indexes, utilization, factor checks, absorb와 collateral sale source를 제공합니다. 전제: inspected main snapshot f766f51583c2와 선택 deployment artifact를 고정합니다. 근거 범위: 이 snapshot의 Comet core logic입니다. 비주장: moving main·모든 proxy implementation·market parameter가 같다고 일반화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
