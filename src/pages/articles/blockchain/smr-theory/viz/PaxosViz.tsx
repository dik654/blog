import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'Paxos 2-Phase 합의', body: 'Proposer가 Prepare → Accept 두 단계로 과반 Acceptor의 동의를 얻어 값을 결정.' },
  { label: 'Phase 1: Prepare(n)', body: 'Proposer가 제안 번호 n으로 Prepare 메시지를 전송. Acceptor는 n이 기존보다 크면 Promise 응답.' },
  { label: 'Phase 2: Accept(n, v)', body: '과반 Promise 수신 → 값 v를 선택하여 Accept 전송. Acceptor가 수락하면 Accepted 응답.' },
  { label: '값 결정 (Chosen)', body: '과반 Accepted 수신 → 값 v가 결정됨. 이후 어떤 Proposer도 같은 값만 결정 가능 (safety).' },
];

const ROLES = [
  { label: 'Proposer', x: 50, y: 65, color: C1 },
  { label: 'A1', x: 210, y: 25, color: C2 },
  { label: 'A2', x: 210, y: 65, color: C2 },
  { label: 'A3', x: 210, y: 105, color: C2 },
  { label: 'Learner', x: 360, y: 65, color: C3 },
];

export default function PaxosViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Roles */}
          {ROLES.map((r) => (
            <motion.g key={r.label} animate={{ opacity: step === 0 ? 0.5 : 1 }}>
              <rect x={r.x - 30} y={r.y} width={60} height={22} rx={4}
                fill={`${r.color}10`} stroke={r.color} strokeWidth={0.8} />
              <text x={r.x} y={r.y + 14} textAnchor="middle" fontSize={10} fontWeight={500} fill={r.color}>
                {r.label}
              </text>
            </motion.g>
          ))}
          {/* Phase 1: Prepare arrows */}
          {step >= 1 && [0, 1, 2].map(i => (
            <motion.g key={`p${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              transition={{ delay: i * 0.08 }}>
              <line x1={80} y1={76} x2={180} y2={ROLES[i + 1].y + 11}
                stroke={C1} strokeWidth={0.7} />
              {/* Label */}
              {i === 0 && (
                <g>
                  <rect x={110} y={38} width={55} height={13} rx={2} fill="none" stroke={C1} strokeWidth={0.5} />
                  <text x={137} y={48} textAnchor="middle" fontSize={10} fill={C1}>Prepare(n)</text>
                </g>
              )}
            </motion.g>
          ))}
          {/* Phase 1: Promise arrows back */}
          {step >= 1 && [0, 1].map(i => (
            <motion.line key={`pr${i}`} x1={180} y1={ROLES[i + 1].y + 11} x2={80} y2={76}
              stroke={C2} strokeWidth={0.5} strokeDasharray="2,2"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
              transition={{ delay: 0.3 + i * 0.1 }} />
          ))}
          {/* Phase 2: Accept arrows */}
          {step >= 2 && [0, 1, 2].map(i => (
            <motion.g key={`a${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              transition={{ delay: i * 0.08 }}>
              <line x1={80} y1={76} x2={180} y2={ROLES[i + 1].y + 11}
                stroke={C2} strokeWidth={0.8} />
              {i === 2 && (
                <g>
                  <rect x={110} y={92} width={60} height={13} rx={2} fill="none" stroke={C2} strokeWidth={0.5} />
                  <text x={140} y={102} textAnchor="middle" fontSize={10} fill={C2}>Accept(n,v)</text>
                </g>
              )}
            </motion.g>
          ))}
          {/* Chosen → Learner */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1].map(i => (
                <line key={i} x1={240} y1={ROLES[i + 1].y + 11} x2={330} y2={76}
                  stroke={C3} strokeWidth={0.6} strokeDasharray="2,2" />
              ))}
              <rect x={135} y={126} width={80} height={12} rx={3} fill={`${C3}12`} stroke={C3} strokeWidth={0.6} />
              <text x={175} y={135} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>
                v = chosen
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
