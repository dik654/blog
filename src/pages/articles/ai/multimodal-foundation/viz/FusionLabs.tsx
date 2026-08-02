import { useMemo, useState } from 'react';
import { AudioLines, FileText, Grid3X3, Image as ImageIcon, Merge, Network, ScanLine } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { handleTabKey } from './tabKeyboard';

type BlockKind = 'text' | 'image' | 'audio';

const sequenceBlocks: Array<{ kind: BlockKind; label: string; tokens: number; note: string }> = [
  { kind: 'text', label: '“이 영수증에서”', tokens: 5, note: '질문 앞부분' },
  { kind: 'image', label: 'Image A', tokens: 256, note: 'Resampler 뒤 visual token' },
  { kind: 'text', label: '“합계를 찾고”', tokens: 4, note: '첫 image 뒤 지시' },
  { kind: 'image', label: 'Image B', tokens: 576, note: '더 큰 visual grid' },
  { kind: 'audio', label: 'Audio 8 s', tokens: 200, note: '25 token/s 가정' },
  { kind: 'text', label: '“음성 설명과 비교해”', tokens: 7, note: '마지막 질문' },
];

const blockTone: Record<BlockKind, string> = {
  text: 'border-teal-600/40 bg-teal-500/[0.08]',
  image: 'border-blue-600/40 bg-blue-500/[0.08]',
  audio: 'border-amber-600/40 bg-amber-500/[0.09]',
};

const blockIcon = { text: FileText, image: ImageIcon, audio: AudioLines };

