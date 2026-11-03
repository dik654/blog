import Overview from "./server-cpu-lineup-comparison/Overview";
import LaneBudget from "./server-cpu-lineup-comparison/LaneBudget";
import MemoryChannels from "./server-cpu-lineup-comparison/MemoryChannels";
import CoreCharacter from "./server-cpu-lineup-comparison/CoreCharacter";
import ProductTiers from "./server-cpu-lineup-comparison/ProductTiers";
import SelectionGate from "./server-cpu-lineup-comparison/SelectionGate";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { serverCpuFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";

/**
 * GPU 서버의 CPU는 레인과 채널로 고릅니다
 *
 * 예시 플랫폼 사양은 2026-11-02 기준 제조사 공식 자료에서 가져왔다.
 */
export default function ServerCpuLineupComparisonArticle() {
  return (
    <div className="space-y-16">
      <HardwareTeachOpening data={hardwareTeachCases.serverCpu} />
      <HardwareTeachMechanism data={hardwareTeachCases.serverCpu}>
        <Overview />
        <LaneBudget />
        <MemoryChannels />
        <CoreCharacter />
        <ProductTiers />
        <SelectionGate />
      </HardwareTeachMechanism>
      <HardwareFieldLab data={serverCpuFieldLab} />
    </div>
  );
}
