import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'torrent',   label: '.torrent 파일', color: '#6366f1', x: 50,  y: 45 },
  { id: 'tracker',   label: 'Tracker',       color: '#10b981', x: 140, y: 20 },
  { id: 'dht',       label: 'DHT',           color: '#10b981', x: 140, y: 70 },
  { id: 'peers',     label: '피어 목록',      color: '#f59e0b', x: 230, y: 45 },
  { id: 'handshake', label: '핸드셰이크',     color: '#8b5cf6', x: 300, y: 45 },
  { id: 'bitfield',  label: 'Bitfield',       color: '#ec4899', x: 300, y: 10 },
  { id: 'request',   label: 'Request',        color: '#ef4444', x: 380, y: 10 },
  { id: 'piece',     label: 'Piece 수신',     color: '#06b6d4', x: 380, y: 45 },
];

const EDGES: [number, number, string][] = [
  [0, 1, 'announce'], [0, 2, 'info_hash'],
  [1, 3, 'IP:Port'], [2, 3, '피어 발견'],
  [3, 4, 'TCP 연결'], [4, 5, '보유 조각'],
  [5, 6, 'rarest-first'], [6, 7, '16KB 블록'],
];

const VIS = [
  [0], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4],
  [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6, 7],
];
const GLOW = [0, 1, 3, 4, 5, 6, 7];

const STEPS = [
  { label: '.torrent 파일 파싱' },
  { label: '피어 탐색' },
  { label: '피어 목록 수신' },
  { label: '핸드셰이크' },
  { label: 'Bitfield 교환' },
  { label: 'Rarest-first 요청' },
  { label: '조각 수신 & 검증' },
];

const ANNOT = ['파일 메타데이터+조각 해시', 'Tracker/DHT 피어 탐색', '활성 피어 IP:Port 수신', 'info_hash 핸드셰이크', 'Bitfield 조각 비트맵 교환', 'Rarest-first 우선 요청', '16KB 블록 수신+SHA1 검증'];
export default function PeerExchangeFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 530 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map(([a, b, lbl], i) => {
            const na = NODES[a], nb = NODES[b];
            const show = VIS[step].includes(a) && VIS[step].includes(b);
            return (
              <motion.g key={i} animate={{ opacity: show ? 0.5 : 0.06 }} transition={{ duration: 0.3 }}>
                <line x1={na.x + 30} y1={na.y} x2={nb.x - 30} y2={nb.y}
                  stroke="var(--muted-foreground)" strokeWidth={0.8} />
                {(() => { const tx = (na.x + nb.x) / 2, ty = Math.min(na.y, nb.y) - 4; return (
                  <><rect x={tx - 18} y={ty - 5.5} width={36} height={8} rx={2} fill="var(--card)" />
                  <text x={tx} y={ty} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{lbl}</text></>
                ); })()}
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VIS[step].includes(i);
            const glow = GLOW[step] === i;
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.12 }} transition={{ duration: 0.35 }}>
                <rect x={n.x - 32} y={n.y - 11} width={64} height={22} rx={5}
                  fill={`${n.color}${glow ? '28' : '10'}`} stroke={n.color}
                  strokeWidth={glow ? 2 : 1} />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
                  <motion.text x={435} y={45} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
