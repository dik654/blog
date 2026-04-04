import { useState } from 'react';
import { motion } from 'framer-motion';
import { VARIANTS, type VariantKey } from './ReLUVariantsData';

const ox = 220; const oy = 90;
const mapX = (x: number) => ox + x * 20;
const mapY = (y: number) => oy - y * 20;
const pts = Array.from({ length: 41 }, (_, i) => -4 + i * 0.2);

export default function ReLUVariantsViz() {
  const [active, setActive] = useState<VariantKey>('leaky');
  const sel = VARIANTS.find(v => v.key === active)!;

  return (
    <div className="not-prose rounded-xl border p-5 mb-6">
      {/* tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {VARIANTS.map(v => (
          <button key={v.key} onClick={() => setActive(v.key)}
            className={`px-3 py-1 text-xs rounded-lg border cursor-pointer transition-colors
              ${active === v.key ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
            {v.name}
          </button>
        ))}
      </div>
      {/* chart */}
      <svg viewBox="0 0 440 168" className="w-full max-w-2xl" style={{ height: 'auto' }}>
        {/* axes */}
        <line x1={30} y1={oy} x2={410} y2={oy} stroke="#888" strokeWidth={0.4} />
        <line x1={ox} y1={10} x2={ox} y2={150} stroke="#888" strokeWidth={0.4} />
        <text x={405} y={oy + 12} fontSize={9} fill="#888">x</text>
        <text x={ox + 6} y={18} fontSize={9} fill="#888">y</text>
        {/* ReLU baseline (dashed) */}
        <line x1={ox - 80} y1={oy} x2={ox} y2={oy}
          stroke="#888" strokeWidth={0.8} strokeDasharray="3,2" />
        <line x1={ox} y1={oy} x2={ox + 80} y2={oy - 80}
          stroke="#888" strokeWidth={0.8} strokeDasharray="3,2" />
        <text x={ox + 85} y={oy - 78} fontSize={9} fill="#888">ReLU</text>
        {/* selected variant */}
        <motion.path
          key={active}
          d={pts.map((x, i) => {
            const sx = mapX(x);
            const sy = Math.max(10, Math.min(150, mapY(sel.fn(x))));
            return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
          }).join(' ')}
          fill="none" stroke={sel.color} strokeWidth={1.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
        />
        {/* formula label */}
        <text x={ox} y={150} textAnchor="middle" fontSize={9}
          fill={sel.color} fontWeight={500}>{sel.name}: {sel.formula}</text>
      </svg>
    </div>
  );
}
