import SuiConsensusViz from './viz/SuiConsensusViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Consensus({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="consensus" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Narwhal + Bullshark 합의</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          공유 객체 TX용 DAG 기반 합의<br />
          Narwhal이 DAG 구축 + 데이터 가용성, Bullshark가 zero-message overhead 순서 결정
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sui-narwhal-header', codeRefs['sui-narwhal-header'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              primary.rs — Header 생성
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('sui-bullshark-commit', codeRefs['sui-bullshark-commit'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              bullshark.rs — try_commit
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <SuiConsensusViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
