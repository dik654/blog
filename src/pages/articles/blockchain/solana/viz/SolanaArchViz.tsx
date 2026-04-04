import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const LAYERS = [
  { label: 'Gulf Stream', sub: 'TX 포워딩', color: '#6366f1', y: 10 },
  { label: 'TPU Pipeline', sub: 'Fetch→SigVerify→Bank', color: '#0ea5e9', y: 52 },
  { label: 'PoH Generator', sub: 'SHA-256 해시 체인', color: '#10b981', y: 94 },
  { label: 'Tower BFT', sub: '합의 & 투표', color: '#f59e0b', y: 136 },
  { label: 'Turbine', sub: 'Shred 전파', color: '#ec4899', y: 178 },
];

const STEPS = [
  { label: 'Gulf Stream: 트랜잭션 수신', body: '클라이언트 → 다음 리더 직접 전달. 멤풀 없이 TPU로 전달' },
  { label: 'TPU 파이프라인 처리', body: 'Fetch → SigVerify → Banking → Broadcast 4단계 파이프라인' },
  { label: 'PoH 타임스탬프 기록', body: 'SHA-256 반복 해시로 시간 증명 생성. 모든 TX에 검증 가능한 순서 부여' },
  { label: 'Tower BFT 합의', body: 'PoH 슬롯 위에서 지수적 락아웃 투표. 32 확인 → 최종성(finality)' },
  { label: 'Turbine 블록 전파', body: '블록 → shred 분할 → 트리 구조 전파. O(log n) 홉' },
];

const REFS = ['sol-gulf-forward', 'sol-tpu-pipeline', 'sol-poh-tick', 'sol-tower-vote', 'sol-turbine-shred'];

export default function SolanaArchViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 520 220" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            {LAYERS.map((l, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <motion.g key={i} animate={{ opacity: active ? 1 : done ? 0.6 : 0.2 }} transition={sp}>
                  <motion.rect x={40} y={l.y} width={300} height={34} rx={8}
                    fill={l.color} animate={{ opacity: active ? 0.9 : done ? 0.4 : 0.12 }} transition={sp} />
                  <text x={190} y={l.y + 16} textAnchor="middle" fontSize={10} fontWeight={600}
                    className="fill-white">{l.label}</text>
                  <text x={190} y={l.y + 27} textAnchor="middle" fontSize={9}
                    className="fill-white/70">{l.sub}</text>
                  {i > 0 && (
                    <motion.line x1={190} y1={LAYERS[i - 1].y + 34} x2={190} y2={l.y}
                      stroke={done || active ? '#888' : '#444'} strokeWidth={1}
                      strokeDasharray="3 2" animate={{ opacity: done || active ? 0.6 : 0.1 }} transition={sp} />
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
