export default function DialListen() {
  return (
    <section id="dial-listen" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Dial과 listen은 같은 socket을 만들지만 state와 실패 방향이 다릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Outbound dial은 multiaddr component를 순서대로 읽어 TCP가 지원하는 IP·DNS와 port 부분을 추출합니다. Unsupported suffix나 빠진
          port는 network를 호출하기 전에 address error로 거부해야 합니다. DNS를 포함하면 이름 하나가 여러 IP로 풀릴 수 있으며 상위 Transport가 일부
          dial future를 race하고 loser를 취소할 수 있습니다.
        </p>
        <p>
          Nonblocking <code>connect</code>의 in-progress 결과는 실패가 아니라 readiness를
          기다리라는 뜻입니다. Writable notification 뒤 socket error를 다시 확인해야
          성공이 확정됩니다. Timeout, refusal, unreachable, cancellation을 구분하고,
          failed future가 local socket과 timer를 놓는지도 확인해야 합니다.
        </p>
        <p>
          Listen은 local multiaddr를 bind하고 OS가 정한 실제 address를
          <code>NewAddress</code>로 알립니다. 예를 들어 port 0을 요청하면 advertised port는
          bind 뒤에야 알 수 있습니다. Accept된 stream은 아직 remote PeerId를 모르는
          inbound candidate이므로 admission limit와 handshake timeout을 거친 후에만
          established peer로 셉니다.
        </p>
      </div>
    </section>
  );
}
