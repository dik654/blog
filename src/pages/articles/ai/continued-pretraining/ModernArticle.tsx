import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import DomainAdaptationPathLocator, {
  DomainAdaptationMapReturn,
} from "../domain-finetuning/DomainAdaptationPathLocator";
import {
  CheckpointFrontierViz,
  ContinuedPretrainingTraceViz,
  CorpusMixtureViz,
  PerplexityChoiceViz,
} from "./ContinuedPretrainingViz";

const CORPUS_MANIFEST = [
  { field: "Source·rights", value: "전문 문서의 출처와 학습·재배포 권리" },
  { field: "Time", value: "수집일과 학습에 허용한 시간 경계" },
  { field: "Family", value: "같은 저자·문서 계열·boilerplate를 묶는 기준" },
  { field: "Dedup revision", value: "중복 제거 규칙과 실행 revision" },
  { field: "Evaluation overlap", value: "평가 원문·번역·요약·파생 chunk의 제외 결과" },
  { field: "Token budget", value: "실제로 노출할 유효 token 수와 길이 분포" },
] as const;

export default function ContinuedPretrainingArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="1"
        data-assumed-case="patent-corpus-training"
        className="scroll-mt-20"
      >
        <DomainAdaptationPathLocator current="continued-pretraining" />
        <h2 className="mb-5 text-2xl font-bold">
          1. 전문 문서를 더 읽힌 뒤에도 어느 checkpoint를 남길지는 따로 판단합니다
        </h2>

        <ContinuedPretrainingTraceViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            특허 문장을 자꾸 잘못 끊는 base model이 있다고 가정하겠습니다. 정답 문장을
            외우게 하는 대신 출처와 중복을 정리한 특허 문서를 더 읽히고, 원래 쓰던
            language-model objective로 다음 token 예측을 이어 갑니다. 이 과정이
            continued pretraining입니다.
          </p>
          <p>
            이 글에서는 전문 문서 token 8과 일반 문서 token 2를 섞습니다. 전문 문서의
            평균 loss는 2, 일반 문서의 평균 loss는 3으로 놓습니다. 학습 뒤에는 10k와
            30k checkpoint를 비교합니다. 이 수치들은 계산과 선택 순서를 보여 주기 위한
            가정 [A]이며 실제 모델 측정값이 아닙니다.
          </p>
          <p>
            핵심은 전문 loss만 낮추는 데 있지 않습니다. 어떤 문서를 넣었는지 다시 찾을
            수 있어야 하고, 같은 조건에서 domain fit을 재야 하며, 일반 능력 회귀가
            허용 범위 안인 checkpoint를 골라야 합니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 학습 흐름에서 구분할 네 이름"
          items={[
            {
              term: "DAPT",
              description: "넓은 domain의 unlabeled corpus에서 pretraining objective를 이어 가는 domain-adaptive pretraining입니다.",
            },
            {
              term: "TAPT",
              description: "실제 downstream task 입력과 가까운 unlabeled corpus로 범위를 더 좁힌 적응입니다.",
            },
            {
              term: "General replay",
              description: "전문 문서만 학습하며 기존 분포를 잊는지 확인하거나 완화하려 다시 보여 주는 일반 corpus입니다.",
              boundary: "Replay sample이 모든 기존 능력을 대표하지는 않습니다.",
            },
            {
              term: "Token budget",
              description: "문서 수가 아니라 optimizer가 실제로 본 유효 token 수와 sequence-length 분포입니다.",
            },
          ]}
        />
        <ContentBoundary article="continued-pretraining" />
      </section>

      <section id="corpus-mixture" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          2. Corpus manifest를 고정한 뒤 token 노출을 섞습니다
        </h2>

        <div
          className="not-prose mb-8 overflow-hidden border-y border-border"
          role="img"
          aria-label="전문 corpus manifest에 기록할 source rights, time, family, dedup revision, evaluation overlap, token budget 여섯 항목"
        >
          <div className="border-b border-border bg-muted/20 px-4 py-3">
            <p className="text-[10px] font-black text-primary">CORPUS MANIFEST</p>
            <p className="mt-1 break-keep text-sm font-bold leading-6">문서를 학습에 넣기 전에 다시 찾고 제외할 수 있는 경계를 남깁니다</p>
          </div>
          <div className="grid sm:grid-cols-2">
            {CORPUS_MANIFEST.map((item) => (
              <div key={item.field} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 border-b border-border px-3 py-4 last:border-b-0 sm:border-r sm:px-4 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(even)]:border-r-0">
                <strong className="break-keep text-xs leading-5 text-primary">{item.field}</strong>
                <span className="break-keep text-xs leading-5 text-muted-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 문구가 수백 번 들어간 문서군은 row 수가 많아도 한 source가 gradient를
            지배할 수 있습니다. 그래서 source·rights·수집일뿐 아니라 문서 family와
            중복 제거 revision을 함께 적습니다. 평가 원문만 빼서는 부족합니다. 번역본,
            요약본, 파생 chunk까지 lineage를 따라 제외해야 합니다.
          </p>
          <p>
            입력 경계를 고정했다면 어느 분포의 token을 얼마나 자주 보여 줄지 정합니다.
            아래 그림은 열 칸 가운데 여덟 칸을 전문 문서에, 두 칸을 일반 replay에
            배정한 설명용 배치입니다.
          </p>
        </div>

        <CorpusMixtureViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            그림의 8:2는 sampling 비중입니다. 전문 문서 평균 loss 2에 0.8을 곱하고,
            일반 replay 평균 loss 3에 0.2를 곱하면 optimizer가 줄일 mixed loss는
            2.2입니다. 이 계산을 일반화하면 다음 식이 됩니다.
          </p>
        </div>

        <ExplainedFormula
          question="Domain token과 general replay token을 한 training objective에서 어떻게 합칩니까?"
          idea={(
            <p>
              두 corpus에 같은 단위의 token loss를 계산하고, 실제 sampling 비중과 맞춘
              가중치를 곱해 하나의 scalar objective로 더합니다.
            </p>
          )}
          formula={String.raw`\mathcal L_{\rm mix}=\lambda\,\mathbb E_{x\sim D_d}[\ell_{\rm LM}(x)]+(1-\lambda)\,\mathbb E_{x\sim D_g}[\ell_{\rm LM}(x)]`}
          annotatedFormula={String.raw`\begin{aligned}L_d&=\underbrace{\mathbb E_{x\sim D_d}[\ell_{\rm LM}(x;\theta)]}_{\text{전문 문서의 평균 token loss}}\\L_g&=\underbrace{\mathbb E_{x\sim D_g}[\ell_{\rm LM}(x;\theta)]}_{\text{일반 replay의 평균 token loss}}\\\mathcal L_{\rm mix}&=\underbrace{\lambda L_d}_{\text{전문 문서 기여}}+\underbrace{(1-\lambda)L_g}_{\text{일반 replay 기여}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbb E_{x\sim D_d}[\ell_{\rm LM}(x)]`,
              annotation: ["전문 문서에서 token sequence를 뽑아", "전문 언어의 평균 예측 오차를 계산합니다."],
            },
            {
              expression: String.raw`\lambda L_d`,
              annotation: ["전문 문서 평균 loss에 노출 비중을 곱해", "한 update 안의 전문 문서 기여를 만듭니다."],
            },
            {
              expression: String.raw`(1-\lambda)L_g`,
              annotation: ["남은 노출 비중을 일반 replay에 배정해", "기존 분포를 다시 관측하는 기여를 만듭니다."],
            },
            {
              expression: String.raw`\lambda L_d+(1-\lambda)L_g`,
              annotation: ["두 기여를 더해", "optimizer가 줄일 값 하나를 만듭니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`D_d`, name: "Domain corpus distribution", description: "전문 용어·문체·구조를 담은 training corpus입니다." },
            { symbol: String.raw`D_g`, name: "General replay distribution", description: "기존 일반 분포를 부분적으로 다시 보여 주는 corpus입니다." },
            { symbol: String.raw`\ell_{\rm LM}`, name: "Language-model loss", description: "Base pretraining과 호환되는 causal 또는 masked token loss입니다." },
            { symbol: String.raw`\lambda`, name: "Domain mixture weight", description: "0과 1 사이에서 전문 문서의 loss 기여를 정하는 실험 parameter입니다." },
          ]}
          assumptions={[
            "두 corpus의 tokenizer·loss reduction·sequence sampling 단위를 맞춥니다.",
            "λ는 forgetting을 막아 주는 보장값이 아니라 validation할 mixture parameter입니다.",
            "Corpus filtering과 dedup은 manifest가 가리키는 같은 revision에서 수행합니다.",
          ]}
          interpretation="Domain loss 2, general loss 3, λ=0.8이면 mixed loss는 0.8×2+0.2×3=2.2입니다. 이 값이 낮아졌다는 사실만으로 일반 능력이 유지되었다고 말할 수는 없습니다."
        />
      </section>

      <section id="comparable-perplexity" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          3. Perplexity는 같은 token 경계에서만 비교합니다
        </h2>

        <PerplexityChoiceViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            그림에서는 관측한 네 token에 모델이 각각 0.25의 확률을 줍니다. 각 token의
            surprisal은 <code>-log(0.25)=ln 4</code>이고, 네 값을 평균해도
            <code>ln 4</code>입니다. 이를 지수로 되돌리면 perplexity는 4입니다.
          </p>
          <p>
            이 숫자는 모델이 전문 문장을 얼마나 덜 낯설어하는지 추적하는 한 지표입니다.
            다만 tokenizer·normalization·BOS/EOS·context·stride·loss mask가 같아야
            두 checkpoint를 같은 자로 잴 수 있습니다. Perplexity가 낮아져도 사실성,
            downstream task accuracy, 안전성이 자동으로 좋아지는 것은 아닙니다.
          </p>
        </div>

        <ExplainedFormula
          question="Held-out domain corpus의 token 예측 난이도를 어떻게 하나의 수로 만듭니까?"
          idea={(
            <p>
              관측 token의 확률을 음의 log cost로 바꾸고 유효 token 수로 평균한 뒤,
              지수를 취해 perplexity scale로 되돌립니다.
            </p>
          )}
          formula={String.raw`\overline{\mathrm{NLL}}_D=-\frac1{N_D}\sum_{t=1}^{N_D}\log p_\theta(x_t\mid x_{<t}),\qquad\mathrm{PPL}_D=\exp(\overline{\mathrm{NLL}}_D)`}
          annotatedFormula={String.raw`\begin{aligned}s_t&=\underbrace{-\log p_\theta(x_t\mid x_{<t})}_{\text{관측 token의 surprisal}}\\\overline{\mathrm{NLL}}_D&=\underbrace{\frac1{N_D}\sum_{t=1}^{N_D}s_t}_{\text{유효 token당 평균 오차}}\\\mathrm{PPL}_D&=\underbrace{\exp(\overline{\mathrm{NLL}}_D)}_{\text{평균 log 오차를 perplexity로 복원}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`-\log p_\theta(x_t\mid x_{<t})`,
              annotation: ["관측 token의 확률을 log cost로 바꿔", "낮은 확률에 더 큰 오차를 줍니다."],
            },
            {
              expression: String.raw`\sum_t s_t/N_D`,
              annotation: ["유효 token의 surprisal을 모두 더한 뒤", "token 수로 나눠 corpus 크기를 맞춥니다."],
            },
            {
              expression: String.raw`\exp(\overline{\mathrm{NLL}}_D)`,
              annotation: ["평균 log cost에 지수를 취해", "해석할 perplexity scale로 되돌립니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`N_D`, name: "Valid domain tokens", description: "Padding과 masked-out 위치를 제외한 평가 token 수입니다." },
            { symbol: String.raw`p_\theta`, name: "Next-token probability", description: "같은 tokenizer와 prefix에서 관측 token에 준 확률입니다." },
            { symbol: String.raw`\mathrm{PPL}_D`, name: "Domain perplexity", description: "평균 token NLL을 지수로 되돌린 값입니다." },
          ]}
          assumptions={[
            "Tokenizer·normalization·BOS/EOS·context·stride·loss mask가 같습니다.",
            "Held-out corpus와 그 번역·요약·파생물이 training corpus에 없습니다.",
            "낮은 perplexity를 downstream task·factuality·safety의 대리 점수로 쓰지 않습니다.",
          ]}
          interpretation="관측한 모든 token의 평균 NLL이 ln 4면 perplexity는 4입니다. Tokenizer가 다르면 같은 문장을 나누는 단위부터 달라지므로 숫자를 직접 순위로 쓸 수 없습니다."
        />
      </section>

      <section id="forgetting-release" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          4. Domain gain과 general forgetting을 함께 통과시킵니다
        </h2>

        <CheckpointFrontierViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            학습 전 base를 같은 기준점으로 두고, checkpoint마다 domain metric이 얼마나
            올랐는지와 general metric이 얼마나 내려갔는지를 따로 계산합니다. 설명용
            10k checkpoint는 domain +4, general -0.5입니다. 30k는 domain +4.2지만
            general -5이므로 허용 회귀 1을 넘습니다.
          </p>
          <p>
            그래서 마지막 checkpoint를 자동으로 내보내지 않습니다. 목표 gain과
            forgetting gate를 모두 통과한 후보 가운데 10k를 release 후보로 남깁니다.
            비교 조건이 달라졌거나 general suite가 없으면 성공으로 처리하지 않고
            평가 불가 상태로 멈추는 것이 이 흐름의 설계된 실패입니다.
          </p>
        </div>

        <ExplainedFormula
          question="각 checkpoint의 domain 향상과 general forgetting을 어떻게 같은 기준점에서 계산합니까?"
          idea={(
            <p>
              학습 전 base checkpoint에서 각각 빼서 domain gain과 general forgetting을
              분리합니다. 두 gate를 모두 통과한 checkpoint만 release 후보가 됩니다.
            </p>
          )}
          formula={String.raw`G_t=M_d(\theta_t)-M_d(\theta_0),\qquad F_t=M_g(\theta_0)-M_g(\theta_t)`}
          annotatedFormula={String.raw`\begin{aligned}G_t&=\underbrace{M_d(\theta_t)-M_d(\theta_0)}_{\text{base 대비 domain gain}}\\F_t&=\underbrace{M_g(\theta_0)-M_g(\theta_t)}_{\text{base 대비 general forgetting}}\\\operatorname{ship}_t&=\underbrace{\mathbb 1[G_t\ge g_{\min}]\,\mathbb 1[F_t\le\varepsilon]}_{\text{두 gate를 모두 통과}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`M_d(\theta_t)-M_d(\theta_0)`,
              annotation: ["checkpoint와 base의 domain score를 빼서", "adaptation이 만든 gain을 계산합니다."],
            },
            {
              expression: String.raw`M_g(\theta_0)-M_g(\theta_t)`,
              annotation: ["base general score에서 checkpoint score를 빼서", "잃은 일반 능력의 크기를 계산합니다."],
            },
            {
              expression: String.raw`\mathbb 1[G_t\ge g_{\min}]\mathbb 1[F_t\le\varepsilon]`,
              annotation: ["gain과 forgetting 조건을 따로 판정해", "둘 다 참일 때만 release를 허용합니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`\theta_0,\theta_t`, name: "Base and checkpoint", description: "학습 전 weight와 step t에서 저장한 weight입니다." },
            { symbol: String.raw`M_d,M_g`, name: "Domain and general metrics", description: "모두 높을수록 좋은 방향으로 맞춘 평가 지표입니다." },
            { symbol: String.raw`G_t,F_t`, name: "Gain and forgetting", description: "같은 base에서 측정한 개선과 회귀입니다." },
          ]}
          assumptions={[
            "Checkpoint마다 같은 split·decoding·seed aggregation을 씁니다.",
            "General suite 밖의 능력 보존까지 증명하지 않습니다.",
            "Rollback 가능한 checkpoint·optimizer state·corpus revision을 함께 보관합니다.",
          ]}
          interpretation="10k가 domain +4/general -0.5이고 30k가 +4.2/-5라면 forgetting budget 1에서는 10k만 release gate를 통과합니다."
        />

        <div id="paper-dapt" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Gururangan et al. — Don’t Stop Pretraining"
            href="https://aclanthology.org/2020.acl-main.740/"
          >
            RoBERTa의 DAPT·TAPT를 네 domain과 여덟 classification task에서 비교했습니다.
            이 조건부 결과가 모든 LLM·domain에서 continued pretraining의 우월성을
            보장하지는 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-forgetting" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Gu & Feng — Catastrophic Forgetting in Continual NMT"
            href="https://aclanthology.org/2020.coling-main.381/"
          >
            순차 domain training에서 이전 domain 성능 저하를 분석합니다. NMT의 관찰을
            모든 decoder-only model의 동일한 layer 원인으로 일반화하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="return" data-teach-level="5" className="scroll-mt-20">
        <DomainAdaptationMapReturn current="continued-pretraining" />
      </section>

      <section id="review" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">5. 스스로 확인하기</h2>
        <ol className="not-prose space-y-4 border-y border-border py-5 text-sm leading-7">
          <li>
            <strong>전문 문서 비중 0.8, domain loss 2, general loss 3이면 mixed loss는 얼마입니까?</strong>
            <span className="ml-2 text-muted-foreground">(답: 2절)</span>
          </li>
          <li>
            <strong>평균 NLL이 ln 4일 때 perplexity는 얼마이며, tokenizer가 다르면 왜 직접 비교할 수 없습니까?</strong>
            <span className="ml-2 text-muted-foreground">(답: 3절)</span>
          </li>
          <li>
            <strong>10k가 +4/-0.5이고 30k가 +4.2/-5일 때 허용 회귀 1에서 어느 checkpoint를 남깁니까?</strong>
            <span className="ml-2 text-muted-foreground">(답: 4절)</span>
          </li>
        </ol>
      </section>
    </div>
  );
}
