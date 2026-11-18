import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import CocoaBoardGateViz from "./africa-slave-trades-colonial-tax-and-commodity-dependence/viz/CocoaBoardGateViz";
import HouseholdToNationChainViz from "./africa-slave-trades-colonial-tax-and-commodity-dependence/viz/HouseholdToNationChainViz";
import PriceHalvingLedgerViz from "./africa-slave-trades-colonial-tax-and-commodity-dependence/viz/PriceHalvingLedgerViz";
import { africaWorldEconomyData } from "./economic-history-regional-data";

const data = {
  ...africaWorldEconomyData,
  figures: {
    case: { 1: <PriceHalvingLedgerViz /> },
    names: { 2: <CocoaBoardGateViz /> },
    mechanism: { 0: <HouseholdToNationChainViz /> },
  },
};

export default function Article() {
  return <WorldHistoryArticle data={data} />;
}
