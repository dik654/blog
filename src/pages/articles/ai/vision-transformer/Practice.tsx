import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import PracticeViz from "./viz/PracticeViz";

export default function Practice() {
  return (
    <section id="practice" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Checkpoint handoff는 weight load가 아니라 입력부터 출력까지의 호환성 검사입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Registry에서 model 이름만 복사하지 않고 architecture config, weight
          revision과 license, expected resolution, interpolation, crop ratio,
          channel order, mean·standard deviation, class mapping을 함께 저장합니다.
          Position embedding resize와 classifier head 교체는 shape가 맞아도 의미가
          달라지는 경계이므로 smoke test가 fine-tuning보다 먼저입니다.
        </p>
      </div>
      <ExplainedFormula
        question="Pretrained position embedding을 더 큰 patch grid로 옮길 때 무엇을 분리해 보간해야 할까?"
        idea={<>Image-level special token의 position은 2D spatial grid가 아니므로 먼저 분리합니다. N개 patch position을 h×w grid로 reshape하고 새 h′×w′ grid에 2D interpolation한 뒤 special token을 다시 붙입니다.</>}
        formula={String.raw`\begin{aligned}
P_{\mathrm{old}}&=[p_{\mathrm{cls}};P_{\mathrm{grid}}],\\
\widetilde P_{\mathrm{grid}}&=\operatorname{Interp}_{2D}
\!\left(G_{\mathrm{old}},h',w'\right),\\
G_{\mathrm{old}}&=\operatorname{reshape}_{h,w}(P_{\mathrm{grid}}),\\
P_{\mathrm{new}}&=[p_{\mathrm{cls}};\widetilde P_{\mathrm{grid}}^{\flat}].
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
P_{\mathrm{old}}&=\underbrace{[p_{\mathrm{cls}};P_{\mathrm{grid}}],}_{\text{오른쪽 항으로 결과 계산}}\\
\widetilde P_{\mathrm{grid}}&=\underbrace{\operatorname{Interp}_{2D}
\!\left(G_{\mathrm{old}},h',w'\right),}_{\text{허용 경계 판정}}\\
G_{\mathrm{old}}&=\underbrace{\operatorname{reshape}_{h,w}(P_{\mathrm{grid}}),}_{\text{오른쪽 항으로 결과 계산}}\\
P_{\mathrm{new}}&=[p_{\mathrm{cls}};\widetilde P_{\mathrm{grid}}^{\flat}].
\end{aligned}`}
        operations={[
          { expression: String.raw`[p_{\mathrm{cls}};P_{\mathrm{grid}}],`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Image-level special token의","position은 2D spatial grid가 아니므로 먼저","분리합니다."] },
          { expression: String.raw`\operatorname{Interp}_{2D}
\!\left(G_{\mathrm{old}},h',w'\right),`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Image-level special token의","position은 2D spatial grid가 아니므로 먼저","분리합니다."] },
          { expression: String.raw`\operatorname{reshape}_{h,w}(P_{\mathrm{grid}}),`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Image-level special token의","position은 2D spatial grid가 아니므로 먼저","분리합니다."] },
        ]}
        terms={[
          { symbol: "p_cls", name: "special-token position", description: "Spatial patch grid에 속하지 않는 class 또는 distillation token의 learned position입니다." },
          { symbol: "P_grid", name: "old spatial position grid", description: "Pretraining patch 좌표 h×w에 대응하는 D-dimensional learned vectors입니다." },
          { symbol: "h',w'", name: "new token-grid shape", description: "Fine-tuning resolution과 patch size가 만드는 새 spatial patch 개수입니다." },
          { symbol: "Interp₂D", name: "two-dimensional interpolation", description: "Old grid의 vector field를 새 grid 좌표에 보간하는 명시적 변환입니다." },
        ]}
        assumptions={["Absolute learned position embedding을 쓰는 ViT형 checkpoint의 일반적 변환입니다.", "Special token 수와 ordering은 checkpoint architecture와 일치해야 합니다.", "Relative bias·RoPE·dynamic position을 쓰는 model에는 같은 절차를 그대로 적용하지 않습니다."]}
        interpretation="Token 총길이만 맞추는 1D interpolation은 row boundary를 섞을 수 있습니다. 실제 library가 사용하는 align-corners·interpolation mode까지 artifact에 남기고 target resolution에서 fine-tune합니다."
      />
      <ExplainedFormula
        question="Registry implementation과 export implementation이 같은 checkpoint를 읽었다는 것을 어떻게 확인할까?"
        idea={<>같은 preprocessed tensor와 eval state에서 두 구현의 logit 차이를 tolerance 안에서 비교합니다. Shape·dtype·class order 검사와 함께 해야 우연히 비슷한 scalar metric만 맞는 오류를 막을 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
x'&=T_{\mathrm{ckpt}}(x),\\
z_{\mathrm{ref}}&=f_{\mathrm{ref}}(x'),\\
z_{\mathrm{exp}}&=f_{\mathrm{exp}}(x'),\\
d&=\lVert z_{\mathrm{ref}}-z_{\mathrm{exp}}\rVert_\infty,\\
d&\le\varepsilon.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
x'&=\underbrace{T_{\mathrm{ckpt}}(x),}_{\text{오른쪽 항으로 결과 계산}}\\
z_{\mathrm{ref}}&=\underbrace{f_{\mathrm{ref}}(x'),}_{\text{오른쪽 항으로 결과 계산}}\\
z_{\mathrm{exp}}&=\underbrace{f_{\mathrm{exp}}(x'),}_{\text{오른쪽 항으로 결과 계산}}\\
d&=\lVert z_{\mathrm{ref}}-z_{\mathrm{exp}}\rVert_\infty,\\
d&\le\varepsilon.
\end{aligned}`}
        operations={[
          { expression: String.raw`T_{\mathrm{ckpt}}(x),`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","같은 preprocessed tensor와 eval","state에서 두 구현의 logit 차이를 tolerance","안에서 비교합니다."] },
          { expression: String.raw`f_{\mathrm{ref}}(x'),`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","같은 preprocessed tensor와 eval","state에서 두 구현의 logit 차이를 tolerance","안에서 비교합니다."] },
          { expression: String.raw`f_{\mathrm{exp}}(x'),`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","같은 preprocessed tensor와 eval","state에서 두 구현의 logit 차이를 tolerance","안에서 비교합니다."] },
        ]}
        terms={[
          { symbol: "T_ckpt", name: "checkpoint preprocessing", description: "Registry가 명시한 resize·crop·channel·normalization을 재현하는 deterministic inference transform입니다." },
          { symbol: "f_ref,f_exp", name: "reference and exported models", description: "원 runtime 구현과 배포용으로 변환한 implementation입니다." },
          { symbol: "ε", name: "numerical tolerance", description: "Precision·kernel 차이를 고려해 사전에 정한 maximum absolute logit error 한계입니다." },
        ]}
        assumptions={["두 model은 eval mode이며 dropout·stochastic depth 같은 무작위 경로를 끕니다.", "동일한 class order·input tensor·dtype policy를 사용합니다.", "Tolerance는 FP32·FP16·INT8 등 export precision과 representative test set에 맞게 정합니다."]}
        interpretation="Top-1 label 하나가 같다는 것보다 logit vector parity가 더 강한 smoke test입니다. 그래도 전체 accuracy·calibration·latency 검증을 대신하지는 않습니다."
      />
      <div className="not-prose my-8"><PracticeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Smoke test 뒤 head-only·partial·full fine-tuning은
          <Link to="/ai/transfer-learning-practice">transfer learning 정본</Link>, warmup과
          decay는 <Link to="/ai/lr-scheduling">schedule 정본</Link>을 따릅니다. Export
          artifact에는 preprocessing code와 class map뿐 아니라 patch/grid shape,
          position-resize receipt, library version, reference logits와 tolerance도 넣습니다.
        </p>
      </div>
    </section>
  );
}
