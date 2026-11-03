import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";

export default function ConnectionPoll() {
  return (
    <section id="connection-poll" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">운영 검증은 connection state와 application 완료를 분리합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          실제 trace에는 최소한 address candidate, transport dial 시작·종료, authenticated
          PeerId, 선택한 security·muxer protocol, connection ID, substream protocol,
          queue delay와 close reason이 같은 correlation ID로 남아야 합니다.
        </p>
        <p>
          그래야
          “peer를 못 찾았다”, “TCP connect가 실패했다”, “Noise identity가 달랐다”,
          “substream protocol이 겹치지 않았다”를 한 timeout으로 뭉개지 않습니다.
        </p>
        <p>
          Release gate는 정상 dial뿐 아니라 여러 address race의 loser 취소, 잘못된 PeerId, signature 실패, unsupported
          protocol, remote reset, queue saturation, idle timeout과 graceful shutdown을 포함합니다.
        </p>
        <p>
          성공 기준은 event loop가 오래 돌았다는 사실이 아닙니다. Bounded memory 안에서
          각 실패가 올바른 owner로 돌아가고 stale connection·task·timer가 남지 않아야 합니다.
        </p>
      </div>

      <CalculationWalkthrough
        title="한 Ping trace의 시간 장부"
        question="사용자가 본 100ms를 왜 TCP나 Ping 하나의 지연이라고 부르면 안 될까요?"
        scope="설명용 고정 trace입니다. TCP 28ms, Noise 17ms, Yamux 4ms, Handler queue 6ms, substream negotiation 3ms, Ping round trip 42ms를 순차 경로로 더합니다. 실제 benchmark 수치가 아닙니다."
        steps={[
          {
            label: "Transport와 peer 인증까지",
            expression: "28ms TCP + 17ms Noise",
            result: "45ms",
            reason: "Socket 연결 성공과 expected Bob PeerId 인증 완료를 따로 기록합니다.",
          },
          {
            label: "Multiplexer 준비까지",
            expression: "45ms + 4ms Yamux",
            result: "49ms",
            reason: "이 시점에 connection 42를 Swarm에 등록할 공통 output이 준비됩니다.",
          },
          {
            label: "Handler가 Ping stream을 얻기까지",
            expression: "49ms + 6ms queue + 3ms negotiation",
            result: "58ms",
            reason: "NotifyHandler enqueue와 Handler 수신, /ipfs/ping/1.0.0 합의를 분리합니다.",
          },
          {
            label: "Bob의 Pong이 application event로 돌아오기까지",
            expression: "58ms + 42ms Ping RTT",
            result: "총 100ms",
            reason: "Remote I/O가 끝나야 nonce 7 요청의 완료 event를 낼 수 있습니다.",
          },
        ]}
        conclusion="100ms는 여러 owner의 순차 지연을 합친 end-to-end 시간입니다. Phase timestamp가 있어야 100ms 증가가 dial, identity, queue, negotiation, remote I/O 중 어디서 생겼는지 설명할 수 있습니다."
        caveats={[
          "주소 후보를 병렬로 경주하면 단순 합보다 overlap이 생기므로 winner와 loser 취소 시각을 함께 기록합니다.",
          "Connection을 재사용하면 TCP·Noise·Yamux 단계가 빠지고 Handler queue와 substream·Ping만 남을 수 있습니다.",
          "p95·p99는 단계별 분포와 end-to-end 분포를 각각 계산하며 단계별 percentile을 단순히 더하지 않습니다.",
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
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
