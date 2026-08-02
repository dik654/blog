import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { QuestionLead } from '@/components/learning/ArticleLearning';
import { useArticleTabs } from '@/components/learning/useArticleTabs';
import SourceFormula from './SourceFormula';

type Architecture = 'pixel' | 'latent' | 'dit';

const architectures: Record<Architecture, { label: string; stages: Array<[string, string]>; body: string }> = {
  pixel: { label: 'Pixel U-Net', stages: [['xₜ', 'H×W×3'], ['Down path', '넓은 context'], ['Up(D) ⊕ E', '같은 해상도 concat'], ['ε̂', 'pixel noise']], body: '원본 해상도에서 직접 denoise한다. Decoder는 upsampled context와 같은 해상도의 encoder feature를 channel 방향으로 concat해 위치를 복원하지만, 큰 image에서는 feature map 비용이 크다.' },
  latent: { label: 'Latent Diffusion', stages: [['x', 'pixel image'], ['VAE', 'z · 작은 grid'], ['U-Net + cross-attn', 'latent denoise'], ['VAE decoder', 'x̃']], body: 'VAE가 image를 작은 latent grid로 압축한 뒤 diffusion을 수행한다. Stable Diffusion의 핵심 비용 절감 구조다.' },
  dit: { label: 'Diffusion Transformer', stages: [['zₜ', 'latent grid'], ['Patchify', 'token sequence'], ['Transformer', 'global mixing'], ['target', 'noise / velocity']], body: 'Convolutional U-Net 대신 Transformer block으로 denoiser를 구성한다. Scale과 multimodal conditioning에 유리하지만 attention 비용과 token 설계가 중요하다.' },
};

