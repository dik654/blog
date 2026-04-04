import { useState } from 'react';
import { steps, actorColor, SVG_ACTORS, ARROW_MARKERS, type Step } from './AttestationVizData';

export default function AttestationViz() {
  const [active, setActive] = useState<Step>(0);

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      <h3 className="font-semibold text-foreground">원격 증명 흐름 (단계별)</h3>

      {/* Step buttons */}
      <div className="flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i as Step)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              active === i
                ? 'bg-primary text-primary-foreground border-primary'
                : 'text-foreground/60 border-border hover:border-foreground/30'
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* Diagram */}
      <svg viewBox="0 0 560 160" className="w-full rounded-lg">
        {SVG_ACTORS.map(({ x, label, color }) => (
          <g key={label}>
            <rect x={x - 40} y={8} width={80} height={28} rx={6}
              fill={color + '20'} stroke={color + '60'} strokeWidth={1} />
            <text x={x} y={26} textAnchor="middle" fontSize={11} fill={color} fontWeight={600}>{label}</text>
            <line x1={x} y1={36} x2={x} y2={155} stroke={color + '30'} strokeWidth={1} strokeDasharray="4,3" />
          </g>
        ))}

        {active === 0 && <g><line x1={60} y1={100} x2={220} y2={100} stroke="#6366f1" strokeWidth={1.5} markerEnd="url(#arr-i)" /><rect x={100} y={86} width={80} height={12} rx={2} fill="var(--card)" /><text x={140} y={95} textAnchor="middle" fontSize={10} fill="#6366f1">nonce (64B)</text></g>}
        {active === 1 && <g><line x1={220} y1={100} x2={380} y2={100} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#arr-e)" /><rect x={245} y={86} width={110} height={12} rx={2} fill="var(--card)" /><text x={300} y={95} textAnchor="middle" fontSize={10} fill="#10b981">VMGEXIT + nonce</text></g>}
        {active === 2 && <g><line x1={380} y1={100} x2={220} y2={100} stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#arr-a)" /><rect x={210} y={86} width={180} height={12} rx={2} fill="var(--card)" /><text x={300} y={95} textAnchor="middle" fontSize={10} fill="#f59e0b">SignedReport (ECDSA-P384)</text></g>}
        {active === 3 && <g><line x1={220} y1={100} x2={60} y2={100} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#arr-e2)" /><rect x={85} y={86} width={110} height={12} rx={2} fill="var(--card)" /><text x={140} y={95} textAnchor="middle" fontSize={10} fill="#10b981">report + VCEK cert</text></g>}
        {active === 4 && <g><line x1={60} y1={100} x2={500} y2={100} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#arr-p)" /><rect x={210} y={86} width={140} height={12} rx={2} fill="var(--card)" /><text x={280} y={95} textAnchor="middle" fontSize={10} fill="#8b5cf6">GET /vcek/{'{chip_id}'}</text><line x1={500} y1={115} x2={60} y2={115} stroke="#8b5cf6" strokeWidth={1} strokeDasharray="3,2" markerEnd="url(#arr-p2)" /><rect x={215} y={101} width={130} height={12} rx={2} fill="var(--card)" /><text x={280} y={110} textAnchor="middle" fontSize={10} fill="#8b5cf6" opacity={0.7}>VCEK cert chain</text></g>}
        {active === 5 && <g><rect x={20} y={78} width={80} height={44} rx={6} fill="#6366f120" stroke="#6366f140" strokeWidth={1} /><text x={60} y={96} textAnchor="middle" fontSize={10} fill="#6366f1">✓ measurement</text><text x={60} y={108} textAnchor="middle" fontSize={10} fill="#6366f1">✓ nonce match</text><text x={60} y={120} textAnchor="middle" fontSize={10} fill="#6366f1">✓ no debug</text></g>}

        <defs>
          {ARROW_MARKERS.map(([id, color]) => (
            <marker key={id} id={id} markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={color} />
            </marker>
          ))}
        </defs>
      </svg>

      {/* Step detail */}
      <div className={`rounded-lg border p-4 ${actorColor[steps[active].actor] ?? 'border-border text-foreground/80'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/20">
            Step {active + 1}
          </span>
          <span className="text-xs font-semibold">{steps[active].actor}</span>
          <span className="ml-auto text-xs font-medium">{steps[active].label}</span>
        </div>
        <p className="text-sm leading-relaxed">{steps[active].desc}</p>
      </div>
    </div>
  );
}
