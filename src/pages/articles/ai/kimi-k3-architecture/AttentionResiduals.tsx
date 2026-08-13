import ExplainedFormula from "@/components/ui/explained-formula";
import AttentionResidualsViz from "./viz/AttentionResidualsViz";

export default function AttentionResiduals() {
  return (
    <section id="attention-residuals" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Depth: 직전 state에 모두 누적하는 residual을 이전 depth source의 선택적 조회로 바꾼다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          표준 residual path는 이전 hidden state에 현재 sublayer update를 더합니다. Gradient가 identity path를 따라 흐를 수 있어 깊은 network를 학습하기 쉬워지지만, 더 앞선 layer의 정보는 직전 state 안에 이미 여러 번 합쳐져 있습니다. 현재 layer가 “embedding을 더 보고 20번째 layer는 덜 보겠다”처럼 depth source를 직접 다시 선택하는 경로는 없습니다.
        </p>
      </div>

      <ExplainedFormula
        question="표준 residual path는 이전 표현과 새 transformation을 어떻게 합치는가?"
        idea={<>직전 hidden state를 그대로 보존하는 identity path에 현재 sublayer가 계산한 변화량을 더합니다. 과거의 모든 변화는 hℓ₋₁ 한 곳에 누적됩니다.</>}
        formula={String.raw`h_{\ell}=h_{\ell-1}+f_{\ell}(h_{\ell-1})`}
        terms={[
          { symbol: String.raw`h_{\ell-1}`, name: "이전 hidden state", description: "앞선 layer의 정보와 update가 누적된 residual stream입니다." },
          { symbol: String.raw`f_{\ell}`, name: "현재 sublayer", description: "Attention 또는 FFN과 normalization order를 포함한 현재 transformation입니다." },
          { symbol: String.raw`h_{\ell}`, name: "현재 hidden state", description: "Identity path와 새 update를 더한 다음 layer의 input입니다." },
        ]}
        assumptions={[
          "Shape가 같은 residual addition을 설명하는 축약식이며 pre-norm·post-norm 세부 순서는 생략했습니다.",
          "Identity path가 gradient 전달을 돕지만 모든 깊이에서 정보가 손실 없이 보존된다는 보장은 아닙니다.",
        ]}
        interpretation="현재 layer는 hℓ₋₁을 통해 과거를 간접적으로 받습니다. 어느 과거 depth를 얼마나 사용할지는 명시적인 선택 변수로 드러나지 않습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Attention Residuals(AttnRes)는 depth 방향을 하나의 작은 attention 문제로 바꿉니다. 이전 source마다 key와 value를 만들고, 현재 layer에 대응하는 learned pseudo-query가 source weight를 계산합니다. Token끼리 attention하는 것이 아니라 <strong>layer 또는 block representation 사이의 attention</strong>이라는 점이 핵심입니다.
        </p>
      </div>

      <ExplainedFormula
        question="현재 layer가 embedding과 이전 depth source 가운데 필요한 표현을 어떻게 선택하는가?"
        idea={<>Source key를 RMSNorm으로 scale 정렬한 뒤 현재 layer의 learned pseudo-query와 dot product를 계산합니다. Depth source 전체에 softmax를 적용한 weight로 value를 합칩니다.</>}
        formula={String.raw`\begin{aligned}\widetilde k_i&=\operatorname{RMSNorm}(k_i),\\s_{i\to\ell}&=q_\ell^\top\widetilde k_i/\sqrt d,\\\alpha_{i\to\ell}&=\operatorname{softmax}_{i<\ell}(s_{i\to\ell}),\\h_\ell&=\sum_{i<\ell}\alpha_{i\to\ell}v_i.\end{aligned}`}
        terms={[
          { symbol: String.raw`q_{\ell}`, name: "depth pseudo-query", description: "현재 layer가 어떤 과거 source를 읽을지 학습하는 layer별 query입니다." },
          { symbol: "k_i,v_i", name: "depth source key·value", description: "Embedding 또는 이전 layer/block representation에서 만든 선택용 key와 전달할 value입니다." },
          { symbol: String.raw`\alpha_{i\rightarrow\ell}`, name: "depth attention weight", description: "현재 layer ℓ이 source i를 사용하는 비율입니다." },
          { symbol: "d", name: "key dimension", description: "Dot-product scale을 맞추는 depth key의 component 수입니다." },
          { symbol: String.raw`h_{\ell}`, name: "selected input", description: "이전 depth source의 weighted sum으로 만든 현재 layer input입니다." },
        ]}
        assumptions={[
          "Full AttnRes의 개념식이며 K3는 모든 layer source를 끝까지 보관하는 대신 block 단위 근사를 사용합니다.",
          "Pseudo-query는 layer parameter이며 token content만으로 새로 만들어지는 일반 self-attention query와 다릅니다.",
          "RMSNorm은 source key scale을 조정하지만 value의 의미적 품질을 보장하지 않습니다.",
        ]}
        interpretation="Weight를 검사하면 현재 depth가 어느 source를 읽는지 관찰할 수 있지만, 큰 weight가 곧 causal importance나 사람이 해석하는 기능을 증명하지는 않습니다."
      />

      <AttentionResidualsViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>실제 K3는 Full AttnRes가 아니라 Block AttnRes를 사용한다</h3>
        <p className="leading-8">
          모든 layer output을 pipeline stage 사이에 보관하고 전달하면 depth가 커질수록 memory와 communication이 늘어납니다. K3는 93개 main layer를 최대 12-layer 크기의 8개 block으로 묶어 마지막 block은 더 짧게 남깁니다. Block 안에서는 residual update를 partial sum으로 누적하고, block 경계에서만 embedding과 앞선 block representation에 depth attention을 적용합니다. Embedding source까지 포함하면 선택 대상은 9개입니다.
        </p>
        <p className="leading-8">
          따라서 “K3가 모든 이전 layer를 직접 attention한다”는 설명은 Full AttnRes 아이디어에는 가깝지만 구현에는 부정확합니다. K3가 stage 사이에서 장기간 보존하는 단위는 layer별 state가 아니라 block-level source이며, 현재 block 안에서는 기존 residual 누적을 사용합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Block으로 묶으면 depth memory와 pipeline communication의 증가율이 어떻게 달라지는가?"
        idea={<>Layer L개를 모두 source로 보관하는 대신 block N개의 대표 state와 embedding source만 유지합니다. Hidden width d가 같다면 source state 규모는 Ld에서 (N+1)d로 줄어듭니다.</>}
        formula={String.raw`\begin{aligned}M_{\mathrm{full}}&\propto Ld,\\M_{\mathrm{block}}&\propto(N+1)d,\\N&=8,\\M_{\mathrm{block}}&\propto9d.\end{aligned}`}
        terms={[
          { symbol: "L", name: "layer position 수", description: "Full AttnRes에서 개별 source로 보관할 depth position 수입니다." },
          { symbol: "N", name: "block 수", description: "K3 Block AttnRes가 stage 사이에서 구분하는 8개 block입니다." },
          { symbol: "d", name: "hidden state width", description: "Source representation 하나의 feature dimension입니다." },
          { symbol: "N+1", name: "block-level source 수", description: "8개 block representation에 embedding source 하나를 더한 값입니다." },
        ]}
        assumptions={[
          "Source state element 수의 비례 관계이며 projection·optimizer·activation checkpoint memory를 포함한 총 byte 식은 아닙니다.",
          "실제 communication은 pipeline partition, dtype, microbatch와 implementation에 따라 달라집니다.",
          "Block 안의 partial sum 계산 비용과 approximation에 따른 quality trade-off는 별도로 남습니다.",
        ]}
        interpretation="Depth source 수를 96 수준에서 9개로 제한해 보관·전달 상태를 줄이는 대신, block 내부 layer를 개별적으로 다시 선택할 자유도는 포기합니다."
      />

      <div id="paper-attention-residuals" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Attention Residuals</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 논문이 풀려는 문제는 깊은 Transformer의 residual stream이 과거 depth 정보를 동일한 덧셈 경로에 누적해 layer별 선택성을 드러내지 못한다는 점입니다. Full AttnRes와 memory·communication을 줄인 Block AttnRes를 제안하고, depth source를 learned attention으로 조합합니다. 논문의 실험은 이 경로의 가능성을 보여 주지만, attention weight를 causal explanation으로 읽거나 K3 최종 성능의 증가분 전체를 AttnRes에 귀속할 수는 없습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2603.15031" target="_blank" rel="noreferrer">
          Full·Block AttnRes의 유도와 실험 범위 보기
        </a>
      </div>
    </section>
  );
}
