import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.14, duration: 0.5 };

const C = {
  standard: '#3b82f6',
  relaxed: '#10b981',
  error: '#ef4444',
  scale: '#f59e0b',
  commit: '#a855f7',
  fold: '#06b6d4',
  muted: '#64748b',
};

const STEPS = [
  {
    label: '① 표준 R1CS — 두 인스턴스 모두 만족',
    body: '(A·z) ∘ (B·z) = C·z\n\nz₁, z₂ 각각 정확한 등식 만족.\n좌·우 두 박스로 표시, 각자 녹색 체크.',
  },
  {
    label: '② Naive 결합 — 교차항 r·T 가 등식을 깬다',
    body: 'z = z₁ + r·z₂ 로 결합 시\n좌변 = (A z₁)∘(B z₁) + r·T + r²·(A z₂)∘(B z₂)\n우변 = C z₁ + r²·C z₂\n→ r·T 항이 남아 등식 불일치 (빨간 X).',
  },
  {
    label: '③ Relaxed 형태 도입 — u 와 E 가 결손을 흡수',
    body: '(A·z) ∘ (B·z) = u·(C·z) + E\n\nu = 스케일 (r⁰↔r² 차수 차이 흡수)\nE = 에러 벡터 (r·T 교차항 흡수)\n→ 등식이 다시 성립 (녹색 체크).',
  },
  {
    label: '④ 폴딩 공식 — Relaxed 는 닫혀 있다',
    body: 'U\' = U₁ + r·U₂\nE\' = E₁ + r·T + r²·E₂\nu\' = u₁ + r·u₂\ncomm_W\' = comm_W₁ + r·comm_W₂\n\n폴딩 결과도 같은 Relaxed 형태.',
  },
  {
    label: '⑤ Pedersen 동형 — 그룹에서 두 커밋이 한 점으로',
    body: 'Commit(W₁) + r·Commit(W₂) = Commit(W₁ + r·W₂)\n\n두 곡선 점이 r-스케일 후 ECC 덧셈으로 합쳐진다.\nVerifier 는 W 자체를 보지 않고 새 커밋을 직접 계산.',
  },
];

// ───────── 공통: 인스턴스 박스 (z, A·z 등) ─────────
function InstanceBox({
  x, y, w = 150, h = 70, title, color, satisfied, fields,
}: {
  x: number; y: number; w?: number; h?: number;
  title: string; color: string; satisfied?: boolean;
  fields: string[];
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={`${color}10`} stroke={color} strokeWidth={1} />
      <text x={x + 8} y={y + 13} fontSize={9} fontWeight={700} fill={color}>{title}</text>
      {fields.map((f, i) => (
        <text key={i} x={x + 8} y={y + 28 + i * 12} fontSize={8.5}
          fontFamily="monospace" fill="var(--foreground)" opacity={0.85}>{f}</text>
      ))}
      {satisfied !== undefined && (
        <g transform={`translate(${x + w - 16} ${y + 10})`}>
          {satisfied ? (
            <>
              <circle r={7} fill={C.relaxed} opacity={0.18} />
              <path d="M -3 0 L -1 3 L 4 -3" stroke={C.relaxed}
                strokeWidth={1.6} fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle r={7} fill={C.error} opacity={0.18} />
              <path d="M -3 -3 L 3 3 M -3 3 L 3 -3" stroke={C.error}
                strokeWidth={1.6} strokeLinecap="round" />
            </>
          )}
        </g>
      )}
    </g>
  );
}

// ───────── Step 1: 두 표준 R1CS 인스턴스 ─────────
function StepStandard() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.standard}>
        Standard R1CS  (A·z) ∘ (B·z) = C·z
      </text>
      <InstanceBox x={40} y={50} title="Instance z₁" color={C.standard} satisfied
        fields={['z₁ = (1, x₁, w₁)', '(A z₁) ∘ (B z₁)', '   = C z₁  ✓']} />
      <InstanceBox x={290} y={50} title="Instance z₂" color={C.standard} satisfied
        fields={['z₂ = (1, x₂, w₂)', '(A z₂) ∘ (B z₂)', '   = C z₂  ✓']} />
      <text x={260} y={150} textAnchor="middle" fontSize={9} fill={C.muted}>
        각자 정확한 등식 — 그러나 두 인스턴스는 결합되지 않은 상태
      </text>
      <rect x={40} y={170} width={440} height={36} rx={5}
        fill={`${C.muted}10`} stroke={`${C.muted}66`} strokeDasharray="3 2" strokeWidth={0.6} />
      <text x={260} y={185} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.muted}>
        문제: 두 R1CS 의 합은 R1CS 가 아니다
      </text>
      <text x={260} y={199} textAnchor="middle" fontSize={8} fill={C.muted}>
        곱셈 제약 (A z)∘(B z) 는 z 에 대해 2차 — 선형 결합에 닫혀 있지 않음
      </text>
    </motion.g>
  );
}

