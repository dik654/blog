import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { valueAddedTradeRewiringData } from "./economic-history-institutional-data";

export default function GrossExportsDomesticValueAddedAndSupplyChainRewiringArticle() {
  return <WorldHistoryArticle data={valueAddedTradeRewiringData} />;
}
