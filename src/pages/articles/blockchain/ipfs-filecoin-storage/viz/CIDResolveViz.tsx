import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const STEPS = [
  { label: 'CID 생성: 콘텐츠 해싱 → CIDv1', body: '파일 콘텐츠를 청크로 분할하고 각 청크를 SHA-256으로 해싱합니다. <multibase><version><multicodec><multihash> 구조의 CIDv1이 생성됩니다.' },
  { label: 'DHT 조회: Kademlia DHT에서 Provider 검색', body: 'Amino DHT(Kademlia 기반)에서 XOR 거리 기반 라우팅으로 해당 CID를 가진 Provider를 O(log n) 홉으로 탐색합니다. IPNI(cid.contact)도 병렬 조회합니다.' },
  { label: 'Bitswap: Provider에서 블록 요청/수신', body: 'WANT_HAVE로 블록 존재를 확인한 뒤 WANT_BLOCK으로 실제 데이터를 요청합니다. 세션 기반 최적화로 응답 빠른 피어에 우선 요청합니다.' },
  { label: 'Merkle DAG: 블록 조합으로 원본 파일 복원', body: '수신한 블록들을 Merkle DAG 구조에 따라 조합하여 원본 파일을 복원합니다. 각 블록의 CID 해시를 검증하여 무결성을 보장합니다.' },
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
        <svg viewBox="0 0 560 80" className="w-full max-w-xl">
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
                strokeWidth={2}
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
                  className="fill-white text-[9px] font-bold"
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
