import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'Shamir 비밀 분산', body: '다항식 f(x)의 상수항이 비밀 s. n개 점을 배포하고, t개 이상 모이면 s 복원 가능.' },
  { label: 'Share 배포', body: '딜러가 f(1), f(2), ..., f(n)을 각 참여자에게 배포. 다항식 차수 = t-1.' },
  { label: '복원 (t개 이상)', body: '참여자 t명이 share를 제출. 라그랑주 보간법으로 f(0) = s 계산. t-1명은 정보 0.' },
  { label: '임계값 서명 (TSS)', body: '비밀키 sk를 분산. t명이 partial signature 생성 → 결합하면 유효한 서명. sk 재구성 불필요.' },
];

const SHARES = [
  { label: 'S1', x: 80, y: 25 },
  { label: 'S2', x: 170, y: 25 },
  { label: 'S3', x: 260, y: 25 },
  { label: 'S4', x: 350, y: 25 },
];

export default function ThresholdViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Secret */}
          <motion.g animate={{ opacity: step <= 1 ? 1 : (step === 2 ? 0.3 : 0.5) }}>
            <rect x={170} y={75} width={80} height={24} rx={5} fill={`${C3}10`} stroke={C3} strokeWidth={1} />
            <text x={210} y={90} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>
              s = f(0)
            </text>
          </motion.g>
          {/* Shares */}
          {SHARES.map((s, i) => {
            const active = step >= 1;
            const selected = step >= 2 && i < 3; // 3-of-4 threshold
            return (
              <motion.g key={s.label}
                animate={{ opacity: active ? 1 : 0.3, y: step >= 2 && i < 3 ? 5 : 0 }}
                transition={{ type: 'spring', bounce: 0.2 }}>
                <rect x={s.x - 25} y={s.y} width={50} height={24} rx={4}
                  fill={`${selected ? C2 : C1}${selected ? '15' : '08'}`}
                  stroke={selected ? C2 : C1} strokeWidth={selected ? 1.2 : 0.6} />
                <text x={s.x} y={s.y + 15} textAnchor="middle" fontSize={10} fontWeight={500}
                  fill={selected ? C2 : C1}>{s.label}</text>
                {/* Arrow from secret to share */}
                {step === 1 && (
                  <motion.line x1={210} y1={75} x2={s.x} y2={s.y + 24}
                    stroke={C1} strokeWidth={0.6} strokeDasharray="2,2"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                    transition={{ delay: i * 0.1 }} />
                )}
              </motion.g>
            );
          })}
          {/* Reconstruction arrows */}
          {step >= 2 && SHARES.slice(0, 3).map((s, i) => (
            <motion.line key={`r${i}`} x1={s.x} y1={s.y + 29} x2={210} y2={75}
              stroke={C2} strokeWidth={0.6}
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ delay: i * 0.1 }} />
          ))}
          {/* Lagrange label */}
          {step === 2 && (
            <motion.text x={210} y={115} textAnchor="middle" fontSize={10} fill={C2}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              라그랑주 보간 → f(0) = s 복원
            </motion.text>
          )}
          {/* TSS */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={130} y={105} width={160} height={24} rx={5} fill={`${C2}10`} stroke={C2} strokeWidth={0.8} />
              <text x={210} y={118} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>
                partial sig 결합 → 유효 서명
              </text>
              <text x={210} y={128} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                sk 재구성 없이 서명 생성 가능
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
