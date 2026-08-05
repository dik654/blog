import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Boxes,
  Braces,
  Bug,
  Gauge,
  MemoryStick,
  Network,
  Route,
  ScanSearch,
  SlidersHorizontal,
} from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

const lengthOptions = [10, 17, 32] as const;
const blockOptions = [4, 8, 16] as const;

function SegmentControl<T extends number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[11px] font-bold text-muted-foreground">{label}</legend>
      <div className="grid grid-cols-3 gap-1 rounded-md border border-border bg-muted/30 p-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`min-h-11 rounded px-2 font-mono text-xs font-bold transition-colors ${
              value === option
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function TritonProgramMappingLab() {
  const [length, setLength] = useState<(typeof lengthOptions)[number]>(17);
  const [blockSize, setBlockSize] = useState<(typeof blockOptions)[number]>(8);
  const programs = useMemo(() => {
    const count = Math.ceil(length / blockSize);
    return Array.from({ length: count }, (_, pid) => ({
      pid,
      lanes: Array.from({ length: blockSize }, (_, lane) => {
        const offset = pid * blockSize + lane;
        return { lane, offset, valid: offset < length };
      }),
    }));
  }, [blockSize, length]);
  const padded = programs.length * blockSize;
  const masked = padded - length;

  return (
    <section
      className="not-prose my-10 overflow-hidden rounded-lg border border-border bg-card"
      data-triton-program-lab
      data-length={length}
      data-block-size={blockSize}
      data-program-count={programs.length}
      data-masked-count={masked}
    >
      <header className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:px-5">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
            INTERACTIVE · PROGRAM MAPPING
          </p>
          <h3 className="mt-1 text-base font-bold">한 Program이 처리할 Offset 묶음을 만든다</h3>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            원소 수가 block 배수가 아닐 때도 grid는 올림한다. 마지막 program의 범위 밖 주소만 mask로 끈다.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-right">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground">PROGRAM</p>
            <p className="mt-1 font-mono text-xl font-black">{programs.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground">MASKED</p>
            <p className="mt-1 font-mono text-xl font-black">{masked}</p>
          </div>
        </div>
      </header>

      <div className="grid min-w-0 gap-6 p-4 sm:p-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="space-y-4">
          <SegmentControl label="입력 원소 N" value={length} options={lengthOptions} onChange={setLength} />
          <SegmentControl label="BLOCK_SIZE B" value={blockSize} options={blockOptions} onChange={setBlockSize} />
          <dl className="border-y border-border py-3 text-xs">
            <div className="flex items-center justify-between gap-4 py-1">
              <dt className="text-muted-foreground">grid</dt>
              <dd className="font-mono font-bold">cdiv({length}, {blockSize}) = {programs.length}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-1">
              <dt className="text-muted-foreground">할당 slot</dt>
              <dd className="font-mono font-bold">{padded}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-1">
              <dt className="text-muted-foreground">유효 원소</dt>
              <dd className="font-mono font-bold">{length}</dd>
            </div>
          </dl>
        </div>

        <div className="min-w-0 space-y-3" aria-label="Triton program offset mapping">
          {programs.map((program) => (
            <motion.div
              layout
              key={`${blockSize}-${program.pid}`}
              className="grid min-w-0 gap-3 border-t border-border pt-3 first:border-t-0 first:pt-0 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
              data-program-id={program.pid}
            >
              <div className="flex items-center justify-between sm:block">
                <p className="font-mono text-[10px] font-bold text-muted-foreground">PROGRAM</p>
                <p className="mt-1 font-mono text-lg font-black">pid {program.pid}</p>
              </div>
              <div className="grid min-w-0 grid-cols-4 gap-1 sm:grid-cols-8">
                {program.lanes.map((lane) => (
                  <motion.div
                    layout
                    key={lane.lane}
                    title={lane.valid ? `offset ${lane.offset}: load/store` : `offset ${lane.offset}: mask`}
                    className={`flex min-h-11 min-w-0 flex-col items-center justify-center rounded border px-1 ${
                      lane.valid
                        ? 'border-cyan-600/35 bg-cyan-500/10 text-cyan-950 dark:text-cyan-100'
                        : 'border-dashed border-rose-500/45 bg-rose-500/[0.06] text-rose-700 dark:text-rose-300'
                    }`}
                    data-offset={lane.offset}
                    data-valid={String(lane.valid)}
                  >
                    <span className="font-mono text-[9px] opacity-65">i</span>
                    <strong className="font-mono text-xs">{lane.offset}</strong>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-500/40" />
              <span><strong className="text-foreground">i &lt; N</strong> · 실제 load/store</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-rose-500" />
              <span><strong className="text-foreground">i ≥ N</strong> · memory 접근 차단</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Node({
  icon: Icon,
  eyebrow,
  title,
  body,
  tone = 'text-foreground',
}: {
  icon: typeof Boxes;
  eyebrow: string;
  title: string;
  body: string;
  tone?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-w-0 border-t border-border pt-4"
    >
      <Icon className={`h-5 w-5 ${tone}`} aria-hidden="true" />
      <p className="mt-4 font-mono text-[10px] font-bold text-muted-foreground">{eyebrow}</p>
      <p className="mt-1 text-sm font-bold">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  );
}

function TritonKernelScene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="w-full">
        <p className="mb-6 text-center text-sm font-bold">Triton program은 CUDA thread 하나가 아니다</p>
        <div className="grid gap-5 sm:grid-cols-3">
          <Node icon={Network} eyebrow="GRID" title="Program instance 여러 개" body="Host가 문제 크기와 meta-parameter로 grid 수를 정한다." tone="text-cyan-700 dark:text-cyan-300" />
          <Node icon={Route} eyebrow="PROGRAM_ID" title="내 block 좌표" body="각 instance는 같은 함수를 실행하지만 서로 다른 pid를 받는다." tone="text-violet-700 dark:text-violet-300" />
          <Node icon={Boxes} eyebrow="BLOCK TENSOR" title="원소 묶음 연산" body="tl.arange, load, dot, reduce는 scalar thread가 아니라 block tensor를 대상으로 표현한다." tone="text-emerald-700 dark:text-emerald-300" />
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="w-full">
        <p className="mb-6 text-center text-sm font-bold">주소 계산과 유효성 증명을 분리한다</p>
        <div className="grid gap-5 sm:grid-cols-3">
          <Node icon={Braces} eyebrow="OFFSETS" title="pid · B + arange" body="논리 index 묶음을 만든다. 아직 memory를 읽지 않는다." tone="text-cyan-700 dark:text-cyan-300" />
          <Node icon={ScanSearch} eyebrow="MASK / BOUNDARY" title="범위 밖 lane 끄기" body="불규칙 shape의 마지막 block과 padding 영역을 memory 연산에서 제외한다." tone="text-amber-700 dark:text-amber-300" />
          <Node icon={MemoryStick} eyebrow="LOAD / STORE" title="Pointer + stride" body="논리 좌표를 실제 주소로 바꾼 뒤 유효 lane만 DRAM과 주고받는다." tone="text-rose-700 dark:text-rose-300" />
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="w-full">
        <p className="mb-6 text-center text-sm font-bold">Fusion은 연산 수보다 중간 왕복을 줄인다</p>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] sm:items-center">
          <div className="border-t border-rose-500/50 pt-4">
            <p className="font-mono text-[10px] font-bold text-rose-700 dark:text-rose-300">UNFUSED</p>
            <p className="mt-2 text-sm font-bold">max → subtract → exp → sum → divide</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">각 단계가 큰 중간 tensor를 HBM에 쓰고 다음 kernel이 다시 읽을 수 있다.</p>
          </div>
          <div className="flex items-center justify-center py-2">
            <span className="font-mono text-[10px] font-black text-muted-foreground">VS</span>
          </div>
          <div className="border-t border-emerald-500/50 pt-4">
            <p className="font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-300">FUSED</p>
            <p className="mt-2 text-sm font-bold">한 row를 load → reduce → store</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">row가 on-chip 자원에 맞는 조건에서 입력 1회 read와 출력 1회 write에 가깝게 만든다.</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    const configs = [
      ['32×32×32', '4 warp', '작은 shape'],
      ['64×64×32', '8 warp', '균형 후보'],
      ['128×64×64', '8 warp', '재사용 증가'],
    ];
    return (
      <div className="w-full">
        <p className="mb-6 text-center text-sm font-bold">Autotune은 후보 생성이 아니라 후보 중 측정 선택이다</p>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {configs.map(([tile, warps, note], index) => (
            <motion.div
              key={tile}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`min-w-0 bg-background p-4 ${index === 1 ? 'outline outline-1 -outline-offset-1 outline-cyan-600' : ''}`}
            >
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 font-mono text-sm font-black">{tile}</p>
              <p className="mt-1 text-xs font-bold">{warps}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">{note}</p>
              {index === 1 && <p className="mt-3 font-mono text-[10px] font-bold text-cyan-700 dark:text-cyan-300">MEASURED WINNER · 이 shape에서만</p>}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="mb-6 text-center text-sm font-bold">빠르다는 결론은 compiler와 profiler 증거를 통과한 뒤에만 낸다</p>
      <div className="grid gap-5 sm:grid-cols-4">
        <Node icon={Braces} eyebrow="FRONTEND" title="Triton language" body="block tensor, pointer, mask와 meta-parameter를 기술한다." tone="text-cyan-700 dark:text-cyan-300" />
        <Node icon={Route} eyebrow="LOWERING" title="Triton IR → LLVM IR" body="layout과 target별 GPU code로 낮아지는 중간 표현을 필요할 때 dump한다." tone="text-violet-700 dark:text-violet-300" />
        <Node icon={Bug} eyebrow="CORRECTNESS" title="Reference · odd shape" body="PyTorch 기준, tail, stride, dtype, NaN과 sanitizer를 검사한다." tone="text-rose-700 dark:text-rose-300" />
        <Node icon={Gauge} eyebrow="PERFORMANCE" title="Warmup · profile" body="동기화, compile 제외, median, bytes·FLOPs와 kernel trace를 함께 본다." tone="text-emerald-700 dark:text-emerald-300" />
      </div>
    </div>
  );
}

export function TritonKernelFlowViz() {
  return (
    <StepViz
      steps={[
        {
          label: 'Grid가 같은 kernel 함수를 여러 Program instance로 실행한다',
          body: 'Program 하나는 CUDA thread 하나가 아니라 block tensor를 계산하는 SPMD instance다.',
        },
        {
          label: 'Program ID로 offset을 만들고 mask 뒤에만 memory 접근을 허용한다',
          body: '올림 grid와 tail mask를 함께 써야 모든 유효 원소를 정확히 한 번 덮는다.',
        },
        {
          label: 'Load·reduce·store를 붙여 중간 tensor의 HBM 왕복을 없앤다',
          body: 'Fusion의 이득은 특정 shape가 on-chip 자원에 맞고 workload가 bandwidth-bound일 때 커진다.',
        },
        {
          label: 'Autotune이 shape key별 후보를 실제 측정해 고른다',
          body: '한 GPU·한 shape의 승자를 모든 입력과 backend의 승자로 일반화하면 안 된다.',
        },
        {
          label: 'Compiler lowering, correctness와 profiler가 출시 계약을 닫는다',
          body: 'IR을 믿는 대신 필요할 때 확인하고, reference·경계 shape·성능 장부를 함께 남긴다.',
        },
      ]}
    >
      {(step) => <TritonKernelScene step={step} />}
    </StepViz>
  );
}
