import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { creditTrancheAuctionData } from "./derivative-specialized-market-gaps-data";
import BaseTrancheNestViz from "./credit-tranche-base-correlation-and-default-auction/viz/BaseTrancheNestViz";
import CommonFactorDefaultViz from "./credit-tranche-base-correlation-and-default-auction/viz/CommonFactorDefaultViz";
import TrancheFillViz from "./credit-tranche-base-correlation-and-default-auction/viz/TrancheFillViz";

export default function CreditTrancheAuctionArticle() {
  return (
    <DerivativeDeepArticle
      data={creditTrancheAuctionData}
      vizBefore={{
        case: { 0: <TrancheFillViz /> },
        names: { 0: <CommonFactorDefaultViz /> },
        source: { 0: <BaseTrancheNestViz /> },
      }}
    />
  );
}
