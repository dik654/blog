import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import CorridorDirectionViz from "./central-asia-pastoralism-irrigation-planning-and-corridors/viz/CorridorDirectionViz";
import UpstreamDownstreamSeasonViz from "./central-asia-pastoralism-irrigation-planning-and-corridors/viz/UpstreamDownstreamSeasonViz";
import WaterPriorityCellsViz from "./central-asia-pastoralism-irrigation-planning-and-corridors/viz/WaterPriorityCellsViz";
import { centralAsiaEconomicHistoryData } from "./economic-history-regional-expansion-data";

const data = {
  ...centralAsiaEconomicHistoryData,
  figures: {
    case: { 0: <WaterPriorityCellsViz />, 1: <UpstreamDownstreamSeasonViz /> },
    picture: { 0: <CorridorDirectionViz /> },
  },
};

export default function CentralAsiaPastoralismIrrigationPlanningAndCorridorsArticle() {
  return <WorldHistoryArticle data={data} />;
}
