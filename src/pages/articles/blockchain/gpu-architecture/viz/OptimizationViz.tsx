import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { good: '#10b981', bad: '#ef4444', info: '#6366f1' };
const STEPS = [
  { label: '메모리 코어레싱(Coalescing)', body: '인접 스레드가 연속 메모리를 접근하면 하나의 트랜잭션으로 병합됩니다. 비연속 접근은 여러 트랜잭션으로 분리.' },
  { label: '뱅크 충돌(Bank Conflict)', body: '공유 메모리는 32개 뱅크로 구성. 같은 뱅크에 동시 접근하면 직렬화됩니다. 접근 패턴 설계가 핵심.' },
  { label: '커널 퓨전(Kernel Fusion)', body: '여러 커널을 하나로 합쳐 글로벌 메모리 왕복을 줄입니다. ZK 증명에서 MSM+NTT 파이프라이닝에 활용.' },
];

export default function OptimizationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={16} fontSize={10} fontWeight={600} fill={C.info}>Coalesced Access</text>
              {Array.from({ length: 8 }, (_, i) => (
                <motion.g key={i} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}>
                  <rect x={20 + i * 28} y={28} width={24} height={16} rx={3}
                    fill={C.info + '18'} stroke={C.info} strokeWidth={1} />
                  <text x={32 + i * 28} y={39} textAnchor="middle" fontSize={10} fill={C.info}>T{i}</text>
                  <motion.line x1={32 + i * 28} y1={46} x2={32 + i * 28} y2={60}
                    stroke={C.good} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3 + i * 0.03 }} />
                  <rect x={20 + i * 28} y={62} width={24} height={14} rx={2}
                    fill={C.good + '15'} stroke={C.good} strokeWidth={1} />
                  <text x={32 + i * 28} y={72} textAnchor="middle" fontSize={10} fill={C.good}>A[{i}]</text>
                </motion.g>
              ))}
              <text x={20} y={96} fontSize={10} fill={C.good}>1회 트랜잭션으로 병합 (128B)</text>
              <text x={20} y={116} fontSize={10} fill={C.bad}>Strided: T0→A[0], T1→A[4]... → 별도 트랜잭션</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={16} fontSize={10} fontWeight={600} fill={C.info}>32 Shared Memory Banks</text>
              {Array.from({ length: 16 }, (_, i) => (
                <motion.rect key={i} x={20 + i * 24} y={26} width={20} height={40} rx={3}
                  fill={i % 4 === 0 ? C.bad + '20' : C.good + '10'}
                  stroke={i % 4 === 0 ? C.bad : C.good}
                  strokeWidth={i % 4 === 0 ? 1.5 : 0.8}
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  style={{ transformOrigin: `${30 + i * 24}px 66px` }}
                  transition={{ delay: i * 0.03 }} />
              ))}
              {Array.from({ length: 16 }, (_, i) => (
                <text key={`b${i}`} x={30 + i * 24} y={50} textAnchor="middle" fontSize={10}
                  fill={i % 4 === 0 ? C.bad : C.good}>B{i}</text>
              ))}
              <text x={20} y={86} fontSize={10} fill={C.bad}>빨간 뱅크: 4-way 충돌 → 직렬화</text>
              <text x={20} y={100} fontSize={10} fill={C.good}>초록 뱅크: 충돌 없음 → 동시 접근</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['Kernel A', 'Kernel B', 'Kernel C'].map((k, i) => (
                <motion.g key={i} initial={{ x: -15 }} animate={{ x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={15 + i * 36} width={80} height={26} rx={5}
                    fill={C.bad + '12'} stroke={C.bad} strokeWidth={1} />
                  <text x={60} y={32 + i * 36} textAnchor="middle" fontSize={10} fill={C.bad}>{k}</text>
                </motion.g>
              ))}
              <text x={110} y={50} fontSize={10} fill={C.bad}>Global R/W x 3</text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <text x={220} y={16} fontSize={10} fontWeight={600} fill={C.good}>Fused Kernel</text>
                <rect x={220} y={22} width={120} height={80} rx={8}
                  fill={C.good + '12'} stroke={C.good} strokeWidth={1.5} />
                <text x={280} y={50} textAnchor="middle" fontSize={10} fill={C.good}>A + B + C</text>
                <text x={280} y={68} textAnchor="middle" fontSize={10} fill={C.good} fillOpacity={0.6}>
                  Global R/W x 1
                </text>
                <text x={280} y={85} textAnchor="middle" fontSize={10} fill={C.good} fillOpacity={0.6}>
                  레지스터로 중간값 유지
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
