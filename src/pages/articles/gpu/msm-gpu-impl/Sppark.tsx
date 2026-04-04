import CodePanel from '@/components/ui/code-panel';

const archCode = `// sppark 아키텍처 (Supranational)
//
// Rust 프론트엔드          CUDA 백엔드
// ┌──────────────┐       ┌──────────────────────┐
// │ sppark::msm  │──FFI──│ pippenger.cuh         │
// │  - BLS12-381 │       │  - bucket_accumulate  │
// │  - BN254     │       │  - bucket_reduce      │
// │  - 커브 선택  │       │  - batch_affine       │
// └──────────────┘       └──────────────────────┘
//
// 핵심 최적화:
// 1. Batch Affine Inversion (Montgomery's trick)
//    - Jacobian → Affine 변환에 역원 필요
//    - n개 역원을 1회 역원 + 3(n-1)회 곱셈으로 계산
//    - 버킷 누적 시 Affine 좌표 사용 → 혼합 덧셈(6M) vs Jacobian(16M)
//
// 2. 파이프라이닝
//    - 윈도우 i의 버킷 누적과 윈도우 i-1의 환원을 동시 수행
//    - CUDA 스트림 2개로 커널 오버랩`;

const batchAffine = `// Montgomery's Trick: n개 역원을 한 번에 계산
//
// 입력: a[0], a[1], ..., a[n-1]  (Fp 원소)
// 출력: 1/a[0], 1/a[1], ..., 1/a[n-1]
//
// 전진 패스: prefix[i] = a[0] * a[1] * ... * a[i]
// 역원 1회:  inv = 1 / prefix[n-1]
// 후진 패스: 1/a[i] = inv * prefix[i-1]
//            inv = inv * a[i]
//
// 비용: 1 inversion + 3(n-1) multiplications
// vs 나이브: n inversions
//
// 효과: Jacobian(X:Y:Z) → Affine(x,y)에 Z^-1 필요
//       수천 개 점의 역원을 한꺼번에 계산하여
//       혼합 덧셈(mixed addition, 6M)을 사용 가능`;

export default function Sppark() {
  return (
    <section id="sppark" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">sppark 구현 분석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>sppark</strong>는 Supranational이 개발한 프로덕션 MSM 라이브러리다.<br />
          Filecoin의 SupraSeal에 통합되어 실제 증명 생성에 사용된다.<br />
          Rust 프론트엔드와 CUDA 백엔드로 구성되며, BLS12-381과 BN254 곡선을 지원한다.
        </p>
        <CodePanel title="sppark 아키텍처와 핵심 최적화" code={archCode} annotations={[
          { lines: [4, 9], color: 'sky', note: 'Rust FFI + CUDA 백엔드' },
          { lines: [12, 15], color: 'emerald', note: 'Batch Affine Inversion' },
          { lines: [17, 19], color: 'amber', note: '윈도우 파이프라이닝' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Batch Affine Inversion</h3>
        <p>
          Jacobian 좌표 덧셈은 16회 곱셈이 필요하지만, Affine 혼합 덧셈은 6회로 끝난다.<br />
          Montgomery's trick으로 n개 역원을 곱셈 3(n-1)회 + 역원 1회로 처리하면
          모든 점을 Affine로 변환할 수 있다. sppark는 이 기법으로 bellperson 대비 약 2배 빠르다.
        </p>
        <CodePanel title="Montgomery's Trick (Batch Inversion)" code={batchAffine} annotations={[
          { lines: [6, 9], color: 'sky', note: '전진·후진 패스' },
          { lines: [11, 12], color: 'emerald', note: '비용 비교' },
          { lines: [14, 16], color: 'amber', note: '혼합 덧셈 활용' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">라이브러리</th>
                <th className="border border-border px-4 py-2 text-left">BLS12-381 2^22</th>
                <th className="border border-border px-4 py-2 text-left">핵심 기법</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['bellperson', '~4.5s', 'Pippenger + Jacobian 누적'],
                ['sppark', '~2.2s', 'Batch Affine + 파이프라이닝'],
                ['ICICLE', '~2.5s', 'Radix Sort + 다중 곡선 추상화'],
              ].map(([lib, time, tech]) => (
                <tr key={lib}>
                  <td className="border border-border px-4 py-2 font-medium">{lib}</td>
                  <td className="border border-border px-4 py-2">{time}</td>
                  <td className="border border-border px-4 py-2">{tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
