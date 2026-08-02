import StepViz from '@/components/ui/step-viz';
import SkipPathViz from './viz/SkipPathViz';
import { skipSteps } from './SkipConnectionData';
import SkipDetailViz from './viz/SkipDetailViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function SkipConnection() {
  return (
    <section id="skip-connection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스킵 커넥션 원리</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        y = F(x) + x — 입력을 변환 결과에 직접 더함.<br />
        dy/dx = dF/dx + 1 — identity 미분항이 역전파에 직접 더해져 우회 경로를 만듦.
      </p>
      <div className="not-prose my-8">
        <StepViz steps={skipSteps}>
          {(step) => <SkipPathViz step={step} />}
        </StepViz>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Skip Connection & Block 종류</h3>
        <M display>{'\\underbrace{\\frac{\\partial L}{\\partial x}}_{\\text{입력 기울기}} = \\underbrace{\\frac{\\partial L}{\\partial y}}_{\\text{출력 기울기}} \\cdot \\left( \\underbrace{\\frac{\\partial F}{\\partial x}}_{\\text{conv 경로}} + \\underbrace{1}_{\\text{skip 경로}} \\right)'}</M>
        <FormulaNote
          meaning="역전파 신호는 변환 F를 통과한 경로와 identity 경로에서 온 항의 합. F의 미분이 작을 때 identity 항이 직접 경로를 제공하지만, ∂F/∂x가 -1에 가까우면 두 항이 상쇄될 수 있어 기울기 크기가 최소 1이라고 보장되지는 않음. 다차원에서는 1 대신 항등행렬 I에 해당."
          symbols={[
            ['\\frac{\\partial L}{\\partial y}', '다음 블록에서 현재 출력으로 도착한 기울기'],
            ['\\frac{\\partial F}{\\partial x}', 'residual branch를 통과하는 Jacobian'],
            ['1', 'identity skip 경로의 미분. 벡터 입력에서는 항등행렬 I'],
            ['\\frac{\\partial L}{\\partial x}', '두 경로가 합쳐져 이전 블록으로 전달되는 기울기'],
          ]}
        />
      </div>
      <div className="not-prose my-6">
        <SkipDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <strong>y = F(x) + x</strong>에서 identity 항이 변환 경로와 별개의 직접적인 기울기 경로를 제공.<br />
          요약 2: <strong>Bottleneck</strong> 블록은 1×1 conv로 차원 조절 — 효율·표현력 양립.<br />
          요약 3: F(x)=0이면 identity, 그 위에 잔차만 추가 학습 — <strong>쉬운 최적화</strong>.
        </p>
      </div>
    </section>
  );
}
