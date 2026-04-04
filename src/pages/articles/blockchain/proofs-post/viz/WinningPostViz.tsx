import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './WinningPostVizData';
import { CodeViewButton } from '@/components/code';

const REF_KEYS = ['post-main', 'post-main', 'post-main'];
const REF_LABELS = ['VRF 추첨', '소수 리프 증명', '블록 보상'];

function StepVRF() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.vrf}>VRF 추첨 — 블록 생산 자격</text>
    <text x={20} y={44} fontSize={10} fill={C.vrf}>Line 1: beacon = drand.get_beacon(epoch)  // DRAND VRF 비콘</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.vrf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: vrf_out = vrf::compute(miner_key, beacon)  // 당첨 확률 = 파워/전체
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: win_count = compute_win_count(vrf_out, power)  // 포아송 분포
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="win_count" sub="당첨 수" color={C.sector} />
    </motion.g>
  </g>);
}

function StepProof() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.proof}>소수 리프 Merkle 증명</text>
    <text x={20} y={44} fontSize={10} fill={C.sector}>Line 1: sector = random_sector(sectors, beacon)  // 랜덤 1개</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.proof}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: proof = generate_winning_post(sector, challenges)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 소형 회로 — 수 초 이내 완료
    </motion.text>
  </g>);
}

function StepReward() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.block}>블록 보상 결과</text>
    <text x={20} y={44} fontSize={10} fill={C.sector}>Line 1: if proof_valid {'{'} reward = block_reward * win_count {'}'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.vrf}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: if proof_timeout {'{'} // 기회만 상실, 파워 손실 없음 {'}'}
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 30초 이내 증명 완료 필요 — 에폭 간격
    </motion.text>
  </g>);
}

const R = [StepVRF, StepProof, StepReward];

export default function WinningPostViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(REF_KEYS[step])} />
                <span className="text-[10px] text-muted-foreground">{REF_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
