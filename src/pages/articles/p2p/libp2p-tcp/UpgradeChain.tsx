import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";

export default function UpgradeChain() {
  return (
    <section id="upgrade-chain" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Upgrade chain은 성공 type뿐 아니라 timeout과 자원 소유권도 바꿉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Raw <code>TcpStream</code>에서 먼저 security protocol ID를 합의하고
          <Link to="/cs/p2p/libp2p-noise"> Noise</Link> handshake를 수행합니다. 성공하면
          remote PeerId와 authenticated encrypted I/O가 나오고, 그 위에서 Yamux 같은
          공통 stream multiplexer를 선택합니다. 마지막 output만
          <Link to="/cs/p2p/libp2p"> Swarm</Link>의 connection pool로 이동합니다.
        </p>
        <p>
          Security와 muxer 협상은 직렬 dependency이므로 각 단계에 별도 timeout과 error
          label이 필요합니다. Bob의 socket이 28ms에 연결됐는데 Noise가 timeout이라면
          network reachability 성공과 peer 인증 실패가 동시에 참입니다.
        </p>
        <p>
          전체 timeout 하나만 두면 어떤 protocol과 message에서 멈췄는지 알 수
          없습니다. Slowloris가 handshake slot을 오래 점유하는지도 놓치기 쉽습니다.
        </p>
        <h3>같은 조건에서 비교하는 release gate</h3>
        <p>
          TCP+Noise+Yamux와 QUIC을 비교할 때는 같은 peer pair, address family, RTT·loss,
          authentication policy, warm/cold session, application stream 수와 payload를
          고정합니다.
        </p>
        <p>
          Connect latency, authenticated-ready latency, first application byte, CPU,
          bytes on wire와 failure cleanup을 함께 재야 합니다. “TCP는 3단계, QUIC은
          1단계”라는 구조만으로 고정 배수의 속도 차이를 주장할 수 없습니다.
        </p>
        <h3>실패 주입 체크리스트</h3>
        <ul>
          <li>Unsupported security·muxer protocol에서 raw socket이 즉시 닫히는지 확인합니다.</li>
          <li>Noise expected PeerId mismatch가 muxer와 Swarm까지 올라가지 않는지 확인합니다.</li>
          <li>Upgrade timeout·cancellation 뒤 socket, future, buffer와 metric label이 정리되는지 확인합니다.</li>
          <li>Overload에서 pending inbound, established connection과 substream limit를 각각 관측합니다.</li>
        </ul>
      </div>

      <CalculationWalkthrough
        title="Alice가 Bob의 Swarm-ready connection을 얻는 시간 장부"
        question="TCP connect가 28ms에 끝났는데 사용 가능한 connection은 왜 약 49ms 뒤에 생길까요?"
        scope="설명용 고정 trace입니다. 주소 parse·socket 준비 0.4ms, TCP connect 28ms, Noise 17ms, Yamux 4ms를 순차 실행한다고 둡니다. 실제 benchmark 수치가 아닙니다."
        steps={[
          {
            label: "Socket 준비",
            expression: "주소 parse + option 적용",
            result: "0.4ms",
            reason: "이 시점에는 아직 SYN을 보내 연결을 확정하지 않았습니다.",
          },
          {
            label: "Raw TCP stream",
            expression: "0.4ms + 28ms connect",
            result: "28.4ms",
            reason: "Ordered byte stream은 생겼지만 Bob의 PeerId는 인증되지 않았습니다.",
          },
          {
            label: "Authenticated secure I/O",
            expression: "28.4ms + 17ms Noise",
            result: "45.4ms",
            reason: "Expected Bob PeerId와 identity binding을 검증한 시점입니다.",
          },
          {
            label: "Swarm-ready output",
            expression: "45.4ms + 4ms Yamux",
            result: "총 49.4ms",
            reason: "PeerId와 StreamMuxer를 connection pool로 넘길 수 있습니다.",
          },
        ]}
        conclusion="TCP 지표는 28.4ms에서 끝나지만 사용자 protocol을 열 수 있는 connection 지표는 49.4ms에서 끝납니다. 두 완료 조건을 하나의 connect latency로 부르면 병목 owner를 찾을 수 없습니다."
        caveats={[
          "Connection을 재사용하면 TCP·Noise·Yamux가 빠지므로 cold dial과 warm substream open을 섞지 않습니다.",
          "DNS 주소라면 resolution 구간을 별도로 추가하고 여러 IP의 병렬 race overlap을 단순 합산하지 않습니다.",
          "p95·p99는 end-to-end sample에서 직접 계산합니다. 각 단계의 p95를 더해 전체 p95라고 부르지 않습니다.",
        ]}
      />
    </section>
  );
}
