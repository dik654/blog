import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Boxes,
  Braces,
  Gauge,
  ScanSearch,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const attentionModes = [
  {
    id: 'encoder' as const,
    short: 'Encoder self',
    label: 'Encoder self-attention',
    query: 'Source hidden state',
    keyValue: '같은 source hidden state',
    mask: 'Padding 위치만 차단',
    score: 'S × S',
    output: '각 source 위치가 모든 source 위치의 정보를 섞은 표현',
    accent: 'text-cyan-700 dark:text-cyan-300',
    tint: 'bg-cyan-500/[0.07]',
  },
  {
    id: 'decoder' as const,
    short: 'Masked decoder',
    label: 'Masked decoder self-attention',
    query: 'Shifted target hidden state',
    keyValue: '같은 shifted target hidden state',
    mask: '미래 target 위치를 −∞로 차단',
    score: 'T × T',
    output: '현재 위치까지의 target prefix만 읽은 표현',
    accent: 'text-amber-700 dark:text-amber-300',
    tint: 'bg-amber-500/[0.07]',
  },
  {
    id: 'cross' as const,
    short: 'Cross attention',
    label: 'Encoder-decoder attention',
    query: 'Decoder hidden state',
    keyValue: 'Encoder의 최종 source memory',
    mask: 'Source padding 위치만 차단',
    score: 'T × S',
    output: '각 target 위치가 source 전체에서 필요한 정보를 가져온 표현',
    accent: 'text-violet-700 dark:text-violet-300',
    tint: 'bg-violet-500/[0.07]',
  },
] as const;

function handleTabs(
  event: React.KeyboardEvent<HTMLButtonElement>,
  index: number,
  count: number,
  select: (next: number) => void,
) {
  let next = index;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % count;
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + count) % count;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = count - 1;
  else return;
  event.preventDefault();
  select(next);
  requestAnimationFrame(() => document.getElementById(`transformer-mode-${next}`)?.focus());
}

function ModeTabs({
  selected,
  onSelect,
  prefix,
}: {
  selected: number;
  onSelect: (index: number) => void;
  prefix: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="Attention 위치 선택">
      {attentionModes.map((mode, index) => (
        <button
          key={mode.id}
          id={`${prefix}-${index}`}
          type="button"
          role="tab"
          aria-selected={selected === index}
          tabIndex={selected === index ? 0 : -1}
          onClick={() => onSelect(index)}
          onKeyDown={(event) => {
            let next = index;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % attentionModes.length;
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + attentionModes.length) % attentionModes.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = attentionModes.length - 1;
            else return;
            event.preventDefault();
            onSelect(next);
            requestAnimationFrame(() => document.getElementById(`${prefix}-${next}`)?.focus());
          }}
          className={`min-h-14 min-w-0 bg-background px-2 py-2 text-[12px] font-bold leading-snug sm:px-4 ${
            selected === index
              ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]'
              : 'text-muted-foreground hover:bg-muted/30'
          }`}
        >
          {mode.short}
        </button>
      ))}
    </div>
  );
}

