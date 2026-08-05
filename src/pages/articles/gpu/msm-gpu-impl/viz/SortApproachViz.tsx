import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const COL_RACE = '#dc2626';
const COL_SORT = '#10b981';
const COL_DATA = '#0ea5e9';

const STEPS = [
  { label: '문제: 여러 스레드가 같은 bucket[k]에 더하면 race condition' },
  { label: '해법: (window_val, point_idx) 쌍을 window_val 기준 정렬' },
  { label: '단계 1: 모든 점에 대해 (윈도우 값, 점 인덱스) 쌍 생성' },
  { label: '단계 2: cub::DeviceRadixSort::SortPairs로 GPU 기수 정렬' },
  { label: '단계 3: 정렬 후 같은 window_val이 연속 → 충돌 없이 순차 누적' },
];

// Example before sorting (c=4)
const RAW = [
  { v: 5, p: 8 }, { v: 1, p: 0 }, { v: 0, p: 7 }, { v: 3, p: 1 },
  { v: 1, p: 5 }, { v: 0, p: 2 }, { v: 3, p: 4 }, { v: 1, p: 9 },
];
// After sort
const SORTED = [...RAW].sort((a, b) => a.v - b.v);

const BUCKET_COLORS: Record<number, string> = {
  0: '#0ea5e9',
  1: '#10b981',
  3: '#f59e0b',
  5: '#8b5cf6',
};

export default function SortApproachViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Race condition warning */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 0 ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill={COL_RACE}>문제: Race Condition</text>
            {[0, 1, 2].map((i) => (
              <ModuleBox key={i} x={20 + i * 80} y={20} w={70} h={28}
                label={`Thread ${i}`} color={COL_RACE} />
            ))}
            <ActionBox x={300} y={20} w={170} h={28} label="bucket[5] += P_i" color={COL_RACE} />
            <AlertBox x={20} y={54} w={450} h={24}
              label="3 스레드가 동시에 bucket[5]에 더함 → 결과 손상" color={COL_RACE} />
          </motion.g>

          {/* Step 1·2·3: pair generation, sort, accumulate */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step >= 1 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={94} fontSize={10} fontWeight={700} fill={COL_SORT}>해법: 정렬 후 순차 누적</text>

            {/* Before */}
            <text x={20} y={114} fontSize={9} fontWeight={600} fill={COL_DATA}>정렬 전 (window_val, point_idx)</text>
            {RAW.map((it, i) => {
              const c = BUCKET_COLORS[it.v] || '#94a3b8';
              return (
                <motion.g key={`raw-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: step <= 2 ? 1 : 0.4 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <DataBox x={20 + i * 56} y={120} w={50} h={24}
                    label={`${it.v},${it.p}`} color={c} />
                </motion.g>
              );
            })}

            {/* Arrow */}
            {step >= 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <ActionBox x={20} y={156} w={440} h={22}
                  label="cub::DeviceRadixSort::SortPairs (GPU 기수 정렬)" color={COL_SORT} />
              </motion.g>
            )}

            {/* After */}
            <text x={20} y={196} fontSize={9} fontWeight={600} fill={COL_SORT}>정렬 후 (같은 버킷 인접)</text>
            {SORTED.map((it, i) => {
              const c = BUCKET_COLORS[it.v] || '#94a3b8';
              return (
                <motion.g key={`sorted-${i}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: step >= 3 ? 1 : 0.18, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <DataBox x={20 + i * 56} y={202} w={50} h={24}
                    label={`${it.v},${it.p}`} color={c} />
                </motion.g>
              );
            })}

            {/* Annotations under sorted */}
            {step >= 4 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <text x={45} y={244} fontSize={8} fontWeight={600} fill={BUCKET_COLORS[0]}>bkt 0</text>
                <text x={158} y={244} fontSize={8} fontWeight={600} fill={BUCKET_COLORS[1]}>bkt 1</text>
                <text x={296} y={244} fontSize={8} fontWeight={600} fill={BUCKET_COLORS[3]}>bkt 3</text>
                <text x={410} y={244} fontSize={8} fontWeight={600} fill={BUCKET_COLORS[5]}>bkt 5</text>
                <text x={20} y={264} fontSize={9} fontWeight={600} fill={COL_SORT}>
                  → 각 버킷 구간을 한 스레드/블록이 순차 누적 → 충돌 없음
                </text>
              </motion.g>
            )}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
