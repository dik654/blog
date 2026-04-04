import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'host', label: 'libp2p Host', color: '#6366f1', x: 200, y: 20 },
  { id: 'gossip', label: 'GossipSub', color: '#8b5cf6', x: 60, y: 80 },
  { id: 'peer', label: 'Peer Manager', color: '#0ea5e9', x: 200, y: 80 },
  { id: 'discovery', label: 'Peer Discovery', color: '#10b981', x: 200, y: 140 },
  { id: 'sentry', label: '센트리 노드', color: '#f59e0b', x: 340, y: 80 },
  { id: 'gater', label: 'Connection Gater', color: '#ef4444', x: 340, y: 140 },
];

const EDGES = [
  { from: 0, to: 1, label: '메시지 전파' },
  { from: 0, to: 2, label: '연결 관리' },
  { from: 2, to: 3, label: '피어 검색' },
  { from: 3, to: 2, label: '피어 정보' },
  { from: 4, to: 0, label: '접근 제어' },
  { from: 5, to: 0, label: '차단/허용' },
];

const STEPS = [
  { label: 'GossipSub 메시지 전파' },
  { label: '피어 발견 메커니즘' },
  { label: '센트리 노드 & 접근 제어' },
  { label: '전체 P2P 아키텍처' },
];

const ANNOT = ['GossipSub 위원회 메시지 전파', 'Bootstrap 피어 검색', '센트리 노드 접근 제어 보호', 'libp2p P2P 전체 아키텍처'];
const VN = [[0, 1], [0, 2, 3], [0, 4, 5], [0, 1, 2, 3, 4, 5]];
const VE = [[0], [1, 2, 3], [4, 5], [0, 1, 2, 3, 4, 5]];

export default function P2PNetworkingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            const mx = (f.x + t.x) / 2 + 8, my = (f.y + 15 + t.y + 15) / 2 + 5;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x} y1={f.y + 30} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1} />
                <rect x={mx - 28} y={my - 8} width={56} height={12} rx={2} fill="var(--card)" />
                <text x={mx} y={my} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x - 55} y={n.y} width={110} height={30} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
                  <motion.text x={405} y={85} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
