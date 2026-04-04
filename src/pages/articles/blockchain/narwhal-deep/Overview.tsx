import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Narwhal DAG 멤풀 심층</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Narwhal(Danezis et al., EuroSys 2022) — DAG 기반 멤풀 프로토콜.<br />
          모든 검증자가 동시에 TX 배치를 제안하여 병렬 처리량 극대화.<br />
          합의와 데이터 전파를 분리 — "가용성 먼저, 순서는 나중에"
        </p>
        <p>
          이 아티클에서는 라운드 기반 DAG 구조, 증명서 메커니즘,<br />
          가용성 보장의 원리를 심층 분석
        </p>
      </div>
    </section>
  );
}
