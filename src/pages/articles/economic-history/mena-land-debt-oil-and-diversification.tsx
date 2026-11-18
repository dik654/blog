import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { menaLandOilData } from "./economic-history-regional-data";
import DebtControlTimelineViz from "./mena-land-debt-oil-and-diversification/viz/DebtControlTimelineViz";
import OilShockGapViz from "./mena-land-debt-oil-and-diversification/viz/OilShockGapViz";
import PetrodollarRecyclingViz from "./mena-land-debt-oil-and-diversification/viz/PetrodollarRecyclingViz";

const data = {
  ...menaLandOilData,
  figures: {
    case: { 1: <OilShockGapViz /> },
    picture: { 0: <DebtControlTimelineViz /> },
    mechanism: { 1: <PetrodollarRecyclingViz /> },
  },
};

export default function Article() {
  return <WorldHistoryArticle data={data} />;
}
