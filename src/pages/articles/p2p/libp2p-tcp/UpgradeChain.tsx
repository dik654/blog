import { Link } from "react-router-dom";

export default function UpgradeChain() {
  return (
    <section id="upgrade-chain" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Upgrade chain은 성공 type뿐 아니라 timeout과 자원 소유권도 바꿉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Raw <code>TcpStream</code>에서 먼저 security protocol ID를 합의하고
          <Link to="/p2p/libp2p-noise"> Noise</Link> handshake를 수행합니다. 성공하면
          remote PeerId와 authenticated encrypted I/O가 나오고, 그 위에서 Yamux 같은
          공통 stream multiplexer를 선택합니다. 마지막 output만
          <Link to="/p2p/libp2p"> Swarm</Link>의 connection pool로 이동합니다.
        </p>
        <p>
          Security와 muxer 협상은 직렬 dependency이므로 각 단계에 별도 timeout과 error
          label이 필요합니다. TCP connect 40ms, security 3s timeout이라면 문제는 network
          reachability가 아니라 secure-channel phase입니다. 전체 timeout 하나만 두면 어떤
          protocol과 message에서 멈췄는지 알 수 없고 slowloris가 handshake slot을 오래
          점유할 수 있습니다.
        </p>
        <h3>같은 조건에서 비교하는 release gate</h3>
        <p>
          TCP+Noise+Yamux와 QUIC을 비교할 때는 같은 peer pair, address family, RTT·loss,
          authentication policy, warm/cold session, application stream 수와 payload를
          고정합니다. Connect latency, authenticated-ready latency, first application byte,
          CPU, bytes on wire, failure cleanup을 함께 재야 합니다. “TCP는 3단계, QUIC은
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
    </section>
  );
}
