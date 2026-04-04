import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'src', label: 'Cairo 소스', color: '#8b5cf6', x: 5, y: 70 },
  { id: 'parse', label: 'Parser', color: '#6366f1', x: 75, y: 20 },
  { id: 'semantic', label: 'Semantic', color: '#3b82f6', x: 75, y: 120 },
  { id: 'lower', label: 'Lowering', color: '#10b981', x: 165, y: 70 },
  { id: 'sierra', label: 'Sierra IR', color: '#f59e0b', x: 245, y: 70 },
  { id: 'casm', label: 'CASM', color: '#ef4444', x: 325, y: 70 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 2, to: 3 },
  { from: 3, to: 4 }, { from: 4, to: 5 },
];

const STEPS = [
  { label: 'Cairo 컴파일 파이프라인 전체 구조', body: 'Cairo 소스 코드가 6단계를 거쳐 실행 가능한 CASM으로 변환됩니다.' },
  { label: '파싱 & 의미 분석', body: 'Parser가 AST를 생성하고, Semantic 분석이 타입 체크와 스코프 해석을 수행합니다.' },
  { label: 'Lowering → Sierra IR', body: '고수준 Cairo 구문을 Sierra 중간표현으로 변환합니다. 안전성이 구조적으로 보장됩니다.' },
  { label: 'Sierra → CASM', body: 'Sierra 명령어를 Cairo VM에서 실행 가능한 어셈블리(CASM)로 최종 변환합니다.' },
];

const ACTIVE: number[][] = [[0, 1, 2, 3, 4, 5], [0, 1, 2], [1, 2, 3, 4], [4, 5]];
const BW = 62, BH = 30;
const mid = (i: number) => ({ x: NODES[i].x + BW / 2, y: NODES[i].y + BH / 2 });

export default function CairoPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            const show = ACTIVE[step].includes(e.from) && ACTIVE[step].includes(e.to);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1.5} strokeDasharray="5 3"
                animate={{ opacity: show ? 1 : 0.1 }} transition={{ duration: 0.3 }} />
            );
          })}
          {NODES.map((n, i) => {
            const show = ACTIVE[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: show ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                  fill={`${n.color}18`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x + BW / 2} y={n.y + BH / 2 + 4}
                  textAnchor="middle" fontSize={9} fontWeight="700" fill={n.color}>
                  {n.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
