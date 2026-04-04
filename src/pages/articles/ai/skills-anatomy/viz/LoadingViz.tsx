import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, SKILL_LIST } from './LoadingData';

const W = 460, H = 230;
const CX = W / 2;

export default function LoadingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Skills directory */}
          <rect x={20} y={20} width={130} height={SKILL_LIST.length * 28 + 20} rx={6}
            fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
          <text x={30} y={14} fontSize={9} fontWeight={700}
            fill="var(--foreground)">.skills/</text>

          {SKILL_LIST.map((s, i) => {
            const y = 30 + i * 28;
            const isMatch = step === 2 && i === 0;
            const isLoaded = step === 3 && i === 0;
            return (
              <motion.g key={s.name}
                animate={{
                  opacity: step === 0 ? (i <= 2 ? 1 : 0.3) : 1,
                }}
                transition={{ delay: i * 0.05 }}>
                <rect x={30} y={y} width={110} height={22} rx={4}
                  fill={isMatch || isLoaded ? `${s.color}20` : `${s.color}08`}
                  stroke={isMatch || isLoaded ? s.color : 'var(--border)'}
                  strokeWidth={isMatch || isLoaded ? 1.5 : 0.5} />
                <text x={40} y={y + 15} fontSize={9}
                  fontWeight={isMatch || isLoaded ? 700 : 400}
                  fill={isMatch || isLoaded ? s.color : 'var(--muted-foreground)'}>
                  {s.name}
                </text>
              </motion.g>
            );
          })}

          {/* System prompt area */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <rect x={180} y={20} width={260} height={80} rx={6}
                fill="#6366f108" stroke="#6366f1" strokeWidth={1} />
              <text x={190} y={38} fontSize={9} fontWeight={700}
                fill="#6366f1">시스템 프롬프트</text>
              {SKILL_LIST.map((s, i) => (
                <text key={s.name} x={190} y={54 + i * 12} fontSize={9}
                  fill="var(--muted-foreground)">
                  • {s.name}: {s.desc} (~24tok)
                </text>
              ))}
            </motion.g>
          )}

          {/* User message → matching */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={180} y={115} width={260} height={30} rx={5}
                fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1} />
              <text x={190} y={134} fontSize={9} fill="#f59e0b"
                fontWeight={600}>"이 코드 리뷰해줘"</text>
              <motion.line x1={310} y1={145} x2={310} y2={165}
                stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={310} y={178} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#f59e0b">→ code-review 매칭</text>
            </motion.g>
          )}

          {/* Lazy load indicator */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}>
              <motion.line x1={140} y1={40} x2={180} y2={40}
                stroke="#6366f1" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }} />
              <rect x={180} y={155} width={260} height={55} rx={6}
                fill="#10b98108" stroke="#10b981" strokeWidth={1.5} />
              <text x={190} y={172} fontSize={9} fontWeight={700}
                fill="#10b981">code-review 전체 로드</text>
              <text x={190} y={188} fontSize={9}
                fill="var(--muted-foreground)">
                파라미터 바인딩 + 프롬프트 바디 포함
              </text>
              <text x={190} y={200} fontSize={9}
                fill="var(--muted-foreground)">
                나머지 4개 스킬 — 요약 상태 유지
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
