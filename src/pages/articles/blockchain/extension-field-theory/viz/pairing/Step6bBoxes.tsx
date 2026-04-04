import { motion } from 'framer-motion';

const C = { g2: '#10b981', ml: '#ec4899', gt: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Right-side info boxes for Step6b */
export default function Step6bBoxes() {
  return (
    <g>
      <motion.g {...fade(0.8)}>
        <rect x={290} y={44} width={230} height={56} rx={6}
          fill={`${C.g2}08`} stroke={`${C.g2}20`} strokeWidth={0.6} />
        <text x={302} y={66} fontSize={12} fontWeight={600} fill={C.g2}>더블링에서 나오는 것</text>
        <text x={302} y={84} fontSize={11} fill={C.m}>새 좌표 2T + 접선 방정식 ℓ(x,y)</text>
      </motion.g>
      <motion.g {...fade(2.3)}>
        <rect x={290} y={114} width={230} height={66} rx={6}
          fill={`${C.ml}08`} stroke={`${C.ml}20`} strokeWidth={0.6} />
        <text x={302} y={136} fontSize={12} fontWeight={600} fill={C.ml}>다음: ℓ(P)</text>
        <text x={302} y={156} fontSize={11} fill={C.m}>ℓ(x,y) = y − yT − λ(x − xT)</text>
        <text x={302} y={172} fontSize={11} fill={C.ml}>이 함수에 P 좌표를 대입 → 숫자 1개</text>
      </motion.g>
      <motion.g {...fade(2.7)}>
        <rect x={290} y={196} width={230} height={52} rx={6}
          fill={`${C.gt}08`} stroke={`${C.gt}20`} strokeWidth={0.6} />
        <text x={302} y={218} fontSize={11} fill={C.gt}>그 다음: f ← f² · ℓ(P)</text>
        <text x={302} y={238} fontSize={11} fill={C.m}>이번 T-P 관계를 f에 반영</text>
      </motion.g>
    </g>
  );
}
