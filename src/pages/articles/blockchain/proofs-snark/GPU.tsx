import { codeRefs } from './codeRefs';
import GPUViz from './viz/GPUViz';
import type { CodeRef } from '@/components/code/types';

export default function GPU({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="gpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">bellperson GPU 가속</h2>
      <div className="not-prose mb-8">
        <GPUViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 메모리 병목</strong> — G1/G2 점을 GPU VRAM에 올려야 함
          <br />
          32GiB 섹터 증명 시 수 GB VRAM 필요
          <br />
          GPU 메모리 부족 시 분할 전송
        </p>

        {/* ── bellperson GPU ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">bellperson GPU 가속</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// bellperson (Filecoin's Groth16 library):

// Origin:
// - fork of bellman (Zcash Rust lib)
// - Filecoin-specific optimizations
// - GPU backend added

// Core operations:
// 1. FFT (Fast Fourier Transform):
//    - polynomial evaluation
//    - NTT (Number Theoretic Transform)
//    - BLS12-381 field operations
//
// 2. MSM (Multi-Scalar Multiplication):
//    - Σ a_i · P_i
//    - largest bottleneck
//    - Pippenger's algorithm

// GPU acceleration:
// - CUDA: NVIDIA (primary)
// - OpenCL: AMD, cross-platform
// - OpenCL-based Pippenger

// Pippenger's algorithm:
// - windowed method
// - split scalars into windows
// - bucket method
// - parallelizable

// Performance:
// - 10^8 constraints circuit
// - MSM on G1: ~20 billion point-scalar ops
// - CPU (EPYC 64c): 2-4 hours
// - GPU (A100): 20-40 minutes
// - 5-10x speedup

// Memory:
// - proving key: 100 GiB
// - must load into VRAM
// - A100: 80 GB VRAM (3 batches)
// - A6000: 48 GB VRAM (partial)
// - batching strategies

// Batching strategies:
// - full: entire key in VRAM
// - sliced: load key chunks
// - pipelined: overlap compute/transfer
// - optimal: depends on GPU

// CUDA kernel:
// __global__ void msm_kernel(
//     const G1Affine* points,
//     const Scalar* scalars,
//     G1Projective* result,
//     int num_terms
// ) {
//     // Pippenger's with windowing
//     // ... optimized field arithmetic
// }

// GPU architectures tested:
// - NVIDIA V100 (old)
// - NVIDIA A100: best
// - NVIDIA A6000: cost-effective
// - NVIDIA RTX 4090: consumer option
// - AMD MI250: available

// Bottlenecks:
// 1. PCIe transfer (CPU ↔ GPU)
// 2. VRAM bandwidth
// 3. scalar field arithmetic
// 4. coordination overhead

// 측정:
// bellperson CPU: 4-8 hours (C2)
// bellperson GPU (A100): 30-60 min
// SupraSeal (A100): 20-30 min (2x faster)
// H100: ~15-20 min (another 50% faster)`}
        </pre>
        <p className="leading-7">
          bellperson: <strong>Groth16 Rust + GPU acceleration</strong>.<br />
          MSM bottleneck (95% time), Pippenger's algorithm.<br />
          A100: 20-40min, H100: 15-20min for C2.
        </p>
      </div>
    </section>
  );
}
