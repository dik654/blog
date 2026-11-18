import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { northAmericaEconomicHistoryData } from "./economic-history-regional-expansion-data";
import LandToCollateralViz from "./north-america-land-slavery-railroads-and-mass-production/viz/LandToCollateralViz";
import RailroadCounterfactualViz from "./north-america-land-slavery-railroads-and-mass-production/viz/RailroadCounterfactualViz";

const data = {
  ...northAmericaEconomicHistoryData,
  figures: {
    need: { 1: <RailroadCounterfactualViz /> },
    mechanism: { 0: <LandToCollateralViz /> },
  },
};

export default function NorthAmericaLandSlaveryRailroadsAndMassProductionArticle() {
  return <WorldHistoryArticle data={data} />;
}
