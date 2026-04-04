import { motion } from 'framer-motion';
import { ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: Prepare (All ↔ All) */
export function StepPrepare() {
  const pos = [{ x: 50, y: 20 }, { x: 180, y: 20 }, { x: 50, y: 75 }, { x: 180, y: 75 }];
  const lines: [number, number][] = [];
  for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) lines.push([a, b]);
  return (<g>
    {lines.map(([a, b], i) => (
      <motion.line key={i} x1={pos[a].x + 30} y1={pos[a].y + 15} x2={pos[b].x + 30} y2={pos[b].y + 15}
        stroke={C.pr} strokeWidth={0.7} initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }} transition={{ delay: i * 0.04 }} />
    ))}
    {pos.map((p, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.08, type: 'spring' }}>
        <circle cx={p.x + 30} cy={p.y + 15} r={14} fill={`${C.pr}15`}
          stroke={C.pr} strokeWidth={1} />
        <text x={p.x + 30} y={p.y + 19} textAnchor="middle"
          fontSize={10} fontWeight={600} fill={C.pr}>R{i}</text>
      </motion.g>
    ))}
    <ActionBox x={280} y={30} w={120} h={40} label="O(n²) 메시지" sub="핵심 병목" color={C.err} />
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11} fill={C.pr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      {'2f+1 Prepare 수집 → "prepared" 상태'}
    </motion.text>
  </g>);
}

/* Step 3: Commit */
export function StepCommit() {
  const stages = [
    { label: 'Pre-prepare', color: C.pp, sub: '완료' },
    { label: 'Prepare', color: C.pr, sub: '2f+1' },
    { label: 'Commit', color: C.cm, sub: '2f+1' },
  ];
  return (<g>
    {stages.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15, type: 'spring' }}>
        <ModuleBox x={20 + i * 130} y={20} w={110} h={40}
          label={s.label} sub={s.sub} color={s.color} />
        {i < 2 && (
          <motion.line x1={130 + i * 130} y1={40} x2={150 + i * 130} y2={40}
            stroke={C.cm} strokeWidth={1.2}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.15 + 0.2 }} />
        )}
      </motion.g>
    ))}
    <motion.text x={210} y={90} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.cm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Committed — Safety 보장, 되돌릴 수 없음
    </motion.text>
    <motion.text x={210} y={115} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}>
      {'💡 총 5 message delays (2.5 RTT)'}
    </motion.text>
  </g>);
}
