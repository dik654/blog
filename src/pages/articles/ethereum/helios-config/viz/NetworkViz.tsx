import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NETS = [
  { label: 'Mainnet', desc: '프로덕션 네트워크 (chain_id: 1)', c: '#6366f1' },
  { label: 'Sepolia', desc: '테스트넷 (chain_id: 11155111)', c: '#10b981' },
  { label: 'Holesky', desc: '테스트넷 (chain_id: 17000)', c: '#f59e0b' },
];

export default function NetworkViz() {
  return (
    <StepViz steps={NETS.map(n => ({ label: `Network::${n.label}`, body: n.desc }))}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={20} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.3}>enum Network</text>
          {NETS.map((n, i) => {
            const active = step === i;
            const y = 30 + i * 36;
            return (
              <motion.g key={i} animate={{ x: active ? 8 : 0 }} transition={{ type: 'spring', stiffness: 300 }}>
                <rect x={100} y={y} width={280} height={30} rx={8}
                  fill={n.c + (active ? '25' : '08')} stroke={n.c} strokeWidth={active ? 2 : 1} strokeOpacity={active ? 1 : 0.3} />
                <text x={130} y={y + 19} fontSize={11} fontWeight={active ? 700 : 500} fill={n.c}>{n.label}</text>
                {active && (
                  <motion.text x={370} y={y + 19} textAnchor="end" fontSize={10} fill={n.c} fillOpacity={0.6}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{n.desc}</motion.text>
                )}
              </motion.g>
            );
          })}
          <text x={240} y={142} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            {['Reth: ChainSpec::mainnet()', 'Reth: ChainSpec::sepolia()', 'Reth: ChainSpec::holesky()'][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
