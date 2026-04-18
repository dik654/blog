import StepViz from '@/components/ui/step-viz';
import GradientCompareViz from './viz/GradientCompareViz';
import { compSteps } from './ResidualComputationData';
import ResidualDetailViz from './viz/ResidualDetailViz';
import M from '@/components/ui/math';

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
        <h3 className="text-xl font-semibold mt-6 mb-3">두 경로 기울기 & 학습 안정성</h3>
        <M display>{'\\underbrace{\\frac{\\partial L}{\\partial x_0}}_{\\text{첫 층 기울기}} = \\underbrace{\\frac{\\partial L}{\\partial x_L}}_{\\text{출력 기울기}} \\times \\prod_{l=0}^{L-1} \\left( \\underbrace{1}_{\\text{skip 경로}} + \\underbrace{\\frac{\\partial F_l}{\\partial x_l}}_{\\text{conv 경로}} \\right)'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          ∂L/∂x<sub>0</sub> = 첫 번째 층까지 전달되는 기울기 (이 값이 0이면 학습 불가)<br />
          ∂L/∂x<sub>L</sub> = 마지막 출력층의 기울기 (Loss에서 직접 계산)<br />
          각 층마다 <strong>(1 + ∂F/∂x)</strong>를 곱함 — conv 기울기(∂F/∂x)가 0이 되어도 skip의 1이 남아 기울기 소실 방지
        </p>
      </div>
      <div className="not-prose my-6">
        <ResidualDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Skip connection의 <strong>1+dF/dx</strong>가 기울기 최소 보장.<br />
          요약 2: 34층 이상에서 <strong>Plain은 학습 실패, ResNet은 수렴</strong> — 실험적 검증.<br />
          요약 3: ResNet은 <strong>암묵적 앙상블</strong> — 2^n개 경로의 동시 학습.
        </p>
      </div>
    </section>
  );
}
