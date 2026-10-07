import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { creditAuctionHistoryData } from "./derivative-applied-ledgers-data";

export default function CreditEventAuctionHistoryArticle() {
  return <DerivativeDeepArticle data={creditAuctionHistoryData} />;
}
