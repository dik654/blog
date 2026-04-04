import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Node A와 B의 바이너리 ID 비교' },
  { label: 'XOR 연산: 같은 비트=0, 다른 비트=1' },
  { label: '공통 프리픽스 길이 → k-bucket 인덱스' },
];

const A = [1, 0, 1, 1, 0, 1, 0, 0];
const B = [1, 0, 1, 1, 1, 0, 0, 1];
const X = A.map((a, i) => a ^ B[i]);
const PREFIX = 4;
const BW = 30, BG = 6, X0 = 55;

export default function XORDistanceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Row labels */}
          <text x={30} y={45} fontSize={11} fontWeight={600} fill="#6366f1">A</text>
          <text x={30} y={85} fontSize={11} fontWeight={600} fill="#10b981">B</text>
          {step >= 1 && <text x={14} y={125} fontSize={10} fontWeight={600} fill="#f59e0b">A⊕B</text>}

          {/* Bit boxes for A */}
          {A.map((bit, i) => {
            const x = X0 + i * (BW + BG);
            const pf = i < PREFIX && step === 2;
            return (
              <g key={`a${i}`}>
                <rect x={x} y={28} width={BW} height={26} rx={4}
                  fill={pf ? '#6366f118' : '#6366f108'}
                  stroke={pf ? '#6366f1' : '#6366f130'} strokeWidth={pf ? 1.5 : 0.8} />
                <text x={x + BW / 2} y={46} textAnchor="middle" fontSize={13} fontWeight={600} fill="#6366f1">{bit}</text>
              </g>
            );
          })}

          {/* Bit boxes for B */}
          {B.map((bit, i) => {
            const x = X0 + i * (BW + BG);
            const pf = i < PREFIX && step === 2;
            return (
              <g key={`b${i}`}>
                <rect x={x} y={68} width={BW} height={26} rx={4}
                  fill={pf ? '#10b98118' : '#10b98108'}
                  stroke={pf ? '#10b981' : '#10b98130'} strokeWidth={pf ? 1.5 : 0.8} />
                <text x={x + BW / 2} y={86} textAnchor="middle" fontSize={13} fontWeight={600} fill="#10b981">{bit}</text>
              </g>
            );
          })}

          {/* XOR result */}
          {step >= 1 && X.map((bit, i) => {
            const x = X0 + i * (BW + BG);
            const isDiff = bit === 1;
            return (
              <motion.g key={`x${i}`} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}>
                <rect x={x} y={108} width={BW} height={26} rx={4}
                  fill={isDiff ? '#f59e0b18' : 'transparent'}
                  stroke={isDiff ? '#f59e0b' : '#f59e0b30'} strokeWidth={isDiff ? 1.5 : 0.8} />
                <text x={x + BW / 2} y={126} textAnchor="middle" fontSize={13} fontWeight={600}
                  fill={isDiff ? '#f59e0b' : 'var(--muted-foreground)'}>{bit}</text>
              </motion.g>
            );
          })}

          {/* Prefix bracket + inline annotation */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <line x1={X0} y1={146} x2={X0 + PREFIX * (BW + BG) - BG} y2={146}
                stroke="#8b5cf6" strokeWidth={1.5} />
              <line x1={X0} y1={142} x2={X0} y2={150} stroke="#8b5cf6" strokeWidth={1.5} />
              <line x1={X0 + PREFIX * (BW + BG) - BG} y1={142}
                x2={X0 + PREFIX * (BW + BG) - BG} y2={150} stroke="#8b5cf6" strokeWidth={1.5} />
              <text x={X0 + PREFIX * (BW + BG) / 2 - 3} y={164} textAnchor="middle"
                fontSize={10} fontWeight={600} fill="#8b5cf6">
                공통 프리픽스 {PREFIX}비트 → k-bucket[{PREFIX}]
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
