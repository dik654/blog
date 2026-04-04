import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Chain A에서 IBC 전송', body: 'ERC20 토큰을 IBC 패킷으로 다른 체인에 전송합니다.' },
  { label: 'ERC20 Middleware 변환', body: '송신 시 ERC20→Cosmos 코인 변환, 수신 시 역변환합니다.' },
  { label: 'IBC Transfer 실행', body: 'IBC Transfer Module이 패킷을 릴레이어로 전송합니다.' },
  { label: 'Chain B에서 수신', body: '수신 체인에서 Cosmos 코인 민팅 후 ERC20 자동 변환합니다.' },
];

export default function IBCMiddlewareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 120" className="w-full max-w-xl" style={{ height: 'auto' }}>
          {/* Chain A */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}>
            <rect x={20} y={25} width={90} height={60} rx={6}
              fill="#0ea5e908" stroke="#0ea5e9"
              strokeWidth={step === 0 ? 1.2 : 0.5}
              strokeOpacity={step === 0 ? 0.7 : 0.2} />
            <text x={65} y={45} textAnchor="middle" fontSize={9}
              fontWeight={600} fill="#0ea5e9">Chain A</text>
            <text x={65} y={58} textAnchor="middle" fontSize={9}
              fill="#0ea5e9" fillOpacity={0.5}>Cosmos EVM</text>
            <text x={65} y={70} textAnchor="middle" fontSize={9}
              fill="#0ea5e9" fillOpacity={0.4}>ERC20 Token</text>
          </motion.g>

          {/* Middleware stack */}
          <motion.g animate={{ opacity: step >= 1 && step <= 2 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}>
            {/* Callbacks */}
            <rect x={140} y={15} width={160} height={18} rx={4}
              fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={0.7}
              strokeOpacity={step === 1 ? 0.6 : 0.15} />
            <text x={220} y={27} textAnchor="middle" fontSize={9}
              fontWeight={500} fill="#8b5cf6">IBC Callbacks Middleware</text>
            {/* ERC20 */}
            <rect x={140} y={38} width={160} height={18} rx={4}
              fill="#10b98110" stroke="#10b981"
              strokeWidth={step === 1 ? 1.2 : 0.7}
              strokeOpacity={step === 1 ? 0.7 : 0.15} />
            <text x={220} y={50} textAnchor="middle" fontSize={9}
              fontWeight={600} fill="#10b981">ERC20 Middleware</text>
            {/* Transfer */}
            <rect x={140} y={61} width={160} height={18} rx={4}
              fill="#f59e0b10" stroke="#f59e0b"
              strokeWidth={step === 2 ? 1.2 : 0.7}
              strokeOpacity={step === 2 ? 0.7 : 0.15} />
            <text x={220} y={73} textAnchor="middle" fontSize={9}
              fontWeight={600} fill="#f59e0b">IBC Transfer Module</text>
          </motion.g>

          {/* Chain B */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}>
            <rect x={330} y={25} width={90} height={60} rx={6}
              fill="#f59e0b08" stroke="#f59e0b"
              strokeWidth={step === 3 ? 1.2 : 0.5}
              strokeOpacity={step === 3 ? 0.7 : 0.2} />
            <text x={375} y={45} textAnchor="middle" fontSize={9}
              fontWeight={600} fill="#f59e0b">Chain B</text>
            <text x={375} y={58} textAnchor="middle" fontSize={9}
              fill="#f59e0b" fillOpacity={0.5}>Other Chain</text>
            <text x={375} y={70} textAnchor="middle" fontSize={9}
              fill="#f59e0b" fillOpacity={0.4}>Native Coin</text>
          </motion.g>

          {/* Arrows */}
          <line x1={112} y1={55} x2={138} y2={55}
            stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.15}
            markerEnd="url(#ibcarr)" />
          <line x1={302} y1={55} x2={328} y2={55}
            stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.15}
            markerEnd="url(#ibcarr)" />

          {/* IBC label */}
          <text x={220} y={100} textAnchor="middle" fontSize={9}
            fill="currentColor" fillOpacity={0.3}>
            IBC 패킷 전송 (릴레이어)
          </text>

          <defs>
            <marker id="ibcarr" markerWidth="5" markerHeight="5"
              refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" fillOpacity={0.3} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
