import CooccurrenceViz from './viz/CooccurrenceViz';
import DistributionalDeepViz from './viz/DistributionalDeepViz';

export default function Distributional() {
  return (
    <section id="distributional" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">분포 가설과 동시발생</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        분포 가설 — "비슷한 맥락에 등장하는 단어는 비슷한 의미."<br />
        코퍼스를 윈도우로 훑어 동시발생 횟수를 행렬로 기록한다.
      </p>
      <CooccurrenceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">분포 가설 &amp; 동시발생</h3>
        <div className="not-prose"><DistributionalDeepViz /></div>
        <p className="leading-7">
          분포 가설: <strong>"같은 context = 같은 의미" (Harris 1954)</strong>.<br />
          co-occurrence matrix, PPMI normalize, cosine similarity.<br />
          classical (LSA, SVD) → neural (Word2Vec, GloVe, BERT).
        </p>
      </div>
    </section>
  );
}
