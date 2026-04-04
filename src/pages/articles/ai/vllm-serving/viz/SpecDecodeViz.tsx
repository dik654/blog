import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const TOKENS = ['The', 'cat', 'sat', 'on', 'the'];
const RESULT = ['accept', 'accept', 'accept', 'reject', 'skip'] as const;
const TW = 44, TH = 28, GAP = 6;

const STEPS = [
  { label: '프롬프트 입력' },
  { label: 'Draft 모델이 K=5 토큰 생성' },
  { label: 'Target 모델이 한 번에 검증' },
  { label: '수락/거절 판정' },
  { label: '결과: 3+1 = 4 토큰/step' },
];
const BODY = [
  'Target(70B) 프롬프트 입력',
  'Draft(7B)이 K=5 후보 자기회귀 생성',
  'K+1개 위치 단일 forward pass 검증',
  'P_target ≥ P_draft이면 수락',
  '3수락+1리샘플 = 4tok/step',
];

const stColor = { accept: '#10b981', reject: '#ef4444', skip: '#64748b' };
const stIcon = { accept: '✓', reject: '✗', skip: '—' };

export default function SpecDecodeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Draft model label */}
          <text x={12} y={14} fontSize={9} fontWeight={600} fill="#f59e0b">Draft (7B)</text>
          <text x={12} y={66} fontSize={9} fontWeight={600} fill="#6366f1">Target (70B)</text>
          {/* Token slots */}
          {TOKENS.map((t, i) => {
            const x = 20 + i * (TW + GAP);
            const drafted = step >= 1;
            const verified = step >= 2;
            const judged = step >= 3;
            const r = RESULT[i];
            const col = judged ? stColor[r] : drafted ? '#f59e0b' : 'var(--border)';
            return (
              <g key={i}>
                {/* Draft token box */}
                <motion.rect x={x} y={20} width={TW} height={TH} rx={4}
                  animate={{
                    fill: drafted ? `${col}18` : 'color-mix(in oklch, var(--muted) 10%, transparent)',
                    stroke: col, strokeWidth: drafted ? 1.5 : 0.5,
                    opacity: (judged && r === 'skip') ? 0.25 : 1,
                  }} transition={{ duration: 0.3, delay: drafted ? i * 0.08 : 0 }} />
                {drafted && (
                  <motion.text x={x + TW / 2} y={38} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={col}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.08 }}>{t}</motion.text>
                )}
                {/* Verification arrow */}
                {verified && (
                  <motion.line x1={x + TW / 2} y1={48} x2={x + TW / 2} y2={68}
                    stroke="var(--border)" strokeWidth={1} strokeDasharray="2 2"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} />
                )}
                {/* Verification result */}
                {verified && (
                  <motion.rect x={x} y={72} width={TW} height={TH} rx={4}
                    animate={{
                      fill: judged ? `${stColor[r]}18` : '#6366f112',
                      stroke: judged ? stColor[r] : '#6366f1',
                      strokeWidth: judged ? 1.5 : 0.8,
                      opacity: (judged && r === 'skip') ? 0.25 : 1,
                    }} transition={{ duration: 0.3, delay: i * 0.06 }} />
                )}
                {judged && (
                  <motion.text x={x + TW / 2} y={90} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={stColor[r]}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: i * 0.06 }}>{stIcon[r]}</motion.text>
                )}
              </g>
            );
          })}
          {/* Summary badge */}
          {step === 4 && (
            <motion.text x={280} y={58} fontSize={9} fontWeight={600} fill="#10b981"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              4 tok/step
            </motion.text>
          )}
          {/* inline body */}
          <motion.text x={350} y={60} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
