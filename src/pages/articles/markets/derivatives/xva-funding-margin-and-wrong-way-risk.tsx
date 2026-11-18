import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { xvaData } from "./derivative-model-data";
import MporFloorViz from "./xva-funding-margin-and-wrong-way-risk/viz/MporFloorViz";
import WrongWayAreaViz from "./xva-funding-margin-and-wrong-way-risk/viz/WrongWayAreaViz";
import XvaInputMapViz from "./xva-funding-margin-and-wrong-way-risk/viz/XvaInputMapViz";

export default function XvaFundingMarginArticle() {
  return (
    <DerivativeDeepArticle
      data={xvaData}
      vizBefore={{
        picture: { 1: <WrongWayAreaViz /> },
        mechanism: { 0: <XvaInputMapViz /> },
        source: { 0: <MporFloorViz /> },
      }}
    />
  );
}
