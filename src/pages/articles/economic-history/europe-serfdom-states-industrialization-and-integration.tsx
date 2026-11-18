import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { europeInternalEconomicHistoryData } from "./economic-history-regional-expansion-data";
import HarvestLedgerSplitViz from "./europe-serfdom-states-industrialization-and-integration/viz/HarvestLedgerSplitViz";
import ZollvereinAccessionViz from "./europe-serfdom-states-industrialization-and-integration/viz/ZollvereinAccessionViz";

export default function EuropeSerfdomStatesIndustrializationAndIntegrationArticle() {
  return (
    <WorldHistoryArticle
      data={{
        ...europeInternalEconomicHistoryData,
        figures: {
          case: { 0: <HarvestLedgerSplitViz /> },
          picture: { 1: <ZollvereinAccessionViz /> },
        },
      }}
    />
  );
}
