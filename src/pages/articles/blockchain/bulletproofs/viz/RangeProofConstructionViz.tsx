import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

// 팔레트
const C = {
  bit: '#6366f1',
  blind: '#8b5cf6',
  comm: '#0ea5e9',
  fs: '#f59e0b',
  poly: '#ec4899',
  ipa: '#10b981',
  agg: '#14b8a6',
  ind: '#ef4444',
  muted: '#9ca3af',
};

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  {
    label: '① Bit decomposition (a_L = bits of v, a_R = a_L − 1ⁿ)',
    body: 'V = v·B + γ·B_blinding 에서 0 ≤ v < 2ⁿ 증명 (v, γ 미공개).\na_L: v 비트, a_R = a_L − 1ⁿ.\n3 constraints: bit valid · encodes v · 정의식 만족.',
  },
  {
    label: '② Commit A, S (bit + blinding)',
    body: 'A = α·H + ⟨a_L, G⟩ + ⟨a_R, H_bp⟩ — 비트 벡터 커밋.\nS = ρ·H + ⟨s_L, G⟩ + ⟨s_R, H_bp⟩ — blinding 커밋.\n두 점만 verifier 에 전송.',
  },
  {
    label: '③ Fiat-Shamir challenges y, z → 3 constraints fold',
    body: 'y = hash(transcript) → 대각행렬 yⁿ = (1, y, y², ...).\nz = hash(transcript) → 스칼라.\n세 constraint 가 단일 다항식 항등식으로 압축.',
  },
  {
    label: '④ Polynomial l(X), r(X), t(X) + T₁, T₂ commit',
    body: 'l(X) = a_L − z·1ⁿ + s_L·X.\nr(X) = yⁿ ∘ (a_R + z·1ⁿ + s_R·X) + z²·2ⁿ.\nt(X) = ⟨l(X), r(X)⟩ = t₀ + t₁·X + t₂·X². T₁, T₂ Pedersen 커밋.',
  },
  {
    label: '⑤ Challenge x → l, r, t̂',
    body: 'x = hash(T₁, T₂).\nl = l(x), r = r(x), t̂ = t(x) = ⟨l, r⟩.\nτ_x = τ₂·x² + τ₁·x + z²·γ, μ = α + ρ·x.',
  },
  {
    label: '⑥ IPA on ⟨l, r⟩ = t̂',
    body: 'Standard Inner Product Argument 적용.\n⟨l, r⟩ = t̂ 증명.\nIPA proof size: 2·log(n) 점 + 2 스칼라.',
  },
  {
    label: '⑦ Aggregation: m values 한 번에',
    body: 'm 개 값을 단일 IPA 로 묶음.\nm=16, n=64 → 24 points ≈ 800 B.\nPer-value 50 B (vs 672 B 단독) → 94% 절감.',
  },
];

