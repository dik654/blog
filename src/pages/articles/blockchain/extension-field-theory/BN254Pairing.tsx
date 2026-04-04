import Math from '@/components/ui/math';
import PairingOverviewViz from './viz/PairingOverviewViz';

export default function BN254Pairing() {
  return (
    <section id="bn254-pairing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BN254 활용: G2 & 페어링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          페어링(pairing) = 서로 다른 두 군의 점을 입력받아 하나의 값을 출력하는 함수.
          <br />
          BN254 기준: <Math>{'e: G_1 \\times G_2 \\to G_T'}</Math>.
        </p>
        <p>
          핵심 성질 — <strong>양선형성</strong>:
        </p>
        <Math display>{'e(aP,\\; bQ) = e(P,\\; Q)^{ab}'}</Math>
        <p>
          a, b를 모른 채 aP, bQ만으로 <Math>{'ab'}</Math> 관계를 검증할 수 있다.
          <br />
          Groth16 검증:
        </p>
        <Math display>{'e(A,\\; B) \\stackrel{?}{=} e(\\alpha,\\beta) \\cdot e(L,\\gamma) \\cdot e(C,\\delta)'}</Math>
      </div>
      <div className="not-prose"><PairingOverviewViz /></div>
    </section>
  );
}
