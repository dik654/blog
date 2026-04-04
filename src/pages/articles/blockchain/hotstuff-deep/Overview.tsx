import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff 체인 투표 & 선형 통신</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          HotStuff(Yin et al., 2019) — PBFT의 O(n²)/O(n³) 병목을 O(n)으로 개선.<br />
          Threshold Signature + Star topology로 선형 통신 달성.<br />
          Chained HotStuff는 단계를 파이프라인화하여 처리량 극대화
        </p>
        <p>
          이 아티클에서는 기본 HotStuff → 체인 HotStuff → 리더 교체 안전성,<br />
          그리고 응답성(Responsiveness) 개념을 심층 분석
        </p>
      </div>
    </section>
  );
}
