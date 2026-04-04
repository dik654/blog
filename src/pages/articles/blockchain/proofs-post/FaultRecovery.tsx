import FaultViz from './viz/FaultViz';
import type { CodeRef } from '@/components/code/types';

export default function FaultRecovery({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="fault-recovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">장애 & 복구</h2>
      <div className="not-prose mb-8"><FaultViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 경제적 인센티브 설계</strong> — "저장하지 않는 것"의 비용을 높여
          <br />
          SP가 안정적으로 데이터를 유지하도록 강제
          <br />
          자연재해 등 불가항력은 14일 유예로 대응
        </p>
      </div>
    </section>
  );
}
