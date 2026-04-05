import NetworkLayersViz from './viz/NetworkLayersViz';
import NNCompositionViz from './viz/NNCompositionViz';
import MnistArchViz from './viz/MnistArchViz';
import DesignChoicesViz from './viz/DesignChoicesViz';
import OverfitUnderfitViz from './viz/OverfitUnderfitViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">퍼셉트론에서 신경망으로</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          퍼셉트론(Perceptron) — 입력에 가중치를 곱해 임계값 함수로 0/1 출력<br />
          <strong>신경망</strong> — 임계값 함수 대신 매끄러운 활성화 함수(sigmoid 등)를 사용<br />
          이 차이가 "학습 가능한 모델"을 만드는 핵심
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3층 구조</h3>
        <p>
          <strong>입력층(0층)</strong> — 데이터를 그대로 받는 층. 연산 없음<br />
          <strong>은닉층(1층, 2층)</strong> — 중간에서 특징(Feature)을 추출하는 층<br />
          <strong>출력층(3층)</strong> — 최종 판단을 내리는 층. 분류/회귀 결과 출력
        </p>
        <p>
          핵심 차이: 은닉층이 여러 겹 쌓이면서 복잡한 패턴을 표현 가능<br />
          퍼셉트론은 선형 분리만 가능 → 신경망은 비선형 경계까지 학습
        </p>
      </div>
      <div className="not-prose mt-8">
        <NetworkLayersViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">신경망의 수학적 정의 — 함수 합성</h3>
        <p>
          각 층은 <strong>선형 변환 + 비선형 활성화</strong>의 쌍<br />
          신경망 전체는 이 쌍의 합성 — <code>NN(x) = f⁽ᴸ⁾ ∘ ... ∘ f⁽¹⁾(x)</code>
        </p>
      </div>
      <NNCompositionViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">구체 예시 — MNIST 2층 신경망</h3>
        <p>
          784차원 이미지 → 128 은닉 유닛 → 10 클래스 확률 분포<br />
          파라미터 수 총 101,770개 — 대부분이 첫 층 가중치 행렬(W₁)에 집중
        </p>
      </div>
      <MnistArchViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-1">Universal Approximation Theorem</p>
          <p>
            "단일 은닉층 + 충분한 뉴런 → 임의의 연속 함수 근사 가능"<br />
            이론적 보장은 얕은 망으로 충분 — 그러나 실전에선 <strong>깊이가 너비보다 효율적</strong><br />
            깊은 NN이 compositional 패턴을 더 잘 포착 (ResNet, Transformer가 경험적 증명)
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">신경망 설계 6차원</h3>
        <p>
          깊이·너비·활성화·초기화·정규화·구조 — 각 축마다 태스크에 맞는 값 선택 필요
        </p>
      </div>
      <DesignChoicesViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">과적합 vs 과소적합 — 실전 튜닝의 핵심</h3>
        <p>
          Training loss는 계속 감소하지만 Validation loss는 어느 순간 반등<br />
          <strong>Sweet Spot</strong> — 두 곡선이 벌어지기 직전에 학습 중단해야 일반화 성능 확보
        </p>
      </div>
      <OverfitUnderfitViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: 신경망은 <strong>함수의 합성</strong> — 층마다 선형변환 + 비선형 활성화<br />
          요약 2: <strong>깊이 &gt; 너비</strong> — compositional 구조 학습에 유리<br />
          요약 3: 과적합과 과소적합 사이 균형이 <strong>실전 튜닝의 핵심</strong>
        </p>
      </div>
    </section>
  );
}
