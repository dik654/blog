import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: HotStuff — Star topology O(n) */
export function StepHotStuff() {
  const leader = { x: 155, y: 30 };
  const reps = [{ x: 60, y: 90 }, { x: 155, y: 90 }, { x: 250, y: 90 }];
  return (<g>
    <defs>
      <marker id="hs-a" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
        <path d="M0,0 L6,3 L0,6" fill={C.hs} /></marker>
    </defs>
    <ModuleBox x={110} y={12} w={90} h={38} label="Leader" sub="QC 집계" color={C.hs} />
    {reps.map((r, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12, type: 'spring' }}>
        <circle cx={r.x} cy={r.y} r={14} fill={`${C.pbft}12`}
          stroke={C.pbft} strokeWidth={1} />
        <text x={r.x} y={r.y + 4} textAnchor="middle"
          fontSize={10} fontWeight={600} fill={C.pbft}>R{i + 1}</text>
        <motion.line x1={leader.x} y1={50} x2={r.x} y2={r.y - 14}
          stroke={C.hs} strokeWidth={1.2} markerEnd="url(#hs-a)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.1 + 0.3, duration: 0.3 }} />
      </motion.g>
    ))}
    <motion.text x={355} y={45} fontSize={11} fill={C.hs}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      O(n) 통신
    </motion.text>
    <motion.text x={355} y={65} fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      💡 n개 투표 → 1개 QC
    </motion.text>
    <motion.text x={200} y={120} textAnchor="middle" fontSize={11} fill={C.hs}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      View Change도 O(n) — 정상 경로와 동일 비용
    </motion.text>
  </g>);
}

/* Step 4: Autobahn — Highway + Lanes */
export function StepAutobahn() {
  return (<g>
    <ModuleBox x={30} y={10} w={140} h={38}
      label="Highway" sub="합의 레이어 · 3 delays" color={C.ab} />
    <ActionBox x={230} y={10} w={140} h={38}
      label="Lanes" sub="데이터 전파 · 비동기" color={C.hs} />
    {/* Ride-sharing arrow */}
    <motion.line x1={170} y1={29} x2={230} y2={29}
      stroke={C.ab} strokeWidth={1.2} strokeDasharray="4 2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }} />
    <text x={200} y={22} textAnchor="middle" fontSize={10}
      fill={C.ab}>piggyback</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={70} y={68} w={260} h={38}
        label="Blip 복구" sub="Lanes가 데이터 전파 유지 → Hangover 없음" color={C.hs} />
    </motion.g>
    <motion.text x={200} y={125} textAnchor="middle" fontSize={11} fill={C.ab}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      💡 Fast path 3 delays — 모든 BFT 프로토콜 중 최저 지연
    </motion.text>
  </g>);
}
