import ExplainedFormula from "@/components/ui/explained-formula";
import M from "@/components/ui/math";
import YarnBandDecisionViz from "./viz/YarnBandDecisionViz";

export default function YarnMethod() {
  return (
    <section id="yarn-method" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        YaRN은 frequency band와 attention scale을 함께 조정한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          YaRN의 첫 번째 구성 요소는 NTK-by-parts다. 각 RoPE 차원의 파장과 원래
          context length를 비교한 뒤, 저주파에는 interpolation을 적용하고
          고주파에는 원래 frequency를 더 많이 남긴다. 두 영역 사이에서는 ramp
          function으로 부드럽게 전환한다.
        </p>
      </div>

      <ExplainedFormula
        question="각 RoPE 차원이 pretraining에서 본 회전 수에 따라 scaling 강도를 다르게 정하려면?"
        idea={<>rᵢ=L/λᵢ로 원래 context 안의 회전 횟수를 계산합니다. 거의 회전하지 않은 저주파는 interpolation하고, 여러 번 회전한 고주파는 그대로 두며, 사이는 linear ramp로 연결합니다.</>}
        formula={String.raw`\begin{aligned}r_i&=\frac{L}{\lambda_i}\\[3pt]\gamma_i&=\operatorname{clip}\!\left(\frac{r_i-\beta_{\rm slow}}{\beta_{\rm fast}-\beta_{\rm slow}},0,1\right)\\[3pt]\theta_i'&=(1-\gamma_i)\frac{\theta_i}{s}+\gamma_i\theta_i\end{aligned}`}
        terms={[
          { symbol: "r_i", name: "observed rotations", description: "pretraining context L 안에서 i번째 RoPE pair가 돈 횟수입니다." },
          { symbol: "\\gamma_i", name: "ramp weight", description: "0이면 전부 interpolation, 1이면 원래 frequency를 그대로 사용합니다." },
          { symbol: "\\beta_{\\rm slow},\\beta_{\\rm fast}", name: "band boundaries", description: "대표 구현 기본값은 각각 1과 32지만 모델별 실험값으로 봐야 합니다." },
          { symbol: "\\theta_i'", name: "YaRN frequency", description: "보간 frequency θi/s와 원래 θi의 weighted blend입니다." },
        ]}
        assumptions={["논문의 NTK-by-parts linear ramp를 구현 친화적으로 쓴 식입니다.", "β 값은 보편적인 수학 상수가 아니라 LLaMA 계열에서 검증한 기본값입니다."]}
        interpretation="YaRN의 핵심은 ‘전체 position을 한 번에 줄인다’가 아니라, 각 frequency가 pretraining에서 맡았던 역할을 추정해 scaling을 선택하는 것입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          원 논문과 대표 구현은 전환 경계에 <code>beta_slow=1</code>,
          <code>beta_fast=32</code>를 사용한다. 이것은 수학적 상수가 아니라
          논문에서 검증한 기본값이며, 라이브러리와 model config가 다른 값을
          지정할 수 있다.
        </p>
      </div>

      <YarnBandDecisionViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>두 번째 구성 요소는 attention scaling이다</h3>
        <p>
          Sequence가 길어지면 한 query가 비교할 key가 늘면서 attention
          distribution의 entropy가 달라질 수 있다. YaRN은 RoPE의 cosine·sine
          값에 attention factor를 곱해 attention logit scale을 보정한다. 대표
          구현은 factor <M>{"s>1"}</M>일 때 다음 기본값을 사용한다.
        </p>
      </div>

      <ExplainedFormula
        question="context가 길어지며 달라진 attention entropy를 logit scale로 어떻게 보정할까?"
        idea={<>softmax 전에 temperature t를 두고, query와 key 양쪽의 rotary embedding을 m(s)=√(1/t)만큼 scale합니다. 그러면 dot product에는 m(s)²=1/t가 반영됩니다.</>}
        formula={String.raw`\begin{aligned}p(n\mid m)&=\operatorname{softmax}\!\left(\frac{q_m^\top k_n}{t\sqrt d}\right)\\[3pt]m(s)&=\sqrt{\frac1t}=0.1\ln s+1\end{aligned}`}
        terms={[
          { symbol: "t", name: "attention temperature", description: "작을수록 logits가 커지고 softmax distribution이 더 뾰족해집니다." },
          { symbol: "m(s)", name: "length scale", description: "rotary cosine·sine에 적용하는 scale이며 q와 k 양쪽에 들어갑니다." },
          { symbol: "s", name: "extension factor", description: "target context를 original context로 나눈 값입니다." },
        ]}
        assumptions={["0.1 ln(s)+1은 LLaMA·Llama 2 실험에 맞춘 YaRN 논문의 권장식입니다.", "library가 attention_factor를 이미 적용하면 사용자가 다시 곱하지 않습니다."]}
        interpretation="frequency interpolation만이 YaRN의 전부가 아닙니다. 논문에서 YaRN은 NTK-by-parts와 pre-softmax attention scaling을 합친 방법을 뜻합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Query와 key 양쪽에 이 scale이 반영되므로 실제 attention logit에는
          제곱 효과가 생긴다. 라이브러리에서는 이를
          <code>attention_factor</code>나 내부 <code>mscale</code>로 처리하므로,
          사용자가 attention score에 같은 값을 다시 곱하면 이중 적용될 수 있다.
        </p>

        <h3>논문의 실험 결과를 모든 모델의 보증으로 읽으면 안 된다</h3>
        <p>
          YaRN 논문은 LLaMA 계열에서 PI보다 적은 token과 step으로 더 긴 context에
          적응한 결과를 보고했다. 그러나 이 수치는 해당 checkpoint, data와
          evaluation setting에 대한 결과다. 다른 model에 같은 factor를 넣었다고
          동일한 품질이나 학습 효율이 자동으로 재현되지는 않는다.
        </p>

        <h3>원 논문이 실제로 입증한 범위를 구분한다</h3>
        <p>
          YaRN은 LLaMA 계열 실험에서 PI보다 적은 training step으로 비슷하거나 더
          나은 long-context perplexity와 passkey retrieval을 보고했다. 이 결과는
          특정 checkpoint·data·scale factor에 대한 evidence다. 구조의 아이디어는
          일반화할 수 있지만, <code>beta_fast</code>나 attention scale의 최적값까지
          모든 architecture에 그대로 일반화된다고 볼 근거는 아니다.
        </p>
      </div>
    </section>
  );
}
