import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const STAGES = [
  { label: 'FetchStage', sub: 'UDP/QUIC 수신', color: '#6366f1' },
  { label: 'SigVerify', sub: 'GPU 서명 검증', color: '#0ea5e9' },
  { label: 'BankingStage', sub: '병렬 실행 + PoH', color: '#10b981' },
  { label: 'Broadcast', sub: 'Turbine 전파', color: '#f59e0b' },
];

const STEPS = [
  { label: 'Fetch: TX 수신', body: 'UDP/QUIC 소켓 패킷 수신. 투표 TX / 일반 TX 분리' },
  { label: 'SigVerify: GPU 서명 검증', body: 'Ed25519 서명 GPU 병렬 검증. 무효 서명 즉시 드롭' },
  { label: 'Banking: 실행 & PoH 기록', body: '6 스레드(2 vote + 4 non-vote) Sealevel 병렬 실행 → PoH 기록' },
  { label: 'Broadcast: Shred 전파', body: '블록 → shred 분할 → Turbine 프로토콜 네트워크 전파' },
];

const REFS = ['sol-tpu-pipeline', 'sol-tpu-pipeline', 'sol-sealevel-exec', 'sol-turbine-shred'];

export default function PipelineViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 600 75" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <defs>
              <marker id="pipe-arr" viewBox="0 0 6 6" refX={5} refY={3}
                markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                <path d="M0 0L6 3L0 6z" fill="#888" />
              </marker>
            </defs>
            {STAGES.map((s, i) => {
              const x = i * 115, active = i === step, done = i < step;
              return (
                <g key={i}>
                  {i > 0 && (
                    <motion.line x1={x - 6} y1={38} x2={x + 2} y2={38}
                      stroke={done || active ? s.color : '#555'} strokeWidth={1.5}
                      markerEnd="url(#pipe-arr)"
                      animate={{ opacity: done || active ? 0.8 : 0.15 }} transition={sp} />
                  )}
                  <motion.rect x={x + 4} y={12} width={104} height={52} rx={8}
                    fill={s.color} animate={{ opacity: active ? 1 : done ? 0.5 : 0.12 }}
                    transition={{ duration: 0.3 }} />
                  <text x={x + 56} y={34} textAnchor="middle" className="fill-white"
                    fontSize={10} fontWeight={600} style={{ opacity: active ? 1 : done ? 0.7 : 0.3 }}>
                    {s.label}
                  </text>
                  <text x={x + 56} y={48} textAnchor="middle" className="fill-white/60"
                    fontSize={9} style={{ opacity: active ? 1 : done ? 0.5 : 0.2 }}>
                    {s.sub}
                  </text>
                </g>
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
