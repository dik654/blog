import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import DistillationLearningFlowViz from "./viz/DistillationLearningFlowViz";

export default function SequenceDistillationArticle() {
  return (
    <article>
      <section id="overview" className="mb-16 scroll-mt-20 space-y-7">
        <header>
          <p className="text-sm font-semibold text-primary">
            먼저 vocabulary 불일치를 인정합니다
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Sequence distillation은 teacher text를 provenance가 있는 student
            dataset으로 바꾼다
          </h2>
        </header>
        <p className="text-lg leading-8">
          API teacher처럼 logits를 받을 수 없거나 tokenizer가 다르면 같은
          timestep의 vocabulary distribution을 직접 비교할 수 없습니다.
          Teacher가 생성한 문자열을 student tokenizer로 다시 encode해 supervised
          target으로 쓰되, prompt source부터 filter까지를 dataset construction
          receipt로 남깁니다.
        </p>
        <DistillationLearningFlowViz mode="sequence" />
        <ContentBoundary article="sequence-distillation" />
      </section>
      <section id="sequence-loss" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · retokenize</p>
          <h2 className="mt-2 text-2xl font-bold">
            Teacher 문자열은 student token 경계로 다시 나눈 뒤 response 위치만
            학습한다
          </h2>
        </header>
        <p>
          같은 문자열도 tokenizer마다 token 수와 index가 다릅니다. Prompt와
          teacher response를 student chat template로 serialize하고,
          response·tool argument 등 학습할 위치만 mask 1로 둡니다.
        </p>
        <ExplainedFormula
          question="Teacher response를 student가 실제로 학습하는 loss는 무엇인가?"
          idea={
            <>
              Teacher text를 student token으로 다시 나누고, prompt는 context로만
              사용하며 response token의 conditional likelihood만 높입니다.
            </>
          }
          formula={String.raw`c=\operatorname{Tok}_s(x),\qquad L_{\rm seq}=-\sum_{t=1}^{L_s}m_t\log p_s(u_t\mid u_{<t},c)`}
          annotatedFormula={String.raw`\begin{aligned}c&=\underbrace{\operatorname{Tok}_s(x)}_{\text{prompt를 student token으로 encode}}\\[4pt]u_{1:L_s}&=\underbrace{\operatorname{Tok}_s(y_t)}_{\text{teacher text를 student target으로 분할}}\\[4pt]\ell_t&=\underbrace{-m_t\log p_s(u_t\mid u_{<t},c)}_{\text{response 위치만 likelihood 학습}}\\[4pt]L_{\rm seq}&=\underbrace{\sum_t\ell_t}_{\text{유효 target token loss 합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{Tok}_s(y_t)`,
              annotation: [
                "teacher 문자열을 student vocabulary로 다시 나눠",
                "호환 가능한 target ids 생성",
              ],
            },
            {
              expression: String.raw`m_t\log p_s(u_t\mid u_{<t},c)`,
              annotation: [
                "student가 실제 target token에 준 log probability를 읽고",
                "mask로 prompt·padding 위치를 제거",
              ],
            },
            {
              expression: String.raw`\sum_t\ell_t`,
              annotation: [
                "유효 response token의 loss를 모아",
                "한 sequence training objective 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "x",
              name: "prompt context",
              description: "Teacher response를 만든 system·user context입니다.",
            },
            {
              symbol: "y_t",
              name: "teacher text",
              description: "Teacher가 생성한 response 문자열입니다.",
            },
            {
              symbol: "u_t",
              name: "student target token",
              description:
                "Teacher text를 student tokenizer로 나눈 token입니다.",
            },
            {
              symbol: "m_t",
              name: "loss mask",
              description: "학습 위치는 1, context·padding은 0입니다.",
            },
            {
              symbol: "L_s",
              name: "student target length",
              description: "Retokenize·truncate 뒤 token 수입니다.",
            },
          ]}
          assumptions={[
            "Quality·safety·rights filter를 통과한 teacher text입니다.",
            "Chat template·special token·truncation을 고정합니다.",
            "Token 평균과 sequence 평균 reduction을 명시합니다.",
          ]}
          interpretation="Teacher의 token id를 복사하지 않습니다. Teacher가 고른 문자열을 student 자신의 vocabulary와 causal objective로 다시 학습합니다."
        />
      </section>
      <section id="provenance" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · generation receipt
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            생성량보다 어떤 prompt가 어떤 teacher·filter를 거쳐 남았는지
            보존한다
          </h2>
        </header>
        <p>
          각 example에는 prompt source·rights·slice, teacher/version·system
          prompt·sampling, filter/verifier 결과, dedup group, student
          template·mask를 연결합니다. “teacher가 만들었다”는 출처가 quality
          label을 대신하지 않습니다.
        </p>
        <ExplainedFormula
          question="Generation pipeline에서 acceptance rate만 보면 왜 부족한가?"
          idea={
            <>
              생성 수 중 통과한 비율은 비용 효율을 보여 주지만, target slice별
              목표 mixture와 실제 통과 mixture의 차이는 coverage risk를 보여
              줍니다.
            </>
          }
          formula={String.raw`Y=\frac{N_{\rm accept}}{N_{\rm generated}},\qquad G=\frac12\sum_k|\pi_k-\widehat\pi_k|`}
          annotatedFormula={String.raw`\begin{aligned}Y&=\underbrace{N_{\rm accept}/N_{\rm generated}}_{\text{생성 중 통과한 비율}}\\[4pt]d_k&=\underbrace{|\pi_k-\widehat\pi_k|}_{\text{slice k의 목표와 실제 차이}}\\[4pt]G&=\underbrace{\frac12\sum_kd_k}_{\text{전체 mixture coverage gap}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`N_{\rm accept}/N_{\rm generated}`,
              annotation: [
                "filter 통과 수를 전체 생성 수로 나눠",
                "generation yield 측정",
              ],
            },
            {
              expression: String.raw`|\pi_k-\widehat\pi_k|`,
              annotation: [
                "목표와 accepted slice 비율의 방향을 없애고",
                "slice별 부족·과잉 크기 측정",
              ],
            },
            {
              expression: String.raw`\frac12\sum_kd_k`,
              annotation: [
                "모든 slice 차이를 합하고 중복 집계를 반으로 줄여",
                "0에서 1 사이 mixture gap 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`N_{\rm generated}`,
              name: "generated count",
              description: "Teacher가 만든 전체 example 수입니다.",
            },
            {
              symbol: String.raw`N_{\rm accept}`,
              name: "accepted count",
              description: "모든 filter를 통과한 수입니다.",
            },
            {
              symbol: String.raw`\pi_k`,
              name: "target slice mixture",
              description: "배포 목표가 요구한 slice k 비율입니다.",
            },
            {
              symbol: String.raw`\widehat\pi_k`,
              name: "accepted slice mixture",
              description: "최종 dataset의 실제 slice 비율입니다.",
            },
            {
              symbol: "G",
              name: "coverage gap",
              description:
                "목표 mixture와 accepted mixture의 total variation distance입니다.",
            },
          ]}
          assumptions={[
            "Slice label 규칙과 denominator를 versioning합니다.",
            "Yield가 높아도 quality·diversity·decontamination을 보장하지 않습니다.",
            "Target mixture 자체가 deployment workload를 대표하는지 재검토합니다.",
          ]}
          interpretation="목표 (.4,.4,.2), accepted (.1,.7,.2)이면 차이 합 .6의 절반인 G=.3입니다. 전체 수가 많아도 첫 slice coverage가 부족합니다."
        />
        <div id="paper-sequence-kd">
          <CitationBlock
            source="Kim & Rush — Sequence-Level Knowledge Distillation"
            citeKey={1}
            type="paper"
            href="https://aclanthology.org/D16-1139/"
          >
            <p>
              <strong>문제:</strong> Autoregressive teacher distribution을 작은
              sequence model로 옮깁니다.
            </p>
            <p>
              <strong>기여:</strong> Teacher decoded sequence를 student
              target으로 쓰는 방법을 평가합니다.
            </p>
            <p>
              <strong>전제:</strong> 논문의 machine translation
              model·beam·dataset 조건입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 2016년 NMT sequence-level
              distillation입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 임의 LLM synthetic data가
              자동으로 안전·고품질이라는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="coverage-release" className="mb-16 scroll-mt-20 space-y-5">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            독립 benchmark와 contamination audit 뒤에만 synthetic dataset을
            승인한다
          </h2>
        </header>
        <p>
          Raw·accepted·rejected count, reject reason, near-duplicate cluster,
          benchmark overlap, slice mixture와 student-only quality를 한 receipt로
          묶습니다. Student가 자기 실수 prefix에서 배워야 한다면 다음 단계는{" "}
          <a
            className="text-primary hover:underline"
            href="/ai/on-policy-distillation"
          >
            on-policy distillation
          </a>
          입니다.
        </p>
      </section>
    </article>
  );
}
