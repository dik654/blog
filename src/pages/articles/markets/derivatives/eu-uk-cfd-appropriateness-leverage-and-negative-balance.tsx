import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { euUkCfdData } from "./derivative-jurisdiction-data";
import CfdProtectionTimelineViz from "./CfdProtectionTimelineViz";

export default function EuUkCfdProtectionArticle() {
  return (
    <div className="space-y-16">
      <CfdProtectionTimelineViz />
      <DerivativeDeepArticle data={euUkCfdData} />
    </div>
  );
}
