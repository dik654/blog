import MultilayerViz from './viz/MultilayerViz';
import CoordinateRemapViz from './viz/CoordinateRemapViz';
import ReLUTruthTableViz from './viz/ReLUTruthTableViz';
import LinearCollapseViz from './viz/LinearCollapseViz';
import ActivationCompareViz from './viz/ActivationCompareViz';
import DepthVsWidthViz from './viz/DepthVsWidthViz';
import ModernMLPViz from './viz/ModernMLPViz';

export default function Multilayer() {
  return (
    <section id="multilayer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다층 퍼셉트론</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        층을 2개 쌓으면 XOR 해결 가능 — 은닉층이 비선형 경계를 학습한다.
      </p>
      <MultilayerViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">은닉층이 하는 일 — 좌표 재배치</h3>
        <p>
          단층 퍼셉트론이 XOR을 못 푼 이유: 입력 4점을 한 직선으로 가를 수 없음<br />
          은닉층 2뉴런으로 <strong>입력 공간을 새 좌표계로 변환</strong>하면 분리선이 생김<br />
          "XOR이 비선형"이라는 말은 원본 좌표 기준일 뿐 — 적절한 중간 표현에선 선형 문제로 바뀜
        </p>
      </div>
      <CoordinateRemapViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">ReLU로 XOR 만들기 — 구체적 계산</h3>
        <p>
          가장 단순한 2뉴런 구성: <code>h₁ = ReLU(x₁+x₂−0.5)</code>, <code>h₂ = ReLU(x₁+x₂−1.5)</code>, <code>y = h₁ − 2·h₂</code><br />
          핵심 구조 — <strong>"OR에서 AND를 빼면 XOR"이라는 논리 대수의 기하학적 번역</strong><br />
          은닉층이 논리 게이트를 암묵적으로 학습하고, 출력층이 그것들을 조합
        </p>
      </div>
      <ReLUTruthTableViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">비선형성이 필수인 이유</h3>
        <p>
          활성화 함수(ReLU 등)를 빼면 수학적으로 증명됨 — <strong>아무리 층을 쌓아도 단일 선형 변환으로 붕괴</strong><br />
          XOR 같은 비선형 문제는 여전히 못 풂 — 활성화 함수가 각 층마다 좌표를 "접어(fold)" 비선형 경계를 만듦
        </p>
      </div>
      <LinearCollapseViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Universal Approximation Theorem (1989)</h3>
        <p>
          Cybenko·Hornik 증명: <strong>은닉층 1개 + 비다항식 활성화 MLP</strong>는 임의의 연속 함수를 원하는 정밀도로 근사 가능<br />
          직관: 은닉 뉴런 N개가 각각 작은 "범프(bump)"를 만들고, 출력층이 그것들을 합성해 함수 곡선을 타일링<br />
          N을 늘리면 해상도가 올라감 — 이론적으로는 1 은닉층으로 충분
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">그런데 왜 깊게 쌓는가?</h3>
        <p>
          정리의 허점: <em>필요한 뉴런 수 N이 지수적으로 폭발</em><br />
          같은 함수를 얕은 망은 폭 2ⁿ, 깊은 망은 층수 n으로 표현 가능<br />
          계층적 특징: 낮은 층(엣지) → 중간 층(도형) → 높은 층(객체) — 각 층이 아래 층의 조합이므로 표현력 기하급수적
        </p>
      </div>
      <DepthVsWidthViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Forward Propagation — 수식</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// l번째 층의 계산 (벡터화)
z^(l) = W^(l) · a^(l-1) + b^(l)    // 선형 변환
a^(l) = activation(z^(l))          // 비선형 활성화

// W^(l): 가중치 행렬 [다음_층_크기 × 현재_층_크기]
// b^(l): 편향 벡터
// a^(l-1): 이전 층 출력 (a^(0) = 입력 x)`}
        </pre>
        <p>
          선형 <code>W·a + b</code>와 비선형 <code>activation</code>의 교대 — <strong>이 쌍이 MLP의 최소 반복 단위</strong>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">활성화 함수 비교</h3>
        <p>
          각 함수의 출력 범위·기울기·단점이 곡선 형태에 그대로 드러남
        </p>
      </div>
      <ActivationCompareViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">현대 아키텍처 속 MLP</h3>
        <p>
          MLP는 옛날 개념이 아님 — 현대 모델도 내부에서 MLP를 쌓고 조합하고 게이팅
        </p>
      </div>
      <ModernMLPViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">MLP의 한계 — 왜 CNN·RNN·Transformer가 나왔나</h3>
        <p>
          <strong>파라미터 과다</strong>: 완전 연결 — 입력 크기 × 뉴런 수만큼 가중치<br />
          <strong>귀납 편향 부재</strong>: 이미지의 공간 구조·시계열의 순서 구조를 "모름" — 학습으로 처음부터 배워야 함<br /><br />
          해결책: CNN(가중치 공유 + 국소성), RNN(순차 처리 + 메모리), Transformer(attention + position encoding)<br />
          그러나 이들 내부에도 결국 MLP가 들어감 — <strong>MLP는 범용 계산기, 특수 구조는 효율적 경로</strong>
        </p>
      </div>
    </section>
  );
}
