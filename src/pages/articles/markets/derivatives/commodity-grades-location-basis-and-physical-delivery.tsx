import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { commodityDeliveryData } from "./derivative-specialized-market-gaps-data";
import BasisLadderViz from "./commodity-grades-location-basis-and-physical-delivery/viz/BasisLadderViz";
import DeliveryLanesViz from "./commodity-grades-location-basis-and-physical-delivery/viz/DeliveryLanesViz";
import RuleLookupViz from "./commodity-grades-location-basis-and-physical-delivery/viz/RuleLookupViz";

export default function CommodityDeliveryArticle() {
  return (
    <DerivativeDeepArticle
      data={commodityDeliveryData}
      vizBefore={{
        picture: { 0: <DeliveryLanesViz /> },
        need: { 0: <BasisLadderViz /> },
        source: { 0: <RuleLookupViz /> },
      }}
    />
  );
}
