import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: 3가지 동기화 전략 */
export function StepThreeModes() {
  const modes = [
    { label: 'Full', sub: 'Pipeline 전체 실행', color: C.full },
    { label: 'Snap', sub: '상태 다운로드 + 증명', color: C.snap },
    { label: 'Live', sub: 'ExEx 스트림', color: C.live },
  ];
  return (<g>
    {modes.map((m, i) => (
      <motion.g key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ModuleBox x={10 + i * 135} y={25} w={115} h={48} label={m.label} sub={m.sub} color={m.color} />
      </motion.g>
    ))}
    <text x={210} y={100} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      상황에 따라 동기화 전략 선택
    </text>
  </g>);
}

/* Step 4: Snap → Live 전환 */
export function StepTransition() {
  return (<g>
    <ModuleBox x={30} y={30} w={120} h={45} label="Snap Sync" sub="빠른 초기 동기화" color={C.snap} />
    <motion.line x1={155} y1={52} x2={210} y2={52} stroke={C.ok} strokeWidth={1.5}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ModuleBox x={215} y={30} w={120} h={45} label="Live Sync" sub="실시간 블록 처리" color={C.live} />
    </motion.g>
    <motion.text x={185} y={42} textAnchor="middle" fontSize={10} fill={C.ok} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      전환
    </motion.text>
    <text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.ok}>
      최신 블록 도달 → 실시간 모드
    </text>
  </g>);
}
