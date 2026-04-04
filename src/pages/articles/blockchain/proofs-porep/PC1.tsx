import { codeRefs } from './codeRefs';
import PC1DetailViz from './viz/PC1DetailViz';
import type { CodeRef } from '@/components/code/types';

export default function PC1({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="pc1" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PreCommit1: SDR 그래프 생성</h2>
      <div className="not-prose mb-8">
        <PC1DetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} replica_id의 역할</strong> — prover_id + sector_id + ticket + comm_d를 결합
          <br />
          동일 원본 데이터라도 SP마다, 섹터마다 완전히 다른 봉인 결과
        </p>
      </div>
    </section>
  );
}
