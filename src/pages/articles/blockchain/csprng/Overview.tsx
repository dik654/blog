import CSPRNGFlowViz from './viz/CSPRNGFlowViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CSPRNG란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          컴퓨터는 결정론적(deterministic) 기계이므로 "진짜 랜덤"을 만들 수 없다.
          <br />
          일반 난수생성기(PRNG)는 시드를 알면 출력을 예측할 수 있어 암호학에서는 치명적이다.
          <br />
          암호학적 난수생성기(CSPRNG)는 출력을 관찰해도 다음 값을 예측할 수 없도록
          설계된 특수한 PRNG로, 모든 암호 프로토콜의 안전성 기반이다.
        </p>
      </div>
      <div className="not-prose"><CSPRNGFlowViz /></div>
    </section>
  );
}
