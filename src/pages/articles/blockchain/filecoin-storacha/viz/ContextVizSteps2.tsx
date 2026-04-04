import { motion } from 'framer-motion';
import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: UCAN 인증 */
export function StepUCAN() {
  const chain = ['Alice', 'Bob', 'Carol'];
  return (<g>
    {chain.map((name, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <DataBox x={20 + i * 130} y={30} w={100} h={30} label={name} sub="키페어" color={C.ucan} />
        {i < 2 && (
          <motion.line x1={120 + i * 130} y1={45} x2={150 + i * 130} y2={45}
            stroke={C.ucan} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.15 + 0.2, duration: 0.2 }} />
        )}
      </motion.g>
    ))}
    <text x={210} y={22} textAnchor="middle" fontSize={11} fill={C.ucan}>
      UCAN: 권한 위임 체인 (서버 불필요)
    </text>
    <text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      local-first: 오프라인에서도 권한 생성 가능
    </text>
  </g>);
}

/* Step 3: Forge */
export function StepForge() {
  return (<g>
    <ModuleBox x={15} y={20} w={130} h={48} label="Forge" sub="$5.99/TB warm storage" color={C.forge} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ActionBox x={170} y={20} w={100} h={48} label="IPFS CID" sub="즉시 접근" color={C.cdn} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <ActionBox x={295} y={20} w={110} h={48} label="PDP 증명" sub="온체인 검증" color={C.store} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.forge}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      봉인 없이 즉시 리트리벌 + 온체인 저장 증명
    </motion.text>
  </g>);
}
