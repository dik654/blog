import ExplainedFormula from "@/components/ui/explained-formula";
import ExecutionViz from "./viz/ExecutionViz";

export default function Execution() {
  return (
    <section id="execution" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Skill이 선택되어도 permission과 완료 판정은 별도로 남는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          실행은 선택→전체 지침 로딩→input·dependency 준비→tool·script 실행→산출물
          검증→handoff 순서로 봅니다. 이때 Skill은 model에게 “어떻게 일할지”를
          알려 줄 뿐 file write, external API, destructive action의 권한을 만들지
          않습니다. Runtime은 caller identity, target scope, approval와 sandbox를
          기존 policy로 검사하고 거부·부분 성공·timeout도 다음 판단이 구분할 수
          있는 observation으로 반환해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ExecutionViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Skill 평가는 두 문제로 나눕니다. 첫째는 필요한 요청에 발동하고 불필요한
          요청에는 발동하지 않았는지 보는 <strong>trigger evaluation</strong>이고,
          둘째는 선택된 뒤 task success·validation·tool error·latency·context cost가
          나아졌는지 보는 workflow evaluation입니다. Trigger가 정확해도 매뉴얼이
          틀릴 수 있고, 좋은 매뉴얼도 routing에서 선택되지 않으면 쓸 수 없습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Skill이 필요한 요청을 놓치는 문제와 불필요한 요청에 끼어드는 문제를 어떻게 나눠 측정할까요?"
        idea={
          <p>
            적용해야 하는 positive request와 적용하면 안 되는 hard negative request를
            먼저 label합니다. 실제로 선택한 결과와 비교해 잘 선택한 TP, 잘못 끼어든
            FP, 놓친 FN을 세면 precision과 recall이 서로 다른 실패를 보여 줍니다.
          </p>
        }
        formula={String.raw`\begin{aligned}
          \mathrm{Precision}_{\mathrm{trigger}}&=\frac{TP}{TP+FP}\\
          \mathrm{Recall}_{\mathrm{trigger}}&=\frac{TP}{TP+FN}
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          \mathrm{Precision}_{\mathrm{trigger}}&=\underbrace{\frac{TP}{TP+FP}}_{\text{기준량당 비율}}\\
          \mathrm{Recall}_{\mathrm{trigger}}&=\underbrace{\frac{TP}{TP+FN}}_{\text{기준량당 비율}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`\frac{TP}{TP+FP}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","적용해야 하는 positive request와 적용하면 안","되는 hard negative request를 먼저","label합니다."] },
          { expression: String.raw`\frac{TP}{TP+FN}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","적용해야 하는 positive request와 적용하면 안","되는 hard negative request를 먼저","label합니다."] },
        ]}
        terms={[
          { symbol: "TP", name: "true positive", description: "Skill을 적용해야 하는 요청에서 실제로 해당 Skill을 선택한 수입니다." },
          { symbol: "FP", name: "false positive", description: "Skill을 적용하면 안 되는 요청인데도 해당 Skill을 선택한 수입니다." },
          { symbol: "FN", name: "false negative", description: "Skill을 적용해야 하지만 후보 누락이나 routing 실패로 선택하지 못한 수입니다." },
        ]}
        assumptions={[
          "각 요청의 적용·비적용 label과 필요한 경우 정답 Skill을 사람이 검토한 rubric으로 먼저 고정합니다.",
          "같은 model·host·Skill version에서 비교하고 표현만 바꾼 paraphrase와 비슷하지만 범위 밖인 hard negative를 포함합니다.",
          "Trigger metric과 별도로 task success·tool error·latency·token·side effect를 측정합니다.",
        ]}
        interpretation="Precision이 낮으면 description이 너무 넓어 다른 요청에 끼어들 가능성이 크고, recall이 낮으면 trigger 문구가 좁거나 후보 목록에서 누락될 수 있습니다. 두 값은 routing을 측정할 뿐 Skill의 산출물 품질을 보장하지 않습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          예를 들어 적용 대상 40건 중 36건을 고르고 비대상 요청에서 6건을 잘못
          골랐다면 precision은 36/42, recall은 36/40입니다. 다음 수정은 무조건
          description을 길게 만드는 것이 아니라 false positive와 false negative
          사례를 읽고 trigger 앞부분과 비적용 경계를 바꾼 뒤 같은 eval set과 새
          regression set에서 다시 비교하는 방식으로 진행합니다.
        </p>
      </div>
    </section>
  );
}
