import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './AggregationVizData';

export default function AggregationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Basic GroupBy */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">GroupBy: 그룹별 통계량 → 행 단위 피처</text>
              {/* Raw table */}
              <ModuleBox x={20} y={35} w={130} h={135} label="주문 테이블" sub="" color={COLORS.group} />
              {[
                { user: 'A', amount: '15,000' },
                { user: 'A', amount: '22,000' },
                { user: 'B', amount: '8,000' },
                { user: 'A', amount: '18,000' },
                { user: 'B', amount: '12,000' },
              ].map((row, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.06 }}>
                  <text x={40} y={73 + i * 20} fontSize={8} fill={row.user === 'A' ? COLORS.group : COLORS.agg}>{row.user}</text>
                  <text x={100} y={73 + i * 20} textAnchor="end" fontSize={8} fill="var(--foreground)">{row.amount}</text>
                </motion.g>
              ))}
              {/* Arrow */}
              <ActionBox x={175} y={75} w={85} h={38} label="GroupBy" sub="user별 mean" color={COLORS.agg} />
              <line x1={155} y1={100} x2={175} y2={94} stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <line x1={265} y1={94} x2={295} y2={94} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowA)" />
              {/* Result */}
              <ModuleBox x={300} y={50} w={190} h={115} label="결과 (merge)" sub="" color={COLORS.agg} />
              {[
                { user: 'A', amount: '15,000', avg: '18,333' },
                { user: 'A', amount: '22,000', avg: '18,333' },
                { user: 'B', amount: '8,000', avg: '10,000' },
                { user: 'A', amount: '18,000', avg: '18,333' },
                { user: 'B', amount: '12,000', avg: '10,000' },
              ].map((row, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.06 }}>
                  <text x={315} y={88 + i * 16} fontSize={8} fill="var(--foreground)">{row.user}</text>
                  <text x={370} y={88 + i * 16} textAnchor="end" fontSize={8} fill="var(--foreground)">{row.amount}</text>
                  <text x={470} y={88 + i * 16} textAnchor="end" fontSize={8} fontWeight={600} fill={COLORS.agg}>{row.avg}</text>
                </motion.g>
              ))}
              <text x={430} y={73} textAnchor="middle" fontSize={7} fill={COLORS.agg}>user_avg_amt</text>
              <text x={260} y={210} textAnchor="middle" fontSize={9} fill={COLORS.agg} fontWeight={600}>
                개별 행에 그룹 수준 정보(평균 구매액)를 부여
              </text>
            </motion.g>
          )}

          {/* Step 1: Multiple aggregations */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">하나의 GroupBy → 여러 집계</text>
              <DataBox x={30} y={50} w={90} h={32} label="user_id" sub="그룹 키" color={COLORS.group} />
              <line x1={125} y1={66} x2={160} y2={66} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowA)" />
              {/* Multiple agg functions */}
              {[
                { fn: 'mean', desc: '평균', val: '18,333', color: COLORS.agg },
                { fn: 'std', desc: '표준편차', val: '3,512', color: COLORS.window },
                { fn: 'count', desc: '건수', val: '3', color: COLORS.multi },
                { fn: 'min', desc: '최솟값', val: '15,000', color: COLORS.stat },
                { fn: 'max', desc: '최댓값', val: '22,000', color: COLORS.group },
              ].map((agg, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <ActionBox x={170} y={38 + i * 36} w={75} h={30} label={agg.fn} sub={agg.desc} color={agg.color} />
                  <line x1={250} y1={53 + i * 36} x2={290} y2={53 + i * 36} stroke="var(--muted-foreground)" strokeWidth={0.6} markerEnd="url(#arrowA)" />
                  <DataBox x={295} y={38 + i * 36} w={100} h={30} label={`user_${agg.fn}`} sub={agg.val} color={agg.color} outlined />
                </motion.g>
              ))}
              <text x={260} y={225} textAnchor="middle" fontSize={9} fill={COLORS.agg} fontWeight={600}>
                중심·퍼짐·크기를 동시에 포착 — 그룹의 특성을 다면적으로 표현
              </text>
            </motion.g>
          )}

          {/* Step 2: Window functions */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Window 함수: 시간 순서 유지 집계</text>
              {/* Timeline */}
              <line x1={40} y1={80} x2={480} y2={80} stroke="var(--border)" strokeWidth={1} />
              {[
                { day: 'D1', val: 100, y: 100 },
                { day: 'D2', val: 120, y: 100 },
                { day: 'D3', val: 90, y: 100 },
                { day: 'D4', val: 150, y: 100 },
                { day: 'D5', val: 130, y: 100 },
                { day: 'D6', val: 110, y: 100 },
                { day: 'D7', val: 140, y: 100 },
              ].map((d, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <circle cx={60 + i * 62} cy={80} r={4} fill={COLORS.window} />
                  <text x={60 + i * 62} y={70} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{d.day}</text>
                  <text x={60 + i * 62} y={98} textAnchor="middle" fontSize={9} fill="var(--foreground)">{d.val}</text>
                </motion.g>
              ))}
              {/* Window bracket for rolling 3-day */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <rect x={163} y={110} width={190} height={30} rx={4} fill="none" stroke={COLORS.window} strokeWidth={1.5} strokeDasharray="4 2" />
                <text x={258} y={130} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.window}>
                  rolling(3) → mean = 123
                </text>
                <text x={258} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  D5 기준 이전 3일(D3,D4,D5) 이동평균
                </text>
              </motion.g>
              <text x={260} y={210} textAnchor="middle" fontSize={9} fill={COLORS.window} fontWeight={600}>
                시간 순서를 유지하면서 맥락 정보를 행 단위로 부여
              </text>
            </motion.g>
          )}

          {/* Step 3: Multi-level aggregation */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">다단계 집계: 그룹의 그룹</text>
              {/* Level 1 */}
              <ModuleBox x={20} y={45} w={90} h={40} label="사용자" sub="Level 1" color={COLORS.group} />
              {/* Level 2 */}
              <ModuleBox x={150} y={35} w={90} h={40} label="카테고리" sub="Level 2" color={COLORS.multi} />
              <ModuleBox x={150} y={90} w={90} h={40} label="시간대" sub="Level 2" color={COLORS.multi} />
              {/* Arrows */}
              <line x1={115} y1={55} x2={150} y2={55} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowA)" />
              <line x1={115} y1={75} x2={150} y2={110} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrowA)" />
              {/* Agg results */}
              {[
                { label: 'user_cat_mean', sub: '사용자×카테고리별 평균', y: 35 },
                { label: 'user_cat_count', sub: '사용자×카테고리별 건수', y: 70 },
                { label: 'user_hour_mean', sub: '사용자×시간대별 평균', y: 105 },
                { label: 'user_hour_std', sub: '사용자×시간대별 분산', y: 140 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                  <line x1={245} y1={i < 2 ? 55 : 110} x2={290} y2={item.y + 16} stroke="var(--muted-foreground)" strokeWidth={0.6} />
                  <DataBox x={295} y={item.y} w={180} h={28} label={item.label} sub={item.sub} color={COLORS.multi} outlined />
                </motion.g>
              ))}
              <text x={260} y={210} textAnchor="middle" fontSize={9} fill={COLORS.multi} fontWeight={600}>
                계층적 구조에서 세분화된 행동 패턴을 추출
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arrowA" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
