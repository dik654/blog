import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { paygPensionDemographyData } from "./economic-history-institutional-data";

export default function PayAsYouGoPensionsDemographyAndFiscalBalanceArticle() {
  return <WorldHistoryArticle data={paygPensionDemographyData} />;
}
