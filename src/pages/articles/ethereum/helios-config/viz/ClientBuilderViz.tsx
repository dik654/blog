import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'ClientBuilder::new() — 빈 빌더 생성', body: '모든 필드가 None/Default 상태' },
  { label: '.network(Network::Mainnet)', body: 'ConsensusSpec 자동 주입 — genesis_root, fork_versions' },
  { label: '.consensus_rpc(url).execution_rpc(url)', body: 'CL + EL RPC 엔드포인트 설정' },
  { label: '.build() → Result<Client>', body: '필수 필드 검증 후 Client 인스턴스 생성' },
];

const C = { new: '#6b7280', net: '#6366f1', rpc: '#10b981', build: '#f59e0b' };

export default function ClientBuilderViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {STEPS.map((_, i) => {
            const y = 25 + i * 30;
            const colors = [C.new, C.net, C.rpc, C.build];
            const labels = ['new()', '.network()', '.rpc()', '.build()'];
            const active = step >= i;
            const current = step === i;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0.2 }}
                transition={{ delay: current ? 0.1 : 0 }}>
                <rect x={100} y={y} width={280} height={24} rx={6}
                  fill={colors[i] + (current ? '25' : '08')} stroke={colors[i]}
                  strokeWidth={current ? 2 : 1} strokeOpacity={current ? 1 : 0.3} />
                <text x={120} y={y + 16} fontSize={10} fontWeight={current ? 700 : 400} fill={colors[i]} fontFamily="monospace">
                  {labels[i]}
                </text>
                {current && (
                  <motion.text x={370} y={y + 16} textAnchor="end" fontSize={9} fill={colors[i]} fillOpacity={0.7}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {['빈 빌더', 'Spec 주입', 'RPC 설정', 'Client 생성'][i]}
                  </motion.text>
                )}
              </motion.g>
            );
          })}
          <text x={240} y={142} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            {['초기 상태', 'Network → ConsensusSpec', 'CL/EL RPC URL', 'Reth: reth node --chain mainnet'][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
