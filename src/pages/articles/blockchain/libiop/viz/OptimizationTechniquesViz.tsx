import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  bot: '#ef4444',     // bottleneck
  ntt: '#6366f1',     // NTT
  field: '#8b5cf6',   // 2-adicity / field
  bi: '#10b981',      // batch inversion
  cmp: '#f59e0b',     // compare bars
  cos: '#3b82f6',     // coset FFT
  muted: '#94a3b8',
};

const STEPS = [
  {
    label: '① 최적화 필요성 — Prover bottleneck',
    body: 'ZK 시스템에서 Prover 시간의 대부분은 polynomial 연산.\n\n  - polynomial multiplication: O(n²) naive\n  - field inversion: 곱셈의 ~100 배\n  - FFT/NTT 도메인 변환: 메모리 대량 사용\n\n→ 실용 성능을 위해 NTT, batch inversion, coset FFT 등 필수.',
  },
  {
    label: '② NTT — Cooley-Tukey butterfly',
    body: 'NTT (Number Theoretic Transform): FFT 의 finite field 버전.\n\n  x[k]       = x[k] + ω^k · x[k + n/2]\n  x[k + n/2] = x[k] − ω^k · x[k + n/2]\n\n→ O(n²) → O(n log n) polynomial multiplication.\n→ Twiddle factor (ω^k) 미리 계산.',
  },
  {
    label: '③ NTT 요구조건 — 2-adicity',
    body: 'NTT 가 동작하려면 p − 1 이 큰 2^k 약수를 가져야 함.\n\n  BLS12-381 Fr:\n    p − 1 = 2³² × 3 × ...\n    → 최대 2³² 크기 NTT 지원\n\n→ "ZK-friendly field" 의 핵심 설계 기준.\n→ Mersenne / Goldilocks / BabyBear 도 동일 이유.',
  },
  {
    label: '④ Batch Inversion — Montgomery trick',
    body: 'a₁, a₂, ..., aₙ 에 대해 inverse 한꺼번에 계산.\n\n  Step 1  prefix products  pᵢ = a₁ · a₂ · ... · aᵢ\n  Step 2  single inversion inv = 1 / pₙ          // 비싼 inversion 단 1번\n  Step 3  back-substitute  aᵢ⁻¹ = pᵢ₋₁ · (inv · suffix)\n\n→ Cost: 3(n − 1) mul + 1 inv.',
  },
  {
    label: '⑤ Naive vs Batch 비용 비교 (n = 10)',
    body: 'Naive:  10 inversion ≈ 10 × 100 mul = 1000 mul-equiv.\nBatch:  3(n − 1) mul + 1 inv = 27 mul + 100 mul-equiv = ~127 mul-equiv.\n\n→ 약 8× 가속.\n→ FRI low-degree extension 에서 수만 개 inverse 가 동시 발생 → 효과 극대.',
  },
  {
    label: '⑥ Coset FFT — shifted domain',
    body: '표준 FFT: roots of unity {ω⁰, ω¹, ..., ω^{n−1}} 에서 평가.\nCoset FFT: shift c 를 곱한 domain {c, cω, cω², ...} 에서 평가.\n\n장점\n  ① vanishing polynomial (xⁿ − 1) 0-issue 회피\n  ② quotient computation 안정\n  ③ low-degree extension 의 표준 도구',
  },
];

