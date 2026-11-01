import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { otcLifecycleData } from "./derivative-risk-data";
import OtcLifecycleMapViz from "./OtcLifecycleMapViz";

export default function OtcLifecycleArticle() {
  return (
    <div className="space-y-16">
      <OtcLifecycleMapViz />
      <DerivativeDeepArticle data={otcLifecycleData} />
    </div>
  );
}
