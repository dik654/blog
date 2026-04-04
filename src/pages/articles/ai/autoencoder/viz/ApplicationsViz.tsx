import { useState } from 'react';
import { APPS } from './ApplicationsVizData';

const M = 'var(--muted-foreground)';

export default function ApplicationsViz() {
  const [sel, setSel] = useState(0);
  const app = APPS[sel];

  return (
    <div className="not-prose rounded-xl border p-5 mb-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {APPS.map((a, i) => (
          <button key={a.id} onClick={() => setSel(i)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              i === sel ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-accent'
            }`}>
            {a.title}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 400 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
        {/* Before */}
        <rect x={20} y={10} width={120} height={70} rx={8}
          fill={sel === 0 ? '#88888820' : `${app.color}08`}
          stroke={app.color} strokeWidth={1} />
        {sel === 0 && Array.from({ length: 30 }).map((_, i) => (
          <circle key={i}
            cx={30 + Math.random() * 100} cy={20 + Math.random() * 50}
            r={1.5} fill={M} fillOpacity={0.3} />
        ))}
        <text x={80} y={50} textAnchor="middle" fontSize={9}
          fontWeight={500} fill={app.color}>{app.before}</text>

        {/* Arrow */}
        <text x={170} y={48} textAnchor="middle" fontSize={9}
          fill={M}>AE</text>
        <line x1={145} y1={45} x2={195} y2={45}
          stroke={app.color} strokeWidth={1}
          markerEnd={`url(#app-arr-${sel})`} />

        {/* After */}
        <rect x={200} y={10} width={120} height={70} rx={8}
          fill={`${app.color}12`}
          stroke={app.color} strokeWidth={1.2} />
        <text x={260} y={50} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={app.color}>{app.after}</text>

        {/* Reconstruction error bar for anomaly */}
        {sel === 1 && (
          <>
            <rect x={340} y={20} width={8} height={12} rx={2}
              fill="#10b98140" stroke="#10b981" strokeWidth={0.6} />
            <text x={358} y={30} fontSize={9} fill="#10b981">정상</text>
            <rect x={340} y={42} width={8} height={38} rx={2}
              fill="#ef444440" stroke="#ef4444" strokeWidth={0.6} />
            <text x={358} y={64} fontSize={9} fill="#ef4444">이상</text>
          </>
        )}

        <defs>
          {APPS.map((a, i) => (
            <marker key={i} id={`app-arr-${i}`} markerWidth="6"
              markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={a.color} />
            </marker>
          ))}
        </defs>
      </svg>
    </div>
  );
}
