import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
const STEPS = [
  { label: '1단계: 스칼라 윈도우 분할' },
  { label: '2단계: 버킷 누적' },
  { label: '3단계: 버킷 축소 (삼각 합산)' },
  { label: '4단계: 윈도우 조합' },
];
const B3 = [0, 1, 2];

export default function PippengerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={18} fontSize={9} fontWeight={600} fill={C[0]}>
                s = [w0 | w1 | w2 | ... | wk] (w-bit windows)
              </text>
              {Array.from({ length: 6 }, (_, i) => (
                <motion.g key={i} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}>
                  <rect x={20 + i * 60} y={30} width={52} height={22} rx={4}
                    fill={C[0] + '15'} stroke={C[0]} strokeWidth={1.5} />
                  <text x={46 + i * 60} y={44} textAnchor="middle" fontSize={9} fill={C[0]}>
                    s{i} → w-bit
                  </text>
                  <motion.line x1={46 + i * 60} y1={54} x2={46 + (i % 3) * 110 + 30} y2={80}
                    stroke={C[0]} strokeWidth={1} strokeOpacity={0.3}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2 + i * 0.04 }} />
                </motion.g>
              ))}
              {B3.map(i => (
                <g key={`bg${i}`}>
                  <rect x={20 + i * 110} y={82} width={90} height={20} rx={4}
                    fill={C[0] + '08'} stroke={C[0]} strokeWidth={1} strokeOpacity={0.4} />
                  <text x={65 + i * 110} y={95} textAnchor="middle" fontSize={9}
                    fill={C[0]} fillOpacity={0.5}>Bucket Group {i}</text>
                </g>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2, 3].map(i => (
                <motion.g key={i} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  style={{ transformOrigin: `${75 + i * 100}px 50px` }} transition={{ delay: i * 0.1 }}>
                  <rect x={25 + i * 100} y={20} width={100} height={55} rx={8} fill={C[1] + '12'} stroke={C[1]} strokeWidth={1.5} />
                  <text x={75 + i * 100} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={C[1]}>Bucket {i}</text>
                  <text x={75 + i * 100} y={58} textAnchor="middle" fontSize={9} fill={C[1]} fillOpacity={0.5}>P+P+P...</text>
                </motion.g>
              ))}
              <text x={20} y={100} fontSize={9} fill={C[1]} fillOpacity={0.5}>
                2^w 버킷에 점 누적 (타원곡선 점 덧셈, 병렬)
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {B3.map(i => (
                <g key={i}>
                  <rect x={20 + i * 130} y={15} width={110} height={28} rx={6}
                    fill={C[2] + '12'} stroke={C[2]} strokeWidth={1} />
                  <text x={75 + i * 130} y={33} textAnchor="middle" fontSize={9} fill={C[2]}>
                    Sum = {3 - i}*B[{3 - i}] + ...</text>
                </g>
              ))}
              <rect x={140} y={70} width={120} height={28} rx={6} fill={C[2] + '20'} stroke={C[2]} strokeWidth={1.5} />
              <text x={200} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill={C[2]}>Window Sum</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {B3.map(i => (
                <motion.g key={i} initial={{ x: -10 }} animate={{ x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <rect x={20 + i * 130} y={20} width={110} height={26} rx={6}
                    fill={C[3] + '10'} stroke={C[3]} strokeWidth={1} />
                  <text x={75 + i * 130} y={37} textAnchor="middle" fontSize={9}
                    fill={C[3]}>W{i} * 2^({i}w)</text>
                </motion.g>
              ))}
              <motion.rect x={120} y={75} width={160} height={34} rx={8} fill={C[3] + '20'}
                stroke={C[3]} strokeWidth={1.5} initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ transformOrigin: '200px 92px' }} transition={{ delay: 0.3 }} />
              <motion.text x={200} y={96} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={C[3]} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}>MSM Result</motion.text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
