import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 시계열 데이터: 일별 매출 */
const RAW = [80, 95, 88, 110, 105, 92, 130, 125, 115, 140, 135, 128, 150, 145, 138, 155, 160, 148, 165, 170];
const N = RAW.length;

/* 롤링 평균 (window=5) */
const rollingMean = (data: number[], w: number) =>
  data.map((_, i) => i < w - 1 ? null : data.slice(i - w + 1, i + 1).reduce((a, b) => a + b, 0) / w);
const rollingStd = (data: number[], w: number) =>
  data.map((_, i) => {
    if (i < w - 1) return null;
    const win = data.slice(i - w + 1, i + 1);
    const m = win.reduce((a, b) => a + b, 0) / w;
    return Math.sqrt(win.reduce((a, b) => a + (b - m) ** 2, 0) / w);
  });

/* EMA: alpha = 2/(span+1) */
const ema = (data: number[], span: number) => {
  const alpha = 2 / (span + 1);
  const result: number[] = [data[0]];
  for (let i = 1; i < data.length; i++) result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
  return result;
};

const MEAN5 = rollingMean(RAW, 5);
const STD5 = rollingStd(RAW, 5);
const EMA5 = ema(RAW, 5);
const MEAN3 = rollingMean(RAW, 3);

const sx = (i: number) => 40 + i * 20;
const sy = (v: number) => 160 - (v - 60) * 0.9;

const STEPS = [
  {
    label: '이동 평균 (Rolling Mean, window=5)',
    body: '최근 5개 값의 평균 — 단기 노이즈를 제거하고 추세를 드러낸다.\ndf["rmean_5"] = df["y"].rolling(5).mean()',
  },
  {
    label: '이동 표준편차 (Rolling Std)',
    body: '최근 5개 값의 표준편차 — 변동성을 정량화.\n변동성이 커지는 구간 = 이상 징후 or 구조 변화.',
  },
  {
    label: '윈도우 크기 비교: 3 vs 5',
    body: '작은 윈도우(3) = 민감, 노이즈 반영 | 큰 윈도우(5) = 부드럽지만 지연.\n도메인 주기에 맞춰 선택 — 주간 주기면 7, 월간이면 30.',
  },
  {
    label: '지수 이동 평균 (EMA)',
    body: 'EMA = α·y(t) + (1-α)·EMA(t-1). 최근 값에 더 큰 가중치.\n단순 이동 평균보다 추세 전환을 빠르게 반영.',
  },
  {
    label: '롤링 최대/최소 & 범위',
    body: 'rolling(w).max(), rolling(w).min() → 구간 내 극값.\nrange = max - min → 변동 폭. 이상치 탐지에 유용.',
  },
];

