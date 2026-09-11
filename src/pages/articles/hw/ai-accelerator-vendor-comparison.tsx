import Overview from "./ai-accelerator-vendor-comparison/Overview";
import MemoryAxis from "./ai-accelerator-vendor-comparison/MemoryAxis";
import LinkAxis from "./ai-accelerator-vendor-comparison/LinkAxis";
import FormFactor from "./ai-accelerator-vendor-comparison/FormFactor";
import SoftwareAxis from "./ai-accelerator-vendor-comparison/SoftwareAxis";
import SnapshotGate from "./ai-accelerator-vendor-comparison/SnapshotGate";

/**
 * 가속기 비교는 스펙표가 아니라 네 축으로 합니다
 *
 * 스펙 스냅샷은 2026-09-11 기준 각 벤더 공개 문서에서 가져왔다.
 */
export default function AiAcceleratorVendorComparisonArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <MemoryAxis />
      <LinkAxis />
      <FormFactor />
      <SoftwareAxis />
      <SnapshotGate />
    </div>
  );
}
