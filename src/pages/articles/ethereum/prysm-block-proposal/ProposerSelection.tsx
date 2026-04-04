import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProposerSelection({ onCodeRef }: Props) {
  return (
    <section id="proposer-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proposer 선정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('compute-proposer', codeRefs['compute-proposer'])} />
          <span className="text-[10px] text-muted-foreground self-center">ComputeProposerIndex()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 잔액 비례 확률</strong> — effectiveBalance * maxRandom {'≥'} MaxEffectiveBalance * randomByte<br />
          32 ETH 유효 잔액이면 항상 통과, 잔액이 낮으면 재추첨<br />
          한 에폭 전에 다음 에폭의 제안자를 미리 알 수 있어 사전 준비 가능
        </p>
      </div>
    </section>
  );
}