function Step1() {
  // Bit decomposition of v=13 (binary 1101) — show 8 bits for clarity
  // 13 = 8+4+1 → bits (LSB first) = [1,0,1,1,0,0,0,0]
  const aL = [1, 0, 1, 1, 0, 0, 0, 0];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bit}>
        Bit decomposition: v = 13 (n=8)
      </text>
      {/* v box */}
      <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05 }}>
        <rect x={20} y={42} width={88} height={42} rx={8}
          fill={`${C.bit}18`} stroke={C.bit} strokeWidth={1.2} />
        <text x={64} y={60} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bit}>v = 13</text>
        <text x={64} y={76} textAnchor="middle" fontSize={9} fill={C.bit} opacity={0.7}>secret value</text>
      </motion.g>
      {/* arrow */}
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }}
        x1={112} y1={63} x2={138} y2={63}
        stroke={C.muted} strokeWidth={1.2} markerEnd="url(#arr-bit)" />
      {/* a_L bits */}
      <text x={148} y={42} fontSize={10} fontWeight={700} fill={C.bit}>a_L (bits)</text>
      {aL.map((bit, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.04 }}>
          <rect x={148 + i * 38} y={48} width={32} height={32} rx={4}
            fill={bit ? `${C.bit}25` : `${C.muted}10`} stroke={bit ? C.bit : C.muted} strokeWidth={0.8} />
          <text x={164 + i * 38} y={68} textAnchor="middle" fontSize={12} fontWeight={700}
            fill={bit ? C.bit : C.muted}>{bit}</text>
        </motion.g>
      ))}
      {/* a_R bits */}
      <text x={148} y={104} fontSize={10} fontWeight={700} fill={C.poly}>a_R = a_L − 1ⁿ</text>
      {aL.map((bit, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 + i * 0.04 }}>
          <rect x={148 + i * 38} y={110} width={32} height={32} rx={4}
            fill={`${C.poly}15`} stroke={C.poly} strokeWidth={0.8} />
          <text x={164 + i * 38} y={130} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.poly}>
            {bit - 1}
          </text>
        </motion.g>
      ))}
      {/* 3 constraints */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
        <text x={20} y={170} fontSize={10} fontWeight={700} fill={C.muted}>3 constraints</text>
        {[
          { y: 184, t: 'a_L ∘ a_R = 0ⁿ — 비트 valid (0 또는 1)', c: C.bit },
          { y: 202, t: '⟨a_L, 2ⁿ⟩ = v — bits encode value', c: C.comm },
          { y: 220, t: 'a_L − a_R = 1ⁿ — 정의식', c: C.poly },
        ].map((row, i) => (
          <text key={i} x={30} y={row.y} fontSize={9} fontFamily="monospace" fill={row.c}>
            {row.t}
          </text>
        ))}
      </motion.g>
      <defs>
        <marker id="arr-bit" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.muted} />
        </marker>
      </defs>
    </motion.g>
  );
}

function Step2() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.comm}>
        Commit A, S
      </text>
      {/* A box */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
        <rect x={20} y={48} width={230} height={84} rx={10}
          fill={`${C.bit}12`} stroke={C.bit} strokeWidth={1.2} />
        <text x={135} y={70} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.bit}>A</text>
        <text x={135} y={88} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.bit}>
          α·H + ⟨a_L, G⟩
        </text>
        <text x={135} y={102} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.bit}>
          + ⟨a_R, H_bp⟩
        </text>
        <text x={135} y={120} textAnchor="middle" fontSize={8} fill={C.bit} opacity={0.7}>
          비트 벡터 커밋
        </text>
      </motion.g>
      {/* S box */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
        <rect x={270} y={48} width={230} height={84} rx={10}
          fill={`${C.blind}12`} stroke={C.blind} strokeWidth={1.2} />
        <text x={385} y={70} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.blind}>S</text>
        <text x={385} y={88} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.blind}>
          ρ·H + ⟨s_L, G⟩
        </text>
        <text x={385} y={102} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.blind}>
          + ⟨s_R, H_bp⟩
        </text>
        <text x={385} y={120} textAnchor="middle" fontSize={8} fill={C.blind} opacity={0.7}>
          blinding 커밋 (s_L, s_R 랜덤)
        </text>
      </motion.g>
      {/* arrow to verifier */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <line x1={260} y1={150} x2={260} y2={184}
          stroke={C.muted} strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arr-comm)" />
        <rect x={170} y={188} width={180} height={42} rx={8}
          fill={`${C.fs}15`} stroke={C.fs} strokeWidth={1} />
        <text x={260} y={206} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fs}>
          send (A, S) → verifier
        </text>
        <text x={260} y={222} textAnchor="middle" fontSize={8.5} fill={C.fs} opacity={0.8}>
          2 group elements (64 bytes)
        </text>
      </motion.g>
      <defs>
        <marker id="arr-comm" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.muted} />
        </marker>
      </defs>
    </motion.g>
  );
}

