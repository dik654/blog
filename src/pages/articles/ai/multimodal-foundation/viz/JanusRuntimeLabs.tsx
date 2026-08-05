import { useState } from 'react';
import { ArrowRight, Braces, Cpu, FileImage, Image as ImageIcon, Layers3, ScanSearch } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { handleTabKey } from './tabKeyboard';

const paths = {
  understand: {
    label: 'Image 이해',
    steps: [
      ['01', 'VLChatProcessor', 'Image placeholder를 고정 수의 image token 자리로 확장하고 mask를 만든다.'],
      ['02', 'vision_model', 'pixel_values [B,N,3,H,W]를 semantic visual feature로 바꾼다.'],
      ['03', 'aligner', 'Vision width를 language model hidden width D에 맞춘다.'],
      ['04', 'prepare_inputs_embeds', 'images_seq_mask가 가리키는 text embedding 자리를 visual embedding으로 교체한다.'],
      ['05', 'language_model.generate', '같은 attention mask와 KV cache를 사용해 text answer를 생성한다.'],
    ],
  },
  generate: {
    label: 'Image 생성',
    steps: [
      ['01', 'Prompt + image_start_tag', 'Text prompt 뒤에 image sequence 시작 경계를 붙인다.'],
      ['02', 'Conditional / Unconditional pair', '각 sample마다 conditional row를 짝수 index에, 내용이 pad된 unconditional row를 다음 홀수 index에 두어 [c₀,u₀,c₁,u₁,…] 인접 쌍을 만든다.'],
      ['03', 'language_model.model', '이전 visual code embedding과 KV cache에서 다음 hidden을 계산한다.'],
      ['04', 'gen_head → sample', 'Hidden을 visual vocabulary logit으로 바꾸고 CFG 뒤 다음 code ID를 뽑는다.'],
      ['05', 'prepare_gen_img_embeds', '뽑은 code ID를 다음 autoregressive 입력 embedding으로 바꾼다.'],
      ['06', 'gen_vision_model.decode_code', '576개 code를 8×24×24 latent shape로 바꾼 뒤 384×384 RGB image로 복원한다.'],
    ],
  },
} as const;

type JanusPhase = 'understand' | 'generate' | 'train';
const janusPhases: Array<{ id: JanusPhase; label: string }> = [
  { id: 'understand', label: '이해 추론' },
  { id: 'generate', label: '생성 추론' },
  { id: 'train', label: '생성 학습' },
];

const janusModules = [
  { name: 'language_model.model', owner: '공유', active: ['understand', 'generate', 'train'], role: '두 경로가 함께 쓰는 autoregressive transformer와 KV cache' },
  { name: 'vision_model + aligner', owner: '이해 전용', active: ['understand'], role: 'Pixel을 semantic feature로 바꿔 text embedding 자리에 삽입' },
  { name: 'text LM head', owner: '이해 출력', active: ['understand'], role: 'Hidden을 text vocabulary logit으로 변환' },
  { name: 'gen_head + gen_embed', owner: '생성 전용', active: ['generate', 'train'], role: 'Hidden↔visual code ID 사이를 연결' },
  { name: 'gen_vision_model.encode', owner: '학습 전용', active: ['train'], role: '정답 image를 supervision용 VQ code ID로 변환' },
  { name: 'gen_vision_model.decode_code', owner: '생성 추론', active: ['generate'], role: '예측을 끝낸 576개 code를 RGB image로 복원' },
] as const;

