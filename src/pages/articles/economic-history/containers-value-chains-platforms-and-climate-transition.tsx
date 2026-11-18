import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import FiveFlowsViz from "./containers-value-chains-platforms-and-climate-transition/viz/FiveFlowsViz";
import PriceShockViz from "./containers-value-chains-platforms-and-climate-transition/viz/PriceShockViz";
import ShockChainViz from "./containers-value-chains-platforms-and-climate-transition/viz/ShockChainViz";
import { supplyChainsPlatformsClimateData } from "./economic-history-thematic-data";

const data = {
  ...supplyChainsPlatformsClimateData,
  figures: {
    "black-box": { 0: <FiveFlowsViz /> },
    case: { 0: <PriceShockViz /> },
    mechanism: { 0: <ShockChainViz /> },
  },
};

export default function ContainersValueChainsPlatformsAndClimateTransitionArticle() {
  return <WorldHistoryArticle data={data} />;
}
