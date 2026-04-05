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

        {/* ── SupraSeal 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SupraSeal 최적화 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SupraSeal (Supranational, 2023+):

// Background:
// - Supranational 팀
// - hardware-accelerated crypto
// - Filecoin sealing 최적화 목표
// - bellperson 대체 옵션

// 목표:
// - sealing time 50% 감소
// - 동일 증명 생성 (호환성)
// - hardware 투자 효율화

// 최적화 영역:

// 1. MSM (C2):
//    - windowed NAF (Non-Adjacent Form)
//    - memory prefetch
//    - SIMD utilization
//    - custom CUDA kernels
//    - 2-3x faster than bellperson
//
// 2. FFT/NTT:
//    - GPU-native implementation
//    - radix-4/8 butterflies
//    - shared memory usage
//
// 3. Field arithmetic:
//    - Montgomery form
//    - Barrett reduction
//    - Karatsuba multiplication
//    - assembly-level tuning
//
// 4. Memory management:
//    - pinned memory
//    - stream-based transfers
//    - double buffering
//    - NUMA awareness

// Specific techniques:

// Windowed NAF:
// - represent scalars in NAF
// - -1, 0, 1 digits
// - reduces additions in MSM
// - pre-computation of points

// Memory Prefetch:
// - issue memory loads ahead
// - hide latency
// - keep GPU busy
// - critical for MSM performance

// CUDA kernels:
// - highly tuned for A100/H100
// - avoid divergent warps
// - maximize occupancy
// - use tensor cores where possible

// 측정 결과 (32 GiB sector):
// bellperson:
// - C2: 60-90 min (A100)
// - PC2: 30 min (A100)
// - total: 4-5 hours
//
// SupraSeal:
// - C2: 20-30 min (A100)
// - PC2: 15 min (A100)
// - total: 2-3 hours
//
// Speed up: ~50%

// Hardware compatibility:
// - NVIDIA A100: optimal
// - NVIDIA H100: even faster
// - NVIDIA A6000: supported
// - AMD MI250: partial support

// Adoption:
// - 2023: released as optional
// - 2024: widespread SP adoption
// - Lotus integration
// - significant cost reduction

// Economic impact:
// - 50% faster sealing
// - 50% more sectors per GPU-hour
// - pushed TiB capacity growth
// - SP profitability increase`}
        </pre>
        <p className="leading-7">
          SupraSeal: <strong>50% faster sealing (Supranational 2023)</strong>.<br />
          windowed NAF + memory prefetch + custom CUDA.<br />
          4-5h → 2-3h per sector, significant SP economics improvement.
        </p>
      </div>
    </section>
  );
}
