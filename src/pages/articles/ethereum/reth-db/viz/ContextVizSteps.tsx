import { motion } from 'framer-motion';
import { AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: EL 노드가 저장할 데이터 종류 */
export function StepData() {
  const items = [
    { label: 'Headers', x: 30 }, { label: 'TXs', x: 130 },
    { label: 'Receipts', x: 230 }, { label: 'State', x: 330 },
  ];
  return (<g>
    {items.map((d, i) => (
      <motion.g key={d.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <DataBox x={d.x} y={30} w={80} h={30} label={d.label} color={C.db} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={120} y={82} w={200} h={36} label="DB Engine" sub="수백 GB 저장 + 빠른 조회" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 1: LSM-tree 문제 */
export function StepLSM() {
  const cx = 130;
  const levels = ['L0 (memtable)', 'L1', 'L2', 'L3'];
  return (<g>
    {levels.map((l, i) => {
      const w = 100 + i * 40;
      return (
        <motion.g key={l} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
          <rect x={cx - w / 2} y={10 + i * 28} width={w} height={22} rx={4}
            fill={`${C.err}${10 + i * 4}`} stroke={C.err} strokeWidth={0.7} />
          <text x={cx} y={25 + i * 28} textAnchor="middle" fontSize={10} fill={C.err}>{l}</text>
        </motion.g>
      );
    })}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <text x={330} y={30} fontSize={11} fontWeight={600} fill={C.err}>
        읽기: 여러 레벨 탐색
      </text>
      <AlertBox x={300} y={50} w={120} h={35} label="compaction 간섭" sub="지연 예측 불가" color={C.err} />
    </motion.g>
  </g>);
}

/* Step 2: 고대+최신 혼재 */
export function StepMixed() {
  return (<g>
    <rect x={40} y={25} width={360} height={55} rx={8}
      fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    {Array.from({ length: 8 }, (_, i) => {
      const old = i < 5;
      return (
        <motion.rect key={i} x={50 + i * 42} y={35} width={34} height={34} rx={5}
          fill={old ? `${C.cold}15` : `${C.hot}15`} stroke={old ? C.cold : C.hot} strokeWidth={0.8}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} />
      );
    })}
    <text x={155} y={88} textAnchor="middle" fontSize={10} fill={C.cold}>고대 블록 (대부분)</text>
    <text x={345} y={88} textAnchor="middle" fontSize={10} fill={C.hot}>최신</text>
    <motion.text x={220} y={115} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      B+tree 깊이 ↑ → 최신 조회도 느려짐
    </motion.text>
  </g>);
}
