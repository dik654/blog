import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { r: '#6366f1', q: '#10b981', s: '#f59e0b', p: '#ec4899', v: '#ef4444' };

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
  { label: '1. 회로 정의 -> R1CS', body: '계산 문제를 곱셈 게이트로 분해하고 A, B, C 행렬로 인코딩.' },
  { label: '2. R1CS -> QAP 변환', body: 'IFFT로 다항식 복원 후 vanishing polynomial로 나눗셈 검증.' },
  { label: '3. Trusted Setup (SRS)', body: 'MPC 세레모니로 비밀 파라미터 생성. PK/VK 분리.' },
  { label: '4. Prove -> (A, B, C)', body: 'MSM으로 witness 커밋. 블라인딩 추가하여 256B proof 출력.' },
  { label: '5. Verify -> O(1)', body: '3회 페어링으로 증명 검증. 약 4ms, 온체인 280k gas.' },
];

export default function Groth16PipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Pipeline overview always visible */}
          {[
            { label: 'R1CS', color: C.r, x: 10 },
            { label: 'QAP', color: C.q, x: 105 },
            { label: 'Setup', color: C.s, x: 200 },
            { label: 'Prove', color: C.p, x: 295 },
            { label: 'Verify', color: C.v, x: 390 },
          ].map((s, i) => (
            <g key={i}>
              <motion.g animate={{ opacity: step === i ? 1 : 0.3 }} transition={sp}>
                <rect x={s.x} y={8} width={80} height={28} rx={8}
                  fill={step === i ? `${s.color}20` : 'var(--card)'}
                  stroke={s.color} strokeWidth={step === i ? 1.5 : 0.5} />
                <text x={s.x + 40} y={26} textAnchor="middle" fontSize={10}
                  fontWeight={step === i ? 700 : 400} fill={s.color}>{s.label}</text>
              </motion.g>
              {i < 4 && <Arrow x1={s.x + 80} y1={22} x2={s.x + 95} y2={22} color="var(--border)" />}
            </g>
          ))}

          {/* Step details below */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              {/* Circuit to gates */}
              <ModuleBox x={20} y={50} w={120} h={36} label="Computation" sub="x^3 + x + 5 = y" color={C.r} />
              <Arrow x1={140} y1={68} x2={170} y2={68} color={C.r} />
              <ActionBox x={170} y={50} w={90} h={36} label="Flatten" sub="mul gates" color={C.r} />
              <Arrow x1={260} y1={68} x2={290} y2={68} color={C.r} />

              {/* Three matrices */}
              {['A','B','C'].map((m, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                  <ModuleBox x={290 + i * 60} y={50} w={50} h={36} label={m} color={C.r} />
                </motion.g>
              ))}

              {/* Gate examples */}
              {[
                { label: 't1 = x * x', y: 100 },
                { label: 't2 = t1 * x', y: 128 },
                { label: 'y = t2 + x + 5', y: 156 },
              ].map((g, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.08 }}>
                  <rect x={60} y={g.y} width={140} height={22} rx={6}
                    fill={`${C.r}08`} stroke={C.r} strokeWidth={0.5} />
                  <text x={130} y={g.y + 15} textAnchor="middle" fontSize={9} fill={C.r}>{g.label}</text>
                  <text x={220} y={g.y + 15} fontSize={8} fill="var(--muted-foreground)">constraint {i + 1}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              {/* IFFT */}
              {['A cols','B cols','C cols'].map((label, i) => (
                <DataBox key={i} x={20} y={50 + i * 36} w={80} h={26} label={label} color={C.r} />
              ))}
              <ActionBox x={140} y={66} w={80} h={38} label="IFFT" sub="interpolate" color={C.q} />
              {[0,1,2].map(i => (
                <Arrow key={i} x1={100} y1={63 + i * 36} x2={140} y2={85} color={C.q} />
              ))}

              {/* Polynomials */}
              {['A(x)','B(x)','C(x)'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                  <DataBox x={260} y={50 + i * 36} w={70} h={26} label={label} color={C.q} />
                </motion.g>
              ))}
              {[0,1,2].map(i => (
                <Arrow key={i} x1={220} y1={85} x2={260} y2={63 + i * 36} color={C.q} />
              ))}

              {/* QAP equation */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={350} y={66} width={130} height={38} rx={8}
                  fill={`${C.q}08`} stroke={C.q} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={415} y={82} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.q}>A*B - C = h*t</text>
                <text x={415} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">t(x) = x^n - 1</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              {/* MPC ceremony */}
              {['P1','P2','...','Pn'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <circle cx={60 + i * 70} cy={72} r={16} fill={`${C.s}12`} stroke={C.s} strokeWidth={0.8} />
                  <text x={60 + i * 70} y={76} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.s}>{label}</text>
                  {i < 3 && <Arrow x1={76 + i * 70} y1={72} x2={114 + i * 70} y2={72} color={C.s} />}
                </motion.g>
              ))}

              {/* Output PK / VK */}
              <Arrow x1={295} y1={72} x2={330} y2={60} color={C.s} />
              <Arrow x1={295} y1={72} x2={330} y2={100} color={C.s} />

              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <ModuleBox x={330} y={42} w={80} h={32} label="PK" sub="prover" color={C.s} />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <ModuleBox x={330} y={84} w={80} h={32} label="VK" sub="verifier" color={C.q} />
              </motion.g>

              <text x={200} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                1-of-N trust model
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              {/* Inputs */}
              <DataBox x={10} y={52} w={70} h={26} label="PK" color={C.s} />
              <DataBox x={10} y={88} w={70} h={26} label="witness" color={C.r} />

              <Arrow x1={80} y1={65} x2={120} y2={75} color={C.p} />
              <Arrow x1={80} y1={101} x2={120} y2={85} color={C.p} />

              {/* MSM */}
              <ActionBox x={120} y={60} w={100} h={40} label="3x MSM" sub="Pippenger" color={C.p} />
              <Arrow x1={220} y1={80} x2={260} y2={80} color={C.p} />

              {/* Proof output */}
              {['A','B','C'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
                  <rect x={260 + i * 70} y={60} width={55} height={40} rx={8}
                    fill={`${C.p}12`} stroke={C.p} strokeWidth={1} />
                  <text x={287 + i * 70} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.p}>{label}</text>
                </motion.g>
              ))}

              {/* Size label */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <text x={310} y={118} fontSize={9} fontWeight={600} fill={C.p}>= 256 bytes</text>
                <text x={310} y={132} fontSize={8} fill="var(--muted-foreground)">G1 + G2 + G1</text>
              </motion.g>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              {/* Inputs */}
              <DataBox x={10} y={52} w={70} h={26} label="VK" color={C.q} />
              <DataBox x={10} y={88} w={70} h={26} label="Proof" color={C.p} />
              <DataBox x={10} y={124} w={70} h={26} label="pub in" color={C.s} />

              {/* Pairing */}
              <Arrow x1={80} y1={65} x2={130} y2={85} color={C.v} />
              <Arrow x1={80} y1={101} x2={130} y2={90} color={C.v} />
              <Arrow x1={80} y1={137} x2={130} y2={95} color={C.v} />

              <ActionBox x={130} y={70} w={110} h={44} label="3 pairings" sub="e(A,B) == e*e*e" color={C.v} />

              {/* Result */}
              <Arrow x1={240} y1={92} x2={280} y2={92} color={C.v} />

              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={280} y={70} width={100} height={44} rx={10}
                  fill={`${C.q}15`} stroke={C.q} strokeWidth={1.5} />
                <text x={330} y={90} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.q}>Accept</text>
                <text x={330} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">O(1) verify</text>
              </motion.g>

              {/* Performance */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={400} y={62} width={80} height={26} rx={6}
                  fill={`${C.q}08`} stroke={C.q} strokeWidth={0.5} />
                <text x={440} y={79} textAnchor="middle" fontSize={9} fill={C.q}>~4ms</text>

                <rect x={400} y={96} width={80} height={26} rx={6}
                  fill={`${C.s}08`} stroke={C.s} strokeWidth={0.5} />
                <text x={440} y={113} textAnchor="middle" fontSize={9} fill={C.s}>~280k gas</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
