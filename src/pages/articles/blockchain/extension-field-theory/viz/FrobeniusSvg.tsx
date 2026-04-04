import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const C = { base: '#6366f1', conj: '#f59e0b', muted: 'var(--muted-foreground)' };

interface Props { a: number; b: number }

export default function FrobeniusSvg({ a, b }: Props) {
  const cx = 190, cy = 110, s = 36;
  const px = cx + a * s / 3;
  const py = cy - b * s / 3;
  const bConj = (7 - b) % 7;
  const pyC = cy - bConj * s / 3;

  // Label positions: anchored to the points, offset so they don't overlap
  const origLabelX = px + 10;
  const origLabelY = py - 8;
  const conjLabelX = px + 10;
  const conjLabelY = pyC + 16;

  return (
    <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Grid dots */}
      {Array.from({ length: 7 }).map((_, i) =>
        Array.from({ length: 7 }).map((_, j) => (
          <circle key={`${i}${j}`} cx={cx + i * s / 3} cy={cy - j * s / 3}
            r={2} fill={`${C.base}35`} />
        ))
      )}
      {/* Axes */}
      <line x1={cx - 8} y1={cy} x2={cx + 7 * s / 3 + 4} y2={cy}
        stroke={`${C.base}30`} strokeWidth={0.7} />
      <line x1={cx} y1={cy + 8} x2={cx} y2={cy - 7 * s / 3 - 4}
        stroke={`${C.base}30`} strokeWidth={0.7} />
      <text x={cx + 7 * s / 3 + 8} y={cy + 4} fontSize={9} fill={C.base}>a</text>
      <text x={cx + 4} y={cy - 7 * s / 3 - 6} fontSize={9} fill={C.base}>bu</text>

      {/* Reflection axis */}
      <line x1={cx - 8} y1={cy} x2={cx + 7 * s / 3 + 4} y2={cy}
        stroke={`${C.conj}25`} strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={cx + 7 * s / 3 + 8} y={cy + 14} fontSize={9} fill={C.conj}>반사축</text>

      {/* Original point + label — both animate together */}
      <motion.g animate={{ x: px - cx, y: py - cy }} transition={sp}>
        <circle cx={cx} cy={cy} r={6} fill={C.base} />
        <text x={cx + 10} y={cy - 8} fontSize={10} fontWeight={600} fill={C.base}>
          {a} + {b}u
        </text>
      </motion.g>

      {/* Dashed connector */}
      <motion.line x1={px} y1={py} x2={px} y2={pyC}
        stroke={`${C.conj}40`} strokeWidth={0.8} strokeDasharray="3 2"
        animate={{ x1: px, y1: py, x2: px, y2: pyC }} transition={sp} />

      {/* Conjugate point + label — both animate together */}
      <motion.g animate={{ x: px - cx, y: pyC - cy }} transition={sp}>
        <circle cx={cx} cy={cy} r={6} fill={C.conj} />
        <text x={cx + 10} y={cy + 16} fontSize={10} fontWeight={600} fill={C.conj}>
          {a} + {bConj}u = {a} − {b}u
        </text>
      </motion.g>

      {/* Right: formulas */}
      <text x={390} y={40} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.base}>
        Frobenius φ
      </text>
      <rect x={320} y={50} width={140} height={40} rx={5}
        fill={`${C.base}12`} stroke={`${C.base}30`} strokeWidth={0.6} />
      <text x={390} y={68} textAnchor="middle" fontSize={10} fill={C.base}>φ(a+bu) = a−bu</text>
      <text x={390} y={82} textAnchor="middle" fontSize={9} fill={C.muted}>u축 반사 = 켤레</text>

      <rect x={320} y={100} width={140} height={50} rx={5}
        fill={`${C.conj}12`} stroke={`${C.conj}30`} strokeWidth={0.6} />
      <text x={390} y={118} textAnchor="middle" fontSize={10} fill={C.conj}>복소수 켤레와 동일</text>
      <text x={390} y={134} textAnchor="middle" fontSize={9} fill={C.muted}>ℂ: a+bi → a−bi</text>
      <text x={390} y={148} textAnchor="middle" fontSize={9} fill={C.muted}>F₇²: a+bu → a−bu</text>

      <text x={250} y={212} textAnchor="middle" fontSize={9} fill={C.muted}>
        φ²(x) = x (2번 적용 → 원래) — 위수 2 = 확장 차수 2
      </text>
    </svg>
  );
}
