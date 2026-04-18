import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { ic: '#f59e0b', lhs: '#6366f1', rhs: '#10b981', ok: '#10b981' };

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
  { label: 'IC 벡터 합산 -- 공개 입력 결합', body: 'ic[0] + s1*ic[1] + ... 으로 공개 입력을 하나의 G1 포인트로. 검증자의 유일한 O(l) 연산.' },
  { label: 'LHS: e(A, B) 페어링', body: 'proof의 A, B를 페어링하여 GT 원소 생성. miller loop + final exponentiation.' },
  { label: 'RHS: 3개 페어링 곱', body: 'e(alpha,beta) 캐시 + e(IC,gamma) + e(C,delta). 실제 페어링 2회만 실행.' },
  { label: 'LHS == RHS -> Accept', body: 'GT 원소(Fp12) 12좌표 비교. 약 4ms, 온체인 280k gas.' },
];

export default function VerifyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* IC vector elements */}
              <text x={20} y={16} fontSize={10} fontWeight={600} fill={C.ic}>IC vector (from VK)</text>
              {['ic[0]','ic[1]','ic[2]','...'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <DataBox x={10 + i * 80} y={26} w={70} h={28} label={label} color={C.ic} />
                </motion.g>
              ))}

              {/* Public inputs */}
              <text x={20} y={75} fontSize={9} fill="var(--muted-foreground)">public inputs:</text>
              {['s1','s2','...'].map((label, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.08 }}>
                  <rect x={90 + i * 70} y={64} width={50} height={22} rx={11}
                    fill={`${C.ic}12`} stroke={C.ic} strokeWidth={0.8} />
                  <text x={115 + i * 70} y={79} textAnchor="middle" fontSize={9} fill={C.ic}>{label}</text>
                </motion.g>
              ))}

              {/* MSM arrow */}
              <Arrow x1={200} y1={86} x2={200} y2={106} color={C.ic} />
              <ActionBox x={120} y={106} w={160} h={36} label="MSM (public inputs)" sub="O(l) -- only linear op" color={C.ic} />

              {/* Output IC_sum */}
              <Arrow x1={200} y1={142} x2={200} y2={160} color={C.ic} />
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <ModuleBox x={130} y={160} w={140} h={32} label="IC_sum" sub="G1 point" color={C.ic} />
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Proof elements */}
              <DataBox x={20} y={20} w={70} h={30} label="A" sub="G1" color={C.lhs} />
              <DataBox x={120} y={20} w={70} h={30} label="B" sub="G2" color={C.lhs} />

              {/* Pairing */}
              <Arrow x1={55} y1={50} x2={110} y2={80} color={C.lhs} />
              <Arrow x1={155} y1={50} x2={130} y2={80} color={C.lhs} />

              <ActionBox x={70} y={80} w={120} h={44} label="e(A, B)" sub="optimal ate pairing" color={C.lhs} />

              {/* Pipeline */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <Arrow x1={190} y1={102} x2={230} y2={102} color={C.lhs} />
                <rect x={230} y={86} width={100} height={32} rx={6}
                  fill={`${C.lhs}10`} stroke={C.lhs} strokeWidth={0.8} />
                <text x={280} y={100} textAnchor="middle" fontSize={9} fill={C.lhs}>miller loop</text>
                <text x={280} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">line functions</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
                <Arrow x1={330} y1={102} x2={360} y2={102} color={C.lhs} />
                <rect x={360} y={86} width={100} height={32} rx={6}
                  fill={`${C.lhs}10`} stroke={C.lhs} strokeWidth={0.8} />
                <text x={410} y={100} textAnchor="middle" fontSize={9} fill={C.lhs}>final exp</text>
                <text x={410} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">Fp12 → GT</text>
              </motion.g>

              {/* Output */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.6 }}>
                <Arrow x1={350} y1={118} x2={350} y2={140} color={C.lhs} />
                <ModuleBox x={280} y={140} w={140} h={34} label="LHS (GT)" sub="Fp12 element" color={C.lhs} />
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Three pairings */}
              {[
                { a: 'e(alpha, beta)', sub: 'cached in VK', y: 10, cached: true },
                { a: 'e(IC_sum, gamma)', sub: 'public input', y: 62, cached: false },
                { a: 'e(C, delta)', sub: 'private witness', y: 114, cached: false },
              ].map((p, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  <rect x={20} y={p.y} width={160} height={40} rx={8}
                    fill={p.cached ? `${C.rhs}08` : `${C.rhs}12`}
                    stroke={C.rhs} strokeWidth={p.cached ? 0.8 : 1.2}
                    strokeDasharray={p.cached ? '4 3' : 'none'} />
                  <text x={100} y={p.y + 18} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.rhs}>{p.a}</text>
                  <text x={100} y={p.y + 32} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{p.sub}</text>
                  {p.cached && (
                    <text x={190} y={p.y + 24} fontSize={8} fill={C.rhs}>cached</text>
                  )}
                </motion.g>
              ))}

              {/* Multiply arrows */}
              {[30, 82].map((y, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.1 }}>
                  <Arrow x1={180} y1={y + 10} x2={250} y2={82} color={C.rhs} />
                </motion.g>
              ))}
              <Arrow x1={180} y1={134} x2={250} y2={100} color={C.rhs} />

              {/* Multiply */}
              <circle cx={265} cy={92} r={14} fill={`${C.rhs}15`} stroke={C.rhs} strokeWidth={1} />
              <text x={265} y={96} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.rhs}>*</text>

              <Arrow x1={279} y1={92} x2={320} y2={92} color={C.rhs} />

              {/* Output */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.6 }}>
                <ModuleBox x={320} y={72} w={140} h={40} label="RHS (GT)" sub="Fp12 element" color={C.rhs} />
              </motion.g>

              {/* Note */}
              <text x={390} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                actual pairings: 2 (not 3)
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* LHS */}
              <ModuleBox x={40} y={20} w={130} h={44} label="LHS" sub="e(A, B)" color={C.lhs} />

              {/* RHS */}
              <ModuleBox x={310} y={20} w={130} h={44} label="RHS" sub="e(a,b)*e(IC,g)*e(C,d)" color={C.rhs} />

              {/* Comparison */}
              <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <Arrow x1={170} y1={42} x2={210} y2={42} color={C.ok} />
                <rect x={210} y={26} width={90} height={32} rx={16}
                  fill={`${C.ok}15`} stroke={C.ok} strokeWidth={1.2} />
                <text x={255} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>==?</text>
                <Arrow x1={300} y1={42} x2={310} y2={42} color={C.ok} />
              </motion.g>

              {/* Result */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={140} y={86} width={200} height={44} rx={10}
                  fill={`${C.ok}12`} stroke={C.ok} strokeWidth={1.5} />
                <text x={240} y={106} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ok}>Accept</text>
                <text x={240} y={122} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  Fp12 (12 coords) match
                </text>
              </motion.g>

              {/* Performance stats */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.65 }}>
                <StatusBox x={80} y={146} w={140} h={44} label="~4ms" sub="BN254 native" color={C.ok} progress={0.1} />
                <StatusBox x={260} y={146} w={140} h={44} label="~280k gas" sub="EVM precompile" color={C.ic} progress={0.3} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
