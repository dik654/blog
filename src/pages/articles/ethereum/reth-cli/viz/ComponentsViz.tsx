import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS, STEP_REFS } from './ComponentsVizData';

const COMPS = [
  { name: 'Pool', sub: 'TransactionPool', color: C.pool },
  { name: 'Evm', sub: 'ConfigureEvm', color: C.evm },
  { name: 'Consensus', sub: 'FullConsensus', color: C.consensus },
  { name: 'Network', sub: 'FullNetwork', color: C.network },
];

function TraitOverview() {
  return (<g>
    {COMPS.map((c, i) => (
      <motion.g key={c.name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <DataBox x={10 + i * 105} y={25} w={95} h={35} label={c.name} sub={c.sub} color={c.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      trait impl 교체만으로 커스텀 노드 구성
    </motion.text>
  </g>);
}

function HighlightComp({ idx }: { idx: number }) {
  return (<g>
    {COMPS.map((c, i) => (
      <motion.g key={c.name} animate={{ opacity: i === idx ? 1 : 0.15 }}>
        <DataBox x={10 + i * 105} y={25} w={95} h={35} label={c.name} sub={c.sub} color={c.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={82} textAnchor="middle" fontSize={10}
      fill={COMPS[idx].color} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      type {COMPS[idx].name}: {COMPS[idx].sub}
    </motion.text>
  </g>);
}

function ContainerStep() {
  return (<g>
    <rect x={20} y={15} width={380} height={60} rx={8} fill="var(--card)" />
    <rect x={20} y={15} width={380} height={60} rx={8}
      fill={`${C.ok}08`} stroke={C.ok} strokeWidth={1} />
    <text x={210} y={33} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>
      Components&lt;Node, Net, Pool, EVM, Cons&gt;
    </text>
    {COMPS.map((c, i) => (
      <motion.g key={c.name} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}>
        <rect x={30 + i * 92} y={42} width={80} height={22} rx={11}
          fill={`${c.color}15`} stroke={c.color} strokeWidth={0.7} />
        <text x={70 + i * 92} y={56} textAnchor="middle" fontSize={9} fill={c.color}>{c.name}</text>
      </motion.g>
    ))}
  </g>);
}

export default function ComponentsViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  const R = [TraitOverview,
    () => <HighlightComp idx={0} />,
    () => <HighlightComp idx={1} />,
    () => <HighlightComp idx={2} />,
    ContainerStep];
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 95" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <S />
            </svg>
            {onOpenCode && STEP_REFS[step] && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">{STEPS[step].label}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
