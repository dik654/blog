import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './RewardDetailVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

function Step0() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: effBal := v.EffectiveBalance  // 32 ETH
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: baseReward = effBal * 64 / math.IntSqrt(totalActive)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: // totalActive = 18.5M ETH → baseReward ~15,058 Gwei
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // effective_balance * BASE_REWARD_FACTOR / sqrt(total)
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="~15K Gwei" color={C.base} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: srcOk := hasFlag(participation, TIMELY_SOURCE)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: tgtOk := hasFlag(participation, TIMELY_TARGET)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: headOk := hasFlag(participation, TIMELY_HEAD)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 소스/타겟/헤드 각 축에서 참여 여부를 독립 평가
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="3축 독립 평가" color={C.flag} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: if srcOk {'{'}  rewards[i] += baseReward * srcWeight / total  {'}'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: if !tgtOk {'{'}  penalties[i] += baseReward * tgtWeight / total  {'}'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: state.SetBalance(idx, balance + rewards[i] - penalties[i])
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 참여 축 → 보상, 불참 축 → 패널티 — 잔액에 직접 반영
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="잔액 갱신" color={C.reward} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function RewardDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 420 100" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
