import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STAGES = [
  { label: '인코딩', short: 'Encode', color: '#6366f1', x: 10 },
  { label: 'CheckTx', short: 'Check', color: '#8b5cf6', x: 82 },
  { label: 'Prepare', short: 'Prep', color: '#10b981', x: 154 },
  { label: 'Finalize', short: 'Final', color: '#f59e0b', x: 226 },
  { label: 'Commit', short: 'Commit', color: '#ec4899', x: 298 },
];

const STEPS = [
  { label: 'Cosmos TX 전체 생명주기', body: '인코딩 → CheckTx → PrepareProposal → FinalizeBlock → Commit.' },
  { label: '① Protobuf 인코딩 & 서명', body: 'Protobuf Any 타입으로 직렬화. secp256k1/ed25519 서명. SignDoc 해시.' },
  { label: '② CheckTx — 멤풀 진입', body: 'AnteHandler: 서명, nonce, fee 검증. GasMeter 설정. 멤풀 우선순위 결정.' },
  { label: '③ PrepareProposal', body: 'ABCI 2.0: 앱이 직접 TX를 선택/재정렬. MEV 방지 로직 삽입 가능.' },
  { label: '④ FinalizeBlock — 상태 전이', body: 'BeginBlock → Msg 실행 (Keeper) → EndBlock. Gas 차감, 이벤트 발생.' },
  { label: '⑤ Commit → app_hash', body: 'MultiStore.Commit() → IAVL 루트 해시 → app_hash. 이더리움 stateRoot 대응.' },
];

const SW = 62, SH = 40;

export default function TxLifecycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Pipeline stages */}
          {STAGES.map((s, i) => {
            const active = step === 0 || step === i + 1;
            return (
              <motion.g key={s.short}
                animate={{ opacity: active ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}>
                <motion.rect x={s.x} y={25} width={SW} height={SH} rx={6}
                  fill={`${s.color}15`} stroke={s.color} strokeWidth={1.5}
                  animate={{ scale: active ? 1 : 0.95 }}
                  style={{ transformOrigin: `${s.x + SW / 2}px ${25 + SH / 2}px` }} />
                <text x={s.x + SW / 2} y={42} textAnchor="middle" fontSize={9} fontWeight="700" fill={s.color}>
                  {s.short}
                </text>
                <text x={s.x + SW / 2} y={56} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  {s.label}
                </text>
                {/* Arrow between stages */}
                {i < STAGES.length - 1 && (
                  <motion.line x1={s.x + SW + 2} y1={45} x2={s.x + SW + 18} y2={45}
                    stroke={s.color} strokeWidth={1.5} opacity={0.5}
                    markerEnd="url(#arrowhead)" />
                )}
              </motion.g>
            );
          })}
          {/* Arrow marker */}
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="var(--muted-foreground)" />
            </marker>
          </defs>
          {/* Animated packet */}
          {step >= 1 && step <= 5 && (
            <motion.rect width={10} height={10} rx={2} y={40}
              fill={STAGES[step - 1].color}
              animate={{
                x: [STAGES[step - 1].x + 5, STAGES[Math.min(step, 4)].x + SW - 15],
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.2 }} />
          )}
          {/* Labels */}
          <text x={190} y={88} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            TX → 멤풀 검증 → 블록 제안 → 실행 → 커밋
          </text>
        </svg>
      )}
    </StepViz>
  );
}
