import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import BlockContractViz from "./viz/BlockContractViz";

export default function FeedForward() {
  return (
    <section id="transformer-block" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Block 계약: attention은 token을 섞고 FFN은 feature를 바꾸며 residual
        stream에 update를 더한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Attention 뒤의 FFN은 각 token 위치에 같은 parameter를 적용합니다.
          위치끼리 직접 섞지는 않지만 d_model feature를 더 넓은 intermediate
          space로 보내 nonlinear transformation을 수행합니다. Residual은 입력과
          update를 더하므로 sublayer output shape가 d_model로 돌아와야 합니다.
          ReLU·GELU·SwiGLU의 함수와 gate 차이는
          <Link to="/ai/activation-functions"> Activation 정본 글</Link>에서
          이어집니다.
        </p>
      </div>

      <BlockContractViz />

      <ExplainedFormula
        question="Original Transformer의 position-wise FFN은 한 token의 feature를 어떻게 확장하고 되돌리는가?"
        idea={
          <>
            첫 linear projection이 d_model에서 d_ff로 넓히고 activation이
            feature를 비선형으로 선택합니다. 두 번째 projection이 residual
            addition을 위해 다시 d_model로 줄입니다. 같은 W₁·W₂가 모든
            position에 공유됩니다.
          </>
        }
        formula={String.raw`\operatorname{FFN}(x_t)=W_2\,\phi(W_1x_t+b_1)+b_2`}
        terms={[
          {
            symbol: "x_t",
            name: "one token state",
            description: "t번째 위치의 d_model 차원 hidden vector입니다.",
          },
          {
            symbol: "W_1",
            name: "expansion projection",
            description: "d_model→d_ff로 feature space를 넓힙니다.",
          },
          {
            symbol: "\\phi",
            name: "nonlinear activation",
            description:
              "원 논문은 ReLU, 여러 현대 model은 GELU·SiLU 기반 gate 등을 씁니다.",
          },
          {
            symbol: "W_2",
            name: "output projection",
            description:
              "d_ff→d_model로 되돌려 residual stream과 shape를 맞춥니다.",
          },
        ]}
        assumptions={[
          "Original two-linear-layer FFN을 표기했습니다. SwiGLU는 projection 하나와 element-wise gate가 추가됩니다.",
          "d_ff=4d_model은 원 논문의 선택이지 모든 model의 법칙이 아닙니다.",
        ]}
        interpretation="Attention만 반복하면 token 간 weighted averaging에 치우칠 수 있습니다. FFN은 위치별 nonlinear feature transformation을 제공하며 Transformer parameter의 큰 비중을 차지합니다."
      />

      <div id="paper-pre-ln" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · On Layer Normalization in the Transformer Architecture</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">이 분석은 initialization 부근의 gradient behavior를 통해 Post-LN이 warm-up에 더 민감할 수 있는 이유와 Pre-LN의 경로 차이를 설명합니다. 특정 mean-field 가정과 실험 설정의 분석이므로 Pre-LN이 모든 깊이·optimizer·residual variant에서 항상 더 좋은 최종 성능을 보장한다는 뜻은 아닙니다.</p>
      </div>
      <div id="paper-glu" className="not-prose mt-6 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · GLU Variants Improve Transformer</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">논문은 Transformer FFN에서 ReLU/GELU과 여러 gated linear unit을 controlled recipe로 비교해 GEGLU·SwiGLU 계열의 개선을 보고했습니다. 이는 activation 이름 하나의 보편 우월성이 아니라 parameter budget과 FFN 폭을 맞춘 실험 범위의 결과입니다.</p>
      </div>
      <div id="paper-pure-attention-rank" className="not-prose mt-6 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">후속 분석 · Pure attention의 rank collapse</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Pure self-attention을 깊게 쌓을 때 token representation이 uniform해지는 이론적 경향을 분석해 skip connection과 MLP의 역할을 분리합니다. 분석한 simplified attention 조건의 결과이므로 실제 trained Transformer가 반드시 같은 속도로 collapse한다는 예측으로 읽으면 안 됩니다.</p>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          작은 예로 <code>d_model=4</code>, <code>d_ff=8</code>이고 두 linear layer가
          모두 bias를 쓰면 parameter는 <code>4·8+8+8·4+4=76</code>개다. 같은
          FFN을 sequence의 모든 위치에 공유하므로 sequence length는 parameter 수에
          들어가지 않지만, 실제 연산량과 activation memory는 token 수에 비례한다.
        </p>
      </div>

      <ExplainedFormula
        question="Pre-norm과 post-norm은 같은 residual block에서 normalization을 어디에 두는가?"
        idea={
          <>
            Pre-norm은 sublayer에 들어가기 전에 x를 정규화하고 update를 원래 x에
            더합니다. Post-norm은 update를 더한 결과를 정규화합니다. 순서가
            바뀌면 forward representation과 backward Jacobian이 모두 달라집니다.
          </>
        }
        formula={String.raw`\begin{aligned}y_{\mathrm{pre}}&=x+F(\operatorname{Norm}(x))\\y_{\mathrm{post}}&=\operatorname{Norm}(x+F(x))\end{aligned}`}
        terms={[
          {
            symbol: "x",
            name: "residual stream",
            description: "현재 sublayer에 들어오는 d_model hidden state입니다.",
          },
          {
            symbol: "F",
            name: "attention or FFN update",
            description:
              "Residual stream에 더할 학습 가능한 sublayer output입니다.",
          },
          {
            symbol: "Norm",
            name: "normalization",
            description:
              "LayerNorm·RMSNorm 등 feature scale을 다루는 연산입니다.",
          },
        ]}
        assumptions={[
          "Dropout·residual scaling·parallel block 같은 추가 변형은 생략했습니다.",
          "Pre-norm이 모든 깊이와 learning rate에서 자동으로 안정적이라는 뜻은 아닙니다.",
        ]}
        interpretation="원 Transformer는 post-norm이었지만 많은 deep model은 optimization을 위해 pre-norm 또는 변형을 씁니다. Checkpoint를 재현할 때 norm type뿐 아니라 정확한 위치와 residual scaling까지 확인해야 합니다."
      />
    </section>
  );
}
