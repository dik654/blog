import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DomainTaskFinetuningViz } from "../domain-finetuning/viz/ModernDomainAdaptationViz";

export default function DomainTaskFinetuningArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Task fine-tuning은 지식 묶음이 아니라 원하는 행동의 예시를 학습합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">
            정보 추출 model에게 “의료 문서를 잘 읽어라”라고만 하면 정답 형태가 없습니다. 어떤 context를 읽고 어떤 JSON을 만들며 근거가 없을 때 어떻게
            abstain할지까지 demonstration 한 건에 명시해야 합니다.
          </p></div>
      <TermBreakdown title="Demonstration 한 건을 이루는 네 부분" items={[
        { term: "Input contract", description: "System·user role, context source, 최대 길이와 truncation 방향을 정합니다." },
        { term: "Target contract", description: "Response schema·label taxonomy·citation·abstention·허용 ambiguity를 정합니다." },
        { term: "Loss contract", description: "Prompt와 response 중 실제로 gradient를 줄 token, sample weight, reduction을 정합니다." },
        { term: "Evaluation contract", description: "Format·내용·calibration·slice·general regression을 어떤 split에서 판정할지 정합니다." },
      ]} />
      <DomainTaskFinetuningViz />
      <ContentBoundary article="domain-task-finetuning" />
    </section>

    <section id="demonstration" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Prompt는 읽게 하고 response token만 채점할 수 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            attention mask와 loss mask는 다릅니다. prompt token에 loss 0을 두어도 model은 그 token을 context로 읽습니다. multi-
            turn이라면 어느 assistant turn을 target으로 삼을지도 dataset revision에 고정합니다.
          </p></div>
      <ExplainedFormula question="전체 대화는 context로 유지하면서 response token만 평균 loss에 넣으려면 어떻게 하나요?" idea={<p>
            각 target position에 binary loss mask를 붙입니다. mask가 1인 token의 NLL만 더한 뒤 1의 개수로 나누어 response 길이가 다른
            sample을 비교합니다.
          </p>} formula={String.raw`N_{\rm resp}=\sum_t m_t,\qquad\mathcal L_{\rm SFT}=-\frac1{N_{\rm resp}}\sum_{t=1}^T m_t\log\pi_\theta(y_t\mid y_{<t})`} annotatedFormula={String.raw`\begin{aligned}N_{\rm resp}&=\underbrace{\sum_{t=1}^{T}m_t}_{\text{채점할 response token 수}}\\s_t&=\underbrace{-\log\pi_\theta(y_t\mid y_{<t})}_{\text{관측 target token의 error}}\\e_t&=\underbrace{m_t s_t}_{\text{prompt error는 0, response error만 유지}}\\\mathcal L_{\rm SFT}&=\underbrace{\frac1{N_{\rm resp}}\sum_{t=1}^{T}e_t}_{\text{response token당 평균 loss}}\end{aligned}`} operations={[
        { expression: String.raw`\sum_t m_t`, annotation: ["binary mask의 1을 더해", "실제 채점 token 수를 계산"] },
        { expression: String.raw`-\log\pi_\theta(y_t\mid y_{<t})`, annotation: ["관측 token 확률을 negative log로 바꿔", "틀릴수록 큰 학습 error 생성"] },
        { expression: String.raw`m_t s_t`, annotation: ["error에 mask를 곱해", "prompt는 context로만 두고 response만 채점"] },
        { expression: String.raw`\sum_t e_t/N_{\rm resp}`, annotation: ["채점 error를 모두 더하고 response token 수로 나눠", "길이에 독립적인 평균 loss 생성"] },
      ]} terms={[
        { symbol: String.raw`y_t`, name: "Serialized token", description: "Prompt와 response를 합친 sequence의 t번째 관측 token입니다." },
        { symbol: String.raw`m_t`, name: "Response loss mask", description: "학습할 response target이면 1, prompt·padding이면 0입니다." },
        { symbol: String.raw`\pi_\theta`, name: "Language-model policy", description: "현재 prefix에서 다음 token distribution을 냅니다." },
        { symbol: String.raw`N_{\rm resp}`, name: "Valid response tokens", description: "Mean reduction의 분모가 되는 mask 합입니다." },
      ]} assumptions={["Decoder-only teacher forcing과 response-only mean reduction을 가정합니다.", "Chat template과 role token revision을 training·evaluation·serving에서 맞춥니다.", "Schema 정확도와 내용의 사실성은 별도 metric입니다."]} interpretation="Mask [0,0,0,1,1,1]과 response NLL [.2,.4,.8]이면 loss는 1.4/3≈.467입니다. 앞 세 token은 loss에서 빠지지만 response probability의 context로 남습니다." />
    </section>

    <section id="update-scope" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Full·LoRA·frozen head는 바뀌는 parameter의 범위가 다릅니다</h2>
      <TermBreakdown title="같은 demonstration에 적용할 세 update scope" items={[
        { term: "Full fine-tuning", description: "Base model의 대부분 또는 모든 trainable weight를 optimizer가 갱신합니다.", boundary: "가장 유연하지만 optimizer state·checkpoint·회귀 위험이 큽니다." },
        { term: "LoRA·adapter", description: "선택한 module에 작은 trainable update를 붙이고 base weight는 고정합니다.", boundary: "Target module·rank·merge·serving adapter 선택이 runtime contract에 추가됩니다." },
        { term: "Frozen encoder·head-only", description: "Representation model은 고정하고 작은 task head만 학습합니다.", example: "고정 embedding 위에 12-class linear classifier를 학습합니다." },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>세 방법을 비교할 때는 업데이트 범위만 바뀌게 합니다.</p>
        <ul>
          <li><strong>시작점</strong> — 같은 base checkpoint를 사용합니다.</li>
          <li><strong>데이터 순서</strong> — 같은 example order와 seed를 사용합니다.</li>
          <li><strong>학습량</strong> — 같은 effective batch와 optimizer step을 사용합니다.</li>
          <li><strong>평가</strong> — 같은 split과 decoding revision을 사용합니다.</li>
        </ul>
        <p>
            trainable parameter 수가 적어도 wall time이 더 길거나 adapter merge 뒤 memory가 같을 수 있습니다. peak memory,
            throughput, artifact size는 각각 별도 줄로 기록합니다.
          </p>
      </div>
    </section>

    <section id="evaluation" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">행동 평가는 format 성공 하나로 끝나지 않습니다</h2>
      <TermBreakdown title="서로 상쇄하지 않을 release gate" items={[
        { term: "Format validity", description: "JSON parse·required key·type·enum처럼 출력 형태가 contract를 만족하는지 봅니다." },
        { term: "Content validity", description: "Extracted value·classification label·citation이 실제 source와 맞는지 봅니다." },
        { term: "Abstention behavior", description: "근거가 없거나 모호한 input에서 거절하고 human review로 보내는지 봅니다." },
        { term: "General regression", description: "Domain behavior를 얻는 동안 기존 instruction·safety·language 능력이 허용 한도 안에 있는지 봅니다." },
      ]} />
      <ExplainedFormula question="Format은 통과했지만 factuality가 실패한 model을 평균 점수로 release하지 않으려면 어떻게 하나요?" idea={<p>각 metric을 threshold와 비교한 indicator로 만들고 모두 곱합니다. 하나라도 0이면 전체 gate가 0이 되어 높은 다른 점수가 실패를 상쇄하지 못합니다.</p>} formula={String.raw`R=\mathbb 1[M_{\rm fmt}\ge\tau_{\rm fmt}]\mathbb 1[M_{\rm fact}\ge\tau_{\rm fact}]\mathbb 1[M_{\rm abst}\ge\tau_{\rm abst}]\mathbb 1[\Delta_{\rm gen}\ge-\varepsilon]`} annotatedFormula={String.raw`\begin{aligned}g_f&=\underbrace{\mathbb 1[M_{\rm fmt}\ge\tau_{\rm fmt}]}_{\text{schema gate}}\\g_c&=\underbrace{\mathbb 1[M_{\rm fact}\ge\tau_{\rm fact}]}_{\text{내용·citation gate}}\\g_a&=\underbrace{\mathbb 1[M_{\rm abst}\ge\tau_{\rm abst}]}_{\text{거절·handoff gate}}\\g_g&=\underbrace{\mathbb 1[\Delta_{\rm gen}\ge-\varepsilon]}_{\text{일반 능력 회귀 gate}}\\R&=\underbrace{g_f g_c g_a g_g}_{\text{네 gate가 모두 1일 때만 release}}\end{aligned}`} operations={[
        { expression: String.raw`\mathbb 1[M\ge\tau]`, annotation: ["metric을 사전 threshold와 비교해", "통과 1·실패 0으로 변환"] },
        { expression: String.raw`g_f g_c g_a g_g`, annotation: ["독립 gate를 곱해", "한 실패도 평균으로 상쇄되지 않게 함"] },
      ]} terms={[
        { symbol: String.raw`M_{\rm fmt}`, name: "Format metric", description: "Parse와 schema validity 비율입니다." },
        { symbol: String.raw`M_{\rm fact}`, name: "Factual metric", description: "Source-grounded content의 정확도입니다." },
        { symbol: String.raw`M_{\rm abst}`, name: "Abstention metric", description: "근거 부족·모호성에서 올바르게 거절한 정도입니다." },
        { symbol: "R", name: "Release decision", description: "모든 gate가 통과할 때만 1인 비보상 판정입니다." },
      ]} assumptions={["Threshold는 untouched test를 보기 전에 정합니다.", "각 metric은 entity·time·rare intent slice도 함께 보고합니다.", "Human review queue의 capacity와 failure action도 운영 계약에 포함합니다."]} interpretation="Format 100점이어도 factuality gate가 0이면 R=0입니다. 잘 포장된 오답을 release하지 않는 것이 이 곱셈의 의도입니다." />
      <div id="paper-instructgpt" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Ouyang et al. — InstructGPT" href="https://arxiv.org/abs/2203.02155">Demonstration 기반 supervised fine-tuning과 preference optimization pipeline을 설명합니다. 논문의 annotator·prompt distribution·model 범위가 모든 domain behavior를 대표하지는 않습니다.</CitationBlock></div>
      <div id="paper-lora-task" className="not-prose mt-6 scroll-mt-24"><CitationBlock type="paper" citeKey={2} source="Hu et al. — LoRA" href="https://arxiv.org/abs/2106.09685">저랭크 update로 trainable parameter를 줄이는 방법입니다. 같은 data와 evaluation 없이 full fine-tuning보다 낫다고 결론낼 수 없습니다.</CitationBlock></div>
    </section>
  </div>;
}
