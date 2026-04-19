import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: 'Speedup = 1 / ((1-P) + P/N)',
    body: 'P = 병렬화 가능 비율, N = 프로세서 수. 분모가 0에 가까워질수록 속도 향상이 커진다.',
  },
  { label: 'P=0.95, N=20 → 10.3x', body: '20개 프로세서를 써도 직렬 5%가 아직 무시할 수 없는 수준이다.' },
  { label: 'P=0.95, N=1000 → 19.6x', body: '50배 더 늘려도 추가 가속은 미미하다. 직렬 구간이 분모를 지배하기 시작.' },
  { label: 'P=0.95, N=∞ → 20x', body: '직렬 5%가 만든 절대 상한. GPU 코어를 무한히 늘려도 20배가 천장이다.' },
];

const POINTS = [
  { N: 1, gain: 1, color: '#888' },
  { N: 20, gain: 10.26, color: '#6366f1', step: 1 },
  { N: 1000, gain: 19.62, color: '#10b981', step: 2 },
  { N: 100000, gain: 20.0, color: '#f59e0b', step: 3 },
];

const speedup = (N: number) => 1 / (0.05 + 0.95 / N);

export default function AmdahlViz() {
  // x: log10(N) from 0 to 5
  // y: gain from 0 to 22
  const xScale = (n: number) => 60 + (Math.log10(n) / 5) * 380;
  const yScale = (g: number) => 200 - (g / 22) * 160;

  // build curve path
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= 50; i++) {
    const lg = (i / 50) * 5;
    const n = Math.pow(10, lg);
    pts.push([xScale(n), yScale(speedup(n))]);
  }
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          {/* axes */}
          <line x1={60} y1={200} x2={450} y2={200} stroke="#888" strokeWidth={0.6} />
          <line x1={60} y1={40} x2={60} y2={200} stroke="#888" strokeWidth={0.6} />

          {/* x ticks log */}
          {[1, 10, 100, 1000, 10000, 100000].map((n) => (
            <g key={n}>
              <line x1={xScale(n)} y1={200} x2={xScale(n)} y2={203} stroke="#888" strokeWidth={0.5} />
              <text x={xScale(n)} y={213} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                {n >= 1000 ? `${n / 1000}k` : n}
              </text>
            </g>
          ))}
          {/* y ticks */}
          {[0, 5, 10, 15, 20].map((g) => (
            <g key={g}>
              <line x1={57} y1={yScale(g)} x2={60} y2={yScale(g)} stroke="#888" strokeWidth={0.5} />
              <text x={54} y={yScale(g) + 3} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">
                {g}x
              </text>
            </g>
          ))}

          <text x={255} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            프로세서 수 N (log)
          </text>
          <text x={20} y={120} fontSize={9} fill="var(--muted-foreground)" transform="rotate(-90 20 120)">
            Speedup
          </text>

          {/* asymptote at 20x */}
          <line x1={60} y1={yScale(20)} x2={450} y2={yScale(20)}
            stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.6} />
          <text x={445} y={yScale(20) - 3} textAnchor="end" fontSize={8}
            fontWeight={600} fill="#f59e0b" opacity={0.8}>
            상한 = 1 / 0.05 = 20x
          </text>

          {/* curve */}
          <motion.path d={path} fill="none" stroke="#6366f1" strokeWidth={1.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.7 }} />

          {/* points */}
          {POINTS.map((p) => {
            const active = step >= (p.step ?? 0);
            return (
              <motion.g key={p.N}
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}>
                <circle cx={xScale(p.N)} cy={yScale(p.gain)} r={4} fill={p.color} />
                {active && p.step !== undefined && (
                  <text x={xScale(p.N)} y={yScale(p.gain) - 8} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={p.color}>
                    {p.gain.toFixed(1)}x
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* formula box step 0 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <rect x={150} y={70} width={200} height={50} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={250} y={92} textAnchor="middle" fontSize={12} fontWeight={700}
                fill="var(--foreground)">
                S = 1 / ((1-P) + P/N)
              </text>
              <text x={250} y={108} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                P=0.95: 직렬 5% / 병렬 95%
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
