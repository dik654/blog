import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const LEADER = { x: 190, y: 20 };
const L1 = [{ x: 70, y: 70 }, { x: 190, y: 70 }, { x: 310, y: 70 }];
const L2 = [
  { x: 30, y: 120 }, { x: 110, y: 120 },
  { x: 150, y: 120 }, { x: 230, y: 120 },
  { x: 270, y: 120 }, { x: 350, y: 120 },
];

const STEPS = [
  { label: '리더: 블록 → Shred 분할', body: '~1280B 패킷 + Erasure coding. 일부 유실 시 복구 가능' },
  { label: 'Layer 0: 리더 → 1차 계층', body: 'fanout 수만큼 검증자에게 shred 전송' },
  { label: 'Layer 1: 재전파', body: '수신 검증자 → 하위 노드 전파. O(log n) 홉' },
  { label: '전체 네트워크 도달', body: '모든 검증자가 shred 수집 → 블록 재조립' },
];

export default function TurbineViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 520 155" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp}>
              <circle cx={LEADER.x} cy={LEADER.y} r={14} fill="#6366f130" stroke="#6366f1" strokeWidth={1.5} />
              <text x={LEADER.x} y={LEADER.y + 4} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">Leader</text>
            </motion.g>
            {L1.map((n, i) => (
              <motion.line key={`e1-${i}`} x1={LEADER.x} y1={LEADER.y + 14} x2={n.x} y2={n.y - 12}
                stroke="#0ea5e9" strokeWidth={1.5} strokeDasharray="4 2"
                animate={{ opacity: step >= 1 ? 0.7 : 0.05 }} transition={sp} />
            ))}
            {L1.map((n, i) => (
              <motion.g key={`l1-${i}`} animate={{ opacity: step >= 1 ? 1 : 0.1 }} transition={sp}>
                <circle cx={n.x} cy={n.y} r={12} fill="#0ea5e920" stroke="#0ea5e9" strokeWidth={1.5} />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize={9} fill="#0ea5e9">V{i + 1}</text>
              </motion.g>
            ))}
            {L2.map((n, i) => (
              <motion.line key={`e2-${i}`} x1={L1[Math.floor(i / 2)].x} y1={L1[Math.floor(i / 2)].y + 12}
                x2={n.x} y2={n.y - 10} stroke="#10b981" strokeWidth={1} strokeDasharray="3 2"
                animate={{ opacity: step >= 2 ? 0.6 : 0.05 }} transition={sp} />
            ))}
            {L2.map((n, i) => (
              <motion.g key={`l2-${i}`} animate={{ opacity: step >= 2 ? 1 : 0.1 }} transition={sp}>
                <circle cx={n.x} cy={n.y} r={10} fill="#10b98120" stroke="#10b981" strokeWidth={1} />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize={9} fill="#10b981">V{i + 4}</text>
              </motion.g>
            ))}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode('sol-turbine-shred')} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
