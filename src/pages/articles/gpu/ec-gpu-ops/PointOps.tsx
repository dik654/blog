import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const jacobianCode = `// Jacobian 좌표: (X : Y : Z)  →  affine (x, y) = (X/Z^2, Y/Z^3)
// 장점: 점 덧셈/더블링에서 역원(inversion) 연산을 완전히 제거
struct JacobianPoint {
    Fp256 X, Y, Z;  // 각 필드 원소는 Montgomery form
};

// Point Doubling (Jacobian): 1M + 5S + 1*a + 7add  (M=mul, S=square)
// 입력: P = (X1, Y1, Z1)
// 출력: 2P = (X3, Y3, Z3)
__device__ void point_double(const JacobianPoint& P, JacobianPoint& R) {
    Fp256 A, B, C, D;
    fp_square(P.Y, A);          // A = Y1^2
    fp_mul(P.X, A, B);          // B = X1 * A
    fp_add(B, B, B);
    fp_add(B, B, B);            // B = 4 * X1 * Y1^2
    fp_square(P.X, C);
    fp_add(C, C, D);
    fp_add(D, C, D);            // D = 3 * X1^2  (a=0 for BN254)
    fp_square(D, R.X);
    fp_sub(R.X, B, R.X);
    fp_sub(R.X, B, R.X);        // X3 = D^2 - 2B
    fp_sub(B, R.X, R.Y);
    fp_mul(R.Y, D, R.Y);
    fp_square(A, C);
    fp_add(C, C, C);
    fp_add(C, C, C);
    fp_add(C, C, C);
    fp_sub(R.Y, C, R.Y);        // Y3 = D*(B - X3) - 8*Y1^4
    fp_mul(P.Y, P.Z, R.Z);
    fp_add(R.Z, R.Z, R.Z);      // Z3 = 2 * Y1 * Z1
}`;

const comparisonData = [
  ['Affine (x, y)', '1 inv + 2 mul', '1 inv + 2 mul', '역원 필요'],
  ['Jacobian (X:Y:Z)', '0 inv + 12 mul', '0 inv + 4 mul + 4 sqr', '역원 제거'],
  ['혼합 덧셈', '0 inv + 7 mul', '-', 'Z2=1일 때'],
];

export default function PointOps() {
  return (
    <section id="point-ops" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Jacobian 점 덧셈/더블링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Affine 좌표 <code>(x, y)</code>로 점 덧셈을 하면 매번 <strong>필드 역원</strong>(inversion)이 필요하다.<br />
          역원은 Fp 곱셈 대비 약 <strong>30배</strong> 느리다.
          <strong>Jacobian 좌표</strong> <code>(X:Y:Z)</code>를 사용하면 역원 없이 곱셈과 덧셈만으로 점 연산이 가능하다.
        </p>

        <CitationBlock source="EFD -- Explicit Formulas Database" citeKey={3} type="paper"
          href="https://hyperelliptic.org/EFD/g1p/auto-shortw-jacobian.html">
          <p className="italic">"Complete addition formulas for short Weierstrass curves in Jacobian coordinates."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-8 mb-3">좌표계 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">좌표계</th>
                <th className="border border-border px-4 py-2 text-left">점 덧셈</th>
                <th className="border border-border px-4 py-2 text-left">점 더블링</th>
                <th className="border border-border px-4 py-2 text-left">특징</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map(([coord, add, dbl, note]) => (
                <tr key={coord}>
                  <td className="border border-border px-4 py-2 font-medium">{coord}</td>
                  <td className="border border-border px-4 py-2">{add}</td>
                  <td className="border border-border px-4 py-2">{dbl}</td>
                  <td className="border border-border px-4 py-2">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Point Doubling 커널</h3>
        <p>
          BN254에서 곡선 파라미터 <code>a = 0</code>이므로 더블링 공식이 단순해진다.<br />
          전체 연산은 Fp 곱셈 1회 + Fp 제곱 5회 + Fp 덧셈/뺄셈 7회다.<br />
          MSM에서 더블링은 덧셈만큼 자주 호출되므로 이 커널의 효율이 전체 성능을 좌우한다.
        </p>
        <CodePanel title="Jacobian Point Doubling (CUDA C++)" code={jacobianCode}
          annotations={[
            { lines: [1, 5], color: 'sky', note: 'Jacobian 좌표 구조체' },
            { lines: [12, 17], color: 'emerald', note: 'A, B 계산: Y^2, 4*X*Y^2' },
            { lines: [18, 23], color: 'amber', note: 'D = 3X^2, X3 = D^2 - 2B' },
            { lines: [24, 30], color: 'violet', note: 'Y3, Z3 계산' },
          ]} />
      </div>
    </section>
  );
}
