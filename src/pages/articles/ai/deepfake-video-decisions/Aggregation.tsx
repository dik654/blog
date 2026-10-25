import ExplainedFormula from "@/components/ui/explained-formula";
import AggregationTraceViz from "./viz/AggregationTraceViz";

export default function Aggregation() {
  return (
    <section id="aggregation" data-teach-level="4" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 여섯 점수를 합치는 규칙만 바꿔 봅니다</h2>
      <AggregationTraceViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          유효 점수는 0.12·0.18·0.35·0.82·0.76·0.14입니다. 모두 평균하면 짧은 강한
          구간이 낮은 값에 희석되어 0.395가 됩니다. 가장 큰 값만 보면 0.82지만 한 번의
          잘못된 급등에도 민감합니다. 상위 두 개 평균은 0.82와 0.76을 사용해 0.79가
          됩니다.
        </p>
        <p>
          어느 규칙이 맞는지는 조작 흔적이 시간에 어떻게 나타난다고 가정하는지에 달려
          있습니다. 그래서 결과를 본 뒤 유리한 규칙을 고르지 않고, 검증 자료에서 규칙과
          <code>k</code>를 정한 다음 시험 자료에는 그대로 적용해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="clip-042의 여섯 점수에서 평균·최댓값·상위 두 개 평균은 각각 얼마인가요?"
        idea={<>모든 값을 더해 여섯으로 나누고, 가장 큰 값 하나와 큰 값 두 개의 평균을 따로 계산합니다.</>}
        formula={String.raw`m=2.37/6=0.395,\quad x_{\max}=0.82,\quad t_2=(0.82+0.76)/2=0.79`}
        annotatedFormula={String.raw`\begin{aligned}
S&=\underbrace{0.12+0.18+0.35+0.82+0.76+0.14}_{\text{유효한 여섯 점수}}=2.37,\\
m&=\underbrace{2.37/6}_{\text{전체 합}/\text{유효 점수 수}}=0.395,\\
x_{\max}&=\underbrace{0.82}_{\text{가장 큰 한 값}},\\
t_2&=\underbrace{(0.82+0.76)/2}_{\text{가장 큰 두 값의 평균}}=0.79.
\end{aligned}`}
        operations={[
          { expression: String.raw`2.37/6`, annotation: ["여섯 점수를 모두 더해 유효 점수 수로 나눔", "전체 평균 0.395"] },
          { expression: String.raw`0.82`, annotation: ["가장 큰 값 하나만 선택", "최댓값 0.82"] },
          { expression: String.raw`(0.82+0.76)/2`, annotation: ["큰 값 두 개를 선택해 평균", "상위 두 개 평균 0.79"] },
        ]}
        terms={[
          { symbol: "m", name: "전체 평균", description: "유효한 모든 프레임 점수를 같은 비중으로 합친 값입니다." },
          { symbol: "xmax", name: "최댓값", description: "영상에서 가장 큰 프레임 점수 하나입니다." },
          { symbol: "t₂", name: "상위 두 개 평균", description: "큰 값부터 두 개만 골라 평균한 영상 원점수입니다." },
        ]}
        assumptions={[
          "여섯 점수는 같은 clip-042와 같은 모델·점수 방향에서 나옵니다.",
          "전처리에 실패한 네 시각에는 0점이나 보간값을 넣지 않습니다.",
          "집계 규칙과 k는 시험 결과를 보기 전에 검증 자료에서 고정합니다.",
        ]}
        interpretation="같은 프레임 점수도 집계 규칙에 따라 0.395·0.82·0.79가 됩니다. 이 차이는 모델 구조가 아니라 영상 판정 계약의 차이입니다."
      />
    </section>
  );
}
