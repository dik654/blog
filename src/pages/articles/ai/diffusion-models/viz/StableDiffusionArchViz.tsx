import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '전체 파이프라인' }, { label: 'CLIP 텍스트 인코딩' },
  { label: 'Latent UNet 디노이징' }, { label: 'VAE 디코딩' },
];
const BODY = [
  'Text→CLIP→UNet→VAE→Image', 'CLIP → 77×768 임베딩 시퀀스',
  '64×64 잠재 공간 디노이징', 'VAE: 64²→512² 이미지 복원',
];

const BOXES = [
  { label: 'Text', sub: '"a cat on moon"', x: 8, w: 56, h: 50, color: '#f43f5e' },
  { label: 'CLIP', sub: '77×768', x: 78, w: 50, h: 50, color: '#ec4899' },
  { label: 'UNet', sub: '64×64 latent', x: 148, w: 56, h: 36, color: '#6366f1' },
  { label: 'VAE Dec', sub: '8× upscale', x: 234, w: 56, h: 50, color: '#10b981' },
  { label: 'Image', sub: '512×512', x: 310, w: 60, h: 60, color: '#22c55e' },
];

const ACTIVE_STEP = [
  [0, 1, 2, 3, 4],
  [0, 1],
  [2],
  [3, 4],
];

export default function StableDiffusionArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {BOXES.map((b, i) => {
            const active = ACTIVE_STEP[step].includes(i);
            const yOff = (60 - b.h) / 2 + 10;
            return (
              <g key={b.label}>
                <motion.rect x={b.x} y={yOff} width={b.w} height={b.h} rx={5}
                  animate={{ fill: `${b.color}${active ? '18' : '08'}`, stroke: b.color,
                    strokeWidth: active ? 2 : 0.8, opacity: active ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }} />
                <text x={b.x + b.w / 2} y={yOff + b.h / 2 - 2} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={b.color} opacity={active ? 1 : 0.3}>{b.label}</text>
                <text x={b.x + b.w / 2} y={yOff + b.h / 2 + 9} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)" opacity={active ? 0.7 : 0.2}>{b.sub}</text>
                {i < 4 && (
                  <motion.path d={`M ${b.x + b.w + 2} 40 L ${BOXES[i + 1].x - 2} 40`}
                    fill="none" stroke={b.color}
                    animate={{ opacity: active ? 0.5 : 0.15 }} strokeWidth={1}
                    markerEnd="url(#arrow)" />
                )}
              </g>
            );
          })}
          {/* Iterative loop for UNet */}
          {step === 2 && (
            <motion.path d="M 176 56 C 190 70, 160 70, 176 56" fill="none" stroke="#6366f1"
              strokeWidth={1.2} strokeDasharray="3 2"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
          )}
          {step === 2 && (
            <motion.text x={176} y={78} textAnchor="middle" fontSize={9} fill="#6366f1"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>T steps 반복</motion.text>
          )}
          {/* Latent vs pixel label */}
          <text x={176} y={104} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            ← 잠재 공간 (64×64) →
          </text>
          <text x={340} y={104} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            픽셀 (512²)
          </text>
          {/* Moving packet */}
          {step >= 1 && (
            <motion.circle r={4}
              animate={{ cx: step === 1 ? 103 : step === 2 ? 176 : 340, cy: 40 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              fill={step === 1 ? '#ec4899' : step === 2 ? '#6366f1' : '#22c55e'}
              style={{ filter: `drop-shadow(0 0 3px ${step === 1 ? '#ec4899' : step === 2 ? '#6366f1' : '#22c55e'}88)` }} />
          )}
          <defs>
            <marker id="arrow" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--border)" />
            </marker>
          </defs>
          {/* inline body */}
          <motion.text x={390} y={55} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
