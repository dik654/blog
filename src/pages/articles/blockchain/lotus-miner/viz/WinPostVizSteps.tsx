import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './WinPostVizData';

export function StepVRF() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.vrf}>computeElectionProof() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.vrf}>Line 1: rand := base.Beacons[len-1].Data  // 에폭 랜덤값</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.vrf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: vrfOut := vrf.Compute(minerKey, rand)  // 결정적+비예측
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: eproof := &types.ElectionProof{'{'}VRFProof: vrfOut{'}'}
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={110} h={22} label="ElectionProof" sub="WinCount 포함" color={C.win} />
    </motion.g>
  </g>);
}

export function StepWinCount() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.win}>WinCount 확인 — 당첨 여부</text>
    <text x={20} y={44} fontSize={10} fill={C.win}>Line 1: eproof.ComputeWinCount(power, totalPower)  // 포아송 분포</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.win}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: if eproof.WinCount {'<'} 1 {'{'} return nil {'}'}  // 추첨 탈락
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // WinCount {'>'} 1 가능 — 해당 에폭에 복수 블록 보상
    </motion.text>
  </g>);
}

export function StepBlock() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.block}>createBlock() — 블록 조립</text>
    <text x={20} y={44} fontSize={10} fill={C.win}>Line 1: wpost := GenerateWinningPoSt(ctx, sectors, rand)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: blk := &types.BlockHeader{'{'}Miner: addr, WinPoSt: wpost{'}'}
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: mpool.MpoolPush(BlockMsg{'{'}Header: blk, Msgs: msgs{'}'})
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="BlockMsg" sub="브로드캐스트" color={C.win} />
    </motion.g>
  </g>);
}
