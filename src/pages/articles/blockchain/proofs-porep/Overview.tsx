import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">봉인 전체 흐름</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} PC1이 순차적이어야 하는 이유</strong> — 공간-시간 트레이드오프
          <br />
          병렬 사전 계산 가능하면 "저장했다"는 증명이 성립 안 함
          <br />
          순차 의존성이 물리적 저장 공간 사용을 강제
        </p>
      </div>
    </section>
  );
}
