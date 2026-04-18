import StepViz from '@/components/ui/step-viz';
import ErrorCompareViz from './viz/ErrorCompareViz';
import { overviewSteps } from './OverviewData';
import OverviewDetailViz from './viz/OverviewDetailViz';
import M from '@/components/ui/math';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 깊은 신경망이 문제인가</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        ResNet(2015) — 층을 쌓을수록 성능이 떨어지는 역설을 해결.<br />
        56층 plain net이 20층보다 train 에러조차 높음 — 기울기 소실이 원인.
      </p>
      <div className="not-prose my-8">
        <StepViz steps={overviewSteps}>
          {(step) => <ErrorCompareViz step={step} />}
        </StepViz>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Degradation Problem & 깊이별 성능</h3>
        <M display>{'\\underbrace{F(x) = H(x) - x}_{\\text{잔차 학습}} \\quad \\Rightarrow \\quad y = F(x) + x'}</M>
      </div>
      <div className="not-prose my-6">
        <OverviewDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: ResNet 이전 깊은 CNN은 <strong>Degradation Problem</strong>으로 학습 불가.<br />
          요약 2: He et al.의 통찰 — 네트워크가 <strong>잔차 F(x) = H(x) - x</strong>를 학습.<br />
          요약 3: Skip connection은 <strong>Transformer·LLM의 표준 구조</strong>로 확장됨.
        </p>
      </div>
    </section>
  );
}
