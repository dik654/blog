import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { indigo: '#6366f1', green: '#10b981', amber: '#f59e0b' };

const STEPS = [
  { label: '게스트: nonce 기반 보고서 요청', body: '랜덤 64-byte nonce 생성 → PSP에 Attestation Report 요청 → VCEK 서명 포함' },
  { label: '보고서 전달', body: '게스트가 report + VCEK 인증서를 Verifier에게 전송' },
  { label: 'Verifier: 인증서 체인 검증', body: 'AMD KDS에서 VCEK 인증서 획득 → VCEK → ASK → ARK 체인 검증' },
  { label: 'Verifier: 서명 + 핵심 필드 검증', body: '서명 검증, measurement == 예상값, report_data == nonce, debug 비활성 확인' },
];

const ACTORS = [
  { label: '게스트 VM', x: 30, color: C.indigo },
  { label: 'PSP', x: 180, color: C.amber },
  { label: 'Verifier', x: 330, color: C.green },
  { label: 'AMD KDS', x: 450, color: C.amber },
];

export default function VerifyFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Actor headers */}
          {ACTORS.map((a) => (
            <g key={a.label}>
              <rect x={a.x} y={10} width={90} height={26} rx={5}
                fill={`${a.color}12`} stroke={a.color} strokeWidth={1.2} />
              <text x={a.x + 45} y={27} textAnchor="middle" fontSize={10} fontWeight={600} fill={a.color}>{a.label}</text>
              <line x1={a.x + 45} y1={36} x2={a.x + 45} y2={150} stroke={`${a.color}30`} strokeWidth={1} strokeDasharray="3 3" />
            </g>
          ))}
          {/* Step 0: guest → PSP */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.1 }}>
            <line x1={75} y1={52} x2={220} y2={52} stroke={C.indigo} strokeWidth={1.2} markerEnd="url(#vfArr)" />
            <rect x={110} y={42} width={68} height={14} rx={3} fill="var(--card)" />
            <text x={144} y={53} textAnchor="middle" fontSize={10} fill={C.indigo}>nonce + 요청</text>
            <line x1={220} y1={68} x2={75} y2={68} stroke={C.amber} strokeWidth={1.2} markerEnd="url(#vfArrA)" />
            <rect x={110} y={60} width={68} height={14} rx={3} fill="var(--card)" />
            <text x={144} y={70} textAnchor="middle" fontSize={10} fill={C.amber}>report+서명</text>
          </motion.g>
          {/* Step 1: guest → verifier */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.1 }}>
            <line x1={75} y1={88} x2={375} y2={88} stroke={C.indigo} strokeWidth={1.2} markerEnd="url(#vfArrG)" />
            <rect x={180} y={78} width={90} height={14} rx={3} fill="var(--card)" />
            <text x={225} y={89} textAnchor="middle" fontSize={10} fill={C.green}>report + VCEK</text>
          </motion.g>
          {/* Step 2: verifier → KDS */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.1 }}>
            <line x1={375} y1={104} x2={495} y2={104} stroke={C.green} strokeWidth={1.2} markerEnd="url(#vfArrA)" />
            <rect x={400} y={94} width={60} height={14} rx={3} fill="var(--card)" />
            <text x={430} y={105} textAnchor="middle" fontSize={10} fill={C.green}>VCEK?</text>
            <line x1={495} y1={118} x2={375} y2={118} stroke={C.amber} strokeWidth={1.2} markerEnd="url(#vfArrG)" />
            <rect x={400} y={110} width={60} height={14} rx={3} fill="var(--card)" />
            <text x={430} y={121} textAnchor="middle" fontSize={10} fill={C.amber}>인증서</text>
          </motion.g>
          {/* Step 3: verifier checks */}
          <motion.g animate={{ opacity: step === 3 ? 1 : 0.1 }}>
            <rect x={340} y={132} width={130} height={18} rx={4}
              fill={`${C.green}15`} stroke={C.green} strokeWidth={1.3} />
            <text x={405} y={145} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>서명+measurement+nonce 검증</text>
          </motion.g>
          <defs>
            <marker id="vfArr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.indigo} />
            </marker>
            <marker id="vfArrA" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.amber} />
            </marker>
            <marker id="vfArrG" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.green} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
