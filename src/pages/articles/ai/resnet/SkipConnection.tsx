import StepViz from '@/components/ui/step-viz';
import SkipPathViz from './viz/SkipPathViz';
import { skipSteps } from './SkipConnectionData';
import SkipDetailViz from './viz/SkipDetailViz';
import M from '@/components/ui/math';

export default function SkipConnection() {
  return (
    <section id="skip-connection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스킵 커넥션 원리</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        y = F(x) + x — 입력을 변환 결과에 직접 더함.<br />
        dy/dx = dF/dx + 1 — "+1" 덕분에 기울기가 최소 1 이상 보장.
      </p>
      <div className="not-prose my-8">
        <StepViz steps={skipSteps}>
          {(step) => <SkipPathViz step={step} />}
        </StepViz>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Skip Connection & Block 종류</h3>
        <M display>{'\\underbrace{\\frac{\\partial L}{\\partial x}}_{\\text{입력 기울기}} = \\underbrace{\\frac{\\partial L}{\\partial y}}_{\\text{출력 기울기}} \\cdot \\left( \\underbrace{\\frac{\\partial F}{\\partial x}}_{\\text{conv 경로}} + \\underbrace{1}_{\\text{skip 경로}} \\right)'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          ∂L/∂x = 이 블록의 입력으로 전달되는 기울기<br />
          ∂L/∂y = 다음 블록에서 역전파된 기울기<br />
          ∂F/∂x = conv 층들의 기울기 (0에 가까울 수 있음)<br />
          <strong>+1</strong> = skip 경로의 기울기 — ∂F/∂x가 0이어도 기울기가 최소 ∂L/∂y만큼 보장
        </p>
      </div>
      <div className="not-prose my-6">
        <SkipDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <strong>y = F(x) + x</strong>가 skip connection의 전부 — "+1"이 기울기 고속도로.<br />
          요약 2: <strong>Bottleneck</strong> 블록은 1×1 conv로 차원 조절 — 효율·표현력 양립.<br />
          요약 3: F(x)=0이면 identity, 그 위에 잔차만 추가 학습 — <strong>쉬운 최적화</strong>.
        </p>
      </div>
    </section>
  );
}
