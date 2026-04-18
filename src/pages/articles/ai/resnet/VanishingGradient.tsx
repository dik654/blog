import StepViz from '@/components/ui/step-viz';
import GradientBarViz from './viz/GradientBarViz';
import { gradientSteps } from './VanishingGradientData';
import GradientDetailViz from './viz/GradientDetailViz';
import M from '@/components/ui/math';

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
        <M display>{'g_L = g_{\\text{final}} \\times \\underbrace{(\\sigma\'(z) \\cdot w)^L}_{r^L} = (0.25 \\times 0.1)^L = 0.025^L'}</M>
      </div>
      <div className="not-prose my-6">
        <GradientDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: 3층만에 기울기가 <strong>320배 감소</strong> — sigmoid 미분값 최대 0.25가 원인.<br />
          요약 2: 100층이면 <strong>10^-161배</strong> 감쇠 — 완전히 학습 불가능한 수치.<br />
          요약 3: ReLU·BatchNorm·초기화로 완화하지만, <strong>근본 해결은 Skip connection</strong>.
        </p>
      </div>
    </section>
  );
}
