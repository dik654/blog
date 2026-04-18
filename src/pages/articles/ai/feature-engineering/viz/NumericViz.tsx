import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './NumericVizData';

/* 분포 시뮬레이션을 위한 포인트 생성 */
const gaussian = (n: number, mu: number, sigma: number, baseY: number) =>
  Array.from({ length: n }, (_, i) => {
    const x = mu + (i - n / 2) * sigma * 0.3;
    const y = baseY - Math.exp(-0.5 * ((i - n / 2) / (n / 4)) ** 2) * 50;
    return { x, y };
  });

const rawDist = gaussian(30, 180, 40, 170);
const stdDist = gaussian(30, 260, 30, 170);

/* 오른쪽 치우친 분포 (로그 전) */
const skewedPts = Array.from({ length: 25 }, (_, i) => ({
  x: 60 + i * 14,
  y: 170 - Math.exp(-i * 0.15) * 80 * (1 + Math.random() * 0.2),
}));

/* 로그 변환 후 */
const logPts = Array.from({ length: 25 }, (_, i) => ({
  x: 60 + i * 14,
  y: 170 - Math.exp(-0.5 * ((i - 12) / 6) ** 2) * 60,
}));

const pts = (arr: { x: number; y: number }[]) => arr.map(p => `${p.x},${p.y}`).join(' ');

