import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { regionalIncomeMeasurementData } from "./economic-history-institutional-data";
import CityLedgerFlowViz from "./regional-gdp-household-income-and-within-country-inequality/viz/CityLedgerFlowViz";
import TwoRegionSplitViz from "./regional-gdp-household-income-and-within-country-inequality/viz/TwoRegionSplitViz";

const data = {
  ...regionalIncomeMeasurementData,
  figures: {
    case: { 0: <TwoRegionSplitViz /> },
    mechanism: { 0: <CityLedgerFlowViz /> },
  },
};

export default function RegionalGdpHouseholdIncomeAndWithinCountryInequalityArticle() {
  return <WorldHistoryArticle data={data} />;
}
