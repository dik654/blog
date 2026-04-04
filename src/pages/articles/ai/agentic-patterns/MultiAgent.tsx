import MultiAgentViz from './viz/MultiAgentViz';

export default function MultiAgent() {
  return (
    <section id="multi-agent" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멀티에이전트 패턴</h2>
      <div className="not-prose mb-8"><MultiAgentViz /></div>
    </section>
  );
}
