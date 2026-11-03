import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { wtiDeliveryLedgerData } from "./derivative-applied-ledgers-data";

export default function WtiCrudeOilDeliveryArticle() {
  return <DerivativeDeepArticle data={wtiDeliveryLedgerData} />;
}
