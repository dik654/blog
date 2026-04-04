import TanhViz from './viz/TanhViz';

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
    </section>
  );
}
