import LoadingViz from './viz/LoadingViz';

export default function Loading() {
  return (
    <section id="loading" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동적 로딩 & 발견</h2>
      <div className="not-prose"><LoadingViz /></div>
    </section>
  );
}
