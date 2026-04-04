import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: BLS 집계 + FastAggregateVerify */
export function Step3() {
  const mods = [
    { label: 'FastAggVerify', sub: '패어링 1회', color: C.sign },
    { label: 'BLST C/asm', sub: 'Go 10x', color: C.curve },
    { label: 'PoP 방어', sub: 'Rogue-Key', color: C.agg },
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
      12초 안에 수천 서명 검증 완료
    </motion.text>
  </g>);
}

/* Step 4: 배치 검증 + PoP 방어 */
export function Step4() {
  const items = [
    { label: 'AggVerify', sub: '다수 (pk,msg)', color: C.sign },
    { label: '랜덤 계수', sub: 'Rogue 차단', color: C.agg },
    { label: 'PoP', sub: '등록 시 증명', color: C.curve },
  ];
  return (<g>
    {items.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ModuleBox x={15 + i * 138} y={20} w={118} h={48} label={m.label} sub={m.sub} color={m.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      보안(PoP + 랜덤계수)과 성능(배치검증) 동시 확보
    </motion.text>
  </g>);
}
