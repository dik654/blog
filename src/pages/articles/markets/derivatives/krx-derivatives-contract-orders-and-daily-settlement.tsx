import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { krxDerivativesMechanicsData } from "./derivative-curriculum-gaps-data";
import KrxContractOrderSettlementViz from "./KrxContractOrderSettlementViz";

export default function KrxDerivativesMechanicsArticle() {
  return <div className="space-y-16"><KrxContractOrderSettlementViz /><DerivativeDeepArticle data={krxDerivativesMechanicsData} /></div>;
}
