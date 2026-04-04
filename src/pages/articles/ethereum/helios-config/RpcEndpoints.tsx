import RpcEndpointsViz from './viz/RpcEndpointsViz';

export default function RpcEndpoints() {
  return (
    <section id="rpc-endpoints" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        CL/EL RPC 엔드포인트 설정
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Helios는 두 개의 RPC 엔드포인트가 필요하다.
          consensus_rpc: CL 비콘 API 서버.
          /eth/v1/beacon/headers, /eth/v1/beacon/light_client/* 등.<br />
          execution_rpc: EL JSON-RPC 서버.
          eth_getProof, eth_getCode, eth_call 등 증명 요청.
        </p>
        <p className="leading-7">
          Reth(풀노드)는 자기 자신이 두 API를 제공한다.
          EL JSON-RPC는 8545 포트, Engine API는 8551 포트.
          외부 RPC 의존 없이 자체적으로 동작한다.<br />
          Helios는 외부 RPC에 의존하므로
          RPC 제공자의 신뢰성이 가용성을 결정한다.
        </p>
      </div>
      <div className="not-prose"><RpcEndpointsViz /></div>
    </section>
  );
}
