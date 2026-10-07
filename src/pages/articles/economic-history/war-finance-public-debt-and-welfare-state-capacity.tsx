import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { warFinanceWelfareData } from "./economic-history-regional-expansion-data";

export default function WarFinancePublicDebtAndWelfareStateCapacityArticle() {
  return <WorldHistoryArticle data={warFinanceWelfareData} />;
}
