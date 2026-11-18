import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { warFinanceWelfareData } from "./economic-history-regional-expansion-data";
import BondClaimFlowViz from "./war-finance-public-debt-and-welfare-state-capacity/viz/BondClaimFlowViz";
import InflationRealValueViz from "./war-finance-public-debt-and-welfare-state-capacity/viz/InflationRealValueViz";
import RateBondPriceViz from "./war-finance-public-debt-and-welfare-state-capacity/viz/RateBondPriceViz";
import UkDebtCellsViz from "./war-finance-public-debt-and-welfare-state-capacity/viz/UkDebtCellsViz";
import WarLedgerTimeViz from "./war-finance-public-debt-and-welfare-state-capacity/viz/WarLedgerTimeViz";

const data = {
  ...warFinanceWelfareData,
  figures: {
    case: { 0: <WarLedgerTimeViz /> },
    need: { 1: <InflationRealValueViz /> },
    mechanism: { 0: <BondClaimFlowViz />, 1: <RateBondPriceViz /> },
    comparison: { 0: <UkDebtCellsViz /> },
  },
};

export default function WarFinancePublicDebtAndWelfareStateCapacityArticle() {
  return <WorldHistoryArticle data={data} />;
}
