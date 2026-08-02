import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1) Client → Server: connect + "need attestation"' },
  { label: '2) Client → Server: nonce (32 bytes random, replay 방어)' },
  { label: '3) TEE가 report 생성 — measurement + nonce + platform + user_data' },
  { label: '4) TEE가 attestation key로 ECDSA 서명' },
  { label: '5) TEE → Client: (report, signature, cert_chain)' },
  { label: '6) Client 검증 — chain → signature → measurement → nonce → TCB → user_data' },
  { label: '7-9) Trust 수립 → TLS handshake → 민감 데이터 전송' },
];

const REPORT_FIELDS = [
  { k: 'measurement', v: 'MRENCLAVE (코드 해시)', c: '#6366f1' },
  { k: 'nonce', v: 'client_nonce (replay 방어)', c: '#10b981' },
  { k: 'platform', v: '{ tcb_version, attributes }', c: '#f59e0b' },
  { k: 'user_data', v: 'hash(session_pubkey)', c: '#0ea5e9' },
];

const VERIFY_CHECKS = [
  { code: '6a', check: 'verify_chain(cert_chain, root_ca)', c: '#6366f1' },
  { code: '6b', check: 'ECDSA_verify(signature, report)', c: '#10b981' },
  { code: '6c', check: 'measurement in allowed_measurements', c: '#f59e0b' },
  { code: '6d', check: 'report.nonce == client_nonce', c: '#0ea5e9' },
  { code: '6e', check: 'tcb_version >= MIN_TCB', c: '#a855f7' },
  { code: '6f', check: 'user_data == hash(server_session_pubkey)', c: '#ef4444' },
];

const FINAL_STEPS = [
  { line: '7) All checks passed → trust 수립', c: '#10b981' },
  { line: '8) TLS handshake with server_session_pubkey', c: '#10b981' },
  { line: '9) Send sensitive data', c: '#10b981' },
];

export default function AttestFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              Client → Server 연결 시도
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={50} y={70} w={140} h={56}
                label="Client" sub="user device" color="#6366f1" />
              <text x={215} y={102} fontSize={20} fill="var(--muted-foreground)">→</text>
              <text x={280} y={152} textAnchor="middle" fontSize={11}
                fontWeight={600} fill="#6366f1" style={{ fontFamily: 'monospace' }}>
                "Hello, need attestation"
              </text>
              <text x={345} y={102} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ModuleBox x={370} y={70} w={140} h={56}
                label="TEE Server" sub="enclave inside" color="#10b981" />
            </motion.g>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Client → Server: nonce (challenge)
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={50} y={70} w={140} h={56}
                label="Client" sub="random(32 bytes)" color="#6366f1" />
              <text x={215} y={102} fontSize={20} fill="var(--muted-foreground)">→</text>
              <DataBox x={245} y={85} w={120} h={30}
                label="nonce" sub="32 random bytes" color="#10b981" outlined />
              <text x={385} y={102} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ModuleBox x={410} y={70} w={100} h={56}
                label="Server" sub="store nonce" color="#10b981" />
            </motion.g>
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              nonce 없으면 이전 quote 재사용 (replay 공격) 가능
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              report 구조
            </text>
            {REPORT_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={40} y={42 + i * 40} width={440} height={32} rx={4}
                  fill={`${f.c}10`} stroke={`${f.c}40`} strokeWidth={0.8} />
                <text x={60} y={62 + i * 40} fontSize={10.5} fontWeight={700} fill={f.c}
                  style={{ fontFamily: 'monospace' }}>{f.k}:</text>
                <text x={200} y={62 + i * 40} fontSize={10} fill="var(--foreground)">{f.v}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              signature = ECDSA_sign(report, attestation_key)
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={30} y={80} w={130} h={40}
                label="report" sub="구조체" color="#6366f1" outlined />
              <text x={170} y={105} fontSize={14} fill="var(--muted-foreground)">+</text>
              <ModuleBox x={195} y={70} w={140} h={56}
                label="ECDSA_sign" sub="P-256 / P-384" color="#0ea5e9" />
              <text x={345} y={105} fontSize={14} fill="var(--muted-foreground)">→</text>
              <DataBox x={370} y={80} w={130} h={40}
                label="signature" sub="64~96 bytes" color="#10b981" outlined />
            </motion.g>
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              attestation_key는 PCK로 서명되어 manufacturer 권위 상속
            </text>
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#a855f7">
              TEE → Client: (report, signature, cert_chain)
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50} y={50} w={130} h={36}
                label="report" color="#6366f1" outlined />
              <DataBox x={195} y={50} w={130} h={36}
                label="signature" color="#10b981" outlined />
              <DataBox x={340} y={50} w={130} h={36}
                label="cert_chain" color="#f59e0b" outlined />
            </motion.g>
            <text x={260} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill="#a855f7">
              Quote 패키지 — 검증자가 모든 체인을 풀 수 있도록
            </text>
            <text x={260} y={165} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              cert_chain: PCK → Platform CA → Manufacturer Root
            </text>
          </g>)}
          {step === 5 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              Client 측 6가지 검증
            </text>
            {VERIFY_CHECKS.map((v, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}>
                <rect x={20} y={42 + i * 28} width={480} height={22} rx={3}
                  fill={`${v.c}10`} stroke={`${v.c}40`} strokeWidth={0.8} />
                <text x={32} y={58 + i * 28} fontSize={9.5} fontWeight={700} fill={v.c}
                  style={{ fontFamily: 'monospace' }}>{v.code}</text>
                <text x={56} y={58 + i * 28} fontSize={9.5} fontWeight={600} fill={v.c}
                  style={{ fontFamily: 'monospace' }}>{v.check}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 6 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Trust 수립 → 민감 데이터 전송
            </text>
            {FINAL_STEPS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${f.c}10`} stroke={`${f.c}50`} strokeWidth={0.8} />
                <rect x={50} y={50 + i * 50} width={4} height={36} fill={f.c} />
                <text x={70} y={72 + i * 50} fontSize={11} fontWeight={600} fill={f.c}>{f.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
