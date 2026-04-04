import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'eth_call 요청 수신', body: 'CallRequest { to, data, value, gas }' },
  { label: 'ProofDB 생성 + revm 빌드', body: 'Evm::builder().with_db(ProofDB).with_tx_env(tx)' },
  { label: 'evm.transact() — 로컬 실행', body: 'ProofDB가 필요한 계정·스토리지를 증명 기반으로 제공' },
  { label: '결과 반환 (상태 변경 없음)', body: 'result.output() — 읽기 전용, 온체인 영향 없음' },
];

const C = { call: '#6366f1', db: '#10b981', exec: '#f59e0b' };

export default function EthCallViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {[0, 1, 2, 3].map(i => {
            const labels = ['eth_call', 'ProofDB+revm', 'transact()', 'output()'];
            const colors = [C.call, C.db, C.exec, C.call];
            const active = step >= i;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0.2 }}
                transition={{ delay: step === i ? 0.1 : 0 }}>
                <rect x={20 + i * 115} y={50} width={100} height={36} rx={8}
                  fill={colors[i] + (step === i ? '25' : '08')} stroke={colors[i]}
                  strokeWidth={step === i ? 2 : 1} strokeOpacity={step === i ? 1 : 0.3} />
                <text x={70 + i * 115} y={73} textAnchor="middle" fontSize={10}
                  fontWeight={step === i ? 700 : 500} fill={colors[i]}>{labels[i]}</text>
                {i < 3 && (
                  <line x1={120 + i * 115} y1={68} x2={135 + i * 115} y2={68}
                    stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
                )}
              </motion.g>
            );
          })}
          <motion.text key={step} x={240} y={120} textAnchor="middle" fontSize={10}
            fill="currentColor" fillOpacity={0.5} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {['Reth: MDBX 직접 읽기', 'Helios: 증명 기반 가상DB', '증명 검증 후 EVM 실행', '읽기 전용 — 상태 불변'][step]}
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
