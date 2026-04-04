import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 수십만 검증자의 상태 */
export function StepValidators() {
  const fields = [
    { name: 'validators[]', sub: '580K' },
    { name: 'balances[]', sub: '580K' },
    { name: 'randaoMixes', sub: '[65536]' },
    { name: 'slashings', sub: '[8192]' },
  ];
  return (<g>
    <ModuleBox x={200} y={10} w={140} h={45} label="BeaconState" sub="21 필드 (Deneb)" color={C.state} />
    {fields.map((f, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 + 0.3 }}>
        <rect x={25 + i * 100} y={75} width={85} height={32} rx={11}
          fill="var(--card)" stroke={C.state} strokeWidth={0.7} />
        <text x={67 + i * 100} y={90} textAnchor="middle" fontSize={10} fill={C.state}>{f.name}</text>
        <text x={67 + i * 100} y={101} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{f.sub}</text>
      </motion.g>
    ))}
    <text x={210} y={122} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      580,000+ 검증자 × 12초마다 갱신 — 상태 ~150MB
    </text>
  </g>);
}

/* Step 1: 메모리 폭발 */
export function StepMemory() {
  return (<g>
    <AlertBox x={30} y={20} w={150} h={50} label="Deep Copy" sub="~150MB 통째로 복사" color={C.err} />
    <motion.text x={210} y={55} fontSize={18} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>→</motion.text>
    <AlertBox x={240} y={20} w={150} h={50} label="메모리 폭발" sub="3분기 = ~450MB" color={C.err} />
    <motion.text x={210} y={105} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      포크 선택 시 여러 분기 동시 보관 → OOM 위험
    </motion.text>
  </g>);
}

/* Step 2: 해시 병목 */
export function StepHashBottleneck() {
  const fields = ['validators', 'balances', 'randao', 'slashings', 'root'];
  return (<g>
    {fields.map((f, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
        <rect x={30 + i * 75} y={30} width={60} height={28} rx={5}
          fill={`${C.err}12`} stroke={C.err} strokeWidth={0.7} />
        <text x={60 + i * 75} y={48} textAnchor="middle" fontSize={10} fill={C.err}>{f}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.err} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      21필드 × 580K 리프 전체 재해시 → 12초 초과
    </motion.text>
  </g>);
}

/* Step 3: COW 해결 */
export function StepCOW() {
  return (<g>
    <ActionBox x={30} y={20} w={110} h={45} label="State A" sub="원본" color={C.cow} />
    <motion.line x1={145} y1={42} x2={200} y2={42} stroke={C.cow} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={205} y={20} w={110} h={45} label="State B" sub="참조만 공유" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      수정 시에만 해당 필드 복사 → 메모리 ≈ 1.x배
    </motion.text>
  </g>);
}

/* Step 4: FieldTrie */
export function StepFieldTrie() {
  const clean = [0, 1, 3, 4];
  const dirty = [2];
  return (<g>
    {clean.map((_, i) => (
      <motion.rect key={i} x={20 + i * 80} y={30} width={65} height={26} rx={13}
        fill="var(--card)" stroke={C.ok} strokeWidth={0.7}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} />
    ))}
    {clean.map((_, i) => (
      <text key={i} x={52 + i * 80} y={47} textAnchor="middle" fontSize={11} fill={C.ok}>clean</text>
    ))}
    <motion.rect x={20 + 2 * 80} y={30} width={65} height={26} rx={13}
      fill={`${C.hash}18`} stroke={C.hash} strokeWidth={1.5}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
    <text x={52 + 2 * 80} y={47} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.hash}>dirty</text>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.hash}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      dirty 필드만 재해시 → O(log n) 갱신
    </motion.text>
  </g>);
}
