import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import AdapterScopeMap from "./image-video-lora-architecture/viz/AdapterScopeMap";

export default function ImageVideoLoraArchitectureArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          LoRA 수식이 같아도 학습되는 능력은 host architecture가 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            언어 모델과 이미지·영상 생성 모델의 LoRA는 모두 frozen weight에
            저랭크 변화량을 더합니다. 하지만 “LoRA를 붙였다”만으로는 무엇을
            학습했는지 알 수 없습니다. Adapter가 들어간 원래 모델의 어느 경로가
            공간 모양, 시간 변화, text 조건을 처리하는지가 실제 능력의 범위를
            정하기 때문입니다.
          </p>
          <p>
            예를 들어 image denoiser의 attention projection을 바꾸면 한 장면의 subject나 style을 학습할 수 있습니다. 같은 이름의
            projection이 video model 안에 있어도 frame 내부의 공간 attention인지, frame 사이의 시간 attention인지, audio와 video를
            잇는 cross-modal attention인지에 따라 update가 닿는 정보가 달라집니다.
          </p>
          <p>
            따라서 이 글은 <Link to="/ai/lora-finetuning#lora">LoRA의 행렬식</Link>을
            다시 유도하지 않습니다. 대신 <strong>host inventory → target scope →
            clip 학습 → 독립 평가</strong> 순서로, image 설정을 video 설정에 복사할
            때 빠지는 경계를 설명합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="이 글을 읽기 전에 어떤 세 개념만 알면 되나요?"
          preview="LoRA는 변화량을 줄이고, latent diffusion은 생성 pipeline을 나누며, video token은 시간축을 추가합니다."
        >
          <p>
            <a href="/ai/lora-finetuning#lora">LoRA</a>는 base weight 전체 대신
            선택한 linear weight의 변화량을 두 작은 행렬로 표현합니다. 여기서는
            그 식보다 “선택한 linear weight가 무슨 일을 하는가”가 관심사입니다.
          </p>
          <p>
            <a href="/ai/latent-diffusion-guidance#pipeline">Latent diffusion</a>은
            autoencoder, text conditioner, denoiser, sampler를 서로 다른 component로
            둡니다. 마지막으로 <a href="/ai/video-transformers#tubelets">video
            token</a>은 한 장의 공간 patch가 아니라 여러 frame을 포함하므로 시간축
            일관성을 별도로 다뤄야 합니다.
          </p>
        </ProgressiveDetail>
        <ContentBoundary article="image-video-lora-architecture" />
        <AdapterScopeMap />
      </section>

      <section id="image-scope" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Image LoRA는 먼저 denoiser 안의 실제 module을 찾습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Text-to-image pipeline에는 보통 image를 latent로 바꾸는 autoencoder,
            prompt를 embedding으로 바꾸는 text encoder, noisy latent를 복원하는
            denoiser가 있습니다. 이 중 style이나 subject adaptation의 기본 출발점은
            denoiser입니다. 학습 시 매 step의 prediction loss가 직접 통과하는
            component이기 때문입니다.
          </p>
          <p>
            그렇다고 모든 denoiser가 같은 module 이름을 쓰는 것은 아닙니다. U-Net은 spatial block과 attention을 섞을 수 있고 DiT는
            transformer block을 중심으로 구성합니다. Fused QKV를 쓰는 model과 Q·K·V가 분리된 model도 다릅니다. 그래서 설정 문자열을 복사하기 전에
            named module 목록과 실제 trainable parameter 수를 출력해야 합니다.
          </p>
          <p>
            Hugging Face Diffusers의 text-to-image 예제는 U-Net의
            <code>to_q</code>, <code>to_k</code>, <code>to_v</code>,
            <code>to_out.0</code>을 target으로 둡니다. 이는 해당 예제를 이해하는
            좋은 출발점이지, 모든 image model의 보편 target 목록은 아닙니다.
          </p>
        </div>
        <TermBreakdown
          title="Image pipeline에서 adapter 범위를 나누는 세 component"
          items={[
            {
              term: "Denoiser target scope",
              description:
                "Noise 또는 velocity를 예측하는 U-Net·DiT 내부에서 LoRA를 붙일 실제 linear module 집합입니다.",
              example:
                "Attention projection만 학습할지, FFN projection까지 넓힐지 named module과 parameter 수로 확인합니다.",
              boundary:
                "Module 이름이 같아도 model family마다 역할과 fused layout이 다를 수 있습니다.",
            },
            {
              term: "Text-encoder scope",
              description:
                "새 token·이름과 prompt 표현 자체를 바꿔야 할 때 선택적으로 학습하는 조건 경로입니다.",
              example:
                "Denoiser-only와 denoiser+text-encoder run을 같은 validation prompt로 비교합니다.",
              boundary:
                "항상 켜는 기본값이 아니며 추가 memory와 language drift를 따로 평가합니다.",
            },
            {
              term: "Frozen pipeline components",
              description:
                "VAE·scheduler처럼 현재 adaptation에서 학습하지 않지만 input scale과 output ceiling을 정하는 component입니다.",
              example:
                "같은 adapter라도 다른 VAE revision으로 decode하면 artifact가 달라질 수 있어 revision을 기록합니다.",
              boundary:
                "Frozen이라는 말은 영향이 없다는 뜻이 아니라 gradient update 대상이 아니라는 뜻입니다.",
            },
          ]}
        />
        <div className="not-prose my-8">
          <CitationBlock
            source="Hugging Face Diffusers — LoRA training guide"
            citeKey={1}
            href="https://huggingface.co/docs/diffusers/main/training/lora"
          >
            공식 text-to-image 예제는 U-Net attention projection 네 종류에 LoRA를
            추가하고, requires_grad가 켜진 LoRA parameter만 optimizer에 전달합니다.
            문서 자체도 이 코드를 특정 training script의 walkthrough로 한정합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="video-scope" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Video LoRA는 “무엇이 움직이는가”를 별도 경로로 추적합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Video model의 input은 한 장이 아니라 여러 frame으로 이어진 clip입니다.
            한 frame 안의 모양을 처리하는 공간 경로와 frame 사이 변화를 처리하는
            시간 경로가 분리돼 있다면, 어느 쪽을 학습하느냐에 따라 adapter의 의미도
            appearance와 motion으로 갈립니다.
          </p>
          <p>
            최신 video DiT는 이 구분이 module 이름에 그대로 드러나지 않을 수도
            있습니다. Joint space-time attention을 쓰거나 audio·video branch와
            양방향 cross-attention을 함께 둘 수 있기 때문입니다. 짧은
            <code>to_q</code> pattern 하나가 모든 attention에 match하면 간편하지만,
            의도하지 않은 modality 경로까지 학습할 수 있습니다.
          </p>
          <p>
            LTX-2의 현재 공개 T2V LoRA 설정은 실제로 짧은 projection pattern이
            video·audio·cross-modal attention에 모두 match한다고 설명합니다. 이
            선택은 audio-video 공동 생성을 위한 해당 설정의 권장값입니다. 다른
            video backbone에서 같은 문자열을 사용해야 한다는 규칙은 아닙니다.
          </p>
        </div>
        <TermBreakdown
          title="Video adapter가 구분해야 하는 세 정보 경로"
          items={[
            {
              term: "Spatial path",
              description:
                "각 frame 안에서 subject 모양·texture·배치를 처리하는 경로입니다.",
              example:
                "한 training step에서 무작위 한 frame만 써 appearance adapter를 학습할 수 있습니다.",
              boundary:
                "좋은 단일 frame 품질만으로 frame 사이 운동이 맞는지는 알 수 없습니다.",
            },
            {
              term: "Temporal path",
              description:
                "여러 frame의 순서와 변화량을 연결해 motion과 temporal consistency를 처리하는 경로입니다.",
              example:
                "걷는 동작을 학습하려면 한 frame이 아니라 같은 clip의 연속 frame이 loss에 들어가야 합니다.",
              boundary:
                "Reference 영상의 배경·인물까지 motion과 함께 외우는 coupling이 생길 수 있습니다.",
            },
            {
              term: "Cross-modal path",
              description:
                "Text·audio·video처럼 서로 다른 modality의 feature가 서로를 조건화하는 경로입니다.",
              example:
                "Audio query가 video key/value를 읽는 attention에 LoRA를 붙이면 lip-sync 조건화도 update 범위에 들어갑니다.",
              boundary:
                "Video-only adaptation에서 이 경로까지 여는 것은 불필요한 capacity와 drift를 만들 수 있습니다.",
            },
          ]}
        />
        <div id="paper-motiondirector" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="MotionDirector — ECCV 2024"
            citeKey={2}
            href="https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/07327.pdf"
          >
            저자들은 spatial LoRA를 한 frame의 appearance에, temporal LoRA를 여러
            frame의 motion에 각각 학습하는 dual-path 구조와 appearance-debiased
            temporal loss를 제안했습니다. 이는 논문이 사용한 video diffusion
            backbone·benchmark에서 appearance와 motion coupling을 줄인 한 방법이며,
            모든 video LoRA가 반드시 두 adapter를 가져야 한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <ProgressiveDetail
          title="Image LoRA를 video model에 불러오면 motion LoRA가 되나요?"
          preview="아닙니다. Weight shape가 호환돼도 spatial appearance update와 temporal motion update는 같은 학습 신호가 아닙니다."
        >
          <p>
            Image adapter가 video backbone의 spatial layer와 호환되면 frame별
            appearance prior로 재사용할 수는 있습니다. 그러나 그 adapter는 연속
            frame의 변화나 속도를 본 적이 없으므로 motion을 학습했다고 볼 수
            없습니다.
          </p>
          <p>
            반대로 video clip으로 모든 projection을 한꺼번에 학습하면 motion과
            reference appearance가 하나의 adapter에 얽힐 수 있습니다. 분리 adapter,
            block별 target scope, loss 설계는 이 coupling을 줄이는 서로 다른
            선택지이며 validation으로 구분해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="training-evaluation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 장의 품질이 아니라 clip 전체와 target 범위를 함께 검증합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Image LoRA의 training sample은 image와 caption으로 시작할 수 있지만 video LoRA의 sample은 clip 길이, frame rate,
            해상도 bucket, crop과 conditioning 구간까지 포함합니다. 같은 영상을 서로 다른 FPS로 읽으면 model이 보는 motion 속도도 달라지므로 이
            metadata는 단순 loader option이 아니라 학습 대상의 정의입니다.
          </p>
          <p>
            학습 전에는 target module을 확정하고 trainable parameter 목록을 저장합니다. 학습 후에는 held-out prompt에서 frame quality,
            prompt adherence, subject·style fidelity를 보고 영상이면 여기에 temporal consistency와 motion fidelity를 따로
            더합니다. 첫 frame만 예쁘게 뽑아 성공으로 판정하면 temporal path의 실패를 숨기게 됩니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Image·video LoRA run을 재현 가능하게 고정하는 절차"
          input={[
            "base pipeline revision과 실제 named modules",
            "image 또는 clip dataset + caption/condition metadata",
            "candidate target patterns, rank, alpha, optimizer budget",
            "held-out prompts·seeds와 image/clip evaluators",
          ]}
          steps={[
            {
              code: "inventory ← enumerate(base.named_modules)",
              note: "Pattern 문자열이 실제로 match한 full path와 weight shape를 저장합니다.",
            },
            {
              code: "targets ← classify(inventory, spatial, temporal, cross_modal, text_encoder)",
              note: "이름이 아니라 host architecture에서 맡은 역할로 분류합니다.",
            },
            {
              code: "adapters ← attach_lora(targets, rank, alpha); freeze(base − explicit_trainables)",
              note: "Trainable parameter 수와 예상 checkpoint key를 학습 전에 검증합니다.",
            },
            {
              code: "sample ← load(image_or_clip, caption, fps, frames, resolution, conditions)",
              note: "Image에는 없는 시간·condition metadata를 video sample identity에 포함합니다.",
            },
            {
              code: "prediction, target ← run_denoising_objective(sample); update(adapters)",
              note: "Reference·first-frame처럼 clean condition은 noise와 loss 대상인지 별도로 표시합니다.",
            },
            {
              code: "artifact ← save(adapter_weights, target_paths, base_revision, preprocessing, metrics)",
              note: "Adapter weight만 저장하고 어떤 host 범위에서 만들어졌는지를 잃으면 재사용할 수 없습니다.",
            },
            {
              code: "release ← evaluate(held_out_images, held_out_clips, base_regression, cost)",
              note: "Video는 frame metric과 temporal·motion metric을 분리하고 원본 clip도 함께 봅니다.",
            },
          ]}
          repeatUntil="Target·generalization·temporal slice가 정한 기준을 넘고, base capability와 비용 회귀가 허용 범위 안에 들 때까지 candidate scope를 한 축씩 바꿉니다."
          output="adapter artifact + exact host/target manifest + image/clip evaluation report"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 절차에서 핵심은 rank만 기록하지 않는 것입니다. 같은 rank 16이라도
            spatial attention 네 projection에만 붙인 run과 audio·video·cross-modal
            attention 전체에 붙인 run은 parameter 수와 학습 능력이 전혀 다릅니다.
          </p>
          <p>
            Reference와 target을 한 context로 넣어 별도 adapter architecture 없이
            조건화를 배우는 방법은 다음 글인 <Link to="/ai/in-context-lora">IC-LoRA</Link>에서
            이어집니다. 그 글을 읽을 때도 먼저 이 글의 host·target 범위를 확인해야
            “in-context”라는 이름이 실제로 어느 weight를 바꾸는지 알 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
