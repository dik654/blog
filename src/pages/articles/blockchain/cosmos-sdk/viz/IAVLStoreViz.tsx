import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'IAVL+ 이진 트리 구조', body: 'Cosmos SDK는 모듈별 독립 IAVL+ 트리로 상태를 저장. AVL 균형 트리 기반.' },
  { label: '노드 삽입 (Insert)', body: '새 키-값 삽입 시 트리 경로를 탐색하고, 삽입 후 AVL 회전으로 균형 유지.' },
  { label: '상태 증명 (Proof Path)', body: '특정 키의 존재 증명: 루트까지의 경로 해시만 제공. O(log n) 크기.' },
  { label: 'MultiStore 커밋', body: '각 모듈 IAVL 루트 해시를 모아 app_hash 생성. 이더리움 stateRoot에 대응.' },
];

const C = { node: '#6366f1', ins: '#10b981', proof: '#f59e0b', root: '#8b5cf6' };
const TN = [
  { x: 180, y: 20, l: 'root', ch: [1, 2] }, { x: 100, y: 70, l: '23', ch: [3, 4] },
  { x: 260, y: 70, l: '78', ch: [5, 6] }, { x: 60, y: 120, l: '12', ch: [] },
  { x: 140, y: 120, l: '45', ch: [] }, { x: 220, y: 120, l: '67', ch: [] },
  { x: 300, y: 120, l: '90', ch: [] },
];
const PP = [4, 1, 0];
const STORES = ['bank', 'staking', 'gov', 'auth', 'ibc'];

export default function IAVLStoreViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= 2 ? (<g>
            {TN.map((n, i) => n.ch.map(ci => {
              const hi = step === 2 && PP.includes(i) && PP.includes(ci);
              return (
                <motion.line key={`${i}-${ci}`} x1={n.x} y1={n.y + 12} x2={TN[ci].x} y2={TN[ci].y - 12}
                  stroke={hi ? C.proof : '#555'} strokeWidth={hi ? 2.5 : 1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }} />
              );
            }))}
            {TN.map((n, i) => {
              const fl = step === 1 && i === 4 ? C.ins : step === 2 && PP.includes(i) ? C.proof : C.node;
              const big = (step === 1 && i === 4) || (step === 2 && PP.includes(i));
              return (
                <motion.g key={i} animate={{ scale: big ? 1.15 : 1 }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
                  <circle cx={n.x} cy={n.y} r={14} fill={`${fl}20`} stroke={fl} strokeWidth={1.5} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={9} fontWeight="600" fill={fl}>{n.l}</text>
                </motion.g>
              );
            })}
            {step === 1 && <motion.circle r={4} fill={C.ins}
              animate={{ cx: [180, 100, 140], cy: [20, 70, 120] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }} />}
            {step === 2 && <motion.text x={310} y={140} fontSize={9} fill={C.proof} fontWeight="600"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>증명 경로</motion.text>}
          </g>) : (<g>
            <rect x={130} y={10} width={120} height={30} rx={6} fill={`${C.root}15`} stroke={C.root} strokeWidth={1.5} />
            <text x={190} y={30} textAnchor="middle" fontSize={10} fontWeight="700" fill={C.root}>app_hash</text>
            {STORES.map((s, i) => {
              const x = 30 + i * 68;
              return (<g key={s}>
                <motion.line x1={190} y1={40} x2={x + 30} y2={75} stroke={C.node} strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }} />
                <rect x={x} y={75} width={60} height={45} rx={5} fill={`${C.node}10`} stroke={C.node} strokeWidth={1.5} />
                <text x={x + 30} y={93} textAnchor="middle" fontSize={9} fontWeight="600" fill={C.node}>x/{s}</text>
                <text x={x + 30} y={108} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">IAVL+</text>
              </g>);
            })}
            <text x={190} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              모듈별 독립 IAVL KVStore → 루트 해시 합산
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
