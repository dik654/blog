import { motion } from 'framer-motion';

const C = { hi: '#6366f1', warn: '#ef4444', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

export default function Step0Problem() {
  return (
    <svg viewBox="0 0 500 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={250} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.warn} {...fade(0)}>
        V x V 동시발생 행렬 — 너무 크다
      </motion.text>

      {/* 희소 행렬 시각화 */}
      <motion.g {...fade(0.3)}>
        <rect x={30} y={40} width={140} height={110} rx={6}
          fill={`${C.warn}08`} stroke={`${C.warn}30`} strokeWidth={0.6} />
        {Array.from({ length: 8 }).map((_, r) =>
          Array.from({ length: 8 }).map((_, c) => {
            const hasVal = (r + c) % 5 === 0 || (r === c);
            return (
              <rect key={`${r}${c}`} x={35 + c * 16} y={46 + r * 12} width={13} height={9} rx={1.5}
                fill={hasVal ? `${C.hi}30` : '#80808008'}
                stroke={hasVal ? `${C.hi}60` : '#55555520'} strokeWidth={0.4} />
            );
          })
        )}
        <text x={100} y={166} textAnchor="middle" fontSize={10} fill={C.m}>
          V x V (대부분 0)
        </text>
      </motion.g>

      {/* 크기 경고 */}
      <motion.g {...fade(0.7)}>
        <rect x={200} y={50} width={270} height={90} rx={6}
          fill={`${C.warn}10`} stroke={`${C.warn}30`} strokeWidth={0.6} />
        <text x={215} y={72} fontSize={12} fontWeight={600} fill={C.warn}>V = 100,000 이면?</text>
        <text x={215} y={92} fontSize={11} fill={C.m}>100,000 x 100,000 = 100억 개 원소</text>
        <text x={215} y={112} fontSize={11} fill={C.m}>메모리: ~75 GB (float64)</text>
        <text x={215} y={132} fontSize={11} fill={C.warn}>연산·저장 모두 비현실적</text>
      </motion.g>

      {/* 해결 방향 */}
      <motion.g {...fade(1.1)}>
        <rect x={200} y={150} width={270} height={36} rx={5}
          fill={`${C.hi}12`} stroke={`${C.hi}30`} strokeWidth={0.5} />
        <text x={335} y={173} textAnchor="middle" fontSize={11} fontWeight={500} fill={C.hi}>
          해결: 대부분의 정보는 소수의 축에 집중 → 차원 축소
        </text>
      </motion.g>
    </svg>
  );
}
