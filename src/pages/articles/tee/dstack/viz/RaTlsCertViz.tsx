import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  cert: '#6366f1',
  ext: '#10b981',
  oid: '#0ea5e9',
  client: '#f59e0b',
  verify: '#8b5cf6',
  bind: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'X.509 Cert 표준 필드 — subject · pubkey · 유효기간 · 자체 서명' },
  { label: 'Custom extensions — TDX Quote OID + App measurements OID' },
  { label: 'Quote가 X.509 안에 — Self-signed Ed25519 + extension에 quote bytes' },
  { label: '클라이언트 검증 — TLS handshake → quote extract → quote verify' },
  { label: 'Pubkey binding — Quote.report_data[0..32] = hash(cert.pubkey)' },
];

const X509_FIELDS = [
  { f: 'subject', v: 'CN=dstack-app-instance', color: C.cert },
  { f: 'public_key', v: 'Ed25519PubKey (32 bytes)', color: C.cert },
  { f: 'not_before', v: 'current_time', color: C.cert },
  { f: 'not_after', v: 'current_time + 90 days', color: C.cert },
  { f: 'signature_algorithm', v: 'Ed25519 (RFC 8410)', color: C.cert },
  { f: 'signature', v: 'signed_with_app_privkey (self-signed)', color: C.cert },
];

export default function RaTlsCertViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            RA-TLS = Remote Attestation + TLS (X.509 통합)
          </text>
          {step === 0 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cert}>
                struct RATlsCert (표준 X.509 필드)
              </text>
              {X509_FIELDS.map((f, i) => (
                <motion.g key={f.f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={30} y={48 + i * 26} width={420} height={22} rx={4}
                    fill={`${f.color}10`} stroke={`${f.color}40`} strokeWidth={0.6} />
                  <text x={42} y={62 + i * 26} fontSize={9} fontWeight={700} fontFamily="monospace" fill={f.color}>{f.f}</text>
                  <text x={170} y={62 + i * 26} fontSize={8.5} fill="var(--muted-foreground)" fontFamily="monospace">{f.v}</text>
                </motion.g>
              ))}
              <text x={240} y={216} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                일반 HTTPS 인증서와 호환 형태 → 기존 TLS 라이브러리 활용
              </text>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ext}>
                X.509 extensions (커스텀 OID 2개)
              </text>
              {[
                { oid: '1.2.840.113741.1337.6', name: 'dstack TDX Quote', critical: 'critical: true', body: 'value: tdx_quote_der (~4 KB)', c: C.ext },
                { oid: '1.2.840.113741.1337.7', name: 'App measurements', critical: 'critical: false', body: 'value: app_measurements_der', c: C.oid },
              ].map((e, i) => (
                <motion.g key={e.oid} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={30} y={50 + i * 76} width={420} height={66} rx={6}
                    fill={`${e.c}10`} stroke={`${e.c}50`} strokeWidth={0.8} />
                  <rect x={30} y={50 + i * 76} width={3.5} height={66} fill={e.c} />
                  <text x={45} y={66 + i * 76} fontSize={9.5} fontWeight={700} fill={e.c}>{e.name}</text>
                  <text x={45} y={80 + i * 76} fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">oid: {e.oid}</text>
                  <text x={45} y={94 + i * 76} fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">{e.critical}</text>
                  <text x={45} y={108 + i * 76} fontSize={8.5} fontFamily="monospace" fill={e.c} fontWeight={600}>{e.body}</text>
                </motion.g>
              ))}
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cert}>
                Quote 임베딩된 자체 서명 인증서
              </text>
              <motion.g initial={{ opacity: 0, scaleY: 0.5 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.15 }} style={{ transformOrigin: '240px 100px' }}>
                <rect x={30} y={48} width={420} height={130} rx={8} fill="var(--card)" stroke={C.cert} strokeWidth={1} />
                <rect x={30} y={48} width={420} height={5} rx={8} fill={C.cert} opacity={0.85} />
                <text x={240} y={70} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.cert}>X.509 RA-TLS Certificate</text>
                <text x={42} y={88} fontSize={8.5} fill="var(--muted-foreground)">subject: CN=dstack-app-instance</text>
                <text x={42} y={102} fontSize={8.5} fill="var(--muted-foreground)">pubkey: Ed25519PubKey</text>
                <text x={42} y={116} fontSize={8.5} fill="var(--muted-foreground)">extensions: [</text>
                <text x={56} y={130} fontSize={8.5} fontFamily="monospace" fill={C.ext} fontWeight={600}>(OID 1337.6) tdx_quote_der ← 핵심</text>
                <text x={56} y={144} fontSize={8.5} fontFamily="monospace" fill={C.oid}>(OID 1337.7) app_measurements_der</text>
                <text x={42} y={158} fontSize={8.5} fill="var(--muted-foreground)">]</text>
                <text x={42} y={172} fontSize={8.5} fill="var(--muted-foreground)">signature: Ed25519 (self-signed)</text>
              </motion.g>
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                CA 없이도 TEE 자체가 신뢰 root → attestation으로 검증
              </text>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.client}>
                클라이언트 측 검증 (확장 TLS handshake)
              </text>
              {[
                '1) 일반 TLS handshake — server cert 수신',
                '2) Cert extension에서 TDX Quote 추출 (OID 1337.6)',
                '3) Intel PCS / PCCS로 Quote 검증 (signature + cert chain)',
                '4) Quote.report_data[0..32] == sha256(cert.pubkey) 확인',
                '5) 모든 체크 통과 → TLS 세션 수립',
              ].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={56 + i * 28} width={420} height={24} rx={5}
                    fill={`${C.client}10`} stroke={`${C.client}45`} strokeWidth={0.7} />
                  <rect x={30} y={56 + i * 28} width={3.5} height={24} fill={C.client} />
                  <text x={45} y={73 + i * 28} fontSize={9} fontWeight={600} fill={C.client}>{t}</text>
                </motion.g>
              ))}
              <ModuleBox x={130} y={200} w={220} h={20} label="HTTPS 생태계 그대로 사용" sub="curl · browsers · SDK" color={C.verify} />
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bind}>
                Pubkey ↔ TEE 키 binding
              </text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <rect x={30} y={56} width={170} height={42} rx={6} fill={`${C.cert}10`} stroke={`${C.cert}55`} strokeWidth={0.8} />
                <text x={115} y={74} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.cert}>cert.pubkey</text>
                <text x={115} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Ed25519PubKey</text>
              </motion.g>
              <motion.text initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.3 }}
                x={210} y={82} textAnchor="middle" fontSize={9} fill={C.bind} fontWeight={700}>sha256()</motion.text>
              <text x={245} y={82} textAnchor="middle" fontSize={11} fill={C.bind}>→</text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={270} y={56} width={180} height={42} rx={6} fill={`${C.bind}10`} stroke={`${C.bind}55`} strokeWidth={0.8} />
                <text x={360} y={74} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.bind}>Quote.report_data[0..32]</text>
                <text x={360} y={88} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">반드시 일치해야 함</text>
              </motion.g>
              <DataBox x={30} y={120} w={420} h={28} label="MITM 방어 — 공격자가 자체 cert 만들어도 quote가 다른 pubkey를 가리킴" color={C.bind} />
              {[
                '✓ TEE 안에서 생성한 키쌍만 quote에 등록 가능',
                '✓ Quote가 cert pubkey를 가리키므로 swap 불가',
                '✓ 세션 키가 attestation에 결합 = E2E 신뢰',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.7 + i * 0.1 }}
                  x={36} y={170 + i * 16} fontSize={8.5} fill={C.bind} fontWeight={600}>{t}</motion.text>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
