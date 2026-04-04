import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import UnshieldViz from './viz/UnshieldViz';

export default function Unshield({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="unshield" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Unshield — ERC-20 출금</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>unshield()</code>는 shielded 잔액을 일반 ERC-20으로 출금하는 함수다.
          <br />
          ZK 증명으로 Note 소유권을 입증한 뒤, ERC-20 transfer로 토큰을 전송한다.
          <CodeViewButton codeKey="rg-unshield" codeRef={codeRefs['rg-unshield']} onClick={onCodeRef} />
        </p>
        <p className="leading-7">
          출금 시점에 수신 주소(to)와 금액(amount)이 공개된다.
          <br />
          하지만 어떤 commitment에서 출금했는지는 nullifier 뒤에 숨는다.
          자금 출처를 추적할 수 없다.
        </p>
      </div>
      <div className="not-prose"><UnshieldViz /></div>
    </section>
  );
}
