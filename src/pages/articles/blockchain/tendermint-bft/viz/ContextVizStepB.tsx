import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: Polka 잠금 */
export function StepLocking() {
  return (<g>
    <ActionBox x={20} y={15} w={100} h={38} label="Prevote" sub="블록 B에 투표" color={C.lock} />
    <motion.line x1={120} y1={34} x2={155} y2={34} stroke={C.lock} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <ModuleBox x={155} y={15} w={110} h={38}
      label="Polka 형성" sub={'+2/3 Prevote'} color={C.lock} />
    <motion.line x1={265} y1={34} x2={295} y2={34} stroke={C.tm} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
    <ModuleBox x={295} y={15} w={100} h={38}
      label="잠금(Lock)" sub="B에 고정" color={C.tm} />
    <motion.text x={210} y={82} textAnchor="middle" fontSize={11} fill={C.lock}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      잠금 상태에서는 다른 블록 Precommit 불가
    </motion.text>
    <motion.text x={210} y={108} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}>
      {'💡 Safety 핵심: 잠긴 블록만 확정 가능'}
    </motion.text>
  </g>);
}

/* Step 3: 단일 슬롯 확정성 */
export function StepFinality() {
  return (<g>
    <ModuleBox x={20} y={15} w={130} h={38}
      label="이더리움" sub="~15분 (2 epoch)" color={C.err} />
    <ModuleBox x={260} y={15} w={130} h={38}
      label="Tendermint" sub="1 라운드 (수초)" color={C.tm} />
    <motion.text x={210} y={38} textAnchor="middle" fontSize={13} fontWeight={700}
      fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}>
      vs
    </motion.text>
    <motion.text x={210} y={82} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.tm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      즉시 확정 — 재조직(reorg) 없음
    </motion.text>
    <motion.text x={210} y={108} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      {'💡 Cosmos SDK 체인의 핵심 장점'}
    </motion.text>
  </g>);
}
