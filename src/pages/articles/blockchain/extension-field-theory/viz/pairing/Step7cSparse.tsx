import { motion } from 'framer-motion';
import Step7cResult from './Step7cResult';

const C = { gt: '#f59e0b', sp: '#6366f1', ml: '#ec4899', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

const NZ = [0, 2, 3]; // non-zero indices in ℓ(P)
const SW = 38; // slot width

/** ③ f² · ℓ(P) with connection lines showing interactions */
export default function Step7cSparse() {
  return (
    <svg viewBox="0 0 540 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={22} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.gt} {...fade(0)}>③ f² × ℓ(P): 어떤 슬롯끼리 곱해지는가</motion.text>

      {/* f² row (12 slots, all active) */}
      <motion.text x={20} y={52} fontSize={11} fontWeight={500} fill={C.ml} {...fade(0.3)}>
        f² (12개 전부 ≠ 0)
      </motion.text>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.rect key={`f${i}`} x={20 + i * SW} y={58} width={SW - 4} height={22} rx={3}
          fill={`${C.ml}15`} stroke={`${C.ml}35`} strokeWidth={0.5}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.15, delay: 0.4 + i * 0.03 }} />
      ))}

      {/* ℓ(P) row (3 slots active, 9 zero) */}
      <motion.text x={20} y={104} fontSize={11} fontWeight={500} fill={C.sp} {...fade(0.8)}>
        ℓ(P) (3개만 ≠ 0)
      </motion.text>
      {Array.from({ length: 12 }).map((_, i) => {
        const nz = NZ.includes(i);
        return (
          <motion.rect key={`l${i}`} x={20 + i * SW} y={110} width={SW - 4} height={22} rx={3}
            fill={nz ? `${C.sp}25` : 'color-mix(in oklch, var(--muted) 15%, transparent)'}
            stroke={nz ? `${C.sp}50` : 'var(--border)'} strokeWidth={nz ? 0.7 : 0.4}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 0.15, delay: 0.9 + i * 0.03 }} />
        );
      })}

      {/* Connection lines: only non-zero ℓ slots connect to f² slots */}
      {NZ.map((nzIdx, ni) =>
        Array.from({ length: 4 }).map((_, fi) => {
          const fIdx = (nzIdx * 3 + fi) % 12;
          return (
            <motion.line key={`c${ni}${fi}`}
              x1={20 + nzIdx * SW + (SW - 4) / 2} y1={132}
              x2={20 + fIdx * SW + (SW - 4) / 2} y2={58}
              stroke={`${C.sp}30`} strokeWidth={0.6}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 0.3, delay: 1.4 + ni * 0.15 + fi * 0.05 }} />
          );
        })
      )}

      {/* Comparison + result */}
      <Step7cResult delay={2.0} />
    </svg>
  );
}
