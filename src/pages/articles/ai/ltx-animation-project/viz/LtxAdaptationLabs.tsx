import { useState } from 'react';
import {
  Archive,
  CheckCircle2,
  Cpu,
  Database,
  FileCheck2,
  Gauge,
  GitCommitHorizontal,
  Layers3,
  PackageCheck,
  ScanLine,
  ShieldCheck,
  SlidersHorizontal,
  TriangleAlert,
} from 'lucide-react';

type ProfileKey = 'smoke' | 'standard';
type StageKey = 'version' | 'manifest' | 'precompute' | 'train' | 'validate' | 'release';
type FixtureKey = 'line' | 'identity' | 'audio';

const profiles = {
  smoke: {
    label: '49 frame · 절약형',
    dims: '576 × 576 × 49',
    tokens: '2,268',
    latent: '18 × 18 × 7',
    rank: 'rank 16 · alpha 16',
    memory: 'INT8 Quanto · 8-bit text encoder',
    note: '공식 low-VRAM 예제의 smoke-test 출발점',
  },
  standard: {
    label: '89 frame · 표준 예제',
    dims: '576 × 576 × 89',
    tokens: '3,888',
    latent: '18 × 18 × 12',
    rank: 'rank 32 · alpha 32',
    memory: 'BF16 · AdamW',
    note: '공식 T2V LoRA 예제의 validation 출발점',
  },
} satisfies Record<ProfileKey, {
  label: string;
  dims: string;
  tokens: string;
  latent: string;
  rank: string;
  memory: string;
  note: string;
}>;

const stages = [
  {
    key: 'version',
    label: '버전',
    short: '현재 산출물 고정',
    icon: GitCommitHorizontal,
    tone: 'border-zinc-500/60 bg-zinc-500/[0.06]',
    owner: '실험 책임자',
    input: 'ltx-2.3-22b-dev.safetensors · Gemma encoder · trainer source',
    artifact: 'source-receipt.json · config 원본 · license snapshot',
    invariant: 'checkpoint·encoder·trainer revision을 실험 도중 바꾸지 않는다.',
    evidence: '검산 SHA 9377758131b1 · 2026-07-08 public sync',
  },
  {
    key: 'manifest',
    label: '목록',
    short: 'clip 정체성 고정',
    icon: Database,
    tone: 'border-teal-600/55 bg-teal-500/[0.06]',
    owner: '데이터 큐레이터',
    input: 'video · caption · source_group · shot_id · rights_record',
    artifact: 'train/validation이 표시된 manifest.jsonl과 SHA-256',
    invariant: '같은 원본 episode의 인접 shot을 서로 다른 split에 넣지 않는다.',
    evidence: '중복·rights·group leakage 검사 기록',
  },
  {
    key: 'precompute',
    label: '전처리',
    short: '학습 tensor 생성',
    icon: Layers3,
    tone: 'border-sky-600/55 bg-sky-500/[0.06]',
    owner: 'process_dataset.py',
    input: 'manifest · resolution bucket · checkpoint · text encoder',
    artifact: '.precomputed/latents · audio_latents · conditions',
    invariant: 'H·W는 32의 배수, frame은 8k+1이며 bucket과 config가 일치한다.',
    evidence: 'decode spot-check · tensor shape · precompute root hash',
  },
  {
    key: 'train',
    label: '학습',
    short: '작은 변화만 갱신',
    icon: Cpu,
    tone: 'border-amber-600/55 bg-amber-500/[0.07]',
    owner: 'ltx-trainer LoRA run',
    input: 'precomputed tensors · profile config · fixed seed',
    artifact: 'adapter checkpoint · log · target-module 목록',
    invariant: 'base weight는 보존하고 선택한 attention projection만 갱신한다.',
    evidence: 'step·loss·optimizer·rank·alpha·trainable parameter receipt',
  },
  {
    key: 'validate',
    label: '검증',
    short: '같은 조건으로 대조',
    icon: ScanLine,
    tone: 'border-fuchsia-600/50 bg-fuchsia-500/[0.06]',
    owner: 'paired evaluator',
    input: '같은 prompt · seed · bucket · sampler로 만든 base/LoRA 쌍',
    artifact: '축별 delta · retention regression · earliest failure',
    invariant: 'adapter 유무 외의 생성 조건을 바꾸지 않는다.',
    evidence: 'target fixture와 unseen retention set을 분리한 점수표',
  },
  {
    key: 'release',
    label: '릴리스',
    short: '근거 묶음 닫기',
    icon: PackageCheck,
    tone: 'border-emerald-600/55 bg-emerald-500/[0.06]',
    owner: 'release owner',
    input: 'adapter · paired evidence · runtime · rights decision',
    artifact: '재현 bundle 또는 blocked failure ledger',
    invariant: 'target 개선이 retention·runtime·rights 실패를 덮지 않는다.',
    evidence: '모든 hard gate가 열릴 때만 release candidate',
  },
] satisfies Array<{
  key: StageKey;
  label: string;
  short: string;
  icon: typeof Archive;
  tone: string;
  owner: string;
  input: string;
  artifact: string;
  invariant: string;
  evidence: string;
}>;

