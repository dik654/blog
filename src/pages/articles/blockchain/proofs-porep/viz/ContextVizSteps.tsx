import { motion } from 'framer-motion';
import { ActionBox, AlertBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 왜 봉인이 필요한가 */
export function StepWhy() {
  return (<g>
    <AlertBox x={20} y={20} w={170} h={55} label="복사본 하나로 속이기" sub="같은 데이터를 N번 주장" color={C.err} />
    <motion.text x={220} y={48} fontSize={14} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>→</motion.text>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <ActionBox x={240} y={20} w={160} h={55} label="봉인(Seal)" sub="SP 고유 형태로 변환" color={C.pc1} />
    </motion.g>
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      물리적 저장 공간을 실제로 사용했음을 보장
    </motion.text>
  </g>);
}

/* Step 1: SDR 그래프 */
export function StepPC1() {
  const layers = Array.from({ length: 5 }, (_, i) => i);
  return (<g>
    {layers.map((i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
        <rect x={30 + i * 8} y={20 + i * 14} width={120} height={12} rx={3}
          fill={`${C.pc1}${15 + i * 8}`} stroke={C.pc1} strokeWidth={0.5} />
        <text x={90 + i * 8} y={29 + i * 14} textAnchor="middle" fontSize={10} fill={C.pc1}>
          Layer {i + 1}
        </text>
      </motion.g>
    ))}
    <text x={90} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">... 총 11층</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <ModuleBox x={240} y={25} w={150} h={50} label="SHA256 순차 계산" sub="~4억 노드 / 병렬화 불가" color={C.pc1} />
    </motion.g>
  </g>);
}
