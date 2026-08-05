import { useMemo, useState, type ReactNode } from 'react';
import {
  AudioLines,
  Bot,
  BrainCircuit,
  Check,
  CircleDot,
  Clock3,
  Ear,
  Gauge,
  Languages,
  Mic2,
  Network,
  Pause,
  Route,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Volume2,
  Waves,
  X,
} from 'lucide-react';

function Figure({ eyebrow, title, children, footer, data }: { eyebrow: string; title: string; children: ReactNode; footer?: ReactNode; data: Record<string, string> }) {
  return (
    <figure {...data} className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </figcaption>
      {children}
      {footer && <div className="border-t border-border px-4 py-4 sm:px-5">{footer}</div>}
    </figure>
  );
}

function Segment<T extends string | number>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[9px] font-bold uppercase text-muted-foreground">{label}</p>
      <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => (
          <button key={option} type="button" aria-pressed={option === value} onClick={() => onChange(option)} className={`min-h-9 min-w-0 bg-background px-1 text-[10px] font-bold ${option === value ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground hover:bg-muted/35'}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, note, tone = 'normal' }: { label: string; value: string; note: string; tone?: 'normal' | 'good' | 'warn' }) {
  const color = tone === 'good' ? 'text-emerald-700 dark:text-emerald-300' : tone === 'warn' ? 'text-rose-700 dark:text-rose-300' : '';
  return <div className="min-w-0 bg-background p-3"><p className="text-[9px] font-bold uppercase text-muted-foreground">{label}</p><p className={`mt-1 break-words font-mono text-lg font-black ${color}`}>{value}</p><p className="mt-1 text-[9px] leading-relaxed text-muted-foreground">{note}</p></div>;
}

const sampleRates = [8000, 16000, 24000] as const;
const frameSizes = [20, 25, 40] as const;
const codebookCounts = [2, 4, 8] as const;

export function AudioRepresentationExplorer() {
  const [sampleRate, setSampleRate] = useState<(typeof sampleRates)[number]>(16000);
  const [frameMs, setFrameMs] = useState<(typeof frameSizes)[number]>(25);
  const [codebooks, setCodebooks] = useState<(typeof codebookCounts)[number]>(8);
  const hopMs = 10;
  const samplesPerFrame = sampleRate * frameMs / 1000;
  const framesPerSecond = Math.floor((1000 - frameMs) / hopMs) + 1;
  const rawKbps = sampleRate * 16 / 1000;
  const codecRate = 12.5;
  const codecKbps = codecRate * codebooks * 11 / 1000;

  const waveform = useMemo(() => Array.from({ length: 72 }, (_, index) => {
    const carrier = Math.sin(index * 0.57) * 16;
    const envelope = Math.sin(index / 71 * Math.PI) * 0.75 + 0.18;
    return `${index * 8},${42 - carrier * envelope}`;
  }).join(' '), []);

  return (
    <Figure data={{ 'data-audio-representation': '' }} eyebrow="AUDIO REPRESENTATION LAB" title="같은 1초 음성도 표현을 바꾸면 길이와 보존 정보가 달라진다" footer={<p className="text-xs font-semibold leading-relaxed">Mel의 80개 bin은 vocabulary token 80개가 아니다. 한 frame마다 80차원 연속 feature가 생기며, 1초에는 hop에 따라 약 {framesPerSecond}개의 frame이 남는다.</p>}>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-3 sm:p-5">
        <Segment label="sample rate Hz" options={sampleRates} value={sampleRate} onChange={setSampleRate} />
        <Segment label="frame ms" options={frameSizes} value={frameMs} onChange={setFrameMs} />
        <Segment label="RVQ codebooks" options={codebookCounts} value={codebooks} onChange={setCodebooks} />
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-md border border-border bg-muted/10">
            <div className="flex items-center justify-between border-b border-border px-3 py-2 text-[9px] font-bold uppercase text-muted-foreground"><span>1 second waveform</span><span>{sampleRate.toLocaleString()} samples</span></div>
            <svg viewBox="0 0 568 84" className="block aspect-[568/84] w-full" role="img" aria-label="one second waveform sample">
              <line x1="0" y1="42" x2="568" y2="42" stroke="currentColor" strokeOpacity="0.15" />
              <polyline points={waveform} fill="none" className="stroke-blue-600" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="min-h-24 rounded-md border border-border p-3"><Waves className="h-4 w-4" /><strong className="mt-3 block text-xs">Log-Mel</strong><span className="mt-1 block text-[9px] leading-relaxed text-muted-foreground">{framesPerSecond} frame × 80 continuous bins</span></div>
            <div className="min-h-24 rounded-md border border-blue-600/30 bg-blue-500/[0.045] p-3"><BrainCircuit className="h-4 w-4" /><strong className="mt-3 block text-xs">Semantic latent</strong><span className="mt-1 block text-[9px] leading-relaxed text-muted-foreground">내용 중심, 화자·음색은 일부 손실</span></div>
            <div className="min-h-24 rounded-md border border-emerald-600/30 bg-emerald-500/[0.045] p-3"><AudioLines className="h-4 w-4" /><strong className="mt-3 block text-xs">Acoustic RVQ</strong><span className="mt-1 block text-[9px] leading-relaxed text-muted-foreground">12.5 step/s × {codebooks} refinement levels</span></div>
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <Metric label="frame samples" value={`${samplesPerFrame}`} note={`${frameMs} ms window`} />
            <Metric label="raw PCM" value={`${rawKbps.toFixed(0)} kbps`} note="16-bit mono" />
            <Metric label="illustrative RVQ" value={`${codecKbps.toFixed(2)} kbps`} note="12.5 Hz, V=2048" tone="good" />
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Gauge className="h-5 w-5" />
          <p className="mt-3 text-[10px] font-bold uppercase text-muted-foreground">Highest representable frequency</p>
          <p className="mt-1 font-mono text-3xl font-black">{(sampleRate / 2000).toFixed(0)} kHz</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Nyquist 상한이다. 8 kHz 전화 audio는 4 kHz 위의 음향 정보를 이미 갖고 있지 않다. Model 크기로 사라진 대역을 사실처럼 복원할 수는 없다.</p>
          <div className="mt-4 border-t border-border pt-4 text-[10px] leading-relaxed text-muted-foreground">Codebook을 늘리면 residual detail은 늘 수 있지만 token 예측량, bandwidth와 decoder work도 함께 늘어난다.</div>
        </aside>
      </div>
    </Figure>
  );
}

const asrModes = {
  ctc: { label: 'CTC', context: 'audio frame만', stream: '가능', revision: 'prefix beam에 따라 발생', note: 'blank와 repeat를 포함한 monotonic alignment를 모두 더한다.' },
  rnnt: { label: 'RNN-T', context: 'audio frame + 이전 label', stream: '강함', revision: 'beam·endpoint에 따라 발생', note: 'time 축과 output 축을 함께 걷는 lattice에서 alignment를 더한다.' },
  aed: { label: 'Encoder–Decoder', context: 'encoder 전체 + 이전 label', stream: '설계 의존', revision: 'chunk attention에서 발생', note: 'Decoder attention이 필요한 audio 위치를 직접 선택한다.' },
} as const;

export function AsrAlignmentExplorer() {
  const [mode, setMode] = useState<keyof typeof asrModes>('ctc');
  const active = asrModes[mode];
  const frames = ['f₁', 'f₂', 'f₃', 'f₄', 'f₅', 'f₆', 'f₇', 'f₈'];
  const ctc = ['∅', '안', '안', '∅', '녕', '녕', '∅', '∅'];

  return (
    <Figure data={{ 'data-asr-alignment': '' }} eyebrow="ALIGNMENT OBJECTIVE LAB" title="여덟 audio frame을 두 글자로 줄이는 규칙이 objective마다 다르다" footer={<p className="text-xs font-semibold leading-relaxed">CTC의 blank ∅는 띄어쓰기가 아니라 “이 frame에서는 새 label을 내지 않는다”는 alignment 기호다. Repeat와 blank를 collapse한 뒤에야 transcript가 된다.</p>}>
      <div className="grid grid-cols-3 gap-px border-b border-border bg-border">
        {(Object.keys(asrModes) as Array<keyof typeof asrModes>).map((key) => <button key={key} type="button" aria-pressed={mode === key} onClick={() => setMode(key)} className={`min-h-12 min-w-0 bg-background px-2 text-xs font-bold ${mode === key ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground'}`}>{asrModes[key].label}</button>)}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          {mode === 'ctc' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-8 gap-1">{frames.map((item) => <div key={item} className="min-w-0 rounded-sm border border-border py-2 text-center font-mono text-[9px] text-muted-foreground">{item}</div>)}</div>
              <div className="grid grid-cols-8 gap-1">{ctc.map((item, index) => <div key={`${item}-${index}`} className={`min-w-0 rounded-sm border py-3 text-center text-xs font-black ${item === '∅' ? 'border-border bg-muted/20 text-muted-foreground' : 'border-blue-600/30 bg-blue-500/[0.06]'}`}>{item}</div>)}</div>
              <div className="flex items-center justify-center gap-2 rounded-md border border-border p-4 text-xs font-bold"><span>∅ 안 안 ∅ 녕 녕 ∅ ∅</span><Route className="h-4 w-4 text-muted-foreground" /><span>안녕</span></div>
            </div>
          ) : mode === 'rnnt' ? (
            <div className="min-w-0 overflow-hidden rounded-md border border-border p-3">
              <div className="grid grid-cols-9 gap-1">
                <span />{frames.map((item) => <span key={item} className="py-1 text-center font-mono text-[9px] text-muted-foreground">{item}</span>)}
                {['u0 · ""', 'u1 · 안', 'u2 · 안녕'].flatMap((label, row) => [<span key={`l-${label}`} className="flex items-center break-words text-[8px] font-bold leading-tight">{label}</span>, ...frames.map((_, col) => {
                  const onPath = (row === 0 && col <= 2) || (row === 1 && col >= 2 && col <= 5) || (row === 2 && col >= 5);
                  return <span key={`${row}-${col}`} className={`aspect-square rounded-sm border ${onPath ? 'border-emerald-600/40 bg-emerald-500/20' : 'border-border bg-muted/10'}`} />;
                })])}
              </div>
              <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">세로축은 blank가 아니라 지금까지 낸 output prefix 상태다. 오른쪽 blank edge는 새 label 없이 audio frame을 소비하고, 아래 label edge는 현재 시간에서 prefix를 늘린다. 가능한 monotonic path의 확률을 합친다.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] sm:items-center">
              <div className="rounded-md border border-border p-4"><Ear className="h-4 w-4" /><strong className="mt-3 block text-xs">Encoded audio memory</strong><p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">여덟 frame의 context를 key·value로 보존</p></div>
              <Route className="mx-auto h-5 w-5 text-muted-foreground" />
              <div className="rounded-md border border-blue-600/30 bg-blue-500/[0.05] p-4"><Languages className="h-4 w-4" /><strong className="mt-3 block text-xs">Autoregressive text</strong><p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">이전 label과 attention으로 다음 글자 선택</p></div>
            </div>
          )}
          <div className="mt-4 rounded-md border border-border bg-muted/10 p-4 text-xs leading-relaxed"><strong>{active.label}</strong><span className="ml-2 text-muted-foreground">{active.note}</span></div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <ScanSearch className="h-5 w-5" />
          <dl className="mt-4 divide-y divide-border border-y border-border text-xs">
            <div className="py-3"><dt className="text-[9px] font-bold uppercase text-muted-foreground">Condition</dt><dd className="mt-1 font-semibold">{active.context}</dd></div>
            <div className="py-3"><dt className="text-[9px] font-bold uppercase text-muted-foreground">Streaming</dt><dd className="mt-1 font-semibold">{active.stream}</dd></div>
            <div className="py-3"><dt className="text-[9px] font-bold uppercase text-muted-foreground">Partial revision</dt><dd className="mt-1 font-semibold">{active.revision}</dd></div>
          </dl>
          <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">Backbone이 Conformer인지 Transformer인지는 feature extraction 축이고, CTC·RNN-T·AED는 alignment와 decoding objective 축이다.</p>
        </aside>
      </div>
    </Figure>
  );
}

