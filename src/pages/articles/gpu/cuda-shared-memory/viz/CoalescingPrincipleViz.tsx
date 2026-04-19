import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: '워프(32 스레드)의 메모리 요청을 한 트랜잭션으로 합침',
    body: '조건: 연속 스레드가 연속 주소를 접근, 정렬(aligned)되어 있을 것.',
  },
  {
    label: '트랜잭션 크기: 32B / 64B / 128B (L1 캐시 라인)',
    body: 'float 32개 = 128B = 1 캐시 라인. 한 번의 메모리 요청으로 워프 전체 처리.',
  },
  {
    label: 'Coalesced (이상적): T0→addr[0], T1→addr[1] ...',
    body: '128B 트랜잭션 1회로 32 스레드 모두 데이터 획득. 대역폭 100% 활용.',
  },
  {
    label: 'Non-coalesced (최악): 스레드마다 다른 주소',
    body: '워프당 최대 32회 메모리 트랜잭션. 대역폭의 1/32만 사용.',
  },
];

export default function CoalescingPrincipleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            글로벌 메모리 Coalescing
          </text>

          {/* Memory line (cache line) */}
          <text x={50} y={62} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">Memory</text>
          <rect x={60} y={50} width={400} height={20} rx={2} fill="var(--border)" opacity={0.25} />
          {Array.from({ length: 32 }).map((_, i) => (
            <line key={i} x1={60 + i * 12.5} y1={50} x2={60 + i * 12.5} y2={70}
              stroke="#888" strokeWidth={0.3} opacity={0.5} />
          ))}
          {/* address labels */}
          {[0, 4, 8, 12, 16, 20, 24, 28, 32].map((a, i) => {
            const x = 60 + (a * 12.5);
            return (
              <text key={a} x={x} y={84} textAnchor="middle" fontSize={6.5}
                fill="var(--muted-foreground)">{a * 4}B</text>
            );
          })}

          {/* Threads */}
          <text x={50} y={130} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">Warp</text>
          {Array.from({ length: 32 }).map((_, t) => {
            const tx = 60 + t * 12.5 + 6.25;
            // determine target address based on step
            let targetX = tx; // step 2 default coalesced
            let badge = false;
            if (step === 3) {
              // non-coalesced: random/scattered
              const targets = [0, 9, 18, 7, 25, 13, 4, 30, 21, 11, 2, 29, 17, 6, 26, 15,
                28, 1, 19, 8, 22, 12, 5, 31, 14, 23, 3, 27, 16, 24, 10, 20];
              targetX = 60 + targets[t] * 12.5 + 6.25;
              badge = true;
            } else if (step < 2) {
              targetX = tx;
            }
            return (
              <g key={t}>
                <motion.rect x={tx - 4.5} y={120} width={9} height={16} rx={1.5}
                  fill={step === 3 ? '#ef4444' : '#10b981'} opacity={0.85}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}
                  transition={{ delay: t * 0.01 }} />
                {/* arrow to memory */}
                {step >= 2 && (
                  <motion.line x1={tx} y1={120} x2={targetX} y2={70}
                    stroke={step === 3 ? '#ef4444' : '#10b981'}
                    strokeWidth={0.5} opacity={0.6}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4 + t * 0.01, duration: 0.3 }} />
                )}
                {badge && t === 0 && (
                  <text x={tx} y={150} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">T{t}</text>
                )}
              </g>
            );
          })}

          {/* Result text per step */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1">
                32B / 64B / 128B 단위 트랜잭션
              </text>
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                float × 32 = 128B = 1 캐시 라인
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <rect x={140} y={170} width={200} height={50} rx={6} fill="#10b981" opacity={0.12}
                stroke="#10b981" strokeWidth={1} />
              <text x={240} y={190} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
                Coalesced — 1회 트랜잭션
              </text>
              <text x={240} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                대역폭 100% 활용
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <rect x={140} y={170} width={200} height={50} rx={6} fill="#ef4444" opacity={0.12}
                stroke="#ef4444" strokeWidth={1} />
              <text x={240} y={190} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
                Non-coalesced — 최대 32회
              </text>
              <text x={240} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                대역폭 1/32 활용 = 32배 느림
              </text>
            </motion.g>
          )}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={180} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                연속 스레드 + 연속 주소 + 정렬
              </text>
              <text x={240} y={198} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                3가지 조건이 모두 맞아야 합쳐진다
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
