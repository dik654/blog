import TanhViz from './viz/TanhViz';
import TanhDetailViz from './viz/TanhDetailViz';
import LSTMGateViz from './viz/LSTMGateViz';

export default function Tanh() {
  return (
    <section id="tanh" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">하이퍼볼릭 탄젠트 (Tanh)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sigmoid의 <strong>non-zero centered 문제를 해결</strong><br />
          출력 범위가 −1 ~ +1 → 양수와 음수를 모두 출력<br />
          가중치 업데이트가 자유로운 방향으로 이동 가능
        </p>
        <div className="rounded-lg border p-3 font-mono text-sm mb-4">
          tanh(x) = (e<sup>x</sup> − e<sup>−x</sup>) / (e<sup>x</sup> + e<sup>−x</sup>)
          &nbsp;&nbsp;|&nbsp;&nbsp;
          tanh'(x) = 1 − tanh(x)<sup>2</sup>
        </div>
        <p>
          tanh = 2σ(2x) − 1 — sigmoid를 수직·수평 이동한 형태<br />
          tanh'(0) = 1 → sigmoid(0.25)보다 4배 큰 최대 기울기
        </p>
        <p>
          <strong>여전히 남은 문제</strong> — Vanishing Gradient<br />
          |x| &gt; 2 영역에서 기울기가 급격히 0에 수렴<br />
          깊은 네트워크에서 여전히 기울기 소실 발생<br />
          RNN/LSTM에서는 여전히 기본 활성화 함수로 사용
        </p>
      </div>
      <div className="not-prose my-8">
        <TanhViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Tanh 특성과 Sigmoid 관계</h3>
        <p>
          tanh는 sigmoid를 수직·수평 이동한 형태 — tanh(x) = 2σ(2x) − 1<br />
          zero-centered 출력과 4배 큰 기울기가 핵심 장점
        </p>
      </div>
      <TanhDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM에서 Tanh 역할</h3>
        <p>
          LSTM/GRU에서 <strong>Sigmoid는 gate(0~1 밸브), Tanh는 candidate(−1~1 값)</strong>으로 역할 분담<br />
          RNN의 tanh는 Transformer(2017) 등장 전까지 시퀀스 모델의 핵심이었음
        </p>
      </div>
      <LSTMGateViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <strong>tanh = 2·sigmoid(2x) - 1</strong> — 수학적으로 동치 변환.<br />
          요약 2: <strong>zero-centered + 4배 기울기</strong>로 sigmoid보다 우수.<br />
          요약 3: LSTM/GRU에서 <strong>sigmoid(gate) + tanh(candidate)</strong> 조합 필수.
        </p>
      </div>
    </section>
  );
}
