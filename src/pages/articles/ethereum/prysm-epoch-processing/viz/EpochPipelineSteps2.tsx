import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './EpochPipelineVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: baseReward := v.EffectiveBalance * 64 / sqrtTotalBal
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: if hasFlag(participation, sourceFlag) {'{'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     rewards[i] += baseReward * srcWeight / totalWeight
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 소스/타겟/헤드 3축 참여 → 보상, 불참 → 패널티
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="잔액 반영" color={C.reward} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: activationQueue := s.ActivationQueue()
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: for _, idx := range exitQueue {'{'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     v[idx].WithdrawableEpoch = epoch + MIN_EPOCHS_TO_EXIT
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 활성화 대기열, 자발적 이탈, 슬래싱 감액 처리
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="상태 전환" color={C.reg} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: actual := state.Balances()[idx]
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: effective := v.EffectiveBalance
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: if actual+downwardBias &lt; effective || actual &gt;= effective+upwardBias {'{'}
    </motion.text>
    <motion.text x={10} y={66} {...mono} {...fade(0.35)}>
      Line 4:     v.EffectiveBalance = min(actual - actual%GRAN, 32e9)
    </motion.text>
    <motion.text x={10} y={82} {...comment} {...fade(0.4)}>
      Line 5: // 임계값 초과 시만 유효 잔액 갱신 → 불필요한 변경 방지
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={335} y={82} w={80} h={24} label="갱신/유지" color={C.bal} />
    </motion.g>
  </g>);
}
