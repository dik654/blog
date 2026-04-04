import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '1단계: 버킷 분류', body: '각 스레드가 스칼라를 w-bit 윈도우로 분할하여 2^w 버킷에 분류. 완전 병렬 처리.' },
  { label: '2단계: 버킷 누적', body: '각 버킷 내 타원곡선 점을 누적 합산. Pippenger: 2^w 버킷 x (log n / w) 윈도우.' },
  { label: '3단계: 윈도우 축소', body: '버킷 합들을 삼각 합산으로 윈도우별 값으로 변환. 병렬 prefix-sum 패턴.' },
  { label: '4단계: 결과 조합', body: '윈도우별 결과를 배수로 스케일해 최종 MSM 결과 산출. O(n/log n) 복잡도.' },
];
const C = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
const B3 = [0, 1, 2]; // reused 3-bucket array

export default function MSMStepsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <motion.g key={i} initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}>
                  <rect x={30 + i * 58} y={15} width={48} height={22} rx={5} fill={C[0] + '15'} stroke={C[0]} strokeWidth={1.5} />
                  <text x={54 + i * 58} y={29} textAnchor="middle" fontSize={10} fill={C[0]}>s[{i}]</text>
                  <motion.line x1={54 + i * 58} y1={39} x2={54 + (i % 3) * 110 + 30} y2={72} stroke={C[0]} strokeWidth={1} strokeOpacity={0.4}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + i * 0.04 }} />
                </motion.g>
              ))}
              {B3.map(i => (
                <rect key={i} x={20 + i * 110} y={74} width={90} height={22} rx={5} fill={C[0] + '10'} stroke={C[0]} strokeWidth={1} strokeOpacity={0.4} />
              ))}
              <text x={200} y={118} textAnchor="middle" fontSize={10} fill={C[0]} fillOpacity={0.5}>2^w 버킷에 스칼라 분류 (병렬)</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {B3.map(i => (
                <motion.g key={i} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  style={{ transformOrigin: `${80 + i * 120}px 55px` }} transition={{ delay: i * 0.12 }}>
                  <rect x={30 + i * 120} y={25} width={100} height={50} rx={8} fill={C[1] + '15'} stroke={C[1]} strokeWidth={1.5} />
                  <text x={80 + i * 120} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={C[1]}>Bucket {i}</text>
                  <text x={80 + i * 120} y={63} textAnchor="middle" fontSize={10} fill={C[1]} fillOpacity={0.5}>P1+P2+...</text>
                </motion.g>
              ))}
              <text x={200} y={100} textAnchor="middle" fontSize={10} fill={C[1]} fillOpacity={0.5}>각 버킷 내 타원곡선 점 누적 합산</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {B3.map(i => (
                <motion.g key={i}>
                  <rect x={30 + i * 120} y={15} width={100} height={28} rx={6} fill={C[2] + '10'} stroke={C[2]} strokeWidth={1} strokeOpacity={0.4} />
                  <text x={80 + i * 120} y={33} textAnchor="middle" fontSize={10} fill={C[2]}>Win {i}</text>
                  <motion.line x1={80 + i * 120} y1={45} x2={200} y2={80} stroke={C[2]} strokeWidth={1.5} strokeOpacity={0.4}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.12 }} />
                </motion.g>
              ))}
              <rect x={150} y={82} width={100} height={28} rx={6} fill={C[2] + '20'} stroke={C[2]} strokeWidth={1.5} />
              <text x={200} y={100} textAnchor="middle" fontSize={10} fontWeight={600} fill={C[2]}>삼각 합산</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {B3.map(i => (
                <motion.g key={i} initial={{ x: -10 }} animate={{ x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={30 + i * 120} y={20} width={100} height={26} rx={6} fill={C[3] + '10'} stroke={C[3]} strokeWidth={1} />
                  <text x={80 + i * 120} y={37} textAnchor="middle" fontSize={10} fill={C[3]}>W{i} x 2^{i}w</text>
                </motion.g>
              ))}
              <motion.rect x={120} y={72} width={160} height={34} rx={8} fill={C[3] + '20'} stroke={C[3]} strokeWidth={1.5}
                initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: '200px 89px' }} transition={{ delay: 0.3 }} />
              <motion.text x={200} y={93} textAnchor="middle" fontSize={10} fontWeight={600} fill={C[3]}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>MSM Result</motion.text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
