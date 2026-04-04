import { motion } from 'framer-motion';
import { AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 매 블록마다 상태 루트 */
export function StepStateRoot() {
  return (<g>
    {Array.from({ length: 5 }, (_, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
        <rect x={15 + i * 68} y={30} width={58} height={28} rx={5}
          fill="var(--card)" stroke={C.trie} strokeWidth={0.8} />
        <text x={44 + i * 68} y={48} textAnchor="middle" fontSize={10} fill={C.trie}>Block #{i}</text>
        {i < 4 && <line x1={73 + i * 68} y1={44} x2={83 + i * 68} y2={44}
          stroke="var(--border)" strokeWidth={0.6} />}
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={135} y={72} w={150} h={36} label="StateRoot 계산"
        sub="12초 안에 완료해야 함" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 1: 전체 trie 재계산 문제 */
export function StepFullRecalc() {
  const nodes = 7;
  return (<g>
    {Array.from({ length: nodes }, (_, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
        <circle cx={30 + i * 52} cy={45} r={14} fill={`${C.err}12`} stroke={C.err} strokeWidth={0.8} />
        <text x={30 + i * 52} y={49} textAnchor="middle" fontSize={10} fill={C.err}>N{i}</text>
      </motion.g>
    ))}
    <motion.rect x={10} y={25} width={370} height={40} rx={8} fill="transparent"
      stroke={C.err} strokeWidth={1.2} strokeDasharray="5 3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      ~280M 계정 전체 순회 — 변경이 1개여도
    </motion.text>
    <motion.text x={210} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      Geth: dirty trie commit 2~5초 소요
    </motion.text>
  </g>);
}

/* Step 2: PrefixSet */
export function StepPrefixSet() {
  const keys = ['0xa1..', '0xa1..', '0xb3..'];
  return (<g>
    <AlertBox x={30} y={20} w={120} h={48} label="변경된 키" sub="블록 실행 결과" color={C.change} />
    <motion.line x1={155} y1={44} x2={200} y2={44} stroke={C.change} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={205} y={15} width={180} height={60} rx={8}
        fill={`${C.ok}08`} stroke={C.ok} strokeWidth={1} />
      <text x={295} y={33} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ok}>PrefixSet</text>
      {keys.map((k, i) => (
        <text key={i} x={225} y={47 + i * 10} fontSize={10} fill="var(--muted-foreground)">{k}</text>
      ))}
    </motion.g>
    <text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.ok}>
      BTreeSet.range()로 O(log n) 판단
    </text>
  </g>);
}
