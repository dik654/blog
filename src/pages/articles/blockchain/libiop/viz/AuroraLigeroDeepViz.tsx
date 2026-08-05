import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  aurora: '#3b82f6',
  ligero: '#8b5cf6',
  rs: '#10b981',
  query: '#f59e0b',
  poly: '#6366f1',
  fold: '#ec4899',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '① Aurora vs Ligero — 복잡도 비교',
    body:
      'Aurora: FRI 기반, proof O(log² n), verifier O(log² n).\n' +
      'Ligero: Direct LDT, proof O(√n), verifier O(n).\n' +
      'prover는 동일 O(n log n). constraint는 둘 다 R1CS.',
  },
  {
    label: '② Ligero — witness 를 m × n 행렬로 재배열 + 행 RS encoding',
    body:
      'Witness w (길이 N) → m × n 행렬로 재배열 (m·n = N).\n' +
      '각 행을 Reed-Solomon encoding (저차 다항식의 평가).\n' +
      '저장: 행별 머클 commit.',
  },
  {
    label: '③ Ligero — 열 query → consistency check',
    body:
      'Verifier가 무작위 열 인덱스 선택.\n' +
      '선택된 열의 모든 행 셀 open.\n' +
      'check: 각 행이 같은 다항식의 RS encoding인지 + 선형 관계.\n' +
      '구현: 단순(2-round). 단점: proof O(√n).',
  },
  {
    label: '④ Aurora — R1CS → polynomial encoding',
    body:
      'A·z, B·z, C·z 벡터를 Lagrange 보간 → Â(x), B̂(x), Ĉ(x).\n' +
      '제약 holds ⟺ Â(x)·B̂(x) = Ĉ(x) mod v_H(x).\n' +
      'Quotient h(x): (Â·B̂ - Ĉ) / v_H.',
  },
  {
    label: '⑤ Aurora — FRI fold 1 round',
    body:
      'f(x) = f_even(x²) + x · f_odd(x²) 분해.\n' +
      'Verifier가 random α 송신.\n' +
      'f\'(x) = f_even(x) + α · f_odd(x).\n' +
      '→ degree halved, domain halved.',
  },
  {
    label: '⑥ Aurora — log n rounds → 상수 크기 proof',
    body:
      'log₂ n 라운드 반복 → 결국 상수 다항식.\n' +
      '각 라운드에서 commit + query 송신.\n' +
      'Total proof: O(log² n) elements (commit O(log n) × open O(log n)).',
  },
];

