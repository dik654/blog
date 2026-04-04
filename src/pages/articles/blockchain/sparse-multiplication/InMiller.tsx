import InMillerViz from './viz/InMillerViz';

export default function InMiller() {
  return (
    <section id="in-miller" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">254회 반복의 누적 효과</h2>
      <div className="not-prose mb-8"><InMillerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Miller Loop는 약 254번 반복한다.<br />
          매 반복마다 f = f² * l(P) 연산이 있으므로,
          sparse 곱셈은 254번 적용된다.
        </p>
        <p>
          Full로 계산하면 254 x 54 = 약 <strong>13,700 Fp곱</strong>이다.<br />
          Sparse로 계산하면 254 x 18 = 약 <strong>4,600 Fp곱</strong>이다.<br />
          절감량은 약 <strong>9,100 Fp곱</strong>이다.
        </p>
        <p>
          전체 페어링 연산(Miller Loop + Final Exp)은 약 20,000 Fp곱이다.
          sparse 곱셈 최적화 하나로 전체의 약 <strong>45%</strong>를 절약한다.
        </p>
        <p>
          twist가 sparse를 만들고, sparse가 페어링을 실용적으로 만든다.<br />
          이 최적화 없이는 ZK-SNARK 검증이 현실적인 시간 내에 불가능하다.
        </p>
      </div>
    </section>
  );
}
