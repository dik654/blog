import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import TransactViz from './viz/TransactViz';

export default function Transact({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="transact" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Transact — 내부 전송</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>transact()</code>는 shielded 잔액끼리 전송하는 핵심 함수다.
          <br />
          Alice의 Note를 소비하고, Bob의 새 Note를 생성한다. 전 과정이 ZK 증명으로 보호된다.
          <CodeViewButton onClick={() => onCodeRef('rg-transact', codeRefs['rg-transact'])} />
        </p>
        <p className="leading-7">
          내부 흐름: verifyProof → nullifier 기록 → commitment 삽입 → 이벤트 발행.
          <br />
          온체인에는 해시값만 기록된다. 금액, 수신자, 토큰 종류는 비공개다.
        </p>
      </div>
      <div className="not-prose"><TransactViz /></div>
    </section>
  );
}
