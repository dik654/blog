import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { BertMlmViz } from "../bert/viz/ModernBertViz";

export default function BertMlmArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          MLM은 정답 위치를 고른 뒤 model이 볼 input만 오염시킵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            양방향 encoder가 원래 token을 그대로 본 채 그 token ID를 맞히면 복사
            shortcut이 생깁니다. 그래서 <strong>원래 target</strong>은 보존하고,
            model에 보여 주는 sequence만 mask·random·unchanged branch로
            바꿉니다.
          </p>
        </div>
        <TermBreakdown
          title="두 번의 sampling과 한 번의 loss"
          items={[
            {
              term: "Selected set M",
              description:
                "실제 token 위치 중 prediction 문제로 낼 약 15% 집합입니다.",
              example: "10,000 token이면 기대 1,500개입니다.",
            },
            {
              term: "Corrupted input x̃",
              description:
                "Selected 위치를 80% MASK, 10% random, 10% unchanged로 보여 준 sequence입니다.",
              boundary: "80/10/10은 전체 token이 아니라 M 안의 비율입니다.",
            },
            {
              term: "Original target xᵢ",
              description:
                "Branch와 무관하게 corruption 전 vocabulary ID입니다.",
            },
            {
              term: "MLM loss mask",
              description:
                "Selected position에만 categorical NLL을 계산하는 표시입니다.",
              boundary: "PAD·special token은 selection과 loss에서 제외합니다.",
            },
          ]}
        />
        <BertMlmViz />
        <ContentBoundary article="bert-mlm-corruption" />
      </section>
      <section id="corruption" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          15%를 먼저 고르고 그 안에서 80·10·10으로 나눕니다
        </h2>
        <ExplainedFormula
          question="10,000 token에서 branch별 기대 개수는 왜 1,200·150·150인가요?"
          idea={
            <p>
              전체 token 수에 selection probability .15를 먼저 곱합니다. 그
              결과에만 각 branch probability를 곱합니다.
            </p>
          }
          formula={String.raw`E[N_b]=N\cdot .15\cdot \pi_b`}
          annotatedFormula={String.raw`\begin{aligned}\mathbb E[N_M]&=\underbrace{N\cdot0.15}_{\text{전체에서 target 위치를 먼저 선택}}\\\mathbb E[N_{\mathrm{mask}}]&=\underbrace{\mathbb E[N_M]\cdot0.80}_{\text{선택 위치의 MASK branch}}\\\mathbb E[N_{\mathrm{random}}]&=\underbrace{\mathbb E[N_M]\cdot0.10}_{\text{선택 위치의 random branch}}\\\mathbb E[N_{\mathrm{same}}]&=\underbrace{\mathbb E[N_M]\cdot0.10}_{\text{선택 위치의 unchanged branch}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`N\cdot0.15`,
              annotation: ["전체 eligible token 수에", "selection 확률을 적용"],
            },
            {
              expression: String.raw`N_M\cdot\pi_b`,
              annotation: [
                "선택된 target 수에만",
                "각 input branch 확률을 적용",
              ],
            },
          ]}
          terms={[
            {
              symbol: "N",
              name: "Eligible token count",
              description:
                "PAD·special token을 제외한 선택 가능 위치 수입니다.",
            },
            {
              symbol: "N_M",
              name: "Selected target count",
              description: "MLM loss를 받을 위치 수입니다.",
            },
            {
              symbol: String.raw`\pi_b`,
              name: "Branch probability",
              description: "MASK .8, random .1, unchanged .1입니다.",
            },
          ]}
          assumptions={[
            "각 위치를 독립 sampling하는 기대값 계산입니다.",
            "실제 batch count는 expectation과 정확히 같지 않을 수 있습니다.",
          ]}
          interpretation="N=10,000이면 target 1,500, MASK 1,200, random 150, unchanged 150이 기대값입니다."
        />
        <TermBreakdown
          title="왜 80/10/10인가 — MASK 하나만 쓰지 않는 이유"
          items={[
            {
              term: "Pretrain/finetune 불일치 회피",
              description:
                "[MASK] token은 pretraining이 만든 인공적인 기호이고, downstream fine-tuning과 실제 inference input에는 절대 등장하지 않습니다. Selected 위치를 100% [MASK]로만 바꾸면 model은 [MASK]가 있을 때만 예측을 준비하도록 학습되어, [MASK]가 없는 실제 입력을 만났을 때 representation 품질이 달라질 위험이 생깁니다. 10%를 unchanged로, 10%를 random token으로 남겨 [MASK] 의존도를 낮춥니다.",
              boundary:
                "이 회피가 불일치를 완전히 없애지는 않습니다 — 여전히 selection 자체가 pretraining에만 있는 절차입니다.",
            },
            {
              term: "모든 위치의 representation을 신뢰 불가능하게 만들기",
              description:
                "만약 [MASK]가 아닌 위치는 항상 원래 token 그대로라면, model은 '이 자리는 안 뽑혔으니 보이는 값이 곧 정답'이라고 안심하고 그 위치의 문맥 표현을 깊게 만들 필요가 없어집니다. Unchanged(10%)와 random(10%) branch를 섞으면, model은 겉보기에 멀쩡한 token조차 실제로는 오염됐을 수 있다는 사실 때문에 selected·비selected 위치 모두에서 강건한 contextual representation을 유지해야 합니다.",
              example:
                "Random branch로 '고양이'가 엉뚱한 단어로 바뀌었다면, model은 그 자리의 표면 token을 그대로 믿는 대신 주변 문맥으로 원래 뜻을 복원해야 합니다.",
            },
          ]}
        />
      </section>
      <section id="objective" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Loss는 corrupted input 전체를 조건으로 원래 token만 복원합니다
        </h2>
        <ExplainedFormula
          question="왜 loss 합은 모든 위치가 아니라 M에만 있나요?"
          idea={
            <p>
              Model은 x̃ 전체를 읽지만 문제로 선택한 위치만 target을 가집니다. 각
              target의 원래 vocabulary probability에 negative log를 적용해
              더합니다.
            </p>
          }
          formula={String.raw`L=-\sum_{i\in M}\log p_\theta(x_i\mid\widetilde x)`}
          annotatedFormula={String.raw`\begin{aligned}p_i&=\underbrace{p_\theta(x_i\mid\widetilde x)}_{\text{오염된 전체 문맥에서 원 token 확률}}\\\ell_i&=\underbrace{-\log p_i}_{\text{정답 확률이 작을수록 큰 penalty}}\\L_{\mathrm{MLM}}&=\underbrace{\sum_{i\in M}\ell_i}_{\text{선택된 target 위치만 누적}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`p_\theta(x_i\mid\widetilde x)`,
              annotation: [
                "corrupted sequence를 조건으로",
                "원래 vocabulary ID 확률을 조회",
              ],
            },
            {
              expression: String.raw`-\log p_i`,
              annotation: [
                "정답 확률을 additive penalty로 바꾸고",
                "높은 확률을 보상",
              ],
            },
            {
              expression: String.raw`\sum_{i\in M}`,
              annotation: [
                "selection mask를 적용해",
                "target 위치 loss만 누적",
              ],
            },
          ]}
          terms={[
            {
              symbol: "M",
              name: "Selected positions",
              description: "Prediction target으로 뽑힌 index 집합입니다.",
            },
            {
              symbol: "x_i",
              name: "Original token",
              description: "Corruption 전 i 위치 vocabulary ID입니다.",
            },
            {
              symbol: String.raw`\widetilde x`,
              name: "Corrupted sequence",
              description: "Encoder가 실제로 보는 branch 적용 input입니다.",
            },
          ]}
          assumptions={[
            "Target과 corrupted input을 별도 tensor로 보존합니다.",
            "Loss reduction denominator를 selected count로 고정합니다.",
          ]}
          interpretation="MLM은 전체 sequence joint likelihood도 left-to-right next-token likelihood도 아닙니다. Selected conditional reconstruction objective입니다."
        />
      </section>
      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Dynamic mask·random-token policy·special-token 제외를 recipe로
          남깁니다
        </h2>
        <div id="paper-bert-mlm" className="not-prose">
          <CitationBlock
            source="Devlin et al. — BERT MLM"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/1810.04805"
          >
            원 BERT의 15% selection과 selected 위치의 80/10/10 corruption,
            masked-token prediction을 정의합니다. 실제 count나 후속
            dynamic-masking recipe가 자동으로 같다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
