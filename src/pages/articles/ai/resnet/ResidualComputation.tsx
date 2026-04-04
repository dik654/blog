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
    </section>
  );
}
