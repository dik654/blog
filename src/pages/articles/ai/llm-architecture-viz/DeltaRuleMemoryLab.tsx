import { useState } from 'react';
import { SegmentedControl } from '../nlp-shared';

type UpdateMode = 'additive' | 'delta';
type WriteStep = 1 | 2;
type Matrix = [[number, number], [number, number]];

const matrices: Record<UpdateMode, Record<WriteStep, Matrix>> = {
  additive: {
    1: [[1, 0], [0, 0]],
    2: [[1, 0], [1, 0]],
  },
  delta: {
    1: [[1, 0], [0, 0]],
    2: [[0, 0], [1, 0]],
  },
};

const ages = [0, 10, 20] as const;

export default function DeltaRuleMemoryLab() {
  const [mode, setMode] = useState<UpdateMode>('delta');
  const [step, setStep] = useState<WriteStep>(2);
  const [age, setAge] = useState<(typeof ages)[number]>(10);
  const matrix = matrices[mode][step];
  const read = [matrix[0][0], matrix[1][0]];
  const retention = 0.8 ** age;

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background" data-delta-rule-lab>
      <div className="grid gap-5 border-b border-border bg-muted/15 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black text-violet-700 dark:text-violet-300">WRITE LAB · 같은 key에 새 value 쓰기</p>
          <h3 className="mt-2 text-lg font-bold">더하기는 겹치고, delta rule은 예측 오차만 고친다</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Key는 계속 <span className="font-mono text-foreground">k=(1,0)</span>이다. 첫 value를 쓴 뒤 같은 key에 다른 value를 쓰면 state와 read 결과가 어떻게 달라지는지 확인한다.</p>
        </div>
        <SegmentedControl
          label="Memory update"
          options={[{ value: 'additive', label: '단순 더하기' }, { value: 'delta', label: 'Delta rule' }]}
          value={mode}
          onChange={setMode}
        />
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Write step">
          <StepButton active={step === 1} onClick={() => setStep(1)} order="01" value="v=(1,0)" note="처음 association 기록" />
          <StepButton active={step === 2} onClick={() => setStep(2)} order="02" value="v=(0,1)" note="같은 key를 새 value로 갱신" />
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:items-center">
          <div className="min-w-0 border border-border p-4">
            <p className="text-xs font-bold text-muted-foreground">State matrix · S</p>
            <div className="mx-auto mt-4 grid w-full max-w-[13rem] grid-cols-2 gap-2" aria-label="2 by 2 state matrix">
              {matrix.flatMap((row, rowIndex) => row.map((value, columnIndex) => (
                <div key={`${rowIndex}-${columnIndex}`} className={`grid aspect-square place-items-center border font-mono text-xl font-black ${value === 0 ? 'border-border bg-muted/25 text-muted-foreground' : 'border-violet-600/35 bg-violet-500/12 text-violet-800 dark:text-violet-200'}`}>
                  {value}
                </div>
              )))}
            </div>
            <p className="mt-4 text-center font-mono text-[11px] text-muted-foreground">rows = value · columns = key</p>
          </div>

          <div className="hidden text-center font-mono text-2xl font-black text-muted-foreground md:block" aria-hidden="true">×k</div>

          <div className="min-w-0 border border-border p-4">
            <p className="text-xs font-bold text-muted-foreground">같은 key를 다시 읽은 결과 · Sk</p>
            <div className="mx-auto mt-4 flex max-w-[13rem] items-center justify-center gap-3">
              <span className="font-mono text-2xl font-black text-muted-foreground">(</span>
              {read.map((value, index) => (
                <span key={index} className={`grid h-14 w-14 place-items-center border font-mono text-xl font-black ${value === 0 ? 'border-border bg-muted/25 text-muted-foreground' : 'border-blue-700/35 bg-blue-600/12 text-blue-800 dark:text-blue-200'}`}>{value}</span>
              ))}
              <span className="font-mono text-2xl font-black text-muted-foreground">)</span>
            </div>
            <p
              className={`mt-4 text-center text-sm font-bold ${step === 2 && mode === 'additive' ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}
              data-read-result={`(${read.join(',')})`}
            >
              {step === 1 ? '첫 value를 정확히 읽음' : mode === 'delta' ? '이전 value를 지우고 새 value로 교정' : '이전 value와 새 value가 겹쳐 collision'}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground">별도의 forget gate · α = 0.8</p>
              <p className="mt-1 text-sm leading-relaxed">새 write가 없을 때 기존 기억이 몇 step 뒤 얼마나 남는지 본다.</p>
            </div>
            <div className="inline-grid grid-cols-3 gap-1 border border-border bg-muted/20 p-1" role="group" aria-label="Elapsed steps">
              {ages.map((value) => (
                <button key={value} type="button" onClick={() => setAge(value)} className={`min-h-9 px-3 text-xs font-bold ${age === value ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:text-foreground'}`}>{value} step</button>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-center">
            <div className="h-3 overflow-hidden bg-muted">
              <span className="block h-full bg-amber-500 transition-[width] duration-500" style={{ width: `${100 * retention}%` }} />
            </div>
            <p className="font-mono text-2xl font-black sm:text-right" data-retention={`${(100 * retention).toFixed(2)}%`}>{(100 * retention).toFixed(2)}%</p>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">α가 작으면 불필요한 기억을 빨리 비우지만, 계속 필요한 정보도 같은 비율로 약해진다. Delta update의 key 방향 수정과 gate의 전체 감쇠는 서로 다른 역할이다.</p>
        </div>
      </div>
    </div>
  );
}

function StepButton({ active, onClick, order, value, note }: { active: boolean; onClick: () => void; order: string; value: string; note: string }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={`min-w-0 border p-4 text-left transition-colors ${active ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:bg-muted/50'}`}>
      <span className={`font-mono text-[10px] font-black ${active ? 'text-background/65' : 'text-muted-foreground'}`}>{order}</span>
      <span className="mt-2 block break-words font-mono text-sm font-black">{value}</span>
      <span className={`mt-1 block text-xs leading-relaxed ${active ? 'text-background/75' : 'text-muted-foreground'}`}>{note}</span>
    </button>
  );
}
