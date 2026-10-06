import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { creditTrancheAuctionData } from "./derivative-specialized-market-gaps-data";

export default function CreditTrancheAuctionArticle() {
  return <DerivativeDeepArticle data={creditTrancheAuctionData} />;
}
