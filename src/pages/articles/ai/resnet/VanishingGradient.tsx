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
    </section>
  );
}