export function JanusModuleOwnershipLab() {
  const [phase, setPhase] = useState<JanusPhase>('understand');
  const selectPhase = (index: number) => setPhase(janusPhases[index].id);
  return (
    <figure className="not-prose my-9 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background" data-janus-module-ownership data-phase={phase} data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">MODULE OWNERSHIP · shared와 unified를 분해</p>
        <h3 className="mt-2 text-lg font-bold">공유 transformer가 같은 encoder·head·decoder를 뜻하지 않는다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">실행 phase를 바꾸면 실제로 호출되는 object만 밝아진다. 특히 target image를 VQ code로 바꾸는 encode는 생성 학습에만 있고 text-to-image 추론 loop에는 없다.</p>
      </figcaption>
      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="Janus phase">
        {janusPhases.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={phase === item.id} tabIndex={phase === item.id ? 0 : -1} onClick={() => selectPhase(index)} onKeyDown={(event) => handleTabKey(event, index, janusPhases.length, selectPhase)} className={`min-h-12 min-w-0 bg-background px-2 text-xs font-bold sm:px-3 ${phase === item.id ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'}`}>{item.label}</button>)}
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {janusModules.map((module) => {
          const active = (module.active as readonly string[]).includes(phase);
          return <div key={module.name} className={`min-w-0 p-4 transition-colors sm:p-5 ${active ? 'bg-background' : 'bg-muted/55 text-muted-foreground'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <code className="break-all text-xs font-bold">{module.name}</code>
              <span className={`border px-2 py-1 text-[11px] font-bold ${active ? 'border-emerald-700/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : 'border-border bg-background/60'}`}>{active ? '호출' : '미호출'}</span>
            </div>
            <p className="mt-3 text-xs font-black">{module.owner}</p>
            <p className="mt-2 text-xs leading-relaxed">{module.role}</p>
          </div>;
        })}
      </div>
    </figure>
  );
}

export function JanusRuntimeTraceLab() {
  const [mode, setMode] = useState<keyof typeof paths>('understand');
  const [step, setStep] = useState(0);
  const reduceMotion = useReducedMotion();
  const current = paths[mode];
  const active = current.steps[step];
  const isLastStep = step === current.steps.length - 1;
  const beforeLabel = step === 0
    ? (mode === 'understand' ? 'pixel / token input' : 'prompt / prior code')
    : `${current.steps[step - 1][1]} 완료`;
  const afterLabel = isLastStep
    ? (mode === 'understand' ? 'text answer' : '384×384 RGB image')
    : `${current.steps.length - step - 1}단계 남음 · 다음 ${current.steps[step + 1][1]}`;

  const selectMode = (next: keyof typeof paths) => {
    setMode(next);
    setStep(0);
  };

  return (
    <figure className="not-prose my-9 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background" data-janus-runtime-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">OFFICIAL CODE TRACE · commit 1daa72f</p>
        <h3 className="mt-2 text-lg font-bold">공유 transformer 앞뒤의 두 visual path를 코드 순서로 분리한다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">이해는 pixel feature를 text embedding 자리에 끼우고, 생성은 visual code를 한 개씩 뽑아 다시 embedding으로 되먹인다.</p>
      </figcaption>
      <div className="grid grid-cols-2 gap-px bg-border" role="tablist" aria-label="Janus 실행 경로 선택">
        {Object.entries(paths).map(([key, path], index) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`janus-mode-tab-${key}`}
            aria-controls={`janus-mode-panel-${key}`}
            aria-selected={mode === key}
            tabIndex={mode === key ? 0 : -1}
            onClick={() => selectMode(key as keyof typeof paths)}
            onKeyDown={(event) => handleTabKey(event, index, Object.keys(paths).length, (next) => selectMode(Object.keys(paths)[next] as keyof typeof paths))}
            className={`min-h-12 bg-background px-3 text-sm font-bold ${mode === key ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'}`}
          >
            {path.label}
          </button>
        ))}
      </div>
      <div
        id={`janus-mode-panel-${mode}`}
        role="tabpanel"
        aria-labelledby={`janus-mode-tab-${mode}`}
        className="grid lg:grid-cols-[16rem_minmax(0,1fr)]"
      >
        <div className="grid grid-cols-2 gap-px border-b border-border bg-border md:grid-cols-3 lg:grid-cols-1 lg:border-b-0 lg:border-r" role="tablist" aria-label={`${current.label} 코드 단계`}>
          {current.steps.map((item, index) => (
            <button
              key={item[1]}
              type="button"
              role="tab"
              id={`janus-step-tab-${mode}-${index}`}
              aria-controls={`janus-step-panel-${mode}-${index}`}
              aria-selected={step === index}
              tabIndex={step === index ? 0 : -1}
              onClick={() => setStep(index)}
              onKeyDown={(event) => handleTabKey(event, index, current.steps.length, setStep)}
              className={`min-h-14 min-w-0 bg-background px-3 py-3 text-left sm:px-4 ${step === index ? 'shadow-[inset_3px_0_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'}`}
            >
              <span className="font-mono text-[12px] font-bold">{item[0]}</span>
              <span className="ml-2 break-words text-xs font-bold text-foreground">{item[1]}</span>
            </button>
          ))}
        </div>
        <motion.div
          key={`${mode}-${step}`}
          id={`janus-step-panel-${mode}-${step}`}
          role="tabpanel"
          aria-labelledby={`janus-step-tab-${mode}-${step}`}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="min-w-0 p-4 sm:p-6"
        >
          <div className="flex items-center gap-3">
            {mode === 'understand' ? <ScanSearch className="h-6 w-6 text-blue-700" aria-hidden="true" /> : <ImageIcon className="h-6 w-6 text-orange-700" aria-hidden="true" />}
            <div><p className="font-mono text-[12px] font-bold text-muted-foreground">STEP {active[0]}</p><h4 className="mt-1 break-words text-lg font-bold">{active[1]}</h4></div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{active[2]}</p>
          <p className="mt-6 text-[12px] font-bold text-muted-foreground">현재 단계의 앞·뒤 경계</p>
          <div className="mt-3 grid items-center justify-items-center gap-2 text-[12px] font-bold sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:justify-items-stretch">
            <span className="w-full break-words border border-border bg-muted/20 px-3 py-2 text-center">{beforeLabel}</span>
            <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden="true" />
            <span className="w-full border border-border bg-muted/20 px-3 py-2 text-center break-words">{active[1]}</span>
            <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" aria-hidden="true" />
            <span className="w-full break-words border border-border bg-muted/20 px-3 py-2 text-center">{afterLabel}</span>
          </div>
          <p className="mt-6 border-l-2 border-amber-600/50 pl-3 text-xs leading-relaxed text-muted-foreground">이 trace는 official repository의 example과 model class를 복원한 것이다. Kernel 성능, production batching과 최신 serving 최적화를 증명하지 않는다.</p>
        </motion.div>
      </div>
    </figure>
  );
}

