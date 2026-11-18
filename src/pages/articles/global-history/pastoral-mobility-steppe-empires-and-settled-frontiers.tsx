import WorldHistoryArticle, { type WorldHistoryArticleData } from "./WorldHistoryArticle";
import { pastoralMobilityData } from "./global-history-foundations-expansion-data";
import HerdYearViz from "./pastoral-mobility-steppe-empires-and-settled-frontiers/viz/HerdYearViz";
import SeasonalRouteViz from "./pastoral-mobility-steppe-empires-and-settled-frontiers/viz/SeasonalRouteViz";
import TributeCycleViz from "./pastoral-mobility-steppe-empires-and-settled-frontiers/viz/TributeCycleViz";

const data: WorldHistoryArticleData = {
  ...pastoralMobilityData,
  figures: {
    case: { 1: <HerdYearViz /> },
    picture: { 0: <SeasonalRouteViz /> },
    mechanism: { 0: <TributeCycleViz /> },
  },
};

export default function PastoralMobilitySteppeEmpiresAndSettledFrontiersArticle() {
  return <WorldHistoryArticle data={data} />;
}
