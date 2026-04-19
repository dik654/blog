import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const COL_RUST = '#f97316';
const COL_CUDA = '#10b981';
const COL_OPT = '#8b5cf6';
const COL_PIPE = '#0ea5e9';

const STEPS = [
  { label: 'Rust 프론트엔드: sppark::msm — BLS12-381 / BN254 / 커브 선택' },
  { label: 'FFI 경계: Rust ↔ CUDA 백엔드 호출' },
  { label: 'CUDA 백엔드: pippenger.cuh — bucket_accumulate / bucket_reduce / batch_affine' },
  { label: '핵심 최적화 1: Batch Affine Inversion (Montgomery Trick) → 혼합 덧셈 6M (vs Jacobian 16M)' },
  { label: '핵심 최적화 2: 윈도우 i 누적과 i-1 환원을 CUDA 스트림 2개로 동시 실행' },
];

export default function SpparkArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Rust frontend */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill={COL_RUST}>Rust 프론트엔드</text>
            <ModuleBox x={20} y={20} w={170} h={64}
              label="sppark::msm" sub="BLS12-381 · BN254 · 커브 선택" color={COL_RUST} />
          </motion.g>

          {/* FFI bridge */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0.18 }}
            transition={{ duration: 0.3 }}>
            <line x1={190} y1={52} x2={272} y2={52}
              stroke={COL_PIPE} strokeWidth={1.4} markerEnd="url(#sp-arr)" />
            <text x={231} y={48} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={COL_PIPE}>FFI</text>
          </motion.g>

          {/* CUDA backend */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={272} y={14} fontSize={10} fontWeight={700} fill={COL_CUDA}>CUDA 백엔드 (pippenger.cuh)</text>
            <ModuleBox x={272} y={20} w={190} h={20} label="bucket_accumulate" color={COL_CUDA} />
            <ModuleBox x={272} y={42} w={190} h={20} label="bucket_reduce" color={COL_CUDA} />
            <ModuleBox x={272} y={64} w={190} h={20} label="batch_affine" color={COL_CUDA} />
          </motion.g>

          {/* Optimization 1: Batch Affine */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={108} fontSize={10} fontWeight={700} fill={COL_OPT}>최적화 1: Batch Affine Inversion</text>
            <DataBox x={20} y={114} w={130} h={26} label="Jacobian 누적 (16M)" color="#94a3b8" />
            <text x={158} y={131} fontSize={11} fontWeight={700} fill={COL_OPT}>→</text>
            <ActionBox x={170} y={112} w={130} h={30}
              label="Montgomery's Trick" sub="n inv → 1 inv + 3(n-1) mul" color={COL_OPT} />
            <text x={306} y={131} fontSize={11} fontWeight={700} fill={COL_OPT}>→</text>
            <DataBox x={318} y={114} w={150} h={26}
              label="Affine 혼합 덧셈 (6M)" color={COL_OPT} outlined />
          </motion.g>

          {/* Optimization 2: Pipelining */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 4 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={166} fontSize={10} fontWeight={700} fill={COL_PIPE}>
              최적화 2: 파이프라이닝 (CUDA 스트림 2개)
            </text>
            <text x={20} y={186} fontSize={9} fontWeight={600} fill={COL_PIPE}>Stream A:</text>
            {[0, 1, 2].map((i) => (
              <motion.rect key={`a-${i}`}
                x={68 + i * 130} y={178} width={120} height={18} rx={3}
                fill={COL_PIPE} opacity={0.7}
                animate={{ opacity: step >= 4 ? [0.4, 0.85, 0.4] : 0.7 }}
                transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.4 }}
              />
            ))}
            {[0, 1, 2].map((i) => (
              <text key={`at-${i}`} x={128 + i * 130} y={191} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="white">
                accumulate w{i}
              </text>
            ))}

            <text x={20} y={216} fontSize={9} fontWeight={600} fill={COL_OPT}>Stream B:</text>
            {[0, 1, 2].map((i) => (
              <motion.rect key={`b-${i}`}
                x={130 + i * 130} y={208} width={120} height={18} rx={3}
                fill={COL_OPT} opacity={0.7}
                animate={{ opacity: step >= 4 ? [0.4, 0.85, 0.4] : 0.7 }}
                transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.4 + 0.5 }}
              />
            ))}
            {[0, 1, 2].map((i) => (
              <text key={`bt-${i}`} x={190 + i * 130} y={221} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="white">
                reduce w{i}
              </text>
            ))}

            <text x={20} y={252} fontSize={9} fontWeight={600} fill={COL_PIPE}>
              → 누적과 환원이 시간축에서 겹침 → GPU 활용률 ↑
            </text>
          </motion.g>

          <defs>
            <marker id="sp-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={COL_PIPE} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
