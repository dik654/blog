import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Blend,
  Boxes,
  CircleAlert,
  CircleCheck,
  Database,
  Gauge,
  MoveRight,
  ScanSearch,
  Sparkles,
} from 'lucide-react';
import StepViz, { type StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  {
    label: '넓은 style 분포는 데이터 선택에서 시작한다',
    body: '중복·artifact·합성 이미지를 걸러 내고 OCR과 metadata를 caption에 넣는다. 미감의 폭은 마지막 prompt trick이 아니라 pretraining signal이다.',
  },
  {
    label: 'LLM 부품을 diffusion 목적에 맞게 다시 고른다',
    body: 'Qwen3-VL multi-layer feature, GQA, gated attention, SwiGLU와 가벼운 timestep modulation을 stability·efficiency·simplicity 기준으로 조합한다.',
  },
  {
    label: '256→512→1024 순서로 능력과 세부를 나눠 배운다',
    body: '저해상도에서 alignment와 structure에 많은 FLOP를 쓰고, 후반 고해상도 단계에서 detail을 붙인다. Precision도 8-bit에서 bf16으로 전환한다.',
  },
  {
    label: 'Post-training은 넓은 분포를 사용자가 찾기 쉽게 좁힌다',
    body: 'SFT, preference optimization과 RL이 이어진다. Prompt rubric과 artifact reward를 나눠 reward hacking을 막는다.',
  },
  {
    label: 'RAW는 학습 artifact, Turbo는 실행 artifact다',
    body: 'RAW에서 LoRA를 학습하고 Turbo에 적용한다. 52-step·CFG 3.5와 8-step·CFG 0을 서로 바꾸지 않는다.',
  },
];

type Stage = {
  title: string;
  sub: string;
  evidence: string;
  icon: LucideIcon;
  color: string;
};

const stages: Stage[] = [
  {
    title: 'Curated data',
    sub: 'real image · OCR caption',
    evidence: '넓은 coverage, no AI image in pretraining mix',
    icon: Database,
    color: '#0369a1',
  },
  {
    title: 'Single stream',
    sub: 'GQA · gated attention',
    evidence: 'Qwen3-VL multi-layer features, shared text/image blocks',
    icon: Blend,
    color: '#6d28d9',
  },
  {
    title: '256 → 1024',
    sub: '256 · 512 · 1024',
    evidence: '8-bit early stages, bf16 from 1024 through RL',
    icon: Boxes,
    color: '#b45309',
  },
  {
    title: 'Post-training',
    sub: 'SFT · preference · RL',
    evidence: 'prompt rubric + artifact reward + useful prompt pool',
    icon: Sparkles,
    color: '#be123c',
  },
  {
    title: 'RAW → Turbo',
    sub: 'TRAIN RAW · RUN TURBO',
    evidence: 'LoRA transfer, variant-specific sampler contract',
    icon: Gauge,
    color: '#15803d',
  },
];

