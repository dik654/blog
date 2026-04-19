import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const COL_INTRA = '#10b981';
const COL_INTER = '#dc2626';
const COL_SHARED = '#0ea5e9';
const COL_GLOBAL = '#f59e0b';

const STEPS = [
  { label: '스테이지 내부: n/2개 나비 연산이 완전 독립 → 대규모 병렬' },
  { label: '스테이지 간: 데이터 의존성 존재 → 배리어 동기화 필요' },
  { label: '작은 스테이지 (stride < blockDim): 공유 메모리 + __syncthreads()로 블록 내 처리' },
  { label: '큰 스테이지 (stride ≥ blockDim): 글로벌 메모리 R/W, 스테이지당 커널 1회' },
  { label: 'n = 2^24: 전체 24 스테이지 중 ~10개 공유메모리, ~14개 글로벌' },
];

export default function ParallelismViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Intra-stage parallelism */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill={COL_INTRA}>
              스테이지 내부: n/2개 나비 = 완전 독립
            </text>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.g key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: step === 0 ? [0.5, 1, 0.5] : 1 }}
                transition={{ repeat: step === 0 ? Infinity : 0, duration: 1.4, delay: i * 0.05 }}
              >
                <DataBox x={20 + i * 56} y={20} w={50} h={26} label={`b${i}`} color={COL_INTRA} />
              </motion.g>
            ))}
          </motion.g>

          {/* Inter-stage barrier */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0.18 }}
            transition={{ duration: 0.3 }}>
            <AlertBox x={20} y={62} w={440} h={30}
              label="스테이지 간: 모든 결과가 모여야 다음 시작 → 배리어 필요"
              color={COL_INTER} />
          </motion.g>

          {/* Small stage: shared memory */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 2 || step === 4 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={114} fontSize={10} fontWeight={700} fill={COL_SHARED}>
              작은 스테이지 (stride &lt; blockDim)
            </text>
            <ModuleBox x={20} y={120} w={120} h={48} label="Block 0" sub="공유 메모리" color={COL_SHARED} />
            <ActionBox x={150} y={122} w={170} h={44}
              label="여러 스테이지를 1 커널" sub="__syncthreads()로 동기화" color={COL_SHARED} />
            <DataBox x={328} y={130} w={130} h={28} label="글로벌 R/W: 처음·끝 1회" color={COL_SHARED} outlined />
          </motion.g>

          {/* Large stage: global memory */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 3 || step === 4 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={186} fontSize={10} fontWeight={700} fill={COL_GLOBAL}>
              큰 스테이지 (stride ≥ blockDim)
            </text>
            <ModuleBox x={20} y={192} w={120} h={48} label="Global Memory" sub="블록 간 데이터" color={COL_GLOBAL} />
            <ActionBox x={150} y={194} w={170} h={44}
              label="스테이지당 커널 1회" sub="GPU 전체 동기화" color={COL_GLOBAL} />
            <DataBox x={328} y={202} w={130} h={28} label="글로벌 R/W: 매 스테이지" color={COL_GLOBAL} outlined />
          </motion.g>

          {/* Summary */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              <text x={240} y={266} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
                n=2²⁴ 24 스테이지 → 공유 ~10 + 글로벌 ~14
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
