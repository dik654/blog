import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">핵심 타입 전체 구조</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 합의 메시지(블록 제안, 투표, 커밋)는 모두 <code>types/</code> 패키지의 Go 구조체로 정의된다.<br />
          이 아티클에서는 Block, Vote, ValidatorSet, Evidence의 내부 필드와 핵심 함수를 코드 수준으로 추적한다.
        </p>
      </div>
    </section>
  );
}
