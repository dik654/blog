import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './MultichainVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 1~3</text>
    <ModuleBox x={120} y={20} w={160} h={45} label="MultiChainProvider" sub="HashMap&lt;ChainId, Provider&gt;" color={C.map} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={100} y={80} width={200} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={200} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        체인별 독립 KohakuProvider 관리
      </text>
    </motion.g>
  </g>);
}

function Step1() {
  const chains = [
    { label: 'Ethereum', sub: 'chain: 1', x: 15, color: '#6366f1' },
    { label: 'Optimism', sub: 'chain: 10', x: 170, color: '#ef4444' },
    { label: 'Base', sub: 'chain: 8453', x: 325, color: '#0ea5e9' },
  ];
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 5~8: add_chain()</text>
    {chains.map((ch, i) => (
      <motion.g key={ch.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2 }}>
        <ModuleBox x={ch.x} y={22} w={130} h={55} label={ch.label} sub={ch.sub} color={ch.color} />
        <text x={ch.x + 65} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          Helios + ORAM + Dandelion
        </text>
      </motion.g>
    ))}
  </g>);
}

function Step2() {
  const chains = [
    { label: 'ETH', x: 30, color: '#6366f1' },
    { label: 'OP', x: 170, color: '#ef4444' },
    { label: 'Base', x: 310, color: '#0ea5e9' },
  ];
  return (<g>
    {chains.map((ch, i) => (
      <motion.g key={ch.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.15 }}>
        <DataBox x={ch.x} y={20} w={110} h={26} label={`${ch.label} Provider`} color={ch.color} />
        <rect x={ch.x} y={52} width={110} height={35} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={ch.x + 55} y={67} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          쿼리 패턴 격리
        </text>
        <text x={ch.x + 55} y={80} textAnchor="middle" fontSize={8} fill={ch.color}>
          독립 경량 클라이언트
        </text>
      </motion.g>
    ))}
    <motion.text x={240} y={108} textAnchor="middle" fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      크로스체인 프로파일링 불가
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function MultichainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 120" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
