import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const TOKENIZERS = [
  { name: 'GPT-4 (BPE)', tokens: ['인공','지능','이',' 세상','을',' 바꾸','고',' 있다'], color: '#0ea5e9', count: 8 },
  { name: 'BERT (WordPiece)', tokens: ['인공','##지','##능이','세상','##을','바꾸','##고','있다'], color: '#10b981', count: 8 },
  { name: 'LLaMA (Unigram)', tokens: ['▁인공지능이','▁세상을','▁바꾸고','▁있다'], color: '#f59e0b', count: 4 },
];

const STEPS = [
  { label: 'GPT-4 (BPE): 8 토큰 — 바이트 기반 분할' },
  { label: 'BERT (WordPiece): 8 토큰 — ## 접두사 구분' },
  { label: 'LLaMA (Unigram): 4 토큰 — 한국어 어절 효율적' },
];
const BODY = [
  'byte-level BPE, 한글 바이트 경계에서 분할됨',
  '우도 기반 병합, 단어 내부 조각에 ## 부착',
  '언어 독립 처리, 한국어 어절 단위에 최적',
];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function TokenizerCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {/* Source text */}
          <text x={20} y={22} fontSize={9} fill="var(--muted-foreground)">
            원문: "인공지능이 세상을 바꾸고 있다"
          </text>

          {TOKENIZERS.map((t, ti) => {
            const active = ti === step;
            const y = 38 + ti * 32;
            return (
              <motion.g key={ti} animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
                <text x={20} y={y + 12} fontSize={9} fontWeight={600} fill={t.color}>{t.name}</text>
                {t.tokens.map((tok, i) => {
                  const w = Math.max(tok.length * 9, 18);
                  let x = 160;
                  for (let j = 0; j < i; j++) x += Math.max(t.tokens[j].length * 9, 18) + 6;
                  return (
                    <motion.g key={i} initial={active ? { opacity: 0, y: 4 } : {}}
                      animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: active ? i * 0.04 : 0 }}>
                      <rect x={x} y={y} width={w} height={18} rx={3}
                        fill={`${t.color}12`} stroke={t.color} strokeWidth={active ? 1.2 : 0.6} />
                      <text x={x + w / 2} y={y + 12} textAnchor="middle" fontSize={9}
                        fill={t.color}>{tok}</text>
                    </motion.g>
                  );
                })}
                {/* Count badge */}
                {active && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                    <rect x={440} y={y} width={30} height={18} rx={9} fill={`${t.color}20`} stroke={t.color} strokeWidth={1} />
                    <text x={455} y={y + 12} textAnchor="middle" fontSize={9} fontWeight={600} fill={t.color}>{t.count}</text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}

          <motion.text x={20} y={132} fontSize={9} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
