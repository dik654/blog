import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { TOK, TC, ATTN, C, STEPS, BODY } from './AttentionFlowData';

export default function AttentionFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {TOK.map((t, i) => (
            <g key={`t${i}`}>
              <motion.rect x={6} y={10 + i * 34} width={42} height={26} rx={5}
                animate={{ fill: `${TC[i]}20`, stroke: TC[i], strokeWidth: step === 0 ? 2 : 1 }} />
              <text x={27} y={27 + i * 34} textAnchor="middle" fontSize={9} fontWeight={600} fill={TC[i]}>{t}</text>
            </g>
          ))}
          {step >= 1 && ['Q', 'K', 'V'].map((lbl, li) => (
            <g key={lbl}>
              <text x={68 + li * 26} y={8} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={['#3b82f6', '#10b981', '#f59e0b'][li]}>{lbl}</text>
              {TOK.map((_, ti) => (
                <motion.rect key={ti} x={56 + li * 26} y={10 + ti * 34} width={20} height={26} rx={3}
                  initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 0.6, scaleX: 1 }}
                  transition={{ delay: ti * 0.08 }}
                  fill={['#3b82f615', '#10b98115', '#f59e0b15'][li]}
                  stroke={['#3b82f6', '#10b981', '#f59e0b'][li]} strokeWidth={0.7} />
              ))}
            </g>
          ))}
          {step >= 2 && <text x={148} y={48} fontSize={14} fill="var(--muted-foreground)">→</text>}
          <text x={228} y={8} textAnchor="middle" fontSize={9} fontWeight={600}
            fill="var(--foreground)">{step >= 3 ? 'Softmax 가중치' : 'Q × Kᵀ'}</text>
          {TOK.map((t, i) => (
            <text key={`ch${i}`} x={185 + i * C + C / 2} y={20} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">{t}</text>
          ))}
          {TOK.map((t, i) => (
            <text key={`rl${i}`} x={182} y={28 + i * C + C / 2 + 2} textAnchor="end" fontSize={9}
              fill="var(--muted-foreground)">{t}</text>
          ))}
          {ATTN.map((row, r) => row.map((v, c) => {
            const show = step >= 2;
            const soft = step >= 3;
            const hex = Math.round(v * 255).toString(16).padStart(2, '0');
            return (
              <g key={`m${r}${c}`}>
                <motion.rect x={185 + c * C} y={24 + r * C} width={C} height={C}
                  animate={{
                    fill: show ? (soft ? `#6366f1${hex}` : '#8b5cf618') : 'color-mix(in oklch, var(--muted) 12%, transparent)',
                    stroke: show ? '#6366f150' : 'var(--border)', strokeWidth: show ? 1 : 0.5,
                  }} transition={{ duration: 0.35, delay: show ? (r * 3 + c) * 0.04 : 0 }} />
                {show && (
                  <motion.text x={185 + c * C + C / 2} y={24 + r * C + C / 2 + 3}
                    textAnchor="middle" fontSize={9} fontWeight={600}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: (r * 3 + c) * 0.04 }}
                    fill={soft && v > 0.4 ? '#6366f1' : 'var(--foreground)'}>{v.toFixed(2)}</motion.text>
                )}
              </g>
            );
          }))}
          {step >= 4 && (
            <g>
              <text x={295} y={48} fontSize={14} fill="var(--muted-foreground)">→</text>
              <text x={340} y={8} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">출력</text>
              {TOK.map((_, i) => (
                <motion.rect key={`o${i}`} x={318} y={24 + i * C} width={36} height={C} rx={3}
                  initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 0.8, scaleX: 1 }}
                  transition={{ delay: i * 0.08 }} fill={`${TC[i]}20`} stroke={TC[i]} strokeWidth={1} />
              ))}
            </g>
          )}
          <motion.text x={380} y={60} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
