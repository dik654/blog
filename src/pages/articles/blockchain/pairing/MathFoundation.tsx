import MillerRecursionViz from './viz/MillerRecursionViz';
import CodePanel from '@/components/ui/code-panel';

export default function MathFoundation() {
  return (
    <section id="math-foundation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Mathematical Foundations</h2>
      <div className="not-prose mb-8"><MillerRecursionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Divisors and Miller Function</h3>
        <p>
          유리함수 f의 인수(divisor, 영점과 극점의 형식적 합) <code>{"div(f) = sum(ni * (Pi))"}</code>를 정의합니다.
          <br />
          영점(ni &gt; 0)과 극점(ni &lt; 0)을 기록합니다.
          <br />
          Miller 함수 f_n,Q는 <code>{"div(f_{n,Q}) = n(Q) - ([n]Q) - (n-1)(O)"}</code>인 유리함수입니다.
          <br />
          Tate 페어링은 이 함수의 특정 점에서의 값으로 정의됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Miller Recursion</h3>
        <p>
          핵심 재귀: <code>{"f_{i+j,Q} = f_{i,Q} * f_{j,Q} * (l / v)"}</code>
          여기서 l은 [i]Q와 [j]Q를 지나는 직선, v는 수직선입니다.
        </p>
        <CodePanel title="Miller 재귀 공식" code={`Doubling:  f_{2i,Q} = f_{i,Q}^2 * (l_{[i]Q,[i]Q} / v_{[2i]Q})
Addition:  f_{i+1,Q} = f_{i,Q} * (l_{[i]Q,Q} / v_{[i+1]Q})

수직선 v는 별도로 계산하지 않습니다:
  v의 평가값은 Fp* 에 속하고, Fp* ⊂ (Fp12*)^r 이므로
  final exponentiation f^((p^12-1)/r) 에서 자동으로 소거됩니다.`} defaultOpen annotations={[
          { lines: [1, 1], color: 'sky', note: 'doubling step 재귀' },
          { lines: [2, 2], color: 'emerald', note: 'addition step 재귀' },
          { lines: [4, 6], color: 'amber', note: '수직선 소거 — final exp에서 처리' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Twist Homomorphism</h3>
        <p>
          G2는 원래 E(Fp12) 위에 정의되지만, sextic twist를 통해 E&#39;(Fp2)로 축소합니다.<br />
          D-type twist: <code>{"psi(X', Y') = (X'*v, Y'*w^3)"}</code> where <code>{"w^6 = xi = 9+u"}</code>.
          타워의 non-residue xi와 twist 파라미터가 동일하여 하나의 상수가 두 역할을 겸합니다.
        </p>
        <CodePanel title="Twist 커브와 사상" code={`E:  Y^2 = X^3 + b       (원래 커브, b = 3)
E': Y'^2 = X'^3 + b/xi  (트위스트 커브)

psi: E'(Fp2) -> E(Fp12)
  좌표 크기: Fp2 x 2 = Fp x 4  (Fp12 x 2 = Fp x 24 대비 6배 절감)`} defaultOpen annotations={[
          { lines: [1, 2], color: 'sky', note: '원래 커브 vs 트위스트 커브' },
          { lines: [4, 5], color: 'emerald', note: 'Fp2 → Fp12 사상: 6배 절감' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Frobenius Correction Constants</h3>
        <p>
          모든 보정 상수는 <code>{"alpha^n = c"}</code>이면 <code>{"alpha^(p^k) = alpha * c^((p^k-1)/n)"}</code>인
          원리에서 파생됩니다.
        </p>
        <CodePanel title="Frobenius 보정 상수" code={`u^2 = -1  -> u^p = -u                    (conjugate)
v^3 = xi  -> v^p = v * xi^((p-1)/3)      (complex Fp2)
           -> v^(p^2) = v * xi^((p^2-1)/3) (real Fp2)
w^6 = xi  -> w^p = w * xi^((p-1)/6)      (complex Fp2)
           -> w^(p^2) = w * xi^((p^2-1)/6) (real Fp2)

G2 Frobenius:
  pi(x,y) = (conj(x)*xi^((p-1)/3), conj(y)*xi^((p-1)/2))
  pi^2(x,y) = (x*xi^((p^2-1)/3), -y)   // gamma_22 = -1`} annotations={[
          { lines: [1, 5], color: 'sky', note: '타워 원소의 Frobenius' },
          { lines: [7, 9], color: 'emerald', note: 'G2 Frobenius 사상' },
        ]} />
        <p>
          <code>{"xi^((p^2-1)/2) = -1"}</code>인 이유: 만약 1이라면 xi가 Fp2에서 QR이 되어
          6차 확장이 불가능하므로 모순입니다. Frobenius^2의 보정 상수가 모두 실수인 이유는
          p^2승이 Fp2 위에서 항등이고, p ≡ 1 (mod 6)이기 때문입니다.
        </p>
      </div>
    </section>
  );
}
