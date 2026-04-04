import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { c: '#6366f1', s: '#10b981', k: '#f59e0b', z: '#ef4444' };

const STEPS = [
  { label: 'ClientHello — 암호 스위트 + key_share', body: 'client_hello {\n  cipher_suites: [TLS_AES_256_GCM_SHA384, ...]\n  supported_groups: [x25519, secp256r1]\n  key_share: x25519_pubkey(eph_secret)\n  // eph_secret = random(32 bytes)\n}' },
  { label: 'ServerHello — 서버 응답 + 인증서', body: 'server_hello {\n  cipher_suite: TLS_AES_256_GCM_SHA384\n  key_share: x25519_pubkey(server_secret)\n}\nEncryptedExtensions { ... }  // 핸드셰이크 키로 암호화\nCertificate { cert_chain }   // X.509 인증서\nCertificateVerify { sig }    // 개인키로 서명' },
  { label: 'Finished — 핸드셰이크 무결성', body: 'shared_secret = x25519(eph_secret, server_key_share)\n// 양측이 동일한 ECDHE 공유 비밀 도출\n\nclient_finished_key = HKDF(hs_secret, "finished")\nverify_data = HMAC(finished_key, transcript_hash)\n// transcript: ClientHello ~ ServerFinished 전체' },
  { label: '0-RTT PSK — 재연결 최적화', body: 'PSK = previous_session_resumption_secret\nearly_secret = HKDF-Extract(PSK)\nearly_key = HKDF-Expand(early_secret, "early")\n\nClientHello + early_data(encrypted_with_early_key)\n// 재전송 공격 위험 → 멱등 요청만 허용.' },
];

export default function TLSHandshakeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.c}>ClientHello</text>
              {['cipher_suites = [',
                '  TLS_AES_256_GCM_SHA384,',
                '  TLS_CHACHA20_POLY1305_SHA256',
                ']',
                'key_share = x25519_pubkey(eph_secret)',
                '// eph_secret ← random(32B)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.c}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.s}>ServerHello + 인증</text>
              {['cipher_suite = TLS_AES_256_GCM_SHA384',
                'key_share = x25519_pubkey(srv_secret)', '',
                '// 이후 핸드셰이크 키로 암호화:',
                'EncryptedExtensions { ... }',
                'Certificate { X.509 cert_chain }',
                'CertificateVerify { ECDSA_sig }'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.s}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.k}>Finished</text>
              {['shared = x25519(eph_secret, srv_ks)',
                'hs_secret = HKDF-Extract(shared)',
                'fin_key = HKDF-Expand(hs_secret, "fin")', '',
                'verify = HMAC(fin_key, transcript_hash)',
                '// transcript = CH ∥ SH ∥ EE ∥ Cert ∥ CV'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.k}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.z}>0-RTT PSK</text>
              {['PSK = prev_session.resumption_secret',
                'early = HKDF-Extract(PSK)',
                'early_key = HKDF-Expand(early, "early")', '',
                'CH + early_data(enc(early_key, req))',
                '// 재전송 위험 → 멱등 요청만 허용'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.z}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
