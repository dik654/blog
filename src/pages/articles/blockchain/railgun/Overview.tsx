import type { CodeRef } from '@/components/code/types';
import ContextViz from './viz/ContextViz';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">아키텍처 & UTXO 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Ethereum 트랜잭션은 from, to, amount가 전부 공개된다.
          <br />
          Etherscan에서 누구나 지갑 잔액과 자금 흐름을 추적할 수 있다.
        </p>
        <p className="leading-7">
          RAILGUN은 <strong>UTXO 모델</strong>을 EVM 위에 구현해서 이 문제를 해결한다.
          <br />
          계정 잔액 대신 <strong>Note(미사용 출력)</strong>를 소비하는 구조다.
        </p>
        <p className="leading-7">
          Note는 Poseidon 해시로 <strong>commitment</strong>가 되어 Merkle tree에 저장된다.
          <br />
          소비할 때는 <strong>Groth16 ZK 증명</strong>으로 소유권을 입증한다. 비밀키를 공개하지 않는다.
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>
    </section>
  );
}
