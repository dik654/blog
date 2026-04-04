import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ROUTING_STEPS } from '../ContentRoutingData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { id: 'node', label: '노드 A', color: '#6366f1', x: 30, y: 60 },
  { id: 'dht', label: 'DHT', color: '#10b981', x: 160, y: 20 },
  { id: 'http', label: 'HTTP Router', color: '#0ea5e9', x: 160, y: 70 },
  { id: 'offline', label: 'Offline', color: '#6b7280', x: 160, y: 120 },
  { id: 'providers', label: '제공자들', color: '#f59e0b', x: 290, y: 60 },
];
const EDGES = [
  { from: 0, to: 1, label: 'FIND_PROVIDERS' },
  { from: 0, to: 2, label: 'GET /providers' },
  { from: 0, to: 3, label: 'Local cache' },
  { from: 1, to: 4, label: '피어 목록' },
  { from: 2, to: 4, label: '피어 목록' },
];
const VN = [[0, 1, 2, 3, 4], [0, 1, 4], [0, 2, 4], [0, 1, 2, 3, 4]];
const VE = [[0, 1, 2, 3, 4], [0, 3], [1, 4], [0, 1, 2, 3, 4]];

export default function RoutingFlowViz() {
  return (
    <StepViz steps={ROUTING_STEPS}>
      {(step) => (
        <svg viewBox="0 0 390 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x + 45} y1={f.y + 15} x2={t.x} y2={t.y + 15}
                  stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="4 2" />
                <rect x={(f.x + 45 + t.x) / 2 - 40} y={(f.y + t.y) / 2 + 1} width={80} height={14} rx={2} fill="var(--card)" />
                <text x={(f.x + 45 + t.x) / 2} y={(f.y + t.y) / 2 + 10}
                  textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x} y={n.y} width={90} height={30} rx={6}
                  fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x + 45} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
