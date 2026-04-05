import { motion } from 'framer-motion';

const workloads = [
  { name: 'MSM (다중 스칼라 곱셈)', bottleneck: '메모리 대역폭', best: 'H100 (HBM3 3.35TB/s)', alt: '4090도 가능 (1TB/s)' },
  { name: 'NTT (수론 변환)', bottleneck: 'CUDA 코어 수', best: '5090 (21,760 코어)', alt: 'H100 (16,896 코어)' },
  { name: 'Filecoin 봉인 C2', bottleneck: 'VRAM + 연산', best: 'A100 80GB', alt: '4090 24GB (32GiB 섹터)' },
  { name: 'SHA256 해싱', bottleneck: 'TDP당 해시율', best: '4090 (450W)', alt: 'ASIC이 더 효율적' },
];

export default function Blockchain() {
  return (
    <section id="blockchain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록체인 워크로드별 선택</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          블록체인 워크로드마다 병목 지점이 다릅니다.<br />
          MSM은 메모리 대역폭, NTT는 연산량, 봉인은 VRAM이 핵심 지표입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['워크로드', '병목', '최적 GPU', '대안'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workloads.map((w) => (
                <motion.tr key={w.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{w.name}</td>
                  <td className="border border-border px-3 py-2">{w.bottleneck}</td>
                  <td className="border border-border px-3 py-2">{w.best}</td>
                  <td className="border border-border px-3 py-2">{w.alt}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">블록체인 워크로드별 최적 선택</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 블록체인 워크로드별 병목 분석:

// MSM (Multi-Scalar Multiplication):
// - Groth16 SNARK 핵심
// - ~95% time on C2 proving
// - bandwidth bound
// - 포인트 × 스칼라 = 많은 memory access
//
// Best: H100 (HBM3 3.35 TB/s)
// Good: A100 (HBM2e 2 TB/s)
// OK: RTX 5090 (GDDR7 1.8 TB/s)
// Budget: RTX 4090 (GDDR6X 1 TB/s)

// NTT/FFT (Number Theoretic Transform):
// - polynomial evaluation
// - compute bound
// - many small ops in parallel
// - CUDA core count matters
//
// Best: RTX 5090 (21,760 cores)
// Good: H100 (16,896 cores)
// OK: RTX 4090 (16,384 cores)
// Pro: A100 (6,912 but HBM advantage)

// Filecoin Sealing (C2):
// - VRAM critical (proving key ~100GB)
// - compute + memory balanced
// - batched operations
//
// Best: H100 80GB or A100 80GB
// Workable: A6000 48GB
// Tight: RTX 4090 24GB (barely)

// ZK-Rollup Proving:
// - large circuits
// - need lots of VRAM
// - long-running proofs
//
// Best: H100 80GB (batch)
// Good: A100 80GB
// Limit: 24-48GB GPUs (smaller circuits)

// LLM Inference:
// - model weights in VRAM
// - batch processing
// - tensor cores matter
// - NVLink for scaling
//
// Best: H100 SXM + NVLink clusters
// Good: A100 SXM
// Budget: RTX 4090 (small models)

// AI Training:
// - multi-GPU essential
// - NVLink mandatory
// - massive compute + memory
//
// Best: H100 8x SXM + NVLink Switch
// Good: A100 SXM clusters
// Impossible: consumer GPUs

// SHA256 Mining (historical):
// - power efficiency matters
// - ASICs dominate
// - GPUs not competitive
// - energy cost > revenue

// Cost-effectiveness ratios:
//
// Per-dollar compute:
// - RTX 4090: excellent
// - A6000: good
// - A100: moderate
// - H100: premium pricing
//
// Per-watt efficiency:
// - H100: best efficiency
// - A100: good
// - RTX 4090: moderate
// - RTX 5090: higher TDP
//
// Per-GB VRAM:
// - H100: $312/GB
// - A100 80GB: $125/GB
// - A6000: $104/GB
// - RTX 4090: $83/GB

// Recommendation matrix:
// Hobbyist: RTX 4090
// Solo miner: RTX 4090 x2 or A6000
// Small SP: A6000 x4-8
// Large SP: A100 80GB cluster
// Enterprise AI: H100 SXM + NVLink
// Research lab: H100 + B200 mix`}
        </pre>
        <p className="leading-7">
          Workload-GPU matrix: <strong>MSM → HBM, NTT → cores, Sealing → VRAM</strong>.<br />
          cost-effective: RTX 4090 ($83/GB VRAM), H100 최고 efficiency.<br />
          scale-dependent selection: hobbyist → enterprise 다른 tier.
        </p>
      </div>
    </section>
  );
}
