import { codeRefs } from './codeRefs';
import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호 프리미티브 전체 구조</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT는 Ed25519 서명, Merkle 증명, TMHASH 세 가지 암호 프리미티브로 동작한다.<br />
          각 함수의 코드를 step-by-step으로 추적한다.
        </p>
      </div>
    </section>
  );
}
