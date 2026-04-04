import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'ChainSyncService', color: '#6366f1', x: 85, y: 5 },
  { label: 'PeerList', color: '#10b981', x: 10, y: 50 },
  { label: 'ApiClient', color: '#8b5cf6', x: 90, y: 50 },
  { label: 'BlockPool', color: '#f59e0b', x: 170, y: 50 },
  { label: 'ChainSyncState', color: '#ec4899', x: 50, y: 95 },
  { label: 'BlockIndex', color: '#14b8a6', x: 160, y: 95 },
];

const EDGES = [[0,1],[0,2],[0,3],[0,4],[2,5],[3,5]];
const STEPS = [
  { label: '체인 동기화 아키텍처', body: 'ChainSyncService가 피어에서 블록 인덱스를 가져와 순차 동기화합니다.' },
  { label: '피어 발견 & 인덱스 요청', body: 'PeerList에서 활성 피어를 선택하고 ApiClient로 블록 인덱스를 요청.' },
  { label: '블록 처리 & 상태 갱신', body: 'BlockPool에서 블록을 처리하고 ChainSyncState를 갱신합니다.' },
];
const ACTIVE: number[][] = [[0,1,2,3,4,5],[0,1,2,5],[0,3,4]];
const BW = 75, BH = 28;

export default function ChainSyncFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const active = ACTIVE[step];
        return (
          <svg viewBox="0 0 400 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([fi,ti],ei) => {
              const f=NODES[fi],t=NODES[ti];
              const show = active.includes(fi) && active.includes(ti);
              return (
                <motion.line key={ei} x1={f.x+BW/2} y1={f.y+BH} x2={t.x+BW/2} y2={t.y}
                  stroke="#666" strokeWidth={show?1:0.4} strokeDasharray="3 2"
                  animate={{ opacity: show?0.5:0.1 }} transition={{ duration: 0.3 }} />
              );
            })}
            {NODES.map((n,i) => {
              const show = active.includes(i);
              return (
                <g key={i}>
                  <motion.rect x={n.x} y={n.y} width={BW} height={BH} rx={5}
                    animate={{ fill:`${n.color}${show?'18':'06'}`, stroke:n.color,
                      strokeWidth: show?1.5:0.5, opacity: show?1:0.2 }}
                    transition={{ duration:0.3 }} />
                  <text x={n.x+BW/2} y={n.y+BH/2+3} textAnchor="middle"
                    fontSize={10} fontWeight={600} fill={n.color} opacity={show?1:0.2}>
                    {n.label}
                  </text>
                </g>
              );
            })}
        </svg>
        );
      }}
    </StepViz>
  );
}