function StageTile({ stage, active, index }: { stage: Stage; active: boolean; index: number }) {
  const Icon = stage.icon;
  return (
    <div
      data-krea-stage={index}
      data-active={active ? 'true' : 'false'}
      className={`min-w-0 border px-3 py-3 transition-all duration-300 ${
        active ? 'border-foreground/20 bg-background shadow-sm' : 'border-border/60 bg-muted/15 opacity-75'
      }`}
      style={{ borderRadius: 6 }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center border bg-background"
          style={{ borderColor: `${stage.color}55`, color: stage.color, borderRadius: 6 }}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black leading-tight">{stage.title}</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{stage.sub}</p>
        </div>
      </div>
      <p className={`mt-3 text-[11px] leading-relaxed min-[900px]:hidden ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
        {stage.evidence}
      </p>
    </div>
  );
}

function VariantHandoff({ active }: { active: boolean }) {
  return (
    <div className={`mt-5 grid min-w-0 gap-2 border-t border-border/60 pt-4 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] ${active ? '' : 'opacity-70'}`}>
      <div className="min-w-0 border border-sky-700/25 bg-sky-500/[0.04] p-3" style={{ borderRadius: 6 }}>
        <p className="text-[10px] font-black uppercase text-sky-800 dark:text-sky-300">RAW · 학습 lane</p>
        <p className="mt-2 text-sm font-black">52 steps · CFG 3.5 · ≤1K</p>
        <p className="mt-1 hidden text-[11px] leading-relaxed text-muted-foreground sm:block">Undistilled base에서 LoRA·post-training을 수행한다.</p>
      </div>
      <MoveRight className="hidden h-5 w-5 self-center justify-self-center text-muted-foreground sm:block" aria-hidden="true" />
      <div className="min-w-0 border border-emerald-700/25 bg-emerald-500/[0.04] p-3" style={{ borderRadius: 6 }}>
        <p className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">TURBO · 실행 lane</p>
        <p className="mt-2 text-sm font-black">8 steps · CFG 0 · μ 1.15</p>
        <p className="mt-1 hidden text-[11px] leading-relaxed text-muted-foreground sm:block">Distilled checkpoint에 RAW LoRA를 적용해 1K–2K로 실행한다.</p>
      </div>
    </div>
  );
}

type KreaVariant = 'RAW' | 'Turbo';
type KreaMode = 'train' | 'inference';

type KreaSettings = {
  steps: number;
  cfg: number;
  mu: string;
  resolution: number;
};

const rawPreset: KreaSettings = {
  steps: 52,
  cfg: 3.5,
  mu: '',
  resolution: 1024,
};

const turboPreset: KreaSettings = {
  steps: 8,
  cfg: 0,
  mu: '1.15',
  resolution: 1536,
};

function KreaRuntimeContractLab({
  variant,
  mode,
  settings,
  onVariant,
  onMode,
  onSettings,
}: {
  variant: KreaVariant;
  mode: KreaMode;
  settings: KreaSettings;
  onVariant: (value: KreaVariant) => void;
  onMode: (value: KreaMode) => void;
  onSettings: (value: KreaSettings) => void;
}) {
  const issues: string[] = [];
  if (mode === 'train' && variant === 'Turbo') {
    issues.push('LoRA·fine-tuning은 Turbo가 아니라 RAW artifact에서 시작합니다');
  }
  if (mode === 'inference' && variant === 'RAW') {
    if (settings.steps !== 52) issues.push('RAW 권장값은 52 steps입니다');
    if (Math.abs(settings.cfg - 3.5) > 0.001) issues.push('RAW 권장값은 CFG 3.5입니다');
    if (settings.resolution > 1024) issues.push('RAW 공개 권장 범위는 최대 1K입니다');
  }
  if (mode === 'inference' && variant === 'Turbo') {
    if (settings.steps !== 8) issues.push('Turbo 권장값은 8 steps입니다');
    if (Math.abs(settings.cfg) > 0.001) issues.push('Turbo는 CFG 0으로 unconditional pass를 생략합니다');
    if (settings.mu !== '1.15') issues.push('Turbo의 고정 timestep shift는 μ 1.15입니다');
    if (settings.resolution < 1024 || settings.resolution > 2048) {
      issues.push('Turbo 공개 권장 해상도는 1K–2K입니다');
    }
  }
  const valid = issues.length === 0;
  const segmentClass = (active: boolean) => (
    `min-h-11 border px-3 text-xs font-bold transition-colors ${
      active
        ? 'border-sky-700/45 bg-sky-500/[0.09] text-sky-950 dark:text-sky-100'
        : 'border-border bg-background text-muted-foreground hover:border-sky-700/30 hover:text-foreground'
    }`
  );

  return (
    <section
      data-krea-runtime-lab
      className="mt-5 min-w-0 border-y border-border/70 py-4"
      aria-labelledby="krea-runtime-lab-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground">Artifact contract lab</p>
          <h3 id="krea-runtime-lab-title" className="mt-1 text-sm font-black">Variant와 목적을 고른 뒤 실행 manifest를 검증</h3>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Train mode의 숫자는 학습 hyperparameter가 아니라 학습 전후 비교에 쓰는 sampling manifest다.
            RAW의 μ 빈칸은 누락이 아니라 고정 1.15 대신 공식 sampler의 자동 timestep shift를 쓰겠다는 뜻이다.
          </p>
        </div>
        <div
          data-runtime-status={valid ? 'pass' : 'invalid'}
          className={`inline-flex min-h-9 max-w-full items-center gap-2 border px-3 text-xs font-black ${
            valid
              ? 'border-emerald-700/35 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-300'
              : 'border-rose-700/35 bg-rose-500/[0.08] text-rose-800 dark:text-rose-300'
          }`}
          style={{ borderRadius: 5 }}
          role="status"
          aria-live="polite"
        >
          {valid ? <CircleCheck className="h-4 w-4 shrink-0" aria-hidden="true" /> : <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />}
          {valid
            ? mode === 'train'
              ? 'RAW adapter lane 통과'
              : `${variant} inference manifest 통과`
            : `${issues.length}개 계약 위반`}
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="min-w-0 space-y-4">
          <fieldset>
            <legend className="mb-2 text-[11px] font-bold text-muted-foreground">Artifact</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['RAW', 'Turbo'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={segmentClass(variant === value)}
                  aria-pressed={variant === value}
                  onClick={() => onVariant(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-[11px] font-bold text-muted-foreground">목적</legend>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={segmentClass(mode === 'train')} aria-pressed={mode === 'train'} onClick={() => onMode('train')}>
                LoRA · Train
              </button>
              <button type="button" className={segmentClass(mode === 'inference')} aria-pressed={mode === 'inference'} onClick={() => onMode('inference')}>
                Inference
              </button>
            </div>
          </fieldset>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="min-w-0">
            <span className="mb-2 block text-[11px] font-bold text-muted-foreground">Steps</span>
            <input
              type="number"
              min="1"
              value={settings.steps}
              onChange={(event) => onSettings({ ...settings, steps: Number(event.target.value) })}
              className="min-h-11 w-full min-w-0 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
              style={{ borderRadius: 5 }}
              aria-label="Krea sampling steps"
            />
          </label>
          <label className="min-w-0">
            <span className="mb-2 block text-[11px] font-bold text-muted-foreground">CFG</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={settings.cfg}
              onChange={(event) => onSettings({ ...settings, cfg: Number(event.target.value) })}
              className="min-h-11 w-full min-w-0 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
              style={{ borderRadius: 5 }}
              aria-label="Krea CFG"
            />
          </label>
          <label className="min-w-0">
            <span className="mb-2 block text-[11px] font-bold text-muted-foreground">μ · blank=auto</span>
            <input
              type="number"
              step="0.05"
              value={settings.mu}
              onChange={(event) => onSettings({ ...settings, mu: event.target.value })}
              className="min-h-11 w-full min-w-0 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
              style={{ borderRadius: 5 }}
              aria-label="Krea timestep mu"
              placeholder="auto"
            />
          </label>
          <label className="min-w-0">
            <span className="mb-2 block text-[11px] font-bold text-muted-foreground">Resolution</span>
            <select
              value={settings.resolution}
              onChange={(event) => onSettings({ ...settings, resolution: Number(event.target.value) })}
              className="min-h-11 w-full min-w-0 border border-border bg-background px-2 text-sm outline-none focus:border-foreground"
              style={{ borderRadius: 5 }}
              aria-label="Krea resolution"
            >
              <option value={768}>768</option>
              <option value={1024}>1024</option>
              <option value={1536}>1536</option>
              <option value={2048}>2048</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 min-w-0 border-l-2 border-foreground/20 pl-3">
        {valid ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {mode === 'train'
              ? 'RAW에서 adapter를 학습하고, 같은 seed suite의 RAW·Turbo 결과를 별도 manifest로 비교합니다.'
              : `${variant} · ${settings.steps} steps · CFG ${settings.cfg} · μ ${settings.mu || 'auto'} · ${settings.resolution}px`}
          </p>
        ) : (
          <ul className="space-y-1 text-xs font-medium leading-relaxed text-rose-800 dark:text-rose-300">
            {issues.map((issue) => <li key={issue}>· {issue}</li>)}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function Krea2LifecycleViz() {
  const [variant, setVariant] = useState<KreaVariant>('RAW');
  const [mode, setMode] = useState<KreaMode>('train');
  const [settings, setSettings] = useState<KreaSettings>(rawPreset);

  const selectVariant = (value: KreaVariant) => {
    setVariant(value);
    setSettings(value === 'RAW' ? rawPreset : turboPreset);
  };

  return (
    <div
      data-krea-lifecycle
      className="scroll-mt-28
        [&_.step-viz]:my-8"
    >
      <StepViz
        steps={steps}
        headerClassName="!min-h-[223px] sm:!min-h-[135px]"
        stageClassName="!min-h-[435px] sm:!min-h-[384px] min-[900px]:!min-h-[360px]"
      >
        {(step) => (
          <div className="w-full min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground">Foundation model lifecycle</p>
                <p className="mt-1 text-sm font-black">넓은 분포가 빠른 실행 artifact가 되기까지</p>
              </div>
              <ScanSearch className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            </div>

            <div className="hidden min-w-0 grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)] items-center gap-1 min-[900px]:grid">
              {stages.map((stage, index) => (
                <div key={stage.title} className="contents">
                  <StageTile stage={stage} active={index === step} index={index} />
                  {index < stages.length - 1 && (
                    <MoveRight className={`h-4 w-4 justify-self-center ${index < step ? 'text-foreground' : 'text-border'}`} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>

            <div className="min-[900px]:hidden">
              <StageTile stage={stages[step]} active index={step} />
              <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
                {step + 1} / {stages.length} · {stages[step].sub}
              </p>
            </div>

            {step === 4 ? (
              <VariantHandoff active />
            ) : (
              <div
                data-viz-active-evidence
                className="mt-5 grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(14rem,0.8fr)]"
              >
                <div className="min-w-0 border-l-2 pl-3" style={{ borderColor: stages[step].color }}>
                  <p className="font-mono text-[11px] font-black text-muted-foreground">
                    MILESTONE {String(step + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-1 text-sm font-black">{stages[step].title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stages[step].evidence}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    ['목표', step === 0 ? 'coverage' : step === 1 ? 'stable' : step === 2 ? 'budget' : 'control'],
                    ['관측', step < 2 ? 'signal' : step === 2 ? 'loss' : 'reward'],
                    ['실패', step === 0 ? 'bias' : step === 1 ? 'spike' : step === 2 ? 'detail' : 'hack'],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0 border border-border/60 bg-muted/15 px-2 py-2" style={{ borderRadius: 5 }}>
                      <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
                      <p className="mt-1 break-words font-mono text-xs font-bold [overflow-wrap:anywhere]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </StepViz>
      <KreaRuntimeContractLab
        variant={variant}
        mode={mode}
        settings={settings}
        onVariant={selectVariant}
        onMode={setMode}
        onSettings={setSettings}
      />
    </div>
  );
}
