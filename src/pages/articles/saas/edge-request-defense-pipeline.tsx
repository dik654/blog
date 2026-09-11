import Overview from "./edge-request-defense-pipeline/Overview";
import PacketLayer from "./edge-request-defense-pipeline/PacketLayer";
import RequestLayer from "./edge-request-defense-pipeline/RequestLayer";
import ClientSignals from "./edge-request-defense-pipeline/ClientSignals";
import OriginProtection from "./edge-request-defense-pipeline/OriginProtection";
import TradeoffGate from "./edge-request-defense-pipeline/TradeoffGate";

/**
 * 요청 하나가 오리진까지 여러 관문을 지납니다
 *
 * 계층별 구조는 공개 문서로 확인되는 범위만 다루고, 사업자별 내부 구현 차이는 경계로 표시한다.
 */
export default function EdgeRequestDefensePipelineArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <PacketLayer />
      <RequestLayer />
      <ClientSignals />
      <OriginProtection />
      <TradeoffGate />
    </div>
  );
}
