import ExplainedFormula from "@/components/ui/explained-formula";
import IterationViz from "./viz/IterationViz";

export default function Iteration() {
  return (
    <section id="iteration" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        실험은 “무엇을 바꿀까”가 아니라 “어떤 실패가 줄어들면 채택할까”로 시작합니다
      </h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          각 run에는 관찰한 오류 slice, 원인 가설, 한 가지 변경, 예상되는 metric 변화와 비용, 채택 기준을 실행 전에 적습니다.
          Feature·loss·model·data를 동시에 바꾸면 점수 변화의 원인을 분리할 수 없으므로 baseline에서 한 축만 수정하고 같은 fold,
          metric, seed policy와 budget으로 비교합니다.
        </p>
        <p>
          전체 평균만 보면 한 fold나 다수 group의 이득이 중요한 minority group의 악화를 가릴 수 있습니다. 각 fold의 동일 행에서
          baseline과 candidate를 비교한 paired delta를 남기고, 중요한 slice·latency·memory도 같은 방향으로 표에 추가합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Candidate의 작은 개선이 특정 fold의 우연인지 여러 fold에서 반복되는 변화인지 어떻게 요약할까요?"
        idea={
          <>
            같은 fold에서 candidate와 baseline score를 빼 delta를 만든 뒤 평균과 표준오차를 함께 봅니다. Metric이 작을수록 좋은
            경우에는 부호를 반대로 정의해 항상 양수가 개선을 뜻하게 맞춥니다.
          </>
        }
        formula={String.raw`\delta_k=s_k^{\mathrm{cand}}-s_k^{\mathrm{base}},\qquad \bar\delta=\frac{1}{K}\sum_{k=1}^{K}\delta_k,\qquad \operatorname{SE}(\bar\delta)=\frac{\operatorname{sd}(\delta_1,\ldots,\delta_K)}{\sqrt K}`}
        terms={[
          { symbol: "delta_k", name: "paired fold delta", description: "같은 k번째 validation fold에서 candidate와 baseline의 점수 차이입니다." },
          { symbol: "delta-bar", name: "mean improvement", description: "K개 paired delta의 산술평균입니다." },
          { symbol: "sd", name: "sample standard deviation", description: "Fold별 delta가 서로 얼마나 흔들리는지 나타냅니다." },
          { symbol: "SE", name: "standard error", description: "독립 fold를 가정했을 때 평균 delta 추정의 흔들림을 요약합니다." },
        ]}
        assumptions={[
          "두 후보가 정확히 같은 fold·행·metric·weight로 평가되어야 paired 비교가 됩니다.",
          "K-fold의 training sets는 겹치므로 delta_k가 완전히 독립이라는 가정은 정확하지 않습니다. SE를 확정적 유의성 증명으로 쓰지 않습니다.",
          "Fold 수가 작으면 정규 근사보다 fold table·seed 반복·slice 결과를 함께 공개합니다.",
        ]}
        interpretation="평균 delta가 양수여도 한 fold에만 집중되거나 중요한 slice가 악화되면 보류합니다. 작은 일관된 개선과 값싼 복잡도가 큰 한 번의 점프보다 안전할 수 있습니다."
      />

      <div className="not-prose my-8">
        <IterationViz />
      </div>

      <div id="paper-selection-bias" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · On Over-fitting in Model Selection and Subsequent Selection Bias</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          핵심 아이디어는 cross-validation 추정량에도 bias와 variance가 있으며, 그 noisy criterion을 반복 최적화하면 model
          selection 자체가 overfit될 수 있다는 점입니다. 논문은 여러 알고리즘 차이와 맞먹는 성능 왜곡 사례를 보였지만, 특정
          fold 수나 모든 데이터셋의 보편적인 제출 제한 횟수를 제시한 연구는 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.jmlr.org/papers/v11/cawley10a.html" target="_blank" rel="noreferrer">JMLR 논문 해설 경로 보기</a>
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          실패한 실험도 hypothesis, input/config diff, OOF prediction, slice result, 비용과 reject 이유를 남기면 다음 탐색을 줄이는
          지식이 됩니다. Run과 artifact의 자세한 lineage는 <a href="/ai/experiment-tracking">실험 관리 글</a>이 소유합니다.
        </p>
      </div>
    </section>
  );
}