function Step3() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fs}>
        Fiat-Shamir → y, z → 3 constraints fold
      </text>
      {/* y challenge */}
      <motion.g initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05 }}>
        <circle cx={80} cy={80} r={36} fill={`${C.fs}18`} stroke={C.fs} strokeWidth={1.4} />
        <text x={80} y={78} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.fs}>y</text>
        <text x={80} y={94} textAnchor="middle" fontSize={8} fill={C.fs} opacity={0.7}>diag(yⁿ)</text>
      </motion.g>
      {/* z challenge */}
      <motion.g initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.18 }}>
        <circle cx={80} cy={170} r={36} fill={`${C.poly}18`} stroke={C.poly} strokeWidth={1.4} />
        <text x={80} y={168} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.poly}>z</text>
        <text x={80} y={184} textAnchor="middle" fontSize={8} fill={C.poly} opacity={0.7}>scalar</text>
      </motion.g>
      {/* 3 constraints → 1 polynomial */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {[
          { y: 50, t: 'C1: a_L ∘ a_R = 0', c: C.bit },
          { y: 84, t: 'C2: ⟨a_L, 2ⁿ⟩ = v', c: C.comm },
          { y: 118, t: 'C3: a_L − a_R = 1ⁿ', c: C.blind },
        ].map((row, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.06 }}>
            <rect x={150} y={row.y} width={170} height={28} rx={6}
              fill={`${row.c}12`} stroke={row.c} strokeWidth={0.8} />
            <text x={235} y={row.y + 18} textAnchor="middle" fontSize={9} fontWeight={600} fill={row.c}
              fontFamily="monospace">{row.t}</text>
          </motion.g>
        ))}
      </motion.g>
      {/* arrows merge */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.65 }}>
        <line x1={325} y1={64} x2={365} y2={130} stroke={C.fs} strokeWidth={1} strokeDasharray="3 2" />
        <line x1={325} y1={98} x2={365} y2={130} stroke={C.fs} strokeWidth={1} strokeDasharray="3 2" />
        <line x1={325} y1={132} x2={365} y2={130} stroke={C.fs} strokeWidth={1} strokeDasharray="3 2" />
      </motion.g>
      {/* Folded polynomial */}
      <motion.g initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8 }}>
        <rect x={365} y={104} width={140} height={56} rx={8}
          fill={`${C.poly}18`} stroke={C.poly} strokeWidth={1.4} />
        <text x={435} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.poly}>
          단일 polynomial
        </text>
        <text x={435} y={142} textAnchor="middle" fontSize={9} fill={C.poly} opacity={0.85} fontFamily="monospace">
          y, z 가중합
        </text>
        <text x={435} y={154} textAnchor="middle" fontSize={8} fill={C.poly} opacity={0.7}>
          identity check
        </text>
      </motion.g>
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        x={260} y={232} textAnchor="middle" fontSize={9} fill={C.muted}>
        세 constraint → 단일 다항식 항등식 (자유도 검증으로 통합)
      </motion.text>
    </motion.g>
  );
}

