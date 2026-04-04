import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'GossipServer', color: '#6366f1', x: 100, y: 5 },
  { label: 'GossipDataHandler', color: '#8b5cf6', x: 100, y: 45 },
  { label: 'GossipClient', color: '#10b981', x: 10, y: 45 },
  { label: 'GossipCache', color: '#f59e0b', x: 210, y: 45 },
  { label: 'BlockPool', color: '#ec4899', x: 55, y: 85 },
  { label: 'Mempool', color: '#14b8a6', x: 155, y: 85 },
];

const EDGES = [[0,1],[1,2],[1,3],[1,4],[1,5]];

const STEPS = [
  { label: '가십 프로토콜 아키텍처', body: 'GossipServer가 수신, DataHandler가 검증·라우팅, Cache가 중복 제거.' },
  { label: '수신 & 검증', body: 'GossipServer → DataHandler로 메시지 전달. IP 검증 + 피어 인증.' },
  { label: '중복 제거 & 라우팅', body: 'GossipCache로 중복 확인 후 BlockPool/Mempool로 분배.' },
];

const ACTIVE: number[][] = [[0,1,2,3,4,5],[0,1],[1,3,4,5]];
const BW = 80, BH = 26;

export default function GossipLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const active = ACTIVE[step];
        return (
          <svg viewBox="0 0 440 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([fi, ti], ei) => {
              const f = NODES[fi], t = NODES[ti];
              const show = active.includes(fi) && active.includes(ti);
              return (
                <motion.line key={ei}
                  x1={f.x + BW/2} y1={f.y + BH} x2={t.x + BW/2} y2={t.y}
                  stroke="#666" strokeWidth={show ? 1 : 0.4} strokeDasharray="3 2"
                  animate={{ opacity: show ? 0.5 : 0.1 }} transition={{ duration: 0.3 }} />
              );
            })}
            {NODES.map((n, i) => {
              const show = active.includes(i);
              return (
                <g key={i}>
                  <motion.rect x={n.x} y={n.y} width={BW} height={BH} rx={5}
                    animate={{ fill: `${n.color}${show?'18':'06'}`, stroke: n.color,
                      strokeWidth: show?1.5:0.5, opacity: show?1:0.2 }}
                    transition={{ duration: 0.3 }} />
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
