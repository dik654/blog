import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Aggregation({ onCodeRef }: Props) {
  return (
    <section id="aggregation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">집계 & 서브넷</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('compute-subnet', codeRefs['compute-subnet'])} />
          <span className="text-[10px] text-muted-foreground self-center">서브넷 + 풀 조회</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 BLS 집계</strong> — 같은 AttestationData를 가진 서명들의 BLS 서명을 합침<br />
          N개 서명 → 1개 집계 서명 — 블록 크기 대폭 감소<br />
          무작위 선정된 Aggregator가 서브넷 내 어테스테이션 수집 후 SubmitAggregateAndProof
        </p>
      </div>
    </section>
  );
}
