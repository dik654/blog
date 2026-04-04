import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'Raft 로그 복제', body: 'Leader가 클라이언트 명령을 로그 엔트리로 Follower에게 복제. 과반 ACK 시 commit.' },
  { label: 'Leader가 명령 수신', body: '클라이언트가 Leader에게 명령(cmd)을 전송한다. Leader는 자신의 로그에 먼저 추가.' },
  { label: 'AppendEntries RPC', body: 'Leader가 모든 Follower에게 AppendEntries를 전송한다. 로그 엔트리 + prevLogIndex 포함.' },
  { label: 'Commit (과반 ACK)', body: 'Follower 과반이 ACK → Leader가 엔트리를 commit. 다음 heartbeat에 commitIndex 전파.' },
];

const NODES = [
  { label: 'Leader', x: 120, y: 40, role: 'leader' },
  { label: 'F1', x: 280, y: 20, role: 'follower' },
  { label: 'F2', x: 280, y: 65, role: 'follower' },
  { label: 'F3', x: 280, y: 110, role: 'follower' },
];

export default function LogReplicationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Client */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={15} y={30} width={55} height={24} rx={4} fill={`${C3}12`} stroke={C3} strokeWidth={0.8} />
              <text x={42} y={46} textAnchor="middle" fontSize={10} fill={C3}>Client</text>
              <motion.line x1={70} y1={42} x2={110} y2={42} stroke={C3} strokeWidth={0.8}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            </motion.g>
          )}
          {/* Nodes */}
          {NODES.map((n) => {
            const isLeader = n.role === 'leader';
            const color = isLeader ? C1 : C2;
            return (
              <motion.g key={n.label} animate={{ opacity: step === 0 ? 0.5 : 1 }}>
                <rect x={n.x} y={n.y} width={isLeader ? 70 : 60} height={26} rx={5}
                  fill={`${color}10`} stroke={color} strokeWidth={isLeader ? 1.2 : 0.8} />
                <text x={n.x + (isLeader ? 35 : 30)} y={n.y + 16} textAnchor="middle"
                  fontSize={10} fontWeight={isLeader ? 600 : 400} fill={color}>{n.label}</text>
              </motion.g>
            );
          })}
          {/* AppendEntries arrows */}
          {step >= 2 && NODES.filter(n => n.role === 'follower').map((n, i) => (
            <motion.line key={i} x1={190} y1={53} x2={n.x} y2={n.y + 13}
              stroke={C1} strokeWidth={0.7} strokeDasharray="3,2"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
              transition={{ delay: i * 0.1 }} />
          ))}
          {/* Log entries */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2].map(i => {
                const committed = step >= 3 && i < 2;
                return (
                  <rect key={i} x={110 + i * 22} y={72} width={20} height={14} rx={2}
                    fill={committed ? `${C2}20` : `${C1}10`}
                    stroke={committed ? C2 : C1} strokeWidth={0.8} />
                );
              })}
              <text x={155} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                Leader Log
              </text>
            </motion.g>
          )}
          {/* Commit label */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={105} y={105} width={90} height={18} rx={4} fill={`${C2}10`} stroke={C2} strokeWidth={0.8} />
              <text x={150} y={118} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>
                committed (과반 ACK)
              </text>
              {/* ACK arrows back */}
              {NODES.filter(n => n.role === 'follower').slice(0, 2).map((n, i) => (
                <motion.line key={i} x1={n.x} y1={n.y + 13} x2={190} y2={53}
                  stroke={C2} strokeWidth={0.5} strokeDasharray="2,2"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                  transition={{ delay: i * 0.15 }} />
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
