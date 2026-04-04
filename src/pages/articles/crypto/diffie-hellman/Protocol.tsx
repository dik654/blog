import DHFlowViz from './viz/DHFlowViz';

export default function Protocol() {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프로토콜 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          공개 파라미터: 소수 p=23, 생성원 g=5.
          <br />
          Alice와 Bob이 각각 비밀 값 a, b를 고르고, 공개 값 A=gᵃ, B=gᵇ를 교환한다.
          <br />
          둘 다 같은 공유 키 K = gᵃᵇ를 계산할 수 있지만,
          도청자는 A와 B만으로 K를 구할 수 없다.
        </p>
      </div>
      <div className="not-prose"><DHFlowViz /></div>
    </section>
  );
}
