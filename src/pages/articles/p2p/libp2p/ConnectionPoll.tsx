export default function ConnectionPoll() {
  return (
    <section id="connection-poll" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">운영 검증은 connection state와 application 완료를 분리합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          실제 trace에는 최소한 address candidate, transport dial 시작·종료, authenticated
          PeerId, 선택한 security·muxer protocol, connection ID, substream protocol,
          queue delay와 close reason이 같은 correlation ID로 남아야 합니다. 그래야
          “peer를 못 찾았다”, “TCP connect가 실패했다”, “Noise identity가 달랐다”,
          “substream protocol이 겹치지 않았다”를 한 timeout으로 뭉개지 않습니다.
        </p>
        <p>
          Release gate는 정상 dial뿐 아니라 여러 address race의 loser 취소, 잘못된 PeerId, signature 실패, unsupported
          protocol, remote reset, queue saturation, idle timeout과 graceful shutdown을 포함합니다. 성공 기준은 event loop가
          오래 돌았다는 사실이 아니라 bounded memory 안에서 각 실패가 올바른 owner로 돌아가고 stale connection·task·timer가 남지 않는 것입니다.
        </p>
        <h3>한 connection trace의 완료 조건</h3>
        <ol>
          <li>Transport success와 authenticated peer success를 별도 timestamp로 남깁니다.</li>
          <li>Substream open request와 negotiated protocol, first byte, close를 연결합니다.</li>
          <li>Command enqueue를 remote 처리 완료로 간주하지 않고 application acknowledgment를 둡니다.</li>
          <li>Failure injection 뒤 queue, task, socket, timer가 baseline으로 돌아오는지 확인합니다.</li>
        </ol>
      </div>
    </section>
  );
}
