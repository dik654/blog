import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { creditAuctionHistoryData } from "./derivative-applied-ledgers-data";
import AuctionLadderViz from "./credit-event-auction-orders-and-base-correlation-history/viz/AuctionLadderViz";
import BaseTrancheNestViz from "./credit-event-auction-orders-and-base-correlation-history/viz/BaseTrancheNestViz";

export default function CreditEventAuctionHistoryArticle() {
  return (
    <DerivativeDeepArticle
      data={creditAuctionHistoryData}
      vizBefore={{
        picture: { 0: <AuctionLadderViz /> },
        names: { 1: <BaseTrancheNestViz /> },
      }}
    />
  );
}
