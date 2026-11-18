import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { paygPensionDemographyData } from "./economic-history-institutional-data";
import DependencyRatioViz from "./pay-as-you-go-pensions-demography-and-fiscal-balance/viz/DependencyRatioViz";
import PaygLedgerViz from "./pay-as-you-go-pensions-demography-and-fiscal-balance/viz/PaygLedgerViz";

const data = {
  ...paygPensionDemographyData,
  figures: {
    case: { 0: <PaygLedgerViz /> },
    comparison: { 1: <DependencyRatioViz /> },
  },
};

export default function PayAsYouGoPensionsDemographyAndFiscalBalanceArticle() {
  return <WorldHistoryArticle data={data} />;
}
