import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ModernImageStackViz from "./modern-image-model-stack/viz/ModernImageStackViz";

export default function ModernImageModelStackArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="system-map" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          현대 이미지 생성 모델은 하나가 아니라 시스템입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            사용자는 prompt 하나를 넣고 image 하나를 받습니다. 그래서 model 하나가
            처음부터 끝까지 처리한다고 느끼기 쉽습니다.
          </p>
          <p>
            실제 latent diffusion이나 flow 기반 제품은 여러 component로 나뉩니다.
            Prompt encoder가 요청을 읽고, autoencoder가 image를 압축·복원합니다.
            Transformer는 noisy latent를 갱신하고 solver는 sampling path를 적분합니다.
            제품에 따라 prompt expander와 reference encoder, upscaler가 더 붙습니다.
          </p>
          <p>
            이 분해를 알아야 “아키텍처가 좋아졌다”는 말을 정확히 읽을 수 있습니다.
            글자 이해가 좋아진 원인이 text encoder와 caption data일 수도 있고, 피부
            detail의 상한은 VAE가 만들 수도 있으며, 구조 artifact는 denoiser와
            post-training reward가 함께 바꿀 수 있습니다. 최종 sample만 보고 한 component에
            원인을 몰아주면 잘못된 LoRA target과 잘못된 평가로 이어집니다.
          </p>
          <p>
            앞의 <Link to="/ai/visual-representation-tokenizers">visual representation
            글</Link>은 어떤 정보를 latent에 남길지를 다뤘고, <Link to="/ai/diffusion-transformer-architecture">DiT
            글</Link>은 그 latent를 어떻게 복원하는지 다뤘습니다. 이 글은 두 층을 실제
            text-to-image system으로 조립합니다.
          </p>
        </div>
        <ModernImageStackViz />
        <ContentBoundary article="modern-image-model-stack" />
      </section>

      <section id="component-contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          각 component는 tensor와 정보의 경계를 명시적으로 넘겨야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prompt encoder는 문자열을 condition token <code>c</code>로 바꿉니다.
            Autoencoder는 학습 image를 latent <code>z₀</code>로 압축하고, sampling 뒤에는
            생성 latent를 pixel로 복원합니다. DiT는 중간 상태 <code>zₜ</code>와 time을
            받아 velocity 또는 noise를 예측합니다. Solver는 그 예측을 이용해
            <code>z₁</code>의 noise에서 <code>z₀</code>로 이동합니다.
          </p>
          <p>
            중요한 점은 이들이 독립적으로 교체 가능한 동시에 완전히 독립적이지 않다는
            것입니다. Autoencoder를 바꾸면 latent scale·channel·reconstruction ceiling이
            달라지고, text encoder를 바꾸면 condition length와 feature distribution이
            달라집니다. DiT checkpoint는 학습 때 본 exact contract와 맞아야 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="현대 latent image generator의 한 sample은 어떤 두 변환을 거치나요?"
          idea="Transformer는 latent path의 순간 velocity를 반복 예측하고 solver가 그 path를 적분합니다. 마지막 latent만 decoder가 pixel image로 바꿉니다."
          formula={String.raw`\frac{dz_t}{dt}=v_\theta(z_t,t,c),\qquad \hat x=D(z_0)`}
          annotatedFormula={String.raw`\begin{aligned}
\frac{dz_t}{dt}&=\underbrace{v_\theta(z_t,t,c)}_{\substack{\text{현재 latent·time·condition에서}\text{이동할 방향을 DiT가 예측}}}\\
z_0&=\underbrace{\operatorname{Solve}(z_1,v_\theta,c)}_{\text{noise에서 data latent까지 반복 적분}}\\
\hat x&=\underbrace{D(z_0)}_{\text{마지막 latent를 pixel로 복원}}
\end{aligned}`}
          operations={[
            { expression: String.raw`v_\theta(z_t,t,c)`, annotation: ["현재 latent와 조건을 결합해", "한 sampling step의 이동 방향 예측"] },
            { expression: String.raw`\operatorname{Solve}(z_1,v_\theta,c)`, annotation: ["network prediction을 여러 time에 누적해", "terminal noise에서 생성 latent 계산"] },
            { expression: String.raw`D(z_0)`, annotation: ["압축 latent를 decoder에 넣어", "최종 RGB image 복원"] },
          ]}
          terms={[
            { symbol: "z_t", name: "Noisy latent state", description: "Sampling time t에서의 압축 image state입니다." },
            { symbol: "c", name: "Condition tokens", description: "Prompt·reference image 등에서 얻은 조건 표현입니다." },
            { symbol: "D", name: "Image decoder", description: "생성 latent를 pixel image로 되돌리는 autoencoder decoder입니다." },
          ]}
          assumptions={["Rectified-flow/ODE 표기로 단순화했습니다. Stochastic sampler나 noise-prediction parameterization은 update 식이 달라집니다.", "z₁의 prior·time 방향·latent scale은 checkpoint와 solver convention에 맞아야 합니다."]}
          interpretation="이 식에서 DiT는 pixel을 직접 내지 않습니다. 따라서 denoiser 개선과 decoder reconstruction 개선은 서로 다른 실험으로 분리해야 합니다."
        />
        <TermBreakdown
          title="교체 전에 고정할 component interface"
          items={[
            { term: "Condition encoder contract", description: "Tokenizer·max length·hidden width·pooled/token output과 image-reference 입력 지원을 고정합니다.", boundary: "더 큰 text encoder가 image quality를 자동 보장하지 않습니다." },
            { term: "Autoencoder contract", description: "Spatial compression, channel 수, latent scaling, decoder revision과 reconstruction metric을 기록합니다.", boundary: "Latent shape만 같아도 feature distribution이 다르면 checkpoint가 호환되지 않을 수 있습니다." },
            { term: "Denoiser contract", description: "Prediction target, time parameterization, condition path, stream design과 output shape를 고정합니다.", boundary: "U-Net과 DiT는 같은 외부 contract를 구현할 수 있지만 내부 target module은 다릅니다." },
            { term: "Sampler contract", description: "Solver·schedule·NFE·guidance scale과 seed를 checkpoint 평가에 함께 기록합니다.", boundary: "더 적은 step의 품질은 solver 하나가 아니라 training recipe·distillation과 결합된 결과일 수 있습니다." },
          ]}
        />
      </section>

      <section id="training-stack" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          데이터와 학습 단계도 출력 분포를 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 DiT block을 사용해도 training data와 caption이 다르면 prompt와 visual
            feature의 연결이 달라집니다. 넓은 pretraining 분포는 world knowledge와
            long-tail style을 만듭니다.
          </p>
          <p>
            고해상도 stage는 detail을 더 학습합니다. 이후의 curated SFT와 preference
            optimization, RL은 자주 나오는 artifact와 기본 미감을 바꿉니다. Architecture는
            이런 신호를 담는 그릇이지 output 분포의 유일한 원인이 아닙니다.
          </p>
          <p>
            Krea 2 공식 technical report는 이 다층 구조를 보여 주는 현재 사례입니다.
            모델 구조만 공개한 것이 아니라 데이터 준비부터 prompt 확장과 post-training까지
            하나의 생성 시스템으로 설명합니다.
          </p>
          <p>
            이 목록을 “현대 image model의 필수 부품”으로 외우면 안 됩니다. 보고서 안에서도
            hybrid stream이 약간 앞섰지만 단순성을 위해 single stream을 골랐고, MLA는
            약간의 gain에도 compute overhead 때문에 채택하지 않았습니다. 이는 하나의
            연구팀이 stability·kernel 생태계·iteration speed를 포함해 내린 engineering
            선택입니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Krea 2는 실제로 어떤 component와 학습 단계를 선택했나요?"
          preview="256→512→1024 해상도 curriculum 위에 condition encoder, autoencoder, rectified-flow transformer와 여러 post-training 단계를 조립했습니다."
        >
          <p>
            보고서의 condition 쪽에는 Qwen 3 VL encoder와 prompt expander가 있습니다.
            Image representation 쪽에는 Qwen Image 또는 FLUX 2 계열 autoencoder가 있고,
            생성 backbone은 rectified-flow Transformer입니다.
          </p>
          <p>
            Final backbone은 single-stream을 택했습니다. Attention에는 GQA와 gated sigmoid
            attention을, FFN에는 SwiGLU를 사용합니다. Normalization에는 zero-centered
            RMSNorm과 QKNorm을, 위치 표현에는 3D axial RoPE를 둡니다.
          </p>
          <p>
            학습은 256에서 512, 다시 1024 해상도로 올라갑니다. 그 뒤 SFT, preference
            optimization과 RL이 이어집니다. 이 목록은 Krea의 선택이지 현대 이미지 모델의
            필수 부품 목록은 아닙니다.
          </p>
        </ProgressiveDetail>
        <AlgorithmBlock
          title="한 modern text-to-image request의 실행 경로"
          input={["user prompt와 optional reference image", "exact encoder·autoencoder·DiT revisions", "sampler·NFE·guidance·seed", "출력 resolution"]}
          steps={[
            { code: "expanded_prompt ← prompt_expander(user_prompt)", note: "사용하는 stack에서만 수행하며 원문 prompt와 확장본을 모두 기록합니다." },
            { code: "c ← condition_encoder(expanded_prompt, reference?)", note: "Text·image condition을 DiT가 읽는 token representation으로 만듭니다." },
            { code: "z ← sample_prior(latent_shape(resolution, autoencoder_contract), seed)", note: "Autoencoder 압축률과 channel이 terminal latent shape를 정합니다." },
            { code: "for (t_next, t) in solver_schedule: prediction ← DiT(z, t, c)", note: "매 NFE마다 전체 noisy latent token을 다시 읽습니다." },
            { code: "z ← solver_update(z, prediction, t, t_next, guidance)", note: "Prediction target과 solver convention이 일치해야 합니다." },
            { code: "image ← autoencoder.decode(z / latent_scale)", note: "마지막 latent를 exact decoder scale로 pixel에 복원합니다." },
            { code: "artifact ← save(prompt_pair, revisions, schedule, seed, image, metrics)", note: "최종 image만 남기지 않아 component 회귀를 재현할 수 있게 합니다." },
          ]}
          output="generated image + component/sampler manifest + evaluation trace"
        />
        <div id="paper-krea2" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Krea · Krea 2 Technical Report"
            citeKey={1}
            href="https://www.krea.ai/blog/krea-2-technical-report"
          >
            2026년 6월 공식 보고서는 architecture ablation뿐 아니라 data filtering,
            captioning, resolution curriculum, midtraining·SFT·preference·RL과 serving
            component를 함께 공개합니다. 결과와 선택 이유는 Krea의 자기보고이며 다른
            data budget에 그대로 전이되는 일반 법칙은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-sd3-stack" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Esser et al. · Scaling Rectified Flow Transformers for High-Resolution Image Synthesis"
            citeKey={2}
            href="https://arxiv.org/abs/2403.03206"
          >
            SD3 연구는 rectified-flow training과 text·image modality의 separate weights,
            bidirectional joint attention을 함께 평가했습니다. 이 글에서는 stream 설계와
            objective가 별도 축이라는 근거로 사용하며, Krea 2가 SD3 내부 module을 그대로
            쓴다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="world-model-boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          월드모델에는 시간·행동·검증 루프가 더 필요합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Text-to-image model은 조건 <code>c</code>에 맞는 sample <code>x</code>를
            생성합니다. 월드모델은 현재 state <code>sₜ</code>와 action <code>aₜ</code>가
            주어졌을 때 다음 state <code>sₜ₊₁</code>의 분포를 예측해야 합니다. 한 장의
            사실감은 물체가 다음 frame에서도 존재하고 action에 맞게 움직인다는 보장이
            아닙니다.
          </p>
          <p>
            따라서 다음 단계에서는 spatial latent에 time axis를 붙이는 것만으로 끝나지
            않습니다. Camera motion과 object motion을 분리하고, action·control frequency를
            condition으로 넣고, rollout이 길어질 때 error가 누적되는지 검증해야 합니다.
            Physical AI에서는 예측을 다시 실제 controller와 sensor observation으로 닫는
            closed loop까지 필요합니다.
          </p>
          <p>
            Diffusion이라는 생성 원리를 language token에 옮기는 별도 분기는 다음 글인
            <Link to="/ai/diffusion-language-models">Diffusion LLM</Link>에서 다룹니다.
            그 글은 image diffusion과 닮은 점을 보이되, discrete MASK state와 KV cache
            경계가 왜 다른지를 분리합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Image model을 video·world model로 늘릴 때 최소한 어떤 검사를 추가해야 하나요?"
          preview="Frame 품질 외에 시간 일관성, action sensitivity, long-rollout drift, closed-loop success를 별도 slice로 둡니다."
        >
          <p>
            Appearance가 같은데 action만 다른 paired rollout으로 action sensitivity를,
            action과 object가 같은데 camera만 움직이는 pair로 viewpoint robustness를 봅니다.
            이어 1-step error와 32-step rollout error를 나눠 compounding을 확인합니다.
          </p>
          <p>
            마지막으로 prediction metric이 좋아도 실제 planner/controller가 task를
            성공하는지 확인해야 합니다. Representation과 video quality가 좋아졌다는
            결과를 physical action generalization으로 자동 승격하지 않습니다.
          </p>
        </ProgressiveDetail>
      </section>
    </div>
  );
}
