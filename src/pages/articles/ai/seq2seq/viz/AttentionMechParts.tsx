import { motion } from 'framer-motion';
import {
  ENC_WORDS, H_VECS, S_VEC, SCORES, MAX_SCORE,
  H_C, S_C, ATT_C, ERR_C,
} from './AttentionMechVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
function fmtV(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(',')}]`; }

/** Step 0: Fixed context bottleneck */
export function BottleneckStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={100} y={20} width={200} height={36} rx={6}
        fill={ERR_C + '10'} stroke={ERR_C} strokeWidth={1.5} />
      <text x={200} y={43} textAnchor="middle" fontSize={12} fontWeight={600} fill={ERR_C}>
        고정 컨텍스트 (병목)
      </text>
      <line x1={330} y1={128} x2={250} y2={56} stroke={ERR_C} strokeWidth={1.5} />
      {[70, 200].map(cx => (
        <g key={cx}>
          <line x1={cx - 12} y1={133} x2={cx + 12} y2={167} stroke={ERR_C} strokeWidth={1.5} opacity={0.4} />
          <line x1={cx + 12} y1={133} x2={cx - 12} y2={167} stroke={ERR_C} strokeWidth={1.5} opacity={0.4} />
        </g>
      ))}
      <text x={200} y={80} textAnchor="middle" fontSize={10} fill={ERR_C}>
        마지막 h₃만 사용 → h₁, h₂ 정보 손실
      </text>
    </motion.g>
  );
}

/** Step 1: sₜ + attention score lines */
export function ScoreStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={375} y={128} width={80} height={44} rx={6}
        fill={S_C + '14'} stroke={S_C} strokeWidth={2} />
      <text x={415} y={148} textAnchor="middle" fontSize={12} fontWeight={700} fill={S_C}>sₜ</text>
      <text x={415} y={164} textAnchor="middle" fontSize={9} fill={S_C}>{fmtV(S_VEC)}</text>
      {ENC_WORDS.map((_, i) => {
        const cx = 70 + i * 130;
        const lineW = 1 + (SCORES[i] / MAX_SCORE) * 2;
        return (
          <g key={`att1-${i}`}>
            <line x1={cx + 42} y1={150} x2={375} y2={150}
              stroke={ATT_C} strokeWidth={lineW} opacity={0.4} />
            <rect x={cx - 22} y={114} width={44} height={14} rx={3}
              fill="var(--card)" stroke={ATT_C} strokeWidth={0.5} />
            <text x={cx} y={124} textAnchor="middle" fontSize={9} fontWeight={600} fill={ATT_C}>
              s·h={SCORES[i]}
            </text>
          </g>
        );
      })}
    </motion.g>
  );
}

/** Always-visible h boxes with vector values + word labels */
export function HBoxes() {
  return (
    <>
      {ENC_WORDS.map((w, i) => {
        const cx = 70 + i * 130;
        return (
          <g key={`h-${i}`}>
            <rect x={cx - 42} y={128} width={84} height={44} rx={6}
              fill="var(--card)" stroke={H_C} strokeWidth={1.2} />
            <text x={cx} y={148} textAnchor="middle" fontSize={12} fontWeight={700} fill={H_C}>
              h{i + 1}
            </text>
            <text x={cx} y={164} textAnchor="middle" fontSize={9} fill={H_C}>{fmtV(H_VECS[i])}</text>
            <line x1={cx} y1={208} x2={cx} y2={172} stroke={H_C} strokeWidth={0.6} opacity={0.3} />
            <text x={cx} y={220} textAnchor="middle" fontSize={11} fill={H_C}>"{w}"</text>
          </g>
        );
      })}
    </>
  );
}
