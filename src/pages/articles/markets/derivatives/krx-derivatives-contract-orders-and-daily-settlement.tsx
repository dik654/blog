import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { krxDerivativesMechanicsData } from "./derivative-curriculum-gaps-data";
import PartialFillViz from "./krx-derivatives-contract-orders-and-daily-settlement/viz/PartialFillViz";
import SettlementExitViz from "./krx-derivatives-contract-orders-and-daily-settlement/viz/SettlementExitViz";
import TickGridViz from "./krx-derivatives-contract-orders-and-daily-settlement/viz/TickGridViz";

export default function KrxDerivativesMechanicsArticle() {
  return (
    <DerivativeDeepArticle
      data={krxDerivativesMechanicsData}
      vizBefore={{
        need: { 0: <PartialFillViz /> },
        source: { 0: <TickGridViz /> },
        comparison: { 1: <SettlementExitViz /> },
      }}
    />
  );
}
