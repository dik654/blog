import SchwartzZippelViz from './viz/SchwartzZippelViz';

export default function SchwartzZippel() {
  return (
    <section id="schwartz-zippel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Schwartz-Zippel 보조정리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          두 다항식이 같은지 랜덤 점에서 확인 — PLONK, STARK 건전성의 기반.
        </p>
      </div>
      <div className="not-prose"><SchwartzZippelViz /></div>
    </section>
  );
}
