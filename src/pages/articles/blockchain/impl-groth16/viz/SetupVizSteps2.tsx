import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './SetupVizData';

/** Step 2: IC vs L split */
export function ICvsLStep() {
  return (
    <g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <text x={220} y={14} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          lcⱼ = β·aⱼ(τ) + α·bⱼ(τ) + cⱼ(τ)
        </text>
      </motion.g>
      <VizBox x={30} y={24} w={160} h={40} label="IC — 공개 변수 (j=0..l)"
        sub="[lcⱼ / γ]₁ → 검증키(VK)에 포함" c={CE} delay={0.2} />
      <VizBox x={240} y={24} w={170} h={40} label="L — 비공개 변수 (j=l+1..n)"
        sub="[lcⱼ / δ]₁ → 증명키(PK)에 포함" c={CV} delay={0.35} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}>
        <rect x={40} y={80} width={140} height={28} rx={4}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.6} />
        <text x={110} y={98} textAnchor="middle" fontSize={8} fill={CE}>
          e(IC_sum, [γ]₂) → γ 소거
        </text>
        <rect x={260} y={80} width={140} height={28} rx={4}
          fill={`${CV}08`} stroke={CV} strokeWidth={0.6} />
        <text x={330} y={98} textAnchor="middle" fontSize={8} fill={CV}>
          e(C, [δ]₂) → δ 소거
        </text>
      </motion.g>
    </g>
  );
}

/** Step 3: h_query generation */
export function HQueryStep() {
  return (
    <g>
      <VizBox x={20} y={20} w={120} h={40} label="h_query[i]"
        sub="[τ^i · t(τ) / δ]₁" c={CV} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <path d="M 150 40 L 190 40" stroke={CA} strokeWidth={1}
          markerEnd="url(#sArr2)" />
        <text x={170} y={33} fontSize={8} fill={CA} textAnchor="middle">Σhᵢ·</text>
      </motion.g>
      <VizBox x={200} y={20} w={120} h={40} label="[h(τ)·t(τ)/δ]₁"
        sub="QAP 만족의 증거" c={CE} delay={0.4} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}>
        <rect x={60} y={78} width={320} height={32} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.6} />
        <text x={220} y={92} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>
          VerifyingKey = alpha_beta_gt + gamma_g2 + delta_g2 + ic[]
        </text>
        <text x={220} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          e(α,β) 사전 계산 → 검증 시 페어링 1개 절약
        </text>
      </motion.g>
      <defs>
        <marker id="sArr2" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}
