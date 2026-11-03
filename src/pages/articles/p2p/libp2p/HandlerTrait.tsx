import { CitationBlock } from "@/components/ui/citation";

export default function HandlerTrait({ title }: { title?: string }) {
  return (
    <section id="handler-trait" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title ?? "ConnectionHandler는 peer 한 연결의 substream 상태를 소유합니다"}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          같은 peer와 연결이 두 개라면 Handler도 두 개입니다. Handler는 inbound에서
          지원할 protocol upgrade를 광고하고, outbound substream이 필요하면
          <code>OutboundSubstreamRequest</code>를 반환합니다. 고정 사례에서는
          connection 42의 Handler가 nonce 7과 Ping upgrade를 함께 보관합니다.
        </p>
        <p>
          Muxer가 stream을 열고
          multistream-select가 <code>/ipfs/ping/1.0.0</code> 같은 protocol ID를 합의하면
          negotiated stream이 다시 해당 Handler로 돌아옵니다.
        </p>
        <p>
          여기서 <strong>stream multiplexing</strong>은 하나의 secure connection을
          여러 ordered substream으로 나누는 기능이고, <strong>protocol
          negotiation</strong>은 그 stream의 bytes를 어떤 protocol로 해석할지 고르는
          기능입니다. 둘은 함께 나타나지만 같은 작업이 아닙니다.
        </p>
        <p>
          Negotiation timeout,
          unsupported protocol, stream reset과 connection close도 서로 다른 실패로
          application에 전달해야 재시도 범위를 올바르게 정할 수 있습니다.
        </p>
        <p>
          v0.57.1의 <code>Connection::poll</code>은 Handler가 낸 outbound 요청을
          negotiation queue로 옮긴 뒤, 성공하면
          <code>FullyNegotiatedOutbound</code>를 같은 Handler에 돌려줍니다. Pong을
          읽은 Handler가 <code>NotifyBehaviour</code>를 내면 그제야 global pending
          request와 맞출 event가 위로 올라갑니다.
        </p>

        <div id="paper-rust-libp2p-handler" className="scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">구현 정본 · rust-libp2p v0.57.1 ConnectionHandler</p>
          <p>
            Handler trait의 inbound·outbound upgrade와 Connection poll의 negotiation
            success·timeout·unsupported protocol 반환 경계를 함께 확인합니다.
          </p>
          <CitationBlock
            source="rust-libp2p v0.57.1 — swarm/src/handler.rs · connection.rs"
            citeKey={5}
            href="https://github.com/libp2p/rust-libp2p/blob/v0.57.1/swarm/src/connection.rs"
          >
            Handler는 peer 전체가 아니라 connection 하나의 substream lifecycle을 소유하며, stream 실패와 connection 종료의 범위를 구분합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
