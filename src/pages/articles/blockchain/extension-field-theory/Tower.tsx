import TowerBuildViz from './viz/TowerBuildViz';
import TowerDetailViz from './viz/TowerDetailViz';

export default function Tower() {
  return (
    <section id="tower" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">확장 타워 (Tower Extension)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Fp12를 한 번에 만들면 곱셈 1번에 144회 Fp 곱셈 &mdash;
          대신 Fp &rarr; Fp2 &rarr; Fp6 &rarr; Fp12로 단계별로 쌓는다.
        </p>
      </div>
      <div className="not-prose mb-10"><TowerBuildViz /></div>
      <h3 className="text-xl font-bold mb-4">각 층의 원소 구조와 곱셈</h3>
      <div className="not-prose"><TowerDetailViz /></div>
    </section>
  );
}
