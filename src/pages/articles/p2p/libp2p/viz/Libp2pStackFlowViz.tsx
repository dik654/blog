import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { y: 20, label: 'Application', items: ['iroh-blobs', 'BitSwap'], color: '#ef4444' },
  { y: 70, label: 'Protocol', items: ['Kademlia', 'GossipSub', 'Identify'], color: '#6366f1' },
  { y: 120, label: 'Swarm', items: ['이벤트 루프 (Behaviour ↔ Transport)'], color: '#10b981' },
  { y: 170, label: 'Security', items: ['Noise XX (DH 암호화)'], color: '#ec4899' },
  { y: 220, label: 'Muxer', items: ['Yamux (스트림 멀티플렉싱)'], color: '#f59e0b' },
  { y: 270, label: 'Transport', items: ['TCP', 'QUIC (Security+Mux 내장)'], color: '#8b5cf6' },
];

const STEPS = [
  { label: '전체 프로토콜 스택' },
  { label: 'Protocol 계층' },
  { label: 'Swarm 이벤트 루프' },
  { label: 'Security & Muxer' },
  { label: 'Transport 계층' },
];

const ANNOT = ['6계층 모듈식 프로토콜 스택', 'Kademlia+GossipSub 프로토콜', 'Swarm 이벤트 루프 중재', 'Noise XX + Yamux 멀티플렉싱', 'TCP 조합 또는 QUIC 직접'];
const active = (step: number, i: number) => {
  if (step === 0) return true;
  if (step === 1) return i <= 1;
  if (step === 2) return i === 2;
  if (step === 3) return i === 3 || i === 4;
  return i === 5;
};

export default function Libp2pStackFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 310" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const on = active(step, i);
            return (
              <motion.g key={l.label} initial={{ opacity: 0 }} animate={{ opacity: on ? 1 : 0.18 }} transition={{ duration: 0.3 }}>
                <rect x={20} y={l.y} width={300} height={40} rx={6}
                  fill={l.color + '15'} stroke={l.color} strokeWidth={on ? 1.8 : 0.8} />
                <text x={30} y={l.y + 16} fontSize={10} fontWeight={600} fill={l.color}>{l.label}</text>
                <text x={30} y={l.y + 30} fontSize={8} fill={l.color} opacity={0.7}>
                  {l.items.join(' · ')}
                </text>
                {/* Down arrow */}
                {i < LAYERS.length - 1 && (
                  <motion.line x1={170} y1={l.y + 40} x2={170} y2={l.y + 50}
                    stroke={l.color} strokeWidth={1.2} opacity={on ? 0.5 : 0.15}
                    markerEnd="url(#sarr)" />
                )}
              </motion.g>
            );
          })}
          <defs>
            <marker id="sarr" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
              <polygon points="0 0,5 2,0 4" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {/* QUIC shortcut arrow */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.2 }}>
              <line x1={310} y1={130} x2={310} y2={270} stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4,3" />
              <rect x={314} y={185} width={12} height={34} rx={2} fill="var(--card)" />
              <text x={318} y={200} fontSize={10} fill="#8b5cf6" writingMode="tb">QUIC 직접</text>
            </motion.g>
          )}
                  <motion.text x={345} y={155} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
