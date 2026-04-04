import InputEmbeddingViz from './viz/InputEmbeddingViz';

export default function InputEmbedding() {
  return (
    <section id="input-embedding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">입력 임베딩 + 위치 인코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          임베딩 벡터만으로는 <strong>단어 순서</strong>를 알 수 없다<br />
          Transformer는 RNN과 달리 순차 처리를 하지 않기 때문이다<br />
          sin/cos 함수로 위치 정보를 만들어 더한다
        </p>
      </div>

      <InputEmbeddingViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>위치 인코딩 공식</h3>
        <div className="rounded-lg border p-3 font-mono text-sm space-y-1 mb-4">
          <div>PE(pos, 2i) = sin(pos / 10000<sup>2i/d_model</sup>)</div>
          <div>PE(pos, 2i+1) = cos(pos / 10000<sup>2i/d_model</sup>)</div>
        </div>
        <p>
          짝수 차원은 sin, 홀수 차원은 cos 사용<br />
          pos=위치, i=차원 인덱스, d_model=6<br />
          최종 입력 = 임베딩 벡터 + 위치 인코딩 벡터
        </p>
      </div>
    </section>
  );
}
