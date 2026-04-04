import type { CodeRef } from '@/components/code/types';
import ZKCircuitViz from './viz/ZKCircuitViz';

export default function ZKCircuit({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="zk-circuit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZK Circuit — R1CS 제약</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          RAILGUN의 ZK 회로는 3가지를 증명한다.
          <br />
          nullifier 정당성, Merkle 소속, 밸런스 보존.
        </p>
        <p className="leading-7">
          회로 입력은 public과 private로 나뉜다.
          <br />
          public: nullifier, merkleRoot, outputCommitments — 온체인 검증에 사용.
          <br />
          private: spendingKey, leafIndex, siblings — 증명자만 알고, 검증자에게 공개하지 않는다.
        </p>
        <p className="leading-7">
          제약 3(밸런스 보존)이 핵심이다. input 합 == output 합 + fee.
          <br />
          이 제약이 없으면 허공에서 토큰을 생성할 수 있다.
        </p>
      </div>
      <div className="not-prose"><ZKCircuitViz /></div>
    </section>
  );
}