// ───────── Step 2: Naive 결합 → r·T 등장 ─────────
function StepNaive() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.error}>
        Naive 결합 시도: z = z₁ + r·z₂
      </text>

      {/* 좌변 박스 */}
      <rect x={20} y={45} width={300} height={108} rx={6}
        fill={`${C.error}08`} stroke={C.error} strokeWidth={1} />
      <text x={30} y={60} fontSize={9} fontWeight={700} fill={C.error}>좌변 (A z) ∘ (B z)</text>
      <text x={30} y={80} fontSize={9} fontFamily="monospace" fill={C.standard}>
        (A z₁) ∘ (B z₁)
      </text>
      <text x={30} y={97} fontSize={9} fontFamily="monospace" fill={C.error} fontWeight={700}>
        + r · T   ← 교차항!
      </text>
      <text x={30} y={114} fontSize={9} fontFamily="monospace" fill={C.standard}>
        + r² · (A z₂) ∘ (B z₂)
      </text>
      <text x={30} y={138} fontSize={7.5} fontFamily="monospace" fill={C.muted}>
        T = (A z₁)∘(B z₂) + (A z₂)∘(B z₁)
      </text>

      {/* 우변 박스 */}
      <rect x={340} y={45} width={160} height={108} rx={6}
        fill={`${C.standard}08`} stroke={C.standard} strokeWidth={1} />
      <text x={350} y={60} fontSize={9} fontWeight={700} fill={C.standard}>우변 C·z</text>
      <text x={350} y={80} fontSize={9} fontFamily="monospace" fill={C.standard}>
        C z₁
      </text>
      <text x={350} y={97} fontSize={9} fontFamily="monospace" fill={C.muted}>
        (교차항 없음)
      </text>
      <text x={350} y={114} fontSize={9} fontFamily="monospace" fill={C.standard}>
        + r² · C z₂
      </text>

      {/* 가운데 ≠ */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...sp, delay: 0.2 }}
        style={{ transformOrigin: '330px 99px' }}>
        <circle cx={330} cy={99} r={14} fill={C.error} opacity={0.18} />
        <text x={330} y={104} textAnchor="middle" fontSize={16}
          fontWeight={800} fill={C.error}>≠</text>
      </motion.g>

      {/* 강조 — r·T 가 깬다 */}
      <rect x={20} y={172} width={480} height={32} rx={5}
        fill={`${C.error}10`} stroke={C.error} strokeWidth={0.8} />
      <text x={260} y={188} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.error}>
        r · T 가 좌변에만 존재 → 등식이 깨진다
      </text>
      <text x={260} y={200} textAnchor="middle" fontSize={8} fill={C.error} opacity={0.8}>
        해결: 우변에 T 를 흡수할 자리(E) + 차수 차이를 흡수할 스케일(u) 도입
      </text>
    </motion.g>
  );
}

