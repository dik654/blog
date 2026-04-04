import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Transport → Swarm: TCP/QUIC 연결 수락' },
  { label: 'Swarm → Security: Noise/TLS 업그레이드' },
  { label: 'Swarm → Behaviour: 인바운드 연결 핸들' },
  { label: 'Handler → Swarm: 프로토콜 광고' },
  { label: 'Handler → Protocol: 스트림 협상 완료' },
  { label: 'Behaviour → Swarm: ToSwarm 이벤트' },
  { label: 'App → Swarm: select_next_some()' },
];
const ANNOT = ['Transport->Swarm 전달', 'Noise/TLS 보안 채널 확립', 'Behaviour 인바운드 핸들', 'listen_protocol 광고', '멀티스트림 협상 완료', 'ToSwarm 이벤트 반환', 'select_next_some 수신'];
const BOXES = [
  { name: 'Transport', x: 20, c: '#8b5cf6' },
  { name: 'Security', x: 110, c: '#ec4899' },
  { name: 'Swarm', x: 200, c: '#10b981' },
  { name: 'Behaviour', x: 290, c: '#6366f1' },
];
const ARROWS: [number, number][] = [[0, 2], [2, 1], [2, 3], [3, 2], [3, 3], [3, 2], [3, 2]];

export default function SwarmEventViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const [from, to] = ARROWS[step];
        return (
          <svg viewBox="0 0 560 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {BOXES.map((b, i) => {
              const active = i === from || i === to;
              return (
                <motion.g key={b.name}
                  animate={{ y: active ? -3 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <rect x={b.x} y={30} width={80} height={34} rx={6}
                    fill={b.c + (active ? '20' : '0a')} stroke={b.c}
                    strokeWidth={active ? 2 : 1} strokeOpacity={active ? 1 : 0.3} />
                  <text x={b.x + 40} y={51} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={b.c}>{b.name}</text>
                </motion.g>
              );
            })}
            {/* animated arrow */}
            <motion.line
              key={`arrow-${step}`}
              x1={BOXES[from].x + 40} y1={68}
              x2={BOXES[to].x + 40} y2={100}
              stroke={BOXES[from].c} strokeWidth={1.5}
              markerEnd="url(#swmarr)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.text
              key={`label-${step}`}
              x={(BOXES[from].x + BOXES[to].x) / 2 + 40} y={118}
              textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.5}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >Step {step + 1}</motion.text>
            <defs>
              <marker id="swmarr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={BOXES[from].c} />
              </marker>
            </defs>
                    <motion.text x={405} y={70} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
        );
      }}
    </StepViz>
  );
}
