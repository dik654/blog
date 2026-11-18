import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { latinAmericaWorldMarketData } from "./economic-history-regional-data";
import ForexLedgerShockViz from "./latin-america-exports-import-substitution-and-debt/viz/ForexLedgerShockViz";
import OriginalSinGridViz from "./latin-america-exports-import-substitution-and-debt/viz/OriginalSinGridViz";
import PetrodollarLoopViz from "./latin-america-exports-import-substitution-and-debt/viz/PetrodollarLoopViz";

const data = {
  ...latinAmericaWorldMarketData,
  figures: {
    case: { 1: <ForexLedgerShockViz /> },
    comparison: { 1: <PetrodollarLoopViz />, 2: <OriginalSinGridViz /> },
  },
};

export default function Article() {
  return <WorldHistoryArticle data={data} />;
}
