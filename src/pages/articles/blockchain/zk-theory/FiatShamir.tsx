import FiatShamirViz from './viz/FiatShamirViz';

export default function FiatShamir() {
  return (
    <section id="fiat-shamir" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fiat-Shamir 변환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Verifier의 랜덤 챌린지를 해시 H(a, stmt)로 대체 &mdash; 비대화형 증명.
          <br />
          모든 SNARK/STARK가 온체인 검증 가능한 이유.
        </p>
      </div>
      <div className="not-prose"><FiatShamirViz /></div>
    </section>
  );
}
