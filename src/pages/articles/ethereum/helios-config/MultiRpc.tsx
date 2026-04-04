import MultiRpcViz from './viz/MultiRpcViz';

export default function MultiRpc() {
  return (
    <section id="multi-rpc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        멀티 RPC Fallback 전략
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth(풀노드): 자체 실행하므로 외부 RPC가 불필요하다.
          P2P 네트워크에서 블록을 직접 수신하여 항상 가용.<br />
          Helios: 외부 RPC에 의존하므로
          RPC 장애 시 서비스가 중단될 수 있다.
        </p>
        <p className="leading-7">
          fallback_rpcs 목록으로 이 문제를 완화한다:<br />
          1) 기본 RPC에 요청 → 타임아웃 또는 에러 발생<br />
          2) fallback_rpcs[0]에 재시도 → 실패 시 [1]로<br />
          3) 모든 RPC 실패 → 에러 반환
        </p>
        <p className="leading-7">
          보안 고려: 모든 RPC 응답은 증명으로 검증하므로
          악의적 fallback RPC를 사용해도 안전하다.
          거짓 응답은 MPT/BLS 검증에서 즉시 거부된다.
        </p>
      </div>
      <div className="not-prose"><MultiRpcViz /></div>
    </section>
  );
}
