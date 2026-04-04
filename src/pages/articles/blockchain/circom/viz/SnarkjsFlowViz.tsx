import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Circom + snarkjs 전체 흐름', body: '컴파일 → 셋업 → 증인 → 증명 → 검증의 5단계 파이프라인' },
  { label: '컴파일 & 셋업', body: '.circom → .r1cs/.wasm 컴파일 후 Powers of Tau + zKey로 키를 생성합니다.' },
  { label: '증인 계산 & 증명', body: 'WASM으로 증인을 계산하고, Groth16으로 증명을 생성합니다.' },
  { label: '온체인 검증', body: '검증키로 증명을 검증하거나, Solidity Verifier 계약으로 온체인 검증합니다.' },
];

const NODES = [
  { label: '.circom', color: '#8b5cf6', x: 5, y: 30 },
  { label: '.r1cs', color: '#6366f1', x: 75, y: 10 },
  { label: '.wasm', color: '#6366f1', x: 75, y: 55 },
  { label: 'zKey', color: '#10b981', x: 145, y: 10 },
  { label: 'Witness', color: '#f59e0b', x: 145, y: 55 },
  { label: 'Proof', color: '#ef4444', x: 215, y: 30 },
  { label: 'Verify', color: '#0ea5e9', x: 285, y: 30 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 2, to: 4 },
  { from: 3, to: 5 }, { from: 4, to: 5 }, { from: 5, to: 6 },
];

const BW = 60, BH = 26;
const mid = (i: number) => ({ x: NODES[i].x+BW/2, y: NODES[i].y+BH/2 });
const VN: number[][] = [[0,1,2,3,4,5,6],[0,1,2,3],[2,4,5],[5,6]];
const VE: number[][] = [[0,1,2,3,4,5,6],[0,1,2],[3,4,5],[6]];

export default function SnarkjsFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 495 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
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
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
