import { useState } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { label: 'NAT 탐지', desc: 'AutoNAT으로 A, B 모두 NAT 뒤임을 확인', active: ['A', 'NAT_A', 'B', 'NAT_B'] },
  { label: 'Relay 등록', desc: 'A, B 모두 공개 Relay 서버 R에 예약(Reserve)', active: ['A', 'NAT_A', 'R', 'NAT_B', 'B'], edges: [0, 1] },
  { label: '주소 교환', desc: 'A → R → B: Connect + 외부 주소. B → R → A: 응답', active: ['A', 'NAT_A', 'R', 'NAT_B', 'B'], edges: [0, 1, 2] },
  { label: 'Hole Punching', desc: '동시 dial로 NAT 매핑 생성. 직접 연결 성공', active: ['A', 'NAT_A', 'NAT_B', 'B'], edges: [3] },
];

const NODES = [
  { id: 'A', x: 20, y: 60, label: 'Peer A', color: '#6366f1' },
  { id: 'NAT_A', x: 90, y: 60, label: 'NAT', color: '#6b7280' },
  { id: 'R', x: 155, y: 20, label: 'Relay R', color: '#10b981' },
  { id: 'NAT_B', x: 220, y: 60, label: 'NAT', color: '#6b7280' },
  { id: 'B', x: 290, y: 60, label: 'Peer B', color: '#ec4899' },
];

const EDGE_PATHS = [
  { from: 'A', to: 'R', color: '#6366f1' },
  { from: 'B', to: 'R', color: '#ec4899' },
  { from: 'R', to: 'R', color: '#10b981', label: 'Connect' },
  { from: 'A', to: 'B', color: '#f59e0b', label: 'Direct!' },
];

const BW = 50, BH = 24;
const pos = (id: string) => {
  const n = NODES.find(n => n.id === id)!;
  return { x: n.x + BW / 2, y: n.y + BH / 2 };
};

export default function HolePunchViz() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-xs font-mono text-foreground/50">NAT Traversal: AutoNAT → Relay → Hole Punching</p>

      <svg viewBox="0 0 360 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
        {/* Edges */}
        {(s.edges ?? []).map(ei => {
          const e = EDGE_PATHS[ei];
          if (e.from === e.to) return null;
          const f = pos(e.from), t = pos(e.to);
          return (
            <motion.g key={ei} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke={e.color} strokeWidth={1.5} strokeDasharray={ei === 3 ? '0' : '4 3'} />
              {e.label && (
                <text x={(f.x + t.x) / 2} y={(f.y + t.y) / 2 - 5}
                  textAnchor="middle" fontSize={10} fill={e.color} fontWeight={600}>
                  {e.label}
                </text>
              )}
            </motion.g>
          );
        })}
        {/* Nodes */}
        {NODES.map(n => (
          <motion.g key={n.id}
            animate={{ opacity: s.active.includes(n.id) ? 1 : 0.15 }}
            transition={{ duration: 0.3 }}>
            <rect x={n.x} y={n.y} width={BW} height={BH} rx={5}
              fill={n.color + '12'} stroke={n.color} strokeWidth={1.3} />
            <text x={n.x + BW / 2} y={n.y + BH / 2 + 3.5}
              textAnchor="middle" fontSize={10} fontWeight={600} fill={n.color}>
              {n.label}
            </text>
          </motion.g>
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