export function TransformerPathLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const mode = attentionModes[selected];
  const stages = [
    ['QUERY', mode.query],
    ['KEY · VALUE', mode.keyValue],
    ['MASK · SCORE', `${mode.mask} · ${mode.score}`],
    ['OUTPUT', mode.output],
  ] as const;

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-transformer-path-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
          EXECUTION PATH · 같은 식, 다른 정보 소유자
        </p>
        <h3 className="mt-2 text-lg font-bold">
          세 attention은 Q와 K·V가 어디에서 오는지부터 다르다
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          모드를 바꾸면 query가 묻는 위치, 참고할 memory와 score 행렬의 두 축이 함께 바뀐다.
        </p>
      </figcaption>
      <ModeTabs selected={selected} onSelect={setSelected} prefix="transformer-path-mode" />
      <motion.div
        key={mode.id}
        role="tabpanel"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        className={`${mode.tint} p-4 sm:p-6`}
      >
        <p className={`mb-4 text-sm font-bold ${mode.accent}`}>{mode.label}</p>
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)] md:items-stretch">
          {stages.map(([label, value], index) => (
            <div key={label} className="contents">
              <div className="min-w-0 border border-border bg-background p-4">
                <p className="font-mono text-[12px] font-bold text-muted-foreground">{label}</p>
                <p className="mt-2 text-sm font-bold leading-relaxed">{value}</p>
              </div>
              {index < stages.length - 1 && (
                <>
                  <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground md:hidden" aria-hidden="true" />
                  <div className="hidden items-center justify-center md:flex">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </figure>
  );
}

function ShapeRow({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="grid min-w-0 gap-1 bg-background px-3 py-3 sm:grid-cols-[5rem_8rem_minmax(0,1fr)] sm:items-center sm:gap-4 sm:px-4">
      <dt className="font-mono text-[12px] font-bold text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm font-black">{value}</dd>
      <dd className="text-xs leading-relaxed text-muted-foreground">{note}</dd>
    </div>
  );
}

export function AttentionShapeLab() {
  const [selected, setSelected] = useState(0);
  const [sourceLength, setSourceLength] = useState(5);
  const [targetLength, setTargetLength] = useState(4);
  const mode = attentionModes[selected];
  const batch = 2;
  const heads = 8;
  const headWidth = 64;
  const queryLength = mode.id === 'encoder' ? sourceLength : targetLength;
  const memoryLength = mode.id === 'cross' ? sourceLength : queryLength;

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-attention-shape-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">
          SHAPE LAB · B=2 · h=8 · dₖ=64
        </p>
        <h3 className="mt-2 text-lg font-bold">Score의 행은 질문 위치, 열은 읽을 memory 위치다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Source와 target 길이를 바꾸어 cross-attention의 T×S가 self-attention의 정사각형과 다른 이유를 확인한다.
        </p>
      </figcaption>
      <ModeTabs selected={selected} onSelect={setSelected} prefix="transformer-shape-mode" />
      <div className="grid gap-px border-y border-border bg-border sm:grid-cols-2">
        <label className="min-w-0 bg-background p-4">
          <span className="flex items-center justify-between gap-3 text-xs font-bold">
            Source 길이 S <output className="font-mono text-sm">{sourceLength}</output>
          </span>
          <input
            className="mt-3 w-full accent-foreground"
            type="range"
            min="2"
            max="8"
            value={sourceLength}
            onChange={(event) => setSourceLength(Number(event.target.value))}
          />
        </label>
        <label className="min-w-0 bg-background p-4">
          <span className="flex items-center justify-between gap-3 text-xs font-bold">
            Target 길이 T <output className="font-mono text-sm">{targetLength}</output>
          </span>
          <input
            className="mt-3 w-full accent-foreground"
            type="range"
            min="2"
            max="8"
            value={targetLength}
            onChange={(event) => setTargetLength(Number(event.target.value))}
          />
        </label>
      </div>
      <dl className="grid gap-px bg-border">
        <ShapeRow
          label="Q"
          value={`${batch}×${heads}×${queryLength}×${headWidth}`}
          note={`${queryLength}개 위치가 각각 하나의 질문 vector를 만든다.`}
        />
        <ShapeRow
          label="K · V"
          value={`${batch}×${heads}×${memoryLength}×${headWidth}`}
          note={`${memoryLength}개 memory 위치가 주소 K와 내용 V를 제공한다.`}
        />
        <ShapeRow
          label="QKᵀ"
          value={`${batch}×${heads}×${queryLength}×${memoryLength}`}
          note={`${queryLength}개 질문마다 ${memoryLength}개 memory 후보에 점수를 매긴다.`}
        />
        <ShapeRow
          label="HEAD OUT"
          value={`${batch}×${heads}×${queryLength}×${headWidth}`}
          note="Score의 마지막 축으로 V를 가중합하므로 query 위치 수는 보존된다."
        />
        <ShapeRow
          label="CONCAT"
          value={`${batch}×${queryLength}×512`}
          note="8개 head의 64차원 출력을 붙여 원래 d_model=512로 되돌린다."
        />
      </dl>
      {mode.id === 'decoder' && (
        <div className="border-t border-border bg-amber-500/[0.05] p-4 sm:p-6" data-causal-mask-grid>
          <div className="mb-4">
            <p className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
              CAUSAL MASK · 행은 query, 열은 key
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Query 2는 key 1·2만 읽고 미래 key 3부터는 <strong>−∞</strong>를 받는다.
              Softmax 뒤 이 칸의 확률은 0이 된다.
            </p>
          </div>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${targetLength + 1}, minmax(0, 1fr))` }}
            role="grid"
            aria-label={`${targetLength}개 target 위치의 causal attention mask`}
          >
            <span aria-hidden className="aspect-square" />
            {Array.from({ length: targetLength }, (_, column) => (
              <span
                key={`column-${column}`}
                role="columnheader"
                className="flex aspect-square items-center justify-center font-mono text-xs font-bold text-muted-foreground"
              >
                K{column + 1}
              </span>
            ))}
            {Array.from({ length: targetLength }, (_, row) => (
              <div key={`row-${row}`} className="contents">
                <span
                  role="rowheader"
                  className="flex aspect-square items-center justify-center font-mono text-xs font-bold text-muted-foreground"
                >
                  Q{row + 1}
                </span>
                {Array.from({ length: targetLength }, (_, column) => {
                  const allowed = column <= row;
                  return (
                    <span
                      key={`${row}-${column}`}
                      role="gridcell"
                      aria-label={`Query ${row + 1}, key ${column + 1}: ${allowed ? '읽기 허용' : '미래 위치 차단'}`}
                      className={`flex aspect-square items-center justify-center border font-mono text-xs font-black ${
                        allowed
                          ? 'border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-200'
                          : 'border-rose-500/25 bg-rose-500/[0.07] text-rose-700 dark:text-rose-200'
                      }`}
                    >
                      {allowed ? '0' : '−∞'}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-3 border-t border-border bg-muted/20 px-4 py-4 text-sm leading-relaxed sm:px-6">
        <Braces className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p>
          현재 score는 <strong>{mode.score.replace('S', String(sourceLength)).replaceAll('T', String(targetLength))}</strong>.
          {' '}
          {mode.id === 'encoder' && `Encoder의 ${sourceLength}개 질문이 같은 source의 ${sourceLength}개 memory를 읽는다.`}
          {mode.id === 'decoder' && `Decoder의 ${targetLength}개 질문이 미래를 가린 target prefix ${targetLength}개 위치를 읽는다.`}
          {mode.id === 'cross' && `Decoder의 ${targetLength}개 질문이 encoder의 ${sourceLength}개 memory를 읽는다.`}
        </p>
      </div>
    </figure>
  );
}

const evidenceTabs = [
  {
    id: 'table-1',
    label: 'Table 1',
    title: 'Layer complexity 비교',
    icon: Gauge,
    receipts: [
      ['Self-attention', 'O(n²d) · sequential O(1) · path O(1)'],
      ['Recurrent', 'O(nd²) · sequential O(n) · path O(n)'],
      ['Convolutional', 'O(knd²) · sequential O(1) · path O(logₖn)'],
    ],
    supports: '당시 저자 가정에서 recurrence를 제거하면 한 layer 안의 순차 연산 수와 장거리 경로가 짧아진다.',
    limit: '실제 GPU kernel, memory traffic와 n≫d인 상황까지 self-attention이 언제나 빠르다는 benchmark가 아니다.',
  },
  {
    id: 'table-2',
    label: 'Table 2',
    title: 'Translation 결과와 계산량',
    icon: ScanSearch,
    receipts: [
      ['Transformer base', 'WMT14 EN-DE 27.3 BLEU · 3.3×10¹⁸ FLOPs'],
      ['Transformer big', 'EN-DE 28.4 · EN-FR 41.8 BLEU · 2.3×10¹⁹ FLOPs'],
      ['Training hardware', '8× NVIDIA P100 · base 12시간 · big 3.5일'],
    ],
    supports: '제시한 data·optimizer·regularization·decoding recipe에서 convolution이나 recurrence 없이 강한 번역 결과를 냈다.',
    limit: 'Architecture 하나만의 인과효과나 현재 LLM 품질 순위를 증명하지 않는다. BLEU와 FLOP 추정 조건도 함께 읽어야 한다.',
  },
  {
    id: 'table-3',
    label: 'Table 3',
    title: 'EN-DE 개발셋 ablation',
    icon: Boxes,
    receipts: [
      ['Base', 'PPL 4.92 · BLEU 25.8 · 65M parameters'],
      ['Head 수 · dₖ=dᵥ=512/h', '1 head 24.9 · 4 heads 25.5 · 16 heads 25.8 · 32 heads 25.4'],
      ['Position', 'Sinusoidal 25.8 · learned 25.7 BLEU'],
      ['Big', 'PPL 4.33 · BLEU 26.4 · 213M parameters'],
    ],
    supports: '이 한 설정에서는 단일 head가 가장 좋은 multi-head 조건보다 0.9 BLEU 낮았고 learned position도 비슷했다.',
    limit: 'Head 수를 바꿀 때 총 projection 비용을 맞추려고 dₖ·dᵥ도 512/h로 함께 바뀌었다. Head 수만의 독립 인과효과나 sinusoidal position의 보편적 우월성을 증명하지 않는다.',
  },
] as const;

export function TransformerEvidenceLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const evidence = evidenceTabs[selected];
  const Icon = evidence.icon;

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-transformer-evidence-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
          EVIDENCE LAB · 숫자와 주장 경계
        </p>
        <h3 className="mt-2 text-lg font-bold">논문의 표는 결과뿐 아니라 비교 조건을 함께 고정한다</h3>
      </figcaption>
      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="Transformer 증거 표 선택">
        {evidenceTabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`transformer-mode-${index}`}
            type="button"
            role="tab"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => handleTabs(event, index, evidenceTabs.length, setSelected)}
            className={`min-h-14 bg-background px-3 py-2 text-xs font-bold ${
              selected === index
                ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <motion.div
        key={evidence.id}
        role="tabpanel"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        <div className="flex items-start gap-3 border-y border-border bg-muted/15 px-4 py-4 sm:px-6">
          <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <h4 className="text-sm font-bold">{evidence.title}</h4>
        </div>
        <dl className="divide-y divide-border">
          {evidence.receipts.map(([label, value]) => (
            <div key={label} className="grid gap-1 px-4 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-5 sm:px-6">
              <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
              <dd className="font-mono text-[13px] font-bold leading-relaxed">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
          <div className="bg-emerald-500/[0.06] p-4 sm:p-5">
            <p className="text-[12px] font-bold text-emerald-700 dark:text-emerald-300">지지하는 주장</p>
            <p className="mt-2 text-sm leading-relaxed">{evidence.supports}</p>
          </div>
          <div className="bg-rose-500/[0.05] p-4 sm:p-5">
            <p className="text-[12px] font-bold text-rose-700 dark:text-rose-300">증명하지 않는 것</p>
            <p className="mt-2 text-sm leading-relaxed">{evidence.limit}</p>
          </div>
        </div>
      </motion.div>
    </figure>
  );
}
