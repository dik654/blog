import { motion } from 'framer-motion';
import StepViz from './StepViz';

const STEPS = [
  { label: '에폭(32슬롯=6.4분) 끝의 첫 번째 블록이 체크포인트입니다', body: 'LMD-GHOST는 이론적으로 언제나 재편성이 가능합니다. 거래소는 수학적으로 비가역적인 상태가 필요합니다. Casper FFG는 특정 체크포인트 이후를 "되돌리려면 전체 스테이크의 1/3 이상이 슬래싱되어야 함"으로 확정합니다.' },
  { label: '검증자들이 FFG 투표: source=E0 → target=E1', body: '각 어테스테이션은 LMD-GHOST 투표와 함께 FFG 투표를 포함합니다: (source checkpoint → target checkpoint) 링크에 서명. source는 이미 justified된 가장 최근 체크포인트, target은 현재 에폭 체크포인트입니다.' },
  { label: '2/3 이상이 투표 → E1 Justified', body: '동일한 (source → target) 링크에 2/3 이상이 투표하면 target이 Justified됩니다. 2/3 슈퍼마조리티인 이유: 두 상충 체크포인트가 각각 2/3를 받으려면 4/3>1이므로 반드시 이중투표자가 존재합니다.' },
  { label: 'E2도 Justified → E1이 최종 확정(Finalized)됩니다', body: '연속된 두 에폭 n, n+1이 모두 justified되면 에폭 n이 Finalized됩니다. EL은 finalized checkpoint를 safe_head로 설정하고 MDBX에 영구 기록합니다. 약 12.8분(2에폭) 소요됩니다.' },
];

type EpochState = 'pending' | 'justified' | 'finalized';

function epochCls(s: EpochState) {
  if (s==='finalized') return 'border-green-500 bg-green-50/50 dark:bg-green-950/20';
  if (s==='justified') return 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20';
  return 'border-border bg-muted/30';
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
  return 'text-muted-foreground/50';
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
          {['E0','E1','E2'].map((id) => {
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
                <motion.div className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-colors duration-300 ${epochCls(state)}`}
                  animate={{ scale: state==='finalized'?[1,1.06,1]:1 }} transition={{ duration:0.4 }}>
                  {id}
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
