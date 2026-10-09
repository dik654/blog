import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import PatchEmbeddingViz from "./viz/PatchEmbeddingViz";

export default function PatchEmbedding({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="patch-embedding" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Patch embedding은 자르기, 펼치기, 선형 투영, 위치 부여를 하나의 입력 계약으로 묶습니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          높이 H, 너비 W, channel C인 image를 겹치지 않는 P×P patch로 나누면 각
          patch에는 P²C개의 숫자가 있습니다. 이를 길이 D인 token으로 투영하고
          image-level [CLS] token 또는 pooling용 경로를 더합니다. H와 W가 P로
          나누어떨어지지 않으면 resize·crop·padding 중 무엇을 할지 먼저 정해야 합니다.
        </p>
      </div>
      <ExplainedFormula
        question="한 장의 image는 몇 개의 token이 되고 각 token은 어떤 shape를 가질까?"
        idea={<>Patch 한 변 P가 spatial sampling 간격을 정합니다. 각 patch를 펼친 vector에 하나의 shared projection을 적용하고 position vector를 더해 Transformer input을 만듭니다.</>}
        formula={String.raw`\begin{aligned}
N&=\frac HP\frac WP,\qquad x_p^{(i)}\in\mathbb R^{P^2C},\\
e_i&=x_p^{(i)}E+p_i,\qquad E\in\mathbb R^{P^2C\times D},\\
Z_0&=[e_{\mathrm{cls}};e_1;\ldots;e_N]\in\mathbb R^{(N+1)\times D}.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
N&=\underbrace{\frac HP\frac WP}_{\text{patch token 개수}},\qquad x_p^{(i)}\in\underbrace{\mathbb R^{P^2C}}_{\text{펼친 patch 길이}},\\
e_i&=\underbrace{x_p^{(i)}E}_{\text{D차원 투영}}+\underbrace{p_i}_{\text{grid 위치}},\qquad E\in\mathbb R^{P^2C\times D},\\
Z_0&=\underbrace{[e_{\mathrm{cls}};e_1;\ldots;e_N]}_{\text{[CLS]+patch N개}}\in\mathbb R^{(N+1)\times D}.
\end{aligned}`}
        operations={[
          { expression: String.raw`\frac HP\frac WP`, annotation: ["세로·가로를 P 간격으로 잘라", "patch 수 N을 셉니다", "224×224, P=16이면 14×14=196"] },
          { expression: String.raw`x_p^{(i)}E+p_i`, annotation: ["펼친 P²C 값을 모든 patch가 공유하는", "E로 D차원에 투영한 뒤", "i번째 grid 위치 벡터 p_i를 더합니다"] },
          { expression: String.raw`[e_{\mathrm{cls}};e_1;\ldots;e_N]`, annotation: ["[CLS] 하나와 patch token N개를 쌓아", "길이 N+1 sequence를 만듭니다", "N=196이면 197"] },
        ]}
        terms={[
          { symbol: "H,W,C", name: "image shape", description: "높이·너비·channel 수로, batch axis를 제외한 한 image의 tensor shape입니다." },
          { symbol: "P,N", name: "patch size and count", description: "Patch 한 변 길이와 image에서 만들어지는 patch token 개수입니다." },
          { symbol: "E", name: "shared patch projection", description: "모든 patch에 같은 방식으로 적용해 P²C 값을 model dimension D로 바꾸는 learned matrix입니다." },
          { symbol: "p_i", name: "position embedding", description: "내용만으로 구분되지 않는 i번째 patch의 grid 위치를 token에 더하는 vector입니다." },
          { symbol: "Z₀", name: "encoder input sequence", description: "선택적인 class token과 N개 patch token을 쌓은 Transformer 입력입니다." },
        ]}
        assumptions={["H와 W가 P로 나누어떨어지며 non-overlapping raster-order patch를 사용합니다.", "Batch axis는 생략했고 projection E와 position dimension은 D로 같습니다.", "[CLS] token은 선택 사항이며 mean pooling을 쓰는 model은 sequence contract가 달라집니다."]}
        interpretation="224×224 image와 P=16이면 N=196이고 [CLS]를 포함한 sequence length는 197입니다. P를 바꾸면 detail뿐 아니라 pretrained projection shape와 position grid도 함께 달라집니다."
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("class-token-concat", codeRefs["class-token-concat"])
        }
      />
      <ExplainedFormula
        question="Patch를 펼쳐 matrix와 곱하는 구현을 Conv2d 한 층으로 바꿀 수 있는 이유는 무엇일까?"
        idea={<>Kernel size와 stride를 P로 둔 convolution은 각 P×P 영역을 겹치지 않게 읽습니다. D개 kernel의 weight를 E의 D개 output column과 같은 순서로 놓으면 동일한 dot product를 grid 전체에서 수행합니다.</>}
        formula={String.raw`\begin{aligned}
k_d&=\operatorname{flatten}(K_d),\\
v_{r,s}&=\operatorname{patch}_{P}(x;r,s),\\
y_{r,s,d}&=k_d^\top v_{r,s}+b_d,\\
\operatorname{flatten}(K_d)&=E_{:,d}.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
k_d&=\underbrace{\operatorname{flatten}(K_d)}_{\text{kernel을 벡터로}},\\
v_{r,s}&=\underbrace{\operatorname{patch}_{P}(x;r,s)}_{\text{(r,s) patch를 벡터로}},\\
y_{r,s,d}&=\underbrace{k_d^\top v_{r,s}+b_d}_{\text{patch 하나의 d번째 좌표}},\\
\operatorname{flatten}(K_d)&=\underbrace{E_{:,d}}_{\text{E의 d번째 열과 동일}}.
\end{aligned}`}
        operations={[
          { expression: String.raw`\operatorname{flatten}(K_d)`, annotation: ["d번째 P×P×C conv kernel을", "patch와 같은 순서로 펼친 벡터"] },
          { expression: String.raw`\operatorname{patch}_{P}(x;r,s)`, annotation: ["stride P로 (r,s)칸의 P×P×C 값을", "겹침 없이 읽어 펼칩니다"] },
          { expression: String.raw`k_d^\top v_{r,s}+b_d`, annotation: ["kernel과 patch의 dot product + bias", "= 펼친 patch × E의 열 d와 같은 값"] },
          { expression: String.raw`E_{:,d}`, annotation: ["conv weight D개를 E의 열 순서대로", "놓으면 두 구현의 출력이 일치합니다", "flatten 순서가 다르면 깨집니다"] },
        ]}
        terms={[
          { symbol: "K_d", name: "d-th convolution kernel", description: "D개 output token coordinate 중 d번째 값을 만드는 P×P×C weight입니다." },
          { symbol: "r,s", name: "patch-grid coordinate", description: "Stride P로 이동하는 patch의 세로·가로 index입니다." },
          { symbol: "v_{r,s}", name: "flattened patch", description: "Grid (r,s)의 P×P×C 값을 checkpoint와 같은 순서로 펼친 vector입니다." },
          { symbol: "E_:,d", name: "projection column", description: "펼친 patch vector에서 d번째 embedding coordinate를 만드는 weight입니다." },
        ]}
        assumptions={["Kernel size=stride=P, dilation=1, padding=0인 non-overlapping convolution입니다.", "Patch flatten order와 kernel flatten order가 정확히 같아야 합니다.", "Bias 사용 여부와 tensor layout을 checkpoint schema와 맞춥니다."]}
        interpretation="두 구현은 parameter를 배치하는 방식만 다를 수 있습니다. 따라서 checkpoint 변환에서는 shape만 맞는지보다 flatten order와 numerical output parity를 검사해야 합니다."
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("conv-as-patch-proj", codeRefs["conv-as-patch-proj"])
        }
      />
      <div className="not-prose my-8"><PatchEmbeddingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Resolution을 바꾸면 position grid도 바뀝니다</h3>
        <p>
          224px·P=16 checkpoint의 14×14 position grid를 384px 입력의 24×24 grid에 그대로 더할 수는 없습니다. Class token을
          spatial grid에서 분리하고 2D interpolation한 뒤 다시 붙입니다. 이렇게 해도 learned spatial signal을 보간했을 뿐 새 위치 정보를 학습한
          것은 아니므로 target resolution에서 fine-tuning과 boundary artifact 검사가 따라와야 합니다.
        </p>
      </div>
    </section>
  );
}
