import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function JustificationFinalization({ onCodeRef }: Props) {
  return (
    <section id="justification-finalization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Justification & Finalization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-justification', codeRefs['process-justification'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessJustification()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 2/3 슈퍼 매저리티</strong> — 이전/현재 에폭의 타겟 투표 잔액이 전체의 2/3를 넘으면 justified<br />
          2개 연속 에폭이 justified되면 첫 번째가 finalized — 경제적 최종성<br />
          JustificationBits 4비트 벡터로 최근 4에폭의 상태를 추적
        </p>
      </div>
    </section>
  );
}
