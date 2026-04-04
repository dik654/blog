import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const NODES = [
  { id: 'sdk', label: 'Polkadot SDK', color: P, x: 120, y: 5 },
  { id: 'sub', label: 'Substrate', color: P, x: 10, y: 60 },
  { id: 'dot', label: 'Polkadot', color: P, x: 95, y: 60 },
  { id: 'cum', label: 'Cumulus', color: S, x: 180, y: 60 },
  { id: 'brg', label: 'Bridges', color: A, x: 260, y: 60 },
  { id: 'frame', label: 'FRAME', color: P, x: 10, y: 115 },
  { id: 'relay', label: 'Relay Chain', color: P, x: 95, y: 115 },
  { id: 'para', label: 'Parachain', color: S, x: 180, y: 115 },
  { id: 'snow', label: 'Snowbridge', color: A, x: 260, y: 115 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 },
  { from: 1, to: 5 }, { from: 2, to: 6 }, { from: 3, to: 7 }, { from: 4, to: 8 },
];

const STEPS = [
  { label: 'Polkadot SDK 전체 구조', body: '4개 핵심 컴포넌트가 협력하여 멀티체인 생태계를 구성합니다.' },
  { label: 'Substrate & FRAME', body: '모듈화된 블록체인 프레임워크. 팔렛 기반으로 기능을 조합합니다.' },
  { label: 'Polkadot 릴레이 체인', body: '공유 보안을 제공하는 중앙 릴레이 체인. 검증자가 파라체인을 검증합니다.' },
  { label: 'Cumulus & Bridges', body: 'Cumulus로 파라체인을 개발하고, Bridges로 외부 네트워크와 연결합니다.' },
];

const VN: number[][] = [[0,1,2,3,4,5,6,7,8],[0,1,5],[0,2,6],[0,3,4,7,8]];
const VE: number[][] = [[0,1,2,3,4,5,6,7],[0,4],[1,5],[2,3,6,7]];
const BW = 72, BH = 28;
const mid = (i: number) => ({ x: NODES[i].x+BW/2, y: NODES[i].y+BH/2 });

export default function SDKArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 485 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="4 3"
                animate={{ opacity: VE[step].includes(i) ? 0.7 : 0.06 }} />
            );
          })}
          {NODES.map((n, i) => (
            <motion.g key={n.id} animate={{ opacity: VN[step].includes(i) ? 1 : 0.1 }}>
              <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
              <text x={n.x+BW/2} y={n.y+BH/2+4} textAnchor="middle"
                fontSize={9} fontWeight={500} fill={n.color}>{n.label}</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
