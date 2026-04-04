import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const MODS = [
  { id: 'facade', label: 'libp2p', color: '#6366f1', x: 120, y: 5 },
  { id: 'core', label: 'core', color: '#8b5cf6', x: 30, y: 65 },
  { id: 'swarm', label: 'swarm', color: '#10b981', x: 130, y: 65 },
  { id: 'identity', label: 'identity', color: '#f59e0b', x: 230, y: 65 },
  { id: 'noise', label: 'noise', color: '#ec4899', x: 10, y: 130 },
  { id: 'yamux', label: 'yamux', color: '#f59e0b', x: 90, y: 130 },
  { id: 'tcp', label: 'tcp', color: '#ef4444', x: 170, y: 130 },
  { id: 'quic', label: 'quic', color: '#06b6d4', x: 245, y: 130 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 2, to: 1 }, { from: 4, to: 1 }, { from: 5, to: 1 },
  { from: 6, to: 1 }, { from: 7, to: 1 },
];

const STEPS = [
  { label: '전체 모듈 의존성' },
  { label: 'Core 추상화' },
  { label: 'Swarm 중재' },
  { label: '구현 크레이트' },
];

const ANNOT = ['facade가 하위 모듈 통합', 'core Transport 추상화', 'swarm Behaviour 중재', 'noise/yamux/tcp 구현'];
const ACTIVE: number[][] = [
  [0,1,2,3,4,5,6,7], [0,1,2,3,4,5,6,7], [0,1,2], [0,1,4,5,6,7],
];

const BW = 60, BH = 28;
const mid = (i: number) => ({ x: MODS[i].x + BW / 2, y: MODS[i].y + BH / 2 });

export default function ModuleDependencyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            const on = ACTIVE[step].includes(e.from) && ACTIVE[step].includes(e.to);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1.2} strokeDasharray="4 3"
                animate={{ opacity: on ? 0.6 : 0.08 }} transition={{ duration: 0.3 }} />
            );
          })}
          {MODS.map((m, i) => {
            const on = ACTIVE[step].includes(i);
            return (
              <motion.g key={m.id} animate={{ opacity: on ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <rect x={m.x} y={m.y} width={BW} height={BH} rx={5}
                  fill={m.color + '12'} stroke={m.color} strokeWidth={1.4} />
                <text x={m.x + BW / 2} y={m.y + BH / 2 + 3.5}
                  textAnchor="middle" fontSize={10} fontWeight={600} fill={m.color}>
                  {m.label}
                </text>
              </motion.g>
            );
          })}
                  <motion.text x={325} y={88} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
