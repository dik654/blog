import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SNARK 개요</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} Filecoin = 최대 GPU 소비 체인</strong> — 전체 블록체인 네트워크 중
          <br />
          가장 많은 GPU 컴퓨팅 소비. 수만 SP가 매일 수십만 건 SNARK 증명 생성
        </p>
      </div>
    </section>
  );
}
