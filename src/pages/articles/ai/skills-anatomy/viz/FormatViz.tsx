import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, FRONTMATTER_FIELDS } from './FormatData';

const W = 460, H = 230;
const FX = 40, FW = 380, FH = 180;

export default function FormatViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* File outline */}
          <rect x={FX} y={20} width={FW} height={FH} rx={6}
            fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
          <text x={FX + 10} y={14} fontSize={9} fontWeight={600}
            fill="var(--muted-foreground)">SKILL.md</text>

          {/* YAML section */}
          <motion.rect x={FX} y={20} width={FW} height={90} rx={6}
            fill={step <= 1 ? '#6366f108' : 'var(--card)'}
            stroke={step <= 1 ? '#6366f1' : 'var(--border)'}
            animate={{ strokeWidth: step <= 1 ? 1.5 : 1 }}
            transition={{ duration: 0.3 }} />
          <text x={FX + 14} y={37} fontSize={9} fontWeight={700}
            fill="#6366f1">--- (YAML frontmatter)</text>

          {/* Frontmatter fields */}
          {step >= 1 && FRONTMATTER_FIELDS.map((f, i) => (
            <motion.g key={f.key}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: step === 1 ? 1 : 0.4, x: 0 }}
              transition={{ delay: i * 0.08 }}>
              <text x={FX + 24} y={55 + i * 14} fontSize={9}
                fontWeight={600} fill={f.color}>{f.key}:</text>
              <text x={FX + 100} y={55 + i * 14} fontSize={9}
                fill="var(--muted-foreground)">{f.value}</text>
            </motion.g>
          ))}

          {/* Separator */}
          <line x1={FX + 10} y1={110} x2={FX + FW - 10} y2={110}
            stroke="var(--border)" strokeWidth={1} strokeDasharray="4 3" />
          <text x={FX + 14} y={106} fontSize={9}
            fill="var(--muted-foreground)">---</text>

          {/* Body section */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.3 }}>
            <text x={FX + 14} y={128} fontSize={9} fontWeight={700}
              fill="#f59e0b">마크다운 바디 (프롬프트)</text>
            {step >= 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={FX + 24} y={148} fontSize={9}
                  fill="var(--muted-foreground)">
                  {'{{language}}'}로 작성된 코드를 리뷰하세요.
                </text>
                <text x={FX + 24} y={164} fontSize={9}
                  fill="var(--muted-foreground)">
                  파일: {'{{file_path}}'}
                </text>
                {/* Highlight template vars */}
                <rect x={FX + 22} y={139} width={68} height={12} rx={2}
                  fill="#10b98120" stroke="#10b981" strokeWidth={0.5} />
                <rect x={FX + 46} y={155} width={64} height={12} rx={2}
                  fill="#10b98120" stroke="#10b981" strokeWidth={0.5} />
              </motion.g>
            )}
          </motion.g>

          {/* Step 3: examples */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['code-review', 'commit-msg', 'translate'].map((s, i) => (
                <motion.g key={s}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}>
                  <rect x={FX + 10 + i * 125} y={178} width={110} height={18} rx={3}
                    fill={['#6366f115', '#10b98115', '#f59e0b15'][i]}
                    stroke={['#6366f1', '#10b981', '#f59e0b'][i]}
                    strokeWidth={1} />
                  <text x={FX + 65 + i * 125} y={191} textAnchor="middle"
                    fontSize={9} fontWeight={600}
                    fill={['#6366f1', '#10b981', '#f59e0b'][i]}>{s}.md</text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
