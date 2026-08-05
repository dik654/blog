import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. RA-TLS handshake — peer Quote 검증', body: 'KM RPC 는 RA-TLS 로 보호.\nQuote 가 유효한 SGX 엔클레이브에서 왔는지 확인.' },
  { label: '2. MRENCLAVE 가 해당 runtime 인지', body: 'isApprovedRuntimeEnclave(quote.MRENCLAVE, RuntimeID).\nRegistry 에 등록된 런타임 enclave 만 통과.' },
  { label: '3. KM Policy 검증', body: 'getPolicyForRuntime(RuntimeID).Allow(MRSIGNER, MRENCLAVE).\nGovernance 가 승인한 enclave 조합만 허용.' },
  { label: '4. 키 파생 → peer pubkey 로 암호화 응답', body: 'rootKey = derive(RuntimeID), contractKey = derive(rootKey, KeyPairID).\n응답을 peer 의 X25519 pubkey 로 암호화.' },
];

const PHASES = [
  { name: 'verify Quote',   color: '#6366f1' },
  { name: 'check enclave',  color: '#10b981' },
  { name: 'check policy',   color: '#f59e0b' },
  { name: 'derive + enc',   color: '#a855f7' },
];

export default function KeyRequestViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* compute node */}
          <ModuleBox x={20} y={20} w={120} h={40} label="Compute Node" sub="(SGX)" color="#3b82f6" />
          <ModuleBox x={340} y={20} w={120} h={40} label="KM Enclave" sub="(SGX)" color="#ec4899" />

          {/* request arrow */}
          <motion.line x1={140} y1={40} x2={340} y2={40}
            stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#arr)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          <text x={240} y={32} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>
            LongTermKeyRequest
          </text>

          {/* pipeline */}
          {PHASES.map((p, i) => {
            const x = 25 + i * 110;
            const active = step === i;
            const done = step > i;
            return (
              <g key={p.name}>
                <motion.g animate={{ opacity: active ? 1 : done ? 0.6 : 0.3 }}>
                  <ActionBox x={x} y={85} w={100} h={36} label={p.name} color={p.color} />
                </motion.g>
                {i < PHASES.length - 1 && (
                  <motion.line x1={x + 100} y1={103} x2={x + 110} y2={103}
                    stroke={done ? p.color : 'var(--border)'} strokeWidth={1.2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: done || active ? 1 : 0 }} />
                )}
              </g>
            );
          })}

          {/* per-step body */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={150} y={140} w={180} h={28}
                label="quote = getPeerQuote()" color="#6366f1" outlined />
              <AlertBox x={150} y={175} w={180} h={28}
                label="!verifyQuote → reject" color="#ef4444" />
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={120} y={140} w={240} h={28}
                label="quote.MRENCLAVE ∈ registry[runtime]" color="#10b981" outlined />
              <AlertBox x={120} y={175} w={240} h={28}
                label="!approved → wrong runtime enclave" color="#ef4444" />
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={120} y={140} w={240} h={28}
                label="policy.Allow(MRSIGNER, MRENCLAVE)" color="#f59e0b" outlined />
              <AlertBox x={120} y={175} w={240} h={28}
                label="!allow → policy denied" color="#ef4444" />
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={70}  y={140} w={150} h={28}
                label="derive contract key" color="#a855f7" outlined />
              <ActionBox x={240} y={138} w={200} h={32}
                label="encrypt(key, peer.pubkey)" color="#a855f7" />
              <motion.line x1={340} y1={170} x2={140} y2={170}
                stroke="#a855f7" strokeWidth={1.5} markerEnd="url(#arr)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={600}>
                encrypted KeyPair → compute node
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5"
              orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>
          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            keymanager/api/secrets.go — HandleLongTermKey
          </text>
        </svg>
      )}
    </StepViz>
  );
}
