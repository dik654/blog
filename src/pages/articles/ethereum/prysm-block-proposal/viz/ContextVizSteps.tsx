import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 매 슬롯 1명 제안 */
export function StepSlotProposal() {
  const slots = [4829, 4830, 4831, 4832];
  return (<g>
    {slots.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
        <rect x={20 + i * 100} y={30} width={80} height={30} rx={6}
          fill={s === 4830 ? `${C.propose}18` : 'var(--card)'}
          stroke={s === 4830 ? C.propose : 'var(--border)'} strokeWidth={s === 4830 ? 1.5 : 0.7} />
        <text x={60 + i * 100} y={49} textAnchor="middle" fontSize={11}
          fill={s === 4830 ? C.propose : 'var(--muted-foreground)'}>{s}</text>
      </motion.g>
    ))}
    <motion.text x={160} y={22} textAnchor="middle" fontSize={10} fill={C.propose} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      당신이 제안자!
    </motion.text>
    <text x={210} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      제안 성공 → 보상 / 실패(12초 초과) → 빈 슬롯
    </text>
  </g>);
}

/* Step 1: 최적 선택 문제 */
export function StepOptimalPick() {
  return (<g>
    <AlertBox x={40} y={18} w={150} h={50} label="12초 데드라인" sub="어테스테이션 선택 + 서명" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <AlertBox x={230} y={18} w={150} h={50} label="RANDAO 서명" sub="정확한 domain 필수" color={C.err} />
    </motion.g>
  </g>);
}

/* Step 2: MEV-Boost */
export function StepMEV() {
  return (<g>
    <ModuleBox x={30} y={20} w={110} h={42} label="로컬 블록" sub="자체 조립" color={C.ok} />
    <text x={210} y={45} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">vs</text>
    <ModuleBox x={280} y={20} w={110} h={42} label="빌더 블록" sub="MEV-Boost" color={C.mev} />
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.mev}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      수익이 높은 쪽을 선택
    </motion.text>
  </g>);
}

/* Step 3: RANDAO 추첨 */
export function StepRANDAO() {
  return (<g>
    <DataBox x={10} y={28} w={100} h={28} label="RANDAO mix" color={C.propose} />
    <motion.line x1={115} y1={42} x2={155} y2={42} stroke={C.propose} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={160} y={22} w={120} h={40} label="ComputeIndex" sub="32 ETH 비례 추첨" color={C.propose} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={300} y={28} w={110} h={28} label="Idx #347,921" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 4: 패킹 → 서명 → 전파 */
export function StepPackSign() {
  const steps = ['패킹', '서명', '전파'];
  return (<g>
    {steps.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ActionBox x={20 + i * 138} y={25} w={110} h={40} label={s}
          sub={['attest 128개', 'BLS sign', 'gossipsub'][i]} color={C.sign} />
        {i < 2 && (
          <motion.line x1={130 + i * 138} y1={45} x2={158 + i * 138} y2={45}
            stroke={C.sign} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.15 + 0.2, duration: 0.2 }} />
        )}
      </motion.g>
    ))}
  </g>);
}
