import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: '메모리 지연: 글로벌 ~400 cycle, 공유 ~20 cycle',
    body: '한 워프가 글로벌 메모리를 기다리는 동안 GPU 코어는 유휴 상태가 될 수 있다.',
  },
  {
    label: '워프 스케줄러: 대기 워프를 즉시 다른 활성 워프로 교체',
    body: '메모리 응답을 기다리는 워프 대신 준비된 워프를 실행한다. 충분한 활성 워프가 있어야 가능.',
  },
  {
    label: '필요 워프 수 ≈ Latency × Throughput',
    body: '레이턴시가 길수록, 처리량이 높을수록 더 많은 활성 워프가 필요하다. ILP가 있으면 더 적게 가능.',
  },
  {
    label: '실무 가이드: 50% 이상 충분, 25% 미만 위험',
    body: '점유율 100%가 항상 최적은 아니다. 레지스터 압박 없이 50% 정도면 대부분 충분히 숨긴다.',
  },
  {
    label: 'API: cudaOccupancyMaxPotentialBlockSize',
    body: '런타임에 점유율을 최대화하는 블록 크기를 자동 계산해 반환한다.',
  },
];

const TIMELINE_LEN = 16;

export default function LatencyHidingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          {/* Step 0: latency 비교 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                메모리 계층별 레이턴시
              </text>
              {[
                { name: 'Register', cyc: 0, color: '#10b981' },
                { name: 'Shared', cyc: 20, color: '#6366f1' },
                { name: 'L2 Cache', cyc: 200, color: '#f59e0b' },
                { name: 'Global', cyc: 400, color: '#ef4444' },
              ].map((l, i) => {
                const barW = Math.max(l.cyc / 400 * 320, 6);
                const y = 70 + i * 38;
                return (
                  <motion.g key={l.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.3 }}>
                    <text x={75} y={y + 16} textAnchor="end" fontSize={10} fontWeight={600}
                      fill="var(--foreground)">{l.name}</text>
                    <rect x={85} y={y + 4} width={barW} height={22} rx={3} fill={l.color} opacity={0.85} />
                    <text x={92 + barW} y={y + 19} fontSize={10} fontWeight={600} fill="var(--foreground)">
                      {l.cyc} cyc
                    </text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {/* Step 1: warp 스케줄러 — timeline view */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                워프 스케줄러 — 대기/실행 교체
              </text>
              {[0, 1, 2, 3].map((w) => {
                const y = 60 + w * 38;
                return (
                  <g key={w}>
                    <text x={50} y={y + 16} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                      Warp {w}
                    </text>
                    {Array.from({ length: TIMELINE_LEN }).map((_, t) => {
                      const x = 60 + t * 24;
                      // each warp is "running" at staggered moments
                      const running = ((t + w) % 4) === 0;
                      return (
                        <motion.rect key={t} x={x} y={y + 4} width={20} height={22} rx={2}
                          fill={running ? '#10b981' : '#888'}
                          opacity={running ? 0.85 : 0.15}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: running ? 0.85 : 0.15 }}
                          transition={{ delay: t * 0.04 }} />
                      );
                    })}
                  </g>
                );
              })}
              <text x={240} y={216} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                초록 = 실행 / 회색 = 메모리 대기
              </text>
            </motion.g>
          )}

          {/* Step 2: 공식 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                필요 활성 워프 수 ≈ Latency × Throughput
              </text>
              <ModuleBox x={70} y={60} w={150} h={50} label="Latency" sub="대기 사이클" color="#ef4444" />
              <text x={235} y={91} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--foreground)">×</text>
              <ModuleBox x={250} y={60} w={150} h={50} label="Throughput" sub="명령어/cycle" color="#6366f1" />

              <text x={235} y={150} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--foreground)">↓</text>
              <DataBox x={140} y={170} w={200} h={36} label="활성 워프 수 (Active Warps)" color="#10b981" outlined />
              <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ILP가 있으면 이론치보다 적은 워프로 충분
              </text>
            </motion.g>
          )}

          {/* Step 3: 실무 가이드 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                점유율 실무 기준
              </text>
              <DataBox x={30} y={60} w={130} h={40} label="< 25%" sub="레이턴시 미숨김 위험" color="#ef4444" outlined />
              <DataBox x={175} y={60} w={130} h={40} label="25~50%" sub="조건부 충분" color="#f59e0b" outlined />
              <DataBox x={320} y={60} w={130} h={40} label="≥ 50%" sub="대부분 충분" color="#10b981" outlined />

              {/* visual gauge */}
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                점유율 게이지
              </text>
              <rect x={60} y={150} width={360} height={26} rx={13} fill="var(--border)" opacity={0.3} />
              <rect x={60} y={150} width={90} height={26} rx={13} fill="#ef4444" opacity={0.7} />
              <rect x={150} y={150} width={90} height={26} rx={0} fill="#f59e0b" opacity={0.7} />
              <rect x={240} y={150} width={180} height={26} rx={13} fill="#10b981" opacity={0.7} />
              <text x={105} y={167} textAnchor="middle" fontSize={9} fontWeight={600} fill="white">위험</text>
              <text x={195} y={167} textAnchor="middle" fontSize={9} fontWeight={600} fill="white">조건부</text>
              <text x={330} y={167} textAnchor="middle" fontSize={9} fontWeight={600} fill="white">안전 영역</text>

              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                점유율 100%가 항상 최적은 아니다
              </text>
            </motion.g>
          )}

          {/* Step 4: API */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                cudaOccupancyMaxPotentialBlockSize
              </text>

              <ModuleBox x={50} y={60} w={140} h={48} label="커널 함수" sub="myKernel" color="#6366f1" />
              <line x1={190} y1={84} x2={290} y2={84} stroke="#888" strokeWidth={0.8}
                markerEnd="url(#oarrow)" />
              <defs>
                <marker id="oarrow" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={6} markerHeight={6} orient="auto">
                  <path d="M 0 0 L 6 3 L 0 6 z" fill="#888" />
                </marker>
              </defs>
              <ModuleBox x={290} y={60} w={140} h={48} label="API 호출" sub="런타임 자동 결정" color="#f59e0b" />

              <DataBox x={70} y={140} w={150} h={36} label="minGridSize" sub="최소 그리드" color="#10b981" outlined />
              <DataBox x={260} y={140} w={150} h={36} label="blockSize" sub="최적 블록 크기" color="#10b981" outlined />

              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                런타임에 점유율 최대화 블록 크기를 자동 산출
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
