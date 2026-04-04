import PBHCompareViz from './viz/PBHCompareViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">World Chain 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          World Chain — "인간을 위한 블록체인" OP Stack 기반 L2<br />
          PBH 메커니즘으로 검증된 World ID 보유자에게 블록 상단 우선순위 부여
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('wc-payload-builder', codeRefs['wc-payload-builder'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              builder — 전체 아키텍처
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <PBHCompareViz />
      </div>
    </section>
  );
}
