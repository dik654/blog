import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '입력 텍스트' },
  { label: 'WordPiece 토크나이징' },
  { label: '3종 임베딩 생성' },
  { label: '임베딩 합산' },
  { label: 'Transformer 인코딩 → 출력' },
];
const BODY = [
  '원본 문장 파이프라인 입력',
  '30K 서브워드 사전으로 분할',
  'Token+Position+Segment 임베딩',
  '3 임베딩 element-wise 합산',
  '12 TF 레이어 → [CLS] 출력',
];

const TOKS = ['[CLS]', '나는', '학생', '##이다', '[SEP]'];
const TC = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];
const EMB = [
  { label: 'Token E', color: '#3b82f6' },
  { label: 'Position E', color: '#10b981' },
  { label: 'Segment E', color: '#ec4899' },
];

export default function BERTPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Raw text */}
          <motion.rect x={8} y={8} width={70} height={22} rx={4}
            animate={{ fill: '#6366f118', stroke: '#6366f1', strokeWidth: step === 0 ? 2 : 1 }} />
          <text x={43} y={23} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">나는 학생이다</text>
          {step >= 1 && <text x={90} y={22} fontSize={10} fill="var(--muted-foreground)">→</text>}

          {/* WordPiece tokens */}
          {step >= 1 && TOKS.map((t, i) => (
            <motion.g key={t + i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}>
              <motion.rect x={100 + i * 50} y={8} width={44} height={22} rx={4}
                animate={{ fill: `${TC[i]}15`, stroke: TC[i], strokeWidth: step === 1 ? 2 : 1 }} />
              <text x={122 + i * 50} y={23} textAnchor="middle" fontSize={9} fontWeight={600} fill={TC[i]}>{t}</text>
            </motion.g>
          ))}

          {/* 3 embedding layers */}
          {step >= 2 && EMB.map((e, ei) => (
            <g key={e.label}>
              <text x={80} y={52 + ei * 22} textAnchor="end" fontSize={9} fontWeight={600} fill={e.color}>{e.label}</text>
              {TOKS.map((_, ti) => (
                <motion.rect key={ti} x={100 + ti * 50} y={42 + ei * 22} width={44} height={16} rx={3}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: ei * 0.08 + ti * 0.03 }}
                  fill={`${e.color}12`} stroke={e.color} strokeWidth={0.7} />
              ))}
            </g>
          ))}

          {/* Sum arrow + result */}
          {step >= 3 && (
            <g>
              <text x={80} y={112} textAnchor="end" fontSize={9} fontWeight={600} fill="#8b5cf6">합산</text>
              {TOKS.map((_, i) => (
                <motion.rect key={`s${i}`} x={100 + i * 50} y={102} width={44} height={18} rx={4}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={step === 3 ? 2 : 1} />
              ))}
              <text x={176} y={126} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                E_tok + E_pos + E_seg
              </text>
            </g>
          )}

          {/* Transformer output */}
          {step >= 4 && (
            <g>
              <text x={358} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">×12</text>
              <motion.rect x={340} y={56} width={36} height={54} rx={5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                fill="#ef444412" stroke="#ef4444" strokeWidth={1.5} />
              <text x={358} y={80} textAnchor="middle" fontSize={9} fill="#ef4444">TF</text>
              <text x={358} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Layers</text>
              <motion.path d="M 345 110 L 340 115 L 345 120" fill="none" stroke="#ef4444" strokeWidth={1}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            </g>
          )}
          <motion.text x={400} y={65} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
