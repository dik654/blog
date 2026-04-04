import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '전체 파이프라인' },
  { label: '인코더 압축' },
  { label: '잠재 공간 클러스터' },
  { label: '가우시안 샘플링' },
  { label: '디코더 생성' },
];
const BODY = [
  'Encoder→잠재공간→Decoder 구조',
  '입력을 저차원 잠재 공간 매핑',
  '같은 클래스 데이터 근접 클러스터',
  '가우시안에서 새 z 샘플링',
  'z를 디코더가 원본 공간 복원',
];

const dots = [
  { x: 168, y: 24, c: '#6366f1' }, { x: 174, y: 30, c: '#6366f1' }, { x: 164, y: 34, c: '#6366f1' }, { x: 172, y: 18, c: '#6366f1' },
  { x: 200, y: 58, c: '#10b981' }, { x: 208, y: 64, c: '#10b981' }, { x: 196, y: 68, c: '#10b981' }, { x: 204, y: 52, c: '#10b981' },
  { x: 220, y: 28, c: '#f59e0b' }, { x: 228, y: 34, c: '#f59e0b' }, { x: 224, y: 22, c: '#f59e0b' },
  { x: 186, y: 72, c: '#ec4899' }, { x: 192, y: 78, c: '#ec4899' }, { x: 180, y: 80, c: '#ec4899' },
];

export default function VAEArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Encoder funnel */}
          <motion.path d="M10,10 L60,30 L60,70 L10,90 Z" fill="#3b82f608" stroke="#3b82f6"
            animate={{ strokeWidth: step === 1 ? 2 : 1, fill: step === 1 ? '#3b82f618' : '#3b82f608' }} />
          <text x={35} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">Encoder</text>
          {/* Arrow encoder → latent */}
          <motion.line x1={62} y1={50} x2={140} y2={50} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 2"
            animate={{ opacity: step >= 1 ? 0.7 : 0.2 }} />
          {step >= 1 && <motion.polygon points="138,46 146,50 138,54" fill="#3b82f6" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />}
          {/* Latent space boundary */}
          <motion.rect x={148} y={6} width={94} height={88} rx={8}
            animate={{ fill: step >= 2 ? '#8b5cf610' : '#8b5cf606', stroke: '#8b5cf6', strokeWidth: step >= 2 ? 1.5 : 0.7, strokeDasharray: '4 2' }} />
          <text x={195} y={98} textAnchor="middle" fontSize={9} fill="#8b5cf680">Latent Space (2D)</text>
          {/* Data points */}
          {dots.map((d, i) => (
            <motion.circle key={i} cx={d.x} cy={d.y} r={step >= 2 ? 3 : 1.5} fill={d.c}
              animate={{ opacity: step >= 2 ? 0.8 : 0.15, r: step >= 2 ? 3 : 1.5 }}
              transition={{ delay: step === 2 ? i * 0.04 : 0 }} />
          ))}
          {/* Sampling circle */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <circle cx={200} cy={58} r={14} fill="none" stroke="#10b981" strokeWidth={1} strokeDasharray="2 2" opacity={0.6} />
              <motion.circle cx={204} cy={55} r={4} fill="#ffffff" stroke="#10b981" strokeWidth={1.5}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} />
              <text x={200} y={80} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>z ~ N(mu, sigma)</text>
            </motion.g>
          )}
          {/* Arrow latent → decoder */}
          <motion.line x1={244} y1={50} x2={310} y2={50} stroke="#ec4899" strokeWidth={1} strokeDasharray="3 2"
            animate={{ opacity: step >= 4 ? 0.7 : 0.2 }} />
          {step >= 4 && <motion.polygon points="308,46 316,50 308,54" fill="#ec4899" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />}
          {/* Decoder funnel (reversed) */}
          <motion.path d="M320,30 L380,10 L380,90 L320,70 Z" fill="#ec489908" stroke="#ec4899"
            animate={{ strokeWidth: step === 4 ? 2 : 1, fill: step === 4 ? '#ec489918' : '#ec489908' }} />
          <text x={350} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ec4899">Decoder</text>
          {/* Output indicator */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <text x={350} y={66} textAnchor="middle" fontSize={9} fill="#ec489980">→ x' 생성</text>
            </motion.g>
          )}
          <motion.text x={400} y={50} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
