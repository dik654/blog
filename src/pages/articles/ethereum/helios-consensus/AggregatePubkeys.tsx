import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import AggPubkeyViz from './viz/AggPubkeyViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function AggregatePubkeys({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="aggregate-pubkeys" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          참여 공개키를 G1 점 덧셈으로 하나의 <code>agg_pk</code>로 합산한다.
          <br />
          512번 개별 검증 대신 1번 집계 검증으로 동일한 결과를 얻는다.
        </p>
      </div>
      <div className="not-prose">
        <AggPubkeyViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-verify-bls', codeRefs['hl-verify-bls'])} />
          <span className="text-[10px] text-muted-foreground">verify.rs</span>
        </div>
      </div>
    </section>
  );
}
