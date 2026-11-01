import DerivativeDeepArticle from "./DerivativeDeepArticle";
import CreditTrancheAuctionLifecycleViz from "./CreditTrancheAuctionLifecycleViz";
import { creditTrancheAuctionData } from "./derivative-specialized-market-gaps-data";

export default function CreditTrancheAuctionArticle() {
  return <div className="space-y-16"><CreditTrancheAuctionLifecycleViz /><DerivativeDeepArticle data={creditTrancheAuctionData} /></div>;
}
