import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const pipelineCode = `// rapidsnark Groth16 증명 파이프라인
//
// Step 1: 다항식 평가 (NTT)
//   a(x) = NTT(A * witness)   // A 행렬과 witness 내적 → NTT
//   b(x) = NTT(B * witness)   // B 행렬과 witness 내적 → NTT
//   c(x) = NTT(C * witness)   // C 행렬과 witness 내적 → NTT
//
// Step 2: 몫 다항식 H(x) 계산
//   h_eval = (a * b - c) / z   // evaluation domain에서 원소별 나눗셈
//   // z = vanishing polynomial (모든 제약 루트의 곱)
//
// Step 3: 역변환 (INTT)
//   H_coeffs = INTT(h_eval)    // H(x) 계수 형태로 복원
//
// Step 4: MSM (증명 원소 계산) ← 전체 시간의 70~80%
//   pi_A = MSM(witness, pk.A_points)    // [A]_1 in G1
//   pi_B = MSM(witness, pk.B_points)    // [B]_2 in G2
//   pi_C = MSM(witness, pk.C_points)    // [C]_1 in G1
//   pi_H = MSM(H_coeffs, pk.H_points)  // [H]_1 in G1
//
// Step 5: 증명 조립
//   proof = { pi_A, pi_B, pi_C }       // 3개 타원곡선 점
//   // pi_C에 pi_H가 합산됨`;

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
        <CodePanel title="Groth16 증명 파이프라인 5단계" code={pipelineCode} annotations={[
          { lines: [3, 6], color: 'sky', note: 'Step 1: NTT로 다항식 평가' },
          { lines: [8, 10], color: 'emerald', note: 'Step 2: H(x) = (A*B - C) / Z' },
          { lines: [12, 13], color: 'amber', note: 'Step 3: INTT로 계수 복원' },
          { lines: [15, 19], color: 'violet', note: 'Step 4: MSM 4회 (병목)' },
          { lines: [21, 23], color: 'rose', note: 'Step 5: 증명 조립' },
        ]} />
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
