import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, Check, CircleDot, GitBranch, ScanSearch } from 'lucide-react';

type Channel = 'token' | 'syntax' | 'copy';
type Matrix = readonly (readonly number[])[];

const channels: Record<Channel, {
  label: string;
  written: string;
  read: string;
  writeMatrix: Matrix;
  readMatrix: Matrix;
  note: string;
}> = {
  token: {
    label: '현재 token',
    written: 'Embedding이 token identity를 쓴다',
    read: '다음 head가 query를 만든다',
    writeMatrix: [
      [0.9, 0.1],
      [0.2, 0.7],
      [0.1, 0.2],
    ],
    readMatrix: [
      [0.8, 0.1, 0],
      [0.1, 0.8, 0.1],
    ],
    note: '같은 residual vector라도 어느 write/read 행렬을 곱하느냐에 따라 보이는 연결이 달라진다.',
  },
  syntax: {
    label: '문장 역할',
    written: '앞 layer가 문장 역할 방향을 쓴다',
    read: '뒤 MLP가 분류 근거로 읽는다',
    writeMatrix: [
      [0.7, 0.1],
      [0.1, 0.2],
      [0.6, 0.2],
    ],
    readMatrix: [
      [0.1, 0.7, 0.1],
      [0.2, 0.1, 0.5],
    ],
    note: 'Write가 남긴 방향과 read가 찾는 방향이 어긋나면, 둘의 weight가 커도 end-to-end coupling은 약해진다.',
  },
  copy: {
    label: '복사 후보',
    written: '이전 head가 source token 정보를 쓴다',
    read: '뒤 head의 key projection이 읽는다',
    writeMatrix: [
      [0.9, 0],
      [0.1, 0.8],
      [0, 0.2],
    ],
    readMatrix: [
      [0.9, 0.1, 0],
      [0, 0.8, 0.2],
    ],
    note: '뒤 head가 앞 head의 출력을 key로 읽으면 K-composition 경로가 생긴다.',
  },
};

function multiply(left: Matrix, right: Matrix) {
  return left.map((row) => (
    right[0].map((_, columnIndex) => (
      row.reduce((sum, value, index) => sum + value * right[index][columnIndex], 0)
    ))
  ));
}

function frobeniusNorm(matrix: Matrix) {
  return Math.sqrt(matrix.flat().reduce((sum, value) => sum + value ** 2, 0));
}

