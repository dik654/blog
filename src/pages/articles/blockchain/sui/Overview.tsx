import SuiArchViz from './viz/SuiArchViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sui 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sui(Mysten Labs) — 객체 중심 데이터 모델 + Narwhal+Bullshark DAG 합의<br />
          소유 객체 TX는 합의 없이 즉시 처리 → <strong>sub-second finality</strong>
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sui-object-types', codeRefs['sui-object-types'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              object.rs — Owner enum
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <SuiArchViz />
      </div>
    </section>
  );
}
