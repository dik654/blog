import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'AE: 잠재 공간 = 점(결정론적)' },
  { label: 'AE: 빈 공간 — 새 데이터 생성 불가' },
  { label: 'VAE: 잠재 공간 = 확률 분포(μ, σ)' },
  { label: 'VAE: 분포에서 샘플링 → 새 데이터 생성' },
];

const aePoints = [
  { x: 65, y: 30 }, { x: 78, y: 55 }, { x: 50, y: 65 },
  { x: 90, y: 38 }, { x: 72, y: 72 },
];

export default function AEvsVAEViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* AE side */}
          <text x={75} y={12} textAnchor="middle" fontSize={9} fontWeight={600}
            fill={step <= 1 ? '#6366f1' : '#6366f180'}>AE 잠재 공간</text>
          <motion.rect x={20} y={16} width={110} height={90} rx={8}
            stroke="#6366f1" fill="#6366f106" strokeDasharray="4 2"
            animate={{ strokeWidth: step <= 1 ? 1.5 : 0.7, opacity: step <= 1 ? 1 : 0.4 }} />
          {aePoints.map((p, i) => (
            <motion.circle key={i} cx={p.x} cy={p.y} r={3} fill="#6366f1"
              animate={{ opacity: step <= 1 ? 0.9 : 0.3 }}
              transition={{ delay: step === 0 ? i * 0.08 : 0 }} />
          ))}
          {step === 1 && (
            <motion.text x={75} y={50} textAnchor="middle" fontSize={9} fill="#ef4444"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              빈 공간 (의미없는 출력)
            </motion.text>
          )}

          {/* VAE side */}
          <text x={300} y={12} textAnchor="middle" fontSize={9} fontWeight={600}
            fill={step >= 2 ? '#10b981' : '#10b98180'}>VAE 잠재 공간</text>
          <motion.rect x={245} y={16} width={110} height={90} rx={8}
            stroke="#10b981" fill="#10b98106" strokeDasharray="4 2"
            animate={{ strokeWidth: step >= 2 ? 1.5 : 0.7, opacity: step >= 2 ? 1 : 0.4 }} />
          {/* Gaussian ellipses */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ellipse cx={285} cy={50} rx={18} ry={12} fill="#10b98115" stroke="#10b981" strokeWidth={1} />
              <text x={285} y={48} textAnchor="middle" fontSize={9} fill="#10b981">μ₁</text>
              <text x={285} y={57} textAnchor="middle" fontSize={9} fill="#10b98180">σ₁</text>
              <ellipse cx={320} cy={72} rx={14} ry={10} fill="#f59e0b15" stroke="#f59e0b" strokeWidth={1} />
              <text x={320} y={70} textAnchor="middle" fontSize={9} fill="#f59e0b">μ₂</text>
              <text x={320} y={79} textAnchor="middle" fontSize={9} fill="#f59e0b80">σ₂</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
              <circle cx={290} cy={46} r={3} fill="#ffffff" stroke="#10b981" strokeWidth={1.5} />
              <text x={290} y={38} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>새 z!</text>
            </motion.g>
          )}

          {/* Center divider */}
          <line x1={170} y1={20} x2={170} y2={100} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />
          <text x={180} y={60} fontSize={9} fill="var(--muted-foreground)">vs</text>
        </svg>
      )}
    </StepViz>
  );
}
