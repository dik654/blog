import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bullshark 순서화 심층</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Bullshark(Spiegelman et al., CCS 2022) — Narwhal DAG 위에서 순서 결정.<br />
          웨이브(2라운드) 단위로 앵커를 선정하고,<br />
          앵커의 인과적 히스토리를 결정론적으로 정렬
        </p>
        <p>
          이 아티클에서는 웨이브 커밋 규칙, 앵커 선택 메커니즘,<br />
          비동기 폴백(Tusk와 비교)을 심층 분석
        </p>
      </div>
    </section>
  );
}
