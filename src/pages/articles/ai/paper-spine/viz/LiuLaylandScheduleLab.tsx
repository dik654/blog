import { useMemo, useState } from 'react';
import { Clock3, Cpu, ShieldCheck } from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

type Policy = 'rm' | 'edf';
type ReleaseMode = 'critical' | 'staggered';

type Task = {
  id: 'A' | 'B' | 'C';
  period: number;
  cost: number;
  offset: number;
  tone: string;
};

type Job = {
  task: Task;
  release: number;
  deadline: number;
  remaining: number;
  completed?: number;
};

function simulate(tasks: Task[], policy: Policy, horizon = 40) {
  const jobs: Job[] = [];
  const trace: Array<string | null> = [];
  const misses: Array<{ id: string; at: number }> = [];
  for (let time = 0; time < horizon; time += 1) {
    tasks.forEach((task) => {
      if (time >= task.offset && (time - task.offset) % task.period === 0) {
        jobs.push({ task, release: time, deadline: time + task.period, remaining: task.cost });
      }
    });
    jobs.forEach((job) => {
      if (job.remaining > 0 && job.deadline <= time && !misses.some((miss) => miss.id === `${job.task.id}-${job.release}`)) {
        misses.push({ id: `${job.task.id}-${job.release}`, at: time });
      }
    });
    const ready = jobs.filter((job) => job.release <= time && job.remaining > 0);
    ready.sort((left, right) => {
      if (policy === 'rm') return left.task.period - right.task.period || left.release - right.release;
      return left.deadline - right.deadline || left.release - right.release;
    });
    const selected = ready[0];
    trace.push(selected?.task.id ?? null);
    if (selected) {
      selected.remaining -= 1;
      if (selected.remaining === 0) selected.completed = time + 1;
    }
  }
  jobs.forEach((job) => {
    if (job.remaining > 0 && job.deadline <= horizon && !misses.some((miss) => miss.id === `${job.task.id}-${job.release}`)) misses.push({ id: `${job.task.id}-${job.release}`, at: horizon });
  });
  const responses = jobs.filter((job) => job.completed !== undefined).map((job) => ({ id: job.task.id, value: (job.completed as number) - job.release }));
  const pending = jobs.filter((job) => job.remaining > 0).map((job) => ({ id: `${job.task.id}-${job.release}`, deadline: job.deadline }));
  return { trace, misses, responses, pending };
}

function responseTimeAnalysis(tasks: Task[]) {
  const ordered = [...tasks].sort((left, right) => left.period - right.period);
  return ordered.map((task, index) => {
    const higher = ordered.slice(0, index);
    const iterations = [task.cost];
    for (let step = 0; step < 24; step += 1) {
      const current = iterations[iterations.length - 1];
      const next = task.cost + higher.reduce((sum, item) => sum + Math.ceil(current / item.period) * item.cost, 0);
      iterations.push(next);
      if (next === current || next > task.period) break;
    }
    const response = iterations[iterations.length - 1];
    return { id: task.id, period: task.period, response, iterations, pass: response <= task.period };
  });
}

function RangeControl({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>Task C execution</span><span className="font-mono">{value} ms</span></span>
      <span className="flex min-h-11 items-center">
        <input className="h-11 w-full cursor-pointer accent-violet-600" type="range" min={2} max={12} step={1} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      </span>
    </label>
  );
}

