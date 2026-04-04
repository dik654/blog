import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LIBS = [
  { label: 'bellperson', c: '#6366f1', y: 20 },
  { label: 'sppark (Pippenger CUDA)', c: '#10b981', y: 55 },
  { label: 'neptune (Poseidon GPU)', c: '#f59e0b', y: 55 },
  { label: 'rust-gpu-tools', c: '#8b5cf6', y: 95 },
];
const POS = [
  { x: 120, y: 15 },
  { x: 30, y: 65 },
  { x: 230, y: 65 },
  { x: 130, y: 115 },
];
const ARROWS: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3]];

export default function BellpersonViz() {
  return (
    <StepViz steps={LIBS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* dependency arrows */}
          {ARROWS.map(([a, b], i) => (
            <line key={i}
              x1={POS[a].x + 70} y1={POS[a].y + 28}
              x2={POS[b].x + 70} y2={POS[b].y}
              stroke="currentColor" strokeOpacity={0.1} strokeWidth={1.5} />
          ))}
          {/* lib boxes */}
          {LIBS.map((l, i) => {
            const active = i === step;
            const p = POS[i];
            return (
              <motion.g key={i}
                animate={{ y: active ? -4 : 0, opacity: active ? 1 : 0.3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <rect x={p.x} y={p.y} width={140} height={28} rx={7}
                  fill={l.c + (active ? '22' : '08')} stroke={l.c}
                  strokeWidth={active ? 2 : 1} strokeOpacity={active ? 1 : 0.25} />
                <text x={p.x + 70} y={p.y + 17} textAnchor="middle"
                  fontSize={11} fontWeight={600} fill={l.c}>
                  {l.label.split(' (')[0]}
                </text>
              </motion.g>
            );
          })}
          {/* active pulse */}
          <motion.rect
            key={`pulse-${step}`}
            x={POS[step].x - 3} y={POS[step].y - 3}
            width={146} height={34} rx={9}
            fill="none" stroke={LIBS[step].c} strokeWidth={1.5}
            initial={{ opacity: 0.6 }} animate={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          {/* GPU label */}
          <text x={200} y={155} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.25}>
            Filecoin GPU 가속 라이브러리 의존 구조
          </text>
        </svg>
      )}
    </StepViz>
  );
}
