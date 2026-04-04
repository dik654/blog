import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Protobuf 인코딩', color: '#6366f1', sub: '서명 + 직렬화' },
  { label: 'CheckTx', color: '#8b5cf6', sub: 'AnteHandler' },
  { label: 'PrepareProposal', color: '#10b981', sub: 'TX 선택' },
  { label: 'FinalizeBlock', color: '#f59e0b', sub: 'Keeper 실행' },
  { label: 'Commit', color: '#ec4899', sub: 'app_hash' },
  { label: 'IAVL Store', color: '#ef4444', sub: '영구 저장' },
];

const EDGES = ['TX 제출', '멤풀 진입', '블록 확정', '상태 변경', 'IAVL 커밋'];

const STEPS = [
  { label: 'TX 생성', body: 'Protobuf Any 타입으로 메시지를 직렬화하고 secp256k1/ed25519로 서명합니다.' },
  { label: 'CheckTx (멤풀 검증)', body: 'AnteHandler 체인: 서명/nonce/fee 검증 → GasMeter 설정 → 멤풀 진입.' },
  { label: 'PrepareProposal', body: '리더가 멤풀에서 TX를 선택합니다. MEV 방지 로직 삽입 가능.' },
  { label: 'FinalizeBlock', body: 'BeginBlock → Msg 실행(Keeper) → EndBlock. Gas 차감, 이벤트 발생.' },
  { label: 'Commit', body: 'MultiStore.Commit() → IAVL 루트 해시 → app_hash.' },
  { label: 'IAVL 저장', body: 'AVL 트리 노드가 RocksDB/PebbleDB에 영구 저장됩니다.' },
];

const NW = 62, NH = 36, GAP = 66, SY = 55;
function nx(i: number) { return 6 + i * GAP; }

export default function TxFlowSequenceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 548 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tx-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => {
            const x1 = nx(i) + NW, x2 = nx(i + 1), visible = i < step;
            return (
              <motion.g key={`e-${i}`} initial={{ opacity: 0 }} animate={{ opacity: visible ? 0.6 : 0 }}>
                <line x1={x1} y1={SY} x2={x2} y2={SY} stroke="var(--muted-foreground)"
                  strokeWidth={1.2} markerEnd="url(#tx-ah)" />
                <rect x={(x1 + x2) / 2 - 16} y={SY - 15} width={32} height={11} rx={2} fill="var(--card)" />
                <text x={(x1 + x2) / 2} y={SY - 8} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{lbl}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const x = nx(i), visible = i <= step, glow = i === step;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0.15 }}
                transition={{ duration: 0.3 }}>
                <rect x={x} y={SY - NH / 2} width={NW} height={NH} rx={6}
                  fill={glow ? n.color + '22' : '#ffffff08'} stroke={n.color}
                  strokeWidth={glow ? 2 : 1} opacity={0.9} />
                <text x={x + NW / 2} y={SY} textAnchor="middle" fontSize={9} fontWeight="700"
                  fill={n.color}>{n.label}</text>
                <text x={x + NW / 2} y={SY + 10} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{n.sub}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
