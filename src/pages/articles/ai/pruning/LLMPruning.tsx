import ExplainedFormula from "@/components/ui/explained-formula";
import LLMPruningViz from "./viz/LLMPruningViz";

export default function LLMPruning() {
  return (
    <section id="llm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SparseGPT와 Wanda는 calibration activation으로 “이 weight가 실제 layer output에 미치는 영향”을 근사합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          수십억 parameter의 LLM을 원래 training recipe로 다시 학습하기 어렵기 때문에 one-shot pruning은 작은 calibration sample로 layer를 하나씩 처리합니다. 여기서 calibration text는 정답 label을 주기보다 각 linear layer에 들어오는 activation <code>X</code>를 관측하는 역할을 합니다. 따라서 언어·domain·sequence length·prompt format이 좁으면 그 sample에서 조용했던 channel을 실제 traffic에서도 중요하지 않다고 잘못 판단할 수 있습니다.
        </p>
        <p>
          SparseGPT와 Wanda는 같은 목표를 다른 계산 비용으로 근사합니다. SparseGPT는 weight를 지운 뒤 남은 weight를 보정해 원래 layer output을 재구성하고, Wanda는 각 weight의 크기에 대응 input channel의 activation norm을 곱해 update 없이 작은 score부터 제거합니다.
        </p>
      </div>
      <ExplainedFormula
        question="SparseGPT가 개별 weight 차이 대신 layer output reconstruction을 푸는 이유는 무엇일까요?"
        idea={<>같은 weight 오차라도 calibration input이 자주 사용하는 방향에 놓이면 output을 크게 바꿉니다. Mask 제약 안에서 원래 출력 <code>XW</code>와 pruned 출력의 차이를 줄이면 activation-sensitive한 보정이 됩니다.</>}
        formula={String.raw`\min_{M,\widehat W}\ \left\lVert XW-X(M\odot\widehat W)\right\rVert_F^2\qquad \text{s.t.}\qquad \lVert M\rVert_0\le (1-s)N`}
        terms={[
          { symbol: "X", name: "calibration activations", description: "현재 linear layer에 representative text를 통과시켜 얻은 input matrix입니다." },
          { symbol: "W", name: "original weights", description: "Pruning 전 layer의 dense weight matrix입니다." },
          { symbol: "M", name: "pruning mask", description: "Sparsity budget 안에서 남길 weight 위치입니다." },
          { symbol: "W-hat", name: "compensated weights", description: "일부 weight를 제거한 뒤 reconstruction error를 줄이도록 보정한 남은 값입니다." },
          { symbol: "F norm", name: "output error", description: "Calibration row와 output channel 전체의 제곱 오차 합입니다." },
        ]}
        assumptions={[
          "현재 layer의 calibration reconstruction proxy이며 전체 autoregressive task loss와 동일하지 않습니다.",
          "SparseGPT의 실제 구현은 Hessian inverse 근사·block update·damping·ordering으로 이 조합 문제를 효율적으로 근사합니다.",
          "Calibration distribution 밖의 language·length·generation state와 target sparse kernel 성능은 별도 검증합니다.",
        ]}
        interpretation="두 weight를 똑같이 .1 바꾸더라도 X의 한 input channel norm이 열 배 크면 그 방향의 output error가 훨씬 큽니다. SparseGPT는 지우는 순서와 남은 weight 보정에 이 상호작용을 반영합니다."
      />
      <ExplainedFormula
        question="Wanda는 second-order reconstruction 없이 activation을 어떻게 score에 넣을까요?"
        idea={<>Output <code>j</code>로 들어가는 weight의 크기와 그 weight가 곱해지는 input channel <code>i</code>의 calibration norm을 곱합니다. 큰 activation이 자주 들어오는 연결의 작은 weight도 보호할 수 있습니다.</>}
        formula={String.raw`I_{ij}=\lvert W_{ij}\rvert\,\lVert X_{:i}\rVert_2,\qquad \text{prune the smallest }I_{ij}\text{ within each output group}`}
        terms={[
          { symbol: "W_ij", name: "one connection", description: "Input channel i에서 output channel j로 가는 weight입니다." },
          { symbol: "X_:i", name: "channel activations", description: "Calibration token 전체에서 input channel i가 가진 값의 column입니다." },
          { symbol: "I_ij", name: "Wanda importance", description: "Weight magnitude와 input usage를 결합한 pruning score입니다." },
          { symbol: "output group", name: "comparison scope", description: "논문의 per-output basis처럼 서로 순위를 비교하는 local 범위입니다." },
        ]}
        assumptions={[
          "Activation norm은 calibration sample과 token count·masking에 의존하므로 exact collection recipe를 고정합니다.",
          "단일 곱 score는 여러 weight를 함께 제거한 뒤의 compensation과 second-order interaction을 풀지 않습니다.",
          "Wanda는 pruning method이며 sparse format·kernel·runtime speedup을 자동으로 제공하지 않습니다.",
        ]}
        interpretation="Weight가 .2인 두 연결에서 activation norm이 각각 1과 10이면 score는 .2와 2입니다. Magnitude만 보면 동률이지만 Wanda는 두 번째 연결을 더 중요하게 봅니다."
      />
      <div className="not-prose my-8">
        <LLMPruningViz />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div id="paper-sparsegpt" className="not-prose scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · SparseGPT</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            핵심 기여는 대형 GPT-family model을 재학습하지 않고 layer-wise approximate second-order reconstruction으로 pruning하는 방법입니다. 논문은 OPT·BLOOM과 WikiText·zero-shot task, 당시 hardware·implementation에서 50–60% unstructured 및 2:4·4:8을 평가했습니다. “Minimal loss”와 처리 시간은 그 model·calibration·metric 범위의 결과입니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2301.00774" target="_blank" rel="noreferrer">
            Layer update·Hessian 근사·평가 범위 보기
          </a>
        </div>
        <div id="paper-wanda" className="not-prose scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · Wanda</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            핵심 기여는 weight update나 Hessian inverse 없이 magnitude와 input activation norm만으로 per-output pruning score를 만드는 것입니다. LLaMA·LLaMA-2와 논문의 language benchmark에서 magnitude baseline 및 SparseGPT 계열과 비교했으며, 그 결과가 모든 최신 architecture·multilingual traffic·sparse runtime의 우위를 보장하지는 않습니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2306.11695" target="_blank" rel="noreferrer">
            Per-output score·calibration·실험 범위 보기
          </a>
        </div>
      </div>
    </section>
  );
}
