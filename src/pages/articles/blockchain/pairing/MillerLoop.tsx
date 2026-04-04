import MillerLoopViz from './viz/MillerLoopViz';
import PairingPipelineViz from './viz/PairingPipelineViz';
import CodePanel from '@/components/ui/code-panel';

export default function MillerLoop() {
  return (
    <section id="miller-loop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Miller Loop</h2>
      <div className="not-prose mb-8"><MillerLoopViz /></div>
      <h3 className="text-lg font-semibold mb-3">페어링 전체 파이프라인</h3>
      <div className="not-prose mb-8"><PairingPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Optimal Ate Pairing은 <strong>Miller Loop</strong>와 Final Exponentiation 두 단계로 구성됩니다.
          <br />
          Miller Loop는 루프 파라미터 <code>|6u+2|</code> (약 65비트)의 NAF(Non-Adjacent Form, 비인접 형식) 표현을 MSB부터 순회합니다.
          <br />
          매 비트마다 <strong>doubling step</strong>(접선)을 수행합니다.
          <br />
          NAF 비트가 비영이면 <strong>addition step</strong>(할선)도 수행합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Line Function</h3>
        <p>
          타원곡선의 점 덧셈에서 두 점을 지나는 직선(접선 또는 할선)의 방정식입니다.
          <br />
          다른 점 P에서 평가하여 Fp12 원소를 얻습니다.
          <br />
          D-type twist를 통해 <code>{"w^3 * l = yP + (-lambda*xP)*w + (lambda*xT - yT)*w*v"}</code> 형태로 전개됩니다.
          <br />
          Fp12의 12개 Fp2 슬롯 중 3개만 비영인 sparse(희소) 구조를 가집니다.
        </p>
        <CodePanel title="Line function → Fp12 매핑" code={`// line function 결과를 Fp12로 매핑
fn line_eval(lambda: Fp2, xt: Fp2, yt: Fp2, p: &G1Affine) -> Fp12 {
    Fp12::new(
        Fp6::new(embed(p.y), Fp2::ZERO, Fp2::ZERO),       // c0
        Fp6::new(
            -(lambda * embed(p.x)),   // w의 상수 계수
            lambda * xt - yt,         // w*v의 계수
            Fp2::ZERO,
        ),                                                  // c1
    )
}`} annotations={[
          { lines: [4, 4], color: 'sky', note: 'Fp 좌표를 Fp2로 임베딩' },
          { lines: [6, 7], color: 'emerald', note: 'sparse 슬롯 (3/12만 비영)' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">NAF (Non-Adjacent Form)</h3>
        <p>
          <code>|6u+2|</code>를 NAF로 표현하면 비영 비트가 약 1/3로 줄어 addition step 횟수가 감소합니다.
          65개 항 중 약 22개만 비영({"{-1, 0, 1}"})이며, 전체 연산량은 약 64 squarings + 88 multiplications입니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Miller Loop 코드</h3>
        <CodePanel title="miller_loop 구현" code={`fn miller_loop(p: &G1Affine, q: &G2Affine) -> Fp12 {
    let mut f = Fp12::ONE;
    let mut t = *q;
    let neg_q = G2Affine::new(q.x, -q.y);

    for i in (0..64).rev() {
        let (new_t, line) = line_double(&t, p);
        t = new_t;
        f = f.square() * line;

        match ATE_NAF[i] {
            1  => { let (nt, l) = line_add(&t, q, p);      t = nt; f = f * l; }
            -1 => { let (nt, l) = line_add(&t, &neg_q, p); t = nt; f = f * l; }
            _  => {}
        }
    }
    // BN correction terms follow
    f
}`} annotations={[
          { lines: [1, 4], color: 'sky', note: '초기화: f=1, T=Q' },
          { lines: [6, 9], color: 'emerald', note: 'doubling step (매 비트)' },
          { lines: [11, 14], color: 'amber', note: 'addition step (NAF 비영 비트)' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">BN Correction Terms</h3>
        <p>
          Optimal Ate에서는 Miller Loop 후 Frobenius 보정이 필요합니다.
          <code>{"T <- T + pi(Q)"}</code>, <code>{"T <- T + (-pi^2(Q))"}</code> 두 addition step을 추가하여
          Tate 페어링과의 동치성을 보장합니다.<br />
          Frobenius <code>{"pi(x,y) = (conj(x)*gamma_11, conj(y)*gamma_21)"}</code>에서
          보정 상수는 <code>{"xi^((p-1)/3)"}</code>과 <code>{"xi^((p-1)/2)"}</code>입니다.
        </p>
      </div>
    </section>
  );
}
