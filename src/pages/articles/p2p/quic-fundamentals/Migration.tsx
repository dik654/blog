import MigrationViz from "./viz/MigrationViz";

export default function Migration() {
  return (
    <section id="migration" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Connection ID는 주소 변화에서 상태를 찾고, path validation은 새 경로를
        검증합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          TCP는 source·destination IP와 port로 connection을 식별하지만 QUIC
          packet은 opaque connection ID(CID)를 가집니다. Wi‑Fi에서 LTE로 바뀌어
          4‑tuple이 달라져도 server는 CID로 기존 connection state를 찾을 수
          있습니다. 다만 같은 CID가 보였다는 사실만으로 새 source address를
          곧바로 신뢰하면 공격자가 피해자 주소로 traffic을 반사할 수 있습니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <MigrationViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>PATH_CHALLENGE와 PATH_RESPONSE</h3>
        <p>
          Endpoint는 새 path로 unpredictable 8-byte PATH_CHALLENGE를 보내고 같은
          data가 PATH_RESPONSE로 돌아오는지 확인합니다. 성공하면 peer가 그
          address에서 packet을 받을 수 있다는 reachability를 확인한 것이며, user
          identity나 network 안전성을 인증한 것은 아닙니다. 검증 전에는
          amplification limit과 congestion state 초기화를 지켜야 합니다.
        </p>
        <h3>Privacy와 linkability도 함께 관리합니다</h3>
        <p>
          하나의 CID를 계속 쓰면 서로 다른 network path의 traffic이 같은
          연결임을 관찰자가 연결할 수 있습니다. NEW_CONNECTION_ID와 retirement
          sequence를 이용해 migration 전에 새 CID로 바꾸고, stateless reset
          token과 CID routing key의 수명을 관리합니다. NAT rebinding은 port만
          바뀌는 작은 변화일 수 있지만 active migration과 같은 검증 원칙을
          공유합니다.
        </p>
      </div>
    </section>
  );
}
