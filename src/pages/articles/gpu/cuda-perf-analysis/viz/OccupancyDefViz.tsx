import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: '점유율 = Active Warps / Max Warps per SM',
    body: 'SM에서 동시에 활성화된 워프 수를 최대 가능치로 나눈 비율. 메모리 지연 숨김에 직결.',
  },
  {
    label: '아키텍처별 SM당 최대 워프',
    body: 'Ampere/Hopper: 64 워프 = 2048 스레드. Ada (RTX 4090): 48 워프 = 1536 스레드.',
  },
  {
    label: '점유율을 제한하는 3가지 자원',
    body: '레지스터(SM당 65,536) / 공유 메모리(SM당 48~228 KB) / 블록당 최대 스레드(1024).',
  },
];

const ARCHS = [
  { name: 'Ampere A100', warps: 64, threads: 2048, color: '#10b981' },
  { name: 'Hopper H100', warps: 64, threads: 2048, color: '#6366f1' },
  { name: 'Ada RTX 4090', warps: 48, threads: 1536, color: '#f59e0b' },
];

const RESOURCES = [
  { label: 'Register', sub: 'SM당 65,536개', color: '#6366f1' },
  { label: 'Shared Memory', sub: 'SM당 48~228 KB', color: '#10b981' },
  { label: 'Block Threads', sub: '블록당 ≤ 1024', color: '#f59e0b' },
];

export default function OccupancyDefViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          {/* Step 0: 공식 + 워프 격자 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                점유율 = 활성 워프 / 최대 워프 (SM당)
              </text>

              {/* 64 warp 격자 (8x8) */}
              <g transform="translate(120, 50)">
                {Array.from({ length: 64 }).map((_, i) => {
                  const r = Math.floor(i / 8);
                  const c = i % 8;
                  const isActive = i < 32; // 50% 점유율 예시
                  return (
                    <motion.rect key={i} x={c * 16} y={r * 16} width={13} height={13} rx={2}
                      fill={isActive ? '#6366f1' : '#888'}
                      opacity={isActive ? 0.85 : 0.2}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: i * 0.008, duration: 0.2 }} />
                  );
                })}
              </g>

              <text x={300} y={100} fontSize={9} fill="#6366f1" fontWeight={600}>활성 32 워프</text>
              <text x={300} y={114} fontSize={9} fill="var(--muted-foreground)">최대 64 워프</text>
              <text x={300} y={140} fontSize={14} fill="#6366f1" fontWeight={700}>= 50%</text>
              <text x={300} y={158} fontSize={8} fill="var(--muted-foreground)">예시 점유율</text>

              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                낮은 점유율 → 메모리 지연을 숨기지 못함
              </text>
            </motion.g>
          )}

          {/* Step 1: 아키텍처 비교 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                아키텍처별 SM당 최대 워프
              </text>
              {ARCHS.map((a, i) => {
                const x = 30 + i * 145;
                return (
                  <motion.g key={a.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.3 }}>
                    <ModuleBox x={x} y={50} w={130} h={48} label={a.name} sub={`${a.threads} threads`} color={a.color} />
                    <text x={x + 65} y={130} textAnchor="middle" fontSize={22} fontWeight={700} fill={a.color}>
                      {a.warps}
                    </text>
                    <text x={x + 65} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                      warps / SM
                    </text>

                    {/* visual warp count */}
                    {Array.from({ length: a.warps }).map((_, j) => {
                      const cols = 16;
                      const cr = Math.floor(j / cols);
                      const cc = j % cols;
                      return (
                        <rect key={j} x={x + 8 + cc * 7.5} y={170 + cr * 7.5}
                          width={6} height={6} rx={1} fill={a.color} opacity={0.7} />
                      );
                    })}
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {/* Step 2: 3 자원 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                점유율을 제한하는 3가지 자원
              </text>
              {RESOURCES.map((r, i) => {
                const x = 30 + i * 145;
                return (
                  <motion.g key={r.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.3 }}>
                    <DataBox x={x} y={70} w={130} h={50} label={r.label} sub={r.sub} color={r.color} outlined />
                    <text x={x + 65} y={148} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill={r.color}>
                      {i === 0 ? '레지스터 과다 → 블록 수 감소' :
                        i === 1 ? '공유 메모리 과다 → 점유율 하락' :
                          '블록당 스레드 < SM당 최대'}
                    </text>
                  </motion.g>
                );
              })}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                3중 가장 빡빡한 제약이 점유율을 결정한다
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
