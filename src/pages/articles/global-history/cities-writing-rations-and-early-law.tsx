import MissingTenTraceViz from "./cities-writing-rations-and-early-law/viz/MissingTenTraceViz";
import RationSplitViz from "./cities-writing-rations-and-early-law/viz/RationSplitViz";
import WorldHistoryArticle, { type WorldHistoryArticleData } from "./WorldHistoryArticle";
import { citiesWritingLawData } from "./global-history-foundations-expansion-data";

const data: WorldHistoryArticleData = {
  ...citiesWritingLawData,
  figures: {
    case: { 0: <RationSplitViz /> },
    mechanism: { 0: <MissingTenTraceViz /> },
  },
};

export default function CitiesWritingRationsAndEarlyLawArticle() {
  return <WorldHistoryArticle data={data} />;
}
