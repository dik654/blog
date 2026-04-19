import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  r1cs: '#6366f1',
  poly: '#8b5cf6',
  vanish: '#10b981',
  quotient: '#f59e0b',
  ldt: '#3b82f6',
  warn: '#ef4444',
  ok: '#10b981',
};

const STEPS = [
  {
    label: '① R1CS — A·z ⊙ B·z = C·z, m × (n+m+1) 매트릭스',
    body:
      'z = (1, x_1, ..., x_n, w_1, ..., w_m): public + private + intermediate.\n' +
      'A, B, C ∈ F^{m × (n+m+1)} sparse matrix.\n' +
      '⊙ = element-wise product. 각 constraint row i 가 곱셈 1개.',
  },
  {
    label: '② Step 1 — Lagrange interpolation: 벡터 → polynomial',
    body:
      'Domain H = {ω⁰, ω¹, …, ω^{m-1}} (ω = m-th root of unity).\n' +
      'A·z 의 i 번째 원소를 ω^i 평가값으로 보간 → Â(x).\n' +
      'B̂(x), Ĉ(x) 도 동일. 점들이 곡선으로 변환.',
  },
  {
    label: '③ Step 2 — multiplication check: Â·B̂ = Ĉ mod v_H',
    body:
      'R1CS holds ⟺ ω^i ∈ H 모든 점에서 Â(ω^i)·B̂(ω^i) = Ĉ(ω^i).\n' +
      '즉 (Â·B̂ − Ĉ)(x) 는 v_H(x) 의 배수.\n' +
      'v_H(x) = ∏_{i<m} (x − ω^i): vanishing polynomial.',
  },
  {
    label: '④ Step 3 — quotient h(x) = (Â·B̂ − Ĉ) / v_H',
    body:
      '만족: h(x) 가 다항식 (저차, deg ≈ m).\n' +
      '불만족: h(x) 가 다항식 아님 → 평가하면 고차/유리식.\n' +
      '→ "h 의 저차성" 검증으로 R1CS 만족을 확인.',
  },
  {
    label: '⑤ Step 4 — Commit + LDT 로 h 의 저차성 검증',
    body:
      'Prover: Â, B̂, Ĉ, h 의 oracle commit (Merkle).\n' +
      'Verifier: random ρ → 평가 + opening proof.\n' +
      '+ FRI / Direct LDT 로 h 가 저차임을 증명.',
  },
];

