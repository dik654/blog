import { motion } from 'framer-motion';

const specs = [
  { gpu: 'A100 SXM', cores: '6,912', vram: '80GB HBM2e', bw: '2,039 GB/s', tdp: '400W', feat: 'NVLink 600GB/s' },
  { gpu: 'H100 SXM', cores: '16,896', vram: '80GB HBM3', bw: '3,350 GB/s', tdp: '700W', feat: 'NVLink 900GB/s' },
];

export default function Datacenter() {
  return (
    <section id="datacenter" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터센터 GPU (A100, H100)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          데이터센터 GPU는 블로워 타입 냉각으로 서버 랙에 최적화되어 있습니다.<br />
          HBM 메모리는 GDDR 대비 대역폭이 2~3배 높아 MSM 같은 메모리 바운드 연산에 유리합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['GPU', 'CUDA 코어', 'VRAM', '대역폭', 'TDP', '특수 기능'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <motion.tr key={s.gpu} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{s.gpu}</td>
                  <td className="border border-border px-3 py-2">{s.cores}</td>
                  <td className="border border-border px-3 py-2">{s.vram}</td>
                  <td className="border border-border px-3 py-2">{s.bw}</td>
                  <td className="border border-border px-3 py-2">{s.tdp}</td>
                  <td className="border border-border px-3 py-2">{s.feat}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Datacenter GPU 상세 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// NVIDIA A100 (2020-):
// Architecture: Ampere (TSMC 7nm)
// - 6,912 CUDA cores
// - 40GB or 80GB HBM2e
// - 1.55 TB/s or 2.04 TB/s bandwidth
// - 400W TDP (SXM)
// - 250W TDP (PCIe)
// - NVLink 3.0: 600 GB/s
// - price: $10K-15K

// Form factors:
// - SXM4: server-specific, direct socket
// - PCIe: standard slot
// - HGX: 8-GPU baseboard

// Features:
// - Multi-Instance GPU (MIG): split into 7 instances
// - Tensor Cores (3rd gen)
// - Structural Sparsity
// - FP16, FP32, TF32, BF16 support

// NVIDIA H100 (2022-):
// Architecture: Hopper (TSMC 4N)
// - 16,896 CUDA cores (+144%)
// - 80GB HBM3
// - 3.35 TB/s bandwidth (+64%)
// - 700W TDP (SXM)
// - NVLink 4.0: 900 GB/s
// - PCIe 5.0
// - price: $25K-40K

// H100 innovations:
// - Transformer Engine (FP8)
// - NVLink Switch (256-GPU clusters)
// - DPX Instructions (dynamic programming)
// - confidential computing
// - HBM3 (vs HBM2e)

// NVIDIA B200 (2024-):
// Architecture: Blackwell
// - 208 billion transistors (2x H100)
// - 192 GB HBM3e
// - 8 TB/s bandwidth
// - 1000W TDP
// - NVLink 5.0: 1.8 TB/s
// - dual-die design
// - price: $50K+ estimated

// NVLink importance:
// - GPU-to-GPU direct communication
// - bypass CPU + PCIe
// - critical for:
//   - multi-GPU training
//   - LLM inference (tensor parallelism)
//   - MSM/NTT aggregation
//   - parameter sharing

// NVLink speeds evolution:
// - NVLink 1.0: 160 GB/s (V100)
// - NVLink 2.0: 300 GB/s (V100)
// - NVLink 3.0: 600 GB/s (A100)
// - NVLink 4.0: 900 GB/s (H100)
// - NVLink 5.0: 1800 GB/s (B200)

// HBM vs GDDR:
// HBM (High Bandwidth Memory):
// - stacked 3D
// - wide interface
// - near-processor
// - high bandwidth
// - expensive
//
// GDDR (consumer):
// - traditional DRAM
// - traces on PCB
// - lower bandwidth
// - cheaper
// - consumer price

// Server integration:
// - blower cooling (straight-through)
// - rack-mountable
// - IPMI management
// - ECC memory
// - redundant power
// - enterprise drivers

// Use cases (datacenter):
// - AI training (large models)
// - LLM inference
// - Filecoin C2 (professional SP)
// - ZK-rollup proving
// - HPC simulations`}
        </pre>
        <p className="leading-7">
          Datacenter: <strong>A100 (80GB HBM2e) → H100 (80GB HBM3) → B200 (192GB HBM3e)</strong>.<br />
          NVLink 600GB/s → 900GB/s → 1.8TB/s evolution.<br />
          HBM memory + blower cooling + ECC + enterprise drivers.
        </p>
      </div>
    </section>
  );
}
