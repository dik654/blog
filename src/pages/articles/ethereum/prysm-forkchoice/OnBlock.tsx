import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function OnBlock({ onCodeRef }: Props) {
  return (
    <section id="on-block" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OnBlock & OnAttestation</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fc-insert', codeRefs['fc-insert'])} />
          <span className="text-[10px] text-muted-foreground self-center">InsertNode()</span>
          <CodeViewButton onClick={() => onCodeRef('fc-process-attest', codeRefs['fc-process-attest'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessAttestation()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 양방향 링크</strong> — InsertNode()가 부모 루트로 기존 노드를 찾고 새 Node를 parent.children에 추가<br />
          parent/children 양방향 링크 완성 → 상하 순회 모두 O(1)<br />
          어테스테이션은 votes[validatorIndex]에 기록, 에폭 경계에서 일괄 반영
        </p>
      </div>
    </section>
  );
}
