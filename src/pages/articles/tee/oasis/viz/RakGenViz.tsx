import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. Ed25519 키 쌍 생성 (enclave 내부)', body: '런타임이 SGX enclave 안에서 (private, public) 생성.\nephemeral — 재시작 시 재생성.' },
  { label: '2. SGX REPORT 에 public key 바인딩', body: 'report_data[..32] = public key.\nREPORT 가 enclave + pubkey 를 묶어 증명.' },
  { label: '3. Quote 생성 — DCAP attestation', body: 'sgx_quote(REPORT) — Intel 키로 서명된 attestation.\n외부에서 enclave 진위 검증 가능.' },
  { label: '4. Quote 를 Consensus(Registry)에 제출', body: 'NodeRegistration{public_key, sgx_quote, runtime_id}.\n검증인들이 quote 검증 후 등록 승인.' },
  { label: 'RAK 의 3가지 용도', body: '1) Executor commitment 서명.\n2) RA-TLS 인증서 서명.\n3) Host ↔ Runtime IPC 인증.' },
];

const PHASES = [
  { name: 'gen keys',     color: '#6366f1' },
  { name: 'bind REPORT',  color: '#10b981' },
  { name: 'sgx_quote',    color: '#f59e0b' },
  { name: 'submit reg',   color: '#a855f7' },
  { name: 'use RAK',      color: '#ec4899' },
];

export default function RakGenViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PHASES.map((p, i) => {
            const x = 20 + i * 90;
            const active = step === i;
            const done = step > i;
            return (
              <g key={p.name}>
                <motion.g animate={{ opacity: active ? 1 : done ? 0.6 : 0.3 }}>
                  <ActionBox x={x} y={20} w={80} h={36} label={p.name} color={p.color} />
                </motion.g>
                {i < PHASES.length - 1 && (
                  <motion.line x1={x + 80} y1={38} x2={x + 90} y2={38}
                    stroke={done ? p.color : 'var(--border)'} strokeWidth={1.2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: done || active ? 1 : 0 }} />
                )}
              </g>
            );
          })}

          {/* SGX enclave outline */}
          <motion.rect x={50} y={75} width={380} height={120} rx={10}
            fill="none" stroke="#ec4899" strokeWidth={1} strokeDasharray="6,4" opacity={0.5} />
          <text x={70} y={92} fontSize={10} fill="#ec4899" fontWeight={600}>SGX Enclave</text>

          {/* per step */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={120} y={120} w={110} h={32} label="private" color="#ef4444" outlined />
              <DataBox x={250} y={120} w={110} h={32} label="public"  color="#10b981" outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ed25519_keypair() — ephemeral
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={150} y={110} w={180} h={32}
                label="REPORT.report_data[..32] = pubkey" color="#10b981" outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                enclave measurement + pubkey 바인딩
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={120} y={110} w={120} h={32} label="REPORT" color="#10b981" outlined />
              <ActionBox x={250} y={108} w={110} h={36} label="sgx_quote()" color="#f59e0b" />
              <line x1={240} y1={126} x2={250} y2={126} stroke="#f59e0b" strokeWidth={1.2} />
              <DataBox x={120} y={155} w={240} h={28} label="Quote (Intel-signed attestation)" color="#f59e0b" outlined />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={70} y={110} w={140} h={32} label="Quote" color="#f59e0b" outlined />
              <ModuleBox x={250} y={104} w={170} h={42}
                label="Registry (Consensus)" color="#a855f7" />
              <motion.line x1={210} y1={126} x2={250} y2={126}
                stroke="#a855f7" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                NodeRegistration → 검증인 quote 검증
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20}  y={110} w={140} h={28}
                label="commitment 서명" color="#ec4899" outlined />
              <DataBox x={170} y={110} w={140} h={28}
                label="RA-TLS cert 서명" color="#ec4899" outlined />
              <DataBox x={320} y={110} w={140} h={28}
                label="IPC 인증" color="#ec4899" outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="#ec4899" fontWeight={600}>
                RAK = Runtime Attestation Key
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
