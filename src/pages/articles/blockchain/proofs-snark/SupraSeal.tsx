import SupraSealViz from './viz/SupraSealViz';
import type { CodeRef } from '@/components/code/types';

export default function SupraSeal({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="supraseal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SupraSeal 최적화</h2>
      <div className="not-prose mb-8"><SupraSealViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} SupraSeal 핵심 전략</strong> — 알고리즘 변경 없이 하드웨어 활용 극대화
          <br />
          봉인 전체 시간 50%+ 단축, 동일 증명 생성
          <br />
          SP 하드웨어 투자 효율 향상 → 네트워크 저장 용량 증가
        </p>
      </div>
    </section>
  );
}
