import { useState } from 'react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

type PoseSet = 'parallel' | 'diverse';

export default function ZhangConstraintLab() {
  const [poseSet, setPoseSet] = useState<PoseSet>('diverse');
  const [views, setViews] = useState(4);
  const [noise, setNoise] = useState(0.5);
  const independentRank = poseSet === 'diverse' ? Math.min(5, 1 + views) : Math.min(3, 2 + Math.floor(views / 6));
  const sigmaRatio = poseSet === 'diverse' ? 4.8 + 2.8 * views / (noise + 0.3) : 1.05 + views * 0.05;
  const initialRms = (poseSet === 'diverse' ? 0.62 : 1.75) + noise * 0.75;
  const refinedRms = (poseSet === 'diverse' ? 0.18 : 0.78) + noise * 0.38;
  const trustworthy = independentRank >= 5 && sigmaRatio >= 12 && refinedRms < 0.7;
  const cards = Array.from({ length: views }, (_, index) => ({
    x: 36 + (index % 4) * 145,
    y: 34 + Math.floor(index / 4) * 104,
    angle: poseSet === 'diverse' ? [-28, 19, -13, 34, -22, 11, 26, -17][index % 8] : [-2, 0, 1, -1, 2, -1, 0, 1][index % 8],
  }));
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">ZHANG CONSTRAINT LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">Pose geometry가 V의 null space와 refinement 시작점을 결정한다</strong>
        <span className={`basis-full text-xs font-black sm:basis-auto ${trustworthy ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{trustworthy ? 'well constrained' : 'weak calibration'}</span>
      </figcaption>
      <div className="flex flex-wrap items-end gap-4 border-b border-border bg-violet-500/[0.025] p-4">
        <SegmentedControl label="pose geometry" options={[{ value: 'parallel', label: '평행 views' }, { value: 'diverse', label: '다축 tilt' }]} value={poseSet} onChange={setPoseSet} />
        <label className="min-w-40 flex-1 text-xs font-semibold text-muted-foreground">views · {views}<input className="mt-3 block w-full accent-violet-700" type="range" min="2" max="8" value={views} onChange={(event) => setViews(Number(event.target.value))} /></label>
        <label className="min-w-40 flex-1 text-xs font-semibold text-muted-foreground">corner noise · {noise.toFixed(1)} px<input className="mt-3 block w-full accent-amber-700" type="range" min="0.1" max="1.5" step="0.1" value={noise} onChange={(event) => setNoise(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox={`0 0 340 ${Math.ceil(views / 2) * 112 + 12}`} className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 Zhang planar calibration pose constraints">
          {cards.map((card, index) => {
            const x = 22 + (index % 2) * 176;
            const y = 14 + Math.floor(index / 2) * 112;
            return <g key={index} transform={`translate(${x} ${y}) rotate(${card.angle} 60 32)`}>
              <rect width="120" height="64" rx="4" fill="#7c3aed" fillOpacity="0.025" stroke={poseSet === 'diverse' ? '#7c3aed' : '#94a3b8'} strokeWidth="2" />
              {Array.from({ length: 6 }, (_, column) => <line key={`v${column}`} x1={10 + column * 20} y1="7" x2={10 + column * 20} y2="57" stroke="currentColor" strokeOpacity="0.14" />)}
              {Array.from({ length: 3 }, (_, row) => <line key={`h${row}`} x1="10" y1={10 + row * 21} x2="110" y2={10 + row * 21} stroke="currentColor" strokeOpacity="0.14" />)}
            </g>;
          })}
        </svg>
        <svg viewBox="0 0 620 250" className="hidden h-auto w-full sm:block" role="img" aria-label="Zhang planar calibration pose constraints">
          {cards.map((card, index) => <g key={index} transform={`translate(${card.x} ${card.y}) rotate(${card.angle} 52 33)`}>
            <rect width="104" height="66" rx="4" fill="#7c3aed" fillOpacity="0.025" stroke={poseSet === 'diverse' ? '#7c3aed' : '#94a3b8'} strokeWidth="1.7" />
            {Array.from({ length: 5 }, (_, column) => <line key={`v${column}`} x1={12 + column * 20} y1="8" x2={12 + column * 20} y2="58" stroke="currentColor" strokeOpacity="0.12" />)}
            {Array.from({ length: 3 }, (_, row) => <line key={`h${row}`} x1="12" y1={8 + row * 22} x2="92" y2={8 + row * 22} stroke="currentColor" strokeOpacity="0.12" />)}
          </g>)}
          <text x="34" y="238" fontSize="11" fill="currentColor" opacity="0.58">tilt가 바뀌면 h₁·h₂가 K에 주는 constraint direction도 바뀐다</text>
        </svg>
        <p className="mb-3 mt-2 text-xs leading-relaxed text-muted-foreground sm:hidden">Tilt 축이 달라질 때마다 h₁·h₂가 K에 주는 제약 방향도 달라져 V의 null space가 더 분명해진다.</p>
        <MetricGrid mobileColumns={2} items={[
          { label: 'rank(V)', value: `${independentRank} / 5`, note: 'b는 scale 제외 5 DoF' },
          { label: 'null-gap proxy', value: sigmaRatio.toFixed(1), note: '높을수록 분리' },
          { label: 'closed-form RMS', value: `${initialRms.toFixed(2)} px` },
          { label: 'refined RMS', value: `${refinedRms.toFixed(2)} px`, accent: refinedRms >= 0.7 },
        ]} />
      </div>
    </figure>
  );
}
