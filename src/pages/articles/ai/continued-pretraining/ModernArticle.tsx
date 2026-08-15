import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ContinuedPretrainingViz } from "../domain-finetuning/viz/ModernDomainAdaptationViz";

export default function ContinuedPretrainingArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Continued pretraining은 정답을 외우게 하는 단계가 아니라 읽는 분포를 다시 학습하는 단계입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">Base model이 다음 token을 예측하던 objective를 전문 corpus에서 이어 갑니다. 특허·의료·반도체 문서처럼 반복되는 용어와 문장 구조를 더 자주 보게 하는 것이 목적입니다. 특정 질문과 정답 쌍을 직접 가르치는 SFT와는 입력도 target도 다릅니다.</p></div>
      <TermBreakdown title="Corpus를 넣기 전에 구분할 네 용어" items={[
        { term: "DAPT", description: "넓은 domain의 unlabeled corpus에서 pretraining objective를 이어가는 domain-adaptive pretraining입니다." },
        { term: "TAPT", description: "실제 downstream task input과 가까운 unlabeled corpus에 더 좁게 적응합니다." },
        { term: "General replay", description: "Domain-only update 중 기존 일반 분포를 잊는지 감시하거나 완화하려 함께 보여 주는 corpus입니다.", boundary: "Replay sample이 모든 기존 능력을 대표하지는 않습니다." },
        { term: "Token budget", description: "Document 수가 아니라 optimizer가 실제로 본 유효 token 수와 sequence-length 분포입니다." },
      ]} />
      <ContinuedPretrainingViz />
      <ContentBoundary article="continued-pretraining" />
    </section>

    <section id="corpus-mixture" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Corpus manifest가 먼저이고 λ mixture는 그 다음입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Source·license·수집일·언어·문서 family·dedup revision·evaluation overlap을 manifest에 적습니다. 같은 boilerplate가 수백 번 반복되면 문서 수는 커 보여도 gradient는 한 source가 지배합니다. Evaluation 원문뿐 아니라 번역본·요약본·파생 chunk도 lineage로 제거합니다.</p></div>
      <ExplainedFormula question="Domain token과 general replay token을 한 training objective에서 어떻게 섞나요?" idea={<p>각 update에서 어느 distribution의 sample을 볼지 λ로 정하고, 두 corpus에서 계산한 동일 단위의 token loss를 가중 평균합니다.</p>} formula={String.raw`\mathcal L_{\rm mix}=\lambda\,\mathbb E_{x\sim D_d}[\ell_{\rm LM}(x)]+(1-\lambda)\,\mathbb E_{x\sim D_g}[\ell_{\rm LM}(x)]`} annotatedFormula={String.raw`\begin{aligned}L_d&=\underbrace{\mathbb E_{x\sim D_d}[\ell_{\rm LM}(x;\theta)]}_{\text{domain loss}}\\L_g&=\underbrace{\mathbb E_{x\sim D_g}[\ell_{\rm LM}(x;\theta)]}_{\text{replay loss}}\\\mathcal L_{\rm mix}&=\underbrace{\lambda L_d}_{\text{domain 기여}}+\underbrace{(1-\lambda)L_g}_{\text{replay 기여}}\end{aligned}`} operations={[
        { expression: String.raw`\mathbb E_{x\sim D_d}[\ell_{\rm LM}(x)]`, annotation: ["domain distribution에서 token sequence를 뽑아", "전문 언어의 평균 prediction error 계산"] },
        { expression: String.raw`\lambda L_d`, annotation: ["domain 평균 loss에 sampling 비중을 곱해", "한 update 안의 domain 기여 설정"] },
        { expression: String.raw`(1-\lambda)L_g`, annotation: ["남은 비중을 general replay에 배정해", "기존 분포의 관측을 유지"] },
        { expression: String.raw`\lambda L_d+(1-\lambda)L_g`, annotation: ["두 기여를 더해", "optimizer가 줄일 scalar objective 생성"] },
      ]} terms={[
        { symbol: String.raw`D_d`, name: "Domain corpus distribution", description: "전문 용어·문체·구조를 담은 training corpus입니다." },
        { symbol: String.raw`D_g`, name: "General replay distribution", description: "기존 일반 분포를 부분적으로 다시 보여 주는 corpus입니다." },
        { symbol: String.raw`\ell_{\rm LM}`, name: "Language-model loss", description: "Base pretraining과 호환되는 causal 또는 masked token loss입니다." },
        { symbol: String.raw`\lambda`, name: "Domain mixture weight", description: "0과 1 사이에서 domain contribution을 정하는 실험 parameter입니다." },
      ]} assumptions={["두 corpus의 tokenizer·loss reduction·sequence sampling 단위를 맞춥니다.", "λ는 forgetting 보장값이 아니라 validation할 mixture parameter입니다.", "Corpus fitting과 dedup은 training boundary 안에서 수행합니다."]} interpretation="Domain loss 2, general loss 3, λ=.8이면 mixed loss는 .8×2+.2×3=2.2입니다. 하지만 이 숫자만으로 일반 능력 유지가 증명되지는 않습니다." />
    </section>

    <section id="comparable-perplexity" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Perplexity는 tokenizer와 채점 위치가 같을 때만 비교됩니다</h2>
      <ExplainedFormula question="Held-out domain corpus의 token 예측 난이도를 어떻게 하나의 수로 만드나요?" idea={<p>각 유효 token의 관측 확률에 음의 로그를 취해 더하고 token 수로 평균한 뒤 exponentiation으로 원래 곱셈 scale의 직관을 되돌립니다.</p>} formula={String.raw`\overline{\mathrm{NLL}}_D=-\frac1{N_D}\sum_{t=1}^{N_D}\log p_\theta(x_t\mid x_{<t}),\qquad\mathrm{PPL}_D=\exp(\overline{\mathrm{NLL}}_D)`} annotatedFormula={String.raw`\begin{aligned}s_t&=\underbrace{-\log p_\theta(x_t\mid x_{<t})}_{\text{관측 token의 surprisal}}\\\overline{\mathrm{NLL}}_D&=\underbrace{\frac1{N_D}\sum_{t=1}^{N_D}s_t}_{\text{유효 token당 평균 error}}\\\mathrm{PPL}_D&=\underbrace{\exp(\overline{\mathrm{NLL}}_D)}_{\text{평균 log error를 perplexity scale로 복원}}\end{aligned}`} operations={[
        { expression: String.raw`-\log p_\theta(x_t\mid x_{<t})`, annotation: ["관측 token 확률을 log cost로 바꿔", "낮은 확률의 큰 놀라움을 안정적으로 표현"] },
        { expression: String.raw`\sum_t s_t/N_D`, annotation: ["유효 token의 surprisal을 모두 더하고", "token 수로 나눠 corpus 크기를 정규화"] },
        { expression: String.raw`\exp(\overline{\mathrm{NLL}}_D)`, annotation: ["평균 log cost를 exponentiate해", "해석하기 쉬운 perplexity scale로 복원"] },
      ]} terms={[
        { symbol: String.raw`N_D`, name: "Valid domain tokens", description: "Padding과 masked-out 위치를 제외한 평가 token 수입니다." },
        { symbol: String.raw`p_\theta`, name: "Next-token probability", description: "같은 tokenizer와 prefix에서 관측 token에 준 확률입니다." },
        { symbol: String.raw`\mathrm{PPL}_D`, name: "Domain perplexity", description: "평균 token NLL을 지수로 되돌린 값입니다." },
      ]} assumptions={["Tokenizer·normalization·BOS/EOS·context·stride·loss mask가 같습니다.", "Held-out corpus와 그 파생물이 training corpus에 없습니다.", "낮은 perplexity가 factuality·task accuracy·safety를 자동으로 보장하지 않습니다."]} interpretation="평균 NLL이 ln 4면 perplexity는 4입니다. Tokenizer가 다르면 같은 문장을 나누는 단위가 달라지므로 숫자를 직접 순위로 쓸 수 없습니다." />
    </section>

    <section id="forgetting-release" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">마지막 checkpoint가 아니라 gain–forgetting frontier의 checkpoint를 냅니다</h2>
      <ExplainedFormula question="각 checkpoint의 domain 향상과 general forgetting을 어떻게 같은 기준점에서 계산하나요?" idea={<p>학습 전 base checkpoint를 기준으로 domain metric 증가와 general metric 감소를 각각 계산합니다. 두 축을 분리해야 작은 domain 이득이 큰 회귀를 가리는 일을 막습니다.</p>} formula={String.raw`G_t=M_d(\theta_t)-M_d(\theta_0),\qquad F_t=M_g(\theta_0)-M_g(\theta_t)`} annotatedFormula={String.raw`\begin{aligned}G_t&=\underbrace{M_d(\theta_t)-M_d(\theta_0)}_{\text{base 대비 domain gain}}\\F_t&=\underbrace{M_g(\theta_0)-M_g(\theta_t)}_{\text{base 대비 general forgetting}}\\\text{ship}_t&=\underbrace{\mathbb 1[G_t\ge g_{\min}]\,\mathbb 1[F_t\le\varepsilon]}_{\text{gain과 forgetting gate를 모두 통과}}\end{aligned}`} operations={[
        { expression: String.raw`M_d(\theta_t)-M_d(\theta_0)`, annotation: ["checkpoint와 base의 domain score를 빼서", "adaptation이 만든 순수 gain 계산"] },
        { expression: String.raw`M_g(\theta_0)-M_g(\theta_t)`, annotation: ["base general score에서 checkpoint score를 빼서", "잃은 일반 능력의 크기 계산"] },
        { expression: String.raw`\mathbb 1[G_t\ge g_{\min}]\mathbb 1[F_t\le\varepsilon]`, annotation: ["두 boolean gate를 곱해", "둘 다 참일 때만 release 허용"] },
      ]} terms={[
        { symbol: String.raw`\theta_0,\theta_t`, name: "Base and checkpoint", description: "학습 전 weight와 step t에서 저장한 weight입니다." },
        { symbol: String.raw`M_d,M_g`, name: "Domain and general metrics", description: "모두 높을수록 좋은 방향으로 정렬한 평가 지표입니다." },
        { symbol: String.raw`G_t,F_t`, name: "Gain and forgetting", description: "같은 base에서 측정한 개선과 회귀입니다." },
      ]} assumptions={["Checkpoint마다 같은 split·decoding·seed aggregation을 씁니다.", "General suite 밖의 능력 보존까지 증명하지 않습니다.", "Rollback 가능한 checkpoint·optimizer·corpus revision을 함께 보관합니다."]} interpretation="10k step이 domain +4/general −.5이고 30k가 +4.2/−5라면 forgetting budget 1에서는 10k가 release 후보입니다." />
      <div id="paper-dapt" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Gururangan et al. — Don’t Stop Pretraining" href="https://aclanthology.org/2020.acl-main.740/">RoBERTa의 DAPT·TAPT를 네 domain과 여덟 classification task에서 비교했습니다. 이 조건부 결과가 모든 LLM·domain에서 continued pretraining의 우월성을 보장하지는 않습니다.</CitationBlock></div>
      <div id="paper-forgetting" className="not-prose mt-6 scroll-mt-24"><CitationBlock type="paper" citeKey={2} source="Gu & Feng — Catastrophic Forgetting in Continual NMT" href="https://aclanthology.org/2020.coling-main.381/">순차 domain training에서 이전 domain 성능 저하를 분석합니다. NMT의 관찰을 모든 decoder-only model의 동일한 layer 원인으로 일반화하지 않습니다.</CitationBlock></div>
    </section>
  </div>;
}
