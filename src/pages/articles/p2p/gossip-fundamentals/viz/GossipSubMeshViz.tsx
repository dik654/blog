import { useState } from 'react';
import { motion } from 'framer-motion';

const PEERS = [
  { id: 'pub', x: 160, y: 5, label: 'Publisher', color: '#ef4444' },
  { id: 'm1', x: 50, y: 60, label: 'Mesh 1', color: '#6366f1' },
  { id: 'm2', x: 160, y: 60, label: 'Mesh 2', color: '#6366f1' },
  { id: 'm3', x: 270, y: 60, label: 'Mesh 3', color: '#6366f1' },
  { id: 'g1', x: 50, y: 120, label: 'Gossip 1', color: '#10b981' },
  { id: 'g2', x: 270, y: 120, label: 'Gossip 2', color: '#10b981' },
];

const STEPS = [
  { label: '메시 구성 (D=3)', desc: 'Publisher가 토픽에 대해 D=3 메시 피어를 유지', edges: [], gossip: false, iwant: false },
  { label: '전체 메시지 전파', desc: '메시 피어에게 전체 메시지를 직접 전송', edges: [0, 1, 2], gossip: false, iwant: false },
  { label: 'IHAVE gossip', desc: '비-메시 피어에게 IHAVE(메시지 ID만) 전송', edges: [0, 1, 2], gossip: true, iwant: false },
  { label: 'IWANT 요청', desc: 'Gossip 피어가 메시지 미보유 시 IWANT으로 요청 → 전체 메시지 수신', edges: [0, 1, 2], gossip: true, iwant: true },
];

const MESH_EDGES = [
  { from: 'pub', to: 'm1' }, { from: 'pub', to: 'm2' }, { from: 'pub', to: 'm3' },
];
const GOSSIP_EDGES = [
  { from: 'm1', to: 'g1' }, { from: 'm3', to: 'g2' },
];

const BW = 62, BH = 24;
const pos = (id: string) => {
  const p = PEERS.find(p => p.id === id)!;
  return { x: p.x + BW / 2, y: p.y + BH / 2 };
};

export default function GossipSubMeshViz() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-mono text-foreground/50">GossipSub: Mesh + Gossip Layer</p>
      <svg viewBox="0 0 400 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
        {/* Mesh edges */}
        {MESH_EDGES.map((e, i) => {
          const f = pos(e.from), t = pos(e.to);
          const show = s.edges.includes(i);
          return (
            <motion.g key={`m${i}`} animate={{ opacity: show ? 1 : 0.12 }}>
              <line x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke="#6366f1" strokeWidth={1.3} />
              {show && (
                <motion.circle r={3} fill="#ef4444"
                  animate={{ cx: [f.x, t.x], cy: [f.y, t.y] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }} />
              )}
            </motion.g>
          );
        })}
        {/* Gossip edges */}
        {s.gossip && GOSSIP_EDGES.map((e, i) => {
          const f = pos(e.from), t = pos(e.to);
          return (
            <motion.g key={`g${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#10b981" strokeWidth={1} strokeDasharray="4 3" />
              <rect x={(f.x + t.x) / 2 - 20} y={(f.y + t.y) / 2 - 8} width={40} height={14} rx={2} fill="var(--card)" />
              <text x={(f.x + t.x) / 2} y={(f.y + t.y) / 2}
                textAnchor="middle" fontSize={10} fill="#10b981">{s.iwant ? 'IWANT' : 'IHAVE'}</text>
            </motion.g>
          );
        })}
        {/* Peer nodes */}
        {PEERS.map(p => (
          <g key={p.id}>
            <rect x={p.x} y={p.y} width={BW} height={BH} rx={5}
              fill={p.color + '12'} stroke={p.color} strokeWidth={1.3} />
            <text x={p.x + BW / 2} y={p.y + BH / 2 + 3.5}
              textAnchor="middle" fontSize={10} fontWeight={600} fill={p.color}>
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} onClick={() => setStep(i)}
            className={`h-1 flex-1 rounded-full cursor-pointer transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`} />
        ))}
      </div>
      <p className="text-xs font-semibold text-center">{s.label}</p>
      <p className="text-[10px] text-foreground/50 text-center">{s.desc}</p>
    </div>
  );
}
