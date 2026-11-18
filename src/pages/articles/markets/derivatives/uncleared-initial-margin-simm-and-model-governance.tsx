import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { unclearedInitialMarginData } from "./derivative-operations-and-governance-data";
import CloseOutGapViz from "./uncleared-initial-margin-simm-and-model-governance/viz/CloseOutGapViz";
import CorrelationAggregationViz from "./uncleared-initial-margin-simm-and-model-governance/viz/CorrelationAggregationViz";
import SimmControlLoopViz from "./uncleared-initial-margin-simm-and-model-governance/viz/SimmControlLoopViz";
import SimmVersionTimelineViz from "./uncleared-initial-margin-simm-and-model-governance/viz/SimmVersionTimelineViz";
import VmImFlowViz from "./uncleared-initial-margin-simm-and-model-governance/viz/VmImFlowViz";

export default function UnclearedInitialMarginArticle() {
  return (
    <DerivativeDeepArticle
      data={unclearedInitialMarginData}
      vizBefore={{
        overview: { 0: <CloseOutGapViz /> },
        case: { 0: <CorrelationAggregationViz /> },
        picture: { 0: <VmImFlowViz /> },
        mechanism: { 0: <SimmControlLoopViz /> },
        comparison: { 0: <SimmVersionTimelineViz /> },
      }}
    />
  );
}
