import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const FIELDS = [
  { label: 'slots_per_epoch: 32', desc: '한 에폭 = 32 슬롯 (6.4분)', c: '#6366f1' },
  { label: 'epochs_per_period: 256', desc: 'Sync Committee 교체 주기 (~27시간)', c: '#10b981' },
  { label: 'genesis_validators_root', desc: '제네시스 검증자 집합의 Merkle 루트', c: '#f59e0b' },
  { label: 'fork_versions', desc: 'Bellatrix · Capella · Deneb 각 4B', c: '#8b5cf6' },
];

export default function ConsensusSpecViz() {
  return (
    <StepViz steps={FIELDS.map(f => ({ label: f.label, body: f.desc }))}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={18} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.3}>ConsensusSpec</text>
          <rect x={70} y={24} width={340} height={90} rx={8} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
          {FIELDS.map((f, i) => {
            const y = 30 + i * 20;
            const active = step === i;
            return (
              <motion.g key={i} animate={{ x: active ? 4 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                <rect x={75} y={y} width={330} height={17} rx={4}
                  fill={f.c + (active ? '20' : '05')} stroke={active ? f.c : 'transparent'} strokeWidth={active ? 1.5 : 0} />
                <text x={85} y={y + 13} fontSize={10} fontWeight={active ? 700 : 400} fill={f.c} fontFamily="monospace">{f.label}</text>
                {active && (
                  <motion.text x={398} y={y + 13} textAnchor="end" fontSize={9} fill={f.c} fillOpacity={0.7}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{f.desc}</motion.text>
                )}
              </motion.g>
            );
          })}
          <text x={240} y={135} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            Reth: EL은 ConsensusSpec 불필요 (ChainSpec에 하드포크만)
          </text>
        </svg>
      )}
    </StepViz>
  );
}
