import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import VizFrame from "@/components/viz/VizFrame";

const experts = [
  { label: "E₁", topic: "공통 표현", load: 7, selected: true },
  { label: "E₂", topic: "수식 패턴", load: 2, selected: false },
  { label: "E₃", topic: "코드 패턴", load: 5, selected: true },
  { label: "E₄", topic: "대화 패턴", load: 2, selected: false },
];

function DenseVsMoeViz() {
  return (
    <VizFrame
      eyebrow="핵심 메커니즘"
      title="같은 token을 모든 FFN에 보내지 않고, 선택한 expert에만 보낸다"
      description="MoE에서 expert는 대개 독립된 FFN branch입니다. Router는 token마다 점수를 계산하고, Top-k expert의 출력만 합칩니다."
      note="그림의 token 단위 routing은 Transformer MoE의 일반적인 형태입니다. Request 하나가 처음부터 끝까지 한 expert에 고정되는 구조로 읽으면 안 됩니다."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <section className="min-w-0">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
            <p className="text-sm font-bold text-foreground">Dense FFN</p>
            <span className="text-xs text-muted-foreground">항상 같은 경로</span>
          </div>
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1.2fr)] items-center gap-3">
            <div className="rounded-lg border border-border bg-background p-4 text-center">
              <p className="text-xs text-muted-foreground">token state</p>
              <p className="mt-1 font-mono text-sm font-bold text-foreground">x</p>
            </div>
            <span aria-hidden className="text-center text-muted-foreground">→</span>
            <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 text-center">
              <p className="text-xs text-muted-foreground">하나의 큰 FFN</p>
              <p className="mt-1 text-sm font-bold text-foreground">항상 계산</p>
            </div>
          </div>
        </section>

        <section className="min-w-0">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
            <p className="text-sm font-bold text-foreground">Sparse MoE FFN</p>
            <span className="text-xs text-muted-foreground">token마다 경로 선택</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-[0.8fr_1.1fr] sm:items-center">
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-background p-3 text-center">
                <p className="font-mono text-sm font-bold text-foreground">x</p>
              </div>
              <div className="rounded-lg border border-primary/40 bg-primary/5 p-3 text-center">
                <p className="text-xs font-bold text-primary">router · Top-2</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {experts.map((expert) => (
                <div
                  key={expert.label}
                  className={
                    expert.selected
                      ? "rounded-lg border border-primary/50 bg-primary/5 p-3"
                      : "rounded-lg border border-border/70 bg-background/70 p-3 text-foreground/45"
                  }
                >
                  <p className="font-mono text-xs font-bold">{expert.label}</p>
                  <p className="mt-1 text-[11px] leading-4">{expert.topic}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </VizFrame>
  );
}

function RouterExampleViz() {
  const rows = [
    { expert: "E₁", logit: "1.6", probability: "0.50", chosen: true },
    { expert: "E₂", logit: "0.4", probability: "0.15", chosen: false },
    { expert: "E₃", logit: "1.2", probability: "0.34", chosen: true },
    { expert: "E₄", logit: "−2.0", probability: "0.01", chosen: false },
  ];

  return (
    <VizFrame
      eyebrow="Routing trace"
      title="Router는 전체 점수를 만든 뒤, Top-k index와 mixture weight를 나눈다"
      description="아래 숫자는 계산 흐름을 보여 주기 위한 예입니다. 실제 구현은 Top-k 전후의 normalization 방식과 bias 사용 여부가 다를 수 있습니다."
      note="선택되지 않은 expert의 출력은 이 token에 대해 계산하지 않습니다. 다만 router score 계산과 token dispatch 자체의 비용은 남습니다."
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="min-w-0 text-xs">
          <div className="grid grid-cols-[2.5rem_1fr_1fr_2.75rem] gap-2 border-b border-border px-1 pb-2 text-[11px] font-semibold text-muted-foreground sm:gap-4 sm:px-3 sm:text-xs">
            <span>expert</span>
            <span>logit</span>
            <span>softmax</span>
            <span>Top-2</span>
          </div>
          {rows.map((row) => (
            <div key={row.expert} className="grid grid-cols-[2.5rem_1fr_1fr_2.75rem] items-center gap-2 border-b border-border/60 px-1 py-3 last:border-0 sm:gap-4 sm:px-3">
              <span className="font-mono font-bold text-foreground">{row.expert}</span>
              <span className="font-mono text-foreground/75">{row.logit}</span>
              <span className="font-mono text-foreground/75">{row.probability}</span>
              <span className={row.chosen ? "font-bold text-primary" : "text-muted-foreground"}>
                {row.chosen ? "선택" : "제외"}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-4">
            <p className="text-xs font-bold text-primary">선택 집합 T₂(x)</p>
            <p className="mt-2 font-mono text-lg font-bold text-foreground">{"{E₁, E₃}"}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs text-muted-foreground">선택 후 다시 합이 1이 되도록 정규화한다면</p>
            <p className="mt-2 font-mono text-sm font-bold text-foreground">0.60·E₁(x) + 0.40·E₃(x)</p>
          </div>
        </div>
      </div>
    </VizFrame>
  );
}

function LoadBalanceViz() {
  return (
    <VizFrame
      eyebrow="Batch ledger"
      title="Expert가 놀거나 과열되는 문제는 평균이 아니라 token 분포에서 보인다"
      description="8개 token을 Top-2로 보내면 assignment는 16개입니다. Expert가 4개라면 균등 목표는 expert당 4개지만, 실제 router는 한두 expert에 몰릴 수 있습니다."
      note="균등 분배 자체가 목적 함수의 정답은 아닙니다. 의미 있는 specialization을 해치지 않으면서 장치별 work와 memory capacity를 넘지 않게 하는 것이 목표입니다."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="rounded-lg border border-border bg-background px-2 py-3 text-center">
              <p className="text-[11px] text-muted-foreground">token</p>
              <p className="mt-1 font-mono text-xs font-bold text-foreground">t{index + 1}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {experts.map((expert) => (
            <div key={expert.label} className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3">
              <span className="font-mono text-xs font-bold text-foreground">{expert.label}</span>
              <div className="h-2 overflow-hidden rounded-sm bg-border/60">
                <div
                  className={expert.load > 4 ? "h-full bg-amber-500" : "h-full bg-primary"}
                  style={{ width: `${Math.min(100, (expert.load / 8) * 100)}%` }}
                />
              </div>
              <span className={expert.load > 4 ? "text-right font-mono text-xs font-bold text-amber-600" : "text-right font-mono text-xs text-muted-foreground"}>
                {expert.load}
              </span>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">균등 목표</p>
              <p className="mt-1 font-mono text-sm font-bold text-foreground">4 / expert</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">최대 load</p>
              <p className="mt-1 font-mono text-sm font-bold text-amber-600">7 / expert</p>
            </div>
          </div>
        </div>
      </div>
    </VizFrame>
  );
}

function SystemCostViz() {
  const rows = [
    ["Model memory", "모든 expert weight", "total parameter에 가까움"],
    ["Token FFN compute", "선택한 k개 expert", "active expert에 가까움"],
    ["Router", "모든 expert score", "expert 수와 함께 증가"],
    ["Network", "dispatch + gather", "token·k·hidden size에 좌우"],
    ["Peak buffer", "가장 붐비는 expert", "평균이 아닌 imbalance에 좌우"],
  ];
  return (
    <VizFrame
      eyebrow="System cost"
      title="Active parameter 한 숫자로는 memory·FLOPs·network를 함께 설명할 수 없다"
      description="Sparse activation이 줄이는 것은 주로 token별 expert FFN 계산입니다. 전체 expert weight를 저장하고 장치 사이로 token을 보내는 비용은 별도 장부로 남습니다."
    >
      <div className="min-w-0 text-xs">
        <div className="hidden grid-cols-[0.8fr_1.2fr_1fr] gap-5 border-b border-border px-3 pb-3 font-semibold text-muted-foreground sm:grid">
          <span>비용 축</span>
          <span>실제 계산·보관</span>
          <span>먼저 볼 숫자</span>
        </div>
        {rows.map(([axis, operation, driver]) => (
          <div key={axis} className="grid gap-2 border-b border-border/60 py-4 last:border-0 sm:grid-cols-[0.8fr_1.2fr_1fr] sm:gap-5 sm:px-3">
            <p className="font-bold text-foreground">{axis}</p>
            <p className="text-foreground/75">{operation}</p>
            <p className="text-muted-foreground">{driver}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

function EvolutionViz() {
  const stages = [
    { year: "2017", title: "Sparsely-Gated MoE", point: "학습 가능한 sparse gate와 expert parallelism" },
    { year: "2020", title: "GShard", point: "Transformer MoE와 자동 sharding" },
    { year: "2021", title: "Switch", point: "Top-1 routing으로 경로 단순화" },
    { year: "2024", title: "DeepSeekMoE", point: "fine-grained routed expert + shared expert" },
    { year: "2026", title: "Kimi K3", point: "LatentMoE로 expert 내부 폭까지 압축" },
  ];
  return (
    <VizFrame
      eyebrow="연구 계보"
      title="MoE의 발전은 expert 수만 늘린 것이 아니라 routing·specialization·system cost를 다시 배분한 과정이다"
      description="각 단계는 앞선 방식을 완전히 대체하는 단일 우열표가 아닙니다. 서로 다른 hardware·training stability·model quality 문제를 푼 설계입니다."
    >
      <ol className="grid gap-5 lg:grid-cols-5">
        {stages.map((stage, index) => (
          <li key={stage.title} className="min-w-0 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-primary">{stage.year}</span>
              <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            </div>
            <p className="mt-3 text-sm font-bold leading-5 text-foreground">{stage.title}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{stage.point}</p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}

function PaperNote({
  id,
  label,
  children,
  href,
}: {
  id: string;
  label: string;
  children: ReactNode;
  href: string;
}) {
  return (
    <div id={id} className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">핵심 논문 · {label}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p>
      <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href={href} target="_blank" rel="noreferrer">
        원문의 방법과 실험 범위 보기
      </a>
    </div>
  );
}

export default function MixtureOfExpertsArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">MoE는 모든 token에 더 큰 계산을 쓰지 않고 model capacity를 늘리는 방법이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Dense Transformer에서는 token마다 같은 feed-forward network(FFN)를 통과합니다. Model을 더 크게 만들려고 FFN 폭을 두 배로 늘리면 모든 token의 계산량도 함께 늘어납니다. Mixture-of-Experts(MoE)는 이 결합을 느슨하게 만듭니다. 여러 FFN branch를 <strong>expert</strong>로 두고, 작은 <strong>router</strong>가 token마다 일부 expert만 선택하기 때문에 저장할 parameter는 늘리면서 token별 계산 증가는 제한할 수 있습니다.
          </p>
          <p className="leading-8">
            여기서 “expert”라는 이름이 특정 분야를 사람처럼 이해한다는 뜻은 아닙니다. 학습 과정에서 서로 다른 token 분포를 더 자주 처리하게 된 parameter branch이며, specialization은 관측과 분석의 대상이지 이름만으로 보장되는 성질이 아닙니다. 또한 routing은 보통 request 단위가 아니라 layer에 들어온 <strong>token state</strong> 단위로 다시 일어납니다.
          </p>
          <p className="leading-8">
            이 글은 MoE를 parameter 절약 기법으로만 소개하지 않습니다. Dense FFN과의 차이에서 출발해 router 계산, Top-k weighted mixture, load balancing, capacity와 overflow, expert parallel communication을 차례로 계산합니다. 마지막에는 total parameter와 active parameter를 왜 memory·FLOPs·latency의 동의어로 쓰면 안 되는지 구분합니다.
          </p>
        </div>

        <DenseVsMoeViz />

        <ExplainedFormula
          question="한 token의 MoE 출력은 선택된 expert 결과를 어떻게 합치는가?"
          idea={<>Router가 expert별 score를 만든 뒤 상위 k개 index 집합만 남기고, 그 expert 출력에 mixture weight를 곱해 더합니다. Dense FFN 하나를 조건부 weighted sum으로 바꾼 셈입니다.</>}
          formula={String.raw`y(x)=\sum_{i\in T_k(x)} p_i(x)E_i(x)`}
          terms={[
            { symbol: "x", name: "token state", description: "현재 MoE layer에 들어온 한 token의 hidden vector입니다." },
            { symbol: "E_i", name: "i번째 expert", description: "대개 자신만의 parameter를 가진 FFN branch입니다." },
            { symbol: "T_k(x)", name: "Top-k 집합", description: "Router score가 큰 k개 expert index입니다." },
            { symbol: "p_i(x)", name: "mixture weight", description: "선택된 expert 출력의 기여도를 정하는 weight입니다." },
            { symbol: "y(x)", name: "MoE output", description: "선택한 expert 출력을 합친 뒤 residual stream으로 돌아갈 vector입니다." },
          ]}
          assumptions={[
            "각 expert 출력 shape이 같아서 element-wise weighted sum을 할 수 있습니다.",
            "식은 한 token을 나타냅니다. 실제 구현은 batch의 token을 expert별 buffer로 모아 GEMM합니다.",
            "Top-k 전후의 normalization, shared expert와 routing bias는 architecture마다 다릅니다.",
          ]}
          interpretation="k가 expert 전체 수 n보다 훨씬 작으면 expert FFN 계산은 sparse해집니다. 그러나 router와 dispatch 비용, 모든 expert weight를 저장하는 memory까지 k/n으로 줄어드는 것은 아닙니다."
        />

        <PaperNote id="paper-sparsely-gated-moe" label="Outrageously Large Neural Networks" href="https://arxiv.org/abs/1701.06538">
          이 논문이 풀려던 문제는 parameter capacity를 늘릴 때 모든 example의 compute가 함께 커지는 문제였습니다. 학습 가능한 noisy sparse gate로 일부 FFN subnetwork만 활성화하고, load-balancing loss와 expert parallelism을 함께 설계한 것이 핵심 기여입니다. LSTM 사이에 MoE layer를 둔 language modeling·translation 실험에서 큰 capacity를 보였지만, 오늘날 모든 Transformer MoE의 최적 router나 품질을 증명한 결과로 넓히면 안 됩니다.
        </PaperNote>

        <ContentBoundary article="mixture-of-experts" />
      </section>

      <section id="routing" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Router는 logit을 만들고, Top-k는 실제 계산 경로를 정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            Router는 token state <code>x</code>에 작은 linear projection을 적용해 expert 수만큼의 logit을 만듭니다. Softmax를 적용하면 expert 선호를 합이 1인 값으로 읽을 수 있지만, 실제 계산을 sparse하게 만드는 단계는 <strong>Top-k selection</strong>입니다. Softmax만 하고 모든 expert를 계산하면 weighted mixture일 뿐 sparse conditional computation은 아닙니다.
          </p>
          <p className="leading-8">
            Top-k index 선택은 경계에서 불연속이므로 보통 선택된 경로를 통해 gradient가 흐르고, 별도의 auxiliary loss나 bias update가 router의 장기적인 균형을 돕습니다. “Top-1이 언제나 더 빠르다”거나 “Top-2가 언제나 더 정확하다”고 단정할 수는 없습니다. Expert GEMM 크기, all-to-all 구현, token batch, capacity policy가 달라지면 같은 k도 system cost가 달라집니다.
          </p>
        </div>

        <RouterExampleViz />

        <ExplainedFormula
          question="Router logit을 비교 가능한 weight와 실제 expert index로 어떻게 바꾸는가?"
          idea={<>Linear score를 softmax해 상대 크기를 유지한 probability를 만들고, 그중 가장 큰 k개를 선택합니다. 일부 구현은 선택한 score만 다시 정규화하고, 다른 구현은 sigmoid score나 routing bias를 사용하므로 식과 config를 함께 봐야 합니다.</>}
          formula={String.raw`\begin{aligned}
            z&=W_r x \\
            p_i&=\frac{e^{z_i}}{\sum_{j=1}^{n}e^{z_j}} \\
            T_k(x)&=\operatorname{TopK}(p,k)
          \end{aligned}`}
          terms={[
            { symbol: "W_r", name: "router projection", description: "Hidden dimension을 n개 expert logit으로 바꾸는 학습 parameter입니다." },
            { symbol: "z_i", name: "router logit", description: "i번째 expert에 대한 정규화 전 score입니다." },
            { symbol: "n", name: "routed expert 수", description: "Router가 후보로 비교하는 expert의 전체 개수입니다." },
            { symbol: "p_i", name: "routing weight", description: "전체 expert에 대한 softmax weight입니다." },
            { symbol: "k", name: "active expert 수", description: "한 token이 실제로 계산할 routed expert 개수입니다." },
          ]}
          assumptions={[
            "표준 softmax Top-k 예시이며 sigmoid routing·group-limited routing 등은 별도 규칙을 가집니다.",
            "Numerical implementation은 max logit을 빼는 stable softmax를 사용합니다.",
            "Shared expert가 있다면 router 선택과 무관하게 추가 계산될 수 있습니다.",
          ]}
          interpretation="Router는 ‘정답 expert’를 분류하는 supervised classifier가 아닙니다. Language-model loss와 balancing signal을 통해 end-to-end로 유용한 경로를 학습합니다."
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>선택된 token은 expert별로 모았다가 다시 원래 순서로 돌아온다</h3>
          <p className="leading-8">
            실제 accelerator에서는 token 하나마다 작은 FFN을 따로 호출하지 않습니다. 먼저 Top-k assignment를 expert별로 정렬해 연속 buffer를 만들고(dispatch), expert FFN을 큰 batched GEMM으로 실행한 뒤, 결과를 원 token position으로 되돌려 합칩니다(gather 또는 combine). Expert가 여러 장치에 나뉘면 이 재배치가 all-to-all network communication이 됩니다.
          </p>
          <h3>Token routing과 sequence routing은 다른 문제다</h3>
          <p className="leading-8">
            한 문장의 앞 token과 뒤 token은 같은 layer에서도 서로 다른 expert를 선택할 수 있고, 같은 token도 layer마다 다른 expert로 이동할 수 있습니다. 따라서 “코드 질문이 코드 expert 하나로 간다”는 설명은 직관으로는 쓸 수 있어도 실제 routing contract로 간주하면 안 됩니다.
          </p>
        </div>
      </section>

      <section id="load-balancing" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">좋은 routing은 점수가 큰 expert만 고르는 것과 load를 감당하는 것을 함께 만족해야 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            Router가 특정 expert만 계속 선택하면 그 expert의 token buffer와 장치가 병목이 되고, 거의 선택되지 않는 expert는 학습 신호를 받지 못합니다. 이를 <strong>expert load imbalance</strong>라고 합니다. Batch에 token이 <code>m</code>개이고 token마다 k개 expert를 선택하면 assignment는 총 <code>mk</code>개이며, n개 expert의 균등 목표는 expert당 <code>mk/n</code>개입니다.
          </p>
          <p className="leading-8">
            그러나 균등 목표는 모든 expert가 같은 의미를 배워야 한다는 뜻이 아닙니다. Specialization 때문에 batch별 분포는 흔들릴 수 있습니다. 운영상 필요한 것은 slowest expert가 step 전체를 지연시키거나 buffer capacity를 넘지 않도록 분포를 관리하면서, router가 language-model objective에 유용한 선택을 유지하는 것입니다.
          </p>
        </div>

        <LoadBalanceViz />

        <ExplainedFormula
          question="Batch가 expert에 완전히 균등하게 배정된다면 expert 하나가 받을 assignment는 몇 개인가?"
          idea={<>전체 assignment 수 mk를 n개 expert가 나눕니다. 이 값은 balancing의 기준선이지 실제 batch마다 반드시 강제해야 하는 정답은 아닙니다.</>}
          formula={String.raw`q=\frac{mk}{n},\qquad \rho_{\max}=\frac{\max_i c_i}{q}`}
          terms={[
            { symbol: "m", name: "token 수", description: "현재 routing batch에 들어온 유효 token 개수입니다." },
            { symbol: "k", name: "Top-k", description: "Token 하나가 만드는 routed assignment 수입니다." },
            { symbol: "n", name: "expert 수", description: "분배 대상 routed expert 개수입니다." },
            { symbol: "q", name: "균등 load", description: "모든 expert가 같은 수를 받는다면 expert당 assignment 수입니다." },
            { symbol: "c_i", name: "실제 expert load", description: "i번째 expert가 받은 assignment 수입니다." },
            { symbol: "\rho_{\max}", name: "peak load ratio", description: "가장 붐비는 expert가 균등 기준의 몇 배인지 보여 줍니다." },
          ]}
          assumptions={[
            "Padding과 masked token을 제외한 실제 routed token을 m으로 셉니다.",
            "Shared expert는 모든 token을 처리하므로 routed load 계산에서 분리합니다.",
            "장치별 처리 시간은 expert load 외에도 GEMM shape·network topology·overlap에 좌우됩니다.",
          ]}
          interpretation="예를 들어 m=8, k=2, n=4이면 q=4입니다. 최대 load가 7이라면 peak ratio는 1.75이고, 평균 compute가 같아도 가장 느린 expert가 step을 끌 수 있습니다."
        />

        <ExplainedFormula
          question="균등 load보다 여유를 둔 expert buffer가 넘치면 몇 개의 assignment를 따로 처리해야 할까요?"
          idea={<>균등 기준 mk/n에 capacity factor φ를 곱해 expert당 buffer 상한을 정하고, 실제 load가 그 상한을 넘은 만큼을 overflow로 셉니다.</>}
          formula={String.raw`\begin{aligned}
            C&=\left\lceil\phi\frac{mk}{n}\right\rceil \\
            o_i&=\max(0,c_i-C)
          \end{aligned}`}
          terms={[
            { symbol: "phi", name: "capacity factor", description: "균등 load보다 buffer를 얼마나 넉넉하게 잡을지 정하는 1 이상의 배수입니다." },
            { symbol: "C", name: "expert capacity", description: "한 expert buffer가 이번 batch에서 받을 수 있는 assignment 상한입니다." },
            { symbol: "c_i", name: "actual load", description: "Router가 i번째 expert에 실제로 보낸 assignment 수입니다." },
            { symbol: "o_i", name: "overflow", description: "Capacity를 넘어 drop·reroute·추가 buffer 중 하나의 정책이 필요한 assignment 수입니다." },
          ]}
          assumptions={[
            "Capacity를 batch 전체 또는 expert-parallel group 중 어느 단위로 계산하는지 구현 계약에 명시합니다.",
            "Drop과 reroute는 model quality와 routing semantics를 바꾸며, buffer 확장은 memory·padding cost를 늘립니다.",
            "Capacity factor를 크게 잡아도 load imbalance와 all-to-all tail latency가 자동으로 사라지지는 않습니다.",
          ]}
          interpretation="m=128, k=2, n=8이면 균등 load는 32입니다. φ=1.25라면 C=40이고 실제 load가 46인 expert에는 overflow 6개가 생깁니다. 이 6개를 drop할지 다른 expert로 보낼지, buffer를 더 키울지는 quality와 memory를 함께 보고 정합니다."
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Auxiliary loss, routing bias, capacity는 서로 다른 개입 지점이다</h3>
          <p className="leading-8">
            Auxiliary load-balancing loss는 language-model loss에 균형 항을 더해 router gradient를 바꿉니다. 반면 auxiliary-loss-free 방식의 routing bias는 선택 score에 별도 bias를 더하고 실제 mixture weight에서는 제외하는 식으로 분배만 조정할 수 있습니다. Capacity factor는 expert buffer에 받을 수 있는 token 수를 미리 정하며, 넘친 assignment를 drop하거나 다른 expert로 보내는 overflow policy가 뒤따릅니다.
          </p>
          <p className="leading-8">
            균형 항을 지나치게 키우면 token 내용보다 균등 분배를 우선해 specialization을 해칠 수 있고, capacity를 너무 작게 잡으면 중요한 token 경로가 drop됩니다. 반대로 capacity를 넉넉히 잡으면 memory와 padding waste가 늘어납니다. 그러므로 router entropy 하나만 보지 말고 expert별 token count, dropped-token rate, per-expert GEMM size, all-to-all time과 task quality를 함께 측정해야 합니다.
          </p>
        </div>

        <PaperNote id="paper-switch-transformer" label="Switch Transformers" href="https://arxiv.org/abs/2101.03961">
          Switch Transformer가 풀려던 문제는 MoE의 routing·communication·training instability가 실제 확장을 어렵게 만든다는 점이었습니다. Token을 Top-1 expert로 보내 경로를 단순화하고 capacity·load balancing·lower-precision training recipe를 함께 제시했습니다. T5 계열과 논문의 hardware·data 조건에서 얻은 pretraining speed·quality 결과이므로, Top-1이 모든 batch size와 serving runtime에서 Top-2보다 낫다는 일반 법칙은 아닙니다.
        </PaperNote>
      </section>

      <section id="system-cost" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Total parameter, active parameter, FLOPs, 통신량은 네 개의 다른 장부다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            Model card의 “전체 600B, 활성 40B” 같은 표기는 capacity와 token별 경로를 빠르게 비교하는 데 유용하지만, GPU memory와 latency를 직접 알려 주지는 않습니다. 모든 expert weight를 동시에 올려야 한다면 weight memory는 total parameter에 가깝고, token별 expert FFN multiply-add는 active expert에 가깝습니다. 여기에 shared attention·embedding·router·normalization과 communication이 더해집니다.
          </p>
          <p className="leading-8">
            특히 expert parallelism에서는 token state를 expert가 있는 장치로 보내고 다시 가져옵니다. Dense model에서 주로 tensor-parallel collective를 고민했다면 MoE에서는 dispatch·all-to-all·combine의 message size와 장치별 imbalance가 새로운 병목이 됩니다. Active parameter가 작아도 작은 batch에서 expert GEMM이 조각나거나 network overlap이 실패하면 latency는 낮아지지 않을 수 있습니다.
          </p>
        </div>

        <SystemCostViz />

        <ExplainedFormula
          question="Expert 수 n과 Top-k k가 parameter 장부를 어떻게 갈라놓는가?"
          idea={<>모든 token이 공유하는 parameter와 expert 하나의 parameter를 분리하면, 전체 저장량에는 n개를 더하고 token별 활성 경로에는 k개만 더할 수 있습니다.</>}
          formula={String.raw`\begin{aligned}
            P_{\mathrm{total}}&\approx P_{\mathrm{shared}}+nP_e \\
            P_{\mathrm{active}}&\approx P_{\mathrm{shared}}+kP_e
          \end{aligned}`}
          terms={[
            { symbol: "P_{\mathrm{shared}}", name: "공유 parameter", description: "Attention·embedding·normalization·shared expert처럼 모든 token이 쓰는 parameter입니다." },
            { symbol: "P_e", name: "expert 하나의 parameter", description: "같은 폭을 가정한 routed expert FFN 하나의 parameter 수입니다." },
            { symbol: "n", name: "전체 expert 수", description: "Checkpoint가 저장하는 routed expert 개수입니다." },
            { symbol: "k", name: "활성 expert 수", description: "Token 하나가 해당 layer에서 선택하는 routed expert 개수입니다." },
          ]}
          assumptions={[
            "모든 routed expert가 같은 크기라는 근사입니다.",
            "Active parameter는 실제 FLOPs가 아닙니다. Operation 종류와 reuse, sequence length, quantization을 생략했습니다.",
            "Shared expert가 있다면 Pshared와 active path 양쪽에 포함해야 합니다.",
          ]}
          interpretation="n을 늘리고 k를 유지하면 total capacity를 크게 늘리면서 token별 expert 경로는 비슷하게 유지할 수 있습니다. 대신 weight memory와 routing·communication complexity는 커집니다."
        />

        <ExplainedFormula
          question="Expert parallel 장치 사이로 최소한 어느 정도의 token payload가 이동하는가?"
          idea={<>Token m개를 k개 expert로 복제해 hidden vector를 보내고 결과를 다시 받는다면, routing metadata와 protocol overhead를 빼도 forward payload는 두 방향에서 생깁니다.</>}
          formula={String.raw`B_{\mathrm{dispatch+gather}}\gtrsim 2mkdb`}
          terms={[
            { symbol: "m", name: "routed token 수", description: "한 MoE layer의 현재 batch에서 이동하는 token 수입니다." },
            { symbol: "k", name: "expert fan-out", description: "Token당 destination expert 개수입니다." },
            { symbol: "d", name: "hidden width", description: "장치 사이로 전달하는 token vector의 component 수입니다." },
            { symbol: "b", name: "component byte", description: "BF16이면 보통 2 byte처럼 payload datatype의 byte 수입니다." },
            { symbol: "B", name: "payload lower estimate", description: "보내기와 되돌리기를 합친 최소 data 규모의 근사입니다." },
          ]}
          assumptions={[
            "모든 assignment가 원격 장치로 간다고 본 보수적인 구조식이며 local expert 비율은 생략했습니다.",
            "Index·padding·alignment·collective protocol overhead와 compression은 포함하지 않았습니다.",
            "실제 latency는 bandwidth만이 아니라 message 크기, topology, congestion과 compute overlap에 좌우됩니다.",
          ]}
          interpretation="m=2048, k=2, d=4096, b=2라면 payload 항만 약 64 MiB입니다. 이 값이 곧 wire traffic이나 시간은 아니지만, k와 hidden width가 network budget을 직접 키운다는 사실은 보여 줍니다."
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Serving에서는 average보다 tail과 locality를 본다</h3>
          <p className="leading-8">
            Batch가 작으면 선택된 expert마다 token이 몇 개 없어 GEMM 효율이 떨어지고, batch가 커지면 all-to-all payload와 hot expert queue가 커질 수 있습니다. Expert placement, replica, node-limited routing, communication–compute overlap은 이 trade-off를 다루는 system policy입니다. 따라서 model architecture 비교에서는 active parameter뿐 아니라 실제 batch·parallel layout에서 expert load histogram과 collective time을 함께 공개해야 합니다.
          </p>
        </div>

        <PaperNote id="paper-gshard" label="GShard" href="https://arxiv.org/abs/2006.16668">
          GShard의 핵심 문제는 수백 billion parameter의 conditional computation을 수천 accelerator에 표현하고 분할하는 일이었습니다. Sharding annotation과 compiler transformation을 도입하고 Transformer의 Top-2 MoE를 2,048 TPU에 배치해 multilingual translation을 평가했습니다. 논문의 기여는 model layer뿐 아니라 distributed compilation·sharding에 있으므로, 600B라는 규모만 떼어 MoE 품질의 보편적 우위를 주장하면 안 됩니다.
        </PaperNote>
      </section>

      <section id="evolution" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최근 설계는 더 많은 expert보다 중복을 줄이고 조합을 세밀하게 만드는 쪽으로 확장됐다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            초기 sparse MoE가 conditional computation을 실제 cluster에서 작동시키는 데 집중했다면, GShard와 Switch는 Transformer·distributed routing의 복잡도를 다뤘습니다. DeepSeekMoE는 routed expert를 더 작은 단위로 나눠 조합 수를 늘리고, 모든 token이 쓰는 shared expert를 따로 두어 공통 지식이 여러 routed expert에 반복되는 문제를 줄이려 했습니다.
          </p>
          <p className="leading-8">
            이 계보를 “새 모델이 이전 모델보다 무조건 낫다”는 순위표로 보면 안 됩니다. Top-1·Top-2·shared expert·fine-grained expert는 quality, specialization, router stability, GEMM shape, network topology 사이에서 서로 다른 예산 배분을 선택합니다. 동일한 total parameter만 맞추거나 active parameter만 맞춘 비교로는 어느 구성 요소가 이득을 만들었는지 분리하기 어렵습니다.
          </p>
        </div>

        <EvolutionViz />

        <PaperNote id="paper-deepseekmoe" label="DeepSeekMoE" href="https://arxiv.org/abs/2401.06066">
          DeepSeekMoE가 제기한 문제는 conventional Top-k expert가 서로 겹치는 지식을 반복해서 배울 수 있다는 점입니다. Expert를 더 잘게 나눠 더 많은 조합을 만들고, 공통 지식을 담당하는 shared expert를 routed expert에서 분리한 것이 핵심입니다. 2B·16B와 preliminary 145B 조건의 비교 결과는 이 설계의 가능성을 보여 주지만, expert specialization이 언제나 사람이 해석할 수 있는 domain으로 분리된다거나 모든 hardware에서 같은 efficiency를 얻는다는 뜻은 아닙니다.
        </PaperNote>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Kimi K3의 LatentMoE는 이 정본 위에서 읽는다</h3>
          <p className="leading-8">
            Kimi K3는 routed/shared expert 구분에 더해 expert가 받는 표현을 작은 latent dimension으로 내렸다가 다시 올리는 LatentMoE를 사용합니다. 이는 MoE의 기본 정의가 아니라 K3가 width 방향의 비용을 다시 배분한 확장입니다. KDA·Attention Residuals와 함께 어떤 계산을 줄이고 무엇을 추가했는지는 <Link to="/ai/kimi-k3-architecture#stable-latent-moe">Kimi K3 아키텍처 글</Link>에서 이어서 다룹니다.
          </p>
          <h3>모델을 비교할 때 남겨야 할 최소 ledger</h3>
          <p className="leading-8">
            전체·활성 parameter, routed/shared expert 수, Top-k, expert FFN shape, router normalization과 bias, capacity·overflow policy, auxiliary loss, expert-parallel topology, per-expert token histogram을 함께 기록합니다. 이 항목이 빠지면 “MoE라서 빠르다”는 말이 training compute인지 serving latency인지, weight memory인지 network cost인지 확인할 수 없습니다.
          </p>
        </div>
      </section>
    </>
  );
}
