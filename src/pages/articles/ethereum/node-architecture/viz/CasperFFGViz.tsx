import { motion } from 'framer-motion';
import StepViz from './StepViz';

const STEPS = [
  { label: '에폭(32슬롯=6.4분) 끝의 첫 번째 블록이 체크포인트입니다', body: 'Epoch 290,310 · 슬롯 9,289,920~9,289,951. 활성 검증자 약 1,010,000명.' },
  { label: '검증자들이 FFG 투표: source=E290310 → target=E290311', body: 'source=0xa3f1…, target=0xb72e…. 약 680,000명이 1에폭 내 투표.' },
  { label: '2/3 이상이 투표 → E290311 Justified', body: '680,000 / 1,010,000 = 67.3% > 66.7% — supermajority 달성.' },
  { label: 'E290312도 Justified → E290311 최종 확정(Finalized)', body: 'E290311 finalized — 되돌리려면 1/3(약 10.8M ETH) 슬래싱 필요.' },
];

type EpochState = 'pending' | 'justified' | 'finalized';

function epochCls(s: EpochState) {
  if (s==='finalized') return 'border-green-500 bg-green-50/50 dark:bg-green-950/20';
  if (s==='justified') return 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20';
  return 'border-border';
}
function statusLabel(s: EpochState, id: string) {
  if (s==='finalized') return 'Finalized ✓';
  if (s==='justified') return 'Justified';
  if (id==='E0') return 'Genesis';
  return '대기 중';
}
function statusColor(s: EpochState) {
  if (s==='finalized') return 'text-green-500';
  if (s==='justified') return 'text-yellow-500';
  return 'text-foreground/75/50';
}
function getState(id: string, step: number): EpochState {
  if (id==='E0') return 'justified';
  if (id==='E1') { if (step>=3) return 'finalized'; if (step>=2) return 'justified'; return 'pending'; }
  if (id==='E2') return step>=3 ? 'justified' : 'pending';
  return 'pending';
}

export default function CasperFFGViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="flex items-center justify-center gap-6 w-full py-4">
          {['E0','E1','E2'].map((id, idx) => {
            const epochNum = 290310 + idx;
            const state = getState(id, step);
            return (
              <div key={id} className="flex flex-col items-center gap-2">
                <div className="relative h-10 flex items-end justify-center w-20">
                  {id==='E1' && [0,0.08,0.16].map((delay,i) => (
                    <motion.div key={i} className="absolute flex flex-col items-center"
                      initial={{ opacity:0, y:-8 }} animate={{ opacity:step>=1?1:0, y:step>=1?0:-8 }}
                      transition={{ duration:0.3, delay }}>
                      <div className="w-px h-5 bg-yellow-400" />
                      <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <motion.div className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-colors duration-300 ${epochCls(state)}`}
                  animate={{ scale: state==='finalized'?[1,1.06,1]:1 }} transition={{ duration:0.4 }}>
                  <span className="text-base font-bold">{id}</span>
                  <span className="text-[8px] font-mono text-muted-foreground">{epochNum}</span>
                </motion.div>
                <span className={`text-xs font-medium ${statusColor(state)}`}>{statusLabel(state, id)}</span>
              </div>
            );
          })}
        </div>
      )}
    </StepViz>
  );
}