export default function AuroraLigeroDeepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={22} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">측면</text>
              <text x={200} y={22} fontSize={11} fontWeight={700} fill={C.aurora} textAnchor="middle">Aurora</text>
              <text x={370} y={22} fontSize={11} fontWeight={700} fill={C.ligero} textAnchor="middle">Ligero</text>
              <line x1={15} y1={28} x2={465} y2={28} stroke="var(--border)" strokeWidth={0.6} />
              {[
                { k: 'Proof size', a: 'O(log² n)', l: 'O(√n)', good: 'a' },
                { k: 'Prover time', a: 'O(n log n)', l: 'O(n log n)', good: '=' },
                { k: 'Verifier time', a: 'O(log² n)', l: 'O(n)', good: 'a' },
                { k: 'Constraint', a: 'R1CS', l: 'R1CS', good: '=' },
                { k: 'Low-degree test', a: 'FRI', l: 'Direct', good: '-' },
                { k: 'Complexity', a: '복잡', l: '단순', good: 'l' },
              ].map((r, i) => (
                <motion.g key={r.k}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.05 + i * 0.07 }}>
                  <rect x={15} y={36 + i * 30} width={450} height={26} rx={4}
                    fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
                  <text x={20} y={53 + i * 30} fontSize={9.5} fill="var(--foreground)">{r.k}</text>
                  <text x={200} y={53 + i * 30} textAnchor="middle" fontSize={9.5}
                    fontWeight={r.good === 'a' ? 700 : 400}
                    fill={r.good === 'a' ? C.aurora : 'var(--foreground)'}>{r.a}</text>
                  <text x={370} y={53 + i * 30} textAnchor="middle" fontSize={9.5}
                    fontWeight={r.good === 'l' ? 700 : 400}
                    fill={r.good === 'l' ? C.ligero : 'var(--foreground)'}>{r.l}</text>
                </motion.g>
              ))}
              <text x={240} y={228} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                Aurora: 대규모 회로 / Ligero: 소규모 + 단순 구현 우선
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.ligero}>
                Ligero: witness w → m × n 행렬 + 행 RS encoding
              </text>
              {/* matrix */}
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 6 }).map((_, c) => (
                  <motion.rect key={`${r}-${c}`}
                    x={70 + c * 22} y={45 + r * 22} width={20} height={20} rx={2}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1, fill: `${C.ligero}1a`, stroke: C.ligero }}
                    strokeWidth={0.6}
                    transition={{ ...sp, delay: 0.03 * (r * 6 + c) }}
                  />
                ))
              )}
              {/* labels */}
              {Array.from({ length: 4 }).map((_, r) => (
                <text key={r} x={62} y={59 + r * 22} textAnchor="end" fontSize={8} fill={C.ligero}>
                  w_{r}
                </text>
              ))}
              {/* RS encoding arrows + extension */}
              {Array.from({ length: 4 }).map((_, r) => (
                <motion.g key={r}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.5 + r * 0.1 }}>
                  <line x1={205} y1={55 + r * 22} x2={235} y2={55 + r * 22}
                    stroke={C.rs} strokeWidth={0.8} markerEnd="url(#arrRS)" />
                  {Array.from({ length: 9 }).map((_, c) => (
                    <rect key={c} x={240 + c * 16} y={45 + r * 22} width={14} height={20} rx={2}
                      fill={c < 6 ? `${C.ligero}22` : `${C.rs}33`}
                      stroke={c < 6 ? C.ligero : C.rs} strokeWidth={0.5} />
                  ))}
                </motion.g>
              ))}
              <defs>
                <marker id="arrRS" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 z" fill={C.rs} />
                </marker>
              </defs>
              <text x={155} y={155} fontSize={8} fill={C.ligero}>m × n witness</text>
              <text x={310} y={155} fontSize={8} fill={C.rs}>RS-encoded codeword (n → 1.5n)</text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 행이 독립 RS encoding → 행별 Merkle commit
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.query}>
                Verifier: random column query → consistency check
              </text>
              {/* matrix with query column highlighted */}
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 9 }).map((_, c) => {
                  const queried = c === 2 || c === 6;
                  return (
                    <motion.rect key={`${r}-${c}`}
                      x={130 + c * 22} y={45 + r * 22} width={20} height={20} rx={2}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        fill: queried ? `${C.query}55` : `${C.ligero}1a`,
                        stroke: queried ? C.query : C.ligero,
                      }}
                      strokeWidth={queried ? 1.4 : 0.5}
                      transition={{ ...sp, delay: 0.03 * (r * 9 + c) }}
                    />
                  );
                })
              )}
              {/* arrows from above to columns */}
              {[2, 6].map((c, k) => (
                <motion.g key={c}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.7 + k * 0.15 }}>
                  <line x1={140 + c * 22} y1={35} x2={140 + c * 22} y2={42}
                    stroke={C.query} strokeWidth={1} markerEnd="url(#arrQ)" />
                  <text x={140 + c * 22} y={32} textAnchor="middle" fontSize={8} fill={C.query}>
                    col {c}
                  </text>
                </motion.g>
              ))}
              <defs>
                <marker id="arrQ" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 z" fill={C.query} />
                </marker>
              </defs>
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                check: 각 행 = RS encoding ✓  +  Σ_r α_r · row_r = expected ✓
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill={C.query}>
                proof = 선택된 열의 셀 + 머클 path
              </text>
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                전체 행렬 대신 column 단위 → O(√N) proof
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.aurora}>
                Aurora: R1CS → polynomial encoding
              </text>
              {/* R1CS source */}
              <DataBox x={20} y={50} w={120} h={36} label="A·z, B·z, C·z" sub="vectors" color={C.aurora} />
              {/* arrow */}
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.15 }}>
                <line x1={140} y1={68} x2={195} y2={68}
                  stroke={C.poly} strokeWidth={1.2} markerEnd="url(#arrAur)" />
                <text x={167} y={62} textAnchor="middle" fontSize={8} fill={C.poly}>Lagrange</text>
              </motion.g>
              {/* Polynomials */}
              <DataBox x={200} y={42} w={100} h={24} label="Â(x)" color={C.poly} />
              <DataBox x={200} y={72} w={100} h={24} label="B̂(x)" color={C.poly} />
              <DataBox x={200} y={102} w={100} h={24} label="Ĉ(x)" color={C.poly} />
              {/* arrow */}
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <line x1={302} y1={84} x2={350} y2={84}
                  stroke={C.fold} strokeWidth={1.2} markerEnd="url(#arrAur)" />
                <text x={326} y={78} textAnchor="middle" fontSize={8} fill={C.fold}>quotient</text>
              </motion.g>
              {/* Equation */}
              <DataBox x={350} y={70} w={120} h={28} label="h(x)" sub="(Â·B̂-Ĉ)/v_H" color={C.fold} />
              <defs>
                <marker id="arrAur" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 z" fill="#888" />
                </marker>
              </defs>
              <text x={240} y={155} textAnchor="middle" fontSize={9.5} fill="var(--foreground)">
                R1CS holds ⟺ Â(x)·B̂(x) = Ĉ(x)  mod v_H(x)
              </text>
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill={C.fold}>
                v_H(x) = ∏(x − ω^i)   (vanishing poly of H)
              </text>
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                다음 단계: h 의 저차성을 FRI 로 증명
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.fold}>
                FRI fold: degree d → d/2 (1 round)
              </text>
              {/* Original poly */}
              <DataBox x={20} y={50} w={130} h={32} label="f(x), deg = d" color={C.poly} />
              {/* split */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.15 }}>
                <line x1={150} y1={66} x2={210} y2={50}
                  stroke={C.poly} strokeWidth={0.8} markerEnd="url(#arrFRI)" />
                <line x1={150} y1={66} x2={210} y2={82}
                  stroke={C.poly} strokeWidth={0.8} markerEnd="url(#arrFRI)" />
              </motion.g>
              <DataBox x={210} y={36} w={120} h={26} label="f_even(y)" sub="deg d/2" color={C.poly} />
              <DataBox x={210} y={70} w={120} h={26} label="f_odd(y)" sub="deg d/2" color={C.poly} />
              {/* combine via α */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <line x1={330} y1={49} x2={380} y2={66}
                  stroke={C.fold} strokeWidth={1} markerEnd="url(#arrFRI)" />
                <line x1={330} y1={83} x2={380} y2={66}
                  stroke={C.fold} strokeWidth={1} markerEnd="url(#arrFRI)" />
                <text x={355} y={45} textAnchor="middle" fontSize={8} fill={C.fold}>+ α</text>
              </motion.g>
              <DataBox x={380} y={50} w={90} h={32} label="f'(y)" sub="deg d/2" color={C.fold} />
              <defs>
                <marker id="arrFRI" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 z" fill="#888" />
                </marker>
              </defs>
              <text x={240} y={120} textAnchor="middle" fontSize={9.5} fill="var(--foreground)">
                f(x) = f_even(x²) + x · f_odd(x²)
              </text>
              <text x={240} y={140} textAnchor="middle" fontSize={9.5} fill={C.fold}>
                f'(y) = f_even(y) + α · f_odd(y),    α ← Verifier
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                degree halved · domain halved · Verifier consistency check
              </text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill={C.fold}>
                다음 라운드는 f' 에 대해 동일하게 fold
              </text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.aurora}>
                FRI: log n rounds → 상수 다항식
              </text>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.12 }}>
                  <rect x={30 + i * 85} y={50} width={75} height={Math.max(12, 80 / (i + 1))} rx={3}
                    fill={`${C.fold}22`} stroke={C.fold} strokeWidth={0.8} />
                  <text x={67 + i * 85} y={45} textAnchor="middle" fontSize={8.5} fill={C.fold}>
                    round {i}
                  </text>
                  <text x={67 + i * 85} y={150} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                    {`deg = ${1 << (4 - i)}`}
                  </text>
                  {i < 4 && (
                    <line x1={108 + i * 85} y1={70} x2={113 + i * 85} y2={70}
                      stroke={C.fold} strokeWidth={1} markerEnd="url(#arrLog)" />
                  )}
                </motion.g>
              ))}
              <defs>
                <marker id="arrLog" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5 z" fill={C.fold} />
                </marker>
              </defs>
              <text x={240} y={180} textAnchor="middle" fontSize={9.5} fill="var(--foreground)">
                log₂ n rounds · 각 라운드 commit + open
              </text>
              <text x={240} y={205} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.aurora}>
                Total proof: O(log² n) elements
              </text>
              <text x={240} y={228} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                = O(log n) commits × O(log n) opens per query
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