// ───────── Step 3: Relaxed 형태 도입 ─────────
function StepRelaxed() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.relaxed}>
        Relaxed R1CS:  (A·z) ∘ (B·z) = u · (C·z) + E
      </text>

      {/* 좌변 = 우변 (성공) */}
      <rect x={20} y={45} width={220} height={68} rx={6}
        fill={`${C.relaxed}10`} stroke={C.relaxed} strokeWidth={1} />
      <text x={30} y={62} fontSize={9} fontWeight={700} fill={C.relaxed}>좌변</text>
      <text x={30} y={82} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
        (A z) ∘ (B z)
      </text>
      <text x={30} y={101} fontSize={8} fill={C.muted}>= 곱셈 제약 그대로</text>

      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ ...sp, delay: 0.15 }} style={{ transformOrigin: '260px 79px' }}>
        <circle cx={260} cy={79} r={12} fill={C.relaxed} opacity={0.2} />
        <path d="M 254 79 L 258 84 L 266 74" stroke={C.relaxed}
          strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>

      <rect x={280} y={45} width={220} height={68} rx={6}
        fill={`${C.relaxed}10`} stroke={C.relaxed} strokeWidth={1} />
      <text x={290} y={62} fontSize={9} fontWeight={700} fill={C.relaxed}>우변</text>
      <motion.text x={290} y={82} fontSize={10} fontFamily="monospace"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        fill="var(--foreground)">
        u · (C z)  +  E
      </motion.text>
      <text x={290} y={101} fontSize={8} fill={C.muted}>= 스케일 + 에러 흡수</text>

      {/* u 박스 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={60} y={140} width={170} height={52} rx={6}
          fill={`${C.scale}10`} stroke={C.scale} strokeWidth={1} />
        <text x={145} y={156} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={C.scale}>u  (스케일 스칼라)</text>
        <text x={145} y={172} textAnchor="middle" fontSize={8.5}
          fontFamily="monospace" fill="var(--foreground)">u ∈ F</text>
        <text x={145} y={185} textAnchor="middle" fontSize={7.5}
          fill={C.muted}>표준은 u=1 / 폴딩 후 u₁+r·u₂</text>
      </motion.g>

      {/* E 박스 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={290} y={140} width={170} height={52} rx={6}
          fill={`${C.error}10`} stroke={C.error} strokeWidth={1} />
        <text x={375} y={156} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={C.error}>E  (에러 벡터)</text>
        <text x={375} y={172} textAnchor="middle" fontSize={8.5}
          fontFamily="monospace" fill="var(--foreground)">E ∈ F^m</text>
        <text x={375} y={185} textAnchor="middle" fontSize={7.5}
          fill={C.muted}>표준은 E=0 / 폴딩 시 r·T 흡수</text>
      </motion.g>

      <text x={260} y={216} textAnchor="middle" fontSize={8} fill={C.muted}>
        u 가 차수 r⁰↔r² 차이를 메우고, E 가 r·T 교차항을 받아낸다 → 등식 회복
      </text>
    </motion.g>
  );
}

// ───────── Step 4: 폴딩 공식 ─────────
function StepFold() {
  const lines = [
    { lhs: 'comm_W\'', rhs: 'comm_W₁  +  r · comm_W₂', color: C.commit },
    { lhs: 'u\'',       rhs: 'u₁  +  r · u₂', color: C.scale },
    { lhs: 'E\'',       rhs: 'E₁  +  r · T  +  r² · E₂', color: C.error },
    { lhs: 'X\'',       rhs: 'X₁  +  r · X₂', color: C.fold },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fold}>
        폴딩 공식:  U\' = U₁ + r · U₂   (Relaxed R1CS 는 닫혀 있다)
      </text>

      {/* 입력 */}
      <rect x={20} y={42} width={140} height={40} rx={6}
        fill={`${C.relaxed}10`} stroke={C.relaxed} strokeWidth={1} />
      <text x={90} y={58} textAnchor="middle" fontSize={9.5}
        fontWeight={700} fill={C.relaxed}>U₁ (누적)</text>
      <text x={90} y={73} textAnchor="middle" fontSize={8}
        fontFamily="monospace" fill={C.muted}>(comm_W₁, E₁, u₁, X₁)</text>

      <rect x={360} y={42} width={140} height={40} rx={6}
        fill={`${C.standard}10`} stroke={C.standard} strokeWidth={1} />
      <text x={430} y={58} textAnchor="middle" fontSize={9.5}
        fontWeight={700} fill={C.standard}>U₂ (fresh)</text>
      <text x={430} y={73} textAnchor="middle" fontSize={8}
        fontFamily="monospace" fill={C.muted}>(comm_W₂, 0, 1, X₂)</text>

      {/* 가운데 r */}
      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ ...sp }} style={{ transformOrigin: '260px 62px' }}>
        <circle cx={260} cy={62} r={14} fill={`${C.fold}26`} stroke={C.fold} strokeWidth={1.2} />
        <text x={260} y={66} textAnchor="middle" fontSize={11}
          fontWeight={800} fontFamily="monospace" fill={C.fold}>r</text>
      </motion.g>
      <line x1={160} y1={62} x2={246} y2={62} stroke={C.muted} strokeWidth={0.7} opacity={0.5} />
      <line x1={274} y1={62} x2={360} y2={62} stroke={C.muted} strokeWidth={0.7} opacity={0.5} />

      {/* 폴딩 공식 4줄 */}
      {lines.map((l, i) => (
        <motion.g key={l.lhs} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.15 + i * 0.12 }}>
          <rect x={50} y={100 + i * 22} width={420} height={18} rx={4}
            fill={`${l.color}10`} stroke={`${l.color}88`} strokeWidth={0.7} />
          <text x={70} y={113 + i * 22} fontSize={10}
            fontFamily="monospace" fontWeight={700} fill={l.color}>{l.lhs}</text>
          <text x={130} y={113 + i * 22} fontSize={9.5}
            fontFamily="monospace" fill="var(--foreground)">=  {l.rhs}</text>
        </motion.g>
      ))}

      <text x={260} y={208} textAnchor="middle" fontSize={8.5} fill={C.muted}>
        → 결과 U\' 도 Relaxed R1CS 형태 — O(1) 누적 인스턴스
      </text>
    </motion.g>
  );
}

