import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  ch: '#6366f1',
  sh: '#10b981',
  enc: '#8b5cf6',
  cert: '#f59e0b',
  fin: '#ec4899',
  axis: '#94a3b8',
  ok: '#10b981',
};

const STEPS = [
  {
    label: 'ClientHello — 8개 핵심 확장',
    body: 'ProtocolVersion · Random · CipherSuites + Extensions:\nsupported_versions / supported_groups / key_share / signature_algorithms / pre_shared_key / psk_kex_modes / SNI / ALPN.\n첫 메시지에 모든 협상 + ECDHE 공개값 동봉.',
  },
  {
    label: 'ServerHello — 짧고 명확',
    body: '버전·Random·선택된 cipher·서버 key_share만 평문.\n나머지(EncryptedExtensions, Certificate, ...) 는 즉시 암호화.\nTLS 1.2 대비 노출 최소.',
  },
  {
    label: 'Certificate + CertificateVerify',
    body: 'Certificate: X.509 체인 (TLS 1.3 부터 암호화).\nCertificateVerify: 핸드셰이크 transcript에 대한 서명 — 인증서 소유 증명.\n알고리즘: RSA-PSS / ECDSA / EdDSA.',
  },
  {
    label: 'Finished — 양측 무결성 검증',
    body: 'HMAC(finished_key, transcript_hash).\n클라이언트·서버 각각 전송, 양측이 검증.\n핸드셰이크 도중 변조가 있었다면 여기서 실패.',
  },
  {
    label: '인증 흐름 — 4단계',
    body: '1) 서버 인증서 수신 → 2) CA 신뢰 체인 검증 → 3) CertificateVerify 서명 검증 → 4) Finished MAC 검증.\nmTLS: 서버가 CertificateRequest 보내면 클라이언트도 동일 절차 수행.',
  },
];

const CH_EXT = [
  'supported_versions',
  'supported_groups',
  'key_share',
  'signature_algorithms',
  'pre_shared_key',
  'psk_kex_modes',
  'server_name (SNI)',
  'ALPN',
];

