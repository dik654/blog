import Overview from "./server-cpu-lineup-comparison/Overview";
import LaneBudget from "./server-cpu-lineup-comparison/LaneBudget";
import MemoryChannels from "./server-cpu-lineup-comparison/MemoryChannels";
import CoreCharacter from "./server-cpu-lineup-comparison/CoreCharacter";
import ProductTiers from "./server-cpu-lineup-comparison/ProductTiers";
import SelectionGate from "./server-cpu-lineup-comparison/SelectionGate";

/**
 * GPU 서버의 CPU는 레인과 채널로 고릅니다
 *
 * 계열별 대표값은 2026-09-11 기준 각 제조사 공개 사양에서 가져왔다.
 */
export default function ServerCpuLineupComparisonArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <LaneBudget />
      <MemoryChannels />
      <CoreCharacter />
      <ProductTiers />
      <SelectionGate />
    </div>
  );
}