export function SpeechGenerationExplorer() {
  const [native, setNative] = useState(true);
  const [codebooks, setCodebooks] = useState(8);
  const tokenRate = 12.5;
  const codesPerSecond = tokenRate * codebooks;
  const serialDepthCost = codebooks * 7;
  const firstPacket = native ? 180 + serialDepthCost : 510;

  return (
    <Figure data={{ 'data-speech-generation': '' }} eyebrow="SPEECH GENERATION LAB" title="Native speech도 내용 state와 acoustic refinement의 순서를 가진다" footer={<p className="text-xs font-semibold leading-relaxed">이 수치는 구조 차이를 설명하기 위한 가상 계산이다. 특정 공개 모델의 latency benchmark가 아니며, 실제 비교는 같은 hardware·codec·network·voice 조건에서 잰다.</p>}>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-end sm:p-5">
        <div><p className="mb-2 text-[9px] font-bold uppercase text-muted-foreground">Architecture</p><div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border"><button type="button" aria-pressed={!native} onClick={() => setNative(false)} className={`min-h-9 bg-background text-[10px] font-bold ${!native ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground'}`}>Cascade</button><button type="button" aria-pressed={native} onClick={() => setNative(true)} className={`min-h-9 bg-background text-[10px] font-bold ${native ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground'}`}>Native</button></div></div>
        <label className="text-xs font-semibold text-muted-foreground">Acoustic codebooks · {codebooks}<input aria-label="acoustic codebooks" type="range" min="2" max="12" step="2" value={codebooks} onChange={(event) => setCodebooks(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className={`grid gap-2 ${native ? 'sm:grid-cols-3' : 'sm:grid-cols-5'}`}>
            {(native ? [
              [Ear, 'Audio encoder', 'speech·prosody input'],
              [BrainCircuit, 'Thinker / state', 'text·semantic reasoning'],
              [Volume2, 'Talker / codec', `${codebooks} acoustic refinements`],
            ] : [
              [Mic2, 'ASR', 'audio→text'], [Languages, 'Text', 'audit boundary'], [Bot, 'LLM', 'reasoning'], [Languages, 'Text', 'spoken response'], [Volume2, 'TTS', 'text→audio'],
            ]).map(([Icon, label, note]) => {
              const ItemIcon = Icon as typeof Ear;
              return <div key={String(label)} className="min-h-24 min-w-0 rounded-md border border-border p-3"><ItemIcon className="h-4 w-4" /><strong className="mt-3 block break-words text-[10px]">{String(label)}</strong><span className="mt-1 block break-words text-[9px] leading-relaxed text-muted-foreground">{String(note)}</span></div>;
            })}
          </div>
          {native && <div className="mt-3 overflow-hidden rounded-md border border-border">
            <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-3 border-b border-border p-3"><span className="text-[9px] font-bold text-muted-foreground">SEMANTIC</span><div className="flex gap-1">{['대', '출', '상', '환', '안', '내'].map((token) => <span key={token} className="flex h-7 min-w-7 items-center justify-center rounded-sm border border-blue-600/30 bg-blue-500/[0.06] text-[10px] font-bold">{token}</span>)}</div></div>
            {Array.from({ length: codebooks }, (_, row) => <div key={row} className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-3 border-b border-border p-2 last:border-b-0"><span className="font-mono text-[9px] text-muted-foreground">RVQ {row + 1}</span><div className="grid grid-cols-12 gap-1">{Array.from({ length: 12 }, (_, col) => <i key={col} className={`h-2 rounded-sm ${row === 0 ? 'bg-emerald-600/60' : 'bg-emerald-500/20'}`} />)}</div></div>)}
          </div>}
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <Metric label="codec decisions" value={`${codesPerSecond.toFixed(0)}/s`} note={`${tokenRate} step/s × ${codebooks}`} />
            <Metric label="illustrative first packet" value={`${firstPacket} ms`} note={native ? `fixture: 180ms + ${codebooks} × 7ms serial depth` : 'fixture: 510ms cascade'} tone={firstPacket < 350 ? 'good' : 'warn'} />
            <Metric label="audit path" value={native ? 'optional text' : 'explicit text'} note={native ? 'semantic state를 별도 기록' : 'module boundary마다 transcript'} />
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Sparkles className="h-5 w-5" />
          <p className="mt-3 text-sm font-bold">{native ? '정보를 더 보존하지만 책임도 합쳐진다' : '교체와 감사를 분리하기 쉽다'}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{native ? '억양과 비언어 cue를 latent에 남길 수 있다. 대신 사실성, speaker identity, prosody, codec artifact와 content safety를 한 system에서 함께 검증한다.' : 'ASR, reasoning, TTS를 따로 측정하고 fallback하기 쉽다. 하지만 transcript가 버린 억양·중첩 발화는 뒤 단계에서 복원할 수 없다.'}</p>
        </aside>
      </div>
    </Figure>
  );
}

const timelineCells = Array.from({ length: 12 }, (_, index) => index);

export function DuplexTimelineExplorer() {
  const [fullDuplex, setFullDuplex] = useState(true);
  const [interruptAt, setInterruptAt] = useState(7);
  const [delegate, setDelegate] = useState(true);
  const stopLatency = fullDuplex ? 120 + Math.max(0, interruptAt - 8) * 20 : 640;

  const tone = (row: 'user' | 'system', index: number) => {
    if (row === 'user') {
      if (index < 4 || (fullDuplex && index >= interruptAt && index < interruptAt + 2)) return 'bg-blue-500/65';
      return 'bg-muted/25';
    }
    if (index >= 5 && index < (fullDuplex ? interruptAt + 1 : 10)) return 'bg-emerald-500/65';
    return 'bg-muted/25';
  };

  return (
    <Figure data={{ 'data-duplex-timeline': '' }} eyebrow="DUPLEX INTERACTION LAB" title="동시에 켜져 있는 것과 동시에 판단하는 것은 다르다" footer={<p className="text-xs font-semibold leading-relaxed">Full-duplex의 핵심은 두 audio device가 켜진 상태가 아니라, user input을 계속 해석하면서 system output을 계속할지·멈출지·도구를 부를지 여러 번 갱신하는 interaction policy다.</p>}>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[12rem_minmax(0,1fr)_12rem] sm:items-end sm:p-5">
        <div><p className="mb-2 text-[9px] font-bold uppercase text-muted-foreground">Interaction</p><div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border"><button type="button" aria-pressed={!fullDuplex} onClick={() => setFullDuplex(false)} className={`min-h-9 bg-background text-[10px] font-bold ${!fullDuplex ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground'}`}>Turn</button><button type="button" aria-pressed={fullDuplex} onClick={() => setFullDuplex(true)} className={`min-h-9 bg-background text-[10px] font-bold ${fullDuplex ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground'}`}>Full duplex</button></div></div>
        <label className="text-xs font-semibold text-muted-foreground">User interruption · slot {interruptAt}<input aria-label="user interruption slot" type="range" min="6" max="10" value={interruptAt} onChange={(event) => setInterruptAt(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
        <button type="button" aria-pressed={delegate} onClick={() => setDelegate((value) => !value)} className="min-h-10 rounded-md border border-border bg-background px-3 text-xs font-bold"><BrainCircuit className="mr-2 inline h-3.5 w-3.5" />{delegate ? '배경 추론 켬' : '배경 추론 끔'}</button>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="rounded-md border border-border p-3">
            {(['user', 'system'] as const).map((row) => <div key={row} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 py-2"><span className="text-[9px] font-bold uppercase text-muted-foreground">{row}</span><div className="grid grid-cols-12 gap-1">{timelineCells.map((index) => <i key={index} className={`h-7 rounded-sm ${tone(row, index)}`} />)}</div></div>)}
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 py-2"><span className="text-[9px] font-bold uppercase text-muted-foreground">decision</span><div className="grid grid-cols-12 gap-1">{timelineCells.map((index) => <span key={index} className={`flex h-7 items-center justify-center rounded-sm border text-[8px] font-bold ${fullDuplex && index === interruptAt ? 'border-rose-600/40 bg-rose-500/10' : 'border-border'}`}>{index === 4 ? '말함' : fullDuplex && index === interruptAt ? '중단' : index === 9 && delegate ? '도구' : ''}</span>)}</div></div>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {[
              [Ear, '계속 듣기', 'partial input update'],
              [Volume2, '말하기', 'audio output stream'],
              [Pause, '멈추기', 'barge-in cancel'],
              [Network, '위임하기', delegate ? 'background task active' : 'foreground only'],
            ].map(([Icon, label, note]) => { const ItemIcon = Icon as typeof Ear; return <div key={String(label)} className="min-h-20 rounded-md border border-border p-3"><ItemIcon className="h-3.5 w-3.5" /><strong className="mt-2 block text-[10px]">{String(label)}</strong><span className="mt-1 block text-[8px] leading-relaxed text-muted-foreground">{String(note)}</span></div>; })}
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Clock3 className="h-5 w-5" />
          <p className="mt-3 text-[10px] font-bold uppercase text-muted-foreground">Illustrative stop latency</p>
          <p className={`mt-1 font-mono text-3xl font-black ${stopLatency <= 180 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{stopLatency} ms</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{fullDuplex ? '새 user speech를 input stream에서 감지하고, echo인지 실제 interruption인지 판정한 뒤 queued audio와 tool result의 유효성을 취소한다.' : 'System 발화가 끝날 때까지 새 turn을 열지 않으므로 device가 동시에 켜져 있어도 interruption response는 늦어진다.'}</p>
        </aside>
      </div>
    </Figure>
  );
}

type MediaPathScenario = 'steady' | 'reroute' | 'stale';

const mediaScenarioLabels: Record<MediaPathScenario, string> = {
  steady: '정상 경로',
  reroute: 'ICE 경로 변경',
  stale: '경로 변경 + 낡은 결과',
};

export function MediaOwnershipExplorer() {
  const [scenario, setScenario] = useState<MediaPathScenario>('steady');
  const routeChanged = scenario !== 'steady';
  const staleResult = scenario === 'stale';
  const transportState = routeChanged ? 'checking → connected' : 'connected';
  const responseEpoch = staleResult ? '43' : '42';
  const toolResult = staleResult ? 'discarded' : 'accepted';

  const owners = [
    {
      step: '01',
      icon: Route,
      title: 'Entry · signaling',
      owns: '가까운 relay region과 signaling target을 고른다.',
      state: routeChanged ? '새 region을 다시 선택' : '가까운 region 선택',
      evidence: 'geo decision · target region',
      failure: '잘못 고르면 media를 보내기 전부터 RTT가 커진다.',
      iconTone: 'text-blue-700 dark:text-blue-300',
    },
    {
      step: '02',
      icon: Network,
      title: 'Global Relay',
      owns: '첫 WebRTC packet의 ufrag를 읽어 transceiver owner로 전달한다.',
      state: routeChanged ? 'ufrag → tx-19' : 'ufrag → tx-18',
      evidence: 'relay region · ufrag hash · route event',
      failure: '첫 packet을 owner에게 못 보내면 session이 열리지 않는다.',
      iconTone: 'text-cyan-700 dark:text-cyan-300',
    },
    {
      step: '03',
      icon: ShieldCheck,
      title: 'Transceiver',
      owns: 'ICE, DTLS, SRTP와 WebRTC session lifecycle을 소유한다.',
      state: transportState,
      evidence: 'ICE state · DTLS state · RTP sequence',
      failure: '재연결이 늦으면 model이 살아 있어도 media가 멈춘다.',
      iconTone: 'text-emerald-700 dark:text-emerald-300',
    },
    {
      step: '04',
      icon: BrainCircuit,
      title: 'Model · tools',
      owns: 'Interaction action, response epoch와 background tool 결과를 관리한다.',
      state: staleResult ? 'epoch 43 · result 42 폐기' : `epoch ${responseEpoch} 유지`,
      evidence: 'decision trace · request/result epoch',
      failure: 'Session ID만 보면 취소한 답이 새 대화에 섞인다.',
      iconTone: 'text-amber-700 dark:text-amber-300',
    },
    {
      step: '05',
      icon: Volume2,
      title: 'Buffer · device',
      owns: 'Jitter buffer, decode와 실제 speaker playback을 진행한다.',
      state: routeChanged ? '연속성 확인 · stale audio drain' : 'playout clock 유지',
      evidence: 'buffer depth · underrun · audible stop',
      failure: 'Server cancel 뒤에도 남은 audio가 계속 들릴 수 있다.',
      iconTone: 'text-rose-700 dark:text-rose-300',
    },
  ];

  return (
    <Figure
      data={{
        'data-media-ownership': '',
        'data-media-scenario': scenario,
        'data-transceiver-state': transportState,
        'data-response-epoch': responseEpoch,
        'data-tool-result': toolResult,
      }}
      eyebrow="PRODUCTION MEDIA OWNERSHIP LAB"
      title="경로가 바뀌어도 relay, transport, model과 playback의 책임은 섞이지 않는다"
      footer={<p className="text-xs font-semibold leading-relaxed">이 흐름은 OpenAI가 2026년 5월 공개한 WebRTC 운영 경계를 학습용으로 재구성한 것이다. 모든 voice vendor가 같은 내부 배치를 쓴다는 뜻은 아니며, 공개되지 않은 model architecture나 scheduler는 추정하지 않는다.</p>}
    >
      <div className="grid gap-2 border-b border-border bg-muted/15 p-4 sm:grid-cols-3 sm:p-5">
        {(Object.keys(mediaScenarioLabels) as MediaPathScenario[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={scenario === key}
            onClick={() => setScenario(key)}
            className={`min-h-11 min-w-0 rounded-md border px-3 py-2 text-xs font-bold leading-snug ${
              scenario === key
                ? 'border-foreground/40 bg-background shadow-[inset_0_-2px_0_0_currentColor]'
                : 'border-border bg-background text-muted-foreground hover:bg-muted/30'
            }`}
          >
            {mediaScenarioLabels[key]}
          </button>
        ))}
      </div>

      <div className="min-w-0 divide-y divide-border">
        {owners.map((owner) => {
          const OwnerIcon = owner.icon;
          return (
            <div key={owner.step} className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 gap-y-4 px-4 py-5 sm:px-5 md:grid-cols-[3rem_10rem_minmax(0,1fr)_11rem] md:items-start">
              <div className="flex items-center gap-3 md:block">
                <span className="font-mono text-[10px] font-black text-muted-foreground">{owner.step}</span>
                <OwnerIcon className={`h-4 w-4 shrink-0 md:mt-3 ${owner.iconTone}`} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <strong className="block text-sm leading-snug">{owner.title}</strong>
                <p className="mt-2 break-words text-xs font-black leading-snug">{owner.state}</p>
              </div>
              <div className="col-start-2 min-w-0 md:col-auto">
                <p className="text-xs leading-relaxed text-muted-foreground">{owner.owns}</p>
                <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground"><strong className="text-foreground">증거</strong> · {owner.evidence}</p>
              </div>
              <div className="col-start-2 min-w-0 border-t border-border pt-3 md:col-auto md:border-l md:border-t-0 md:pl-4 md:pt-0">
                <p className="text-[9px] font-bold uppercase text-muted-foreground">실패하면</p>
                <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">{owner.failure}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4">
        <Metric label="relay route" value={routeChanged ? 'region B' : 'region A'} note={routeChanged ? 'geo steering 갱신' : 'initial selection'} />
        <Metric label="transport" value={transportState} note="transceiver receipt" tone={routeChanged ? 'warn' : 'good'} />
        <Metric label="response epoch" value={responseEpoch} note={staleResult ? 'result epoch 42' : 'current result'} />
        <Metric label="tool result" value={toolResult} note={staleResult ? '낡은 결과를 말하지 않음' : '현재 epoch와 일치'} tone={staleResult ? 'warn' : 'good'} />
      </div>
    </Figure>
  );
}

export function VoiceReleaseGate() {
  const [endpoint, setEndpoint] = useState(160);
  const [network, setNetwork] = useState(75);
  const [model, setModel] = useState(190);
  const [packetLoss, setPacketLoss] = useState(1);
  const [taskReceipt, setTaskReceipt] = useState(false);
  const [audioReceipt, setAudioReceipt] = useState(false);
  const [safetyReceipt, setSafetyReceipt] = useState(false);
  const media = 110 + network;
  const firstAudioBudget = endpoint + 40 + model + media;
  const gates = [
    { label: 'Task', pass: taskReceipt, note: 'intent·tool holdout receipt' },
    { label: 'Turn', pass: endpoint <= 240, note: 'endpoint·barge-in' },
    { label: 'Audio', pass: packetLoss <= 4 && audioReceipt, note: 'random·burst loss holdout receipt' },
    { label: 'Latency', pass: firstAudioBudget <= 720, note: 'illustrative budget ≤720ms' },
    { label: 'Safety', pass: safetyReceipt, note: 'PII·voice identity receipt' },
  ];
  const release = gates.every((gate) => gate.pass);

  return (
    <Figure data={{ 'data-voice-release': '' }} eyebrow="VOICE RELEASE LAB" title="Model 시간 밖의 지연과 실패를 함께 release gate로 묶는다" footer={<p className="text-xs font-semibold leading-relaxed">아래 budget은 설명용 가상 통화 조건이다. 실제 threshold는 device, route, language, network와 product risk slice별 p50·p95·p99로 다시 정한다.</p>}>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-5">
        <label className="text-xs font-semibold text-muted-foreground">Endpoint · {endpoint} ms<input aria-label="endpoint latency" type="range" min="80" max="420" step="20" value={endpoint} onChange={(event) => setEndpoint(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Network jitter · {network} ms<input aria-label="network jitter" type="range" min="20" max="260" step="10" value={network} onChange={(event) => setNetwork(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Model · {model} ms<input aria-label="model latency" type="range" min="80" max="500" step="10" value={model} onChange={(event) => setModel(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Packet loss · {packetLoss}%<input aria-label="packet loss" type="range" min="0" max="8" value={packetLoss} onChange={(event) => setPacketLoss(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
      </div>
      <div className="grid gap-px border-b border-border bg-border sm:grid-cols-3">
        {[
          ['Task holdout receipt', taskReceipt, setTaskReceipt],
          ['Random·burst audio receipt', audioReceipt, setAudioReceipt],
          ['Safety holdout receipt', safetyReceipt, setSafetyReceipt],
        ].map(([label, checked, setter]) => (
          <label key={String(label)} className="flex min-h-12 items-center gap-2 bg-background px-4 py-3 text-[10px] font-bold">
            <input type="checkbox" checked={Boolean(checked)} onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)} className="size-4 accent-blue-700" />
            <span>{String(label)}</span>
          </label>
        ))}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="grid gap-2 sm:grid-cols-5">
            {gates.map((gate) => <div key={gate.label} className={`min-h-24 rounded-md border p-3 ${gate.pass ? 'border-emerald-600/30 bg-emerald-500/[0.05]' : 'border-rose-600/30 bg-rose-500/[0.05]'}`}><div className="flex items-center justify-between gap-2"><strong className="text-[10px]">{gate.label}</strong>{gate.pass ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}</div><p className="mt-3 text-[9px] leading-relaxed text-muted-foreground">{gate.note}</p></div>)}
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
            <Metric label="endpoint" value={`${endpoint} ms`} note="발화 종료 판단" />
            <Metric label="queue + model" value={`${40 + model} ms`} note="first speech token" />
            <Metric label="media path" value={`${media} ms`} note="network+jitter+decode fixture" />
            <Metric label="illustrative total" value={`${firstAudioBudget} ms`} note="percentile이 아닌 예산 합" tone={firstAudioBudget <= 720 ? 'good' : 'warn'} />
          </div>
        </div>
        <aside className={`min-w-0 border-t pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 ${release ? 'border-emerald-600/35' : 'border-rose-600/35'}`}>
          {release ? <ShieldCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-300" /> : <TriangleAlert className="h-5 w-5 text-rose-700 dark:text-rose-300" />}
          <p className="mt-3 text-[10px] font-bold uppercase text-muted-foreground">Decision</p>
          <p className="mt-1 text-xl font-black">{release ? 'release candidate' : 'hold'}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{release ? '세 holdout receipt와 turn·latency budget이 모두 닫혔다. 실제 release에서는 같은 trace 모집단으로 p50·p95·p99를 다시 계산한다.' : 'Slider가 좋아 보여도 Task·random/burst audio·Safety holdout receipt가 없으면 release하지 않는다.'}</p>
        </aside>
      </div>
      <div className="flex items-start gap-3 border-t border-border px-4 py-4 sm:px-5"><CircleDot className="mt-0.5 h-4 w-4 shrink-0" /><p className="text-xs font-semibold leading-relaxed">Trace에는 audio chunk sequence, partial transcript, turn decision, output cancel, tool request/result version, RTP packet-loss·jitter와 playback timestamp를 같은 session clock으로 남긴다.</p></div>
    </Figure>
  );
}
