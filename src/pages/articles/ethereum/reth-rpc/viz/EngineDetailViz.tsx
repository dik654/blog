import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './EngineDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      forkchoice_updated — head/safe/finalized 갱신
    </text>
    <text x={20} y={42} fontSize={10} fill={C.fcu}>
      Line 1: fn on_forkchoice_updated(head, safe, finalized, attrs) {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.fcu}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     self.update_canonical(head)?
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.fcu}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     if attrs.is_some() {'{'} self.start_build(attrs) {'}'}
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.fcu}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // canonical chain 결정 + 빌드 트리거
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      new_payload — 새 블록 EVM 실행
    </text>
    <text x={20} y={42} fontSize={10} fill={C.new}>
      Line 1: fn on_new_payload(payload: ExecutionPayload) {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.new}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     let result = evm.execute_all(payload.txs)?
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.new}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     ensure!(result.state_root == payload.state_root)
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.new}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4:     return PayloadStatus::VALID  // or INVALID
    </motion.text>
    <motion.text x={20} y={106} fontSize={10} fill={C.new}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 5: {'}'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      get_payload — 빌드된 블록 반환
    </text>
    <text x={20} y={42} fontSize={10} fill={C.get}>
      Line 1: fn on_get_payload(id: PayloadId) {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.get}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     let payload = builder.resolve(id)?
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.get}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     return (payload, blobs_bundle, block_value)
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.get}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // CL이 이 블록을 네트워크에 전파
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      JWT 인증 — shared secret
    </text>
    <text x={20} y={42} fontSize={10} fill={C.cl}>
      Line 1: // Engine API 전용 포트 8551
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.cl}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let secret = fs::read("jwt.hex")?  // shared secret
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.cl}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: auth_layer.verify_jwt(request.header("Authorization"))?
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      외부 접근 차단 — CL만 호출 가능 (The Merge 이후 유일 경로)
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function EngineDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
