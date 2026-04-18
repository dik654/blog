import LoadingViz from './viz/LoadingViz';
import LoadingDetailViz from './viz/LoadingDetailViz';

export default function Loading() {
  return (
    <section id="loading" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동적 로딩 &amp; 발견</h2>
      <div className="not-prose"><LoadingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Skill 로딩 메커니즘</h3>
        <div className="not-prose mb-6"><LoadingDetailViz /></div>
        <p className="leading-7">
          Skill Loading: <strong>scan → index → progressive disclosure → lazy load</strong>.<br />
          initial: 50-100 tokens per skill (description only).<br />
          100+ skills 관리 가능 — context 효율적.
        </p>
      </div>
    </section>
  );
}
