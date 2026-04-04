import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '큰 초기 어휘 (예: 100만 후보)' },
  { label: 'EM으로 각 토큰 확률 P(xᵢ) 추정' },
  { label: '손실 증가 최소 토큰 제거 반복' },
  { label: '목표 어휘 크기 도달 → 완성' },
];
const BODY = [
  'BPE와 반대: 큰 것에서 줄여나감',
  'Viterbi 알고리즘으로 최적 분할 탐색',
  '정보량 낮은 토큰부터 가지치기',
  'T5: 32K, LLaMA: 32K 어휘',
];

const VOCAB = [
  { tokens: ['안녕','하','세','요','▁','He','l','lo','▁안','녕하','세요','Hel'], sz: '100K' },
  { tokens: ['안녕','하세요','▁','He','llo','▁안녕','세요','Hel'], sz: '80K' },
  { tokens: ['▁안녕','하세요','▁He','llo'], sz: '50K' },
  { tokens: ['▁안녕','하세요','▁He','llo'], sz: '32K' },
];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function UnigramViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const { tokens, sz } = VOCAB[step];
        return (
          <svg viewBox="0 0 490 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>

            {/* Vocab size bar */}
            <text x={380} y={22} fontSize={9} fill="var(--muted-foreground)">어휘: {sz}</text>
            <rect x={380} y={26} width={90} height={6} rx={3} fill="none" />
            <motion.rect x={380} y={26} width={90} height={6} rx={3} fill="#8b5cf6"
              animate={{ scaleX: 1 - step * 0.2 }}
              style={{ transformOrigin: 'left' }} transition={sp} />

            {/* Direction label */}
            <text x={20} y={22} fontSize={9} fontWeight={600} fill="#8b5cf6">
              Unigram: 큰 어휘 → 축소
            </text>

            {/* Token grid */}
            {tokens.map((t, i) => {
              const w = Math.max(t.length * 11, 26);
              const row = Math.floor(i / 6);
              const col = i % 6;
              const x = 20 + col * 74;
              const y = 40 + row * 30;
              const removing = step < 3 && i >= tokens.length - 2;
              const color = removing ? '#ef4444' : '#10b981';
              return (
                <motion.g key={`${step}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.04 }}>
                  <rect x={x} y={y} width={w} height={22} rx={4}
                    fill={`${color}12`} stroke={color}
                    strokeWidth={removing ? 1.5 : 0.8}
                    strokeDasharray={removing ? '3 2' : 'none'} />
                  <text x={x + w / 2} y={y + 15} textAnchor="middle" fontSize={9}
                    fill={color} fontWeight={500}>{t}</text>
                </motion.g>
              );
            })}

            <motion.text x={20} y={118} fontSize={9} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
