import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: 'Client', color: '#8b5cf6', x: 30, y: 50 },
  { label: 'RPC', color: '#6366f1', x: 130, y: 50 },
  { label: 'Leader N', color: '#10b981', x: 240, y: 30 },
  { label: 'Leader N+1', color: '#f59e0b', x: 240, y: 75 },
];

const STEPS = [
  { label: '클라이언트 TX 전송', body: 'Client → 가장 가까운 RPC 노드에 TX 제출' },
  { label: 'RPC → 현재 리더', body: 'RPC가 현재 슬롯 리더에게 직접 포워딩' },
  { label: '다음 리더 사전 전달', body: '현재 리더 미처리 대비 → 다음 리더에게도 전달' },
  { label: '멤풀 불필요', body: 'PoH 기반 스케줄 예측 → gossip 멤풀 제거' },
];

const BW = 70, BH = 28;

export default function GulfStreamViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 480 115" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <motion.line x1={100} y1={64} x2={130} y2={64}
              stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 2"
              animate={{ opacity: step >= 0 ? 0.8 : 0.1 }} transition={sp} />
            <motion.line x1={200} y1={58} x2={240} y2={46}
              stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2"
              animate={{ opacity: step >= 1 ? 0.8 : 0.1 }} transition={sp} />
            <motion.line x1={200} y1={68} x2={240} y2={85}
              stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2"
              animate={{ opacity: step >= 2 ? 0.8 : 0.1 }} transition={sp} />
            {step === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={135} y1={20} x2={195} y2={20} stroke="#ef4444" strokeWidth={1.5} />
                <rect x={140} y={9} width={50} height={10} rx={2} fill="var(--card)" />
                <text x={165} y={16} textAnchor="middle" fontSize={9}
                  fill="#ef4444" fontWeight={600}>No Mempool</text>
              </motion.g>
            )}
            {NODES.map((n, i) => (
              <g key={i}>
                <motion.rect x={n.x} y={n.y} width={BW} height={BH} rx={7}
                  fill={`${n.color}18`} stroke={n.color} strokeWidth={1.5}
                  animate={{ opacity: i <= step + 1 || i === 0 ? 1 : 0.15 }} transition={sp} />
                <text x={n.x + BW / 2} y={n.y + BH / 2 + 4} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              </g>
            ))}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode('sol-gulf-forward')} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
