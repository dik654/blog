import type { Mode } from './ModelVizData';
import { SENTENCE, CENTER, CONTEXT_IDXS } from './ModelVizData';

export default function ModelVizSVG({ mode }: { mode: Mode }) {
  return (
    <svg viewBox="0 0 380 180" className="w-full" style={{ height: 160 }}>
      {SENTENCE.map((w, i) => {
        const x = 30 + i * 65;
        const isCenter = i === CENTER;
        const isContext = CONTEXT_IDXS.includes(i);
        const highlight = mode === 'cbow' ? isContext : isCenter;
        const dimmed = mode === 'cbow' ? isCenter : isContext;
        return (
          <g key={w}>
            <rect x={x - 24} y={14} width={48} height={24} rx={6}
              fill={isCenter ? '#f59e0b' : '#6366f1'}
              fillOpacity={highlight ? 0.25 : dimmed ? 0.06 : 0.15}
              stroke={isCenter ? '#f59e0b' : '#6366f1'}
              strokeWidth={highlight || (mode === 'skipgram' && isCenter) ? 2 : 1}
              strokeOpacity={highlight || (mode === 'skipgram' && isCenter) ? 1 : 0.3} />
            <text x={x} y={30} textAnchor="middle" fontSize={9} fontWeight={600}
              fill={isCenter ? '#f59e0b' : '#6366f1'}
              fillOpacity={highlight || (mode === 'skipgram' && isCenter) ? 1 : 0.4}>
              {w}
            </text>
          </g>
        );
      })}

      {mode === 'cbow' ? (
        <>
          {CONTEXT_IDXS.map(i => (
            <line key={i} x1={30 + i * 65} y1={40} x2={30 + CENTER * 65} y2={88}
              stroke="#6366f1" strokeWidth={1.5} strokeOpacity={0.5}
              markerEnd="url(#arrow-blue)" />
          ))}
          <text x={190} y={80} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.5}>
            평균(avg)
          </text>
        </>
      ) : (
        <>
          {CONTEXT_IDXS.map(i => (
            <line key={i} x1={30 + CENTER * 65} y1={40} x2={30 + i * 65} y2={88}
              stroke="#f59e0b" strokeWidth={1.5} strokeOpacity={0.5}
              markerEnd="url(#arrow-amber)" />
          ))}
        </>
      )}

      <rect x={156} y={92} width={68} height={26} rx={6}
        fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
      <text x={190} y={109} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
        은닉층 (d=300)
      </text>

      <rect x={140} y={140} width={100} height={24} rx={6}
        fill={mode === 'cbow' ? '#f59e0b' : '#6366f1'}
        fillOpacity={0.15}
        stroke={mode === 'cbow' ? '#f59e0b' : '#6366f1'} strokeWidth={1.5} />
      <text x={190} y={156} textAnchor="middle" fontSize={9}
        fill={mode === 'cbow' ? '#f59e0b' : '#6366f1'} fontWeight={600}>
        {mode === 'cbow' ? '예측: "갈색"' : '예측: 주변 4단어'}
      </text>
      <line x1={190} y1={118} x2={190} y2={139} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />

      <defs>
        <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#6366f1" fillOpacity={0.5} />
        </marker>
        <marker id="arrow-amber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" fillOpacity={0.5} />
        </marker>
      </defs>
    </svg>
  );
}
