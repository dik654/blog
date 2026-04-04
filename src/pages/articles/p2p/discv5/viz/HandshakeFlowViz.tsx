import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { a: '#6366f1', b: '#10b981', key: '#f59e0b', m: 'var(--muted-foreground)' };

const STEPS = [
  { label: 'A → B: 암호화 메시지 (세션 없음)', body: 'src_id = A.nodeID   // 32 bytes\nflag = 0x00         // ordinary message\nnonce = random(12)  // GCM nonce\n\nB: sessions[A] == nil → 복호화 불가.\nB: nonce 저장 후 WHOAREYOU 응답 준비.' },
  { label: 'B → A: WHOAREYOU 챌린지', body: 'whoareyou {\n  nonce: A_original_nonce,   // 매칭용\n  id_nonce: random(16),      // 챌린지 값\n  enr_seq: B.enr.seq,       // ENR 버전\n}\nflag = 0x01  // WHOAREYOU 패킷 표시\n// masking: dest_id XOR header → 패킷 은닉.' },
  { label: 'A: ECDH + HKDF → 세션 키 도출', body: 'eph_priv ← random(32)\neph_pub = secp256k1(eph_priv)\nshared = ecdh(eph_priv, B.pub)  // 33B\n\nid_sign_input = SHA256(\n  "discovery v5 identity proof"\n  ∥ challenge_data ∥ eph_pub ∥ B.nodeID\n)\nid_sig = Sign(A.priv, id_sign_input)\n\nkeys = HKDF(shared, challenge, A.id∥B.id)\nwrite_key = keys[0..16], read_key = keys[16..32]' },
  { label: 'A → B: 핸드셰이크 패킷 (flag=2)', body: 'handshake_header {\n  flag: 0x02,\n  auth_data: id_sig ∥ eph_pub ∥ A.enr,\n}\nbody = AES-GCM(write_key, nonce, msg)\n\nB 측:\n  shared\' = ecdh(B.priv, eph_pub)\n  keys\' = HKDF(shared\', challenge, A.id∥B.id)\n  B.write = keys\'.read  // keysFlipped()\n  B.read  = keys\'.write' },
];

export default function HandshakeFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.a}>A → B: Ordinary</text>
              {['src_id = A.nodeID  // 32B',
                'flag = 0x00, nonce = random(12)', '',
                'B: sessions[A] == nil',
                '   → 복호화 실패',
                '   → nonce 저장 → WHOAREYOU 준비'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.a}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.b}>B → A: WHOAREYOU</text>
              {['whoareyou {',
                '  nonce: A_nonce,     // 원본 매칭',
                '  id_nonce: rand(16), // 챌린지',
                '  enr_seq: B.enr.seq',
                '}',
                'flag = 0x01,  masking = dest_id XOR hdr'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.b}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.key}>A: 세션 키 도출</text>
              {['eph = secp256k1_keypair()',
                'shared = ecdh(eph.priv, B.pub)',
                'input = "discv5 id proof"∥challenge∥eph.pub∥B.id',
                'id_sig = Sign(A.priv, SHA256(input))', '',
                'keys = HKDF(shared, challenge, A.id∥B.id)',
                'write = keys[0..16], read = keys[16..32]'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.key}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.a}>A → B: Handshake</text>
              {['flag=0x02, auth = sig∥eph_pub∥ENR',
                'body = AES-GCM(write_key, nonce, msg)', '',
                'B: shared\' = ecdh(B.priv, eph_pub)',
                '   keys\' = HKDF(shared\', challenge, ids)',
                '   B.write = keys\'.read  // flipped',
                '   B.read  = keys\'.write // flipped'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={i < 2 ? C.a : C.b}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
