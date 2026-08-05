import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. KM 공개키 획득', body: 'sapphire.getKeyManagerPublicKey() — 클라이언트가 KM RPC 로 fetch.\n온라인 lookup 필수, 캐싱 가능.' },
  { label: '2. Ephemeral X25519 키 쌍 생성', body: 'nacl.box.keyPair() — 호출 1회용 키쌍.\nephemeral 보안 — 키 유출 시 영향 한정.' },
  { label: '3. ECDH → shared secret 도출', body: 'nacl.box.before(km_pubkey, client_secret).\nKM 의 secret 없이 shared secret 동일하게 산출.' },
  { label: '4. Deoxys-II AEAD 암호화', body: 'nonce 15B + plaintext + (associated data).\nAEAD: 암호화 + 무결성 동시.' },
  { label: '5. Envelope CBOR 인코딩 → tx.data', body: '{version, data, nonce, pk} 묶어 전송.\n일반 ETH 트랜잭션처럼 보임.' },
];

const PHASES = [
  { name: 'fetch KM pk', color: '#6366f1' },
  { name: 'gen X25519',  color: '#3b82f6' },
  { name: 'ECDH',        color: '#10b981' },
  { name: 'AEAD enc',    color: '#f59e0b' },
  { name: 'envelope',    color: '#a855f7' },
];

export default function CalldataEncryptViz() {
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

          {/* Per step illustration */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={50}  y={100} w={150} h={50} label="Client" color="#6366f1" />
              <ModuleBox x={290} y={100} w={150} h={50} label="KM RPC" color="#ec4899" />
              <motion.line x1={200} y1={120} x2={290} y2={120}
                stroke="#6366f1" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <DataBox x={200} y={155} w={90} h={26} label="km_pubkey" color="#ec4899" outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={130} y={100} w={100} h={32} label="client.priv" color="#ef4444" outlined />
              <DataBox x={250} y={100} w={100} h={32} label="client.pub" color="#10b981" outlined />
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ephemeral X25519 — call-scoped
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50}  y={100} w={120} h={32} label="km.pub" color="#ec4899" outlined />
              <DataBox x={310} y={100} w={120} h={32} label="client.priv" color="#3b82f6" outlined />
              <ActionBox x={185} y={98} w={110} h={36} label="ECDH" color="#10b981" />
              <DataBox x={170} y={150} w={140} h={28} label="shared secret" color="#10b981" outlined />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20}  y={100} w={100} h={32} label="plaintext" color="#10b981" outlined />
              <DataBox x={130} y={100} w={80}  h={32} label="nonce 15B" color="#3b82f6" outlined />
              <DataBox x={220} y={100} w={100} h={32} label="shared key" color="#f59e0b" outlined />
              <ActionBox x={335} y={98} w={130} h={36} label="Deoxys-II AEAD" color="#f59e0b" />
              <DataBox x={170} y={150} w={140} h={28} label="ciphertext+tag" color="#f59e0b" outlined />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={140} y={90} w={200} h={70} label="Envelope (CBOR)" color="#a855f7" />
              <text x={155} y={120} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
                version: 1
              </text>
              <text x={155} y={134} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
                data, nonce, pk
              </text>
              <DataBox x={140} y={170} w={200} h={28}
                label="tx.data = envelope" color="#a855f7" outlined />
            </motion.g>
          )}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            client wrapper — sapphire-paratime SDK
          </text>
        </svg>
      )}
    </StepViz>
  );
}
