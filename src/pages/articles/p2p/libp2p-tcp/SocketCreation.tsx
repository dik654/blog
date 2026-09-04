export default function SocketCreation() {
  return (
    <section id="socket-creation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Socket option은 성능 버튼이 아니라 workload별 trade-off입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Runtime provider는 IPv4·IPv6에 맞는 nonblocking socket을 만들고 async runtime에
          등록합니다. <code>TCP_NODELAY</code>는 Nagle algorithm의 작은 write 합치기를
          끄므로 request latency를 줄일 수 있지만 packet 수와 header overhead가 늘 수
          있습니다. “항상 200ms를 없앤다”거나 throughput도 항상 좋아진다고 해석하지
          않습니다.
        </p>
        <p>
          Listen backlog는 아직 accept되지 않은 연결의 OS queue hint이며 application의 established connection limit가 아닙니다.
          너무 작은 값은 burst에서 connect 실패를 늘릴 수 있고 큰 값은 overload admission control을 대신하지 못합니다. TTL도 P2P hop limit
          policy일 뿐 peer lifetime과 관계가 없습니다.
        </p>
        <p>
          Port reuse는 NAT traversal에서 listener의 local port를 outbound dial에 재사용하려는
          best-effort policy입니다. 현재 API에서는 global Config가 아니라 dial별
          <code>DialOpts::port_use</code>가 결정하며, OS·주소 family·기존 listener 상태 때문에
          실패하면 새 ephemeral port로 진행할 수 있습니다. 반드시 local/remote socket
          address를 trace에 남겨 실제 재사용 여부를 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
