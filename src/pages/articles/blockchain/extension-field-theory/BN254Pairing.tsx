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
        <Math display>{'\\underbrace{e(aP,\\; bQ)}_{\\text{양변에 스칼라 곱셈}} = \\underbrace{e(P,\\; Q)^{ab}}_{\\text{지수로 옮김 (bilinearity)}}'}</Math>
        <p>
          a, b를 모른 채 aP, bQ만으로 <Math>{'ab'}</Math> 관계를 검증할 수 있다.
          <br />
          Groth16 검증:
        </p>
        <Math display>{'\\underbrace{e(A,\\; B)}_{\\text{좌변 (증명 페어링)}} \\stackrel{?}{=} \\underbrace{e(\\alpha,\\beta)}_{\\text{trusted setup}} \\cdot \\underbrace{e(L,\\gamma)}_{\\text{공개 입력}} \\cdot \\underbrace{e(C,\\delta)}_{\\text{증인}}'}</Math>
      </div>
      <div className="not-prose"><PairingOverviewViz /></div>
    </section>
  );
}
