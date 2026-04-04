import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './NonceVizData';
import { CodeViewButton } from '@/components/code';

function StepSeq() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.ok}>Nonce 순차 실행 규칙</text>
    <text x={20} y={44} fontSize={10} fill={C.ok}>Line 1: pending[addr] = [nonce=3, nonce=4, nonce=5]</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // nonce=3 실행 → nonce=4 실행 가능
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // nonce=4 미완료 → nonce=5 실행 불가 (대기)
    </motion.text>
  </g>);
}

function StepBlock() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.err}>Nonce 갭 문제 — 전부 블로킹</text>
    <text x={20} y={44} fontSize={10} fill={C.miner}>Line 1: msgs = [WinPoSt(n=0), PreCmt(n=1), PrvCmt(n=2)]</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: if nonce=0 누락 → nonce=1, nonce=2 전부 실행 불가
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 마이너 WinPoSt 포함 모든 메시지 블로킹 → 보상 손실
    </motion.text>
  </g>);
}

function StepAuto() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.ok}>MpoolPushMessage() — 자동 할당</text>
    <text x={20} y={44} fontSize={10} fill={C.ok}>Line 1: msg.Nonce = mp.nextNonce(msg.From)  // pending 맵 조회</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.wait}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: pending[addr].nonce++  // 자동 증가
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 자동 할당으로 nonce 갭 원천 방지
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="자동 nonce" sub="갭 방지" color={C.ok} />
    </motion.g>
  </g>);
}

const R = [StepSeq, StepBlock, StepAuto];
const REF_KEYS = ['mpool-add', 'mpool-add', 'mpool-estimate'];
const REF_LABELS = ['verifyNonce()', 'Nonce 갭 문제', 'MpoolPushMessage'];

export default function NonceViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl"
              style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(REF_KEYS[step])} />
                <span className="text-[10px] text-muted-foreground">
                  {REF_LABELS[step]}
                </span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
