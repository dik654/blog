import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { c: '#6366f1', s: '#10b981', p: '#0ea5e9', z: '#f59e0b' };

const STEPS = [
  { label: '1-RTT: ClientHello (Initial 패킷)', body: 'Initial packet {\n  header: QUIC Long Header\n  dcid: random(8B)    // 서버가 알려줄 때까지 임시\n  scid: random(8B)    // 클라이언트 연결 ID\n  token: []           // 첫 연결은 비어있음\n  payload: TLS_ClientHello {\n    cipher_suites, key_share(x25519)\n  }\n}\n// QUIC: TLS 1.3 핸드셰이크를 첫 패킷에 내장.' },
  { label: '1-RTT: ServerHello (Initial + Handshake)', body: 'Initial: TLS_ServerHello {\n  cipher_suite, key_share(x25519_srv)\n}\nHandshake: {\n  EncryptedExtensions,\n  Certificate, CertificateVerify,\n  Finished\n}\n// shared = x25519(cli_eph, srv_ks)\n// handshake_keys = HKDF(shared)' },
  { label: '1-RTT 완료: Finished + 1-RTT 키 활성화', body: 'Client Handshake: Finished {\n  verify_data = HMAC(hs_key, transcript)\n}\n// 이 시점부터 1-RTT 키로 애플리케이션 데이터 전송.\nmaster_secret = HKDF(hs_secret, "derived")\n1rtt_key = HKDF(master_secret, "traffic")\n\n// TCP+TLS: 3 RTT → QUIC: 1 RTT.' },
  { label: '0-RTT: PSK 즉시 전송', body: 'PSK = previous_session.resumption_secret\nearly_key = HKDF(PSK, "early traffic")\n\nInitial: ClientHello + early_data {\n  encrypted(early_key, application_data)\n}\n// 0 RTT에 데이터 전송 가능.\n// 주의: 재전송 공격 위험 → 멱등 요청만 허용.\n// retry_token으로 anti-amplification.' },
];

export default function HandshakeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.c}>ClientHello (Initial)</text>
              {['Initial {',
                '  dcid: random(8B),  scid: random(8B)',
                '  token: []',
                '  payload: TLS_ClientHello {',
                '    cipher_suites, key_share(x25519)',
                '  }',
                '}  // QUIC: TLS 핸드셰이크 내장'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.c}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.s}>ServerHello</text>
              {['Initial: ServerHello {',
                '  cipher_suite, key_share(x25519_srv)',
                '}',
                'Handshake: EE + Cert + CV + Finished', '',
                'shared = x25519(cli_eph, srv_ks)',
                'hs_keys = HKDF(shared)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.s}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.p}>1-RTT 완료</text>
              {['Finished { verify = HMAC(hs_key, hash) }', '',
                'master = HKDF(hs_secret, "derived")',
                '1rtt_key = HKDF(master, "traffic")', '',
                '// TCP+TLS: 3 RTT → QUIC: 1 RTT',
                '// 이후 1rtt_key로 앱 데이터 전송'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.p}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.z}>0-RTT (PSK)</text>
              {['PSK = prev_session.resumption_secret',
                'early_key = HKDF(PSK, "early traffic")', '',
                'Initial: CH + early_data {',
                '  enc(early_key, app_data)',
                '}', '// 재전송 위험 → 멱등 요청만'].map((t, i) => (
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
