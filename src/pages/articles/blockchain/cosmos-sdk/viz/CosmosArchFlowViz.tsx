import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: '클라이언트', color: '#a855f7', x: 10, y: 10 },
  { label: 'gRPC Gateway', color: '#6366f1', x: 10, y: 70 },
  { label: 'BaseApp', color: '#8b5cf6', x: 130, y: 70 },
  { label: 'AnteHandler', color: '#10b981', x: 250, y: 10 },
  { label: 'Modules', color: '#f59e0b', x: 250, y: 70 },
  { label: 'MultiStore', color: '#ef4444', x: 250, y: 130 },
  { label: 'CometBFT', color: '#6b7280', x: 130, y: 130 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
  { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 6, to: 2 },
];

const STEPS = [
  { label: 'Cosmos SDK 전체 아키텍처', body: 'Client → API → BaseApp → AnteHandler → Modules → MultiStore ↔ CometBFT.' },
  { label: '요청 흐름', body: '클라이언트가 gRPC/REST로 TX를 전송하면 BaseApp이 수신.' },
  { label: 'AnteHandler 검증', body: '서명, nonce, fee 등을 체인 형태의 미들웨어로 사전 검증.' },
  { label: '모듈 실행 & 저장', body: 'MsgServer가 실행하고, Keeper가 IAVL MultiStore에 상태를 기록.' },
];

const ACTIVE_EDGES: number[][] = [[0,1,2,3,4,5], [0,1], [2,3], [3,4,5]];
const BW = 90, BH = 35;
const mid = (i: number) => ({ x: NODES[i].x + BW / 2, y: NODES[i].y + BH / 2 });

export default function CosmosArchFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 185" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Edges */}
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            const show = ACTIVE_EDGES[step].includes(i);
            return (
              <motion.g key={i} animate={{ opacity: show ? 1 : 0.1 }} transition={{ duration: 0.3 }}>
                <motion.line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                  stroke="#666" strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: show ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }} />
                {show && (
                  <motion.circle r={4} fill={NODES[e.from].color}
                    animate={{ cx: [f.x, t.x], cy: [f.y, t.y] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }} />
                )}
              </motion.g>
            );
          })}
          {/* Node boxes */}
          {NODES.map((n) => (
            <g key={n.label}>
              <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
              <text x={n.x + BW / 2} y={n.y + BH / 2 + 4}
                textAnchor="middle" fontSize={9} fontWeight="700" fill={n.color}>
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
