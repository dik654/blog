import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { otcInfrastructureData } from "./derivative-jurisdiction-data";

export default function OtcClearingReportingArticle() {
  return <DerivativeDeepArticle data={otcInfrastructureData} />;
}
