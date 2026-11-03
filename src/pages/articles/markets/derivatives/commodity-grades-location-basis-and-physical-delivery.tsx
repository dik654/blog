import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { commodityDeliveryData } from "./derivative-specialized-market-gaps-data";

export default function CommodityDeliveryArticle() {
  return <DerivativeDeepArticle data={commodityDeliveryData} />;
}
