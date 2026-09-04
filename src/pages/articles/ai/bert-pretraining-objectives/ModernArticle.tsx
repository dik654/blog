import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { BertObjectiveViz } from "../bert/viz/ModernBertViz";

export default function BertObjectivesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          BERT 후속 objective는 label을 붙이는 위치와 negative를 만드는 방법이
          다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            NSP, SOP, RTD를 모델 이름 목록으로 외우지 않습니다. 각 방법의{" "}
            <strong>example construction</strong>,{" "}
            <strong>prediction unit</strong>, <strong>label</strong>,{" "}
            <strong>compute</strong>를 한 줄씩 정의한 뒤 같은 budget에서
            비교합니다.
          </p>
        </div>
        <BertObjectiveViz />
        <ContentBoundary article="bert-pretraining-objectives" />
      </section>
      <section id="nsp-sop" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          NSP는 다음/random 문서, SOP는 같은 문서의 정상/역순을 분류합니다
        </h2>
        <TermBreakdown
          title="두 segment-level objective"
          items={[
            {
              term: "Next Sentence Prediction · NSP",
              description:
                "Segment B가 A의 실제 다음 segment인지 corpus random segment인지 CLS에서 분류합니다.",
              example: "Positive A→B, negative A→R입니다.",
              boundary: "Random negative의 topic 차이만으로 풀릴 수 있습니다.",
            },
            {
              term: "Sentence Order Prediction · SOP",
              description:
                "같은 문서에서 A→B와 B→A를 만들어 정상 순서를 분류합니다.",
              example: "Topic은 유지하고 discourse order를 바꿉니다.",
              boundary:
                "ALBERT의 sharing·factorization과 함께 평가된 결과입니다.",
            },
          ]}
        />
        <ExplainedFormula
          question="NSP와 SOP의 binary loss는 같아 보여도 무엇이 다른가요?"
          idea={
            <p>
              두 objective 모두 CLS에서 binary probability를 만들지만 label을 만드는 pair distribution이 다릅니다. Loss 식만 같고
              supervision source가 다릅니다.
            </p>
          }
          formula={String.raw`L_{pair}=-y\log p-(1-y)\log(1-p)`}
          annotatedFormula={String.raw`\begin{aligned}p&=\underbrace{\sigma(w^\top h_{\mathrm{CLS}}+b)}_{\text{CLS state를 pair label 확률로 변환}}\\L_{\mathrm{pair}}&=\underbrace{-y\log p}_{\text{positive pair가 낮으면 penalty}}\\&\quad\underbrace{-(1-y)\log(1-p)}_{\text{negative pair가 높으면 penalty}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`w^\top h_{\mathrm{CLS}}+b`,
              annotation: [
                "sequence state를 binary 축으로 투영해",
                "pair score 하나 생성",
              ],
            },
            {
              expression: String.raw`\sigma(\cdot)`,
              annotation: ["실수 score를", "0과 1 사이 확률로 변환"],
            },
            {
              expression: String.raw`-y\log p-(1-y)\log(1-p)`,
              annotation: [
                "정답 branch의 log probability만",
                "binary NLL로 선택",
              ],
            },
          ]}
          terms={[
            {
              symbol: "y",
              name: "Pair label",
              description:
                "NSP의 next/random 또는 SOP의 normal/reversed label입니다.",
            },
            {
              symbol: "h_{CLS}",
              name: "Pair representation",
              description: "Packed A·B input의 CLS contextual state입니다.",
            },
            {
              symbol: "p",
              name: "Positive probability",
              description:
                "현재 pair가 positive construction일 model probability입니다.",
            },
          ]}
          assumptions={[
            "Positive와 negative construction rule을 versioning합니다.",
            "Pair balance와 document sampling policy를 기록합니다.",
          ]}
          interpretation="같은 BCE 식을 쓴다고 NSP와 SOP가 같은 task는 아닙니다. Negative example이 어떤 정보를 남기는지가 핵심입니다."
        />
      </section>
      <section id="rtd" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          RTD는 generator가 바꾼 token인지 각 위치에서 검사합니다
        </h2>
        <TermBreakdown
          title="Replaced-token detection의 세 역할"
          items={[
            {
              term: "Generator",
              description:
                "일부 위치에 plausible replacement token을 제안합니다.",
              boundary: "Generator compute도 전체 budget에 포함합니다.",
            },
            {
              term: "Discriminator",
              description:
                "각 input 위치가 original인지 replaced인지 binary label을 예측합니다.",
            },
            {
              term: "Label convention",
              description:
                "Generator가 우연히 원래 token을 낸 위치를 original/replaced 중 무엇으로 볼지 고정합니다.",
              boundary: "Implementation별 convention을 확인합니다.",
            },
          ]}
        />
        <ExplainedFormula
          question="왜 RTD는 MLM보다 더 많은 위치에 supervision을 줄 수 있나요?"
          idea={
            <p>
              MLM은 selected set M의 vocabulary loss만 쓰지만 RTD
              discriminator는 실제 input의 각 eligible position에서
              original/replaced binary loss를 계산합니다.
            </p>
          }
          formula={String.raw`L_{RTD}=\sum_i BCE(r_i,D_i(\widetilde x))`}
          annotatedFormula={String.raw`\begin{aligned}r_i&=\underbrace{\mathbf1[\widetilde x_i=x_i]}_{\text{현재 input token이 원본인지 label 생성}}\\d_i&=\underbrace{D_\theta(\widetilde x)_i}_{\text{각 위치의 original 확률 예측}}\\L_{\mathrm{RTD}}&=\underbrace{\sum_{i\in V}\operatorname{BCE}(r_i,d_i)}_{\text{eligible 위치의 binary signal을 누적}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[\widetilde x_i=x_i]`,
              annotation: [
                "corrupted token과 원 token을 비교해",
                "위치별 binary 정답 생성",
              ],
            },
            {
              expression: String.raw`D_\theta(\widetilde x)_i`,
              annotation: [
                "전체 corrupted context를 읽고",
                "각 위치의 original 확률 출력",
              ],
            },
            {
              expression: String.raw`\sum_{i\in V}`,
              annotation: [
                "선택 위치보다 넓은 eligible set에서",
                "token-level supervision 누적",
              ],
            },
          ]}
          terms={[
            {
              symbol: "r_i",
              name: "Original-token label",
              description: "현재 visible token이 원본과 같은지 나타냅니다.",
            },
            {
              symbol: "d_i",
              name: "Discriminator probability",
              description: "Position i가 original이라고 예측한 확률입니다.",
            },
            {
              symbol: "V",
              name: "Eligible positions",
              description:
                "PAD·special token을 제외한 discriminator loss 위치입니다.",
            },
          ]}
          assumptions={[
            "Generator와 discriminator compute를 함께 셉니다.",
            "Accidental original token의 label convention을 고정합니다.",
          ]}
          interpretation="더 조밀한 label 수가 자동으로 더 좋은 representation을 뜻하지 않습니다. 같은 wall time·data·parameter budget에서 transfer를 비교합니다."
        />
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Model family 전체 결과를 objective 하나의 효과로 축약하지 않습니다
        </h2>
        <TermBreakdown
          title="공정 비교 표"
          items={[
            {
              term: "One changed axis",
              description:
                "Architecture·data·token budget·masking을 맞추고 objective만 바꿉니다.",
            },
            {
              term: "Total compute",
              description:
                "Generator·discriminator·sequence length·wall time을 함께 기록합니다.",
            },
            {
              term: "Common transfer",
              description:
                "동일 downstream tasks와 fine-tuning budget으로 평가합니다.",
            },
            {
              term: "Failure slices",
              description:
                "Sentence relation·token semantics·long input slice를 나눠 봅니다.",
            },
          ]}
        />
        <div className="not-prose mt-8 grid gap-4">
          <div id="paper-roberta">
            <CitationBlock
              source="Liu et al. — RoBERTa"
              citeKey={1}
              type="paper"
              href="https://arxiv.org/abs/1907.11692"
            >
              Data·batch·training length·dynamic masking·NSP removal을 함께
              재검토합니다. 전체 향상을 NSP 단독 효과로 읽지 않습니다.
            </CitationBlock>
          </div>
          <div id="paper-albert">
            <CitationBlock
              source="Lan et al. — ALBERT"
              citeKey={2}
              type="paper"
              href="https://arxiv.org/abs/1909.11942"
            >
              Embedding factorization·parameter sharing과 SOP를 함께 제시합니다.
              SOP 단독의 보편 우위를 주장하지 않습니다.
            </CitationBlock>
          </div>
          <div id="paper-electra">
            <CitationBlock
              source="Clark et al. — ELECTRA"
              citeKey={3}
              type="paper"
              href="https://arxiv.org/abs/2003.10555"
            >
              Generator replacement와 discriminator RTD로 token-level
              supervision을 조밀하게 만듭니다. 모든 scale·generator에서의 우위를
              보장하지 않습니다.
            </CitationBlock>
          </div>
        </div>
      </section>
    </div>
  );
}
