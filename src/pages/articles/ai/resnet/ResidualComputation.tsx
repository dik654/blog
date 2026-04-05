import StepViz from '@/components/ui/step-viz';
import GradientCompareViz from './viz/GradientCompareViz';
import { compSteps } from './ResidualComputationData';

export default function ResidualComputation() {
  return (
    <section id="residual-computation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">잔차 신경망 숫자 계산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          동일 조건(3층, w=0.1, x=0.5)에 <strong>스킵 커넥션</strong>을 추가<br />
          순전파: y = sigmoid(w3 x h2) + x = 0.5128 + 0.5 = <strong>1.0128</strong>
        </p>
        <h3>역전파 — 두 경로의 기울기 합산</h3>
        <p>
          dL/dw1 메인 경로: <strong>0.000295</strong> (소실된 기울기)<br />
          dL/dw1 스킵 경로: <strong>0.002729</strong> (직접 전달된 기울기)<br />
          합산: 0.000295 + 0.002729 = <strong>0.003024</strong>
        </p>
        <p>
          일반 네트워크 dL/dw1 = 0.000076<br />
          잔차 네트워크 dL/dw1 = 0.003024<br />
          → <strong>약 40배</strong> 큰 기울기. 앞쪽 층도 효과적으로 학습 가능
        </p>
      </div>
      <div className="not-prose my-8">
        <StepViz steps={compSteps}>
          {(step) => <GradientCompareViz step={step} />}
        </StepViz>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">두 경로 기울기 상세 계산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 3층 + Skip Connection 수치 예시
//
// 순전파:
//   x = 0.5
//   h1 = sigmoid(w1·x) = sigmoid(0.05) = 0.5125
//   h2 = sigmoid(w2·h1) = sigmoid(0.05125) = 0.5128
//   F(x) = sigmoid(w3·h2) = sigmoid(0.05128) = 0.5128
//   y = F(x) + x = 0.5128 + 0.5 = 1.0128
//
// 역전파 경로 1 (메인 - F를 통과):
//   dy/dF = 1
//   dF/dh2 = F·(1-F)·w3 = 0.5128 × 0.4872 × 0.1 = 0.02498
//   dh2/dh1 = h2·(1-h2)·w2 = 0.2498 × 0.1 = 0.02498
//   dh1/dw1 = h1·(1-h1)·x = 0.2498 × 0.5 = 0.1249
//
//   dL/dw1 (메인) = 1 × 0.02498 × 0.02498 × 0.1249 = 7.79e-5
//
// 역전파 경로 2 (Skip - x를 직접):
//   dy/dx = 1  (identity)
//   dL/dx (skip) = 1 × 1 = 1
//
//   그런데 w1은 x를 통하지 않으므로
//   여기서는 skip이 x→y 경로만 확보
//
// w1에 대한 기울기는 메인 경로로만 흐르지만,
// 깊은 네트워크에서는 중간 블록의 skip이 해당 층 기울기 직접 공급

// 실제 ResNet 블록의 경우:
//
// 입력 x_l, 출력 x_{l+1} = x_l + F(x_l, W_l)
//
// 뒷쪽 층에서 기울기 전파:
//   dL/dx_l = dL/dx_{l+1} × (1 + dF/dx_l)
//
// L층 이후:
//   dL/dx_0 = dL/dx_L × ∏_{l=0}^{L-1} (1 + dF_l/dx_l)
//
// 1이 포함되어 있어 지수적 감쇠 방지`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">학습 안정성 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 깊이별 학습 안정성 (SGD with momentum, lr=0.1)
//
// Plain Network (No Skip):
//   ┌────────┬────────────────────────────┐
//   │ 층 수  │  수렴 여부                 │
//   ├────────┼────────────────────────────┤
//   │   10   │  ✓ 수렴                    │
//   │   20   │  ✓ 수렴 (느림)             │
//   │   34   │  ✗ 학습 실패               │
//   │   50+  │  ✗ 학습 완전 실패          │
//   └────────┴────────────────────────────┘
//
// ResNet (With Skip):
//   ┌────────┬────────────────────────────┐
//   │ 층 수  │  수렴 여부                 │
//   ├────────┼────────────────────────────┤
//   │   18   │  ✓ 빠른 수렴               │
//   │   34   │  ✓ 빠른 수렴               │
//   │   50   │  ✓ 수렴                    │
//   │  101   │  ✓ 수렴                    │
//   │  152   │  ✓ 수렴 (최고 성능)        │
//   │  1000+ │  △ 수렴하나 한계           │
//   └────────┴────────────────────────────┘
//
// ResNet의 효과:
//   1. 기울기 소실 완화 (identity shortcut)
//   2. 최적화 난이도 감소
//   3. 손실 평면 매끄러워짐
//   4. 앙상블 효과 (여러 경로 동시 학습)

// "Ensemble of Shallow Networks" 해석 (Veit 2016):
//   n개 residual block이 있는 ResNet
//   → 2^n개 서로 다른 경로 존재
//   → 각 경로는 다른 깊이의 shallow net
//   → ResNet은 암묵적 앙상블
//
// 예: ResNet-152 (50 blocks)
//   2^50 ≈ 10^15 경로 존재
//   (대부분 경로는 매우 짧음)`}
        </pre>
        <p className="leading-7">
          요약 1: Skip connection의 <strong>1+dF/dx</strong>가 기울기 최소 보장.<br />
          요약 2: 34층 이상에서 <strong>Plain은 학습 실패, ResNet은 수렴</strong> — 실험적 검증.<br />
          요약 3: ResNet은 <strong>암묵적 앙상블</strong> — 2^n개 경로의 동시 학습.
        </p>
      </div>
    </section>
  );
}
