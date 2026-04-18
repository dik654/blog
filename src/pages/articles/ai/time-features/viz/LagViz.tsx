import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 샘플 시계열 데이터 (판매량) */
const SERIES = [120, 135, 128, 145, 160, 155, 170, 165, 180, 175, 190, 188];
const LABELS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const DIFF = SERIES.map((v, i) => i === 0 ? 0 : v - SERIES[i - 1]);

/* ACF 바 데이터 */
const ACF = [1.0, 0.85, 0.68, 0.50, 0.32, 0.18, 0.05, -0.04];

const scaleX = (i: number) => 55 + i * 32;
const scaleY = (v: number) => 140 - (v - 100) * 1.1;
const diffY = (v: number) => 130 - v * 2;

const STEPS = [
  {
    label: '래그 피처 — y(t-1), y(t-2)',
    body: '래그(lag) 피처는 이전 시점의 값을 현재 행의 열로 가져오는 것.\ny(t-1)은 "한 시점 전 값", y(t-2)는 "두 시점 전 값"이다.',
  },
  {
    label: '래그 피처 테이블 구성',
    body: '원본 시계열에서 shift 연산으로 래그 열을 생성.\nlag-1은 pd.Series.shift(1), lag-2는 shift(2). 초기 행은 NaN → 제거 또는 대체.',
  },
  {
    label: '차분(Differencing) — 변화량 포착',
    body: 'diff(t) = y(t) - y(t-1). 값 자체가 아닌 "얼마나 변했는가"를 포착.\n추세 제거 효과 — 비정상 시계열을 정상 시계열로 변환.',
  },
  {
    label: '자기상관(ACF)으로 최적 래그 선택',
    body: 'ACF(AutoCorrelation Function) — 시차별 상관계수.\nACF가 높은 래그를 선택하면 예측력이 높은 피처를 얻는다.',
  },
];

