import { motion } from 'framer-motion';
import Step6bBoxes from './Step6bBoxes';

const C = { g2: '#10b981', ml: '#ec4899', gt: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});
const draw = (d: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration: 0.5, delay: d }, opacity: { duration: 0.2, delay: d } },
});

// Elliptic curve shape: cusp on left, opens to right (like y²=x³+b)
// T on the left side (steep), INT further right (flatter), axis y=150
const T = [110, 100] as const;
const INT = [210, 80] as const;
const TWO_T = [210, 220] as const;
const CY = 150;

// Tangent through T → INT
const dx = INT[0] - T[0], dy = INT[1] - T[1];
const ext = 30;
const tL = [T[0] - ext, T[1] - (ext * dy) / dx] as const;
const tR = [INT[0] + ext, INT[1] + (ext * dy) / dx] as const;

export default function Step6bIterAnimate() {
  return (
    <svg viewBox="0 0 540 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={22} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.g2} {...fade(0)}>① 점 더블링: 곡선 위에서 일어나는 일</motion.text>

      {/* Upper curve: cusp at left, opens right, passes through T and INT */}
      <motion.path
        d={`M 68 ${CY}
            C 68 ${CY - 15}, 80 ${T[1] + 20}, ${T[0]} ${T[1]}
            C ${T[0] + 40} ${T[1] - 12}, ${INT[0] - 40} ${INT[1] + 4}, ${INT[0]} ${INT[1]}
            Q ${INT[0] + 40} ${INT[1] - 6}, 260 ${INT[1] - 10}`}
        fill="none" stroke={`${C.g2}45`} strokeWidth={1.5} {...draw(0.2)} />

      {/* Lower curve: mirror of upper, passes through TWO_T */}
      <motion.path
        d={`M 68 ${CY}
            C 68 ${CY + 15}, 80 ${2 * CY - T[1] - 20}, ${T[0]} ${2 * CY - T[1]}
            C ${T[0] + 40} ${2 * CY - T[1] + 12}, ${TWO_T[0] - 40} ${TWO_T[1] - 4}, ${TWO_T[0]} ${TWO_T[1]}
            Q ${TWO_T[0] + 40} ${TWO_T[1] + 6}, 260 ${TWO_T[1] + 10}`}
        fill="none" stroke={`${C.g2}45`} strokeWidth={1.5} {...draw(0.2)} />

      {/* T */}
      <motion.g {...fade(0.5)}>
        <circle cx={T[0]} cy={T[1]} r={7} fill={C.g2} />
        <text x={T[0] - 22} y={T[1] - 4} fontSize={12} fontWeight={600} fill={C.g2}>T</text>
      </motion.g>

      {/* Tangent through T and INT */}
      <motion.line x1={tL[0]} y1={tL[1]} x2={tR[0]} y2={tR[1]}
        stroke={C.ml} strokeWidth={1} strokeDasharray="5 3" {...draw(0.9)} />
      <motion.text x={tR[0] + 4} y={tR[1] - 6} fontSize={11}
        fontWeight={500} fill={C.ml} {...fade(1.1)}>접선 ℓ</motion.text>

      {/* Intersection on upper curve */}
      <motion.g {...fade(1.4)}>
        <circle cx={INT[0]} cy={INT[1]} r={5} fill="none" stroke="#ef4444" strokeWidth={1.2} />
      </motion.g>

      {/* Vertical reflection */}
      <motion.line x1={INT[0]} y1={INT[1] + 6} x2={TWO_T[0]} y2={TWO_T[1] - 6}
        stroke="#ef444430" strokeWidth={0.8} strokeDasharray="3 2" {...draw(1.7)} />

      {/* 2T on lower curve */}
      <motion.g {...fade(2.0)}>
        <circle cx={TWO_T[0]} cy={TWO_T[1]} r={7} fill={C.gt} />
        <text x={TWO_T[0] + 12} y={TWO_T[1] - 2} fontSize={12}
          fontWeight={600} fill={C.gt}>2T</text>
      </motion.g>

      <Step6bBoxes />
    </svg>
  );
}
