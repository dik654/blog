import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { msm: '#6366f1', ntt: '#10b981', gpu: '#f59e0b' };
const STEPS = [
  { label: 'MSM GPU 병렬화: 버킷 분배' },
  { label: 'NTT GPU 병렬화: 스테이지 병렬' },
  { label: '파이프라인 전략' },
];

export default function GPUParallelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.msm}>
                MSM: SM별 버킷 그룹 분배
              </text>
              {[0, 1, 2, 3].map(sm => (
                <motion.g key={sm} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: sm * 0.1 }}>
                  <rect x={20 + sm * 110} y={28} width={100} height={70} rx={8}
                    fill={C.msm + '08'} stroke={C.msm} strokeWidth={1.5} />
                  <text x={70 + sm * 110} y={44} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={C.msm}>SM {sm}</text>
                  {[0, 1, 2].map(b => (
                    <rect key={b} x={28 + sm * 110} y={50 + b * 14} width={84} height={10} rx={3}
                      fill={C.gpu + '15'} stroke={C.gpu} strokeWidth={0.8} />
                  ))}
                  {[0, 1, 2].map(b => (
                    <text key={`t${b}`} x={70 + sm * 110} y={58 + b * 14} textAnchor="middle"
                      fontSize={9} fill={C.gpu}>Bucket {sm * 3 + b}</text>
                  ))}
                </motion.g>
              ))}
              <text x={20} y={118} fontSize={9} fill="var(--muted-foreground)">
                각 SM이 독립 버킷 세트를 처리 → 동기화 최소화
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.ntt}>
                NTT: 스테이지별 나비 연산 병렬화
              </text>
              {[0, 1, 2, 3].map(stage => (
                <motion.g key={stage}>
                  <rect x={20 + stage * 110} y={28} width={100} height={50} rx={6}
                    fill={C.ntt + (stage < 2 ? '18' : '08')}
                    stroke={C.ntt} strokeWidth={stage < 2 ? 1.5 : 1} />
                  <text x={70 + stage * 110} y={48} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={C.ntt}>Stage {stage}</text>
                  <text x={70 + stage * 110} y={62} textAnchor="middle" fontSize={9}
                    fill={C.ntt} fillOpacity={0.5}>
                    {stage < 2 ? 'Shared Mem' : 'Global Mem'}
                  </text>
                  {stage < 3 && (
                    <motion.line x1={122 + stage * 110} y1={53}
                      x2={128 + stage * 110} y2={53}
                      stroke={C.ntt} strokeWidth={1.5}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: stage * 0.15 }} />
                  )}
                </motion.g>
              ))}
              <text x={20} y={100} fontSize={9} fill={C.ntt} fillOpacity={0.6}>
                초기: 공유 메모리(로컬) / 후반: 글로벌 메모리 교환 + __syncthreads
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.gpu}>
                CUDA Stream 파이프라인
              </text>
              {['Stream 0 (MSM)', 'Stream 1 (NTT)', 'Stream 2 (MSM)'].map((s, i) => (
                <motion.g key={i} initial={{ x: -10 }} animate={{ x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <text x={20} y={40 + i * 35} fontSize={9} fill="var(--muted-foreground)">{s}</text>
                  <motion.rect x={140 + i * 40} y={28 + i * 35} width={180 - i * 20} height={22} rx={4}
                    fill={[C.msm, C.ntt, C.msm][i] + '20'}
                    stroke={[C.msm, C.ntt, C.msm][i]} strokeWidth={1.5}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    style={{ transformOrigin: `${140 + i * 40}px ${39 + i * 35}px` }}
                    transition={{ duration: 0.5, delay: i * 0.15 }} />
                </motion.g>
              ))}
              <text x={20} y={140} fontSize={9} fill="var(--muted-foreground)">
                오버랩 실행으로 GPU 유휴 시간 최소화
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
