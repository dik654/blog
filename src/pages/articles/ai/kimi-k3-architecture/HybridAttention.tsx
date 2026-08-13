import ExplainedFormula from "@/components/ui/explained-formula";
import HybridAttentionViz from "./viz/HybridAttentionViz";
import KDAStateViz from "./viz/KDAStateViz";

export default function HybridAttention() {
  return (
    <section id="hybrid-attention" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Sequence: KDA가 긴 과거를 고정 state로 압축하고 Gated MLA가 전역 상호작용을 보강한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Softmax attention은 query가 과거 key/value를 직접 다시 읽기 때문에 정보 접근은 풍부하지만, 긴 context에서는 KV memory와 token-pair 계산이 커집니다. KDA는 과거를 고정 크기의 recurrent state에 갱신해 sequence 방향 비용을 줄입니다. 압축만 계속하면 서로 다른 과거가 같은 state에서 간섭할 수 있으므로, K3는 세 KDA 뒤에 global Gated MLA를 하나 두어 직접적인 content interaction을 주기적으로 보강합니다.
        </p>
        <p className="leading-8">
          Schedule은 3:1을 93번 기계적으로 반복하는 형태가 아닙니다. 3 KDA와 1 Gated MLA로 된 hybrid block을 23번 반복한 뒤 마지막 Gated MLA를 하나 더 둡니다. 그래서 합계는 69 KDA와 24 Gated MLA이며, 마지막 layer까지 포함해 global path가 끝을 정리합니다.
        </p>
      </div>

      <HybridAttentionViz />
      <KDAStateViz />

      <ExplainedFormula
        question="과거를 모두 보관하지 않고도 현재 key–value association을 state에 어떻게 고쳐 쓰는가?"
        idea={<>먼저 channel별 retention α로 이전 state를 감쇠합니다. 이어서 현재 key 방향에서 기존 state가 예측한 value를 β만큼 지우고 새 value를 써서, 단순 누적보다 충돌을 줄이는 delta-rule update를 만듭니다.</>}
        formula={String.raw`\begin{aligned}
A_t&=\operatorname{Diag}(\alpha_t)S_{t-1},\\
E_t&=(I-\beta_tk_tk_t^\top)A_t,\\
W_t&=\beta_tk_tv_t^\top,\\
S_t&=E_t+W_t,\\
o_t&=S_t^\top q_t
\end{aligned}`}
        terms={[
          { symbol: "S_{t-1},S_t", name: "recurrent state", description: "과거 key→value association을 고정 shape matrix에 요약한 이전·현재 state입니다." },
          { symbol: String.raw`\alpha_t`, name: "channelwise retention", description: "Key channel마다 이전 memory를 얼마나 남길지 정하는 0과 1 사이 vector입니다." },
          { symbol: String.raw`\beta_t`, name: "write strength", description: "현재 key 방향의 correction을 얼마나 강하게 적용할지 정하는 scalar 또는 head별 값입니다." },
          { symbol: "k_t,v_t,q_t", name: "key·value·query", description: "현재 token에서 만든 write address, write content와 read query입니다." },
          { symbol: "o_t", name: "KDA read output", description: "업데이트된 state를 현재 query로 읽은 output vector입니다." },
        ]}
        assumptions={[
          "한 head의 표기이며 실제 model은 여러 head·batch·chunk axis를 가집니다.",
          "k와 q는 state의 key dimension, v와 output은 value dimension과 맞아야 합니다.",
          "Training·prefill의 chunkwise parallel form은 같은 recurrence를 병렬 scan에 맞게 재배열합니다.",
        ]}
        interpretation="State shape은 sequence 길이와 함께 늘지 않지만, 과거 token을 원형 그대로 저장하지도 않습니다. 따라서 memory 효율과 exact token retrieval 사이에 압축 trade-off가 생깁니다."
      />

      <ExplainedFormula
        question="Retention이 너무 빨리 0이 되거나 BF16 범위에서 불안정해지는 일을 어떻게 제한하는가?"
        idea={<>학습된 score를 sigmoid로 0과 1 사이에 넣고 음수 하한 gmin을 곱해 log-decay 범위를 고정합니다. 그 값을 exponentiate하면 retention α가 0과 1 사이에서 유지됩니다.</>}
        formula={String.raw`\begin{aligned}a_t&=e^Az_t,\\g_t&=g_{\min}\sigma(a_t),\\g_{\min}&=-5,\\g_t&\in(g_{\min},0),\\\alpha_t&=e^{g_t}.\end{aligned}`}
        terms={[
          { symbol: "z_t", name: "decay input", description: "현재 token에서 channelwise decay를 만들기 위한 projection 값입니다." },
          { symbol: "A", name: "learned scale parameter", description: "Exponential parameterization으로 양수 scale을 제공하는 학습 값입니다." },
          { symbol: String.raw`g_{\min}`, name: "log-decay lower bound", description: "K3가 −5로 고정한 가장 강한 log decay입니다." },
          { symbol: "g_t", name: "bounded log decay", description: "각 channel에서 −5와 0 사이에 놓이는 log retention입니다." },
          { symbol: String.raw`\alpha_t`, name: "retention factor", description: "이전 state channel에 곱하는 실제 0과 1 사이 계수입니다." },
        ]}
        assumptions={[
          "Kimi Linear·K3가 공개한 bounded-decay parameterization을 설명합니다.",
          "α의 하한은 e⁻⁵보다 크지만 여러 step을 연속 곱하면 장기 기억은 계속 감소할 수 있습니다.",
          "수치 범위를 제한하는 것이 semantic memory 보존을 자동 보장하지는 않습니다.",
        ]}
        interpretation="한 step의 decay가 지나치게 극단적으로 변하는 것을 막아 tile-wise kernel과 BF16 계산을 안정시키지만, 어떤 정보를 오래 남길지는 data와 학습 결과에 달려 있습니다."
      />

      <div id="paper-kimi-linear" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Kimi Linear</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Kimi Linear가 풀려는 문제는 long-context softmax attention의 KV·quadratic cost를 낮추면서 linear attention의 표현 손실과 실제 kernel 효율을 함께 개선하는 것입니다. Channelwise gated delta rule과 chunkwise algorithm, hybrid KDA+MLA 구성을 결합한 것이 핵심 기여입니다. 논문의 scale과 benchmark에서 얻은 결과는 KDA의 가능성을 보여 주지만, K3의 2.8T 최종 성능 중 KDA만의 기여나 모든 sequence task에서 softmax attention을 대체한다는 결론은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2510.26692" target="_blank" rel="noreferrer">
          KDA recurrence·chunkwise algorithm과 실험 범위 보기
        </a>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Gated MLA는 compressed KV latent와 output gate를 함께 쓴다</h3>
        <p className="leading-8">
          MLA는 key/value cache를 작은 latent <code>cₜ</code>로 압축한 뒤 각 attention projection이 이를 재사용합니다. K3의 Gated MLA는 여기에 input-dependent output gate를 더해 head output channel이 residual stream에 얼마나 전달될지 조절합니다. KDA가 sequence history를 recurrent state로 요약한다면 MLA는 해당 layer에서 causal mask가 허용하는 과거 token과 직접 global interaction을 수행합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Gated MLA는 compressed latent에서 읽은 global attention output을 어떻게 조절하는가?"
        idea={<>Token state를 작은 cache latent로 내리고 attention output o를 만든 뒤, 같은 input에서 만든 sigmoid gate를 channel별로 곱해 output projection에 전달합니다.</>}
        formula={String.raw`c_t=W_cx_t,\qquad y_t=W_o\!\left[\sigma(W_gx_t)\odot o_t\right]`}
        terms={[
          { symbol: "x_t", name: "layer input", description: "현재 token의 hidden state입니다." },
          { symbol: "c_t", name: "KV latent", description: "Key/value projection이 재사용하는 압축 representation입니다." },
          { symbol: "o_t", name: "attention output", description: "Causal global attention이 읽어 온 head output을 합친 값입니다." },
          { symbol: String.raw`\sigma(W_gx_t)`, name: "output gate", description: "각 output channel을 0과 1 사이에서 조절하는 input-dependent gate입니다." },
          { symbol: "W_o", name: "output projection", description: "Gated head output을 residual hidden width로 돌려보냅니다." },
        ]}
        assumptions={[
          "식은 MLA의 latent-to-key/value 세부 projection과 head axis를 생략한 output 경로입니다.",
          "Causal mask는 미래 token 접근을 막으며, gate가 attention score 자체를 바꾸는 것은 아닙니다.",
          "K3의 MLA layer는 명시적 positional encoding을 추가하지 않는 NoPE 구성입니다.",
        ]}
        interpretation="Gate가 작은 channel은 global read의 residual 기여가 줄어듭니다. 이것이 attention sink나 long-context retrieval을 자동으로 해결한다는 뜻은 아니며 별도 평가가 필요합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>NoPE는 순서를 전혀 사용하지 않는다는 뜻이 아니다</h3>
        <p className="leading-8">
          K3는 MLA에 RoPE 같은 명시적 positional encoding을 넣지 않습니다. 그렇더라도 autoregressive causal mask는 미래와 과거를 구분하고, KDA recurrence는 token이 들어온 순서에 따라 state를 갱신합니다. 즉 “position vector가 없다”와 “sequence order 정보가 없다”는 다른 주장입니다. Report의 long-context schedule도 8K에서 64K로 pretraining length를 늘린 뒤 cooldown에서 256K와 1M을 거쳤으므로, NoPE만으로 1M context가 저절로 생긴 것이 아닙니다.
        </p>
        <p className="border-l border-amber-500/60 pl-4 text-sm leading-7">
          <strong>해석 경계:</strong> 3:1 schedule과 마지막 MLA는 공개된 configuration입니다. 그러나 2.8T 전체 model에서 2:1·4:1과 동일 조건으로 비교한 full-scale ablation이 공개된 것은 아니므로, 3:1을 보편적인 최적 비율로 일반화하지 않습니다.
        </p>
      </div>
    </section>
  );
}
