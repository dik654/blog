import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const STEPS = [
  { label: 'Solidity: 정수 기반 자산', body: 'balances 매핑 정수 조작. 오버플로우·이중 지출 가능' },
  { label: 'Move: 리소스 기반 자산', body: 'Coin 리소스는 이동만 가능. copy/drop 금지' },
  { label: 'Linear Type 보장', body: '컴파일러가 리소스 생성→이동→소비 추적. 누락 시 에러' },
  { label: 'Ability 시스템', body: 'key, store, copy, drop 4가지 능력으로 타입별 동작 제어' },
];

const ABILITIES = [
  { label: 'key', desc: '저장', color: '#6366f1' },
  { label: 'store', desc: '내장', color: '#10b981' },
  { label: 'copy', desc: '복제', color: '#ef4444' },
  { label: 'drop', desc: '폐기', color: '#ef4444' },
];

export default function MoveVMViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 520 130" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <motion.g animate={{ opacity: step === 0 ? 1 : 0.15 }} transition={sp}>
              <rect x={10} y={10} width={170} height={45} rx={8} fill="#ef444412" stroke="#ef4444" strokeWidth={1} />
              <text x={95} y={28} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">Solidity</text>
              <text x={95} y={42} textAnchor="middle" fontSize={9} fill="#ef4444">balances[addr] += amount</text>
            </motion.g>
            <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }} transition={sp}>
              <rect x={200} y={10} width={170} height={45} rx={8} fill="#10b98112" stroke="#10b981" strokeWidth={1.5} />
              <text x={285} y={28} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Move</text>
              <text x={285} y={42} textAnchor="middle" fontSize={9} fill="#10b981">let coin = withdraw(amount)</text>
            </motion.g>
            {step >= 1 && step < 3 && (
              <motion.g>
                <motion.rect rx={6} width={50} height={22} fill="#10b98130" stroke="#10b981" strokeWidth={1.5}
                  animate={{ x: step === 2 ? [220, 310] : [220, 220], y: [70, 70] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }} />
                <motion.text fontSize={9} fill="#10b981" fontWeight={600} textAnchor="middle"
                  animate={{ x: step === 2 ? [245, 335] : [245, 245], y: [84, 84] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}>Coin</motion.text>
              </motion.g>
            )}
            {step === 3 && ABILITIES.map((a, i) => {
              const x = 30 + i * 90, blocked = i >= 2;
              return (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.1 }}>
                  <rect x={x} y={80} width={75} height={35} rx={6}
                    fill={blocked ? '#ef444412' : `${a.color}12`}
                    stroke={blocked ? '#ef4444' : a.color} strokeWidth={1.5} />
                  <text x={x + 37} y={96} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={blocked ? '#ef4444' : a.color}>{a.label}</text>
                  <text x={x + 37} y={108} textAnchor="middle" fontSize={9}
                    fill={blocked ? '#ef4444' : a.color}>{blocked ? `${a.desc} X` : a.desc}</text>
                </motion.g>
              );
            })}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode('apt-move-abilities')} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
