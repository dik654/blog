import StepViz from '@/components/ui/step-viz';
import ErrorCompareViz from './viz/ErrorCompareViz';
import { overviewSteps } from './OverviewData';

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
    </section>
  );
}
