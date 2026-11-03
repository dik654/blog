import AlgorithmBlock from "@/components/ui/algorithm-block";

export default function DialListen() {
  return (
    <section id="dial-listen" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Dial과 listen은 같은 socket을 만들지만 state와 실패 방향이 다릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Bob의 고정 주소에서는 TCP Transport가 <code>ip4</code>와 <code>tcp/4001</code>을
          꺼내 <code>203.0.113.7:4001</code>로 바꿉니다. Port 0, unspecified IP, 지원하지 않는
          구조는 network I/O 전에 <code>MultiaddrNotSupported</code>로 거부합니다.
        </p>
        <p>
          여기서 DNS 책임을 섞으면 안 됩니다. <code>/dns4/bob.example/tcp/4001</code>은 DNS
          Transport wrapper가 IP 후보로 먼저 풀고, TCP Transport는 이미 풀린 IP 주소를
          받습니다. 여러 주소를 경주하고 loser future를 취소하는 책임도 TCP socket 하나가
          아니라 상위 dial orchestration에 있습니다.
        </p>
        <p>
          <code>dial()</code> 호출은 socket을 준비하지만 실제 <code>connect</code>는 반환된
          future가 처음 poll될 때 시작합니다. <code>EINPROGRESS</code>와
          <code>WouldBlock</code>은 실패가 아니라 runtime readiness를 기다리는 상태입니다.
          Timeout, refusal, unreachable, cancellation은 서로 다른 label로 남기고, future를
          버렸을 때 socket과 timer도 사라지는지 확인합니다.
        </p>
        <p>
          Listen은 local multiaddr를 bind하고 OS가 정한 실제 address를
          <code>NewAddress</code>로 알립니다. 예를 들어 port 0을 요청하면 advertised port는
          bind 뒤에야 알 수 있습니다. Accept된 stream은 아직 remote PeerId를 모르는
          inbound candidate이므로 admission limit와 handshake timeout을 거친 후에만
          established peer로 셉니다.
        </p>
      </div>

      <AlgorithmBlock
        title="Bob에게 거는 TCP dial future의 실제 분기"
        input={[
          "addr = /ip4/203.0.113.7/tcp/4001",
          "DialOpts.port_use = New 또는 Reuse",
          "Config = nodelay true, backlog 1024, OS TTL",
        ]}
        steps={[
          {
            code: "socket_addr = multiaddr_to_socketaddr(addr)",
            note: "IP·TCP port가 아니거나 port 0·unspecified IP면 network I/O 전에 거부합니다.",
          },
          {
            code: "socket = create_socket(socket_addr, port_use)",
            note: "Address family와 option을 적용하고 nonblocking socket을 만듭니다.",
          },
          {
            code: "return lazy future; on first poll: optional bind, then connect",
            note: "dial 호출과 실제 connect 시작 시각을 분리합니다.",
          },
          {
            code: "if Reuse bind is stale: drop socket and retry once with PortUse::New",
            note: "재사용 요청이 실제 local port 재사용 성공을 보장하지 않습니다.",
          },
          {
            code: "await runtime stream readiness; return TcpStream or io::Error",
            note: "이 출력은 ordered byte stream이며 Bob PeerId 인증은 다음 Noise 단계입니다.",
          },
        ]}
        output="TcpStream 또는 주소·bind·connect·runtime I/O 단계의 구체적인 오류"
      />
    </section>
  );
}
