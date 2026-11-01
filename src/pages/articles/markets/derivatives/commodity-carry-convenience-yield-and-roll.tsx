import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { commodityCarryData } from "./derivative-risk-data";
import CommodityCarryMapViz from "./CommodityCarryMapViz";

export default function CommodityCarryArticle() {
  return (
    <div className="space-y-16">
      <CommodityCarryMapViz />
      <DerivativeDeepArticle data={commodityCarryData} />
    </div>
  );
}
