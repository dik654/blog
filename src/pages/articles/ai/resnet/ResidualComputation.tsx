import StepViz from '@/components/ui/step-viz';
import GradientCompareViz from './viz/GradientCompareViz';
import { compSteps } from './ResidualComputationData';
import ResidualDetailViz from './viz/ResidualDetailViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

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
        <FormulaNote
          meaning="여러 residual block을 지나면 각 블록의 identity Jacobian과 residual Jacobian의 합이 연쇄적으로 곱해진다. residual Jacobian이 0 근처라면 항등 경로가 신호를 보존하기 쉬워지지만, 모든 블록에서 소실이나 폭발이 절대 일어나지 않는다는 보장은 아니다. 행렬 Jacobian에서는 곱의 순서도 중요하다."
          symbols={[
            ['\\frac{\\partial L}{\\partial x_L}', '마지막 블록 출력에서 시작하는 손실 기울기'],
            ['I+\\frac{\\partial F_l}{\\partial x_l}', 'l번째 블록의 identity Jacobian과 residual Jacobian의 합'],
            ['\\prod_{l=0}^{L-1}', '출력 쪽 블록부터 연쇄법칙 순서로 적용되는 Jacobian 곱'],
            ['\\frac{\\partial L}{\\partial x_0}', '첫 블록 입력까지 전달된 최종 기울기'],
          ]}
        />
      </div>
      <div className="not-prose my-6">
        <ResidualDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Skip connection의 <strong>I+dF/dx</strong>가 residual branch와 별개의 직접 경로를 제공.<br />
          요약 2: 34층 이상에서 <strong>Plain은 학습 실패, ResNet은 수렴</strong> — 실험적 검증.<br />
          요약 3: ResNet은 여러 길이의 경로가 공존하는 <strong>경로 관점</strong>으로도 해석할 수 있지만, 독립 모델 2^n개를 그대로 학습하는 것은 아님.
        </p>
      </div>
    </section>
  );
}
