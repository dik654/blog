import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '후보 수집 (Gathering)', body: 'Host, Server Reflexive, Relay 3종류의 후보를 수집합니다.' },
  { label: '후보 교환 (Signaling)', body: '수집된 후보를 시그널링 채널(SDP 등)로 상대에게 전달합니다.' },
  { label: '연결성 검사 (Checks)', body: '모든 후보 쌍에 STUN Binding Request로 양방향 연결 검사.' },
  { label: '최적 경로 선택', body: 'Host(직접) > Reflexive > Relay 우선순위로 가장 좋은 유효 쌍 선택.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { host: '#10b981', srflx: '#f59e0b', relay: '#ef4444' };

const CANDS = [
  { label: 'Host', c: C.host, x: 40, y: 30 },
  { label: 'Srflx', c: C.srflx, x: 40, y: 75 },
  { label: 'Relay', c: C.relay, x: 40, y: 120 },
  { label: 'Host', c: C.host, x: 310, y: 30 },
  { label: 'Srflx', c: C.srflx, x: 310, y: 75 },
  { label: 'Relay', c: C.relay, x: 310, y: 120 },
];

export default function ICEViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Peer labels */}
          <text x={70} y={16} textAnchor="middle" fontSize={10} fontWeight={600}
            fill="var(--foreground)">Peer A</text>
          <text x={340} y={16} textAnchor="middle" fontSize={10} fontWeight={600}
            fill="var(--foreground)">Peer B</text>

          {/* Candidate boxes */}
          {CANDS.map((cd, i) => (
            <motion.g key={i}
              animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp}>
              <rect x={cd.x} y={cd.y} width={60} height={24} rx={4}
                fill={cd.c + '12'} stroke={cd.c} strokeWidth={1.3} />
              <text x={cd.x + 30} y={cd.y + 15} textAnchor="middle"
                fontSize={10} fontWeight={600} fill={cd.c}>{cd.label}</text>
            </motion.g>
          ))}

          {/* Connectivity check lines */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}>
              {[0, 1, 2].map(i => [3, 4, 5].map(j => (
                <line key={`${i}-${j}`}
                  x1={100} y1={CANDS[i].y + 12}
                  x2={310} y2={CANDS[j].y + 12}
                  stroke="#64748b" strokeWidth={0.5} strokeDasharray="2 3" />
              )))}
            </motion.g>
          )}

          {/* Selected best pair */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={100} y1={42} x2={310} y2={42}
                stroke={C.host} strokeWidth={1.5} />
              <rect x={168} y={34} width={84} height={14} rx={3} fill="var(--card)"
                stroke={C.host} strokeWidth={1} />
              <text x={210} y={44} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={C.host}>Best: Host-Host</text>
            </motion.g>
          )}

          {/* Signaling arrow */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              <line x1={140} y1={75} x2={270} y2={75}
                stroke="#6366f1" strokeWidth={1.3} strokeDasharray="4 3" />
              <rect x={168} y={67} width={64} height={12} rx={2} fill="var(--card)" />
              <text x={200} y={76} textAnchor="middle" fontSize={10} fill="#6366f1">SDP 교환</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
