import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PBFT 3단계 프로토콜 심층</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PBFT(Castro &amp; Liskov, 1999) — 최초의 실용적 BFT 프로토콜.<br />
          Pre-prepare → Prepare → Commit 3단계로 합의를 달성.<br />
          이 아티클에서는 각 단계의 메시지 구조, View Change,<br />
          체크포인트 & 로그 정리, O(n²) 병목을 심층 분석
        </p>
      </div>
    </section>
  );
}
