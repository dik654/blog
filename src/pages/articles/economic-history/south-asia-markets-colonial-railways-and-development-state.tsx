import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { southAsiaMarketsStatesData } from "./economic-history-regional-data";
import PriceGapLadderViz from "./south-asia-markets-colonial-railways-and-development-state/viz/PriceGapLadderViz";
import SouthAsiaTimelineViz from "./south-asia-markets-colonial-railways-and-development-state/viz/SouthAsiaTimelineViz";
import UnbuiltLinePlaceboViz from "./south-asia-markets-colonial-railways-and-development-state/viz/UnbuiltLinePlaceboViz";

const data = {
  ...southAsiaMarketsStatesData,
  figures: {
    case: { 0: <PriceGapLadderViz /> },
    picture: { 0: <SouthAsiaTimelineViz /> },
    source: { 0: <UnbuiltLinePlaceboViz /> },
  },
};

export default function Article() {
  return <WorldHistoryArticle data={data} />;
}
