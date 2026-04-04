import { codeRefs } from './codeRefs';
import PrepareProposalViz from './viz/PrepareProposalViz';
import ProcessProposalViz from './viz/ProcessProposalViz';
import type { CodeRef } from '@/components/code/types';

export default function PrepareProcess({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="prepare-process" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PrepareProposal & ProcessProposal</h2>
      <h3 className="text-lg font-semibold mb-3 mt-6">PrepareProposal 코드 추적</h3>
      <div className="not-prose mb-8">
        <PrepareProposalViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 제안자만 PrepareProposal을 호출</strong> — 앱이 TX 순서 변경, 필터링, 추가 가능<br />
          나머지 검증자는 ProcessProposal로 제안을 검증
        </p>
      </div>
      <h3 className="text-lg font-semibold mb-3 mt-8">ProcessProposal 코드 추적</h3>
      <div className="not-prose mb-8">
        <ProcessProposalViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-sky-500/50 pl-3">
          <strong>💡 REJECT 시 nil prevote</strong> — 충분한 노드가 거부하면 해당 라운드 타임아웃, 다음 라운드로 진행
        </p>
      </div>
    </section>
  );
}
