import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { inflationFinancializationData } from "./economic-history-thematic-data";
import GreatInflationTimelineViz from "./great-inflation-disinflation-and-financialization/viz/GreatInflationTimelineViz";
import PurchasingPowerViz from "./great-inflation-disinflation-and-financialization/viz/PurchasingPowerViz";
import RateShockChainViz from "./great-inflation-disinflation-and-financialization/viz/RateShockChainViz";

const data = {
  ...inflationFinancializationData,
  figures: {
    case: { 0: <PurchasingPowerViz /> },
    mechanism: { 0: <RateShockChainViz /> },
    source: { 1: <GreatInflationTimelineViz /> },
  },
};

export default function GreatInflationDisinflationAndFinancializationArticle() {
  return <WorldHistoryArticle data={data} />;
}
