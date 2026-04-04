import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { a: '#6366f1', b: '#10b981', c: '#f59e0b' };

const STEPS = [
  { label: '소수체 F₇ — mod 7 산술', body: 'F₇ = {0,1,...,6}. 7 이상은 mod 7로 되돌아온다.' },
  { label: '덧셈군 — 3 + 5 = ?', body: '3+5=8 → mod 7 → 1. 항상 {0~6} 안 — 닫힘·항등원·역원 성립.' },
  { label: '곱셈군 — 3 × 5 = ?', body: '3×5=15 → mod 7 → 1. 0 제외 전부 역원 존재 → 체(Field).' },
  { label: '원시근 — 3을 계속 곱하면?', body: '3의 거듭제곱이 {1~6} 전부 순회 → 원시근. 이산로그 문제의 기반.' },
];

const CW = 38, EY = 20;
const ex = (v: number) => 30 + v * CW;

export default function PrimeFieldViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Element bar */}
          {[0, 1, 2, 3, 4, 5, 6].map(v => {
            const dimmed = step >= 2 && v === 0;
            const highlight = step === 1 ? (v === 3 || v === 5 || v === 1)
              : step === 2 ? (v === 3 || v === 5 || v === 1)
              : step === 3 ? v > 0 : false;
            const color = step === 1 ? C.b : step === 2 ? C.b : step === 3 ? C.c : C.a;
            return (
              <motion.g key={v} animate={{ opacity: dimmed ? 0.2 : 1 }}>
                <rect x={ex(v)} y={EY} width={CW - 4} height={28} rx={5}
                  fill={highlight ? `${color}20` : `${C.a}08`}
                  stroke={highlight ? color : C.a}
                  strokeWidth={highlight ? 1.5 : 0.5} />
                <text x={ex(v) + (CW - 4) / 2} y={EY + 18} textAnchor="middle"
                  fontSize={12} fontWeight={highlight ? 600 : 400}
                  fill={highlight ? color : dimmed ? C.a : C.a}>{v}</text>
              </motion.g>
            );
          })}

          {/* Step 0: naming + mod wrapping */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={ex(7) + 10} y={EY + 18} fontSize={10} fill="var(--muted-foreground)">← mod 7</text>
              <rect x={ex(0)} y={EY + 42} width={280} height={48} rx={5}
                fill={`${C.a}08`} stroke={C.a} strokeWidth={0.6} />
              <text x={ex(0) + 10} y={EY + 60} fontSize={10} fontWeight={500} fill={C.a}>
                F₇ = "에프 칠" = mod 7 소수체
              </text>
              <text x={ex(0) + 10} y={EY + 78} fontSize={9} fill="var(--muted-foreground)">
                아래 첨자가 소수 p. 7 이상 → 다시 0~6으로 되돌아옴
              </text>
            </motion.g>
          )}

          {/* Step 1: addition example */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 3 + 5 = 8 → 1 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={40} y={EY + 55} width={200} height={30} rx={5}
                  fill={`${C.b}10`} stroke={C.b} strokeWidth={0.8} />
                <text x={140} y={EY + 74} textAnchor="middle" fontSize={11} fontWeight={500} fill={C.b}>
                  3 + 5 = 8 → 8 mod 7 = 1
                </text>
              </motion.g>
              {/* Inverse */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={260} y={EY + 55} width={185} height={30} rx={5}
                  fill={`${C.b}10`} stroke={C.b} strokeWidth={0.8} />
                <text x={352} y={EY + 74} textAnchor="middle" fontSize={10} fill={C.b}>
                  역원: 3 + 4 = 7 ≡ 0
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: multiplication example */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={ex(0)} y={EY + 44} fontSize={9} fill="var(--muted-foreground)">
                0 제외 → F₇*
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={40} y={EY + 55} width={200} height={30} rx={5}
                  fill={`${C.b}10`} stroke={C.b} strokeWidth={0.8} />
                <text x={140} y={EY + 74} textAnchor="middle" fontSize={11} fontWeight={500} fill={C.b}>
                  3 × 5 = 15 → 15 mod 7 = 1
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={260} y={EY + 55} width={185} height={30} rx={5}
                  fill={`${C.b}10`} stroke={C.b} strokeWidth={0.8} />
                <text x={352} y={EY + 74} textAnchor="middle" fontSize={10} fill={C.b}>
                  결과 = 1 → 서로 역원
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: primitive root chain — 2 rows */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { v: 3, s: '3¹', row: 0, col: 0 },
                { v: 2, s: '3²', row: 0, col: 1 },
                { v: 6, s: '3³', row: 0, col: 2 },
                { v: 4, s: '3⁴', row: 1, col: 0 },
                { v: 5, s: '3⁵', row: 1, col: 1 },
                { v: 1, s: '3⁶', row: 1, col: 2 },
              ].map((e, i) => {
                const x = 30 + e.col * 130;
                const y = EY + 55 + e.row * 42;
                const showArrow = i > 0 && e.col > 0;
                const showRowArrow = i === 3;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}>
                    {showArrow && (
                      <text x={x - 16} y={y + 16} fontSize={11} fill={C.c}>→</text>
                    )}
                    {showRowArrow && (
                      <text x={30 + 2 * 130 + 50} y={EY + 55 + 40} textAnchor="middle"
                        fontSize={11} fill={C.c}>↓</text>
                    )}
                    <rect x={x} y={y} width={100} height={28} rx={5}
                      fill={`${C.c}15`} stroke={C.c} strokeWidth={0.8} />
                    <text x={x + 50} y={y + 18} textAnchor="middle"
                      fontSize={11} fontWeight={500} fill={C.c}>{e.s} = {e.v}</text>
                  </motion.g>
                );
              })}
              <motion.text x={230} y={EY + 145} textAnchor="middle" fontSize={10}
                fill={C.c} fontWeight={500}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                {'{'}1, 2, 3, 4, 5, 6{'}'} 전부 순회 → g=3은 원시근
              </motion.text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
