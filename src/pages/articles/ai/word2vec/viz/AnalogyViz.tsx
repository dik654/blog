import { useState } from 'react';
import { motion } from 'framer-motion';
import { EMBEDDINGS, ANALOGIES, W, H, toSVG } from './AnalogyVizData';

export default function AnalogyViz() {
  const [idx, setIdx] = useState(0);
  const analogy = ANALOGIES[idx];
  const { a, b, c, d } = analogy;

  const va = EMBEDDINGS[a];
  const vb = EMBEDDINGS[b];
  const vc = EMBEDDINGS[c];
  const vd = EMBEDDINGS[d];
  const vresult: [number, number] = [va[0] - vb[0] + vc[0], va[1] - vb[1] + vc[1]];

  const points: Array<{ word: string; vec: [number, number]; color: string }> = [
    { word: a, vec: va, color: '#6366f1' },
    { word: b, vec: vb, color: '#ef4444' },
    { word: c, vec: vc, color: '#10b981' },
    { word: d, vec: vd, color: '#f59e0b' },
    { word: '?', vec: vresult, color: '#a855f7' },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs text-foreground/50 font-mono">Word2Vec 단어 유추 (2D 임베딩 시각화)</p>

      <div className="flex gap-2 flex-wrap">
        {ANALOGIES.map((an, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className="text-xs font-mono px-2 py-1 rounded border transition-all"
            style={{
              borderColor: idx === i ? '#6366f1' : 'transparent',
              background: idx === i ? '#6366f115' : 'transparent',
              color: idx === i ? '#6366f1' : 'var(--foreground)',
              opacity: idx === i ? 1 : 0.55,
            }}>
            {an.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl rounded-lg border border-border/40" style={{ height: 'auto' }}>
          {[
            { from: vb, to: va, color: '#6366f150' },
            { from: vc, to: vresult, color: '#a855f750' },
          ].map(({ from, to, color }, i) => {
            const [x1, y1] = toSVG(from);
            const [x2, y2] = toSVG(to);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color} strokeWidth={1.5} strokeDasharray="3,2" />
            );
          })}
          {points.map(p => {
            const [x, y] = toSVG(p.vec);
            return (
              <motion.g key={p.word} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <circle cx={x} cy={y} r={6} fill={p.color} opacity={0.8} />
                <text x={x} y={y + 20} textAnchor="middle" fontSize={10} fill={p.color} fontFamily="monospace">
                  {p.word}
                </text>
              </motion.g>
            );
          })}
        </svg>

        <div className="text-xs font-mono space-y-2 flex-1">
          <div className="space-y-1.5">
            {[
              { word: a, color: '#6366f1', role: 'A' },
              { word: b, color: '#ef4444', role: 'B' },
              { word: c, color: '#10b981', role: 'C' },
            ].map(item => (
              <div key={item.word} className="flex items-center gap-2">
                <span className="text-foreground/40 w-4">{item.role}:</span>
                <span className="px-2 py-0.5 rounded" style={{ background: item.color + '20', color: item.color }}>
                  {item.word}
                </span>
              </div>
            ))}
            <div className="border-t border-border/50 pt-1.5 flex items-center gap-2">
              <span className="text-foreground/40 w-4">=</span>
              <span className="px-2 py-0.5 rounded font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
                {d}
              </span>
              <span className="text-foreground/40 text-[10px]">v({a})-v({b})+v({c})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
