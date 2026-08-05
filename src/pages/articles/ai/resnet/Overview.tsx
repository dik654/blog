import StepViz from '@/components/ui/step-viz';
import ErrorCompareViz from './viz/ErrorCompareViz';
import { overviewSteps } from './OverviewData';
import OverviewDetailViz from './viz/OverviewDetailViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 깊은 신경망이 문제인가</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        ResNet(2015) — 층을 쌓을수록 성능이 떨어지는 역설을 해결.<br />
        56층 plain net이 20층보다 train 에러조차 높음 — 과적합이 아니라 깊은 모델을 최적화하기 어려운 degradation 문제.
      </p>
      <div className="not-prose my-8">
        <StepViz steps={overviewSteps}>
          {(step) => <ErrorCompareViz step={step} />}
        </StepViz>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Degradation Problem & 깊이별 성능</h3>
        <M display>{'\\underbrace{F(x) = H(x) - x}_{\\text{잔차 학습}} \\quad \\Rightarrow \\quad y = F(x) + x'}</M>
        <FormulaNote
          meaning="블록이 원하는 전체 변환 H(x)를 처음부터 직접 찾는 대신, 입력 x에서 얼마나 바꿔야 하는지인 잔차 F(x)를 학습한다. 입력과 출력의 모양이 같으면 y=F(x)+x이고, 채널 수나 해상도가 달라지면 x 대신 학습 가능한 투영 P(x)를 더한다."
          symbols={[
            ['x', 'residual block에 들어오는 입력'],
            ['H(x)', '블록이 최종적으로 표현하려는 목표 변환'],
            ['F(x)=H(x)-x', '입력에서 목표까지 필요한 변화량'],
            ['y=F(x)+x', '잔차와 identity 경로를 합친 블록 출력'],
          ]}
        />
      </div>
      <div className="not-prose my-6">
        <OverviewDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: ResNet 이전의 더 깊은 plain CNN은 <strong>Degradation Problem</strong> 때문에 추가 깊이의 이점을 얻기 어려웠음.<br />
          요약 2: He et al.의 통찰 — 네트워크가 <strong>잔차 F(x) = H(x) - x</strong>를 학습.<br />
          요약 3: Skip connection은 <strong>Transformer·LLM의 표준 구조</strong>로 확장됨.
        </p>
      </div>
    </section>
  );
}
