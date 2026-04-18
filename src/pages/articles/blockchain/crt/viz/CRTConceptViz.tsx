import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const A = '#6366f1', B = '#f59e0b', G = '#10b981', DIM = 'var(--muted-foreground)';

const STEPS = [
  { label: 'CRT 문제 정의', body: '연립 합동식: x ≡ 2 (mod 3), x ≡ 3 (mod 5)\ngcd(3,5)=1 (서로소) → 유일한 해 존재. N = 3×5 = 15, 해 범위: 0 ≤ x < 15' },
  { label: '① 역원 계산', body: 'N₁ = N/n₁ = 5, N₂ = N/n₂ = 3\ny₁ = N₁⁻¹ mod n₁ = 5⁻¹ mod 3 = 2, y₂ = N₂⁻¹ mod n₂ = 3⁻¹ mod 5 = 2' },
  { label: '② 부분 해 합산', body: 'x = a₁·N₁·y₁ + a₂·N₂·y₂ = 2·5·2 + 3·3·2 = 38 mod 15 = 8\n검증: 8 mod 3 = 2 ✓, 8 mod 5 = 3 ✓' },
  { label: '③ 일반화: k개 모듈러스', body: 'x = Σ aᵢ·Nᵢ·yᵢ (mod N). RSA: N=pq 기반 CRT 복호화 4× 가속' },
];

function Box({ x, y, w, h, label, sub, color, delay = 0 }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string; color: string; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ ...sp, delay }}>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={`${color}10`} stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize={9}
        fontWeight={700} fill={color}>{label}</text>
      <text x={x + w / 2} y={y + 27} textAnchor="middle" fontSize={8}
        fill={DIM}>{sub}</text>
    </motion.g>
  );
}

function Arr({ x1, y1, x2, y2, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      <line x1={x1} y1={y1} x2={x2 - 4} y2={y2} stroke={DIM} strokeWidth={1} />
      <polygon points={`${x2},${y2} ${x2 - 5},${y2 - 3} ${x2 - 5},${y2 + 3}`} fill={DIM} />
    </motion.g>
  );
}

/* Step 0: 문제 정의 */
function ProblemStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">연립 합동식</text>

      {/* Two equations */}
      <Box x={60} y={24} w={150} h={36} label="x ≡ 2 (mod 3)" sub="나머지 2" color={A} delay={0} />
      <Box x={270} y={24} w={150} h={36} label="x ≡ 3 (mod 5)" sub="나머지 3" color={B} delay={0.1} />

      {/* gcd check */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={140} y={72} width={200} height={28} rx={6}
          fill={`${G}10`} stroke={G} strokeWidth={1} strokeDasharray="4 3" />
        <text x={240} y={90} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={G}>gcd(3, 5) = 1 → 서로소 → 유일해 존재</text>
      </motion.g>

      {/* N and range */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={100} y={110} width={120} height={32} rx={6}
          fill={`${A}10`} stroke={A} strokeWidth={0.8} />
        <text x={160} y={126} textAnchor="middle" fontSize={9} fontWeight={700} fill={A}>N = 3 × 5 = 15</text>
        <text x={160} y={138} textAnchor="middle" fontSize={7} fill={DIM}>전체 모듈러스</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={260} y={110} width={120} height={32} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={320} y={126} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">해 범위: 0 ≤ x &lt; 15</text>
        <text x={320} y={138} textAnchor="middle" fontSize={7} fill={DIM}>mod N 내 유일</text>
      </motion.g>
    </g>
  );
}

