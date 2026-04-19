import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'Throughput: 초당 부동소수점 연산 횟수',
    body: 'GFLOPS = 총 FLOP / 실행 시간(초). A100 FP32는 19.5 TFLOPS, FP16 Tensor는 312 TFLOPS.',
  },
  {
    label: 'Bandwidth: 초당 메모리 전송량',
    body: 'GB/s = (읽기 + 쓰기 바이트) / 실행 시간(초). A100 HBM2e 이론 2039 GB/s, 실측 80~90% 달성 가능.',
  },
  {
    label: 'Latency: 메모리 계층별 대기 사이클',
    body: '레지스터 0 / 공유 메모리 ~20 / L2 ~200 / 글로벌 ~400 사이클. 워프 교체로 숨긴다.',
  },
];

const METRICS = [
  { key: 'throughput', label: 'Throughput', sub: 'GFLOPS', color: '#6366f1', value: '19,500', unit: 'GFLOPS', detail: 'FP32 peak' },
  { key: 'bandwidth', label: 'Bandwidth', sub: 'GB/s', color: '#10b981', value: '2,039', unit: 'GB/s', detail: 'HBM2e' },
  { key: 'latency', label: 'Latency', sub: 'cycles', color: '#f59e0b', value: '400', unit: 'cyc', detail: 'global mem' },
];

const LATENCY_LAYERS = [
  { name: 'Register', cyc: 0, color: '#10b981' },
  { name: 'Shared', cyc: 20, color: '#6366f1' },
  { name: 'L2 Cache', cyc: 200, color: '#f59e0b' },
  { name: 'Global', cyc: 400, color: '#ef4444' },
];

export default function MetricsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl">
          {METRICS.map((m, i) => {
            const x = 30 + i * 145;
            const active = i === step;
            return (
              <g key={m.key}>
                <motion.g
                  initial={{ opacity: 0.3, y: 4 }}
                  animate={{ opacity: active ? 1 : 0.35, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ModuleBox x={x} y={20} w={130} h={60} label={m.label} sub={m.sub} color={m.color} />
                  <text x={x + 65} y={108} textAnchor="middle" fontSize={18} fontWeight={700} fill={m.color}>
                    {m.value}
                  </text>
                  <text x={x + 65} y={124} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                    {m.unit} ({m.detail})
                  </text>
                </motion.g>
              </g>
            );
          })}

          {/* 단계 2: Bandwidth 강조 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <DataBox x={50} y={150} w={160} h={28} label="GPU → DRAM" sub="2 TB/s" color="#10b981" outlined />
              <DataBox x={270} y={150} w={160} h={28} label="실측 ~85% 달성" sub="1.7 TB/s" color="#10b981" outlined />
              <line x1={210} y1={164} x2={270} y2={164} stroke="#10b981" strokeWidth={1.2} strokeDasharray="3 2" />
            </motion.g>
          )}

          {/* 단계 3: Latency 계층별 비교 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {LATENCY_LAYERS.map((l, i) => {
                const barW = Math.max(l.cyc / 400 * 280, 8);
                const y = 150 + i * 16;
                return (
                  <g key={l.name}>
                    <text x={20} y={y + 9} fontSize={9} fill="var(--muted-foreground)">{l.name}</text>
                    <rect x={90} y={y} width={barW} height={11} rx={2} fill={l.color} opacity={0.85} />
                    <text x={94 + barW} y={y + 9} fontSize={8} fill="var(--muted-foreground)">{l.cyc} cyc</text>
                  </g>
                );
              })}
            </motion.g>
          )}

          {/* 단계 1: Throughput 강조 - peak vs 실측 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={158} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                Tensor Core (FP16): 312 TFLOPS
              </text>
              <text x={240} y={174} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                FP32 대비 16배 — 행렬 곱셈에 특화
              </text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                실측 GFLOPS = 총 FLOP / 실행 시간(초)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
