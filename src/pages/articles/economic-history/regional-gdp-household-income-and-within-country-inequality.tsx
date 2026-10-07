import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { regionalIncomeMeasurementData } from "./economic-history-institutional-data";

export default function RegionalGdpHouseholdIncomeAndWithinCountryInequalityArticle() {
  return <WorldHistoryArticle data={regionalIncomeMeasurementData} />;
}
