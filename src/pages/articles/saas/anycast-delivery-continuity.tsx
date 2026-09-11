import Overview from "./anycast-delivery-continuity/Overview";
import AnycastRouting from "./anycast-delivery-continuity/AnycastRouting";
import SiteBalancing from "./anycast-delivery-continuity/SiteBalancing";
import HealthAndDrain from "./anycast-delivery-continuity/HealthAndDrain";
import CorrelatedChange from "./anycast-delivery-continuity/CorrelatedChange";
import ContinuityGate from "./anycast-delivery-continuity/ContinuityGate";

/**
 * 무중단은 고장이 없는 상태가 아니라 고장이 짧은 상태입니다
 *
 * 인용한 측정값·구조는 공개 논문과 사업자 문서 범위까지만 다루고 구체 설정값은 권고하지 않는다.
 */
export default function AnycastDeliveryContinuityArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <AnycastRouting />
      <SiteBalancing />
      <HealthAndDrain />
      <CorrelatedChange />
      <ContinuityGate />
    </div>
  );
}
