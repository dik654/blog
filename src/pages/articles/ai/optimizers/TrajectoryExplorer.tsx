import { useState } from 'react';
import FormulaNote from '@/components/ui/formula-note';

type Point = [number, number];
type OptimizerKey = 'sgd' | 'momentum' | 'adam';

const settings: Record<OptimizerKey, { label: string; color: string; note: string }> = {
  sgd: { label: 'SGD', color: '#dc2626', note: '가파른 세로축을 가로지르며 진동하고, 평평한 가로축에서는 천천히 전진한다.' },
  momentum: { label: 'Momentum', color: '#2563eb', note: '번갈아 나타나는 세로 gradient는 상쇄하고 일관된 가로 방향은 누적한다.' },
  adam: { label: 'Adam', color: '#059669', note: '좌표별 최근 gradient 규모로 나눠 두 축의 유효 step 크기를 조절한다.' },
};

function gradient([x, y]: Point): Point {
  return [0.1 * x, 3 * y];
}

function makeTrajectory(kind: OptimizerKey): Point[] {
  let point: Point = [-4, 3];
  let velocity: Point = [0, 0];
  let first: Point = [0, 0];
  let second: Point = [0, 0];
  const points: Point[] = [[...point]];

  for (let step = 1; step <= 24; step += 1) {
    const grad = gradient(point);
    if (kind === 'sgd') {
      point = [point[0] - 0.55 * grad[0], point[1] - 0.55 * grad[1]];
    } else if (kind === 'momentum') {
      velocity = [0.78 * velocity[0] + grad[0], 0.78 * velocity[1] + grad[1]];
      point = [point[0] - 0.18 * velocity[0], point[1] - 0.18 * velocity[1]];
    } else {
      first = [0.8 * first[0] + 0.2 * grad[0], 0.8 * first[1] + 0.2 * grad[1]];
      second = [0.9 * second[0] + 0.1 * grad[0] ** 2, 0.9 * second[1] + 0.1 * grad[1] ** 2];
      const correctedFirst: Point = [first[0] / (1 - 0.8 ** step), first[1] / (1 - 0.8 ** step)];
      const correctedSecond: Point = [second[0] / (1 - 0.9 ** step), second[1] / (1 - 0.9 ** step)];
      point = [
        point[0] - (0.42 * correctedFirst[0]) / (globalThis.Math.sqrt(correctedSecond[0]) + 1e-8),
        point[1] - (0.42 * correctedFirst[1]) / (globalThis.Math.sqrt(correctedSecond[1]) + 1e-8),
      ];
    }
    points.push([...point]);
  }
  return points;
}

const trajectories: Record<OptimizerKey, Point[]> = {
  sgd: makeTrajectory('sgd'),
  momentum: makeTrajectory('momentum'),
  adam: makeTrajectory('adam'),
};

