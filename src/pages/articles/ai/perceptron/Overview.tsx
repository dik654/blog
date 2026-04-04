import PerceptronViz from './viz/PerceptronViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">퍼셉트론이란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>퍼셉트론(Perceptron, 단층 인공 뉴런)</strong> — 1957년 Frank Rosenblatt이 제안한 가장 단순한 인공 뉴런<br />
          입력(x)에 가중치(w)를 곱하고 편향(b)을 더한 뒤, 임계값 함수를 통과시켜 0 또는 1을 출력<br />
          모든 신경망의 기본 단위
        </p>
        <div className="rounded-lg border p-4 font-mono text-sm mb-6">
          y = 1 if (w₁x₁ + w₂x₂ + b {'>'} 0), else 0
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">생물학적 뉴런과의 유사성</h3>
        <p>
          생물학적 뉴런: 수상돌기(입력) → 세포체(합산) → 축삭(출력)<br />
          퍼셉트론: 입력 × 가중치 → 가중합 + 편향 → 활성화 함수 → 출력<br />
          시냅스의 강도 = 가중치. 학습 = 가중치 조정
        </p>
      </div>
      <div className="mt-8">
        <PerceptronViz />
      </div>
    </section>
  );
}
