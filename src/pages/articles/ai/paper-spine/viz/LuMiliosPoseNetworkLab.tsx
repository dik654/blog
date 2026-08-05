import { useMemo, useState } from 'react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

type SolveMode = 'incremental' | 'global';

export default function LuMiliosPoseNetworkLab() {
  const [mode, setMode] = useState<SolveMode>('incremental');
  const [loopSigma, setLoopSigma] = useState(.18);
  const [odomSigma, setOdomSigma] = useState(.55);
  const drift = 42;
  const loopInformation = 1 / loopSigma ** 2;
  const odomInformation = 1 / odomSigma ** 2;
  const correctionFraction = mode === 'global' ? loopInformation / (loopInformation + odomInformation * 7) : .08;
  const remainingDrift = drift * (1 - correctionFraction);
  const poses = useMemo(() => Array.from({ length: 8 }, (_, index) => {
    const angle = index / 7 * Math.PI * 1.85;
    const accumulated = index / 7 * remainingDrift;
    return {
      x: 176 + Math.cos(angle) * 83 + accumulated,
      y: 116 + Math.sin(angle) * 78 - accumulated * .2,
    };
  }), [remainingDrift]);
  const consistent = mode === 'global' && remainingDrift < 16;

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">POSE RELATION NETWORK</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">Relation uncertainty를 보존하면 loop conflict를 모든 poses에 나눠 해결할 수 있다</strong>
        <span className={`basis-full text-xs font-black sm:basis-auto ${consistent ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{consistent ? 'global compromise' : `${remainingDrift.toFixed(0)} px inconsistency`}</span>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-violet-500/[0.025] p-4 md:grid-cols-3">
        <SegmentedControl label="registration" options={[{ value: 'incremental', label: '마지막 scan만 수정' }, { value: 'global', label: '모든 poses 동시 solve' }]} value={mode} onChange={setMode} />
        <label className="text-xs font-semibold text-muted-foreground">loop relation σ · {loopSigma.toFixed(2)}<input className="mt-3 block w-full accent-violet-700" type="range" min=".1" max="1" step=".05" value={loopSigma} onChange={(event) => setLoopSigma(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">odometry σ · {odomSigma.toFixed(2)}<input className="mt-3 block w-full accent-blue-700" type="range" min=".15" max="1.2" step=".05" value={odomSigma} onChange={(event) => setOdomSigma(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[1fr_.8fr]">
        <svg viewBox="0 0 380 240" className="mx-auto block h-auto w-full max-w-lg" role="img" aria-label="Lu와 Milios pose relation network의 global solve">
          {poses.slice(0, -1).map((pose, index) => <path key={index} d={`M ${pose.x} ${pose.y} C ${(pose.x + poses[index + 1].x) / 2} ${pose.y} ${(pose.x + poses[index + 1].x) / 2} ${poses[index + 1].y} ${poses[index + 1].x} ${poses[index + 1].y}`} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" opacity=".62" />)}
          <path d={`M ${poses[7].x} ${poses[7].y} Q 178 16 ${poses[0].x} ${poses[0].y}`} fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="7 5" strokeLinecap="round" />
          {poses.map((pose, index) => <g key={index}><circle cx={pose.x} cy={pose.y} r={index === 0 ? 8 : 6} fill={index === 0 ? '#059669' : '#2563eb'} stroke="white" strokeWidth="2" /><text x={pose.x + 8} y={pose.y - 7} fontSize="9" fontWeight="800" fill="currentColor">P{index + 1}</text></g>)}
          <text x="16" y="224" fontSize="10" fontWeight="700" fill="currentColor">파랑 odometry/scan relations · 보라 loop relation · P1 reference</text>
        </svg>
        <div className="flex flex-col justify-center gap-2 text-xs">
          <div className="flex justify-between border-b border-border pb-2"><span>loop information</span><strong className="font-mono">{loopInformation.toFixed(1)}</strong></div>
          <div className="flex justify-between border-b border-border pb-2"><span>one odom information</span><strong className="font-mono">{odomInformation.toFixed(1)}</strong></div>
          <div className="flex justify-between border-b border-border pb-2"><span>distributed correction</span><strong className="font-mono">{(correctionFraction * 100).toFixed(0)}%</strong></div>
          <p className="pt-2 leading-relaxed text-muted-foreground">작은 σ relation은 objective에서 더 단단한 spring처럼 작동한다. 하지만 σ가 작다는 보고가 relation의 data association까지 참으로 만들지는 않는다.</p>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6">
        <MetricGrid mobileColumns={2} items={[
          { label: 'free pose variables', value: '7 × 3', note: 'P1은 reference' },
          { label: 'initial loop gap', value: `${drift} px` },
          { label: 'remaining gap', value: `${remainingDrift.toFixed(1)} px`, accent: !consistent },
          { label: 'repairable frames', value: mode === 'global' ? 'all local scans' : 'last scan only', accent: mode === 'global' },
        ]} />
      </div>
    </figure>
  );
}
