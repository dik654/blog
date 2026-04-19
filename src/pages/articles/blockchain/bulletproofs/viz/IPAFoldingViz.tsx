import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

// 팔레트
const C = {
  a: '#6366f1',
  b: '#10b981',
  L: '#f59e0b',
  R: '#ec4899',
  challenge: '#8b5cf6',
  comm: '#0ea5e9',
  naive: '#ef4444',
  ipa: '#10b981',
  muted: '#9ca3af',
  fold: '#14b8a6',
};

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const A_INIT = [3, 7, 2, 5, 1, 4, 6, 8];
const B_INIT = [2, 5, 3, 1, 4, 7, 2, 6];

const STEPS = [
  {
    label: '① 초기 상태: a, b ∈ Fⁿ (n=8) + commitment P',
    body: 'P = ⟨a, G⟩ + ⟨b, H⟩ + c·u, c = ⟨a, b⟩.\nNaive: a, b 전부 보내면 O(n) communication.\n목표: a, b 노출 없이 P 검증.',
  },
  {
    label: '② Split: 좌/우 분할 (a_L|a_R, b_L|b_R)',
    body: 'a, b, G, H 모두 절반으로 분할.\n각 절반은 길이 n/2 = 4. 다음 단계의 cross term 계산을 위해 위치 고정.',
  },
  {
    label: '③ Cross terms: c_L, c_R + L, R 그룹 원소',
    body: 'c_L = ⟨a_L, b_R⟩, c_R = ⟨a_R, b_L⟩.\nL = ⟨a_L, G_R⟩ + ⟨b_R, H_L⟩ + c_L·u, R = ⟨a_R, G_L⟩ + ⟨b_L, H_R⟩ + c_R·u.\nL, R 두 점만 verifier 에 전송.',
  },
  {
    label: '④ Challenge x → fold: a\', b\' (length n/2)',
    body: 'Verifier sends x via Fiat-Shamir.\na\' = a_L·x + a_R·x⁻¹, b\' = b_L·x⁻¹ + b_R·x.\nG, H 도 대칭으로 fold. 새 statement: P\' = x²·L + P + x⁻²·R.',
  },
  {
    label: '⑤ Recursion: 8 → 4 → 2 → 1 (log₂ n 라운드)',
    body: '매 라운드 (Lᵢ, Rᵢ) 한 쌍씩 누적.\nn=8 → 3 라운드, n=64 → 6 라운드.\n최종: 스칼라 a, b 1개씩 남음 → 직접 검증.',
  },
  {
    label: '⑥ Proof size: O(n) → O(log n)',
    body: 'Naive: n + n = 2n 스칼라 전송 (n=64 → 128 스칼라 ≈ 4 KB).\nIPA: 2·log₂(n) 점 + 2 스칼라 (n=64 → 14 elements ≈ 448 B).\nVerifier: scalar decomposition s_i = ∏ x_j^±1 → 단일 Pippenger multiexp.',
  },
];

function VectorRow({ y, label, values, color, splitAt, splitColor }: {
  y: number; label: string; values: number[]; color: string; splitAt?: number; splitColor?: string;
}) {
  const cellW = 36;
  const startX = 80;
  return (
    <g>
      <text x={70} y={y + 18} textAnchor="end" fontSize={10} fontWeight={700} fill={color}>{label}</text>
      {values.map((v, i) => {
        const isRight = splitAt !== undefined && i >= splitAt;
        const c = splitAt !== undefined ? (isRight ? splitColor ?? C.R : C.L) : color;
        const xExtra = splitAt !== undefined && i >= splitAt ? 12 : 0;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}>
            <rect x={startX + i * cellW + xExtra} y={y} width={cellW - 4} height={28} rx={4}
              fill={`${c}15`} stroke={c} strokeWidth={0.8} />
            <text x={startX + i * cellW + xExtra + (cellW - 4) / 2} y={y + 18}
              textAnchor="middle" fontSize={11} fontWeight={700} fill={c}>{v}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

function Step1() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.a}>
        Inner Product Argument — 초기 상태
      </text>
      <VectorRow y={50} label="a" values={A_INIT} color={C.a} />
      <VectorRow y={92} label="b" values={B_INIT} color={C.b} />
      {/* commitment */}
      <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}>
        <rect x={80} y={150} width={380} height={48} rx={8}
          fill={`${C.comm}15`} stroke={C.comm} strokeWidth={1.2} />
        <text x={270} y={172} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.comm}>
          P = ⟨a, G⟩ + ⟨b, H⟩ + c·u
        </text>
        <text x={270} y={188} textAnchor="middle" fontSize={9} fill={C.comm} opacity={0.8}>
          c = ⟨a, b⟩ — 모두 single group element 로 압축
        </text>
      </motion.g>
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        x={260} y={228} textAnchor="middle" fontSize={9} fill={C.muted}>
        Naive: a, b 전송 = O(n) communication
      </motion.text>
    </motion.g>
  );
}

