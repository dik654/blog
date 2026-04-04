import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Worker TX 수집', body: 'Worker 노드가 트랜잭션을 수집합니다. 여러 Worker로 선형 확장 가능.' },
  { label: '배치 생성', body: '트랜잭션을 배치로 묶어 digest를 Primary에게 전달합니다.' },
  { label: 'Vertex 제안', body: 'Primary가 배치 digest + 이전 라운드 Certificate를 포함한 Vertex를 브로드캐스트합니다.' },
  { label: '투표 수집', body: '다른 검증자들이 Vertex의 유효성을 확인하고 서명(투표)합니다.' },
  { label: 'Certificate 생성', body: '2f+1 투표가 모이면 Certificate가 생성되어 데이터 가용성이 보장됩니다.' },
  { label: '순서 결정', body: 'Bullshark/Tusk 합의 엔진이 DAG를 순회하며 전체 순서를 결정합니다.' },
];

const NODES = [
  { label: 'Worker', sub: 'TX 수집', color: '#6366f1' },
  { label: '배치 생성', sub: 'TX→Batch', color: '#8b5cf6' },
  { label: 'Vertex 제안', sub: 'Primary', color: '#10b981' },
  { label: '투표 수집', sub: '2f+1 서명', color: '#f59e0b' },
  { label: 'Certificate', sub: 'DAG 추가', color: '#ec4899' },
  { label: '순서 결정', sub: '합의 엔진', color: '#ef4444' },
];

const EDGES = ['TX 배치', 'batch digest', '브로드캐스트', '2f+1 투표', 'DAG 순회'];

export default function NarwhalFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 760 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="nf-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M0 0L6 3L0 6z" fill="#888" />
            </marker>
          </defs>
          {NODES.map((n, i) => {
            const x = i * 103;
            const active = i === step;
            const done = i < step;
            return (
              <g key={i}>
                {i > 0 && (
                  <motion.line x1={x - 6} y1={40} x2={x + 2} y2={40}
                    stroke={done || active ? n.color : '#555'}
                    strokeWidth={1.5} markerEnd="url(#nf-arr)"
                    animate={{ opacity: done || active ? 0.9 : 0.15 }} />
                )}
                <motion.rect x={x + 4} y={12} width={94} height={56} rx={8}
                  fill={n.color}
                  animate={{ opacity: active ? 1 : done ? 0.5 : 0.15 }}
                  transition={{ duration: 0.3 }} />
                <text x={x + 51} y={35} textAnchor="middle"
                  className="fill-white text-[10px] font-bold"
                  style={{ opacity: active ? 1 : done ? 0.7 : 0.3 }}>{n.label}</text>
                <text x={x + 51} y={50} textAnchor="middle"
                  className="fill-white/60 text-[10px]"
                  style={{ opacity: active ? 1 : done ? 0.5 : 0.2 }}>{n.sub}</text>
                {i > 0 && (
                  <text x={x - 2} y={28} textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                    style={{ opacity: done || active ? 0.7 : 0.15 }}>{EDGES[i - 1]}</text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
