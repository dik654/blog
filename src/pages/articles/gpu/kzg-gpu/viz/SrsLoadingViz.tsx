import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const COL_FULL = '#0ea5e9';
const COL_CHUNK = '#10b981';
const COL_MONT = '#f59e0b';

const STEPS = [
  { label: 'Full Load: SRS 전체를 한 번에 H2D 전송 후 GPU 상주' },
  { label: 'Full Load 조건: VRAM > SRS 크기 + 작업 메모리 (버킷 등)' },
  { label: 'Chunked Streaming: SRS를 청크로 나눠 비동기 전송 + 부분 MSM' },
  { label: 'Chunked 비용: PCIe 4.0 x16 ~32GB/s가 병목 (4GB SRS ≈ 125ms)' },
  { label: 'Montgomery 전변환: 로딩 직후 1회만 수행 → 이후 모든 곱셈에서 나눗셈 회피' },
];

export default function SrsLoadingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Strategy 1: Full Load */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step <= 1 ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}
          >
            <text x={20} y={14} fontSize={10} fontWeight={700} fill={COL_FULL}>1. Full Load</text>
            <ModuleBox x={16} y={20} w={90} h={36} label="Host SRS" sub="n × 64B" color={COL_FULL} />
            <motion.g animate={{ x: step === 0 ? [0, 8, 0] : 0 }}
              transition={{ repeat: step === 0 ? Infinity : 0, duration: 1.4 }}>
              <line x1={108} y1={38} x2={196} y2={38}
                stroke={COL_FULL} strokeWidth={1.5} markerEnd="url(#srs-arrow)" />
              <text x={152} y={32} textAnchor="middle" fontSize={8} fontWeight={600}
                fill={COL_FULL}>cudaMemcpy H2D</text>
            </motion.g>
            <ModuleBox x={200} y={20} w={130} h={36} label="GPU SRS (full)" sub="모든 MSM 재사용" color={COL_FULL} />
            {step >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <DataBox x={340} y={26} w={130} h={26} label="VRAM ≥ SRS + work" color={COL_FULL} outlined />
              </motion.g>
            )}
          </motion.g>

          {/* Strategy 2: Chunked Streaming */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 2 && step <= 3 ? 1 : step === 4 ? 0.25 : 0.18 }}
            transition={{ duration: 0.3 }}
          >
            <text x={20} y={88} fontSize={10} fontWeight={700} fill={COL_CHUNK}>2. Chunked Streaming</text>
            <ModuleBox x={16} y={94} w={90} h={36} label="Host SRS" sub="청크 분할" color={COL_CHUNK} />
            {[0, 1, 2].map((i) => {
              const cx = 200 + i * 50;
              const active = step === 2 || step === 3;
              return (
                <motion.g key={i}
                  animate={{ x: active ? [0, -8, 0] : 0, opacity: 1 }}
                  transition={{ repeat: active ? Infinity : 0, duration: 1.5, delay: i * 0.18 }}
                >
                  <DataBox x={cx} y={100} w={42} h={24} label={`c${i}`} color={COL_CHUNK} />
                </motion.g>
              );
            })}
            <text x={355} y={114} fontSize={9} fill="var(--muted-foreground)">…</text>
            {step >= 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <DataBox x={376} y={102} w={94} h={24} label="PCIe ~32 GB/s" color={COL_CHUNK} outlined />
              </motion.g>
            )}
            <ActionBox x={200} y={134} w={170} h={26} label="msm_partial(chunk, scalars)" color={COL_CHUNK} />
          </motion.g>

          {/* Strategy 3: Montgomery 전변환 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 4 ? 1 : 0.18 }}
            transition={{ duration: 0.3 }}
          >
            <text x={20} y={186} fontSize={10} fontWeight={700} fill={COL_MONT}>3. Montgomery 전변환</text>
            <DataBox x={16} y={196} w={120} h={32} label="GPU SRS (raw)" color={COL_MONT} />
            <ActionBox x={150} y={194} w={130} h={36} label="to_montgomery" sub="kernel 1회" color={COL_MONT} />
            <DataBox x={296} y={196} w={170} h={32} label="GPU SRS (Montgomery 형)" color={COL_MONT} outlined />
            {step >= 4 && (
              <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}>
                <text x={240} y={252} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={COL_MONT}>이후 모든 Fp 곱셈 = 단순 곱셈 (나눗셈 없음)</text>
              </motion.g>
            )}
          </motion.g>

          <defs>
            <marker id="srs-arrow" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={COL_FULL} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
