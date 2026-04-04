import CodePanel from '@/components/ui/code-panel';

const mdsKernel = `// MDS 행렬 곱셈 CUDA 커널
// state_out[i] = sum_j( MDS[i][j] * state_in[j] )  for 0 <= j < width
//
// 각 lane(스레드)이 출력 state[lane]을 계산
// = MDS 행렬의 lane번째 행과 state 벡터의 내적
__device__ void mds_multiply(Fp* state, int width, int lane,
                             const Fp* mds_matrix) {
    Fp acc = Fp::zero();
    // 공유 메모리에서 전체 상태를 읽어 내적 계산
    for (int j = 0; j < width; j++) {
        Fp mij = mds_matrix[lane * width + j];  // MDS[lane][j]
        acc = fp_add(acc, fp_mul(mij, state[j]));
    }
    state[lane] = acc;  // 동기화 후 기록
}`;

const sparseMds = `// Partial round 최적화: Sparse MDS 분해
//
// 일반 MDS: width x width 행렬 → width^2 곱셈/라운드
// Sparse MDS: M = M' * M''  (사전 계산)
//   M'  = 첫 라운드에만 사용하는 밀집 행렬
//   M'' = 나머지 Partial round용 희소 행렬
//
// 희소 행렬 M'' 구조 (width=4 예시):
//   [ v0  v1  v2  v3 ]    ← 첫 행만 밀집
//   [ w1   1   0   0 ]    ← 나머지는 대각 + 첫 열
//   [ w2   0   1   0 ]
//   [ w3   0   0   1 ]
//
// 곱셈 비용: width^2 → 2*width - 1
//   state'[0] = dot(v, state)           // width 곱셈
//   state'[i] = w[i]*state[0] + state[i] // 1 곱셈 (i>0)
//
// arity=11(width=12): 144 → 23 곱셈/라운드
// 57 Partial round 합산: 8208 → 1311 곱셈 절감`;

export default function MdsKernel() {
  return (
    <section id="mds-kernel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MDS 행렬 곱셈 커널</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MDS(Maximum Distance Separable) 행렬은 width x width 크기의 유한체 행렬이다.<br />
          매 라운드마다 상태 벡터에 이 행렬을 곱하여 완전 확산(full diffusion)을 달성한다.<br />
          하나의 입력 원소가 변하면 출력 전체가 영향받는다.
        </p>
        <p>
          GPU 구현에서 각 스레드(lane)는 MDS 행렬의 한 행과 상태 벡터의 내적을 계산한다.<br />
          MDS 행렬은 해시 파라미터에 따라 고정되므로 상수 메모리(constant memory)나
          레지스터에 미리 적재하여 글로벌 메모리 접근을 제거한다.
        </p>
        <CodePanel title="MDS 행렬-벡터 곱셈 커널" code={mdsKernel} annotations={[
          { lines: [2, 4], color: 'sky', note: '각 lane이 출력 원소 하나 담당' },
          { lines: [9, 13], color: 'emerald', note: '내적: width회 Fp mul + add' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Sparse MDS 최적화</h3>
        <p>
          Partial round에서는 S-box가 첫 원소만 비선형 변환하지만,
          MDS 곱셈은 여전히 width^2 곱셈이 필요하다.<br />
          Sparse MDS 분해는 이 비용을 2*width - 1로 줄인다.<br />
          Neptune과 ICICLE 모두 이 최적화를 적용한다.
        </p>
        <CodePanel title="Sparse MDS 분해와 비용 절감" code={sparseMds} annotations={[
          { lines: [3, 5], color: 'sky', note: 'M = M\' * M\'\' 분해' },
          { lines: [7, 12], color: 'emerald', note: '희소 행렬: 첫 행 밀집 + 대각' },
          { lines: [14, 17], color: 'amber', note: 'width^2 → 2w-1 곱셈으로 축소' },
        ]} />
      </div>
    </section>
  );
}
