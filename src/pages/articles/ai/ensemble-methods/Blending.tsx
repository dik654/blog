import ExplainedFormula from "@/components/ui/explained-formula";
import BlendingViz from "./viz/BlendingViz";

export default function Blending() {
  return (
    <section id="blending" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Blending은 계산을 단순하게 만드는 대신, base 학습 데이터와 meta 근거를 나눠 씁니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Blending은 training data에서 별도 holdout을 떼어 냅니다. Base model은 나머지에서 학습하고 그 holdout prediction으로
          combiner를 학습합니다. OOF matrix를 만들 필요가 없어 구현은 단순합니다. 대신 base model은 더 적은 데이터를 보고 meta-model은 한 holdout의
          분포와 seed에 민감해집니다.
        </p>
        <p>
          미래 예측에서 마지막 calibration window가 자연스럽거나 site/group 경계상 meta holdout을 명확히 만들 수 있다면 이 비용이 합리적일 수 있습니다.
          다만 holdout을 보며 base model·window·weight를 반복해서 고르면 그 구간도 search data가 됩니다. 최종 평가는 더 나중 기간이나 별도
          group에서 합니다.
        </p>
        <p>
          예를 들어 마지막 2개월을 blend window로 쓴다면 base model은 그보다 앞선 시점의 feature와 당시 이미 확정된 label만 봅니다. 이 model이 2개월
          구간에 낸 unseen prediction으로 meta-model을 학습하고 window와 weight를 다시 고르지 않은 채 더 나중의 final period에서 평가합니다.
          Entity가 기간을 가로지르면 group 경계도 함께 적용합니다. Artifact에는 base cutoff, label availability cutoff, blend
          시작·종료일, final period와 data revision을 남겨 drift와 label delay를 재현할 수 있게 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="전체 n개 행에서 α 비율을 blend holdout으로 남기면 base와 meta가 각각 몇 행을 보나요?"
        idea={<>겹치지 않는 두 집합으로 나누므로 base fit은 (1−α)n개, combiner fit은 αn개를 사용합니다. α는 두 추정 오차 사이의 직접적인 trade-off입니다.</>}
        formula={String.raw`\begin{aligned}
          D&=D_{\mathrm{base}}\sqcup D_{\mathrm{blend}} \\
          |D_{\mathrm{base}}|&=(1-\alpha)n \\
          |D_{\mathrm{blend}}|&=\alpha n
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          D&=\underbrace{D_{\mathrm{base}}\sqcup D_{\mathrm{blend}}}_{\text{오른쪽 항으로 결과 계산}} \\
          |D_{\mathrm{base}}|&=\underbrace{(1-\alpha)n}_{\text{blend fraction 계산}} \\
          |D_{\mathrm{blend}}|&=\underbrace{\alpha n}_{\text{blend fraction 계산}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`D_{\mathrm{base}}\sqcup D_{\mathrm{blend}}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","겹치지 않는 두 집합으로 나누므로 base fit은","(1−α)n개, combiner fit은 αn개를 사용합니다."] },
          { expression: String.raw`(1-\alpha)n`, annotation: ["blend fraction이(가) 식의 결과에 기여하는 방식을","계산합니다.","겹치지 않는 두 집합으로 나누므로 base fit은","(1−α)n개, combiner fit은 αn개를 사용합니다."] },
          { expression: String.raw`\alpha n`, annotation: ["blend fraction이(가) 식의 결과에 기여하는 방식을","계산합니다.","겹치지 않는 두 집합으로 나누므로 base fit은","(1−α)n개, combiner fit은 αn개를 사용합니다."] },
        ]}
        terms={[
          { symbol: "alpha", name: "blend fraction", description: "전체 개발 데이터 중 combiner 학습 전용으로 남기는 비율입니다." },
          { symbol: "D_base", name: "base training set", description: "Base models의 parameter를 fit하는 행 집합입니다." },
          { symbol: "D_blend", name: "combiner training set", description: "Fit된 base models의 unseen prediction과 target으로 combiner를 fit하는 집합입니다." },
          { symbol: "disjoint union", name: "no row overlap", description: "한 행이 두 집합에 동시에 들어가지 않는다는 뜻입니다." },
        ]}
        assumptions={[
          "Row보다 group/time이 독립 단위라면 해당 단위로 disjoint split합니다.",
          "Preprocessing과 base fit은 blend holdout을 사용하지 않습니다.",
          "α의 선택과 holdout seed도 validation decision이므로 별도 final data가 필요합니다.",
        ]}
        interpretation="n=10,000, α=.2이면 base는 8,000행, combiner는 2,000행을 봅니다. α를 키우면 meta 근거는 늘지만 base learner의 데이터는 줄어듭니다."
      />

      <div className="not-prose my-8"><BlendingViz /></div>
    </section>
  );
}
