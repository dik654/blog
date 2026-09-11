import Overview from "./datacenter-site-readiness/Overview";
import CoolingType from "./datacenter-site-readiness/CoolingType";
import PowerSizing from "./datacenter-site-readiness/PowerSizing";
import FloorLoad from "./datacenter-site-readiness/FloorLoad";
import Seismic from "./datacenter-site-readiness/Seismic";
import ReadinessGate from "./datacenter-site-readiness/ReadinessGate";

/**
 * 랙에 들어가는지는 무게와 냉각으로 먼저 갈립니다
 *
 * 하중·내진 수치는 계산 방법을 보여 주기 위한 예시이며 실제 판정은 도면과 담당 확인이 필요하다.
 */
export default function DatacenterSiteReadinessArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <CoolingType />
      <PowerSizing />
      <FloorLoad />
      <Seismic />
      <ReadinessGate />
    </div>
  );
}
