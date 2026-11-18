import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { multiAssetRareEventData } from "./derivative-operations-and-governance-data";
import BasketVarianceViz from "./multi-asset-options-correlation-and-rare-event-simulation/viz/BasketVarianceViz";
import CorrelatedShockViz from "./multi-asset-options-correlation-and-rare-event-simulation/viz/CorrelatedShockViz";
import ImportanceWeightViz from "./multi-asset-options-correlation-and-rare-event-simulation/viz/ImportanceWeightViz";
import RareHitErrorViz from "./multi-asset-options-correlation-and-rare-event-simulation/viz/RareHitErrorViz";

export default function MultiAssetRareEventArticle() {
  return (
    <DerivativeDeepArticle
      data={multiAssetRareEventData}
      vizBefore={{
        case: { 0: <BasketVarianceViz /> },
        picture: { 0: <CorrelatedShockViz /> },
        need: { 0: <RareHitErrorViz /> },
        names: { 1: <ImportanceWeightViz /> },
      }}
    />
  );
}