export default function TLSHandshakeMessagesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ch}>
                ClientHello 구조
              </text>
              {/* base fields */}
              <DataBox x={20} y={36} w={140} h={26} label="ProtocolVersion" sub="0x0303" color={C.ch} outlined />
              <DataBox x={170} y={36} w={120} h={26} label="Random" sub="32 bytes" color={C.ch} outlined />
              <DataBox x={300} y={36} w={130} h={26} label="CipherSuites" sub="TLS 1.3 only" color={C.ch} outlined />
              {/* Extensions header */}
              <text x={20} y={82} fontSize={10} fontWeight={700} fill={C.ch}>
                Extensions
              </text>
              {CH_EXT.map((e, i) => (
                <g key={e}>
                  <rect
                    x={20 + (i % 4) * 122}
                    y={92 + Math.floor(i / 4) * 36}
                    width={110}
                    height={28}
                    rx={4}
                    fill={`${C.ch}10`}
                    stroke={C.ch}
                    strokeWidth={0.8}
                  />
                  <text
                    x={75 + (i % 4) * 122}
                    y={110 + Math.floor(i / 4) * 36}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={600}
                    fill={C.ch}
                  >
                    {e}
                  </text>
                </g>
              ))}
              {/* arrow indicating ECDHE in key_share */}
              <motion.line
                x1={252}
                y1={120}
                x2={252}
                y2={195}
                stroke={C.cert}
                strokeWidth={1.2}
                strokeDasharray="3 2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <text x={260} y={215} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.cert}>
                key_share = ECDHE 공개값 (1-RTT 핵심)
              </text>
              <text x={260} y={245} textAnchor="middle" fontSize={9} fill={C.axis}>
                LegacySessionId 는 빈 값 (TLS 1.3 호환 위장)
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sh}>
                ServerHello 이후 흐름
              </text>
              {/* unencrypted block */}
              <rect x={20} y={35} width={480} height={64} rx={6} fill={`${C.sh}08`} stroke={C.sh} strokeWidth={0.7} />
              <text x={30} y={50} fontSize={9} fontWeight={700} fill={C.sh}>
                평문 (handshake 키 없음)
              </text>
              <DataBox x={30} y={60} w={100} h={28} label="Version" color={C.sh} outlined />
              <DataBox x={140} y={60} w={100} h={28} label="Random" color={C.sh} outlined />
              <DataBox x={250} y={60} w={120} h={28} label="cipher_suite" color={C.sh} outlined />
              <DataBox x={380} y={60} w={110} h={28} label="key_share" color={C.sh} outlined />

              {/* encrypted block */}
              <rect x={20} y={120} width={480} height={140} rx={6} fill={`${C.enc}08`} stroke={C.enc} strokeWidth={0.7} strokeDasharray="4 3" />
              <text x={30} y={138} fontSize={9} fontWeight={700} fill={C.enc}>
                암호화됨 (handshake_traffic_secret)
              </text>
              <ModuleBox x={30} y={150} w={140} h={48} label="EncryptedExt" sub="ALPN, SNI ack" color={C.enc} />
              <ModuleBox x={185} y={150} w={140} h={48} label="Certificate" sub="X.509 chain" color={C.cert} />
              <ModuleBox x={340} y={150} w={150} h={48} label="CertificateVerify" sub="signature" color={C.cert} />
              <ActionBox x={195} y={210} w={130} h={36} label="server Finished" sub="HMAC transcript" color={C.fin} />
              <text x={260} y={272} textAnchor="middle" fontSize={9} fill={C.axis}>
                TLS 1.2 대비: 인증서까지 모두 평문 → 모두 암호화
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cert}>
                Certificate + CertificateVerify
              </text>
              {/* Certificate chain */}
              <DataBox x={30} y={50} w={120} h={36} label="Leaf cert" sub="server pub key" color={C.cert} outlined />
              <DataBox x={30} y={100} w={120} h={36} label="Intermediate" sub="signed by Root" color={C.cert} outlined />
              <DataBox x={30} y={150} w={120} h={36} label="Root CA" sub="trust anchor" color={C.cert} outlined />
              {/* arrows */}
              {[86, 136].map((y, i) => (
                <motion.line
                  key={i}
                  x1={90}
                  y1={y}
                  x2={90}
                  y2={y + 14}
                  stroke={C.cert}
                  strokeWidth={1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  markerEnd="url(#arrh)"
                />
              ))}
              <defs>
                <marker id="arrh" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={C.cert} />
                </marker>
              </defs>

              {/* CertificateVerify side */}
              <ModuleBox x={210} y={50} w={140} h={56} label="transcript_hash" sub="CH ∥ SH ∥ EE ∥ Cert" color={C.enc} />
              <ActionBox x={210} y={120} w={140} h={40} label="sign(priv_key, ⋯)" sub="RSA-PSS / ECDSA" color={C.cert} />
              <DataBox x={210} y={170} w={140} h={36} label="signature" sub="64–512 bytes" color={C.cert} outlined />

              {/* verifier */}
              <ModuleBox x={370} y={110} w={130} h={56} label="verify(pub, sig)" sub="leaf cert pubkey" color={C.ok} />
              <motion.line
                x1={350}
                y1={188}
                x2={435}
                y2={170}
                stroke={C.ok}
                strokeWidth={1.2}
                strokeDasharray="3 2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              />
              <text x={260} y={245} textAnchor="middle" fontSize={9.5} fill={C.cert} fontWeight={600}>
                서명으로 "이 인증서의 개인키를 가졌음" 증명
              </text>
              <text x={260} y={262} textAnchor="middle" fontSize={9} fill={C.axis}>
                Cert 자체는 누구나 복사 가능 → 소유 증명 필수
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fin}>
                Finished — 양측 transcript MAC
              </text>
              {/* client side */}
              <ModuleBox x={20} y={45} w={150} h={48} label="Client" sub="transcript_hash" color={C.ch} />
              <ActionBox x={20} y={105} w={150} h={36} label="HMAC(fin_key, H)" color={C.fin} />
              <DataBox x={20} y={150} w={150} h={32} label="client_finished" sub="32 bytes" color={C.fin} outlined />

              {/* server side */}
              <ModuleBox x={350} y={45} w={150} h={48} label="Server" sub="transcript_hash" color={C.sh} />
              <ActionBox x={350} y={105} w={150} h={36} label="HMAC(fin_key, H)" color={C.fin} />
              <DataBox x={350} y={150} w={150} h={32} label="server_finished" sub="32 bytes" color={C.fin} outlined />

              {/* exchange */}
              <motion.line
                x1={170}
                y1={166}
                x2={350}
                y2={166}
                stroke={C.fin}
                strokeWidth={1.4}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
              <text x={260} y={160} textAnchor="middle" fontSize={9} fill={C.fin} fontWeight={600}>
                상호 검증
              </text>

              <StatusBox x={140} y={210} w={240} h={50} label="transcript 일치 = 변조 없음" sub="1비트라도 변조되면 → 실패" color={C.ok} progress={1} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>
                인증 흐름 — 4단계
              </text>
              {[
                { label: '1. cert 수신', sub: 'Server → Client', c: C.cert },
                { label: '2. CA 체인 검증', sub: 'trust anchor', c: C.cert },
                { label: '3. CertVerify 검증', sub: '서명 확인', c: C.enc },
                { label: '4. Finished MAC', sub: '양측 일치', c: C.fin },
              ].map((s, i) => (
                <g key={s.label}>
                  <ModuleBox x={20 + i * 125} y={50} w={115} h={62} label={s.label} sub={s.sub} color={s.c} />
                  {i < 3 && (
                    <motion.line
                      x1={135 + i * 125}
                      y1={81}
                      x2={145 + i * 125}
                      y2={81}
                      stroke={C.axis}
                      strokeWidth={1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      markerEnd="url(#arrf)"
                    />
                  )}
                </g>
              ))}
              <defs>
                <marker id="arrf" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={C.axis} />
                </marker>
              </defs>

              {/* mTLS */}
              <rect x={30} y={140} width={460} height={110} rx={8} fill={`${C.enc}06`} stroke={C.enc} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={260} y={158} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.enc}>
                mTLS — 양방향 인증
              </text>
              <ActionBox x={45} y={170} w={140} h={36} label="CertificateRequest" sub="server → client" color={C.enc} />
              <ActionBox x={195} y={170} w={140} h={36} label="Certificate (client)" sub="client cert chain" color={C.enc} />
              <ActionBox x={345} y={170} w={140} h={36} label="CertificateVerify" sub="client privkey sig" color={C.enc} />
              <text x={260} y={232} textAnchor="middle" fontSize={9} fill={C.axis}>
                사용처: API 보안, zero trust 네트워크, 서비스 간 통신
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