function Step2() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fold}>
        Split: a = (a_L | a_R), b = (b_L | b_R)
      </text>
      <text x={170} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.L}>L (left half)</text>
      <text x={368} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.R}>R (right half)</text>
      <VectorRow y={52} label="a" values={A_INIT} color={C.a} splitAt={4} splitColor={C.R} />
      <VectorRow y={94} label="b" values={B_INIT} color={C.b} splitAt={4} splitColor={C.R} />
      {/* split divider */}
      <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }}
        x1={228} y1={48} x2={228} y2={128}
        stroke={C.muted} strokeWidth={1} strokeDasharray="3 3" />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={80} y={150} width={170} height={48} rx={8}
          fill={`${C.L}15`} stroke={C.L} strokeWidth={1} />
        <text x={165} y={170} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.L}>
          a_L, b_L (length n/2)
        </text>
        <text x={165} y={186} textAnchor="middle" fontSize={8.5} fill={C.L} opacity={0.8}>
          [3, 7, 2, 5] / [2, 5, 3, 1]
        </text>
        <rect x={270} y={150} width={170} height={48} rx={8}
          fill={`${C.R}15`} stroke={C.R} strokeWidth={1} />
        <text x={355} y={170} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.R}>
          a_R, b_R (length n/2)
        </text>
        <text x={355} y={186} textAnchor="middle" fontSize={8.5} fill={C.R} opacity={0.8}>
          [1, 4, 6, 8] / [4, 7, 2, 6]
        </text>
      </motion.g>
    </motion.g>
  );
}

function Step3() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.L}>
        Cross terms — c_L, c_R + L, R 그룹 원소
      </text>
      {/* c_L computation */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
        <rect x={20} y={48} width={230} height={56} rx={8}
          fill={`${C.L}12`} stroke={C.L} strokeWidth={1} />
        <text x={135} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.L}>
          c_L = ⟨a_L, b_R⟩
        </text>
        <text x={135} y={84} textAnchor="middle" fontSize={9} fill={C.L} opacity={0.8} fontFamily="monospace">
          [3,7,2,5] · [4,7,2,6]
        </text>
        <text x={135} y={98} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.L}>
          = 12+49+4+30 = 95
        </text>
      </motion.g>
      {/* c_R computation */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
        <rect x={270} y={48} width={230} height={56} rx={8}
          fill={`${C.R}12`} stroke={C.R} strokeWidth={1} />
        <text x={385} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.R}>
          c_R = ⟨a_R, b_L⟩
        </text>
        <text x={385} y={84} textAnchor="middle" fontSize={9} fill={C.R} opacity={0.8} fontFamily="monospace">
          [1,4,6,8] · [2,5,3,1]
        </text>
        <text x={385} y={98} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.R}>
          = 2+20+18+8 = 48
        </text>
      </motion.g>
      {/* L group element */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={120} width={230} height={68} rx={8}
          fill={`${C.L}18`} stroke={C.L} strokeWidth={1.2} />
        <text x={135} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.L}>
          L (group element)
        </text>
        <text x={135} y={158} textAnchor="middle" fontSize={9} fill={C.L} opacity={0.85} fontFamily="monospace">
          ⟨a_L, G_R⟩ + ⟨b_R, H_L⟩
        </text>
        <text x={135} y={172} textAnchor="middle" fontSize={9} fill={C.L} opacity={0.85} fontFamily="monospace">
          + c_L · u
        </text>
        <text x={135} y={184} textAnchor="middle" fontSize={8} fill={C.L} opacity={0.6}>
          → 32 bytes (single point)
        </text>
      </motion.g>
      {/* R group element */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <rect x={270} y={120} width={230} height={68} rx={8}
          fill={`${C.R}18`} stroke={C.R} strokeWidth={1.2} />
        <text x={385} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.R}>
          R (group element)
        </text>
        <text x={385} y={158} textAnchor="middle" fontSize={9} fill={C.R} opacity={0.85} fontFamily="monospace">
          ⟨a_R, G_L⟩ + ⟨b_L, H_R⟩
        </text>
        <text x={385} y={172} textAnchor="middle" fontSize={9} fill={C.R} opacity={0.85} fontFamily="monospace">
          + c_R · u
        </text>
        <text x={385} y={184} textAnchor="middle" fontSize={8} fill={C.R} opacity={0.6}>
          → 32 bytes (single point)
        </text>
      </motion.g>
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        x={260} y={216} textAnchor="middle" fontSize={9} fill={C.muted}>
        Verifier 에 L, R 두 점만 전송 — 진짜 a, b 는 노출되지 않음
      </motion.text>
    </motion.g>
  );
}

