import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import OptimizationViz from './viz/OptimizationViz';

const optCode = `GPU 최적화 체크리스트:

1. 메모리 코어레싱 (Memory Coalescing)
   └→ 인접 스레드가 연속 주소 접근 → 1회 트랜잭션
   └→ stride 접근은 N배 트랜잭션 → 배열 레이아웃 변환 (AoS → SoA)

2. 뱅크 충돌 회피 (Bank Conflict Avoidance)
   └→ 공유 메모리 32 banks, 동일 bank 동시 접근 → 직렬화
   └→ 패딩(+1) 기법으로 stride 조정

3. 커널 퓨전 (Kernel Fusion)
   └→ 여러 커널 합쳐 global 메모리 왕복 제거
   └→ ZK 증명: MSM 버킷 + 축소를 단일 커널로`;

const annotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '코어레싱: 연속 접근 패턴' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '뱅크 충돌: 패딩으로 해결' },
  { lines: [11, 13] as [number, number], color: 'amber' as const, note: '커널 퓨전: 메모리 왕복 제거' },
];

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GPU 최적화 기법</h2>
      <div className="not-prose mb-8"><OptimizationViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU 커널의 성능은 연산 자체보다 <strong>메모리 접근 패턴</strong>에 의해 결정됩니다.
          <br />
          코어레싱, 뱅크 충돌 회피, 커널 퓨전은 GPU 프로그래밍의 3대 최적화 원칙입니다.
        </p>

        <CitationBlock source="CUDA Best Practices — Coalesced Access" citeKey={4} type="paper"
          href="https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/">
          <p className="italic">"Global memory accesses are serviced in 32-, 64-, or 128-byte
          transactions. Maximizing the number of useful bytes per transaction is key."</p>
        </CitationBlock>

        <CodePanel title="GPU 최적화 체크리스트" code={optCode} annotations={annotations} />
      </div>
    </section>
  );
}
