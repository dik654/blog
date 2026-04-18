import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

/* 원형 좌표 계산 */
const circlePoint = (cx: number, cy: number, r: number, angle: number) => ({
  x: cx + r * Math.cos(angle - Math.PI / 2),
  y: cy + r * Math.sin(angle - Math.PI / 2),
});

const STEPS = [
  {
    label: '원-핫 인코딩의 문제',
    body: '12월=11, 1월=0 → 유클리드 거리 11. 실제로는 한 달 차이인데 모델은 가장 먼 값으로 본다.\n순서 정보를 담지 못하는 근본적 한계.',
  },
  {
    label: 'sin/cos 변환 — 원 위의 좌표',
    body: 'month_sin = sin(2π * month/12), month_cos = cos(2π * month/12).\n12월과 1월이 원 위에서 인접 → 주기의 "이어짐"을 자연스럽게 표현.',
  },
  {
    label: '시간(hour) 인코딩',
    body: 'hour_sin = sin(2π * hour/24), hour_cos = cos(2π * hour/24).\n23시와 0시가 가까움을 반영. 새벽/심야 패턴을 자연스럽게 학습.',
  },
  {
    label: '요일(day of week) 인코딩',
    body: 'dow_sin = sin(2π * dow/7), dow_cos = cos(2π * dow/7).\n일요일(6)과 월요일(0)의 인접성을 표현.',
  },
  {
    label: 'sin/cos 두 값이 모두 필요한 이유',
    body: 'sin만 쓰면 3월(sin≈1)과 9월(sin≈-1)은 구분되지만, 6월(sin=0)과 12월(sin=0)이 겹친다.\ncos를 추가해야 모든 시점이 유일한 (sin, cos) 좌표를 갖는다.',
  },
];

