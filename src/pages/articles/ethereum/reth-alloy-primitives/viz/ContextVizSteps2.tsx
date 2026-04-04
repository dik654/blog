import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: alloy 스택 할당 타입 */
export function StepStackAlloc() {
  const types = [
    { label: 'Address', sub: '[u8; 20]', w: 90 },
    { label: 'B256', sub: '[u8; 32]', w: 80 },
    { label: 'U256', sub: '4 x u64', w: 80 },
  ];
  return (<g>
    {types.map((t, i) => (
      <motion.g key={t.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ModuleBox x={15 + i * 130} y={22} w={t.w} h={48}
          label={t.label} sub={t.sub} color={C.stack} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      전부 스택 — 힙 할당 0, Copy trait
    </motion.text>
  </g>);
}

/* Step 4: derive 매크로 */
export function StepDerive() {
  return (<g>
    <ActionBox x={30} y={20} w={160} h={42} label="#[derive(RlpEncodable)]"
      sub="컴파일 타임 코드 생성" color={C.macro} />
    <motion.line x1={195} y1={41} x2={240} y2={41} stroke={C.macro} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <ModuleBox x={245} y={18} w={140} h={46} label="인코더 생성"
        sub="리플렉션 0 + 인라인 가능" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      LLVM이 타입별 최적 코드를 인라인
    </motion.text>
  </g>);
}
