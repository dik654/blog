import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { otcLifecycleData } from "./derivative-risk-data";

export default function OtcLifecycleArticle() {
  return <DerivativeDeepArticle data={otcLifecycleData} />;
}
