import LinearVsNonlinearViz from './viz/LinearVsNonlinearViz';
import ActivationRequirementsViz from './viz/ActivationRequirementsViz';
import ActivationTimelineViz from './viz/ActivationTimelineViz';

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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">활성화 함수 필수 요건</h3>
        <p>
          비선형성(필수) + 미분 가능(필수) + 단조성·기울기·계산효율·상한·Zero-centered(선호) 7가지 조건<br />
          Universal Approximation Theorem: 이 조건 충족 시 임의의 연속 함수 근사 가능
        </p>
      </div>
      <ActivationRequirementsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">활성화 함수 진화 타임라인</h3>
        <p>
          Step(1943) → Sigmoid(1958) → Tanh(1986) → ReLU(2010, 혁명) → GELU(2016) → SwiGLU(2020)<br />
          80년 진화 — 각 함수가 이전의 단점을 해결
        </p>
      </div>
      <ActivationTimelineViz />
        <p className="leading-7">
          요약 1: <strong>비선형성</strong>이 신경망의 표현력 원천 — Universal Approximation.<br />
          요약 2: <strong>ReLU의 단순함</strong>이 딥러닝 혁명의 촉매 — 기울기 소실 해결.<br />
          요약 3: 아키텍처별로 <strong>최적 활성화가 다름</strong> — 실험적 선택 필수.
        </p>
      </div>
    </section>
  );
}
