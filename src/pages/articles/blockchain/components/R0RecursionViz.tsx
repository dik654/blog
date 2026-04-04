import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'SegmentReceipt', sub: '~1 MB × N', color: '#6366f1', w: 120 },
  { label: 'SuccinctReceipt', sub: '~200 KB × 1', color: '#10b981', w: 100 },
  { label: 'Groth16Receipt', sub: '~256 B × 1', color: '#8b5cf6', w: 80 },
];

const STEPS = [
  { label: 'SegmentReceipt: N개 병렬 STARK 생성', body: '각 RISC-V 세그먼트에서 Raw STARK 증명을 GPU로 병렬 생성합니다. 약 1MB × N개.' },
  { label: '재귀 압축 → SuccinctReceipt', body: '재귀 회로가 N개의 SegmentReceipt를 하나의 STARK로 압축. 약 200KB로 축소.' },
  { label: 'Groth16 래핑 → 256 bytes', body: 'STARK → Groth16 SNARK로 변환. 이더리움 온체인 검증 가능 (~250k gas).' },
];

const Y = 40, GAP = 30;

export default function R0RecursionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        let cx = 40;
        return (
          <svg viewBox="0 0 440 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="r0r-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
              </marker>
            </defs>
            {NODES.map((n, i) => {
              const x = cx;
              cx += n.w + GAP;
              const h = 50 - i * 10;
              return (
                <motion.g key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: i <= step ? 1 : 0.15, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}>
                  <rect x={x} y={Y + (50 - h) / 2} width={n.w} height={h} rx={7}
                    fill={n.color + '18'} stroke={n.color}
                    strokeWidth={i === step ? 2.5 : 1} />
                  <text x={x + n.w / 2} y={Y + 22} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
                  <text x={x + n.w / 2} y={Y + 35} textAnchor="middle"
                    fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
                  {/* Arrow to next */}
                  {i < NODES.length - 1 && step > i && (
                    <motion.line
                      x1={x + n.w} y1={Y + 25} x2={x + n.w + GAP} y2={Y + 25}
                      stroke="var(--muted-foreground)" strokeWidth={1.2}
                      markerEnd="url(#r0r-a)"
                      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
                  )}
                </motion.g>
              );
            })}
            {/* Segment fan visualization */}
            {step === 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[0, 1, 2, 3].map(i => (
                  <rect key={i} x={50 + i * 22} y={Y + 55} width={18} height={14} rx={3}
                    fill={NODES[0].color + '20'} stroke={NODES[0].color} strokeWidth={0.8} />
                ))}
                <text x={94} y={Y + 80} textAnchor="middle" fontSize={9} fill={NODES[0].color}>N개 세그먼트 (병렬)</text>
              </motion.g>
            )}
            {/* Size shrink visualization */}
            {step === 2 && (
              <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                {[
                  { label: '~1 MB × N', x: 80, w: 100, c: '#6366f1' },
                  { label: '~200 KB', x: 210, w: 60, c: '#10b981' },
                  { label: '256 B', x: 310, w: 30, c: '#8b5cf6' },
                ].map((bar, i) => (
                  <motion.g key={i} initial={{ width: 0 }} animate={{ width: bar.w }}>
                    <rect x={bar.x} y={Y + 60} width={bar.w} height={10} rx={5}
                      fill={bar.c + '30'} stroke={bar.c} strokeWidth={1} />
                    <text x={bar.x + bar.w / 2} y={Y + 80} textAnchor="middle"
                      fontSize={9} fill={bar.c}>{bar.label}</text>
                  </motion.g>
                ))}
                <text x={220} y={Y + 95} textAnchor="middle"
                  fontSize={9} fill={NODES[2].color} fontWeight={600}>~250k gas 온체인 검증</text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
