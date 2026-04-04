import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { label: 'HTTP API / CLI', c: '#6366f1' },
  { label: 'Core API', c: '#8b5cf6' },
  { label: 'IPLD / DAG', c: '#10b981' },
  { label: 'Blockstore', c: '#f59e0b' },
  { label: 'libp2p / Bitswap', c: '#ec4899' },
];
const W = 400, PAD = 20, LH = 26, GAP = 3;

export default function IPFSNodeViz() {
  return (
    <StepViz steps={LAYERS}>
      {(step) => (
        <svg viewBox={`0 0 ${W + 140} 160`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const y = 8 + i * (LH + GAP);
            const active = i === step;
            const lw = W - PAD * 2 - i * 20;
            const lx = PAD + i * 10;
            return (
              <motion.g key={i}
                animate={{ x: active ? 6 : 0, opacity: active ? 1 : 0.35 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                <rect x={lx} y={y} width={lw} height={LH} rx={5}
                  fill={l.c + (active ? '22' : '08')} stroke={l.c}
                  strokeWidth={active ? 2 : 1} strokeOpacity={active ? 1 : 0.25} />
                <text x={lx + 12} y={y + LH / 2 + 4} fontSize={10} fontWeight={600} fill={l.c}>
                  {l.label}
                </text>
              </motion.g>
            );
          })}
          {/* CID formula */}
          <motion.text x={W / 2} y={152} textAnchor="middle" fontSize={9}
            fill="currentColor" fillOpacity={0.25}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            CID = multibase( multicodec( multihash( content ) ) )
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
