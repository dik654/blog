import { motion } from 'framer-motion';
import { ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 12초 슬롯 */
export function StepSlotTick() {
  const slots = [4828, 4829, 4830, 4831, 4832];
  return (<g>
    {slots.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
        <rect x={15 + i * 78} y={35} width={65} height={30} rx={6}
          fill={s === 4832 ? `${C.epoch}18` : 'var(--card)'}
          stroke={s === 4832 ? C.epoch : C.slot} strokeWidth={s === 4832 ? 1.5 : 0.8} />
        <text x={47 + i * 78} y={54} textAnchor="middle" fontSize={10}
          fill={s === 4832 ? C.epoch : C.slot}>{s}</text>
        {i < 4 && <line x1={80 + i * 78} y1={50} x2={93 + i * 78} y2={50}
          stroke="var(--border)" strokeWidth={0.6} />}
      </motion.g>
    ))}
    <motion.text x={390} y={30} textAnchor="middle" fontSize={10} fill={C.epoch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Epoch 151
    </motion.text>
    <text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      12초 × 32슬롯 = 1 에폭 (~6.4분) — 4832 = 151 × 32
    </text>
  </g>);
}

/* Step 1: 빈 슬롯 문제 */
export function StepEmptySlot() {
  return (<g>
    <ActionBox x={30} y={20} w={100} h={40} label="Slot 4829" sub="블록 있음" color={C.ok} />
    <AlertBox x={160} y={20} w={100} h={40} label="Slot 4830" sub="빈 슬롯!" color={C.err} />
    <ActionBox x={290} y={20} w={100} h={40} label="Slot 4831" sub="블록 있음" color={C.ok} />
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      4830 캐싱 누락 → 4831 블록 검증 실패
    </motion.text>
  </g>);
}

/* Step 2: 에폭 경계 */
export function StepEpochBoundary() {
  const slots = [4829, 4830, 4831, 4832];
  return (<g>
    {slots.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
        <rect x={20 + i * 100} y={30} width={80} height={30} rx={6}
          fill={s === 4832 ? `${C.epoch}18` : 'var(--card)'}
          stroke={s === 4832 ? C.epoch : 'var(--border)'} strokeWidth={s === 4832 ? 1.5 : 0.7} />
        <text x={60 + i * 100} y={49} textAnchor="middle" fontSize={11}
          fill={s === 4832 ? C.epoch : 'var(--muted-foreground)'}>
          {s}
        </text>
      </motion.g>
    ))}
    <motion.text x={360} y={24} textAnchor="middle" fontSize={10} fill={C.epoch} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Epoch 151 시작!
    </motion.text>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.epoch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      4832 = 151 × 32 → ProcessEpoch 트리거
    </motion.text>
  </g>);
}

/* Step 3: ProcessSlots 루프 */
export function StepProcessSlots() {
  const steps = ['캐싱', 'slot++', '에폭?'];
  return (<g>
    {steps.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ActionBox x={30 + i * 130} y={25} w={100} h={40} label={s}
          sub={['HashTreeRoot', 'SetSlot', 'slot%32==0'][i]} color={C.slot} />
        {i < 2 && (
          <motion.line x1={130 + i * 130} y1={45} x2={160 + i * 130} y2={45}
            stroke={C.slot} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.15 + 0.2, duration: 0.2 }} />
        )}
      </motion.g>
    ))}
    <text x={210} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      한 슬롯씩 전진 — 빈 슬롯도 건너뛰지 않음
    </text>
  </g>);
}

/* Step 4: 링 버퍼 */
export function StepRingBuffer() {
  return (<g>
    <motion.ellipse cx={130} cy={55} rx={80} ry={35} fill="none"
      stroke={C.cache} strokeWidth={1.2} strokeDasharray="4 3"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
    <text x={130} y={50} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.cache}>stateRoots</text>
    <text x={130} y={65} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">[8192]</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={260} y={35} w={120} h={32} label="slot % 8192" sub="순환 인덱스" color={C.cache} />
    </motion.g>
  </g>);
}
