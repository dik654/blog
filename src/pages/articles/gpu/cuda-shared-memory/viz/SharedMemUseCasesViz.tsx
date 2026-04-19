import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: '1. 스레드 간 통신 — 부분합 리덕션',
    body: '256 스레드가 자기 값을 공유 메모리에 쓰고, __syncthreads로 모두 끝났음을 확인한 뒤, 0번 스레드가 합산.',
  },
  {
    label: '2. 사용자 관리 캐시 — 글로벌 → 공유 한 번 로드',
    body: '글로벌 메모리에서 한 번 로드해 공유 메모리에 두고, 이후 반복 접근은 모두 공유 메모리에서 처리.',
  },
  {
    label: '3. 데이터 재사용 — 행렬 곱셈 타일',
    body: '한 타일을 BLOCK_SIZE개 스레드가 공유. 글로벌 접근이 O(N) → O(N/BLOCK_SIZE)로 감소.',
  },
];

export default function SharedMemUseCasesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          {/* Step 0: Reduction */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                스레드 간 통신: 부분합 리덕션
              </text>

              {/* Threads writing values */}
              <text x={240} y={50} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Thread 0..7 → partialSum[]
              </text>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.g key={i}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}>
                  <rect x={50 + i * 48} y={70} width={40} height={26} rx={3} fill="#6366f1" opacity={0.7} />
                  <text x={70 + i * 48} y={86} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill="white">T{i}</text>
                </motion.g>
              ))}

              {/* Sync barrier */}
              <motion.line x1={50} y1={108} x2={430} y2={108}
                stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }} />
              <text x={240} y={120} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#f59e0b">__syncthreads()</text>

              {/* Shared array */}
              <text x={240} y={146} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                공유 메모리: partialSum[256]
              </text>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.rect key={i} x={50 + i * 48} y={156} width={40} height={20} rx={2}
                  fill="#10b981" opacity={0.6}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.04 }} />
              ))}

              {/* T0 sums */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                <ActionBox x={140} y={195} w={200} h={30} label="T0: total = sum(partialSum)" color="#a855f7" />
              </motion.g>
            </motion.g>
          )}

          {/* Step 1: User-managed cache */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                사용자 관리 캐시
              </text>
              <ModuleBox x={30} y={50} w={150} h={50} label="Global Memory" sub="DRAM, ~400 cyc" color="#ef4444" />
              <ModuleBox x={300} y={50} w={150} h={50} label="Shared Memory" sub="On-chip, ~5 cyc" color="#10b981" />

              <motion.line x1={180} y1={75} x2={300} y2={75}
                stroke="#6366f1" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }} />
              <text x={240} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">
                load 1회
              </text>
              <polygon points="296,72 302,75 296,78" fill="#6366f1" />

              {/* Reuse arrows */}
              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                이후 반복 접근은 공유 메모리에서
              </text>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}>
                  <line x1={375} y1={140 + i * 14} x2={420} y2={140 + i * 14}
                    stroke="#10b981" strokeWidth={0.8} />
                  <text x={425} y={143 + i * 14} fontSize={8} fill="#10b981">read #{i + 1}</text>
                </motion.g>
              ))}

              <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                글로벌 접근 1회 + 공유 접근 N회 = N배 절약
              </text>
            </motion.g>
          )}

          {/* Step 2: Tile reuse */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                데이터 재사용: 행렬 곱셈 타일링
              </text>

              {/* Matrix tiles A and B */}
              <text x={120} y={55} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">A 타일</text>
              {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => (
                  <motion.rect key={`a-${r}-${c}`} x={70 + c * 25} y={65 + r * 25}
                    width={22} height={22} rx={2} fill="#6366f1" opacity={0.7}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: (r * 4 + c) * 0.02 }} />
                ))
              )}

              <text x={300} y={55} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">B 타일</text>
              {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => (
                  <motion.rect key={`b-${r}-${c}`} x={250 + c * 25} y={65 + r * 25}
                    width={22} height={22} rx={2} fill="#10b981" opacity={0.7}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + (r * 4 + c) * 0.02 }} />
                ))
              )}

              {/* Block of threads sharing the tile */}
              <DataBox x={140} y={185} w={200} h={32} label="Block (16 threads)" sub="모두 같은 타일을 공유" color="#a855f7" outlined />

              <text x={240} y={232} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                글로벌 접근: O(N) → O(N/BLOCK_SIZE)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
