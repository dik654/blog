import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { clearingData } from "./derivative-data";
import CentralClearingViz from "./clearing-margin-and-default-waterfall/viz/CentralClearingViz";
import DefaultWaterfallViz from "./clearing-margin-and-default-waterfall/viz/DefaultWaterfallViz";
import MarginAccountViz from "./clearing-margin-and-default-waterfall/viz/MarginAccountViz";

export default function ClearingMarginArticle() {
  return (
    <DerivativeDeepArticle
      data={clearingData}
      vizBefore={{
        "black-box": { 0: <CentralClearingViz /> },
        case: { 0: <MarginAccountViz /> },
        comparison: { 0: <DefaultWaterfallViz /> },
      }}
    />
  );
}
