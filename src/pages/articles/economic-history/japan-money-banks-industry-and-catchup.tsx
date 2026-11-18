import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { japanIndustrializationData } from "./economic-history-regional-data";
import FactoryLoopViz from "./japan-money-banks-industry-and-catchup/viz/FactoryLoopViz";
import MoneyToGrowthTimelineViz from "./japan-money-banks-industry-and-catchup/viz/MoneyToGrowthTimelineViz";
import PreTrendViz from "./japan-money-banks-industry-and-catchup/viz/PreTrendViz";

export default function Article() {
  return (
    <WorldHistoryArticle
      data={{
        ...japanIndustrializationData,
        figures: {
          picture: { 0: <MoneyToGrowthTimelineViz /> },
          mechanism: { 0: <FactoryLoopViz /> },
          comparison: { 0: <PreTrendViz /> },
        },
      }}
    />
  );
}