// ───────── Step 5: Pedersen 동형 ─────────
function StepPedersen() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.commit}>
        Pedersen 동형:  Commit(W₁) + r · Commit(W₂) = Commit(W₁ + r · W₂)
      </text>

      {/* 곡선 (그룹) 표현 */}
      <motion.path
        d="M 30 165 C 100 90, 200 90, 270 165 S 440 240, 490 165"
        stroke={`${C.commit}55`} strokeWidth={1.2} fill="none" strokeDasharray="2 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.7 }} />
      <text x={490} y={155} fontSize={7.5} fill={C.commit} opacity={0.7}>group G</text>

      {/* 점 P1 */}
      <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.2 }}>
        <circle cx={90} cy={130} r={6} fill={C.commit} />
        <text x={90} y={117} textAnchor="middle" fontSize={9}
          fontFamily="monospace" fontWeight={700} fill={C.commit}>P₁</text>
        <text x={90} y={150} textAnchor="middle" fontSize={7.5} fill={C.muted}>Commit(W₁)</text>
      </motion.g>

      {/* 점 P2 */}
      <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <circle cx={210} cy={108} r={6} fill={C.standard} />
        <text x={210} y={95} textAnchor="middle" fontSize={9}
          fontFamily="monospace" fontWeight={700} fill={C.standard}>P₂</text>
        <text x={210} y={128} textAnchor="middle" fontSize={7.5} fill={C.muted}>Commit(W₂)</text>
      </motion.g>

      {/* 점 r·P2 (스케일링 후) */}
      <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.55 }}>
        <circle cx={300} cy={128} r={6} fill={C.fold} />
        <text x={300} y={115} textAnchor="middle" fontSize={9}
          fontFamily="monospace" fontWeight={700} fill={C.fold}>r·P₂</text>
      </motion.g>
      <motion.line x1={210} y1={108} x2={300} y2={128}
        stroke={C.fold} strokeWidth={1} strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }} />

      {/* 합쳐지는 화살표 — 최종 점 P' */}
      <defs>
        <marker id="foldArrow" viewBox="0 0 10 10" refX="8" refY="5"
          markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.relaxed} />
        </marker>
      </defs>
      <motion.path d="M 90 130 C 150 200, 280 220, 395 158"
        stroke={C.relaxed} strokeWidth={1.2} fill="none"
        markerEnd="url(#foldArrow)"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }} />
      <motion.path d="M 300 128 C 340 138, 370 148, 395 158"
        stroke={C.relaxed} strokeWidth={1.2} fill="none"
        markerEnd="url(#foldArrow)"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }} />

      {/* 최종 점 P' = P1 + r·P2 */}
      <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 1.05 }}>
        <circle cx={400} cy={160} r={9} fill={C.relaxed} opacity={0.25} />
        <circle cx={400} cy={160} r={6} fill={C.relaxed} />
        <text x={400} y={148} textAnchor="middle" fontSize={9.5}
          fontFamily="monospace" fontWeight={800} fill={C.relaxed}>P\'</text>
        <text x={400} y={180} textAnchor="middle" fontSize={7.5} fill={C.muted}>
          Commit(W₁ + r·W₂)
        </text>
      </motion.g>

      {/* 결론 배너 */}
      <rect x={30} y={210} width={460} height={28} rx={5}
        fill={`${C.commit}10`} stroke={C.commit} strokeWidth={0.8} />
      <text x={260} y={225} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.commit}>
        Verifier 는 W 를 보지 않고도 동형 합으로 새 커밋 직접 계산
      </text>
      <text x={260} y={236} textAnchor="middle" fontSize={7.5} fill={C.commit} opacity={0.8}>
        Nova = IPA-Pedersen (no trusted setup) · KZG 도 동형이지만 setup 필요
      </text>
    </motion.g>
  );
}

export default function RelaxedR1CSViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && <StepStandard />}
          {step === 1 && <StepNaive />}
          {step === 2 && <StepRelaxed />}
          {step === 3 && <StepFold />}
          {step === 4 && <StepPedersen />}
        </svg>
      )}
    </StepViz>
  );
}
