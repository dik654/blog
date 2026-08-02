import MathText from '@/components/ui/math-text';
import M from '@/components/ui/math';
import InputEmbeddingScene from './viz/InputEmbeddingScene';
import InputEmbDetailScene from './viz/InputEmbDetailScene';

export default function InputEmbedding() {
  return (
    <MathText id="input-embedding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">입력 임베딩 + 위치 인코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          token embedding $E[token]$ 은 단어의 의미만 담는다<br />
          attention은 모든 위치를 동시에 비교하므로 “첫 번째 학생”과 “세 번째 학생”을 자동으로 구분하지 못한다<br />
          같은 차원의 위치 벡터 $P$ 를 더해 최종 입력 $X=E[token]+P$ 를 만든다
        </p>
      </div>

      <InputEmbeddingScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>위치 인코딩 공식</h3>
        <div className="rounded-lg border p-3 font-mono text-sm space-y-1 mb-4">
          <div>PE(pos, 2i) = sin(pos / 10000<sup>2i/d_model</sup>)</div>
          <div>PE(pos, 2i+1) = cos(pos / 10000<sup>2i/d_model</sup>)</div>
        </div>
        <p>
          짝수 차원은 sin, 홀수 차원은 cos를 쓴다<br />
          낮은 차원은 빠르게 변하고 높은 차원은 천천히 변한다<br />
          여러 주파수를 섞으면 각 위치가 고유한 패턴을 갖고, 가까운 위치의 관계도 내적에서 드러난다
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
      <div className="not-prose my-8"><InputEmbDetailScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: 입력 행렬은 token 의미 $E[token]$ 과 위치 $P$ 의 합.<br />
          요약 2: sin/cos는 차원별 주파수를 달리해 위치마다 다른 패턴을 만든다.<br />
          요약 3: 현대 LLM은 score 안에 상대 위치가 드러나는 RoPE 계열을 주로 쓴다.
        </p>
      </div>
    </MathText>
  );
}