export function InterleavedSequenceLab() {
  const [visible, setVisible] = useState(1);
  const reduceMotion = useReducedMotion();
  const active = sequenceBlocks.slice(0, visible);
  const total = active.reduce((sum, block) => sum + block.tokens, 0);
  const modalityTotal = active.filter((block) => block.kind !== 'text').reduce((sum, block) => sum + block.tokens, 0);
  const fixtureTotal = sequenceBlocks.reduce((sum, block) => sum + block.tokens, 0);
  const fixtureProgress = (total / fixtureTotal) * 100;

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-interleaved-sequence-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">SEQUENCE BUILDER · 실제 입력 순서</p>
        <h3 className="mt-2 text-lg font-bold">Image를 앞에 붙이는 것이 아니라 대화의 위치에 끼워 넣는다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">단계를 늘리면 text·image·audio token이 같은 context 장부에 누적된다. Interleaving은 modality의 순서를 보존하지만 context 비용을 없애지 않는다.</p>
      </figcaption>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap gap-2" aria-label="현재 interleaved token sequence">
            {active.map((block, index) => {
              const Icon = blockIcon[block.kind];
              return (
                <motion.div
                  key={`${block.label}-${index}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`min-w-[8.5rem] flex-1 border-l-2 px-3 py-3 ${blockTone[block.kind]}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="font-mono text-[12px] font-bold tabular-nums">{block.tokens} tok</span>
                  </div>
                  <p className="mt-2 text-sm font-bold leading-snug">{block.label}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{block.note}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-6">
            <label htmlFor="interleaved-step" className="flex items-center justify-between gap-3 text-xs font-bold">
              <span>입력 block을 순서대로 추가</span>
              <span className="font-mono tabular-nums">{visible} / {sequenceBlocks.length}</span>
            </label>
            <input
              id="interleaved-step"
              aria-label="Interleaved sequence block count"
              className="mt-3 min-h-11 w-full accent-blue-700"
              type="range"
              min="1"
              max={sequenceBlocks.length}
              value={visible}
              onChange={(event) => setVisible(Number(event.target.value))}
            />
          </div>
        </div>
        <div className="min-w-0 bg-muted/15 p-4 sm:p-6" aria-live="polite" aria-atomic="true">
          <p className="text-[12px] font-bold text-muted-foreground">CONTEXT LEDGER</p>
          <p className="mt-2 font-mono text-3xl font-bold tabular-nums" data-interleaved-total>{total}</p>
          <p className="mt-1 text-xs text-muted-foreground">현재까지 누적 token</p>
          <div className="mt-5 h-2 overflow-hidden rounded-sm bg-muted" data-interleaved-fixture-track>
            <motion.div
              className="h-full bg-blue-600"
              animate={{ width: `${fixtureProgress}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground" data-interleaved-fixture-caption>
            이 예시 전체 {fixtureTotal.toLocaleString()} token 중 현재 누적 비율
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Multimodal</dt><dd className="font-mono font-bold tabular-nums">{modalityTotal}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Text</dt><dd className="font-mono font-bold tabular-nums">{total - modalityTotal}</dd></div>
            <div className="flex justify-between gap-3 border-t border-border pt-3"><dt className="font-bold">남는 교훈</dt><dd className="max-w-32 text-right text-xs leading-relaxed">순서 공유와 token 예산 공유는 함께 온다.</dd></div>
          </dl>
        </div>
      </div>
    </figure>
  );
}

function GridPreview({ rows, columns, merge }: { rows: number; columns: number; merge: number }) {
  const displayRows = Math.min(12, Math.ceil(rows / merge));
  const displayColumns = Math.min(16, Math.ceil(columns / merge));
  return (
    <div
      className="grid aspect-[4/3] max-h-64 w-full gap-px border border-border bg-border p-px"
      style={{ gridTemplateColumns: `repeat(${displayColumns}, minmax(0, 1fr))` }}
      aria-label={`${rows} by ${columns} patch grid, merge ${merge}`}
    >
      {Array.from({ length: displayRows * displayColumns }, (_, index) => (
        <span key={index} className={`${index % 7 === 0 ? 'bg-blue-500/35' : index % 5 === 0 ? 'bg-teal-500/25' : 'bg-background'}`} />
      ))}
    </div>
  );
}

export function VisualTokenBudgetLab() {
  const [resolution, setResolution] = useState(896);
  const [patch, setPatch] = useState(14);
  const [merge, setMerge] = useState(2);
  const [fixedResampler, setFixedResampler] = useState(false);

  const metrics = useMemo(() => {
    const rows = Math.ceil(resolution / patch);
    const columns = Math.ceil(resolution / patch);
    const raw = rows * columns;
    const merged = Math.ceil(rows / merge) * Math.ceil(columns / merge);
    const output = fixedResampler ? Math.min(256, merged) : merged;
    return { rows, columns, raw, merged, output };
  }, [fixedResampler, merge, patch, resolution]);

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-visual-token-budget-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">TOKEN BUDGET LAB · 해상도를 context로 바꾸기</p>
        <h3 className="mt-2 text-lg font-bold">해상도는 두 축으로 늘고 token 수는 곱으로 늘어난다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Patch와 spatial merge를 바꾸며 2D image가 몇 개의 sequence item이 되는지 계산한다. Fixed resampler는 상한을 만들지만 작은 글자와 위치 정보를 압축한다.</p>
      </figcaption>

      <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="space-y-5 border-b border-border bg-muted/15 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <Control label="정사각 image 해상도" value={`${resolution}px`}>
            <input aria-label="Visual image resolution" className="min-h-11 w-full accent-blue-700" type="range" min="224" max="1344" step="224" value={resolution} onChange={(event) => setResolution(Number(event.target.value))} />
          </Control>
          <Segment label="Patch 크기" values={[14, 16, 28]} selected={patch} onSelect={setPatch} suffix="px" />
          <Segment label="Spatial merge" values={[1, 2, 4]} selected={merge} onSelect={setMerge} suffix="×" />
          <button
            type="button"
            aria-pressed={fixedResampler}
            onClick={() => setFixedResampler((value) => !value)}
            className={`flex min-h-12 w-full items-center justify-between gap-3 border px-3 text-left text-xs font-bold transition-colors ${fixedResampler ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:bg-muted/30'}`}
          >
            <span>256-token fixed resampler</span>
            <span>{fixedResampler ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="min-w-0 p-4 sm:p-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_15rem] md:items-start">
            <GridPreview rows={metrics.rows} columns={metrics.columns} merge={merge} />
            <dl className="divide-y divide-border border-y border-border">
              <Metric icon={Grid3X3} label="Raw patch grid" value={`${metrics.rows} × ${metrics.columns}`} note={`${metrics.raw.toLocaleString()} patches`} />
              <Metric icon={Merge} label="Merge 뒤" value={metrics.merged.toLocaleString()} note={`${merge}×${merge} cell을 한 token으로`} />
              <Metric icon={ScanLine} label="Model 입력" value={metrics.output.toLocaleString()} note={fixedResampler && metrics.merged > 256 ? `${(metrics.merged / metrics.output).toFixed(1)}:1로 추가 압축` : 'merge 결과를 그대로 사용'} />
            </dl>
          </div>
          <p className="mt-6 border-l-2 border-amber-600/50 pl-3 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">같은 896px라도 architecture에 따라 숫자는 달라진다.</strong> 이 lab은 square crop, non-overlapping patch와 단순 spatial merge를 고정한 교육용 장부다. 실제 모델은 tiling, variable aspect ratio, newline token과 multi-scale feature를 추가할 수 있다.
          </p>
        </div>
      </div>
    </figure>
  );
}

type FusionMode = 'interleave' | 'cross' | 'resampled';
const fusionModes: Array<{ id: FusionMode; label: string }> = [
  { id: 'interleave', label: 'Early interleave' },
  { id: 'cross', label: 'Cross-attention' },
  { id: 'resampled', label: '64-query prefix' },
];

export function FusionTopologyLab() {
  const [mode, setMode] = useState<FusionMode>('interleave');
  const textTokens = 128;
  const visualTokens = 576;
  const packedVisual = mode === 'resampled' ? 64 : visualTokens;
  const textSequence = mode === 'cross' ? textTokens : textTokens + packedVisual;
  const visualMemory = mode === 'cross' ? visualTokens : 0;
  const selectMode = (index: number) => setMode(fusionModes[index].id);
  const story = {
    interleave: 'Projector가 만든 576개 vector를 text 사이에 직접 넣는다. 모든 token이 같은 self-attention 장부를 쓴다.',
    cross: 'Text stream은 128자리를 유지하고, 별도의 576개 visual K/V memory를 cross-attention에서 읽는다.',
    resampled: '576개 feature를 64개 query로 먼저 압축한 뒤 text prefix로 넣는다. Context는 줄지만 세부 정보가 요약된다.',
  }[mode];

  return (
    <figure className="not-prose my-9 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background" data-fusion-topology-lab data-mode={mode} data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">FUSION TOPOLOGY · 같은 feature, 다른 memory 계약</p>
        <h3 className="mt-2 text-lg font-bold">“결합한다”를 sequence 길이와 visual K/V 장부로 다시 쓴다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">입력은 [B,576,1024] visual feature와 [B,128,4096] text embedding으로 고정한다. 결합 방식만 바꿔 어느 축이 길어지는지 확인한다.</p>
      </figcaption>
      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="Multimodal fusion topology">
        {fusionModes.map((item, index) => (
          <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} tabIndex={mode === item.id ? 0 : -1} onClick={() => selectMode(index)} onKeyDown={(event) => handleTabKey(event, index, fusionModes.length, selectMode)} className={`min-h-12 min-w-0 bg-background px-2 text-xs font-bold sm:px-3 ${mode === item.id ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'}`}>{item.label}</button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="grid items-center gap-2 text-center text-xs font-bold sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
            <span className="min-w-0 border border-blue-700/35 bg-blue-500/[0.08] px-3 py-4 font-mono">[B,576,1024]</span>
            <span className="text-muted-foreground">→</span>
            <span className="min-w-0 border border-teal-700/35 bg-teal-500/[0.08] px-3 py-4">Projector<br /><code className="text-[12px]">1024→4096</code></span>
            <span className="text-muted-foreground">→</span>
            <span className="min-w-0 border border-amber-700/35 bg-amber-500/[0.08] px-3 py-4 font-mono">[B,{packedVisual},4096]</span>
          </div>
          <div className="mt-5 flex items-start gap-3 border-l-2 border-primary/55 bg-primary/[0.04] p-4">
            <Network className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed">{story}</p>
          </div>
        </div>
        <dl className="grid content-start gap-px bg-border">
          <div className="bg-background p-5"><dt className="text-xs font-bold text-muted-foreground">Text/self-attention 길이</dt><dd className="mt-2 font-mono text-2xl font-bold tabular-nums">{textSequence}</dd></div>
          <div className="bg-background p-5"><dt className="text-xs font-bold text-muted-foreground">별도 visual K/V 길이</dt><dd className="mt-2 font-mono text-2xl font-bold tabular-nums">{visualMemory}</dd></div>
          <div className="bg-background p-5"><dt className="text-xs font-bold text-muted-foreground">읽는 법</dt><dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{mode === 'cross' ? 'Visual token이 text context 자리에서 사라져도 encoder·K/V memory와 cross-attention 비용은 남는다.' : 'Visual vector가 text와 같은 residual stream에 들어가므로 context 합산식이 적용된다.'}</dd></div>
        </dl>
      </div>
    </figure>
  );
}

function Control({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return <div><div className="flex items-center justify-between gap-3 text-xs font-bold"><span>{label}</span><span className="font-mono tabular-nums">{value}</span></div><div className="mt-2">{children}</div></div>;
}

function Segment({ label, values, selected, onSelect, suffix }: { label: string; values: number[]; selected: number; onSelect: (value: number) => void; suffix: string }) {
  return (
    <div>
      <p className="text-xs font-bold">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-1">
        {values.map((value) => (
          <button key={value} type="button" aria-pressed={selected === value} onClick={() => onSelect(value)} className={`min-h-11 border text-xs font-bold ${selected === value ? 'border-blue-700 bg-blue-700 text-white' : 'border-border bg-background hover:bg-muted/30'}`}>
            {suffix === '×' ? `${value}×${value}` : `${value}${suffix}`}
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, note }: { icon: typeof Grid3X3; label: string; value: string; note: string }) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground"><Icon className="h-4 w-4" aria-hidden="true" />{label}</div>
      <dd className="mt-2 font-mono text-2xl font-bold tabular-nums">{value}</dd>
      <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</dd>
    </div>
  );
}

const positionModes = [
  {
    id: 'text',
    label: 'Text · 1D',
    count: 6,
    axes: '순서 p',
    description: '앞뒤 순서만 있으면 token 위치 p 하나로 충분하다.',
  },
  {
    id: 'image',
    label: 'Image · 2D',
    count: 12,
    axes: '높이 h · 너비 w',
    description: '같은 flat index라도 세로와 가로 좌표를 복원해야 이웃 patch 관계를 안다.',
  },
  {
    id: 'video',
    label: 'Video · 3D',
    count: 12,
    axes: '시간 t · 높이 h · 너비 w',
    description: 'Frame 순서와 frame 안의 공간 위치를 동시에 보존해야 움직임과 모양을 구분한다.',
  },
] as const;

type PositionMode = (typeof positionModes)[number]['id'];

function coordinateFor(mode: PositionMode, index: number) {
  if (mode === 'text') return `p=${index}`;
  if (mode === 'image') return `h=${Math.floor(index / 4)}, w=${index % 4}`;
  const time = Math.floor(index / 6);
  const withinFrame = index % 6;
  return `t=${time}, h=${Math.floor(withinFrame / 3)}, w=${withinFrame % 3}`;
}

function PositionCell({ index, active, label }: { index: number; active: boolean; label: string }) {
  return (
    <span
      className={`flex min-h-12 min-w-0 items-center justify-center border text-center font-mono text-[12px] font-bold transition-colors ${
        active ? 'border-blue-700 bg-blue-700 text-white' : 'border-border bg-background text-muted-foreground'
      }`}
      aria-label={label}
    >
      {index}
    </span>
  );
}

export function PositionCoordinateLab() {
  const [mode, setMode] = useState<PositionMode>('image');
  const [cursor, setCursor] = useState(0);
  const selected = positionModes.findIndex((item) => item.id === mode);
  const current = positionModes[selected];

  const selectMode = (index: number) => {
    setMode(positionModes[index].id);
    setCursor(0);
  };

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-position-coordinate-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">POSITION LAB · flat index를 원래 축으로 복원</p>
        <h3 className="mt-2 text-lg font-bold">같은 sequence 번호도 modality에 따라 좌표의 뜻이 다르다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Index를 움직이며 text는 순서 하나, image는 높이·너비, video는 시간까지 필요하다는 차이를 확인한다.</p>
      </figcaption>

      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="Position 좌표 차원 선택">
        {positionModes.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`position-tab-${item.id}`}
            aria-controls={`position-panel-${item.id}`}
            aria-selected={mode === item.id}
            tabIndex={mode === item.id ? 0 : -1}
            onClick={() => selectMode(index)}
            onKeyDown={(event) => handleTabKey(event, index, positionModes.length, selectMode)}
            className={`min-h-12 min-w-0 bg-background px-2 text-xs font-bold sm:px-3 ${
              mode === item.id ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        key={mode}
        id={`position-panel-${mode}`}
        role="tabpanel"
        aria-labelledby={`position-tab-${mode}`}
        className="grid lg:grid-cols-[minmax(0,1fr)_17rem]"
      >
        <div className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          {mode === 'text' && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {Array.from({ length: current.count }, (_, index) => (
                <PositionCell key={index} index={index} active={cursor === index} label={`text position ${index}`} />
              ))}
            </div>
          )}
          {mode === 'image' && (
            <div className="mx-auto grid aspect-[4/3] w-full max-w-md grid-cols-4 gap-2">
              {Array.from({ length: current.count }, (_, index) => (
                <PositionCell key={index} index={index} active={cursor === index} label={`image ${coordinateFor(mode, index)}`} />
              ))}
            </div>
          )}
          {mode === 'video' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {[0, 1].map((frame) => (
                <div key={frame} className="border border-border p-3">
                  <p className="mb-3 font-mono text-[12px] font-bold text-muted-foreground">FRAME t={frame}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }, (_, offset) => {
                      const index = frame * 6 + offset;
                      return <PositionCell key={index} index={index} active={cursor === index} label={`video ${coordinateFor(mode, index)}`} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <label className="mt-6 block text-xs font-bold">
            <span className="flex items-center justify-between gap-3">
              <span>Flat sequence index</span>
              <span className="font-mono tabular-nums">{cursor} / {current.count - 1}</span>
            </span>
            <input
              aria-label="Position flat index"
              className="mt-2 min-h-11 w-full accent-indigo-700"
              type="range"
              min="0"
              max={current.count - 1}
              value={cursor}
              onChange={(event) => setCursor(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="min-w-0 bg-muted/15 p-4 sm:p-6" aria-live="polite" aria-atomic="true">
          <p className="text-[12px] font-bold text-muted-foreground">COORDINATE RECEIPT</p>
          <p className="mt-3 font-mono text-2xl font-bold break-words">{coordinateFor(mode, cursor)}</p>
          <dl className="mt-6 divide-y divide-border border-y border-border text-sm">
            <div className="py-3"><dt className="text-xs font-bold text-muted-foreground">필요한 축</dt><dd className="mt-1 font-semibold">{current.axes}</dd></div>
            <div className="py-3"><dt className="text-xs font-bold text-muted-foreground">왜 남기는가</dt><dd className="mt-1 leading-relaxed">{current.description}</dd></div>
          </dl>
          <p className="mt-5 border-l-2 border-amber-600/50 pl-3 text-xs leading-relaxed text-muted-foreground">Flatten은 저장 순서를 만들 뿐 원래 축의 의미를 없애지 않는다. Position encoding이 그 축을 attention score에 다시 알려 준다.</p>
        </div>
      </div>
    </figure>
  );
}
