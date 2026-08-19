import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { nagTree } from "./fileTree";
import {
  EvidenceFields,
  LearningHeader,
  LearningTerm,
} from "../diffusion-shared";
import LatentPipelineViz from "./LatentPipelineViz";

export default function LatentDiffusionGuidanceArticle() {
  const sidebar = useCodeSidebar();
  return (
    <>
    <article id="overview" className="space-y-16">
      <section id="compression" className="space-y-6">
        <LearningHeader
          n="00"
          kicker="먼저 denoising 공간을 바꾸기"
          title="Latent diffusion은 pixel을 버리는 것이 아니라 lossy interface를 앞에 둔다"
        />
        <p className="text-lg leading-8">
          먼저 <strong>latent bottleneck</strong> 하나만 봅니다. Encoder는 큰
          pixel grid를 더 작은 spatial tensor로 바꾸고, decoder는 그 tensor를
          다시 image로 복원합니다. Diffusion은 그 사이의 latent에서 실행됩니다.
        </p>
        <LearningTerm
          name="Latent diffusion bottleneck"
          shape="pixel x → encoder E → latent z → decoder D → reconstruction x̂"
          meaning="반복 denoising의 spatial compute를 줄이기 위해 pretrained autoencoder가 만든 compressed representation에서 diffusion을 수행하는 설계입니다."
          example="512×512 image를 8배 spatial downsampling하면 latent grid는 64×64가 되어 위치 수가 262,144에서 4,096로 64배 줄어듭니다."
          boundary="Channel·width·attention·NFE가 달라 실제 speedup은 정확히 64배가 아니며, encoder가 버린 detail은 diffusion이 원본에서 되찾을 수 없습니다."
        />
        <LatentPipelineViz />
        <ExplainedFormula
          question="왜 spatial downsampling factor를 한 번이 아니라 제곱해서 위치 수 감소를 계산할까요?"
          idea="Image에는 height와 width 두 축이 있습니다. 각 축을 f배 줄이면 전체 spatial position 수는 f×f배 줄어듭니다."
          formula={String.raw`N_{\rm pixel}=HW,\qquad N_{\rm latent}=\frac{H}{f}\frac{W}{f}=\frac{HW}{f^2}`}
          annotatedFormula={String.raw`\begin{aligned}
N_{\rm pixel}&=\underbrace{H\times W}_{\text{두 spatial 축을 곱함}}\\
H_z&=\underbrace{H/f}_{\text{height를 축소}}\\
W_z&=\underbrace{W/f}_{\text{width를 축소}}\\
N_{\rm latent}&=\underbrace{H_zW_z=HW/f^2}_{\text{position 수를 계산}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`H\times W`,
              annotation: [
                "height와 width를 곱해",
                "전체 spatial position 수 계산",
              ],
            },
            {
              expression: String.raw`(H/f)(W/f)`,
              annotation: [
                "두 spatial 축을 각각 f로 나눠",
                "compressed grid 크기 계산",
              ],
            },
            {
              expression: String.raw`HW/f^2`,
              annotation: [
                "두 축의 reduction을 함께 반영해",
                "위치 수 감소가 f^2임을 확인",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`f`,
              name: "Spatial downsampling factor",
              description: "Height와 width 각각의 축소 배율입니다.",
            },
            {
              symbol: String.raw`N_{\rm latent}`,
              name: "Latent positions",
              description: "Denoiser가 반복 처리하는 spatial cell 수입니다.",
            },
          ]}
          assumptions={[
            "H와 W가 f로 나누어집니다.",
            "Position 수는 FLOPs·latency의 유일한 결정 요인이 아닙니다.",
          ]}
          interpretation="H=W=512, f=8이면 262,144/4,096=64입니다. 이 값은 position reduction이지 end-to-end speedup 보장이 아닙니다."
        />
      </section>

      <section id="pipeline" className="space-y-6">
        <LearningHeader
          n="01"
          kicker="Component마다 receipt를 남기기"
          title="Latent diffusion pipeline은 네 개의 교체 가능한 계약으로 읽는다"
        />
        <LearningTerm
          name="Latent diffusion component contract"
          shape="autoencoder · conditioner · denoiser/sampler · decoder"
          meaning="제품 이름 대신 각 component의 input shape, scale, artifact revision, output semantics를 따로 기록하는 pipeline 경계입니다."
          example={
            <>
              Autoencoder는 <code>3×512×512→4×64×64</code>, text encoder는 token
              sequence, denoiser는 latent-shaped target, sampler는 time update를
              소유합니다.
            </>
          }
          boundary="Stable Diffusion이라는 이름만으로 text length·latent scale·prediction target·sampler가 고정되지 않습니다. Version별 contract를 확인해야 합니다."
        />
        <ExplainedFormula
          question="왜 latent tensor를 encode한 값 그대로가 아니라 scale s와 함께 기록할까요?"
          idea="Autoencoder가 만든 latent distribution의 numeric scale과 denoiser가 학습한 input scale이 맞아야 합니다. 같은 tensor shape라도 scale이 다르면 noise schedule의 의미가 바뀝니다."
          formula={String.raw`z=s\,E(x),\qquad \widehat x=D(z/s)`}
          annotatedFormula={String.raw`\begin{aligned}
e&=\underbrace{E(x)}_{\text{pixel을 latent로 encode}}\\
z&=\underbrace{s\,e}_{\text{denoiser input scale로 맞춤}}\\
\widehat x&=\underbrace{D(z/s)}_{\text{scale을 되돌려 decode}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`E(x)`,
              annotation: [
                "pixel input을 encoder에 넣어",
                "compressed representation 생성",
              ],
            },
            {
              expression: String.raw`s\,E(x)`,
              annotation: [
                "latent에 versioned scale을 곱해",
                "denoiser training distribution과 정렬",
              ],
            },
            {
              expression: String.raw`D(z/s)`,
              annotation: [
                "sampling latent의 scale을 되돌려",
                "decoder가 기대하는 domain에서 pixel 복원",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`s`,
              name: "Latent scaling factor",
              description:
                "Autoencoder latent와 diffusion input의 numeric scale을 맞추는 checkpoint contract입니다.",
            },
            {
              symbol: String.raw`D`,
              name: "Image decoder",
              description:
                "Compressed representation을 pixel output으로 복원합니다.",
            },
          ]}
          assumptions={[
            "Encoder·decoder·scale이 같은 artifact family에서 왔습니다.",
            "Decoder input convention을 checkpoint metadata로 확인합니다.",
          ]}
          interpretation="Shape가 같아도 잘못된 s를 쓰면 scheduler가 의도한 signal-to-noise ratio와 decoder input 분포가 어긋납니다."
        />
      </section>

      <section id="guidance" className="space-y-6">
        <LearningHeader
          n="02"
          kicker="Condition 방향을 분리해 보기"
          title="Classifier-free guidance는 두 prediction의 차이를 증폭한다"
        />
        <LearningTerm
          name="Classifier-free guidance"
          shape="unconditional prediction + w×(conditional−unconditional)"
          meaning="Condition dropout으로 한 network가 condition 유무 두 동작을 학습하고, sampling 때 그 차이를 condition이 민 방향으로 사용합니다."
          example="εu=2, εc=1.5이면 w=1에서 1.5, w=3에서 0.5입니다."
          boundary="큰 w는 prompt adherence를 높일 수 있지만 saturation·artifact·diversity loss를 만들며, 두 branch의 실제 compute도 별도 기록합니다."
        />
        <ExplainedFormula
          question="왜 conditional prediction을 w배 하지 않고 conditional−unconditional 차이에 w를 곱할까요?"
          idea="Unconditional branch가 공통 generation direction을 담당하고, 두 prediction의 차이가 condition 때문에 추가된 방향을 분리합니다. 그 추가 방향만 scale합니다."
          formula={String.raw`\widehat\epsilon=\epsilon_u+w(\epsilon_c-\epsilon_u)`}
          annotatedFormula={String.raw`\begin{aligned}
d_c&=\underbrace{\epsilon_c-\epsilon_u}_{\text{condition-only direction}}\\
g_c&=\underbrace{w\,d_c}_{\text{condition 방향을 scale}}\\
\widehat\epsilon&=\underbrace{\epsilon_u+g_c}_{\text{공통 방향과 guidance를 합성}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`\epsilon_c-\epsilon_u`,
              annotation: [
                "conditional에서 unconditional prediction을 빼",
                "condition이 만든 incremental direction 분리",
              ],
            },
            {
              expression: String.raw`w(\epsilon_c-\epsilon_u)`,
              annotation: [
                "incremental direction에 scale을 곱해",
                "condition adherence 강도 조절",
              ],
            },
            {
              expression: String.raw`\epsilon_u+w(\epsilon_c-\epsilon_u)`,
              annotation: [
                "공통 generation direction에 scaled condition 방향을 더해",
                "guided prediction 구성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\epsilon_u`,
              name: "Unconditional prediction",
              description: "Condition을 비운 branch의 output입니다.",
            },
            {
              symbol: String.raw`\epsilon_c`,
              name: "Conditional prediction",
              description: "Text 등 condition을 제공한 branch의 output입니다.",
            },
            {
              symbol: String.raw`w`,
              name: "Guidance scale",
              description: "Condition-only direction의 sampling gain입니다.",
            },
          ]}
          assumptions={[
            "Training에서 condition dropout으로 두 behavior를 함께 학습했습니다.",
            "두 branch가 같은 noisy latent와 timestep을 평가합니다.",
          ]}
          interpretation="w=1이면 εc와 정확히 같습니다. w=0이면 εu이고, w>1은 conditional 방향을 extrapolate합니다."
        />
        <LearningTerm
          name="Classifier guidance (CFG 이전 방식)"
          shape="ŝ = ∇log p(xₜ) + w·∇_{xₜ} log p(y|xₜ)"
          meaning="Diffusion model과 별개로, noisy input마다 label을 맞히는 classifier p(y|xₜ)를 따로 학습합니다. 그 classifier의 gradient(‘이 방향으로 가면 y일 확률이 커진다’)를 unconditional score에 더해 조건 방향으로 밉니다."
          example="Diffusion model은 그대로 두고, ImageNet classifier처럼 매 noise level에서 동작하도록 다시 학습한 classifier 하나만 추가합니다."
          boundary="Noisy input에서도 잘 동작하는 classifier를 별도로 학습해야 하고, gradient가 image quality가 아니라 classifier confidence를 높이는 adversarial 방향으로 흐를 수 있습니다 — 이게 CFG가 나온 이유입니다."
        />
        <p className="text-sm leading-7 text-muted-foreground">
          CFG는 이 별도 classifier를 없애고, condition dropout으로 학습한 diffusion
          model 하나가 <code>εᵤ</code>와 <code>ε_c</code> 두 역할을 모두 하게 만듭니다.
          두 방법 모두 &ldquo;unconditional 방향에 condition 방향을 더한다&rdquo;는 같은
          아이디어지만, classifier guidance는 그 방향을 <strong>외부 classifier의
          gradient</strong>에서 얻고 CFG는 <strong>같은 network의 conditional−
          unconditional 차이</strong>에서 얻습니다 — 그래서 CFG는 추가 학습·추가
          adversarial 실패 모드 없이 guidance 방향을 만듭니다.
        </p>
        <p className="text-sm leading-7 text-muted-foreground">
          CFG의 같은 extrapolation 아이디어를 attention output 레벨로 옮기면
          Normalized Attention Guidance(NAG)가 됩니다. Noise prediction
          εᵤ·ε_c 대신 positive·negative attention output 사이에 같은 형태의
          extrapolation을 적용하되, L1-norm 기반 clamp(τ)로 결과가 원래
          norm의 τ배를 넘지 못하게 누르고 원래 값과 α만큼 blend해 되돌립니다.
          이 두 안전장치는 CFG에는 없는 것으로, guidance scale이 클수록
          extrapolation이 원래 attention output에서 점점 멀어지다 결국
          collapse하는(few-step·distilled model에서 CFG가 자주 실패하는
          지점) 현상을 완화하기 위해 추가됐습니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <CodeViewButton
            label="NAGAttnProcessor2_0 — extrapolation·clamp·blend 실제 구현"
            onClick={() => sidebar.open("nag-guidance-branch", codeRefs["nag-guidance-branch"])}
          />
        </div>
      </section>

      <section id="evaluation" className="space-y-6">
        <LearningHeader
          n="03"
          kicker="좋아 보이는 한 장에서 release로"
          title="Conditional generation release gate는 품질·coverage·condition·비용을 따로 판정한다"
        />
        <LearningTerm
          name="Conditional diffusion release gate"
          shape="reconstruction ∧ quality ∧ coverage ∧ condition ∧ latency"
          meaning="Autoencoder와 guidance가 만든 서로 다른 trade-off를 한 metric에 숨기지 않고 각 threshold를 모두 통과해야 배포하는 평가 계약입니다."
          example="FID가 좋아져도 prompt adherence가 낮거나 p95 latency가 budget을 넘으면 release하지 않습니다."
          boundary="Metric threshold는 dataset·evaluator·sample count·hardware·sampler revision과 함께 versioned해야 합니다."
        />
        <ExplainedFormula
          question="왜 평가 점수를 평균하지 않고 gate를 AND로 묶을까요?"
          idea="한 축의 큰 개선으로 다른 축의 실패를 상쇄하면 실제 product contract가 깨집니다. 각 필수 조건을 boolean으로 판정한 뒤 모두 참일 때만 release합니다."
          formula={String.raw`G_{\rm release}=G_{\rm recon}\land G_{\rm quality}\land G_{\rm coverage}\land G_{\rm condition}\land G_{\rm latency}`}
          annotatedFormula={String.raw`\begin{aligned}
G_s&=\underbrace{G_{\rm quality}\land G_{\rm coverage}}_{\text{품질과 mode 범위를 모두 판정}}\\
G_p&=\underbrace{G_{\rm condition}\land G_{\rm latency}}_{\text{조건 준수와 비용을 모두 판정}}\\
G_{\rm release}&=\underbrace{G_{\rm recon}\land G_s\land G_p}_{\text{필수 gate를 모두 AND로 결합}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`G_{\rm quality}\land G_{\rm coverage}`,
              annotation: [
                "fidelity와 mode coverage를 둘 다 요구해",
                "sharp collapse가 좋은 평균으로 숨는 것 방지",
              ],
            },
            {
              expression: String.raw`G_{\rm recon}\land G_{\rm condition}`,
              annotation: [
                "compression ceiling과 condition correctness를 함께 확인해",
                "서로 다른 stage failure를 분리",
              ],
            },
            {
              expression: String.raw`\bigwedge_i G_i`,
              annotation: [
                "모든 mandatory gate를 AND로 결합해",
                "한 실패도 다른 score로 상쇄하지 않는 release 판정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`G_i`,
              name: "Versioned acceptance gate",
              description:
                "Metric·threshold·dataset·artifact revision을 가진 boolean 판정입니다.",
            },
          ]}
          assumptions={[
            "각 metric implementation과 sample population을 고정합니다.",
            "Latency는 target hardware·precision·batch·sampler에서 측정합니다.",
          ]}
          interpretation="Release receipt는 autoencoder, text encoder, denoiser, scheduler, sampler, w, precision과 evaluator revision을 함께 보존해야 합니다."
        />
        <div id="paper-latent-diffusion">
          <CitationBlock
            source="Rombach et al. · High-Resolution Image Synthesis with Latent Diffusion Models"
            citeKey={1}
            href="https://arxiv.org/abs/2112.10752"
          >
            <EvidenceFields
              problem="Pixel-space diffusion의 높은 training·sampling compute"
              contribution="Pretrained autoencoder latent에서 denoising하고 cross-attention으로 condition 주입"
              assumptions="Autoencoder compression·latent scale·U-Net·dataset configuration"
              scope="논문의 generation·inpainting·super-resolution 실험"
              notClaim="Compression이 lossless이거나 모든 modality에서 같은 speedup을 보장하지 않음"
            />
          </CitationBlock>
        </div>
        <div id="paper-classifier-free-guidance">
          <CitationBlock
            source="Ho & Salimans · Classifier-Free Diffusion Guidance"
            citeKey={2}
            href="https://arxiv.org/abs/2207.12598"
          >
            <EvidenceFields
              problem="별도 classifier 없이 conditional fidelity와 diversity를 조절하는 문제"
              contribution="Condition dropout과 conditional·unconditional score 결합"
              assumptions="Conditional diffusion·dropout·guidance formulation"
              scope="논문의 ImageNet IS·FID trade-off"
              notClaim="큰 guidance scale이 항상 더 좋거나 추가 compute가 없지 않음"
            />
          </CitationBlock>
        </div>
        <div data-viz="latent-diffusion-concepts">
          <ConceptLadderViz
            title="Latent generation의 개념 조합"
            description="압축을 이해한 뒤 component와 condition을 붙이고 마지막에 release를 판정합니다."
            steps={[
              { label: "Compress", detail: "pixel↔latent lossy interface" },
              { label: "Contract", detail: "encoder·denoiser·sampler·decoder" },
              { label: "Guide", detail: "condition-only direction scale" },
              { label: "Release", detail: "quality·coverage·cost gate" },
            ]}
          />
        </div>
        <ContentBoundary article="latent-diffusion-guidance" />
      </section>
    </article>
    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ nag: nagTree }}
      projectMetas={{
        nag: {
          id: "nag",
          label: "Normalized-Attention-Guidance · Python",
          badgeClass: "bg-yellow-500/10 border-yellow-500 text-yellow-700",
        },
      }}
    />
    </>
  );
}
