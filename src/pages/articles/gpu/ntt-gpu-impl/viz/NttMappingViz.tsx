import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const COL_FFT = '#94a3b8';
const COL_NTT = '#10b981';
const COL_MATH = '#0ea5e9';
const COL_ZK = '#8b5cf6';

const STEPS = [
  { label: 'NTT = 유한체 위의 FFT — 복소수 W를 단위근 w로 대체' },
  { label: 'FFT 나비:  a\' = a + W·b,    b\' = a - W·b   (복소수)' },
  { label: 'NTT 나비:  a\' = (a + w·b) mod p,    b\' = (a - w·b) mod p   (Fp)' },
  { label: 'n = 2^k → 스테이지 k개, 스테이지당 나비 n/2개 → 전체 O(n log n)' },
  { label: 'ZK 전형 크기: Groth16 n=2^20~2^24, PLONK n=2^22~2^28' },
];

export default function NttMappingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* FFT vs NTT comparison */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}>
            <ModuleBox x={20} y={20} w={210} h={56} label="FFT" sub="복소수 (부동소수점)" color={COL_FFT} />
            <text x={252} y={50} fontSize={11} fontWeight={700} fill={COL_NTT}>→</text>
            <ModuleBox x={272} y={20} w={190} h={56} label="NTT" sub="유한체 Fp (정확함)" color={COL_NTT} />
          </motion.g>

          {/* Butterfly equations */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={96} fontSize={9} fontWeight={700} fill={COL_FFT}>FFT 나비</text>
            <DataBox x={20} y={102} w={210} h={28}
              label="a' = a + W·b,  b' = a - W·b" color={COL_FFT} />
          </motion.g>

          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={272} y={96} fontSize={9} fontWeight={700} fill={COL_NTT}>NTT 나비</text>
            <DataBox x={272} y={102} w={190} h={28}
              label="(a ± w·b) mod p" color={COL_NTT} outlined />
          </motion.g>

          {/* Complexity */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={148} fontSize={10} fontWeight={700} fill={COL_MATH}>
              n = 2^k 일 때
            </text>
            <DataBox x={20} y={154} w={130} h={28} label="스테이지 k개" color={COL_MATH} />
            <DataBox x={158} y={154} w={150} h={28} label="스테이지당 나비 n/2" color={COL_MATH} />
            <DataBox x={316} y={154} w={148} h={28} label="전체 O(n log n)" color={COL_MATH} outlined />
          </motion.g>

          {/* ZK typical sizes */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 4 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={198} fontSize={10} fontWeight={700} fill={COL_ZK}>ZK 증명 전형 크기</text>
            <ActionBox x={20} y={204} w={210} h={30}
              label="Groth16: n = 2²⁰ ~ 2²⁴" sub="다항식 차수" color={COL_ZK} />
            <ActionBox x={250} y={204} w={210} h={30}
              label="PLONK: n = 2²² ~ 2²⁸" sub="게이트 수" color={COL_ZK} />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
