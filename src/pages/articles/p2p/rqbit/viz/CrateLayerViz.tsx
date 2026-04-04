import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'rqbit: 14개 크레이트의 Cargo 워크스페이스' },
  { label: 'librqbit: 모든 BitTorrent 기능의 중앙 집중화' },
  { label: 'peer_binary_protocol + dht + tracker_comms' },
  { label: 'bencode + librqbit_core + sha1w' },
];

const ANNOT = ['Rust BT 14 크레이트 워크스페이스', 'librqbit 세션 관리 중앙', 'peer/dht/tracker 프로토콜', 'bencode/core/sha1w 유틸'];
const LAYERS = [
  { label: 'rqbit CLI / desktop', color: '#8b5cf6', y: 15, w: 320 },
  { label: 'librqbit', color: '#6366f1', y: 48, w: 280 },
  { label: 'peer_proto | dht | tracker', color: '#3b82f6', y: 81, w: 240 },
  { label: 'bencode | core | sha1w', color: '#10b981', y: 114, w: 200 },
];

export default function CrateLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = i === step;
            const x = (380 - l.w) / 2;
            return (
              <g key={l.label}>
                <motion.rect x={x} y={l.y} width={l.w} height={28} rx={6}
                  fill={active ? `${l.color}22` : `${l.color}08`}
                  stroke={active ? l.color : `${l.color}30`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ scale: active ? 1.03 : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: 'center' }} />
                <text x={190} y={l.y + 18} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? l.color : 'var(--muted-foreground)'}>
                  {l.label}
                </text>
              </g>
            );
          })}
                  <motion.text x={385} y={78} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
