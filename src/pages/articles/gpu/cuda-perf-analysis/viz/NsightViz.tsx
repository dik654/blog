import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'Nsight Systems — 시스템 수준 타임라인',
    body: 'CPU와 GPU 활동을 한 화면에 펼친다. 커널 런치 갭, 전송-연산 중첩, 스트림 활용 점검.',
  },
  {
    label: 'Nsight Compute — 커널 수준 상세 메트릭',
    body: '특정 커널의 점유율, SM/DRAM 활용률, 명령어 혼합을 SOL(Speed of Light) 섹션에서 즉시 본다.',
  },
  {
    label: 'SOL 판별: Compute / Memory / Latency-bound',
    body: '연산 높고 메모리 낮음 → Compute. 연산 낮고 메모리 높음 → Memory. 둘 다 낮음 → Latency-bound.',
  },
];

export default function NsightViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          {/* Step 0: Nsight Systems timeline */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                nsys profile --stats=true ./my_cuda_app
              </text>

              {/* CPU lane */}
              <text x={50} y={70} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">CPU</text>
              <rect x={60} y={58} width={400} height={20} fill="var(--border)" opacity={0.2} />
              {[
                { x: 60, w: 60, c: '#6366f1', t: 'launch' },
                { x: 130, w: 30, c: '#888', t: '' },
                { x: 170, w: 80, c: '#6366f1', t: 'launch' },
                { x: 260, w: 80, c: '#6366f1', t: 'launch' },
                { x: 350, w: 50, c: '#6366f1', t: 'sync' },
              ].map((b, i) => (
                <motion.rect key={i} x={b.x} y={58} width={b.w} height={20} rx={2}
                  fill={b.c} opacity={0.85}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.85 }}
                  transition={{ delay: i * 0.1 }} />
              ))}

              {/* GPU lane */}
              <text x={50} y={110} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">GPU</text>
              <rect x={60} y={98} width={400} height={20} fill="var(--border)" opacity={0.2} />
              {[
                { x: 70, w: 60, c: '#10b981', t: 'kernel A' },
                { x: 140, w: 80, c: '#10b981', t: 'kernel B' },
                { x: 230, w: 100, c: '#10b981', t: 'kernel C' },
              ].map((b, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}>
                  <rect x={b.x} y={98} width={b.w} height={20} rx={2} fill={b.c} opacity={0.85} />
                  <text x={b.x + b.w / 2} y={113} textAnchor="middle" fontSize={8.5}
                    fontWeight={600} fill="white">{b.t}</text>
                </motion.g>
              ))}

              {/* Copy lane */}
              <text x={50} y={150} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">Copy</text>
              <rect x={60} y={138} width={400} height={20} fill="var(--border)" opacity={0.2} />
              {[
                { x: 60, w: 50, c: '#f59e0b', t: 'H→D' },
                { x: 340, w: 60, c: '#f59e0b', t: 'D→H' },
              ].map((b, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}>
                  <rect x={b.x} y={138} width={b.w} height={20} rx={2} fill={b.c} opacity={0.85} />
                  <text x={b.x + b.w / 2} y={153} textAnchor="middle" fontSize={8.5}
                    fontWeight={600} fill="white">{b.t}</text>
                </motion.g>
              ))}

              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                커널 갭, 전송-연산 중첩, 스트림 사용을 시각화
              </text>
              <text x={240} y={204} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                CPU·GPU·Copy 레인이 한 타임라인 위에 펼쳐진다
              </text>
            </motion.g>
          )}

          {/* Step 1: Nsight Compute metrics */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                ncu --kernel-name myKernel ./my_cuda_app
              </text>
              <ActionBox x={60} y={50} w={360} h={36} label="커널 1개를 캡처하고 모든 메트릭 수집" color="#6366f1" />

              {[
                { name: 'sm__throughput', val: 78, color: '#6366f1' },
                { name: 'dram__throughput', val: 45, color: '#10b981' },
                { name: 'launch__occupancy', val: 62, color: '#f59e0b' },
              ].map((m, i) => {
                const y = 110 + i * 36;
                return (
                  <motion.g key={m.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.3 }}>
                    <text x={50} y={y + 12} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">
                      {m.name}
                    </text>
                    <rect x={60} y={y} width={300} height={20} rx={3} fill="var(--border)" opacity={0.3} />
                    <motion.rect x={60} y={y} height={20} rx={3} fill={m.color} opacity={0.85}
                      initial={{ width: 0 }} animate={{ width: m.val * 3 }}
                      transition={{ delay: i * 0.15 + 0.1, duration: 0.5 }} />
                    <text x={365} y={y + 14} fontSize={9} fontWeight={600} fill={m.color}>
                      {m.val}%
                    </text>
                  </motion.g>
                );
              })}

              <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Speed of Light 섹션 — 활용률을 즉시 확인
              </text>
            </motion.g>
          )}

          {/* Step 2: SOL 판별 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                SOL 패턴별 병목 진단
              </text>

              {[
                { x: 30, label: 'Compute-bound', sm: 90, mem: 30, color: '#6366f1' },
                { x: 175, label: 'Memory-bound', sm: 25, mem: 88, color: '#10b981' },
                { x: 320, label: 'Latency-bound', sm: 18, mem: 22, color: '#ef4444' },
              ].map((p) => (
                <g key={p.label}>
                  <ModuleBox x={p.x} y={50} w={130} h={40} label={p.label} color={p.color} />
                  <text x={p.x + 65} y={108} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">SM</text>
                  <rect x={p.x + 10} y={114} width={110} height={10} rx={2} fill="var(--border)" opacity={0.3} />
                  <rect x={p.x + 10} y={114} width={p.sm * 1.1} height={10} rx={2} fill={p.color} opacity={0.85} />
                  <text x={p.x + 65} y={144} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">DRAM</text>
                  <rect x={p.x + 10} y={150} width={110} height={10} rx={2} fill="var(--border)" opacity={0.3} />
                  <rect x={p.x + 10} y={150} width={p.mem * 1.1} height={10} rx={2} fill={p.color} opacity={0.85} />
                </g>
              ))}

              <text x={95} y={188} textAnchor="middle" fontSize={8.5} fill="#6366f1">SM 높음 + Mem 낮음</text>
              <text x={240} y={188} textAnchor="middle" fontSize={8.5} fill="#10b981">SM 낮음 + Mem 높음</text>
              <text x={385} y={188} textAnchor="middle" fontSize={8.5} fill="#ef4444">둘 다 낮음</text>

              <text x={240} y={216} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                패턴이 즉시 최적화 방향을 결정한다
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
