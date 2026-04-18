import NeuralViz from './viz/NeuralViz';
import NeuralDeepViz from './viz/NeuralDeepViz';

export default function NeuralApproach() {
  return (
    <section id="neural-approach" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">신경망 기반 접근</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          통계 기반 방법의 근본 한계를 넘기 위해 추론 기반(prediction-based) 방법이 등장했다.
          <br />
          주변 단어로 중심 단어를 "예측"하는 과정에서 임베딩을 학습한다.
        </p>
      </div>
      <div className="not-prose"><NeuralViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Neural Word Embeddings</h3>
        <div className="not-prose"><NeuralDeepViz /></div>
        <p className="leading-7">
          Word2Vec: <strong>CBOW + Skip-gram, negative sampling</strong>.<br />
          GloVe: co-occurrence + neural hybrid.<br />
          FastText: subword, OOV handling.
        </p>
      </div>
    </section>
  );
}
