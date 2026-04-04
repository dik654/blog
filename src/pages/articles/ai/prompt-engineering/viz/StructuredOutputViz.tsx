import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, FORMATS } from './StructuredOutputData';

const W = 460, H = 220;
const CX = W / 2;

export default function StructuredOutputViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 3 format cards (steps 0-2) */}
          {FORMATS.map((f, i) => {
            const fx = 50 + i * 140;
            const active = step === i;
            const done = step > i;
            return (
              <motion.g key={f.label}
                animate={{ opacity: active ? 1 : done ? 0.5 : step === 3 ? 0.3 : 0.2 }}
                transition={{ duration: 0.3 }}>
                <rect x={fx} y={25} width={110} height={70} rx={6}
                  fill={active ? `${f.color}20` : `${f.color}08`}
                  stroke={f.color} strokeWidth={active ? 2 : 1} />
                {/* icon */}
                <text x={fx + 55} y={55} textAnchor="middle" fontSize={14}
                  fontWeight={700} fill={f.color} fontFamily="monospace">
                  {f.icon}
                </text>
                {/* label */}
                <text x={fx + 55} y={82} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={f.color}>{f.label}</text>
              </motion.g>
            );
          })}

          {/* arrow to parsed output (active format) */}
          {step < 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={50 + step * 140 + 55} y1={95}
                x2={CX} y2={135}
                stroke={FORMATS[step].color} strokeWidth={1}
                strokeDasharray="4 3" />
              <rect x={CX - 60} y={135} width={120} height={28} rx={5}
                fill={`${FORMATS[step].color}15`}
                stroke={FORMATS[step].color} strokeWidth={1} />
              <text x={CX} y={153} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={FORMATS[step].color}>
                파싱 가능한 출력
              </text>
            </motion.g>
          )}

          {/* step 3: failure patterns */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={CX - 90} y={120} width={80} height={40} rx={5}
                fill="#ef444418" stroke="#ef4444" strokeWidth={1} />
              <text x={CX - 50} y={138} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#ef4444">스키마 없음</text>
              <text x={CX - 50} y={152} textAnchor="middle" fontSize={9}
                fill="#ef4444" opacity={0.7}>필드 누락</text>

              <rect x={CX + 10} y={120} width={80} height={40} rx={5}
                fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={CX + 50} y={138} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#10b981">예시 포함</text>
              <text x={CX + 50} y={152} textAnchor="middle" fontSize={9}
                fill="#10b981" opacity={0.7}>95%+ 준수</text>

              <text x={CX - 50} y={175} textAnchor="middle" fontSize={9}
                fill="#ef4444">❌</text>
              <text x={CX + 50} y={175} textAnchor="middle" fontSize={9}
                fill="#10b981">✅</text>
            </motion.g>
          )}

          <motion.g animate={{ opacity: 0.5 }}>
            <text x={CX} y={H - 10} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">
              구조화된 출력 → 자동화 파이프라인 연동
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
