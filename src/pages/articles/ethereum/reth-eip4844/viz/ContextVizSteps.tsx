import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: L2 비용 */
export function StepL2Cost() {
  return (<g>
    <ModuleBox x={20} y={20} w={90} h={42} label="L2 롤업" sub="TX 배치" color={C.blob} />
    <motion.circle r={4} fill={C.blob}
      initial={{ cx: 115, cy: 41, opacity: 1 }}
      animate={{ cx: 200, cy: 41, opacity: 0 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }} />
    <ModuleBox x={210} y={20} w={90} h={42} label="L1" sub="데이터 게시" color={C.err} />
    <motion.text x={340} y={45} fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      비용 = L2 수수료의 대부분
    </motion.text>
  </g>);
}

/* Step 1: calldata 한계 */
export function StepCalldata() {
  return (<g>
    <AlertBox x={30} y={15} w={160} h={40} label="calldata = 영구 저장"
      sub="임시 데이터에 영구 비용" color={C.err} />
    <AlertBox x={220} y={15} w={170} h={40} label="EVM 가스와 경쟁"
      sub="롤업이 일반 TX를 압박" color={C.err} />
    <motion.text x={210} y={80} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      → 데이터 가용성 전용 공간이 필요
    </motion.text>
  </g>);
}

/* Step 2: Blob TX */
export function StepBlob() {
  const blobs = ['Blob₀', 'Blob₁', 'Blob₂'];
  return (<g>
    <ActionBox x={20} y={20} w={90} h={38} label="Blob TX" sub="Type 3" color={C.blob} />
    {blobs.map((b, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 + 0.2 }}>
        <rect x={140 + i * 80} y={22} width={65} height={34} rx={17}
          fill={`${C.ok}10`} stroke={C.ok} strokeWidth={0.7} />
        <text x={172 + i * 80} y={38} textAnchor="middle" fontSize={10} fill={C.ok}>128KB</text>
        <text x={172 + i * 80} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{b}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      EVM 접근 불가, ~18일(4096 epoch) 후 프루닝, 블록당 최대 768KB
    </motion.text>
  </g>);
}
