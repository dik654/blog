import { useState } from 'react';
import { SegmentedControl } from '../nlp-shared';

type Mode = 'decode' | 'train';

const decodeSteps = [
  ['Sₜ₋₁', '이전까지 압축한 state'],
  ['xₜ → q,k,v', '현재 token projection'],
  ['read + update', '현재 출력과 Sₜ 계산'],
  ['Sₜ', '다음 token에 넘길 state'],
];

const trainSteps = [
  ['Chunk 0', 'token 1…C'],
  ['Chunk 1', 'token C+1…2C'],
  ['Chunk 2', 'token 2C+1…3C'],
  ['Chunk 3', 'token 3C+1…4C'],
];

export default function LinearAttentionExplorer() {
  const [mode, setMode] = useState<Mode>('decode');

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background" data-linear-execution-explorer>
      <div className="grid gap-5 border-b border-border bg-muted/15 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-black text-blue-700 dark:text-blue-300">EXECUTION FORM · 같은 recurrence, 다른 GPU 경로</p>
          <h3 className="mt-2 text-lg font-bold">Decode는 한 token씩, 학습은 chunk 안을 행렬로</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">고정 크기 state가 곧 학습 전체의 직렬 실행을 뜻하지는 않는다. 수학적으로 recurrence를 풀어 chunk 안의 보조량을 병렬로 만들 수 있는지가 kernel의 핵심이다.</p>
        </div>
        <SegmentedControl
          label="Execution phase"
          options={[{ value: 'decode', label: 'Recurrent decode' }, { value: 'train', label: 'Chunkwise 학습' }]}
          value={mode}
          onChange={setMode}
        />
      </div>

      <div className="p-4 sm:p-6">
        {mode === 'decode' ? <DecodePath /> : <TrainingPath />}
        <div className="mt-6 border-l-2 border-blue-600/40 bg-blue-500/[0.05] p-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">경계:</strong>{' '}
          {mode === 'decode'
            ? 'Sₜ를 알아야 Sₜ₊₁을 만들 수 있으므로 한 sequence의 token dependency는 남는다. 이 대신 과거 token별 KV를 다시 읽지 않는다.'
            : 'Chunk 내부의 local transform과 output은 큰 matrix multiplication으로 묶지만, chunk boundary state는 앞 chunk 결과에 의존한다. 모든 recurrence가 같은 방식으로 완전 병렬화되는 것도 아니다.'}
        </div>
      </div>
    </div>
  );
}

function DecodePath() {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">Token t의 critical path</p>
      <ol className="mt-4 grid gap-2 sm:grid-cols-4">
        {decodeSteps.map(([title, note], index) => (
          <li key={title} className={`relative min-w-0 border p-4 ${index === 2 ? 'border-blue-600/40 bg-blue-500/[0.06]' : 'border-border'}`}>
            <span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
            <p className="mt-2 break-words font-mono text-sm font-black">{title}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
            {index < decodeSteps.length - 1 && <span className="absolute -bottom-[13px] left-1/2 z-10 -translate-x-1/2 bg-background px-1 font-mono text-sm font-black text-muted-foreground sm:-right-[9px] sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0">→</span>}
          </li>
        ))}
      </ol>
      <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-3">
        <ExecutionMetric label="Persistent memory" value="O(Hdₖdᵥ)" note="sequence 길이와 무관" />
        <ExecutionMetric label="새 token work" value="state read/write" note="과거 KV list scan 없음" />
        <ExecutionMetric label="Dependency" value="t → t+1" note="한 sequence 안에서는 순차" />
      </div>
    </div>
  );
}

function TrainingPath() {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">길이 N을 C-token chunk로 나눈 실행</p>
      <ol className="mt-4 grid gap-2 sm:grid-cols-4">
        {trainSteps.map(([title, note], index) => (
          <li key={title} className="relative min-w-0 border border-violet-600/25 bg-violet-500/[0.045] p-4">
            <span className="font-mono text-[10px] font-black text-violet-700/65 dark:text-violet-300/70">PARALLEL LOCAL</span>
            <p className="mt-2 font-mono text-sm font-black">{title}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
            {index < trainSteps.length - 1 && <span className="absolute -bottom-[13px] left-1/2 z-10 -translate-x-1/2 bg-background px-1 font-mono text-sm font-black text-muted-foreground sm:-right-[9px] sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0">→</span>}
          </li>
        ))}
      </ol>
      <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
        <Boundary label="Local transform" note="U,W 또는 scan factor를 chunk별 계산" />
        <Arrow />
        <Boundary label="Boundary recurrence" note="S[0] → S[1] → … 순서 유지" />
        <Arrow />
        <Boundary label="Matrix output" note="chunk 내부 query를 Tensor Core matmul로 처리" />
      </div>
    </div>
  );
}

function ExecutionMetric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="min-w-0 bg-background p-4">
      <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 break-words font-mono text-sm font-black">{value}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function Boundary({ label, note }: { label: string; note: string }) {
  return (
    <div className="min-w-0 border border-border p-4">
      <p className="text-sm font-bold">{label}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function Arrow() {
  return <span className="hidden font-mono text-lg font-black text-muted-foreground sm:block" aria-hidden="true">→</span>;
}
