import ProposerViz from './viz/ProposerViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ValidatorSet({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="validator-set" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ValidatorSet & 가중 라운드 로빈</h2>
      <div className="not-prose mb-8">
        <ProposerViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 가중 라운드 로빈 vs 랜덤 추첨</strong> — VRF 기반 랜덤 추첨은 비결정적이라
          모든 노드가 같은 결과를 계산해야 하는 BFT 합의에 부적합하다.<br />
          priority 기반 라운드 로빈은 결정적이어서 모든 노드가 동일한 제안자를 계산한다.
        </p>
      </div>
    </section>
  );
}
