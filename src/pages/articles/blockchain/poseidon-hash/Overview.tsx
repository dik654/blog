import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Poseidon 해시란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          유한체 산술만 사용하는 ZK-friendly 해시 &mdash; SHA-256 대비 100배 효율.
          <br />
          Sponge + HADES 전략의 SPN 구조.
        </p>
      </div>
      <div className="not-prose"><OverviewViz /></div>
    </section>
  );
}
