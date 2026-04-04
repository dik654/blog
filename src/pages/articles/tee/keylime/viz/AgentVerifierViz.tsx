import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Agent 시작: TPM 초기화 & Registrar 등록' },
  { label: 'Verifier: 주기적 Quote 요청 루프' },
  { label: 'Agent: TPM Quote 생성 & 응답' },
  { label: 'Verifier: 검증 실패 시 철회(Revocation)' },
];

const ANNOT = ['Agent TPM 초기화+EK 등록', 'Verifier 주기적 Quote 요청', 'Agent AIK Quote 서명 응답', 'PCR/IMA 위반 시 철회'];
export default function AgentVerifierViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Agent box */}
          <rect x={20} y={20} width={100} height={50} rx={10}
            fill="#10b98112" stroke="#10b981" strokeWidth={1.5} />
          <text x={70} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">Agent</text>
          <text x={70} y={55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">TPM + mTLS</text>

          {/* Verifier box */}
          <rect x={240} y={20} width={100} height={50} rx={10}
            fill="#6366f112" stroke="#6366f1" strokeWidth={1.5} />
          <text x={290} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">Verifier</text>
          <text x={290} y={55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Tornado + DB</text>

          {/* Arrow direction based on step */}
          {step <= 1 && (
            <motion.line x1={step === 0 ? 120 : 240} y1={45} x2={step === 0 ? 240 : 120} y2={45}
              stroke={step === 0 ? '#10b981' : '#6366f1'} strokeWidth={1.5}
              markerEnd="url(#ah2)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }} />
          )}
          {step === 2 && (
            <motion.line x1={120} y1={45} x2={240} y2={45}
              stroke="#10b981" strokeWidth={1.5} markerEnd="url(#ah2)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }} />
          )}
          {step === 3 && (
            <motion.rect x={240} y={20} width={100} height={50} rx={10}
              fill="#ef444430" stroke="#ef4444" strokeWidth={2.5}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }} />
          )}

          {/* Status indicator */}
          <motion.circle cx={180} cy={120} r={14}
            fill={step === 3 ? '#ef444425' : '#10b98125'}
            stroke={step === 3 ? '#ef4444' : '#10b981'}
            strokeWidth={1.5}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }} />
          <text x={180} y={124} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={step === 3 ? '#ef4444' : '#10b981'}>
            {step === 3 ? 'FAIL' : 'OK'}
          </text>
          <text x={180} y={150} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">
            {['등록 중', 'Quote 요청', 'Quote 응답', '철회 발생'][step]}
          </text>
          <defs>
            <marker id="ah2" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
                  <motion.text x={365} y={85} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
