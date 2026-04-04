import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '전체 GAN 아키텍처' },
  { label: 'Generator 경로' },
  { label: 'Discriminator 경로' },
];
const BODY = [
  'G는 업샘플링, D는 다운샘플링',
  'z→FC→DeConv 점진적 해상도↑',
  'Conv 압축 → Sigmoid 확률 출력',
];

const GL = [
  { w: 16, label: 'z', color: '#6366f1', dim: '100' },
  { w: 24, label: 'FC', color: '#3b82f6', dim: '4×4×512' },
  { w: 40, label: 'DeConv1', color: '#10b981', dim: '8×8×256' },
  { w: 56, label: 'DeConv2', color: '#10b981', dim: '16×16×128' },
  { w: 68, label: '이미지', color: '#f59e0b', dim: '64×64×3' },
];
const DL = [
  { w: 68, label: '이미지', color: '#f59e0b', dim: '64×64×3' },
  { w: 52, label: 'Conv1', color: '#ef4444', dim: '32×32×64' },
  { w: 36, label: 'Conv2', color: '#ef4444', dim: '16×16×128' },
  { w: 20, label: 'FC', color: '#a855f7', dim: '1024' },
  { w: 12, label: 'σ', color: '#a855f7', dim: '1' },
];

const LH = 18, GAP = 3, BASE_X_G = 20, BASE_X_D = 220;

export default function GANArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Generator title */}
          <text x={BASE_X_G + 40} y={12} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Generator</text>
          {/* Generator layers - narrow to wide */}
          {GL.map((l, i) => {
            const x = BASE_X_G + (68 - l.w) / 2;
            const y = 18 + i * (LH + GAP);
            const active = step === 0 || step === 1;
            return (
              <g key={`g${i}`}>
                <motion.rect x={x} y={y} width={l.w} height={LH} rx={3}
                  animate={{ fill: active ? l.color + '20' : l.color + '08', stroke: l.color, strokeWidth: active ? 1.5 : 0.7, opacity: active ? 1 : 0.3 }}
                  transition={{ duration: 0.3, delay: step === 1 ? i * 0.08 : 0 }} />
                <text x={BASE_X_G + 34} y={y + 12} textAnchor="middle" fontSize={9} fontWeight={500} fill={l.color}
                  opacity={active ? 1 : 0.3}>{l.label}</text>
                {active && (
                  <text x={BASE_X_G + 74} y={y + 12} fontSize={7} fill={l.color} fillOpacity={0.6}>{l.dim}</text>
                )}
              </g>
            );
          })}
          {/* Arrow between G and D */}
          <motion.path d="M96,75 L130,75" fill="none" stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 2" opacity={0.4} />
          {/* Center label */}
          <text x={160} y={68} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" opacity={0.5}>
            {step === 1 ? '업샘플링 →' : step === 2 ? '→ 다운샘플링' : '↔'}
          </text>
          {/* Discriminator title */}
          <text x={BASE_X_D + 40} y={12} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">Discriminator</text>
          {/* Discriminator layers - wide to narrow */}
          {DL.map((l, i) => {
            const x = BASE_X_D + (68 - l.w) / 2;
            const y = 18 + i * (LH + GAP);
            const active = step === 0 || step === 2;
            return (
              <g key={`d${i}`}>
                <motion.rect x={x} y={y} width={l.w} height={LH} rx={3}
                  animate={{ fill: active ? l.color + '20' : l.color + '08', stroke: l.color, strokeWidth: active ? 1.5 : 0.7, opacity: active ? 1 : 0.3 }}
                  transition={{ duration: 0.3, delay: step === 2 ? i * 0.08 : 0 }} />
                <text x={BASE_X_D + 34} y={y + 12} textAnchor="middle" fontSize={9} fontWeight={500} fill={l.color}
                  opacity={active ? 1 : 0.3}>{l.label}</text>
                {active && (
                  <text x={BASE_X_D + 74} y={y + 12} fontSize={7} fill={l.color} fillOpacity={0.6}>{l.dim}</text>
                )}
              </g>
            );
          })}
          {/* Direction arrows */}
          {step === 1 && GL.slice(0, -1).map((_, i) => {
            const y = 18 + i * (LH + GAP) + LH;
            return <motion.text key={`ag${i}`} x={BASE_X_G + 34} y={y + GAP / 2 + 3} textAnchor="middle" fontSize={9} fill="#10b981" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>↓</motion.text>;
          })}
          {step === 2 && DL.slice(0, -1).map((_, i) => {
            const y = 18 + i * (LH + GAP) + LH;
            return <motion.text key={`ad${i}`} x={BASE_X_D + 34} y={y + GAP / 2 + 3} textAnchor="middle" fontSize={9} fill="#ef4444" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>↓</motion.text>;
          })}
          {/* Summary labels */}
          <text x={BASE_X_G + 34} y={132} textAnchor="middle" fontSize={9} fill="#10b981" opacity={0.6}>좁음 → 넓음</text>
          <text x={BASE_X_D + 34} y={132} textAnchor="middle" fontSize={9} fill="#ef4444" opacity={0.6}>넓음 → 좁음</text>
          <motion.text x={400} y={70} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
