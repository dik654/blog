import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '커널 런치 오버헤드: 호출당 5~10us', body: '수백 개의 작은 커널을 연속 호출하면 런치 비용이 누적되어 GPU 유휴 시간이 커진다.' },
  { label: 'CPU↔GPU 전송: PCIe 12 GB/s vs NVLink 600 GB/s', body: '데이터를 GPU에 한 번 올리고 거기서 모든 처리를 끝낸다. 왕복 전송은 직렬 구간이다.' },
  { label: '전역 동기화: cudaDeviceSynchronize 비용', body: 'GPU의 모든 작업이 끝날 때까지 CPU가 블로킹된다. 비동기 스트림으로 대체한다.' },
  { label: '리덕션 마지막 단계: 워프 1개로 수렴', body: '대량 연산이 마지막에 한 워프로 좁아진다. 병렬도가 32에서 1로 떨어진다.' },
  { label: '호스트 전·후처리: CPU 단일 스레드', body: '파싱, 검증, 집계가 CPU에서 직렬로 돌면 GPU 처리량을 다 못 쓴다.' },
  {
    label: '최소화 전략 4종',
    body: '1) 커널 퓨전 — 여러 작은 커널을 하나로 합침\n2) cudaMemcpyAsync — 비동기 전송으로 연산과 중첩\n3) Cooperative Groups — 그리드 수준 동기화로 cudaDeviceSync 회피\n4) 파이프라이닝 — 전송과 연산을 겹쳐 실행',
  },
];

const CAUSES = [
  { label: '커널 런치', sub: '5-10us/launch', color: '#ef4444' },
  { label: 'PCIe 전송', sub: '12 GB/s', color: '#f97316' },
  { label: '전역 동기화', sub: 'cudaDeviceSync', color: '#f59e0b' },
  { label: '리덕션 꼬리', sub: '워프 1개', color: '#a855f7' },
  { label: 'CPU 후처리', sub: '단일 스레드', color: '#0ea5e9' },
];

const FIXES = [
  { label: '커널 퓨전', color: '#10b981' },
  { label: 'cudaMemcpyAsync + 스트림', color: '#10b981' },
  { label: 'Cooperative Groups', color: '#10b981' },
  { label: '전송-연산 파이프라이닝', color: '#10b981' },
];

export default function SerialBottleneckViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          {step < 5 && (
            <>
              {CAUSES.map((c, i) => {
                const x = 30 + i * 90;
                const active = i === step;
                return (
                  <motion.g key={c.label}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: active ? 1 : 0.3 }}
                    transition={{ duration: 0.3 }}>
                    <AlertBox x={x} y={70} w={80} h={50} label={c.label} sub={c.sub} color={c.color} />
                    <text x={x + 40} y={62} textAnchor="middle" fontSize={9}
                      fontWeight={700} fill={c.color}>
                      {i + 1}
                    </text>
                  </motion.g>
                );
              })}

              <text x={240} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                CUDA 직렬 구간 — 5대 원인
              </text>

              {/* Active timeline view: 워프 활성화 차트 simplified */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}>
                <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  GPU 활용률 타임라인
                </text>
                <line x1={40} y1={195} x2={440} y2={195} stroke="#888" strokeWidth={0.5} />
                {/* bars: 활용률, 단계마다 다른 위치에서 dropped */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const isGap = (step === 0 && i % 4 === 0) ||
                    (step === 1 && (i < 5 || i > 15)) ||
                    (step === 2 && i === 10) ||
                    (step === 3 && i > 16) ||
                    (step === 4 && (i > 17));
                  const height = isGap ? 4 : 26;
                  const fill = isGap ? CAUSES[step].color : '#10b981';
                  return (
                    <motion.rect key={i} x={42 + i * 20} y={195 - height} width={16} height={height}
                      fill={fill} opacity={0.7}
                      initial={{ height: 0, y: 195 }}
                      animate={{ height, y: 195 - height }}
                      transition={{ duration: 0.3, delay: i * 0.02 }} />
                  );
                })}
              </motion.g>
            </>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                직렬 구간 최소화 — 4가지 처방
              </text>
              {FIXES.map((f, i) => {
                const y = 60 + i * 40;
                return (
                  <motion.g key={f.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.3 }}>
                    <ActionBox x={100} y={y} w={280} h={30} label={f.label} color={f.color} />
                    <text x={75} y={y + 19} textAnchor="middle" fontSize={11}
                      fontWeight={700} fill={f.color}>
                      {i + 1}
                    </text>
                  </motion.g>
                );
              })}
              <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                CPU와 GPU 모두 유휴 시간을 줄이는 것이 핵심
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
