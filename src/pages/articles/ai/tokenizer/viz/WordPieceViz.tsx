import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '입력 단어를 문자로 분해' },
  { label: '우도 점수로 최적 분할 탐색' },
  { label: '## 접두사로 위치 표시' },
  { label: '토큰 ID로 매핑 (BERT vocab 30,522개)' },
];
const BODY = [
  '모든 글자를 후보 토큰으로 시작',
  'score = count(ab) / (count(a)*count(b))',
  '단어 시작 vs 내부 조각을 구분',
  '[CLS], [SEP] 등 특수 토큰 포함',
];
const PHASES = [
  { word: 'unhappiness', tokens: ['u','n','h','a','p','p','i','n','e','s','s'], colors: Array(11).fill('#6366f1') },
  { word: 'unhappiness', tokens: ['un','happy','ness'], colors: ['#0ea5e9','#10b981','#f59e0b'] },
  { word: 'unhappiness', tokens: ['un','##happy','##ness'], colors: ['#0ea5e9','#10b981','#f59e0b'] },
  { word: 'unhappiness', tokens: ['5765','14813','2791'], colors: ['#0ea5e9','#10b981','#f59e0b'] },
];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function WordPieceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const { tokens, colors } = PHASES[step];
        return (
          <svg viewBox="0 0 490 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>

            {/* Source word */}
            <text x={20} y={25} fontSize={9} fontWeight={600} fill="var(--foreground)">
              "unhappiness"
            </text>
            <motion.line x1={20} y1={30} x2={460} y2={30}
              stroke="var(--border)" strokeWidth={0.5} />

            {/* Tokens */}
            {tokens.map((t, i) => {
              const w = Math.max(t.length * 10, 22);
              const gap = step === 0 ? 2 : 8;
              let x = 20;
              for (let j = 0; j < i; j++) x += Math.max(tokens[j].length * 10, 22) + gap;
              return (
                <motion.g key={`${step}-${i}`} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.06 }}>
                  <rect x={x} y={42} width={w} height={24} rx={4}
                    fill={`${colors[i]}15`} stroke={colors[i]} strokeWidth={1.5} />
                  <text x={x + w / 2} y={58} textAnchor="middle" fontSize={step === 0 ? 9 : 8}
                    fontWeight={600} fill={colors[i]}>{t}</text>
                </motion.g>
              );
            })}

            {/* Score formula for step 1 */}
            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={300} y={42} width={170} height={24} rx={4}
                  fill="#10b98110" stroke="#10b981" strokeWidth={1} />
                <text x={385} y={58} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={500}>
                  score(un) = 0.82 {'>'} score(nh) = 0.03
                </text>
              </motion.g>
            )}

            <motion.text x={20} y={100} fontSize={9} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