export default function LagViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 시계열 + 래그 화살표 시각화 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 축 */}
              <line x1={50} y1={150} x2={440} y2={150} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <line x1={50} y1={30} x2={50} y2={150} stroke="var(--muted-foreground)" strokeWidth={0.5} />

              {/* 시계열 선 */}
              {SERIES.map((v, i) => (
                <g key={i}>
                  {i > 0 && (
                    <line x1={scaleX(i - 1)} y1={scaleY(SERIES[i - 1])} x2={scaleX(i)} y2={scaleY(v)}
                      stroke="#6366f1" strokeWidth={1.5} />
                  )}
                  <circle cx={scaleX(i)} cy={scaleY(v)} r={3} fill="#6366f1" />
                  <text x={scaleX(i)} y={160} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{LABELS[i]}</text>
                </g>
              ))}

              {/* 래그 화살표 — t=6 기준 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                {/* t 기준점 강조 */}
                <circle cx={scaleX(6)} cy={scaleY(SERIES[6])} r={5} fill="none" stroke="#ef4444" strokeWidth={1.5} />
                <text x={scaleX(6)} y={scaleY(SERIES[6]) - 10} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ef4444">y(t)</text>

                {/* lag-1 화살표 */}
                <motion.path d={`M${scaleX(6)},${scaleY(SERIES[6]) + 8} Q${scaleX(5.5)},${scaleY(SERIES[6]) + 25} ${scaleX(5)},${scaleY(SERIES[5]) + 8}`}
                  fill="none" stroke="#3b82f6" strokeWidth={1.2} strokeDasharray="4 2" markerEnd="url(#lagArr)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.4 }} />
                <text x={scaleX(5)} y={scaleY(SERIES[5]) - 10} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3b82f6">y(t-1)</text>

                {/* lag-2 화살표 */}
                <motion.path d={`M${scaleX(6)},${scaleY(SERIES[6]) + 10} Q${scaleX(5)},${scaleY(SERIES[6]) + 40} ${scaleX(4)},${scaleY(SERIES[4]) + 8}`}
                  fill="none" stroke="#10b981" strokeWidth={1.2} strokeDasharray="4 2" markerEnd="url(#lagArr2)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, delay: 0.55 }} />
                <text x={scaleX(4)} y={scaleY(SERIES[4]) - 10} textAnchor="middle" fontSize={8} fontWeight={600} fill="#10b981">y(t-2)</text>
              </motion.g>

              <defs>
                <marker id="lagArr" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill="#3b82f6" />
                </marker>
                <marker id="lagArr2" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill="#10b981" />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* Step 1: 래그 피처 테이블 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 테이블 헤더 */}
              {['t', 'y(t)', 'lag-1', 'lag-2'].map((h, ci) => (
                <g key={h}>
                  <rect x={80 + ci * 85} y={15} width={80} height={22} rx={4} fill="#6366f120" stroke="#6366f1" strokeWidth={0.5} />
                  <text x={120 + ci * 85} y={30} textAnchor="middle" fontSize={9} fontWeight={700} fill="#6366f1">{h}</text>
                </g>
              ))}

              {/* 데이터 행 */}
              {[3, 4, 5, 6, 7].map((ti, ri) => {
                const lag1 = ti >= 1 ? SERIES[ti - 1] : '—';
                const lag2 = ti >= 2 ? SERIES[ti - 2] : '—';
                const vals = [LABELS[ti], SERIES[ti], lag1, lag2];
                const highlight = ti === 6;
                return (
                  <motion.g key={ti} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: ri * 0.08 }}>
                    {vals.map((v, ci) => (
                      <g key={ci}>
                        <rect x={80 + ci * 85} y={42 + ri * 24} width={80} height={20} rx={3}
                          fill={highlight ? '#ef444415' : 'var(--card)'} stroke="var(--border)" strokeWidth={0.3} />
                        <text x={120 + ci * 85} y={56 + ri * 24} textAnchor="middle" fontSize={9}
                          fill={highlight ? '#ef4444' : 'var(--foreground)'} fontWeight={highlight ? 600 : 400}>{v}</text>
                      </g>
                    ))}
                  </motion.g>
                );
              })}

              {/* 설명 */}
              <motion.text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                shift(1): 한 칸 아래로 밀기 → lag-1 열 생성 | shift(2): 두 칸 → lag-2
              </motion.text>
            </motion.g>
          )}

          {/* Step 2: 차분 시각화 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 원본 시계열 (상단) */}
              <text x={50} y={18} fontSize={8} fontWeight={600} fill="#6366f1">원본 y(t)</text>
              <line x1={50} y1={80} x2={440} y2={80} stroke="var(--muted-foreground)" strokeWidth={0.3} />
              {SERIES.map((v, i) => (
                <g key={`orig-${i}`}>
                  {i > 0 && <line x1={scaleX(i - 1)} y1={80 - (SERIES[i - 1] - 140) * 0.8} x2={scaleX(i)} y2={80 - (v - 140) * 0.8}
                    stroke="#6366f1" strokeWidth={1.2} opacity={0.5} />}
                  <circle cx={scaleX(i)} cy={80 - (v - 140) * 0.8} r={2} fill="#6366f1" opacity={0.5} />
                </g>
              ))}

              {/* 차분 (하단) */}
              <text x={50} y={105} fontSize={8} fontWeight={600} fill="#10b981">차분 diff(t)</text>
              <line x1={50} y1={diffY(0)} x2={440} y2={diffY(0)} stroke="var(--muted-foreground)" strokeWidth={0.3} strokeDasharray="3 2" />
              {DIFF.map((v, i) => {
                if (i === 0) return null;
                return (
                  <motion.g key={`diff-${i}`} initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ ...sp, delay: i * 0.06 }}>
                    <rect x={scaleX(i) - 6} y={v >= 0 ? diffY(v) : diffY(0)} width={12}
                      height={Math.abs(v) * 2} rx={2}
                      fill={v >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.6} />
                    <text x={scaleX(i)} y={diffY(0) + 20} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                      {v > 0 ? `+${v}` : v}
                    </text>
                  </motion.g>
                );
              })}

              <motion.text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
                차분 = y(t) - y(t-1) | 양수 = 증가, 음수 = 감소 | 추세 제거 효과
              </motion.text>
            </motion.g>
          )}

          {/* Step 3: ACF 시각화 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                자기상관 함수 (ACF)
              </text>
              <text x={240} y={32} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                각 시차(lag)에서의 상관계수
              </text>

              {/* ACF 축 */}
              <line x1={80} y1={110} x2={420} y2={110} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <line x1={80} y1={45} x2={80} y2={160} stroke="var(--muted-foreground)" strokeWidth={0.5} />

              {/* 신뢰 구간 */}
              <rect x={80} y={110 - 0.3 * 60} width={340} height={0.6 * 60} rx={2} fill="#3b82f608" stroke="#3b82f6" strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={425} y={113} fontSize={7} fill="#3b82f6">95% CI</text>

              {/* ACF 바 */}
              {ACF.map((v, i) => {
                const barX = 100 + i * 40;
                const barH = Math.abs(v) * 60;
                const positive = v >= 0;
                return (
                  <motion.g key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                    transition={{ ...sp, delay: i * 0.08 }}
                    style={{ transformOrigin: `${barX + 12}px 110px` }}>
                    <rect x={barX} y={positive ? 110 - barH : 110} width={24} height={barH} rx={3}
                      fill={i <= 2 ? '#3b82f6' : i <= 5 ? '#f59e0b' : '#94a3b8'} fillOpacity={0.7} />
                    <text x={barX + 12} y={positive ? 110 - barH - 4 : 110 + barH + 10} textAnchor="middle"
                      fontSize={8} fontWeight={600} fill={i <= 2 ? '#3b82f6' : i <= 5 ? '#f59e0b' : '#94a3b8'}>
                      {v.toFixed(2)}
                    </text>
                    <text x={barX + 12} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                      lag-{i}
                    </text>
                  </motion.g>
                );
              })}

              {/* 선택 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                <rect x={96} y={42} width={112} height={130} rx={4} fill="none" stroke="#3b82f6" strokeWidth={1.2} strokeDasharray="4 2" />
                <text x={152} y={38} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3b82f6">ACF 높음 → 피처로 선택</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
