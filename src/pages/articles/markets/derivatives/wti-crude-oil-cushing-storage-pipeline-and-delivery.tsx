import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { wtiDeliveryLedgerData } from "./derivative-applied-ledgers-data";
import DeliveryTimelineViz from "./wti-crude-oil-cushing-storage-pipeline-and-delivery/viz/DeliveryTimelineViz";
import TankUsableSpaceViz from "./wti-crude-oil-cushing-storage-pipeline-and-delivery/viz/TankUsableSpaceViz";
import TransferMethodsViz from "./wti-crude-oil-cushing-storage-pipeline-and-delivery/viz/TransferMethodsViz";

export default function WtiCrudeOilDeliveryArticle() {
  return (
    <DerivativeDeepArticle
      data={wtiDeliveryLedgerData}
      vizBefore={{
        picture: { 1: <TransferMethodsViz /> },
        need: { 0: <TankUsableSpaceViz /> },
        mechanism: { 0: <DeliveryTimelineViz /> },
      }}
    />
  );
}
