import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '입력: [CLS] + 문장A + [SEP] + 문장B' },
  { label: 'MLM: 15% 토큰 마스킹' },
  { label: 'MLM: 마스크 위치 예측' },
  { label: 'NSP: [CLS] → 다음 문장 판별' },
  { label: '결합 손실 역전파' },
];
const BODY = [
  '연속/랜덤 문장쌍 50:50 샘플링',
  '80% MASK, 10% 랜덤, 10% 유지',
  '[MASK] 위치 원래 토큰 예측',
  '[CLS]로 IsNext/NotNext 분류',
  'L_MLM + L_NSP 합산 역전파',
];

const TOKS = ['[CLS]','나는','[MASK]','이다','[SEP]','오늘','날씨','[MASK]'];
const COLS = ['#6366f1','#3b82f6','#ef4444','#3b82f6','#6366f1','#10b981','#10b981','#ef4444'];
const TW = 38, TH = 18, TX0 = 12, TY0 = 12;

export default function PreTrainFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Token row */}
          {TOKS.map((t, i) => {
            const isMask = t === '[MASK]';
            const lit = step === 0 || (step === 1 && isMask);
            return (
              <g key={`t${i}`}>
                <motion.rect x={TX0 + i * (TW + 5)} y={TY0} width={TW} height={TH} rx={3}
                  animate={{ fill: `${COLS[i]}${lit ? '20' : '0a'}`, stroke: COLS[i],
                    strokeWidth: lit ? 2 : 0.8, opacity: step >= 1 && isMask ? 1 : 0.8 }}
                  transition={{ duration: 0.25 }} />
                <text x={TX0 + i * (TW + 5) + TW / 2} y={TY0 + 13} textAnchor="middle"
                  fontSize={9} fontWeight={isMask ? 800 : 500} fill={COLS[i]}>{t}</text>
              </g>
            );
          })}
          {[['A',3.5],['B',6.5]].map(([s,off]) => (
            <text key={s as string} x={TX0+(off as number)*(TW+5)} y={TY0+TH+12} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Segment {s}</text>
          ))}

          {/* BERT encoder block */}
          <motion.rect x={60} y={50} width={260} height={24} rx={5}
            animate={{ fill: '#8b5cf610', stroke: '#8b5cf6', strokeWidth: step >= 2 ? 2 : 1 }} />
          <text x={190} y={66} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">
            BERT Encoder ×12
          </text>

          {/* MLM branch (top-left output) */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }}>
            <text x={60} y={92} fontSize={9} fontWeight={600} fill="#ef4444">MLM Head</text>
            {[2, 7].map((mi) => (
              <g key={`mlm${mi}`}>
                <motion.line x1={TX0 + mi * (TW + 5) + TW / 2} y1={74} x2={TX0 + mi * (TW + 5) + TW / 2} y2={96}
                  stroke="#ef4444" strokeDasharray="3 2" animate={{ opacity: step >= 2 ? 0.7 : 0 }} />
                {step >= 2 && (
                  <motion.text x={TX0 + mi * (TW + 5) + TW / 2} y={108} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill="#ef4444"
                    initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }}>
                    {mi === 2 ? '학생' : '좋다'}
                  </motion.text>
                )}
              </g>
            ))}
          </motion.g>

          {/* NSP branch (bottom-right) */}
          <motion.g animate={{ opacity: step >= 3 ? 1 : 0.15 }}>
            <motion.line x1={TX0 + TW / 2} y1={74} x2={TX0 + TW / 2} y2={118}
              stroke="#ec4899" strokeDasharray="3 2" animate={{ opacity: step >= 3 ? 0.7 : 0 }} />
            <motion.rect x={260} y={94} width={100} height={20} rx={4}
              animate={{ fill: `#ec4899${step >= 3 ? '18' : '08'}`, stroke: '#ec4899', strokeWidth: step >= 3 ? 2 : 0.8 }} />
            <text x={310} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ec4899">
              NSP: IsNext?
            </text>
            <text x={38} y={130} fontSize={9} fill="#ec4899">[CLS] →</text>
          </motion.g>

          {/* Loss backprop arrows */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <text x={190} y={138} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">
                L_total = L_MLM + L_NSP → 역전파
              </text>
            </motion.g>
          )}
          <motion.text x={390} y={70} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