export function ClassifierFreeGuidanceLab() {
  const [conditional, setConditional] = useState(2.4);
  const [unconditional, setUnconditional] = useState(1.2);
  const [weight, setWeight] = useState(5);
  const reduceMotion = useReducedMotion();
  const guided = unconditional + weight * (conditional - unconditional);
  const gap = conditional - unconditional;

  return (
    <figure className="not-prose my-9 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background" data-janus-cfg-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-orange-700 dark:text-orange-300">CFG PAIR LAB · logit 방향 강조</p>
        <h3 className="mt-2 text-lg font-bold">Prompt가 만든 차이만 확대하고 공통 baseline은 남긴다</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Janus example은 각 sample의 conditional·unconditional row를 인접한 쌍으로 배치한다. 한 번의 batched forward에서 나온 두 logit의 차이에 weight를 곱해 prompt 방향을 강조한다.</p>
      </figcaption>
      <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="space-y-5 border-b border-border bg-muted/15 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <Control label="Conditional logit" value={conditional} min={-1} max={4} step={0.1} onChange={setConditional} />
          <Control label="Unconditional logit" value={unconditional} min={-1} max={4} step={0.1} onChange={setUnconditional} />
          <Control label="CFG weight" value={weight} min={1} max={8} step={0.5} onChange={setWeight} />
        </div>
        <div className="min-w-0 p-4 sm:p-6">
          <div className="mb-6 border-y border-border py-4" data-cfg-batch-layout>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <strong className="text-sm">한 step의 2B batch</strong>
              <code className="text-xs">[c₀, u₀, c₁, u₁, …]</code>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">짝수 row는 conditional, 바로 다음 홀수 row는 unconditional이다. CFG에서 뽑은 code ID 하나를 두 row에 복제해 다음 step의 visual-code 이력을 같게 유지한다.</p>
          </div>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-3" aria-live="polite" aria-atomic="true">
            <Metric icon={FileImage} label="기준 logit" value={unconditional.toFixed(2)} />
            <Metric icon={Braces} label="Prompt 차이" value={gap.toFixed(2)} />
            <Metric icon={Layers3} label="Guided logit" value={guided.toFixed(2)} />
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-sm bg-muted">
            <motion.div
              className={`h-full ${guided >= 0 ? 'bg-orange-600' : 'bg-blue-600'}`}
              animate={{ width: `${Math.min(100, Math.abs(guided) * 8)}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">교육용 magnitude 표시 범위 · |guided logit| 0–12.5</p>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Weight를 크게 하면 prompt 방향은 강해지지만 항상 image 품질이 좋아지는 것은 아니다. Distribution을 과하게 밀어 saturation·artifact와 다양성 저하를 만들 수 있다.</p>
        </div>
      </div>
    </figure>
  );
}

function Control({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return <label className="text-xs font-bold"><span className="flex justify-between gap-3"><span>{label}</span><span className="font-mono tabular-nums">{value.toFixed(1)}</span></span><input aria-label={label} className="mt-2 min-h-11 w-full accent-orange-700" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Cpu; label: string; value: string }) {
  return <div className="min-w-0 bg-background p-4"><div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground"><Icon className="h-4 w-4" aria-hidden="true" />{label}</div><p className="mt-2 font-mono text-2xl font-bold tabular-nums">{value}</p></div>;
}
