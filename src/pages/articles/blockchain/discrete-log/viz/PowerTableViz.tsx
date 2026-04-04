import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { hi: '#6366f1', cell: '#10b981', sort: '#f59e0b' };
const POWERS = [3, 9, 10, 13, 5, 15, 11, 16, 14, 8, 7, 4, 12, 2, 6, 1];
const CW = 26, OX = 32, OY = 20, SY = OY + CW + 12;

const STEPS = [
  { label: '거듭제곱 테이블 — 3ˣ mod 17', body: '3의 거듭제곱을 mod 17로 나열하면 결과가 뒤섞여 보인다.' },
  { label: '1~16 모든 값이 정확히 한 번씩', body: '정렬하면 1부터 16까지 빠짐없이 나타난다. g=3이 mod 17의 생성원(generator)인 증거.' },
  { label: 'y=5일 때 x를 찾으려면?', body: '테이블에서 5가 나오는 위치 x=5를 찾아야 한다. 소수가 256-bit이면 테이블 자체를 만들 수 없다.' },
];

export default function PowerTableViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 465 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Header: x */}
          <text x={OX - 8} y={OY - 4} textAnchor="end" fontSize={9} fontWeight={500}
            fill="var(--muted-foreground)">x</text>
          {POWERS.map((_, i) => (
            <text key={`h${i}`} x={OX + i * CW + CW / 2} y={OY - 4} textAnchor="middle"
              fontSize={9} fill={step === 2 && i === 4 ? C.hi : 'var(--muted-foreground)'}
              fontWeight={step === 2 && i === 4 ? 600 : 400}>{i + 1}</text>
          ))}
          {/* Row label */}
          <text x={OX - 8} y={OY + CW / 2 + 3} textAnchor="end" fontSize={9} fontWeight={500}
            fill="var(--muted-foreground)">3ˣ</text>
          {/* Shuffled cells */}
          {POWERS.map((v, i) => {
            const highlight = step === 2 && v === 5;
            return (
              <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}>
                <rect x={OX + i * CW + 1} y={OY} width={CW - 2} height={CW} rx={4}
                  fill={highlight ? `${C.hi}20` : `${C.cell}15`}
                  stroke={highlight ? C.hi : 'none'} strokeWidth={highlight ? 1.2 : 0} />
                <text x={OX + i * CW + CW / 2} y={OY + CW / 2 + 4} textAnchor="middle"
                  fontSize={9} fontWeight={highlight ? 600 : 400}
                  fill={highlight ? C.hi : 'var(--foreground)'}>{v}</text>
              </motion.g>
            );
          })}
          {/* Sorted row — step 1 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={OX - 8} y={SY + CW / 2 + 3} textAnchor="end" fontSize={9} fontWeight={500}
                fill={C.sort}>정렬</text>
              {Array.from({ length: 16 }, (_, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}>
                  <rect x={OX + i * CW + 1} y={SY} width={CW - 2} height={CW} rx={4}
                    fill={`${C.sort}15`} />
                  <text x={OX + i * CW + CW / 2} y={SY + CW / 2 + 4} textAnchor="middle"
                    fontSize={9} fontWeight={400} fill={C.sort}>{i + 1}</text>
                </motion.g>
              ))}
              <motion.text x={OX + 8 * CW} y={SY + CW + 14} textAnchor="middle"
                fontSize={9} fontWeight={500} fill={C.sort}
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.6 }}>
                ✓ 1~16 빠짐없이 한 번씩
              </motion.text>
            </motion.g>
          )}
          {/* Highlight arrow — step 2 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <text x={OX + 4 * CW + CW / 2} y={OY + CW + 16} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={C.hi}>↑ x=5</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
