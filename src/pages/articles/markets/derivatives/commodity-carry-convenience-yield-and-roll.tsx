import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { commodityCarryData } from "./derivative-risk-data";
import ConvenienceThresholdViz from "./commodity-carry-convenience-yield-and-roll/viz/ConvenienceThresholdViz";
import RollContangoViz from "./commodity-carry-convenience-yield-and-roll/viz/RollContangoViz";

export default function CommodityCarryArticle() {
  return (
    <DerivativeDeepArticle
      data={commodityCarryData}
      vizBefore={{
        picture: { 0: <RollContangoViz /> },
        mechanism: { 0: <ConvenienceThresholdViz /> },
      }}
    />
  );
}
