import SchnorrViz from './viz/SchnorrViz';
import WhyParamsViz from './viz/WhyParamsViz';
import PohligHellmanViz from './viz/PohligHellmanViz';

export default function SchnorrProtocol() {
  return (
    <section id="schnorr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Schnorr 식별 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Sigma 프로토콜의 가장 단순한 구현 — 이산로그 문제(DLP) 기반.
          <br />
          Ed25519, Schnorr 서명의 이론적 기반.
        </p>
      </div>

      <h3 className="text-lg font-bold mb-4">왜 소수 p, 부분군 위수 q, 생성원 g?</h3>
      <div className="not-prose mb-8"><WhyParamsViz /></div>

      <h3 className="text-lg font-bold mb-4">Pohlig-Hellman 공격</h3>
      <div className="not-prose mb-8"><PohligHellmanViz /></div>

      <h3 className="text-lg font-bold mb-4">수치 예시 (p=23, q=11, x=3)</h3>
      <div className="not-prose"><SchnorrViz /></div>
    </section>
  );
}
