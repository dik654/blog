import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { tcp: '#64748b', ecdh: '#6366f1', auth: '#10b981', enc: '#f59e0b' };

const STEPS = [
  { label: 'TCP 연결 수립', body: '두 피어가 TCP 연결을 수립합니다.' },
  { label: 'ECDH 키 교환 내부', body: 'X25519 임시 키 쌍으로 공유 비밀을 도출합니다.' },
  { label: '챌린지 인증 내부', body: 'Ed25519로 서명하여 Node ID를 검증합니다.' },
  { label: '암호화 채널 내부', body: 'ChaCha20-Poly1305로 모든 메시지를 암호화합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.tcp}>conn.Dial() — TCP 핸드셰이크</text>
    <text x={20} y={44} fontSize={10} fill={C.tcp}>Line 1: netConn, err := net.DialTimeout("tcp", addr, timeout)</text>
    <motion.text x={20} y={64} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // 아직 암호화되지 않은 평문 연결 상태
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      <DataBox x={350} y={72} w={100} h={22} label="평문 TCP" sub="암호화 전" color={C.tcp} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.ecdh}>MakeSecretConnection() — ECDH</text>
    <text x={20} y={44} fontSize={10} fill={C.ecdh}>Line 1: locEphPub, locEphPriv := genEphKeys()  // X25519 임시 키</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.ecdh}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: remEphPub := shareEphPubKey(conn, locEphPub)
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.ecdh}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: shrSecret := computeSharedSecret(remEphPub, locEphPriv)
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // Diffie-Hellman → 공유 비밀 32바이트 도출
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.auth}>챌린지 서명 인증</text>
    <text x={20} y={44} fontSize={10} fill={C.auth}>Line 1: challenge := hash(shrSecret || locEphPub || remEphPub)</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.auth}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: locSig := locPrivKey.Sign(challenge)  // Ed25519 서명
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.auth}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: remPubKey.VerifySignature(challenge, remSig)  // 상대 검증
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: nodeID = PubKeyToID(remPubKey)  // SHA256(pubKey)[:20]
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.enc}>AEAD 암호화 채널</text>
    <text x={20} y={44} fontSize={10} fill={C.enc}>Line 1: sendAead = chacha20poly1305.New(sendSecret)</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.enc}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: recvAead = chacha20poly1305.New(recvSecret)
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.enc}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: sealed := sendAead.Seal(nil, nonce, plaintext, nil)
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // nonce 자동 증가 — MITM + 리플레이 방지
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function P2PSecurityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
