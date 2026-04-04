import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const SLOTS = [
  { slot: 100, conf: 1, lockout: 1 },
  { slot: 101, conf: 2, lockout: 3 },
  { slot: 102, conf: 3, lockout: 7 },
  { slot: 103, conf: 4, lockout: 15 },
  { slot: 104, conf: 5, lockout: 31 },
];

const STEPS = [
  { label: '첫 투표: slot 100', body: 'conf=1, lockout=1. 즉시 포크 전환 가능' },
  { label: '연속 투표: 스택 성장', body: '새 투표 → 기존 conf 증가 → 락아웃 2배' },
  { label: '락아웃 누적', body: '5회 연속 → 최하위 lockout=31. 포크 전환 비용 지수 증가' },
  { label: '최종성 (rooted)', body: '32 확인 → 2^32 슬롯 락아웃 ≈ 영구. 블록 rooted' },
];

const BAR_MAX = 200;

export default function TowerBFTViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 520 150" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Vote Stack</text>
            <text x={310} y={14} fontSize={9} fill="var(--muted-foreground)">Lockout</text>
            {SLOTS.map((s, i) => {
              const y = 24 + i * 24;
              const visible = step === 0 ? i === 0 : step === 1 ? i <= 2 : i <= 4;
              const barW = Math.min((s.lockout / 31) * BAR_MAX, BAR_MAX);
              const rooted = step === 3 && i === 0;
              const color = rooted ? '#10b981' : '#6366f1';
              return (
                <motion.g key={i} animate={{ opacity: visible ? 1 : 0.08 }} transition={sp}>
                  <text x={10} y={y + 12} fontSize={9} fill={color} fontWeight={600}>S{s.slot}</text>
                  <text x={50} y={y + 12} fontSize={9} fill="var(--muted-foreground)">conf={s.conf}</text>
                  <motion.rect x={100} y={y + 2} height={14} rx={3}
                    animate={{ width: visible ? barW : 0, fill: `${color}30`, stroke: color }}
                    strokeWidth={1} transition={sp} />
                  <motion.text x={105 + barW} y={y + 12} fontSize={9} fill={color}
                    animate={{ opacity: visible ? 0.8 : 0 }} transition={sp}>{s.lockout} slots</motion.text>
                  {rooted && (
                    <motion.text x={340} y={y + 12} fontSize={9} fill="#10b981" fontWeight={600}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>ROOT</motion.text>
                  )}
                </motion.g>
              );
            })}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode('sol-tower-vote')} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
