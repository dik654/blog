import Overview from "./multiview-fusion/Overview";
import EarlyFusion from "./multiview-fusion/EarlyFusion";
import LateFusion from "./multiview-fusion/LateFusion";
import AttentionFusion from "./multiview-fusion/AttentionFusion";

export default function MultiviewFusionArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <EarlyFusion />
      <LateFusion />
      <AttentionFusion />
    </div>
  );
}
