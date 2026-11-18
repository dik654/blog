import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { commercialLawInsolvencyData } from "./economic-history-institutional-data";
import InsolvencyPathViz from "./commercial-law-limited-liability-and-insolvency/viz/InsolvencyPathViz";
import RecoveryWaterfallViz from "./commercial-law-limited-liability-and-insolvency/viz/RecoveryWaterfallViz";
import VoteThresholdViz from "./commercial-law-limited-liability-and-insolvency/viz/VoteThresholdViz";

const data = {
  ...commercialLawInsolvencyData,
  figures: {
    case: { 0: <RecoveryWaterfallViz /> },
    mechanism: { 0: <InsolvencyPathViz /> },
    comparison: { 0: <VoteThresholdViz /> },
  },
};

export default function CommercialLawLimitedLiabilityAndInsolvencyArticle() {
  return <WorldHistoryArticle data={data} />;
}
