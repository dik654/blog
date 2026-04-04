import { motion } from 'framer-motion';
import { ActionBox, ModuleBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: Saturn → Storacha */
export function StepTransition() {
  return (<g>
    <AlertBox x={15} y={22} w={130} h={48} label="Saturn (CDN 전용)" sub="저장 증명 없음" color={C.cdn} />
    <motion.text x={165} y={48} fontSize={14} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>→</motion.text>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={185} y={22} w={200} h={48} label="Storacha (CDN + 저장 증명)"
        sub="PDP 온체인 검증 추가" color={C.store} />
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      CDN만으로는 검증 불가 → PDP로 저장 증명을 추가
    </motion.text>
  </g>);
}

/* Step 1: 3종 노드 */
export function StepNodes() {
  const nodes = [
    { label: 'Storage', sub: '데이터 보관', color: C.store },
    { label: 'Indexing', sub: '위치 추적', color: C.index },
    { label: 'Retrieval', sub: 'CDN 서빙', color: C.cdn },
  ];
  return (<g>
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ModuleBox x={10 + i * 138} y={25} w={120} h={48} label={n.label} sub={n.sub} color={n.color} />
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      역할 분리 → 각 노드가 전문화
    </text>
  </g>);
}
