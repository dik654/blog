import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './GasDetailVizData';
import { CodeViewButton } from '@/components/code';

const REF_KEYS = ['mpool-add', 'mpool-estimate', 'mpool-add'];
const REF_LABELS = ['Add() 5단계 검증', 'GasEstimate()', '블록 선택'];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.ok}>mp.Add() — 5단계 검증 체인</text>
    <text x={20} y={44} fontSize={10} fill={C.ok}>Line 1: m.VerifySignature()  // 서명 검증</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
      Line 2: verifyNonce(m.From, m.Nonce)  // Nonce 순서 확인
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}>
      Line 3: checkGas(m.GasLimit, m.GasFeeCap)  // 가스 파라미터
    </motion.text>
    <motion.text x={20} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}>
      Line 4: checkBalance(m.From)  // 잔고 확인 → 실패 시 거부
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.gas}>GasEstimateMessageGas() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.gas}>Line 1: gasLimit := stmgr.CallWithGas(ctx, msg)  // 시뮬레이션</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: baseFee := ts.Blocks()[0].ParentBaseFee * 1.25 + premium
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: premium := medianGasPremium(recentBlocks)  // 최근 블록 중간값
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={110} h={22} label="자동 설정" sub="Gas 3파라미터" color={C.gas} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.ok}>SelectMessages() — 블록 포함</text>
    <text x={20} y={44} fontSize={10} fill={C.ok}>Line 1: sort.Slice(msgs, gasPremiumDesc)  // 가스 높은 순</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: for gasUsed {'<'} blockGasLimit {'{'} selected = append(selected, m) {'}'}
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 블록 가스 한도 내에서 수익 최대화 정렬
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function GasDetailViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
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
