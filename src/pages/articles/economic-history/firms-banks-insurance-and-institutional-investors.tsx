import WorldHistoryArticle from "../global-history/WorldHistoryArticle";
import { firmsBanksInsuranceData } from "./economic-history-thematic-data";
import BankLiabilityTimelineViz from "./firms-banks-insurance-and-institutional-investors/viz/BankLiabilityTimelineViz";
import FireLossClaimsViz from "./firms-banks-insurance-and-institutional-investors/viz/FireLossClaimsViz";

export default function FirmsBanksInsuranceAndInstitutionalInvestorsArticle() {
  return (
    <WorldHistoryArticle
      data={{
        ...firmsBanksInsuranceData,
        figures: {
          case: { 0: <FireLossClaimsViz /> },
          source: { 1: <BankLiabilityTimelineViz /> },
        },
      }}
    />
  );
}
