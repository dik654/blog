import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { msm: '#6366f1', ntt: '#10b981', zk: '#f59e0b' };
const STEPS = [
  { label: 'MSM: 다중 스칼라 곱셈' },
  { label: 'NTT: 수론적 변환' },
  { label: 'ZK 증명에서의 핵심 역할' },
];

export default function MSMOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={20} fontSize={9} fontWeight={600} fill={C.msm}>
                MSM = s0*G0 + s1*G1 + ... + sn*Gn
              </text>
              {[0, 1, 2, 3, 4].map(i => (
                <motion.g key={i} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}>
                  <rect x={20 + i * 70} y={35} width={30} height={20} rx={4}
                    fill={C.msm + '18'} stroke={C.msm} strokeWidth={1.5} />
                  <text x={35 + i * 70} y={48} textAnchor="middle" fontSize={9} fill={C.msm}>s{i}</text>
                  <text x={55 + i * 70} y={48} fontSize={9} fill={C.msm}>*</text>
                  <circle cx={68 + i * 70} cy={45} r={9} fill={C.msm + '10'} stroke={C.msm} strokeWidth={1} />
                  <text x={68 + i * 70} y={48} textAnchor="middle" fontSize={9} fill={C.msm}>G{i}</text>
                </motion.g>
              ))}
              <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ transformOrigin: '200px 95px' }} transition={{ delay: 0.5 }}>
                <rect x={140} y={80} width={120} height={30} rx={8}
                  fill={C.msm + '20'} stroke={C.msm} strokeWidth={1.5} />
                <text x={200} y={99} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.msm}>
                  Result Point
                </text>
              </motion.g>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={20} fontSize={9} fontWeight={600} fill={C.ntt}>
                NTT: 다항식 계수 → 점 평가 (O(n log n))
              </text>
              {['a0', 'a1', 'a2', 'a3'].map((a, i) => (
                <motion.g key={i} initial={{ x: -10 }} animate={{ x: 0 }} transition={{ delay: i * 0.06 }}>
                  <rect x={20} y={35 + i * 25} width={50} height={18} rx={4}
                    fill={C.ntt + '15'} stroke={C.ntt} strokeWidth={1} />
                  <text x={45} y={47 + i * 25} textAnchor="middle" fontSize={9} fill={C.ntt}>{a}</text>
                  <motion.line x1={72} y1={44 + i * 25} x2={160} y2={44 + i * 25}
                    stroke={C.ntt} strokeWidth={1} strokeOpacity={0.4}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }} />
                </motion.g>
              ))}
              <rect x={162} y={35} width={70} height={93} rx={8}
                fill={C.ntt + '10'} stroke={C.ntt} strokeWidth={1.5} />
              <text x={197} y={75} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ntt}>NTT</text>
              <text x={197} y={88} textAnchor="middle" fontSize={9} fill={C.ntt}>Butterfly</text>
              {['f(w0)', 'f(w1)', 'f(w2)', 'f(w3)'].map((f, i) => (
                <motion.g key={i} initial={{ x: 10 }} animate={{ x: 0 }} transition={{ delay: 0.4 + i * 0.06 }}>
                  <rect x={260} y={35 + i * 25} width={60} height={18} rx={4}
                    fill={C.ntt + '20'} stroke={C.ntt} strokeWidth={1.5} />
                  <text x={290} y={47 + i * 25} textAnchor="middle" fontSize={9} fill={C.ntt}>{f}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'MSM', pct: 45, c: C.msm },
                { label: 'NTT', pct: 30, c: C.ntt },
                { label: '기타', pct: 25, c: C.zk },
              ].map((item, i) => (
                <motion.g key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  style={{ transformOrigin: '40px 0' }} transition={{ delay: i * 0.15 }}>
                  <rect x={40} y={20 + i * 35} width={300} height={24} rx={4}
                    fill="none" />
                  <motion.rect x={40} y={20 + i * 35} width={0} height={24} rx={4}
                    fill={item.c + '25'} stroke={item.c} strokeWidth={1}
                    animate={{ width: item.pct * 3 }} transition={{ duration: 0.6, delay: i * 0.15 }} />
                  <text x={350} y={35 + i * 35} fontSize={9} fontWeight={600} fill={item.c}>
                    {item.label} ({item.pct}%)
                  </text>
                </motion.g>
              ))}
              <text x={40} y={135} fontSize={9} fill="var(--muted-foreground)">
                ZK 증명 생성 시간 분포 (Groth16 기준)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
