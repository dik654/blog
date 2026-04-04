import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: StateProvider trait */
export function StepTrait() {
  const methods = ['account()', 'storage()', 'bytecode()'];
  return (<g>
    <ModuleBox x={30} y={12} w={150} h={50} label="StateProvider"
      sub="trait: 3개 핵심 메서드" color={C.provider} />
    {methods.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.3 }}>
        <rect x={210} y={8 + i * 22} width={95} height={18} rx={9}
          fill={`${C.ok}12`} stroke={C.ok} strokeWidth={0.6} />
        <text x={257} y={20 + i * 22} textAnchor="middle" fontSize={10} fill={C.ok}>{m}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Latest / Historical / Mock — 동일 인터페이스
    </motion.text>
  </g>);
}

/* Step 4: 계층적 조회 */
export function StepLayers() {
  const layers = [
    { label: 'BundleState', sub: '메모리', color: C.mem, y: 10 },
    { label: 'MDBX', sub: '디스크', color: C.db, y: 40 },
    { label: 'StaticFiles', sub: '고대', color: C.file, y: 70 },
  ];
  return (<g>
    {layers.map((l, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={120} y={l.y} w={160} h={24} label={`${l.label} (${l.sub})`} color={l.color} />
        {i < 2 && (
          <motion.line x1={200} y1={l.y + 24} x2={200} y2={l.y + 40}
            stroke={l.color} strokeWidth={0.8} strokeDasharray="3 2" opacity={0.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.12 + 0.3 }} />
        )}
      </motion.g>
    ))}
    <text x={330} y={30} fontSize={10} fill={C.mem}>cache hit → 종료</text>
    <text x={330} y={60} fontSize={10} fill={C.db}>miss → 다음 계층</text>
  </g>);
}
