import StepViz from '@/components/ui/step-viz';
import GradientBarViz from './viz/GradientBarViz';
import { gradientSteps } from './VanishingGradientData';
import GradientDetailViz from './viz/GradientDetailViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

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
        <FormulaNote
          meaning="연쇄법칙에서는 뒤층의 기울기에 각 층의 국소 미분을 차례로 곱한다. 이 예시는 모든 층의 sigmoid 미분을 최대값 0.25, 가중치를 0.1로 같게 둔 단순한 수치 실험이다. 실제 네트워크의 값은 층마다 다르며, 이 식은 일반적인 상한이나 ResNet degradation의 유일한 원인이라는 증명이 아니다."
          symbols={[
            ['g_{\\mathrm{final}}', '손실에서 마지막 층으로 처음 들어오는 기울기'],
            ["\\sigma'(z)", 'sigmoid 활성화의 국소 미분값'],
            ['w', '현재 경로에 곱해지는 층의 가중치'],
            ['L', '연쇄적으로 통과하는 층 수'],
            ['0.025^L', '이 예시 가정에서 깊이에 따라 지수적으로 작아지는 비율'],
          ]}
        />
      </div>
      <div className="not-prose my-6">
        <GradientDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: 3층만에 기울기가 <strong>320배 감소</strong> — sigmoid 미분값 최대 0.25가 원인.<br />
          요약 2: 100층이면 <strong>10^-161배</strong> 감쇠 — 완전히 학습 불가능한 수치.<br />
          요약 3: ReLU·정규화·초기화와 skip connection은 서로 다른 방식으로 깊은 모델의 최적화를 개선함.
        </p>
      </div>
    </section>
  );
}