function MatrixGrid({ matrix, label }: { matrix: Matrix; label: string }) {
  const columns = matrix[0]?.length ?? 1;

  return (
    <div>
      <p className="mb-2 text-center font-mono text-xs font-bold text-muted-foreground">{label}</p>
      <div
        className="mx-auto grid w-fit gap-1 rounded-md border border-border bg-muted/25 p-1.5"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(2.25rem, 1fr))` }}
        aria-label={`${label} 행렬`}
      >
        {matrix.flatMap((row, rowIndex) => row.map((value, columnIndex) => (
          <span
            key={`${rowIndex}-${columnIndex}`}
            className="flex h-8 min-w-9 items-center justify-center bg-background px-1 font-mono text-xs font-bold tabular-nums"
          >
            {value.toFixed(2)}
          </span>
        )))}
      </div>
    </div>
  );
}

export function VirtualWeightLab() {
  const [channel, setChannel] = useState<Channel>('copy');
  const selected = channels[channel];
  const product = useMemo(
    () => multiply(selected.readMatrix, selected.writeMatrix),
    [selected],
  );
  const coupling = Math.round(
    (frobeniusNorm(product)
      / (frobeniusNorm(selected.readMatrix) * frobeniusNorm(selected.writeMatrix))) * 100,
  );

  return (
    <figure data-transformer-circuit-virtual className="not-prose my-8 scroll-mt-24 border-y border-border">
      <header className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Virtual weight lab · 교육용 방향</p>
          <p className="mt-1 text-sm font-bold">Residual stream 사이의 암묵적 연결을 펼쳐 본다</p>
        </div>
        <div className="grid grid-cols-3 gap-1" role="group" aria-label="Residual stream channel">
          {(Object.keys(channels) as Channel[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={channel === key}
              onClick={() => setChannel(key)}
              className={`min-h-11 rounded-md border px-2 text-xs font-bold sm:px-3 ${channel === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'}`}
            >
              {channels[key].label}
            </button>
          ))}
        </div>
      </header>
      <div className="grid gap-px border border-border bg-border lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-xs font-semibold text-muted-foreground">앞 component · write</p>
          <p className="mt-2 text-sm font-bold leading-relaxed">{selected.written}</p>
          <p className="mt-4 font-mono text-xs text-blue-700 dark:text-blue-300">W_O · output → residual</p>
        </div>
        <div className="flex min-h-12 items-center justify-center bg-background text-muted-foreground">
          <ArrowDown className="size-4 lg:hidden" aria-hidden="true" />
          <ArrowRight className="hidden size-4 lg:block" aria-hidden="true" />
        </div>
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-xs font-semibold text-muted-foreground">뒤 component · read</p>
          <p className="mt-2 text-sm font-bold leading-relaxed">{selected.read}</p>
          <p className="mt-4 font-mono text-xs text-emerald-700 dark:text-emerald-300">W_I · residual → input</p>
        </div>
      </div>
      <div className="grid gap-5 py-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <MatrixGrid matrix={selected.readMatrix} label="W_I · read" />
        <span className="text-center font-mono text-lg font-black text-muted-foreground" aria-hidden="true">×</span>
        <MatrixGrid matrix={selected.writeMatrix} label="W_O · write" />
        <span className="text-center font-mono text-lg font-black text-muted-foreground" aria-hidden="true">=</span>
        <MatrixGrid matrix={product} label="C = W_I W_O" />
      </div>
      <div className="grid gap-4 border-t border-border py-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center">
        <div aria-live="polite">
          <p className="font-mono text-2xl font-black">{coupling}%</p>
          <p className="mt-1 text-xs text-muted-foreground">행렬곱에서 계산</p>
        </div>
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-emerald-600 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${coupling}%` }} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{selected.note}</p>
        </div>
      </div>
      <figcaption className="pb-5 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">읽는 법.</strong> 위 비율은 미리 적어 둔 점수가 아니다. 표시된 작은 행렬로
        <span className="font-mono"> ‖W_IW_O‖F / (‖W_I‖F‖W_O‖F)</span>를 매번 계산한다. 여기서 Frobenius norm <span className="font-mono">‖·‖F</span>는
        행렬의 모든 원소를 제곱해 더한 뒤 제곱근을 취한 전체 크기다. 행렬곱의 크기는 두 행렬 크기의 곱을 넘지 않는다는 성질을 이용해,
        이 비율을 read와 write가 실제로 이어진 상대 크기로 정규화한다. 실제 모델에서는 이 weight 가설을 activation과 intervention으로 다시 검증해야 한다.
      </figcaption>
    </figure>
  );
}

type CircuitView = 'qk' | 'ov' | 'both';

const tokenRows = [
  { position: '01', token: 'A', qk: 0.04, ov: 'B logit +0.10', ovDelta: 0.1, note: '낮게 보고, 약하게 씀' },
  { position: '02', token: 'B', qk: 0.54, ov: 'B logit +1.7', ovDelta: 1.7, note: '선택과 쓰기가 함께 큼' },
  { position: '03', token: 'X', qk: 0.38, ov: 'B logit +0.02', ovDelta: 0.02, note: '많이 보지만 거의 쓰지 않는 decoy' },
  { position: '04', token: 'A', qk: 0.04, ov: 'B logit −0.10', ovDelta: -0.1, note: '낮게 보고, 반대 방향으로 씀' },
] as const;

export function QkOvCircuitLab() {
  const [view, setView] = useState<CircuitView>('both');
  const [selectedPosition, setSelectedPosition] = useState('03');
  const selectedRow = tokenRows.find((row) => row.position === selectedPosition) ?? tokenRows[0];
  const combinedEffect = selectedRow.qk * selectedRow.ovDelta;

  return (
    <figure data-transformer-circuit-qkov className="not-prose my-8 scroll-mt-24 border-y border-border">
      <header className="grid grid-cols-3 border-x border-border" role="group" aria-label="QK OV circuit view">
        {([
          ['qk', 'QK · 어디'],
          ['ov', 'OV · 무엇'],
          ['both', '결합'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={view === key}
            onClick={() => setView(key)}
            className={`min-h-12 border-b-2 px-2 text-xs font-bold sm:text-sm ${view === key ? 'border-foreground bg-muted/35' : 'border-transparent text-muted-foreground hover:bg-muted/20'}`}
          >
            {label}
          </button>
        ))}
      </header>
      <div className="py-5">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md border border-border px-2 py-1 font-mono">[A]</span>
          <span className="rounded-md border border-border px-2 py-1 font-mono">[B]</span>
          <span className="rounded-md border border-border px-2 py-1 font-mono">[X]</span>
          <span className="rounded-md border border-foreground px-2 py-1 font-mono font-bold">[A] ← 현재 query</span>
        </div>
        <div className="divide-y divide-border border-y border-border" role="group" aria-label="비교할 source position">
          {tokenRows.map((row) => (
            <button
              key={row.position}
              type="button"
              aria-pressed={selectedPosition === row.position}
              onClick={() => setSelectedPosition(row.position)}
              className={`grid w-full min-w-0 gap-3 px-2 py-4 text-left transition-colors motion-reduce:transition-none sm:grid-cols-[3rem_4rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-center ${
                selectedPosition === row.position ? 'bg-muted/45' : 'hover:bg-muted/20'
              }`}
            >
              <p className="font-mono text-xs text-muted-foreground">{row.position}</p>
              <p className="font-mono text-sm font-black">[{row.token}]</p>
              <div className={view === 'ov' ? 'opacity-30' : ''}>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold">QK 선택</span>
                  <span className="font-mono font-bold">{Math.round(row.qk * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-blue-600" style={{ width: `${row.qk * 100}%` }} />
                </div>
              </div>
              <div className={`min-w-0 text-xs font-semibold leading-relaxed ${view === 'qk' ? 'opacity-30' : ''}`}>
                <span className="text-muted-foreground">읽힌 뒤 효과 · </span>{row.ov}
                <span className="mt-1 block font-normal text-muted-foreground">{row.note}</span>
              </div>
            </button>
          ))}
        </div>
        <div
          className="mt-4 grid gap-3 border-l-2 border-amber-500 pl-4 sm:grid-cols-[minmax(0,1fr)_9rem]"
          role="status"
          aria-live="polite"
        >
          <p className="text-xs leading-relaxed text-muted-foreground">
            Position {selectedRow.position}의 결합 기여는 <span className="font-mono font-bold text-foreground">
              attention {selectedRow.qk.toFixed(2)} × OV {selectedRow.ovDelta.toFixed(2)} = {combinedEffect.toFixed(3)}
            </span>이다. QK가 높은 것과 output을 크게 바꾸는 것은 별도 조건이다.
          </p>
          <p className="font-mono text-lg font-black sm:text-right">ΔB {combinedEffect >= 0 ? '+' : ''}{combinedEffect.toFixed(3)}</p>
        </div>
      </div>
      <figcaption className="flex gap-2 pb-5 text-xs leading-relaxed text-muted-foreground">
        <ScanSearch className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" />
        Position 03의 X는 attention 38%를 받지만 B logit 효과는 거의 0이다. 반면 position 02의 B는 QK 선택과 OV write가
        함께 커서 결합 기여가 크다. 각 행을 눌러 attention과 실제 logit 방향의 곱을 비교할 수 있다.
      </figcaption>
    </figure>
  );
}

const inductionSteps = [
  {
    label: '입력',
    owner: '반복 pattern',
    body: '현재 A보다 앞선 문맥에 A 다음 B가 한 번 나타났다.',
    active: ['A₀', 'B₀', 'A₁'],
  },
  {
    label: '이전 token head',
    owner: 'Key-side shift',
    body: '앞 layer가 각 위치에 바로 이전 token 정보를 써서, B₀ 위치의 key 안에 A₀ 정보를 남긴다.',
    active: ['A₀→B₀'],
  },
  {
    label: 'Induction QK',
    owner: '같은 token 찾기',
    body: '현재 A₁ query가 “이전 token이 A였던 source”를 찾아 B₀ 위치에 높은 attention을 준다.',
    active: ['A₁⇢B₀'],
  },
  {
    label: 'Induction OV',
    owner: '다음 token 복사',
    body: 'B₀ 위치의 value를 B logit 방향으로 써서 다음 token B의 확률을 올린다.',
    active: ['B logit ↑'],
  },
] as const;

export function InductionTraceLab() {
  const [step, setStep] = useState(0);
  const [previousHeadAblated, setPreviousHeadAblated] = useState(false);
  const selected = inductionSteps[step];
  const qkMatch = previousHeadAblated ? 8 : 86;
  const bLogitGain = previousHeadAblated ? 0.1 : 2.1;
  const tokens = useMemo(() => [
    { id: 'A₀', label: 'A', note: '이전 등장' },
    { id: 'B₀', label: 'B', note: '그 다음 token' },
    { id: 'gap', label: '…', note: '긴 간격' },
    { id: 'A₁', label: 'A', note: '현재 token' },
    { id: 'out', label: 'B', note: '예측' },
  ], []);

  return (
    <figure data-transformer-circuit-induction className="not-prose my-8 scroll-mt-24 border-y border-border">
      <header className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Induction trace</p>
          <p className="mt-1 text-sm font-bold">[A][B] … [A] 다음에 [B]를 복사하는 두-layer 경로</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1" role="group" aria-label="Induction 계산 단계">
            {inductionSteps.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-label={`${index + 1}. ${item.label}`}
                aria-pressed={step === index}
                onClick={() => setStep(index)}
                className={`size-11 rounded-md border text-xs font-bold ${step === index ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={previousHeadAblated}
            onClick={() => setPreviousHeadAblated((current) => !current)}
            className={`min-h-11 rounded-md border px-3 text-xs font-bold ${
              previousHeadAblated
                ? 'border-red-600 bg-red-500/10 text-red-700 dark:text-red-300'
                : 'border-border hover:bg-muted'
            }`}
          >
            Previous-token head {previousHeadAblated ? 'ablated' : 'ON'}
          </button>
        </div>
      </header>
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {tokens.map((token) => {
          const pathIsAvailable = !previousHeadAblated || step === 0;
          const isActive = pathIsAvailable
            && selected.active.some((entry) => entry.includes(token.id) || (token.id === 'out' && entry.includes('logit')));
          return (
            <div key={token.id} className={`min-w-0 border-y-2 px-1 py-4 text-center transition-colors motion-reduce:transition-none ${isActive ? 'border-emerald-600 bg-emerald-500/10' : 'border-border'}`}>
              <p className="font-mono text-base font-black sm:text-xl">{token.label}</p>
              <p className="mt-2 break-words text-xs leading-snug text-muted-foreground">{token.note}</p>
            </div>
          );
        })}
      </div>
      <div className="my-5 grid gap-3 border-l-2 border-emerald-600 pl-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{selected.owner}</p>
          <p className="mt-1 text-sm font-black">{selected.label}</p>
        </div>
        <p className="text-sm leading-relaxed">
          {previousHeadAblated && step > 0
            ? 'Previous-token head의 output을 0으로 만들었다. B₀ key에 A₀ 정보가 기록되지 않아 뒤 induction head가 같은 token 주소를 복원하지 못한다.'
            : selected.body}
        </p>
      </div>
      <div
        className="mb-5 grid gap-px border border-border bg-border sm:grid-cols-2"
        role="status"
        aria-live="polite"
      >
        <div className="bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">Induction QK match · A₁ → B₀</p>
          <p className={`mt-2 font-mono text-2xl font-black ${previousHeadAblated ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
            {qkMatch}%
          </p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">다음 token B logit</p>
          <p className={`mt-2 font-mono text-2xl font-black ${previousHeadAblated ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
            +{bLogitGain.toFixed(1)}
          </p>
        </div>
      </div>
      <figcaption className="flex gap-2 pb-5 text-xs leading-relaxed text-muted-foreground">
        {!previousHeadAblated && step === 3 ? <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" /> : step === 1 ? <GitBranch className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" /> : <CircleDot className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
        눈에 보이는 induction head의 attention만 보면 첫 layer의 previous-token head를 놓친다. 위 ablation은 앞 head를 끄면
        key-side 주소와 B logit이 함께 붕괴함을 보여 준다. 이 toy 수치는 인과 경로의 차이를 설명하며 실제 model effect size를 주장하지 않는다.
      </figcaption>
    </figure>
  );
}
