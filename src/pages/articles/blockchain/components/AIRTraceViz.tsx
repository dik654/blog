import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const COLS = ['a', 'b', 'c'];
const CC = ['#6366f1', '#0ea5e9', '#10b981'];
const FIB = [[1,1,2],[1,2,3],[2,3,5],[3,5,8]];
const RX = 60, RW = 50, RH = 16, GAP = 2;

const STEPS = [
  { label: '실행 트레이스 행렬 생성', body: '피보나치 연산을 행(row) 단위로 기록합니다. 열 a, b, c.' },
  { label: 'current/next 관계 확인', body: 'row[i].c = row[i].a + row[i].b 제약을 모든 행에서 검증.' },
  { label: '행 간 전이 제약', body: 'row[i+1].a = row[i].b, row[i+1].b = row[i].c — 다음 행과 연결.' },
  { label: 'AIR 다항식 변환', body: '모든 제약을 다항식으로 변환하여 STARK/FRI로 증명 가능하게 합니다.' },
];

export default function AIRTraceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 320 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* col headers */}
          {COLS.map((c, ci) => (
            <text key={c} x={RX + ci * RW + RW / 2} y={12} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={CC[ci]}>{c}</text>
          ))}
          {/* rows */}
          {FIB.map((row, ri) => {
            const y = 20 + ri * (RH + GAP);
            const isCur = step >= 1 && ri === 1;
            const isNxt = step >= 2 && ri === 2;
            return (
              <g key={ri}>
                <text x={RX - 16} y={y + 11} fontSize={9} fill="var(--muted-foreground)">{ri}</text>
                {row.map((v, ci) => (
                  <g key={ci}>
                    <motion.rect x={RX + ci * RW} y={y} width={RW - 2} height={RH} rx={3}
                      animate={{ fill: isCur ? `${CC[ci]}20` : isNxt ? `${CC[ci]}12` : `${CC[ci]}06`,
                        stroke: CC[ci], strokeWidth: isCur || isNxt ? 1.5 : 0.5,
                        opacity: step >= 0 ? (isCur || isNxt ? 1 : 0.5) : 0.2 }}
                      transition={sp} />
                    <text x={RX + ci * RW + RW / 2 - 1} y={y + 11} textAnchor="middle"
                      fontSize={9} fontWeight={600} fill={CC[ci]}
                      opacity={isCur || isNxt ? 1 : 0.5}>{v}</text>
                  </g>
                ))}
                {isCur && <text x={RX - 28} y={y + 11} fontSize={9} fill="#6366f1">cur</text>}
                {isNxt && <text x={RX - 28} y={y + 11} fontSize={9} fill="#10b981">nxt</text>}
              </g>
            );
          })}
          {/* constraint formula */}
          {step >= 1 && (
            <motion.text x={240} y={40} fontSize={9} fill="#f59e0b" fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={sp}>
              c[i] = a[i] + b[i]
            </motion.text>
          )}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={sp}>
              <text x={240} y={56} fontSize={5.5} fill="#10b981">a[i+1] = b[i]</text>
              <text x={240} y={66} fontSize={5.5} fill="#10b981">b[i+1] = c[i]</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={220} y={78} width={90} height={18} rx={4} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1} />
              <text x={265} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">
                AIR 다항식화
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
