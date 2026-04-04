import { motion } from 'framer-motion';

const C = { sp: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Bottom of Step7b: ℓ(P) as Fp12 — 3/12 non-zero slots */
export default function Step7bSlots({ delay = 0 }: { delay?: number }) {
  const nzIdx = [0, 2, 3];

  return (
    <g>
      <motion.text x={36} y={258} fontSize={11} fontWeight={500} fill={C.sp} {...fade(delay)}>
        ℓ(P)의 Fp¹² 12슬롯 (twist 구조 → 3개만 ≠ 0):
      </motion.text>

      {Array.from({ length: 12 }).map((_, i) => {
        const nz = nzIdx.includes(i);
        return (
          <motion.rect key={i} x={36 + i * 38} y={264} width={34} height={18} rx={3}
            fill={nz ? `${C.sp}25` : 'color-mix(in oklch, var(--muted) 15%, transparent)'}
            stroke={nz ? C.sp : 'var(--border)'} strokeWidth={nz ? 0.8 : 0.4}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 0.15, delay: delay + 0.2 + i * 0.04 }} />
        );
      })}
    </g>
  );
}
