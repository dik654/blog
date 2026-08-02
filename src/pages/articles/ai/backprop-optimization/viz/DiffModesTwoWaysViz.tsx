import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.1, duration: 0.4 };

const STEPS = [
  { label: '미분을 계산하는 방식은 크게 두 가지다 — Forward mode 와 Reverse mode.' },
  { label: 'Forward mode: 입력 하나에 seed=1 을 주입해 편미분을 순전파 방향으로 전파한다. 입력마다 1 회 pass 가 필요하다.' },
  { label: 'Reverse mode: 출력(loss) 하나에서 dL/dL=1 로 시작해 역방향으로 전파한다. 단 1 회 pass 로 모든 입력에 대한 편미분을 동시에 얻는다.' },
  { label: '신경망은 입력이 수억 개 — Reverse mode 가 항상 선택된다. 1 회 pass 로 N 개 gradient 를 동시 획득하기 때문이다.' },
];

export default function DiffModesTwoWaysViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const showFwd = step >= 1;
        const showRev = step >= 2;
        const showWhy = step >= 3;

        return (
          <svg viewBox="0 0 480 200" className="w-full h-auto">
            <defs>
              <marker id="dtw-fwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#3b82f6" />
              </marker>
              <marker id="dtw-rev" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
              </marker>
            </defs>

            {/* 제목 */}
            <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
              fill="var(--foreground)">
              미분 계산 두 가지 방식
            </text>

            {/* 중앙 구분선 */}
            <line x1={240} y1={24} x2={240} y2={170}
              stroke="var(--muted-foreground)" strokeOpacity={0.2}
              strokeWidth={1} strokeDasharray="4 4" />

            {/* ─── Forward mode 패널 (좌) ─── */}
            <text x={120} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
              Forward mode
            </text>

            {/* 입력 노드들 */}
            {[
              { cy: 75,  label: 'x₁', seed: 'seed=1' },
              { cy: 115, label: 'x₂', seed: 'seed=0' },
              { cy: 155, label: 'x₃', seed: 'seed=0' },
            ].map((n, i) => (
              <g key={n.label}>
                <motion.circle cx={42} cy={n.cy} r={14}
                  animate={{
                    fill:        showFwd && i === 0 ? '#3b82f622' : '#80808010',
                    stroke:      showFwd && i === 0 ? '#3b82f6' : '#666',
                    strokeWidth: showFwd && i === 0 ? 1.8 : 1,
                  }}
                  transition={sp}
                />
                <text x={42} y={n.cy + 4} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={showFwd && i === 0 ? '#3b82f6' : 'var(--muted-foreground)'}>
                  {n.label}
                </text>
                {showFwd && (
                  <motion.text x={42} y={n.cy - 19} textAnchor="middle" fontSize={7}
                    fontWeight={700} fill={i === 0 ? '#3b82f6' : 'var(--muted-foreground)'}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                    {n.seed}
                  </motion.text>
                )}
              </g>
            ))}

            {/* 중간 노드 */}
            <motion.circle cx={130} cy={115} r={16}
              animate={{
                fill: showFwd ? '#10b98118' : '#80808010',
                stroke: showFwd ? '#10b981' : '#666',
                strokeWidth: showFwd ? 1.5 : 1,
              }}
              transition={sp}
            />
            <text x={130} y={119} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={showFwd ? '#10b981' : 'var(--muted-foreground)'}>f(x)</text>

            {/* forward 화살표 */}
            {[75, 115, 155].map((cy, i) => (
              <motion.line key={cy} x1={56} y1={cy} x2={113} y2={cy <= 115 ? 107 : 120}
                stroke="#3b82f6" markerEnd="url(#dtw-fwd)"
                animate={{ strokeOpacity: showFwd ? (i === 0 ? 0.9 : 0.35) : 0.1, strokeWidth: showFwd && i === 0 ? 1.6 : 0.8 }}
                transition={sp}
              />
            ))}

            {/* 출력 gradient */}
            {showFwd && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={155} y={108} width={68} height={16} rx={3}
                  fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
                <text x={189} y={119} textAnchor="middle" fontSize={7.5} fontWeight={700} fill="#3b82f6">
                  df/dx₁ ✓
                </text>
              </motion.g>
            )}

            {/* forward pass 카운트 */}
            <rect x={14} y={172} width={210} height={22} rx={4}
              fill="var(--background)" stroke="#3b82f6" strokeWidth={0.7} strokeOpacity={0.5} />
            <text x={119} y={182} textAnchor="middle" fontSize={8} fontWeight={700} fill="#3b82f6">
              Pass 횟수: {showFwd ? '1 / N' : '?'}
            </text>
            <text x={119} y={190} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              x₁, x₂, x₃ … 각각 1 회씩 반복 필요
            </text>

            {/* ─── Reverse mode 패널 (우) ─── */}
            <text x={360} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
              Reverse mode
            </text>

            {/* 출력 L */}
            <motion.circle cx={438} cy={115} r={16}
              animate={{
                fill: showRev ? '#ef444422' : '#80808010',
                stroke: showRev ? '#ef4444' : '#666',
                strokeWidth: showRev ? 1.8 : 1,
              }}
              transition={sp}
            />
            <text x={438} y={119} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={showRev ? '#ef4444' : 'var(--muted-foreground)'}>L</text>

            {showRev && (
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={446} y={97} width={30} height={14} rx={2}
                  fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.7} />
                <text x={461} y={107} textAnchor="middle" fontSize={7} fontWeight={700} fill="#f59e0b">
                  dL/dL=1
                </text>
              </motion.g>
            )}

            {/* 중간 노드 우 */}
            <motion.circle cx={350} cy={115} r={16}
              animate={{
                fill: showRev ? '#f59e0b18' : '#80808010',
                stroke: showRev ? '#f59e0b' : '#666',
                strokeWidth: showRev ? 1.5 : 1,
              }}
              transition={sp}
            />
            <text x={350} y={119} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={showRev ? '#f59e0b' : 'var(--muted-foreground)'}>f(x)</text>

            {/* L → 중간 역방향 */}
            <motion.line x1={422} y1={115} x2={368} y2={115}
              stroke="#f59e0b" strokeDasharray="3 2" markerEnd="url(#dtw-rev)"
              animate={{ strokeOpacity: showRev ? 0.9 : 0.1, strokeWidth: showRev ? 1.5 : 0.8 }}
              transition={sp}
            />

            {/* 입력 노드들 우 */}
            {[75, 115, 155].map((cy, i) => (
              <g key={`r-${cy}`}>
                <motion.circle cx={262} cy={cy} r={14}
                  animate={{
                    fill: showRev ? '#f59e0b18' : '#80808010',
                    stroke: showRev ? '#f59e0b' : '#666',
                    strokeWidth: showRev ? 1.5 : 1,
                  }}
                  transition={sp}
                />
                <text x={262} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={showRev ? '#f59e0b' : 'var(--muted-foreground)'}>
                  {['x₁', 'x₂', 'x₃'][i]}
                </text>
                {showRev && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.1 + i * 0.05 }}>
                    <rect x={270} y={cy - 20} width={52} height={13} rx={2}
                      fill="#f59e0b14" stroke="#f59e0b" strokeWidth={0.6} />
                    <text x={296} y={cy - 10} textAnchor="middle" fontSize={7} fontWeight={700} fill="#f59e0b">
                      dL/d{['x₁','x₂','x₃'][i]} ✓
                    </text>
                  </motion.g>
                )}
                <motion.line x1={334} y1={115} x2={278} y2={cy <= 115 ? cy + (cy < 115 ? 10 : 0) : cy - 10}
                  stroke="#f59e0b" strokeDasharray="3 2" markerEnd="url(#dtw-rev)"
                  animate={{ strokeOpacity: showRev ? 0.7 : 0.1, strokeWidth: showRev ? 1.3 : 0.6 }}
                  transition={{ ...sp, delay: i * 0.04 }}
                />
              </g>
            ))}

            {/* reverse pass 카운트 */}
            <rect x={254} y={172} width={210} height={22} rx={4}
              fill="var(--background)" stroke="#f59e0b" strokeWidth={0.7} strokeOpacity={0.5} />
            <text x={359} y={182} textAnchor="middle" fontSize={8} fontWeight={700} fill="#f59e0b">
              Pass 횟수: {showRev ? '1 회 — 모두 동시 획득' : '?'}
            </text>
            <text x={359} y={190} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              N 개 gradient 를 단 1 회 역전파로
            </text>

            {/* 결론 배너 */}
            {showWhy && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={100} y={60} width={280} height={24} rx={4}
                  fill="#10b98110" stroke="#10b981" strokeWidth={0.9} />
                <text x={240} y={72} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#10b981">
                  신경망 = 대규모 파라미터 → Reverse mode 가 유일한 선택
                </text>
                <text x={240} y={82} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  scalar loss 구조이므로 출력 M=1 — 역방향 1 회로 충분
                </text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
