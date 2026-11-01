import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { multiAssetRareEventData } from "./derivative-operations-and-governance-data";
import MultiAssetRareEventViz from "./MultiAssetRareEventViz";

export default function MultiAssetRareEventArticle() {
  return <div className="space-y-16"><MultiAssetRareEventViz /><DerivativeDeepArticle data={multiAssetRareEventData} /></div>;
}