function Step4() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.poly}>
        Polynomial l(X), r(X), t(X) + T₁, T₂
      </text>
      {/* l(X) */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
        <rect x={20} y={42} width={230} height={48} rx={8}
          fill={`${C.bit}12`} stroke={C.bit} strokeWidth={1} />
        <text x={135} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bit}>l(X)</text>
        <text x={135} y={78} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.bit}>
          = a_L − z·1ⁿ + s_L·X
        </text>
      </motion.g>
      {/* r(X) */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
        <rect x={270} y={42} width={230} height={48} rx={8}
          fill={`${C.blind}12`} stroke={C.blind} strokeWidth={1} />
        <text x={385} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blind}>r(X)</text>
        <text x={385} y={78} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.blind}>
          = yⁿ ∘ (a_R + z·1ⁿ + s_R·X) + z²·2ⁿ
        </text>
      </motion.g>
      {/* t(X) */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <rect x={80} y={104} width={360} height={56} rx={8}
          fill={`${C.poly}15`} stroke={C.poly} strokeWidth={1.2} />
        <text x={260} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.poly}>
          t(X) = ⟨l(X), r(X)⟩
        </text>
        <text x={260} y={144} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={C.poly}>
          = t₀ + t₁·X + t₂·X²
        </text>
        <text x={260} y={156} textAnchor="middle" fontSize={8} fill={C.poly} opacity={0.7}>
          t₀ = v·z² + δ(y, z) (known)
        </text>
      </motion.g>
      {/* T1, T2 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <rect x={80} y={174} width={170} height={48} rx={10}
          fill={`${C.comm}15`} stroke={C.comm} strokeWidth={1.2} />
        <text x={165} y={194} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.comm}>T₁</text>
        <text x={165} y={210} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.comm}>
          t₁·G + τ₁·H
        </text>
        <rect x={270} y={174} width={170} height={48} rx={10}
          fill={`${C.comm}15`} stroke={C.comm} strokeWidth={1.2} />
        <text x={355} y={194} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.comm}>T₂</text>
        <text x={355} y={210} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.comm}>
          t₂·G + τ₂·H
        </text>
      </motion.g>
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
        x={260} y={244} textAnchor="middle" fontSize={9} fill={C.muted}>
        T₁, T₂ 두 점 verifier 에 전송
      </motion.text>
    </motion.g>
  );
}

function Step5() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fs}>
        Challenge x = hash(T₁, T₂) → 다항식 평가
      </text>
      {/* x */}
      <motion.g initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05 }}>
        <circle cx={80} cy={120} r={42} fill={`${C.fs}18`} stroke={C.fs} strokeWidth={1.4} />
        <text x={80} y={118} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.fs}>x</text>
        <text x={80} y={136} textAnchor="middle" fontSize={8} fill={C.fs} opacity={0.7}>
          hash(T₁, T₂)
        </text>
      </motion.g>
      {/* arrow */}
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }}
        x1={126} y1={120} x2={154} y2={120}
        stroke={C.muted} strokeWidth={1.2} markerEnd="url(#arr-x)" />
      {/* Computed values */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {[
          { y: 50, label: 'l = l(x)', sub: 'n-vector', c: C.bit },
          { y: 96, label: 'r = r(x)', sub: 'n-vector', c: C.blind },
          { y: 142, label: 't̂ = t(x) = ⟨l, r⟩', sub: 'scalar', c: C.poly },
          { y: 188, label: 'τ_x = τ₂x² + τ₁x + z²γ', sub: 'blinding', c: C.fs },
        ].map((row, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.08 }}>
            <rect x={160} y={row.y} width={340} height={36} rx={6}
              fill={`${row.c}12`} stroke={row.c} strokeWidth={0.8} />
            <rect x={160} y={row.y} width={3} height={36} fill={row.c} />
            <text x={172} y={row.y + 16} fontSize={10} fontWeight={700} fill={row.c} fontFamily="monospace">
              {row.label}
            </text>
            <text x={172} y={row.y + 30} fontSize={8.5} fill={row.c} opacity={0.7}>
              {row.sub}
            </text>
          </motion.g>
        ))}
      </motion.g>
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
        x={260} y={236} textAnchor="middle" fontSize={9} fill={C.muted}>
        μ = α + ρ·x — A, S 의 blinding fold
      </motion.text>
      <defs>
        <marker id="arr-x" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.muted} />
        </marker>
      </defs>
    </motion.g>
  );
}

