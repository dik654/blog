import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { SamplingTraceViz } from './comfyui-runtime/viz/WorkflowRuntimeViz';

const controls = [
  ['Seed', '초기 noise 표본', '후보 구도·배치를 탐색한다.', '다른 parameter를 비교할 때는 고정한다.'],
  ['Steps', 'trajectory를 나누는 평가 횟수', '충분한 계산과 latency를 교환한다.', 'Distilled model은 적은 step이라는 학습 계약이 있을 수 있다.'],
  ['CFG', 'condition 방향으로 이동하는 크기', 'Prompt 반영과 과도한 압력을 조절한다.', 'CFG 1 계열에서 전통적인 negative prompt 감각을 그대로 쓰지 않는다.'],
  ['Sampler', '다음 latent를 계산하는 수치 규칙', '오차·안정성·질감과 호출 수를 바꾼다.', 'Model과 scheduler를 고정하고 비교한다.'],
  ['Scheduler', '각 step의 noise level 배치', '초기 구조와 후반 세부에 쓰는 구간을 나눈다.', '같은 steps라도 실제 sigma sequence가 다르다.'],
  ['Denoise', 'trajectory의 시작 구간', '원본 보존과 재생성 범위를 바꾼다.', '0.5를 단순히 “절반만 변경”으로 해석하지 않는다.'],
] as const;

const experiment = [
  ['Baseline', '공식 template 값, seed, input, model hash와 output을 저장한다.'],
  ['Hypothesis', '예: 구조는 맞지만 prompt 의미가 약하므로 CFG만 작은 범위에서 바꾼다.'],
  ['Controlled sweep', '나머지를 고정하고 한 variable의 3~5개 후보만 실행한다.'],
  ['Trace', 'prompt_id, sigma schedule, latency, peak memory와 output을 연결한다.'],
  ['Decision', '예쁜 한 장이 아니라 실패율과 목적 metric으로 범위를 좁힌다.'],
] as const;

export default function ComfyUIKSamplerParametersArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <QuestionLead
          question="KSampler에서 steps를 올리고 CFG를 세게 주면 항상 더 정확한 결과가 나오는가?"
          answer="아니다. KSampler 값은 model이 학습한 noise trajectory를 어떤 수치 경로로 따라갈지 정한다. Model·scheduler·distillation 계약이 다르면 같은 숫자의 의미도 달라지므로 공식 baseline에서 한 변수씩만 바꿔야 한다."
        />
        <h2 className="mb-6 text-2xl font-bold">KSampler는 latent trajectory 실행기다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>KSampler는 pixel을 한 번에 그리지 않는다. MODEL, positive·negative CONDITIONING과 시작 LATENT를 받고, scheduler가 정한 noise level을 따라 sampler가 latent를 여러 번 갱신한다. Output도 IMAGE가 아니라 LATENT이므로 VAE Decode 이후에야 화면으로 확인한다.</p>
          <p>여섯 parameter는 독립적인 “품질 slider”가 아니다. Seed는 시작점을, steps와 scheduler는 평가할 시간 격자를, sampler는 그 격자 사이 이동 규칙을, CFG는 condition 방향을, denoise는 trajectory의 시작 범위를 정한다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Noise level · sigma', meaning: '현재 latent가 얼마나 불확실한지를 나타내는 schedule 위치이며 구현과 수식에서 보통 σ(sigma)로 쓴다.', why: '초기에는 전역 구조, 후반에는 작은 detail을 주로 다루는 직관을 만든다.' },
          { term: 'Sampler', meaning: 'Model 예측으로 다음 latent를 계산하는 수치 방법이다.', why: '같은 step 수라도 업데이트 오차와 model evaluation 수가 달라질 수 있다.' },
          { term: 'Scheduler', meaning: '시작과 끝 사이 noise level을 어느 간격으로 배치할지 정한다.', why: '계산 예산을 어느 구간에 집중하는지 바꾼다.' },
          { term: 'Controlled sweep', meaning: '같은 seed·input에서 한 parameter만 바꾸는 비교다.', why: '결과 변화의 원인을 model 차이와 workflow 차이로 분리한다.' },
        ]} />
        <SamplingTraceViz />
      </section>

      <section id="parameter-roles" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">여섯 값이 소유하는 결정</h2>
        <div className="not-prose overflow-hidden border border-border">
          {controls.map(([name, owns, changes, boundary]) => (
            <div key={name} className="grid min-w-0 border-b border-border last:border-b-0 md:grid-cols-[6rem_10rem_minmax(0,1fr)]">
              <code className="border-b border-border bg-muted/20 px-3 py-3 text-xs font-bold md:border-b-0 md:border-r">{name}</code>
              <strong className="border-b border-border px-3 py-3 text-sm md:border-b-0 md:border-r">{owns}</strong>
              <div className="min-w-0 px-3 py-3"><p className="text-sm">{changes}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">경계: {boundary}</p></div>
            </div>
          ))}
        </div>
        <Misconception>Seed 41과 42는 가까운 image가 아니다. Seed는 pseudorandom noise를 재현하는 key다. 숫자 거리보다 같은 seed를 썼는지, noise 생성과 batch 조건이 같은지가 비교 계약이다.</Misconception>
      </section>

      <section id="cfg" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">CFG는 두 예측의 차이를 증폭한다</h2>
        <M display>{String.raw`\underbrace{\hat\epsilon_{\mathrm{cfg}}}_{\text{최종 안내 예측}}=\underbrace{\hat\epsilon_u}_{\text{기준 예측}}+\underbrace{w}_{\text{안내 세기}}\underbrace{(\hat\epsilon_c-\hat\epsilon_u)}_{\text{조건이 만든 방향}}`}</M>
        <FormulaNote
          meaning={'이 식은 현재 ComfyUI 구현의 cond_scale 관례다. 조건 예측에서 기준 예측을 빼면 prompt가 추가한 방향만 남고 w=1이면 조건 예측 자체가 된다. 원 CFG 논문은 guidance 계수의 기준점을 다르게 두어 (1+w) 조건 예측 - w 기준 예측으로 쓴다. 두 식의 문자 w를 같은 숫자로 읽지 않는다. ComfyUI의 w를 무작정 키우면 차이 방향까지 과장되어 색·형태가 깨질 수 있다.'}
          symbols={[
            [String.raw`\hat\epsilon_c`, 'positive condition을 사용한 model 예측'],
            [String.raw`\hat\epsilon_u`, 'unconditional 또는 구현이 정한 기준 condition 예측'],
            [String.raw`w`, 'ComfyUI CFG scale에 대응하는 안내 세기'],
            [String.raw`\hat\epsilon_c-\hat\epsilon_u`, 'prompt condition 때문에 달라진 방향만 분리한 값'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 식은 ComfyUI의 <code>uncond + (cond - uncond) * cond_scale</code> 구현을 설명한다. CFG 원 논문의 guidance weight는 기준점이 달라 계수가 한 칸 이동한다. 핵심 방향은 같아도 표기의 숫자를 그대로 대응시키지 않는다. 또한 distilled·flow 계열 workflow는 낮은 CFG나 별도 guidance embedding을 전제로 할 수 있으므로 model card와 공식 template의 baseline을 먼저 쓴다.</p>
          <p>Negative prompt도 금지어 filter가 아니다. 기준 또는 negative CONDITIONING이 만드는 예측 방향에 관여한다. CFG가 1에 가까워 두 예측의 차이를 거의 증폭하지 않거나 workflow가 zero conditioning을 쓰면 긴 negative 문자열이 기대만큼 영향을 주지 않을 수 있다.</p>
        </div>
      </section>

      <section id="schedule-denoise" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Scheduler와 denoise를 함께 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Steps가 20이라는 숫자만으로 어느 noise level을 거치는지는 알 수 없다. Scheduler가 20개 지점을 정한다. Sampler는 그 지점 사이에서 model prediction을 어떻게 사용해 이동할지 정한다. 따라서 sampler를 비교할 때 scheduler를 고정하고, scheduler를 비교할 때 sampler와 model evaluation 수를 기록한다.</p>
          <p>Img2img의 denoise는 원본 latent에 noise를 더하고 전체 trajectory의 뒤쪽 일부만 실행하는 제어로 이해하는 편이 낫다. 값이 낮으면 시작점이 clean end에 가까워 원본을 더 보존하고, 높으면 noisy start 쪽으로 이동해 더 많이 재구성한다. 다만 UI의 비율과 실제 sigma 위치의 mapping은 scheduler·node implementation에 묶이므로 0.5가 시각적 변화의 정확한 절반은 아니다.</p>
        </div>
      </section>

      <section id="tuning-protocol" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">튜닝은 작은 실험 기록이다</h2>
        <div className="not-prose grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {experiment.map(([title, body], index) => (
            <div key={title} className={`min-w-0 bg-background px-4 py-4 ${experiment.length % 2 === 1 && index === experiment.length - 1 ? 'sm:col-span-2' : ''}`}>
              <strong className="text-sm">{title}</strong>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>구도가 틀리면 seed·prompt·structural condition을 먼저 본다. Detail이 부족하면 model 권장 범위 안에서 steps와 후반 schedule을 본다. Prompt가 약하면 CFG만 올리기 전에 text encoder와 condition routing이 맞는지 확인한다. 잘못 연결된 condition은 sampler 숫자로 고칠 수 없다.</p>
          <p>이 글이 다음 단계에 넘기는 것은 <strong>고정된 sampling baseline과 비교 trace</strong>다. <InternalLink slug="comfyui-lora-control-conditioning">조건 라우팅</InternalLink>에서 이 baseline에 LoRA·ControlNet·reference condition을 하나씩 추가한다.</p>
        </div>
        <CapabilityCheck items={[
          'Seed·steps·CFG·sampler·scheduler·denoise가 서로 다른 trajectory 결정을 맡는 이유를 설명할 수 있다.',
          'Model 권장 baseline에서 한 변수만 바꾸고 prompt_id와 output을 연결한 controlled sweep을 설계할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'ComfyUI · KSampler', href: 'https://docs.comfy.org/built-in-nodes/sampling/ksampler', note: 'KSampler input, latent multi-step denoising과 parameter 역할.' },
          { label: 'ComfyUI · cfg_function', href: 'https://github.com/comfyanonymous/ComfyUI/blob/master/comfy/samplers.py', note: 'uncond + (cond - uncond) × cond_scale로 계산하는 현재 구현 관례.' },
          { label: 'Classifier-Free Diffusion Guidance', href: 'https://arxiv.org/abs/2207.12598', note: 'Conditional·unconditional score를 결합하는 원리. 논문의 guidance 계수 기준점은 ComfyUI UI scale과 다르다.' },
        ]} />
      </section>
    </div>
  );
}
