import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const ACTORS = [
  { id: 'peer', label: 'PeerNetwork', color: '#6366f1', x: 55 },
  { id: 'gossip', label: 'Gossip', color: '#10b981', x: 170 },
  { id: 'sync', label: 'ChainSync', color: '#f59e0b', x: 275 },
];
const BY = 45;

const STEPS = [
  { label: 'PeerNetworkService — 피어 관리', body: '피어 목록 관리, 핸드셰이크 조율, 점수 시스템. 새 피어 발견시 연결.' },
  { label: 'GossipService — 전파', body: '새 블록/트랜잭션을 GOSSIP_FANOUT 노드에 팬아웃 전파합니다.' },
  { label: 'ChainSyncService — 배치 동기화', body: '뒤처진 노드가 get_blocks → validate → apply 배치 동기화.' },
  { label: 'Actix 액터 메시지 흐름', body: 'PeerNetwork ↔ 핸드셰이크 ↔ Gossip → 전파 → ChainSync → 적용.' },
];

export default function P2PActorViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pa" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {ACTORS.map((a, i) => {
            const cur = i === step || step === 3;
            return (
              <g key={a.id}>
                <motion.rect x={a.x - 38} y={BY - 16} width={76} height={32} rx={6}
                  animate={{ fill: cur ? `${a.color}22` : `${a.color}06`,
                    stroke: a.color, strokeWidth: cur ? 2 : 0.8 }} transition={sp} />
                <text x={a.x} y={BY + 2} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={a.color} opacity={cur ? 1 : 0.35}>{a.label}</text>
                {i < ACTORS.length - 1 && (
                  <motion.line x1={a.x + 40} y1={BY} x2={ACTORS[i + 1].x - 40} y2={BY}
                    stroke={a.color} strokeWidth={1} markerEnd="url(#pa)"
                    animate={{ opacity: step >= i + 1 || step === 3 ? 0.6 : 0.12 }} transition={sp} />
                )}
              </g>
            );
          })}
          {/* message tags */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
              {['NewPeer', 'Health', 'Shake'].map((m, i) => (
                <g key={m}>
                  <rect x={20 + i * 38} y={80} width={34} height={12} rx={3} fill="#6366f115" stroke="#6366f1" strokeWidth={0.5} />
                  <text x={37 + i * 38} y={89} textAnchor="middle" fontSize={10} fill="#6366f1">{m}</text>
                </g>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
              {['Block', 'Tx', 'PeerBlock'].map((m, i) => (
                <g key={m}>
                  <rect x={128 + i * 42} y={80} width={38} height={12} rx={3} fill="#10b98115" stroke="#10b981" strokeWidth={0.5} />
                  <text x={147 + i * 42} y={89} textAnchor="middle" fontSize={10} fill="#10b981">{m}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