const fixtures = {
  line: {
    label: '선화 개선',
    summary: '목표 축은 크게 좋아지고 보존 축은 허용 범위 안에 남는다.',
    verdict: '릴리스 후보',
    verdictTone: 'border-emerald-600/35 bg-emerald-500/[0.06] text-emerald-950 dark:text-emerald-100',
    icon: CheckCircle2,
    next: '공식 production pipeline에서 같은 manifest를 다시 실행하고 runtime receipt를 닫는다.',
    scores: [
      { label: '선화 안정성 · 목표', base: 46, lora: 78, gate: 70 },
      { label: '캐릭터 정체성 · 보존', base: 82, lora: 80, gate: 72 },
      { label: '동작 의도 · 보존', base: 75, lora: 74, gate: 70 },
      { label: '오디오 정렬 · 보존', base: 72, lora: 72, gate: 68 },
    ],
  },
  identity: {
    label: '외운 듯한 결과',
    summary: '선화 평균은 올랐지만 unseen 캐릭터 정체성과 동작이 함께 무너진다.',
    verdict: '릴리스 차단',
    verdictTone: 'border-rose-600/35 bg-rose-500/[0.06] text-rose-950 dark:text-rose-100',
    icon: TriangleAlert,
    next: 'source_group split을 다시 검사하고 rank·step을 낮춘 뒤 unseen retention을 먼저 복구한다.',
    scores: [
      { label: '선화 안정성 · 목표', base: 48, lora: 91, gate: 70 },
      { label: '캐릭터 정체성 · 보존', base: 81, lora: 58, gate: 72 },
      { label: '동작 의도 · 보존', base: 76, lora: 52, gate: 70 },
      { label: '오디오 정렬 · 보존', base: 71, lora: 70, gate: 68 },
    ],
  },
  audio: {
    label: '오디오 회귀',
    summary: '영상 축은 나아졌지만 joint audio-video branch의 보존 조건이 깨진다.',
    verdict: '릴리스 차단',
    verdictTone: 'border-rose-600/35 bg-rose-500/[0.06] text-rose-950 dark:text-rose-100',
    icon: TriangleAlert,
    next: 'target-module pattern과 generated audio branch를 확인하고 video-only 개입과 비교한다.',
    scores: [
      { label: '선화 안정성 · 목표', base: 47, lora: 77, gate: 70 },
      { label: '캐릭터 정체성 · 보존', base: 82, lora: 79, gate: 72 },
      { label: '동작 의도 · 보존', base: 75, lora: 73, gate: 70 },
      { label: '오디오 정렬 · 보존', base: 74, lora: 48, gate: 68 },
    ],
  },
} satisfies Record<FixtureKey, {
  label: string;
  summary: string;
  verdict: string;
  verdictTone: string;
  icon: typeof CheckCircle2;
  next: string;
  scores: Array<{ label: string; base: number; lora: number; gate: number }>;
}>;

function Fact({
  label,
  value,
  detail,
  className = '',
}: {
  label: string;
  value: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={`min-w-0 bg-background px-3 py-3 ${className}`}>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-bold [overflow-wrap:anywhere]">{value}</p>
      {detail && <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>}
    </div>
  );
}

