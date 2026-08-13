export default function HandlerTrait({ title }: { title?: string }) {
  return (
    <section id="handler-trait" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title ?? "ConnectionHandler는 peer 한 연결의 substream 상태를 소유합니다"}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          같은 peer와 연결이 두 개라면 Handler도 두 개입니다. Handler는 inbound에서
          지원할 protocol upgrade를 광고하고, outbound substream이 필요하면
          <code>OutboundSubstreamRequest</code>를 반환합니다. Muxer가 stream을 열고
          multistream-select가 <code>/ipfs/ping/1.0.0</code> 같은 protocol ID를 합의하면
          negotiated stream이 다시 해당 Handler로 돌아옵니다.
        </p>
        <p>
          여기서 <strong>stream multiplexing</strong>은 하나의 secure connection을
          여러 ordered substream으로 나누는 기능이고, <strong>protocol
          negotiation</strong>은 그 stream의 bytes를 어떤 protocol로 해석할지 고르는
          기능입니다. 둘은 함께 나타나지만 같은 작업이 아닙니다. Negotiation timeout,
          unsupported protocol, stream reset과 connection close도 서로 다른 실패로
          application에 전달해야 재시도 범위를 올바르게 정할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
