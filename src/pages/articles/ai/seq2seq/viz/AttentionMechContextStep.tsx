import { motion } from 'framer-motion';
import { ENC_WORDS, S_VEC, SCORES, CTX_VEC, S_C, ATT_C } from './AttentionMechVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
function fmtV(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(',')}]`; }
const totalScore = SCORES.reduce((a, b) => a + b, 0);
const probs = SCORES.map(s => s / totalScore);

/** Step 2+: dynamic context weighted sum */
export default function ContextStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={375} y={128} width={80} height={44} rx={6}
        fill={S_C + '14'} stroke={S_C} strokeWidth={1} />
      <text x={415} y={148} textAnchor="middle" fontSize={12} fontWeight={700} fill={S_C}>sₜ</text>
      <text x={415} y={164} textAnchor="middle" fontSize={9} fill={S_C}>{fmtV(S_VEC)}</text>
      {ENC_WORDS.map((_, i) => {
        const cx = 70 + i * 130;
        return (
          <g key={`wr-${i}`}>
            <rect x={cx - 22} y={114} width={44} height={14} rx={3}
              fill="var(--card)" stroke={ATT_C} strokeWidth={0.5} />
            <text x={cx} y={124} textAnchor="middle" fontSize={9} fontWeight={600} fill={ATT_C}>
              ×{probs[i].toFixed(2)}
            </text>
          </g>
        );
      })}
      <rect x={50} y={18} width={260} height={44} rx={8}
        fill={ATT_C + '18'} stroke={ATT_C} strokeWidth={2} />
      <text x={180} y={38} textAnchor="middle" fontSize={12} fontWeight={700} fill={ATT_C}>
        동적 컨텍스트 벡터
      </text>
      <text x={180} y={54} textAnchor="middle" fontSize={10} fill={ATT_C}>{fmtV(CTX_VEC)}</text>
      {ENC_WORDS.map((_, i) => {
        const cx = 70 + i * 130;
        const weight = probs[i];
        return (
          <motion.line key={`ctx-${i}`}
            x1={cx} y1={128} x2={180} y2={62}
            stroke={ATT_C} strokeWidth={1 + weight * 4} opacity={0.3 + weight * 0.7}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.15, duration: 0.4 }} />
        );
      })}
      <rect x={70} y={72} width={220} height={18} rx={4} fill="var(--card)" />
      <text x={180} y={84} textAnchor="middle" fontSize={9} fill={ATT_C}>
        Σ(가중치 × h) — 선 두께 = 가중치 크기
      </text>
    </motion.g>
  );
}
