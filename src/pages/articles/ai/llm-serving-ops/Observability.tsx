import AIOpsViz from './viz/AIOpsViz';
import MetricsPipeline from './MetricsPipeline';
import AIOpsAutomation from './AIOpsAutomation';

export default function Observability() {
  return (
    <section id="observability-aiops" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">관측성 & AIOps</h2>
      <div className="not-prose mb-8"><AIOpsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM 서빙 관측의 핵심 메트릭 3가지:<br />
          <strong>TTFT</strong>(Time To First Token) — 사용자 체감 레이턴시<br />
          <strong>TPS</strong>(Tokens Per Second) — 처리량<br />
          <strong>GPU Memory/Utilization</strong> — 리소스 포화도
        </p>
        <MetricsPipeline />
        <AIOpsAutomation />
      </div>
    </section>
  );
}
