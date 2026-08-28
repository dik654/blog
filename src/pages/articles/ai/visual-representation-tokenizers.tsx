import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import VisualRepresentationMap from "./visual-representation-tokenizers/viz/VisualRepresentationMap";

export default function VisualRepresentationTokenizersArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="objective" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Image를 token으로 줄인다는 말만으로는 무엇을 남겼는지 알 수 없습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            현대 image model은 pixel을 그대로 끝까지 처리하기보다 더 작은 숫자
            표현으로 바꿉니다. 이때 흔히 모두를 visual token이라고 부르지만,
            생성용 autoencoder latent와 인식용 semantic feature는 같은 물체가
            아닙니다. 둘의 차이는 architecture 이름보다 <strong>어떤 loss가 무엇을
            보존하도록 요구했는가</strong>에서 시작합니다.
          </p>
          <p>
            생성 model의 latent는 decoder가 원래 image를 되살릴 수 있어야 합니다.
            반면 CLIP·SigLIP·DINO 계열의 representation은 text와의 대응, 같은 image의
            view 일치, teacher-student 일치처럼 semantic relation을 보존하도록
            학습됩니다. 좋은 retrieval feature가 반드시 좋은 image decoder input인
            것도 아니고, reconstruction이 좋은 latent가 반드시 object·affordance를
            잘 분리하는 것도 아닙니다.
          </p>
          <p>
            이 구분은 뒤의 world model에서 더 중요해집니다. 다음 상태를 예측하려면
            texture를 모두 보존하는 것보다 움직일 물체와 접촉 상태를 남기는 편이
            유리할 수 있지만, 로봇이 작은 손잡이를 잡아야 한다면 그 detail을 지운
            semantic feature도 부족할 수 있기 때문입니다.
          </p>
        </div>
        <VisualRepresentationMap />
        <ContentBoundary article="visual-representation-tokenizers" />
      </section>

      <section id="reconstruction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Reconstruction latent는 계산량을 줄이는 대신 복원 상한을 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Latent diffusion의 autoencoder는 image <code>x</code>를 더 작은 spatial
            tensor <code>z</code>로 압축합니다. 예를 들어 1024×1024 RGB image를
            공간축 8배 압축하면 latent grid는 128×128이 됩니다. Channel 수가 16이라면
            원 pixel scalar는 약 314만 개, latent scalar는 약 26만 개입니다. Denoiser가
            반복해서 처리할 위치 수가 크게 줄어드는 이유입니다.
          </p>
          <p>
            하지만 decoder는 <code>z</code>에 남아 있지 않은 정보를 복구할 수 없습니다.
            따라서 diffusion transformer가 완벽한 latent를 만들더라도 autoencoder가
            가는 글자 획이나 피부 texture를 잃었다면 최종 image에는 reconstruction
            ceiling이 남습니다. 압축률은 단순 memory option이 아니라 생성 가능한
            detail의 상한입니다.
          </p>
        </div>
        <ExplainedFormula
          question="공간 압축률 f가 latent 위치 수와 반복 denoising 비용을 어떻게 바꾸나요?"
          idea="Height와 width를 각각 f로 나누므로 spatial 위치 수는 f²로 줄어듭니다. 대신 각 위치의 channel c_z가 여러 pixel의 정보를 함께 운반합니다."
          formula={String.raw`N_z=\frac{H}{f}\frac{W}{f},\qquad |z|=N_zc_z`}
          annotatedFormula={String.raw`\begin{aligned}
N_z&=\underbrace{\frac{H}{f}\frac{W}{f}}_{\substack{\text{두 공간축을 각각 압축}\text{위치 수는 }f^2\text{만큼 감소}}}\\
|z|&=\underbrace{N_zc_z}_{\text{위치 수}\times\text{latent channel payload}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`H/f`,
              annotation: ["image height를", "spatial compression factor로 축소"],
            },
            {
              expression: String.raw`W/f`,
              annotation: ["image width도 같은 방식으로 줄여", "2D latent grid 구성"],
            },
            {
              expression: String.raw`N_zc_z`,
              annotation: ["latent 위치 수에 channel payload를 곱해", "전체 latent scalar 수 계산"],
            },
          ]}
          terms={[
            { symbol: "H,W", name: "Image size", description: "입력 image의 pixel height와 width입니다." },
            { symbol: "f", name: "Spatial compression", description: "각 공간축을 몇 배 줄이는지 나타냅니다." },
            { symbol: "c_z", name: "Latent channels", description: "압축된 한 위치가 운반하는 feature 수입니다." },
          ]}
          assumptions={["H와 W가 f로 나누어떨어지는 단순한 grid 예입니다.", "실제 비용은 channel·patch size·attention 방식·network width에도 좌우됩니다."]}
          interpretation="f=8이면 spatial 위치는 64분의 1이 되지만 전체 compute가 정확히 64분의 1이라는 뜻은 아닙니다. Channel 수와 transformer tokenization이 다시 비용을 바꿉니다."
        />
        <div id="paper-ldm" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Rombach et al. · High-Resolution Image Synthesis with Latent Diffusion Models"
            citeKey={1}
            href="https://openaccess.thecvf.com/content/CVPR2022/html/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper.html"
          >
            LDM은 perceptual compression을 먼저 학습한 뒤 그 latent space에서 diffusion을
            수행해 계산량과 detail 보존 사이의 경계를 조절했습니다. 이 결과는 논문의
            autoencoder·dataset·metric 범위이며 모든 compression ratio의 우위를 뜻하지
            않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="semantic" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Semantic encoder는 pixel 복사보다 task에 필요한 불변성을 배웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Semantic representation은 같은 object를 crop하거나 조명을 바꿔도 비슷한
            feature를 내도록 학습될 수 있습니다. Recognition에는 유용하지만 decoder가
            원 image의 정확한 조명과 pixel phase를 복원하려면 이미 지워진 차이일 수
            있습니다. 여기서 invariance는 공짜 robustness가 아니라 어떤 차이를
            의도적으로 무시한 결과입니다.
          </p>
          <p>
            최근에는 pretrained semantic encoder에 별도 decoder를 붙여 생성 latent로
            재사용하는 representation autoencoder 연구도 나왔습니다. 의미가 풍부한
            feature를 생성 backbone에 넣을 수 있다는 장점이 있지만, latent channel이
            넓어지고 feature 통계가 기존 VAE와 달라 transformer head와 decoder를 다시
            설계해야 합니다. 2025년 RAE 결과는 유망한 연구 방향이지 모든 production
            image model의 새 기본값으로 확정된 사실은 아닙니다.
          </p>
        </div>
        <TermBreakdown
          title="Visual representation을 고를 때 확인할 네 질문"
          items={[
            {
              term: "Objective",
              description: "Reconstruction, text alignment, self-distillation, future prediction 중 무엇이 feature를 보상했는지 확인합니다.",
              boundary: "Encoder 이름만으로 보존 정보를 확정하지 않습니다.",
            },
            {
              term: "Spatial granularity",
              description: "Global vector인지 patch grid인지, 작은 object와 위치 정보를 어느 해상도로 남기는지 봅니다.",
              example: "Image-level retrieval vector는 object 위치가 필요한 manipulation state로는 부족할 수 있습니다.",
            },
            {
              term: "Decoder contract",
              description: "Feature에서 pixel·depth·mask·future state 중 무엇을 실제로 복원하도록 학습했는지 기록합니다.",
              boundary: "Decoder를 나중에 붙일 수 있다는 말과 정보가 feature에 남아 있다는 말은 다릅니다.",
            },
            {
              term: "Consumer",
              description: "Diffusion backbone, VLM projector, world predictor, robot policy 중 누가 이 표현을 읽는지 고정합니다.",
              boundary: "한 consumer의 benchmark 우위를 다른 consumer로 자동 전이하지 않습니다.",
            },
          ]}
        />
        <div id="paper-rae" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zheng et al. · Diffusion Transformers with Representation Autoencoders"
            citeKey={2}
            href="https://arxiv.org/abs/2510.11690"
          >
            저자들은 DINO·SigLIP·MAE 계열 encoder와 학습한 decoder를 결합한 RAE와,
            넓은 latent channel을 처리할 DiT head를 제안했습니다. 현재는 2025년
            preprint의 저자 자기보고이므로, semantic latent가 기존 VAE를 보편적으로
            대체했다고 쓰지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="world-state" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          월드모델의 state는 예쁜 image latent보다 행동 결과를 예측할 수 있어야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Image generator는 조건에 맞는 한 장을 만드는 데 성공하면 됩니다. 월드모델은
            현재 state와 action을 받았을 때 다음 state가 어떻게 변하는지 예측해야 합니다.
            따라서 visual tokenizer를 고를 때도 reconstruction FID만 볼 수 없습니다.
            Object permanence, motion, contact, camera motion과 controllability가 feature에
            남아 있는지 별도로 검증해야 합니다.
          </p>
          <p>
            다음 글인 <Link to="/ai/diffusion-transformer-architecture">Diffusion
            Transformer 구조</Link>에서는 이 latent를 실제 token sequence로 바꾸고
            time·text 조건을 transformer block에 넣는 방법을 살펴봅니다. 이후 modern
            image stack을 통합한 뒤에야 video와 action-conditioned state transition으로
            넘어갈 준비가 됩니다.
          </p>
        </div>
        <ProgressiveDetail
          title="좋은 world-state representation인지 어떤 작은 실험으로 확인할 수 있나요?"
          preview="같은 appearance 안에서 action만 바꾸고 next-state 예측이 달라지는지, 반대로 무관한 texture 변화에는 안정적인지 짝지어 봅니다."
        >
          <p>
            같은 장면에서 push-left와 push-right action만 바꾼 두 rollout을 만들고,
            representation predictor가 서로 다른 next state를 내는지 확인합니다. 이어
            물체와 action은 같고 조명만 바꾼 pair에서 state prediction이 불필요하게
            흔들리지 않는지 봅니다.
          </p>
          <p>
            이 두 실험은 각각 action sensitivity와 nuisance invariance를 봅니다. Pixel
            reconstruction 하나로 둘을 대신할 수 없으며, 실제 policy consumer의 success와
            closed-loop error까지 연결해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>
    </div>
  );
}
