import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './ProviderTraitVizData';

function Step0() {
  const methods = [
    { label: 'get_balance()', y: 18 },
    { label: 'get_nonce()', y: 46 },
    { label: 'call()', y: 74 },
  ];
  return (<g>
    <text x={30} y={14} fontSize={11} fontWeight={700} fill={C.trait_c}>trait Provider</text>
    {methods.map((m, i) => (
      <motion.g key={m.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <DataBox x={30} y={m.y} w={120} h={22} label={m.label} color={C.trait_c} />
        <text x={165} y={m.y + 14} fontSize={9} fill="var(--muted-foreground)">async fn → Result</text>
      </motion.g>
    ))}
  </g>);
}

function Step1() {
  const parts = [
    { label: 'helios', sub: 'HeliosClient', color: C.helios, y: 15 },
    { label: 'oram', sub: 'ORAMProxy', color: C.oram, y: 48 },
    { label: 'dandelion', sub: 'DandelionRouter', color: C.dandelion, y: 81 },
  ];
  return (<g>
    <text x={30} y={12} fontSize={11} fontWeight={700} fill="var(--foreground)">struct KohakuProvider</text>
    {parts.map((p, i) => (
      <motion.g key={p.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ModuleBox x={30} y={p.y} w={130} h={28} label={p.label} sub={p.sub} color={p.color} />
        <text x={175} y={p.y + 17} fontSize={9} fill="var(--muted-foreground)">
          {i === 0 ? '상태 검증' : i === 1 ? '쿼리 프라이버시' : 'TX 프라이버시'}
        </text>
      </motion.g>
    ))}
  </g>);
}

function Step2() {
  return (<g>
    <ActionBox x={15} y={15} w={100} h={32} label="get_balance()" sub="호출" color={C.trait_c} />
    <motion.line x1={120} y1={31} x2={155} y2={31} stroke={C.oram} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      <ActionBox x={160} y={15} w={100} h={32} label="ORAM 쿼리" sub="더미 혼합" color={C.oram} />
    </motion.g>
    <motion.line x1={265} y1={31} x2={300} y2={31} stroke={C.helios} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ActionBox x={305} y={15} w={110} h={32} label="Merkle 검증" sub="Helios" color={C.helios} />
    </motion.g>
    <motion.text x={240} y={75} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      프라이버시 + 무신뢰 동시 달성
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function ProviderTraitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 110" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
