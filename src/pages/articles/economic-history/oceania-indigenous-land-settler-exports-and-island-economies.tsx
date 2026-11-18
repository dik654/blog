import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { oceaniaEconomicHistoryData } from "./economic-history-regional-expansion-data";
import IslandIncomeShockViz from "./oceania-indigenous-land-settler-exports-and-island-economies/viz/IslandIncomeShockViz";
import VesselDayViz from "./oceania-indigenous-land-settler-exports-and-island-economies/viz/VesselDayViz";

const data = {
  ...oceaniaEconomicHistoryData,
  figures: {
    case: { 0: <IslandIncomeShockViz /> },
    comparison: { 1: <VesselDayViz /> },
  },
};

export default function OceaniaIndigenousLandSettlerExportsAndIslandEconomiesArticle() {
  return <WorldHistoryArticle data={data} />;
}
