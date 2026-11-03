import MigrationViz from "./viz/MigrationViz";

export default function Migration() {
  return (
    <section id="migration" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        연결 ID와 경로 검증은 서로 다른 일을 합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          사례의 전화가 Wi‑Fi에서 LTE로 바뀌면 source IP와 port가 달라집니다.
          Server는 packet의 opaque connection ID(CID)로 기존 stream과 key 상태를
          찾을 수 있습니다. 이것이 <strong>state lookup</strong>입니다.
        </p>
        <p>
          그러나 같은 CID가 보였다는 사실은 새 주소가 실제 peer의 주소라는
          증거가 아닙니다. 이를 곧바로 믿으면 공격자가 피해자 주소로 traffic을
          반사할 수 있습니다. 그래서 새 path가 응답을 돌려보낼 수 있는지 따로
          검증합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <MigrationViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>PATH_CHALLENGE와 PATH_RESPONSE</h3>
        <p>
          Endpoint는 새 LTE path로 예측하기 어려운 8-byte PATH_CHALLENGE를
          보내고 같은 data가 PATH_RESPONSE로 돌아오는지 확인합니다. 성공하면
          peer가 그 주소에서 packet을 받을 수 있다는 return reachability가
          확인됩니다. User identity나 network의 안전성까지 인증하는 것은
          아닙니다.
        </p>
        <p>
          경로 검증 중에도 connection state는 남지만, 전환이 즉시·무중단이라고
          보장할 수는 없습니다. 새 path의 RTT와 congestion 상태를 평가해야 하고,
          validation packet의 왕복과 packet loss가 지연을 만들 수 있습니다.
        </p>
        <h3>Privacy와 linkability도 함께 관리합니다</h3>
        <p>
          하나의 CID를 계속 쓰면 Wi‑Fi traffic과 LTE traffic이 같은 연결이라는
          단서가 됩니다. Peer가 미리 준 NEW_CONNECTION_ID를 사용하고 이전 CID를
          retirement sequence에 따라 폐기하는 이유입니다. Stateless reset
          token과 CID routing key의 수명도 함께 관리합니다.
        </p>
        <p>
          NAT rebinding은 port만 바뀌는 작은 변화일 수 있지만, 관측만으로 적극적
          이동과 항상 구분할 수 있는 것은 아닙니다. 구현은 path validation과
          congestion 정책을 상황에 맞게 적용해야 합니다.
        </p>
      </div>
    </section>
  );
}
