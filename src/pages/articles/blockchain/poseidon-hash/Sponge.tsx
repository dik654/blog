import SpongeViz from './viz/SpongeViz';

export default function Sponge() {
  return (
    <section id="sponge" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sponge 구성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          가변 길이 입력 처리 &mdash; rate(흡수) + capacity(보안) 분할. BN254에서 127-bit 보안.
        </p>
      </div>
      <div className="not-prose"><SpongeViz /></div>
    </section>
  );
}
