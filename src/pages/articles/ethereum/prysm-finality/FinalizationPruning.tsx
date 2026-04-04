import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function FinalizationPruning({ onCodeRef }: Props) {
  return (
    <section id="finalization-pruning" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Finalization & Prune</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('prune-finalized', codeRefs['prune-finalized'])} />
          <span className="text-[10px] text-muted-foreground self-center">Prune()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 트리 프루닝</strong> — finalized 체크포인트가 갱신되면 그 아래 모든 포크 노드 삭제<br />
          finalized 노드의 parent를 nil로 설정 → 새로운 트리 루트<br />
          뒤집으려면 전체 스테이킹의 1/3 이상을 슬래싱해야 하므로 사실상 불가능
        </p>
      </div>
    </section>
  );
}
