import CatalhoyukLayersViz from "./agriculture-settlement-and-neolithic-tradeoffs/viz/CatalhoyukLayersViz";
import GranaryTwoYearViz from "./agriculture-settlement-and-neolithic-tradeoffs/viz/GranaryTwoYearViz";
import WorldHistoryArticle, { type WorldHistoryArticleData } from "./WorldHistoryArticle";
import { agricultureSettlementData } from "./global-history-foundations-expansion-data";

const data: WorldHistoryArticleData = {
  ...agricultureSettlementData,
  figures: {
    case: { 0: <GranaryTwoYearViz /> },
    source: { 0: <CatalhoyukLayersViz /> },
  },
};

export default function AgricultureSettlementAndNeolithicTradeoffsArticle() {
  return <WorldHistoryArticle data={data} />;
}
