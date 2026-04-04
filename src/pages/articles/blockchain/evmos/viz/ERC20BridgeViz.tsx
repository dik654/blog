import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Cosmos Coin 보유', body: '사용자가 Cosmos 네이티브 코인(IBC denom 포함)을 보유합니다.' },
  { label: '모듈에 에스크로', body: 'x/erc20 모듈이 코인을 잠금(에스크로)합니다.' },
  { label: 'ERC20 토큰 민팅', body: '대응하는 ERC20 토큰을 사용자 EVM 주소에 민팅합니다.' },
  { label: '역방향 변환', body: 'ERC20를 burn하면 에스크로된 Cosmos 코인이 반환됩니다.' },
];

export default function ERC20BridgeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 110" className="w-full max-w-xl" style={{ height: 'auto' }}>
          {/* Cosmos side */}
          <motion.g animate={{ opacity: step <= 1 ? 1 : 0.3 }} transition={{ duration: 0.3 }}>
            <rect x={30} y={30} width={100} height={40} rx={6}
              fill="#10b98118" stroke="#10b981"
              strokeWidth={step === 0 ? 1.5 : 0.7} strokeOpacity={step === 0 ? 0.8 : 0.3} />
            <text x={80} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
              fill="#10b981">Cosmos Coin</text>
            <text x={80} y={60} textAnchor="middle" fontSize={9} fill="#10b981"
              fillOpacity={0.5}>bank module</text>
          </motion.g>

          {/* Bridge module */}
          <motion.g animate={{ opacity: step >= 1 && step <= 2 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}>
            <rect x={160} y={30} width={100} height={40} rx={6}
              fill="#8b5cf618" stroke="#8b5cf6"
              strokeWidth={step === 1 ? 1.5 : 0.7} strokeOpacity={step === 1 ? 0.8 : 0.3} />
            <text x={210} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
              fill="#8b5cf6">x/erc20</text>
            <text x={210} y={60} textAnchor="middle" fontSize={9} fill="#8b5cf6"
              fillOpacity={0.5}>escrow + mint</text>
          </motion.g>

          {/* ERC20 side */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}>
            <rect x={290} y={30} width={100} height={40} rx={6}
              fill="#0ea5e918" stroke="#0ea5e9"
              strokeWidth={step === 2 ? 1.5 : 0.7} strokeOpacity={step === 2 ? 0.8 : 0.3} />
            <text x={340} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
              fill="#0ea5e9">ERC20 Token</text>
            <text x={340} y={60} textAnchor="middle" fontSize={9} fill="#0ea5e9"
              fillOpacity={0.5}>EVM contract</text>
          </motion.g>

          {/* Forward arrows */}
          <motion.line x1={132} y1={50} x2={158} y2={50}
            stroke="#10b981" strokeWidth={1} strokeOpacity={step >= 1 ? 0.5 : 0.1}
            markerEnd="url(#erc20arr)" />
          <motion.line x1={262} y1={50} x2={288} y2={50}
            stroke="#8b5cf6" strokeWidth={1} strokeOpacity={step >= 2 ? 0.5 : 0.1}
            markerEnd="url(#erc20arr)" />

          {/* Reverse arrow */}
          {step === 3 && (
            <motion.path d="M290,75 Q210,95 130,75"
              fill="none" stroke="#f59e0b" strokeWidth={1}
              strokeOpacity={0.5} strokeDasharray="4 2"
              markerEnd="url(#erc20arr)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }} />
          )}
          {step === 3 && (
            <text x={210} y={98} textAnchor="middle" fontSize={9}
              fill="#f59e0b" fillOpacity={0.6}>burn → unlock</text>
          )}

          <defs>
            <marker id="erc20arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" fillOpacity={0.3} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
