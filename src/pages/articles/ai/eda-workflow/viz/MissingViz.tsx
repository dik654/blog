import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { STEPS, COLORS } from './MissingData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 결측 패턴 매트릭스 (1=존재, 0=결측) */
const matrixData = {
  features: ['주문량', '로봇수', '센서A', '배터리', '혼잡도', '센서B'],
  /* 12행 × 6열, 각 셀의 존재/결측 */
  mcar: [
    [1, 1, 0, 1, 1, 1], [1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1], [1, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 1], [1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1], [1, 0, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1],
  ],
  mar: [
    [1, 1, 0, 0, 1, 1], [1, 1, 0, 0, 1, 1], [1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 0, 0, 1, 1],
  ],
  mnar: [
    [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 1, 0], [1, 1, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 1, 0], [1, 1, 1, 0, 1, 0],
    [1, 1, 1, 0, 1, 0], [1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 1, 0],
  ],
};

const cellW = 40;
const cellH = 14;
const matOx = 120;
const matOy = 55;

function Matrix({ data, highlightCols }: { data: number[][]; highlightCols?: number[] }) {
  return (
    <g>
      {/* 열 헤더 */}
      {matrixData.features.map((f, c) => (
        <text key={f} x={matOx + c * cellW + cellW / 2} y={matOy - 5} textAnchor="middle"
          fontSize={8} fontWeight={highlightCols?.includes(c) ? 700 : 400}
          fill={highlightCols?.includes(c) ? COLORS.missing : 'var(--foreground)'}>{f}</text>
      ))}
      {/* 행 인덱스 */}
      {data.map((_, r) => (
        <text key={r} x={matOx - 8} y={matOy + r * cellH + cellH / 2 + 3} textAnchor="end"
          fontSize={7} fill="var(--muted-foreground)">{r + 1}</text>
      ))}
      {/* 셀 */}
      {data.map((row, r) =>
        row.map((v, c) => (
          <motion.rect key={`${r}-${c}`}
            x={matOx + c * cellW + 1} y={matOy + r * cellH + 1}
            width={cellW - 2} height={cellH - 2} rx={2}
            fill={v === 1 ? COLORS.present : COLORS.missing}
            opacity={v === 1 ? 0.25 : 0.7}
            initial={{ opacity: 0 }} animate={{ opacity: v === 1 ? 0.25 : 0.7 }}
            transition={{ ...sp, delay: (r * 6 + c) * 0.005 }} />
        ))
      )}
    </g>
  );
}

export default function MissingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={260} y={20} textAnchor="middle" fontSize={12} fontWeight={700}
            fill="var(--foreground)">결측 패턴 시각화</text>

          {/* 범례 */}
          <rect x={420} y={35} width={12} height={12} rx={2} fill={COLORS.present} opacity={0.25} />
          <text x={436} y={45} fontSize={8} fill="var(--muted-foreground)">존재</text>
          <rect x={465} y={35} width={12} height={12} rx={2} fill={COLORS.missing} opacity={0.7} />
          <text x={481} y={45} fontSize={8} fill="var(--muted-foreground)">결측</text>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.mcar}>
                MCAR: 결측이 무작위로 흩어져 있음</text>
              <Matrix data={matrixData.mcar} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={140} y={230} width={240} height={24} rx={6} fill="var(--card)" stroke={COLORS.mcar} strokeWidth={0.8} />
                <text x={260} y={246} textAnchor="middle" fontSize={9} fill={COLORS.mcar}>
                  어떤 패턴도 없음 → 단순 대체 or 제거 가능</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.mar}>
                MAR: 센서A와 배터리가 함께 결측 (로봇 타입 B에서만)</text>
              <Matrix data={matrixData.mar} highlightCols={[2, 3]} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={100} y={230} width={320} height={24} rx={6} fill="var(--card)" stroke={COLORS.mar} strokeWidth={0.8} />
                <text x={260} y={246} textAnchor="middle" fontSize={9} fill={COLORS.mar}>
                  로봇 타입이 결측을 결정 → 그룹별 대체(KNN/Iterative) 적합</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.mnar}>
                MNAR: 배터리 낮을 때 배터리·센서B 결측</text>
              <Matrix data={matrixData.mnar} highlightCols={[3, 5]} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={90} y={230} width={340} height={24} rx={6} fill="var(--card)" stroke={COLORS.mnar} strokeWidth={0.8} />
                <text x={260} y={246} textAnchor="middle" fontSize={9} fill={COLORS.mnar}>
                  결측 자체가 "배터리 부족" 신호 → is_missing 이진 피처 필수</text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.strategy}>
                결측 처리 의사결정 트리</text>
              {/* 루트 */}
              <rect x={195} y={60} width={130} height={28} rx={8} fill="var(--card)" stroke={COLORS.strategy} strokeWidth={1} />
              <text x={260} y={78} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.strategy}>결측률 확인</text>
              {/* 좌: 50%+ */}
              <line x1={220} y1={88} x2={120} y2={110} stroke="var(--border)" strokeWidth={0.8} />
              <rect x={55} y={110} width={130} height={28} rx={8} fill="var(--card)" stroke={COLORS.missing} strokeWidth={0.8} />
              <text x={120} y={128} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.missing}>50%+ → 피처 제거</text>
              <text x={120} y={148} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">(is_missing만 남길 수 있음)</text>
              {/* 우: 50% 미만 → 메커니즘 확인 */}
              <line x1={300} y1={88} x2={390} y2={110} stroke="var(--border)" strokeWidth={0.8} />
              <rect x={325} y={110} width={130} height={28} rx={8} fill="var(--card)" stroke={COLORS.strategy} strokeWidth={0.8} />
              <text x={390} y={128} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.strategy}>{'<'}50% → 메커니즘?</text>
              {/* MCAR */}
              <line x1={355} y1={138} x2={290} y2={160} stroke="var(--border)" strokeWidth={0.8} />
              <rect x={220} y={160} width={140} height={26} rx={6} fill="var(--card)" stroke={COLORS.mcar} strokeWidth={0.8} />
              <text x={290} y={177} textAnchor="middle" fontSize={8} fill={COLORS.mcar}>MCAR → 중앙값/평균</text>
              {/* MAR */}
              <line x1={390} y1={138} x2={390} y2={160} stroke="var(--border)" strokeWidth={0.8} />
              <rect x={325} y={160} width={130} height={26} rx={6} fill="var(--card)" stroke={COLORS.mar} strokeWidth={0.8} />
              <text x={390} y={177} textAnchor="middle" fontSize={8} fill={COLORS.mar}>MAR → KNN/Iterative</text>
              {/* MNAR */}
              <line x1={425} y1={138} x2={480} y2={160} stroke="var(--border)" strokeWidth={0.8} />
              <rect x={420} y={160} width={95} height={38} rx={6} fill="var(--card)" stroke={COLORS.mnar} strokeWidth={0.8} />
              <text x={467} y={176} textAnchor="middle" fontSize={8} fill={COLORS.mnar}>MNAR →</text>
              <text x={467} y={190} textAnchor="middle" fontSize={7.5} fill={COLORS.mnar}>is_missing + 대체</text>

              <text x={260} y={225} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                GBM은 결측을 자체 처리하지만, is_missing 피처 추가가 성능을 높이는 경우가 많다
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
