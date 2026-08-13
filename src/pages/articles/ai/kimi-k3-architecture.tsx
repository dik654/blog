import AttentionResiduals from "./kimi-k3-architecture/AttentionResiduals";
import HybridAttention from "./kimi-k3-architecture/HybridAttention";
import Overview from "./kimi-k3-architecture/Overview";
import ReadingReport from "./kimi-k3-architecture/ReadingReport";
import StableLatentMoe from "./kimi-k3-architecture/StableLatentMoe";

export default function KimiK3ArchitectureArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <HybridAttention />
      <AttentionResiduals />
      <StableLatentMoe />
      <ReadingReport />
    </div>
  );
}
