import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const NODES = [
  { label: '신원 생성', sub: 'Identity', color: '#6366f1' },
  { label: 'Merkle 등록', sub: 'Commitment', color: '#10b981' },
  { label: 'ZK 증명', sub: 'Semaphore', color: '#f59e0b' },
  { label: 'Nullifier', sub: '중복 방지', color: '#ec4899' },
  { label: 'PBH Tx', sub: '제출', color: '#8b5cf6' },
];

const STEPS = [
  { label: '신원 생성', body: '사용자의 비밀 키로 Identity와 Commitment을 생성합니다.' },
  { label: 'Merkle Tree 등록', body: 'Poseidon Merkle Tree(깊이 30)에 커밋먼트를 등록하고 포함 증명을 생성합니다.' },
  { label: 'Semaphore 증명', body: '신원, Merkle 포함 증명, external nullifier, 트랜잭션 해시로 ZK 증명을 생성합니다.' },
  { label: 'Nullifier Hash', body: 'nullifier_hash로 동일 증명의 중복 사용을 방지합니다.' },
  { label: 'PBH 트랜잭션', body: 'PBHPayload를 포함한 트랜잭션을 World Chain에 제출합니다.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const NW = 52, NH = 28, GAP = 56;

const REFS = ['wc-semaphore-proof', 'wc-semaphore-proof', 'wc-semaphore-proof', 'wc-semaphore-proof', 'wc-pbh-payload'];

export default function ProofFlowViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
        <svg viewBox="0 0 450 55" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
          <defs>
            <marker id="pf-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {NODES.map((n, i) => {
            const x = 6 + i * GAP;
            const active = step === i + 1;
            const vis = step === 0 || i < step || active;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 1 : 0.15 }} transition={sp}>
                <rect x={x} y={12} width={NW} height={NH} rx={5}
                  fill={active ? n.color + '22' : '#ffffff08'}
                  stroke={n.color} strokeWidth={active ? 2 : 0.8} />
                <text x={x + NW / 2} y={24} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={n.color}>{n.label}</text>
                <text x={x + NW / 2} y={34} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{n.sub}</text>
                {i < 4 && (
                  <line x1={x + NW} y1={26} x2={x + NW + 4} y2={26}
                    stroke="var(--muted-foreground)" strokeWidth={0.8}
                    markerEnd="url(#pf-a)" opacity={0.4} />
                )}
              </motion.g>
            );
          })}
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
