import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import M from '@/components/ui/math';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  fg: 'var(--foreground)',
  mut: 'var(--muted-foreground)',
  border: 'var(--border)',
  fp: '#94a3b8',
  fp2: '#60a5fa',
  fp6: '#a78bfa',
  fp12: '#f472b6',
  naive: '#ef4444',
  karat: '#10b981',
  bg: '#1e293b10',
};

const STEPS = [
  {
    label: '① 페어링 확장체 타워: Fp → Fp² → Fp⁶ → Fp¹²',
    body: (
      <>
        BN254/BLS12-381 페어링은 4계층 확장체 타워 위에서 동작한다.
        <br />
        최상위 <M>{'\\mathbb{F}_{p^{12}}'}</M> 곱셈 한 번이 결국 <M>{'\\mathbb{F}_p'}</M> 곱셈 여러 번으로 풀린다.
      </>
    ),
  },
  {
    label: '② Naive 분해: 4 × 9 × 4 = 144 Fp 곱셈',
    body: (
      <>
        Fp¹² 곱 = <M>4</M>회 Fp⁶ 곱, Fp⁶ 곱 = <M>9</M>회 Fp² 곱, Fp² 곱 = <M>4</M>회 Fp 곱.
        <br />
        곱셈 트리의 leaf 수가 곧 총 Fp 곱셈 횟수.
      </>
    ),
  },
  {
    label: '③ Karatsuba 적용: 4→3, 9→6, 4→3 → 54 leaves',
    body: (
      <>
        각 층에 Karatsuba/Toom-3 변형을 적용하면 가지 수가 줄어든다.
        <br />
        leaf 수는 <M>{'3 \\times 6 \\times 3 = 54'}</M> — 회색으로 페이드 아웃된 가지가 절감 분.
      </>
    ),
  },
  {
    label: '④ 막대 비교: 144 vs 54 (62.5% 절감)',
    body: (
      <>
        Fp¹² 곱 1회당 Fp 곱셈 비용을 직접 비교.
        <br />
        한 번의 Fp¹² 곱셈에서만 <M>90</M>회 절감.
      </>
    ),
  },
  {
    label: '⑤ Miller loop 254회 누적: 36,576 vs 13,716',
    body: (
      <>
        BN254 Miller loop은 약 254 비트 — 매 비트마다 Fp¹² 곱셈이 누적된다.
        <br />
        실전 페어링 한 번에 Fp 곱셈 <M>{'\\sim 23{,}000'}</M>회 절감.
      </>
    ),
  },
];

// Tower layer geometry
const TOWER = [
  { name: 'Fp¹²', y: 50, w: 200, color: C.fp12 },
  { name: 'Fp⁶', y: 88, w: 160, color: C.fp6 },
  { name: 'Fp²', y: 126, w: 120, color: C.fp2 },
  { name: 'Fp', y: 164, w: 80, color: C.fp },
];

// Generate fan-out tree leaves (positions across x axis)
function makeLeaves(count: number, cx: number, spread: number, y: number) {
  const out: { x: number; y: number; key: number }[] = [];
  for (let i = 0; i < count; i++) {
    const x = count === 1 ? cx : cx - spread / 2 + (i * spread) / (count - 1);
    out.push({ x, y, key: i });
  }
  return out;
}

