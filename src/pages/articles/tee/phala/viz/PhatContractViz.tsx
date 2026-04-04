import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Ink! Contract', color: '#8b5cf6', x: 10, y: 20 },
  { label: 'WASM', color: '#6366f1', x: 100, y: 20 },
  { label: 'Pink Runtime', color: '#10b981', x: 190, y: 5 },
  { label: 'Chain Ext.', color: '#f59e0b', x: 190, y: 50 },
  { label: 'HTTP', color: '#0ea5e9', x: 280, y: 5 },
  { label: 'Crypto', color: '#ef4444', x: 280, y: 50 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 },
  { from: 3, to: 4 }, { from: 3, to: 5 },
];

const STEPS = [
  { label: 'Phat Contract 실행 흐름' },
  { label: 'Ink! → WASM' },
  { label: 'Chain Extension' },
];

const ANNOT = ['Ink! WASM Pink Runtime', 'Ink!->WASM 컴파일 배포', 'Chain Ext HTTP+Crypto'];
const VN: number[][] = [[0,1,2,3,4,5],[0,1,2],[3,4,5]];
const VE: number[][] = [[0,1,2,3,4],[0,1],[2,3,4]];
const BW = 70, BH = 26;
const mid = (i: number) => ({ x: NODES[i].x+BW/2, y: NODES[i].y+BH/2 });

export default function PhatContractViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 85" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1.2} strokeDasharray="4 3"
                animate={{ opacity: VE[step].includes(i) ? 0.7 : 0.06 }} />
            );
          })}
          {NODES.map((n, i) => (
            <motion.g key={n.label} animate={{ opacity: VN[step].includes(i) ? 1 : 0.1 }}>
              <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
              <text x={n.x+BW/2} y={n.y+BH/2+4} textAnchor="middle"
                fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
            </motion.g>
          ))}
                  <motion.text x={365} y={43} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
