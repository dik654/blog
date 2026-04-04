import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Mysticeti: Sui 최신 합의</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Mysticeti는 Sui 블록체인의 최신 합의 엔진입니다.<br />
          Narwhal + Bullshark의 증명서 오버헤드를 제거해 지연을 대폭 줄였습니다
        </p>
        <h3>설계 목표</h3>
        <p className="leading-7">
          증명서 없는 DAG(uncertified DAG)로 인증 라운드를 제거합니다.<br />
          소유 객체 트랜잭션은 합의를 우회하는 fast path를 지원합니다.<br />
          💡 결과: Bullshark 대비 커밋 지연 50% 이상 감소
        </p>
      </div>
    </section>
  );
}
