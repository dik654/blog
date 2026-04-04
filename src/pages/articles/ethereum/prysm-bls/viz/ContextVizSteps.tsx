import { motion } from 'framer-motion';
import { ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 검증자 투표 집계 — 실제 BLS 크기 표시 */
export function Step0() {
  return (<g>
    {Array.from({ length: 5 }, (_, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}>
        <rect x={10 + i * 42} y={22} width={36} height={28} rx={11}
          fill={`${C.curve}12`} stroke={C.curve} strokeWidth={0.7} />
        <text x={28 + i * 42} y={35} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.curve}>sig{i}</text>
        <text x={28 + i * 42} y={45} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">96B</text>
      </motion.g>
    ))}
    <motion.text x={230} y={42} fontSize={14} fill={C.agg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      →
    </motion.text>
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 }}>
      <ActionBox x={260} y={22} w={130} h={38} label="집계 서명" sub="단일 96B (G2 점)" color={C.sign} />
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      수만 검증자 x 96B → 집계 후 단일 96B 서명
    </text>
  </g>);
}

/* Step 1: 블록당 수천 서명 */
export function Step1() {
  return (<g>
    <AlertBox x={60} y={15} w={140} h={50}
      label="개별 검증" sub="패어링 2회 x 수천" color={C.err} />
    <motion.text x={235} y={45} fontSize={14} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      {'>>'}
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={270} y={18} w={100} h={42} label="12초 슬롯" sub="시간 부족" color={C.err} />
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      개별 검증 = 12초 안에 처리 불가
    </motion.text>
  </g>);
}

/* Step 2: Rogue-Key 공격 */
export function Step2() {
  return (<g>
    <AlertBox x={110} y={18} w={200} h={55}
      label="Rogue-Key 공격" sub="pk 상쇄로 서명 위조" color={C.err} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.agg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      방어: Proof of Possession — 검증자 등록 시 pk 소유 증명
    </motion.text>
  </g>);
}

