import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { toxic: '#ef4444', r1cs: '#6366f1', qap: '#10b981', key: '#f59e0b', mpc: '#8b5cf6' };

const Arrow = ({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 6, ay = y2 - uy * 6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} />
      <polygon points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`} fill={color} />
    </g>
  );
};

const STEPS = [
  { label: 'Toxic Waste 생성', body: '5개 비밀 스칼라를 BN254 Fr 필드에서 균일 랜덤 추출.' },
  { label: 'SynthesisMode::Setup -- R1CS 수집', body: '값 할당 없이 구조(변수 인덱스 + 계수)만 희소 매트릭스로 기록.' },
  { label: 'IFFT 보간 -- QAP 다항식', body: '각 변수 j에 대해 열 벡터를 단위근 도메인에서 역 FFT하여 다항식 복원.' },
  { label: 'MSM 배치 -- query 벡터 생성', body: '변수별 다항식 계수와 SRS tau 포인트를 MSM으로 결합하여 PK/VK 구성.' },
  { label: 'MPC 세레모니', body: 'Phase1(Powers of Tau) + Phase2(회로별 주입). N명 중 1명만 정직하면 안전.' },
];

export default function SetupDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={150} y={4} w={180} h={32} label="Fr Uniform Sampling" color={C.toxic} />
              {/* Random dice to each value */}
              {['tau','alpha','beta','gamma','delta'].map((name, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <rect x={15 + i * 94} y={52} width={78} height={36} rx={8}
                    fill={`${C.toxic}10`} stroke={C.toxic} strokeWidth={1} />
                  <text x={54 + i * 94} y={70} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.toxic}>{name}</text>
                  <text x={54 + i * 94} y={83} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">rand(1..r-1)</text>
                </motion.g>
              ))}
              {/* Field order note */}
              <text x={245} y={112} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                r = 21888...93 (BN254 scalar field, 254-bit prime)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={10} y={8} w={130} h={36} label="Circuit" sub="x * x == y" color={C.r1cs} />
              <Arrow x1={140} y1={26} x2={170} y2={26} color={C.r1cs} />
              <ActionBox x={170} y={8} w={120} h={36} label="SynthesisMode" sub="Setup (no values)" color={C.r1cs} />
              <Arrow x1={290} y1={26} x2={320} y2={26} color={C.r1cs} />

              {/* Sparse matrices */}
              {['A','B','C'].map((name, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                  <ModuleBox x={320} y={i * 42 + 4} w={80} h={32} label={`${name} matrix`} sub="sparse" color={C.r1cs} />
                </motion.g>
              ))}

              {/* Matrix grid visualization */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                {/* Grid cells for A */}
                {[0,1,2].map(col => (
                  <g key={col}>
                    <rect x={420 + col * 20} y={8} width={18} height={18} rx={2}
                      fill={col === 1 ? `${C.r1cs}25` : 'var(--card)'}
                      stroke={col === 1 ? C.r1cs : 'var(--border)'} strokeWidth={col === 1 ? 1 : 0.5} />
                    <text x={429 + col * 20} y={21} textAnchor="middle" fontSize={8}
                      fill={col === 1 ? C.r1cs : 'var(--muted-foreground)'}>{col === 1 ? '1' : '0'}</text>
                  </g>
                ))}
                <text x={10} y={170} fontSize={8} fill="var(--muted-foreground)">
                  n=3 vars (1, x, y), m=1 constraints
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Input columns */}
              {['A[:,j]','B[:,j]','C[:,j]'].map((label, i) => (
                <DataBox key={i} x={10} y={10 + i * 40} w={70} h={28} label={label} color={C.r1cs} />
              ))}

              {/* IFFT */}
              <ActionBox x={120} y={30} w={90} h={52} label="IFFT" sub="inverse FFT" color={C.qap} />
              {[0,1,2].map(i => (
                <Arrow key={i} x1={80} y1={24 + i * 40} x2={120} y2={56} color={C.qap} />
              ))}

              {/* Output polynomials */}
              {['a_j(x)','b_j(x)','c_j(x)'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                  <DataBox x={250} y={10 + i * 40} w={80} h={28} label={label} color={C.qap} />
                </motion.g>
              ))}
              {[0,1,2].map(i => (
                <Arrow key={i} x1={210} y1={56} x2={250} y2={24 + i * 40} color={C.qap} />
              ))}

              {/* Domain */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={350} y={30} width={130} height={50} rx={6}
                  fill={`${C.qap}08`} stroke={C.qap} strokeWidth={0.5} strokeDasharray="4 3" />
                <text x={415} y={50} textAnchor="middle" fontSize={9} fill={C.qap}>evaluation domain</text>
                <text x={415} y={68} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">w^0, w^1, ..., w^(m-1)</text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Poly coeffs + SRS tau input */}
              <DataBox x={10} y={10} w={80} h={28} label="poly coeffs" color={C.qap} />
              <DataBox x={10} y={50} w={80} h={28} label="[tau^i]" sub="SRS" color={C.key} />

              <Arrow x1={90} y1={24} x2={130} y2={40} color={C.key} />
              <Arrow x1={90} y1={64} x2={130} y2={52} color={C.key} />

              {/* MSM */}
              <ActionBox x={130} y={24} w={90} h={44} label="MSM" sub="multi-scalar mul" color={C.key} />
              <Arrow x1={220} y1={46} x2={260} y2={46} color={C.key} />

              {/* Output query vectors */}
              {[
                { label: 'a_query', sub: 'G1', y: 10 },
                { label: 'b_query', sub: 'G2', y: 44 },
                { label: 'h_query', sub: 'G1', y: 78 },
                { label: 'l_query', sub: 'G1 priv', y: 112 },
              ].map((q, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                  <rect x={260} y={q.y} width={110} height={28} rx={6}
                    fill={`${C.key}10`} stroke={C.key} strokeWidth={0.8} />
                  <text x={315} y={q.y + 14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.key}>{q.label}</text>
                  <text x={315} y={q.y + 24} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{q.sub}</text>
                </motion.g>
              ))}

              {/* PK / VK labels */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <rect x={390} y={10} width={80} height={60} rx={6}
                  fill={`${C.key}08`} stroke={C.key} strokeWidth={0.5} />
                <text x={430} y={34} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.key}>PK</text>
                <text x={430} y={50} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">prover</text>
                <rect x={390} y={80} width={80} height={60} rx={6}
                  fill={`${C.qap}08`} stroke={C.qap} strokeWidth={0.5} />
                <text x={430} y={104} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.qap}>VK</text>
                <text x={430} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">verifier</text>
              </motion.g>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* MPC chain */}
              {['P1','P2','P3','...','Pn'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <circle cx={50 + i * 90} cy={40} r={20} fill={`${C.mpc}12`} stroke={C.mpc} strokeWidth={1} />
                  <text x={50 + i * 90} y={44} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.mpc}>{label}</text>
                  {i < 4 && <Arrow x1={70 + i * 90} y1={40} x2={120 + i * 90} y2={40} color={C.mpc} />}
                </motion.g>
              ))}

              {/* Accumulation */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <text x={245} y={80} textAnchor="middle" fontSize={9} fill={C.mpc}>
                  acc = t1 * t2 * t3 * ... * tn
                </text>
              </motion.g>

              {/* Phase labels */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                <ModuleBox x={30} y={100} w={180} h={36} label="Phase 1: Powers of Tau" sub="universal SRS" color={C.mpc} />
                <ModuleBox x={260} y={100} w={180} h={36} label="Phase 2: Circuit-specific" sub="alpha, beta, gamma, delta" color={C.mpc} />
              </motion.g>

              <text x={245} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                1-of-N trust: 한 명만 비밀 삭제하면 안전
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
