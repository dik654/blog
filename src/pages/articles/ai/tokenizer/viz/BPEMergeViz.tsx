import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const MERGE_STEPS = [
  { tokens: ['l', 'o', 'w', 'e', 'r'], pair: null, label: '초기 문자 분리' },
  { tokens: ['l', 'o', 'w', 'er'], pair: ['e', 'r'], label: 'e+r → er (빈도: 9)' },
  { tokens: ['lo', 'w', 'er'], pair: ['l', 'o'], label: 'l+o → lo (빈도: 7)' },
  { tokens: ['low', 'er'], pair: ['lo', 'w'], label: 'lo+w → low (빈도: 5)' },
  { tokens: ['lower'], pair: ['low', 'er'], label: 'low+er → lower (빈도: 3)' },
];

const STEPS = MERGE_STEPS.map(s => ({ label: s.label }));
const BODY = [
  '모든 문자를 개별 토큰으로 시작',
  '가장 빈번한 쌍 (e,r) 병합',
  '다음 빈도 쌍 (l,o) 병합',
  '연쇄 병합으로 더 큰 토큰 생성',
  '최종: 전체가 하나의 토큰',
];
const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

export default function BPEMergeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const { tokens, pair } = MERGE_STEPS[step];
        return (
          <svg viewBox="0 0 490 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>

            {/* Vocab size indicator */}
            <text x={400} y={22} fontSize={9} fill="var(--muted-foreground)">
              어휘 크기: {256 + step}
            </text>
            <rect x={400} y={26} width={70} height={6} rx={3} fill="none" />
            <motion.rect x={400} y={26} width={70} height={6} rx={3} fill="#10b981"
              animate={{ scaleX: (256 + step) / 260 }}
              style={{ transformOrigin: 'left' }} transition={sp} />

            {/* Current tokens */}
            <text x={20} y={50} fontSize={9} fontWeight={600} fill="var(--foreground)">토큰:</text>
            {(() => {
              const gap = 12;
              const tokW = tokens.map(t => Math.max(t.length * 14, 24));
              const tokX = tokW.reduce<number[]>((acc, w, idx) => {
                acc.push(idx === 0 ? 70 : acc[idx - 1] + tokW[idx - 1] + gap);
                return acc;
              }, []);
              return tokens.map((t, i) => {
                const w = tokW[i];
                const x = tokX[i];
                const merging = pair && (t === pair[0] || t === pair[1]);
                const color = merging ? '#f59e0b' : '#0ea5e9';
                return (
                  <motion.g key={`${step}-${i}`} initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.06 }}>
                    <rect x={x} y={38} width={w} height={24} rx={5}
                      fill={`${color}15`} stroke={color} strokeWidth={merging ? 1.5 : 1} />
                    <text x={x + w / 2} y={54} textAnchor="middle" fontSize={10}
                      fontWeight={600} fill={color}>{t}</text>
                  </motion.g>
                );
              });
            })()}

            {/* Merge arrow */}
            {pair && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={70} y={85} fontSize={9} fill="#f59e0b" fontWeight={600}>
                  병합: "{pair[0]}" + "{pair[1]}" → "{pair[0]}{pair[1]}"
                </text>
                <motion.line x1={70} y1={90} x2={200} y2={90}
                  stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4 }} />
              </motion.g>
            )}

            <motion.text x={20} y={115} fontSize={9} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
