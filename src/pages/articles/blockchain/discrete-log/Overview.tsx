import DLPCompareViz from './viz/DLPCompareViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">이산로그 문제란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          일반 로그(log)는 연속적인 실수에서 정의되지만,
          이산로그는 유한개의 정수 집합(유한체) 위에서 정의된다 — 그래서 "이산(discrete)"이다.
          <br />
          g<sup>x</sup> ≡ y (mod p)에서 x를 찾는 문제.
          <br />
          정방향(g, x → y)은 반복 제곱법으로 빠르게 계산 가능하지만,
          역방향(g, y → x)은 효율적 알고리즘이 알려져 있지 않다.
          <br />
          이 일방향성이 Diffie-Hellman, Schnorr 서명, ElGamal 등 현대 공개키 암호의 안전성 기반.
        </p>
      </div>
      <div className="not-prose"><DLPCompareViz /></div>
    </section>
  );
}
