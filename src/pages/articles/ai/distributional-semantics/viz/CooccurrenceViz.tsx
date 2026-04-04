import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { WORDS, MATRIX_WORDS, MATRIX, STEPS, CELL_SIZE } from './CooccurrenceVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const HI = '#6366f1';
const PMI_VALS = [[0, 1.4, 0, 0, 0], [1.4, 0, 0.4, 0, 0], [0, 0.4, 0, 0.7, 0], [0, 0, 0.7, 0, 0.9], [0, 0, 0, 0.9, 0]];

export default function CooccurrenceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 560 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0-1: 코퍼스 + 윈도우 */}
          {step <= 1 && WORDS.map((w, i) => {
            const inWin = step === 0 && Math.abs(i - 1) <= 1;
            const isCenter = step === 0 && i === 1;
            return (
              <motion.g key={`w-${i}`} animate={{ opacity: 1 }} transition={sp}>
                <rect x={20 + i * 70} y={10} width={60} height={28} rx={5}
                  fill={isCenter ? HI + '20' : inWin ? '#3b82f610' : '#80808008'}
                  stroke={isCenter ? HI : inWin ? '#3b82f6' : '#555'} strokeWidth={isCenter ? 2 : 1} />
                <text x={50 + i * 70} y={28} textAnchor="middle" fontSize={11}
                  fill={isCenter ? HI : inWin ? '#3b82f6' : 'currentColor'} fontWeight={isCenter ? 700 : 400}>{w}</text>
              </motion.g>
            );
          })}
          {step === 0 && (
            <motion.text x={120} y={52} fontSize={10} fill={HI} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              윈도우: [나, 는, 고양이]
            </motion.text>
          )}

          {/* Step 2+: 행렬 */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {MATRIX_WORDS.map((w, i) => (
                <text key={`ch-${i}`} x={95 + i * CELL_SIZE + CELL_SIZE / 2} y={18}
                  textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.6}>{w}</text>
              ))}
              {MATRIX_WORDS.map((w, row) => (
                <g key={`row-${row}`}>
                  <text x={88} y={36 + row * CELL_SIZE} textAnchor="end"
                    fontSize={10} fill="currentColor" opacity={0.6}>{w}</text>
                  {MATRIX[row].map((v, col) => {
                    const usePMI = step >= 5;
                    const val = usePMI ? PMI_VALS[row][col] : v;
                    const intensity = usePMI ? val / 1.4 : val / 2;
                    return (
                      <g key={`c-${row}-${col}`}>
                        <rect x={95 + col * CELL_SIZE} y={22 + row * CELL_SIZE}
                          width={CELL_SIZE - 2} height={CELL_SIZE - 2} rx={3}
                          fill={val > 0 ? `rgba(99,102,241,${intensity * 0.5})` : '#80808008'}
                          stroke={val > 0 ? HI : '#55555550'} strokeWidth={val > 0 ? 1 : 0.5} />
                        <text x={95 + col * CELL_SIZE + (CELL_SIZE - 2) / 2}
                          y={22 + row * CELL_SIZE + (CELL_SIZE - 2) / 2 + 4}
                          textAnchor="middle" fontSize={10}
                          fill={val > 0 ? HI : '#666'} fontWeight={val > 0 ? 600 : 400}>
                          {usePMI ? (val > 0 ? val.toFixed(1) : '0') : v}
                        </text>
                      </g>
                    );
                  })}
                </g>
              ))}
            </motion.g>
          )}

          {/* Step 3: 문제 제기 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={290} y={20} width={250} height={85} rx={6}
                fill="#ef444408" stroke="#ef4444" strokeWidth={1} />
              <text x={415} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">문제</text>
              <text x={415} y={60} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
                (나, 는) = 2로 높지만
              </text>
              <text x={415} y={78} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
                "는"은 어디서나 등장 → 우연
              </text>
              <text x={415} y={96} textAnchor="middle" fontSize={11} fill="#10b981" fontWeight={600}>
                기대값 대비 얼마나 많은가?
              </text>
            </motion.g>
          )}

          {/* Step 4: PMI 계산 예시 — 실제 숫자 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={290} y={10} width={250} height={175} rx={6}
                fill="#10b98108" stroke="#10b981" strokeWidth={1} />
              <text x={415} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
                PMI 계산: (나, 는)
              </text>
              <text x={310} y={56} fontSize={11} fill="var(--foreground)">실제: P(나,는) = 2/8 =</text>
              <text x={525} y={56} textAnchor="end" fontSize={12} fontWeight={700} fill="#6366f1">0.25</text>
              <text x={310} y={78} fontSize={11} fill="var(--foreground)">기대: P(나)×P(는) =</text>
              <text x={525} y={78} textAnchor="end" fontSize={12} fontWeight={700} fill="#ef4444">0.094</text>
              <rect x={310} y={90} width={210} height={26} rx={4}
                fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1} />
              <text x={415} y={108} textAnchor="middle" fontSize={12} fill="#f59e0b" fontWeight={600}>
                0.25 ÷ 0.094 = 2.67배
              </text>
              <text x={310} y={136} fontSize={11} fill="var(--foreground)">PMI = log₂(2.67) =</text>
              <text x={525} y={136} textAnchor="end" fontSize={13} fontWeight={700} fill="#10b981">1.41</text>
              <text x={415} y={158} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                기대보다 2.67배 많이 동시 등장
              </text>
              <text x={415} y={176} textAnchor="middle" fontSize={11} fill="#10b981" fontWeight={600}>
                → 의미적 연관 있음
              </text>
            </motion.g>
          )}

          {/* Step 5: PPMI 결과 */}
          {step >= 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={290} y={20} width={250} height={75} rx={6}
                fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1.5} />
              <text x={415} y={42} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
                PPMI 행렬
              </text>
              <text x={415} y={62} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
                PPMI = max(PMI, 0)
              </text>
              <text x={415} y={80} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
                음수(기대 이하) → 0 처리
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
