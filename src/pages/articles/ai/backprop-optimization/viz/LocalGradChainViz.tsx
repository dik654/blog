import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: '순전파 시작 — 입력 x 가 각 연산 노드를 통과하며 중간값을 계산한다.' },
  { label: '각 노드는 순전파 통과 시 자신의 local gradient 를 메모리에 저장해 둔다. (역전파에서 재사용)' },
  { label: '역전파 시작 — 출력 L 에서 dL/dL=1.0 으로 초기화한 뒤 역방향으로 출발한다.' },
  { label: '각 노드는 "위에서 내려온 upstream gradient × 자신의 local gradient" 를 계산해 아래 노드로 전달한다.' },
  { label: '최종 — chain rule 을 통해 모든 노드의 gradient 를 단 1회 역방향 pass 로 동시에 획득한다.' },
];

// 노드 정의
const NODES = [
  { id: 'x',  cx: 60,  cy: 110, r: 22, lbl: 'x',       sublbl: '입력' },
  { id: 'a',  cx: 180, cy: 110, r: 22, lbl: 'a=x²',    sublbl: 'square' },
  { id: 'b',  cx: 300, cy: 110, r: 22, lbl: 'b=a+1',   sublbl: 'add' },
  { id: 'L',  cx: 420, cy: 110, r: 22, lbl: 'L',        sublbl: 'loss' },
];

// 각 노드의 local gradient 라벨
const LOCAL_GRADS = [
  { id: 'x',  lbl: 'local: 2x' },
  { id: 'a',  lbl: 'local: 1' },
  { id: 'b',  lbl: 'local: dL/db' },
];

export default function LocalGradChainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const fwdFlow   = step >= 1;   // 순전파 화살표 활성
        const storeGrad = step >= 2;   // local grad 저장 표시
        const revSeed   = step >= 3;   // dL/dL=1 주입
        const revFlow   = step >= 4;   // 역방향 화살표
        const done      = step >= 5;   // 완료

        return (
          <svg viewBox="0 0 480 230" className="w-full h-auto">
            <defs>
              <marker id="lgc-fwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#3b82f6" />
              </marker>
              <marker id="lgc-bwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
              </marker>
            </defs>

            {/* 제목 */}
            <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
              fill="var(--foreground)">
              계산 그래프 — 순전파 저장 + 역전파 chain rule
            </text>

            {/* 노드 간 순전파 연결선 */}
            {[[60, 180], [180, 300], [300, 420]].map(([x1, x2], i) => (
              <motion.line
                key={`fwd-e-${i}`}
                x1={x1 + 22} y1={104} x2={x2 - 22} y2={104}
                stroke="#3b82f6"
                animate={{ strokeOpacity: fwdFlow ? 0.85 : 0.2, strokeWidth: fwdFlow ? 1.6 : 0.8 }}
                transition={sp}
                markerEnd="url(#lgc-fwd)"
              />
            ))}

            {/* 역방향 연결선 */}
            {revFlow && [[420, 300], [300, 180], [180, 60]].map(([x1, x2], i) => (
              <motion.line
                key={`bwd-e-${i}`}
                x1={x1 - 24} y1={118} x2={x2 + 24} y2={118}
                stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="4 3"
                markerEnd="url(#lgc-bwd)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ ...sp, delay: i * 0.12 }}
              />
            ))}

            {/* 노드들 */}
            {NODES.map((n) => {
              const isL     = n.id === 'L';
              const isX     = n.id === 'x';
              const active  = fwdFlow;
              const revDone = done && (isX || n.id === 'a' || n.id === 'b');
              return (
                <g key={n.id}>
                  <motion.circle
                    cx={n.cx} cy={n.cy} r={n.r}
                    animate={{
                      fill:        isL ? '#ef444422' : revDone ? '#f59e0b22' : active ? '#3b82f622' : '#80808010',
                      stroke:      isL ? '#ef4444'   : revDone ? '#f59e0b'   : active ? '#3b82f6'   : '#888888',
                      strokeWidth: active ? 1.8 : 1,
                    }}
                    transition={sp}
                  />
                  <text x={n.cx} y={n.cy - 2} textAnchor="middle" fontSize={11} fontWeight={700}
                    fill={isL ? '#ef4444' : revDone ? '#f59e0b' : active ? '#3b82f6' : 'var(--muted-foreground)'}>
                    {n.lbl}
                  </text>
                  <text x={n.cx} y={n.cy + 11} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">
                    {n.sublbl}
                  </text>
                </g>
              );
            })}

            {/* local gradient 저장 뱃지 */}
            {storeGrad && LOCAL_GRADS.map((g, i) => {
              const node = NODES.find((n) => n.id === g.id)!;
              return (
                <motion.g key={`lg-${g.id}`}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <rect x={node.cx - 48} y={node.cy - 56} width={96} height={18} rx={2}
                    fill="#10b98118" stroke="#10b981" strokeWidth={0.8} />
                  <text x={node.cx} y={node.cy - 43} textAnchor="middle" fontSize={9} fontWeight={700}
                    fill="#10b981">
                    {g.lbl}
                  </text>
                </motion.g>
              );
            })}

            {/* 저장 범례 */}
            {storeGrad && (
              <motion.text x={240} y={36} textAnchor="middle" fontSize={9} fill="#10b981"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                순전파 시 local gradient 메모리 저장
              </motion.text>
            )}

            {/* dL/dL=1 seed */}
            {revSeed && (
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={384} y={70} width={80} height={17} rx={2}
                  fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.8} />
                <text x={424} y={82} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                  dL/dL=1.0
                </text>
              </motion.g>
            )}

            {/* 역전파 수식 레이블 */}
            {revFlow && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
                <text x={240} y={148} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                  upstream × local = downstream
                </text>
              </motion.g>
            )}

            {/* 완료 배너 */}
            {done && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={20} y={168} width={440} height={52} rx={5}
                  fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={0.8} />
                <text x={240} y={188} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
                  chain rule: dL/dx = dL/dL × dL/db × db/da × da/dx
                </text>
                <text x={240} y={206} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  dynamic programming 으로 중간값 재사용 — 노드 수에 비례하는 선형 비용
                </text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
