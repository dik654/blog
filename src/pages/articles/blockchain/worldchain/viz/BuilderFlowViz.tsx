import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const ACTORS = [
  { label: 'rollup-boost', color: '#6366f1', x: 10 },
  { label: 'WC Builder', color: '#10b981', x: 88 },
  { label: 'Tx Pool', color: '#f59e0b', x: 166 },
  { label: 'PBH Validator', color: '#ec4899', x: 244 },
];

const MSGS = [
  { from: 0, to: 1, label: 'FCU 요청', y: 30 },
  { from: 1, to: 2, label: '트랜잭션 조회', y: 44 },
  { from: 2, to: 3, label: 'PBH 검증', y: 58 },
  { from: 3, to: 1, label: '검증 결과', y: 72 },
  { from: 1, to: 0, label: 'ExecutionPayload', y: 86 },
];

const STEPS = [
  { label: 'FCU 요청', body: 'rollup-boost가 engine_forkChoiceUpdatedV3를 호출하여 새 블록 빌드를 요청합니다.' },
  { label: '트랜잭션 조회', body: 'Builder가 트랜잭션 풀에서 최적의 트랜잭션 목록을 조회합니다.' },
  { label: 'PBH 검증', body: 'PBH Validator가 Semaphore ZK 증명과 World ID 루트를 검증합니다.' },
  { label: '검증 결과', body: '검증된 PBH 트랜잭션 목록과 일반 트랜잭션을 분류합니다.' },
  { label: 'Payload 반환', body: 'PBH 트랜잭션을 우선 배치한 ExecutionPayload를 rollup-boost에 반환합니다.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const REFS = ['wc-payload-builder', 'wc-tx-pool', 'wc-semaphore-proof', 'wc-tx-pool', 'wc-payload-builder'];

export default function BuilderFlowViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
        <svg viewBox="0 0 470 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
          <defs>
            <marker id="bf-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="#f59e0b" />
            </marker>
          </defs>
          {/* Lifelines first */}
          {ACTORS.map((a, i) => (
            <g key={`life-${i}`}>
              <line x1={a.x + 35} y1={20} x2={a.x + 35} y2={96}
                stroke={a.color} strokeWidth={0.5} strokeDasharray="2 2" opacity={0.3} />
            </g>
          ))}
          {/* Message arrows */}
          {MSGS.map((m, i) => {
            const vis = step === 0 || step === i + 1;
            const x1 = ACTORS[m.from].x + 35;
            const x2 = ACTORS[m.to].x + 35;
            const mx = (x1 + x2) / 2, my = m.y - 4;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <line x1={x1} y1={m.y} x2={x2} y2={m.y}
                  stroke="#f59e0b" strokeWidth={1.2} markerEnd="url(#bf-a)" />
                <rect x={mx - 22} y={my - 5.5} width={44} height={8} rx={2} fill="var(--card)" />
                <text x={mx} y={my} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">{m.label}</text>
              </motion.g>
            );
          })}
          {/* Actor nodes after edges */}
          {ACTORS.map((a, i) => (
            <g key={i}>
              <rect x={a.x} y={6} width={70} height={14} rx={4}
                fill={a.color + '18'} stroke={a.color} strokeWidth={1} />
              <text x={a.x + 35} y={16} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={a.color}>{a.label}</text>
            </g>
          ))}
        </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(REFS[step])} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
