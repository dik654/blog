import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { w: '#6366f1', msm: '#10b981', bl: '#8b5cf6', out: '#ec4899', b: '#f59e0b' };

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
  { label: 'Witness 할당', body: '공개 입력 + 비밀 witness를 하나의 벡터 w로 결합.' },
  { label: 'A 원소 계산 (G1 MSM)', body: 'alpha + witness 가중합 + 블라인딩. Pippenger MSM O(n/log n).' },
  { label: 'B 원소 계산 (G2+G1 병렬)', body: 'G2와 G1 두 그룹에서 동시에 MSM. rayon::join 병렬 실행.' },
  { label: 'C 원소 계산 (3개 MSM 합산)', body: 'private LC + 몫 h(x) + 블라인딩 항 세 부분의 합.' },
  { label: 'Proof 출력 = (A, B, C)', body: 'A(G1) 64B + B(G2) 128B + C(G1) 64B = 256B. 회로 크기 무관.' },
];

export default function ProveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Witness vector as cells */}
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.w}>w = witness vector</text>
              {['1','x_pub','...','w_priv','...'].map((v, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <rect x={20 + i * 88} y={30} width={80} height={34} rx={6}
                    fill={i < 2 ? `${C.w}15` : i === 2 ? 'var(--card)' : `${C.bl}15`}
                    stroke={i < 2 ? C.w : i === 2 ? 'var(--border)' : C.bl} strokeWidth={0.8} />
                  <text x={60 + i * 88} y={52} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={i < 2 ? C.w : i === 2 ? 'var(--muted-foreground)' : C.bl}>{v}</text>
                </motion.g>
              ))}
              {/* Labels */}
              <text x={108} y={80} textAnchor="middle" fontSize={8} fill={C.w}>public</text>
              <line x1={20} y1={72} x2={196} y2={72} stroke={C.w} strokeWidth={0.8} />
              <text x={372} y={80} textAnchor="middle" fontSize={8} fill={C.bl}>private</text>
              <line x1={284} y1={72} x2={460} y2={72} stroke={C.bl} strokeWidth={0.8} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Three inputs */}
              <DataBox x={10} y={10} w={80} h={28} label="[alpha]1" color={C.msm} />
              <DataBox x={10} y={50} w={80} h={28} label="w" sub="witness" color={C.w} />
              <DataBox x={10} y={90} w={80} h={28} label="r * [delta]1" sub="blind" color={C.bl} />

              {/* MSM action */}
              <ActionBox x={130} y={30} w={100} h={52} label="MSM" sub="Pippenger" color={C.msm} />
              <Arrow x1={90} y1={24} x2={130} y2={46} color={C.msm} />
              <Arrow x1={90} y1={64} x2={130} y2={56} color={C.msm} />

              {/* Plus signs */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <text x={110} y={110} fontSize={12} fontWeight={700} fill={C.bl}>+</text>
              </motion.g>

              {/* Output A */}
              <Arrow x1={230} y1={56} x2={280} y2={56} color={C.msm} />
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ModuleBox x={280} y={36} w={100} h={42} label="A" sub="G1 point" color={C.msm} />
              </motion.g>

              {/* Formula summary */}
              <text x={400} y={52} fontSize={9} fill={C.msm}>alpha</text>
              <text x={400} y={64} fontSize={9} fill={C.msm}>+ SUM w_j * a_q[j]</text>
              <text x={400} y={76} fontSize={9} fill={C.bl}>+ r * delta</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Parallel MSM */}
              <text x={200} y={16} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">rayon::join (parallel)</text>

              {/* G2 path */}
              <DataBox x={10} y={30} w={70} h={28} label="w" sub="witness" color={C.w} />
              <Arrow x1={80} y1={44} x2={120} y2={44} color={C.b} />
              <ActionBox x={120} y={28} w={100} h={36} label="MSM G2" sub="b_query_g2" color={C.b} />
              <Arrow x1={220} y1={46} x2={260} y2={46} color={C.b} />
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <ModuleBox x={260} y={28} w={90} h={36} label="B (G2)" sub="128 bytes" color={C.b} />
              </motion.g>

              {/* G1 path */}
              <DataBox x={10} y={90} w={70} h={28} label="w" sub="witness" color={C.w} />
              <Arrow x1={80} y1={104} x2={120} y2={104} color={C.b} />
              <ActionBox x={120} y={88} w={100} h={36} label="MSM G1" sub="b_query_g1" color={C.b} />
              <Arrow x1={220} y1={106} x2={260} y2={106} color={C.b} />
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ModuleBox x={260} y={88} w={90} h={36} label="B (G1)" sub="for C blind" color={C.b} />
              </motion.g>

              {/* Parallel indicator */}
              <motion.line x1={115} y1={26} x2={115} y2={128} stroke={C.b} strokeWidth={0.8}
                strokeDasharray="4 3" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp} />

              {/* Blinding */}
              <text x={380} y={60} fontSize={8} fill={C.bl}>+ s * [delta]2</text>
              <text x={380} y={118} fontSize={8} fill={C.bl}>+ s * [delta]1</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Three MSM sources */}
              {[
                { label: 'private LC', sub: 'w_priv * l_q', color: C.bl, y: 10 },
                { label: 'quotient h', sub: 'h_i * h_q', color: C.msm, y: 56 },
                { label: 'blinding', sub: 's*A + r*B1 - rs*d', color: C.out, y: 102 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={10} y={item.y} width={130} height={36} rx={6}
                    fill={`${item.color}10`} stroke={item.color} strokeWidth={0.8} />
                  <text x={75} y={item.y + 16} textAnchor="middle" fontSize={9} fontWeight={600} fill={item.color}>{item.label}</text>
                  <text x={75} y={item.y + 29} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{item.sub}</text>
                  <Arrow x1={140} y1={item.y + 18} x2={180} y2={74} color={item.color} />
                </motion.g>
              ))}

              {/* Sum */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                <circle cx={195} cy={74} r={16} fill={`${C.out}15`} stroke={C.out} strokeWidth={1} />
                <text x={195} y={78} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.out}>+</text>
              </motion.g>

              <Arrow x1={211} y1={74} x2={260} y2={74} color={C.out} />

              {/* Output C */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <ModuleBox x={260} y={52} w={100} h={44} label="C" sub="G1 point" color={C.out} />
              </motion.g>

              <text x={400} y={70} fontSize={9} fill="var(--muted-foreground)">3 MSMs merged</text>
              <text x={400} y={84} fontSize={8} fill="var(--muted-foreground)">dominant cost</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Three proof elements */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={30} y={20} width={110} height={60} rx={10}
                  fill={`${C.msm}12`} stroke={C.msm} strokeWidth={1.2} />
                <text x={85} y={46} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.msm}>A</text>
                <text x={85} y={64} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">G1: 64B</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <rect x={170} y={20} width={150} height={60} rx={10}
                  fill={`${C.b}12`} stroke={C.b} strokeWidth={1.2} />
                <text x={245} y={46} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.b}>B</text>
                <text x={245} y={64} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">G2: 128B</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={350} y={20} width={110} height={60} rx={10}
                  fill={`${C.out}12`} stroke={C.out} strokeWidth={1.2} />
                <text x={405} y={46} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.out}>C</text>
                <text x={405} y={64} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">G1: 64B</text>
              </motion.g>

              {/* Total bar */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <rect x={30} y={100} width={430} height={22} rx={4}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <rect x={30} y={100} width={110} height={22} fill={`${C.msm}18`} />
                <rect x={140} y={100} width={150} height={22} fill={`${C.b}18`} />
                <rect x={290} y={100} width={110} height={22} fill={`${C.out}18`} />
                <text x={245} y={115} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                  Total: 256 bytes (constant)
                </text>
              </motion.g>

              <text x={245} y={145} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                circuit size independent -- same for 10 or 10^6 gates
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