function Explorer() {
  const [optimizer, setOptimizer] = useState<OptimizerKey>('sgd');
  const [step, setStep] = useState(12);
  const trajectory = trajectories[optimizer];
  const visible = trajectory.slice(0, step + 1);
  const current = trajectory[step];
  const loss = 0.5 * (0.1 * current[0] ** 2 + 3 * current[1] ** 2);
  const width = 600;
  const height = 360;
  const xScale = (x: number) => 300 + x * 54;
  const yScale = (y: number) => 180 - y * 46;
  const contourOpacities = [0.28, 0.36, 0.44, 0.54, 0.68];

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-3 border-b border-border bg-muted/20" role="tablist" aria-label="optimizer trajectory 선택">
        {(Object.keys(settings) as OptimizerKey[]).map((key) => (
          <button key={key} type="button" role="tab" aria-selected={optimizer === key} onClick={() => setOptimizer(key)} className={`min-h-11 border-b-2 px-2 text-xs font-bold sm:text-sm ${optimizer === key ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>{settings[key].label}</button>
        ))}
      </div>
      <div className="grid min-w-0 gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-center lg:p-6">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={`${settings[optimizer].label}이 좁은 loss surface를 이동하는 경로`}>
          <defs><marker id={`trajectory-arrow-${optimizer}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={settings[optimizer].color} /></marker></defs>
          <rect width={width} height={height} fill="transparent" />
          {[1, 0.78, 0.56, 0.34, 0.14].map((scale, index) => <ellipse key={scale} cx="300" cy="180" rx={245 * scale} ry={135 * scale} fill={index === 4 ? 'color-mix(in oklch, var(--foreground) 2.5%, transparent)' : 'none'} stroke="var(--muted-foreground)" strokeOpacity={contourOpacities[index]} strokeWidth={index === 4 ? 1.5 : 1.1} />)}
          <line x1="30" y1="180" x2="570" y2="180" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="2 6" />
          <line x1="300" y1="25" x2="300" y2="335" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="2 6" />
          <polyline points={visible.map(([x, y]) => `${xScale(x)},${yScale(y)}`).join(' ')} fill="none" stroke={settings[optimizer].color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" markerEnd={`url(#trajectory-arrow-${optimizer})`} />
          {visible.map(([x, y], index) => (index === step || index % 3 === 0) ? <circle key={`${index}-${x}`} cx={xScale(x)} cy={yScale(y)} r={index === step ? 5 : 2.25} fill={settings[optimizer].color} opacity={index === step ? 1 : 0.7} /> : null)}
          <circle cx="300" cy="180" r="5.5" fill="var(--foreground)" />
          <circle cx={xScale(trajectory[0][0])} cy={yScale(trajectory[0][1])} r="6.5" fill="var(--background)" stroke={settings[optimizer].color} strokeWidth="2" />
          <text x={xScale(trajectory[0][0]) + 12} y={yScale(trajectory[0][1]) - 10} fontSize="18" fill="var(--muted-foreground)" fontWeight="700">start</text>
          <text x="310" y="171" fontSize="18" fill="var(--foreground)" fontWeight="700">minimum</text>
          <text x="566" y="197" textAnchor="end" fontSize="17" fill="var(--muted-foreground)">θ₁</text>
          <text x="310" y="35" fontSize="17" fill="var(--muted-foreground)">θ₂</text>
        </svg>
        <div className="min-w-0 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:py-2 lg:pl-5">
          <label htmlFor="optimizer-step" className="text-xs font-semibold text-muted-foreground">표시할 update · {step}/24</label>
          <input id="optimizer-step" type="range" min="0" max="24" step="1" value={step} onChange={(event) => setStep(Number(event.target.value))} className="mt-3 w-full accent-foreground" />
          <dl className="mt-5 grid grid-cols-3 gap-4 lg:grid-cols-1">
            <div className="min-w-0 border-l-2 pl-3" style={{ borderColor: settings[optimizer].color }}><dt className="text-xs text-muted-foreground">θ₁</dt><dd className="mt-1 font-mono text-sm font-bold">{current[0].toFixed(2)}</dd></div>
            <div className="min-w-0 border-l-2 pl-3" style={{ borderColor: settings[optimizer].color }}><dt className="text-xs text-muted-foreground">θ₂</dt><dd className="mt-1 font-mono text-sm font-bold">{current[1].toFixed(2)}</dd></div>
            <div className="min-w-0 border-l-2 pl-3" style={{ borderColor: settings[optimizer].color }}><dt className="text-xs text-muted-foreground">loss</dt><dd className="mt-1 font-mono text-sm font-bold">{loss.toFixed(3)}</dd></div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{settings[optimizer].note}</p>
        </div>
      </div>
    </div>
  );
}

export default function TrajectoryExplorer() {
  return (
    <section id="sgd" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 loss surface에서 경로는 어떻게 달라질까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          아래 등고선은 세로축이 가파르고 가로축이 평평한 2차 함수다. 세 optimizer는 같은 시작점과 같은 gradient를 보지만
          gradient를 update로 바꾸는 규칙이 다르다. 탭을 바꾸고 step을 앞뒤로 움직여 경로의 진동과 진행 속도를 비교해 보자.
        </p>
      </div>
      <Explorer />
      <FormulaNote
        meaning="이 장면은 optimizer의 전형적 동작을 분리해 보여 주는 2차 함수 예시다. 실제 neural network는 surface가 계속 달라지고 mini-batch noise도 있으므로 특정 optimizer가 언제나 더 짧은 경로를 보장하지 않는다."
        symbols={[
          ['등고선', '같은 loss 값을 갖는 파라미터 위치들을 이은 선'],
          ['좁은 골짜기', '축마다 곡률과 gradient 크기가 크게 다른 영역'],
          ['trajectory', '연속된 optimizer step이 만든 파라미터 위치의 경로'],
          ['minimum', '이 예시에서 gradient가 0이 되는 θ=(0,0)'],
        ]}
      />
    </section>
  );
}
