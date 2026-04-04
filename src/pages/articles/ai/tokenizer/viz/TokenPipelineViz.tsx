import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STAGES = [
  { label: '원본 텍스트', tokens: ['"Hello, 세계!"'], color: '#6366f1' },
  { label: '정규화', tokens: ['"hello, 세계!"'], color: '#0ea5e9' },
  { label: '사전 토큰화', tokens: ['hello', ',', ' ', '세계', '!'], color: '#8b5cf6' },
  { label: '서브워드 분할', tokens: ['hel', 'lo', ',', ' ', '세', '계', '!'], color: '#10b981' },
  { label: '토큰 ID', tokens: ['1542', '388', '11', '220', '46451', '35075', '0'], color: '#f59e0b' },
];

const STEPS = [
  { label: '원본 텍스트 입력' },
  { label: '정규화: 소문자 변환, 유니코드 NFC' },
  { label: '사전 토큰화: 공백/구두점 기준 분리' },
  { label: '서브워드 분할: BPE/WordPiece 적용' },
  { label: '토큰 ID: 어휘 사전에서 정수 매핑' },
];
const BODY = [
  '모델에 들어가기 전 원시 문자열',
  '대소문자, 악센트, 특수문자 정리',
  '단어 경계를 먼저 인식',
  '빈도 기반 서브워드 단위로 세분화',
  '임베딩 테이블의 인덱스로 변환',
];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function TokenPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {/* Pipeline arrow */}
          {STAGES.map((s, i) => {
            const active = i === step;
            const y = 50;
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : i < step ? 0.3 : 0.12 }} transition={sp}>
                <rect x={10 + i * 96} y={15} width={88} height={20} rx={4}
                  fill={`${s.color}${active ? '20' : '08'}`}
                  stroke={s.color} strokeWidth={active ? 1.5 : 0.5} />
                <text x={54 + i * 96} y={28} textAnchor="middle" fontSize={9}
                  fontWeight={active ? 600 : 400} fill={s.color}>{s.label}</text>
                {/* tokens */}
                {active && s.tokens.map((t, ti) => {
                  const tw = Math.max(t.length * 7, 20);
                  const tx = 10 + ti * (tw + 4);
                  return (
                    <motion.g key={ti} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ ...sp, delay: ti * 0.05 }}>
                      <rect x={tx} y={y} width={tw} height={18} rx={3}
                        fill={`${s.color}15`} stroke={s.color} strokeWidth={1} />
                      <text x={tx + tw / 2} y={y + 12} textAnchor="middle" fontSize={9}
                        fill={s.color} fontWeight={500}>{t}</text>
                    </motion.g>
                  );
                })}
              </motion.g>
            );
          })}

          <motion.text x={20} y={100} fontSize={9} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
