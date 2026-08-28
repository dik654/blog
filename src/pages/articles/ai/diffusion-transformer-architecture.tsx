import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import DiffusionTransformerBlockViz from "./diffusion-transformer-architecture/viz/DiffusionTransformerBlockViz";

export default function DiffusionTransformerArchitectureArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="latent-patches" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          DiT는 image를 쓰는 LLM이 아니라 noisy latent를 복원하는 Transformer입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Diffusion Transformer(DiT)는 U-Net이 맡던 denoiser interface를 Transformer로
            구현합니다. 한 번 호출될 때 noisy latent <code>zₜ</code>, noise time
            <code>t</code>, 선택적 condition <code>c</code>를 받습니다.
          </p>
          <p>
            출력은 입력과 같은 spatial shape의 noise, velocity 또는 clean prediction입니다.
            Text를 생성하는 decoder-only LLM과 block이 닮았어도 objective와 output contract는
            다릅니다.
          </p>
          <p>
            첫 단계는 latent grid를 patch로 잘라 token sequence로 바꾸는 것입니다.
            64×64 latent를 2×2 patch로 자르면 32×32, 즉 1024 token이 됩니다. Patch를
            4×4로 키우면 token은 256개로 줄지만 한 token이 더 넓은 공간을 뭉칩니다.
            따라서 patch size는 attention 비용과 detail granularity를 동시에 정합니다.
          </p>
        </div>
        <DiffusionTransformerBlockViz />
        <ExplainedFormula
          question="Latent grid와 patch size가 Transformer token 수를 어떻게 정하나요?"
          idea="각 공간축에서 patch가 몇 개 들어가는지 센 뒤 두 축의 개수를 곱합니다. Self-attention을 dense하게 쓰면 pair 수는 N²으로 늘어납니다."
          formula={String.raw`N=\frac{h}{p}\frac{w}{p},\qquad C_{\mathrm{attn}}\propto N^2d`}
          annotatedFormula={String.raw`\begin{aligned}
N&=\underbrace{\frac{h}{p}\frac{w}{p}}_{\substack{\text{latent를 }p\times p\text{ patch로 분할}\text{두 축의 patch 수를 곱함}}}\\
C_{\mathrm{attn}}&\propto\underbrace{N^2}_{\text{모든 token pair}}\underbrace{d}_{\text{한 head가 읽는 feature scale}}
\end{aligned}`}
          operations={[
            { expression: String.raw`h/p`, annotation: ["latent height를 patch 높이로 나눠", "세로 token 수 계산"] },
            { expression: String.raw`w/p`, annotation: ["latent width를 patch 폭으로 나눠", "가로 token 수 계산"] },
            { expression: String.raw`N^2d`, annotation: ["token pair 수와 feature 폭을 결합해", "dense attention의 지배 비용 해석"] },
          ]}
          terms={[
            { symbol: "h,w", name: "Latent grid", description: "Autoencoder가 만든 latent의 공간 크기입니다." },
            { symbol: "p", name: "Latent patch size", description: "한 transformer token으로 묶을 latent patch 한 변입니다." },
            { symbol: "d", name: "Hidden width", description: "Transformer token의 model dimension입니다." },
          ]}
          assumptions={["h와 w가 p로 나누어떨어지고 dense global self-attention을 쓰는 단순 계산입니다.", "FlashAttention은 materialization IO를 줄이지만 N²개의 pair 의미 자체를 자동으로 sparse하게 만들지는 않습니다."]}
          interpretation="Patch를 절반으로 줄이면 한 축 token은 두 배, 전체 token은 네 배, dense attention pair는 열여섯 배가 됩니다. Detail을 얻는 대신 비용이 급격히 커지는 이유입니다."
        />
        <ContentBoundary article="diffusion-transformer-architecture" />
        <div id="paper-dit" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Peebles & Xie · Scalable Diffusion Models with Transformers"
            citeKey={1}
            href="https://arxiv.org/abs/2212.09748"
          >
            원 DiT는 frozen VAE latent를 patchify하고 class·time 조건을 adaLN-Zero 등에
            넣었습니다. ImageNet class-conditional 실험에서 width·depth·token 수로
            GFLOPs를 늘린 후보가 더 낮은 FID를 보였다는 결과이며, 모든 text-to-image
            stack의 보편 scaling law로 확대하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="conditioned-block" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Time condition은 지금 latent가 얼마나 망가졌는지 block의 계산을 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 latent pattern도 noise가 거의 없는 마지막 step과 순수 noise에 가까운
            첫 step에서 필요한 update가 다릅니다. 그래서 DiT는 timestep embedding으로
            각 block의 normalization scale·shift와 residual gate를 조절할 수 있습니다.
            AdaLN-Zero는 gate를 0에 가깝게 초기화해 학습 초기에 각 residual branch가
            갑자기 큰 변화를 만들지 않게 합니다.
          </p>
          <p>
            Text condition은 별도 문제입니다. 원 DiT처럼 class vector 하나라면 adaLN에
            합칠 수 있지만, 긴 prompt의 token별 의미를 읽으려면 cross-attention 또는
            text·image token이 만나는 joint stream이 필요합니다. Time modulation과
            text-image interaction은 모두 conditioning이지만 같은 mechanism은 아닙니다.
          </p>
        </div>
        <ExplainedFormula
          question="AdaLN은 time·condition vector로 normalized activation을 어떻게 바꾸나요?"
          idea="먼저 token마다 normalize한 뒤, condition에서 얻은 feature별 scale과 shift를 적용하고 residual gate로 branch 기여를 조절합니다."
          formula={String.raw`y=x+g(c,t)\odot F\!\left((1+s(c,t))\odot\mathrm{LN}(x)+b(c,t)\right)`}
          annotatedFormula={String.raw`y=\underbrace{x}_{\text{기존 residual}}+\underbrace{g(c,t)}_{\text{branch gate}}\odot F\!\left(\underbrace{(1+s(c,t))\odot\mathrm{LN}(x)}_{\text{condition별 scale}}+\underbrace{b(c,t)}_{\text{condition별 shift}}\right)`}
          operations={[
            { expression: String.raw`(1+s(c,t))\odot\mathrm{LN}(x)`, annotation: ["normalized feature를 condition별로 늘리거나 줄여", "noise time과 condition에 맞춘 feature scale 생성"] },
            { expression: String.raw`+b(c,t)`, annotation: ["condition별 offset을 더해", "block이 보는 activation 기준점 이동"] },
            { expression: String.raw`g(c,t)\odot F(\cdot)`, annotation: ["branch output을 gate로 조절해", "residual stream에 더할 크기 제어"] },
          ]}
          terms={[
            { symbol: "x", name: "Residual tokens", description: "현재 DiT block에 들어온 latent token sequence입니다." },
            { symbol: "c,t", name: "Condition and time", description: "Prompt/class condition과 noise time embedding입니다." },
            { symbol: "F", name: "Attention or FFN branch", description: "Modulated activation을 처리하는 sublayer입니다." },
          ]}
          assumptions={["표기는 DiT 계열의 공통 직관을 단순화한 것이며 model마다 scale·shift·gate 생성 위치와 개수가 다릅니다.", "AdaLN-Zero의 zero initialization은 초기 조건이지 학습 뒤 gate가 계속 0이라는 뜻이 아닙니다."]}
          interpretation="Time vector는 token을 새로 추가하지 않고도 block 전체의 처리 방식을 바꿀 수 있습니다. 그러나 긴 text token 간 정렬까지 이 식 하나가 해결하지는 않습니다."
        />
        <AlgorithmBlock
          title="한 DiT denoising forward를 tensor 연산으로 옮기기"
          input={["noisy latent z_t ∈ R^{B×h×w×c}", "time t", "text/class condition c", "patch size p와 trained DiT θ"]}
          steps={[
            { code: "tokens ← linear_patchify(z_t, patch=p)", note: "각 p×p×c patch를 hidden width d의 token으로 투영합니다." },
            { code: "tokens ← tokens + position_encoding(h/p, w/p)", note: "Unpatchify할 공간 위치가 사라지지 않게 2D 위치를 넣습니다." },
            { code: "modulation ← condition_mlp(time_embedding(t), pooled_condition(c))", note: "Scale·shift·gate처럼 block을 바꿀 condition parameter를 만듭니다." },
            { code: "for block in DiT: tokens ← block(tokens, modulation, condition_tokens=c)", note: "Model에 따라 cross-attention, dual stream, joint stream 중 일부를 사용합니다." },
            { code: "patch_payload ← output_projection(tokens)", note: "각 token을 velocity/noise patch의 scalar payload로 되돌립니다." },
            { code: "prediction ← unpatchify(patch_payload, h, w, p)", note: "Solver가 소비할 z_t와 같은 spatial shape를 복원합니다." },
          ]}
          output="v_θ(z_t,t,c), ε_θ(z_t,t,c) 또는 model이 선택한 prediction target"
        />
      </section>

      <section id="multimodal-streams" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Single·dual·joint stream은 text와 image가 만나는 위치를 다르게 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Text token과 image token은 길이와 통계가 다릅니다. Dual-stream 설계는
            modality별 weight로 먼저 처리한 뒤 attention에서 정보를 교환할 수 있고,
            single-stream 설계는 한 sequence와 공통 block으로 합쳐 kernel과 구현을
            단순하게 만들 수 있습니다. Hybrid는 앞부분과 뒷부분에서 두 방식을 섞습니다.
          </p>
          <p>
            Stable Diffusion 3의 MMDiT는 text와 image modality에 별도 weight를 두면서
            joint attention으로 양방향 정보를 흐르게 했습니다.
          </p>
          <p>
            Krea 2는 자체 ablation에서 hybrid가 약간 앞섰지만 단순성을 위해 최종
            single-stream을 선택했다고 보고했습니다. 두 결과는 서로 다른 데이터와 규모,
            학습 recipe에서 나왔습니다. 따라서 single stream을 MMDiT의 상위호환이라고
            결론낼 수 없습니다.
          </p>
        </div>
        <TermBreakdown
          title="Stream 설계를 비교할 때 같은 축으로 물어볼 것"
          items={[
            { term: "Weight sharing", description: "Text·image token이 attention·FFN weight를 공유하는지 modality별로 분리하는지 봅니다.", boundary: "Token을 concat했다는 사실만으로 모든 weight가 공유된다고 단정하지 않습니다." },
            { term: "Information exchange", description: "Cross-attention의 한 방향인지, joint attention의 양방향인지 확인합니다.", example: "Image query가 text key/value를 읽는 것과 text token도 image token으로 갱신되는 것은 다릅니다." },
            { term: "Token budget", description: "Text와 image token을 합친 sequence 길이와 attention cost를 기록합니다.", boundary: "Single-stream의 코드 단순성이 계산량 감소를 자동 보장하지 않습니다." },
            { term: "Ablation scope", description: "같은 scale·data·resolution·training horizon 안에서 stream만 바꾼 비교인지 확인합니다.", boundary: "제품 간 최종 benchmark 차이를 stream 하나의 인과효과로 돌리지 않습니다." },
          ]}
        />
        <div id="paper-mmdit" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Esser et al. · Scaling Rectified Flow Transformers for High-Resolution Image Synthesis"
            citeKey={2}
            href="https://arxiv.org/abs/2403.03206"
          >
            논문은 text와 image에 별도 weight를 사용하면서 joint attention으로 양방향
            정보를 교환하는 MMDiT와 rectified-flow training을 제시했습니다. Typography와
            prompt-following 개선은 해당 ablation·human evaluation 범위입니다.
          </CitationBlock>
        </div>
        <div id="paper-krea2-architecture" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Krea · Krea 2 Technical Report"
            citeKey={3}
            href="https://www.krea.ai/blog/krea-2-technical-report"
          >
            2026년 6월 공개된 공식 보고서는 single·dual·hybrid stream, GQA·MLA,
            attention gate, normalization, RoPE, autoencoder와 text encoder를 ablation한
            뒤 final configuration을 설명합니다. 이는 Krea의 자기보고와 선택 기준이며
            industry-wide 최적 구조를 확정하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="runtime-boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Backbone이 빨라도 여러 번 호출하는 sampling 비용은 별도로 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            DiT forward 한 번의 비용은 token 수·width·depth·attention kernel에 좌우됩니다.
            최종 image latency는 여기에 solver의 network function evaluation(NFE)을
            곱해야 합니다. Rectified flow가 더 곧은 path를 학습하도록 설계됐다는 사실과
            특정 checkpoint가 몇 step에서 같은 품질을 내는지는 서로 다른 주장입니다.
          </p>
          <p>
            또 image diffusion은 한 sampling step마다 전체 noisy token을 다시 읽습니다.
            Decoder-only LLM처럼 변하지 않는 prefix의 K/V를 token-by-token cache하는
            구조가 기본이 아닙니다. Krea 2 보고서가 diffusion inference를 “purely
            prefill”이라고 표현한 것도 이 차이를 가리킵니다.
          </p>
          <p>
            다음 글인 <Link to="/ai/modern-image-model-stack">현대 이미지 모델
            전체 스택</Link>에서는 autoencoder·text/VLM encoder·DiT·prompt expander와
            post-training을 하나의 시스템으로 조립합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="DiT의 attention 최적화와 sampling step 축소를 왜 따로 평가해야 하나요?"
          preview="하나는 forward 한 번의 시간, 다른 하나는 forward 호출 횟수를 바꿉니다. 총 latency에서는 곱으로 만나지만 실패 원인은 다릅니다."
        >
          <p>
            FlashAttention과 GQA, kernel fusion은 한 NFE가 실행되는 시간을 바꿉니다.
            반면 distillation과 solver 선택은 필요한 NFE 수를 바꿉니다.
          </p>
          <p>
            비교할 때는 같은 prompt와 seed, resolution을 사용합니다. 그런 다음 한 번의
            forward 시간, 총 호출 수, end-to-end latency와 quality regression을 따로
            기록해야 어느 축의 개선인지 알 수 있습니다.
          </p>
        </ProgressiveDetail>
      </section>
    </div>
  );
}
