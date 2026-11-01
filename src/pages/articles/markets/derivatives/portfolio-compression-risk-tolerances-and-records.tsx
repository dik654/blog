import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { portfolioCompressionData } from "./derivative-curriculum-gaps-data";
import PortfolioCompressionViz from "./PortfolioCompressionViz";

export default function PortfolioCompressionArticle() {
  return <div className="space-y-16"><PortfolioCompressionViz /><DerivativeDeepArticle data={portfolioCompressionData} /></div>;
}
