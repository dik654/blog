import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: GossipSub 메시 + 3단계 검증 */
export function Step3() {
  const mods = [
    { label: 'Mesh D=8', sub: '토픽별 전파', color: C.mesh },
    { label: '검증 파이프라인', sub: 'Accept/Reject', color: C.ok },
    { label: 'Fork Digest', sub: '네트워크 격리', color: C.topic },
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
      O(D) 대역폭으로 전체 네트워크 도달
    </motion.text>
  </g>);
}

/* Step 4: SSZ-Snappy 인코딩 + 메시 유지보수 */
export function Step4() {
  const items = [
    { label: 'SSZ-Snappy', sub: '대역폭 절약', color: C.ok },
    { label: 'GRAFT/PRUNE', sub: 'D_low~D_high', color: C.mesh },
    { label: 'Opp. Graft', sub: '피어 교체', color: C.msg },
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
      압축 + 메시 자가 복구로 네트워크 탄력성 확보
    </motion.text>
  </g>);
}
