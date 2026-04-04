import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './BuilderDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      로컬 블록 빌드 (항상 실행)
    </text>
    <text x={20} y={42} fontSize={10} fill={C.local}>
      Line 1: let local = inner_builder.build_payload(attrs).await?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.local}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // 로컬 TX풀에서 블록 빌드 — 항상 성공
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      외부 빌더 실패 시에도 liveness fallback 보장
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      외부 릴레이 입찰 요청
    </text>
    <text x={20} y={42} fontSize={10} fill={C.relay}>
      Line 1: let bid = relay.get_header(slot, parent, recipient).await
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.ext}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // SignedBuilderBid {'{'} value: 0.05 ETH {'}'}
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      릴레이가 최고가 빌더의 블록 헤더를 응답 (타임아웃 시 건너뜀)
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      value 비교 — 외부 vs 로컬
    </text>
    <text x={20} y={42} fontSize={10} fill={C.ext}>
      Line 1: let external_value = bid.value  // 0.05 ETH
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.local}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let local_value = local.block_value  // 0.03 ETH
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: if external_value &gt; local_value {'{'} use_external {'}'}
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.ok} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      0.05 &gt; 0.03 → 외부 채택 (실패 시 로컬 fallback)
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Blinded Block 서명
    </text>
    <text x={20} y={42} fontSize={10} fill={C.relay}>
      Line 1: // 헤더만 수신 → TX 내용 미공개
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.ext}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let signed = proposer.sign_header(bid.header)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let body = relay.get_payload(signed).await?
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      blind signing 후 get_payload 호출 시 바디가 공개
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      데코레이터 패턴
    </text>
    <text x={20} y={42} fontSize={10} fill={C.ext}>
      Line 1: struct MevPayloadBuilder&lt;Inner&gt; {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.local}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2:     inner: Inner,  // 기존 빌더 감싸기
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.relay}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3:     relay: RelayClient,  // HTTP 클라이언트
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.ext}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      Line 4: {'}'}  // .payload_builder(MevPayloadBuilder::new()) 한 줄
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function BuilderDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
