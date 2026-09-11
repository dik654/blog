import Overview from "./private-access-inbound-closure/Overview";
import ReachScope from "./private-access-inbound-closure/ReachScope";
import OutboundConnector from "./private-access-inbound-closure/OutboundConnector";
import PrivateEndpoint from "./private-access-inbound-closure/PrivateEndpoint";
import PerRequestDecision from "./private-access-inbound-closure/PerRequestDecision";
import AccessGate from "./private-access-inbound-closure/AccessGate";

/**
 * 안쪽 자원을 열지 않고 닿게 하는 방법은 방향을 뒤집는 것입니다
 *
 * 제품 구조는 각 사업자의 공개 문서 범위까지만 다루고 구체 설정값은 권고하지 않는다.
 */
export default function PrivateAccessInboundClosureArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <ReachScope />
      <OutboundConnector />
      <PrivateEndpoint />
      <PerRequestDecision />
      <AccessGate />
    </div>
  );
}
