import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: MEV란 */
export function StepMevIntro() {
  const txs = ['TX₀', 'TX₁', 'TX₂', 'TX₃'];
  return (<g>
    <text x={15} y={25} fontSize={11} fill="var(--muted-foreground)">블록 내 TX 순서:</text>
    {txs.map((tx, i) => (
      <motion.g key={tx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={15 + i * 55} y={32} width={45} height={20} rx={10}
          fill={`${i === 1 ? C.mev : C.local}12`}
          stroke={i === 1 ? C.mev : C.local} strokeWidth={0.7} />
        <text x={37 + i * 55} y={46} textAnchor="middle" fontSize={10}
          fill={i === 1 ? C.mev : C.local}>{tx}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <text x={265} y={46} fontSize={11} fill={C.mev} fontWeight={600}>← 순서 조작 = MEV</text>
    </motion.g>
    <text x={210} y={85} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      아비트라지·청산·샌드위치 — 검증자 수익과 직결
    </text>
  </g>);
}

/* Step 1: 네트워크 건강성 위협 */
export function StepHealthThreat() {
  return (<g>
    <AlertBox x={30} y={15} w={160} h={50} label="샌드위치 공격"
      sub="사용자 TX 앞뒤로 끼워넣기" color={C.mev} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <AlertBox x={220} y={15} w={170} h={50} label="프론트러닝"
        sub="큰 주문을 앞질러 수익 확보" color={C.builder} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.mev}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      검증자가 직접 MEV 추출 → 네트워크 중앙화 가속
    </motion.text>
  </g>);
}

/* Step 2: 외부 의존 리스크 */
export function StepRelayRisk() {
  return (<g>
    <ModuleBox x={30} y={20} w={100} h={42} label="Proposer" sub="블록 제안" color={C.ok} />
    <motion.line x1={135} y1={41} x2={175} y2={41} stroke={C.relay} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <AlertBox x={180} y={20} w={115} h={42} label="Relay 장애" sub="응답 없음" color={C.mev} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <text x={350} y={40} fontSize={11} fill={C.mev} fontWeight={600}>?</text>
      <text x={350} y={55} fontSize={10} fill="var(--muted-foreground)">블록 생산 중단</text>
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.mev}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      로컬 폴백 없으면 liveness 위협 + 검열 저항성 약화
    </motion.text>
  </g>);
}