export default function OptimizationTechniquesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ① bottleneck */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bot}>
                Prover 시간 분석 — polynomial 연산이 지배
              </text>
              {/* horizontal stacked bar */}
              {[
                { w: 220, label: 'NTT / FFT', color: C.ntt },
                { w: 110, label: 'Inversion', color: C.bi },
                { w: 60, label: 'Hash', color: C.cos },
                { w: 50, label: 'etc', color: C.muted },
              ].reduce<{ x: number; bars: { x: number; w: number; label: string; color: string }[] }>(
                (acc, b) => {
                  acc.bars.push({ x: acc.x, ...b });
                  acc.x += b.w;
                  return acc;
                },
                { x: 30, bars: [] },
              ).bars.map((b, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                  style={{ transformOrigin: `${b.x}px 80px` }}
                  transition={{ ...sp, delay: 0.05 + i * 0.1 }}>
                  <rect x={b.x} y={60} width={b.w} height={40} fill={b.color} opacity={0.7} />
                  <text x={b.x + b.w / 2} y={85} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill="#fff">{b.label}</text>
                </motion.g>
              ))}
              <text x={30} y={120} fontSize={8} fill={C.muted}>0%</text>
              <text x={470} y={120} textAnchor="end" fontSize={8} fill={C.muted}>100%</text>

              <ActionBox x={30} y={150} w={130} h={40} label="O(n²) → O(n log n)" sub="NTT 적용" color={C.ntt} />
              <ActionBox x={175} y={150} w={130} h={40} label="100 mul → ~3 mul" sub="Batch inversion" color={C.bi} />
              <ActionBox x={320} y={150} w={130} h={40} label="vanishing 회피" sub="Coset FFT" color={C.cos} />
              <text x={240} y={220} textAnchor="middle" fontSize={9} fill={C.muted}>
                실용 ZK 성능의 90% 가 이 3가지에서 결정
              </text>
            </motion.g>
          )}

          {/* ② NTT butterfly */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ntt}>
                Cooley-Tukey butterfly — 한 단계
              </text>
              {/* left inputs */}
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <DataBox x={40} y={60} w={70} h={32} label="x[k]" color={C.ntt} outlined />
                <DataBox x={40} y={150} w={70} h={32} label="x[k+n/2]" color={C.ntt} outlined />
              </motion.g>
              {/* twiddle multiply */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <line x1={110} y1={166} x2={200} y2={166} stroke={C.field} strokeWidth={0.8} markerEnd="url(#na)" />
                <rect x={150} y={155} width={50} height={22} rx={3} fill={`${C.field}18`} stroke={C.field} strokeWidth={0.6} />
                <text x={175} y={170} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.field}>× ω^k</text>
              </motion.g>
              {/* crossing lines */}
              <motion.line x1={110} y1={76} x2={300} y2={100}
                stroke={C.ntt} strokeWidth={0.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.35 }} />
              <motion.line x1={210} y1={166} x2={300} y2={100}
                stroke={C.bi} strokeWidth={0.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.4 }} />
              <text x={250} y={92} fontSize={11} fontWeight={700} fill={C.bi}>+</text>
              <motion.line x1={110} y1={76} x2={300} y2={170}
                stroke={C.ntt} strokeWidth={0.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.45 }} />
              <motion.line x1={210} y1={166} x2={300} y2={170}
                stroke={C.bot} strokeWidth={0.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.5 }} />
              <text x={250} y={186} fontSize={11} fontWeight={700} fill={C.bot}>−</text>

              {/* outputs */}
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.55 }}>
                <DataBox x={310} y={84} w={150} h={32} label="x[k] + ω^k · x[k+n/2]" color={C.bi} outlined />
                <DataBox x={310} y={154} w={150} h={32} label="x[k] − ω^k · x[k+n/2]" color={C.bot} outlined />
              </motion.g>
              <text x={240} y={222} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.muted}>
                log₂ n 단계 반복  →  O(n log n)
              </text>
              <defs>
                <marker id="na" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={C.field} />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* ③ 2-adicity */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.field}>
                NTT 요구조건: p − 1 의 2-adicity
              </text>
              {/* equation */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={40} y={50} width={400} height={48} rx={6}
                  fill={`${C.field}10`} stroke={C.field} strokeWidth={0.7} />
                <text x={240} y={72} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={600} fill={C.field}>
                  BLS12-381 Fr:  p − 1  =  2³²  ×  3  ×  ...
                </text>
                <text x={240} y={88} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.muted}>
                  → 최대 2³² ≈ 4 × 10⁹ 크기 NTT 가능
                </text>
              </motion.g>
              {/* fields list */}
              {[
                { x: 30, y: 130, name: 'BLS12-381', sub: '2³²-adic' },
                { x: 150, y: 130, name: 'BN254', sub: '2²⁸-adic' },
                { x: 270, y: 130, name: 'Goldilocks', sub: '2³²-adic' },
                { x: 390, y: 130, name: 'BabyBear', sub: '2²⁷-adic' },
              ].map((f, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.08 }}>
                  <DataBox x={f.x} y={f.y} w={100} h={36} label={f.name} sub={f.sub} color={C.field} outlined />
                </motion.g>
              ))}
              <AlertBox x={70} y={185} w={340} h={40}
                label="ZK-friendly field" sub="2-adicity 가 NTT 의 최대 크기를 결정" color={C.field} />
            </motion.g>
          )}

          {/* ④ Batch Inversion 3-step */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bi}>
                Batch Inversion — Montgomery trick
              </text>
              {/* inputs */}
              <text x={20} y={55} fontSize={9} fontFamily="monospace" fill={C.muted}>입력</text>
              {[0, 1, 2, 3].map((i) => (
                <motion.g key={`in${i}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.05 + i * 0.05 }}>
                  <rect x={50 + i * 95} y={42} width={80} height={22} rx={3}
                    fill={`${C.bi}14`} stroke={C.bi} strokeWidth={0.6} />
                  <text x={90 + i * 95} y={56} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.bi}>
                    a{i + 1}
                  </text>
                </motion.g>
              ))}
              {/* step 1 prefix */}
              <text x={20} y={95} fontSize={9} fontFamily="monospace" fill={C.muted}>① prefix</text>
              {[0, 1, 2, 3].map((i) => (
                <motion.g key={`p${i}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.25 + i * 0.06 }}>
                  <rect x={50 + i * 95} y={82} width={80} height={22} rx={3}
                    fill={`${C.ntt}14`} stroke={C.ntt} strokeWidth={0.6} />
                  <text x={90 + i * 95} y={96} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.ntt}>
                    p{i + 1} = a₁..a{i + 1}
                  </text>
                </motion.g>
              ))}
              {/* step 2 single inv */}
              <text x={20} y={135} fontSize={9} fontFamily="monospace" fill={C.muted}>② 1× inv</text>
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <ActionBox x={335} y={120} w={100} h={28} label="inv = 1 / p₄" sub="single inversion" color={C.bot} />
                <line x1={385} y1={104} x2={385} y2={120} stroke={C.bot} strokeWidth={0.8} markerEnd="url(#bia)" />
              </motion.g>
              {/* step 3 back-substitute */}
              <text x={20} y={175} fontSize={9} fontFamily="monospace" fill={C.muted}>③ back-sub</text>
              {[0, 1, 2, 3].map((i) => (
                <motion.g key={`o${i}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.65 + i * 0.05 }}>
                  <rect x={50 + i * 95} y={162} width={80} height={22} rx={3}
                    fill={`${C.bi}30`} stroke={C.bi} strokeWidth={0.8} />
                  <text x={90 + i * 95} y={176} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.bi}>
                    a{i + 1}⁻¹
                  </text>
                </motion.g>
              ))}
              <text x={240} y={215} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.bi}>
                Cost  =  3(n − 1) mul  +  1 inv
              </text>
              <defs>
                <marker id="bia" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={C.bot} />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* ⑤ Naive vs Batch bar comparison */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cmp}>
                Naive vs Batch (n = 10, mul-equivalent cost)
              </text>
              {/* Naive bar — 1000 */}
              <text x={30} y={68} fontSize={10} fontWeight={600} fill={C.bot}>Naive</text>
              <text x={30} y={82} fontSize={8} fill={C.muted}>10 × inv</text>
              <motion.rect
                x={100} y={55} height={32} rx={3} fill={C.bot} opacity={0.85}
                initial={{ width: 0 }} animate={{ width: 360 }}
                transition={{ ...sp, delay: 0.15, duration: 0.6 }} />
              <text x={460} y={75} textAnchor="end" fontSize={10} fontWeight={600} fill="#fff">
                ~ 1000 mul
              </text>

              {/* Batch bar — 127 */}
              <text x={30} y={138} fontSize={10} fontWeight={600} fill={C.bi}>Batch</text>
              <text x={30} y={152} fontSize={8} fill={C.muted}>27 mul + 1 inv</text>
              <motion.rect
                x={100} y={125} height={32} rx={3} fill={C.bi} opacity={0.85}
                initial={{ width: 0 }} animate={{ width: 46 }}
                transition={{ ...sp, delay: 0.45, duration: 0.6 }} />
              <text x={155} y={145} fontSize={10} fontWeight={600} fill={C.bi}>
                ~ 127 mul
              </text>

              <ActionBox x={130} y={185} w={220} h={40} label="≈ 8× speedup" sub="FRI 에서 수만 개 inverse 동시 발생" color={C.bi} />
            </motion.g>
          )}

          {/* ⑥ Coset FFT */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cos}>
                Roots of unity vs Coset shift
              </text>
              {/* standard circle */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <circle cx={130} cy={120} r={60} fill="none" stroke={C.muted} strokeWidth={0.6} />
                <text x={130} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ntt}>표준 FFT</text>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  const px = 130 + Math.cos(angle) * 60;
                  const py = 120 + Math.sin(angle) * 60;
                  return (
                    <motion.circle key={i} cx={px} cy={py} r={4}
                      fill={C.ntt}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ ...sp, delay: 0.05 + i * 0.04 }} />
                  );
                })}
                <text x={130} y={195} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.ntt}>
                  ω⁰, ω¹, ..., ω⁷
                </text>
              </motion.g>
              {/* coset circle */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <circle cx={350} cy={120} r={60} fill="none" stroke={C.cos} strokeWidth={0.7} strokeDasharray="3 2" />
                <circle cx={350} cy={120} r={45} fill="none" stroke={C.muted} strokeWidth={0.4} opacity={0.4} />
                <text x={350} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cos}>Coset FFT</text>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const angle = (i / 8) * Math.PI * 2 + 0.2;
                  const px = 350 + Math.cos(angle) * 60;
                  const py = 120 + Math.sin(angle) * 60;
                  return (
                    <motion.circle key={i} cx={px} cy={py} r={4}
                      fill={C.cos}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ ...sp, delay: 0.25 + i * 0.04 }} />
                  );
                })}
                <text x={350} y={195} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.cos}>
                  c, cω, cω², ..., cω⁷
                </text>
              </motion.g>
              <text x={240} y={228} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.muted}>
                shift c → vanishing poly 0-issue 회피, quotient 안정
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
