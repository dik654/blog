import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import MemoryHierarchyViz from './viz/MemoryHierarchyViz';

const memCode = `GPU 메모리 계층 (per-SM 기준, A100):

Register File   64K x 32-bit registers   per-thread
  └→ 스레드 전용, 가장 빠름, spill → local memory

Shared Memory   164 KB (configurable)     per-block
  └→ __shared__ 선언, bank 기반 접근

L1 Data Cache   128 KB (shared mem과 공유)  per-SM
  └→ HW 자동 캐싱, 공유 메모리와 분할 설정 가능

L2 Cache        40 MB                     chip-wide
  └→ 모든 SM이 공유, global 접근 캐싱

Global Memory   80 GB HBM2e               device-wide
  └→ 가장 느림, coalesced access 패턴 필수`;

const memAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '레지스터: 최고속' },
  { lines: [6, 7] as [number, number], color: 'emerald' as const, note: '공유 메모리: 블록 내 공유' },
  { lines: [12, 13] as [number, number], color: 'amber' as const, note: '글로벌: 대역폭 병목' },
];

export default function MemoryHierarchy() {
  return (
    <section id="memory-hierarchy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 계층 구조</h2>
      <div className="not-prose mb-8"><MemoryHierarchyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU 성능의 핵심은 메모리 계층 활용입니다.
          <br />
          레지스터에서 글로벌 메모리까지 <strong>지연 시간이 ~400배</strong> 차이나며,
          공유 메모리와 캐시를 적극 활용하는 것이 최적화의 출발점입니다.
        </p>

        <CitationBlock source="CUDA Best Practices Guide — Memory Optimizations" citeKey={2} type="paper"
          href="https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/">
          <p className="italic">"Effective use of the various memory spaces is one of the key
          methods for extracting the best performance from GPU hardware."</p>
        </CitationBlock>

        <CodePanel title="GPU 메모리 계층 상세" code={memCode} annotations={memAnnotations} />
      </div>
    </section>
  );
}
