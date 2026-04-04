import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const MODELS = [
  { label: 'GAN (2014)', c: '#ef4444', tag: 'G vs D' },
  { label: 'VAE (2014)', c: '#f59e0b', tag: 'Enc→Dec' },
  { label: 'Flow (2018)', c: '#10b981', tag: 'f⁻¹' },
  { label: 'DDPM (2020)', c: '#6366f1', tag: 'ε→x₀' },
  { label: 'Stable Diffusion (2022)', c: '#8b5cf6', tag: 'LDM' },
];
const BODY = [
  '적대적 학습, mode collapse 문제',
  '잠재 정규화, 생성이 흐릿함',
  '역변환 연쇄, likelihood 계산',
  '노이즈 제거, 안정+고품질',
  '잠재 확산+CLIP, 텍스트→이미지',
];
const W = 400, RAIL_Y = 50;

export default function GenerativeTimelineViz() {
  return (
    <StepViz steps={MODELS}>
      {(step) => (
        <svg viewBox={`0 0 ${W + 120} 140`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* timeline rail */}
          <line x1={30} y1={RAIL_Y} x2={W - 30} y2={RAIL_Y} stroke="currentColor" strokeOpacity={0.12} strokeWidth={1.5} />
          {MODELS.map((m, i) => {
            const x = 50 + i * 76;
            const active = i === step;
            return (
              <motion.g key={i}
                animate={{ y: active ? -6 : 0, scale: active ? 1.1 : 0.9 }}
                style={{ transformOrigin: `${x}px ${RAIL_Y}px` }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                {/* dot */}
                <circle cx={x} cy={RAIL_Y} r={active ? 8 : 5}
                  fill={m.c + (active ? '40' : '18')} stroke={m.c}
                  strokeWidth={active ? 2.5 : 1.5} />
                {/* year */}
                <text x={x} y={RAIL_Y + 22} textAnchor="middle" fontSize={9}
                  fill="currentColor" fillOpacity={0.35}>
                  {m.label.match(/\d{4}/)?.[0]}
                </text>
                {/* tag box */}
                <motion.g animate={{ opacity: active ? 1 : 0.3 }}>
                  <rect x={x - 24} y={RAIL_Y + 30} width={48} height={22} rx={5}
                    fill={m.c + '15'} stroke={m.c} strokeWidth={active ? 1.5 : 0.5}
                    strokeOpacity={active ? 0.8 : 0.2} />
                  <text x={x} y={RAIL_Y + 44} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={m.c}>{m.tag}</text>
                </motion.g>
              </motion.g>
            );
          })}
          {/* active model name */}
          <motion.text
            key={step} x={W / 2} y={130} textAnchor="middle"
            fontSize={11} fontWeight={600} fill={MODELS[step].c}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
            {MODELS[step].label.split(' (')[0]}
          </motion.text>
          <motion.text x={420} y={70} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
