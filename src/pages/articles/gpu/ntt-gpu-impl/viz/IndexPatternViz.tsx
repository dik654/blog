import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, AlertBox } from '@/components/viz/boxes';

const COL_S0 = '#0ea5e9';
const COL_S1 = '#10b981';
const COL_S2 = '#f59e0b';
const COL_BAD = '#dc2626';

const STEPS = [
  { label: 'n = 8 → 3 스테이지. 각 스테이지에서 4개 나비 연산 = (a, b) 쌍' },
  { label: 'Stage 0 (stride=1, group=2): 인접 쌍 — (0,1) (2,3) (4,5) (6,7)' },
  { label: 'Stage 1 (stride=2, group=4): 2칸 거리 — (0,2) (1,3) (4,6) (5,7)' },
  { label: 'Stage 2 (stride=4, group=8): 절반 거리 — (0,4) (1,5) (2,6) (3,7)' },
  { label: 'stride ↑ → (a,b) 거리 ↑ → 캐시 미스 ↑ → 글로벌 메모리 대역폭이 병목' },
];

interface Pair {
  a: number;
  b: number;
}

const STAGES: { stride: number; pairs: Pair[]; color: string }[] = [
  { stride: 1, color: COL_S0, pairs: [{ a: 0, b: 1 }, { a: 2, b: 3 }, { a: 4, b: 5 }, { a: 6, b: 7 }] },
  { stride: 2, color: COL_S1, pairs: [{ a: 0, b: 2 }, { a: 1, b: 3 }, { a: 4, b: 6 }, { a: 5, b: 7 }] },
  { stride: 4, color: COL_S2, pairs: [{ a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 3, b: 7 }] },
];

const N = 8;
const SLOT_W = 50;
const PAD = 20;

export default function IndexPatternViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {STAGES.map((s, sIdx) => {
            const y = 24 + sIdx * 80;
            // Visible when relevant step
            const isActive =
              step === 0 ||
              (sIdx === 0 && step === 1) ||
              (sIdx === 1 && step === 2) ||
              (sIdx === 2 && step === 3) ||
              step === 4;
            const opacity = isActive ? 1 : 0.22;

            return (
              <motion.g key={sIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity }}
                transition={{ duration: 0.3 }}
              >
                {/* Label */}
                <text x={20} y={y + 4} fontSize={9} fontWeight={700} fill={s.color}>
                  Stage {sIdx} · stride={s.stride}
                </text>

                {/* Slots */}
                {Array.from({ length: N }).map((_, i) => (
                  <DataBox key={i} x={PAD + i * SLOT_W} y={y + 12} w={SLOT_W - 4} h={26}
                    label={`${i}`} color="#94a3b8" />
                ))}

                {/* Pair arcs */}
                {s.pairs.map((p, pi) => {
                  const xa = PAD + p.a * SLOT_W + (SLOT_W - 4) / 2;
                  const xb = PAD + p.b * SLOT_W + (SLOT_W - 4) / 2;
                  const yTop = y + 12;
                  const cy = yTop - 8 - Math.abs(p.b - p.a) * 4;
                  const path = `M ${xa} ${yTop} Q ${(xa + xb) / 2} ${cy} ${xb} ${yTop}`;
                  return (
                    <motion.path key={pi} d={path}
                      stroke={s.color} strokeWidth={1.4} fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isActive ? 1 : 0 }}
                      transition={{ duration: 0.4, delay: pi * 0.08 }}
                    />
                  );
                })}
              </motion.g>
            );
          })}

          {/* Cache warning */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <AlertBox x={20} y={252} w={440} h={22}
                label="큰 stride → (a,b) 거리 ↑ → 캐시 미스 → 글로벌 대역폭 병목"
                color={COL_BAD} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
