import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff-2 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          HotStuff-2(Malkhi &amp; Nayak, 2023) — HotStuff의 3단계를 2단계로 축소.<br />
          timeout-certificate(TC) 도입으로 Pre-Commit 단계 제거.<br />
          O(n) 선형 통신을 유지하면서 최적 지연(4 message delays) 달성
        </p>
        <p>
          이 아티클에서는 2단계 프로토콜의 핵심 아이디어,<br />
          TC 메커니즘, 낙관적 응답성을 분석
        </p>
      </div>
    </section>
  );
}