export default function CyclicViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 원-핫의 문제 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 수직선 — 월 표시 */}
              <line x1={30} y1={80} x2={450} y2={80} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              {MONTHS.map((m, i) => {
                const x = 40 + i * 35;
                const highlight = i === 0 || i === 11;
                return (
                  <motion.g key={m} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.04 }}>
                    <rect x={x - 14} y={60} width={28} height={20} rx={4}
                      fill={highlight ? '#ef444420' : '#6366f115'} stroke={highlight ? '#ef4444' : '#6366f1'} strokeWidth={0.6} />
                    <text x={x} y={74} textAnchor="middle" fontSize={8} fontWeight={highlight ? 700 : 400}
                      fill={highlight ? '#ef4444' : 'var(--foreground)'}>{m}</text>
                  </motion.g>
                );
              })}

              {/* 거리 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                {/* 12월과 1월 사이 거리 */}
                <line x1={40 + 11 * 35} y1={55} x2={40} y2={55} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 2" />
                <text x={240} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">
                  원-핫 거리 = 11 (실제: 1개월 차이)
                </text>

                {/* 인접한 3월-4월 거리 */}
                <line x1={40 + 2 * 35} y1={90} x2={40 + 3 * 35} y2={90} stroke="#10b981" strokeWidth={1} />
                <text x={40 + 2.5 * 35} y={103} textAnchor="middle" fontSize={8} fill="#10b981">거리 = 1</text>
              </motion.g>

              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                순서형 인코딩(0~11)도 동일 문제 — 12월(11)과 1월(0)의 거리가 최대
              </text>

              <motion.text x={240} y={165} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                해결책: sin/cos 변환으로 원 위에 배치
              </motion.text>
            </motion.g>
          )}

          {/* Step 1: sin/cos 월 인코딩 — 원 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 원 */}
              <circle cx={160} cy={100} r={70} fill="none" stroke="var(--border)" strokeWidth={0.5} />

              {/* 월별 점 */}
              {MONTHS.map((m, i) => {
                const angle = (2 * Math.PI * i) / 12;
                const p = circlePoint(160, 100, 70, angle);
                const labelP = circlePoint(160, 100, 85, angle);
                const highlight = i === 0 || i === 11;
                return (
                  <motion.g key={m} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...sp, delay: i * 0.06 }}>
                    <circle cx={p.x} cy={p.y} r={highlight ? 5 : 3.5}
                      fill={highlight ? '#ef4444' : '#6366f1'} fillOpacity={0.8} />
                    <text x={labelP.x} y={labelP.y + 3} textAnchor="middle" fontSize={7}
                      fontWeight={highlight ? 700 : 400} fill={highlight ? '#ef4444' : 'var(--foreground)'}>{m}</text>
                  </motion.g>
                );
              })}

              {/* 12월-1월 인접 강조 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
                {(() => {
                  const p1 = circlePoint(160, 100, 70, (2 * Math.PI * 0) / 12);
                  const p2 = circlePoint(160, 100, 70, (2 * Math.PI * 11) / 12);
                  return (
                    <>
                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#10b981" strokeWidth={1.5} />
                      <text x={(p1.x + p2.x) / 2 + 15} y={(p1.y + p2.y) / 2} fontSize={8} fontWeight={600} fill="#10b981">가까움!</text>
                    </>
                  );
                })()}
              </motion.g>

              {/* 수식 표시 */}
              <rect x={280} y={30} width={180} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={370} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">월(month) 인코딩</text>
              <text x={370} y={64} textAnchor="middle" fontSize={8} fill="#3b82f6">sin_m = sin(2π * m / 12)</text>
              <text x={370} y={78} textAnchor="middle" fontSize={8} fill="#10b981">cos_m = cos(2π * m / 12)</text>

              {/* sin/cos 값 예시 */}
              <rect x={280} y={95} width={180} height={70} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
              {[
                { m: '1월(0)', sin: '0.00', cos: '1.00' },
                { m: '4월(3)', sin: '1.00', cos: '0.00' },
                { m: '12월(11)', sin: '-0.50', cos: '0.87' },
              ].map((row, i) => (
                <g key={row.m}>
                  <text x={310} y={112 + i * 18} textAnchor="middle" fontSize={8} fill="var(--foreground)">{row.m}</text>
                  <text x={380} y={112 + i * 18} textAnchor="middle" fontSize={8} fill="#3b82f6">{row.sin}</text>
                  <text x={435} y={112 + i * 18} textAnchor="middle" fontSize={8} fill="#10b981">{row.cos}</text>
                </g>
              ))}
            </motion.g>
          )}

          {/* Step 2: 시간 인코딩 (24시간 원) */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <circle cx={160} cy={100} r={70} fill="none" stroke="var(--border)" strokeWidth={0.5} />

              {HOURS.filter((_, i) => i % 3 === 0).map((h) => {
                const angle = (2 * Math.PI * h) / 24;
                const p = circlePoint(160, 100, 70, angle);
                const labelP = circlePoint(160, 100, 85, angle);
                const highlight = h === 0 || h === 23;
                return (
                  <motion.g key={h} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: h * 0.02 }}>
                    <circle cx={p.x} cy={p.y} r={highlight ? 5 : 3}
                      fill={h >= 6 && h <= 18 ? '#f59e0b' : '#6366f1'} fillOpacity={0.8} />
                    <text x={labelP.x} y={labelP.y + 3} textAnchor="middle" fontSize={7}
                      fill={highlight ? '#ef4444' : 'var(--foreground)'}>{h}시</text>
                  </motion.g>
                );
              })}

              {/* 23시-0시 인접 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                {(() => {
                  const p0 = circlePoint(160, 100, 70, 0);
                  const p23 = circlePoint(160, 100, 70, (2 * Math.PI * 23) / 24);
                  return (
                    <line x1={p0.x} y1={p0.y} x2={p23.x} y2={p23.y} stroke="#10b981" strokeWidth={1.5} />
                  );
                })()}
              </motion.g>

              {/* 범례 */}
              <rect x={280} y={30} width={180} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={370} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">시간(hour) 인코딩</text>
              <text x={370} y={63} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">sin(2π * h/24), cos(2π * h/24)</text>

              <rect x={280} y={90} width={180} height={42} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
              <circle cx={295} cy={103} r={4} fill="#f59e0b" opacity={0.8} />
              <text x={305} y={107} fontSize={8} fill="var(--foreground)">주간 (6~18시)</text>
              <circle cx={295} cy={120} r={4} fill="#6366f1" opacity={0.8} />
              <text x={305} y={124} fontSize={8} fill="var(--foreground)">야간 (19~5시)</text>
            </motion.g>
          )}

          {/* Step 3: 요일 인코딩 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <circle cx={160} cy={100} r={70} fill="none" stroke="var(--border)" strokeWidth={0.5} />

              {['월', '화', '수', '목', '금', '토', '일'].map((d, i) => {
                const angle = (2 * Math.PI * i) / 7;
                const p = circlePoint(160, 100, 70, angle);
                const labelP = circlePoint(160, 100, 88, angle);
                const isWeekend = i >= 5;
                return (
                  <motion.g key={d} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...sp, delay: i * 0.08 }}>
                    <circle cx={p.x} cy={p.y} r={isWeekend ? 6 : 4}
                      fill={isWeekend ? '#ef4444' : '#3b82f6'} fillOpacity={0.8} />
                    <text x={labelP.x} y={labelP.y + 3} textAnchor="middle" fontSize={9}
                      fontWeight={isWeekend ? 700 : 400} fill={isWeekend ? '#ef4444' : 'var(--foreground)'}>{d}</text>
                  </motion.g>
                );
              })}

              {/* 일-월 인접 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                {(() => {
                  const p0 = circlePoint(160, 100, 70, 0);
                  const p6 = circlePoint(160, 100, 70, (2 * Math.PI * 6) / 7);
                  return (
                    <line x1={p0.x} y1={p0.y} x2={p6.x} y2={p6.y} stroke="#10b981" strokeWidth={1.5} />
                  );
                })()}
                <text x={160} y={100} textAnchor="middle" fontSize={8} fill="#10b981" fontWeight={600}>일→월 인접</text>
              </motion.g>

              <rect x={280} y={40} width={180} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={370} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">요일(day_of_week)</text>
              <text x={370} y={73} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">sin(2π * dow/7), cos(2π * dow/7)</text>

              <rect x={280} y={100} width={180} height={35} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
              <circle cx={295} cy={113} r={4} fill="#3b82f6" opacity={0.8} />
              <text x={305} y={117} fontSize={8} fill="var(--foreground)">평일</text>
              <circle cx={295} cy={127} r={4} fill="#ef4444" opacity={0.8} />
              <text x={305} y={131} fontSize={8} fill="var(--foreground)">주말</text>
            </motion.g>
          )}

          {/* Step 4: sin만으로는 부족 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* sin 값만 표시 — 6월=12월 겹침 */}
              <text x={130} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">sin만 사용</text>
              <line x1={30} y1={100} x2={230} y2={100} stroke="var(--muted-foreground)" strokeWidth={0.5} />

              {MONTHS.map((m, i) => {
                const sinVal = Math.sin((2 * Math.PI * i) / 12);
                const x = 40 + i * 16;
                const y = 100 - sinVal * 50;
                const clash = i === 5 || i === 11; // 6월, 12월 — sin≈0
                return (
                  <motion.g key={`sin-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.04 }}>
                    <circle cx={x} cy={y} r={clash ? 5 : 3} fill={clash ? '#ef4444' : '#6366f1'} fillOpacity={0.8} />
                    <text x={x} y={165} textAnchor="middle" fontSize={7}
                      fill={clash ? '#ef4444' : 'var(--muted-foreground)'} fontWeight={clash ? 600 : 400}>{m}</text>
                  </motion.g>
                );
              })}

              {/* 겹침 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <line x1={40 + 5 * 16} y1={100} x2={40 + 11 * 16} y2={100} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={40 + 8 * 16} y={93} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ef4444">
                  sin ≈ 0 → 구분 불가!
                </text>
              </motion.g>

              {/* sin+cos 산점도 */}
              <text x={370} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">sin + cos</text>
              <circle cx={370} cy={100} r={60} fill="none" stroke="var(--border)" strokeWidth={0.5} />

              {MONTHS.map((m, i) => {
                const angle = (2 * Math.PI * i) / 12;
                const p = circlePoint(370, 100, 60, angle);
                const clash = i === 5 || i === 11;
                return (
                  <motion.g key={`both-${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...sp, delay: 0.3 + i * 0.04 }}>
                    <circle cx={p.x} cy={p.y} r={clash ? 5 : 3} fill={clash ? '#10b981' : '#6366f1'} fillOpacity={0.8} />
                    <text x={p.x + (p.x > 370 ? 8 : -8)} y={p.y + 3} textAnchor={p.x > 370 ? 'start' : 'end'}
                      fontSize={7} fill={clash ? '#10b981' : 'var(--muted-foreground)'}>{m}</text>
                  </motion.g>
                );
              })}

              <motion.text x={370} y={178} textAnchor="middle" fontSize={8} fontWeight={600} fill="#10b981"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
                모든 월이 유일한 좌표!
              </motion.text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