/* Step 1: 역원 계산 */
function InverseStep() {
  const rows = [
    { label: 'N₁ = N/n₁', val: '15/3 = 5', inv: 'y₁ = 5⁻¹ mod 3', calc: '2·5=10≡1', result: '2', color: A },
    { label: 'N₂ = N/n₂', val: '15/5 = 3', inv: 'y₂ = 3⁻¹ mod 5', calc: '2·3=6≡1', result: '2', color: B },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">역원 계산 (Extended Euclidean)</text>

      {rows.map((r, i) => {
        const y = 28 + i * 60;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            {/* Nᵢ */}
            <rect x={10} y={y} width={90} height={44} rx={6}
              fill={`${r.color}10`} stroke={r.color} strokeWidth={0.8} />
            <text x={55} y={y + 16} textAnchor="middle" fontSize={9} fontWeight={600} fill={r.color}>{r.label}</text>
            <text x={55} y={y + 32} textAnchor="middle" fontSize={10} fontWeight={700} fill={r.color}>{r.val}</text>

            <Arr x1={100} y1={y + 22} x2={120} y2={y + 22} delay={0.1 + i * 0.15} />

            {/* 역원 계산 */}
            <rect x={120} y={y} width={140} height={44} rx={6}
              fill={`${r.color}08`} stroke={r.color} strokeWidth={0.6} />
            <text x={190} y={y + 16} textAnchor="middle" fontSize={8} fontWeight={600} fill={r.color}>{r.inv}</text>
            <text x={190} y={y + 32} textAnchor="middle" fontSize={8} fill={DIM}>{r.calc} mod n</text>

            <Arr x1={260} y1={y + 22} x2={280} y2={y + 22} delay={0.15 + i * 0.15} />

            {/* 결과 */}
            <rect x={280} y={y + 4} width={60} height={36} rx={18}
              fill={`${G}12`} stroke={G} strokeWidth={0.8} />
            <text x={310} y={y + 18} textAnchor="middle" fontSize={8} fill={G}>결과</text>
            <text x={310} y={y + 32} textAnchor="middle" fontSize={12} fontWeight={700} fill={G}>{r.result}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

/* Step 2: 합산 */
function SumStep() {
  const terms = [
    { a: '2', N: '5', y: '2', prod: '20', color: A },
    { a: '3', N: '3', y: '2', prod: '18', color: B },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">부분 해 합산</text>

      {terms.map((t, i) => {
        const x = 20 + i * 230;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={x} y={26} width={210} height={40} rx={6}
              fill={`${t.color}10`} stroke={t.color} strokeWidth={0.8} />
            <text x={x + 10} y={42} fontSize={8} fill={DIM}>a{i + 1}·N{i + 1}·y{i + 1} =</text>
            <text x={x + 80} y={42} fontSize={9} fontWeight={700} fill={t.color}>
              {t.a} × {t.N} × {t.y}
            </text>
            <text x={x + 155} y={42} fontSize={9} fontWeight={700} fill={t.color}>= {t.prod}</text>
            <text x={x + 105} y={58} textAnchor="middle" fontSize={7} fill={DIM}>
              나머지({t.a}) × 보조({t.N}) × 역원({t.y})
            </text>
          </motion.g>
        );
      })}

      {/* Sum */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={240} y={86} textAnchor="middle" fontSize={9} fill={DIM}>20 + 18 = 38</text>
        <Arr x1={240} y1={90} x2={240} y2={104} delay={0.35} />
        <rect x={160} y={104} width={160} height={32} rx={6}
          fill={`${G}10`} stroke={G} strokeWidth={1.2} />
        <text x={240} y={120} textAnchor="middle" fontSize={11} fontWeight={700} fill={G}>
          38 mod 15 = 8
        </text>
        <text x={240} y={132} textAnchor="middle" fontSize={7} fill={DIM}>x = 8</text>
      </motion.g>

      {/* Verification */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={160} y={142} width={70} height={16} rx={8}
          fill={`${A}12`} stroke={A} strokeWidth={0.6} />
        <text x={195} y={153} textAnchor="middle" fontSize={7} fontWeight={600} fill={A}>8 mod 3 = 2 ✓</text>
        <rect x={250} y={142} width={70} height={16} rx={8}
          fill={`${B}12`} stroke={B} strokeWidth={0.6} />
        <text x={285} y={153} textAnchor="middle" fontSize={7} fontWeight={600} fill={B}>8 mod 5 = 3 ✓</text>
      </motion.g>
    </g>
  );
}

/* Step 3: 일반화 */
function GeneralStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">일반화: k개 모듈러스</text>

      {/* Formula box */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0 }}>
        <rect x={30} y={26} width={420} height={40} rx={7}
          fill={`${A}08`} stroke={A} strokeWidth={1} />
        <text x={240} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={A}>
          x = Σ aᵢ · Nᵢ · yᵢ  (mod N)
        </text>
        <text x={240} y={58} textAnchor="middle" fontSize={8} fill={DIM}>
          N = n₁·n₂·…·nₖ,  Nᵢ = N/nᵢ,  yᵢ = Nᵢ⁻¹ mod nᵢ
        </text>
      </motion.g>

      {/* Components */}
      {[
        { label: 'aᵢ', desc: '나머지 값', x: 30, color: A },
        { label: 'Nᵢ', desc: 'N/nᵢ 보조값', x: 140, color: B },
        { label: 'yᵢ', desc: 'Nᵢ의 역원', x: 250, color: G },
        { label: 'mod N', desc: '범위 제한', x: 360, color: A },
      ].map((c, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.15 + i * 0.08 }}>
          <rect x={c.x} y={78} width={90} height={30} rx={6}
            fill={`${c.color}10`} stroke={c.color} strokeWidth={0.6} />
          <text x={c.x + 45} y={92} textAnchor="middle" fontSize={9} fontWeight={700} fill={c.color}>{c.label}</text>
          <text x={c.x + 45} y={104} textAnchor="middle" fontSize={7} fill={DIM}>{c.desc}</text>
        </motion.g>
      ))}

      {/* RSA application */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={80} y={120} width={320} height={32} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={136} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">RSA CRT: N=p·q → 복호화 4× 가속</text>
        <text x={240} y={148} textAnchor="middle" fontSize={7} fill={DIM}>
          mod p, mod q 각각 계산 후 CRT로 합산 → 지수 크기 절반
        </text>
      </motion.g>
    </g>
  );
}

export default function CRTConceptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 165" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ProblemStep />}
          {step === 1 && <InverseStep />}
          {step === 2 && <SumStep />}
          {step === 3 && <GeneralStep />}
        </svg>
      )}
    </StepViz>
  );
}
