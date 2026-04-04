import LinearVsNonlinearViz from './viz/LinearVsNonlinearViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활성화 함수가 왜 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          신경망의 각 뉴런 — 입력에 가중치를 곱하고 편향을 더하는 <strong>선형 변환</strong><br />
          선형 함수를 아무리 쌓아도 결과는 여전히 선형: f(g(x)) = (w₁·w₂)x + b<br />
          비선형 패턴(XOR, 이미지 경계, 언어 문맥)을 학습할 수 없다
        </p>
        <p>
          <strong>활성화 함수</strong>(Activation Function) — 선형 변환 뒤에 붙는 비선형 함수<br />
          이것 하나로 신경망이 임의의 복잡한 함수를 근사할 수 있게 된다<br />
          (Universal Approximation Theorem, 만능 근사 정리)
        </p>
      </div>
      <div className="not-prose my-8">
        <LinearVsNonlinearViz />
      </div>
    </section>
  );
}