function Step4() {
  // Show challenge x and folded a' (length 4)
  const aPrime = ['a₀x+a₄x⁻¹', 'a₁x+a₅x⁻¹', 'a₂x+a₆x⁻¹', 'a₃x+a₇x⁻¹'];
  const bPrime = ['b₀x⁻¹+b₄x', 'b₁x⁻¹+b₅x', 'b₂x⁻¹+b₆x', 'b₃x⁻¹+b₇x'];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.challenge}>
        Challenge x → fold (length n/2 = 4)
      </text>
      {/* challenge box */}
      <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}>
        <rect x={180} y={36} width={160} height={36} rx={18}
          fill={`${C.challenge}18`} stroke={C.challenge} strokeWidth={1.2} />
        <text x={260} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.challenge}>
          x ← FS(transcript)
        </text>
        <text x={260} y={64} textAnchor="middle" fontSize={8} fill={C.challenge} opacity={0.7}>
          merlin transcript hash
        </text>
      </motion.g>
      {/* a' folded */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <text x={70} y={104} textAnchor="end" fontSize={10} fontWeight={700} fill={C.a}>a&apos;</text>
        {aPrime.map((s, i) => (
          <g key={i}>
            <rect x={80 + i * 100} y={88} width={92} height={28} rx={4}
              fill={`${C.a}12`} stroke={C.a} strokeWidth={0.8} />
            <text x={80 + i * 100 + 46} y={106} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.a}
              fontFamily="monospace">{s}</text>
          </g>
        ))}
      </motion.g>
      {/* b' folded */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <text x={70} y={142} textAnchor="end" fontSize={10} fontWeight={700} fill={C.b}>b&apos;</text>
        {bPrime.map((s, i) => (
          <g key={i}>
            <rect x={80 + i * 100} y={126} width={92} height={28} rx={4}
              fill={`${C.b}12`} stroke={C.b} strokeWidth={0.8} />
            <text x={80 + i * 100 + 46} y={144} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.b}
              fontFamily="monospace">{s}</text>
          </g>
        ))}
      </motion.g>
      {/* P' formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={80} y={172} width={380} height={48} rx={8}
          fill={`${C.comm}15`} stroke={C.comm} strokeWidth={1} strokeDasharray="3 2" />
        <text x={270} y={194} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.comm}>
          P&apos; = x²·L + P + x⁻²·R
        </text>
        <text x={270} y={210} textAnchor="middle" fontSize={9} fill={C.comm} opacity={0.8}>
          length n/2 인 a&apos;, b&apos; 에 대해 동일 IPA 적용 → 재귀
        </text>
      </motion.g>
    </motion.g>
  );
}

function Step5() {
  // Recursion ladder
  const rounds = [
    { n: 8, w: 320, color: C.a },
    { n: 4, w: 160, color: C.fold },
    { n: 2, w: 80, color: C.challenge },
    { n: 1, w: 40, color: C.ipa },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fold}>
        Recursion: n=8 → 4 → 2 → 1 (log₂ n 라운드)
      </text>
      {rounds.map((r, i) => {
        const y = 40 + i * 42;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}>
            <text x={32} y={y + 22} textAnchor="end" fontSize={10} fontWeight={700} fill={r.color}>
              n={r.n}
            </text>
            <rect x={50} y={y + 4} width={r.w} height={28} rx={4}
              fill={`${r.color}20`} stroke={r.color} strokeWidth={1} />
            <text x={50 + r.w / 2} y={y + 22} textAnchor="middle" fontSize={10} fontWeight={700} fill={r.color}>
              {r.n} cells
            </text>
            {/* L/R record */}
            {i < rounds.length - 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.2 }}>
                <rect x={400} y={y + 4} width={40} height={28} rx={4}
                  fill={`${C.L}18`} stroke={C.L} strokeWidth={0.8} />
                <text x={420} y={y + 22} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.L}>
                  L{i + 1}
                </text>
                <rect x={444} y={y + 4} width={40} height={28} rx={4}
                  fill={`${C.R}18`} stroke={C.R} strokeWidth={0.8} />
                <text x={464} y={y + 22} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.R}>
                  R{i + 1}
                </text>
              </motion.g>
            )}
            {/* arrow down */}
            {i < rounds.length - 1 && (
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.15 + 0.1 }}
                x1={50 + r.w / 2} y1={y + 32} x2={50 + r.w / 2} y2={y + 42}
                stroke={C.muted} strokeWidth={0.8} markerEnd="url(#arr-rec)" />
            )}
          </motion.g>
        );
      })}
      <defs>
        <marker id="arr-rec" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.muted} />
        </marker>
      </defs>
      <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        x={260} y={228} textAnchor="middle" fontSize={9} fill={C.ipa} fontWeight={700}>
        최종: 스칼라 a, b 1개씩 + 누적 (Lᵢ, Rᵢ) log₂ n 쌍
      </motion.text>
    </motion.g>
  );
}

