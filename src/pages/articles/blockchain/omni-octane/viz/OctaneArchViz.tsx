import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const ETH = [
  { label: 'Beacon CL', y: 15, color: '#6366f1' },
  { label: 'Engine API', y: 40, color: '#6366f1' },
  { label: 'geth EL', y: 65, color: '#6366f1' },
];
const OMNI = [
  { label: 'CometBFT', y: 15, color: '#10b981' },
  { label: 'Engine API', y: 40, color: '#10b981' },
  { label: 'Octane EVM', y: 65, color: '#10b981' },
];

const STEPS = [
  { label: '이더리움 vs Omni — 동일 Engine API', body: '이더리움 표준 Engine API를 그대로 사용. geth를 EL로 재사용.' },
  { label: '즉시 최종성 — CometBFT BFT 합의', body: '이더리움 2에폭(12.8분) vs Omni ~1초. 매 블록 즉시 최종성.' },
  { label: '크로스체인 XMsg 라우팅', body: 'Omni Network가 롤업 간 메시지 라우팅. EVM 컨트랙트로 타 롤업 함수 호출.' },
  { label: 'xEVM — 크로스롤업 실행', body: '모든 롤업 상태를 Omni에서 읽을 수 있음. 단일 컨트랙트로 크로스롤업 앱 작성.' },
];

export default function OctaneArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ETH column */}
          <text x={75} y={10} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">이더리움</text>
          {ETH.map((l, i) => (
            <g key={`e-${i}`}>
              <motion.rect x={25} y={l.y} width={100} height={20} rx={4}
                animate={{ fill: step === 0 ? `${l.color}15` : `${l.color}06`,
                  stroke: l.color, strokeWidth: step === 0 && i === 1 ? 2 : 0.6 }} transition={sp} />
              <text x={75} y={l.y + 13} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={l.color} opacity={step === 0 ? 0.9 : 0.4}>{l.label}</text>
            </g>
          ))}

          {/* OMNI column */}
          <text x={255} y={10} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Omni Octane</text>
          {OMNI.map((l, i) => (
            <g key={`o-${i}`}>
              <motion.rect x={205} y={l.y} width={100} height={20} rx={4}
                animate={{ fill: step <= 1 ? `${l.color}15` : `${l.color}06`,
                  stroke: l.color, strokeWidth: (step === 0 && i === 1) || (step === 1 && i === 0) ? 2 : 0.6 }}
                transition={sp} />
              <text x={255} y={l.y + 13} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={l.color} opacity={step <= 1 ? 0.9 : 0.4}>{l.label}</text>
            </g>
          ))}

          {/* Engine API link */}
          {step === 0 && (
            <motion.line x1={127} y1={50} x2={203} y2={50}
              stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp} />
          )}
          {step === 0 && (
            <motion.text x={165} y={47} textAnchor="middle" fontSize={9} fill="#f59e0b"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>동일!</motion.text>
          )}

          {/* finality indicator */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={140} y={82} width={80} height={14} rx={4} fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={180} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">~1초 최종성</text>
            </motion.g>
          )}

          {/* XMsg */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={140} y={82} width={80} height={14} rx={4} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={180} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">
                {step === 2 ? 'XMsg 라우팅' : 'xEVM 실행'}
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
