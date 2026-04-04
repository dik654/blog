import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { active: '#10b981', stall: '#ef4444', ready: '#f59e0b', sched: '#6366f1' };
const STEPS = [
  { label: '워프 스케줄링: 지연 은닉' },
  { label: '점유율(Occupancy)과 성능' },
  { label: '워프 다이버전스(Divergence)' },
];
const WARPS = ['Warp 0', 'Warp 1', 'Warp 2', 'Warp 3'];
const SLOTS = 8;

export default function WarpScheduleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={8} y={16} fontSize={10} fontWeight={600} fill={C.sched}>타임 슬롯 →</text>
              {WARPS.map((w, wi) => (
                <g key={wi}>
                  <text x={8} y={38 + wi * 28} fontSize={10} fill="var(--muted-foreground)">{w}</text>
                  {Array.from({ length: SLOTS }, (_, si) => {
                    const active = (si + wi) % 3 === 0;
                    return (
                      <motion.rect key={si} x={60 + si * 46} y={26 + wi * 28}
                        width={40} height={18} rx={3}
                        fill={active ? C.active + '25' : C.stall + '10'}
                        stroke={active ? C.active : C.stall}
                        strokeWidth={active ? 1.5 : 0.8}
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                        style={{ transformOrigin: `${60 + si * 46}px ${35 + wi * 28}px` }}
                        transition={{ delay: si * 0.04 + wi * 0.02 }} />
                    );
                  })}
                </g>
              ))}
              <g transform="translate(60,140)">
                <rect width={10} height={8} rx={2} fill={C.active} opacity={0.6} />
                <text x={14} y={7} fontSize={10} fill="var(--muted-foreground)">실행</text>
                <rect x={50} width={10} height={8} rx={2} fill={C.stall} opacity={0.3} />
                <text x={64} y={7} fontSize={10} fill="var(--muted-foreground)">대기</text>
              </g>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[25, 50, 75, 100].map((pct, i) => (
                <motion.g key={i} initial={{ x: -10 }} animate={{ x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={15 + i * 32} width={200} height={22} rx={4}
                    fill="none" strokeWidth={0} />
                  <motion.rect x={30} y={15 + i * 32} width={0} height={22} rx={4}
                    fill={C.active + '30'} stroke={C.active} strokeWidth={1}
                    animate={{ width: pct * 2 }} transition={{ duration: 0.6, delay: i * 0.1 }} />
                  <text x={240} y={29 + i * 32} fontSize={10} fontWeight={600} fill={C.active}>{pct}%</text>
                  <text x={260} y={29 + i * 32} fontSize={10} fill="var(--muted-foreground)">
                    {['낮음', '보통', '양호', '최대'][i]}
                  </text>
                </motion.g>
              ))}
              <text x={30} y={150} fontSize={10} fill="var(--muted-foreground)">
                Occupancy = Active Warps / Max Warps per SM
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={30} y={20} fontSize={10} fontWeight={600} fill={C.sched}>Warp 내 32 스레드</text>
              {Array.from({ length: 32 }, (_, i) => {
                const diverged = i >= 16;
                return (
                  <motion.rect key={i} x={30 + (i % 16) * 24} y={30 + Math.floor(i / 16) * 40}
                    width={20} height={14} rx={2}
                    fill={diverged ? C.stall + '20' : C.active + '20'}
                    stroke={diverged ? C.stall : C.active} strokeWidth={1.5}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.015 }} />
                );
              })}
              <text x={30} y={102} fontSize={10} fill={C.active}>if 경로 (T0~T15): 1차 실행</text>
              <text x={30} y={116} fontSize={10} fill={C.stall}>else 경로 (T16~T31): 2차 실행</text>
              <text x={30} y={140} fontSize={10} fill="var(--muted-foreground)">
                다이버전스 발생 시 두 경로를 순차 실행 → 실행 시간 2배
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