export default function TowerExpansionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ===== Step 0/1/2: Tower view ===== */}
          {step <= 2 && (
            <>
              {/* Tower stacked boxes (left side) */}
              <g>
                {TOWER.map((t, i) => (
                  <motion.g key={t.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.08 }}>
                    <rect x={130 - t.w / 2} y={t.y} width={t.w} height={28} rx={6}
                      fill={`${t.color}22`} stroke={t.color} strokeWidth={1.2} />
                    <text x={130} y={t.y + 18} textAnchor="middle" fontSize={12}
                      fontWeight={700} fill={C.fg}>
                      {t.name}
                    </text>
                  </motion.g>
                ))}
                {/* Vertical connectors */}
                {[0, 1, 2].map((i) => (
                  <line key={i} x1={130} y1={TOWER[i].y + 28} x2={130} y2={TOWER[i + 1].y}
                    stroke={C.border} strokeWidth={1} strokeDasharray="2 2" />
                ))}
                <text x={130} y={210} textAnchor="middle" fontSize={9}
                  fill={C.mut}>타워 구조</text>
              </g>

              {/* Right side: fan-out tree (only step >= 1) */}
              {step >= 1 && <FanOutTree applyKarat={step >= 2} />}

              {/* Leaf count badge */}
              {step >= 1 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.6 }}>
                  <rect x={350} y={235} width={140} height={32} rx={6}
                    fill={step >= 2 ? `${C.karat}18` : `${C.naive}18`}
                    stroke={step >= 2 ? C.karat : C.naive} strokeWidth={1.2} />
                  <text x={420} y={249} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={C.mut}>
                    {step >= 2 ? '3 × 6 × 3 = leaves' : '4 × 9 × 4 = leaves'}
                  </text>
                  <text x={420} y={262} textAnchor="middle" fontSize={13}
                    fontWeight={800} fill={step >= 2 ? C.karat : C.naive}>
                    {step >= 2 ? '54 Fp mults' : '144 Fp mults'}
                  </text>
                </motion.g>
              )}
            </>
          )}

          {/* ===== Step 3: Bar comparison ===== */}
          {step === 3 && <BarCompare scale={1} naive={144} karat={54} unit="Fp mults / Fp¹²" />}

          {/* ===== Step 4: Miller loop accumulation ===== */}
          {step === 4 && <BarCompare scale={1} naive={36576} karat={13716} unit="Fp mults / pairing (×254)" />}
        </svg>
      )}
    </StepViz>
  );
}

