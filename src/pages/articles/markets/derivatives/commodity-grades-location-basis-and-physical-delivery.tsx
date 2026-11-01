import DerivativeDeepArticle from "./DerivativeDeepArticle";
import CommodityDeliveryLifecycleViz from "./CommodityDeliveryLifecycleViz";
import { commodityDeliveryData } from "./derivative-specialized-market-gaps-data";

export default function CommodityDeliveryArticle() {
  return <div className="space-y-16"><CommodityDeliveryLifecycleViz /><DerivativeDeepArticle data={commodityDeliveryData} /></div>;
}
