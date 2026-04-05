import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import BellpersonViz from './viz/BellpersonViz';
import MSMAccelFlowViz from './viz/MSMAccelFlowViz';
import { bellpersonCode, ssparkCode } from './GPUAccelerationData';
import { neptuneCode, rustFilProofsCode, ecGpuSupraSealCode } from './GPUAccelerationData2';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function GPUAcceleration({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="gpu-acceleration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GPU 가속 라이브러리 & 구현</h2>
      <div className="not-prose mb-8"><BellpersonViz /></div>
      <div className="not-prose mb-8"><MSMAccelFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">bellperson (GPU Groth16)</h3>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('bp-gpu-multiexp', codeRefs['bp-gpu-multiexp'])} />
            <span className="text-[10px] text-muted-foreground self-center">gpu/multiexp.rs</span>
            <CodeViewButton onClick={() => onCodeRef('bp-groth16-prover', codeRefs['bp-groth16-prover'])} />
            <span className="text-[10px] text-muted-foreground self-center">prover/native.rs</span>
            <CodeViewButton onClick={() => onCodeRef('bp-verifier', codeRefs['bp-verifier'])} />
            <span className="text-[10px] text-muted-foreground self-center">verifier.rs</span>
          </div>
        )}
        <CodePanel title="bellperson GPU 가속 연산" code={bellpersonCode} annotations={[
          { lines: [5, 10], color: 'sky', note: 'MSM 핵심 연산' },
          { lines: [12, 15], color: 'emerald', note: 'NTT/FFT 다항식 곱셈' },
          { lines: [17, 26], color: 'amber', note: 'GPU 백엔드 구조' },
        ]} />
        <CitationBlock source="bellperson — src/gpu/multiexp.rs (MSM CUDA)" citeKey={2} type="code"
          href="https://github.com/filecoin-project/bellperson">
          <pre className="text-xs overflow-x-auto"><code>{`// multiexp.rs — GPU MSM (Multi-Scalar Multiplication)
pub fn multiexp_gpu<G: CurveAffine>(
    bases: &[G], scalars: &[G::Scalar], kern: &MultiexpKernel<G>
) -> Result<G::Projective> {
    // Pippenger's bucket method on GPU
    // 1. scalars를 c-bit windows로 분할
    // 2. 각 window의 bucket에 bases를 누적 (GPU 병렬)
    // 3. bucket 결과를 계층적으로 합산
    kern.multiexp(bases, scalars)
    // 2^26 points: ~2.8s on A10, ~800x faster than CPU
}`}</code></pre>
          <p className="mt-2 text-xs text-foreground/70">
            bellperson의 GPU MSM은 Pippenger 알고리즘을 CUDA/OpenCL로 구현합니다.<br />
            Groth16 증명의 80% 이상이 MSM 연산이므로 GPU 가속의 핵심입니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Supranational sppark</h3>
        <CodePanel title="sppark CUDA ZK 프리미티브" code={ssparkCode} annotations={[
          { lines: [5, 9], color: 'sky', note: 'CUDA MSM 구현' },
          { lines: [11, 15], color: 'emerald', note: 'CUDA NTT 구현' },
          { lines: [17, 22], color: 'amber', note: '성능 벤치마크' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">Neptune (Poseidon 해시 GPU)</h3>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('bp-generator', codeRefs['bp-generator'])} />
            <span className="text-[10px] text-muted-foreground self-center">generator.rs</span>
            <CodeViewButton onClick={() => onCodeRef('bp-proof', codeRefs['bp-proof'])} />
            <span className="text-[10px] text-muted-foreground self-center">proof.rs</span>
          </div>
        )}
        <CodePanel title="Neptune Poseidon 해시 가속" code={neptuneCode} annotations={[
          { lines: [4, 7], color: 'sky', note: 'Poseidon 해시 ZK 효율' },
          { lines: [16, 19], color: 'emerald', note: 'GPU 배치 해싱' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 활용 경로</h3>
        <p>
          <strong>PC2</strong> — storage-proofs-porep → generate_tree_c / generate_tree_r_last → Neptune(Poseidon GPU)<br />
          <strong>C2</strong> — storage-proofs-porep → bellperson(MSM/NTT GPU) → Groth16 증명 생성<br />
          <strong>PoSt</strong> — storage-proofs-post → bellperson → WinningPoSt/WindowPoSt 증명
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Lotus → Rust GPU 의존성 체인</h3>
        <p>
          <strong>Lotus(Go)</strong> → filecoin-ffi(CGo) → <strong>rust-fil-proofs</strong><br />
          → bellperson → blstrs → blst(ASM) — BLS12-381 산술<br />
          → <strong>ec-gpu-gen</strong> — 빌드 타임에 CUDA/OpenCL 커널 코드 생성<br />
          → <strong>sppark</strong> — CUDA 템플릿 기반 MSM/NTT (bellperson 대비 2~3배 빠름)
        </p>

        {/* ── GPU Performance Comparison ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 성능 비교 (실측)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GPU 성능 비교 (32 GiB sector C2 proving):

// CPU only (AMD EPYC 7B13 64-core):
// - C2 time: 4-8 hours
// - baseline (without GPU)

// NVIDIA RTX 3090 (24GB VRAM):
// - bellperson: 60-90 min
// - SupraSeal: 30-45 min
// - budget option

// NVIDIA A100 (40GB/80GB):
// - bellperson: 30-60 min
// - SupraSeal: 20-30 min
// - professional tier

// NVIDIA A6000 (48GB):
// - bellperson: 45-75 min
// - SupraSeal: 30-45 min
// - cost-effective

// NVIDIA H100 (80GB):
// - bellperson: 25-40 min
// - SupraSeal: 15-25 min
// - latest (2023-)

// NVIDIA B200 (192GB HBM3e):
// - preliminary estimates: <15 min
// - 2024 release
// - highest tier

// AMD MI250 (128GB HBM2e):
// - OpenCL support
// - ~40-60 min (bellperson)
// - less optimized

// Scaling:
// - multi-GPU: near-linear
// - PCIe bandwidth matter
// - NVLink for A100
// - shared CPU overhead

// Library evolution:
// - bellman (2018): baseline CPU
// - bellperson (2020): GPU backend
// - SupraSeal (2023): 2-3x faster
// - future: FPGA/ASIC?

// 선택 기준:
// 1. Budget: RTX 4090, A6000
// 2. Professional: A100
// 3. Cutting-edge: H100, B200
// 4. Volume: multi-A100 clusters

// 네트워크 영향:
// - 전체 GPU 수: ~100,000+ (추정)
// - 매일 증명: 100K+ SNARKs
// - 최대 GPU 소비 블록체인
// - AI/ML과 경쟁

// 2024 트렌드:
// - SupraSeal adoption 확산
// - H100 점진 도입
// - on-premise 선호
// - 클라우드는 SLO 이슈`}
        </pre>
        <p className="leading-7">
          GPU 성능: <strong>RTX 3090 (60min) → A100 (30min) → H100 (25min)</strong>.<br />
          SupraSeal이 bellperson 대비 2-3x 빠름.<br />
          전체 Filecoin: 100K+ GPUs, 최대 GPU 소비 체인.
        </p>
      </div>
    </section>
  );
}
