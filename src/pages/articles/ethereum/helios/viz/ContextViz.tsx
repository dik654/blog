import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C, STEPS } from './ContextVizData';

function Step0() {
  return (<g>
    <ModuleBox x={15} y={10} w={100} h={45} label="Reth" sub="풀 노드" color={C.reth} />
    <motion.line x1={120} y1={32} x2={155} y2={32} stroke={C.reth} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={160} y={12} w={130} h={40} label="execute_block()" sub="모든 TX 재실행" color={C.reth} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <AlertBox x={320} y={8} w={140} h={48} label="디스크 ~1TB" sub="CPU · RAM 높음" color={C.reth} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ModuleBox x={15} y={10} w={100} h={45} label="Helios" sub="경량 클라이언트" color={C.helios} />
    <motion.line x1={120} y1={32} x2={155} y2={32} stroke={C.helios} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={160} y={12} w={130} h={40} label="verify_bls()" sub="서명만 검증" color={C.helios} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={320} y={8} width={140} height={48} rx={8} fill="var(--card)" stroke={C.helios} strokeWidth={0.8} />
      <text x={390} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.helios}>디스크 ~0MB</text>
      <text x={390} y={44} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">CPU · RAM 최소</text>
    </motion.g>
  </g>);
}

function Step2() {
  const items = [
    { label: 'Reth', sub: 'execute_block()', c: C.reth, x: 20 },
    { label: 'Helios', sub: 'verify_bls()', c: C.helios, x: 250 },
  ];
  return (<g>
    {items.map((it, i) => (
      <motion.g key={it.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.3 }}>
        <ActionBox x={it.x} y={15} w={190} h={40} label={`${it.label}: ${it.sub}`} sub={i === 0 ? '상태 루트 비교' : '헤더 루트 비교'} color={it.c} />
      </motion.g>
    ))}
  </g>);
}

function Step3() {
  const stages = [
    { n: 'Bootstrap', x: 15 }, { n: 'Consensus', x: 105 },
    { n: 'Update', x: 195 }, { n: 'State', x: 285 }, { n: 'Execution', x: 375 },
  ];
  return (<g>
    {stages.map((s, i) => (
      <motion.g key={s.n} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={s.x} y={18} width={80} height={32} rx={6} fill="var(--card)" stroke={C.helios} strokeWidth={0.8} />
        <text x={s.x + 40} y={30} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.helios}>{i + 1}</text>
        <text x={s.x + 40} y={42} textAnchor="middle" fontSize={9} fill="var(--foreground)">{s.n}</text>
        {i < 4 && <motion.line x1={s.x + 82} y1={34} x2={s.x + 88} y2={34} stroke="var(--border)" strokeWidth={1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.12 + 0.1 }} />}
      </motion.g>
    ))}
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ContextViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 80" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
