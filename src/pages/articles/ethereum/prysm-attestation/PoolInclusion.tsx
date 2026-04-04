import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PoolInclusion({ onCodeRef }: Props) {
  return (
    <section id="pool-inclusion" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">풀 관리 & 블록 포함</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('attestation-pool', codeRefs['attestation-pool'])} />
          <span className="text-[10px] text-muted-foreground self-center">Pool + SaveAggregated</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 포함 보상 구조</strong> — 제안자는 풀에서 최대 128개의 집계 어테스테이션을 선택<br />
          inclusion distance가 1이면 최대 보상 — 최신 어테스테이션 우선 선택<br />
          투표자는 head/source/target 정확도, 제안자는 포함 수에 비례 보상
        </p>
      </div>
    </section>
  );
}
