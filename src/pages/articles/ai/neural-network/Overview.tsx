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
        <p className="lead">
          퍼셉트론 하나는 입력 공간을 직선 하나로 나눈다. 그렇다면 직선으로 나눌 수 없는 XOR 같은 문제를 풀려면
          무엇을 바꿔야 할까?
        </p>
        <p>
          첫 번째 변화는 퍼셉트론을 여러 층으로 연결하는 것이다. 그러나 선형 변환만 연속해서 적용하면
          여러 층도 결국 하나의 선형 변환으로 합쳐진다. 층 사이에 sigmoid나 ReLU 같은
          <strong> 비선형 활성화 함수</strong>가 들어가야 앞 층이 만든 경계를 다음 층이 다시 구부릴 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3층 구조는 무엇을 나누는가</h3>
        <p>
          입력층은 값을 받는다. 은닉층은 선형 변환과 활성화를 반복하며 새로운 특징을 만든다.
          출력층은 그 특징을 분류 확률이나 회귀값으로 바꾼다. 아래 장면에서는 먼저 값이 어디서 들어오고,
          각 층이 무엇을 추가해 최종 출력까지 전달하는지 순서대로 본다.
        </p>
      </div>
      <div className="not-prose mt-8">
        <NetworkLayersViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p>
          층의 수보다 중요한 것은 <strong>각 층이 이전 표현을 어떤 새 표현으로 바꾸는가</strong>다.
          입력은 그대로 전달되지만 은닉층부터는 가중합과 활성화가 결합되고, 출력층은 태스크에 맞는 해석을 붙인다.
        </p>
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
