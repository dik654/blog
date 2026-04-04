import RSCodingViz from './viz/RSCodingViz';

export default function ReedSolomon() {
  return (
    <section id="reed-solomon">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        Reed-Solomon 코딩
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          데이터를 유한체 위 다항식 계수로 매핑, n개 평가점에서 코드워드 생성. MDS 코드.
        </p>
      </div>
      <div className="not-prose"><RSCodingViz /></div>
    </section>
  );
}
