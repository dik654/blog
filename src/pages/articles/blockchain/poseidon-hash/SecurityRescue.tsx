import SecurityViz from './viz/SecurityViz';

export default function SecurityRescue() {
  return (
    <section id="security-rescue" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보안 분석 & Rescue 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Full round = 차분/통계 방어, Partial round = 대수/보간 방어.
          <br />
          Rescue는 역방향 S-box가 느려 Poseidon이 실전 채택.
        </p>
      </div>
      <div className="not-prose"><SecurityViz /></div>
    </section>
  );
}