function TimelineBand({ tasks, trace, start, end }: { tasks: Task[]; trace: Array<string | null>; start: number; end: number }) {
  const band = trace.slice(start, end);
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-center justify-between font-mono text-[9px] font-bold text-muted-foreground">
        <span>{start} ms</span>
        <span>{end} ms</span>
      </div>
      {tasks.map((task) => (
        <div key={`${task.id}-${start}`} className="grid min-w-0 grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-2">
          <span className="font-mono text-[10px] font-black">{task.id} · T{task.period}</span>
          <div className={`grid h-7 min-w-0 overflow-hidden rounded bg-muted/30 ${end - start === 40 ? 'grid-cols-[repeat(40,minmax(0,1fr))]' : 'grid-cols-[repeat(20,minmax(0,1fr))]'}`}>
            {band.map((running, offset) => {
              const time = start + offset;
              const release = time >= task.offset && (time - task.offset) % task.period === 0;
              const deadline = time > task.offset && (time - task.offset) % task.period === 0;
              return (
                <span
                  key={time}
                  className={`relative border-r border-background/50 ${running === task.id ? task.tone : ''} ${release ? 'ring-1 ring-inset ring-foreground/45' : ''} ${deadline ? 'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-amber-500' : ''}`}
                  title={`${time}-${time + 1} ms${release ? ' · release' : ''}${deadline ? ' · deadline boundary' : ''}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LiuLaylandScheduleLab() {
  const [policy, setPolicy] = useState<Policy>('rm');
  const [releaseMode, setReleaseMode] = useState<ReleaseMode>('critical');
  const [costC, setCostC] = useState(7);
  const tasks = useMemo<Task[]>(() => [
    { id: 'A', period: 5, cost: 1, offset: 0, tone: 'bg-blue-500' },
    { id: 'B', period: 8, cost: 2, offset: releaseMode === 'critical' ? 0 : 2, tone: 'bg-teal-500' },
    { id: 'C', period: 20, cost: costC, offset: releaseMode === 'critical' ? 0 : 4, tone: 'bg-violet-500' },
  ], [costC, releaseMode]);
  const result = useMemo(() => simulate(tasks, policy), [tasks, policy]);
  const responseAnalysis = useMemo(() => responseTimeAnalysis(tasks), [tasks]);
  const utilization = tasks.reduce((sum, task) => sum + task.cost / task.period, 0);
  const rmBound = tasks.length * (2 ** (1 / tasks.length) - 1);
  const theoremPass = policy === 'rm' ? utilization <= rmBound : utilization <= 1;
  const exactRmPass = responseAnalysis.every((task) => task.pass);
  const tracePass = result.misses.length === 0;
  const responseC = result.responses.filter((response) => response.id === 'C').reduce((max, response) => Math.max(max, response.value), 0);
  const responseCAnalysis = responseAnalysis.find((task) => task.id === 'C');
  const status = policy === 'edf'
    ? theoremPass ? 'EDF THEOREM · FEASIBLE' : 'EDF THEOREM · INFEASIBLE'
    : theoremPass ? 'RM UNIVERSAL CERTIFICATE' : exactRmPass ? 'BOUND INCONCLUSIVE · EXACT PASS' : 'EXACT RESPONSE · DEADLINE MISS';

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 border-b border-border py-4 pl-4 pr-16 sm:pl-6 sm:pr-20">
        <span className="shrink-0 font-mono text-xs font-black text-violet-700 dark:text-violet-300">PAPER LAB · JACM 1973</span>
        <strong className="min-w-[13rem] flex-1 text-sm leading-snug">Critical instant, RM bound와 deadline-driven schedule</strong>
        <span className={`basis-full text-xs font-black ${tracePass ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{status}</span>
      </figcaption>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Priority assignment" value={policy} onChange={setPolicy} options={[
            { value: 'rm', label: 'Rate monotonic' },
            { value: 'edf', label: 'Deadline driven' },
          ]} />
          <SegmentedControl label={policy === 'rm' ? 'Release pattern · RM critical-instant 비교' : 'Release pattern · finite trace 비교'} value={releaseMode} onChange={setReleaseMode} options={[
            { value: 'critical', label: 'Simultaneous' },
            { value: 'staggered', label: 'Staggered' },
          ]} />
          <RangeControl value={costC} onChange={setCostC} />
          <div className="rounded-md border border-border p-3">
            <p className="flex items-center gap-2 text-xs font-black"><Cpu className="h-4 w-4 text-violet-600" />1973 theorem input</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Single preemptive CPU · independent periodic tasks · D=T · constant/max execution · no ordinary aperiodic hard-deadline work.</p>
          </div>
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-muted-foreground"><span>0-40 ms educational schedule</span><span className="font-mono">1 cell = 1 ms</span></div>
          <div className="mt-4 space-y-4 sm:hidden">
            <TimelineBand tasks={tasks} trace={result.trace} start={0} end={20} />
            <TimelineBand tasks={tasks} trace={result.trace} start={20} end={40} />
          </div>
          <div className="mt-4 hidden sm:block">
            <TimelineBand tasks={tasks} trace={result.trace} start={0} end={40} />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {tasks.map((task) => <div key={task.id} className="rounded-md border border-border p-3"><span className={`block h-1 w-7 rounded ${task.tone}`} /><p className="mt-2 text-xs font-black">Task {task.id}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">C/T = {task.cost}/{task.period}</p></div>)}
          </div>
          {policy === 'rm' && responseCAnalysis && (
            <div className="mt-4 border-y border-border py-3">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Task C exact response · critical instant</p>
              <p className="mt-2 break-words font-mono text-sm font-black [overflow-wrap:anywhere]">{responseCAnalysis.iterations.join(' → ')} ms</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">천장함수로 A·B의 반복 간섭을 다시 세며, 값이 고정되면 C의 응답 시간이 됩니다.</p>
            </div>
          )}
          <div className="mt-4 flex items-start gap-3 rounded-md border border-border bg-muted/[0.12] p-3">{tracePass ? <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />}<p className="text-xs leading-relaxed text-muted-foreground">{policy === 'edf' && theoremPass ? '원 논문의 독립 periodic, D=T, preemptive single-CPU 가정에서는 U≤1이 필요충분조건입니다.' : policy === 'rm' && theoremPass ? 'RM universal sufficient bound만으로 이 task set을 보장합니다.' : policy === 'rm' && exactRmPass ? 'RM bound 초과는 실패가 아닙니다. Task별 response-time 반복은 통과하지만 아래 finite trace만으로 무한 실행을 증명하지는 않습니다.' : tracePass ? '이 40 ms 구간에서는 miss를 관찰하지 않았습니다. 정리나 exact 분석을 대신하지 않습니다.' : `이 release trace에서 ${result.misses[0]?.id}가 deadline을 놓칩니다.`} {result.pending.length > 0 && `Horizon 끝에 ${result.pending.length}개 job이 아직 미종결입니다.`}</p></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Utilization', value: `${(utilization * 100).toFixed(1)}%` },
        { label: 'Theorem threshold', value: policy === 'rm' ? `${(rmBound * 100).toFixed(1)}%` : '100%' },
        { label: policy === 'rm' ? 'Exact C response' : 'Observed C response', value: `${policy === 'rm' ? responseCAnalysis?.response ?? 'N/A' : responseC || 'N/A'} ms` },
        { label: 'Finite trace', value: tracePass ? `NO MISS · ${result.pending.length} OPEN` : 'MISS', accent: tracePass && result.pending.length === 0 },
      ]} /></div>
    </figure>
  );
}