export function LtxTrainingRunLab() {
  const [profileKey, setProfileKey] = useState<ProfileKey>('smoke');
  const [stageKey, setStageKey] = useState<StageKey>('version');
  const profile = profiles[profileKey];
  const stage = stages.find((candidate) => candidate.key === stageKey) ?? stages[0];

  return (
    <div
      data-ltx-run-lab
      data-ltx-profile={profileKey}
      data-ltx-stage={stageKey}
      className="not-prose my-8 min-h-[680px] overflow-hidden rounded-md border border-border bg-background sm:min-h-[590px] lg:min-h-[520px]"
    >
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <SlidersHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">실행 프로필</p>
            <h3 className="mt-1 text-base font-bold">Frame 수가 바뀌면 먼저 transformer가 읽을 양이 바뀐다</h3>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="LTX 실행 프로필">
          {(Object.keys(profiles) as ProfileKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={profileKey === key}
              onClick={() => setProfileKey(key)}
              className={`min-h-11 rounded-md border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                profileKey === key
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-foreground hover:bg-muted/40'
              }`}
            >
              {profiles[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-3">
        <Fact label="Validation 크기" value={profile.dims} detail={profile.note} />
        <Fact label="Transformer sequence" value={`${profile.tokens} token`} detail={profile.latent} />
        <Fact className="col-span-2 sm:col-span-1" label="예제 학습 설정" value={profile.rank} detail={profile.memory} />
      </div>

      <div className="px-3 py-4 sm:px-5">
        <p className="mb-3 text-xs font-semibold text-muted-foreground">증거가 이동하는 순서</p>
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-6" role="tablist" aria-label="LTX 적응 단계">
          {stages.map((candidate, index) => {
            const Icon = candidate.icon;
            const selected = candidate.key === stageKey;
            return (
              <button
                key={candidate.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setStageKey(candidate.key)}
                className={`min-h-[4.75rem] min-w-0 rounded-md border px-3 py-2.5 text-left transition-colors ${
                  selected ? candidate.tone : 'border-border bg-background hover:bg-muted/35'
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                </span>
                <span className="mt-2 block text-sm font-bold">{candidate.label}</span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">{candidate.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[27rem] border-t border-border px-4 py-4 sm:min-h-[19.5rem] sm:px-5">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
          {[
            ['현재 책임자', stage.owner],
            ['들어오는 것', stage.input],
            ['남겨야 할 산출물', stage.artifact],
            ['검증 증거', stage.evidence],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 bg-background px-3 py-3">
              <p className="text-xs font-semibold text-muted-foreground">{label}</p>
              <p className="mt-1 break-words text-sm font-medium leading-6 [overflow-wrap:anywhere]">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex min-w-0 gap-3 rounded-md border border-amber-600/25 bg-amber-500/[0.05] px-3 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">이 단계에서 지킬 것</p>
            <p className="mt-1 break-words text-sm font-semibold leading-6 [overflow-wrap:anywhere]">{stage.invariant}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScorePair({
  label,
  base,
  lora,
  gate,
}: {
  label: string;
  base: number;
  lora: number;
  gate: number;
}) {
  const passed = lora >= gate;
  const delta = lora - base;
  return (
    <div className="min-w-0 border-b border-border py-3 last:border-b-0">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <p className="truncate text-xs font-semibold">{label}</p>
        <span className={`shrink-0 font-mono text-xs font-bold ${passed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
          {delta >= 0 ? '+' : ''}{delta} · gate {gate}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-[3.25rem_minmax(0,1fr)_2rem] items-center gap-2">
        <span className="text-xs text-muted-foreground">Base</span>
        <span className="h-1.5 overflow-hidden rounded-full bg-muted">
          <span className="block h-full rounded-full bg-zinc-500" style={{ width: `${base}%` }} />
        </span>
        <span className="text-right font-mono text-xs">{base}</span>
        <span className="text-xs text-muted-foreground">LoRA</span>
        <span className="h-1.5 overflow-hidden rounded-full bg-muted">
          <span className={`block h-full rounded-full ${passed ? 'bg-emerald-600' : 'bg-rose-600'}`} style={{ width: `${lora}%` }} />
        </span>
        <span className="text-right font-mono text-xs">{lora}</span>
      </div>
    </div>
  );
}

export function LtxPairedEvaluationLab() {
  const [fixtureKey, setFixtureKey] = useState<FixtureKey>('line');
  const fixture = fixtures[fixtureKey];
  const VerdictIcon = fixture.icon;

  return (
    <div
      data-ltx-eval-lab
      data-ltx-fixture={fixtureKey}
      className="not-prose my-8 min-h-[660px] overflow-hidden rounded-md border border-border bg-background sm:min-h-[560px] lg:min-h-[500px]"
    >
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">Paired validation</p>
            <h3 className="mt-1 text-base font-bold">예쁜 한 sample 대신, 목표 개선과 보존 회귀를 동시에 본다</h3>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="실패 fixture 선택">
          {(Object.keys(fixtures) as FixtureKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={fixtureKey === key}
              onClick={() => setFixtureKey(key)}
              className={`min-h-11 rounded-md border px-2 py-2 text-xs font-semibold transition-colors sm:px-3 ${
                fixtureKey === key
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background text-foreground hover:bg-muted/40'
              }`}
            >
              {fixtures[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-border bg-muted/20 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 gap-3">
          <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="min-w-0 text-xs leading-5 text-muted-foreground">
            <strong className="text-foreground">고정 조건</strong> · 같은 prompt · seed 42 · 576×576×49 · 25 FPS · 30 steps · guidance 4.0 · STG block 29
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(15rem,0.75fr)]">
        <div className="px-4 py-3 sm:px-5">
          {fixture.scores.map((score) => <ScorePair key={score.label} {...score} />)}
        </div>

        <div className="border-t border-border px-4 py-4 lg:border-l lg:border-t-0 sm:px-5">
          <p className="text-xs font-semibold text-muted-foreground">관찰한 인과</p>
          <p className="mt-2 text-sm font-medium leading-6">{fixture.summary}</p>
          <div className={`mt-4 rounded-md border px-3 py-3 ${fixture.verdictTone}`}>
            <div className="flex items-center gap-2">
              <VerdictIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="text-sm font-bold">{fixture.verdict}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-muted-foreground">다음 최소 수정</p>
            <p className="mt-1 text-sm leading-6">{fixture.next}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
