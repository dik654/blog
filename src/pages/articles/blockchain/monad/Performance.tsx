import PerfBenchViz from './viz/PerfBenchViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Performance({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">성능 분석 & 벤치마크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          3가지 최적화 축: JIT 2.01x + 병렬 5.56x + io_uring 4.17x<br />
          EvmStackAllocator로 메모리 할당 16.7배 개선
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('monad-perf-benchmark', codeRefs['monad-perf-benchmark'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              벤치마크 결과
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <PerfBenchViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Monad 성능 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Monad Performance Stack
//
// 3축 최적화 총효과:
//   JIT × Parallel × io_uring =
//   2.01 × 5.56 × 4.17 = ~46x baseline
//
// (이론적 상한, 실제는 병목 존재)

// EvmStackAllocator:
//
//   문제:
//     EVM 실행 중 대량 메모리 할당
//     Standard malloc/free 비용
//     Heap fragmentation
//
//   Solution:
//     Fixed-size arena per transaction
//     Bump allocator
//     No per-op malloc
//     Reset at tx end
//
//   결과: 16.7x 메모리 할당 개선

// io_uring 적용:
//
//   전통적 I/O (블로킹):
//     read() syscall per block
//     컨텍스트 스위치 매번
//     Thread pool 필요
//
//   io_uring (Linux 5.1+):
//     Async submission queue
//     Single syscall, batched
//     Kernel에서 병렬 처리
//     Zero-copy possible
//
//   결과: 4.17x I/O throughput

// State Access Patterns:
//
//   Ethereum Trie:
//     Merkle Patricia Trie
//     20-deep path typical
//     20 random reads per state access
//     Disk-bound workload
//
//   Monad 최적화:
//     Prefetch predictions
//     Parallel trie reads
//     io_uring으로 병렬 I/O
//     NVMe queue depth 활용

// 벤치마크 시나리오:
//
//   1. Simple Transfers (최고 성능)
//      TPS: ~10,000+
//      Parallel conflict: 낮음
//
//   2. Uniswap V3 swaps
//      TPS: ~4,000-6,000
//      Popular pools: conflicts 많음
//
//   3. NFT mint storm
//      TPS: ~2,000-3,000
//      Storage contention 심함
//
//   4. Arbitrary contract
//      TPS: highly variable

// 실제 하드웨어:
//   Monad 권장:
//     CPU: 16+ cores
//     RAM: 64GB+
//     Storage: NVMe SSD (TB급)
//     Network: 1Gbps+
//
// vs Ethereum:
//   Similar hardware
//   EVM overhead 작지만
//   Consensus overhead 남음

// 한계:
//   - Random disk access 여전히 병목
//   - Consensus round trip (~100ms)
//   - Network propagation
//   - 실제 TPS는 이론치보다 낮음`}
        </pre>
      </div>
    </section>
  );
}