export default function RollingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 공통 축 */}
          <line x1={35} y1={165} x2={440} y2={165} stroke="var(--muted-foreground)" strokeWidth={0.5} />
          <line x1={35} y1={20} x2={35} y2={165} stroke="var(--muted-foreground)" strokeWidth={0.5} />

          {/* 원본 시계열 (모든 스텝에 표시) */}
          {RAW.map((v, i) => (
            <g key={`raw-${i}`}>
              {i > 0 && <line x1={sx(i - 1)} y1={sy(RAW[i - 1])} x2={sx(i)} y2={sy(v)}
                stroke="#94a3b8" strokeWidth={1} opacity={0.4} />}
              <circle cx={sx(i)} cy={sy(v)} r={2} fill="#94a3b8" opacity={0.5} />
            </g>
          ))}

          {/* Step 0: 이동 평균 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {MEAN5.map((v, i) => {
                if (v === null) return null;
                const prev = MEAN5[i - 1];
                return (
                  <g key={`m5-${i}`}>
                    {prev !== null && i > 0 && (
                      <motion.line x1={sx(i - 1)} y1={sy(prev)} x2={sx(i)} y2={sy(v)}
                        stroke="#3b82f6" strokeWidth={2}
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ ...sp, delay: i * 0.03 }} />
                    )}
                    <circle cx={sx(i)} cy={sy(v)} r={2.5} fill="#3b82f6" />
                  </g>
                );
              })}

              {/* 윈도우 하이라이트 (i=9 기준) */}
              <motion.rect x={sx(5) - 4} y={15} width={sx(9) - sx(5) + 8} height={155} rx={4}
                fill="#3b82f608" stroke="#3b82f6" strokeWidth={0.8} strokeDasharray="4 2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }} />
              <text x={sx(7)} y={12} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3b82f6">window=5</text>

              <rect x={380} y={20} width={90} height={24} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
              <line x1={385} y1={32} x2={395} y2={32} stroke="#3b82f6" strokeWidth={2} />
              <text x={400} y={36} fontSize={8} fill="var(--foreground)">이동 평균</text>
              <line x1={385} y1={24} x2={395} y2={24} stroke="#94a3b8" strokeWidth={1} opacity={0.5} />
              <text x={400} y={28} fontSize={7} fill="var(--muted-foreground)">원본</text>
            </motion.g>
          )}

          {/* Step 1: 이동 표준편차 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 평균선 + 표준편차 밴드 */}
              {MEAN5.map((m, i) => {
                if (m === null || STD5[i] === null) return null;
                const s = STD5[i]!;
                return (
                  <motion.g key={`std-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.03 }}>
                    <line x1={sx(i)} y1={sy(m - s)} x2={sx(i)} y2={sy(m + s)}
                      stroke="#f59e0b" strokeWidth={3} opacity={0.2} />
                    <circle cx={sx(i)} cy={sy(m)} r={2} fill="#3b82f6" />
                  </motion.g>
                );
              })}

              {/* 이동 표준편차 값 바 (하단) */}
              <text x={240} y={15} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">
                노란 밴드 = ±1 표준편차 구간
              </text>

              <rect x={380} y={20} width={90} height={32} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
              <rect x={385} y={27} width={10} height={6} rx={1} fill="#f59e0b" opacity={0.3} />
              <text x={400} y={33} fontSize={8} fill="var(--foreground)">±std 밴드</text>
              <circle cx={390} cy={44} r={2} fill="#3b82f6" />
              <text x={400} y={47} fontSize={7} fill="var(--muted-foreground)">평균</text>
            </motion.g>
          )}

          {/* Step 2: 윈도우 크기 비교 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* window=3 */}
              {MEAN3.map((v, i) => {
                if (v === null) return null;
                const prev = MEAN3[i - 1];
                return (
                  <g key={`m3-${i}`}>
                    {prev !== null && i > 0 && (
                      <line x1={sx(i - 1)} y1={sy(prev)} x2={sx(i)} y2={sy(v)}
                        stroke="#ef4444" strokeWidth={1.5} opacity={0.8} />
                    )}
                  </g>
                );
              })}

              {/* window=5 */}
              {MEAN5.map((v, i) => {
                if (v === null) return null;
                const prev = MEAN5[i - 1];
                return (
                  <g key={`m5c-${i}`}>
                    {prev !== null && i > 0 && (
                      <line x1={sx(i - 1)} y1={sy(prev)} x2={sx(i)} y2={sy(v)}
                        stroke="#3b82f6" strokeWidth={1.5} opacity={0.8} />
                    )}
                  </g>
                );
              })}

              {/* 범례 */}
              <rect x={370} y={15} width={100} height={40} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
              <line x1={375} y1={28} x2={390} y2={28} stroke="#ef4444" strokeWidth={1.5} />
              <text x={395} y={31} fontSize={8} fill="var(--foreground)">w=3 (민감)</text>
              <line x1={375} y1={42} x2={390} y2={42} stroke="#3b82f6" strokeWidth={1.5} />
              <text x={395} y={45} fontSize={8} fill="var(--foreground)">w=5 (부드러움)</text>

              <motion.text x={240} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                작은 윈도우 = 빠른 반응, 큰 윈도우 = 안정적 추세
              </motion.text>
            </motion.g>
          )}

          {/* Step 3: EMA */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* SMA */}
              {MEAN5.map((v, i) => {
                if (v === null) return null;
                const prev = MEAN5[i - 1];
                return (
                  <g key={`sma-${i}`}>
                    {prev !== null && i > 0 && (
                      <line x1={sx(i - 1)} y1={sy(prev)} x2={sx(i)} y2={sy(v)}
                        stroke="#94a3b8" strokeWidth={1.2} strokeDasharray="3 2" />
                    )}
                  </g>
                );
              })}

              {/* EMA */}
              {EMA5.map((v, i) => (
                <g key={`ema-${i}`}>
                  {i > 0 && (
                    <motion.line x1={sx(i - 1)} y1={sy(EMA5[i - 1])} x2={sx(i)} y2={sy(v)}
                      stroke="#8b5cf6" strokeWidth={2}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ ...sp, delay: i * 0.03 }} />
                  )}
                </g>
              ))}

              {/* 가중치 시각화 (i=10 기준) */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <text x={350} y={20} fontSize={8} fontWeight={600} fill="#8b5cf6">EMA 가중치 분포</text>
                {[1.0, 0.67, 0.44, 0.30, 0.20].map((w, i) => (
                  <g key={`w-${i}`}>
                    <rect x={350 + i * 22} y={30} width={18} height={w * 40} rx={2} fill="#8b5cf6" fillOpacity={0.15 + w * 0.5} />
                    <text x={359 + i * 22} y={30 + w * 40 + 10} textAnchor="middle" fontSize={7} fill="#8b5cf6">t-{i}</text>
                  </g>
                ))}
              </motion.g>

              <rect x={350} y={95} width={100} height={32} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
              <line x1={355} y1={105} x2={370} y2={105} stroke="#8b5cf6" strokeWidth={2} />
              <text x={375} y={108} fontSize={8} fill="var(--foreground)">EMA</text>
              <line x1={355} y1={118} x2={370} y2={118} stroke="#94a3b8" strokeWidth={1.2} strokeDasharray="3 2" />
              <text x={375} y={121} fontSize={8} fill="var(--muted-foreground)">SMA</text>
            </motion.g>
          )}

          {/* Step 4: 롤링 최대/최소 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {RAW.map((_, i) => {
                if (i < 4) return null;
                const win = RAW.slice(i - 4, i + 1);
                const mx = Math.max(...win);
                const mn = Math.min(...win);
                return (
                  <motion.g key={`mm-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.03 }}>
                    <line x1={sx(i)} y1={sy(mx)} x2={sx(i)} y2={sy(mn)}
                      stroke="#10b981" strokeWidth={2.5} opacity={0.2} />
                    <circle cx={sx(i)} cy={sy(mx)} r={2} fill="#ef4444" opacity={0.7} />
                    <circle cx={sx(i)} cy={sy(mn)} r={2} fill="#3b82f6" opacity={0.7} />
                  </motion.g>
                );
              })}

              <rect x={370} y={15} width={100} height={48} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
              <circle cx={380} cy={28} r={2} fill="#ef4444" />
              <text x={388} y={31} fontSize={8} fill="var(--foreground)">rolling max</text>
              <circle cx={380} cy={42} r={2} fill="#3b82f6" />
              <text x={388} y={45} fontSize={8} fill="var(--foreground)">rolling min</text>
              <rect x={377} y={50} width={6} height={6} rx={1} fill="#10b981" opacity={0.3} />
              <text x={388} y={56} fontSize={7} fill="var(--muted-foreground)">range 밴드</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
