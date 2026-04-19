import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. Envelope CBOR 파싱', body: 'cbor::from_slice(&tx.data) — version, data, nonce, pk 추출.' },
  { label: '2. Key Manager 에서 secret key 가져옴', body: 'ctx.key_manager().get_private_key().\nKM 가 RA-TLS + policy 검증 후 key 제공.' },
  { label: '3. ECDH → shared secret 재구성', body: 'x25519_diffie_hellman(km_secret, envelope.pk).\n클라이언트 측과 동일한 shared secret.' },
  { label: '4. Deoxys-II 복호화 → 평문 calldata', body: 'plaintext = decrypt(shared, nonce, data).\nEVM 이 평문으로 실행.' },
  { label: '5. 결과 암호화 후 반환', body: 'returnData 도 같은 키로 재암호화.\nstorage slot 도 슬롯별 키로 암호화 — 외부는 암호문만 관측.' },
];

const PHASES = [
  { name: 'parse',   color: '#6366f1' },
  { name: 'KM key',  color: '#10b981' },
  { name: 'ECDH',    color: '#3b82f6' },
  { name: 'decrypt', color: '#f59e0b' },
  { name: 'enc out', color: '#a855f7' },
];

export default function RuntimeDecryptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* SGX outline */}
          <motion.rect x={20} y={15} width={440} height={150} rx={10}
            fill="none" stroke="#ec4899" strokeWidth={1} strokeDasharray="6,4" opacity={0.5} />
          <text x={35} y={32} fontSize={10} fill="#ec4899" fontWeight={600}>SGX Runtime (Sapphire EVM)</text>

          {PHASES.map((p, i) => {
            const x = 30 + i * 88;
            const active = step === i;
            const done = step > i;
            return (
              <g key={p.name}>
                <motion.g animate={{ opacity: active ? 1 : done ? 0.6 : 0.3 }}>
                  <ActionBox x={x} y={45} w={78} h={32} label={p.name} color={p.color} />
                </motion.g>
                {i < PHASES.length - 1 && (
                  <motion.line x1={x + 78} y1={61} x2={x + 88} y2={61}
                    stroke={done ? p.color : 'var(--border)'} strokeWidth={1.2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: done || active ? 1 : 0 }} />
                )}
              </g>
            );
          })}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={40}  y={100} w={130} h={28} label="version: 1" color="#6366f1" outlined />
              <DataBox x={180} y={100} w={130} h={28} label="data + nonce" color="#6366f1" outlined />
              <DataBox x={320} y={100} w={130} h={28} label="pk (X25519)" color="#6366f1" outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={150} y={95} w={180} h={42}
                label="key_manager().get_private_key()" color="#10b981" />
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                LongTermKey IPC → KM enclave
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50}  y={100} w={120} h={28} label="km.secret" color="#10b981" outlined />
              <DataBox x={310} y={100} w={120} h={28} label="client.pk"  color="#3b82f6" outlined />
              <ActionBox x={195} y={98} w={90} h={32} label="ECDH" color="#3b82f6" />
              <DataBox x={170} y={140} w={140} h={28} label="shared secret" color="#3b82f6" outlined />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50}  y={100} w={130} h={28} label="ciphertext" color="#f59e0b" outlined />
              <ActionBox x={195} y={98} w={90}  h={32} label="decrypt" color="#f59e0b" />
              <DataBox x={300} y={100} w={150} h={28} label="plaintext calldata" color="#10b981" outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                EVM 이 평문 calldata 로 실행
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50}  y={100} w={120} h={28} label="result" color="#10b981" outlined />
              <ActionBox x={185} y={98} w={110} h={32} label="encrypt" color="#a855f7" />
              <DataBox x={310} y={100} w={140} h={28} label="encrypted result" color="#a855f7" outlined />
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                receipt.returnData = 암호문, storage slot 별도 키로 암호화
              </text>
            </motion.g>
          )}

          <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            runtime-sdk/modules/evm/src/raw_tx.rs — process_tx
          </text>
        </svg>
      )}
    </StepViz>
  );
}
