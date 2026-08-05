import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const COL_M1 = '#94a3b8'; // slate (suboptimal)
const COL_M2 = '#10b981'; // emerald (recommended)
const COL_M3 = '#f59e0b'; // amber (alt)

const STEPS = [
  { label: 'PLONK Round 1: f₁(x), f₂(x), f₃(x) 3개 다항식을 동시 커밋해야 한다' },
  { label: '방법 1) 독립 MSM 3회 — 단순하지만 SRS 버킷 테이블 구성을 3번 반복' },
  { label: '방법 2) Batched MSM — SRS 한 번 적재, 캐시 적중률 극대화 (권장)' },
  { label: '방법 3) Concatenated MSM — 스칼라/점을 이어붙여 단일 MSM 호출' },
  { label: '실전: ICICLE/sppark의 batch MSM API가 방법 2를 구현한다' },
];

export default function BatchCommitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Inputs */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill="var(--foreground)">PLONK 입력 다항식 (Round 1)</text>
            <DataBox x={20} y={20} w={80} h={26} label="f₁(x) coeffs" color="#0ea5e9" />
            <DataBox x={110} y={20} w={80} h={26} label="f₂(x) coeffs" color="#0ea5e9" />
            <DataBox x={200} y={20} w={80} h={26} label="f₃(x) coeffs" color="#0ea5e9" />
            <DataBox x={300} y={20} w={150} h={26} label="공통 SRS [G..s^d G]" color="#10b981" outlined />
          </motion.g>

          {/* Method 1: Independent */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 1 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={70} fontSize={10} fontWeight={700} fill={COL_M1}>방법 1) 독립 MSM × 3</text>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <ActionBox x={20 + i * 130} y={78} w={120} h={32}
                  label={`gpu_msm(f${i + 1})`} sub="SRS 버킷 재구성" color={COL_M1} />
              </g>
            ))}
            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                <AlertBox x={394} y={78} w={76} h={32} label="중복 비용" color="#dc2626" />
              </motion.g>
            )}
          </motion.g>

          {/* Method 2: Batched */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 2 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={130} fontSize={10} fontWeight={700} fill={COL_M2}>방법 2) Batched MSM (권장)</text>
            <ModuleBox x={20} y={138} w={300} h={36}
              label="gpu_batch_msm([f₁,f₂,f₃], srs)" sub="SRS 버킷 1회 구성, 3개 다항식 공유" color={COL_M2} />
            <DataBox x={330} y={142} w={50} h={28} label="C₁" color={COL_M2} />
            <DataBox x={385} y={142} w={50} h={28} label="C₂" color={COL_M2} />
            <DataBox x={420} y={142} w={50} h={28} label="C₃" color={COL_M2} />
            {step === 2 && (
              <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}>
                <text x={170} y={188} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={COL_M2}>캐시 적중률 ↑, SRS 메모리 접근 합침</text>
              </motion.g>
            )}
          </motion.g>

          {/* Method 3: Concatenated */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step === 3 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={206} fontSize={10} fontWeight={700} fill={COL_M3}>방법 3) Concatenated MSM</text>
            <DataBox x={20} y={214} w={210} h={28}
              label="concat(f₁, f₂, f₃) × concat(srs, srs, srs)" color={COL_M3} />
            <ActionBox x={240} y={212} w={130} h={32} label="단일 MSM" sub="3(d+1) 크기" color={COL_M3} />
            <DataBox x={376} y={214} w={94} h={28} label="split → C₁,C₂,C₃" color={COL_M3} outlined />
          </motion.g>

          {/* Library hint */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <rect x={20} y={258} width={450} height={18} rx={4} fill={COL_M2 + '14'} stroke={COL_M2} strokeWidth={0.6} />
              <text x={245} y={271} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COL_M2}>ICICLE / sppark batch MSM API → 방법 2 채택</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
