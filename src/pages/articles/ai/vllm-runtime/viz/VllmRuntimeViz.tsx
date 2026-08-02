import type { LucideIcon } from 'lucide-react';
import {
  Blocks,
  Check,
  Cpu,
  Database,
  Gauge,
  Route,
  Sparkles,
  X,
} from 'lucide-react';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

type Tone = 'violet' | 'sky' | 'emerald' | 'amber' | 'rose' | 'neutral';

const tone: Record<Tone, string> = {
  violet: 'border-violet-500/35 bg-violet-500/[0.06] text-violet-900 dark:text-violet-200',
  sky: 'border-sky-500/35 bg-sky-500/[0.06] text-sky-900 dark:text-sky-200',
  emerald: 'border-emerald-500/35 bg-emerald-500/[0.06] text-emerald-900 dark:text-emerald-200',
  amber: 'border-amber-500/35 bg-amber-500/[0.06] text-amber-950 dark:text-amber-200',
  rose: 'border-rose-500/35 bg-rose-500/[0.06] text-rose-900 dark:text-rose-200',
  neutral: 'border-border bg-muted/20 text-foreground',
};

function VizShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <figure data-vllm-runtime-viz className="not-prose my-8 scroll-mt-24 overflow-hidden rounded-lg border border-border/80 bg-background">
      <figcaption className="border-b border-border/70 px-4 py-4 sm:px-5">
        <p className="text-[11px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <p className="mt-1 text-base font-bold leading-snug text-foreground sm:text-lg">{title}</p>
      </figcaption>
      <div className="min-w-0 p-4 sm:p-5">{children}</div>
    </figure>
  );
}

