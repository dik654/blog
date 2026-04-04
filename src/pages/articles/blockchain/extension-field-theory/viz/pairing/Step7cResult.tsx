import { motion } from 'framer-motion';

const C = { sp: '#6366f1', ml: '#ec4899', gt: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Bottom half of Step7c: why sparse matters + cost comparison */
export default function Step7cResult({ delay = 0 }: { delay?: number }) {
  return (
    <g>
      {/* Why we're doing this */}
      <motion.g {...fade(delay)}>
        <text x={270} y={154} textAnchor="middle" fontSize={11} fill={C.m}>
          ℓ의 0인 슬롯은 곱해도 0 → 건너뛸 수 있다
        </text>
      </motion.g>

      {/* Cost comparison */}
      <motion.g {...fade(delay + 0.3)}>
        <rect x={20} y={168} width={240} height={48} rx={5}
          fill={`${C.ml}08`} stroke={`${C.ml}20`} strokeWidth={0.5} />
        <text x={140} y={188} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.ml}>
          full 곱셈: 12 × 12 = 144 항
        </text>
        <text x={140} y={206} textAnchor="middle" fontSize={11} fill={C.m}>
          Karatsuba 적용 → Fp 곱 54번
        </text>
      </motion.g>

      <motion.g {...fade(delay + 0.5)}>
        <rect x={280} y={168} width={240} height={48} rx={5}
          fill={`${C.sp}12`} stroke={`${C.sp}30`} strokeWidth={0.7} />
        <text x={400} y={188} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.sp}>
          sparse: 12 × 3 = 36 항
        </text>
        <text x={400} y={206} textAnchor="middle" fontSize={11} fill={C.sp}>
          → Fp 곱 ~18번 (1/3 비용!)
        </text>
      </motion.g>

      {/* Why this matters */}
      <motion.g {...fade(delay + 0.8)}>
        <rect x={20} y={230} width={500} height={36} rx={5}
          fill={`${C.gt}08`} stroke={`${C.gt}20`} strokeWidth={0.5} />
        <text x={270} y={250} textAnchor="middle" fontSize={12} fill={C.gt}>
          이 절감이 254번 반복 → 전체 Miller Loop에서 ~5,000 Fp곱 절약
        </text>
        <text x={270} y={264} textAnchor="middle" fontSize={11} fill={C.m}>
          twist가 sparse를 만들고, sparse가 페어링을 실용적으로 만든다
        </text>
      </motion.g>
    </g>
  );
}
