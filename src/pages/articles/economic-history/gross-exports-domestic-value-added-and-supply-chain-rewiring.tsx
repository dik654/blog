import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { valueAddedTradeRewiringData } from "./economic-history-institutional-data";
import ExportPathViz from "./gross-exports-domestic-value-added-and-supply-chain-rewiring/viz/ExportPathViz";
import TivaTreeViz from "./gross-exports-domestic-value-added-and-supply-chain-rewiring/viz/TivaTreeViz";
import ValueLedgerViz from "./gross-exports-domestic-value-added-and-supply-chain-rewiring/viz/ValueLedgerViz";

const data = {
  ...valueAddedTradeRewiringData,
  figures: {
    case: { 0: <ValueLedgerViz /> },
    mechanism: { 0: <ExportPathViz /> },
    source: { 1: <TivaTreeViz /> },
  },
};

export default function GrossExportsDomesticValueAddedAndSupplyChainRewiringArticle() {
  return <WorldHistoryArticle data={data} />;
}
