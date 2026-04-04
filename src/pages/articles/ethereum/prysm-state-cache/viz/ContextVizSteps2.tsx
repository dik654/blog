import { motion } from 'framer-motion';
import { ModuleBox, StatusBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: Hot/Cold + Replay */
export function Step3() {
  const mods = [
    { label: 'Hot Cache', sub: '최근 인메모리', color: C.hot },
    { label: 'Cold DB', sub: '에폭 경계', color: C.cold },
    { label: 'Replay', sub: '블록 재적용', color: C.replay },
  ];
  return (<g>
    {mods.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ModuleBox x={15 + i * 138} y={20} w={118} h={48} label={m.label} sub={m.sub} color={m.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Hot 히트율 90%+ / 빈 슬롯은 Replay로 해결
    </motion.text>
  </g>);
}

/* Step 4: StateSummary + 캐시 교체 */
export function Step4() {
  const items = [
    { label: 'Summary', n: 'slot+root', p: 1, color: C.replay },
    { label: 'Hot', n: '히트율 90%+', p: 0.9, color: C.hot },
    { label: 'Hot→Cold', n: 'Finalized 경계', p: 0.6, color: C.cold },
  ];
  return (<g>
    {items.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.12 }}>
        <StatusBox x={15 + i * 138} y={18} w={118} h={55} label={s.label}
          sub={s.n} color={s.color} progress={s.p} />
      </motion.g>
    ))}
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      StateSummary + 자동 전환으로 메모리·디스크 균형
    </motion.text>
  </g>);
}
