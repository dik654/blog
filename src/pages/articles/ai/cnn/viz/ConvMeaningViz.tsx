import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, sp, C, IMG1, K_LINE, K_CURVE, conv } from './ConvMeaningVizData';

const FM = 28; // feature map cell size

function Grid({ data, ox, oy, highlight, label }: {
  data: number[][]; ox: number; oy: number; highlight?: boolean; label: string;
}) {
  return (
    <g>
      <text x={ox + (data[0].length * C) / 2} y={oy - 8} textAnchor="middle" fontSize={12} fontWeight={600}
        fill="var(--foreground)">{label}</text>
      {data.map((row, r) => row.map((v, c) => (
        <g key={`${r}-${c}`}>
          <rect x={ox + c * C} y={oy + r * C} width={C} height={C}
            fill={v > 0 ? (highlight ? '#6366f140' : '#64748b30') : '#ffffff08'}
            stroke={highlight ? '#6366f1' : '#94a3b8'} strokeWidth={0.5} />
          <text x={ox + c * C + C / 2} y={oy + r * C + C / 2 + 4} textAnchor="middle"
            fontSize={10} fill={v > 0 ? 'var(--foreground)' : '#94a3b8'}>{v}</text>
        </g>
      )))}
    </g>
  );
}

function FeatureMap({ data, ox, oy, maxVal, color, label }: {
  data: number[][]; ox: number; oy: number; maxVal: number; color: string; label: string;
}) {
  return (
    <g>
      <text x={ox + (3 * FM) / 2} y={oy - 8} textAnchor="middle" fontSize={12} fontWeight={600} fill={color}>{label}</text>
      {data.map((row, r) => row.map((v, c) => (
        <g key={`${r}-${c}`}>
          <rect x={ox + c * FM} y={oy + r * FM} width={FM} height={FM} rx={3}
            fill={`${color}${Math.round((v / Math.max(maxVal, 1)) * 80).toString(16).padStart(2, '0')}`}
            stroke={color} strokeWidth={0.5} />
          <text x={ox + c * FM + FM / 2} y={oy + r * FM + FM / 2 + 4} textAnchor="middle"
            fontSize={11} fontWeight={v === maxVal ? 700 : 400}
            fill={v === maxVal ? color : 'var(--foreground)'}>{v}</text>
        </g>
      )))}
    </g>
  );
}

export default function ConvMeaningViz() {
  const fmLine = Array.from({ length: 3 }, (_, r) =>
    Array.from({ length: 3 }, (_, c) => conv(IMG1, K_LINE, r, c)));
  const fmCurve = Array.from({ length: 3 }, (_, r) =>
    Array.from({ length: 3 }, (_, c) => conv(IMG1, K_CURVE, r, c)));
  const maxLine = Math.max(...fmLine.flat());
  const maxCurve = Math.max(...fmCurve.flat());

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <Grid data={IMG1} ox={10} oy={22} highlight={step === 0} label="이미지 (숫자 1)" />
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <Grid data={K_LINE} ox={125} oy={38} highlight label="커널 1 (│)" />
              <text x={198} y={85} textAnchor="middle" fontSize={16} fill="#6366f1">→</text>
              <FeatureMap data={fmLine} ox={210} oy={30} maxVal={maxLine} color="#10b981" label="피처맵 1" />
              <text x={252} y={132} textAnchor="middle" fontSize={12} fill="#10b981" fontWeight={600}>
                높은 출력 = 직선 많음
              </text>
            </motion.g>
          )}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <Grid data={K_CURVE} ox={310} oy={38} highlight label="커널 2 (╲╱)" />
              <text x={383} y={85} textAnchor="middle" fontSize={16} fill="#6366f1">→</text>
              <FeatureMap data={fmCurve} ox={395} oy={30} maxVal={maxCurve} color="#f59e0b" label="피처맵 2" />
              <text x={437} y={132} textAnchor="middle" fontSize={12} fill="#f59e0b" fontWeight={600}>
                낮은 출력 = 곡선 적음
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={30} y={152} width={460} height={36} rx={6}
                fill="var(--muted)" fillOpacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
              <text x={260} y={175} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">
                합성곱 = 커널과 유사한 패턴 탐지기 → 출력값 ≈ 유사도
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
