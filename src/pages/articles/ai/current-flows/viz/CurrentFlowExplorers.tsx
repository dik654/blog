import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  AudioLines,
  Check,
  CircleStop,
  Cpu,
  Database,
  Filter,
  Gauge,
  Layers3,
  MemoryStick,
  Mic2,
  Network,
  Pause,
  Play,
  Route,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';

function FigureHeader({ eyebrow, title, metric }: { eyebrow: string; title: string; metric: string }) {
  return (
    <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-5">
      <span className="font-mono text-[11px] font-black text-emerald-700 dark:text-emerald-300">{eyebrow}</span>
      <strong className="min-w-0 text-sm leading-snug">{title}</strong>
      <span className="w-fit rounded-sm border border-border bg-background px-2 py-1 font-mono text-[10px] font-bold text-muted-foreground">{metric}</span>
    </figcaption>
  );
}

function MetricCell({ label, value, note, tone = 'normal' }: { label: string; value: string; note: string; tone?: 'normal' | 'good' | 'warn' }) {
  const toneClass = tone === 'good'
    ? 'text-emerald-700 dark:text-emerald-300'
    : tone === 'warn'
      ? 'text-amber-700 dark:text-amber-300'
      : 'text-foreground';
  return (
    <div className="min-w-0 bg-background p-4">
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className={`mt-1 font-mono text-xl font-black ${toneClass}`}>{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

const dataStages = [
  { icon: Database, label: '수집', detail: 'URL·시간·license·source를 문서와 함께 보존' },
  { icon: ScanSearch, label: '추출·정규화', detail: 'HTML chrome을 버리고 본문 구조와 문자 규칙을 복원' },
  { icon: Filter, label: '정제', detail: '언어·반복·품질 score로 후보를 줄임' },
  { icon: Layers3, label: '중복 제거', detail: 'Exact·near duplicate를 묶고 남길 대표 문서를 기록' },
  { icon: Sparkles, label: '혼합·합성', detail: '도메인 비율과 verifier 통과 데이터를 조정' },
  { icon: ShieldCheck, label: '감사', detail: 'PII·benchmark contamination·slice 손실을 검사' },
];

export function DataEngineExplorer() {
  const [strength, setStrength] = useState(55);
  const [synthetic, setSynthetic] = useState(20);
  const [active, setActive] = useState(2);
  const kept = Math.max(18, 100 - strength * 0.62);
  const duplicate = Math.max(1.5, 31 - strength * 0.34);
  const niche = Math.max(52, 98 - Math.max(0, strength - 42) * 0.82);
  const verifiedSynthetic = synthetic * 0.73;

  return (
    <figure className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="DATA ENGINE LAB" title="강한 필터는 noise와 함께 희귀한 신호도 지울 수 있다" metric={`${kept.toFixed(0)}% retained`} />
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 sm:p-5">
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          품질 필터 강도 · {strength}%
          <input aria-label="품질 필터 강도" className="mt-3 block w-full accent-emerald-700" type="range" min="0" max="100" value={strength} onChange={(event) => setStrength(Number(event.target.value))} />
        </label>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          합성 후보 비율 · {synthetic}%
          <input aria-label="합성 후보 비율" className="mt-3 block w-full accent-violet-700" type="range" min="0" max="50" value={synthetic} onChange={(event) => setSynthetic(Number(event.target.value))} />
        </label>
      </div>
      <div className="p-4 sm:p-5">
        <p className="mb-4 text-xs leading-5 text-muted-foreground">
          아래 수치는 필터 사이의 trade-off를 살펴보는 교육용 근사다. DCLM·FineWeb의 실측 수율이나 품질 점수가 아니며,
          실제 파이프라인에서는 같은 입력 snapshot으로 단계별 보존율과 downstream 성능을 다시 측정해야 한다.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          {dataStages.map((stage, index) => {
            const Icon = stage.icon;
            const selected = active === index;
            return (
              <button
                key={stage.label}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={selected}
                className={`min-h-28 min-w-0 rounded-md border p-3 text-left transition-colors ${selected ? 'border-emerald-600/45 bg-emerald-500/[0.06]' : 'border-border bg-background hover:bg-muted/30'}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                </span>
                <strong className="mt-3 block text-sm">{stage.label}</strong>
                <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{stage.detail}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          <MetricCell label="남은 token" value={`${kept.toFixed(0)}%`} note="학습 budget 안에 실제 들어가는 양" />
          <MetricCell label="잔여 중복" value={`${duplicate.toFixed(1)}%`} note="같은 문장을 다시 외울 위험" tone={duplicate < 10 ? 'good' : 'warn'} />
          <MetricCell label="희귀 영역 coverage" value={`${niche.toFixed(0)}%`} note="강한 filter가 놓치기 쉬운 분포" tone={niche < 75 ? 'warn' : 'normal'} />
          <MetricCell label="검증된 합성 비율" value={`${verifiedSynthetic.toFixed(0)}%`} note="생성량이 아니라 verifier 통과량" tone={verifiedSynthetic > 0 ? 'good' : 'normal'} />
        </div>

        <div
          className="mt-4 grid gap-4 rounded-md border border-border bg-muted/10 p-4 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-center"
          data-data-mixture-ledger
          data-retained={kept}
          data-removed={100 - kept}
          data-synthetic-candidate={synthetic}
          data-synthetic-verified={verifiedSynthetic}
        >
          <div className="min-w-0">
            <p className="text-xs font-bold">현재 단계 · {dataStages[active].label}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{dataStages[active].detail}. 이 단계의 출력에는 recipe version과 탈락 이유를 남겨야 다음 ablation에서 원인을 되짚을 수 있다.</p>
          </div>
          <div className="space-y-3" aria-label="원문 분할과 합성 검증 퍼널">
            <div aria-label="원문 corpus 분할">
              <p className="mb-1.5 text-[10px] font-bold text-foreground">원문 snapshot · 합계 100%</p>
              <div className="flex h-2 overflow-hidden rounded-sm bg-muted">
                <span className="block h-full bg-blue-500" style={{ width: `${kept}%` }} />
                <span className="block h-full bg-amber-500" style={{ width: `${100 - kept}%` }} />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">보존 {kept.toFixed(0)}% · 제거 {Math.round(100 - kept)}%</p>
            </div>
            <div aria-label="합성 후보 검증 퍼널">
              <p className="mb-1.5 text-[10px] font-bold text-foreground">합성 후보 퍼널 · 합산하지 않음</p>
              <div className="space-y-1.5">
                <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-[10px]">
                  <span className="text-muted-foreground">후보 {synthetic}%p</span>
                  <span className="h-2 overflow-hidden rounded-sm bg-muted"><span className="block h-full bg-violet-300" style={{ width: `${synthetic * 2}%` }} /></span>
                </div>
                <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-[10px]">
                  <span className="text-muted-foreground">통과 {verifiedSynthetic.toFixed(0)}%p</span>
                  <span className="h-2 overflow-hidden rounded-sm bg-muted"><span className="block h-full bg-violet-600" style={{ width: `${verifiedSynthetic * 2}%` }} /></span>
                </div>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">두 막대는 최대 50%p 예산 기준의 포함 관계다.</p>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

export function InferenceBudgetExplorer() {
  const [params, setParams] = useState<4 | 9>(4);
  const [bits, setBits] = useState<4 | 8 | 16>(4);
  const [context, setContext] = useState(8);
  const weightGb = params * bits / 8;
  const kvGb = 0.105 * context * Math.sqrt(params / 4);
  const runtimeGb = params === 4 ? 0.9 : 1.35;
  const total = weightGb + kvGb + runtimeGb;
  const assumedEffectiveBandwidthGbps = 60;
  const bandwidthCeiling = assumedEffectiveBandwidthGbps / Math.max(0.2, weightGb);
  const fits8 = total < 8;

  return (
    <figure className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="DEVICE BUDGET LAB" title="모델 파일이 아니라 실행 중 동시에 살아 있는 byte를 합산한다" metric={fits8 ? '8 GB FIT' : 'OVER BUDGET'} />
      <div className="grid gap-5 border-b border-border bg-muted/15 p-4 sm:grid-cols-3 sm:p-5">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">모델 크기</p>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-md border border-border p-1">
            {[4, 9].map((value) => <button key={value} type="button" onClick={() => setParams(value as 4 | 9)} aria-pressed={params === value} className={`min-h-9 rounded text-xs font-bold ${params === value ? 'bg-foreground text-background' : 'hover:bg-muted'}`}>{value}B</button>)}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Weight precision</p>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-md border border-border p-1">
            {[4, 8, 16].map((value) => <button key={value} type="button" onClick={() => setBits(value as 4 | 8 | 16)} aria-pressed={bits === value} className={`min-h-9 rounded text-xs font-bold ${bits === value ? 'bg-foreground text-background' : 'hover:bg-muted'}`}>{value} bit</button>)}
          </div>
        </div>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">
          Context · {context}K token
          <input aria-label="context 길이" className="mt-4 block w-full accent-emerald-700" type="range" min="2" max="32" step="2" value={context} onChange={(event) => setContext(Number(event.target.value))} />
        </label>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3"><strong className="text-sm">Resident memory stack</strong><span className={`font-mono text-sm font-black ${fits8 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>{total.toFixed(2)} GB / 8 GB</span></div>
          <div className="overflow-hidden rounded-md border border-border bg-muted/20 p-2">
            {[
              { label: 'Weight', value: weightGb, icon: Layers3, color: 'bg-blue-500' },
              { label: 'KV cache', value: kvGb, icon: MemoryStick, color: 'bg-violet-500' },
              { label: 'Runtime', value: runtimeGb, icon: Cpu, color: 'bg-emerald-500' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)_3.7rem] items-center gap-2 border-b border-border/60 py-3 last:border-0">
                  <span className="flex min-w-0 items-center gap-2 text-xs font-semibold"><Icon className="h-3.5 w-3.5 shrink-0" />{item.label}</span>
                  <span className="h-3 min-w-0 overflow-hidden rounded-sm bg-background"><span className={`block h-full ${item.color}`} style={{ width: `${Math.min(100, item.value / 8 * 100)}%` }} /></span>
                  <span className="text-right font-mono text-[11px] font-bold">{item.value.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">KV 값은 구조에 따라 크게 달라지는 교육용 근사다. 실제 선택에서는 layer 수, KV head 수, head dimension, dtype과 batch를 model config에서 다시 계산한다.</p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border">
          <MetricCell label="낙관적 bandwidth ceiling" value={`${bandwidthCeiling.toFixed(1)} tok/s`} note="교육용 가정 60 GB/s ÷ weight GB. 실제 기기 실측값으로 바꿔야 하는 kernel·KV·compute 전 상한" tone="good" />
          <MetricCell label="Precision 변화" value={`${16 / bits}×`} note="FP16 대비 weight byte 감소 배수" />
          <MetricCell label="Memory 판정" value={fits8 ? 'PASS' : 'FAIL'} note={fits8 ? 'OS·app 여유를 추가 확인' : 'context·precision·offload 재설계'} tone={fits8 ? 'good' : 'warn'} />
        </div>
      </div>
    </figure>
  );
}

const cascadeStages = [
  { label: 'VAD + ASR', ms: 270, icon: Mic2, detail: '말 끝 감지와 text 전사' },
  { label: 'Text reasoning', ms: 340, icon: Cpu, detail: 'text token으로 답 계획' },
  { label: 'TTS first chunk', ms: 230, icon: Volume2, detail: '답을 다시 음성으로 합성' },
  { label: 'Network jitter', ms: 80, icon: Network, detail: '전송·buffer 변동' },
];

const nativeStages = [
  { label: 'Audio encode', ms: 110, icon: AudioLines, detail: 'streaming audio token 생성' },
  { label: 'Joint reasoning', ms: 260, icon: Activity, detail: '내용·억양·turn을 함께 추론' },
  { label: 'Codec first chunk', ms: 150, icon: Volume2, detail: 'speech token을 바로 출력' },
  { label: 'Network jitter', ms: 80, icon: Network, detail: '전송·buffer 변동' },
];

export function SpeechLatencyExplorer() {
  const [mode, setMode] = useState<'cascade' | 'native'>('cascade');
  const [jitter, setJitter] = useState(80);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stages = useMemo(() => (mode === 'cascade' ? cascadeStages : nativeStages).map((stage, index) => index === 3 ? { ...stage, ms: jitter } : stage), [mode, jitter]);
  const total = stages.reduce((sum, stage) => sum + stage.ms, 0);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % stages.length), 900);
    return () => window.clearInterval(timer);
  }, [playing, stages.length]);

  return (
    <figure className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="TURN LATENCY LAB" title="각 단계가 조금씩 빨라도 경계가 많으면 대화가 늦어진다" metric={`${total} ms first audio`} />
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-end sm:p-5">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Pipeline</p>
          <div className="mt-2 grid min-w-52 grid-cols-2 gap-1 rounded-md border border-border p-1">
            {(['cascade', 'native'] as const).map((value) => <button key={value} type="button" onClick={() => { setMode(value); setActive(0); }} aria-pressed={mode === value} className={`min-h-9 rounded text-xs font-bold ${mode === value ? 'bg-foreground text-background' : 'hover:bg-muted'}`}>{value === 'cascade' ? 'ASR→LLM→TTS' : 'Native audio'}</button>)}
          </div>
        </div>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">Network jitter · {jitter} ms<input aria-label="network jitter" className="mt-3 block w-full accent-blue-700" type="range" min="0" max="300" step="10" value={jitter} onChange={(event) => setJitter(Number(event.target.value))} /></label>
        <button type="button" onClick={() => setPlaying((value) => !value)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-xs font-bold hover:bg-muted" aria-label={playing ? 'animation pause' : 'animation play'}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{playing ? 'Pause' : 'Play'}</button>
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const selected = index === active;
            return (
              <button key={stage.label} type="button" onClick={() => { setActive(index); setPlaying(false); }} aria-pressed={selected} className={`min-h-32 min-w-0 rounded-md border p-4 text-left transition-all ${selected ? 'border-blue-600/45 bg-blue-500/[0.06] shadow-[inset_0_3px_0_rgba(37,99,235,.75)]' : 'border-border'}`}>
                <span className="flex items-center justify-between gap-2"><Icon className="h-4 w-4" /><span className="font-mono text-lg font-black">{stage.ms}<small className="ml-0.5 text-[9px] font-semibold text-muted-foreground">ms</small></span></span>
                <strong className="mt-4 block text-sm">{stage.label}</strong>
                <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{stage.detail}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <MetricCell label="경계 수" value={mode === 'cascade' ? '3 model APIs' : '1 model stream'} note="format 변환과 queue가 생기는 지점" />
          <MetricCell label="중단 처리" value={mode === 'cascade' ? '별도 제어' : 'joint event'} note="사용자가 끼어들 때 generation을 멈추는 계약" tone={mode === 'native' ? 'good' : 'warn'} />
          <MetricCell label="평가 단위" value="turn" note="WER뿐 아니라 응답 시작·억양·barge-in 성공까지 측정" />
        </div>
      </div>
    </figure>
  );
}

type Action = '왼쪽 밀기' | '집기' | '오른쪽 밀기';
const actionMeta: Record<Action, { success: number; drift: number; target: number }> = {
  '왼쪽 밀기': { success: 46, drift: 0.38, target: 18 },
  '집기': { success: 82, drift: 0.18, target: 50 },
  '오른쪽 밀기': { success: 61, drift: 0.29, target: 78 },
};

export function WorldModelPlannerExplorer() {
  const [action, setAction] = useState<Action>('집기');
  const [horizon, setHorizon] = useState(6);
  const meta = actionMeta[action];
  const confidence = Math.max(12, meta.success - (horizon - 2) * meta.drift * 7);
  const frames = Array.from({ length: Math.min(8, horizon) }, (_, index) => {
    const start = 50;
    const t = (index + 1) / Math.min(8, horizon);
    return start + (meta.target - start) * t + Math.sin(index * 1.7) * meta.drift * horizon;
  });

  return (
    <figure className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="ACTION ROLLOUT LAB" title="같은 관측에서도 action을 바꾸면 예측할 미래가 달라져야 한다" metric={`${confidence.toFixed(0)}% rollout confidence`} />
      <div className="grid gap-5 border-b border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:p-5">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">후보 action</p>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-md border border-border p-1">
            {(Object.keys(actionMeta) as Action[]).map((value) => <button key={value} type="button" onClick={() => setAction(value)} aria-pressed={action === value} className={`min-h-10 min-w-0 rounded px-1 text-[11px] font-bold leading-tight ${action === value ? 'bg-foreground text-background' : 'hover:bg-muted'}`}>{value}</button>)}
          </div>
        </div>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">Rollout horizon · {horizon} step<input aria-label="rollout horizon" className="mt-4 block w-full accent-emerald-700" type="range" min="2" max="12" value={horizon} onChange={(event) => setHorizon(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[11rem_minmax(0,1fr)]">
          <div className="rounded-md border border-border bg-background p-4">
            <div className="flex items-center gap-2"><ScanSearch className="h-4 w-4" /><strong className="text-sm">현재 관측 oₜ</strong></div>
            <div className="relative mt-4 h-32 overflow-hidden rounded border border-border bg-[linear-gradient(to_right,transparent_49%,rgba(148,163,184,.18)_50%,transparent_51%)]">
              <span className="absolute bottom-3 left-3 right-3 h-px bg-border" />
              <span className="absolute bottom-4 left-1/2 h-8 w-8 -translate-x-1/2 rounded-sm border-2 border-blue-600 bg-blue-500/15" />
              <span className="absolute right-4 top-3 rounded-sm border border-emerald-600/40 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold">TARGET</span>
            </div>
          </div>
          <div className="min-w-0 rounded-md border border-border bg-muted/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="flex items-center gap-2 text-xs font-bold"><Route className="h-4 w-4" />{action} 조건 latent rollout</span><span className="text-[10px] text-muted-foreground">관측 → zₜ → f(zₜ,aₜ) → zₜ₊₁</span></div>
            <div className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${frames.length}, minmax(0, 1fr))` }}>
              {frames.map((position, index) => (
                <div key={index} className="relative h-24 min-w-0 overflow-hidden rounded-sm border border-border bg-background">
                  <span className="absolute inset-x-0 bottom-2 h-px bg-border" />
                  <span className="absolute bottom-3 h-4 w-4 -translate-x-1/2 rounded-sm border border-blue-600 bg-blue-500/20 transition-[left] duration-300" style={{ left: `${Math.max(8, Math.min(92, position))}%` }} />
                  <span className="absolute left-1 top-1 font-mono text-[8px] text-muted-foreground">t+{index + 1}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">Horizon이 길어질수록 작은 transition error가 다음 입력으로 다시 들어가 confidence가 낮아진다. 실제 planner는 짧게 실행하고 새 관측으로 다시 계획한다.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <MetricCell label="예측 성공" value={`${meta.success}%`} note="교육용 action별 base score" />
          <MetricCell label="누적 불확실성" value={`${(100 - confidence).toFixed(0)}%`} note="horizon이 늘며 커지는 rollout risk" tone={confidence < 50 ? 'warn' : 'normal'} />
          <MetricCell label="실행 전략" value={horizon > 8 ? 'REPLAN' : 'EXECUTE 1–2'} note="전체 예측을 한 번에 실행하지 않고 feedback으로 닫음" tone="good" />
        </div>
      </div>
    </figure>
  );
}

export function RuntimeBoundaryStrip() {
  return (
    <div className="not-prose my-6 grid gap-2 sm:grid-cols-4">
      {[
        { icon: Mic2, label: 'Input', text: 'sensor·text·audio' },
        { icon: Cpu, label: 'Model', text: 'representation·prediction' },
        { icon: Gauge, label: 'Runtime', text: 'memory·latency·transport' },
        { icon: Check, label: 'Evidence', text: 'task·closed-loop result' },
      ].map(({ icon: Icon, label, text }) => <div key={label} className="min-w-0 rounded-md border border-border p-3"><Icon className="h-4 w-4" /><strong className="mt-3 block text-xs">{label}</strong><span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{text}</span></div>)}
    </div>
  );
}

export function StopRule({ children }: { children: ReactNode }) {
  return <div className="not-prose my-6 flex gap-3 rounded-md border border-amber-600/30 bg-amber-500/[0.04] p-4 text-sm leading-relaxed"><CircleStop className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" /><div><strong>여기서 멈춘다.</strong> {children}</div></div>;
}
