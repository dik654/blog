import TwoDErasureViz from './viz/TwoDErasureViz';

export default function TwoDimensional() {
  return (
    <section id="two-dimensional">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        2D 이레이저 코딩 &amp; DAS
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          k x k 매트릭스에 행/열 독립 RS 코딩 &rarr; 2k x 2k 확장. DAS의 기반 기술.
        </p>
      </div>
      <div className="not-prose"><TwoDErasureViz /></div>
    </section>
  );
}
