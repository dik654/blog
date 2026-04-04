import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './F3FlowVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.ec}>EC 블록 생산 (F3 이전)</text>
    <text x={20} y={44} fontSize={10} fill={C.ec}>Line 1: winner := vrf.Evaluate(epochRand, minerPower)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.ec}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: tipset := BuildTipset(winners)  // 동일 에폭 블록 집합
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 아직 미확정 상태 — reorg 가능
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.f3}>F3 감지 → GossiPBFT 시작</text>
    <text x={20} y={44} fontSize={10} fill={C.f3}>Line 1: notif := {'<'}-f3.ecNotify  // EC 새 tipset 수신</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.f3}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: runner := gpbft.NewRunner(notif.tipset)  // Runner 생성
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: runner.RunToCompletion(ctx)  // 5단계 실행 시작
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.vote}>QUALITY → CONVERGE 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.vote}>Line 1: r.broadcast(QualityVote{'{'}Value: tipset{'}'})  // 품질 투표</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.vote}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: converged := r.converge(votes)  // 최다 득표 수렴
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 2/3+ 스토리지 파워 동의 필요
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.f3}>PREPARE → COMMIT 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.vote}>Line 1: sig := bls.Sign(minerKey, tipset)  // BLS 서명</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.f3}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: r.broadcast(CommitVote{'{'}Sig: sig{'}'})  // 확정 합의
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // PBFT prepare/commit과 동일 원리
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.cert}>DECIDE → 인증서 발행</text>
    <text x={20} y={44} fontSize={10} fill={C.cert}>Line 1: cert := FinalityCertificate{'{'}Tipset: tipset, Sigs: aggSig{'}'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.cert}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: certStore.Put(cert)  // 영구 저장
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // reorg 불가 — 즉시 최종성 달성
    </motion.text>
    <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}>
      <DataBox x={340} y={68} w={110} h={22} label="Certificate" sub="reorg 불가" color={C.cert} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function F3FlowDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
