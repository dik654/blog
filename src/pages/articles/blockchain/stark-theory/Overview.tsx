import STARKPropertyViz from './viz/STARKPropertyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">STARK이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Scalable Transparent ARgument of Knowledge &mdash; 해시 함수만으로 동작, trusted setup 불필요.
        </p>
      </div>
      <div className="not-prose"><STARKPropertyViz /></div>
    </section>
  );
}
