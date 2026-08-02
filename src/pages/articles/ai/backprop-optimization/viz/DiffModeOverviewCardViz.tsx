import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: '미분 계산 방식은 크게 두 가지다. Forward mode 는 입력 하나에 대한 편미분을 순전파 방향으로 전파하고, Reverse mode 는 출력(loss) 하나에서 출발해 모든 입력의 편미분을 역방향 pass 1 회로 획득한다.' },
  { label: '동작 원리는 계산 그래프에 있다. 순전파 시 각 연산 노드는 local gradient 를 메모리에 보관하고, 역전파 시 dL/dL=1.0 으로 초기화한 뒤 "upstream gradient × local gradient" 를 chain rule 로 역방향 누적한다.' },
  { label: '파라미터 N 개인 신경망에서 Forward mode 는 N 번의 순전파가 필요하지만, Reverse mode 는 순전파 1 회 + 역전파 1 회로 모든 gradient 를 동시에 얻는다. GPT-4 수준(~10¹¹ 파라미터)이라면 이 차이는 수천억 배의 연산량 차이다.' },
];

// 세 개념 카드 정의
const CARDS = [
  {
    id: 'modes',
    x: 14,
    w: 140,
    title: '두 미분 방식',
    color: '#3b82f6',
    bg: '#3b82f610',
    lines: ['Forward mode', '입력→ 순전파 방향', 'Reverse mode', '출력← 역방향 1회'],
  },
  {
    id: 'graph',
    x: 170,
    w: 140,
    title: '계산 그래프 동작',
    color: '#10b981',
    bg: '#10b98110',
    lines: ['순전파: local grad 저장', '역전파: dL/dL = 1.0', 'chain rule 역방향 누적', 'upstream × local → 전달'],
  },
  {
    id: 'scale',
    x: 326,
    w: 140,
    title: 'N 파라미터 효율성',
    color: '#f59e0b',
    bg: '#f59e0b10',
    lines: ['Forward: N 회 순전파', 'Reverse: 2 pass (고정)', 'GPT-4 (~10¹¹)', '수천억 배 연산량 차이'],
  },
] as const;

export default function DiffModeOverviewCardViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        return (
          <svg viewBox="0 0 480 200" className="w-full h-auto">
            {/* 제목 */}
            <text
              x={240}
              y={18}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill="var(--foreground)"
            >
              Reverse Mode Autodiff — 세 가지 핵심 개념
            </text>

            {/* 스텝 진행 인디케이터 */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={`dot-${i}`}
                cx={226 + i * 14}
                cy={28}
                r={4}
                animate={{
                  fill: step >= i ? CARDS[i].color : '#80808030',
                  scale: step === i ? 1.3 : 1,
                }}
                transition={sp}
              />
            ))}

            {/* 카드 3개 */}
            {CARDS.map((card, i) => {
              const active = step >= i;
              return (
                <motion.g key={card.id}>
                  {/* 카드 배경 */}
                  <motion.rect
                    x={card.x}
                    y={40}
                    width={card.w}
                    height={145}
                    rx={6}
                    animate={{
                      fill: active ? card.bg : '#80808006',
                      stroke: active ? card.color : '#88888830',
                      strokeWidth: active ? 1.4 : 0.8,
                    }}
                    transition={{ ...sp, delay: i * 0.05 }}
                  />

                  {/* 카드 타이틀 */}
                  <motion.text
                    x={card.x + card.w / 2}
                    y={57}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={700}
                    animate={{ fill: active ? card.color : '#88888860' }}
                    transition={{ ...sp, delay: i * 0.05 }}
                  >
                    {card.title}
                  </motion.text>

                  {/* 타이틀 하단 구분선 */}
                  <motion.line
                    x1={card.x + 10}
                    y1={63}
                    x2={card.x + card.w - 10}
                    y2={63}
                    animate={{
                      strokeOpacity: active ? 0.4 : 0.1,
                      stroke: card.color,
                    }}
                    transition={sp}
                    strokeWidth={0.8}
                  />

                  {/* 카드 내용 라인들 */}
                  {card.lines.map((line, j) => (
                    <motion.text
                      key={`${card.id}-line-${j}`}
                      x={card.x + 10}
                      y={80 + j * 18}
                      fontSize={9}
                      animate={{
                        fillOpacity: active ? 1 : 0.25,
                        fill:
                          j % 2 === 0
                            ? 'var(--foreground)'
                            : 'var(--muted-foreground)',
                      }}
                      transition={{ ...sp, delay: active ? i * 0.05 + j * 0.04 : 0 }}
                    >
                      {line}
                    </motion.text>
                  ))}

                  {/* 활성 카드 하단 강조 배지 */}
                  {active && (
                    <motion.g
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...sp, delay: i * 0.05 + 0.12 }}
                    >
                      <rect
                        x={card.x + 8}
                        y={153}
                        width={card.w - 16}
                        height={24}
                        rx={3}
                        fill={card.bg}
                        stroke={card.color}
                        strokeWidth={0.7}
                        strokeOpacity={0.6}
                      />
                      <text
                        x={card.x + card.w / 2}
                        y={163}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight={700}
                        fill={card.color}
                      >
                        {i === 0 && 'step 1'}
                        {i === 1 && 'step 2'}
                        {i === 2 && 'step 3'}
                      </text>
                      <text
                        x={card.x + card.w / 2}
                        y={176}
                        textAnchor="middle"
                        fontSize={9}
                        fill="var(--muted-foreground)"
                      >
                        {i === 0 && '두 방향 비교'}
                        {i === 1 && 'graph 메커니즘'}
                        {i === 2 && 'N 파라미터 비용'}
                      </text>
                    </motion.g>
                  )}
                </motion.g>
              );
            })}

            {/* 카드 사이 화살표 */}
            {[{ x: 154, active: step >= 1 }, { x: 310, active: step >= 2 }].map(
              (arrow, i) => (
                <motion.g key={`arrow-${i}`}>
                  <motion.line
                    x1={arrow.x}
                    y1={113}
                    x2={arrow.x + 16}
                    y2={113}
                    stroke={arrow.active ? '#8b5cf6' : '#88888830'}
                    strokeWidth={1.4}
                    animate={{
                      strokeOpacity: arrow.active ? 0.9 : 0.2,
                    }}
                    transition={sp}
                    markerEnd="url(#dmc-arrow)"
                  />
                </motion.g>
              )
            )}

            <defs>
              <marker
                id="dmc-arrow"
                markerWidth={6}
                markerHeight={6}
                refX={5}
                refY={3}
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6" fill="#8b5cf6" />
              </marker>
            </defs>

            {/* 하단 결론 배너 (step 3 완료 시) */}
            {step >= 3 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}
              >
                <rect
                  x={14}
                  y={188}
                  width={452}
                  height={0}
                  rx={4}
                  fill="#8b5cf610"
                  stroke="#8b5cf6"
                  strokeWidth={0.7}
                />
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