function Step6() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ipa}>
        IPA on ⟨l, r⟩ = t̂
      </text>
      {/* l, r boxes */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
        <rect x={20} y={50} width={140} height={60} rx={8}
          fill={`${C.bit}15`} stroke={C.bit} strokeWidth={1} />
        <text x={90} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bit}>l (n-vec)</text>
        <text x={90} y={92} textAnchor="middle" fontSize={9} fill={C.bit} opacity={0.75}>length 64</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
        <rect x={180} y={50} width={140} height={60} rx={8}
          fill={`${C.blind}15`} stroke={C.blind} strokeWidth={1} />
        <text x={250} y={72} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blind}>r (n-vec)</text>
        <text x={250} y={92} textAnchor="middle" fontSize={9} fill={C.blind} opacity={0.75}>length 64</text>
      </motion.g>
      {/* arrow → IPA */}
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }}
        x1={325} y1={80} x2={355} y2={80}
        stroke={C.ipa} strokeWidth={1.4} markerEnd="url(#arr-ipa)" />
      <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
        <rect x={360} y={50} width={140} height={60} rx={8}
          fill={`${C.ipa}18`} stroke={C.ipa} strokeWidth={1.4} />
        <text x={430} y={72} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ipa}>IPA</text>
        <text x={430} y={92} textAnchor="middle" fontSize={9} fill={C.ipa} opacity={0.85}>
          fold → log₂(n) 라운드
        </text>
      </motion.g>
      {/* Final proof breakdown */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <rect x={20} y={130} width={480} height={106} rx={10}
          fill={`${C.ipa}10`} stroke={C.ipa} strokeWidth={1} strokeDasharray="3 2" />
        <text x={260} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ipa}>
          전체 RangeProof 구성 (n=64)
        </text>
        {[
          { y: 170, t: 'A, S, T₁, T₂ — 4 points', c: C.comm },
          { y: 188, t: 'τ_x, μ, t̂ — 3 scalars', c: C.fs },
          { y: 206, t: 'IPA: 2·log₂(64) = 12 points + 2 scalars', c: C.ipa },
          { y: 224, t: '총 16 points + 5 scalars = (16+5)·32 = 672 bytes', c: C.poly },
        ].map((row, i) => (
          <motion.text key={i}
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            x={36} y={row.y} fontSize={9.5} fontFamily="monospace" fill={row.c}>
            {row.t}
          </motion.text>
        ))}
      </motion.g>
      <defs>
        <marker id="arr-ipa" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.ipa} />
        </marker>
      </defs>
    </motion.g>
  );
}

function Step7() {
  // Aggregation bar chart
  const cases = [
    { label: 'm=1', size: 672, perValue: 672, color: C.ind },
    { label: 'm=2', size: 736, perValue: 368, color: C.bit },
    { label: 'm=4', size: 800, perValue: 200, color: C.poly },
    { label: 'm=16', size: 800, perValue: 50, color: C.agg },
  ];
  const maxBar = 350;
  const maxPerValue = 672;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.agg}>
        Aggregation: m values → 단일 IPA (n=64)
      </text>
      {/* Header */}
      <text x={20} y={48} fontSize={9} fontWeight={700} fill={C.muted}>m</text>
      <text x={70} y={48} fontSize={9} fontWeight={700} fill={C.muted}>per-value (bytes)</text>
      <text x={420} y={48} textAnchor="end" fontSize={9} fontWeight={700} fill={C.muted}>total</text>

      {cases.map((c, i) => {
        const y = 60 + i * 38;
        const w = (c.perValue / maxPerValue) * maxBar;
        return (
          <motion.g key={c.label}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.1 }}>
            <text x={20} y={y + 18} fontSize={10} fontWeight={700} fill={c.color}>{c.label}</text>
            <rect x={70} y={y + 6} width={maxBar} height={22} rx={3}
              fill={`${c.color}10`} stroke={`${c.color}30`} strokeWidth={0.4} />
            <motion.rect
              x={70} y={y + 6} height={22} rx={3}
              initial={{ width: 0 }} animate={{ width: Math.max(w, 2) }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              fill={`${c.color}45`} stroke={c.color} strokeWidth={0.8} />
            <text x={75 + Math.max(w, 2)} y={y + 22} fontSize={9} fontWeight={700} fill={c.color}>
              {c.perValue} B
            </text>
            <text x={490} y={y + 22} textAnchor="end" fontSize={9} fontWeight={600} fill={c.color}>
              {c.size} B
            </text>
          </motion.g>
        );
      })}
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        x={260} y={228} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.agg}>
        m=16 → per-value 50 B vs 672 B 단독 → 94% 절감
      </motion.text>
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        x={260} y={244} textAnchor="middle" fontSize={8.5} fill={C.muted}>
        4 + 2·log(m·n) points + 5 scalars
      </motion.text>
    </motion.g>
  );
}

export default function RangeProofConstructionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Step1 />}
          {step === 1 && <Step2 />}
          {step === 2 && <Step3 />}
          {step === 3 && <Step4 />}
          {step === 4 && <Step5 />}
          {step === 5 && <Step6 />}
          {step === 6 && <Step7 />}
        </svg>
      )}
    </StepViz>
  );
}
