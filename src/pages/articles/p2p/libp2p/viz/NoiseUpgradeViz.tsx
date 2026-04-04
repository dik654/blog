import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'TCP 연결: Raw 바이트 스트림 (암호화 없음)' },
  { label: 'Noise XX: X25519 DH + Ed25519 서명으로 인증' },
  { label: 'Yamux: 단일 TCP 위 최대 8192개 논리 스트림' },
  { label: 'Protocol: multistream-select ALPN 협상' },
];

const ANNOT = ['TCP 3-way 핸드셰이크', 'X25519 DH+Ed25519 인증', 'Yamux 최대 8192 스트림', 'multistream-select 협상'];
const LAYERS = [
  { label: 'TCP', sub: 'Raw 바이트', color: '#6366f1', y: 20, w: 80 },
  { label: 'Noise XX', sub: 'X25519 + Ed25519', color: '#10b981', y: 20, w: 140 },
  { label: 'Yamux', sub: '8192 스트림', color: '#f59e0b', y: 20, w: 220 },
  { label: 'Protocol', sub: '/ipfs/kad/...', color: '#8b5cf6', y: 20, w: 310 },
];

export default function NoiseUpgradeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Stacked layers - bottom to top */}
          {LAYERS.map((l, i) => {
            const active = i === step;
            const done = i < step;
            const y = 140 - i * 35;
            return (
              <g key={l.label}>
                <motion.rect x={190 - l.w / 2} y={y} width={l.w} height={28} rx={6}
                  fill={active ? `${l.color}22` : `${l.color}08`}
                  stroke={active ? l.color : `${l.color}35`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ opacity: done ? 0.35 : active ? 1 : 0.15, scale: active ? 1.03 : 1 }}
                  transition={{ duration: 0.3 }} />
                <text x={190 - l.w / 2 + 10} y={y + 13} fontSize={10} fontWeight={600}
                  fill={active ? l.color : 'var(--foreground)'} opacity={active ? 1 : done ? 0.5 : 0.2}>{l.label}</text>
                <text x={190 - l.w / 2 + 10} y={y + 24} fontSize={10}
                  fill="var(--muted-foreground)" opacity={active ? 0.8 : 0.3}>{l.sub}</text>
              </g>
            );
          })}

          {/* Upgrade arrow on right side */}
          <line x1={355} y1={152} x2={355} y2={28} stroke="var(--border)" strokeWidth={1.5} />
          <polygon points="352,30 355,22 358,30" fill="var(--border)" />
          <text x={370} y={90} fontSize={10} fill="var(--muted-foreground)" textAnchor="middle"
            transform="rotate(90, 370, 90)">업그레이드</text>

          {/* Moving upgrade ball */}
          <motion.circle r={8} cx={355}
            fill={LAYERS[step].color}
            animate={{ cy: 140 - step * 35 + 14 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.25 }} />
          <motion.text textAnchor="middle" fontSize={10} fontWeight={600} fill="white" x={355}
            animate={{ y: 140 - step * 35 + 17 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.25 }}>
            {step + 1}
          </motion.text>

          {/* Lock icon for step 1+ */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.3 }}>
              <rect x={15} y={100} width={30} height={22} rx={4} fill="#10b98115" stroke="#10b981" />
              <text x={30} y={115} textAnchor="middle" fontSize={10} fill="#10b981">&#128274;</text>
            </motion.g>
          )}
                  <motion.text x={385} y={90} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
