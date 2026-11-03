import Overview from "./ai-accelerator-vendor-comparison/Overview";
import MemoryAxis from "./ai-accelerator-vendor-comparison/MemoryAxis";
import LinkAxis from "./ai-accelerator-vendor-comparison/LinkAxis";
import FormFactor from "./ai-accelerator-vendor-comparison/FormFactor";
import SoftwareAxis from "./ai-accelerator-vendor-comparison/SoftwareAxis";
import SnapshotGate from "./ai-accelerator-vendor-comparison/SnapshotGate";
import {
  acceleratorVendorFieldLab,
  acceleratorVendorTeachCase,
} from "./ai-accelerator-vendor-comparison/teachData";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";

/**
 * 가속기 비교는 같은 요청이 다섯 관문을 통과하는 순서로 합니다
 *
 * 스펙 스냅샷은 2026-11-02 기준 각 벤더 공식 문서에서 가져왔다.
 */
export default function AiAcceleratorVendorComparisonArticle() {
  return (
    <div className="space-y-16">
      <HardwareTeachOpening data={acceleratorVendorTeachCase} />
      <HardwareTeachMechanism data={acceleratorVendorTeachCase}>
        <Overview />
        <MemoryAxis />
        <LinkAxis />
        <FormFactor />
        <SoftwareAxis />
        <SnapshotGate />
      </HardwareTeachMechanism>
      <HardwareFieldLab data={acceleratorVendorFieldLab} />
    </div>
  );
}
