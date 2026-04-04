import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PoSt 개요</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} WindowPoSt vs WinningPoSt</strong> — WindowPoSt는 "지금도 저장 중" 증명
          <br />
          WinningPoSt는 "블록 생산 권한" 증명. 목적이 완전히 다름
        </p>
      </div>
    </section>
  );
}
