import ExplainedFormula from "@/components/ui/explained-formula";
import EvaluationContractViz from "./viz/EvaluationContractViz";

export default function Evaluation() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Reasoning score는 model만의 숫자가 아닙니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Open-R1은 LightEval과 vLLM으로 AIME, MATH-500, GPQA Diamond와 LiveCodeBench 등을 평가합니다. 다만 checkpoint와 최종
          score만 적어서는 같은 실험이 재현되지 않습니다.
        </p>
        <p className="leading-8">
          Reasoning model은 temperature, max token과 prompt당 sample 수에
          민감합니다. AIME처럼 문항이 적은 benchmark는 repeated sampling에 따른
          variance도 큽니다.
        </p>
        <p className="leading-8">
          Open-R1 README는 DeepSeek-R1 report가 benchmark별 sample 수를 모두 명시하지 않았다고 지적합니다. 그러면서 reproduction에서는
          AIME 64회, MATH-500 4회, GPQA 8회, LiveCodeBench 16회처럼 서로 다른 수를 공개했습니다.
        </p>
        <p className="leading-8">
          따라서 표의 <em>pass@1</em> 추정값을 greedy decoding 한 번의 accuracy와
          같다고 보면 안 됩니다. 이 숫자는 공개한 sampling protocol 전체의
          결과입니다.
        </p>
      </div>

      <EvaluationContractViz />

      <ExplainedFormula
        question="Prompt마다 여러 completion을 sampling한 pass@1 추정값은 어떻게 계산하는가?"
        idea={
          <>
            각 problem에서 K개의 독립적인 completion을 sampling하고 verifier가
            맞다고 판정한 indicator를 평균합니다. 이 값은 한 번의 deterministic
            decode가 아니라 해당 sampling distribution의 성공 확률을 Monte
            Carlo로 추정합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
c_{n,k}&=\mathbf 1[V(q_n,o_{n,k})=1]\\
\widehat{\mathrm{pass@1}}&=\frac1{NK}\sum_{n=1}^{N}\sum_{k=1}^{K}c_{n,k}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
c_{n,k}&=\underbrace{\mathbf 1[V(q_n,o_{n,k})=1]}_{\text{sample별 판정 계산}}\\
\widehat{\mathrm{pass@1}}&=\underbrace{\frac1{NK}\sum_{n=1}^{N}\sum_{k=1}^{K}c_{n,k}}_{\text{sample별 판정 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\mathbf 1[V(q_n,o_{n,k})=1]`, annotation: ["sample별 판정이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 problem에서 K개의 독립적인 completion을","sampling하고 verifier가 맞다고 판정한"] },
          { expression: String.raw`\frac1{NK}\sum_{n=1}^{N}\sum_{k=1}^{K}c_{n,k}`, annotation: ["sample별 판정이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 problem에서 K개의 독립적인 completion을","sampling하고 verifier가 맞다고 판정한"] },
        ]}
        terms={[
          {
            symbol: "N",
            name: "problem 수",
            description: "해당 benchmark revision에 포함된 평가 문제 수입니다.",
          },
          {
            symbol: "K",
            name: "samples per problem",
            description:
              "같은 prompt에서 설정한 temperature·top-p로 뽑은 completion 수입니다.",
          },
          {
            symbol: "V",
            name: "evaluation verifier",
            description:
              "Answer parser, math equivalence 또는 code tests로 정답 여부를 판정합니다.",
          },
          {
            symbol: "\\mathbf 1[\\cdot]",
            name: "correct indicator",
            description: "Verifier가 정답으로 판정하면 1, 아니면 0입니다.",
          },
          {
            symbol: "c_{n,k}",
            name: "sample별 판정",
            description:
              "n번째 문제의 k번째 completion이 verifier를 통과했는지 저장한 0/1 값입니다.",
          },
        ]}
        assumptions={[
          "Completion sample이 설정한 policy와 sampling protocol에서 생성됐고 문제별 weighting이 같습니다.",
          "Verifier error와 problem contamination은 이 통계식 밖에서 별도로 audit합니다.",
        ]}
        interpretation="K를 늘리면 추정 variance는 줄일 수 있지만 policy가 바뀌는 것은 아닙니다. Score를 비교할 때 K·temperature·top-p·max token과 verifier를 함께 고정해야 합니다."
      />

      <ExplainedFormula
        question="작은 benchmark의 accuracy uncertainty를 어떻게 함께 표시하는가?"
        idea={
          <>
            독립 Bernoulli 근사를 쓰면 success probability의 표준오차를 대략
            계산할 수 있습니다. 같은 problem의 여러 sample은 cluster
            dependence가 있으므로 실제 보고에서는 problem 단위 bootstrap이 더
            적절할 수 있습니다.
          </>
        }
        formula={String.raw`\operatorname{SE}(\widehat p)\approx\sqrt{\frac{\widehat p(1-\widehat p)}{N_{\mathrm{eff}}}}`}
        annotatedFormula={String.raw`\underbrace{\operatorname{SE}(\widehat p)\approx\sqrt{\frac{\widehat p(1-\widehat p)}{N_{\mathrm{eff}}}}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\operatorname{SE}(\widehat p)\approx\sqrt{\frac{\widehat p(1-\widehat p)}{N_{\mathrm{eff}}}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","독립 Bernoulli 근사를 쓰면 success","probability의 표준오차를 대략 계산할 수 있습니다."] },
        ]}
        terms={[
          {
            symbol: "\\widehat p",
            name: "측정 accuracy",
            description:
              "고정한 sampling·verifier protocol에서 관측한 성공 비율입니다.",
          },
          {
            symbol: "N_{\\mathrm{eff}}",
            name: "effective sample size",
            description: "독립성·반복 구조를 고려한 유효 관측 수입니다.",
          },
          {
            symbol: "\\operatorname{SE}",
            name: "표준오차",
            description:
              "같은 평가를 반복했을 때 추정값이 흔들리는 규모의 근사치입니다.",
          },
        ]}
        assumptions={[
          "단순 식은 독립 Bernoulli 근사이며 같은 problem의 K개 completion correlation을 자동으로 처리하지 않습니다.",
          "정확한 비교에서는 problem-level bootstrap 또는 repeated seed 결과를 사용합니다.",
        ]}
        interpretation="AIME 30문항에서 몇 문제 차이는 큰 폭으로 보일 수 있습니다. 평균 score만 나열하지 말고 repeated run이나 confidence interval과 failure count를 함께 보여 줍니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Accuracy와 reasoning cost를 같은 frontier에서 본다</h3>
        <p className="leading-8">
          Held-out accuracy가 좋아져도 output이 지나치게 길어지거나 invalid answer, verifier timeout과 serving cost가 늘기도 합니다.
        </p>
        <p className="leading-8">
          Problem별 output token, time-to-answer, parse failure와 accuracy를 함께 봅니다. 같은 정확도라면 더 짧고 안정적인 policy를
          구분합니다. Response length 증가를 곧 reasoning capability 증가로 읽지는 않습니다.
        </p>

        <h3>학습 성공과 serving 성공은 별도 검증 단계다</h3>
        <p className="leading-8">
          Training evaluation이 통과한 뒤에도 production chat template, stop
          token, quantization과 runtime이 generation distribution을 바꿀 수
          있습니다.
        </p>
        <p className="leading-8">
          Deployment artifact에서 같은 golden set과 parser를 다시 실행하고 TTFT,
          TPOT와 cost를 측정합니다. Tensor parallel과 scheduler 같은 운영 최적화는
          <a href="/ai/llm-serving-ops">LLM 서빙 운영</a>에서 이어집니다.
        </p>
      </div>

      <div
        id="standard-open-r1-evaluation"
        className="not-prose my-8 scroll-mt-24 border-l border-border pl-4"
      >
        <p className="text-xs font-bold text-foreground">
          공식 구현 · Open-R1 evaluation recipe
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          현재 저장소는 task와 model을 지정해 evaluation을 실행하는 명령과
          LightEval 기반 구성을 제공합니다. 이 명령은 score 비교의 출발점입니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          같은 estimand를 측정하려면 benchmark revision, prompt template, sampling 횟수와 parser를 함께 고정합니다. 공개 score는 해당
          protocol의 결과입니다. Greedy 한 번의 정확도나 production latency를 대신하지는 않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/huggingface/open-r1#evaluating-models"
          target="_blank"
          rel="noreferrer"
        >
          공식 evaluation 명령과 task 구성 보기
        </a>
      </div>
    </section>
  );
}