function ArchitectureExplorer() {
  const [architecture, setArchitecture] = useState<Architecture>('latent');
  const selected = architectures[architecture];
  const architectureKeys = Object.keys(architectures) as Architecture[];
  const { getTabProps, panelProps } = useArticleTabs({ keys: architectureKeys, value: architecture, onChange: setArchitecture });
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-3 border-b border-border bg-muted/20" role="tablist" aria-label="Diffusion architecture 비교">
        {architectureKeys.map((key, index) => <button key={key} type="button" {...getTabProps(key, index)} className={`min-h-12 border-b-2 px-1 text-xs font-bold sm:px-3 sm:text-sm ${architecture === key ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>{key === 'pixel' ? 'Pixel U-Net' : key === 'latent' ? 'Latent' : 'DiT'}</button>)}
      </div>
      <div {...panelProps} className="p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-6">
        <p className="mb-4 text-sm font-bold">{selected.label}</p>
        <div className="grid items-center gap-2 lg:grid-cols-[1fr_1.25rem_1fr_1.25rem_1fr_1.25rem_1fr]">
          {selected.stages.map(([symbol, note], index) => <div key={`${architecture}-${symbol}`} className="contents"><div className={`min-w-0 rounded-md border p-3 text-center ${index === 2 ? 'border-blue-500/40 bg-blue-500/5' : 'border-border'}`}><p className="break-words font-mono text-xs font-bold sm:text-sm">{symbol}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p></div>{index < selected.stages.length - 1 && <div className="flex justify-center text-muted-foreground"><ArrowDown className="size-4 lg:hidden" aria-hidden="true" /><ArrowRight className="hidden size-4 lg:block" aria-hidden="true" /></div>}</div>)}
        </div>
        <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">{selected.body}</p>
      </div>
    </div>
  );
}

const skipLevels = [
  {
    resolution: '64×64',
    encoder: 'E₆₄ [B,C_enc,64,64]',
    decoder: 'Up(D₃₂) [B,C_dec,64,64]',
    merged: 'D̃₆₄ [B,C_dec+C_enc,64,64]',
    reason: '윤곽과 작은 위치를 마지막 고해상도 복원에 되돌린다.',
  },
  {
    resolution: '32×32',
    encoder: 'E₃₂ [B,C_enc,32,32]',
    decoder: 'Up(D₁₆) [B,C_dec,32,32]',
    merged: 'D̃₃₂ [B,C_dec+C_enc,32,32]',
    reason: '넓은 구조와 중간 크기 패턴을 같은 좌표에 맞춰 합친다.',
  },
] as const;

function UNetResolutionFlow() {
  return (
    <figure className="not-prose my-8 border-y border-border" data-unet-resolution-flow>
      <figcaption className="grid gap-1 py-4">
        <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">MATCH RESOLUTION BEFORE CONCAT</span>
        <span className="text-sm font-bold">Skip은 encoder 전체를 막연히 복사하지 않고, 같은 H×W 단계끼리 channel로 합친다</span>
      </figcaption>
      <div className="border-t border-border">
        {skipLevels.map((level) => (
          <div
            key={level.resolution}
            className="grid min-w-0 gap-3 border-b border-border py-5 last:border-b-0 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:px-3 lg:grid-cols-[4.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] lg:items-center"
            data-unet-skip-level={level.resolution}
          >
            <div>
              <p className="font-mono text-lg font-black">{level.resolution}</p>
              <p className="mt-1 text-xs text-muted-foreground">공간 좌표</p>
            </div>
            <div className="grid min-w-0 gap-3 sm:col-start-2 lg:contents">
              <div className="min-w-0 border-l-2 border-cyan-600 pl-3">
                <p className="text-xs font-bold text-muted-foreground">Encoder skip buffer</p>
                <p className="mt-1 break-words font-mono text-xs font-bold sm:text-sm">{level.encoder}</p>
              </div>
              <div className="flex justify-center text-muted-foreground" aria-hidden="true">
                <ArrowDown className="size-4 lg:hidden" />
                <ArrowRight className="hidden size-4 lg:block" />
              </div>
              <div className="min-w-0 border-l-2 border-amber-500 pl-3">
                <p className="text-xs font-bold text-muted-foreground">Decoder main path</p>
                <p className="mt-1 break-words font-mono text-xs font-bold sm:text-sm">{level.decoder}</p>
              </div>
              <div className="flex justify-center text-muted-foreground" aria-hidden="true">
                <ArrowDown className="size-4 lg:hidden" />
                <ArrowRight className="hidden size-4 lg:block" />
              </div>
              <div className="min-w-0 border-l-2 border-blue-600 pl-3">
                <p className="text-xs font-bold text-muted-foreground">Channel concat 결과</p>
                <p className="mt-1 break-words font-mono text-xs font-bold sm:text-sm">{level.merged}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{level.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="border-t border-border py-4 text-xs leading-relaxed text-muted-foreground">
        Main path는 64→32→16으로 내려가 넓은 문맥을 본 뒤 16→32→64로 올라온다. Skip path는 내려가기 전의 E₆₄·E₃₂를 보관했다가 decoder의 해상도가 다시 같아지는 순간에만 합친다.
      </p>
    </figure>
  );
}

function GuidanceExplorer() {
  const [scale, setScale] = useState(5);
  const unconditional = -0.25;
  const conditional = 0.35;
  const guided = unconditional + scale * (conditional - unconditional);
  const risk = scale < 1 ? '조건 약화' : scale <= 7 ? '일반적인 유도 범위' : '과포화·다양성 감소 위험';
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <label htmlFor="cfg-scale" className="block text-xs font-semibold text-muted-foreground">Classifier-free guidance scale · {scale.toFixed(1)}<input id="cfg-scale" type="range" min="0" max="12" step="0.5" value={scale} onChange={(event) => setScale(Number(event.target.value))} className="mt-3 block w-full accent-foreground" /></label>
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-4">
        {[
          ['unconditional εu', unconditional.toFixed(2)],
          ['conditional εc', conditional.toFixed(2)],
          ['guided εcfg', guided.toFixed(2)],
          ['해석', risk],
        ].map(([term, value], index) => <div key={term} className={`min-w-0 p-4 ${index === 2 ? 'bg-blue-600 text-white' : 'bg-background'}`}><p className={`text-xs font-semibold ${index === 2 ? 'text-white/75' : 'text-muted-foreground'}`}>{term}</p><p className={`mt-1 break-words font-bold ${index < 3 ? 'font-mono text-xl' : 'text-sm leading-relaxed'}`}>{value}</p></div>)}
      </div>
    </div>
  );
}

export default function ConditioningAndArchitecture() {
  return (
    <section id="conditioning" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Prompt, timestep, noisy latent는 어디에서 합쳐질까?</h2>
      <QuestionLead
        question="Text prompt는 image를 직접 그리는가, denoising 방향을 바꾸는가?"
        answer="Text encoder가 prompt token embedding c를 만들고, denoiser의 image/latent feature가 cross-attention으로 c를 조회한다. Prompt는 매 reverse step의 noise 또는 velocity prediction을 조건 방향으로 바꾼다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          먼저 계산 공간과 denoiser를 분리한다. 원 DDPM은 pixel U-Net에서 unconditional noise를 예측했다. Latent Diffusion은 VAE가
          압축한 grid에서 같은 반복 복원을 수행하고, DiT는 U-Net을 Transformer로 바꾼다. 아래 선택기는 한 모델의 옵션이 아니라
          서로 다른 세 architecture contract를 비교한다.
        </p>
      </div>
      <ArchitectureExplorer />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>U-Net의 skip은 어느 feature를 어디에 붙일까?</h3>
        <p>
          Down path만 쓰면 receptive field는 넓어지지만 pooling과 stride를 지나는 동안 정확한 위치가 흐려진다. 그래서
          encoder의 각 해상도 feature를 따로 보관한다. Decoder feature를 upsample해 높이와 너비를 맞춘 뒤, 오직 같은
          해상도의 encoder feature를 channel 축으로 concat한다. 이 연결은 넓은 문맥과 세밀한 위치를 동시에 다음 block에 준다.
        </p>
      </div>
      <UNetResolutionFlow />
      <SourceFormula
        latex={String.raw`\begin{aligned}
\underbrace{U_r=\operatorname{Up}(D_{r/2})}_{\text{문맥을 같은 해상도로}}\\
\underbrace{\widetilde D_r=U_r\oplus E_r}_{\text{같은 위치끼리 채널로 연결}}\\
\underbrace{C_{\mathrm{out}}=C_d+C_e}_{\text{두 채널 수를 보존}}
\end{aligned}`}
        meaning="왜 해상도를 먼저 맞추나: concat은 batch B와 공간축 r×r가 같은 위치끼리만 channel을 붙일 수 있기 때문이다. 왜 channel은 더해지나: decoder의 C_d개 문맥 feature와 encoder의 C_e개 위치 feature를 버리지 않고 나란히 보낸 뒤 다음 convolution block이 필요한 조합을 학습하기 때문이다."
        symbols={[
          [String.raw`D_{r/2}`, '한 단계 더 작은 decoder feature'],
          [String.raw`\operatorname{Up}`, '공간 크기를 r×r로 복원하되 encoder 정보를 새로 만들지는 않는 연산'],
          [String.raw`E_r`, 'Downsampling 전에 보관한 같은 해상도의 encoder feature'],
          [String.raw`\oplus`, '공간 위치는 유지하고 channel 축을 이어 붙이는 concat'],
          [String.raw`\widetilde D_r`, '넓은 문맥과 위치 정보를 함께 받은 다음 decoder block의 입력'],
        ]}
      />
      <SourceFormula
        latex={String.raw`\begin{aligned}
Q&=W_Qh_{\mathrm{image}}\\
K&=W_Kc,\qquad V=W_Vc\\
\operatorname{Attn}(Q,K,V)&=\operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt d}\right)V
\end{aligned}`}
        meaning="현재 spatial feature가 query가 되고 prompt token이 key와 value가 된다. QKᵀ는 각 위치가 어느 token을 참고할지 점수화하고, √d로 나눠 차원이 커질 때 score가 과도하게 커지는 것을 막는다. Softmax는 token별 가중치의 합을 1로 만들며, 그 가중치로 V를 섞어 실제 prompt 정보를 image feature에 넣는다."
        symbols={[
          [String.raw`h_{\mathrm{image}}`, '현재 noisy image 또는 latent에서 만든 spatial feature'],
          [String.raw`c`, 'Text encoder가 출력한 prompt token sequence'],
          [String.raw`QK^\top`, '각 image 위치와 prompt token의 관련도 score'],
          [String.raw`\sqrt d`, 'Key dimension이 커져 dot product가 폭증하는 것을 보정하는 scale'],
          [String.raw`V`, 'Softmax 가중치로 실제 feature에 합쳐지는 prompt의 value vector'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Latent Diffusion에서 VAE가 맡는 경계</h3>
        <p>
          학습 image는 VAE encoder를 지나 작은 latent z₀가 되고, forward noising과 denoising은 z 공간에서 진행된다. 추론은
          random zT에서 시작해 z₀를 만든 뒤 마지막 한 번만 VAE decoder로 pixel image를 복원한다. Text encoder, denoiser,
          VAE는 서로 다른 역할과 failure mode를 가진 별도 부품이다.
        </p>
        <h3>Classifier-free guidance는 조건 차이를 외삽한다</h3>
        <p>
          학습 중 일부 condition을 빈 값으로 바꿔 같은 network가 unconditional과 conditional prediction을 모두 배우게 한다.
          추론에서는 두 prediction의 차이를 scale만큼 확대한다. Prompt 일치가 강해질 수 있지만 과도하면 다양성, 색, 질감이
          무너질 수 있다.
        </p>
      </div>
      <GuidanceExplorer />
      <SourceFormula
        latex={String.raw`\widehat\epsilon_{\mathrm{cfg}}=\widehat\epsilon_u+s\!\left(\widehat\epsilon_c-\widehat\epsilon_u\right)`}
        meaning="CFG는 조건 없는 기준 예측에서 시작해, prompt가 만든 예측 차이를 scale s만큼 더한다. 따라서 s는 품질 점수가 아니라 prompt 방향으로 얼마나 외삽할지 정하며, 너무 크면 자연스러운 분포와 다양성을 벗어날 수 있다."
        symbols={[
          [String.raw`\hat\epsilon_u`, 'prompt를 비운 unconditional noise 예측'],
          [String.raw`\hat\epsilon_c`, 'prompt를 넣은 conditional noise 예측'],
          [String.raw`\hat\epsilon_c-\hat\epsilon_u`, 'prompt가 현재 denoising 방향에 만든 변화'],
          [String.raw`s`, '조건 변화량을 얼마나 확대할지 정하는 guidance scale'],
          [String.raw`\hat\epsilon_{cfg}`, 'sampler가 다음 latent 갱신에 사용할 guided 예측'],
        ]}
      />
    </section>
  );
}
