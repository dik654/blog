import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const STEPS = [
  { label: 'CID 생성: 콘텐츠 해싱 → CIDv1', body: '청크별 SHA-256 해싱 → CIDv1 생성' },
  { label: 'DHT 조회: Kademlia DHT에서 Provider 검색', body: 'XOR 거리 기반 O(log n) 라우팅 + IPNI 병렬 조회' },
  { label: 'Bitswap: Provider에서 블록 요청/수신', body: 'WANT_HAVE → WANT_BLOCK 순서로 블록 수신' },
  { label: 'Merkle DAG: 블록 조합으로 원본 파일 복원', body: '블록 조합 + CID 해시 검증으로 원본 복원' },
];

const NODES = [
  { label: 'Content',  x: 40,  y: 40, color: '#f59e0b' },
  { label: 'DHT',      x: 190, y: 40, color: '#10b981' },
  { label: 'Bitswap',  x: 340, y: 40, color: '#6366f1' },
  { label: 'DAG',      x: 490, y: 40, color: '#ec4899' },
];

const ARROWS = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
];

export default function CIDResolveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 700 80" className="w-full max-w-xl">
          <defs>
            <marker id="cid-arrow" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#888" />
            </marker>
          </defs>

          {ARROWS.map((a, i) => {
            const from = NODES[a.from];
            const to = NODES[a.to];
            const active = i < step || i === step;
            return (
              <motion.line
                key={i}
                x1={from.x + 50} y1={from.y}
                x2={to.x - 10} y2={to.y}
                stroke={active ? NODES[a.to].color : '#555'}
                strokeWidth={1.5}
                markerEnd="url(#cid-arrow)"
                animate={{ opacity: active ? 0.8 : 0.15 }}
                transition={{ duration: 0.3 }}
              />
            );
          })}

          {NODES.map((node, i) => {
            const active = i === step;
            const done = i < step;
            const opacity = active ? 1 : done ? 0.5 : 0.2;

            return (
              <g key={node.label}>
                <motion.circle
                  cx={node.x + 20} cy={node.y} r={24}
                  fill={node.color}
                  animate={{ opacity, scale: active ? 1.15 : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: `${node.x + 20}px ${node.y}px` }}
                />
                <text
                  x={node.x + 20} y={node.y + 4}
                  textAnchor="middle"
                  fontSize={11} fontWeight={700} fill="white"
                  style={{ opacity: Math.max(opacity, 0.5) }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
