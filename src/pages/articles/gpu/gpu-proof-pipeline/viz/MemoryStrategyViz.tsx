import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Stream Processing: 다항식을 청크 단위로 전송하며 연산을 오버랩한다' },
  { label: 'Pinned Memory: 고정 메모리로 비동기 전송과 커널 실행을 동시에 수행한다' },
  { label: 'Multi-GPU: MSM 포인트를 GPU별로 분할하여 병렬 처리한다' },
];

const STRATS = [
  { label: 'Stream', sub: '청크 오버랩', color: '#6366f1',
    blocks: [
      { x: 10, w: 60, y: 30, h: 22, fill: '#f59e0b', t: 'H2D' },
      { x: 80, w: 80, y: 30, h: 22, fill: '#6366f1', t: 'NTT' },
      { x: 50, w: 60, y: 58, h: 22, fill: '#f59e0b', t: 'H2D' },
      { x: 120, w: 80, y: 58, h: 22, fill: '#6366f1', t: 'NTT' },
    ] },
  { label: 'Pinned', sub: 'async copy', color: '#10b981',
    blocks: [
      { x: 10, w: 70, y: 30, h: 22, fill: '#f59e0b', t: 'Pin H2D' },
      { x: 10, w: 90, y: 58, h: 22, fill: '#6366f1', t: 'MSM (prev)' },
      { x: 100, w: 90, y: 58, h: 22, fill: '#8b5cf6', t: 'MSM (cur)' },
    ] },
  { label: 'Multi-GPU', sub: '2x GPU split', color: '#f43f5e',
    blocks: [
      { x: 10, w: 100, y: 30, h: 22, fill: '#6366f1', t: 'GPU0: MSM[0..n/2]' },
      { x: 10, w: 100, y: 58, h: 22, fill: '#8b5cf6', t: 'GPU1: MSM[n/2..n]' },
      { x: 120, w: 60, y: 44, h: 22, fill: '#10b981', t: 'Reduce' },
    ] },
];

export default function MemoryStrategyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 240 100" className="w-full max-w-2xl">
          {STRATS[step].blocks.map((b, i) => (
            <g key={i}>
              <motion.rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4}
                fill={b.fill} initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 0.85, x: 0 }}
                transition={{ delay: i * 0.12, duration: 0.3 }} />
              <motion.text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3.5}
                textAnchor="middle" fontSize={10} fontWeight={500} fill="white"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12 + 0.1 }}>
                {b.t}
              </motion.text>
            </g>
          ))}
          <text x={120} y={14} textAnchor="middle"
            fontSize={10} fontWeight={600} fill="#888">
            {STRATS[step].label}: {STRATS[step].sub}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
