import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerOpening, CapabilityCheck, ConceptPrimer, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';
import {
  DiTTokenExplorer,
  FiveContractWorkbench,
  FlowPathExplorer,
  GenerativeEvaluationGate,
  SolverStepExplorer,
} from './dit-flow-matching-evaluation/viz/GenerativeSystemExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-6 min-w-0"><div className="min-w-0 overflow-hidden rounded-md border border-border px-1.5 py-4 text-[11px] sm:px-3 sm:text-sm"><MathFormula display className="my-0">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

function ProcessRow({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[3rem_10.5rem_minmax(0,1fr)] sm:gap-4"><span className="font-mono text-xs font-bold text-muted-foreground">{index}</span><strong className="text-sm leading-relaxed">{title}</strong><div className="min-w-0 text-sm leading-relaxed text-muted-foreground">{children}</div></div>;
}

function InternalLink({ slug, children }: { slug: string; children: ReactNode }) {
  return <Link className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground" to={articlePath('ai', slug)}>{children}</Link>;
}

const manifestCode = `comparison:
  checkpoints: [A@sha256, B@sha256, C@sha256]
  prompt_set: gen-eval-v3@sha256
  resolution: 1024x1024
  seeds: [11, 23, 47, 83]
  samples_per_prompt: 1
  reranker: null

runtime:
  vae: fixed-vae@sha256
  text_encoders: [clip-l, t5-xxl]
  solver: euler
  nfe: 20
  cfg: 5.0
  precision: bf16
  hardware: h100-80gb

release_gates:
  quality: [fid, precision, human_aesthetic]
  coverage: [recall, rare_style_slices]
  composition: [geneval, vqascore, human_prompt_following]
  systems: [p95_latency, peak_vram, failure_rate]
  safety: [memorization, unsafe_content, provenance]`;

export default function DiTFlowMatchingEvaluationArticle() {
  return (
    <>
      <section id="design-space" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이미지를 만드는 두 선택을 먼저 분리한다</h2>
        <BeginnerOpening
          title="생성 모델은 흐릿한 상태를 여러 번 고쳐 그림으로 만든다"
          description={<>최신 이미지 생성 모델은 무작위 노이즈에서 시작해 “지금 어느 방향으로 고쳐야 하는가”를 반복해서 예측한다. 이때 <strong>DiT</strong>는 그 방향을 계산하는 신경망의 구조이고, <strong>Flow Matching</strong>은 어떤 중간 상태와 이동 방향을 정답으로 가르칠지 정하는 학습 방법이다.</>}
          familiarScene={<>서울에서 부산까지 간다고 하자. 자동차의 구조와 어떤 길을 따라갈지는 다른 선택이다. 같은 자동차로 다른 경로를 갈 수 있고, 같은 경로를 다른 자동차로 갈 수도 있다. 생성 모델도 계산 장치와 학습 경로를 따로 볼 수 있다.</>}
          steps={[
            { label: '그림을 계산하기 쉬운 상태로 바꾼다', detail: '픽셀이나 압축된 latent 중 모델이 다룰 표현을 정한다.' },
            { label: '이동 방향을 계산할 신경망을 고른다', detail: 'U-Net이나 DiT가 현재 상태와 글 조건을 읽어 다음 수정을 예측한다.' },
            { label: '배울 길과 실행할 걸음을 정한다', detail: 'Flow Matching 같은 학습 목표와 생성할 때의 반복 횟수를 따로 고른다.' },
          ]}
        />
        <QuestionLead question="DiT와 Flow Matching은 하나로 묶인 기술일까, 서로 바꿔 조합할 수 있는 두 선택일까?" answer="서로 다른 선택이다. DiT는 현재 상태에서 이동 방향을 계산하는 신경망의 모양이고, Flow Matching은 어떤 확률 경로의 어느 속도를 정답으로 가르칠지 정한다. 여기에 압축 표현, 생성 단계의 수치 계산법과 평가 조건까지 분리해야 모델 이름이 바뀌어도 논문과 제품을 비교할 수 있다." />
        <ConceptPrimer items={[
          { term: 'Representation', meaning: 'Pixel 또는 VAE latent처럼 모델이 실제로 계산하는 공간이다.', why: '같은 1024px 출력도 latent 압축률이 다르면 token 수와 보존되는 세부 정보가 달라진다.' },
          { term: 'Backbone', meaning: '현재 noisy state와 condition을 받아 noise·velocity를 예측하는 함수 근사기다.', why: 'U-Net, DiT와 MMDiT의 계산량·condition 결합 방식이 여기서 갈린다.' },
          { term: 'Probability path', meaning: 'Data distribution과 noise distribution 사이의 중간 상태를 시간 t별로 정의한 길이다.', why: '학습 target의 난이도와 sampling trajectory를 좌우한다.' },
          { term: 'Solver · NFE', meaning: 'Vector field를 수치 적분하는 규칙과 network를 평가한 횟수다.', why: '같은 model weight도 step·solver·guidance에 따라 속도와 endpoint가 달라진다.' },
          { term: 'Evaluation contract', meaning: 'Prompt, seed, 후보 수, metric, hardware를 고정한 비교 규칙이다.', why: 'Best-of-nine demo를 best-of-one baseline과 섞는 숨은 예산 차이를 막는다.' },
        ]} />
        <FiveContractWorkbench />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>“B가 A보다 좋다”는 문장은 아직 원인 설명이 아니다. VAE, backbone, path, solver와 후보 선택이 한꺼번에 바뀌었다면 관측한 것은 다섯 변경을 합친 system 결과다. Backbone 효과를 말하려면 나머지 계약을 고정하고 U-Net과 DiT만 바꾼 실험이 필요하다.</p>
          <p>이 분해는 최신 연구를 따라가는 최소 도구이기도 하다. 2026년 Google Research의 diffusion creativity 연구는 특정 모델명을 하나 더 외우게 하기보다 score smoothing이 training example 사이를 어떻게 보간해 새 sample을 만드는지 묻는다. 현재 연구 질문도 “어떤 브랜드가 1등인가”보다 표현, field, trajectory와 평가가 무엇을 만들었는지로 내려가고 있다.</p>
        </div>
        <Misconception>DiT가 U-Net보다 항상 우수하거나 Flow Matching이 DDPM을 자동으로 대체한다는 뜻이 아니다. 비교한 compute, data, conditioning, sampler와 metric 범위 안에서만 결론을 말할 수 있다.</Misconception>
      </section>

      <section id="dit-backbone" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">DiT는 VAE latent를 patch token으로 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>기초 diffusion의 U-Net은 해상도를 줄였다 늘리며 convolution feature를 섞는다. Diffusion Transformer(DiT)는 같은 denoising 문제를 다른 backbone으로 푼다. 먼저 VAE가 image를 작은 spatial latent로 압축하고, latent의 <MathFormula>p×p</MathFormula> 영역을 token 하나로 선형 변환한다. 이후 transformer block이 token 사이 정보를 섞고 마지막 linear head가 다시 latent grid 모양의 noise 또는 velocity를 출력한다.</p>
          <p>중요한 비용은 parameter 수만이 아니다. Image 한 변 <MathFormula>H</MathFormula>, VAE 축소 배율 <MathFormula>f</MathFormula>, latent patch 한 변 <MathFormula>p</MathFormula>가 token 수를 결정한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{N}_{\text{image token 수}}
&=\left(\frac{\underbrace{H}_{\text{image 한 변}}}
{\underbrace{f}_{\text{VAE 축소}}\;\underbrace{p}_{\text{latent patch}}}\right)^2\\
\underbrace{A}_{\text{dense attention 비교 쌍}}
&=\underbrace{N^2}_{\text{모든 token 쌍}}
\end{aligned}`}
          meaning="Image의 가로와 세로를 각각 VAE factor와 patch 크기로 나누면 token grid의 한 변이 된다. 두 축을 곱하므로 token 수는 제곱이고, dense self-attention은 각 token이 모든 token을 비교하므로 다시 N의 제곱이 된다. Patch 한 변을 절반으로 줄이면 token은 4배, 비교 쌍은 16배가 된다. FlashAttention 같은 kernel은 memory 이동과 상수를 줄이지만 이 dense pair 수 자체를 없애지는 않는다."
          symbols={[[String.raw`H`, '정사각 image의 한 변 pixel 수'], [String.raw`f`, 'VAE가 가로·세로를 줄이는 factor'], [String.raw`p`, '한 token으로 묶는 latent patch의 한 변'], [String.raw`N`, 'Transformer에 들어가는 image token 수'], [String.raw`A`, 'Dense self-attention이 비교하는 token pair 수']]}
        />
        <DiTTokenExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Condition을 넣는 방식도 backbone의 일부다</h3>
          <p>원래 DiT 논문은 timestep과 class condition을 image token 뒤에 붙이거나, cross-attention으로 읽거나, adaptive LayerNorm(adaLN)으로 주입하는 방법을 비교했다. AdaLN은 normalization 뒤의 token에 곱하고 더할 scale·shift를 고정 parameter로 두지 않고 timestep·class embedding에서 만든다. AdaLN-Zero는 residual branch의 초기 영향까지 0에 가깝게 두어 block 전체를 거의 identity로 시작하게 한다. “Transformer를 썼다”만으로는 condition이 어디서 들어가는지 알 수 없다.</p>
          <p>Stable Diffusion 3의 MMDiT는 text와 image를 같은 종류의 token처럼 완전히 합치지 않는다. 두 modality는 projection, normalization과 MLP weight를 따로 유지한다. 다만 attention에서는 image와 text의 Q/K/V sequence를 합쳐 양쪽이 서로를 볼 수 있게 한다. 즉 자기 표현 방식은 분리하고, 관계를 계산하는 순간에 만난다. Text가 image를 일방적으로 지시하는 cross-attention보다 image state가 text representation에도 정보를 되돌리는 양방향 결합이다.</p>
          <p>고해상도에서는 token 수뿐 아니라 attention logit 불안정과 text encoder VRAM도 점검한다. Mixed precision은 일부 계산을 FP32보다 작은 BF16·FP16으로 실행해 memory와 시간을 줄이는 방법이지만, 값의 표현 범위와 반올림 여유도 줄어 큰 attention logit에서 학습이 불안정할 수 있다. SD3 연구는 Q와 K normalization으로 이 불안정을 완화했고, 여러 text encoder 중 큰 T5를 빼면 memory는 줄지만 복잡한 prompt와 typography 성능이 더 크게 떨어질 수 있음을 보고했다. 어느 encoder와 precision을 썼는지도 model 비교 manifest에 들어가야 한다.</p>
        </div>
        <Misconception>DiT의 patch는 원본 image patch가 아니라 보통 VAE가 압축한 latent patch다. 1024px image를 곧바로 2×2 pixel token으로 나눈다고 계산하면 token 수를 크게 잘못 잡는다.</Misconception>
      </section>

      <section id="flow-matching" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Flow Matching은 현재 위치에서 따라갈 velocity를 가르친다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>여기서는 읽기 쉽게 <MathFormula>t=0</MathFormula>을 clean data, <MathFormula>t=1</MathFormula>을 noise로 둔다. Forward path는 data에 noise를 더하는 방향이고, 생성은 noise에서 시작해 시간을 거꾸로 적분한다. Flow Matching 원 논문처럼 noise를 <MathFormula>t=0</MathFormula>에 두는 문헌도 있으므로 식을 읽을 때 endpoint convention부터 확인해야 한다.</p>
          <p>가장 단순한 rectified path는 clean latent <MathFormula>x_0</MathFormula>와 Gaussian noise <MathFormula>ε</MathFormula> 사이를 직선으로 잇는다. 이 한 쌍의 위치와 velocity는 미리 계산할 수 있다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{x_t}_{\text{시간 t의 noisy latent}}&=(1-t)\underbrace{x_0}_{\text{clean data}}+t\underbrace{\epsilon}_{\text{Gaussian noise}}\\[0.35em]\underbrace{u_t}_{\text{정답 velocity}}&=\frac{d x_t}{dt}=\underbrace{\epsilon-x_0}_{\text{data에서 noise로 향하는 방향}}\end{aligned}`}
          meaning="두 endpoint를 (1-t)와 t로 섞으면 t=0에서는 clean data, t=1에서는 noise가 된다. t로 미분하면 한 conditional pair의 이동 방향 ε-x₀가 나온다. 생성할 때는 t=1에서 0으로 적분하므로 이 방향을 거꾸로 따라간다."
          symbols={[[String.raw`x_0`, 'Dataset에서 뽑은 clean image latent'], [String.raw`\epsilon`, '같은 shape의 표준 Gaussian noise'], [String.raw`t`, 'Data와 noise 사이 위치를 정하는 시간'], [String.raw`x_t`, 'Network 입력이 되는 중간 latent'], [String.raw`u_t`, '해당 conditional pair에서 회귀할 velocity target']]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\hat u_t}_{\text{model이 예측한 방향}}
&=v_\theta(x_t,t,c)\\
\underbrace{e_t}_{\text{pair별 velocity 오차}}
&=\hat u_t-\underbrace{u_t(x_t\mid x_0,\epsilon)}_{\text{계산 가능한 정답}}\\
\underbrace{\mathcal L_{\mathrm{CFM}}}_{\text{conditional flow 학습 오차}}
&=\mathbb E_{x_0,\epsilon,t}\!\left[\|e_t\|_2^2\right]
\end{aligned}`}
          meaning="알 수 없는 전체 data distribution의 vector field를 직접 계산하는 대신, 쉽게 만들 수 있는 data-noise pair의 conditional velocity를 MSE로 회귀한다. 같은 위치 근처에 많은 pair가 겹치면 network는 condition c와 현재 xₜ에서 평균적으로 맞는 marginal direction을 학습한다. Flow Matching의 핵심은 이 conditional objective가 원래 marginal objective와 같은 expected gradient를 갖는다는 점이다."
          symbols={[[String.raw`v_\theta`, 'DiT 또는 U-Net이 예측하는 vector field'], [String.raw`\hat u_t`, '현재 noisy latent와 condition에서 model이 낸 velocity'], [String.raw`e_t`, '예측 velocity와 conditional target의 차이'], [String.raw`c`, 'Text, class 또는 다른 condition'], [String.raw`u_t`, '선택한 conditional probability path가 주는 target velocity'], [String.raw`\mathbb E`, 'Data, noise와 timestep을 반복 sampling한 평균'], [String.raw`\|\cdot\|_2^2`, '방향과 크기 차이에 주는 squared error']]}
        />
        <FlowPathExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>“Simulation-free training”과 “step 없는 생성”은 다르다</h3>
          <p>Conditional Flow Matching은 training target을 만들기 위해 ODE trajectory를 먼저 simulation할 필요가 없다는 뜻이다. 임의의 <MathFormula>t</MathFormula>를 뽑고 <MathFormula>x_t</MathFormula>와 <MathFormula>u_t</MathFormula>를 바로 계산해 한 번의 supervised regression을 할 수 있다. 그러나 생성 때는 학습한 <MathFormula>v_θ</MathFormula>를 따라 noise에서 data까지 ODE를 풀어야 한다.</p>
          <p>또한 straight conditional line은 쉬운 target을 주지만, 임의로 data와 noise를 연결한 선이 많이 교차하면 같은 중간 위치에 상충하는 velocity가 모인다. Coupling을 개선하거나 timestep sampling을 바꾸는 이유가 여기에 있다. SD3 연구도 uniform timestep보다 perceptually relevant middle scale에 더 비중을 준 rectified-flow sampling이 적은 sampling step에서 더 안정적인 조합을 만들 수 있음을 비교했다.</p>
        </div>
      </section>

      <section id="solver" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Solver는 연속 field를 유한한 network 호출로 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>학습한 field는 모든 시간의 방향을 주지만 GPU는 연속 시간을 무한히 계산하지 못한다. Sampling time <MathFormula>t_k</MathFormula>에서 velocity를 평가하고 양수 간격 <MathFormula>{String.raw`\Delta t=t_k-t_{k-1}>0`}</MathFormula>만큼 이동하는 일을 반복한다. 아래 식은 앞에서 정한 data→noise convention을 생성 방향으로 거꾸로 걷는 Euler update다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{x_{k-1}}_{\text{한 step 더 clean한 latent}}=\underbrace{x_k}_{\text{현재 noisy latent}}-\underbrace{\Delta t}_{\text{시간 간격}}\;\underbrace{v_\theta(x_k,t_k,c)}_{\text{현재 위치의 예측 velocity}}`}
          meaning="현재 velocity가 다음 작은 구간에서도 일정하다고 가정하고 직선 한 조각을 이동한다. Δt=tₖ-tₖ₋₁를 양수로 정의했으므로 forward data→noise 시간을 거꾸로 적분할 때 minus 부호가 붙는다. Local truncation error는 연속 곡선 한 구간을 이 직선 한 조각으로 바꿀 때 생기는 오차이며, 여러 구간에서 누적되면 최종 image latent가 목표 distribution에서 벗어난다."
          symbols={[[String.raw`x_k`, '현재 sampling state'], [String.raw`t_k`, '현재 noise time'], [String.raw`\Delta t`, '인접 timestep의 간격'], [String.raw`v_\theta`, '한 번의 network evaluation으로 얻은 velocity'], [String.raw`x_{k-1}`, '더 낮은 noise time으로 이동한 state']]}
        />
        <SolverStepExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Euler는 step마다 한 번 field를 본다. Heun은 Euler predictor에서 field를 다시 보고 두 기울기를 평균하므로 같은 step 수에서 curved trajectory를 더 잘 따라갈 수 있지만 보통 evaluation 수가 늘어난다. 논문 표의 “4 steps”와 “4 NFE”를 같은 값으로 가정하면 안 되는 이유다.</p>
          <p>NFE도 wall-clock과 같지 않다. 작은 U-Net 30회와 큰 DiT 30회는 시간이 다르고, Classifier-Free Guidance(CFG)가 prompt를 넣은 conditional prediction과 prompt를 뺀 unconditional prediction을 따로 계산하는지·한 batch로 합치는지, attention kernel과 precision이 무엇인지, VAE decode를 포함했는지도 영향을 준다. 변화율·Euler·Heun·global error가 낯설면 <InternalLink slug="differential-equations-phase-plane-numerical-integration">미분방정식과 수치 적분</InternalLink> 글에서 실제 숫자로 먼저 확인한다.</p>
        </div>
        <Misconception>기존 28-step checkpoint에서 solver step만 4로 줄이는 것과, teacher trajectory를 학습한 four-step student를 쓰는 것은 다르다. 전자는 numerical budget을 줄이고, 후자는 weight와 training target까지 바꾼 새 artifact다.</Misconception>
      </section>

      <section id="few-step" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Few-step 생성은 teacher, student와 runtime을 함께 설계한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Iterative generation은 각 step에서 앞 step의 state를 다시 읽으므로 품질은 높지만 latency가 쌓인다. 그래서 현재 연구는 path를 더 쉽게 만들거나, 여러 teacher step의 효과를 student transition 몇 번에 압축한다. Meta의 Autoregressive Distillation of Diffusion Transformers는 teacher trajectory history를 조건으로 쓰는 student를 학습해 paper setting에서 four-step 생성을 보고했다. 이 숫자는 모든 DiT의 보장값이 아니라 해당 distillation recipe의 결과다.</p>
        </div>
        <div className="not-prose my-8 min-w-0 border-y border-border">
          <ProcessRow index="01" title="Teacher trajectory"><p>충분한 step의 teacher가 noise에서 image까지 만든 중간 state와 velocity·endpoint를 기록한다. Teacher checkpoint, solver, guidance와 seed가 evidence의 일부다.</p></ProcessRow>
          <ProcessRow index="02" title="Student target"><p>Student는 멀리 떨어진 state로 한 번에 이동하거나, trajectory history를 보고 다음 큰 transition을 예측하도록 학습한다. 단순히 timestep list만 짧게 만드는 작업이 아니다.</p></ProcessRow>
          <ProcessRow index="03" title="Step-wise check"><p>마지막 image만 보지 않고 각 student step의 state drift, prompt condition 유지와 teacher mismatch를 측정한다. 앞 step의 작은 오류가 뒤 step 입력이 된다.</p></ProcessRow>
          <ProcessRow index="04" title="Distribution check"><p>Sharp sample 몇 장뿐 아니라 rare style, object count와 relation coverage가 teacher보다 줄지 않았는지 같은 prompt·seed budget에서 비교한다.</p></ProcessRow>
          <ProcessRow index="05" title="Runtime check"><p>Target GPU에서 end-to-end p50/p95, peak VRAM, batch throughput과 VAE/text encoder 비용을 잰다. NFE 감소가 실제 사용자 latency로 이어지는지 확인한다.</p></ProcessRow>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Student가 보기 좋은 중심 mode를 먼저 배우면 aesthetic preference는 오르면서 rare style recall은 떨어질 수 있다. Edit나 video에서는 한 장의 endpoint가 좋아도 identity·temporal consistency가 무너질 수 있다. 따라서 few-step release는 speed gate 하나가 아니라 teacher 대비 distribution과 task slice를 함께 본다.</p>
        </div>
      </section>

      <section id="evaluation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">생성 평가는 서로 다른 실패를 서로 다른 gate로 잡는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Fréchet Inception Distance(FID)는 generated sample 집합과 reference 집합의 image-feature 평균·공분산 거리를 한 숫자로 요약해 유용하다. 그러나 비슷한 FID를 가진 두 모델 중 하나는 선명한 몇 mode만 반복하고, 다른 하나는 다양한 mode를 덮지만 artifact가 많을 수 있다. Distribution precision은 생성물 중 실제 data support에 가까운 비율, recall은 실제 data mode 중 생성기가 덮은 범위를 묻는다. 두 축을 분리해야 mode invention과 mode dropping을 구분한다.</p>
          <p>Text-image similarity도 충분하지 않다. CLIP embedding은 “빨간 자동차가 파란 자전거 위에 있다”에 등장한 단어는 잘 잡으면서 색의 주인과 위아래 관계를 놓칠 수 있다. GenEval은 object 존재, 두 object, count, color, position, attribute binding을 detection과 property check로 쪼개 실패 위치를 보여 준다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\operatorname{VQAScore}(i,s)}_{\text{image와 문장 정렬 점수}}=\underbrace{P\!\left(\text{“예”}\mid i,\;\text{“이 그림이 문장 s를 보여 주는가?”}\right)}_{\text{VQA model의 긍정 답 확률}}`}
          meaning="Prompt 문장 s를 yes/no question으로 바꾸고 image i를 본 VQA model이 ‘예’라고 답할 확률을 사용한다. 단순 cosine similarity보다 object 관계와 속성을 문장 단위로 확인할 여지가 있다. 다만 evaluator VLM도 편향과 blind spot이 있으므로 human slice와 원자적 GenEval 검사를 대체하는 절대 정답으로 쓰지 않는다."
          symbols={[[String.raw`i`, '평가할 generated image'], [String.raw`s`, '원래 text prompt 또는 검증 문장'], [String.raw`P(\text{“예”}|\cdot)`, 'VQA answer decoder가 주는 yes probability'], ['VQAScore', 'Reference image 없이 prompt adherence를 읽는 자동 metric'], ['Human check', 'Evaluator model과 product user의 판단 차이를 확인하는 별도 gate']]}
        />
        <GenerativeEvaluationGate />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Best-of-k는 model 평가가 아니라 selection system 평가다</h3>
          <p>Prompt마다 9장을 생성해 aesthetic reranker가 고른 한 장과 baseline의 첫 한 장을 비교하면, model weight 외에 9배 후보 비용과 reranker 취향이 추가된다. 이 방식이 제품에는 유효할 수 있지만 결과 이름을 best-of-nine system으로 기록하고 best-of-one quality·latency도 함께 남겨야 한다.</p>
          <p>Human evaluation도 하나로 뭉치지 않는다. Prompt adherence, visual aesthetics와 typography 질문을 분리하고 model 이름을 가린 pairwise order를 무작위화한다. Safety, training-data memorization, provenance와 domain-specific harms는 품질 평균에 섞지 않고 독립적인 release blocker로 둔다.</p>
        </div>
      </section>

      <section id="controlled-release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공정한 비교는 versioned manifest에서 시작한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>재현 가능한 비교는 “같은 prompt를 써 봤다”보다 훨씬 구체적이다. Checkpoint와 VAE hash, text encoder, resolution·aspect bucket, solver·NFE, CFG, precision, seed, prompt당 후보 수, reranker, postprocess와 hardware를 한 manifest로 고정한다. 아래 값은 형식 예시이며 실제 release threshold는 제품 workload에서 정한다.</p>
          <pre><code>{manifestCode}</code></pre>
        </div>
        <div className="not-prose my-8 min-w-0 border-y border-border">
          <ProcessRow index="01" title="Contract freeze"><p>Prompt schema, negative prompt, resolution, seed와 candidate budget을 먼저 잠근다. 제품이 실제로 쓰는 입력 분포와 hardware를 선택한다.</p></ProcessRow>
          <ProcessRow index="02" title="One-axis ablation"><p>VAE, backbone, path/target, solver 또는 selection policy 중 한 축만 바꾼다. 여러 축을 바꾼 end-to-end 결과는 system comparison으로 별도 표기한다.</p></ProcessRow>
          <ProcessRow index="03" title="Slice evidence"><p>전체 평균과 함께 count, spatial relation, typography, rare style, unsafe prompt와 long-tail domain을 보존한다. 실패 sample을 평균 뒤에 숨기지 않는다.</p></ProcessRow>
          <ProcessRow index="04" title="Final holdout"><p>Metric과 threshold를 고르는 동안 쓰지 않은 prompt·seed set을 마지막에 한 번 연다. Evaluator VLM version도 함께 pin한다.</p></ProcessRow>
          <ProcessRow index="05" title="Ship · rollback"><p>Quality, coverage, composition, human, runtime과 safety gate가 모두 통과할 때만 배포하고 이전 checkpoint·solver로 되돌릴 경로를 유지한다.</p></ProcessRow>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이제 새 논문이나 Ideogram, Krea, FLUX, Stable Diffusion 계열 release를 만나면 모델명 표부터 만들 필요가 없다. 공개된 정보에서 다섯 계약을 채우고, 비공개인 칸은 “알 수 없음”으로 남긴 뒤, 같은 manifest에서 관측 가능한 system behavior만 비교한다. 새 기술이 나와도 이 글 아래의 <InternalLink slug="diffusion-models">Diffusion 기초</InternalLink>, <InternalLink slug="vision-transformer">Vision Transformer</InternalLink>, <InternalLink slug="vae">VAE</InternalLink>와 수치 적분 기반은 그대로 재사용된다.</p>
        </div>
        <CapabilityCheck items={[
          '임의의 최신 image model을 representation, backbone, path·target, solver와 evaluation의 다섯 계약으로 분해한다.',
          'DiT의 image resolution, VAE factor와 latent patch에서 token 수와 dense attention pair 수를 계산한다.',
          'DiT와 MMDiT에서 text·image condition이 만나는 지점을 구분한다.',
          'Rectified conditional path의 xₜ와 velocity target을 직접 계산하고 sampling 방향을 반대로 설명한다.',
          'Simulation-free training이 ODE-free generation을 뜻하지 않는 이유를 설명한다.',
          'Solver step, NFE와 wall-clock latency를 서로 다른 값으로 기록한다.',
          'Few-step student와 기존 checkpoint의 step 축소를 구분하고 teacher artifact를 pin한다.',
          'FID, precision·recall, GenEval, VQAScore와 human evaluation이 잡는 실패를 나눈다.',
          'Best-of-k와 reranker를 model 성능이 아닌 system budget으로 비교한다.',
          'Quality, coverage, composition, runtime, safety와 rollback을 포함한 release manifest를 설계한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Google Research · Towards demystifying the creativity of diffusion models', href: 'https://research.google/blog/towards-demystifying-the-creativity-of-diffusion-models/', note: '2026-07-15 score smoothing과 diffusion novelty·interpolation의 현재 연구 연결점.' },
          { label: 'Peebles & Xie · Scalable Diffusion Models with Transformers', href: 'https://arxiv.org/abs/2212.09748', note: 'Latent patchify, DiT block conditioning과 model/token compute scaling의 1차 근거.' },
          { label: 'Lipman et al. · Flow Matching for Generative Modeling', href: 'https://arxiv.org/abs/2210.02747', note: 'Conditional probability path, vector field와 simulation-free CFM objective의 1차 근거.' },
          { label: 'Esser et al. · Scaling Rectified Flow Transformers for High-Resolution Image Synthesis', href: 'https://arxiv.org/abs/2403.03206', note: 'Rectified path, timestep sampling, MMDiT와 high-resolution text-to-image scaling.' },
          { label: 'Meta · Flow Matching Guide and Code', href: 'https://ai.meta.com/research/publications/flow-matching-guide-and-code/', note: 'Flow Matching의 수학·구현을 연결한 공식 guide와 PyTorch package.' },
          { label: 'Meta · Autoregressive Distillation of Diffusion Transformers', href: 'https://ai.meta.com/research/publications/autoregressive-distillation-of-diffusion-transformers/', note: 'Teacher trajectory history를 쓰는 few-step DiT distillation의 현재 사례.' },
          { label: 'Sajjadi et al. · Assessing Generative Models via Precision and Recall', href: 'https://arxiv.org/abs/1806.00035', note: 'FID 하나가 구분하지 못하는 fidelity와 coverage, mode invention과 dropping의 분리.' },
          { label: 'Ghosh et al. · GenEval', href: 'https://arxiv.org/abs/2310.11513', note: 'Object, count, color, position과 attribute binding을 원자적으로 검사하는 evaluation framework.' },
          { label: 'Lin et al. · VQAScore', href: 'https://arxiv.org/abs/2404.01291', note: 'Yes probability로 compositional text-image alignment를 평가하는 metric과 한계.' },
        ]} />
      </section>
    </>
  );
}
