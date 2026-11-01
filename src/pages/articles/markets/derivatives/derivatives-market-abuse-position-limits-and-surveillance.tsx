import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { marketAbuseData } from "./derivative-professional-practice-data";
import MarketSurveillanceViz from "./MarketSurveillanceViz";

export default function DerivativesMarketAbuseArticle() {
  return (
    <div className="space-y-16">
      <MarketSurveillanceViz />
      <DerivativeDeepArticle data={marketAbuseData} />
    </div>
  );
}
