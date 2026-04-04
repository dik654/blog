import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const PROTOS = [
  { label: 'Kademlia DHT', c: '#6366f1', short: 'KAD' },
  { label: 'GossipSub', c: '#10b981', short: 'GOSSIP' },
  { label: 'Identify', c: '#f59e0b', short: 'ID' },
  { label: 'AutoNAT', c: '#8b5cf6', short: 'NAT' },
  { label: 'DCUtR', c: '#ec4899', short: 'DCU' },
];
const ANNOT = ['O(log N) 홉 탐색', 'D=6 메시 + gossip 팬아웃', '프로토콜/주소/버전 교환', 'Dial-back NAT 타입 탐지', '홀 펀칭 NAT 통과'];
const CX = 200, CY = 80, R = 60;

export default function GossipSubViz() {
  return (
    <StepViz steps={PROTOS}>
      {(step) => (
        <svg viewBox="0 0 560 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* center Swarm node */}
          <circle cx={CX} cy={CY} r={24} fill="#64748b12" stroke="#64748b" strokeWidth={1.5} />
          <text x={CX} y={CY + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="#64748b">Swarm</text>
          {/* protocol nodes around */}
          {PROTOS.map((p, i) => {
            const angle = (i / PROTOS.length) * Math.PI * 2 - Math.PI / 2;
            const px = CX + Math.cos(angle) * R;
            const py = CY + Math.sin(angle) * R;
            const active = i === step;
            return (
              <motion.g key={i}
                animate={{ scale: active ? 1.15 : 0.9, opacity: active ? 1 : 0.4 }}
                style={{ transformOrigin: `${px}px ${py}px` }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                {/* connection line */}
                <line x1={CX} y1={CY} x2={px} y2={py}
                  stroke={p.c} strokeWidth={active ? 2 : 1} strokeOpacity={active ? 0.7 : 0.15} />
                <circle cx={px} cy={py} r={18} fill={p.c + (active ? '25' : '0a')}
                  stroke={p.c} strokeWidth={active ? 2 : 1} strokeOpacity={active ? 1 : 0.3} />
                <text x={px} y={py + 3} textAnchor="middle" fontSize={10} fontWeight={600} fill={p.c}>
                  {p.short}
                </text>
              </motion.g>
            );
          })}
          {/* animated pulse on active */}
          <motion.circle
            key={`pulse-${step}`}
            cx={CX + Math.cos((step / PROTOS.length) * Math.PI * 2 - Math.PI / 2) * R}
            cy={CY + Math.sin((step / PROTOS.length) * Math.PI * 2 - Math.PI / 2) * R}
            r={18} fill="none" stroke={PROTOS[step].c} strokeWidth={1.5}
            initial={{ r: 18, opacity: 0.8 }} animate={{ r: 30, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.text x={405} y={85} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
