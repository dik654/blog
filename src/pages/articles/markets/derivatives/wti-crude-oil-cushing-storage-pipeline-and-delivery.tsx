import DerivativeDeepArticle from "./DerivativeDeepArticle";
import WtiCushingDeliveryPathViz from "./WtiCushingDeliveryPathViz";
import { wtiDeliveryLedgerData } from "./derivative-applied-ledgers-data";

export default function WtiCrudeOilDeliveryArticle() {
  return <div className="space-y-16"><WtiCushingDeliveryPathViz /><DerivativeDeepArticle data={wtiDeliveryLedgerData} /></div>;
}
