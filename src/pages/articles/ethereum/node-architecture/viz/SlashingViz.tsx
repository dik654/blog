import { motion } from 'framer-motion';
import StepViz from './StepViz';

const STEPS = [
  { label: '슬래싱이 존재하는 이유 — 담보 기반 정직성', body: 'PoS는 검증자에게 "스테이크를 잃을 수 있다"는 경제적 위협으로 정직성을 강제합니다. 단순 실수가 아닌 의도적 이중 서명을 처벌 대상으로 삼습니다. 위반 증거는 누구든 다음 블록에 포함시킬 수 있고, 고발자는 포상을 받습니다.' },
  { label: 'Proposer Slashing: 같은 슬롯에 두 블록 헤더에 서명', body: '동일 슬롯에 서로 다른 두 BeaconBlock 헤더에 서명한 제안자를 처벌합니다. Attester Slashing도 같은 target epoch 이중투표, surround vote가 대상입니다. 두 서명이 모두 온체인에 공개됩니다.' },
  { label: '증거 전파: ProposerSlashing이 다음 블록에 포함됩니다', body: '슬래싱 증거를 발견한 노드는 다음 블록 제안자에게 전달합니다. 블록에 포함되는 순간 온체인으로 기록됩니다. 고발자는 소량의 포상을 받아 자기감시 시스템이 작동합니다.' },
  { label: '즉각 패널티: 1/32 stake 삭감 + 36일 강제 감금 시작', body: '위반이 적발되면 즉시 1/32 stake가 삭감되고 36일 강제 감금이 시작됩니다. 감금 중에도 어테스테이션 미제출 패널티가 계속 부과됩니다. 탈퇴 신청이 막혀 빠져나갈 수 없습니다.' },
  { label: 'Correlation Penalty: 공모를 수학적으로 불가능하게', body: '슬래싱 직후 18일 동안 동시에 슬래싱된 검증자 수의 비율을 추적합니다. penalty ∝ (슬래시된 stake / 전체 stake) × 3. 비율이 1/3에 달하면 전체 stake를 몰수합니다. 개별 실수는 1/32, 조직적 공격은 전액 몰수입니다.' },
];

// ── Layout constants ──────────────────────────────────────────────
const BLOCK_W = 90, BLOCK_H = 82;
const BA_X = 85,  BA_Y = 68;   // Block A center
const BB_X = 335, BB_Y = 68;   // Block B center

// BLS Key sits well below the blocks
const KEY_X = 210, KEY_Y = 190;

// SIG origins: slightly left/right of key so they don't overlap each other
const SIG_A_OX = KEY_X - 26, SIG_A_OY = KEY_Y;
const SIG_B_OX = KEY_X + 26, SIG_B_OY = KEY_Y;

// SIG packets land in the lower section of each block (below the divider line)
const SIG_A_DX = BA_X, SIG_A_DY = BA_Y + 22;
const SIG_B_DX = BB_X, SIG_B_DY = BB_Y + 22;

function Block({ x, y, label, color, show }: {
  x: number; y: number; label: string; color: string; show: boolean;
}) {
  const hw = BLOCK_W / 2, hh = BLOCK_H / 2;
  return (
    <g opacity={show ? 1 : 0.18}>
      <rect x={x - hw} y={y - hh} width={BLOCK_W} height={BLOCK_H} rx={9}
        fill={`${color}22`} stroke={color} strokeWidth={2} />
      {/* Header text — upper section */}
      <text x={x} y={y - 22} textAnchor="middle" fontSize={10} fontWeight="700" fill={color}>{label}</text>
      <text x={x} y={y - 9}  textAnchor="middle" fontSize={8}  fill="hsl(var(--muted-foreground))">slot 100</text>
      {/* Divider */}
      <line x1={x - hw + 7} y1={y + 1} x2={x + hw - 7} y2={y + 1}
        stroke={color} strokeWidth={0.8} opacity={0.35} />
      {/* Label for SIG area */}
      <text x={x} y={y + 13} textAnchor="middle" fontSize={7} fill={`${color}88`}>signature</text>
    </g>
  );
}

function PenaltyBar({ pct, label, color }: { pct: number; label: string; color: string }) {
  return (
    <g>
      <text x={44} y={0} fontSize={8} fill="hsl(var(--muted-foreground))">{label}</text>
      <text x={375} y={0} textAnchor="end" fontSize={8} fontWeight="700" fill={color}>{Math.round(pct * 100)}%</text>
      <rect x={44} y={5} width={331} height={9} rx={4} fill="hsl(var(--muted))" />
      <motion.rect x={44} y={5} height={9} rx={4} fill={color}
        animate={{ width: pct * 331 }} initial={{ width: 0 }} transition={{ duration: 0.6 }} />
    </g>
  );
}

export default function SlashingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 332" className="w-full max-w-[420px]" style={{ height: 'auto' }}>

          {/* Blocks */}
          <Block x={BA_X} y={BA_Y} label="Block A" color="#22c55e" show />
          <Block x={BB_X} y={BB_Y} label="Block B" color={step >= 1 ? '#ef4444' : '#22c55e'} show={step >= 1} />

          {/* Dashed connector: key → SIG landing area */}
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
          <text x={KEY_X} y={KEY_Y + 12} textAnchor="middle" fontSize={7.5}
            fill="hsl(var(--muted-foreground))">BLS Key</text>

          {/* SIG A — left of key → lower-left area of Block A */}
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

          {/* SIG B — right of key → lower-right area of Block B */}
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

          {/* ProposerSlashing notice — well below KEY (KEY bottom ≈ y=216, notice starts y=230) */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.3 }}>
            <rect x={120} y={230} width={180} height={28} rx={6}
              fill="#f59e0b22" stroke="#f59e0b" strokeWidth={1.5} />
            <text x={210} y={242} textAnchor="middle" fontSize={9} fontWeight="700" fill="#f59e0b">
              ⚠ ProposerSlashing
            </text>
            <text x={210} y={253} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">
              → 다음 블록에 포함됨
            </text>
          </motion.g>

          {/* Penalty bars */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: 0.3 }}>
            <g transform="translate(0, 270)">
              <PenaltyBar pct={1 / 32} label="즉각 삭감 (1/32)" color="#f59e0b" />
            </g>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 4 ? 1 : 0 }} transition={{ duration: 0.3 }}>
            <g transform="translate(0, 302)">
              <PenaltyBar pct={0.31} label="Correlation (×3)" color="#ef4444" />
            </g>
            <text x={210} y={326} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">
              공격자 1/3 도달 시 전액 몰수
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
