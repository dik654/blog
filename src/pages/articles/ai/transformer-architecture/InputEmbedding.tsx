import M from '@/components/ui/math';
import InputEmbeddingViz from './viz/InputEmbeddingViz';
import InputEmbDetailViz from './viz/InputEmbDetailViz';

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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Positional Encoding 설계 원리</h3>
        <p className="leading-7">
          sin/cos 주파수를 차원별로 달리하여 각 위치에 고유한 인코딩을 부여한다.
          저차원은 빠르게 변하고(초침), 고차원은 느리게 변한다(시침).
          PE(pos+k)가 PE(pos)의 선형 변환으로 표현되어 상대 위치 학습이 가능하다.
        </p>
        <M display>{'\\text{PE}(\\text{pos}, 2i) = \\sin\\!\\left(\\frac{\\text{pos}}{\\underbrace{10000^{2i/d_{\\text{model}}}}_{\\text{차원별 주파수}}}\\right), \\quad \\text{PE}(\\text{pos}, 2i{+}1) = \\cos\\!\\left(\\frac{\\text{pos}}{10000^{2i/d_{\\text{model}}}}\\right)'}</M>
      </div>
      <div className="not-prose my-8"><InputEmbDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <strong>sin/cos 주파수 분리</strong>로 각 차원이 다른 시간 스케일 표현.<br />
          요약 2: <strong>최대 길이 제약 없음</strong> - sinusoidal PE가 학습 PE 대비 장점.<br />
          요약 3: LLaMA/GPT-4는 <strong>RoPE (Rotary)</strong>로 진화 — 상대 위치 내장.
        </p>
      </div>
    </section>
  );
}
