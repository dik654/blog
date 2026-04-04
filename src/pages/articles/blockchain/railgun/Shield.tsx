import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ShieldViz from './viz/ShieldViz';

export default function Shield({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="shield" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Shield — ERC-20 입금</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>shield()</code>는 ERC-20 토큰을 RAILGUN 컨트랙트에 입금하는 함수다.
          <br />
          입금 후 토큰은 shielded 상태가 된다. 외부에서 잔액을 볼 수 없다.
        </p>
        <p className="leading-7">
          내부 동작은 4단계다. transferFrom → hashCommitment → insertLeaf → emit Shield.
          <br />
          각 단계에서 실제 변수값과 상태 변화를 추적한다.
          <CodeViewButton onClick={() => onCodeRef('rg-shield', codeRefs['rg-shield'])} />
        </p>
      </div>
      <div className="not-prose"><ShieldViz /></div>
    </section>
  );
}
