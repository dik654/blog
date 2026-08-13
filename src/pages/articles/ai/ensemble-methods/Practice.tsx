import ExplainedFormula from "@/components/ui/explained-formula";
import PracticeViz from "./viz/PracticeViz";

export default function Practice() {
  return (
    <section id="practice" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">새 모델은 단독 점수가 아니라 현재 앙상블에 더하는 OOF 이득과 운영 비용으로 평가합니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          가장 재현 가능한 단일 model에서 시작해 후보 하나를 임시로 추가하고 동일 OOF rows에서 loss 차이를 계산합니다. 가장 큰
          marginal gain을 주는 후보를 채택한 뒤 반복하는 forward selection은 큰 library를 다루는 실용적인 방법입니다. 같은 model을
          여러 번 선택하도록 허용하면 선택 횟수가 정수 weight가 되지만, 반복 탐색은 OOF noise에도 맞출 수 있어 ensemble size와
          stopping rule을 제한해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="현재 앙상블 E에 후보 j를 추가할 실질적인 이유를 어떤 paired quantity로 볼 수 있을까요?"
        idea={<>같은 OOF 행에서 현재 ensemble loss와 후보를 더한 ensemble loss를 빼 개선량을 구하고, 추가 latency·memory와 함께 봅니다.</>}
        formula={String.raw`\Delta_j=\widehat R_{\mathrm{OOF}}(E)-\widehat R_{\mathrm{OOF}}(E\oplus j),\qquad C_j=(\Delta p95_j,\Delta\mathrm{memory}_j,\Delta\mathrm{ops}_j)`}
        terms={[
          { symbol: "E", name: "current ensemble", description: "이미 채택된 base models와 고정 결합 규칙입니다." },
          { symbol: "E plus j", name: "candidate extension", description: "후보 j를 같은 결합 규칙으로 임시 추가한 ensemble입니다." },
          { symbol: "Delta_j", name: "paired marginal gain", description: "같은 OOF rows에서 후보 추가 전후 loss가 얼마나 감소했는지 나타냅니다." },
          { symbol: "C_j", name: "incremental serving cost", description: "후보 하나가 늘리는 p95 latency·resident memory·운영 복잡도입니다." },
        ]}
        assumptions={[
          "두 ensemble은 같은 OOF manifest·row weights·metric fixture에서 비교합니다.",
          "Gain의 fold·seed·slice 일관성과 최소 실질 개선 δ_min을 사전에 정합니다.",
          "Parallel serving에서는 latency 합산이 단순하지 않으므로 target runtime에서 end-to-end로 측정합니다.",
        ]}
        interpretation="Δ가 양수여도 0.0001에 불과하고 p95가 40ms 늘면 채택하지 않을 수 있습니다. 앙상블은 quality만의 순위표가 아니라 운영 Pareto 문제입니다."
      />

      <div className="not-prose my-8"><PracticeViz /></div>

      <div id="paper-ensemble-selection" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Ensemble Selection from Libraries of Models</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          논문은 여러 algorithm과 hyperparameter로 만든 큰 model library에서 validation metric을 가장 개선하는 model을 forward
          stepwise로 추가하는 방법을 제안했습니다. Accuracy·cross entropy·ROC area 등 목표 metric에 맞춰 선택할 수 있다는 점이
          핵심입니다. 7개 문제와 10개 metric의 실험 결과를 모든 현대 workload의 보장으로 확대하지 않으며, selection set 재사용에
          따른 overfit은 별도 outer evidence로 관리해야 합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1145/1015330.1015432" target="_blank" rel="noreferrer">논문 초록과 출판 정보 보기</a>
      </div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          배포 artifact에는 base model IDs, OOF/test prediction checksum, row/class mapping, transforms, weights 또는 meta checkpoint,
          fold-test aggregation, dependency versions를 묶습니다. 한 base model이 실패했을 때 전체 요청을 실패시킬지 degraded ensemble로
          응답할지도 미리 정해야 합니다. Quality gain이 반복되지 않거나 운영 비용을 정당화하지 못하는 마지막 model에서 멈춥니다.
        </p>
      </div>
    </section>
  );
}
