import type { CodeRef } from "@/components/code/types";

export default function ConnectionGating({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="connection-gating" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Connection gate는 candidate·pending·active peer마다 다른 예산과 권한을 준다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          하나의 최대 peer 수만 두면 inbound flood가 dial slot과 handshake CPU를 모두 차지할 수 있습니다. Candidate queue,
          concurrent dial, unauthenticated inbound handshake, authenticated-but-unchecked connection과 active protocol stream에
          별도 count·byte·deadline budget을 둡니다. State 승격은 단계의 validation receipt가 있을 때만 허용합니다.
        </p>

        <h3>Gate 순서와 실패 owner</h3>
        <ol>
          <li>Address·source·backoff·diversity policy로 dial admission을 결정합니다.</li>
          <li>Transport timeout과 socket/resource cap을 적용합니다.</li>
          <li>Noise/TLS에서 expected PeerId와 authenticated identity를 대조합니다.</li>
          <li>Multiplexer·protocol ID를 협상하고 Ethereum Status compatibility를 확인합니다.</li>
          <li>Active peer에 gossip·Req/Resp별 queue와 rate budget을 부여합니다.</li>
        </ol>
        <p>
          Reject reason은 local-capacity, stale/backoff, identity mismatch, no common protocol, wrong network/fork, bad status와
          protocol abuse로 나눕니다. Local-capacity close를 permanent ban으로 feedback하면 혼잡 때 좋은 peer를 잃고, identity
          mismatch를 일시적 timeout처럼 retry하면 공격자가 handshake 자원을 반복 소비할 수 있습니다.
        </p>

        <h3>Release gate</h3>
        <p>
          Base와 candidate에 stale ENR·same-prefix flood·unreachable address·wrong PeerId·no common protocol·wrong fork
          Status·slowloris·valid reconnect를 같은 순서로 주입합니다. Candidate/pending/active count, open sockets/streams,
          reason-coded close, backoff와 useful-peer diversity parity를 hard gate로 둔 뒤 discovery-to-active p95와 CPU·memory를
          비교합니다. 설정 변경은 version receipt와 rollback 가능한 previous peer DB snapshot을 함께 배포합니다.
        </p>
      </div>
    </section>
  );
}
