import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { otcInfrastructureData } from "./derivative-jurisdiction-data";
import OtcClearingReportingViz from "./OtcClearingReportingViz";

export default function OtcClearingReportingArticle() {
  return (
    <div className="space-y-16">
      <OtcClearingReportingViz />
      <DerivativeDeepArticle data={otcInfrastructureData} />
    </div>
  );
}
