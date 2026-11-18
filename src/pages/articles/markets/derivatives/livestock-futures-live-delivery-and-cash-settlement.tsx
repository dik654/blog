import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { livestockSettlementData } from "./derivative-applied-ledgers-data";
import BasisLadderViz from "./livestock-futures-live-delivery-and-cash-settlement/viz/BasisLadderViz";
import PathSplitViz from "./livestock-futures-live-delivery-and-cash-settlement/viz/PathSplitViz";
import YieldAdjustViz from "./livestock-futures-live-delivery-and-cash-settlement/viz/YieldAdjustViz";

export default function LivestockFuturesSettlementArticle() {
  return (
    <DerivativeDeepArticle
      data={livestockSettlementData}
      vizBefore={{
        case: { 0: <YieldAdjustViz /> },
        picture: { 0: <PathSplitViz /> },
        mechanism: { 1: <BasisLadderViz /> },
      }}
    />
  );
}
