import StepViz from '@/components/ui/step-viz';
import GradientBarViz from './viz/GradientBarViz';
import { gradientSteps } from './VanishingGradientData';

export default function VanishingGradient() {
  return (
    <section id="vanishing-gradient" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기울기 소실 숫자 증명</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        3층 신경망(w=0.1, sigmoid, x=0.5)으로 기울기 소실을 숫자로 확인.<br />
        각 층에서 0.25×0.1=0.025가 곱해져 3층만으로 기울기 1,500배 감소.
      </p>
      <div className="not-prose my-8">
        <StepViz steps={gradientSteps}>
          {(step) => <GradientBarViz step={step} />}
        </StepViz>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">기울기 소실 수치 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 3층 신경망 순전파
//
// 입력 x = 0.5, 가중치 w1 = w2 = w3 = 0.1
//
// Layer 1:
//   z1 = w1·x = 0.1 × 0.5 = 0.05
//   h1 = sigmoid(0.05) = 0.5125
//
// Layer 2:
//   z2 = w2·h1 = 0.1 × 0.5125 = 0.05125
//   h2 = sigmoid(0.05125) = 0.5128
//
// Layer 3:
//   z3 = w3·h2 = 0.1 × 0.5128 = 0.05128
//   y = sigmoid(0.05128) = 0.5128
//
// 역전파 (체인룰):
//   dL/dy = 1  (손실 함수 = y 가정)
//
// Layer 3 gradient:
//   dy/dz3 = sigmoid'(z3) = y(1-y) = 0.5128 × 0.4872 = 0.2498
//   dz3/dh2 = w3 = 0.1
//   dL/dh2 = 0.2498 × 0.1 = 0.02498
//
// Layer 2 gradient:
//   dh2/dz2 = sigmoid'(z2) = 0.2498
//   dz2/dh1 = w2 = 0.1
//   dL/dh1 = 0.02498 × 0.2498 × 0.1 = 0.000624
//
// Layer 1 gradient:
//   dh1/dz1 = sigmoid'(z1) = 0.2498
//   dz1/dw1 = x = 0.5
//   dL/dw1 = 0.000624 × 0.2498 × 0.5 = 0.0000780
//
// 결론:
//   Layer 3 local gradient: 0.02498
//   Layer 1 gradient:       0.0000780
//   비율: 약 1/320 (3층만에 320배 감소)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">깊이별 기울기 감쇠</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 100층 네트워크에서의 기울기 감쇠
//
// 층당 감쇠율 r (sigmoid+작은 가중치):
//   r ≈ sigmoid'(z) × w  ≈ 0.25 × 0.1 = 0.025
//
// L층 이후 기울기:
//   g_L = g_final × r^L
//
// 10층:  0.025^10  ≈ 9.5 × 10^-17
// 50층:  0.025^50  ≈ 8.9 × 10^-81
// 100층: 0.025^100 ≈ 7.9 × 10^-161
//
// → 수치적으로 완전히 0과 같음
// → 앞쪽 층이 전혀 학습되지 않음
//
// 완화 기법 (ResNet 이전):
//   1. ReLU: 기울기가 0 또는 1 (소실 감소)
//   2. Xavier/He 초기화: 층별 분산 유지
//   3. BatchNorm: 활성화값 정규화
//   4. LSTM: 게이트로 기울기 흐름 제어
//
// 그러나 100층+ 네트워크에서는 이조차 부족
// → ResNet의 skip connection이 근본 해결책

// 경사 폭발(Gradient Explosion)도 대칭적 문제:
//   r > 1 이면 기울기 지수 증가
//   100층: 1.1^100 ≈ 13,780
//
// 해결:
//   - Gradient clipping
//   - Weight regularization
//   - 적절한 초기화`}
        </pre>
        <p className="leading-7">
          요약 1: 3층만에 기울기가 <strong>320배 감소</strong> — sigmoid 미분값 최대 0.25가 원인.<br />
          요약 2: 100층이면 <strong>10^-161배</strong> 감쇠 — 완전히 학습 불가능한 수치.<br />
          요약 3: ReLU·BatchNorm·초기화로 완화하지만, <strong>근본 해결은 Skip connection</strong>.
        </p>
      </div>
    </section>
  );
}
