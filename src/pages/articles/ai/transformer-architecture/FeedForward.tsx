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
        <h3 id="ffn-block" className="scroll-mt-20">
          FFN은 attention이 섞은 token을 각 위치 안에서 다시 비선형으로
          가공한다
        </h3>
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
        annotatedFormula={String.raw`\operatorname{FFN}(x_t)=\underbrace{W_2\,\phi(W_1x_t+b_1)+b_2}_{\text{nonlinear activation 계산}}`}
        operations={[
          { expression: String.raw`W_2\,\phi(W_1x_t+b_1)+b_2`, annotation: ["nonlinear activation이(가) 식의 결과에","기여하는 방식을 계산합니다.","첫 linear projection이 d_model에서","d_ff로 넓히고 activation이 feature를"] },
        ]}
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

        <h3 id="model-shape" className="scroll-mt-20">
          Model 크기는 width·depth 두 축으로 자란다
        </h3>
        <p className="leading-8">
          Model 크기는 폭(width)과 깊이(depth)라는 서로 다른 두 축으로
          커집니다. Width는 각 위치의 hidden vector 차원인 d_model(hidden
          dimension)이고, depth는 그 block을 몇 번 쌓는지 정하는 layer
          수(model depth)입니다.
        </p>
        <p className="leading-8">
          예를 들어 d_model=4096, layer 32개, head 32개(head dimension
          128)인 decoder-only model을 생각해 봅시다. Attention 한 layer의
          W_Q·W_K·W_V·W_O 네 d×d 행렬은 4d²≈6,710만 개이고, d_ff=4d_model인
          FFN의 두 행렬은 8d²≈1억 3,420만 개이므로 layer 하나가 12d²≈2억
          130만 개를 씁니다.
        </p>
        <p className="leading-8">
          32개 layer를 쌓으면 약 64.4억 개, 여기에 vocabulary 128,000개 ×
          d_model 4096의 embedding table 약 5.24억 개를 더하면 약 70억 개,
          흔히 7B급이라 부르는 규모에 가까워집니다. 이 계산은 classic
          d_ff=4d_model 가정의 근사이며 SwiGLU처럼 다른 배수를 쓰는
          실제 model의 공개 parameter 수와는 다를 수 있습니다.
        </p>
        <p className="leading-8">
          같은 12d² 예산이라도 d_model을 늘려 폭을 넓히거나 layer 수를 늘려
          깊이를 더할 수 있습니다. 폭을 넓히면 한 층이 한 번에 표현하는
          관계가 늘지만 attention·FFN 연산량은 d²에 비례해 빠르게 커지고,
          깊이를 늘리면 같은 폭에서 함수를 여러 번 합성해 표현력을 쌓지만
          층이 깊어질수록 residual stream을 타고 흐르는 gradient가 불안정해지기
          쉽습니다. 이 맞바꿈이 depth-width tradeoff입니다.
        </p>

        <h3 id="residual-stream" className="scroll-mt-20">
          Residual 덧셈이 쌓여 만드는 공유 통로가 residual stream이다
        </h3>
        <p className="leading-8">
          Residual connection은 sublayer가 낸 update F(x)로 state를 덮어
          쓰는 대신 입력 x에 그대로 더해 y=x+F(x)를 만드는 shortcut입니다.
          Block마다 이 덧셈이 반복되며 쌓이는 하나의 누적 vector를 모든
          layer가 읽고 쓰는 공유 통로로 보는 관점을 residual stream이라
          부릅니다.
        </p>
        <p className="leading-8">
          역전파에서 y=x+F(x)의 x에 대한 Jacobian은 I+∂F/∂x로, 항등 항 I가
          그대로 남아 F가 작아도 gradient가 완전히 사라지지 않습니다.
        </p>
        <p className="leading-8">
          예를 들어 32개 layer 각각의 update가 gradient를 0.9배로 줄인다면,
          residual 없이 F만 곱했을 때는 0.9³²≈0.034로 3.4%만 남습니다.
          Identity 항이 있는 residual 경로는 각 layer가 최소 1배를 보존해
          32개 layer를 지나도 최초 gradient 크기가 유지됩니다.
        </p>
        <p className="leading-8">
          Pre-norm은 F 앞에 normalization을 둬 sublayer가 항상 정규화된
          입력을 보게 하고 update 자체의 초기 크기를 작게 유지시켜, 깊은
          network에서 이 identity 경로의 이점이 학습 초반부터 안정적으로
          작동하게 만듭니다. Post-norm은 덧셈 결과를 정규화하므로 residual
          stream의 raw scale이 layer마다 달라져 warm-up 없이는 초기
          gradient가 더 크게 흔들립니다.
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
        annotatedFormula={String.raw`\begin{aligned}y_{\mathrm{pre}}&=\underbrace{x+F(\operatorname{Norm}(x))}_{\text{normalization 계산}}\\y_{\mathrm{post}}&=\underbrace{\operatorname{Norm}(x+F(x))}_{\text{normalization 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`x+F(\operatorname{Norm}(x))`, annotation: ["normalization이(가) 식의 결과에 기여하는 방식을","계산합니다.","Pre-norm은 sublayer에 들어가기 전에 x를","정규화하고 update를 원래 x에 더합니다."] },
          { expression: String.raw`\operatorname{Norm}(x+F(x))`, annotation: ["normalization이(가) 식의 결과에 기여하는 방식을","계산합니다.","Pre-norm은 sublayer에 들어가기 전에 x를","정규화하고 update를 원래 x에 더합니다."] },
        ]}
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

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="rmsnorm" className="scroll-mt-20">
          Norm 자리에는 대부분 LayerNorm이 아니라 RMSNorm이 들어간다
        </h3>
        <p className="leading-8">
          위 식의 Norm 자리에 실제로 들어가는 함수는 오늘날 대부분 LayerNorm이
          아니라 RMSNorm입니다. RMSNorm은 평균을 빼지 않고 vector의
          제곱평균(root mean square)으로만 나눈 뒤 학습 가능한 scale γ를
          곱합니다.
        </p>
      </div>

      <ExplainedFormula
        question="RMSNorm은 LayerNorm과 달리 어떤 통계량 하나만으로 정규화하는가?"
        idea={
          <>
            평균을 빼는 대신 각 feature의 제곱을 평균 내 root mean square를
            구하고, 그 값으로 vector를 나눈 뒤 학습 가능한 scale을 곱합니다.
            평균과 분산 두 reduction이 필요했던 LayerNorm과 달리 제곱평균
            하나만 계산합니다.
          </>
        }
        formula={String.raw`\operatorname{RMSNorm}(x)=\frac{x}{\sqrt{\frac{1}{d}\sum_{i=1}^{d}x_i^2+\epsilon}}\odot\gamma`}
        annotatedFormula={String.raw`\operatorname{RMSNorm}(x)=\frac{x}{\underbrace{\sqrt{\frac{1}{d}\sum_{i=1}^{d}x_i^2+\epsilon}}_{\text{제곱평균 정규화}}}\odot\underbrace{\gamma}_{\text{학습 가능한 scale}}`}
        operations={[
          { expression: String.raw`\frac{1}{d}\sum_{i=1}^{d}x_i^2`, annotation: ["Feature별 제곱을 평균 내", "vector 전체 크기의 척도를 만듭니다"] },
          { expression: String.raw`\odot\gamma`, annotation: ["정규화된 vector에", "feature별 학습 가능한 scale을 곱합니다"] },
        ]}
        terms={[
          { symbol: "x", name: "입력 vector", description: "정규화할 d_model 차원의 hidden state입니다." },
          { symbol: "d", name: "feature 차원 수", description: "제곱평균을 낼 때 나누는 기준량입니다." },
          { symbol: String.raw`\epsilon`, name: "안정화 상수", description: "제곱평균이 0에 가까울 때 나눗셈이 발산하지 않도록 더하는 작은 값입니다." },
          { symbol: String.raw`\gamma`, name: "학습 가능한 scale", description: "Feature마다 따로 학습되는 곱셈 parameter이며 LayerNorm과 달리 bias는 없습니다." },
        ]}
        assumptions={[
          "평균을 빼지 않으므로 입력이 이미 0 근처에 있지 않으면 LayerNorm과 다른 scale을 만들 수 있습니다.",
          "Bias 항 없이 scale만 학습한다는 점이 LayerNorm과의 parameter 차이입니다.",
        ]}
        interpretation="Reduction 연산이 하나 줄어 GPU에서 더 적은 동기화·메모리 접근으로 계산할 수 있어 LLaMA·PaLM 계열을 포함한 최근 대형 model 다수가 LayerNorm 대신 RMSNorm을 씁니다. 속도 차이의 크기는 model·hardware·kernel 구현마다 다릅니다."
      />

      <div
        id="paper-rmsnorm"
        className="not-prose mt-6 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · Root Mean Square Layer Normalization</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          평균을 빼는 연산 없이 제곱평균만으로 재정규화해도 LayerNorm과 비슷한
          안정화 효과를 내면서 reduction 연산과 실행 시간을 줄일 수 있음을
          여러 model·task 실험으로 보였습니다. 모든 architecture·규모에서
          LayerNorm을 완전히 대체해야 한다는 결론은 아닙니다.
        </p>
      </div>
    </section>
  );
}
