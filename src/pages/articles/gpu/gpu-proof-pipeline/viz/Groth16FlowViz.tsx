import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Witness: R1CS 제약을 풀어 w 벡터를 생성한다 (CPU 순차)' },
  { label: 'NTT x3: A(x), B(x), C(x) 다항식을 roots of unity에서 평가한다' },
  { label: 'Pointwise + INTT: H(x) = (A*B - C) / Z 몫 다항식을 계산한다' },
  { label: 'MSM x3: CRS와 witness로 증명 원소 [A]1, [B]2, [C]1을 계산한다' },
  { label: 'proof = (A, B, C): 256 bytes로 조합하여 GPU에서 Host로 복사한다' },
];

const BOXES = [
  { label: 'Witness', sub: 'CPU', color: '#f59e0b', y: 16 },
  { label: 'NTT x3', sub: 'GPU', color: '#6366f1', y: 16 },
  { label: 'H(x)', sub: 'GPU', color: '#8b5cf6', y: 16 },
  { label: 'MSM x3', sub: 'GPU', color: '#6366f1', y: 16 },
  { label: 'Proof', sub: 'D2H', color: '#10b981', y: 16 },
];

export default function Groth16FlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 560 90" className="w-full max-w-2xl">
          <defs>
            <marker id="g16-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#888" />
            </marker>
          </defs>
          {BOXES.map((b, i) => {
            const x = i * 108 + 10;
            const active = i === step;
            const done = i < step;
            const opacity = active ? 1 : done ? 0.4 : 0.18;
            return (
              <g key={b.label}>
                {i > 0 && (
                  <line x1={x - 12} y1={40} x2={x - 2} y2={40}
                    stroke="#888" strokeWidth={1.2} markerEnd="url(#g16-arr)"
                    opacity={done || active ? 0.7 : 0.2} />
                )}
                <motion.rect x={x} y={b.y} width={96} height={48} rx={8}
                  fill={b.color} animate={{ opacity }} transition={{ duration: 0.3 }} />
                <text x={x + 48} y={36} textAnchor="middle"
                  fontSize={10} fontWeight="bold" fill="white"
                  style={{ opacity: Math.max(opacity, 0.4) }}>{b.label}</text>
                <text x={x + 48} y={50} textAnchor="middle"
                  fontSize={10} fill="white" opacity={0.6}
                  style={{ opacity: Math.max(opacity, 0.3) }}>{b.sub}</text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
