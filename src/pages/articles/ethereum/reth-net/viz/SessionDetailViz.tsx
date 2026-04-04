import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './SessionDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      dial() — TCP 연결 시작
    </text>
    <text x={20} y={42} fontSize={10} fill={C.dial}>
      Line 1: let stream = TcpStream::connect(peer_addr).await?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.dial}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: pending_sessions.insert(peer_id, stream)
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      max_sessions 기본 100 — port 30303
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ECIES 핸드셰이크
    </text>
    <text x={20} y={42} fontSize={10} fill={C.ecies}>
      Line 1: let auth = ecies_auth(local_key, peer_pubkey)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.ecies}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: stream.write(auth).await?  // auth 전송
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.ecies}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let ack = stream.read_ack().await?  // ack 수신
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.ecies} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Line 4: let aes_key = ecdh(local_key, ack.pubkey)  // AES-CTR
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Hello 메시지 — capabilities 교환
    </text>
    <text x={20} y={42} fontSize={10} fill={C.hello}>
      Line 1: stream.send(Hello {'{'} version: 5, caps: ["eth/68"] {'}'})
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.hello}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let peer_hello = stream.recv_hello().await?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.active}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let shared_caps = negotiate(my_caps, peer_hello.caps)
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      프로토콜 불일치 시 disconnect
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      SessionEstablished — 활성 세션
    </text>
    <text x={20} y={42} fontSize={10} fill={C.dial}>
      Line 1: let session = pending_sessions.remove(peer_id)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.active}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: active_sessions.insert(peer_id, session)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.active}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // eth-wire 메시지 교환 시작 (Status, TX, Block)
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      SessionClosed — 정리
    </text>
    <text x={20} y={42} fontSize={10} fill={C.close}>
      Line 1: active_sessions.remove(peer_id)  // 맵에서 제거
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.close}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: num_active -= 1  // max_sessions 카운트 복구
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      정상 종료 또는 에러 시 자동 정리
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function SessionDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
