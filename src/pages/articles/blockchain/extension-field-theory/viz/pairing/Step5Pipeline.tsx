import { motion } from 'framer-motion';

const C = { g1: '#6366f1', g2: '#10b981', gt: '#f59e0b', ml: '#ec4899', fe: '#a78bfa', m: 'var(--muted-foreground)' };

const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { duration: 0.4, delay: d },
});

const boxes = [
  { label: 'P ∈ G1', sub: '64 B', x: 10, y: 20, w: 78, h: 44, c: C.g1, d: 0 },
  { label: 'Q ∈ G2', sub: '128 B', x: 10, y: 78, w: 78, h: 44, c: C.g2, d: 0.2 },
  { label: 'Miller Loop', sub: '254회 반복', x: 130, y: 34, w: 110, h: 64, c: C.ml, d: 0.6 },
  { label: 'f ∈ Fp¹²', sub: '384 B', x: 275, y: 42, w: 85, h: 48, c: C.gt, d: 1.0 },
  { label: 'Final Exp', sub: '거듭제곱', x: 395, y: 34, w: 100, h: 64, c: C.fe, d: 1.4 },
  { label: 'GT 원소', sub: '페어링 값', x: 530, y: 42, w: 80, h: 48, c: C.gt, d: 1.8 },
];

const arrows = [
  { x1: 90, y1: 42, x2: 130, y2: 58, d: 0.4 },
  { x1: 90, y1: 100, x2: 130, y2: 76, d: 0.4 },
  { x1: 242, y1: 66, x2: 275, y2: 66, d: 0.8 },
  { x1: 362, y1: 66, x2: 395, y2: 66, d: 1.2 },
  { x1: 497, y1: 66, x2: 530, y2: 66, d: 1.6 },
];

export default function Step5Pipeline() {
  return (
    <svg viewBox="0 0 620 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {boxes.map(b => (
        <motion.g key={b.label} {...fade(b.d)}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6}
            fill={`${b.c}20`} stroke={b.c} strokeWidth={1} />
          <text x={b.x + b.w / 2} y={b.y + 22} textAnchor="middle"
            fontSize={12} fontWeight={600} fill={b.c}>{b.label}</text>
          <text x={b.x + b.w / 2} y={b.y + b.h - 8} textAnchor="middle"
            fontSize={9} fill={C.m}>{b.sub}</text>
        </motion.g>
      ))}
      {arrows.map((a, i) => (
        <motion.g key={i} {...fade(a.d)}>
          <line x1={a.x1} y1={a.y1} x2={a.x2 - 5} y2={a.y2}
            stroke={`${C.m}50`} strokeWidth={0.8} />
          <polygon points={`${a.x2 - 5},${a.y2 - 3} ${a.x2},${a.y2} ${a.x2 - 5},${a.y2 + 3}`}
            fill={`${C.m}50`} />
        </motion.g>
      ))}

      {/* 하단 비용 */}
      <motion.g {...fade(2.2)}>
        <rect x={10} y={135} width={600} height={46} rx={6}
          fill={`${C.gt}08`} stroke={`${C.gt}20`} strokeWidth={0.5} />
        {[
          { t: 'Miller Loop: ~15,000 Fp곱', c: C.ml, x: 30 },
          { t: 'Final Exp: ~5,000 Fp곱', c: C.fe, x: 240 },
          { t: '총합: ~20,000 Fp곱 ≈ 1.5ms', c: C.gt, x: 440 },
        ].map(r => (
          <text key={r.t} x={r.x} y={164} fontSize={11} fontWeight={500} fill={r.c}>{r.t}</text>
        ))}
      </motion.g>
    </svg>
  );
}
