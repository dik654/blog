import { codeRefs } from './codeRefs';
import WinningPostViz from './viz/WinningPostViz';
import type { CodeRef } from '@/components/code/types';

export default function WinningPost({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="winning-post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WinningPoSt: 블록 보상</h2>
      <div className="not-prose mb-8">
        <WinningPostViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} VRF 추첨의 공정성</strong> — DRAND 분산 랜덤 오라클
          <br />
          SP 파워(저장 용량) 비례 당첨 → 저장량이 곧 채굴력
        </p>
      </div>
    </section>
  );
}