export default function R1CSPolynomialViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.r1cs}>
                R1CS: A·z ⊙ B·z = C·z
              </text>
              {/* A matrix */}
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 5 }).map((_, c) => (
                  <motion.rect key={`a-${r}-${c}`}
                    x={20 + c * 14} y={40 + r * 14} width={12} height={12} rx={1.5}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: 1, scale: 1,
                      fill: ((r + c) % 3 === 0) ? `${C.r1cs}55` : `${C.r1cs}10`,
                      stroke: C.r1cs,
                    }}
                    strokeWidth={0.4}
                    transition={{ ...sp, delay: 0.02 * (r * 5 + c) }}
                  />
                ))
              )}
              <text x={50} y={36} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.r1cs}>A</text>
              {/* z vector */}
              <text x={107} y={70} fontSize={10} fill="var(--foreground)">·</text>
              {Array.from({ length: 4 }).map((_, r) => (
                <motion.rect key={`za-${r}`}
                  x={115} y={40 + r * 14} width={12} height={12} rx={1.5}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, fill: `${C.poly}33`, stroke: C.poly }}
                  strokeWidth={0.5}
                  transition={{ ...sp, delay: 0.05 * r }} />
              ))}
              <text x={121} y={36} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.poly}>z</text>
              {/* o */}
              <text x={140} y={70} fontSize={11} fontWeight={700} fill={C.warn}>⊙</text>
              {/* B matrix */}
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 5 }).map((_, c) => (
                  <motion.rect key={`b-${r}-${c}`}
                    x={155 + c * 14} y={40 + r * 14} width={12} height={12} rx={1.5}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: 1, scale: 1,
                      fill: ((r + c * 2) % 4 === 0) ? `${C.r1cs}55` : `${C.r1cs}10`,
                      stroke: C.r1cs,
                    }}
                    strokeWidth={0.4}
                    transition={{ ...sp, delay: 0.02 * (r * 5 + c) + 0.15 }}
                  />
                ))
              )}
              <text x={185} y={36} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.r1cs}>B</text>
              <text x={245} y={70} fontSize={10} fill="var(--foreground)">·</text>
              {Array.from({ length: 4 }).map((_, r) => (
                <motion.rect key={`zb-${r}`}
                  x={252} y={40 + r * 14} width={12} height={12} rx={1.5}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, fill: `${C.poly}33`, stroke: C.poly }}
                  strokeWidth={0.5}
                  transition={{ ...sp, delay: 0.05 * r + 0.15 }} />
              ))}
              <text x={258} y={36} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.poly}>z</text>
              {/* = */}
              <text x={278} y={73} fontSize={14} fontWeight={700} fill={C.ok}>=</text>
              {/* C matrix */}
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 5 }).map((_, c) => (
                  <motion.rect key={`c-${r}-${c}`}
                    x={295 + c * 14} y={40 + r * 14} width={12} height={12} rx={1.5}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: 1, scale: 1,
                      fill: ((r + c) % 4 === 0) ? `${C.ok}55` : `${C.ok}10`,
                      stroke: C.ok,
                    }}
                    strokeWidth={0.4}
                    transition={{ ...sp, delay: 0.02 * (r * 5 + c) + 0.3 }}
                  />
                ))
              )}
              <text x={325} y={36} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ok}>C</text>
              <text x={388} y={70} fontSize={10} fill="var(--foreground)">·</text>
              {Array.from({ length: 4 }).map((_, r) => (
                <motion.rect key={`zc-${r}`}
                  x={395} y={40 + r * 14} width={12} height={12} rx={1.5}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, fill: `${C.poly}33`, stroke: C.poly }}
                  strokeWidth={0.5}
                  transition={{ ...sp, delay: 0.05 * r + 0.3 }} />
              ))}
              <text x={401} y={36} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.poly}>z</text>

              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--foreground)">
                z = (1, x_1, …, x_n, w_1, …, w_m): public ‖ private ‖ intermediate
              </text>
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill={C.r1cs}>
                A, B, C ∈ F^{`{m × (n+m+1)}`}     ⊙ = element-wise
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 row i: (Σ_j A_ij · z_j) × (Σ_j B_ij · z_j) = Σ_j C_ij · z_j
              </text>
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill={C.poly}>
                목표: 이 곱셈 제약을 polynomial IOP 로 변환
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.poly}>
                Lagrange interpolation: A·z 벡터 → polynomial Â(x)
              </text>
              {/* axis */}
              <line x1={50} y1={170} x2={430} y2={170} stroke="var(--border)" strokeWidth={0.6} />
              <line x1={60} y1={50} x2={60} y2={180} stroke="var(--border)" strokeWidth={0.6} />
              {/* x-axis labels (H domain) */}
              {Array.from({ length: 6 }).map((_, i) => (
                <text key={i} x={80 + i * 60} y={185} textAnchor="middle" fontSize={8} fill={C.poly}>
                  ω^{i}
                </text>
              ))}
              {/* points */}
              {[
                { x: 80, y: 130 },
                { x: 140, y: 90 },
                { x: 200, y: 150 },
                { x: 260, y: 70 },
                { x: 320, y: 110 },
                { x: 380, y: 140 },
              ].map((p, i) => (
                <motion.circle key={i}
                  cx={p.x} cy={p.y} r={4}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, fill: C.r1cs }}
                  transition={{ ...sp, delay: 0.05 + i * 0.08 }} />
              ))}
              {/* labels under each point */}
              {Array.from({ length: 6 }).map((_, i) => (
                <text key={i} x={80 + i * 60} y={45} textAnchor="middle" fontSize={7.5} fill={C.r1cs}>
                  (Az)_{i}
                </text>
              ))}
              {/* curve interpolation */}
              <motion.path
                d="M 80 130 C 100 100, 120 70, 140 90 S 180 170, 200 150 S 240 30, 260 70 S 300 130, 320 110 S 360 160, 380 140"
                fill="none" stroke={C.poly} strokeWidth={1.5}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.6 }}
              />
              <text x={400} y={88} fontSize={10} fontWeight={700} fill={C.poly}>Â(x)</text>
              <text x={240} y={215} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Â(ω^i) = (A·z)_i  ∀i      (B̂, Ĉ 도 동일)
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.vanish}>
                multiplication check: Â(x)·B̂(x) = Ĉ(x) mod v_H(x)
              </text>
              {/* equation */}
              <DataBox x={20} y={50} w={90} h={32} label="Â(x)" color={C.poly} />
              <text x={120} y={72} fontSize={14} fontWeight={700} fill={C.poly}>·</text>
              <DataBox x={130} y={50} w={90} h={32} label="B̂(x)" color={C.poly} />
              <text x={232} y={72} fontSize={14} fontWeight={700} fill={C.ok}>=</text>
              <DataBox x={245} y={50} w={90} h={32} label="Ĉ(x)" color={C.ok} />
              <text x={350} y={72} fontSize={10} fill="var(--muted-foreground)">mod</text>
              <DataBox x={385} y={50} w={80} h={32} label="v_H(x)" color={C.vanish} />

              {/* domain H visualization */}
              <text x={240} y={115} textAnchor="middle" fontSize={9.5} fill={C.vanish}>
                H = {`{ω⁰, ω¹, …, ω^{m-1}}`} ⊂ F
              </text>
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                const cx = 240 + Math.cos(angle) * 38;
                const cy = 175 + Math.sin(angle) * 38;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...sp, delay: 0.2 + i * 0.07 }}>
                    <circle cx={cx} cy={cy} r={4} fill={C.vanish} />
                    <text x={cx + 8} y={cy + 3} fontSize={7.5} fill={C.vanish}>ω^{i}</text>
                  </motion.g>
                );
              })}
              <circle cx={240} cy={175} r={42} fill="none" stroke={C.vanish} strokeWidth={0.6} strokeDasharray="3 2" />
              <text x={240} y={178} textAnchor="middle" fontSize={9} fill={C.vanish}>v_H</text>

              <text x={240} y={232} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                v_H(x) = ∏_{`{i<m}`} (x − ω^i)   — vanishing polynomial of H
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.quotient}>
                quotient: h(x) = (Â(x)·B̂(x) − Ĉ(x)) / v_H(x)
              </text>
              {/* satisfied case */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={45} width={210} height={150} rx={8}
                  fill={`${C.ok}10`} stroke={C.ok} strokeWidth={1.2} />
                <text x={125} y={62} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.ok}>
                  ✓ R1CS 만족
                </text>
                {/* low-degree curve */}
                <line x1={40} y1={170} x2={210} y2={170} stroke="var(--border)" strokeWidth={0.5} />
                <motion.path
                  d="M 40 150 Q 125 130 210 150"
                  fill="none" stroke={C.ok} strokeWidth={1.6}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }} />
                <text x={125} y={185} textAnchor="middle" fontSize={9} fill={C.ok}>
                  h(x) = polynomial, 저차 (≈ m)
                </text>
                <text x={125} y={92} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                  Â·B̂ − Ĉ 가 v_H 의 배수
                </text>
                <text x={125} y={108} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                  → 나누면 다항식
                </text>
              </motion.g>
              {/* unsatisfied case */}
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <rect x={250} y={45} width={210} height={150} rx={8}
                  fill={`${C.warn}10`} stroke={C.warn} strokeWidth={1.2} />
                <text x={355} y={62} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.warn}>
                  ✗ R1CS 불만족
                </text>
                <line x1={270} y1={170} x2={440} y2={170} stroke="var(--border)" strokeWidth={0.5} />
                <motion.path
                  d="M 270 175 Q 290 90 310 160 Q 340 90 360 165 Q 380 90 400 155 Q 420 100 440 145"
                  fill="none" stroke={C.warn} strokeWidth={1.6}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }} />
                <text x={355} y={185} textAnchor="middle" fontSize={9} fill={C.warn}>
                  h(x) = 고차/유리식 (다항식 X)
                </text>
                <text x={355} y={92} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                  Â·B̂ − Ĉ 가 v_H 배수 아님
                </text>
                <text x={355} y={108} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                  → 나누면 저차 보장 X
                </text>
              </motion.g>
              <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                "h 의 저차성" 검증 ⟺ R1CS 만족
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ldt}>
                Commit + Low-Degree Test
              </text>
              {/* Prover commits */}
              <text x={70} y={48} fontSize={9} fontWeight={700} fill={C.poly}>Prover commit</text>
              {['Â', 'B̂', 'Ĉ', 'h'].map((p, i) => (
                <motion.g key={p}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
                  <DataBox x={20 + i * 50} y={58} w={42} h={26} label={p} color={C.poly} />
                </motion.g>
              ))}
              {/* arrow */}
              <motion.line x1={230} y1={72} x2={290} y2={72}
                stroke={C.ldt} strokeWidth={1.2} markerEnd="url(#arrLDT)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.55 }} />
              <text x={260} y={66} textAnchor="middle" fontSize={8} fill={C.ldt}>Merkle root</text>
              {/* Verifier */}
              <DataBox x={295} y={58} w={170} h={26} label="Verifier" color={C.ldt} />

              {/* random ρ */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                <line x1={295} y1={108} x2={235} y2={108}
                  stroke={C.quotient} strokeWidth={1} markerEnd="url(#arrLDT)" />
                <text x={265} y={102} textAnchor="middle" fontSize={8} fill={C.quotient}>random ρ</text>
              </motion.g>
              {/* opening */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.9 }}>
                <line x1={235} y1={130} x2={295} y2={130}
                  stroke={C.poly} strokeWidth={1} markerEnd="url(#arrLDT)" />
                <text x={265} y={124} textAnchor="middle" fontSize={8} fill={C.poly}>
                  Â(ρ), B̂(ρ), Ĉ(ρ), h(ρ) + paths
                </text>
              </motion.g>

              <defs>
                <marker id="arrLDT" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 z" fill="#888" />
                </marker>
              </defs>

              {/* Verifier checks */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 1.05 }}>
                <rect x={20} y={155} width={440} height={70} rx={6}
                  fill={`${C.ldt}10`} stroke={C.ldt} strokeWidth={0.8} />
                <text x={32} y={172} fontSize={9} fontWeight={700} fill={C.ldt}>Verifier checks:</text>
                <text x={32} y={188} fontSize={9} fill="var(--foreground)">
                  1. Â(ρ)·B̂(ρ) − Ĉ(ρ) == v_H(ρ) · h(ρ)
                </text>
                <text x={32} y={203} fontSize={9} fill="var(--foreground)">
                  2. 모든 opening 의 Merkle path 유효
                </text>
                <text x={32} y={218} fontSize={9} fill="var(--foreground)">
                  3. FRI / Direct LDT: h 가 저차 다항식
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
