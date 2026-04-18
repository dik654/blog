import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { w: '#6366f1', a: '#10b981', b: '#f59e0b', c: '#ec4899', p: '#8b5cf6' };

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
  { label: 'Witness 할당 (SynthesisMode::Prove)', body: '회로에 구체적 값을 대입. full_assignment 벡터에 상수 + 공개 + 비밀 순으로 채움.' },
  { label: 'A 계산 -- G1 MSM', body: 'alpha + witness 가중합 + r 블라인딩. Pippenger window=15로 O(n/log n).' },
  { label: 'B 계산 -- G2+G1 병렬 MSM', body: 'rayon::join으로 G2, G1 두 그룹 동시 계산. G1 결과는 C 블라인딩에 재사용.' },
  { label: 'C 계산 -- 3개 MSM 합산', body: 'private LC + h(x) quotient + s*A + r*B1 - rs*delta 블라인딩 항.' },
  { label: 'Proof = (A, B2, C)', body: 'G1 + G2 + G1 = 256B 상수 크기. 10^6 게이트 회로도 동일.' },
];

export default function ProvingDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={140} y={4} w={200} h={32} label="SynthesisMode::Prove" color={C.w} />

              {/* Example: x^2 = y, x=3 */}
              <text x={20} y={56} fontSize={9} fill="var(--muted-foreground)">example: x*x = y, x=3</text>

              {/* Witness slots */}
              {[
                { label: '1', sub: 'const', val: '1' },
                { label: 'x', sub: 'public', val: '3' },
                { label: 'y', sub: 'private', val: '9' },
              ].map((slot, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={20 + i * 150} y={68} width={130} height={48} rx={8}
                    fill={`${C.w}10`} stroke={C.w} strokeWidth={0.8} />
                  <text x={85 + i * 150} y={86} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.w}>
                    w[{i}] = {slot.val}
                  </text>
                  <text x={85 + i * 150} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                    {slot.sub}: {slot.label}
                  </text>
                </motion.g>
              ))}

              {/* Result */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <DataBox x={140} y={130} w={200} h={30} label="full_assignment = [1, 3, 9]" color={C.w} />
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Inputs */}
              <DataBox x={10} y={10} w={80} h={26} label="[alpha]1" color={C.a} />
              <DataBox x={10} y={46} w={80} h={26} label="w * a_q" sub="MSM" color={C.a} />
              <DataBox x={10} y={82} w={80} h={26} label="r * [delta]1" sub="blind" color={C.p} />

              {/* Arrows to sum */}
              <Arrow x1={90} y1={23} x2={130} y2={48} color={C.a} />
              <Arrow x1={90} y1={59} x2={130} y2={55} color={C.a} />
              <Arrow x1={90} y1={95} x2={130} y2={62} color={C.p} />

              {/* Sum circle */}
              <circle cx={145} cy={56} r={14} fill={`${C.a}15`} stroke={C.a} strokeWidth={1} />
              <text x={145} y={60} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.a}>+</text>

              <Arrow x1={159} y1={56} x2={200} y2={56} color={C.a} />

              {/* Output A */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ModuleBox x={200} y={34} w={90} h={44} label="A" sub="G1 point" color={C.a} />
              </motion.g>

              {/* Pippenger detail */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <StatusBox x={330} y={20} w={140} h={50} label="Pippenger MSM" sub="window=15, O(n/log n)" color={C.a} progress={0.85} />
              </motion.g>

              {/* Concrete example */}
              <text x={20} y={130} fontSize={8} fill="var(--muted-foreground)">
                A = alpha*G1 + 1*aq[0] + 3*aq[1] + 9*aq[2] + r*delta*G1
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Parallel split */}
              <text x={245} y={16} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
                rayon::join -- parallel
              </text>
              <line x1={245} y1={20} x2={245} y2={145} stroke="var(--border)" strokeWidth={1} strokeDasharray="4 3" />

              {/* G2 path */}
              <DataBox x={20} y={30} w={70} h={26} label="w" color={C.w} />
              <Arrow x1={90} y1={43} x2={110} y2={43} color={C.b} />
              <ActionBox x={110} y={28} w={100} h={34} label="MSM G2" sub="b_query_g2" color={C.b} />
              <text x={120} y={78} fontSize={8} fill={C.p}>+ s * [delta]2</text>

              {/* G1 path */}
              <DataBox x={270} y={30} w={70} h={26} label="w" color={C.w} />
              <Arrow x1={340} y1={43} x2={360} y2={43} color={C.b} />
              <ActionBox x={360} y={28} w={100} h={34} label="MSM G1" sub="b_query_g1" color={C.b} />
              <text x={370} y={78} fontSize={8} fill={C.p}>+ s * [delta]1</text>

              {/* Outputs */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ModuleBox x={70} y={96} w={110} h={40} label="B2 (G2)" sub="-> Proof.b" color={C.b} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <ModuleBox x={310} y={96} w={110} h={40} label="B1 (G1)" sub="-> C blind term" color={C.b} />
              </motion.g>

              <Arrow x1={160} y1={66} x2={125} y2={96} color={C.b} />
              <Arrow x1={410} y1={66} x2={365} y2={96} color={C.b} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Three MSM sources */}
              {[
                { label: 'private LC', sub: 'MSM(w_priv, l_q)', color: C.c, y: 10 },
                { label: 'quotient h(x)', sub: 'MSM(h_coeffs, h_q)', color: C.a, y: 54 },
                { label: 'blinding', sub: 's*A + r*B1 - rs*[d]1', color: C.p, y: 98 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={10} y={item.y} width={150} height={36} rx={6}
                    fill={`${item.color}10`} stroke={item.color} strokeWidth={0.8} />
                  <text x={85} y={item.y + 16} textAnchor="middle" fontSize={9} fontWeight={600} fill={item.color}>{item.label}</text>
                  <text x={85} y={item.y + 29} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{item.sub}</text>
                </motion.g>
              ))}

              {/* Merge arrows */}
              {[28, 72, 116].map((y, i) => (
                <Arrow key={i} x1={160} y1={y} x2={200} y2={72} color={C.c} />
              ))}

              {/* Sum */}
              <circle cx={215} cy={72} r={14} fill={`${C.c}15`} stroke={C.c} strokeWidth={1} />
              <text x={215} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.c}>+</text>

              <Arrow x1={229} y1={72} x2={270} y2={72} color={C.c} />

              {/* Output C */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <ModuleBox x={270} y={50} w={90} h={44} label="C" sub="G1 point" color={C.c} />
              </motion.g>

              {/* h(x) detail */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <rect x={380} y={50} width={100} height={44} rx={6}
                  fill={`${C.a}08`} stroke={C.a} strokeWidth={0.5} strokeDasharray="4 3" />
                <text x={430} y={68} textAnchor="middle" fontSize={8} fill={C.a}>h = (A*B - C) / Z</text>
                <text x={430} y={82} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">coset FFT pipeline</text>
              </motion.g>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={245} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.p}>Proof output</text>

              {/* Three elements with proportional sizes */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={30} y={30} width={100} height={55} rx={10}
                  fill={`${C.a}12`} stroke={C.a} strokeWidth={1.2} />
                <text x={80} y={54} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.a}>A</text>
                <text x={80} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">G1Affine</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <rect x={160} y={30} width={170} height={55} rx={10}
                  fill={`${C.b}12`} stroke={C.b} strokeWidth={1.2} />
                <text x={245} y={54} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.b}>B</text>
                <text x={245} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">G2Affine</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={360} y={30} width={100} height={55} rx={10}
                  fill={`${C.c}12`} stroke={C.c} strokeWidth={1.2} />
                <text x={410} y={54} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.c}>C</text>
                <text x={410} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">G1Affine</text>
              </motion.g>

              {/* Size bar */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <rect x={30} y={100} width={100} height={18} rx={0} fill={`${C.a}20`} />
                <text x={80} y={113} textAnchor="middle" fontSize={8} fill={C.a}>64B</text>
                <rect x={160} y={100} width={170} height={18} rx={0} fill={`${C.b}20`} />
                <text x={245} y={113} textAnchor="middle" fontSize={8} fill={C.b}>128B</text>
                <rect x={360} y={100} width={100} height={18} rx={0} fill={`${C.c}20`} />
                <text x={410} y={113} textAnchor="middle" fontSize={8} fill={C.c}>64B</text>
              </motion.g>

              <text x={245} y={140} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                Total: 256 bytes = O(1)
              </text>
              <text x={245} y={156} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                10^6 gates circuit produces same 256B proof
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
