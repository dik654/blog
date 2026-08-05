import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import Groth16PipelineViz from './viz/Groth16PipelineViz';

const gpuMsmCode = `// GPU MSM 오프로드 (rapidsnark GPU 백엔드)
//
// CPU 경로 (기본):
//   Pippenger MSM, OpenMP 멀티스레드
//   2^20 포인트: ~15초 (16코어)
//
// GPU 경로 (CUDA):
//   cudaMemcpy(d_scalars, h_scalars, n * 32, H2D);
//   cudaMemcpy(d_points,  h_points,  n * 64, H2D);
//
//   // 버킷 누적 커널
//   msm_bucket_kernel<<<grid, block>>>(d_scalars, d_points, d_buckets, n, c);
//
//   // 버킷 환원
//   msm_reduce_kernel<<<grid2, block2>>>(d_buckets, d_result, num_windows);
//
//   cudaMemcpy(h_result, d_result, 96, D2H);  // Jacobian 점
//
// GPU MSM은 전체 증명 시간의 70~80%를 차지하는 병목이다.
// GPU 오프로드 시 2^20 제약 증명: ~15초 → ~2초`;

export default function Proving() {
  return (
    <section id="proving" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GPU Proving: NTT → MSM 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Groth16 증명은 5단계로 구성된다. NTT로 다항식을 평가하고, 몫 다항식 H(x)를 구한 뒤,
          MSM으로 타원곡선 위의 증명 원소를 계산한다. MSM이 전체 시간의 <strong>70~80%</strong>를
          차지하므로, GPU 가속의 핵심 타깃이다.
        </p>
        <Groth16PipelineViz />
        <p>
          GPU 백엔드는 MSM을 CUDA 커널로 오프로드한다.<br />
          Pippenger 버킷 방식을 사용하며, 스칼라와 포인트를 GPU 메모리로 전송한 뒤
          버킷 누적과 환원을 병렬 수행한다.
        </p>
        <CodePanel title="GPU MSM 오프로드 경로" code={gpuMsmCode} annotations={[
          { lines: [3, 5], color: 'sky', note: 'CPU 경로: OpenMP Pippenger' },
          { lines: [7, 9], color: 'emerald', note: 'H2D 전송: 스칼라 + 포인트' },
          { lines: [11, 15], color: 'violet', note: 'CUDA 커널: 버킷 누적 + 환원' },
          { lines: [17, 19], color: 'amber', note: 'GPU MSM: 7~8x 속도 향상' },
        ]} />
        <CitationBlock source="Groth16 — On the Size of Pairing-based Non-interactive Arguments"
          citeKey={3} type="paper" href="https://eprint.iacr.org/2016/260">
          <p className="text-xs">
            Groth16 증명자는 G1 위의 A, C와 G2 위의 B, 총 3개 원소를 출력한다.<br />
            각 원소 계산에 n-크기 MSM이 필요하므로, 대형 회로에서는 MSM 최적화가 결정적이다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