function Step6() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
        Proof size: Naive O(n) vs IPA O(log n)
      </text>
      {/* Naive bar */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <text x={20} y={56} fontSize={10} fontWeight={700} fill={C.naive}>Naive (send a, b)</text>
        <rect x={20} y={64} width={460} height={28} rx={4}
          fill={`${C.naive}10`} stroke={`${C.naive}30`} strokeWidth={0.5} />
        <motion.rect
          x={20} y={64} height={28} rx={4}
          initial={{ width: 0 }} animate={{ width: 460 }} transition={{ duration: 0.7, delay: 0.1 }}
          fill={`${C.naive}40`} stroke={C.naive} strokeWidth={1} />
        <text x={250} y={82} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.naive}>
          n=64 → 128 scalars ≈ 4 KB
        </text>
      </motion.g>
      {/* IPA bar */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <text x={20} y={116} fontSize={10} fontWeight={700} fill={C.ipa}>IPA O(log n)</text>
        <rect x={20} y={124} width={460} height={28} rx={4}
          fill={`${C.ipa}10`} stroke={`${C.ipa}30`} strokeWidth={0.5} />
        <motion.rect
          x={20} y={124} height={28} rx={4}
          initial={{ width: 0 }} animate={{ width: 50 }} transition={{ duration: 0.7, delay: 0.5 }}
          fill={`${C.ipa}40`} stroke={C.ipa} strokeWidth={1} />
        <text x={150} y={142} textAnchor="start" fontSize={10} fontWeight={700} fill={C.ipa}>
          n=64 → 14 elements ≈ 448 B (10x 압축)
        </text>
      </motion.g>
      {/* Verifier optimization */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
        <rect x={20} y={170} width={460} height={66} rx={8}
          fill={`${C.challenge}10`} stroke={C.challenge} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={250} y={188} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.challenge}>
          Verifier 최적화 — scalar decomposition + Pippenger
        </text>
        <text x={250} y={206} textAnchor="middle" fontSize={9} fill={C.challenge} opacity={0.85}
          fontFamily="monospace">
          sᵢ = ∏ xⱼ^±1 (bit decomposition of i)
        </text>
        <text x={250} y={222} textAnchor="middle" fontSize={9} fill={C.challenge} opacity={0.85}>
          단일 multi-exponentiation: O(n / log n) effective scalar mults
        </text>
      </motion.g>
    </motion.g>
  );
}

export default function IPAFoldingViz() {
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
        </svg>
      )}
    </StepViz>
  );
}
