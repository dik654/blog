import TransactionEVMViz from './viz/TransactionEVMViz';

export default function TransactionEVM({ title }: { title?: string }) {
  return (
    <section id="transaction-evm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '트랜잭션 & EVM 실행'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          트랜잭션이 네트워크에 도착해 MDBX에 영구 저장되기까지의 reth 내부 흐름입니다.
        </p>
        <p>
          각 단계가 내부에서 실제로 무엇을 하는지 간단히:
        </p>
      </div>

      <TransactionEVMViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">각 단계 내부 동작</h3>

        <p>
          <strong>① Network / RPC</strong> — <code>eth_sendRawTransaction</code>으로 도착한 RLP 바이트를 디코딩하고, ECDSA 서명에서 <code>from</code> 주소를 <em>recover</em>합니다 (<code>secp256k1_ecdsa_recover_compact</code>).
        </p>
        <p>
          사전 검증: chain_id 일치, nonce ≥ 현재 nonce, gas_limit ≤ block gas limit, value + gas_price·gas_limit ≤ balance. 여기서 떨어지는 트랜잭션은 mempool에 들어가지 않습니다.{' '}
          <a href="/blog/blockchain/reth-rpc" className="underline">reth-rpc</a>
        </p>

        <p>
          <strong>② TxPool</strong> — 통과한 트랜잭션을 <strong>4 서브풀</strong>로 분류합니다.
        </p>
        <ul>
          <li><strong>Pending</strong>: nonce가 현재 상태와 연속 → 즉시 포함 가능</li>
          <li><strong>Queued</strong>: nonce에 gap 있음 → 대기 (앞 트랜잭션 채워지면 promote)</li>
          <li><strong>Basefee</strong>: max_fee &lt; 현재 basefee → 파킹</li>
          <li><strong>Blob</strong>: Type-3 (EIP-4844) 전용 별도 풀</li>
        </ul>
        <p>
          내부는 sender→nonce BTreeMap + gas price-ordered heap. replace-by-fee 룰(+12.5%)도 여기서 처리.{' '}
          <a href="/blog/blockchain/reth-txpool" className="underline">reth-txpool</a>
        </p>

        <p>
          <strong>③ PayloadBuilder</strong> — Engine API의 <code>engine_forkchoiceUpdated</code>로 블록 빌드 요청을 받으면, Pending 서브풀에서 <em>effective_gas_price</em>(= min(max_fee, basefee + priority_fee)) 내림차순으로 greedy하게 선택합니다.
        </p>
        <p>
          30M gas 한도까지 채우다가 남는 자리에 blob 트랜잭션을 채움. 실제로는 MEV-Boost나 builder API를 통해 외부 빌더의 블록을 받기도 합니다.{' '}
          <a href="/blog/blockchain/reth-payload-builder" className="underline">reth-payload-builder</a>
        </p>

        <p>
          <strong>④ REVM</strong> — 각 트랜잭션을 가상머신에서 실행. 진입 시 <code>CallFrame</code>이 쌓이고, <code>CALL</code>/<code>DELEGATECALL</code>/<code>STATICCALL</code>마다 프레임이 푸시 — 최대 1024 depth.
        </p>
        <p>
          상태 접근은 <strong>warm / cold</strong> 구분(EIP-2929): 처음 만지는 슬롯은 cold(2100 gas), 같은 트랜잭션 내 재접근은 warm(100 gas). <code>AccessList</code>로 미리 warm 선언해 할인받기도 가능.{' '}
          <a href="/blog/blockchain/reth-block-execution" className="underline">reth-block-execution</a>
        </p>

        <p>
          <strong>⑤ Gas & Receipt</strong> — EIP-1559 모델: <code>gas_used × basefee</code>는 <strong>소각</strong>, <code>gas_used × priority_fee</code>는 <em>블록 제안자에게</em> 지급. 실행 이벤트는 <code>Log</code> 배열로 Receipt에 담기고, bloom filter가 계산됩니다 (eth_getLogs의 1차 필터).{' '}
          <a href="/blog/blockchain/reth-eip1559" className="underline">reth-eip1559</a>
        </p>

        <p>
          <strong>⑥ SparseStateTrie</strong> — 블록에서 <em>실제로 바뀐 슬롯만</em> 추려서 해싱합니다. 전체 상태 트라이를 재계산하지 않고 "dirty subtree"만 tokio로 병렬 Keccak-256.
        </p>
        <p>
          결과가 <code>state_root</code> (32 bytes). 동일 블록에서 계정 A가 10번 바뀌어도 최종 상태 1번만 해싱 — reth 속도 우위의 핵심.{' '}
          <a href="/blog/blockchain/reth-trie" className="underline">reth-trie</a>
        </p>

        <p>
          <strong>⑦ MDBX</strong> — B+tree + mmap + MVCC. <em>finalized</em> 플래그를 받은 블록만 WAL이 아닌 실 DB에 flush되고, 그 전에는 메모리의 fork choice 상태에만 존재.
        </p>
        <p>
          MVCC 덕분에 state query와 새 블록 커밋이 서로를 블로킹하지 않습니다. 32 에폭 이전 블록은 prune 후보.{' '}
          <a href="/blog/blockchain/mdbx-internals" className="underline">mdbx-internals</a> ·{' '}
          <a href="/blog/blockchain/reth-db" className="underline">reth-db</a>
        </p>
      </div>
    </section>
  );
}
