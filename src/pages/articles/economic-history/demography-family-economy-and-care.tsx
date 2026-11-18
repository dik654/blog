import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import KoreaRatesViz from "./demography-family-economy-and-care/viz/KoreaRatesViz";
import TransitionStagesViz from "./demography-family-economy-and-care/viz/TransitionStagesViz";
import { demographyFamilyEconomyData } from "./economic-history-thematic-data";

const data = {
  ...demographyFamilyEconomyData,
  figures: {
    overview: { 0: <TransitionStagesViz /> },
    source: { 1: <KoreaRatesViz /> },
  },
};

export default function DemographyFamilyEconomyAndCareArticle() {
  return <WorldHistoryArticle data={data} />;
}
