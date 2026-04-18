import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'S-box: x → x⁵ 변환', body: 'S-box는 비선형 혼합(confusion)을 담당.\ngcd(5, p-1)=1이므로 전단사(bijection) — 모든 출력이 유일.' },
  { label: 'S-box 연산 체인 (x=3 예시)', body: 'x⁵를 직접 계산하지 않고 곱셈 3회로 분해.\nx → x² → x⁴ → x⁵. 곱셈 3회 = R1CS 3제약.' },
  { label: 'MDS 행렬 곱: 확산', body: '모든 입력이 모든 출력에 영향.\nbranch number = T+1 = 4 → 최대 확산(diffusion) 보장.' },
];

/* Step 0: S-box concept with numeric mapping */
function SBoxConcept() {
  /* F₇ 예시: x⁵ mod 7 (gcd(5,6)=1 → 전단사) */
  const mapping = [
    { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 4 },
    { x: 3, y: 5 }, { x: 4, y: 2 }, { x: 5, y: 3 }, { x: 6, y: 6 },
  ];
  const y0 = 30, cellW = 46, cellH = 24, gap = 10;
  const tableX = 60;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">S-box: x → x⁵ mod p (F₇ 예시)</text>

      {/* 입력 행 */}
      <text x={20} y={y0 + cellH / 2 + 4} fontSize={9} fontWeight={600}
        fill="var(--muted-foreground)">입력 x</text>
      {mapping.map((m, i) => (
        <motion.g key={`in-${i}`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}>
          <rect x={tableX + i * (cellW + gap)} y={y0} width={cellW} height={cellH} rx={4}
            fill="transparent" stroke="var(--border)" strokeWidth={0.6} />
          <text x={tableX + i * (cellW + gap) + cellW / 2} y={y0 + cellH / 2 + 4}
            textAnchor="middle" fontSize={10} fontWeight={600}
            fill="var(--foreground)">{m.x}</text>
        </motion.g>
      ))}

      {/* 화살표 행 */}
      {mapping.map((_, i) => (
        <motion.text key={`ar-${i}`} x={tableX + i * (cellW + gap) + cellW / 2}
          y={y0 + cellH + 16} textAnchor="middle" fontSize={10} fill={C2}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>↓</motion.text>
      ))}

      {/* x⁵ 연산 레이블 */}
      <motion.text x={20} y={y0 + cellH + 16} fontSize={9} fontWeight={600} fill={C2}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>x⁵ mod 7</motion.text>

      {/* 출력 행 */}
      <text x={20} y={y0 + cellH * 2 + gap + cellH / 2 + 4} fontSize={9} fontWeight={600}
        fill={C2}>출력</text>
      {mapping.map((m, i) => (
        <motion.g key={`out-${i}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 + i * 0.04 }}>
          <rect x={tableX + i * (cellW + gap)} y={y0 + cellH + gap + cellH}
            width={cellW} height={cellH} rx={4}
            fill={`${C2}12`} stroke={C2} strokeWidth={0.8} />
          <text x={tableX + i * (cellW + gap) + cellW / 2}
            y={y0 + cellH + gap + cellH + cellH / 2 + 4}
            textAnchor="middle" fontSize={10} fontWeight={600} fill={C2}>{m.y}</text>
        </motion.g>
      ))}

      {/* 전단사 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.6 }}>
        <text x={240} y={y0 + cellH * 3 + gap + 18} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">
          모든 출력이 유일 (0~6 → 0,1,4,5,2,3,6) → 전단사 (bijection)
        </text>
        <rect x={120} y={y0 + cellH * 3 + gap + 26} width={240} height={18} rx={9}
          fill={`${C2}10`} stroke={C2} strokeWidth={0.6} />
        <text x={240} y={y0 + cellH * 3 + gap + 39} textAnchor="middle"
          fontSize={9} fontWeight={600} fill={C2}>
          gcd(5, p-1) = gcd(5, 6) = 1 → 전단사 보장
        </text>
      </motion.g>
    </motion.g>
  );
}

/* Step 1: computation chain with numbers */
function SBoxChain() {
  const chain = [
    { val: '3', expr: 'x', op: '' },
    { val: '9', expr: 'x²', op: '× x → x²' },
    { val: '81', expr: 'x⁴', op: '× x² → x⁴' },
    { val: '243', expr: 'x⁵', op: '× x → x⁵' },
  ];
  const x0 = 30, gap = 110, y = 50, w = 70, h = 60;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">곱셈 체인: x=3 → x⁵=243</text>
      {chain.map((c, i) => {
        const cx = x0 + i * gap;
        const isLast = i === chain.length - 1;
        return (
          <g key={i}>
            {/* MUL label on arrow */}
            {i > 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 }}>
                <line x1={cx - gap + w + 4} y1={y + h / 2}
                  x2={cx - 4} y2={y + h / 2}
                  stroke="var(--muted-foreground)" strokeWidth={0.8}
                  markerEnd="url(#sc-a)" />
                <rect x={cx - gap / 2 + w / 2 - 28} y={y + h / 2 - 20} width={56} height={16} rx={4}
                  fill={`${C1}12`} stroke={C1} strokeWidth={0.6} />
                <text x={cx - gap / 2 + w / 2} y={y + h / 2 - 8} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={C1}>{c.op}</text>
              </motion.g>
            )}
            {/* cell */}
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}>
              <rect x={cx} y={y} width={w} height={h} rx={6}
                fill={isLast ? `${C2}15` : 'transparent'}
                stroke={isLast ? C2 : 'var(--border)'}
                strokeWidth={isLast ? 1.5 : 0.8} />
              <text x={cx + w / 2} y={y + 24} textAnchor="middle"
                fontSize={16} fontWeight={700} fill={isLast ? C2 : 'var(--foreground)'}>
                {c.val}
              </text>
              <text x={cx + w / 2} y={y + 44} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{c.expr}</text>
            </motion.g>
          </g>
        );
      })}
      {/* constraint badge */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={130} y={y + h + 16} width={220} height={22} rx={11}
          fill={`${C1}10`} stroke={C1} strokeWidth={0.7} />
        <text x={240} y={y + h + 31} textAnchor="middle"
          fontSize={9} fontWeight={600} fill={C1}>
          곱셈 3회 = R1CS 3제약 (S-box 최소 비용)
        </text>
      </motion.g>
      <defs>
        <marker id="sc-a" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="var(--muted-foreground)" opacity={0.5} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* Step 2: MDS matrix multiply */
function MDSMultiply() {
  const labels = ['s₀', 's₁', 's₂'];
  const formulas = ['2·s₀ + 1·s₁ + 1·s₂', '1·s₀ + 2·s₁ + 1·s₂', '1·s₀ + 1·s₁ + 2·s₂'];
  const matRows = [['2', '1', '1'], ['1', '2', '1'], ['1', '1', '2']];
  const y0 = 32, gap = 38;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">MDS 행렬 곱 (T=3)</text>
      {labels.map((l, i) => {
        const y = y0 + i * gap;
        return (
          <motion.g key={l} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            {/* input */}
            <rect x={20} y={y} width={48} height={28} rx={5}
              fill={`${C1}10`} stroke={C1} strokeWidth={0.8} />
            <text x={44} y={y + 18} textAnchor="middle"
              fontSize={10} fontWeight={600} fill={C1}>{l}</text>
            {/* matrix row */}
            <rect x={100} y={y} width={90} height={28} rx={5}
              fill={`${C3}08`} stroke={C3} strokeWidth={0.6} />
            <text x={145} y={y + 18} textAnchor="middle"
              fontSize={10} fontWeight={500} fill={C3}>
              [{matRows[i].join('  ')}]
            </text>
            {/* = formula */}
            <text x={210} y={y + 18} fontSize={10} fill="var(--muted-foreground)">=</text>
            <rect x={224} y={y} width={200} height={28} rx={5}
              fill={`${C2}10`} stroke={C2} strokeWidth={0.8} />
            <text x={324} y={y + 18} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={C2}>{formulas[i]}</text>
          </motion.g>
        );
      })}
      {/* diffusion note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.5 }}>
        <rect x={120} y={y0 + 3 * gap + 6} width={240} height={20} rx={10}
          fill={`${C3}10`} stroke={C3} strokeWidth={0.7} />
        <text x={240} y={y0 + 3 * gap + 20} textAnchor="middle"
          fontSize={9} fontWeight={600} fill={C3}>
          s₀ 1개만 변경 → 출력 3개 모두 변경 (branch# = 4)
        </text>
      </motion.g>
    </motion.g>
  );
}

export default function SBoxMDSViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={step === 0 ? '0 0 480 170' : step === 1 ? '0 0 480 160' : '0 0 460 170'}
          className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SBoxConcept />}
          {step === 1 && <SBoxChain />}
          {step === 2 && <MDSMultiply />}
        </svg>
      )}
    </StepViz>
  );
}
