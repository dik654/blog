import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'app', label: '사용자 앱', color: '#6366f1', x: 60, y: 50 },
  { id: 'client', label: 'IrysApiClient', color: '#0ea5e9', x: 200, y: 20 },
  { id: 'signer', label: 'IrysSigner', color: '#10b981', x: 200, y: 100 },
  { id: 'node', label: 'Irys 노드', color: '#f59e0b', x: 340, y: 50 },
  { id: 'chain', label: '블록체인', color: '#8b5cf6', x: 340, y: 120 },
];

const EDGES = [
  { from: 0, to: 1, label: 'HTTP 클라이언트' },
  { from: 0, to: 2, label: '트랜잭션 서명' },
  { from: 2, to: 1, label: '서명된 TX' },
  { from: 1, to: 3, label: 'REST 전송' },
  { from: 3, to: 4, label: '블록 포함' },
];

const STEPS = [
  { label: 'SDK 초기화', body: 'IrysApiClient와 IrysSigner를 생성하고 노드 주소를 설정합니다.' },
  { label: '트랜잭션 서명', body: 'IrysSigner가 ECDSA(k256)로 데이터 트랜잭션에 서명합니다.' },
  { label: '노드 전송', body: '서명된 트랜잭션을 REST API로 Irys 노드에 전송합니다.' },
  { label: '블록 확정', body: '노드가 트랜잭션을 검증하고 블록에 포함시켜 영구 저장합니다.' },
];

const VN = [[0, 1, 2], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4]];
const VE = [[0, 1], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4]];

export default function ClientSDKViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            const mx = (f.x + t.x) / 2 + 8, my = (f.y + 15 + t.y + 15) / 2 + 5;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x} y1={f.y + 30} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1} />
                <rect x={mx - 28} y={my - 8} width={56} height={12} rx={2} fill="var(--card)" />
                <text x={mx} y={my} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x - 50} y={n.y} width={100} height={30} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
