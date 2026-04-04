import { motion } from 'framer-motion';

const C = { base: '#6366f1', ok: '#10b981', fail: '#ef4444', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, delay: d },
});

const vals = [5, 6, 2, 0, 0, 2, 6]; // (x²-2) mod 7 for x=0..6

export default function Step2Reduc() {
  return (
    <svg viewBox="0 0 490 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={245} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.ok} {...fade(0)}>
        x² − 2 = 0  →  x² ≡ 2 (mod 7) 인 x가 있는가?
      </motion.text>

      {/* 테이블 헤더 */}
      <motion.g {...fade(0.2)}>
        <text x={50} y={48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.base}>x</text>
        <text x={145} y={48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.base}>(x²−2) mod 7</text>
        <text x={250} y={48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.base}>= 0?</text>
        <line x1={20} y1={55} x2={295} y2={55} stroke={`${C.base}25`} strokeWidth={0.5} />
      </motion.g>

      {vals.map((v, i) => (
        <motion.g key={i} {...fade(0.4 + i * 0.2)}>
          {v === 0 && <rect x={20} y={64 + i * 22 - 2} width={278} height={20} rx={3}
            fill={`${C.ok}15`} />}
          <text x={50} y={76 + i * 22} textAnchor="middle" fontSize={12} fill={C.base}>{i}</text>
          <text x={145} y={76 + i * 22} textAnchor="middle" fontSize={12}
            fill={v === 0 ? C.ok : C.base}>{v}</text>
          <text x={250} y={76 + i * 22} textAnchor="middle" fontSize={12}
            fill={v === 0 ? C.ok : C.fail}>{v === 0 ? '✓ 근!' : '✗'}</text>
        </motion.g>
      ))}

      {/* 결론 */}
      <motion.g {...fade(0.4 + 7 * 0.2)}>
        <rect x={310} y={60} width={168} height={80} rx={6}
          fill={`${C.ok}12`} stroke={`${C.ok}35`} strokeWidth={0.7} />
        <text x={394} y={84} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.ok}>
          근 발견: x=3, 4
        </text>
        <text x={394} y={104} textAnchor="middle" fontSize={10} fill={C.m}>
          3²=9≡2, 4²=16≡2
        </text>
        <text x={394} y={122} textAnchor="middle" fontSize={10} fill={C.m}>
          → 인수분해 가능!
        </text>
      </motion.g>

      <motion.g {...fade(0.4 + 8 * 0.2)}>
        <rect x={20} y={218} width={450} height={28} rx={5}
          fill={`${C.ok}10`} stroke={`${C.ok}25`} strokeWidth={0.5} />
        <text x={245} y={237} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ok}>
          x² − 2 = (x − 3)(x − 4) → 가약. 근이 이미 F₇ 안에 존재.
        </text>
      </motion.g>
    </svg>
  );
}
