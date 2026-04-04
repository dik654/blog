import { motion } from 'framer-motion';

const C = { g2: '#10b981', gt: '#f59e0b', ml: '#ec4899', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

const ITERS = [
  { label: 'i=253 (첫 번째)', op3: 'f = 1 (초기값)', note: 'f를 1로 시작' },
  { label: 'i=252', op3: 'f = 1² · ℓ(P) = ℓ(P)', note: '첫 평가값' },
  { label: 'i=251', op3: 'f = ℓ(P)² · ℓ\'(P)', note: '누적 시작' },
];

/** Right-side pipeline: 3 representative iterations + dots */
export default function MillerPipeline() {
  return (
    <g>
      <motion.text x={370} y={22} textAnchor="middle" fontSize={12} fontWeight={600}
        fill={C.ml} {...fade(0.3)}>Miller Loop 파이프라인</motion.text>

      {ITERS.map((r, i) => (
        <motion.g key={i} {...fade(0.6 + i * 0.5)}>
          <rect x={240} y={34 + i * 62} width={264} height={52} rx={5}
            fill={`${C.ml}${i === 2 ? '15' : '08'}`}
            stroke={`${C.ml}${i === 2 ? '40' : '20'}`} strokeWidth={0.6} />
          <text x={252} y={52 + i * 62} fontSize={10} fontWeight={600} fill={C.ml}>
            {r.label}
          </text>
          <text x={252} y={68 + i * 62} fontSize={10} fill={C.g2}>① T←2T</text>
          <text x={330} y={68 + i * 62} fontSize={10} fill={C.ml}>② ℓ(P)</text>
          <text x={252} y={82 + i * 62} fontSize={10} fill={C.gt}>③ {r.op3}</text>
          {i < 2 && (
            <motion.g {...fade(1.0 + i * 0.5)}>
              <line x1={372} y1={88 + i * 62} x2={372} y2={94 + i * 62}
                stroke={`${C.m}40`} strokeWidth={0.6} />
              <polygon points={`369,${94 + i * 62} 372,${98 + i * 62} 375,${94 + i * 62}`}
                fill={`${C.m}40`} />
            </motion.g>
          )}
        </motion.g>
      ))}

      <motion.g {...fade(2.0)}>
        <text x={372} y={228} textAnchor="middle" fontSize={14} fill={C.m}>⋮</text>
        <text x={372} y={246} textAnchor="middle" fontSize={10} fill={C.m}>254번 반복</text>
      </motion.g>

      <motion.g {...fade(2.4)}>
        <rect x={280} y={252} width={184} height={24} rx={4}
          fill={`${C.gt}18`} stroke={C.gt} strokeWidth={0.8} />
        <text x={372} y={268} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.gt}>
          f = Fp¹² 원소 (출력)
        </text>
      </motion.g>
    </g>
  );
}