/* ---------------- Fan-out tree ---------------- */
function FanOutTree({ applyKarat }: { applyKarat: boolean }) {
  // 3-layer fan-out: root → L1 (4 or 3) → L2 (9 or 6) → leaves (4 or 3)
  // Display compressed: only show counts visually (not 144 individual leaves).
  const cx = 360;
  const rootY = 50;
  const l1Y = 100;
  const l2Y = 150;
  const leafY = 200;

  const l1Count = applyKarat ? 3 : 4;
  const l2Count = applyKarat ? 6 : 9;
  const leafCount = applyKarat ? 3 : 4;

  const l1Pts = makeLeaves(l1Count, cx, 180, l1Y);
  const l2Pts = makeLeaves(l2Count, cx, 220, l2Y);
  const leafPts = makeLeaves(leafCount, cx, 200, leafY);

  return (
    <g>
      {/* Root (Fp12) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <circle cx={cx} cy={rootY} r={9} fill={`${C.fp12}33`} stroke={C.fp12} strokeWidth={1.5} />
        <text x={cx} y={rootY - 14} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={C.fp12}>Fp¹²</text>
      </motion.g>

      {/* Edges root → L1 */}
      {l1Pts.map((p, i) => {
        const fade = applyKarat && i >= 3;
        return (
          <motion.line key={`r-${i}`} x1={cx} y1={rootY + 9}
            initial={{ opacity: 0 }}
            animate={{ opacity: fade ? 0 : 0.7 }}
            transition={{ ...sp, delay: 0.1 + i * 0.04 }}
            x2={p.x} y2={p.y - 6}
            stroke={C.fp6} strokeWidth={1} />
        );
      })}

      {/* L1 nodes (Fp6) */}
      {l1Pts.map((p, i) => (
        <motion.g key={`l1-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.15 + i * 0.04 }}>
          <circle cx={p.x} cy={p.y} r={5} fill={`${C.fp6}33`} stroke={C.fp6} strokeWidth={1} />
        </motion.g>
      ))}
      <text x={cx} y={l1Y + 18} textAnchor="middle" fontSize={8} fill={C.mut}>
        Fp⁶ × {l1Count}
      </text>

      {/* Edges L1 → L2 (only show 1 fan-out from middle for clarity) */}
      {l2Pts.map((p, i) => {
        const fade = applyKarat && i >= 6;
        return (
          <motion.line key={`l2-${i}`} x1={cx} y1={l1Y + 5}
            initial={{ opacity: 0 }}
            animate={{ opacity: fade ? 0 : 0.5 }}
            transition={{ ...sp, delay: 0.25 + i * 0.03 }}
            x2={p.x} y2={p.y - 5}
            stroke={C.fp2} strokeWidth={0.8} />
        );
      })}

      {/* L2 nodes (Fp2) */}
      {l2Pts.map((p, i) => (
        <motion.g key={`l2n-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.3 + i * 0.03 }}>
          <circle cx={p.x} cy={p.y} r={3.5} fill={`${C.fp2}44`} stroke={C.fp2} strokeWidth={0.8} />
        </motion.g>
      ))}
      <text x={cx} y={l2Y + 14} textAnchor="middle" fontSize={8} fill={C.mut}>
        Fp² × {l2Count}
      </text>

      {/* Leaves (Fp) */}
      {leafPts.map((p, i) => (
        <motion.g key={`leaf-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.45 + i * 0.04 }}>
          <circle cx={p.x} cy={p.y} r={3} fill={C.fp} stroke={C.fp} strokeWidth={0.8} />
        </motion.g>
      ))}
      <text x={cx} y={leafY + 14} textAnchor="middle" fontSize={8} fill={C.mut}>
        Fp × {leafCount} (per Fp²)
      </text>
    </g>
  );
}

/* ---------------- Bar Comparison ---------------- */
function BarCompare({ naive, karat, unit }: { scale: number; naive: number; karat: number; unit: string }) {
  const BAR_MAX = 340;
  const max = naive;
  const naiveW = (naive / max) * BAR_MAX;
  const karatW = (karat / max) * BAR_MAX;
  const saving = Math.round(((naive - karat) / naive) * 100);

  return (
    <g>
      <text x={260} y={40} textAnchor="middle" fontSize={13}
        fontWeight={700} fill={C.fg}>
        {unit}
      </text>

      {/* Naive bar */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <text x={85} y={92} textAnchor="end" fontSize={11}
          fontWeight={600} fill={C.naive}>Naive</text>
        <motion.rect x={100} y={75} rx={5} height={28}
          initial={{ width: 0 }}
          animate={{ width: naiveW }}
          transition={{ ...sp, duration: 0.8 }}
          fill={`${C.naive}22`} stroke={C.naive} strokeWidth={1.2} />
        <motion.text x={100 + naiveW + 8} y={94}
          fontSize={13} fontWeight={800} fill={C.naive}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.5 }}>
          {naive.toLocaleString()}
        </motion.text>
      </motion.g>

      {/* Karatsuba bar */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <text x={85} y={152} textAnchor="end" fontSize={11}
          fontWeight={600} fill={C.karat}>Karatsuba</text>
        <motion.rect x={100} y={135} rx={5} height={28}
          initial={{ width: 0 }}
          animate={{ width: karatW }}
          transition={{ ...sp, duration: 0.8, delay: 0.2 }}
          fill={`${C.karat}22`} stroke={C.karat} strokeWidth={1.2} />
        <motion.text x={100 + karatW + 8} y={154}
          fontSize={13} fontWeight={800} fill={C.karat}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.7 }}>
          {karat.toLocaleString()}
        </motion.text>
      </motion.g>

      {/* Savings callout */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={130} y={200} width={260} height={50} rx={8}
          fill={`${C.karat}10`} stroke={`${C.karat}55`} strokeWidth={1.2} />
        <text x={260} y={222} textAnchor="middle" fontSize={13}
          fontWeight={800} fill={C.karat}>
          −{(naive - karat).toLocaleString()} Fp mults ({saving}% 절감)
        </text>
        <text x={260} y={240} textAnchor="middle" fontSize={9}
          fill={C.mut}>
          타워의 모든 층이 Karatsuba를 받기 때문에 절감이 곱셈으로 누적
        </text>
      </motion.g>
    </g>
  );
}
