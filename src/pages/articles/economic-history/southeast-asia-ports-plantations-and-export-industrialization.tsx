import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { southeastAsiaEconomicHistoryData } from "./economic-history-regional-expansion-data";
import ExportLedgerCellsViz from "./southeast-asia-ports-plantations-and-export-industrialization/viz/ExportLedgerCellsViz";
import ForeignDebtSwellViz from "./southeast-asia-ports-plantations-and-export-industrialization/viz/ForeignDebtSwellViz";
import TradeTimelineViz from "./southeast-asia-ports-plantations-and-export-industrialization/viz/TradeTimelineViz";

const data = {
  ...southeastAsiaEconomicHistoryData,
  figures: {
    case: { 1: <ExportLedgerCellsViz /> },
    picture: { 0: <TradeTimelineViz /> },
    mechanism: { 1: <ForeignDebtSwellViz /> },
  },
};

export default function SoutheastAsiaPortsPlantationsAndExportIndustrializationArticle() {
  return <WorldHistoryArticle data={data} />;
}
