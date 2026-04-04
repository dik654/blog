import CodePanel from '@/components/ui/code-panel';

const commitCode = `// KZG Commit = MSM
//
// p(x) = a_0 + a_1*x + ... + a_d*x^d   (다항식)
// SRS  = [G, sG, s^2 G, ..., s^d G]     (Setup 산출물)
//
// Commit(p) = a_0*G + a_1*sG + ... + a_d * s^d G
//           = MSM(scalars=[a_0,...,a_d], points=[G,sG,...,s^d G])
//
// GPU 호출 (pseudocode):
// commitment = gpu_msm(
//     scalars = polynomial.coefficients,   // d+1개의 Fr 원소
//     points  = srs.g1_points[0..d],       // d+1개의 G1 점
//     config  = { window_bits: 16, ... }
// )`;

const batchCommit = `// Batch Commit: 여러 다항식을 한 번에 커밋
//
// PLONK Round 1: f_1(x), f_2(x), f_3(x) 동시 커밋 필요
//
// 방법 1) 독립 MSM 3회 — 단순하지만 SRS 로딩 중복
//   C1 = gpu_msm(coeffs_1, srs)
//   C2 = gpu_msm(coeffs_2, srs)
//   C3 = gpu_msm(coeffs_3, srs)
//
// 방법 2) Batched MSM — SRS 버킷 테이블 공유
//   [C1, C2, C3] = gpu_batch_msm([coeffs_1, coeffs_2, coeffs_3], srs)
//   버킷 분류 단계에서 SRS 접근 패턴 동일 → 캐시 효율 극대화
//
// 방법 3) Concatenated MSM — 스칼라를 이어 붙여 단일 MSM
//   scalars = concat(coeffs_1, coeffs_2, coeffs_3)
//   points  = concat(srs[0..d], srs[0..d], srs[0..d])
//   result  = gpu_msm(scalars, points)  // 3(d+1) 크기의 단일 MSM
//   C1, C2, C3 = split(result)  // 별도 후처리 필요`;

export default function CommitMsm() {
  return (
    <section id="commit-msm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">커밋 = MSM: 다항식에서 곡선점으로</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          KZG 커밋은 정의 자체가 MSM이다.<br />
          다항식의 계수 벡터가 스칼라, SRS의 G1 점 벡터가 기저가 된다.
          <strong>msm-gpu-impl</strong> 글에서 다룬 Pippenger 버킷 방식 GPU 커널을 그대로 호출하면 된다.
        </p>
        <p>
          차수 d인 다항식의 커밋은 (d+1)개 스칼라-점 쌍의 MSM이다.<br />
          PLONK 기준 d는 게이트 수 n과 같으므로 n = 2^22라면 약 400만 쌍의 MSM이다.<br />
          GPU에서 약 50~100ms에 완료되며, CPU 대비 20~50배 빠르다.
        </p>
        <CodePanel title="KZG Commit을 MSM으로 호출" code={commitCode} annotations={[
          { lines: [3, 4], color: 'sky', note: '다항식 + SRS' },
          { lines: [6, 7], color: 'emerald', note: 'Commit = MSM 정의' },
          { lines: [10, 13], color: 'amber', note: 'GPU 호출 형태' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">배치 커밋 전략</h3>
        <p>
          PLONK Round 1에서는 3개의 와이어 다항식을 동시에 커밋한다.<br />
          독립 MSM 3회보다 <strong>Batched MSM</strong>이 효율적이다.<br />
          같은 SRS를 공유하므로 버킷 테이블 구성 비용을 한 번만 지불하고, GPU 캐시 적중률도 높아진다.
        </p>
        <p>
          ICICLE이나 sppark 같은 라이브러리는 batch MSM API를 제공한다.<br />
          내부적으로 스칼라를 인터리브 배치하여 동일 SRS 점에 대한 메모리 접근을 합친다.
        </p>
        <CodePanel title="배치 커밋: 3가지 전략" code={batchCommit} annotations={[
          { lines: [3, 7], color: 'sky', note: '방법 1: 독립 MSM' },
          { lines: [9, 11], color: 'emerald', note: '방법 2: Batched MSM (권장)' },
          { lines: [13, 17], color: 'amber', note: '방법 3: Concatenated' },
        ]} />
      </div>
    </section>
  );
}
