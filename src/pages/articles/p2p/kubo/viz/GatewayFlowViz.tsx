import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { GATEWAY_STEPS } from '../GatewayData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { id: 'client', label: 'HTTP 클라이언트', color: '#6366f1', x: 15, y: 50 },
  { id: 'handler', label: 'Gateway 핸들러', color: '#0ea5e9', x: 140, y: 10 },
  { id: 'resolver', label: '경로 해석기', color: '#10b981', x: 140, y: 60 },
  { id: 'blocks', label: '블록 서비스', color: '#f59e0b', x: 140, y: 110 },
  { id: 'response', label: 'HTTP 응답', color: '#8b5cf6', x: 280, y: 50 },
];
const EDGES = [
  { from: 0, to: 1, label: 'HTTP 요청' },
  { from: 1, to: 2, label: '경로 파싱' },
  { from: 2, to: 3, label: '블록 검색' },
  { from: 3, to: 4, label: '콘텐츠 응답' },
];
const VN = [[0, 1, 2, 3, 4], [0, 1, 2], [2, 3], [3, 4]];
const VE = [[0, 1, 2, 3], [0, 1], [2], [3]];

export default function GatewayFlowViz() {
  return (
    <StepViz steps={GATEWAY_STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x + 55} y1={f.y + 15} x2={t.x} y2={t.y + 15}
                  stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="4 2" />
                <rect x={(f.x + 55 + t.x) / 2 - 28} y={(f.y + t.y) / 2 + 1} width={56} height={14} rx={2} fill="var(--card)" />
                <text x={(f.x + 55 + t.x) / 2} y={(f.y + t.y) / 2 + 10}
                  textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x} y={n.y} width={110} height={30} rx={6}
                  fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x + 55} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
