import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: 'Arithmetic Intensity = FLOPS / Bytes',
    body: '커널이 1바이트당 몇 번의 부동소수점 연산을 하는지 측정한다. 메모리 재사용이 클수록 AI가 높다.',
  },
  {
    label: 'Ridge Point = Peak GFLOPS / Peak GB/s',
    body: 'A100 FP32: 19,500 / 2,039 = 9.56 FLOPS/Byte. 이 값보다 AI가 낮으면 메모리, 높으면 연산이 병목이다.',
  },
  {
    label: '벡터 덧셈: AI = 0.08 → Memory-bound',
    body: '1 FLOP / 12 bytes (a, b 읽고 c 쓰기). 좌측 영역 = 대역폭이 한계.',
  },
  {
    label: '행렬 곱셈: AI ≈ N/4 → N>38이면 Compute-bound',
    body: '내적 2N FLOP / 8 bytes per output. 큰 N에서 우측 영역 진입 = 연산 유닛이 한계.',
  },
];

const RIDGE_X = 240; // viewBox x position of ridge point

const KERNELS: Record<number, { ai: number; gflops: number; label: string; color: string }> = {
  2: { ai: 0.08, gflops: 0.08 * 2039, label: '벡터 덧셈', color: '#ef4444' },
  3: { ai: 256, gflops: 19500, label: '행렬 곱셈 N=1024', color: '#10b981' },
};

export default function RooflineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          {/* axes */}
          <line x1={50} y1={200} x2={460} y2={200} stroke="#888" strokeWidth={0.6} />
          <line x1={50} y1={20} x2={50} y2={200} stroke="#888" strokeWidth={0.6} />
          <text x={255} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            Arithmetic Intensity (FLOPS/Byte, log scale)
          </text>
          <text x={20} y={110} fontSize={9} fill="var(--muted-foreground)" transform="rotate(-90 20 110)">
            Performance (GFLOPS, log)
          </text>

          {/* x-axis ticks (log) */}
          {[0.1, 1, 10, 100].map((v, i) => {
            const x = 70 + i * 95;
            return (
              <g key={v}>
                <line x1={x} y1={200} x2={x} y2={203} stroke="#888" strokeWidth={0.5} />
                <text x={x} y={212} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{v}</text>
              </g>
            );
          })}

          {/* roofline: memory-bound diagonal */}
          <motion.line
            x1={70} y1={185} x2={RIDGE_X} y2={50}
            stroke="#10b981" strokeWidth={1.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0.6 }}
            transition={{ duration: 0.5 }} opacity={0.85}
          />
          {/* roofline: compute-bound horizontal */}
          <motion.line
            x1={RIDGE_X} y1={50} x2={460} y2={50}
            stroke="#6366f1" strokeWidth={1.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0.6 }}
            transition={{ duration: 0.5, delay: 0.2 }} opacity={0.85}
          />

          {/* Ridge point marker */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <line x1={RIDGE_X} y1={50} x2={RIDGE_X} y2={200} stroke="#888"
                strokeWidth={0.5} strokeDasharray="2 2" />
              <circle cx={RIDGE_X} cy={50} r={3.5} fill="#f59e0b" />
              <text x={RIDGE_X + 6} y={42} fontSize={8} fontWeight={600} fill="#f59e0b">
                Ridge: AI = 9.56
              </text>
              <text x={RIDGE_X + 6} y={52} fontSize={7} fill="var(--muted-foreground)">
                19.5 TFLOPS / 2 TB/s
              </text>
            </motion.g>
          )}

          {/* Region labels */}
          {step >= 1 && (
            <>
              <text x={140} y={160} fontSize={9} fontWeight={600} fill="#10b981" opacity={0.8}>
                Memory-bound
              </text>
              <text x={345} y={70} fontSize={9} fontWeight={600} fill="#6366f1" opacity={0.8}>
                Compute-bound
              </text>
            </>
          )}

          {/* Kernel point */}
          {KERNELS[step] && (() => {
            const k = KERNELS[step];
            // log scale: 70 + log10(ai/0.1) * 95
            const x = 70 + Math.log10(k.ai / 0.1) * 95;
            // gflops scale: 200 - log10(gflops/10) * 50 roughly
            const y = 200 - Math.log10(Math.max(k.gflops, 1)) * 36;
            return (
              <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}>
                <circle cx={x} cy={y} r={6} fill={k.color} />
                <text x={x} y={y - 10} textAnchor="middle" fontSize={8.5}
                  fontWeight={600} fill={k.color}>
                  {k.label}
                </text>
                <text x={x} y={y + 16} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  AI = {k.ai}
                </text>
              </motion.g>
            );
          })()}

          {/* Step 0: AI formula */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <rect x={140} y={90} width={200} height={60} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                AI = FLOPS / Bytes
              </text>
              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                바이트당 부동소수점 연산 수
              </text>
              <text x={240} y={143} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                재사용이 많을수록 AI가 커진다
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
