import { motion } from 'framer-motion';
import StepViz from './StepViz';
import {
  STEPS, BA_X, BA_Y, BB_X, BB_Y, KEY_X, KEY_Y,
  SIG_A_OX, SIG_A_OY, SIG_B_OX, SIG_B_OY,
  SIG_A_DX, SIG_A_DY, SIG_B_DX, SIG_B_DY,
} from './SlashingVizData';
import { Block, PenaltyBar } from './SlashingVizParts';

export default function SlashingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 332" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {/* Blocks */}
          <Block x={BA_X} y={BA_Y} label="Block A" color="#22c55e" show />
          <Block x={BB_X} y={BB_Y} label="Block B" color={step >= 1 ? '#ef4444' : '#22c55e'} show={step >= 1} />

          {/* Dashed connector */}
          {step >= 1 && <>
            <line x1={SIG_A_OX} y1={SIG_A_OY - 2} x2={SIG_A_DX} y2={SIG_A_DY + 12}
              stroke="#22c55e" strokeWidth={1} strokeDasharray="4 3" opacity={0.35} />
            <line x1={SIG_B_OX} y1={SIG_B_OY - 2} x2={SIG_B_DX} y2={SIG_B_DY + 12}
              stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" opacity={0.35} />
          </>}

          {/* BLS Key */}
          <motion.circle cx={KEY_X} cy={KEY_Y} r={26}
            animate={{ fill: step >= 1 ? '#ef444422' : '#6366f122', stroke: step >= 1 ? '#ef4444' : '#6366f1' }}
            strokeWidth={2.5} transition={{ duration: 0.4 }} />
          <text x={KEY_X} y={KEY_Y - 5} textAnchor="middle" fontSize={14}>🔑</text>
          <text x={KEY_X} y={KEY_Y + 12} textAnchor="middle" fontSize={8}
            fill="var(--muted-foreground)">BLS Key</text>

          {/* SIG A */}
          <motion.g
            animate={step >= 1 ? { x: SIG_A_DX - SIG_A_OX, y: SIG_A_DY - SIG_A_OY } : { x: 0, y: 0 }}
            initial={{ x: 0, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}>
            <motion.g animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.2 }}>
              <rect x={SIG_A_OX - 23} y={SIG_A_OY - 10} width={46} height={20} rx={5}
                fill="#22c55e33" stroke="#22c55e" strokeWidth={1.5} />
              <text x={SIG_A_OX} y={SIG_A_OY + 4} textAnchor="middle" fontSize={9} fontWeight="700"
                fill="#22c55e">SIG A</text>
            </motion.g>
          </motion.g>

          {/* SIG B */}
          <motion.g
            animate={step >= 1 ? { x: SIG_B_DX - SIG_B_OX, y: SIG_B_DY - SIG_B_OY } : { x: 0, y: 0 }}
            initial={{ x: 0, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.2, delay: 0.12 }}>
            <motion.g animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.2, delay: 0.12 }}>
              <rect x={SIG_B_OX - 23} y={SIG_B_OY - 10} width={46} height={20} rx={5}
                fill="#ef444433" stroke="#ef4444" strokeWidth={1.5} />
              <text x={SIG_B_OX} y={SIG_B_OY + 4} textAnchor="middle" fontSize={9} fontWeight="700"
                fill="#ef4444">SIG B</text>
            </motion.g>
          </motion.g>

          {/* ProposerSlashing notice */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.3 }}>
            <rect x={120} y={230} width={180} height={28} rx={6}
              fill="#f59e0b22" stroke="#f59e0b" strokeWidth={1.5} />
            <text x={210} y={242} textAnchor="middle" fontSize={9} fontWeight="700" fill="#f59e0b">
              ⚠ ProposerSlashing
            </text>
            <text x={210} y={253} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              → 다음 블록에 포함됨
            </text>
          </motion.g>

          {/* Penalty bars */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: 0.3 }}>
            <g transform="translate(0, 270)">
              <PenaltyBar pct={1 / 32} label="즉각 삭감 (1/32 = 1 ETH)" color="#f59e0b" />
            </g>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 4 ? 1 : 0 }} transition={{ duration: 0.3 }}>
            <g transform="translate(0, 302)">
              <PenaltyBar pct={0.31} label="Correlation (×3, 최대 32 ETH)" color="#ef4444" />
            </g>
            <text x={210} y={326} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              공격자 1/3 도달 시 전액 몰수
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
