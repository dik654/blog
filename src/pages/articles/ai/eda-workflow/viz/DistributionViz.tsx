import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { STEPS, COLORS } from './DistributionData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 오른쪽 치우친 분포 막대 높이 */
const skewedH = [8, 28, 55, 72, 60, 40, 22, 12, 7, 4, 2, 1];
/* 로그 변환 후 분포 */
const logH = [5, 15, 35, 55, 65, 60, 45, 30, 18, 8, 4, 2];
/* 이봉형 분포 */
const bimodalH = [10, 35, 55, 40, 12, 8, 15, 45, 60, 35, 10, 3];

const barW = 14;
const barGap = 18;
const baseY = 185;

function Bars({ heights, color, offsetX = 60 }: { heights: number[]; color: string; offsetX?: number }) {
  return (
    <g>
      {heights.map((h, i) => (
        <motion.rect key={i} x={offsetX + i * barGap} y={baseY - h} width={barW} height={h}
          rx={2} fill={color} opacity={0.7}
          initial={{ height: 0, y: baseY }} animate={{ height: h, y: baseY - h }}
          transition={{ ...sp, delay: i * 0.03 }} />
      ))}
    </g>
  );
}

export default function DistributionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={180} y={24} textAnchor="middle" fontSize={11} fontWeight={600}
                fill={COLORS.original}>avg_delay_minutes 분포</text>
              <Bars heights={skewedH} color={COLORS.original} />
              {/* 축 */}
              <line x1={55} y1={baseY + 2} x2={55 + 12 * barGap} y2={baseY + 2} stroke="var(--border)" strokeWidth={0.5} />
              <text x={60} y={baseY + 14} fontSize={7} fill="var(--muted-foreground)">0</text>
              <text x={60 + 5 * barGap} y={baseY + 14} fontSize={7} fill="var(--muted-foreground)">25</text>
              <text x={60 + 11 * barGap} y={baseY + 14} fontSize={7} fill="var(--muted-foreground)">55+</text>
              {/* skewness 표시 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={330} y={40} width={160} height={55} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={410} y={58} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.original}>skewness = 1.8</text>
                <text x={410} y={74} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">강한 양의 치우침</text>
                <text x={410} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">→ 로그 변환 필요</text>
              </motion.g>
              {/* 꼬리 화살표 */}
              <motion.path d={`M ${60 + 8 * barGap} ${baseY - 15} Q ${60 + 10 * barGap} ${baseY - 35} ${60 + 11 * barGap} ${baseY - 5}`}
                fill="none" stroke={COLORS.outlier} strokeWidth={1} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.5 }} />
              <text x={60 + 10 * barGap} y={baseY - 38} fontSize={8} fill={COLORS.outlier}>긴 꼬리</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 변환 전 (왼쪽) */}
              <text x={140} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.original}>
                원본 (skew=1.8)</text>
              <g transform="scale(0.55) translate(10, 30)">
                <Bars heights={skewedH} color={COLORS.original} />
              </g>
              {/* 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <text x={260} y={80} textAnchor="middle" fontSize={20} fill="var(--muted-foreground)">→</text>
                <text x={260} y={95} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.transformed}>
                  log1p(y)</text>
              </motion.g>
              {/* 변환 후 (오른쪽) */}
              <text x={400} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.transformed}>
                변환 후 (skew=0.3)</text>
              <g transform="translate(270, 0)">
                <Bars heights={logH} color={COLORS.transformed} offsetX={60} />
              </g>
              <line x1={55} y1={baseY + 2} x2={500} y2={baseY + 2} stroke="var(--border)" strokeWidth={0.5} />
              <text x={260} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                변환 후 RMSE로 학습 → 제출 시 expm1()으로 역변환
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={200} y={24} textAnchor="middle" fontSize={11} fontWeight={600} fill={COLORS.iqr}>
                IQR 이상치 탐지</text>
              <Bars heights={skewedH} color="#94a3b8" />
              {/* IQR 범위 표시 */}
              <motion.rect x={60 + 2 * barGap} y={30} width={4 * barGap} height={baseY - 28} rx={0}
                fill={COLORS.iqr} opacity={0.08}
                initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ ...sp, delay: 0.3 }} />
              <motion.line x1={60 + 2 * barGap} y1={35} x2={60 + 2 * barGap} y2={baseY}
                stroke={COLORS.iqr} strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.3 }} />
              <motion.line x1={60 + 6 * barGap} y1={35} x2={60 + 6 * barGap} y2={baseY}
                stroke={COLORS.iqr} strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.4 }} />
              <text x={60 + 2 * barGap} y={30} fontSize={8} fill={COLORS.iqr}>Q1-1.5×IQR</text>
              <text x={60 + 6 * barGap} y={30} fontSize={8} fill={COLORS.iqr}>Q3+1.5×IQR</text>
              {/* 이상치 영역 */}
              {[8, 9, 10, 11].map(i => (
                <motion.rect key={i} x={60 + i * barGap} y={baseY - skewedH[i]} width={barW} height={skewedH[i]}
                  rx={2} fill={COLORS.outlier} opacity={0.8}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ ...sp, delay: 0.5 + i * 0.05 }} />
              ))}
              {/* 판단 옵션 */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={330} y={60} width={170} height={90} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={415} y={80} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">이상치 처리 옵션</text>
                <text x={345} y={98} fontSize={8} fill={COLORS.outlier}>1. 제거: 노이즈일 때</text>
                <text x={345} y={112} fontSize={8} fill={COLORS.iqr}>2. 클리핑: 99%ile로 상한</text>
                <text x={345} y={126} fontSize={8} fill={COLORS.transformed}>3. 유지: 의미 있는 극단값</text>
                <text x={345} y={140} fontSize={8} fill="var(--muted-foreground)">→ 도메인 지식으로 판단</text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={90} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.iqr}>정규형</text>
              <g transform="scale(0.42) translate(-15, 45)">
                {[0, 1, 2, 3, 4, 5, 6].map(i => {
                  const h = [10, 30, 55, 65, 55, 30, 10];
                  return <motion.rect key={i} x={40 + i * 20} y={baseY - h[i]} width={16} height={h[i]}
                    rx={2} fill={COLORS.iqr} opacity={0.7}
                    initial={{ height: 0, y: baseY }} animate={{ height: h[i], y: baseY - h[i] }}
                    transition={{ ...sp, delay: i * 0.03 }} />;
                })}
              </g>
              <text x={90} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">StandardScaler</text>

              <text x={260} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.original}>치우침형</text>
              <g transform="scale(0.42) translate(395, 45)">
                <Bars heights={skewedH} color={COLORS.original} />
              </g>
              <text x={260} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">log/Box-Cox 후 표준화</text>

              <text x={430} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.bimodal}>이봉형</text>
              <g transform="scale(0.42) translate(815, 45)">
                <Bars heights={bimodalH} color={COLORS.bimodal} />
              </g>
              <text x={430} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이진 피처 파생 후보</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={60} y={130} width={400} height={70} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={150} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                  분포별 전처리 전략</text>
                <text x={100} y={168} fontSize={9} fill={COLORS.iqr}>정규: 그대로 사용</text>
                <text x={250} y={168} fontSize={9} fill={COLORS.original}>치우침: 변환 필수</text>
                <text x={400} y={168} fontSize={9} fill={COLORS.bimodal}>이봉: 그룹 분리</text>
                <text x={260} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  GBM은 분포에 무관하지만, 신경망·회귀 모델은 정규성 가정에 민감
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
