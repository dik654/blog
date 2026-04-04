import { motion } from 'framer-motion';

const C = { ml: '#ec4899', g1: '#6366f1', g2: '#10b981', sp: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Right half of Step7b: formula explanation + sparse note */
export default function Step7bFormula({ delay = 0 }: { delay?: number }) {
  const nzIdx = [0, 2, 3];

  return (
    <g>
      {/* Formula */}
      <motion.g {...fade(delay)}>
        <rect x={230} y={44} width={290} height={30} rx={5}
          fill={`${C.ml}10`} stroke={`${C.ml}25`} strokeWidth={0.5} />
        <text x={375} y={64} textAnchor="middle" fontSize={12} fill={C.ml}>
          ℓ(x,y) = y − yT − λ(x − xT)
        </text>
      </motion.g>

      {/* T → 0 */}
      <motion.g {...fade(delay + 0.5)}>
        <rect x={230} y={84} width={290} height={28} rx={5}
          fill={`${C.g2}08`} stroke={`${C.g2}20`} strokeWidth={0.5} />
        <text x={240} y={103} fontSize={11} fill={C.g2}>
          x=xT, y=yT 대입 → 0 (접선 위)
        </text>
      </motion.g>

      {/* P → value */}
      <motion.g {...fade(delay + 1.0)}>
        <rect x={230} y={122} width={290} height={28} rx={5}
          fill={`${C.g1}10`} stroke={`${C.g1}25`} strokeWidth={0.5} />
        <text x={240} y={141} fontSize={11} fontWeight={600} fill={C.g1}>
          x=xP, y=yP 대입 → ≠ 0 (접선 밖)
        </text>
      </motion.g>

      {/* What this value means */}
      <motion.g {...fade(delay + 1.5)}>
        <rect x={230} y={162} width={290} height={44} rx={5}
          fill={`${C.ml}08`} stroke={`${C.ml}20`} strokeWidth={0.5} />
        <text x={240} y={180} fontSize={11} fill={C.m}>
          이 ≠ 0 값 = "T와 P의 기하학적 관계"
        </text>
        <text x={240} y={198} fontSize={11} fill={C.ml}>
          → Fp¹² 원소로 매핑 → f에 곱해서 누적
        </text>
      </motion.g>

      {/* Sparse slots */}
      <motion.text x={240} y={228} fontSize={11} fontWeight={500} fill={C.sp} {...fade(delay + 2.0)}>
        ℓ(P)의 Fp¹² 12슬롯 (3개만 ≠ 0):
      </motion.text>
      {Array.from({ length: 12 }).map((_, i) => {
        const nz = nzIdx.includes(i);
        return (
          <motion.rect key={i} x={230 + i * 24} y={234} width={20} height={16} rx={3}
            fill={nz ? `${C.sp}25` : 'color-mix(in oklch, var(--muted) 15%, transparent)'}
            stroke={nz ? C.sp : 'var(--border)'} strokeWidth={nz ? 0.7 : 0.4}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 0.12, delay: delay + 2.1 + i * 0.03 }} />
        );
      })}
    </g>
  );
}
