import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'SGX Enclave', color: '#ef4444', x: 80, y: 5 },
  { label: 'pRuntime', color: '#10b981', x: 20, y: 55 },
  { label: 'Phactory', color: '#8b5cf6', x: 140, y: 55 },
  { label: 'Pink Runtime', color: '#0ea5e9', x: 20, y: 105 },
  { label: 'SideVM', color: '#f59e0b', x: 140, y: 105 },
  { label: 'Attestation', color: '#e11d48', x: 250, y: 30 },
  { label: 'Key Mgmt', color: '#6366f1', x: 250, y: 80 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 2, to: 4 },
  { from: 0, to: 5 }, { from: 2, to: 6 },
];

const STEPS = [
  { label: 'TEE Worker 구조' },
  { label: 'pRuntime & Phactory' },
  { label: '원격 증명 & 키 관리' },
];

const ANNOT = ['SGX 내 pRuntime+Phactory', 'pRuntime Enclave 실행 관리', 'SGX Attestation 무결성 검증'];
const VN: number[][] = [[0,1,2,3,4,5,6],[0,1,2,3,4],[0,5,6]];
const VE: number[][] = [[0,1,2,3,4,5],[0,1,2,3],[4,5]];
const BW = 72, BH = 28;
const mid = (i: number) => ({ x: NODES[i].x+BW/2, y: NODES[i].y+BH/2 });

export default function TEEWorkerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
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
                  <motion.text x={345} y={73} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
