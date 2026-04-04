import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const HASHES = 6;
const HX = (i: number) => 40 + i * 55;

const STEPS = [
  { label: '초기 해시 생성', body: 'SHA-256(초기 상태)로 첫 해시 생성. PoH 체인 시작점' },
  { label: '순차적 해싱', body: '이전 해시 → 다음 해시 순차 계산. 각 해시 = "시간의 틱"' },
  { label: 'TX 삽입', body: 'hash_k = SHA256(prev || tx). TX가 해당 시점에 존재했음을 증명' },
  { label: '병렬 검증', body: '체인을 구간 분할 → 다중 코어 동시 검증. O(n/cores)' },
];
const REFS = ['sol-poh-tick', 'sol-poh-tick', 'sol-poh-record', 'sol-poh-tick'];

export default function PoHViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 520 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">PoH Chain</text>
            {Array.from({ length: HASHES }).map((_, i) => {
              const x = HX(i);
              const visible = step === 0 ? i === 0 : i <= HASHES - 1;
              const isTx = step >= 2 && (i === 2 || i === 4);
              const vg = step === 3 ? (i < 3 ? 0 : 1) : -1;
              const vc = vg === 0 ? '#6366f1' : vg === 1 ? '#10b981' : '#888';
              return (
                <motion.g key={i} animate={{ opacity: visible ? 1 : 0.1 }} transition={sp}>
                  <motion.rect x={x - 22} y={25} width={44} height={28} rx={6}
                    animate={{ fill: isTx ? '#f59e0b20' : `${vc}15`, stroke: isTx ? '#f59e0b' : vc,
                      strokeWidth: isTx ? 2 : 1 }} transition={sp} />
                  <text x={x} y={38} textAnchor="middle" fontSize={9}
                    fill={isTx ? '#f59e0b' : vc} fontWeight={600}>H{i}</text>
                  <text x={x} y={48} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">{isTx ? '+TX' : 'SHA'}</text>
                  {i > 0 && visible && (
                    <motion.line x1={HX(i - 1) + 22} y1={39} x2={x - 22} y2={39}
                      stroke={vc} strokeWidth={1} strokeDasharray="3 2"
                      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp} />
                  )}
                </motion.g>
              );
            })}
            {step === 3 && (
              <>
                <motion.text x={HX(1)} y={68} textAnchor="middle" fontSize={9}
                  fill="#6366f1" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Core 1</motion.text>
                <motion.text x={HX(4)} y={68} textAnchor="middle" fontSize={9}
                  fill="#10b981" fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Core 2</motion.text>
              </>
            )}
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
