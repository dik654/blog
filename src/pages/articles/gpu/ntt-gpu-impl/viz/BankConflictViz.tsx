import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const COL_BANK = '#0ea5e9';
const COL_BAD = '#dc2626';
const COL_PAD = '#10b981';
const COL_XOR = '#8b5cf6';

const STEPS = [
  { label: 'Shared memory: 32개 뱅크 × 4B 폭. uint64_t는 8B → 원소당 2뱅크 점유' },
  { label: 'Thread 0 → Bank 0-1, Thread 1 → Bank 2-3, …, Thread 16 → Bank 0-1' },
  { label: '충돌: Thread 0과 Thread 16이 같은 뱅크 → 2-way bank conflict (직렬화)' },
  { label: '해결 1: __shared__ uint64_t s[BLOCK_SIZE + 1] — 패딩 1개로 매핑 어긋남' },
  { label: '해결 2: s[i ^ (i >> 4)] — XOR 인덱싱으로 충돌 패턴 파괴' },
];

const BANK_COUNT = 32;
const SLOT_W = 14;

export default function BankConflictViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Bank header */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill={COL_BANK}>
              Shared Memory: 32 뱅크 × 4B
            </text>
            {Array.from({ length: BANK_COUNT }).map((_, i) => (
              <rect key={i} x={20 + i * SLOT_W} y={20} width={SLOT_W - 1} height={14} rx={1}
                fill={COL_BANK} opacity={0.18} />
            ))}
            {[0, 8, 16, 24].map((i) => (
              <text key={i} x={20 + i * SLOT_W + 6} y={31} textAnchor="middle"
                fontSize={6.5} fontWeight={600} fill={COL_BANK}>{i}</text>
            ))}
          </motion.g>

          {/* uint64_t mapping (no padding) */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step >= 1 && step <= 2 ? 1 : 0.08 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={56} fontSize={9} fontWeight={700} fill="var(--foreground)">
              패딩 없음: uint64_t s[BLOCK_SIZE]
            </text>
            {[0, 1, 2, 15].map((tid) => {
              const bankStart = (tid * 2) % BANK_COUNT;
              const conflict = tid === 0;
              return (
                <motion.g key={tid}
                  initial={{ opacity: 0, x: -2 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: tid * 0.02 }}
                >
                  <rect x={20 + bankStart * SLOT_W} y={62} width={SLOT_W * 2 - 2} height={14} rx={1}
                    fill={conflict && step === 2 ? COL_BAD : COL_BANK}
                    opacity={0.85} />
                  <text x={20 + bankStart * SLOT_W + SLOT_W} y={73} textAnchor="middle"
                    fontSize={6.5} fontWeight={700} fill="white">
                    {tid === 0 ? 'T0/16' : `T${tid}`}
                  </text>
                </motion.g>
              );
            })}
            {step === 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <AlertBox x={20} y={86} w={440} h={22}
                  label="Thread 0 vs Thread 16 — 같은 뱅크 → 2-way 충돌 (2배 직렬화)"
                  color={COL_BAD} />
              </motion.g>
            )}
          </motion.g>

          {/* Padding solution */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 3 ? 1 : 0.08 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={130} fontSize={9} fontWeight={700} fill={COL_PAD}>
              해결 1: +1 패딩 → s[BLOCK_SIZE + 1]
            </text>
            {[0, 1, 2, 15, 16].map((tid) => {
              // Padded mapping: each thread shifts by (i / 16) bank slot
              const offset = Math.floor(tid / 16);
              const bankStart = ((tid * 2) + offset * 2) % BANK_COUNT;
              return (
                <motion.g key={tid}
                  initial={{ opacity: 0, x: -2 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: tid * 0.02 }}
                >
                  <rect x={20 + bankStart * SLOT_W} y={138} width={SLOT_W * 2 - 2} height={14} rx={1}
                    fill={COL_PAD} opacity={0.85} />
                  <text x={20 + bankStart * SLOT_W + SLOT_W} y={149} textAnchor="middle"
                    fontSize={6.5} fontWeight={700} fill="white">
                    T{tid}
                  </text>
                </motion.g>
              );
            })}
            <DataBox x={20} y={158} w={440} h={20}
              label="모든 thread가 다른 뱅크 → 충돌 0" color={COL_PAD} outlined />
          </motion.g>

          {/* XOR alternative */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step >= 4 ? 1 : 0.08 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={200} fontSize={9} fontWeight={700} fill={COL_XOR}>
              해결 2: XOR 인덱싱
            </text>
            <ActionBox x={20} y={206} w={210} h={36}
              label="s[i ^ (i >> 4)]" sub="주소 매핑을 XOR로 섞음" color={COL_XOR} />
            <ActionBox x={250} y={206} w={210} h={36}
              label="동일 뱅크 패턴 파괴" sub="패딩 메모리 0" color={COL_XOR} />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
