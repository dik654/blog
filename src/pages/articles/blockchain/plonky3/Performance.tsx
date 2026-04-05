import CodePanel from '@/components/ui/code-panel';
import {
  DFT_COMPARISON, BENCH_CODE, BENCH_ANNOTATIONS,
  OPTIMIZATION_CODE, OPTIMIZATION_ANNOTATIONS,
} from './PerformanceData';

export default function Performance({ title }: { title?: string }) {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '성능 벤치마크'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Plonky3는 31비트 BabyBear 필드, Bowers FFT, SIMD 병렬 해싱 등
          다양한 최적화로 높은 증명 생성 성능을 달성합니다.
        </p>

        <h3>DFT 구현체 비교</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {DFT_COMPARISON.map(d => (
            <div key={d.name} className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
              <p className="font-mono text-xs font-bold text-indigo-400">{d.name}</p>
              <p className="text-[10px] text-foreground/50 mt-0.5">
                시간: {d.time} | 메모리: {d.memory}
              </p>
              <p className="text-xs mt-1 text-foreground/75">{d.desc}</p>
            </div>
          ))}
        </div>

        <h3>성능 특성</h3>
        <CodePanel title="BabyBear 기준 성능 분석" code={BENCH_CODE}
          annotations={BENCH_ANNOTATIONS} />

        <h3>최적화 기법</h3>
        <CodePanel title="배치/SIMD/메모리/병렬화 최적화" code={OPTIMIZATION_CODE}
          annotations={OPTIMIZATION_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 Prover Performance</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Plonky3 실측 성능 (2024)

// Benchmark: Keccak-AIR 10,000 hashes
// Hardware: AMD Ryzen 9 5950X (16 cores)

// Phases breakdown
// - Trace generation: 50ms
// - Merkle commit: 200ms
// - FRI folding: 300ms
// - Query phase: 100ms
// Total: ~650ms

// Comparison with other systems
// Plonky3 (BabyBear): 650ms
// Plonky2 (Goldilocks): 1200ms
// Halo2 (BN254): 5000ms
// → Plonky3가 가장 빠름

// GPU acceleration (future)
// - CUDA kernel for NTT
// - Poseidon2 SIMD (AVX-512)
// - Multi-GPU scaling
// Expected: 5-10x additional speedup

// Memory usage
// - 2^20 rows: 2GB
// - 2^22 rows: 8GB
// - 2^24 rows: 32GB
// - Field size impact: BabyBear 4x 적음 vs 254-bit

// Use case examples
// - SP1 zkVM: 1s per RISC-V instruction batch
// - Succinct proof aggregation: 10s for 1000 proofs
// - Taiko zkEVM: 20s per block`}</pre>

      </div>
    </section>
  );
}
