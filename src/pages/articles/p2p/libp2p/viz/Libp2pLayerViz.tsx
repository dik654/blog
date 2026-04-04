import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { label: 'Transport', c: '#8b5cf6', tags: ['TCP', 'QUIC', 'WS', 'WebRTC'] },
  { label: 'Security', c: '#ec4899', tags: ['Noise XX', 'TLS 1.3'] },
  { label: 'Mux', c: '#f59e0b', tags: ['Yamux', 'Mplex'] },
  { label: 'Swarm', c: '#10b981', tags: ['Behaviour', 'Handler', 'EventLoop'] },
  { label: 'Protocol', c: '#6366f1', tags: ['Kademlia', 'GossipSub', 'Identify'] },
];

const STEPS = [
  { label: 'Transport 계층', body: 'QUIC 내장 지원, TCP는 Noise + Yamux로 업그레이드' },
  { label: 'Security 계층', body: 'Noise XX(X25519 + ChaChaPoly) 또는 TLS 1.3(QUIC)' },
  { label: 'Mux 계층', body: '단일 연결 위에 독립 논리 스트림 다중화 (Yamux 기본)' },
  { label: 'Swarm 계층', body: '이벤트 루프가 연결/스트림/프로토콜을 조율' },
  { label: 'Protocol 계층', body: 'Kademlia·GossipSub·Identify가 NetworkBehaviour 구현' },
];

const LH = 34, GAP = 6;

export default function Libp2pLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const y = 10 + i * (LH + GAP);
            const active = i === step;
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.35 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                <rect x={15} y={y} width={430} height={LH} rx={6}
                  fill={l.c + (active ? '18' : '08')} stroke={l.c}
                  strokeWidth={active ? 2 : 0.8} />
                <text x={30} y={y + LH / 2 + 5} fontSize={12} fontWeight={600} fill={l.c}>
                  {l.label}
                </text>
                {l.tags.map((t, j) => (
                  <g key={t}>
                    <rect x={130 + j * 80} y={y + 7} width={70} height={20} rx={4}
                      fill={l.c + '12'} />
                    <text x={165 + j * 80} y={y + 21} textAnchor="middle"
                      fontSize={10} fill={l.c}>{t}</text>
                  </g>
                ))}
              </motion.g>
            );
          })}
          {/* Arrows between layers */}
          {[0, 1, 2, 3].map(i => (
            <line key={i} x1={230} y1={10 + (i + 1) * (LH + GAP) - GAP}
              x2={230} y2={10 + (i + 1) * (LH + GAP)}
              stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="2 2" opacity={0.2} />
          ))}
        </svg>
      )}
    </StepViz>
  );
}