export default function NumericViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: StandardScaler */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={120} y={25} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">원본 분포</text>
              <polyline points={pts(rawDist)} fill="none" stroke={COLORS.standard} strokeWidth={2} opacity={0.5} />
              <text x={370} y={25} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">StandardScaler 후</text>
              <motion.polyline points={pts(stdDist)} fill="none" stroke={COLORS.standard} strokeWidth={2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }} />
              <ActionBox x={200} y={60} w={85} h={36} label="z = (x-μ)/σ" sub="StandardScaler" color={COLORS.standard} />
              <line x1={170} y1={90} x2={200} y2={80} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowN)" />
              <line x1={285} y1={80} x2={320} y2={90} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowN)" />
              {/* 축 */}
              <line x1={50} y1={175} x2={450} y2={175} stroke="var(--border)" strokeWidth={0.5} />
              <text x={260} y={200} textAnchor="middle" fontSize={9} fill={COLORS.standard} fontWeight={600}>
                평균=0, 표준편차=1로 정규화
              </text>
            </motion.g>
          )}

          {/* Step 1: MinMaxScaler */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Number line visualization */}
              <text x={260} y={25} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">값 범위 압축</text>
              {/* Original range */}
              <line x1={40} y1={70} x2={480} y2={70} stroke="var(--border)" strokeWidth={1} />
              <text x={40} y={60} fontSize={9} fill="var(--muted-foreground)">0</text>
              <text x={480} y={60} fontSize={9} fill="var(--muted-foreground)" textAnchor="end">100,000</text>
              {[15, 22, 35, 180, 460].map((px, i) => (
                <motion.circle key={i} cx={40 + px * 0.9} cy={70} r={4} fill={COLORS.minmax}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                  transition={{ ...sp, delay: i * 0.08 }} />
              ))}
              <text x={260} y={95} textAnchor="middle" fontSize={9} fill="var(--foreground)">이상치 하나 때문에 나머지 값이 한쪽에 몰림</text>
              {/* Compressed range */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <line x1={40} y1={145} x2={480} y2={145} stroke="var(--border)" strokeWidth={1} />
                <text x={40} y={135} fontSize={9} fill="var(--muted-foreground)">0.0</text>
                <text x={480} y={135} fontSize={9} fill="var(--muted-foreground)" textAnchor="end">1.0</text>
                {[40, 52, 62, 75, 480].map((px, i) => (
                  <circle key={i} cx={px} cy={145} r={4} fill={COLORS.minmax} opacity={0.8} />
                ))}
                <text x={260} y={175} textAnchor="middle" fontSize={9} fill={COLORS.minmax} fontWeight={600}>
                  (x - min) / (max - min) → 0~1
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: RobustScaler */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Box plot style visualization */}
              <text x={260} y={25} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">IQR 기반 스케일링</text>
              {/* Box plot */}
              <line x1={80} y1={80} x2={440} y2={80} stroke="var(--border)" strokeWidth={0.5} />
              {/* Whiskers */}
              <line x1={120} y1={70} x2={120} y2={90} stroke={COLORS.robust} strokeWidth={1.5} />
              <line x1={360} y1={70} x2={360} y2={90} stroke={COLORS.robust} strokeWidth={1.5} />
              <line x1={120} y1={80} x2={180} y2={80} stroke={COLORS.robust} strokeWidth={1.5} />
              <line x1={300} y1={80} x2={360} y2={80} stroke={COLORS.robust} strokeWidth={1.5} />
              {/* Box (Q1-Q3) */}
              <rect x={180} y={65} width={120} height={30} rx={3} fill={`${COLORS.robust}20`} stroke={COLORS.robust} strokeWidth={1.5} />
              {/* Median */}
              <line x1={240} y1={65} x2={240} y2={95} stroke={COLORS.robust} strokeWidth={2} />
              {/* Outliers */}
              <circle cx={440} cy={80} r={5} fill="none" stroke="#ef4444" strokeWidth={1.5} />
              <circle cx={80} cy={80} r={5} fill="none" stroke="#ef4444" strokeWidth={1.5} />
              {/* Labels */}
              <text x={180} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Q1</text>
              <text x={240} y={110} textAnchor="middle" fontSize={8} fill={COLORS.robust} fontWeight={600}>중앙값</text>
              <text x={300} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Q3</text>
              <text x={440} y={110} textAnchor="middle" fontSize={8} fill="#ef4444">이상치</text>
              {/* Formula */}
              <DataBox x={170} y={130} w={160} h={30} label="(x - median) / IQR" sub="이상치 영향 최소화" color={COLORS.robust} />
              <text x={260} y={190} textAnchor="middle" fontSize={9} fill={COLORS.robust} fontWeight={600}>
                중앙값과 IQR(Q3-Q1)만 사용 → 이상치에 강건
              </text>
            </motion.g>
          )}

          {/* Step 3: Log transform */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={130} y={20} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">치우친 분포 (원본)</text>
              <polyline points={pts(skewedPts)} fill="none" stroke="#ef4444" strokeWidth={1.8} opacity={0.6} />
              <text x={390} y={20} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">log(1+x) 후</text>
              <motion.polyline points={pts(logPts.map(p => ({ x: p.x + 240, y: p.y })))} fill="none"
                stroke={COLORS.log} strokeWidth={1.8}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }} />
              <ActionBox x={210} y={65} w={90} h={36} label="log(1 + x)" sub="로그 변환" color={COLORS.log} />
              <line x1={50} y1={175} x2={210} y2={175} stroke="var(--border)" strokeWidth={0.5} />
              <line x1={300} y1={175} x2={480} y2={175} stroke="var(--border)" strokeWidth={0.5} />
              <text x={260} y={200} textAnchor="middle" fontSize={9} fill={COLORS.log} fontWeight={600}>
                소득, 가격, 조회수 등 오른쪽 꼬리가 긴 분포에 효과적
              </text>
            </motion.g>
          )}

          {/* Step 4: Binning */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={25} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">연속 → 구간(범주) 변환</text>
              {/* Continuous number line */}
              <line x1={40} y1={60} x2={480} y2={60} stroke="var(--border)" strokeWidth={1} />
              {[18, 23, 27, 31, 35, 42, 48, 55, 63, 71].map((v, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.05 }}>
                  <circle cx={40 + (v - 15) * 7.2} cy={60} r={3} fill={COLORS.bin} opacity={0.7} />
                  <text x={40 + (v - 15) * 7.2} y={53} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{v}</text>
                </motion.g>
              ))}
              {/* Binned groups */}
              {[
                { label: '10대', range: '15-19', x: 45, w: 35, color: '#818cf8' },
                { label: '20대', range: '20-29', x: 85, w: 80, color: '#6366f1' },
                { label: '30대', range: '30-39', x: 170, w: 75, color: '#4f46e5' },
                { label: '40대', range: '40-49', x: 250, w: 75, color: '#4338ca' },
                { label: '50대', range: '50-59', x: 330, w: 65, color: '#3730a3' },
                { label: '60+', range: '60-75', x: 400, w: 80, color: '#312e81' },
              ].map((bin, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.08 }}>
                  <rect x={bin.x} y={95} width={bin.w} height={28} rx={4} fill={`${bin.color}20`} stroke={bin.color} strokeWidth={1} />
                  <text x={bin.x + bin.w / 2} y={110} textAnchor="middle" fontSize={9} fontWeight={600} fill={bin.color}>{bin.label}</text>
                  <text x={bin.x + bin.w / 2} y={120} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{bin.range}</text>
                </motion.g>
              ))}
              {/* Arrow */}
              <line x1={260} y1={68} x2={260} y2={90} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowN)" />
              <text x={260} y={160} textAnchor="middle" fontSize={9} fill={COLORS.bin} fontWeight={600}>
                수치 노이즈 감소 + 비선형 관계 포착
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arrowN" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
