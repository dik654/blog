import ExplainedFormula from "@/components/ui/explained-formula";
import WeightDecayViz from "./viz/WeightDecayViz";

export default function WeightDecay() {
  return (
    <section id="weight-decay" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Weight decay는 gradient update와 parameter 축소를 분리합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          L2 regularization은 data loss에 parameter 제곱합을 더해 gradient에
          <code> λw</code>를 포함합니다. Plain SGD에서는 이 항이 update마다
          parameter를 줄이는 weight decay와 같은 형태가 되지만, adaptive
          optimizer에서는 gradient가 parameter별 preconditioning을 거치므로 두
          효과가 더 이상 같지 않습니다.
        </p>
        <p>
          AdamW는 decay를 adaptive gradient update와 분리합니다. 이를 통해
          parameter 축소 강도를 optimizer의 moment normalization과 독립적으로
          해석할 수 있습니다. 그렇다고 특정 <code>weight_decay</code> 값이 모든
          model에 표준이라는 뜻은 아니며 learning rate, training length와 함께
          비교해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="왜 plain SGD에서는 L2 penalty와 weight decay가 같은 모양이 될까?"
        idea={<>Data loss에 λ‖w‖²/2를 더하면 gradient에 λw가 생깁니다. SGD가 이 gradient 전체에 같은 scalar LR를 곱하므로 기존 weight는 1−ηλ배로 줄고 data gradient update가 더해집니다.</>}
        formula={String.raw`\begin{aligned}
\mathcal L_{\mathrm{L2}}(w)&=\mathcal L_{\mathrm{data}}(w)+\frac{\lambda}{2}\lVert w\rVert_2^2,\\
\nabla\mathcal L_{\mathrm{L2}}&=g_t+\lambda w_t,\\
w_{t+1}&=(1-\eta_t\lambda)w_t-\eta_tg_t.
\end{aligned}`}
        terms={[
          { symbol: "ℒ_data", name: "data objective", description: "Prediction과 target에서 계산한 원래 training loss입니다." },
          { symbol: "λ", name: "L2/decay coefficient", description: "Parameter norm에 주는 penalty 또는 shrinkage의 강도입니다." },
          { symbol: "g_t", name: "data gradient", description: "L2 penalty를 제외한 data objective의 gradient입니다." },
          { symbol: "1−η_tλ", name: "SGD shrink factor", description: "Update 한 번에서 기존 weight 크기에 직접 곱해지는 축소율입니다." },
        ]}
        assumptions={["Plain SGD처럼 모든 coordinates에 같은 scalar ηt를 적용한 단순 식입니다.", "Momentum·adaptive preconditioning·constraints는 포함하지 않았습니다.", "λ convention은 framework가 loss에 λ/2를 더하는지 λ를 더하는지에 따라 2배 차이가 날 수 있습니다."]}
        interpretation="SGD에서는 penalty gradient와 multiplicative decay가 같은 update로 정리되지만, coordinate별 preconditioner가 있는 Adam에서는 이 등가가 깨집니다."
      />
      <ExplainedFormula
        question="Adam의 L2 penalty와 AdamW의 decoupled decay는 어디에서 갈라질까?"
        idea={<>P_t를 Adam moment가 만든 coordinate별 preconditioner라고 두면, L2는 λw를 data gradient와 함께 P_t에 통과시킵니다. AdamW는 data direction만 precondition하고 weight 축소는 별도 경로로 적용합니다.</>}
        formula={String.raw`\begin{aligned}
w_{t+1}^{\mathrm{Adam+L2}}&=w_t-\eta_tP_t(g_t+\lambda w_t),\\
w_{t+1}^{\mathrm{AdamW}}&=(1-\eta_t\lambda)w_t-\eta_tP_tg_t.
\end{aligned}`}
        terms={[
          { symbol: "P_t", name: "adaptive preconditioner", description: "Adam의 first·second moment로 coordinate별 update scale을 바꾸는 연산의 축약 표기입니다." },
          { symbol: "P_tλw_t", name: "preconditioned penalty", description: "L2 penalty를 gradient에 섞었을 때 moment와 coordinate scaling의 영향을 받는 항입니다." },
          { symbol: "η_tλw_t", name: "decoupled decay", description: "AdamW에서 adaptive gradient와 별도로 기존 parameter를 축소하는 항입니다." },
        ]}
        assumptions={["Pt는 설명을 위한 축약이며 실제 Adam에는 bias correction·epsilon·moment state가 포함됩니다.", "AdamW 구현의 decay가 optimizer state에 누적되지 않는 현재 API를 전제로 합니다.", "모든 parameter에 decay를 적용한다는 뜻은 아니며 param-group policy를 따로 정의합니다."]}
        interpretation="AdamW는 L2라는 이름만 바꾼 것이 아니라 shrinkage 경로를 moment normalization 밖으로 옮깁니다. LR schedule과 λ가 함께 누적 decay를 결정합니다."
      />
      <div className="not-prose my-8"><WeightDecayViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>어떤 parameter를 decay할지도 실험 계약입니다</h3>
        <p>
          Bias와 normalization scale을 no-decay group으로 분리하는 recipe가
          널리 쓰이지만 보편 법칙은 아닙니다. Model의 공식 pretraining recipe를
          출발점으로 삼고, parameter 이름 문자열에 의존하기보다 module type과
          shape를 기준으로 group을 구성한 뒤 누락과 중복을 test합니다.
        </p>
        <p>
          Decay가 너무 크면 training loss부터 충분히 내려가지 않고, 너무 작으면
          baseline과 차이가 없습니다. Parameter norm만 보지 말고 train fit,
          validation metric과 learning-rate schedule을 함께 비교해야 실제
          regularization 효과를 해석할 수 있습니다.
        </p>
      </div>
      <div id="paper-adamw" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Decoupled Weight Decay</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Loshchilov와 Hutter는 standard SGD에서의 L2–decay 등가가 Adam 같은 adaptive optimizer에서는 성립하지 않음을 보이고, weight decay를 loss-gradient update에서 분리한 AdamW를 제안했습니다. 논문의 image-classification 실험이 특정 λ나 no-decay group을 모든 model의 표준으로 정하지는 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1711.05101" target="_blank" rel="noreferrer">두 update의 차이와 실험 범위 보기</a>
      </div>
      <div id="docs-pytorch-adamw" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 따라 읽기 · PyTorch AdamW</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">현재 PyTorch AdamW는 decay가 momentum과 variance에 누적되지 않는다고 명시하며 param group마다 lr·weight_decay와 parameter IDs를 저장합니다. State를 load할 때 parameter 순서를 별도 검증하지 않으므로 group manifest와 coverage test가 필요합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/docs/stable/generated/torch.optim.AdamW.html" target="_blank" rel="noreferrer">현재 algorithm과 state_dict 구조 보기</a>
      </div>
    </section>
  );
}
