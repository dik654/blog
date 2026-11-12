import PortReuseFallbackViz from "./viz/PortReuseFallbackViz";

export default function SocketCreation() {
  return (
    <section id="socket-creation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Socket option은 성능 버튼이 아니라 workload별 trade-off입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Bob의 IPv4 주소를 받은 <code>create_socket</code>은 IPv4 TCP socket을 만들고,
          option을 적용한 뒤 nonblocking으로 바꿉니다. <code>TCP_NODELAY</code>는 Nagle
          algorithm의 작은 write 합치기를
          끄므로 request latency를 줄일 수 있지만 packet 수와 header overhead가 늘 수
          있습니다. “항상 200ms를 없앤다”거나 throughput도 반드시 좋아진다고 해석하지 않습니다.
        </p>
        <p>
          Listen backlog 1024는 아직 accept되지 않은 연결을 위한 OS queue 요청값입니다.
          실제 유효 길이는 OS가 제한할 수 있고, application의 established connection limit도
          아닙니다. 큰 backlog가 handshake slot·memory·peer별 admission control을 대신하지
          못하는 이유입니다. TTL 역시 IP packet의 hop limit이지 peer connection 수명이 아닙니다.
        </p>
        <p>
          <code>PortUse::Reuse</code>는 NAT traversal을 위해 listener의 local port를 outbound
          dial에 재사용해 보라는 best-effort 요청입니다. v0.57.1에서는 global
          <code>Config::port_reuse(true)</code>가 아니라 Bob에게 거는 이 dial의
          <code>DialOpts::port_use</code>가 결정합니다.
        </p>
      </div>
      <PortReuseFallbackViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          재사용하려던 local address가 사라져 <code>AddrNotAvailable</code>이 나면 source는
          그 socket을 버리고 새 port로 한 번 다시 dial합니다. 따라서 “reuse를 요청했다”와
          “실제로 같은 port를 썼다”는 다른 상태입니다. local·remote socket address와
          fallback 여부를 같은 trace에 남겨야 합니다.
        </p>
      </div>
    </section>
  );
}
