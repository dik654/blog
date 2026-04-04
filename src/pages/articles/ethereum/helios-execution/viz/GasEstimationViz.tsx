import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'eth_estimateGas(tx) 호출', body: '실행에 필요한 가스량을 미리 추정한다' },
  { label: 'ProofDB 생성 + revm 빌드', body: 'eth_call과 동일한 파이프라인 사용' },
  { label: 'evm.transact() → gas_used 추출', body: 'Reth: 같은 revm이지만 MDBX에서 읽음' },
  { label: '추정치에 마진 추가 후 반환', body: 'gas_used * 1.1 (10% 마진) — 실패 방지' },
];

const C = { est: '#6366f1', exec: '#10b981', gas: '#f59e0b' };

export default function GasEstimationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            {step === 0 && (
              <g>
                <rect x={120} y={45} width={240} height={40} rx={8} fill={C.est + '15'} stroke={C.est} strokeWidth={1.5} />
                <text x={240} y={62} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.est}>eth_estimateGas</text>
                <text x={240} y={77} textAnchor="middle" fontSize={10} fill={C.est} fillOpacity={0.6}>CallRequest { to, data, value }</text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={60} y={45} width={160} height={36} rx={8} fill={C.est + '15'} stroke={C.est} strokeWidth={1.5} />
                <text x={140} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.est}>ProofDB</text>
                <rect x={260} y={45} width={160} height={36} rx={8} fill={C.exec + '15'} stroke={C.exec} strokeWidth={1.5} />
                <text x={340} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.exec}>revm::Evm</text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={120} y={40} width={240} height={46} rx={8} fill={C.exec + '15'} stroke={C.exec} strokeWidth={1.5} />
                <text x={240} y={58} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.exec}>transact()</text>
                <text x={240} y={76} textAnchor="middle" fontSize={10} fill={C.exec} fillOpacity={0.6}>result.gas_used() 추출</text>
              </g>
            )}
            {step === 3 && (
              <g>
                <rect x={120} y={40} width={240} height={46} rx={8} fill={C.gas + '15'} stroke={C.gas} strokeWidth={1.5} />
                <text x={240} y={58} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.gas}>gas_used * 1.1</text>
                <text x={240} y={76} textAnchor="middle" fontSize={10} fill={C.gas} fillOpacity={0.6}>10% 마진 → Out of Gas 방지</text>
              </g>
            )}
          </motion.g>
          <text x={240} y={125} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.4}>
            {['TX 전 가스 추정', 'eth_call과 같은 구조', 'Reth: MDBX 기반 실행', '안전 마진 포함'][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
