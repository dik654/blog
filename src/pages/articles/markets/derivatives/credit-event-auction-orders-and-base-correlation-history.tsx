import DerivativeDeepArticle from "./DerivativeDeepArticle";
import CreditEventAuctionOrderViz from "./CreditEventAuctionOrderViz";
import { creditAuctionHistoryData } from "./derivative-applied-ledgers-data";

export default function CreditEventAuctionHistoryArticle() {
  return <div className="space-y-16"><CreditEventAuctionOrderViz /><DerivativeDeepArticle data={creditAuctionHistoryData} /></div>;
}
