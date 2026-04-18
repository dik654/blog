import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { tr: '#6366f1', cst: '#10b981', fri: '#f59e0b', qry: '#ec4899', vfy: '#8b5cf6' };

const STEPS = [
  { label: 'STARK 증명 파이프라인 개요', body: '5단계로 실행 추적의 정당성을 다항식 저차 검증으로 환원. Trusted Setup 불필요.' },
  { label: '1. Trace Commit', body: '실행 추적을 다항식으로 보간 후 LDE 확장, Merkle Root로 커밋하여 바인딩.' },
  { label: '2. Constraint Composition', body: '랜덤 계수로 제약을 합산하고 vanishing polynomial로 나눠 몫 Q(x)를 생성.' },
  { label: '3. FRI -- 저차 검증', body: '다항식을 반복 접어(fold) degree를 절반으로 줄여 최종 상수가 되면 저차 확인.' },
  { label: '4-5. Query & Verify', body: '랜덤 쿼리 위치에서 Merkle proof + 제약 + FRI 일관성을 검사해 accept/reject.' },
];

/* arrow helper */
const Arrow = ({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 5, ay = y2 - uy * 5;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} />
      <polygon
        points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`}
        fill={color}
      />
    </g>
  );
};

export default function ProofFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 5-stage pipeline */}
              {[
                { label: 'Trace\nCommit', color: C.tr },
                { label: 'Constraint\nCompose', color: C.cst },
                { label: 'FRI', color: C.fri },
                { label: 'Query', color: C.qry },
                { label: 'Verify', color: C.vfy },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <ModuleBox x={10 + i * 95} y={20} w={85} h={50} label={s.label.split('\n')[0]}
                    sub={s.label.split('\n')[1] || ''} color={s.color} />
                  <circle cx={52 + i * 95} cy={14} r={10} fill={s.color} />
                  <text x={52 + i * 95} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">
                    {i + 1}
                  </text>
                  {i < 4 && <Arrow x1={95 + i * 95} y1={45} x2={105 + i * 95} y2={45} color="var(--muted-foreground)" />}
                </motion.g>
              ))}

              {/* Core idea */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={80} y={90} width={330} height={38} rx={6}
                  fill={`${C.vfy}08`} stroke={C.vfy} strokeWidth={0.5} />
                <text x={245} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.vfy}>
                  실행 추적이 올바른가? → 다항식 저차성으로 환원 → FRI 검증
                </text>
                <text x={245} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  Trusted Setup 불필요 (투명 증명)
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Program + Input */}
              <DataBox x={15} y={10} w={70} h={28} label="Program" color={C.tr} />
              <DataBox x={95} y={10} w={60} h={28} label="Input" color={C.tr} />

              {/* Execute arrow */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                <Arrow x1={85} y1={38} x2={85} y2={52} color={C.tr} />
              </motion.g>

              {/* Trace table */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={20} y={55} width={140} height={60} rx={6}
                  fill={`${C.tr}08`} stroke={C.tr} strokeWidth={0.5} />
                <text x={90} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.tr}>Execution Trace</text>
                <text x={90} y={85} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">n행 x w열</text>
                {/* mini grid */}
                {Array.from({ length: 3 }).map((_, r) =>
                  Array.from({ length: 4 }).map((_, c) => (
                    <rect key={`${r}${c}`} x={40 + c * 26} y={90 + r * 7} width={22} height={5} rx={1}
                      fill={`${C.tr}20`} stroke={C.tr} strokeWidth={0.3} />
                  ))
                )}
              </motion.g>

              {/* IFFT per column */}
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <Arrow x1={160} y1={85} x2={195} y2={85} color={C.tr} />
                <ActionBox x={200} y={66} w={90} h={38} label="IFFT" sub="col → f(x)" color={C.tr} />
              </motion.g>

              {/* LDE evaluation */}
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <Arrow x1={290} y1={85} x2={310} y2={85} color={C.cst} />
                <ActionBox x={315} y={66} w={80} h={38} label="LDE 평가" sub="rho * n점" color={C.cst} />
              </motion.g>

              {/* Merkle commit */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.45 }}>
                <Arrow x1={355} y1={104} x2={355} y2={125} color={C.fri} />
                <ModuleBox x={290} y={128} w={130} h={40} label="Merkle Root" sub="transcript.absorb(root)" color={C.fri} />
              </motion.g>

              {/* Summary */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <text x={245} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  trace 전체를 해시 하나로 바인딩
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Random coefficients from Fiat-Shamir */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.05 }}>
                <DataBox x={20} y={8} w={120} h={28} label="Fiat-Shamir" color={C.cst} outlined />
                <Arrow x1={80} y1={36} x2={80} y2={50} color={C.cst} />
                <text x={145} y={25} fontSize={8} fill="var(--muted-foreground)">alpha_1, alpha_2, ...</text>
              </motion.g>

              {/* Constraints being combined */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                {['T₁', 'T₂', 'B₁', 'B₂'].map((name, i) => (
                  <g key={i}>
                    <DataBox x={15 + i * 65} y={54} w={55} h={26} label={name} color={i < 2 ? C.tr : C.fri} />
                  </g>
                ))}
                <text x={295} y={70} fontSize={9} fill={C.cst}>→ C(x) = Sum alpha_i * c_i(x)</text>
              </motion.g>

              {/* C(x) -> Q(x) division */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <Arrow x1={150} y1={80} x2={150} y2={98} color={C.cst} />
                <ActionBox x={80} y={100} w={140} h={36} label="C(x)" sub="합산된 제약 다항식" color={C.cst} />
              </motion.g>

              {/* Vanishing polynomial */}
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <AlertBox x={290} y={100} w={140} h={36} label="Z_H(x) = x^n - 1" sub="vanishing poly" color={C.vfy} />
              </motion.g>

              {/* Division arrow */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
                <Arrow x1={220} y1={118} x2={290} y2={118} color={C.vfy} />
                <rect x={233} y={108} width={44} height={16} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
                <text x={255} y={120} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.vfy}>나누기</text>
              </motion.g>

              {/* Q(x) result */}
              <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <Arrow x1={245} y1={136} x2={245} y2={152} color={C.cst} />
                <ModuleBox x={155} y={155} w={180} h={36} label="Q(x) = C(x) / Z_H(x)" sub="deg(Q) ≤ max_deg - |H|" color={C.cst} />
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Initial polynomial */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.05 }}>
                <DataBox x={15} y={15} w={80} h={28} label="f₀ = Q(x)" color={C.fri} />
                <text x={55} y={55} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">deg d</text>
              </motion.g>

              {/* Folding rounds */}
              {[
                { label: 'f₁', deg: 'd/2' },
                { label: 'f₂', deg: 'd/4' },
                { label: 'f₃', deg: 'd/8' },
              ].map((round, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.12 }}>
                  <Arrow x1={95 + i * 115} y1={29} x2={125 + i * 115} y2={29} color={C.fri} />

                  {/* Split + Fold operation */}
                  <rect x={108 + i * 115} y={10} width={10} height={38} rx={3}
                    fill={`${C.fri}15`} stroke={C.fri} strokeWidth={0.5} />
                  <text x={113 + i * 115} y={32} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.fri}>F</text>

                  <DataBox x={130 + i * 115} y={15} w={75} h={28} label={round.label} color={C.fri} />
                  <text x={167 + i * 115} y={55} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">deg {round.deg}</text>
                </motion.g>
              ))}

              {/* Final constant */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <Arrow x1={440} y1={29} x2={460} y2={29} color={C.fri} />
                <circle cx={472} cy={29} r={12} fill={`${C.fri}20`} stroke={C.fri} strokeWidth={1} />
                <text x={472} y={33} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.fri}>c</text>
              </motion.g>

              {/* Fold explanation */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={30} y={72} width={430} height={50} rx={6}
                  fill={`${C.fri}06`} stroke={C.fri} strokeWidth={0.4} />
                <text x={245} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fri}>접기(Fold) 과정</text>

                {/* Split visualization */}
                <ActionBox x={40} y={94} w={120} h={22} label="f(x) = g(x²) + x*h(x²)" color={C.fri} />
                <Arrow x1={160} y1={105} x2={185} y2={105} color={C.fri} />
                <ActionBox x={190} y={94} w={130} h={22} label="f_next = g + beta*h" color={C.fri} />
                <Arrow x1={320} y1={105} x2={340} y2={105} color={C.fri} />
                <DataBox x={345} y={98} w={100} h={22} label="Merkle 커밋" color={C.fri} />
              </motion.g>

              {/* beta from FS */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <text x={245} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  beta ← Fiat-Shamir (매 라운드)
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Query generation */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.05 }}>
                <DataBox x={20} y={8} w={100} h={28} label="Fiat-Shamir" color={C.qry} outlined />
                <Arrow x1={120} y1={22} x2={150} y2={22} color={C.qry} />
                <text x={200} y={18} fontSize={8} fill="var(--muted-foreground)">랜덤 쿼리 위치</text>
                {/* query position dots */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.circle key={i} cx={160 + i * 22} cy={28} r={4}
                    fill={C.qry} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ ...sp, delay: 0.1 + i * 0.05 }} />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                  <text key={`q${i}`} x={160 + i * 22} y={40} textAnchor="middle" fontSize={7} fill={C.qry}>
                    q{i + 1}
                  </text>
                ))}
              </motion.g>

              {/* Per-query response */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <text x={245} y={60} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.qry}>각 쿼리 q에 대해</text>
                <ActionBox x={20} y={68} w={130} h={34} label="trace_lde[q]" sub="값 응답" color={C.tr} />
                <ActionBox x={170} y={68} w={130} h={34} label="merkle_proof(q)" sub="경로 증명" color={C.fri} />
                <ActionBox x={320} y={68} w={130} h={34} label="fri_decommit(q)" sub="FRI 열기" color={C.fri} />
              </motion.g>

              {/* Verifier checks */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.4 }}>
                <Arrow x1={245} y1={102} x2={245} y2={118} color={C.vfy} />
                <ModuleBox x={100} y={120} w={290} h={44} label="Verifier 검증" color={C.vfy} />

                {/* Three check items */}
                {[
                  { label: 'Merkle\n일치', x: 140 },
                  { label: '제약\n충족', x: 245 },
                  { label: 'FRI\n일관성', x: 350 },
                ].map((chk, i) => (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...sp, delay: 0.5 + i * 0.08 }}>
                    <circle cx={chk.x} cy={145} r={8} fill={`${C.cst}20`} stroke={C.cst} strokeWidth={0.8} />
                    <text x={chk.x} y={148} textAnchor="middle" fontSize={7} fontWeight={700} fill={C.cst}>OK</text>
                  </motion.g>
                ))}
              </motion.g>

              {/* Accept / Reject */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.65 }}>
                <Arrow x1={245} y1={164} x2={245} y2={178} color={C.vfy} />
                <rect x={190} y={178} width={55} height={20} rx={10} fill={`${C.cst}20`} stroke={C.cst} strokeWidth={0.8} />
                <text x={217} y={192} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.cst}>Accept</text>
                <text x={260} y={192} fontSize={9} fill="var(--muted-foreground)">/</text>
                <rect x={270} y={178} width={50} height={20} rx={10} fill={`${C.qry}15`} stroke={C.qry} strokeWidth={0.8} />
                <text x={295} y={192} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.qry}>Reject</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
