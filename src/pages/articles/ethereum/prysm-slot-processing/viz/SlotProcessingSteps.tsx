import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { C } from './SlotProcessingVizData';

export function Step0() {
  const slots = [4800, 4801, 4802, 4803, 4804];
  return (<g>
    {slots.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={20 + i * 75} y={20} width={65} height={32} rx={6}
          fill="var(--card)" stroke={i === 2 ? C.slot : 'var(--border)'} strokeWidth={i === 2 ? 1.5 : 0.5} />
        <text x={52 + i * 75} y={35} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={i === 2 ? C.slot : 'var(--foreground)'}>{s}</text>
        <text x={52 + i * 75} y={47} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">{i === 2 ? '빈 슬롯' : '12초'}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      빈 슬롯도 상태 루트를 캐싱해야 체인이 연속
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <ModuleBox x={20} y={15} w={120} h={40} label="ProcessSlots()" sub="state.Slot() &lt; target" color={C.loop} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={180} y={10} width={210} height={70} rx={8}
        fill="var(--card)" stroke={C.loop} strokeWidth={0.6} strokeDasharray="4 3" />
      <text x={285} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.loop}>for 루프</text>
      <text x={285} y={44} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">slot = 4800 → 4801 → 4802</text>
      <text x={285} y={60} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">빈 슬롯도 하나씩 반복</text>
    </motion.g>
    <motion.line x1={145} y1={35} x2={175} y2={35} stroke={C.loop} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
  </g>);
}

export function Step2() {
  return (<g>
    <ActionBox x={20} y={15} w={120} h={38} label="HashTreeRoot()" sub="상태 루트 계산" color={C.cache} />
    <motion.line x1={145} y1={34} x2={180} y2={34} stroke={C.cache} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
      <rect x={185} y={8} width={200} height={65} rx={8} fill="var(--card)" stroke={C.cache} strokeWidth={0.6} />
      <text x={285} y={26} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cache}>stateRoots 링 버퍼</text>
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <motion.rect key={i} x={195 + i * 22} y={36} width={18} height={18} rx={3}
          fill={i === 3 ? `${C.cache}30` : 'var(--muted)'}
          stroke={i === 3 ? C.cache : 'var(--border)'} strokeWidth={i === 3 ? 1 : 0.4}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.05 }} />
      ))}
      <text x={285} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">slot % 8192에 저장</text>
    </motion.g>
  </g>);
}

export function Step3() {
  return (<g>
    <DataBox x={60} y={15} w={100} h={28} label="state.Slot()" color={C.loop} />
    <motion.line x1={165} y1={29} x2={200} y2={29} stroke={C.inc} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={205} y={12} w={120} h={36} label="SetSlot(slot + 1)" sub="상태 전환 핵심" color={C.inc} />
    </motion.g>
    <motion.text x={210} y={70} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      4800 → 4801: 슬롯 카운터 1 증가
    </motion.text>
  </g>);
}
