import ZKPropertyViz from './viz/ZKPropertyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">완전성 · 건전성 · 영지식성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          영지식 증명(Zero-Knowledge Proof, ZKP) — 비밀을 공개하지 않고 "나는 이 사실을 안다"를 증명하는 암호학적 프로토콜.
          <br />
          세 가지 성질을 동시에 만족해야 유효한 ZKP다.
        </p>
      </div>
      <div className="not-prose"><ZKPropertyViz /></div>
    </section>
  );
}
