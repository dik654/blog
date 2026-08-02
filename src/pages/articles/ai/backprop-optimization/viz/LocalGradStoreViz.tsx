import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: '계산 그래프 — 입력에서 출력(loss)까지 연산 노드가 순서대로 연결된 구조. 각 노드는 자신만의 local gradient 를 안다.' },
  { label: '순전파: 각 노드는 입력값과 local gradient 를 메모리에 보관한다. 나중에 역전파에서 꺼내 쓰기 위해서다.' },
  { label: '역전파 시작: 출력 노드에 dL/dL = 1.0 을 주입한다. 이것이 chain rule 의 첫 upstream gradient 다.' },
  { label: '각 노드는 "위에서 내려온 upstream gradient × 자신의 local gradient" 를 계산해 아래 노드로 전달한다. 이 과정이 chain rule 의 실체다.' },
];

// 노드 정의: x → mul → add → L
const NODES = [
  { id: 'x',   cx: 60,  cy: 100, r: 16, label: 'x',      sublabel: '입력',      fwdColor: '#3b82f6', localGrad: 'w',        localGradVal: '0.5' },
  { id: 'mul', cx: 170, cy: 100, r: 18, label: '×',       sublabel: 'multiply',  fwdColor: '#10b981', localGrad: 'x',        localGradVal: '2.0' },
  { id: 'add', cx: 290, cy: 100, r: 18, label: '+',       sublabel: 'add',       fwdColor: '#10b981', localGrad: '1',        localGradVal: '1.0' },
  { id: 'L',   cx: 405, cy: 100, r: 20, label: 'L',       sublabel: 'loss',      fwdColor: '#ef4444', localGrad: '—',        localGradVal: '—'   },
];

export default function LocalGradStoreViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const fwdStore  = step >= 1;   // 순전파 + 메모리 저장
        const revSeed   = step >= 2;   // dL/dL=1 주입
        const chainRule = step >= 3;   // chain rule 전파

        return (
          <svg viewBox="0 0 500 240" className="w-full h-auto">
            <defs>
              <marker id="lgs-fwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#3b82f6" />
              </marker>
              <marker id="lgs-bwd" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
              </marker>
            </defs>

            {/* 제목 */}
            <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
              fill="var(--foreground)">
              계산 그래프 — 순전파 저장 + chain rule 역전파
            </text>

            {/* 노드 간 순전파 엣지 */}
            <motion.line x1={76}  y1={100} x2={148} y2={100}
              animate={{ strokeOpacity: fwdStore ? 0.9 : 0.3, strokeWidth: fwdStore ? 1.8 : 0.8 }}
              transition={sp} stroke="#3b82f6" markerEnd="url(#lgs-fwd)"
            />
            <motion.line x1={188} y1={100} x2={268} y2={100}
              animate={{ strokeOpacity: fwdStore ? 0.9 : 0.3, strokeWidth: fwdStore ? 1.8 : 0.8 }}
              transition={sp} stroke="#3b82f6" markerEnd="url(#lgs-fwd)"
            />
            <motion.line x1={308} y1={100} x2={380} y2={100}
              animate={{ strokeOpacity: fwdStore ? 0.9 : 0.3, strokeWidth: fwdStore ? 1.8 : 0.8 }}
              transition={sp} stroke="#3b82f6" markerEnd="url(#lgs-fwd)"
            />

            {/* 노드 */}
            {NODES.map((n) => (
              <g key={n.id}>
                <motion.circle
                  cx={n.cx} cy={n.cy} r={n.r}
                  animate={{
                    fill:        fwdStore ? `${n.fwdColor}22` : '#80808010',
                    stroke:      fwdStore ? n.fwdColor         : '#888888',
                    strokeWidth: fwdStore ? 1.8 : 1,
                  }}
                  transition={sp}
                />
                <text x={n.cx} y={n.cy + 4} textAnchor="middle" fontSize={12} fontWeight={700}
                  fill={fwdStore ? n.fwdColor : 'var(--muted-foreground)'}>
                  {n.label}
                </text>
                <text x={n.cx} y={n.cy + n.r + 12} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  {n.sublabel}
                </text>

                {/* local gradient 저장 뱃지 */}
                {fwdStore && n.id !== 'L' && (
                  <motion.g
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: 0.1 }}>
                    <rect x={n.cx - 44} y={n.cy - n.r - 22} width={88} height={18} rx={2}
                      fill="#10b98118" stroke="#10b981" strokeWidth={0.8} />
                    <text x={n.cx} y={n.cy - n.r - 9} textAnchor="middle"
                      fontSize={9} fontWeight={700} fill="#10b981">
                      local = {n.localGradVal}
                    </text>
                  </motion.g>
                )}
              </g>
            ))}

            {/* dL/dL = 1 seed */}
            {revSeed && (
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={425} y={56} width={72} height={17} rx={2}
                  fill="#f59e0b18" stroke="#f59e0b" strokeWidth={0.8} />
                <text x={461} y={69} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">
                  dL/dL=1.0
                </text>
              </motion.g>
            )}

            {/* chain rule 역전파 화살표 L → add */}
            {chainRule && (
              <motion.g>
                <motion.line x1={382} y1={108} x2={310} y2={108}
                  stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="4 3"
                  markerEnd="url(#lgs-bwd)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...sp, duration: 0.4 }}
                />
                {/* gradient 값 레이블 */}
                <motion.text x={346} y={158} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#f59e0b"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.1 }}>
                  1.0 × 1 = 1.0
                </motion.text>
              </motion.g>
            )}

            {/* chain rule 역전파 화살표 add → mul */}
            {chainRule && (
              <motion.g>
                <motion.line x1={268} y1={108} x2={190} y2={108}
                  stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="4 3"
                  markerEnd="url(#lgs-bwd)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...sp, duration: 0.4, delay: 0.15 }}
                />
                <motion.text x={229} y={158} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#f59e0b"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.2 }}>
                  1.0 × 1 = 1.0
                </motion.text>
              </motion.g>
            )}

            {/* chain rule 역전파 화살표 mul → x */}
            {chainRule && (
              <motion.g>
                <motion.line x1={150} y1={108} x2={78} y2={108}
                  stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="4 3"
                  markerEnd="url(#lgs-bwd)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ ...sp, duration: 0.4, delay: 0.3 }}
                />
                <motion.text x={114} y={158} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#f59e0b"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.35 }}>
                  1.0 × 2.0 = 2.0
                </motion.text>
              </motion.g>
            )}

            {/* 하단 설명 */}
            <rect x={10} y={186} width={480} height={48} rx={5}
              fill="var(--background)" stroke="var(--border)" strokeWidth={0.8} strokeOpacity={0.5} />
            <text x={250} y={204} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={chainRule ? '#f59e0b' : fwdStore ? '#10b981' : 'var(--muted-foreground)'}>
              {chainRule
                ? 'chain rule: upstream × local — 역방향으로 gradient 누적'
                : fwdStore
                  ? '순전파: 각 노드가 local gradient 를 메모리에 저장'
                  : '계산 그래프: 입력 → 연산 노드 → 출력(loss)'}
            </text>
            <text x={250} y={222} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">
              {chainRule
                ? 'dL/dx = dL/dadd × dadd/dmul × dmul/dx = 1.0 × 1.0 × 2.0 = 2.0'
                : fwdStore
                  ? '저장한 값: x=2.0, local(mul)=2.0, local(add)=1.0'
                  : '각 노드는 연산 하나 — 국소적으로 자신의 local gradient 만 안다'}
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
