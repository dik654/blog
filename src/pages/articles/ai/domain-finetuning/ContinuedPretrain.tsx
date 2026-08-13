import ExplainedFormula from "@/components/ui/explained-formula";
import ContinuedPretrainViz from "./viz/ContinuedPretrainViz";

export default function ContinuedPretrain() {
  return <section id="continued-pretrain" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">Continued pretraining은 새 사실을 주입하는 버튼이 아니라 corpus 분포를 다시 학습하는 단계입니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>Domain-adaptive pretraining(DAPT)은 넓은 도메인의 unlabeled corpus에서 원래 self-supervised objective를 이어가고, task-adaptive pretraining(TAPT)은 실제 task와 더 가까운 unlabeled input에 집중합니다. 둘 다 정답 label을 직접 학습하는 SFT와 다르며, corpus의 용어·문체·구조가 model의 token prediction 분포에 반복해서 나타나도록 만드는 과정입니다.</p>
      <p>Corpus 양만 늘리면 source 하나의 boilerplate·중복·기관 문체가 gradient를 지배할 수 있습니다. 문서 단위 deduplication, source별 sampling weight, 날짜 cutoff, evaluation 문서와 파생본 제거를 먼저 적용한 뒤, general replay 비율과 update budget을 함께 실험합니다.</p>
    </div>
    <div className="not-prose my-8"><ContinuedPretrainViz /></div>
    <ExplainedFormula
      question="Domain corpus에 적응하면서 general text를 얼마나 함께 보여 줄까요?"
      idea={<>Domain token NLL과 general replay token NLL을 mixture weight λ로 평균합니다. λ가 1이면 domain-only continued pretraining이고, 낮추면 같은 update 안에서 general distribution도 다시 관측합니다.</>}
      formula={String.raw`\begin{aligned}
\mathcal L_{\mathrm{mix}}(\theta)
&=\lambda\,\mathbb E_{x\sim D_d}[\ell_{\mathrm{LM}}(x;\theta)]\\
&\quad +(1-\lambda)\,\mathbb E_{x\sim D_g}[\ell_{\mathrm{LM}}(x;\theta)]
\end{aligned}`}
      terms={[
        { symbol: "Dd", name: "domain corpus distribution", description: "적응하려는 전문 언어·문서 구조를 담은 학습용 unlabeled distribution입니다." },
        { symbol: "Dg", name: "general replay distribution", description: "기존 일반 능력 유지를 확인하거나 학습에 섞는 대표 general distribution입니다." },
        { symbol: "ℓLM", name: "language-model loss", description: "Masked LM 또는 causal next-token NLL처럼 base pretraining과 호환되는 objective입니다." },
        { symbol: "λ", name: "domain mixture weight", description: "한 update budget에서 domain과 general sample이 차지하는 기대 비율입니다." },
      ]}
      assumptions={["두 corpus의 tokenization·loss reduction·sequence-length sampling을 명시합니다.", "General replay가 모든 기존 capability를 대표하지는 않으므로 별도 regression evaluation이 필요합니다.", "λ는 forgetting을 직접 제어하는 보장값이 아니라 validation할 data-mixture parameter입니다."]}
      interpretation="λ를 높이면 domain exposure가 늘지만 중복되고 좁은 corpus에 과적응할 위험도 커집니다. 같은 token budget에서 λ·learning rate·steps를 분리해 ablation해야 어느 요인이 gain과 회귀를 만들었는지 알 수 있습니다."
    />
    <ExplainedFormula
      question="Domain perplexity가 줄었다는 말은 언제 같은 척도로 비교할 수 있을까요?"
      idea={<>유효 target token의 평균 negative log-likelihood를 먼저 계산하고 지수함수로 되돌립니다. 같은 tokenizer·mask·context·reduction을 썼을 때만 두 checkpoint의 숫자를 직접 비교합니다.</>}
      formula={String.raw`\begin{aligned}
\overline{\mathrm{NLL}}_D
&=-\frac{1}{N_D}\sum_{t=1}^{N_D}\log p_\theta(x_t\mid x_{<t})\\
\mathrm{PPL}_D&=\exp(\overline{\mathrm{NLL}}_D)
\end{aligned}`}
      terms={[
        { symbol: "ND", name: "valid domain tokens", description: "Padding·masked-out position을 제외하고 평가에 포함한 target token 수입니다." },
        { symbol: "pθ", name: "next-token probability", description: "동일 prefix와 tokenizer에서 model이 관측 token에 부여한 확률입니다." },
        { symbol: "PPLD", name: "domain perplexity", description: "평균 token NLL을 exponentiation한 domain language-model metric입니다." },
      ]}
      assumptions={["Tokenizer vocabulary·normalization·BOS/EOS·context window·stride와 loss mask가 동일합니다.", "Document 중복과 evaluation contamination을 제거한 held-out domain corpus입니다.", "낮은 perplexity는 downstream 정확도·사실성·안전성을 자동으로 보장하지 않습니다."]}
      interpretation="평균 NLL이 ln 4라면 perplexity는 4입니다. Tokenizer가 다르면 한 단어를 나누는 단위부터 달라지므로 4와 5를 model 품질 순위로 바로 비교할 수 없습니다."
    />
    <ExplainedFormula
      question="Domain gain과 catastrophic forgetting을 checkpoint마다 어떻게 함께 기록할까요?"
      idea={<>같은 base checkpoint θ0를 기준으로 target metric의 향상과 general metric의 하락을 각각 계산합니다. 좋은 checkpoint는 target gain만 큰 것이 아니라 사전에 정한 forgetting budget 안에 있어야 합니다.</>}
      formula={String.raw`\begin{aligned}
G_t&=M_d(\theta_t)-M_d(\theta_0)\\
F_t&=M_g(\theta_0)-M_g(\theta_t)
\end{aligned}`}
      terms={[
        { symbol: "Md", name: "domain metric", description: "Target task·domain slice에서 높을수록 좋은 주지표입니다." },
        { symbol: "Mg", name: "general regression metric", description: "Adaptation 이전에 유지해야 한다고 정한 일반 capability 지표입니다." },
        { symbol: "Gt", name: "domain gain", description: "Checkpoint t가 base보다 개선한 target 성능입니다." },
        { symbol: "Ft", name: "forgetting gap", description: "Base 대비 general metric이 줄어든 양이며 양수일수록 회귀가 큽니다." },
      ]}
      assumptions={["Md와 Mg는 같은 evaluation revision·split·decoding·seed aggregation을 사용합니다.", "Metric마다 방향이 다르면 모두 높을수록 좋은 방향으로 변환해 표기합니다.", "General suite에 없는 capability의 보존까지 증명하지는 않습니다."]}
      interpretation="Domain loss 최저 checkpoint가 최종 선택일 필요는 없습니다. Gt가 포화된 뒤 Ft만 커진다면 더 이른 checkpoint나 낮은 λ·update budget이 더 나은 선택입니다."
    />
    <div id="paper-dapt" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">논문 읽기 · Don’t Stop Pretraining</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Gururangan 등은 RoBERTa의 masked-language-model objective를 biomedical·computer science·news·reviews domain에서 이어가는 DAPT와 task corpus에 집중한 TAPT를 네 domain·여덟 classification task에서 비교했습니다. 이 결과는 해당 corpus·RoBERTa·classification protocol의 조건부 근거이며, 모든 domain에서 continued pretraining이 RAG나 SFT보다 낫다는 뜻은 아닙니다.</p>
      <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://aclanthology.org/2020.acl-main.740/" target="_blank" rel="noreferrer">DAPT·TAPT의 corpus와 실험 범위 보기</a>
    </div>
    <div id="paper-forgetting" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">논문 읽기 · Continual training의 catastrophic forgetting</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Gu와 Feng은 neural machine translation의 순차 domain training에서 이전 domain 성능 저하를 module·parameter 변화 관점으로 분석했습니다. 이 연구는 NMT 조건의 관찰이며 모든 LLM adaptation에서 같은 layer가 같은 역할을 한다는 보장은 아니지만, domain gain만 보고 이전 능력 평가를 생략하면 안 된다는 근거를 제공합니다.</p>
      <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://aclanthology.org/2020.coling-main.381/" target="_blank" rel="noreferrer">분석 대상과 forgetting 결과 범위 보기</a>
    </div>
  </section>;
}