function Metric({ icon: Icon, label, value, detail, kind = 'neutral' }: { icon: LucideIcon; label: string; value: string; detail: string; kind?: Tone }) {
  return (
    <div className={`min-w-0 border px-3 py-3 ${tone[kind]}`}>
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{label}</div>
      <strong className="mt-2 block font-mono text-sm [overflow-wrap:anywhere]">{value}</strong>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

export function PagedKvLedgerViz() {
  const logical = [0, 1, 2, 3];
  const physical = [413, 17, 900, 62];
  return (
    <VizShell eyebrow="Physical KV ledger" title="연속된 token 위치와 GPU의 물리 block 주소를 분리한다">
      <div className="grid gap-2 sm:grid-cols-3">
        <Metric icon={Cpu} label="한 token" value="128 KiB" detail="K·V × 32 layer × 8 KV head × 128 × BF16" kind="sky" />
        <Metric icon={Blocks} label="16-token block" value="2 MiB" detail="마지막 block만 덜 채워질 수 있다" kind="violet" />
        <Metric icon={Database} label="12 GiB pool" value="6,144 blocks" detail="예약과 runtime headroom 전 이론 상한" />
      </div>
      <div className="mt-4 overflow-hidden border border-border">
        {logical.map((block, index) => (
          <div key={block} className="grid min-w-0 grid-cols-2 border-b border-border last:border-b-0">
            <div className="min-w-0 border-r bg-muted/20 px-3 py-3">
              <strong className="block font-mono text-xs">logical {block}</strong>
              <span className="mt-1 block text-[11px] text-muted-foreground">token {block * 16}–{block * 16 + 15}</span>
            </div>
            <div className={`min-w-0 px-3 py-3 font-mono text-xs ${tone.violet}`}>physical #{physical[index]}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground"><Route className="mt-0.5 h-3.5 w-3.5 shrink-0" />Block table이 순서를 복원하므로 물리 주소는 붙어 있을 필요가 없다. 공유 prefix는 같은 physical block의 refcount를 늘린다.</p>
    </VizShell>
  );
}

export function SchedulerBudgetViz() {
  return (
    <VizShell eyebrow="One-step work plan" title="1,024-token 장부에서 latency-sensitive decode를 먼저 보호한다">
      <div className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
        <div className={`px-3 py-4 ${tone.sky}`}><span className="text-xs font-semibold">Decode</span><strong className="mt-1 block font-mono text-lg">128</strong></div>
        <div className={`px-3 py-4 ${tone.violet}`}><span className="text-xs font-semibold">Chunked prefill</span><strong className="mt-1 block font-mono text-lg">896</strong></div>
      </div>
      <div className="mt-4 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        <div className="bg-background px-3 py-3"><Gauge className="h-4 w-4" /><strong className="mt-2 block text-sm">Token budget</strong><p className="mt-1 text-xs text-muted-foreground">128 + 896 = 1,024</p></div>
        <div className="bg-background px-3 py-3"><Database className="h-4 w-4" /><strong className="mt-2 block text-sm">KV headroom</strong><p className="mt-1 text-xs text-muted-foreground">slot이 없으면 숫자만 남아도 admission 실패</p></div>
        <div className="bg-background px-3 py-3"><Cpu className="h-4 w-4" /><strong className="mt-2 block text-sm">다른 비용</strong><p className="mt-1 text-xs text-muted-foreground">prefill은 compute, decode는 memory pressure가 크다</p></div>
      </div>
    </VizShell>
  );
}

export function SpeculativeCommitViz() {
  const states = [
    ['t₁', '수락', '0.82', 'emerald'],
    ['t₂', '수락', '0.76', 'emerald'],
    ['t₃', '거부', '0.41', 'rose'],
    ['t₄', '폐기', '—', 'neutral'],
  ] as const;
  return (
    <VizShell eyebrow="Verified token commit" title="제안한 네 token과 KV에 확정해도 되는 prefix는 다르다">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {states.map(([token, state, ratio, kind]) => (
          <div key={token} className={`min-w-0 border px-3 py-3 ${tone[kind]}`}>
            <div className="flex items-center justify-between gap-2"><strong className="font-mono text-sm">{token}</strong>{state === '수락' ? <Check className="h-4 w-4" /> : state === '거부' ? <X className="h-4 w-4" /> : null}</div>
            <p className="mt-3 text-xs font-semibold">{state}</p><p className="mt-1 font-mono text-[11px] text-muted-foreground">p/q = {ratio}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Metric icon={Check} label="Commit" value="t₁ · t₂ · recovery" detail="거부 지점 뒤 draft는 폐기하고 보정 분포에서 한 token을 확정" kind="emerald" />
        <Metric icon={Sparkles} label="전부 수락할 때" value="K + bonus" detail="target이 계산한 다음 위치 token까지 확정 가능" kind="amber" />
      </div>
    </VizShell>
  );
}

export function MultimodalBudgetViz() {
  const steps = [
    { label: '1. Media가 들어오기 전에 출처를 검증한다.', body: 'URL, bytes와 trusted UUID는 서로 다른 입구다. URL은 scheme, host, redirect와 private address를 먼저 제한한다.' },
    { label: '2. Processor가 pixel을 model 입력 계약으로 바꾼다.', body: 'Resize와 patching 결과로 encoder position과 prompt placeholder 위치가 함께 결정된다.' },
    { label: '3. Encoder 결과를 별도 identity와 byte budget으로 관리한다.', body: '공유 fixture의 576 × 4096 × 2는 4.5 MiB지만 processor와 model revision이 바뀌면 cache identity도 달라져야 한다.' },
    { label: '4. Scheduler가 media와 text budget을 함께 admission한다.', body: 'Encoder compute/cache budget과 decoder token/KV slot은 서로 다른 장부다. 둘 다 확보된 요청만 decode state로 넘어간다.' },
  ];

  const scenes = [
    <>
      <DataBox x={18} y={78} w={82} h={38} label="URL · bytes" sub="raw media" color="#a16207" />
      <AlertBox x={112} y={68} w={96} h={58} label="Trust gate" sub="SSRF 검사" color="#b42318" />
      <ModuleBox x={220} y={68} w={98} h={58} label="Render state" sub="허용된 입력" color="#2563eb" />
      <line x1={100} y1={97} x2={108} y2={97} stroke="var(--muted-foreground)" markerEnd="url(#vlm-arrow)" />
      <line x1={208} y1={97} x2={216} y2={97} stroke="var(--muted-foreground)" markerEnd="url(#vlm-arrow)" />
      <text x="168" y="164" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">검증되지 않은 원격 주소는 processor로 넘기지 않는다</text>
    </>,
    <>
      <ModuleBox x={18} y={68} w={88} h={58} label="Processor" sub="model config" color="#2563eb" />
      <ActionBox x={118} y={68} w={96} h={58} label="resize · patch" sub="placeholder 정렬" color="#7c3aed" />
      <DataBox x={226} y={78} w={92} h={38} label="576 positions" sub="이 글의 fixture" color="#0f766e" />
      <line x1={106} y1={97} x2={114} y2={97} stroke="var(--muted-foreground)" markerEnd="url(#vlm-arrow)" />
      <line x1={214} y1={97} x2={222} y2={97} stroke="var(--muted-foreground)" markerEnd="url(#vlm-arrow)" />
      <text x="168" y="164" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">pixel 수를 곧바로 decoder token 수로 부르지 않는다</text>
    </>,
    <>
      <ModuleBox x={18} y={68} w={88} h={58} label="Vision encoder" sub="feature 생성" color="#7c3aed" />
      <DataBox x={118} y={78} w={96} h={38} label="4.5 MiB" sub="embedding 하한" color="#0f766e" />
      <StatusBox x={226} y={68} w={92} h={58} label="Media cache" sub="identity 일치" color="#0f766e" progress={0.82} />
      <line x1={106} y1={97} x2={114} y2={97} stroke="var(--muted-foreground)" markerEnd="url(#vlm-arrow)" />
      <line x1={214} y1={97} x2={222} y2={97} stroke="var(--muted-foreground)" markerEnd="url(#vlm-arrow)" />
      <text x="168" y="164" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">UUID hit와 decoder prefix KV hit는 같은 사건이 아니다</text>
    </>,
    <>
      <ModuleBox x={18} y={68} w={88} h={58} label="Scheduler" sub="admission" color="#2563eb" />
      <ActionBox x={118} y={68} w={96} h={58} label="두 장부 확인" sub="encoder · KV" color="#a16207" />
      <ModuleBox x={226} y={68} w={92} h={58} label="Decoder" sub="aligned state" color="#0f766e" />
      <line x1={106} y1={97} x2={114} y2={97} stroke="var(--muted-foreground)" markerEnd="url(#vlm-arrow)" />
      <line x1={214} y1={97} x2={222} y2={97} stroke="var(--muted-foreground)" markerEnd="url(#vlm-arrow)" />
      <text x="168" y="164" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">media feature와 text placeholder가 맞아야 decode를 시작한다</text>
    </>,
  ];

  return (
    <div data-vllm-runtime-viz>
      <StepViz steps={steps}>
        {(step) => (
          <svg viewBox="0 0 336 190" className="mx-auto h-auto w-full max-w-[34rem]" role="img" aria-label="Media 입구에서 decoder까지 네 상태 경계를 순서대로 확인하는 장면">
            <defs><marker id="vlm-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="var(--muted-foreground)" /></marker></defs>
            <text x="168" y="26" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--foreground)">Media-to-decoder admission</text>
            <text x="168" y="46" textAnchor="middle" fontSize="10.5" fill="var(--muted-foreground)">보안 → processor → encoder cache → decoder</text>
            {scenes[step]}
          </svg>
        )}
      </StepViz>
    </div>
  );
}
