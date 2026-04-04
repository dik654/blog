import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { a: '#6366f1', yes: '#10b981', no: '#ef4444', c: '#f59e0b' };

const STEPS = [
  { label: '원시근이란?', body: '위수가 p-1인 원소 — 거듭제곱으로 모든 원소를 순회.' },
  { label: 'g=3은 F₇*의 원시근 ✓', body: '3의 거듭제곱이 {1~6} 전부 순회 → 위수 6 = p-1.' },
  { label: 'g=2는 F₇*의 원시근 ✗', body: '2의 거듭제곱이 {1,2,4}만 순회 → 위수 3 ≠ p-1.' },
  { label: '왜 원시근이 중요한가?', body: '정방향(거듭제곱)은 쉽고 역방향(이산로그)은 어렵다 — 암호학의 기반.' },
];

const CW = 38, EY = 14;
const ex = (v: number) => 30 + v * CW;

export default function PrimitiveRootViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Element bar */}
          {[0, 1, 2, 3, 4, 5, 6].map(v => {
            const visited1 = [3, 2, 6, 4, 5, 1]; // g=3
            const visited2 = [2, 4, 1]; // g=2
            const hl = step === 1 ? visited1.includes(v)
              : step === 2 ? visited2.includes(v)
              : step === 3 ? v > 0 : v > 0;
            const col = step === 1 ? C.yes : step === 2 ? C.no : step === 3 ? C.c : C.a;
            return (
              <motion.g key={v} animate={{ opacity: v === 0 ? 0.2 : 1 }}>
                <rect x={ex(v)} y={EY} width={CW - 4} height={26} rx={5}
                  fill={hl ? `${col}20` : `${C.a}08`} stroke={hl ? col : C.a}
                  strokeWidth={hl ? 1.5 : 0.5} />
                <text x={ex(v) + (CW - 4) / 2} y={EY + 17} textAnchor="middle"
                  fontSize={11} fontWeight={hl ? 600 : 400} fill={hl ? col : C.a}>{v}</text>
              </motion.g>
            );
          })}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={40} y={EY + 56} width={380} height={40} rx={5}
                fill={`${C.a}08`} stroke={C.a} strokeWidth={0.6} />
              <text x={230} y={EY + 73} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                위수 = p-1 → 원시근 (모든 원소 순회)
              </text>
              <text x={230} y={EY + 89} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                위수 &lt; p-1 → 원시근 아님 (일부만 순회)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['3¹=3', '3²=2', '3³=6', '3⁴=4', '3⁵=5', '3⁶=1'].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  {i > 0 && <text x={22 + i * 72 - 7} y={EY + 66} fontSize={10} fill={C.yes} textAnchor="middle">→</text>}
                  <rect x={22 + i * 72} y={EY + 50} width={58} height={24} rx={4}
                    fill={`${C.yes}15`} stroke={C.yes} strokeWidth={0.8} />
                  <text x={22 + i * 72 + 29} y={EY + 66} textAnchor="middle"
                    fontSize={10} fontWeight={500} fill={C.yes}>{s}</text>
                </motion.g>
              ))}
              <motion.text x={230} y={EY + 100} textAnchor="middle" fontSize={10} fill={C.yes} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                6개 전부 순회 → 위수 6 = p-1 → g=3은 F₇*의 원시근 ✓
              </motion.text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['2¹=2', '2²=4', '2³=1'].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  {i > 0 && <text x={80 + i * 120 - 14} y={EY + 66} fontSize={10} fill={C.no} textAnchor="middle">→</text>}
                  <rect x={80 + i * 120} y={EY + 50} width={100} height={24} rx={4}
                    fill={`${C.no}15`} stroke={C.no} strokeWidth={0.8} />
                  <text x={80 + i * 120 + 50} y={EY + 66} textAnchor="middle"
                    fontSize={10} fontWeight={500} fill={C.no}>{s}</text>
                </motion.g>
              ))}
              <motion.text x={230} y={EY + 100} textAnchor="middle" fontSize={10} fill={C.no} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                3개만 순회 → 위수 3 ≠ p-1 → g=2는 F₇*의 원시근 아님 ✗
              </motion.text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 정방향: 쉬움 */}
              <text x={20} y={EY + 48} fontSize={9} fontWeight={500} fill={C.yes}>정방향 (쉬움)</text>
              <rect x={20} y={EY + 52} width={200} height={24} rx={4}
                fill={`${C.yes}10`} stroke={C.yes} strokeWidth={0.8} />
              <text x={120} y={EY + 68} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.yes}>
                3⁵ = 243 mod 7 = 5
              </text>
              <text x={230} y={EY + 68} fontSize={9} fill="var(--muted-foreground)">← 그냥 곱하면 됨</text>
              {/* 역방향: 어려움 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <text x={20} y={EY + 90} fontSize={9} fontWeight={500} fill={C.no}>역방향 (어려움 = DLP)</text>
                <rect x={20} y={EY + 94} width={200} height={24} rx={4}
                  fill={`${C.no}10`} stroke={C.no} strokeWidth={0.8} />
                <text x={120} y={EY + 110} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.no}>
                  3ˣ = 5 → x = ?
                </text>
                <text x={230} y={EY + 110} fontSize={9} fill="var(--muted-foreground)">← p가 크면 계산 불가능</text>
              </motion.g>
              <motion.text x={230} y={EY + 140} textAnchor="middle" fontSize={10} fill={C.c} fontWeight={500}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                이 비대칭이 암호학의 보안 기반
              </motion.text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
