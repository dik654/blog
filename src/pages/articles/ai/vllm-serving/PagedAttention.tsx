import { CitationBlock } from '../../../../components/ui/citation';
import PagedAttentionViz from './viz/PagedAttentionViz';
import SchedulerViz from './viz/SchedulerViz';
import BlockManagerSection from './BlockManagerSection';
import ContinuousBatching from './ContinuousBatching';
import KVCacheHierarchy from './KVCacheHierarchy';
import { CodeViewButton } from '@/components/code';
import CodeSidebar from './CodeSidebar';
import { pagedAttentionRefs } from './codeRefs';
import { sharedCodeRefs } from './sharedCodeRefs';
import type { CodeRef } from '@/components/code/types';

export default function PagedAttention({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="paged-attention" className="mb-16 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">PagedAttention & KV 캐시 관리</h2>
        <div className="flex gap-2">
          <CodeViewButton onClick={() => onCodeRef('kv-cache-mgr', sharedCodeRefs['kv-cache-mgr'])} />
          <CodeViewButton onClick={() => onCodeRef('scheduler', sharedCodeRefs['scheduler'])} />
          <CodeSidebar refs={pagedAttentionRefs} />
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">PagedAttention 핵심 개념</h3>
        <p>
          PagedAttention — OS의 <strong>가상 메모리 페이징</strong>에서 영감<br />
          KV 캐시를 연속된 큰 메모리 블록 대신 <strong>고정 크기 블록</strong>으로 분할 관리<br />
          내부/외부 단편화(fragmentation, 메모리 낭비)를 거의 제거
        </p>

        <PagedAttentionViz />

        <CitationBlock source="PagedAttention 논문 §3 — Algorithm" citeKey={4} type="paper"
          href="https://arxiv.org/abs/2309.06180">
          <p className="italic">
            "We partition the KV cache of each sequence into KV blocks. Each block contains the key
            and value vectors for a fixed number of tokens... The blocks are not necessarily stored in
            contiguous space, allowing more flexible memory management as in OS virtual memory."
          </p>
          <p className="mt-2 text-xs">
            블록 크기 B는 보통 16 토큰. 논리 블록 → Block Table → 물리 블록 매핑으로
            비연속 할당 지원 — 이 설계로 외부 단편화 완전 제거
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Block Manager & 스케줄러</h3>
      </div>
      <div className="not-prose mb-6"><SchedulerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <BlockManagerSection />
        <ContinuousBatching />
        <KVCacheHierarchy />
      </div>
    </section>
  );
}
