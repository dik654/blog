import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './EngineDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ForkchoiceUpdated 수신
    </text>
    <text x={20} y={42} fontSize={10} fill={C.cl}>
      Line 1: // CL → EL JSON-RPC 호출
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.engine}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: on_forkchoice_updated(head, safe, finalized, attrs)
    </motion.text>
    <motion.text x={20} y={76} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      head: 0x3b7c.., safe: 0x1a2f.., finalized: 0x9e8d..
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      head 검증 + canonical 갱신
    </text>
    <text x={20} y={42} fontSize={10} fill={C.engine}>
      Line 1: let header = find_canonical_header(head_hash)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: update_canonical_chain(header.number)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: ensure_consistent_state(safe, finalized)?
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      safe/finalized 블록 유효성 검증 후 포크 선택 반영
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      payload_builder에 작업 전달
    </text>
    <text x={20} y={42} fontSize={10} fill={C.builder}>
      Line 1: if let Some(attrs) = payload_attributes {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.builder}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2:     let id = send_new_payload(head, attrs)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.builder}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: {'}'}  // 백그라운드 빌드 태스크 시작
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={340} y={82} w={120} h={26}
        label="payload_id" sub="CL에 반환" color={C.ok} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      GetPayload → 완성 블록 반환
    </text>
    <text x={20} y={42} fontSize={10} fill={C.cl}>
      Line 1: // CL: GetPayload(payload_id) 호출
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let payload = builder.resolve(payload_id)?
    </motion.text>
    <motion.text x={20} y={76} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: return (ExecutionPayload, BlobsBundle, block_value)
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      지금까지 빌드한 최적 블록 + blobs + 수수료 합계 반환
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
