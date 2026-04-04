import SendTxViz from './viz/SendTxViz';

export default function SendTx() {
  return (
    <section id="send-tx" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        eth_sendRawTransaction (유일한 신뢰 지점)
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth: TxPool에 추가하고 P2P로 전파한다.
          블록 빌더가 포함할 때까지 mempool에 대기.<br />
          Helios: RPC에 그대로 전달(프록시)한다.
          경량 클라이언트는 TxPool을 유지하지 않는다.
        </p>
        <p className="leading-7">
          이것이 Helios에서 유일하게 RPC를 신뢰하는 지점이다.<br />
          읽기(eth_call, getBalance 등)는 증명으로 검증 가능하지만
          쓰기(TX 제출)는 체인 합의가 필요하므로 로컬 검증 불가.
        </p>
        <p className="leading-7">
          보완책: TX 해시를 기록해두고
          이후 eth_getTransactionReceipt로
          포함 여부를 증명 기반으로 확인할 수 있다.
        </p>
      </div>
      <div className="not-prose"><SendTxViz /></div>
    </section>
  );
}
