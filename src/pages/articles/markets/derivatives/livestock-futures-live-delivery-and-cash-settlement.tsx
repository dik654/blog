import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { livestockSettlementData } from "./derivative-applied-ledgers-data";

export default function LivestockFuturesSettlementArticle() {
  return <DerivativeDeepArticle data={livestockSettlementData} />;
}
